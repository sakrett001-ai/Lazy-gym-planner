'use strict';
/* Цвет по фазам согласован с работой мышц (аудит анатомии 4.53.0, находка 8; этап А). В «Анатомии» с «Мышцами по фазам»
   мышца горит по учебному профилю упражнения; правило — основные мышцы в рабочей (концентрической) фазе укорачиваются и
   горят ярче всего. Замер — tools/muscles/phase.js: длина каждой части мышцы (линии одной части, стороны раздельно) в
   начале и в конце рабочей фазы на запечённой позе и её яркость в середине рабочей фазы — то значение, которое muscleTint
   (src/volume/muscles.mjs) переводит в цвет.
   Проверяется весь каталог (кроме удержаний и циклов — у них цвет не делится на подъём и возврат):
   - яркая часть («сильное участие», ≥ 0,72) не удлиняется в рабочей фазе больше чем на 1 см и 5 % (5 % — почти
     изометрия: так меняет длину прямая бедра в приседании, Ломбардов парадокс), заметная (0,45–0,72) — больше чем на
     2 см и 10 %; противоречия — только перечисленные исключения с причинами (список не пополнять без причины:
     исправленное исключение тест требует убрать);
   - у основных групп самая яркая фаза — рабочая (уступающий акцент — только перечисленные упражнения);
   - где мышца обязана гореть и где молчать — по ЭМГ и анатомии (как tools/joint-stress.test.js);
   - у упражнений на одну сторону нерабочая сторона — цветом покоя профиля. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const P = require('./muscles/phase.js');

const BRIGHT = .72, NOTICE = .45, OFF = .35, ON = .45;
const LONGER = { bright: [1, .05], notice: [2, .10] };
/* Исключения: [причина, {упражнение: [части]}]. Часть — семейство мышцы (tools/muscles/pack.js, PARTS). */
const EXCEPT = [
  ['Средняя часть трапециевидной сводит лопатки, вверх её не поворачивает (поворачивают верхняя и нижняя части ' +
   'трапециевидной и передняя зубчатая — Neumann, Kinesiology of the Musculoskeletal System, 3-е изд., 2017, гл. 5): при ' +
   'повороте лопатки вверх по ритму (Ludewig и др., 2009; этап Д) её линии DAS3 к ости лопатки удлиняются — в жимах сидя от ' +
   'уровня ушей или подбородка до рук над головой на 5–7 см (14–22 %); сведение ключицы по ритму этого не покрывает (в жиме ' +
   'стоя от груди длина почти не меняется). Мышца держит лопатку против передней зубчатой, цвет — по профилю.',
  { dbpress: ['trapmid'], smithohp: ['trapmid'] }],
  ['Передняя зубчатая в жиме над головой: лопатка поворачивается вверх по ритму (Ludewig и др., 2009; этап Д) — нижние линии ' +
   'DAS3 (1–5, к нижнему углу; они и поворачивают лопатку вверх) укорачиваются на 1–6 см, верхние (7–12, к верхнему углу и ' +
   'медиальному краю) удлиняются на 3–8 см, и сумма линий части растёт на 16–19 %. По ЭМГ передняя зубчатая — основная мышца ' +
   'поворота лопатки вверх при подъёме руки выше 120° (Ekstrom и др., 2003); цвет — по профилю.',
  { ohp: ['serrant'], arnold: ['serrant'], kbpress: ['serrant'] }],
  ['Малая грудная в жиме лёжа: лопатки сведены и прижаты к скамье всё движение (подсказка), а рука идёт из горизонтального ' +
   'отведения (локти ниже скамьи) к сгибанию над грудью — по ритму лопатка поворачивается вверх и наклоняется назад, ' +
   'клювовидный отросток уходит от рёбер, и малая грудная (опускает и выводит лопатку вперёд — OpenStax A&P 2e, 11.5) ' +
   'удлиняется на 3 см (7 %). Цвет — общий с грудными (область «малая грудная» в профиле груди).',
  { bbbench: ['pecmin'] }],
  ['Тяга сверху широким хватом к груди: внизу локти уходят за плоскость корпуса (≈ 35°), лопатки сводятся и опускаются ' +
   '(подсказка), плечевой сустав уходит назад — грудинная часть большой грудной удлиняется на 7,7 см (11 %); тянет она в ' +
   'верхней части движения (разгибание поднятого плеча). Цвет — по профилю.',
  { latpull: ['pecm2'] }],
  ['Y-T-W — три подъёма за повторение: «рабочая фаза» t 0→1 идёт от удержания Y (рука над головой, θ ≈ 135°) к удержанию W ' +
   '(локти согнуты, θ ≈ 55°), и средняя дельтовидная в W длиннее, чем в Y, на 2,4 см; работает она в каждой букве, удерживая ' +
   'руки на весу. Цвет — по профилю.',
  { ytw: ['delt2'] }],
  ['«Обратный снежный ангел»: руки идут над голову — лопатка поворачивается вверх, ромбовидные (поворачивают её вниз) и задняя ' +
   'дельтовидная держат лопатки и руки на весу и при этом растягиваются (уступающая работа поперёк движения); средняя часть ' +
   'трапециевидной удлиняется при повороте лопатки вверх (как в жимах сидя, см. выше). Состав профиля (основные — задняя ' +
   'дельта и середина спины) — на решение владельца: по длинам работает нижняя часть трапециевидной (она укорачивается и горит).',
  { reversesnow: ['rhomb', 'delt3', 'trapmid'] }],
  ['Длинная и короткая приводящие, гребенчатая и тонкая в выпадах, зашагиваниях и гакк-приседе: при сгибании бедра больше ' +
   '≈ 50–60° они разгибают бедро, ближе к выпрямлению — сгибают (рычаг меняет знак; Neumann, 2017), поэтому за подъём в целом ' +
   'удлиняются, работая в нижней части; тонкая ещё и сгибает колено. Цвет — общий профиль приводящих (вспомогательные).',
  { stepup: ['pectineus', 'addlong'], sidelunge: ['pectineus', 'addlong', 'addbrev'], revlunge: ['pectineus', 'addlong'], hacksquat: ['grac'] }],
  ['Махи гирей: широчайшие держат руки у корпуса и тормозят мах вперёд (уступающая работа), укорачиваются на замахе назад — ' +
   'вспомогательные с общим цветом.',
  { kbswing: ['lat', 'tmaj'], kbswing1: ['lat', 'tmaj'] }],
  ['Рывок гири: широчайшая (пик 72 % MVC — McGill и Marshall, 2012, JSCR 26(1):16–27, «swing to snatch») держит руку у ' +
   'корпуса в замахе и тормозит гирю при сбросе из-за головы (уступающая работа), а к фиксации над головой рука поднимается, ' +
   'и широчайшая с большой круглой удлиняются — вспомогательные с общим цветом.',
  { kbsnatch: ['lat', 'tmaj'] }],
  ['«Дровосек» сверху вниз: корпус наклоняется вперёд и поворачивается вправо — ягодичные тормозят наклон таза (уступающая ' +
   'работа); тянут косые мышцы живота (они укорачиваются и горят).',
  { cablewood: ['glmax', 'glmed', 'glmin'] }],
  ['Турецкий подъём: «рабочая фаза» — весь подъём с пола (лёжа → стоя), а не движение одного сустава. Мышцы плеча работают ' +
   'изометрически — держат вертикальную руку с гирей и опорную руку (ЭМГ — St-Onge и др., 2019, J Bodyw Mov Ther 23(1):23–31: ' +
   '8 групп мышц плечевого сустава с обеих сторон, наибольшая нагрузка — при выходе на локоть и при проведении ноги, опорная ' +
   'сторона — пока на неё опираются); длина меняется от разницы начала и конца: лёжа рука с гирей согнута в плече под 90° к ' +
   'корпусу, стоя поднята вдоль него (надостная L длиннее); опорная рука лёжа отведена на полу под 45°, стоя опущена вдоль тела ' +
   '(средняя дельтовидная и подлопаточная R длиннее); правое бедро лёжа отведено («ноги буквой V»), стоя — нет (средняя и малая ' +
   'ягодичные R длиннее), а работают они в мосте и при вставании. Цвет — по профилю.',
  { kbtgu: ['delt2', 'subsc', 'supsp', 'glmed', 'glmin'] }],
];
/* Уступающий акцент: главная работа — опускание, ярче всего горит в нём (09b-muscle-profiles.js) */
const ECCENTRIC = { nordic: 'hams' };

