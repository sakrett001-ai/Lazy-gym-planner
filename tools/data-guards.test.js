'use strict';
/* Защита данных журнала и подсказки по нему (замечания тестеров к 4.94.0):
   1) неправдоподобный вес («5000» вместо «50») не записывается молча — вопрос «Записать / Исправить» в строке подхода
      (13-log.js: kgDoubt, askKg, kgYes, kgFix; 14-workout-mode.js: workoutAsk);
   2) «Первая запись…» не висит после записанных сегодня подходов (todayNote, «прошлый раз: —» в тренировке);
   3) пирамида повторов своего плана «10/8/6/5» (11d-custom.js: cleanReps, customSetReps; planReps, parseRange);
   4) после пирамиды весов — совет по верхнему подходу, а не «верхний вес в каждом подходе» (pyramidAdvice);
   5) один запас повторов на карточке: строка нагрузки, подсказка первой записи, описание недели, плашка «Бережно»
      (11-planner.js: reserveOf);
   6) журнал: рабочий вес и повторы крупно, расчётный максимум мелко, прогресс по повторам при том же весе (journalVal).
   Нажатия, фокус, Esc и раскладка в браузере — tools/ui-check.mjs. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));

const ITEMS = [{ id: 'squat', sets: 4 }, { id: 'dbbench', sets: 3 }, { id: 'bbbench', sets: 4, reps: '10/8/6/5' }, { id: 'dbcurl', sets: 3 }, { id: 'pullup', sets: 3 }];
/* past — подходы вчерашней тренировки (или список записей [{d, s}] с днями назад), today — сегодняшние */
function app({ past = {}, today = {}, items = ITEMS, set = {} } = {}) {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; startRest=()=>{}; LOG.mode="local";');
  const a = m.get(`({S,LOG,AR,WEEKS,EXI,GOALS,buildPlan,logRows,logBlock,tickSet,editSet,renderLogBox,logKgInput,todaySession,suggest,kgDoubt,kgAsk,kgYes,kgFix,
    workoutFill,commitWorkout,workoutAskHide,workoutAskFix,cleanReps,cleanCustomItem,customSetReps,customOf,planReps,parseRange,rxHtml,planFileObject,readPlanFile,
    reserveOf,gentleHtml,journalVal,histHtml,histMetric,previewItem,workWeightOf,PLACE_DEFAULTS,ensurePlaces,ensureCustoms,openCustom})`);
  a.m = m;
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'custom', format: 'classic', goal: 'mass', level: 'mid', groups: ['chest', 'back'], fav: [], lr: {}, customs: [{ id: 't', name: 'Т', items: items.map(x => ({ ...x })) }], custom: 't' }, set);
  a.ensureCustoms(a.S); a.openCustom('t'); Object.assign(a.S, set);
  a.LOG.data = {};
  const day = n => a.m.get(`dayKey(new Date(Date.now() - ${n} * 864e5))`);
  a.day = day;
  for (const [id, s] of Object.entries(past)) a.LOG.data[id] = Array.isArray(s[0]) || s[0] === null ? [{ d: day(1), s }] : s.map(x => ({ d: day(x.ago), s: x.s }));
  for (const [id, s] of Object.entries(today)) a.todaySession(id, true).s = s;
  a.regen = () => { m.get('plan = buildPlan()'); a.plan = m.get('plan'); };
  a.regen();
  a.item = id => a.plan.items.find(x => x.ex.id === id);
  a.logged = id => { const s = a.todaySession(id, false); return s ? plain(s.s) : null; };
  return a;
}
/* таблица записи одного упражнения в отдельном документе (обработчики вызываются те же, что у событий) */
function mount(a, id) {
  const d = new JSDOM('<!doctype html><body></body>').window.document;
  d.body.innerHTML = `<article class="card" data-ex="${id}">${a.logBlock(a.item(id))}</article>`;
  const box = d.querySelector('.c-log');
  const field = (f, k) => box.querySelector(`.lt-r[data-k="${k}"] [data-f="${f}"]:not([data-side])`);
  return {
    d, box, kg: k => field('kg', k), reps: k => field('reps', k),
    type: (k, kg, reps) => { const i = field('kg', k); i.value = kg; a.logKgInput(i); if (reps != null) field('reps', k).value = reps; },
    tick: k => a.tickSet(box.querySelector(`[data-tick][data-k="${k}"]`)),
    ask: () => { const q = box.querySelector('.lt-kq'); return q ? { k: +q.closest('.lt-r').dataset.k, text: q.querySelector('.lt-cft').textContent, buttons: [...q.querySelectorAll('button')].map(b => b.textContent) } : null; },
    sug: () => box.querySelector('.sug span').textContent,
    phR: () => [...box.querySelectorAll('.lt-r [data-f="reps"]')].map(i => i.placeholder),
    phKg: () => [...box.querySelectorAll('.lt-r [data-f="kg"]')].map(i => i.placeholder),
  };
}
/* экран тренировки (разметка body.html) для одного подхода */
function workoutDoc(a) {
  const html = fs.readFileSync(path.join(__dirname, '../src/body.html'), 'utf8');
  const d = new JSDOM(`<!doctype html><html><body>${html}</body></html>`).window.document;
  a.m.get('(d => { globalThis.document = d; })')(d);
  return d;
}
function showStep(a, d, id, k) {
  const it = a.item(id), sg = a.suggest(it), s = { it, k, n: it.rx.sets, rest: 0 };
  a.m.get('(s => { workout = {queue:[s], index:0, drafts:{}, holdPair:null}; })')(s);
  d.querySelector('#wv-active').hidden = false;
  a.workoutFill(s, sg, sg.prev?.s[k]);
  return s;
}

