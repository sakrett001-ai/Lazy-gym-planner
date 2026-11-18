'use strict';
/* Файлы планов и сохранение: свои настройки у каждого плана, вес и заметки по плану, сохранение собранной тренировки
   и недели, выгрузка в JSON и загрузка обратно с проверкой. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S,EXI,GOALS,buildPlan,buildProgram,prescribe,effEquip,ensureCustoms,customOf,openCustom,switchModeSettings,storePlanSetting,
    savePlansFrom,planFileObject,readPlanFile,addPlans,suggest,planKg,PLACE_DEFAULTS,ensurePlaces,parseKgInput,planText,PLAN_FILE})`);
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 5, groups: ['chest', 'back', 'shoulders'], fav: [], customs: [], custom: null, gen: null, seed: 7 });
  a.ensureCustoms(a.S);
  a.m = m;
  a.setMode = mode => { const prev = a.S.mode; a.S.mode = mode; a.switchModeSettings(prev); };
  a.set = (k, v) => { a.S[k] = v; a.storePlanSetting(k); };
  return a;
}

test('each custom plan keeps its own goal, format and level; ordinary plans keep theirs', () => {
  const a = app();
  a.S.customs = [{ id: 'p1', name: 'Сила', goal: 'strength', format: 'superset', level: 'adv', items: [{ id: 'bbbench' }] },
    { id: 'p2', name: 'Рельеф', goal: 'cut', format: 'circuit', level: 'beg', items: [{ id: 'squat' }] }]; a.ensureCustoms(a.S);
  a.setMode('custom'); a.openCustom('p1');
  assert.deepEqual([a.S.goal, a.S.format, a.S.level], ['strength', 'superset', 'adv'], 'the plan brings its settings');
  a.set('level', 'mid');
  assert.equal(a.customOf().level, 'mid', 'switches in the panel edit the open plan');
  a.openCustom('p2');
  assert.deepEqual([a.S.goal, a.S.format, a.S.level], ['cut', 'circuit', 'beg']);
  a.setMode('single');
  assert.deepEqual([a.S.goal, a.S.format, a.S.level], ['mass', 'classic', 'mid'], 'ordinary plans get their own settings back');
  a.set('goal', 'strength'); a.setMode('custom');
  assert.equal(a.S.goal, 'cut', 'changing the ordinary goal does not touch the open custom plan');
  a.setMode('single'); assert.equal(a.S.goal, 'strength');
});

test('planned weight: one number or per set, shown as the target and filled into the log', () => {
  const a = app();
  assert.deepEqual(plain(a.parseKgInput('60 / 62,5 / 65')), [60, 62.5, 65]);
  assert.deepEqual(plain(a.parseKgInput('62,5')), [62.5]);
  assert.equal(a.parseKgInput('тяжело'), null);
  a.S.customs = [{ id: 'p1', name: 'A', items: [{ id: 'bbbench', sets: 4, kg: [60, 62.5, 65], note: 'Пауза на груди', tempo: '4-1-1-0' }] }]; a.ensureCustoms(a.S);
  a.setMode('custom'); a.openCustom('p1');
  const it = a.buildPlan().items[0];
  assert.deepEqual([0, 1, 2, 3].map(k => a.planKg(it.rx, k)), [60, 62.5, 65, 65], 'the last weight repeats for extra sets');
  assert.equal(it.rx.tempo, '4-1-1-0'); assert.equal(it.rx.coachNote, 'Пауза на груди');
  const sg = plain(a.suggest(it));
  assert.equal(sg.tone, 'plan'); assert.match(sg.text, /Вес по плану: 60 \/ 62,5 \/ 65 кг/);
  a.m.get('plan = buildPlan()');
  assert.match(a.planText(), /Жим штанги лёжа — 4 × .*, 60 \/ 62,5 \/ 65 кг/); assert.match(a.planText(), /Заметка: Пауза на груди/);
});

test('saving a generated workout freezes its exercises, order and dosage', () => {
  const a = app();
  Object.assign(a.S, { goal: 'strength', format: 'superset', level: 'adv' });
  const p = a.buildPlan(); a.m.get('plan = buildPlan()');
  const added = plain(a.savePlansFrom());
  assert.equal(added.length, 1);
  const c = added[0];
  assert.deepEqual([c.goal, c.format, c.level], ['strength', 'superset', 'adv']);
  assert.deepEqual(c.items.map(i => i.id), plain(p.blocks.flatMap(b => b.items).map(it => it.ex.id)), 'displayed order');
  a.S.goal = 'cut'; a.S.seed = 99;
  a.setMode('custom'); a.openCustom(c.id);
  const again = a.buildPlan();
  assert.deepEqual(plain(again.items.map(it => [it.ex.id, it.rx.sets, it.rx.reps])), plain(p.items.slice().sort((x, y) => c.items.findIndex(i => i.id === x.ex.id) - c.items.findIndex(i => i.id === y.ex.id)).map(it => [it.ex.id, it.rx.sets, it.rx.reps])), 'same exercises and dosage after settings change');
  assert.deepEqual(plain(again.blocks.map(b => b.items.map(it => it.ex.id))), plain(p.blocks.map(b => b.items.map(it => it.ex.id))), 'superset pairs survive');
});

test('saving a week makes one plan per day under a shared program name', () => {
  const a = app();
  a.setMode('program'); Object.assign(a.S, { days: 3, week: 2 });
  const prog = a.buildProgram(); a.m.get('prog = buildProgram()');
  const added = plain(a.savePlansFrom());
  assert.equal(added.length, prog.days.filter(d => d.plan.items).length);
  assert(added.every(c => c.group && c.group === added[0].group), 'one program');
  assert.match(added[0].group, /неделя 2/);
  assert.match(added[0].name, /^Пн · /);
  assert.equal(new Set(added.map(c => c.name)).size, added.length);
});

test('export writes explicit dosage as the owner sees it; import brings the same plan back as a new one', () => {
  const a = app();
  a.S.customs = [{ id: 'p1', name: 'Верх А', group: 'Сила', for: 'Сергей', note: 'Без отказа', goal: 'strength', format: 'classic', level: 'mid',
    items: [{ id: 'bbbench', kg: [80], note: 'Пауза 1 с' }, { id: 'latpull', sets: 3, reps: '8–10', rest: 90 }] }]; a.ensureCustoms(a.S);
  a.S.goal = 'cut';
  const file = plain(a.planFileObject([a.S.customs[0]], 'Тренер Иван'));
  assert.equal(file.format, a.PLAN_FILE); assert.equal(file.version, 1); assert.equal(file.from, 'Тренер Иван');
  const [p] = file.plans;
  assert.deepEqual([p.name, p.group, p.for, p.goal], ['Верх А', 'Сила', 'Сергей', 'strength']);
  assert.equal(p.items[0].reps, a.GOALS.strength.reps.c, 'dosage under the plan’s goal, not the current one');
  assert.equal(p.items[0].name, 'Жим штанги лёжа', 'names are for people');
  assert.equal(p.items[0].kg, 80); assert.equal(p.items[0].note, 'Пауза 1 с');
  assert.deepEqual([p.items[1].sets, p.items[1].reps, p.items[1].rest], [3, '8–10', 90]);
  const read = plain(a.readPlanFile(JSON.stringify(file)));
  assert.equal(read.error, undefined); assert.equal(read.plans.length, 1); assert.equal(read.plans[0].from, 'Тренер Иван');
  const added = plain(a.addPlans(read.plans));
  assert.equal(added[0].name, 'Верх А (2)', 'never overwrites, the name gets a number');
  assert.notEqual(added[0].id, 'p1');
  assert.deepEqual(added[0].items[0], { id: 'bbbench', sets: p.items[0].sets, reps: p.items[0].reps, rest: p.items[0].rest, kg: [80], note: 'Пауза 1 с' }, 'the file’s explicit dosage becomes the plan’s own');
  assert.deepEqual([added[0].items[1].id, added[0].items[1].sets, added[0].items[1].reps, added[0].items[1].rest], ['latpull', 3, '8–10', 90]);
  assert.deepEqual([added[0].goal, added[0].for, added[0].from], ['strength', 'Сергей', 'Тренер Иван']);
});

test('reading files: clear errors, unknown exercises and bad values dropped, text cleaned', () => {
  const a = app();
  assert.match(a.readPlanFile('').error, /пустой/);
  /* 4.112: в сообщении нет слова «JSON» (Виктор 14, Галина 10) */
  assert.match(a.readPlanFile('{"plans":[').error, /^Это не файл плана: его не удалось прочитать\. Возможно, файл обрезан/);
  assert.match(a.readPlanFile(JSON.stringify(plain(a.m.get('backupObject()')))).error, /резервная копия/);
  assert.match(a.readPlanFile('{"format":"other","plans":[]}').error, /не файл плана/);
  assert.match(a.readPlanFile(' '.repeat(300 * 1024) + '{}').error, /слишком большой/);
  const r = plain(a.readPlanFile(JSON.stringify({ format: a.PLAN_FILE, version: 2, plans: [{
    name: 'Очень длинное название плана, которое никто не будет читать до конца целиком', goal: 'hack', format: 'superset',
    items: [{ id: 'bbbench', sets: 99, reps: 'много', rest: -5, kg: ['abc', 600, 70], tempo: 'быстро', note: 'ok\u0007' },
      { id: 'teleport', name: 'Телепортация' }, { id: 'bbbench' }] }] })));
  assert.equal(r.newer, true, 'a newer format is flagged');
  assert.deepEqual(r.unknown, ['Телепортация']);
  const p = r.plans[0];
  assert(p.name.length <= 40); assert.equal(p.goal, undefined, 'unknown goal dropped'); assert.equal(p.format, 'superset');
  assert.deepEqual(p.items, [{ id: 'bbbench', kg: [70], note: 'ok' }], 'only sane values survive, duplicates removed');
  /* один план без обёртки тоже читается */
  assert.equal(plain(a.readPlanFile(JSON.stringify({ name: 'Один', items: [{ id: 'squat' }] }))).plans[0].name, 'Один');
});

