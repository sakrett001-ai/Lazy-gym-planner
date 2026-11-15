'use strict';
/* «Беречь колени», «После операции на колене», «Беречь поясницу», «Грыжа диска» по всей сетке генератора (как в
   tools/generator.test.js: места × уровни × цели × форматы × «всё тело» и «верх» / ноги × время; неделя — сплиты и недели
   цикла): ни в одной тренировке, ни в одном дне недели и ни в одной замене («Заменить», свой план) нет упражнения, которое
   отметка запрещает. Запрещает: метка по отмеченному суставу (09f-joint-stress.js), строгие правила отметки (STRICT,
   11g-gentle.js: поворот на опорной ноге после операции на колене, удар — при грыже диска) и глубокий сгиб колена стоя. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S, buildPlan, buildProgram, ensurePlaces, PLACE_DEFAULTS, GROUP_PRESETS, ensureCustoms, ensureProtect, ensureDur, ensurePain, EXI, EX,
  PROTECT_BY, stressIdsOf, stressPivot, STRESS_PIVOT, stressKneeDeep, swapCandidates, openCustom, unfitWhy})`);
const FULL = a.GROUP_PRESETS.find(p => p.id === 'full').g, UPPER = a.GROUP_PRESETS.find(p => p.id === 'upper').g, LEGS = ['quads', 'glutes', 'hams', 'calves'], CARDIO = ['cardio', 'abs'];
const PLACES = ['gym', 'home', 'street', 'homeband'], LEVELS = ['beg', 'mid', 'adv'], GOALS = ['strength', 'mass', 'cut', 'gentle'], FORMATS = ['classic', 'superset', 'circuit', 'static'];
const WEEK_SPLITS = [[2, 'full'], [3, 'full'], [3, 'ppl'], [4, 'ul'], [5, 'ppl'], [5, 'ul']];
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: FULL.slice(), seed: 7, fav: [], customs: [], custom: null,
    gen: null, protect: [], days: 3, split: null, week: 1, day: 0, focus: null, logPick: null, dur: null, pain: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensureDur(a.S); a.ensurePain(a.S);
  m.get('AR.light = false; swaps = S.swaps = {};');
}
/* что запрещает отметка — по меткам и строгим правилам, независимо от подбора */
const FLAGS = {
  knees: { rules: new Set(a.PROTECT_BY.knees.rules), deep: true },
  kneeOp: { rules: new Set(a.PROTECT_BY.knees.rules), deep: true, extra: ex => a.stressPivot(ex) >= a.STRESS_PIVOT },
  lumbar: { rules: new Set(a.PROTECT_BY.lumbar.rules) },
  disc: { rules: new Set(a.PROTECT_BY.lumbar.rules), extra: ex => a.stressIdsOf(ex).includes('landing') }
};
const forbidden = (flag, ex) => { const F = FLAGS[flag]; return a.stressIdsOf(ex).some(r => F.rules.has(r)) || (F.deep && a.stressKneeDeep(ex)) || (F.extra && F.extra(ex)); };
const why = (flag, ex) => `${ex.id} [${a.stressIdsOf(ex).filter(r => FLAGS[flag].rules.has(r)).join(',')}${FLAGS[flag].extra && FLAGS[flag].extra(ex) ? ' strict' : ''}${FLAGS[flag].deep && a.stressKneeDeep(ex) ? ' deep' : ''}]`;