/* ---------- 1. неправдоподобный вес ---------- */
test('2× last time or more (and at least 5 kg more) asks; without history — the implement’s limit', () => {
  const a = app({ past: { squat: [[52.5, 8], [52.5, 8]], dbbench: [[2, 12]] } });
  const doubt = (id, kg, k = 0) => a.kgDoubt(a.item(id), [kg], k);
  assert.equal(doubt('squat', 5000).text, 'Это намного больше, чем в прошлый раз (52,5\u00a0кг). Записать 5000\u00a0кг?');
  assert.equal(doubt('squat', 104), null, 'less than twice — no question');
  assert.ok(doubt('squat', 105), 'exactly twice — a question');
  assert.equal(doubt('dbbench', 4), null, '2 → 4 kg dumbbells: an ordinary step, not a typo');
  assert.ok(doubt('dbbench', 7), '2 → 7 kg: twice and 5 kg more');
  assert.equal(doubt('squat', 0), null); assert.equal(a.kgDoubt(a.item('squat'), [null], 0), null, 'no weight — nothing to ask');
  /* без прошлых тренировок — сегодняшние подходы, кроме этого */
  a.todaySession('bbbench', true).s = [[50, 10]];
  assert.equal(doubt('bbbench', 500, 1).text, 'Это намного больше, чем сегодня в других подходах (50\u00a0кг). Записать 500\u00a0кг?');
  assert.equal(doubt('bbbench', 500, 0), null, 'the set itself is not its own reference (bar limit 500 kg)');
  /* без истории: пределы по снаряду — с запасом над рекордами */
  a.LOG.data = {};
  const lim = (id, eq, kg) => a.kgDoubt({ ...a.previewItem(id), eqIds: eq }, [kg], 0);
  for (const [id, eq, max, word] of [['dbbench', ['db', 'bench'], 100, 'одной гантели'], ['kbswing', ['kb'], 100, 'одной гири'], ['bbbench', ['bb', 'bench'], 500, 'штанги'],
    ['legpress', ['legpress'], 1000, 'тренажёра'], ['latpull', ['cable'], 300, 'тренажёра'], ['pullup', ['bar'], 200, 'доп. веса'], ['assistpull', ['gravitron'], 150, 'противовеса']]) {
    assert.equal(lim(id, eq, max), null, `${id}: ${max} kg is still fine`);
    assert.equal(lim(id, eq, max + 0.5).text, `Для ${word} это необычно много. Записать ${String(max + 0.5).replace('.', ',')}\u00a0кг?`, id);
  }
  assert.equal(lim('bandrow', ['band'], 5000), null, 'nothing to weigh — never asks');
});