let all = null;
async function measured() {
  if (!all) { all = {}; for (const id of P.ids()) all[id] = await P.measure(id); }
  return all;
}
const excepted = (id, part) => EXCEPT.some(([, c]) => (c[id] || []).includes(part));

test('bright muscles shorten in the working phase: the catalogue, with the listed exceptions only', async () => {
  const M = await measured(), hits = new Set(), bad = [];
  for (const [id, r] of Object.entries(M)) {
    if (r.hold || r.cyclic || r.loop) continue;
    for (const q of Object.values(r.parts)) {
      if (q.con === null) continue;
      const [cm, rel] = q.con >= BRIGHT ? LONGER.bright : q.con >= NOTICE ? LONGER.notice : [Infinity, Infinity];
      if (!(q.d > cm && q.rel > rel)) continue;
      if (excepted(id, q.part)) { hits.add(id + ' ' + q.part); continue; }
      bad.push(`${id} ${q.part} ${q.side}: яркость ${q.con.toFixed(2)}, в рабочей фазе +${q.d.toFixed(1)} см (${(q.rel * 100).toFixed(0)} %)`);
    }
  }
  assert.deepEqual(bad, [], 'brightest while lengthening:\n' + bad.join('\n'));
  const stale = EXCEPT.flatMap(([, c]) => Object.entries(c).flatMap(([id, parts]) => parts.map(p => id + ' ' + p))).filter(k => !hits.has(k));
  assert.deepEqual(stale, [], 'exceptions no longer needed — remove them');
});

