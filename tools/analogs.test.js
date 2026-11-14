'use strict';
/* Места тренировок и аналоги: замена по движению и мышцам, программа другого места с заменами, перенос старых настроек. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  return { ...m.get('({S,EX,EXI,PATTERN,available,effEquip,analogsFor,analogScore,analogNote,buildPlan,buildProgram,ensurePlaces,placeOf,setPlaceEquip,programEquip,PLACE_DEFAULTS})'), m };
}
const HOME = ['db', 'band', 'abwheel'], STREET = ['pullup', 'dipbars'];

test('analogs are available in the current place and ranked by movement and muscles', () => {
  const a = app(), E = a.effEquip(['pullup', 'db', 'band']);
  const list = a.analogsFor(a.EXI.latpull, E, { limit: 5 });
  assert(list.length >= 2, 'lat pulldown has alternatives on a bar');
  for (const r of list) assert(a.available(r.ex, E), r.ex.id + ' must be available');
  assert.equal(a.PATTERN[list[0].ex.id], 'vpull', 'a vertical pull comes first when a bar exists');
  for (let i = 1; i < list.length; i++) assert(list[i - 1].score >= list[i].score, 'sorted by score');
  const home = a.analogsFor(a.EXI.latpull, a.effEquip(HOME), { limit: 3 });
  assert(home.length, 'even without a bar there is a back exercise');
  assert(home.every(r => r.ex.g === 'back' || r.ex.pri.includes('lats')), 'home alternatives still train the back');
  assert(home[0].note, 'a substitute explains what changes');
});
test('substitute notes name the change of resistance and lost muscles', () => {
  const a = app(), E = a.effEquip(HOME);
  assert.match(a.analogNote(a.EXI.cablerow, a.EXI.bandrow, E), /резина/);
  assert.match(a.analogNote(a.EXI.latpull, a.EXI.pullup, a.effEquip(STREET)), /вес тела/);
  assert(a.analogScore(a.EXI.legpress, a.EXI.squat) > a.analogScore(a.EXI.legpress, a.EXI.dbcurl), 'squat is closer to leg press than a curl');
});
test('cardio is replaced only by cardio, and strength never by cardio', () => {
  const a = app(), E = a.effEquip(a.PLACE_DEFAULTS[0].equip);
  for (const r of a.analogsFor(a.EXI.treadmill, E, { limit: 10 })) assert.equal(r.ex.g, 'cardio');
  for (const r of a.analogsFor(a.EXI.squat, E, { limit: 10 })) assert.notEqual(r.ex.g, 'cardio');
});
test('a gym programme adapted to home keeps its slots and uses only home equipment', () => {
  const a = app();
  Object.assign(a.S, { mode: 'single', goal: 'mass', level: 'mid', count: 6, groups: ['chest', 'back', 'shoulders'], seed: 7, format: 'classic' });
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'home'; a.S.adapt = 'gym'; a.ensurePlaces(a.S);
  assert.deepEqual([...a.S.equip], HOME);
  const p = a.buildPlan(), E = a.effEquip(HOME);
  assert.equal(p.items.length + p.lost.length, 6, 'every gym slot is either substituted or reported');
  const ids = p.items.map(it => it.ex.id);
  assert.equal(new Set(ids).size, ids.length, 'no duplicates after substitution');
  for (const it of p.items) {
    assert(a.available(it.ex, E), it.ex.id + ' is doable at home');
    if (it.sub) { assert(!a.available(it.sub.from, E), 'only missing exercises are substituted'); assert.equal(typeof it.sub.note, 'string'); }
  }
  assert(p.items.some(it => it.sub), 'a gym programme needs at least one substitute at home');
  /* та же программа без адаптации — своя для дома, без пометок о заменах */
  a.S.adapt = null; const own = a.buildPlan();
  assert(own.items.every(it => !it.sub));
});
test('weekly programme days are adapted too', () => {
  const a = app();
  Object.assign(a.S, { mode: 'program', days: 3, split: 'full', week: 1, count: 5, seed: 11 });
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'street'; a.S.adapt = 'gym'; a.ensurePlaces(a.S);
  const E = a.effEquip(STREET);
  for (const d of a.buildProgram().days || a.buildProgram()) for (const it of (d.plan || d).items || []) assert(a.available(it.ex, E), it.ex.id);
});
test('old settings become places: a known preset maps to its place, a custom list to the gym', () => {
  const a = app();
  const home = a.ensurePlaces({ equip: HOME.slice() });
  assert.equal(home.place, 'home'); assert.equal(home.places.length, 4); /* зал, дом, улица, дома с эспандером */
  const custom = a.ensurePlaces({ equip: ['db', 'bench', 'pullup'] });
  assert.equal(custom.place, 'gym'); assert.deepEqual([...a.placeOf(custom).equip], ['db', 'bench', 'pullup']);
  const stale = a.ensurePlaces({ places: [{ id: 'x', name: 'Дача', equip: ['kb'] }], place: 'gone', adapt: 'gone', equip: [] });
  assert.equal(stale.place, 'x'); assert.equal(stale.adapt, null); assert.deepEqual([...stale.equip], ['kb']);
});
test('editing equipment changes only the current place', () => {
  const a = app();
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'home'; a.ensurePlaces(a.S);
  a.setPlaceEquip(['kb']);
  assert.deepEqual([...a.placeOf().equip], ['kb']); assert.deepEqual([...a.S.equip], ['kb']);
  assert(a.placeOf(a.S, 'gym').equip.length > 20, 'the gym keeps its equipment');
});
/* процент — «от максимума на 1 повтор» (простыми словами, без «1ПМ» в строке карточки) */
test('percent of 1RM is shown only for loads that can be weighed', () => {
  const a = app(), P = a.m.get('({prescribe,WEEKS})');
  a.S.goal = 'mass'; a.S.level = 'mid';
  for (const [id, eq, pct] of [['bandrow', ['band'], false], ['pushup', [], false], ['pullup', ['pullup'], false], ['assistpull', ['gravitron'], false],
    ['bulgarian', ['bench'], false], ['bulgarian', ['bench', 'db'], true], ['bbbench', ['bb', 'bench'], true], ['latpull', ['cable'], true]])
    for (const week of [null, P.WEEKS[1], P.WEEKS[3]]) {
      const load = P.prescribe(a.EXI[id], week, a.effEquip(eq)).load;
      assert.equal(load.includes('от максимума на 1 повтор'), pct, `${id} with ${eq.join('+') || 'bodyweight'}: ${load}`);
      assert(!load.includes('1ПМ'), `${id}: «1ПМ» без расшифровки — ${load}`);
    }
  assert.match(P.prescribe(a.EXI.bandrow, null, a.effEquip(['band'])).load, /натяжение ленты/);
  assert.match(P.prescribe(a.EXI.assistpull, P.WEEKS[3], a.effEquip(['gravitron'])).load, /противовес: больше/);
});
/* «Дома с эспандером»: место только с резинками; программа «как в зале» берёт двойники на резинке */
const BANDS = ['band'];
test('the band-only place: gym exercises are replaced by their band twins', () => {
  const a = app(), place = a.PLACE_DEFAULTS.find(p => p.id === 'homeband');
  assert.deepEqual(place && { name: place.name, equip: [...place.equip] }, { name: 'Дома с эспандером', equip: BANDS });
  const E = a.effEquip(BANDS), first = id => a.analogsFor(a.EXI[id], E, { limit: 1 })[0]?.ex.id;
  for (const [gym, twin] of [['latpull', 'bandlatpull'], ['latpullv', 'bandlatpull'], ['adduction', 'bandadduct'], ['cableadduct', 'bandadduct'],
    ['abduction', 'bandabduct'], ['bridge', 'bandbridge'], ['legext', 'bandlegext'], ['cablerow', 'bandrow'], ['pushdown', 'bandpushdown'], ['cablecurl', 'bandcurl'], ['facepull', 'bandfacepull'],
    /* заход 2: жим лёжа → жим на полу с эспандером, кроссовер и «бабочка» → сведение рук у двери */
    ['bbbench', 'bandfloorpress'], ['dbbench', 'bandfloorpress'], ['cablefly', 'bandfly'], ['pecdeck', 'bandfly'], ['dbfly', 'bandfly']])
    assert.equal(first(gym), twin, `${gym} → ${twin}`);
  for (const id of ['bandlatpull', 'bandadduct', 'bandabduct', 'bandbridge', 'bandlegext', 'bandfloorpress', 'bandfly', 'sissysquat']) assert(a.available(a.EXI[id], E), id + ' needs only bands');
  /* разгибание ног в тренажёре: первая замена — разгибание с эспандером, вторая — сисси-присед у косяка (без снаряда); на улице — сисси-присед */
  assert.deepEqual(Array.from(a.analogsFor(a.EXI.legext, E, { limit: 2 }), r => r.ex.id), ['bandlegext', 'sissysquat']);
  assert.equal(a.analogsFor(a.EXI.legext, a.effEquip(['pullup', 'dipbars']), { limit: 1 })[0]?.ex.id, 'sissysquat');
  assert.match(a.analogNote(a.EXI.latpull, a.EXI.bandlatpull, E), /резина/, 'the note names the band');
  /* программа зала в этом месте: тяга верхнего блока заменена тягой эспандера сверху */
  Object.assign(a.S, { mode: 'single', goal: 'mass', level: 'mid', count: 6, groups: ['back'], seed: 3, format: 'classic' });
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'homeband'; a.S.adapt = 'gym'; a.ensurePlaces(a.S);
  assert.deepEqual([...a.S.equip], BANDS);
  const p = a.buildPlan();
  for (const it of p.items) assert(a.available(it.ex, E), it.ex.id + ' is doable with bands only');
  const sub = p.items.find(it => it.sub && ['latpull', 'latpullv', 'latpulluh', 'pullup', 'chinup', 'assistpull'].includes(it.sub.from.id));
  assert(sub && sub.ex.id === 'bandlatpull', 'a vertical pull of the gym programme becomes the band pulldown: ' + p.items.map(it => (it.sub ? it.sub.from.id + '→' : '') + it.ex.id).join(', '));
});
test('the band-only place is added once to places saved before it existed', () => {
  const a = app(), saved = [{ id: 'gym', name: 'Зал', equip: ['db'] }, { id: 'home', name: 'Дом', equip: ['band'] }];
  a.S.places = saved.map(p => ({ ...p })); a.S.place = 'home'; delete a.S.placesV; a.ensurePlaces(a.S);
  assert.deepEqual(a.S.places.map(p => p.id), ['gym', 'home', 'homeband'], 'added after the saved places');
  assert.equal(a.S.place, 'home', 'the current place does not change');
  a.S.places = a.S.places.filter(p => p.id !== 'homeband'); a.ensurePlaces(a.S);
  assert(!a.S.places.some(p => p.id === 'homeband'), 'a place the user deleted does not come back');
});