test('card: «5000» is not logged, the row asks «Записать / Исправить»; the answer decides', () => {
  const a = app({ past: { squat: [[52.5, 8], [52.5, 8], [52.5, 8], [52.5, 8]] } }), t = mount(a, 'squat');
  t.type(0, '5000', '8');
  assert.deepEqual(t.phKg().slice(1), ['52,5', '52,5', '52,5'], 'the doubtful «5000» is not carried to the next sets');
  assert.equal(a.workWeightOf(a.item('squat'), t.box.closest('.card')), 52.5, 'nor does the warm-up lead to it');
  t.tick(0);
  assert.equal(a.logged('squat'), null, 'nothing is logged, no empty day entry');
  assert.deepEqual(t.ask(), { k: 0, text: 'Это намного больше, чем в прошлый раз (52,5\u00a0кг). Записать 5000\u00a0кг?', buttons: ['Записать', 'Исправить'] });
  assert.match(t.box.querySelector('.lt-r[data-k="0"]').className, /lt-arm/, 'the row is highlighted, as when removing a set');
  assert.equal(t.d.activeElement?.dataset.kgfix, 'squat', 'focus on «Исправить»');
  a.renderLogBox(t.box, a.item('squat'));
  assert.equal(t.ask()?.k, 0, 'the question survives re-rendering'); assert.equal(t.kg(0).value, '5000', 'and so does the typed weight');
  /* «Исправить»: вопрос закрыт, фокус в поле веса */
  a.kgFix('squat', t.box);
  assert.equal(t.ask(), null); assert.equal(t.d.activeElement, t.kg(0));
  t.type(0, '50'); t.tick(0);
  assert.deepEqual(a.logged('squat'), [[50, 8]], 'the corrected weight is logged at once');
  /* правка веса закрывает вопрос */
  t.type(1, '5000', '8'); t.tick(1); assert.equal(t.ask()?.k, 1);
  t.type(1, '500'); assert.equal(t.ask(), null, 'typing in the weight closes the question');
  /* «Записать»: записывается как вписано */
  t.type(1, '5000'); t.tick(1); a.kgYes('squat', t.box);
  assert.deepEqual(a.logged('squat'), [[50, 8], [5000, 8]]); assert.equal(t.ask(), null);
  assert.equal(t.d.activeElement?.dataset.tick, 'squat', 'focus on the row’s tick');
});

test('card: editing a logged set to an implausible weight keeps the old record until «Записать»', () => {
  const a = app({ past: { squat: [[52.5, 8]] }, today: { squat: [[50, 8]] } }), t = mount(a, 'squat');
  t.kg(0).value = '5000'; a.editSet(t.kg(0));
  assert.deepEqual(a.logged('squat'), [[50, 8]], 'the record is unchanged');
  assert.equal(t.ask().text, 'Это намного больше, чем в прошлый раз (52,5\u00a0кг). Записать 5000\u00a0кг?');
  a.kgYes('squat', t.box);
  assert.deepEqual(a.logged('squat'), [[5000, 8]]);
  t.kg(0).value = '55'; a.editSet(t.kg(0));
  assert.deepEqual(a.logged('squat'), [[55, 8]], 'a plausible edit is saved at once');
  a.renderLogBox(t.box, a.item('squat'));
  t.kg(0).value = '5000'; a.editSet(t.kg(0)); a.renderLogBox(t.box, a.item('squat'));
  assert.equal(t.ask(), null, 'after re-rendering the field shows the record again — the edit question is gone');
});

