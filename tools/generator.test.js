'use strict';
/* Генератор как у тренера (11-planner.js; отчёт тестеров 4.94.0 — Марина п. 11–16, Дмитрий, Alex п. 25):
   жимы и тяги поровну, порядок, схема подходов по типу упражнения (schemeOf), не больше двух тяжёлых упражнений
   с нагрузкой на позвоночник, круговая без штанги, посильно новичку, в зале — веса вместо облегчённых вариантов,
   объём недели в шкале «мало / много» по уровню (volScale). */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get(`({S, buildPlan, buildProgram, prescribe, ensurePlaces, PLACE_DEFAULTS, GROUP_PRESETS, ensureCustoms, ensureProtect, ensureDur, EXI, EX, PATTERN,
  schemeOf, sideOf, HEAVY_SPINE, spineCap, PROG_BEG_HARD, FIXED_EQ, SPLITS, DAY_T, GOALS, WEEKS, volScale, volRow, effEquip, CTRL_LOAD, tempoWords})`);
const FULL = a.GROUP_PRESETS.find(p => p.id === 'full').g, UPPER = a.GROUP_PRESETS.find(p => p.id === 'upper').g;
const PLACES = ['gym', 'home', 'street', 'homeband'], LEVELS = ['beg', 'mid', 'adv'], GOALS = ['strength', 'mass', 'cut', 'gentle'], FORMATS = ['classic', 'superset', 'circuit', 'static'];
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: FULL.slice(), seed: 7, fav: [], customs: [], custom: null,
    gen: null, protect: [], days: 3, split: null, week: 1, day: 0, focus: null, logPick: null, dur: null }, extra);
  a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensureDur(a.S);
  m.get('AR.light = false; swaps = S.swaps = {};');
}
const ids = p => p.items.map(it => it.ex.id);
const circOf = p => p.blocks[0].kind === 'circuit' ? p.blocks[0] : null;
/* подходы на жимы и тяги: в круговой — круги, в суперсетах — подходы пары */
function pp(p) {
  const c = circOf(p); let push = 0, pull = 0;
  for (const it of p.items) { const k = c ? c.rounds : it.rx.sets, s = a.sideOf(it.ex); if (s === 'push') push += k; if (s === 'pull') pull += k; }
  return { push, pull };
}
const bothSides = groups => { const G = new Set(groups); return G.has('back') && (G.has('chest') || G.has('shoulders')); };
/* одиночные тренировки по сетке: место × уровень × цель × формат × «всё тело» и «верх» × время */
const singles = [];
for (const place of PLACES) for (const level of LEVELS) for (const goal of GOALS) for (const format of FORMATS)
  for (const [gn, groups] of [['full', FULL], ['upper', UPPER]]) for (const dur of [null, 'mid']) {
    reset({ place, level, goal, format, groups: groups.slice(), dur });
    singles.push({ tag: `${place} ${level} ${goal} ${format} ${gn} ${dur || '-'}`, place, level, goal, format, groups, p: a.buildPlan(), spineCap: a.spineCap() });
  }
/* недели: место × уровень × цель × сплит */
const WEEK_SPLITS = [[2, 'full'], [3, 'full'], [3, 'ppl'], [4, 'ul'], [4, 'full'], [5, 'ppl'], [5, 'ul']];
const weeks = [];
for (const place of PLACES) for (const level of LEVELS) for (const goal of GOALS) for (const [days, split] of WEEK_SPLITS) {
  reset({ place, level, goal, mode: 'program', days, split });
  weeks.push({ tag: `${place} ${level} ${goal} ${days}×${split}`, place, level, goal, split, pr: a.buildProgram(), spineCap: a.spineCap() });
}

test('pushes and pulls: in every workout with back and chest or shoulders, sets on pulls are not fewer than on presses', () => {
  let n = 0;
  for (const s of singles) {
    if (!s.p.items || !bothSides(s.groups)) continue;
    const { push, pull } = pp(s.p); n++;
    assert(pull >= push, `${s.tag}: presses ${push} : pulls ${pull} — ${ids(s.p)}`);
  }
  assert(n > 700, 'checked ' + n);
  /* было (Марина п. 12): «Верх», зал, масса, средний — 4 жима (16 подходов) против 2 тяг (8) */
  reset({ groups: UPPER.slice() });
  const p = a.buildPlan(), r = pp(p);
  assert(r.pull >= r.push && r.push >= 8, `upper body: ${r.push}:${r.pull} — ${ids(p)}`);
});

