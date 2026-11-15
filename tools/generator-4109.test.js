'use strict';
/* Генератор, вторая ступень (4.109; отчёты тестеров 4.105.0 — Игорь, тренер-методист; Руслан, Mike, Елена, Галина, Артём;
   старые — Марина, Ольга, Виктор). Неделя: виды движения, тяжёлые по Прилепину, потолок подходов за тренировку и за неделю.
   Пары и дозировка, цикл, «Заменить» и «Другой вариант», новичок и отдых, подручные предметы. Замер «было → стало» по сетке —
   g109-work/scripts/grid.js (в материалах ревью). */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; renderPlan=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S, buildPlan, buildProgram, prescribe, ensurePlaces, PLACE_DEFAULTS, GROUP_PRESETS, ensureCustoms, ensureProtect, ensureDur, EXI, EX, PATTERN,
  schemeOf, sideOf, KINDS, KIND_TEST, sessionCap, pctNums, pctStr, prilepinSets, WEEKS, GOALS, effEquip, fitsBody, equipLine, weekSync, weekPick, swapOptions,
  analogNote, loadKind, begDaysHtml, kindsHtml, gentleHtml, blocksHtml, rerollPlan, rerollBack, rerollText, restTodayGroups, suggest, DAY_T, volScale, durationWarn,
  ECC, warnHtml, PROG_CHAIN})`);
const P = id => a.GROUP_PRESETS.find(p => p.id === id).g.slice();
const FULL = P('full'), UPPER = P('upper'), LEVELS = ['beg', 'mid', 'adv'], GOALS = ['strength', 'mass', 'cut', 'gentle'];
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.places.push({ id: 'none', name: 'Пусто', equip: [] });
  a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: FULL.slice(), seed: 7, fav: [], customs: [], custom: null,
    gen: null, protect: [], days: 3, split: null, week: 1, day: 0, focus: null, logPick: null, dur: null, weekFrom: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensureDur(a.S);
  m.get('AR.light = false; swaps = S.swaps = {}; rerollMsg = null; LOG.data = {};');
}
const ids = p => p.items.map(it => it.ex.id);
const pctMid = load => { const x = String(load || '').match(/≈\s*(\d+)(?:–(\d+))?%/); return x ? (+x[1] + +(x[2] || x[1])) / 2 : 0; };
const repsHi = r => { const x = String(r).match(/(\d+)\D+(\d+)/); return x ? +x[2] : parseInt(r, 10) || 0; };
const SPLITS = [[2, 'full'], [3, 'full'], [3, 'ppl'], [4, 'ul'], [4, 'full'], [5, 'ppl'], [5, 'ul']];
/* недели зала по сетке: уровень × цель × сплит × время */
const gymWeeks = [];
for (const level of LEVELS) for (const goal of GOALS) for (const [days, split] of SPLITS) for (const dur of [null, 'mid']) {
  reset({ level, goal, mode: 'program', days, split, dur });
  gymWeeks.push({ tag: `${level} ${goal} ${days}×${split} ${dur || '-'}`, level, goal, days, pr: a.buildProgram() });
}

test('gym week: horizontal row, overhead press, bench press, squat or leg press, two-leg hinge — every kind is in the week (Igor 1–3, 13)', () => {
  for (const w of gymWeeks) {
    const all = w.pr.days.flatMap(d => (d.plan.items || []).map(it => it.ex));
    for (const k of Object.keys(a.KINDS)) assert(all.some(a.KIND_TEST[k]) || w.pr.kinds.off.some(o => o.k === k), `${w.tag}: no ${k} — ${all.map(ex => ex.id).join(' ')}`);
    assert.equal(w.pr.kinds.off.length, 0, `${w.tag}: no joints marked — nothing is off`);
  }
  /* было: «Масса», уже тренируюсь, зал, 3 дня — ни одной горизонтальной тяги и жима над головой за неделю */
  reset({ mode: 'program', days: 3, split: 'full', dur: 'long' });
  const pr = a.buildProgram();
  assert.deepEqual(plain([...pr.kinds.have].sort()), Object.keys(a.KINDS).sort());
  m.get('prog = buildProgram()');
  assert.match(a.kindsHtml(pr.kinds), /За неделю есть: горизонтальная тяга, жим над головой, жим лёжа, присед или жим ногами, наклон с прямой спиной\./);
});

test('a kind with no safe exercise under a joint mark is off — and the week says why; nothing forbidden comes back', () => {
  for (const protect of [['lumbar'], ['disc'], ['knees'], ['kneeOp'], ['shoulders']]) for (const goal of ['mass', 'gentle']) {
    reset({ mode: 'program', days: 4, split: 'ul', goal, protect });
    const pr = a.buildProgram();
    for (const d of pr.days) for (const it of d.plan.items || []) assert(a.fitsBody(it.ex), `${protect} ${goal}, ${d.name}: ${it.ex.id} is not allowed`);
    for (const o of pr.kinds.off) assert(o.why, `${protect}: ${o.k} has a reason`);
    const html = a.kindsHtml(pr.kinds);
    for (const o of pr.kinds.off) assert(html.includes('не подбирается: ' + o.why), `${protect}: the reason is shown — ${html}`);
  }
  reset({ mode: 'program', days: 4, split: 'ul', protect: ['shoulders'] });
  assert(a.buildProgram().kinds.off.some(o => o.k === 'vpush'), 'shoulders marked: no overhead press, said so');
});

test('at most two heavy lifts (≥80% of max) per workout; heavy sets stay within Prilepin’s table (Igor 5, 17; Marina 13)', () => {
  let heavy = 0;
  const check = (p, tag) => {
    if (!p.items) return;
    const h = p.items.filter(it => pctMid(it.rx.load) >= 80);
    assert(h.length <= 2, `${tag}: ${h.map(it => it.ex.id)}`);
    for (const it of h) { heavy++; assert(it.rx.sets * repsHi(it.rx.reps) <= 20, `${tag}: ${it.ex.id} ${it.rx.sets}×${it.rx.reps}`); }
  };
  for (const level of LEVELS) for (const format of ['classic', 'superset']) for (const gn of ['full', 'upper', 'push', 'legs']) for (const dur of [null, 'long']) {
    reset({ goal: 'strength', level, format, groups: P(gn), dur });
    check(a.buildPlan(), `${level} ${format} ${gn} ${dur}`);
  }
  for (const w of gymWeeks) if (w.goal === 'strength') for (const week of [1, 2, 3]) {
    reset({ level: w.level, goal: 'strength', mode: 'program', days: w.days, split: w.tag.split(' ')[2].split('×')[1], week });
    for (const d of a.buildProgram().days) check(d.plan, `${w.tag} week ${week}, ${d.name}`);
  }
  assert(heavy > 200, 'heavy lifts checked: ' + heavy);
  /* было: «Сила», опытный, «Жим» — жим на наклонной, узким и стоя, все 6×3–5 при 80–90% */
  reset({ goal: 'strength', level: 'adv', groups: P('push') });
  const p = a.buildPlan(), h = p.items.filter(it => pctMid(it.rx.load) >= 80);
  assert(h.length === 2 && h.every(it => it.rx.sets <= 4), plain(p.items.map(it => `${it.ex.id} ${it.rx.sets}×${it.rx.reps} ${it.rx.load}`)).join(' | '));
  assert(p.items.some(it => it.rx.assist && it.rx.reps === '6–8' && pctMid(it.rx.load) < 80), 'the third heavy press is an assistance lift');
  /* разведения и пуловер в «Силе» — 10–12 умеренным весом */
  for (const it of p.items) if (['fly', 'pullover', 'raise'].includes(a.PATTERN[it.ex.id]) && it.ex.type === 'i') assert(it.rx.reps === '10–12' && /^умеренный вес/.test(it.rx.load), it.ex.id);
  assert.deepEqual(plain([a.prilepinSets('3–5', [81, 88]), a.prilepinSets('3–5', [79, 83]), a.prilepinSets('6–10', [71, 81])]), [4, 4, null]);
});

test('percent of max comes from the reps and the reserve (Epley), also in a circuit (Ruslan 14, Igor 9)', () => {
  const E = a.effEquip(a.PLACE_DEFAULTS[0].equip);
  for (const goal of ['strength', 'mass', 'cut']) for (const level of LEVELS) for (const w of [null, 0, 1, 2]) {
    reset({ goal, level });
    const week = w === null ? null : a.WEEKS[w], r = a.prescribe(a.EXI.squat, week, E);
    assert(r.load.includes(a.pctStr(a.pctNums(r.reps, r.rir))), `${goal} ${level} week ${w}: ${r.reps} · ${r.load}`);
  }
  reset({ goal: 'strength', level: 'mid', mode: 'program', week: 1 });
  assert.match(a.prescribe(a.EXI.squat, a.WEEKS[0], E).load, /≈ 79–83%/, 'Intro: 3–5 reps with 3 in reserve ≈79–83%, not 75–80%');
  reset({ goal: 'strength', level: 'adv', format: 'circuit' });
  for (const it of a.buildPlan().items) if (/от максимума/.test(it.rx.load)) assert(pctMid(it.rx.load) < 80 && it.rx.load.includes(a.pctStr(a.pctNums(it.rx.reps, it.rx.rir))), `${it.ex.id}: ${it.rx.reps} · ${it.rx.load}`);
});

test('sets per muscle group per workout: 11, beginners and «Gentle» 6, static-dynamic — one exercise per group (Igor 4, 6, 14)', () => {
  let n = 0, over = 0;
  for (const place of ['gym', 'home']) for (const level of LEVELS) for (const goal of GOALS) for (const format of ['classic', 'superset', 'static'])
    for (const gn of ['full', 'upper', 'legs', 'pull', 'push']) for (const dur of [null, 'long']) {
      reset({ place, level, goal, format, groups: P(gn), dur });
      const p = a.buildPlan(); if (!p.items) continue; n++;
      if (format === 'static') { const g = p.items.map(it => it.ex.g); assert.equal(new Set(g).size, g.length, `${place} ${level} ${goal} static ${gn}: ${ids(p)}`); continue; }
      const cap = a.sessionCap(), worst = Math.max(...Object.entries(p.gvol).filter(([g]) => g !== 'cardio').map(([, v]) => v));
      if (worst > cap) over++;
      assert(worst <= cap + 2, `${place} ${level} ${goal} ${format} ${gn} ${dur}: ${JSON.stringify(plain(p.gvol))}`);
    }
  /* выше потолка — только на полподхода-два вспомогательной работы, когда все упражнения уже на двух подходах */
  assert(over / n < 0.08, `${over} of ${n} workouts slightly above the cap`);
  /* было: статодинамика «грудь + трицепс» — 54 подхода, грудным 45 */
  reset({ goal: 'mass', level: 'adv', format: 'static', groups: ['chest', 'triceps'] });
  const p = a.buildPlan();
  assert(p.items.length === 2 && p.totalSets <= 18 && p.capped, `${ids(p)}: ${p.totalSets} sets`);
  m.get('plan = buildPlan()');
  assert.match(a.warnHtml(p), /в статодинамике — одно упражнение на группу мышц/);
  /* было: новичку «ноги», 60+ — 22 подхода, ягодичные 16 */
  reset({ goal: 'mass', level: 'beg', groups: P('legs'), dur: 'long' });
  const q = a.buildPlan();
  assert(Object.entries(q.gvol).every(([g, v]) => g === 'cardio' || v <= 6.5), JSON.stringify(plain(q.gvol)));
});

test('a week stays below «high» on the app’s own scale; experienced, 5 days — not «high» (Marina 10)', () => {
  let n = 0;
  for (const w of gymWeeks) {
    /* новичку и в «Бережно» на 4–5 днях шкала 4–12 недостижима (по 2 подхода на упражнение) — для них предупреждение
       «обычно хватает 2–3 тренировок» (begDaysHtml) */
    if ((w.level === 'beg' || w.goal === 'gentle') && w.days > 3) continue;
    const sc = (() => { reset({ level: w.level, goal: w.goal }); return a.volScale(); })();
    for (const [g, v] of Object.entries(w.pr.gvol)) if (g !== 'cardio') { n++; assert(Math.round(v * 2) / 2 <= sc.hi + 1, `${w.tag}: ${g} ${v}`); }
  }
  for (const split of ['ppl', 'ul']) {
    reset({ level: 'adv', mode: 'program', days: 5, split, dur: 'long' });
    const pr = a.buildProgram(), hi = Object.entries(pr.gvol).filter(([g, v]) => g !== 'cardio' && Math.round(v * 2) / 2 > 20);
    assert.deepEqual(plain(hi), [], `advanced, 5 days ${split}`);
  }
  assert(n > 600, 'group-weeks checked: ' + n);
});

test('supersets: never one movement twice; in a workout with more than legs — no «leg + leg» (Igor 6)', () => {
  let pairs = 0;
  for (const place of ['gym', 'home', 'none']) for (const level of LEVELS) for (const goal of GOALS) for (const gn of ['full', 'upper', 'pull', 'push']) for (const dur of [null, 'mid']) {
    reset({ place, level, goal, format: 'superset', groups: P(gn), dur });
    const p = a.buildPlan(); if (!p.items) continue;
    const legOf = ex => ['quads', 'glutes', 'hams', 'calves'].includes(ex.g) || ['squat', 'hinge', 'lunge', 'bridge'].includes(a.PATTERN[ex.id]);
    /* «нога + нога» — только когда упражнений на ноги больше, чем остальных; одно движение — только когда иначе не развести */
    const legs = p.items.filter(it => legOf(it.ex)).length, pats = {};
    for (const it of p.items) { const k = a.PATTERN[it.ex.id]; if (k) pats[k] = (pats[k] || 0) + 1; }
    const forced = Object.values(pats).some(v => v > Math.ceil(p.items.length / 2));
    for (const b of p.blocks) if (b.items.length === 2) {
      pairs++;
      const [x, y] = b.items.map(it => it.ex);
      if (!forced) assert(!a.PATTERN[x.id] || a.PATTERN[x.id] !== a.PATTERN[y.id], `${place} ${level} ${goal} ${gn}: ${x.id} + ${y.id}`);
      if (gn === 'full' && legs * 2 <= p.items.length) assert(!(legOf(x) && legOf(y)), `${place} ${level} ${goal} full: ${x.id} + ${y.id} — ${ids(p)}`);
    }
  }
  assert(pairs > 200, 'pairs checked: ' + pairs);
});

test('own plan in supersets: each exercise keeps its own sets (Ruslan 6)', () => {
  reset({ format: 'superset', customs: [{ id: 'c1', name: 'Мой', items: [{ id: 'bbbench', sets: 4, reps: '8/5/3/1' }, { id: 'dbrow', sets: 5 }, { id: 'squat', sets: 3 }, { id: 'pullup', sets: 3 }] }], custom: 'c1' });
  a.S.mode = 'custom'; a.ensureCustoms(a.S);
  const p = a.buildPlan(), by = id => p.items.find(it => it.ex.id === id).rx;
  assert.equal(by('bbbench').sets, 4); assert.equal(by('dbrow').sets, 5);
  assert.equal(p.blocks[0].sets, 5, 'the pair runs 5 rounds, the press is done after 4');
  assert.equal(p.totalSets, 4 + 5 + 3 + 3);
  const q = plain(m.get('workoutQueue(buildPlan())').filter(s => s.phase.startsWith('Суперсет A')).map(s => s.it.ex.id));
  assert.equal(q.filter(id => id === 'bbbench').length, 4); assert.equal(q.filter(id => id === 'dbrow').length, 5);
});

test('dosing by type: Nordic curls few reps; «Gentle» static-dynamic — the header and the cards say the same (Igor 7, 8)', () => {
  const E = a.effEquip([]);
  for (const goal of GOALS) for (const level of ['mid', 'adv']) {
    reset({ goal, level });
    const r = a.prescribe(a.EXI.nordic, null, E);
    assert(r.reps === '4–6' && r.sets <= 3 && r.rest >= 120 && !r.tempo && !/от максимума/.test(r.load), `${goal} ${level}: ${r.sets}×${r.reps} ${r.load}`);
  }
  reset({ goal: 'cut', level: 'adv', format: 'superset', place: 'none', groups: P('legs'), dur: 'long' });
  for (const it of a.buildPlan().items) if (it.ex.id === 'nordic') assert.equal(it.rx.reps, '4–6');
  reset({ goal: 'gentle', level: 'mid', format: 'static', groups: P('legs'), protect: ['lumbar'] });
  const p = a.buildPlan();
  assert(p.items.length > 0);
  for (const it of p.items) assert(it.rx.series === 1 && it.rx.sets === 3 && !/сильно горит/.test(it.rx.load) && !/от максимума/.test(it.rx.load), `${it.ex.id}: ${it.rx.series} · ${it.rx.load}`);
  const head = a.gentleHtml(), text = a.blocksHtml(p);
  assert.match(head, /одна серия из трёх подходов по 5–7 медленных повторов/); assert.doesNotMatch(head, /12–15 повторов/);
  assert.doesNotMatch(text.match(/<p class="phase phase-static">[\s\S]*?<\/p>/)[0], /сильно горит/);
});

test('full body from 3 exercises: legs, a press and a pull — at home with nothing too (Igor 10)', () => {
  for (const place of ['gym', 'home', 'none', 'street', 'homeband']) for (const level of LEVELS) for (const goal of GOALS) for (const dur of [null, 'short', 'mid']) {
    reset({ place, level, goal, dur, count: 3 });
    const p = a.buildPlan(); if (!p.items || p.items.length < 3) continue;
    const has = s => p.items.some(it => a.KIND_TEST[s](it.ex));
    assert(has('leg') && has('push') && has('pull'), `${place} ${level} ${goal} ${dur}: ${ids(p)}`);
  }
});

test('cycle: week 2 adds a set (also in «Strength»), deload has about 40% fewer sets than week 1 (Igor 11, 18)', () => {
  for (const w of gymWeeks) {
    const split = w.tag.split(' ')[2].split('×')[1], dur = w.tag.endsWith('mid') ? 'mid' : null, tot = [];
    for (const week of [1, 2, 4]) { reset({ level: w.level, goal: w.goal, mode: 'program', days: w.days, split, dur, week }); tot.push(a.buildProgram().sets); }
    assert(tot[1] > tot[0], `${w.tag}: week 2 ${tot[1]} vs week 1 ${tot[0]}`);
    assert(tot[2] / tot[0] >= 0.5 && tot[2] / tot[0] <= 0.72, `${w.tag}: deload ${tot[2]} of ${tot[0]}`);
  }
  assert.match(a.WEEKS[3].note, /на 40% меньше, чем в первую неделю/);
});

test('the cycle week moves on by itself every Monday; picked by hand — counting starts from it (Ruslan 15)', () => {
  reset({ mode: 'program', week: 2 });
  assert.equal(a.weekSync('2026-11-18'), false, 'old settings: the open week is this week');
  assert.equal(a.S.weekFrom, '2026-11-09');
  assert.equal(a.weekSync('2026-11-23'), true); assert.equal(a.S.week, 3);
  a.weekSync('2026-12-07'); assert.equal(a.S.week, 1, 'after the deload — Intro again');
  a.weekPick(4, '2026-12-09'); assert.equal(a.S.week, 4); assert.equal(a.weekSync('2026-12-13'), false);
  a.weekSync('2026-12-14'); assert.equal(a.S.week, 1);
});

test('«Intro» week advice does not ask for more than the logged max allows (Ruslan 11)', () => {
  reset({ mode: 'program', goal: 'strength', level: 'adv', week: 1, units: 'kg' });
  m.get('LOG.data = {squat:[{d:"2026-11-01", s:[[205,3],[205,3]]},{d:"2026-11-08", s:[[200,3],[200,3],[200,3]]}]}');
  m.get('var IT = {ex:EXI.squat, rx:prescribe(EXI.squat, WEEKS[0], effEquip(EQUIP.map(e => e.id))), eqIds:["bb"], slot:0}');
  const r = m.get('suggest(IT)');
  assert(r.kg < 200 && /^Неделя «Вход»: 185 кг/.test(r.text), r.text);
  a.S.mode = 'single'; m.get('IT.rx = prescribe(EXI.squat, null, effEquip(EQUIP.map(e => e.id)))');
  assert.match(m.get('suggest(IT).text'), /^Тот же вес — 200 кг/, 'outside the cycle — double progression as before');
  m.get('LOG.data = {}');
});

test('«Swap» changes one exercise, not the whole plan; the assisted machine is not first for «I already train»; notes are right (Igor 12, 15, 16, Mike 9)', () => {
  for (const goal of ['strength', 'mass']) for (const dur of ['short', 'mid', 'long']) {
    reset({ goal, dur });
    const p = a.buildPlan(), before = ids(p);
    m.get(`swaps = S.swaps = {s:{0:'goblet'}}`);
    const q = a.buildPlan(), after = ids(q);
    assert.equal(after.length, before.length, `${goal} ${dur}: ${before} → ${after}`);
    assert.equal(after.filter((id, i) => id !== before[i]).length <= 1, true, `${goal} ${dur}: ${before} → ${after}`);
  }
  reset({ groups: UPPER.slice(), dur: 'long' });
  m.get('plan = buildPlan()');
  for (const id of ['latpullv', 'closegrip', 'chinup', 'latpull']) {
    const first = m.get(`swapOptions(EXI.${id}, plan).close[0]`);
    if (first) assert(!first.ex.assist, `${id}: first swap ${first.ex.id}`);
  }
  assert.equal(a.loadKind(a.EXI.invrow, a.effEquip(a.PLACE_DEFAULTS[0].equip)), 'body');
  assert.doesNotMatch(a.analogNote(a.EXI.bbrow, a.EXI.invrow, a.effEquip(a.PLACE_DEFAULTS[0].equip)), /тренажёр/);
  assert.match(a.analogNote(a.EXI.bbrow, a.EXI.leverrowm, a.effEquip(a.PLACE_DEFAULTS[0].equip)), /тренажёр ведёт/);
});

test('«Another version» says when there is none, shows what changed and can undo (Elena 11, Galina 4, Viktor 22)', () => {
  /* дома без инвентаря, «ноги»: подбирается одно и то же — честно «других вариантов нет», план прежний */
  reset({ place: 'none', groups: P('legs'), level: 'beg', goal: 'gentle', protect: ['knees'] });
  const seed0 = a.S.seed, before = ids(a.buildPlan());
  const changed = a.rerollPlan();
  if (!changed) { assert.equal(a.S.seed, seed0); assert.match(a.rerollText(), /^Других вариантов нет/); assert.deepEqual(ids(a.buildPlan()), before); }
  /* зал: вариант меняется — что поменялось и «Вернуть» */
  reset();
  const p0 = ids(a.buildPlan()), s0 = a.S.seed;
  assert.equal(a.rerollPlan(), true);
  assert.match(a.rerollText(), /^Другой вариант: .+ → .+\./);
  assert.notDeepEqual(ids(a.buildPlan()), p0);
  assert.equal(a.rerollBack(), true);
  assert.equal(a.S.seed, s0); assert.deepEqual(ids(a.buildPlan()), p0);
  reset({ mode: 'program', days: 3, split: 'full' });
  assert.equal(a.rerollPlan(), true); assert.match(a.rerollText(), /^Другой вариант: /);
});

test('beginner: machines and simple lifts in the gym, a warning at 4–5 days, one push-up step for the whole week (Artyom 5, Igor 19, Marina 16)', () => {
  let hard = 0, n = 0;
  for (const goal of ['strength', 'mass', 'cut']) for (const gn of ['full', 'upper', 'legs']) for (const dur of [null, 'mid']) {
    reset({ level: 'beg', goal, groups: P(gn), dur });
    for (const it of a.buildPlan().items) { n++; if (/^kb/.test(it.ex.id) || it.ex.lvl >= 2) hard++; }
  }
  assert(hard / n < 0.1, `${hard} of ${n} beginner exercises are kettlebell or level 2`);
  /* было: «Зал / Масса / 45 мин / Новичок» — фронтальный присед с гирей, румынская на одной ноге с гирей, Т-гриф */
  reset({ level: 'beg', dur: 'mid' });
  assert(!ids(a.buildPlan()).some(id => ['kbfrontsquat', 'kbsllift', 'tbarrow'].includes(id)), ids(a.buildPlan()).join(' '));
  for (const days of [4, 5]) { reset({ level: 'beg', mode: 'program', days }); assert.match(a.begDaysHtml(), /Новичку обычно хватает 2–3 тренировок/); }
  reset({ goal: 'gentle', mode: 'program', days: 5 }); assert.match(a.begDaysHtml(), /В бережном режиме обычно хватает 2–3 тренировок/);
  reset({ level: 'beg', mode: 'program', days: 3 }); assert.equal(a.begDaysHtml(), '');
  reset({ level: 'mid', mode: 'program', days: 5 }); assert.equal(a.begDaysHtml(), '');
  const CHAIN = new Set(['wallpush', 'inclinepush', 'kneepush', 'pushup', 'diamond', 'archer', 'widepush']);
  for (const goal of GOALS) for (const [days, split] of SPLITS) for (const dur of [null, 'mid']) {
    reset({ level: 'beg', goal, place: 'home', mode: 'program', days, split, dur });
    const pu = new Set(a.buildProgram().days.flatMap(d => ids(d.plan)).filter(id => CHAIN.has(id)));
    assert(pu.size <= 1, `${goal} ${days}×${split} ${dur}: ${[...pu]}`);
  }
});

test('«Better to rest today» when the same muscles worked yesterday (Olga 11, Galina 22)', () => {
  reset({ groups: P('legs') });
  const p = a.buildPlan();
  const log = d => Object.fromEntries(p.items.map(it => [it.ex.id, [{ d, s: [[40, 10], [40, 10], [40, 10]] }]]));
  assert(a.restTodayGroups(p, log('2026-11-14'), '2026-11-15').length > 0, 'yesterday — rest today');
  assert.deepEqual(plain(a.restTodayGroups(p, log('2026-11-13'), '2026-11-15')), [], 'two days ago — no note');
  assert.deepEqual(plain(a.restTodayGroups(p, { ...log('2026-11-14'), legext: [{ d: '2026-11-15', s: [[40, 10], [40, 10], [40, 10]] }], legcurl: [{ d: '2026-11-15', s: [[30, 10], [30, 10]] }] }, '2026-11-15')), [], 'trained today — no note');
  reset({ groups: UPPER.slice() });
  assert.deepEqual(plain(a.restTodayGroups(a.buildPlan(), log('2026-11-14'), '2026-11-15')), [], 'other muscles yesterday — no note');
});

test('«No equipment» names the household items an exercise needs (Galina 20)', () => {
  const E = a.effEquip([]);
  assert.equal(a.equipLine(a.EXI.towelrow, E), 'Нужно: полотенце и закрытая дверь');
  assert.equal(a.equipLine(a.EXI.chairdip, E), 'Нужно: устойчивый стул');
  assert.equal(a.equipLine(a.EXI.pushup, E), 'Без снаряжения');
});