test('workout screen: the same question under the fields, «Подход выполнен» waits', () => {
  const a = app({ past: { squat: [[52.5, 8]] } }), d = workoutDoc(a);
  showStep(a, d, 'squat', 0);
  d.querySelector('#wv-kg').value = '5000'; d.querySelector('#wv-reps').value = '8';
  a.commitWorkout(null);
  const ask = d.querySelector('#wv-kg-ask');
  assert.equal(ask.hidden, false); assert.equal(d.querySelector('#wv-done').hidden, true, 'one of the two answers, not «Подход выполнен»');
  assert.equal(d.querySelector('#wv-kg-ask-t').textContent, 'Это намного больше, чем в прошлый раз (52,5\u00a0кг). Записать 5000\u00a0кг?');
  assert.deepEqual([...ask.querySelectorAll('button')].map(b => b.textContent), ['Записать', 'Исправить']);
  assert.equal(d.activeElement.id, 'wv-kg-fix');
  assert.equal(a.logged('squat'), null, 'nothing logged');
  a.workoutAskFix();
  assert.equal(ask.hidden, true); assert.equal(d.querySelector('#wv-done').hidden, false); assert.equal(d.activeElement.id, 'wv-kg');
});

/* ---------- 2. «Первая запись» после записи ---------- */
test('no history, sets logged today: «Сегодня: 1 из 3…» instead of «Первая запись…», in the card at once', () => {
  const a = app(), t = mount(a, 'dbbench');
  assert.match(t.sug(), /^Первая запись\. Подберите вес/);
  t.type(0, '20', '10'); t.tick(0);
  assert.equal(t.sug(), 'Сегодня: 1 из 3. Следующий — с тем же весом (20 кг).', 'updated right after the tick');
  assert.equal(t.box.querySelector('.sug').className, 'sug sug-today');
  t.tick(0);
  assert.match(t.sug(), /^Первая запись/, 'unticked — first entry again');
  a.todaySession('dbbench', true).s = [[20, 10], [22, 8]];
  assert.equal(a.suggest(a.item('dbbench')).text, 'Сегодня: 2 из 3.', 'different weights — no «same weight» advice');
  a.todaySession('dbbench', true).s = [[20, 10], [20, 10], [20, 9]];
  assert.equal(a.suggest(a.item('dbbench')).text, 'Сегодня: 3 из 3. Упражнение выполнено — в следующий раз здесь будет подсказка по прогрессии.');
  assert(!a.logRows(a.item('dbbench')).html.includes('Первая запись'));
  /* с историей подсказка прежняя — по прошлой тренировке */
  const b = app({ past: { dbbench: [[20, 8], [20, 8], [20, 8]] }, today: { dbbench: [[20, 9]] } });
  assert.match(b.suggest(b.item('dbbench')).text, /^Тот же вес — 20 кг/);
});

/* ---------- 3. пирамида повторов ---------- */
test('reps per set «10/8/6/5»: parsed like the weight, kept, shown, and the pyramid sets the number of sets', () => {
  const a = app();
  for (const [v, want] of [['10/8/6/5', '10/8/6/5'], ['10 / 8 / 6 / 5', '10/8/6/5'], ['10, 8, 6, 5', '10/8/6/5'], ['12;10;8', '12/10/8'], ['8/8/8', '8'],
    ['8–12', '8–12'], ['8-12', '8–12'], ['10', '10'], ['12-8', null], ['10/0/6', null], ['10/8/x', null], ['1/2/3/4/5/6/7/8/9/10/11', null], ['', null]]) assert.equal(a.cleanReps(v), want, v);
  assert.equal(a.cleanCustomItem({ id: 'bbbench', reps: '10/8/6/5' }).reps, '10/8/6/5');
  const it = a.item('bbbench');
  assert.equal(it.rx.reps, '10/8/6/5'); assert.deepEqual(plain(a.parseRange(it.rx.reps)), [5, 10]);
  assert.deepEqual([0, 1, 2, 3, 4].map(k => a.planReps(it.rx, k)), ['10', '8', '6', '5', '5'], 'more sets than numbers — the last repeats');
  assert.match(a.rxHtml(it), /<span class="rx-big">4 × 10\/8\/6\/5 <small>повт\.<\/small>/);
  /* поле «Повторов»: пирамида задаёт число подходов; неверное не стирает прежнее */
  const slot = a.customOf().items.findIndex(x => x.id === 'dbbench');
  assert.equal(a.customSetReps(slot, '12 / 10 / 8 / 6 / 4'), true);
  assert.deepEqual(plain(a.customOf().items[slot]), { id: 'dbbench', sets: 5, reps: '12/10/8/6/4' });
  assert.equal(a.customSetReps(slot, '10/8/'), true, 'a trailing «/» is ignored');
  assert.equal(a.customOf().items[slot].sets, 2);
  assert.equal(a.customSetReps(slot, '8/x'), false); assert.equal(a.customOf().items[slot].reps, '10/8');
  assert.equal(a.customSetReps(slot, '8–12'), true); assert.equal(a.customOf().items[slot].sets, 2, 'a range keeps the number of sets');
});