test('week program: every day with both sides is balanced, the week too; push / pull / legs — within one exercise', () => {
  for (const w of weeks) {
    let push = 0, pull = 0, most = 0;
    for (const d of w.pr.days) {
      if (!d.plan.items) continue;
      const r = pp(d.plan); push += r.push; pull += r.pull;
      most = Math.max(most, ...d.plan.items.map(it => it.rx.sets));
      if (bothSides(d.plan.groups || a.DAY_T[d.tid].g)) assert(r.pull >= r.push, `${w.tag}, ${d.name}: ${r.push}:${r.pull} — ${ids(d.plan)}`);
    }
    /* «жим / тяга / ноги»: день жима без спины — не больше двух жимов, день тяги добирает за него */
    if (w.split === 'ppl') assert(pull >= push - most, `${w.tag}: week ${push}:${pull}`);
    else assert(pull >= push, `${w.tag}: week ${push}:${pull}`);
  }
});

test('order: big and complex first, upper-body presses and pulls alternate — pulls are not always last', () => {
  let pullFirst = 0, n = 0;
  for (const s of singles) {
    if (!s.p.items || s.format !== 'classic' || !bothSides(s.groups)) continue;
    const order = s.p.blocks.flatMap(b => b.items).map(it => it.ex), side = order.filter(ex => ex.type === 'c' && ex.g !== 'abs' && a.sideOf(ex)).map(ex => a.sideOf(ex));
    for (let i = 1; i < side.length; i++) if (side[i] === side[i - 1]) assert(!side.slice(i).some(x => x !== side[i]), `${s.tag}: ${side.join(' ')} — presses and pulls must alternate`);
    const firstIso = order.findIndex(ex => ex.type !== 'c'), lastComp = order.map(ex => ex.type === 'c' && ex.g !== 'abs').lastIndexOf(true);
    assert(firstIso < 0 || firstIso > lastComp, `${s.tag}: compounds before isolation — ${order.map(ex => ex.id)}`);
    if (side.length) { n++; if (side[0] === 'pull') pullFirst++; }
  }
  assert(pullFirst > 0 && pullFirst < n, `pulls lead in ${pullFirst} of ${n} workouts`);
  /* было: подтягивания обратным хватом — последними после четырёх жимов; теперь тяги идут вперемежку с жимами */
  reset({ groups: UPPER.slice() });
  const order = a.buildPlan().blocks.flatMap(b => b.items).map(it => it.ex), sides = order.map(ex => a.sideOf(ex));
  assert(sides.indexOf('pull') < sides.lastIndexOf('push'), order.map(ex => ex.id).join(' '));
});

