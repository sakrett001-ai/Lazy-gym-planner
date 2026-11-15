'use strict';
/* 4.106 «Колени, спина, сердце» (план qa-plan-4.105.md; отчёты Елены, Михаила, Игоря, Mike, Артёма): вопрос о здоровье,
   оговорки о дыхании, шкала после перерыва, «Пропустить → больно», пометки атласа, дорожка шагом, пустой план с причиной,
   «Бережно» без процента от максимума и без тяжёлой штанги на спину. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S, EX, EXI, GOALS, HEAVY_SPINE, buildPlan, prescribe, effEquip, ensurePlaces, PLACE_DEFAULTS, ensureCustoms, ensureProtect, ensurePain, ensureHealth, ensureDur,
  firstRunApply, breathCaveat, headDown, healthOk, healthHtml, gentleHtml, fitsBody, unfitWhy, painMark, painFlush, painReturn, painDayHtml, layoffPct, layoffInfo, layoffCheck,
  LAYOFF_STEPS, suggest, previewItem, stressLead, cpPickHtml, galleryUnfit, emptyBodyGroups, treadmillWalk, LEGEND, DOCTOR_LINE, HEART_STOP, todayKey, LOG})`);
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: ['chest', 'back', 'shoulders', 'quads', 'hams', 'glutes', 'abs'], seed: 7,
    fav: [], customs: [], custom: null, gen: null, protect: [], health: [], pain: null, days: 3, week: 1, day: 0, focus: null, dur: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensurePain(a.S); a.ensureHealth(a.S); a.ensureDur(a.S);
  m.get('AR.light = false; AR.dismissed = {}; swaps = S.swaps = {};');
}
const dayAgo = n => { const d = new Date(Date.now() - n * 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

test('health question (PAR-Q+): any «yes» — gentle goal and a calm box with breathing, pulse and stop signals; answers stay in settings', () => {
  reset();
  a.firstRunApply({ place: 'gym', goal: 'mass', level: 'mid', health: ['heart', 'nose'] }, a.S);
  assert.equal(a.S.goal, 'gentle', 'a «yes» switches to «Easy»');
  assert.deepEqual(plain(a.S.health), ['heart'], 'unknown answers dropped');
  const box = a.healthHtml();
  assert.match(box, /посоветуйтесь с врачом/); assert.match(box, /не задерживайте дыхание/); assert.match(box, /бета-блокаторы/); assert.match(box, /боль или давление в груди/);
  assert(!/диагноз|запрещено|опасно/i.test(box), 'no diagnoses, no scaring');
  reset(); a.firstRunApply({ place: 'gym', goal: 'mass', level: 'mid' }, a.S);
  assert.equal(a.S.goal, 'mass', 'skipped health question — the chosen goal stays'); assert.equal(a.healthHtml(), '');
  assert.deepEqual(plain(m.get('backupObject()')).settings.health, [], 'health answers live in settings (and the backup), nowhere else');
});

test('breathing caveat: heavy basics, breath-hold advice, overhead presses and head-down exercises — one wording', () => {
  for (const id of ['bbbench', 'squat', 'deadlift', 'ohp', 'dbpress', 'kbpress', 'pikepush', 'declinepike', 'declinebb', 'declinepush', 'declinecrunch', 'hyper'])
    assert.match(a.breathCaveat(a.EXI[id]), /^При повышенном давлении, болезнях сердца, глаукоме и при беременности не задерживайте дыхание: выдыхайте на усилии\./, id);
  for (const id of ['declinepike', 'declinebb', 'declinepush', 'declinecrunch', 'pikepush', 'hyper']) { assert(a.headDown(a.EXI[id]), id + ': head below heart'); assert.match(a.breathCaveat(a.EXI[id]), /вниз головой/, id); }
  for (const id of ['dbcurl', 'plank', 'latraise', 'bandrow', 'glutebridge1', 'deadbug']) assert.equal(a.breathCaveat(a.EXI[id]), '', id + ': no caveat');
  for (const id of ['bridge', 'glutebridge1', 'legcurl', 'deadbug', 'pushup']) assert(!a.headDown(a.EXI[id]), id + ': not head-down');
  /* давление или сердце, боль в груди, головокружения, беременность — без упражнений вниз головой в подборе */
  for (const h of ['heart', 'chest', 'dizzy', 'pregnant']) {
    reset({ health: [h], groups: ['shoulders', 'chest', 'abs'], level: 'adv' }); a.S.place = 'home'; a.ensurePlaces(a.S);
    assert(!a.healthOk(a.EXI.declinepike) && /вниз головой/.test(a.unfitWhy(a.EXI.declinepike)), h);
    for (const seed of [1, 7, 23]) { a.S.seed = seed; for (const it of a.buildPlan().items || []) assert(!a.headDown(it.ex), `${h} ${seed}: ${it.ex.id}`); }
  }
  reset({ health: ['surgery'] }); assert(a.healthOk(a.EXI.declinepike), 'surgery alone does not ban head-down');
});