test('reps pyramid in the log, the workout screen and the plan file', () => {
  const a = app(), t = mount(a, 'bbbench');
  assert.deepEqual(t.phR(), ['10', '8', '6', '5'], 'each set’s target in the card');
  assert.equal(t.sug(), 'Первая запись. Подберите вес, с которым 10 / 8 / 6 / 5 повторов получаются и остаются силы ещё на 1–2.');
  const d = workoutDoc(a);
  showStep(a, d, 'bbbench', 2);
  assert.equal(d.querySelector('#wv-reps').placeholder, 'цель 6', 'the workout hint is this set’s target, marked as a goal');
  showStep(a, d, 'dbbench', 0);
  assert.equal(d.querySelector('#wv-reps').placeholder, 'цель 6–10', 'a range is marked as a goal too — it no longer looks typed in');
  /* файл плана переносит пирамиду */
  const file = plain(a.planFileObject([a.customOf()]));
  const row = file.plans[0].items.find(x => x.id === 'bbbench');
  assert.deepEqual([row.sets, row.reps], [4, '10/8/6/5']);
  const back = a.readPlanFile(JSON.stringify(file));
  assert.equal(back.plans[0].items.find(x => x.id === 'bbbench').reps, '10/8/6/5');
  /* прогрессия по пирамиде повторов: каждый подход — к своей цели */
  const b = app({ past: { bbbench: [[60, 10], [60, 8], [60, 6], [60, 5]] } });
  assert.match(b.suggest(b.item('bbbench')).text, /^Прибавьте до 62,5 кг \(\+2,5\)\. В прошлый раз все подходы по плану: 60×10, 60×8, 60×6, 60×5\.$/);
  const c = app({ past: { bbbench: [[60, 9], [60, 8], [60, 6], [60, 4]] } }), sg = c.suggest(c.item('bbbench'));
  assert.equal(sg.text, 'Оставьте 60 кг и доберите до плана: 10 / 8 / 6 / 5. В прошлый раз: 60×9, 60×8, 60×6, 60×4.');
  assert.deepEqual(plain(sg.reps), [10, 8, 6, 5]);
  /* вес по плану и пирамида повторов */
  const p = app({ items: [{ id: 'bbbench', sets: 4, reps: '10/8/6/5', kg: [60, 80, 95, 105] }] });
  assert.equal(p.suggest(p.item('bbbench')).text, 'Вес по плану: 60 / 80 / 95 / 105 кг. Повторы по плану: 10 / 8 / 6 / 5.');
  assert.deepEqual(mount(p, 'bbbench').phR(), ['10', '8', '6', '5']);
});

