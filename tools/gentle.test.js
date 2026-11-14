'use strict';
/* Бережный режим: «Беречь суставы» убирает пиковую нагрузку на отмеченные суставы по тем же правилам, что красные
   метки манекена; цель «Бережно» — лёгкая дозировка без ударных, рывковых и сложных упражнений. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S,EX,EXI,PATTERN,GOALS,WEEKS,STRESS_RULES,PROTECT,PROTECT_BY,buildPlan,buildProgram,prescribe,effEquip,ensureProtect,ensureCustoms,ensurePlaces,
  PLACE_DEFAULTS,stressIdsOf,jointStress,fitsBody,unfitWhy,lostMessages,readPlanFile,planFileObject,customOf,openCustom})`);
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: ['quads', 'glutes', 'hams', 'calves'], seed: 7,
    fav: [], customs: [], custom: null, gen: null, protect: [], days: 3, week: 1, day: 0, focus: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S);
}
const ids = p => plain(p.items.map(it => it.ex.id));
const rulesOf = list => new Set(list.flatMap(id => a.PROTECT_BY[id].rules));
const GROUP_SETS = [['quads', 'glutes', 'hams', 'calves'], ['chest', 'back', 'shoulders'], ['chest', 'shoulders', 'triceps'], ['back', 'biceps', 'forearms'], ['quads', 'chest', 'back', 'shoulders', 'abs']];

test('every red-mark rule belongs to a joint you can protect, and the cached list matches the mannequin', () => {
  const covered = new Set(a.PROTECT.flatMap(p => p.rules));
  for (const r of a.STRESS_RULES) assert(covered.has(r.id), r.id + ' is protectable');
  for (const p of a.PROTECT) assert(p.rules.length, p.id + ' maps to rules');
  assert.deepEqual(plain(a.PROTECT_BY.knees.rules), ['knee', 'kneeOpen', 'kneel', 'landing']);
  assert.deepEqual(plain(a.PROTECT_BY.lumbar.rules), ['lumbar', 'lumbarLever']);
  for (const ex of a.EX) assert.deepEqual(plain(a.stressIdsOf(ex)), plain(a.jointStress(ex).rules.map(r => r.id)), ex.id);
});

test('protected joints: no exercise with their peak load is picked, in any group set, seed or mode', () => {
  for (const protect of [['knees'], ['shoulders', 'neck'], ['lumbar', 'hams'], ['wrists', 'elbows'], ['achilles']]) {
    const bad = rulesOf(protect);
    for (const groups of GROUP_SETS) for (const seed of [1, 7, 23, 51]) for (const goal of ['strength', 'mass', 'gentle']) {
      reset({ protect, groups, seed, goal });
      const p = a.buildPlan();
      for (const it of p.items) assert(!a.stressIdsOf(it.ex).some(r => bad.has(r)), `${protect} ${groups} ${seed}: ${it.ex.id}`);
    }
    reset({ protect, mode: 'program', days: 4 });
    for (const d of a.buildProgram().days) for (const it of d.plan.items || []) assert(!a.stressIdsOf(it.ex).some(r => bad.has(r)), `program ${protect}: ${it.ex.id}`);
  }
  reset({ protect: ['knees'] });
  const legs = a.buildPlan();
  assert(legs.items.length >= 4, 'legs still get a workout without knee-heavy exercises: ' + ids(legs));
  reset({ protect: ['shoulders', 'neck'], groups: ['back', 'biceps'] });
  assert(!ids(a.buildPlan()).some(id => ['pullup', 'chinup', 'assistpull'].includes(id)), 'no pull-ups when neck and shoulders are protected');
  for (const seed of [1, 7, 23]) {
    reset({ protect: ['shoulders'], groups: ['shoulders', 'triceps'], seed });
    assert(!ids(a.buildPlan()).some(id => a.PATTERN[id] === 'vpush'), 'no overhead presses when shoulders are protected: ' + ids(a.buildPlan()));
  }
  /* «Ступени: тяжелее» не ведёт к упражнению, которое нагружает бережёмый сустав */
  const hint = id => m.get('progressionHint')({ ex: a.EXI[id], rx: { reps: '12–15' } });
  reset();
  assert.match(hint('airsquat'), /data-prog="lunge"/);
  reset({ protect: ['knees'] });
  assert.equal(hint('airsquat'), '', 'every harder squat step loads the knees');
  reset({ protect: ['shoulders', 'neck'] });
  assert.match(hint('towelrow'), /data-prog="tablerow"/); assert(!/pullup/.test(hint('invrow')), 'the step to pull-ups is skipped');
});