test('after a break: one stepped number everywhere — plan box, card hint, warm-up weight; 14 and 200 days differ', () => {
  assert.deepEqual([13, 14, 27, 28, 83, 84, 167, 168, 400].map(a.layoffPct), [0, 10, 10, 15, 15, 20, 20, 30, 30]);
  for (const [gap, pct] of [[16, 10], [40, 15], [100, 20], [200, 30]]) {
    reset({ goal: 'mass' });
    a.LOG.data = { legpress: [{ d: dayAgo(gap), s: [[60, 10], [60, 10], [60, 10]] }] };
    const L = a.layoffInfo(); assert.equal(L.pct, pct, `${gap} days`);
    const box = a.layoffCheck().text, it = { ...a.previewItem('legpress'), eqIds: ['legpress'] }, sg = a.suggest(it);
    assert.match(box, new RegExp(`на ${pct}% ниже прежних`), box);
    /* округление — до блина 2,5 кг: число на экране в пределах 1,25 кг от процента шкалы */
    assert.equal(sg.tone, 'deload'); assert(sg.kg < 60 && Math.abs(sg.kg - 60 * (1 - pct / 100)) <= 1.25, `${gap} days: ${sg.kg} kg`);
    assert.match(sg.text, new RegExp(`примерно на ${pct}% меньше`), sg.text);
    assert.equal(m.get('workWeightOf')(it, null), sg.kg, 'warm-up builds up to the same weight');
    if (gap >= 168) assert.match(box, /подберите его заново/);
  }
  reset(); a.LOG.data = { legpress: [{ d: dayAgo(3), s: [[60, 10]] }] };
  assert.equal(a.layoffInfo(), null, 'no break — no reduction');
  a.LOG.data = {};
});

test('skip → «hurts»: the exercise leaves the plan only after the workout closes, is marked in the log, comes back on request', () => {
  reset({ groups: ['quads', 'glutes', 'hams'], place: 'home' });
  const before = a.buildPlan().items.map(it => it.ex.id), id = before[0], d = a.todayKey();
  a.painMark(id, 'removed', d, null, true);
  assert.deepEqual(a.buildPlan().items.map(it => it.ex.id), before, 'mid-workout the plan does not reshuffle');
  assert.match(a.painDayHtml(d), /Больно:/); assert.match(a.painDayHtml(d), /убрано из плана/);
  a.painFlush();
  assert(!a.buildPlan().items.some(it => it.ex.id === id), 'after the workout it is not picked again');
  assert.equal(a.unfitWhy(a.EXI[id]), 'вы отметили «больно»');
  a.painReturn(id); assert(a.fitsBody(a.EXI[id]), 'brought back from settings');
  a.painMark('crunch', 'swapped', d, 'plank'); assert.match(a.painDayHtml(d), /заменено на/);
  assert.deepEqual(plain(a.ensurePain({ pain: { off: ['crunch', 'nope', 5], log: [{ d: 'x', id: 'crunch', how: 'removed' }, { d, id: 'plank', how: 'eaten' }], pend: 'bad' } })), { off: ['crunch'], log: [], pend: [] }, 'garbage is cleaned');
});