test('the working phase is the brightest for the main muscles; eccentric accent only where listed', () => {
  const { m } = P.model(), { muscleFrame, motionProfile } = m.get('({muscleFrame,motionProfile})');
  for (const ex of m.EX) {
    const a = ex.anim, p = motionProfile(a);
    if (!p || a.hold || p.cyclic || a.loop) continue;
    const con = muscleFrame(a, .5, a.eccFirst ? 2 : 0), ecc = muscleFrame(a, .5, a.eccFirst ? 0 : 2);
    assert.equal(con.phase, 'concentric'); assert.equal(ecc.phase, 'eccentric');
    for (const [g, mu] of Object.entries(p.muscles)) {
      if (mu.role !== 'primary') continue;
      if (ECCENTRIC[ex.id] === g) assert(ecc.values[g] > con.values[g] + .2, `${ex.id} ${g}: the lowering is the main work`);
      else assert(con.values[g] > ecc.values[g], `${ex.id} ${g}: working phase ${con.values[g].toFixed(2)} vs return ${ecc.values[g].toFixed(2)}`);
    }
  }
});

/* где мышца горит в рабочей фазе (≥ 0,45, «заметное участие» и выше) и где молчит (< 0,35); части — pack.js, PARTS */
const FLEX = ['fcr', 'fcu', 'pl', 'fds', 'fdp'], EXT = ['ecrl', 'ecrb', 'ecu', 'edc', 'edm'];
const EXPECT = [
  /* шраги: лопатку поднимают верхняя часть трапециевидной и поднимающая лопатку, нижняя часть — опускатель (Neumann, 2017; Pizzari и др., 2014) */
  ['shrug', 'LR', { on: ['trapsup', 'levscap'], off: ['trapinf'] }],
  /* тяги сверху и подтягивания: лопатку опускает нижняя часть трапециевидной (ЭМГ — Youdas и др., 2010), верхняя растягивается */
  ...['latpull', 'latpullv', 'latpulluh', 'assistpull', 'pullup', 'chinup'].map(id => [id, 'LR', { on: ['trapinf', 'lat'], off: ['trapsup'] }]),
  /* сгибание запястий: сгибатели, а не разгибатели; плечелучевая запястье не пересекает (OpenStax A&P 2e, 11.5) */
  ['wristcurl', 'LR', { on: FLEX, off: [...EXT, 'brd'] }],
  /* «молот»: плечелучевая, плечевая и двуглавая (Boland и др., 2008; Basmajian и Latif, 1957; Kleiber и др., 2015) */
  ['hammer', 'LR', { on: ['brd', 'biclong', 'bra'], off: [] }],
  /* наружная ротация: подостная и малая круглая, не подлопаточная (Reinold и др., 2004); работает правая рука */
  ...['cableextrot', 'bandextrot'].map(id => [id, 'R', { on: ['infsp', 'tmin'], off: ['subsc'] }]),
  ...['cableextrot', 'bandextrot'].map(id => [id, 'L', { on: [], off: ['infsp', 'tmin', 'subsc'] }]),
  ['ytw', 'LR', { on: ['infsp', 'tmin', 'supsp'], off: ['subsc'] }],
  /* наклон в сторону с гантелью в правой руке: косые левой стороны, правая молчит */
  ['sidebend', 'L', { on: ['eo', 'io'], off: [] }], ['sidebend', 'R', { on: [], off: ['eo', 'io'] }],
  /* «дровосек» с поворотом вправо: наружная косая левой стороны и внутренняя правой (OpenStax A&P 2e, 11.4) */
  ['cablewood', 'L', { on: ['eo'], off: ['io'] }], ['cablewood', 'R', { on: ['io'], off: ['eo'] }],
  /* копенгагенская планка: работает верхняя нога на скамье (левая) */
  ...['copenhagen', 'copenhagenknee'].map(id => [id, 'L', { on: ['addlong', 'addbrev', 'addmag'], off: [] }]),
  ...['copenhagen', 'copenhagenknee'].map(id => [id, 'R', { on: [], off: ['addlong', 'addbrev', 'addmag'] }]),
  /* обратные выпады и румынская тяга на одной ноге: в рабочей фазе (подъём) горят ягодичные рабочей ноги */
  ['revlunge', 'L', { on: ['glmax', 'vasmed', 'vaslat'], off: [] }], ['sllift', 'L', { on: ['glmax', 'bflh', 'semiten'], off: [] }],
  /* короткая головка двуглавой бедра — сгибатель колена: горит в сгибаниях ног, молчит в разгибании бедра (Bourne и др., 2017) */
  ['legcurl', 'LR', { on: ['bfsh', 'bflh'], off: [] }], ...['deadlift', 'rdl', 'goodmorning', 'kbswing', 'hipthrust', 'squat'].map(id => [id, 'LR', { on: [], off: ['bfsh'] }]),
  /* малая грудная руку не поднимает */
  ['frontraise', 'LR', { on: ['delt1', 'pecm1'], off: ['pecmin'] }],
];
test('muscles light up where EMG and anatomy say they work, and stay quiet where they do not', async () => {
  const M = await measured(), bad = [];
  for (const [id, sides, { on, off }] of EXPECT) for (const side of sides) {
    const v = part => M[id].parts[part + '|' + side]?.con ?? 0;
    for (const p of on) if (!(v(p) >= ON)) bad.push(`${id} ${p} ${side}: ${v(p).toFixed(2)} — must light up`);
    for (const p of off) if (!(v(p) < OFF)) bad.push(`${id} ${p} ${side}: ${v(p).toFixed(2)} — must stay quiet`);
  }
  assert.deepEqual(bad, [], bad.join('\n'));
  /* прямая бедра в приседе — слабее широких (Escamilla и др., 1998), в разгибании ног сидя — наравне */
  for (const id of ['squat', 'legpress', 'lunge']) assert(M[id].parts['recfem|L'].con < M[id].parts['vaslat|L'].con - .15, id + ': rectus femoris dimmer than the vasti');
  assert.equal(M.legext.parts['recfem|L'].con, M.legext.parts['vaslat|L'].con, 'leg extension: rectus femoris as bright as the vasti');
  /* «молот»: плечевая мышца сгибает локоть при любом хвате (Basmajian и Latif, 1957), двуглавая в нейтральном хвате слабее,
     чем в хвате снизу (Kleiber и др., 2015) — плечевая ярче головок двуглавой; в сгибании с хватом снизу — наравне */
  for (const s of ['L', 'R']) assert(M.hammer.parts['bra|' + s].con > M.hammer.parts['biclong|' + s].con + .1, 'hammer curl: brachialis brighter than the biceps ' + s);
  assert.equal(M.dbcurl.parts['bra|L'].con, M.dbcurl.parts['biclong|L'].con, 'supinated curl: brachialis as bright as the biceps');
});

