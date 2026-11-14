'use strict';
/* Время на тренировку (11j-duration.js): генератор подбирает число упражнений и дозировку под выбранный коридор
   (20–30, около 45, 60 мин и больше); оценка — та же, что «время ≈N мин» в шапке плана. Не задано — как раньше. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S, buildPlan, buildPlanAt, buildProgram, ensurePlaces, PLACE_DEFAULTS, GROUP_PRESETS, ensureCustoms, ensureProtect, ensureDur,
  DURATIONS, durationWarn, restoreBackup, GOALS, LEVELS})`);
const FULL = a.GROUP_PRESETS.find(p => p.id === 'full').g, UPPER = ['chest', 'back', 'shoulders'], LEGS = ['quads', 'glutes', 'hams', 'calves'];
const DURS = ['short', 'mid', 'long'];
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: FULL.slice(), seed: 7, fav: [], customs: [], custom: null,
    gen: null, protect: [], days: 3, week: 1, day: 0, focus: null, logPick: null, dur: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensureDur(a.S);
  m.get('AR.light = false');
}
const inside = (p, d) => p.minutes >= a.DURATIONS[d].lo && p.minutes <= a.DURATIONS[d].hi;
const ids = p => plain(p.items.map(it => it.ex.id));

test('time not set: the number of exercises comes from «Exercises», exactly as before', () => {
  for (const count of [3, 6, 10]) for (const goal of ['strength', 'mass', 'gentle']) {
    reset({ count, goal });
    const p = a.buildPlan(), q = a.buildPlanAt();
    assert.equal(p.items.length, count, `${goal}: ${count} exercises`);
    assert.deepEqual(ids(p), ids(q)); assert.equal(p.minutes, q.minutes); assert.equal(p.fit, undefined);
  }
  reset({ dur: 'bogus' });
  assert.equal(a.S.dur, null, 'an unknown value is «not set»');
});

/* новичку не больше 8 упражнений и одного подхода сверх обычного: на 60+ он может не дотянуть до коридора — тогда
   под планом сказано почему, а тренировка не короче, чем на 45 минут */
const begShort = (p, level, dur, tag) => {
  assert(level === 'beg' && dur === 'long' && p.fit.why === 'beg' && p.items.length === 8, tag);
  assert.match(a.durationWarn(p), /^Новичку больше подходов не прибавляем: тренировка ≈\d+ мин\./, tag);
};
const rising = (mins, level, tag) => assert(mins[0] < mins[1] && (mins[1] < mins[2] || (level === 'beg' && mins[1] <= mins[2])), `${tag}: ${mins.join(' < ')}`);

test('straight sets: short is shorter than 45 min, 45 shorter than 60+, and each estimate lands in its corridor', () => {
  for (const place of ['gym', 'home', 'street', 'homeband']) for (const groups of [FULL, UPPER, LEGS])
    for (const goal of Object.keys(a.GOALS)) for (const level of Object.keys(a.LEVELS)) {
      const mins = DURS.map(dur => {
        reset({ place, groups: groups.slice(), goal, level, dur });
        const p = a.buildPlan(), tag = `${place} ${groups.join('+')} ${goal} ${level} ${dur}: ≈${p.minutes} min, ${p.items.length} exercises`;
        if (!inside(p, dur)) { begShort(p, level, dur, tag); return p.minutes; }
        assert(p.fit && p.fit.ok && p.count === p.items.length, tag + ': fitted, no «picked N of M» warning');
        assert.equal(a.durationWarn(p), '', tag);
        return p.minutes;
      });
      rising(mins, level, `${place} ${goal} ${level}`);
    }
});

test('supersets, circuits, slow-tempo: inside the corridor; a beginner may stop short of 60+ — and is told why', () => {
  for (const format of ['superset', 'circuit', 'static']) for (const place of ['gym', 'home'])
    for (const goal of Object.keys(a.GOALS)) for (const level of Object.keys(a.LEVELS)) {
      const mins = DURS.map(dur => {
        reset({ place, format, goal, level, dur });
        const p = a.buildPlan(), tag = `${format} ${place} ${goal} ${level} ${dur}: ≈${p.minutes} min`;
        if (inside(p, dur)) assert.equal(a.durationWarn(p), '', tag);
        else begShort(p, level, dur, tag);
        return p.minutes;
      });
      rising(mins, level, `${format} ${goal} ${level}`);
    }
});