test('gentle goal: light dosage with reserve, no impact, ballistic or advanced exercises, fewer joint peaks', () => {
  let peaks = { gentle: 0, mass: 0 };
  for (const goal of ['gentle', 'mass']) for (const groups of GROUP_SETS) for (const seed of [1, 7, 23, 51, 77]) {
    reset({ goal, groups: groups.concat('cardio'), seed, count: 7 });
    const p = a.buildPlan();
    for (const it of p.items) {
      peaks[goal] += a.stressIdsOf(it.ex).length;
      if (goal !== 'gentle') continue;
      assert(it.ex.lvl <= 2 && it.ex.id !== 'kbswing' && !['jump', 'burpee', 'climb'].includes(a.PATTERN[it.ex.id]), it.ex.id);
    }
  }
  assert(peaks.gentle < peaks.mass * 0.75, `gentle picks fewer joint peaks: ${JSON.stringify(peaks)}`);
  reset({ goal: 'gentle', groups: ['chest', 'back'] });
  const E = a.effEquip(a.S.equip), rx = plain(a.prescribe(a.EXI.dbbench, null, E));
  assert.deepEqual([rx.reps, rx.sets, rx.rest, rx.tempo], ['12–15', 2, 90, '3-0-2-0']);
  assert.equal(rx.load, 'оставляйте силы ещё на 3–4 повтора, без боли (≈ 40–60% от максимума на 1 повтор)');
  assert(!/X/.test(a.GOALS.gentle.tempo), 'no explosive lift');
  for (const w of a.WEEKS) {
    const r = plain(a.prescribe(a.EXI.dbbench, w, E));
    const rir = +(r.load.match(/ещё на (\d)(?:–\d)? повтор/) || [0, 9])[1];
    assert(w.deload ? /лёгкий вес/.test(r.load) : rir >= 3, `${w.name}: ${r.load}`);
  }
  assert.match(plain(a.prescribe(a.EXI.treadmill, null, E)).load, /можно говорить/);
});

/* сисси-присед: колени далеко за носками при глубоком сгибе — метка колена (09f-joint-stress.js), при «Беречь колени»
   не подбирается, не предлагается заменой «как в зале» и сам заменяется в своём плане */
test('knees protected: the sissy squat is not picked, not offered as a substitute and is replaced in a custom plan', () => {
  assert(a.stressIdsOf(a.EXI.sissysquat).includes('knee'), 'the sissy squat loads the knees');
  const at = (place, extra = {}) => { reset(extra); a.S.place = place; a.S.adapt = extra.adapt || null; a.ensurePlaces(a.S); return a.buildPlan(); };
  const all = p => p.items.map(it => it.ex.id).concat(p.items.filter(it => it.sub).map(it => it.sub.from.id + '→' + it.ex.id));
  let seen = 0, offered = 0;
  for (const seed of [1, 3, 7, 11, 23, 31, 51, 77]) for (const groups of [['quads'], ['quads', 'glutes', 'hams']]) for (const adapt of [null, 'gym']) {
    if (all(at('homeband', { seed, groups, adapt })).some(x => /sissysquat$/.test(x))) seen++;
    const p = at('homeband', { seed, groups, adapt, protect: ['knees'] });
    assert(!p.items.some(it => it.ex.id === 'sissysquat'), `knees protected, ${groups} ${seed} ${adapt || ''}: ${all(p)}`);
  }
  for (const place of ['homeband', 'street']) {
    /* свой план из зала: разгибание ног в тренажёре здесь недоступно — заменой без «Беречь колени» был бы сисси-присед */
    reset({ mode: 'custom' }); a.S.place = place; a.ensurePlaces(a.S);
    a.S.customs = [{ id: 'k1', name: 'Ноги', items: [{ id: 'legext' }, { id: 'bandlegext' }] }]; a.ensureCustoms(a.S); a.openCustom('k1');
    if (a.buildPlan().items.some(it => it.ex.id === 'sissysquat' && it.sub && it.sub.from.id === 'legext')) offered++;
    a.S.protect = ['knees'];
    const p = a.buildPlan();
    /* на улице без замены без глубокого сгиба план может остаться пустым — тогда всё в списке «нечем заменить» */
    assert(!(p.items || []).some(it => it.ex.id === 'sissysquat'), `${place}: not offered instead of the leg extension: ${p.items ? all(p) : p.empty}`);
  }
  assert(seen > 0 && offered > 0, `without protection it does come up (picked ${seen}, offered ${offered}) — the check above is not empty`);
  reset({ mode: 'custom', protect: ['knees'] }); a.S.place = 'homeband'; a.ensurePlaces(a.S);
  a.S.customs = [{ id: 'k2', name: 'Дома', items: [{ id: 'sissysquat' }] }]; a.ensureCustoms(a.S); a.openCustom('k2');
  const p = a.buildPlan();
  assert(!p.items.some(it => it.ex.id === 'sissysquat'), 'a custom plan does not keep it: ' + all(p));
  const sub = p.items.find(it => it.sub && it.sub.from.id === 'sissysquat');
  if (sub) assert.match(sub.sub.note, /нагружает колени/); else assert(p.lost.some(ex => ex.id === 'sissysquat'));
});