/* ---------- 4. совет после пирамиды весов ---------- */
test('after a weight pyramid the advice is about the top set, not «the top weight in every set»', () => {
  const a = app({ past: { squat: [[60, 10], [80, 8], [90, 6], [100, 5]] } }), sg = a.suggest(a.item('squat'));
  assert.equal(sg.text, 'Верхний подход: 100 кг × 5 — в следующий раз доберите до 6. Остальные подходы — как в прошлый раз.');
  assert(!/в каждом подходе/.test(sg.text));
  assert.deepEqual(plain(sg.kgs), [60, 80, 90, 100]); assert.deepEqual(plain(sg.reps), [10, 8, 6, 6]);
  const t = mount(a, 'squat');
  assert.deepEqual(t.phKg(), ['60', '80', '90', '100'], 'the grey hints agree with the advice');
  assert.deepEqual(t.phR(), ['10', '8', '6', '6']);
  /* верхний подход на верхней границе — прибавка только в нём, подсказки и экран тренировки с ней согласны */
  const up = app({ past: { squat: [[60, 10], [80, 8], [90, 6], [100, 10]] } }), su = up.suggest(up.item('squat'));
  assert.equal(su.text, 'Верхний подход: 100 кг × 10 — на верхней границе. В следующий раз в нём 105 кг (+5). Остальные подходы — как в прошлый раз.');
  assert.deepEqual(mount(up, 'squat').phKg(), ['60', '80', '90', '105']);
  const d = workoutDoc(up); showStep(up, d, 'squat', 3);
  assert.equal(d.querySelector('#wv-kg').value, '105');
  /* несколько подходов с верхним весом */
  const two = app({ past: { squat: [[60, 10], [80, 8], [100, 7], [100, 8]] } });
  assert.equal(two.suggest(two.item('squat')).text, 'Подходы с 100 кг: 7, 8 — в следующий раз доберите до 8, 9. Остальные подходы — как в прошлый раз.');
  /* второй раз подряд верхний подход ниже границы — снизить его */
  const low = app({ past: { squat: [{ ago: 8, s: [[60, 10], [100, 4]] }, { ago: 1, s: [[60, 10], [80, 8], [100, 4]] }] } }), sl = low.suggest(low.item('squat'));
  assert.equal(sl.tone, 'down'); assert.deepEqual(plain(sl.kgs), [60, 80, 90]);
  assert.match(sl.text, /^Две тренировки подряд в верхнем подходе не хватило повторов — в следующий раз возьмите в нём 90 кг/);
  /* разгрузка цикла — все веса пирамиды легче */
  const dl = app({ past: { squat: [[60, 10], [80, 8], [90, 6], [100, 5]] }, set: { mode: 'program', week: 4 } }), sd = dl.suggest({ ...dl.previewItem('squat'), eqIds: ['bb', 'rack'] });
  assert.equal(sd.text, 'Разгрузка: веса на 15% меньше прошлых — 50 / 70 / 75 / 85 кг, не до предела.');
});

/* ---------- 5. один запас повторов ---------- */
test('one reserve number per card: load line, first-entry hint, week note and the «Бережно» box agree', () => {
  /* запас простыми словами (11-planner.js: reserveText): «оставляйте силы ещё на 1–2 повтора», «остаются силы ещё на 1–2» */
  const num = s => { const m = String(s).match(/силы ещё на (\d(?:–\d)?)(?![\d–])/); return m ? m[1] : null; };
  for (const goal of ['strength', 'mass', 'cut', 'gentle']) for (const level of ['beg', 'mid', 'adv']) for (const week of [0, 1, 2, 3, 4]) {
    const a = app({ set: { goal, level, mode: week ? 'program' : 'custom', week: week || 1 } });
    const it = { ...a.previewItem('squat'), eqIds: ['bb', 'rack'] }, iso = { ...a.previewItem('dbcurl'), eqIds: ['db'] };
    const load = num(it.rx.load), first = num(a.suggest(it).text), wk = week ? num(a.WEEKS[week - 1].note) : null;
    const where = `${goal}/${level}/week ${week}`;
    assert.equal(first, load, `${where}: first entry «${a.suggest(it).text}» vs load «${it.rx.load}»`);
    if (iso.rx.load.includes('силы ещё на')) assert.equal(num(a.suggest(iso).text), num(iso.rx.load), `${where}: isolation`);
    if (wk) assert.equal(wk, load, `${where}: week note «${a.WEEKS[week - 1].note}» vs load «${it.rx.load}»`);
    if (goal === 'gentle') { const g = a.gentleHtml().match(/лёгким весом, оставляя силы ещё на (\d(?:–\d)?) повтор|лёгким весом, не до предела/); assert(g && (g[1] || null) === load, `${where}: gentle box`); }
    if (load === null) assert.match(a.suggest(it).text, /(получаются чисто, а больше — уже нет|даются не до предела)\.$/, `${where}: no number — no reserve in the hint either`);
  }
  /* замечания тестеров: новичок в первую неделю — 4 везде; «Бережно» без цикла — 3–4, а не 2 */
  const marina = app({ set: { goal: 'mass', level: 'beg', mode: 'program', week: 1 } }), mi = { ...marina.previewItem('squat'), eqIds: ['bb', 'rack'] };
  assert.equal(num(mi.rx.load), '4'); assert.equal(num(marina.WEEKS[0].note), '4');
  const viktor = app({ set: { goal: 'gentle', level: 'beg' } }), vi = { ...viktor.previewItem('legpress'), eqIds: ['legpress'] };
  assert.match(vi.rx.load, /оставляйте силы ещё на 3–4 повтора, без боли/); assert.match(viktor.suggest(vi).text, /остаются силы ещё на 3–4\.$/);
  assert.equal(num(app({ set: { goal: 'mass', level: 'beg' } }).previewItem('squat').rx.load), '2–3', 'beginners: one more rep in reserve');
});

