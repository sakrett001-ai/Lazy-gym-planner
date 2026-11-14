'use strict';
/* Статодинамика: подбор только подходящих упражнений, серии по три подхода, медленный темп, отдых внутри серии
   и между сериями, неполная амплитуда на манекене, отдельный учёт веса в журнале. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get('({S,EX,EXI,STATIC,staticOk,restAfter,staticSeconds,buildPlan,buildProgram,prescribe,WEEKS,effEquip,PLACE_DEFAULTS,ensurePlaces,workoutQueue,motionFrame,motionDurations,blocksText,suggest,metricOf,LOG,todayKey,applyLight,AR})');
  a.places = () => { a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S); };
  a.places();
  Object.assign(a.S, { mode: 'single', format: 'static', goal: 'mass', level: 'mid', count: 6, groups: ['chest', 'back', 'shoulders'], seed: 7 });
  return a;
}

test('only exercises that make sense slow and without relaxation are eligible', () => {
  const a = app();
  for (const id of ['squat', 'bbbench', 'legext', 'pushup', 'hyper', 'dbcurl', 'latpull', 'lunge']) assert(a.staticOk(a.EXI[id]), id + ' suits static-dynamics');
  for (const id of ['treadmill', 'plank', 'jumpsquat', 'burpee', 'kbswing', 'deadlift', 'pullup', 'chinup', 'nordic', 'farmer', 'mountain'])
    assert(!a.staticOk(a.EXI[id]), id + ' does not');
  assert(a.EX.filter(a.staticOk).length >= 100, 'most of the catalogue stays available');
});
test('a static-dynamic workout: series of three slow sets, short rest inside a series, long rest between series', () => {
  const a = app();
  for (const [level, series] of [['beg', 1], ['mid', 2], ['adv', 3]]) {
    a.S.level = level;
    const p = a.buildPlan();
    assert.equal(p.items.length, 6);
    for (const it of p.items) {
      assert(a.staticOk(it.ex), it.ex.id + ' is eligible');
      assert.equal(it.rx.static, true);
      assert.equal(it.rx.tempo, '3-0-3-0');
      assert.equal(it.rx.series, series, level);
      assert.equal(it.rx.sets, series * 3);
      const rests = Array.from({ length: it.rx.sets }, (_, k) => a.restAfter(it.rx, k));
      const expect = Array.from({ length: it.rx.sets }, (_, k) => k + 1 === it.rx.sets ? 120 : (k + 1) % 3 === 0 ? it.rx.seriesRest : 30);
      assert.deepEqual(plain(rests), expect);
    }
    assert.equal(p.minutes, Math.round(p.items.reduce((s, it) => s + a.staticSeconds(it.rx), 0) / 60), 'time counts series and rests');
  }
  a.S.level = 'mid';
  const p = a.buildPlan(), text = plain(a.blocksText(p)).join('\n');
  assert.match(text, /2 × 3 × 5–7 повт\., усилие 3 с, возврат 3 с, без расслабления, отдых 30 с, между сериями 3 мин/);
  const q = plain(a.workoutQueue(p).slice(0, 6).map(s => [s.rest, s.phase]));
  assert.deepEqual(q.map(x => x[0]), [30, 30, 180, 30, 30, 120], 'the workout timer follows the series');
  assert.match(q[3][1], /серия 2 из 2/);
});
test('load is described by the burn, not by heavy percentages', () => {
  const a = app(), gym = a.effEquip(a.PLACE_DEFAULTS[0].equip);
  assert.match(a.prescribe(a.EXI.bbbench, null, gym).load, /^к концу подхода мышца сильно горит, но повторы ещё получаются \(≈ 40–60% от максимума на 1 повтор\)$/);
  assert.match(a.prescribe(a.EXI.pushup, null, gym).load, /^вес тела/);
  assert.match(a.prescribe(a.EXI.bandrow, null, a.effEquip(['band'])).load, /^натяжение ленты/);
  a.S.format = 'classic';
  assert.doesNotMatch(a.prescribe(a.EXI.bbbench, null, gym).tempo, /3-0-3-0/, 'other formats are untouched');
});
test('a deload week and a light day drop one series but keep series whole', () => {
  const a = app(), gym = a.effEquip(a.PLACE_DEFAULTS[0].equip), deload = a.WEEKS.find(w => w.deload);
  const rx = a.prescribe(a.EXI.squat, deload, gym);
  assert.equal(rx.series, 1); assert.equal(rx.sets, 3);
  a.AR.light = true;
  const light = a.applyLight(a.prescribe(a.EXI.squat, null, gym), a.EXI.squat);
  assert.equal(light.series, 1); assert.equal(light.sets, 3); assert.equal(light.light, true);
  a.AR.light = false;
});
test('weekly programmes and substitutes from another place stay static-dynamic', () => {
  const a = app();
  Object.assign(a.S, { mode: 'program', days: 3, split: 'full', week: 1 });
  for (const d of a.buildProgram().days) for (const it of d.plan.items) assert(it.rx.static && a.staticOk(it.ex), d.name + ': ' + it.ex.id);
  Object.assign(a.S, { mode: 'single' }); a.S.place = 'home'; a.S.adapt = 'gym'; a.ensurePlaces(a.S);
  const p = a.buildPlan();
  for (const it of p.items) assert(a.staticOk(it.ex), 'substitute ' + it.ex.id + ' is eligible');
});
test('the mannequin shows the working part of the range: no lockout, no sinking', () => {
  /* упражнение с темпом из назначения: не цикл и не последовательность поз со своим периодом (как «Y-T-W») */
  const a = app(), p = a.buildPlan(), it = p.items.find(x => !x.ex.anim.loop && !x.ex.anim.period);
  const F = { it, clock: 0, durations: a.motionDurations(it) }, total = F.durations.reduce((s, v) => s + v, 0), ts = [];
  for (let k = 0; k <= 200; k++) { F.clock = k / 200 * total; ts.push(a.motionFrame(F).t); }
  assert(Math.min(...ts) >= a.STATIC.partial[0] - 1e-9 && Math.max(...ts) <= a.STATIC.partial[1] + 1e-9, 'stays inside the partial range');
  assert(Math.min(...ts) < a.STATIC.partial[0] + .02 && Math.max(...ts) > a.STATIC.partial[1] - .02, 'and uses all of it');
  assert.deepEqual(plain(F.durations), [3000, 0, 3000, 0], 'no pauses at the ends');
  a.S.format = 'classic';
  const c = a.buildPlan().items.find(x => !x.ex.anim.loop && !x.ex.anim.hold), G = { it: c, clock: 0, durations: a.motionDurations(c) }, tot = G.durations.reduce((s, v) => s + v, 0), us = [];
  for (let k = 0; k <= 200; k++) { G.clock = k / 200 * tot; us.push(a.motionFrame(G).t); }
  assert(Math.min(...us) < .01 && Math.max(...us) > .99, 'classic shows the full range');
});
test('the log keeps static-dynamic weights apart from ordinary sets', () => {
  const a = app(), today = a.todayKey(), day = n => { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  a.LOG.data.bbbench = [{ d: day(7), s: [[60, 8], [60, 8], [60, 7]], target: 3 }];
  const p = a.buildPlan(), it = { ...p.items[0], ex: a.EXI.bbbench, rx: a.prescribe(a.EXI.bbbench, null, a.effEquip(a.PLACE_DEFAULTS[0].equip)) };
  const sg = a.suggest(it);
  assert(sg.kg > 30 && sg.kg < 40, 'about 60% of the last working weight: ' + sg.kg);
  assert.match(sg.text, /Статодинамика/);
  a.LOG.data.bbbench.push({ d: day(3), s: [[35, 7], [35, 7], [35, 7]], target: 3, fmt: 'static' });
  const m = a.metricOf(a.EXI.bbbench);
  assert.equal(m.f(a.LOG.data.bbbench[1]), null, 'slow light sets do not lower the estimated maximum');
  assert(m.f(a.LOG.data.bbbench[0]) > 70);
  a.S.format = 'classic';
  const classic = { ...it, rx: a.prescribe(a.EXI.bbbench, null, a.effEquip(a.PLACE_DEFAULTS[0].equip)) };
  assert.equal(a.suggest(classic).prev.d, day(7), 'ordinary sets follow the last ordinary session');
});