/* отчёт тестера 4.94.0 (58 лет, колено после операции, поясница): «Бережно» + «Новичок» + беречь колени и поясницу, дом —
   в плане были выкатывание ролика с колен и тяга эспандера на коленях без меток. Теперь: упор на колени — метка «колени»,
   длинный рычаг выкатывания — метка «поясница»; ни одно упражнение с меткой по отмеченному суставу не попадает в план —
   ни в разовую тренировку, ни в неделю, ни в замену (свой план, программа другого места, «Заменить») */
test('gentle, every level, knees and lower back protected, every place: no exercise marked on a protected joint', () => {
  const PLACES = ['gym', 'home', 'homeband', 'street'], FULL = ['chest', 'back', 'shoulders', 'quads', 'hams', 'glutes', 'abs'];
  const SETS = [FULL, ['chest', 'back', 'shoulders'], ['quads', 'hams', 'glutes', 'calves'], ['abs', 'back']];
  const swapAlts = m.get('swapCandidates'), deep = m.get('stressKneeDeep');
  for (const protect of [['knees', 'lumbar'], ['knees'], ['lumbar']]) {
    const bad = rulesOf(protect);
    const clean = (list, what) => { for (const ex of list) assert(!a.stressIdsOf(ex).some(r => bad.has(r)), `${protect} ${what}: ${ex.id} ${a.stressIdsOf(ex)}`); };
    for (const level of ['beg', 'mid', 'adv']) for (const place of PLACES) {
      for (const groups of SETS) for (const seed of [1, 7, 23, 51]) {
        reset({ goal: 'gentle', level, protect, groups, seed, count: 6 }); a.S.place = place; a.ensurePlaces(a.S);
        const p = a.buildPlan();
        clean((p.items || []).map(it => it.ex), `${level} ${place} ${groups} ${seed}`);
        if (protect.includes('knees')) for (const it of p.items || []) assert(!deep(it.ex), `${level} ${place} ${groups} ${seed}: ${it.ex.id} deep knee bend`);
        /* «Заменить» на каждой карточке: кандидаты тоже без меток и, при «Беречь колени», без глубокого сгиба стоя */
        for (const it of (p.items || []).slice(0, 3)) {
          const alts = swapAlts(it.ex, p);
          clean(alts, `swap ${it.ex.id}`);
          if (protect.includes('knees')) for (const x of alts) assert(!deep(x), `swap ${it.ex.id} → ${x.id}: deep knee bend`);
        }
      }
      reset({ goal: 'gentle', level, protect, mode: 'program', days: 3, seed: 7 }); a.S.place = place; a.ensurePlaces(a.S);
      for (const w of [1, 2, 3, 4]) { a.S.week = w; for (const d of a.buildProgram().days) clean((d.plan.items || []).map(it => it.ex), `program ${level} ${place} week ${w}`); }
      /* программа зала дома и на улице: замены недоступного тоже без меток */
      if (place !== 'gym') {
        reset({ goal: 'gentle', level, protect, mode: 'program', days: 3, seed: 7, adapt: 'gym' }); a.S.place = place; a.S.adapt = 'gym'; a.ensurePlaces(a.S);
        for (const d of a.buildProgram().days) clean((d.plan.items || []).map(it => it.ex), `program as in the gym ${level} ${place}`);
      }
    }
  }
  /* именно эти два упражнения: метки есть, в план «дома» не попадают, в своём плане заменяются или не входят */
  assert(a.stressIdsOf(a.EXI.rollout).includes('kneel') && a.stressIdsOf(a.EXI.rollout).includes('lumbarLever'), 'rollout: kneeling and a long lever');
  assert(a.stressIdsOf(a.EXI.bandlatpull).includes('kneel'), 'kneeling band pulldown: kneeling');
  for (const protect of [['knees'], ['lumbar']]) {
    reset({ mode: 'custom', goal: 'gentle', level: 'beg', protect }); a.S.place = 'home'; a.ensurePlaces(a.S);
    a.S.customs = [{ id: 'v1', name: 'Дом', items: [{ id: 'rollout' }, { id: 'bandlatpull' }, { id: 'kneepush' }, { id: 'birddog' }, { id: 'dbrow' }] }]; a.ensureCustoms(a.S); a.openCustom('v1');
    const p = a.buildPlan(), bad = rulesOf(protect);
    for (const it of p.items || []) assert(!a.stressIdsOf(it.ex).some(r => bad.has(r)), `${protect} custom: ${it.ex.id}`);
    const gone = (p.items || []).filter(it => it.sub).map(it => it.sub.from.id).concat((p.lost || []).map(ex => ex.id));
    if (protect[0] === 'knees') for (const id of ['rollout', 'bandlatpull', 'kneepush', 'birddog', 'dbrow']) assert(gone.includes(id), `knees: ${id} is replaced or left out`);
    else assert(gone.includes('rollout') && !gone.includes('bandlatpull'), 'lower back: only the rollout goes');
  }
});
test('gentle + beginner: the kneeling rollout is an advanced exercise and is not picked', () => {
  assert.equal(a.EXI.rollout.lvl, 3, 'ACE: roll-out — advanced');
  let seen = 0;
  for (const level of ['beg', 'mid']) for (const goal of ['gentle', 'mass']) for (const seed of [1, 3, 7, 11, 23, 31, 51, 77]) for (const groups of [['abs'], ['abs', 'back'], ['chest', 'back', 'shoulders', 'quads', 'hams', 'glutes', 'abs']]) {
    reset({ level, goal, seed, groups, count: 6 }); a.S.place = 'home'; a.ensurePlaces(a.S);
    const has = (a.buildPlan().items || []).some(it => it.ex.id === 'rollout');
    if (level === 'beg' || goal === 'gentle') assert(!has, `${level} ${goal} ${groups} ${seed}`); else if (has) seen++;
  }
  assert(seen > 0, 'an intermediate lifter still gets it at home');
});
/* отчёт тренера: при «Беречь колени» гоблет-присед в своём плане заменялся приседом без веса — тот же сгиб колена */
test('knees protected: a substitute does not bend the knee as deep while standing — no air squat instead of a goblet squat', () => {
  const deep = m.get('stressKneeDeep'), depth = m.get('stressKneeDepth');
  for (const place of ['home', 'homeband', 'street', 'gym']) for (const id of ['goblet', 'squat', 'lunge', 'kbfrontsquat', 'stepup', 'legpress']) {
    reset({ mode: 'custom', protect: ['knees'] }); a.S.place = place; a.ensurePlaces(a.S);
    a.S.customs = [{ id: 'g1', name: 'Ноги', items: [{ id }] }]; a.ensureCustoms(a.S); a.openCustom('g1');
    const p = a.buildPlan();
    for (const it of p.items || []) {
      assert(!a.stressIdsOf(it.ex).some(r => rulesOf(['knees']).has(r)), `${place} ${id}: ${it.ex.id}`);
      assert(!deep(it.ex), `${place}: ${id} → ${it.ex.id}, standing knee ${depth(it.ex).toFixed(0)}°`);
    }
    if (!(p.items || []).length) assert((p.lost || []).some(ex => ex.id === id), `${place} ${id}: said it has no substitute`);
  }
  /* без «Беречь колени» прежний подбор: присед без веса — обычная замена гоблета дома без гантелей */
  reset({ mode: 'custom' }); a.S.place = 'homeband'; a.ensurePlaces(a.S);
  a.S.customs = [{ id: 'g2', name: 'Ноги', items: [{ id: 'goblet' }] }]; a.ensureCustoms(a.S); a.openCustom('g2');
  assert((a.buildPlan().items || []).length, 'something replaces the goblet squat without protection');
});
test('knees protected: no standing deep knee bend is picked at all, even without weight; the reason is shown', () => {
  const deep = m.get('stressKneeDeep');
  assert(deep(a.EXI.airsquat), 'the air squat bends the knee past the threshold while standing');
  for (const goal of ['mass', 'gentle', 'strength']) for (const level of ['beg', 'mid', 'adv']) for (const place of ['gym', 'home', 'homeband', 'street']) for (const seed of [1, 7, 23]) {
    reset({ goal, level, protect: ['knees'], groups: ['quads', 'glutes', 'hams', 'calves'], seed, count: 6 }); a.S.place = place; a.ensurePlaces(a.S);
    for (const it of a.buildPlan().items || []) assert(!deep(it.ex), `${goal} ${level} ${place} ${seed}: ${it.ex.id}`);
  }
  reset({ protect: ['knees'] });
  assert.equal(a.unfitWhy(a.EXI.airsquat), 'глубокий сгиб колена');
  reset({ mode: 'custom', protect: ['knees'] }); a.S.place = 'homeband'; a.ensurePlaces(a.S);
  a.S.customs = [{ id: 'k1', name: 'Ноги', items: [{ id: 'airsquat' }] }]; a.ensureCustoms(a.S); a.openCustom('k1');
  const p = a.buildPlan();
  assert(!(p.items || []).some(it => it.ex.id === 'airsquat'), 'the air squat is replaced or left out of a custom plan');
  /* без «Беречь колени» присед без веса подбирается как раньше */
  reset({ groups: ['quads', 'glutes', 'hams', 'calves'] }); a.S.place = 'street'; a.ensurePlaces(a.S);
  assert(a.fitsBody(a.EXI.airsquat), 'no protection — the air squat fits');
});