/* ---------- 6. журнал ---------- */
test('journal: working weight × best reps large, estimated 1RM small and labelled, reps progress at the same weight', () => {
  const a = app(), ex = a.EXI.dbcurl;
  const ss = [{ d: '2026-11-12', s: [[5, 12], [5, 12]] }, { d: '2026-11-14', s: [[5, 13], [5, 12]] }, { d: '2026-11-17', s: [[5, 15], [5, 14]] }];
  const html = a.journalVal(ex, ss);
  assert.match(html, /<span class="j-big"><span class="vh">Рабочий вес <\/span>5<small>кг<\/small> × 15<span class="vh"> повт\.<\/span><\/span>/);
  assert.match(html, /<small class="j-e1">расч\. максимум 7 кг<\/small>/, 'Epley is there, smaller, with a label');
  assert.match(html, /<em class="pos">\+3 повт\.<\/em>/); assert(!/%/.test(html), 'no «0 %» when reps grow');
  assert.match(a.journalVal(ex, [ss[0], { d: '2026-11-20', s: [[7, 8]] }]), /<em class="pos">\+2 кг<\/em>/, 'heavier — the weight change');
  assert.match(a.journalVal(ex, [{ d: '2026-11-20', s: [[7, 8]] }, ss[0]]), /<em class="neg">−2 кг<\/em>/);
  assert(!/<em/.test(a.journalVal(ex, [ss[0], ss[0]])), 'no change — no badge');
  assert(!/<em/.test(a.journalVal(ex, [ss[2]])), 'one entry — no badge');
  /* статодинамика в сводку не входит; упражнение без веса — как раньше */
  assert.match(a.journalVal(ex, [...ss, { d: '2026-11-19', s: [[3, 20]], fmt: 'static' }]), /5<small>кг<\/small> × 15/);
  assert.match(a.journalVal(a.EXI.pushup, [{ d: '2026-11-12', s: [[null, 10]] }, { d: '2026-11-14', s: [[null, 12]] }]), /12<small>повт\.<\/small><em class="pos">\+20%<\/em>/);
  /* график: один вес во всех записях — повторы с ним */
  assert.equal(a.histMetric(ex, ss).name, 'Повторы с 5 кг');
  assert.equal(a.histMetric(ex, [ss[0], { d: '2026-11-20', s: [[7, 8]] }]).name, 'Расчётный максимум');
  a.LOG.data = { dbcurl: ss };
  assert.match(a.histHtml(ex), /<p class="h-cap">Повторы с 5 кг · лучший 15<\/p>/);
});