test('round trip in every format: the imported plan builds exactly what the sender saw, whatever the recipient has selected', () => {
  const a = app();
  /* в круге подходы и отдых задаёт круг (rounds), у упражнений они не показываются */
  const view = () => plain(a.buildPlan().blocks.map(b => [b.rounds || 0, b.items.map(it => [it.ex.id, b.kind === 'circuit' ? 0 : it.rx.sets, it.rx.reps, b.kind === 'circuit' ? 0 : it.rx.rest,
    it.rx.series || 0, it.rx.kgPlan || null, it.rx.coachNote || '', it.rx.tempo || ''])]));
  for (const format of ['classic', 'superset', 'circuit', 'static']) for (const goal of ['strength', 'mass', 'cut']) {
    a.S.customs = [{ id: 'p1', name: 'A', goal, format, level: 'mid',
      items: [{ id: 'bbbench', sets: 6, kg: [60, 65] }, { id: 'latpull', reps: '12', note: 'Локти вниз' }, { id: 'squat', tempo: '3-1-1-0' }, { id: 'plank' }] }]; a.ensureCustoms(a.S);
    a.setMode('custom'); a.openCustom('p1');
    const sent = view();
    const read = plain(a.readPlanFile(JSON.stringify(a.planFileObject([a.S.customs[0]], ''))));
    const [c] = a.addPlans(read.plans);
    a.setMode('single'); Object.assign(a.S, { goal: goal === 'cut' ? 'strength' : 'cut', format: 'classic', level: 'beg' });
    a.openCustom(c.id);
    assert.deepEqual(view(), sent, `${format}/${goal}`);
    a.setMode('single');
  }
});