test('custom plan: an exercise that loads a protected joint is replaced and says why; nothing silently lost', () => {
  reset({ mode: 'custom', protect: ['knees'], groups: ['quads', 'chest'] });
  a.S.customs = [{ id: 'p1', name: 'Ноги', items: [{ id: 'squat' }, { id: 'legext' }, { id: 'dbbench' }] }]; a.ensureCustoms(a.S); a.openCustom('p1');
  const p = a.buildPlan(), knee = rulesOf(['knees']);
  assert.equal(p.items.length + p.lost.length, 3);
  for (const it of p.items) assert(!a.stressIdsOf(it.ex).some(r => knee.has(r)), it.ex.id);
  const sub = p.items.find(it => it.sub && it.sub.from.id === 'squat');
  if (sub) assert.match(sub.sub.note, /нагружает колени/, 'the card says why it was replaced');
  assert(p.items.some(it => it.ex.id === 'dbbench' && !it.sub), 'the bench press stays');
  assert.deepEqual(plain(a.customOf().items.map(i => i.id)), ['squat', 'legext', 'dbbench'], 'the saved plan itself is not changed');
  if (p.lost.length) assert(a.lostMessages(p.lost, p.E).some(t => /Бережный режим: нечем заменить/.test(t)));
  assert.equal(a.unfitWhy(a.EXI.squat), 'нагружает колени', 'only the protected joint is named');
  a.S.protect = ['knees', 'lumbar'];
  assert.equal(a.unfitWhy(a.EXI.squat), 'нагружает поясницу и колени', 'accusative names, joined');
});

test('settings: unknown joints dropped, kept in the backup; a gentle plan travels in a plan file', () => {
  reset();
  a.S.protect = ['knees', 'nose', 'knees', 'neck']; a.ensureProtect(a.S);
  assert.deepEqual(plain(a.S.protect), ['neck', 'knees'], 'known ids, catalogue order, no duplicates');
  a.S.protect = 'broken'; a.ensureProtect(a.S); assert.deepEqual(plain(a.S.protect), []);
  a.S.protect = ['lumbar'];
  assert.deepEqual(plain(m.get('backupObject()')).settings.protect, ['lumbar']);
  a.S.customs = [{ id: 'p1', name: 'Реабилитация', goal: 'gentle', format: 'classic', level: 'beg', items: [{ id: 'legpress' }] }]; a.ensureCustoms(a.S);
  const read = plain(a.readPlanFile(JSON.stringify(a.planFileObject([a.S.customs[0]], ''))));
  assert.equal(read.plans[0].goal, 'gentle');
});