test('strength scheme (3–5 reps, percent of max) only for heavy basics; bodyweight, bands, one-arm kettlebell and mobility have their own', () => {
  for (const goal of GOALS) for (const level of LEVELS) {
    reset({ goal, level });
    const E = a.effEquip(a.PLACE_DEFAULTS[0].equip);
    for (const ex of a.EX) for (const week of [null, a.WEEKS[1], a.WEEKS[3]]) {
      const r = a.prescribe(ex, week, E), sch = a.schemeOf(ex), tag = `${goal} ${level} ${ex.id} (${sch})`;
      if (r.static) continue;
      assert.equal(/от максимума/.test(r.load), sch === 'heavy', `${tag}: percent only for heavy basics — ${r.load}`);
      if (goal === 'strength' && sch !== 'heavy' && sch !== 'cardio' && !ex.doseReps) assert.notEqual(r.reps, '3–5', `${tag}: no 3–5 strength reps`);
      if (r.tempo && /X/i.test(r.tempo)) assert.equal(sch, 'heavy', `${tag}: fast lifting only for heavy basics — ${r.tempo}`);
      if (sch === 'ctrl') { assert.equal(r.tempo, null, tag); assert(r.load.startsWith(a.CTRL_LOAD), `${tag}: ${r.load}`); assert(!/взрывно/.test(r.load), tag); }
      if (!ex.eq.length && !(ex.opt || []).length) assert(!/от максимума/.test(r.load), `${tag}: bodyweight has no percent`);
    }
  }
  /* было (Марина п. 13–14): «Сила», опытный — гало с гирей и обратные отжимания 6×3–5 «≈80–90%», ролик 5×3–5 с быстрым усилием */
  reset({ goal: 'strength', level: 'adv' });
  const E = a.effEquip(a.PLACE_DEFAULTS[0].equip);
  for (const id of ['kbhalo', 'benchdip', 'rollout', 'kbtgu', 'plankup', 'pushup', 'bandrow']) {
    const r = a.prescribe(a.EXI[id], null, E);
    assert(r.sets <= 3 && r.reps !== '3–5' && !/от максимума/.test(r.load) && !/быстр/.test(a.tempoWords(r.tempo || '')), `${id}: ${r.sets}×${r.reps} · ${r.load} · ${r.tempo}`);
  }
  for (const id of ['squat', 'bbbench', 'deadlift', 'latpull', 'legpress', 'dbbench']) {
    const r = a.prescribe(a.EXI[id], null, E);
    assert(r.reps === '3–5' && /от максимума/.test(r.load), `${id} keeps the strength scheme: ${r.reps} · ${r.load}`);
  }
});

test('Turkish get-up: slow, 1–3 per side, never heavy — and never for a beginner (level 3)', () => {
  const E = a.effEquip(['kb']);
  for (const goal of GOALS) for (const level of LEVELS) {
    reset({ goal, level });
    const r = a.prescribe(a.EXI.kbtgu, null, E);
    assert.equal(r.reps, '1–3', `${goal} ${level}`); assert.equal(r.tempo, null); assert(!/от максимума/.test(r.load), r.load);
    assert(r.work >= 40, `a get-up takes time: ${r.work} s per set`);
  }
  assert.equal(a.EXI.kbtgu.lvl, 3);
  for (const s of singles) if (s.level === 'beg' && s.p.items) assert(!ids(s.p).includes('kbtgu') && s.p.items.every(it => it.ex.lvl <= 2), s.tag);
  for (const w of weeks) if (w.level === 'beg') for (const d of w.pr.days) if (d.plan.items) assert(!ids(d.plan).includes('kbtgu'), w.tag);
});

test('heavy lifts that load the spine: at most two per workout (one for beginners and «Gentle»), one floor pull or hinge', () => {
  const check = (p, cap, tag) => {
    if (!p.items) return;
    const sp = p.items.filter(it => a.HEAVY_SPINE.has(it.ex.id)), hinge = sp.filter(it => a.PATTERN[it.ex.id] === 'hinge');
    assert(sp.length <= cap && hinge.length <= 1, `${tag}: ${sp.map(it => it.ex.id)}`);
  };
  for (const s of singles) check(s.p, s.spineCap, s.tag);
  for (const w of weeks) for (const d of w.pr.days) check(d.plan, w.spineCap, `${w.tag}, ${d.name}`);
  /* было (Марина п. 13): «Сила», всё тело, средний — присед, становая и тяга в наклоне 5×3–5, ≈102 мин */
  reset({ goal: 'strength' });
  const p = a.buildPlan();
  assert(p.items.filter(it => a.HEAVY_SPINE.has(it.ex.id)).length <= 2 && p.minutes < 102, `${ids(p)} ≈${p.minutes} min`);
});

test('circuit: no barbell, no slow skills; moving between machines takes at least 30 s', () => {
  let n = 0;
  for (const s of singles) {
    const c = s.p.items && circOf(s.p); if (!c) continue; n++;
    for (const it of s.p.items) {
      assert(!it.eqIds.includes('bb'), `${s.tag}: ${it.ex.id} with a barbell in a circuit`);
      assert(!it.ex.doseReps, `${s.tag}: ${it.ex.id} is a slow skill`);
      assert(!['deadlift', 'squat', 'bbbench', 'inclinebb', 'ohp', 'bbrow'].includes(it.ex.id), `${s.tag}: ${it.ex.id}`);
    }
    if (s.p.items.some(it => it.eqIds.some(id => a.FIXED_EQ.has(id)))) assert(c.rest >= 30, `${s.tag}: ${c.rest} s to move between machines`);
  }
  assert(n >= 190, 'circuits checked: ' + n);
  /* дома с гантелями и лентой станции под рукой — переход по цели (рельеф — 15 с) */
  reset({ place: 'home', goal: 'cut', format: 'circuit' });
  const p = a.buildPlan();
  if (!p.items.some(it => it.eqIds.some(id => a.FIXED_EQ.has(id)))) assert.equal(circOf(p).rest, a.GOALS.cut.circ.rest);
});