test('little time for strength: fewer sets and a bit less rest, never under 2 sets, compounds rest at least 2 min', () => {
  for (const level of Object.keys(a.LEVELS)) {
    reset({ goal: 'strength', level });
    const full = a.buildPlan();
    reset({ goal: 'strength', level, dur: 'short' });
    const p = a.buildPlan();
    assert(inside(p, 'short') && p.items.length >= 3, `${level}: ≈${p.minutes} min`);
    assert(p.items.every(it => it.rx.sets >= 2), 'at least two sets');
    assert(p.items.filter(it => it.ex.type === 'c').every(it => it.rx.rest >= 120), 'compounds rest at least two minutes');
    assert(p.totalSets < full.totalSets, 'fewer sets than the usual 6-exercise workout');
  }
  /* в коротких тренировках — больше базовых упражнений */
  reset({ goal: 'mass', dur: 'short' });
  const short = a.buildPlan();
  assert(short.items.filter(it => it.ex.type === 'c').length >= short.items.length - 1, 'short workout is mostly compounds: ' + ids(short));
});

test('nothing more to pick: the plan says honestly that the time is not filled', () => {
  reset({ place: 'street', groups: LEGS.slice(), protect: ['knees', 'lumbar'], goal: 'cut', dur: 'long' });
  const p = a.buildPlan();
  assert(!inside(p, 'long') && p.fit.why === 'few', `≈${p.minutes} min from ${p.items.length} exercises`);
  assert.match(a.durationWarn(p), /^Под 60 мин и больше не хватает упражнений/);
});

test('week program: every day fits; deload and loading weeks keep the same exercises', () => {
  for (const days of [2, 3, 4, 5]) for (const dur of DURS) {
    reset({ mode: 'program', days, split: null, dur, goal: 'mass' });
    const w1 = a.buildProgram();
    for (const d of w1.days) assert(inside(d.plan, dur), `${days} days, ${dur}, ${d.name}: ≈${d.plan.minutes} min`);
    a.S.week = 2; const w2 = a.buildProgram();
    a.S.week = 4; const w4 = a.buildProgram();
    w1.days.forEach((d, i) => {
      assert.deepEqual(ids(w2.days[i].plan), ids(d.plan), 'loading week: same exercises');
      assert.deepEqual(ids(w4.days[i].plan), ids(d.plan), 'deload: same exercises');
      assert(w4.days[i].plan.minutes < d.plan.minutes, `deload is shorter: ${w4.days[i].plan.minutes} < ${d.plan.minutes}`);
      assert(w2.days[i].plan.minutes >= d.plan.minutes, 'loading week adds a set to compounds');
    });
  }
});

test('«lighten the workout» makes the same workout shorter instead of adding exercises', () => {
  reset({ dur: 'mid' });
  const p = a.buildPlan();
  m.get('AR.light = true');
  const q = a.buildPlan();
  m.get('AR.light = false');
  assert.deepEqual(ids(q), ids(p)); assert(q.minutes < p.minutes, `${q.minutes} < ${p.minutes}`);
});

test('own plan: time does not apply — exercises and sets are the person’s', () => {
  reset({ dur: 'short', customs: [{ id: 'c1', name: 'Мой', items: [{ id: 'bbbench', sets: 5 }, { id: 'squat' }, { id: 'pullup' }, { id: 'dbcurl' }, { id: 'latraise' }, { id: 'plank' }, { id: 'legpress' }] }], custom: 'c1' });
  a.S.mode = 'custom'; a.ensureCustoms(a.S);
  const p = a.buildPlan();
  assert.equal(p.items.length, 7); assert.equal(p.fit, undefined);
  assert.equal(p.items.find(it => it.ex.id === 'bbbench').rx.sets, 5);
});

test('«−» and «+» while time is set count from the shown number; backups keep the setting', () => {
  reset({ dur: 'mid' });
  m.get('plan = buildPlan()');
  const n = m.get('shownCount()');
  assert.equal(n, m.get('plan.items.length'));
  reset({ dur: null, count: 6 });
  m.get('plan = buildPlan()');
  assert.equal(m.get('shownCount()'), 6, 'not set: the stepper shows «Exercises»');
  for (const [dur, want] of [['short', 'short'], ['long', 'long'], ['xx', null], [null, null]]) {
    reset();
    a.restoreBackup({ v: 2, settings: { groups: FULL, equip: ['db'], dur } });
    assert.equal(a.S.dur, want, `backup with ${dur}`);
  }
});

test('a beginner never gets more than 8 exercises: extra time goes into sets (owner, 14.11.2026)', () => {
  for (const format of ['classic', 'superset', 'circuit', 'static']) for (const place of ['gym', 'home'])
    for (const goal of Object.keys(a.GOALS)) for (const dur of DURS) {
      reset({ place, format, goal, level: 'beg', dur });
      const p = a.buildPlan();
      assert(p.items.length <= 8, `${format} ${place} ${goal} ${dur}: ${p.items.length} exercises`);
    }
  reset({ goal: 'cut', level: 'beg', dur: 'mid' });
  const p = a.buildPlan();
  assert(inside(p, 'mid') && p.items.length <= 8, `beginner, cut, 45 min: ≈${p.minutes} min, ${p.items.length} exercises`);
});