test('atlas: protected joints — «loads the knees» on tiles, a warning before «+ To my plan», «a reminder, not a ban» only without marks', () => {
  reset();
  assert.equal(a.galleryUnfit(a.EXI.sissysquat), '');
  assert.match(a.stressLead(a.EXI.sissysquat), /напоминание держать технику, а не запрет/);
  assert(!/cp-pick-warn/.test(a.cpPickHtml('sissysquat', 'x')), 'no warning without marks');
  reset({ protect: ['knees'] });
  assert.match(a.galleryUnfit(a.EXI.sissysquat), /нагружает колени — в плане будет замена/);
  assert.match(a.cpPickHtml('bandlegext', 'x'), /cp-pick-warn[^>]*>Нагружает колени: в своём плане его заменит похожее/);
  assert(!/а не запрет/.test(a.stressLead(a.EXI.sissysquat)) && /Вы бережёте колени/.test(a.stressLead(a.EXI.sissysquat)));
  assert.match(a.stressLead(a.EXI.dbcurl), /То, что вы бережёте \(колени\), здесь пиково не нагружено/);
});

test('treadmill: walking without running when the knees or a herniated disc are protected', () => {
  const E = () => a.effEquip(a.S.equip);
  reset(); assert(!/без бега/.test(a.prescribe(a.EXI.treadmill, null, E()).load));
  for (const protect of [['knees'], ['kneeOp'], ['disc']]) { reset({ protect }); assert.match(a.prescribe(a.EXI.treadmill, null, E()).load, /быстрым шагом, без бега/, protect[0]); }
  reset({ protect: ['lumbar'] }); assert(!/без бега/.test(a.prescribe(a.EXI.treadmill, null, E()).load), 'lower back alone: the treadmill as usual');
  reset({ protect: ['knees'] }); assert(!a.treadmillWalk(a.EXI.bike) && !a.treadmillWalk(a.EXI.stairs), 'no flight phase — not a run');
});

test('«Easy»: no barbell on the spine, load in words, honest basis, cardiac stop signals; the doctor line under every plan', () => {
  for (const id of a.HEAVY_SPINE) { reset({ goal: 'gentle' }); assert(!a.fitsBody(a.EXI[id]), id); assert.match(a.unfitWhy(a.EXI[id]), /штанга|сложный/, id); }
  reset({ goal: 'gentle' });
  assert(!/%/.test(a.GOALS.gentle.load.c) && /после травмы или операции — сначала к врачу/i.test(a.GOALS.gentle.about));
  const box = a.gentleHtml();
  assert.match(box, /Остановитесь и обратитесь к врачу, если появились боль или давление в груди/);
  assert.match(box, /ахилловом сухожилии/); assert.match(box, /здоровых взрослых/);
  assert(!/40–60/.test(box + a.prescribe(a.EXI.dbbench, null, a.effEquip(a.S.equip)).load), 'no percent of a one-rep max');
  assert(a.LEGEND.includes(a.DOCTOR_LINE), 'the legend under every plan says it');
  /* Mike п. 8: «Бережно» + колени — штанговая становая первой */
  for (const level of ['beg', 'mid', 'adv']) for (const seed of [1, 7, 23, 51]) {
    reset({ goal: 'gentle', protect: ['knees'], level, seed });
    const p = a.buildPlan(); assert(!p.items.some(it => a.HEAVY_SPINE.has(it.ex.id)), `${level} ${seed}: ${p.items.map(it => it.ex.id)}`);
  }
});

test('empty plan names the real reason: gentle mode and protected joints, not the equipment', () => {
  reset({ goal: 'gentle', protect: ['knees', 'lumbar'], groups: ['hams'], place: 'home' });
  const p = a.buildPlan();
  if (!p.items) assert.deepEqual(plain(a.emptyBodyGroups()), ['hams']);
  reset({ groups: ['hams'], place: 'street' });
  assert.equal(a.emptyBodyGroups(), null, 'no protection — not a body reason');
});