for (const flag of Object.keys(FLAGS)) {
  test(`${flag}: no forbidden exercise in any single workout or its substitutes, over the generator grid`, () => {
    let plans = 0, empty = 0, swaps = 0;
    for (const place of PLACES) for (const level of LEVELS) for (const goal of GOALS) for (const format of FORMATS)
      for (const groups of [FULL, UPPER, LEGS, CARDIO]) for (const dur of [null, 'mid']) {
        reset({ place, level, goal, format, groups: groups.slice(), dur, protect: [flag] });
        const p = a.buildPlan(); plans++;
        if (!p.items) { empty++; continue; }
        for (const it of p.items) assert(!forbidden(flag, it.ex), `${flag} ${place} ${level} ${goal} ${format} ${groups[0]} ${dur || '-'}: ${why(flag, it.ex)}`);
        /* «Заменить» — на каждом третьем плане, у первых двух карточек */
        if (plans % 3 === 0) for (const it of p.items.slice(0, 2)) for (const x of a.swapCandidates(it.ex, p)) { swaps++; assert(!forbidden(flag, x), `${flag} swap ${it.ex.id} → ${why(flag, x)}`); }
      }
    assert(plans - empty > plans * 0.6, `${flag}: most workouts are not empty (${empty} of ${plans} empty)`);
    assert(swaps > 100, `${flag}: substitutes checked: ${swaps}`);
  });
  test(`${flag}: no forbidden exercise in any day of the week program`, () => {
    for (const place of PLACES) for (const level of LEVELS) for (const goal of GOALS) for (const [days, split] of WEEK_SPLITS) for (const week of [1, 3]) {
      reset({ place, level, goal, mode: 'program', days, split, week, protect: [flag] });
      for (const d of a.buildProgram().days) for (const it of d.plan.items || []) assert(!forbidden(flag, it.ex), `${flag} week ${place} ${level} ${goal} ${days}×${split} w${week} ${d.name}: ${why(flag, it.ex)}`);
    }
  });
}

test('custom plan: forbidden exercises are replaced or left out with the reason, for every flag', () => {
  const ids = ['bandlegext', 'legext', 'mountain', 'copenhagen', 'bandadduct', 'cableadduct', 'crunch', 'hyper', 'superman', 'bicycle', 'lyinglegraise', 'legraise',
    'sidebend', 'cablewood', 'pullthrough', 'ohp', 'kbpress', 'farmer', 'shrug', 'jumpsquat', 'kbwindmill'];
  for (const flag of Object.keys(FLAGS)) for (const place of ['gym', 'home', 'homeband']) {
    reset({ mode: 'custom', protect: [flag], place });
    a.S.customs = [{ id: 'g1', name: 'Всё', items: ids.map(id => ({ id })) }]; a.ensureCustoms(a.S); a.openCustom('g1');
    const p = a.buildPlan();
    for (const it of p.items || []) assert(!forbidden(flag, it.ex), `${flag} ${place} custom: ${why(flag, it.ex)}`);
    /* не вошедшее из-за отметки — с причиной словами */
    for (const ex of p.lost || []) if (forbidden(flag, ex)) assert(a.unfitWhy(ex), `${flag} ${place}: ${ex.id} left out without a reason`);
  }
});

test('strict flags switch on the ordinary ones and stay compatible with older state files', () => {
  reset({ protect: ['kneeOp'] });
  assert.deepEqual(JSON.parse(JSON.stringify(a.S.protect)), ['knees', 'kneeOp'], 'after knee surgery — knees too');
  reset({ protect: ['disc', 'neck'] });
  assert.deepEqual(JSON.parse(JSON.stringify(a.S.protect)), ['neck', 'lumbar', 'disc'], 'disc herniation — lower back too, catalogue order');
  /* прежняя версия знает только обычные отметки: строгие отбрасывает, обычные остаются в том же списке */
  const old = ['neck', 'shoulders', 'elbows', 'wrists', 'lumbar', 'knees', 'achilles', 'hams'];
  assert.deepEqual(JSON.parse(JSON.stringify(a.S.protect)).filter(id => old.includes(id)), ['neck', 'lumbar']);
  /* строже обычной: после операции — без поворота на опорной ноге, при грыже — без прыжков */
  reset({ protect: ['knees'] }); assert(!/поворот/.test(a.unfitWhy(a.EXI.cablewood)), 'knees alone: the woodchop is not stopped by the pivot rule');
  reset({ protect: ['kneeOp'] }); assert.match(a.unfitWhy(a.EXI.kbtgu) || a.unfitWhy(a.EXI.cablewood), /поворот|нагружает/);
  reset({ protect: ['lumbar'] }); const jumpL = a.unfitWhy(a.EXI.jumpingjack);
  reset({ protect: ['disc'] }); assert.match(a.unfitWhy(a.EXI.jumpingjack), /ударная/, 'disc: no jumping jacks; lower back alone: ' + (jumpL || 'allowed'));
});
