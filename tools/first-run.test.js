'use strict';
/* Первый запуск (11k-first-run.js): ответы мастера → параметры плана; «Пропустить» — значения по умолчанию для новичка
   (не «Масса»); мастер только там, где ещё нет ни настроек, ни журнала, ни тренировки; данные прежних версий читаются
   как раньше. Поведение окна в браузере — tools/ui-check.mjs. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app(storage) {
  const m = loadModel({ fullApp: true, storage });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S, FIRST_RUN, FIRST_DEFAULTS, FIRST_EQUIP, firstRunApply, firstEquipList, placeHasAll, placeOf, buildPlan, ensurePlaces, ensureCustoms,
    ensureProtect, PLACE_DEFAULTS, GROUP_PRESETS, EQUIP, DURATIONS, GOALS})`);
  a.m = m;
  return a;
}
const FULL = ['chest', 'back', 'shoulders', 'quads', 'hams', 'glutes', 'abs'];
const a = app();
function fresh() {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: ['chest', 'back', 'shoulders'], seed: 7,
    customs: [], custom: null, gen: null, protect: [], dur: null, focus: null });
  a.ensureCustoms(a.S); a.ensureProtect(a.S);
  return a.S;
}

test('a fresh browser is a first run; anything saved before — settings, log, workout, «plan seen» — is not', () => {
  assert.equal(a.FIRST_RUN, true);
  const old = { goal: 'strength', format: 'classic', level: 'adv', count: 8, groups: ['chest', 'back', 'shoulders'], equip: a.EQUIP.map(e => e.id), seed: 3 };
  for (const [k, v] of [['podhod.settings.v1', JSON.stringify(old)], ['podhod.log.v1', '{}'], ['podhod.workout.v3', '{}'], ['podhod.planSeen.v1', '1']])
    assert.equal(app({ [k]: v }).FIRST_RUN, false, k);
  /* настройки 4.103.0 (без времени тренировки): план собирается как раньше — 8 упражнений, цель и уровень те же */
  const b = app({ 'podhod.settings.v1': JSON.stringify(old) });
  assert.equal(b.S.dur, null); assert.equal(b.S.goal, 'strength'); assert.equal(b.S.level, 'adv');
  assert.equal(b.buildPlan().items.length, 8);
  assert.equal(b.m.get("localStorage.getItem('podhod.planSeen.v1')"), '1', 'returning person: «plan seen» is written as before');
  /* первый запуск: отметка «план показан» — только когда мастер пройден или пропущен */
  assert.equal(a.m.get("localStorage.getItem('podhod.planSeen.v1')"), null);
});

test('«Skip»: beginner defaults, not «Hypertrophy»; full body, straight sets, about 45 minutes, first place', () => {
  assert.notEqual(a.FIRST_DEFAULTS.goal, 'mass');
  const s = a.firstRunApply({}, fresh());
  assert.deepEqual(plain({ goal: s.goal, level: s.level, dur: s.dur, format: s.format, mode: s.mode, protect: s.protect, groups: s.groups, place: s.place }),
    { goal: 'gentle', level: 'beg', dur: 'mid', format: 'classic', mode: 'single', protect: [], groups: FULL, place: 'gym' });
  assert.deepEqual(plain(s.gen), { goal: 'gentle', format: 'classic', level: 'beg' }, 'the generated-plan settings follow');
  const p = a.buildPlan();
  assert(p.minutes >= a.DURATIONS.mid.lo && p.minutes <= a.DURATIONS.mid.hi, `≈${p.minutes} min`);
});

test('answers → plan settings: place, what is at hand, goal, time, experience, joints', () => {
  const s = a.firstRunApply({ place: 'home', equipFor: 'home', equip: ['kb', 'db', 'pullup'], goal: 'cut', dur: 'short', level: 'adv', protect: ['knees', 'lumbar'] }, fresh());
  assert.equal(s.place, 'home');
  assert.deepEqual(plain(s.equip), ['db', 'kb', 'pullup'], 'equipment in the usual order');
  assert.deepEqual(plain(a.placeOf(s, 'home').equip), ['db', 'kb', 'pullup'], 'saved as the equipment of the place');
  assert.deepEqual(plain(a.placeOf(s, 'gym').equip), plain(a.EQUIP.map(e => e.id)), 'other places untouched');
  assert.deepEqual(plain({ goal: s.goal, dur: s.dur, level: s.level, protect: s.protect }), { goal: 'cut', dur: 'short', level: 'adv', protect: ['lumbar', 'knees'] });
  const p = a.buildPlan();
  assert(p.items.every(it => it.ex.eq.every(g => g.some(id => ['db', 'kb', 'pullup'].includes(id)))), 'only what is at hand');
  assert(p.minutes >= 20 && p.minutes <= 30, `≈${p.minutes} min`);
  assert(p.items.every(it => !a.m.get('stressIdsOf')(it.ex).some(r => ['knee', 'kneeOpen', 'kneel', 'landing', 'lumbar', 'lumbarLever'].includes(r))), 'protected joints spared');
  /* ничего не отмечено — только вес тела */
  const t = a.firstRunApply({ place: 'street', equipFor: 'street', equip: [] }, fresh());
  assert.deepEqual(plain(t.equip), []); assert(a.buildPlan().items.every(it => !it.ex.eq.length));
});

test('the equipment answer counts only for the place it was given for; the gym is never asked', () => {
  const s = a.firstRunApply({ place: 'gym', equipFor: 'home', equip: ['db'] }, fresh());
  assert.deepEqual(plain(s.equip), plain(a.EQUIP.map(e => e.id)));
  assert.deepEqual(plain(a.placeOf(s, 'home').equip), ['db', 'band', 'abwheel'], 'home keeps its equipment');
  fresh();
  assert.equal(a.placeHasAll(a.placeOf(a.S, 'gym')), true);
  assert.equal(a.placeHasAll(a.placeOf(a.S, 'home')), false);
  const steps = place => { a.m.get('FR').A = place ? { place } : {}; return plain(a.m.get('frSteps()')); };
  assert.deepEqual(steps('gym'), ['place', 'goal', 'more'], 'gym: three steps');
  assert.deepEqual(steps('home'), ['place', 'equip', 'goal', 'more'], 'home: four steps');
  assert.deepEqual(steps(null), ['place', 'equip', 'goal', 'more'], 'before the answer: «step 1 of 4»');
  /* спрашиваем об инвентаре мест; что уже есть в месте — тоже в списке */
  assert(a.FIRST_EQUIP.every(id => a.EQUIP.some(e => e.id === id)));
  const list = a.firstEquipList({ equip: ['db', 'legpress'] });
  assert(list.includes('legpress') && list.slice(0, a.FIRST_EQUIP.length).join() === a.FIRST_EQUIP.join());
});

test('broken answers fall back to defaults; at most four questions', () => {
  const s = a.firstRunApply({ place: 'mars', goal: 'fly', level: 'pro', dur: 'week', protect: ['knees', 'tail'], equipFor: 'mars', equip: ['laser'] }, fresh());
  assert.deepEqual(plain({ place: s.place, goal: s.goal, level: s.level, dur: s.dur, protect: s.protect }), { place: 'gym', goal: 'gentle', level: 'beg', dur: 'mid', protect: ['knees'] });
  assert(Object.keys(a.m.get('FR_STEP')).length <= 4);
  for (const k of Object.keys(a.GOALS)) assert(a.GOALS[k].about && !/1ПМ|темп|БАЗОВОЕ/i.test(a.GOALS[k].about), k + ': plain-words explanation');
});