test('beginner: the easy step of a progression first, short holds, nothing of level 3', () => {
  const fam = x => x === 'ipush' || x === 'dpush' ? 'hpush' : x;
  for (const s of singles) {
    /* в «Бережно» лёгкий вариант может нагружать сустав (отжимания с колен — упор на колени): там решает метка */
    if (s.level !== 'beg' || !s.p.items || s.goal === 'gentle') continue;
    for (const it of s.p.items) {
      assert(it.ex.lvl <= 2, `${s.tag}: ${it.ex.id}`);
      if (it.ex.kind === 'time' && it.ex.g !== 'cardio' && !circOf(s.p)) assert.equal(it.rx.reps, '20–30 с', `${s.tag}: ${it.ex.id} hold`);
      if (!a.PROG_BEG_HARD.has(it.ex.id)) continue;
      const pt = fam(a.PATTERN[it.ex.id]);
      const easier = s.p.pool.filter(b => !a.PROG_BEG_HARD.has(b.id) && b.lvl <= 2 && fam(a.PATTERN[b.id]) === pt && b !== it.ex);
      const easyIn = s.p.items.some(x => x.ex !== it.ex && !a.PROG_BEG_HARD.has(x.ex.id) && fam(a.PATTERN[x.ex.id]) === pt);
      assert(!easier.length || easyIn, `${s.tag}: ${it.ex.id} while ${easier.map(b => b.id)} is there`);
    }
  }
  /* было (Марина п. 16): новичку дома — отжимания от пола 2×12–15, «тяга под столом», планка 45–60 с */
  for (const dur of [null, 'mid']) {
    reset({ place: 'home', level: 'beg', goal: 'cut', dur });
    const p = a.buildPlan(), got = ids(p);
    assert(!['pushup', 'widepush', 'tablerow', 'pikepush'].some(id => got.includes(id)), got.join(' '));
    for (const it of p.items) if (it.ex.kind === 'time') assert.equal(it.rx.reps, '20–30 с', it.ex.id);
  }
});

test('gym, intermediate and advanced: weights and machines instead of the assisted machine and bodyweight presses or rows', () => {
  const LIGHT = new Set(['pushup', 'kneepush', 'widepush', 'diamond', 'declinepush', 'inclinepush', 'wallpush', 'archer', 'pikepush', 'declinepike', 'invrow', 'towelrow', 'tablerow']);
  for (const s of singles) {
    if (s.place !== 'gym' || s.level === 'beg' || !s.p.items) continue;
    for (const it of s.p.items) assert(!it.ex.assist && !LIGHT.has(it.ex.id), `${s.tag}: ${it.ex.id}`);
  }
  /* было (Марина п. 11): «Чт · Верх Б», зал, масса, средний — гравитрон и отжимания 4×6–10 */
  reset({ mode: 'program', days: 4, split: 'ul' });
  const pr = a.buildProgram();
  for (const d of pr.days) if (d.plan.items) assert(!d.plan.items.some(it => it.ex.assist), `${d.name}: ${ids(d.plan)}`);
});