/* 4.110 (замечание анатома 1): свободная рука или нога — в цвете покоя, как мышцы вне упражнения (muscleTint отдаёт не
   число, а цвет покоя — con === null); опорная (support: держит вес тела) — не ярче слабого участия 0,28, и опора есть в
   контактах позы: ладонь, колено, стопа второй стороны на скамье, полу или стене (09d-catalog-muscles.js, CATALOG_LATERALITY) */
test('one-sided exercises: the free limb is at rest, a supporting limb (a contact in the pose) — weak at most', async () => {
  const M = await measured(), { m } = P.model(), { motionProfile } = m.get('({motionProfile})'), lower = new Set(['quads', 'hams', 'calves', 'glutes', 'adductors']);
  const POSES = require('../src/js/09bp-poses.js'), LIMB = { upper: /^(palm|fa|ua|elbow|hand)/, lower: /^(sole|foot|knee|shin|toes|heel)/ };
  let idle = 0, support = 0;
  for (const ex of m.EX) {
    const lat = motionProfile(ex.anim)?.laterality; if (!lat) continue;
    for (const [part, side] of Object.entries(lat)) {
      if (part !== 'upper' && part !== 'lower') continue;
      const other = side === 'L' ? 'R' : 'L', sup = lat.support === part;
      if (sup) assert(POSES[ex.id].contacts.some(c => LIMB[part].test(c.body) && c.body.endsWith(other)),
        `${ex.id}: the supporting ${part} limb (${other}) has a contact in the pose`);
      for (const q of Object.values(M[ex.id].parts)) {
        if (q.side !== other || !q.roles.length) continue;
        const legs = q.groups.every(g => lower.has(g));
        if ((part === 'lower') !== legs || q.groups.some(g => ['abs', 'obliques', 'lowback', 'traps', 'hipflex', ...(lat.both || [])].includes(g))) continue;
        if (sup) { assert(q.con !== null && q.con <= .28 + 1e-9, `${ex.id} ${q.part} ${q.side}: ${q.con} on the supporting side`); support++; }
        else { assert.equal(q.con, null, `${ex.id} ${q.part} ${q.side}: ${q.con} on the free side — must be the rest colour`); idle++; }
      }
    }
  }
  assert(idle > 100 && support > 50, `free sides checked: ${idle}, supporting: ${support}`);
});

test('phase labels and cues follow the working phase: rising after a lowering, the hamstrings lower in the Nordic curl', () => {
  const { m } = P.model(), { motionFrame } = m.get('({motionFrame})'), ex = id => m.EX.find(e => e.id === id);
  const at = (id, clock) => motionFrame({ it: { ex: ex(id) }, durations: [1000, 0, 1000, 0], clock });
  for (const id of ['revlunge', 'sllift', 'sidebend', 'lunge', 'rdl']) {
    assert.equal(ex(id).anim.eccFirst, true, id + ': the pose lowers first');
    const down = at(id, 500), up = at(id, 1500);
    assert.equal(down.label, 'Опускание'); assert.equal(up.label, 'Подъём');
    assert.equal(up.cue, ex(id).anim.cues[0], id + ': the effort cue shows while rising');
  }
  const up = at('nordic', 500), down = at('nordic', 1500);
  assert.equal(up.label, 'Подъём'); assert.equal(down.label, 'Опускание');
  assert.match(down.cue, /Опускайтесь медленно/);
});