test('the weekly scale depends on the level; groups no day targets are «indirect», not «low»', () => {
  const sc = () => JSON.parse(JSON.stringify(a.volScale()));
  reset({ level: 'beg' }); assert.deepEqual(sc(), { lo: 4, hi: 12 });
  reset({ goal: 'gentle', level: 'adv' }); assert.deepEqual(sc(), { lo: 4, hi: 12 });
  reset({ level: 'mid' }); assert.deepEqual(sc(), { lo: 10, hi: 20 });
  reset({ level: 'adv' }); assert.deepEqual(sc(), { lo: 10, hi: 20 });
  reset({ level: 'beg' });
  assert.match(a.volRow('chest', 9, 22), /<li class="ok">.*в норме/, 'beginner: chest 9 is on target (Olga, item 12)');
  assert.match(a.volRow('forearms', 4, 22, '', '', false), /<li class="side">.*попутно/);
  assert.match(a.volRow('back', 14, 22, '', '', false), /много/, '«high» is shown even for an indirect group');
  reset({ level: 'mid' });
  assert.match(a.volRow('chest', 9, 22), /мало/);
});

/* недели тестеров: программа сама в своей шкале (Alex п. 25: «Спина 28 и Плечи 25,5 — много, Икры 1,5 — мало») */
const inScale = (pr, tol = 0) => {
  const sc = a.volScale(), targets = new Set(pr.days.flatMap(d => a.DAY_T[d.tid].g)), out = [];
  for (const g of targets) { if (g === 'cardio') continue; const v = Math.round((pr.gvol[g] || 0) * 2) / 2; if (v < sc.lo - tol || v > sc.hi + tol) out.push(`${g} ${v}`); }
  return out;
};
test('tester weeks land on the scale: Full body ×3 (gym), Anna at home, Igor upper/lower ×4', () => {
  reset({ mode: 'program', days: 3, split: 'full' });
  assert.deepEqual(inScale(a.buildProgram()), [], 'Full body ×3, gym, mass, intermediate');
  reset({ mode: 'program', days: 3, split: 'full', place: 'home', level: 'beg', goal: 'cut' });
  assert.deepEqual(inScale(a.buildProgram()), [], 'Anna: home, beginner, definition');
  /* верх / низ ×4: спина получает и тяги, и вспомогательную работу в днях ног — допуск в один подход */
  reset({ mode: 'program', days: 4, split: 'ul' });
  assert.deepEqual(inScale(a.buildProgram(), 1), [], 'Igor: upper / lower ×4, gym, mass');
});

/* Общий счёт по сетке: зал и дом × уровень × цель × «всё тело» ×3 и «верх / низ» ×4 × 6 упражнений и 45 минут.
   Было в 4.104.0 до правки: «мало» 153, «много» 224 из 960 групп-недель (по шкале по уровню; со старой шкалой 10–20 для
   всех — 386 и 114). Стало: 47 и 18. Числа ниже — только убывают. */
const GRID_LIMIT = { lo: 47, hi: 18 };
test('weekly volume across the grid: few groups outside the scale (numbers only go down)', () => {
  let lo = 0, hi = 0, n = 0;
  for (const place of ['gym', 'home']) for (const level of LEVELS) for (const goal of GOALS) for (const [days, split] of [[3, 'full'], [4, 'ul']]) for (const dur of [null, 'mid']) {
    reset({ place, level, goal, mode: 'program', days, split, dur });
    const pr = a.buildProgram(), sc = a.volScale();
    for (const g of new Set(pr.days.flatMap(d => a.DAY_T[d.tid].g))) {
      if (g === 'cardio') continue; n++;
      const v = Math.round((pr.gvol[g] || 0) * 2) / 2;
      if (v < sc.lo) lo++; if (v > sc.hi) hi++;
    }
  }
  assert(lo <= GRID_LIMIT.lo && hi <= GRID_LIMIT.hi, `${n} group-weeks: low ${lo} (limit ${GRID_LIMIT.lo}), high ${hi} (limit ${GRID_LIMIT.hi})`);
});

test('a swap in one day does not change the other days; loading and deload weeks keep the exercises', () => {
  reset({ mode: 'program', days: 3, split: 'full' });
  const before = a.buildProgram().days.map(d => ids(d.plan));
  m.get(`swaps.d0 = {0: 'legpress'}`);
  const after = a.buildProgram().days.map(d => ids(d.plan));
  assert.deepEqual(after.slice(1), before.slice(1));
  m.get('swaps = S.swaps = {}');
  for (const wk of [2, 3, 4]) { a.S.week = wk; assert.deepEqual(a.buildProgram().days.map(d => ids(d.plan)), before, 'week ' + wk); }
});
