'use strict';
/* Метки нагрузки на суставы: каждое правило загорается там, где должно, и молчит там, где сустав не нагружен;
   метка стоит на своём суставе и в своей фазе. Углы — общие с валидатором манекена. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const M = require('../src/js/09bm-mannequin.js');
const validator = require('./biomech/validator2.js');

const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const A = m.get('({EX,EXI,PATTERN,STRESS_RULES,STRESS_HINGE,STRESS_VPUSH,jointStress,jointStressAt,jointStressPoints,stressZones,stressPoint})');
const ex = id => A.EXI[id];
/* массивы из контекста приложения — в обычные, чтобы сравнивать по содержимому */
const plain = x => JSON.parse(JSON.stringify(x));
const rules = id => new Set(A.jointStress(ex(id)).rules.map(r => r.id));
const at = (id, t, index = 0) => plain(A.jointStressAt(ex(id), t, index).map(x => x.rule.id));
const keysAt = (id, rule, t, index = 0) => plain((A.jointStressAt(ex(id), t, index).find(x => x.rule.id === rule) || { keys: [] }).keys);

test('joint angles are the validator\'s own calculation', () => {
  assert.equal(typeof M.jointAngles, 'function');
  const R = ex('squat').anim.catalogRig(.6);
  assert.equal(validator.angles, M.jointAngles, 'one function, not a copy');
  assert(Math.abs(M.jointAngles(R).L.knee) > 10);
});

const EXPECT = {
  /* сведение на блоке: опорная нога почти прямая; копенгагенская планка: колено верхней ноги прямое, сгибания под весом нет */
  /* сисси-присед — без веса, но колени далеко за носками при глубоком сгибе (Fry 2003); присед без веса, прыжки, стенка,
     мостик и бёрпи — колени не за носками, неглубоко, спина на опоре или вес на руках */
  knee: { on: ['squat', 'goblet', 'smithsquat', 'hacksquat', 'legpress', 'legpresslow', 'lunge', 'revlunge', 'bulgarian', 'stepup', 'pistolbox', 'kbfrontsquat', 'sissysquat'],
    off: ['dbpress', 'latpull', 'deadlift', 'jumpsquat', 'glutebridge1', 'crunch', 'legext', 'calfraise', 'cableadduct', 'copenhagen', 'bandadduct', 'bandabduct', 'bandbridge', 'bandlegext',
      'airsquat', 'wallsit', 'bridge', 'burpee', 'nordic'] }, /* дома с эспандером: колено почти прямое (сведение, отведение) или без нагрузки сверху (мостик, разгибание сидя — как в тренажёре) */
  /* разгибание колена в открытой цепи под нагрузкой у голени: тренажёр и манжета эспандера на щиколотке (отчёт Елены, п. 1).
     Молчит: сгибание ног (нагрузка против сгибания, основная мышца — не квадрицепс), закрытая цепь (стопы на полу или платформе),
     прямая нога весь подход с манжетой (сведение, отведение), мах ногой назад с тросом */
  kneeOpen: { on: ['legext', 'bandlegext'], off: ['legcurl', 'squat', 'legpress', 'sissysquat', 'bandadduct', 'cableadduct', 'bandabduct', 'cablekickback', 'glutekick', 'wallsit'] },
  /* быстрая смена ног с ударом стопы (скалолаз, п. 3). Молчит: бег трусцой на дорожке (скорость задаёт человек, при «беречь
     колени» — шаг), ходьба с гантелями, прыжки «звёздочкой» (там приземление), кардиотренажёры без удара стопой, велосипед на спине */
  kneeFast: { on: ['mountain'], off: ['treadmill', 'farmer', 'jumpingjack', 'elliptical', 'stairs', 'bike', 'revlunge', 'bicycle', 'burpee', 'jumpsquat'] },
  /* сила у щиколотки поперёк почти прямой ноги (п. 8, 9): манжета эспандера и троса в сведении, мини-петля в отведении, опора
     стопой в копенгагенской планке. Молчит: упор у колена (тренажёры сведения и разведения, копенгагенская с опорой коленом),
     трос и лента вдоль ноги (разгибание сидя, мах назад) */
  kneeSide: { on: ['bandadduct', 'cableadduct', 'bandabduct', 'copenhagen'], off: ['copenhagenknee', 'adduction', 'abduction', 'bandlegext', 'legext', 'cablekickback', 'glutekick', 'sidelunge', 'declinepush', 'legcurl'] },
  /* упор на колени: колено стоит на коврике, скамье, подушке гравитрона или валике — передней поверхностью в опору.
     Молчит: колени в валиках сбоку (сведение, разведение), под валиком скамьи для пресса, боком на скамье
     (копенгагенская планка), голени на валиках скамьи с наклоном, выпады без касания пола коленом */
  kneel: { on: ['rollout', 'bandlatpull', 'kneepush', 'birddog', 'cablecrunch', 'dbrow', 'kickback', 'nordic', 'assistpull', 'assistdip', 'kbtgu'],
    off: ['abduction', 'adduction', 'declinecrunch', 'copenhagenknee', 'copenhagen', 'declinebb', 'legext', 'legcurl', 'squat', 'lunge', 'revlunge', 'bulgarian', 'plank', 'pushup', 'bridge', 'mountain', 'burpee'] },
  /* гиря: наклоны от таза и тяга в наклоне без опоры — как со штангой */
  /* протяжка на блоке между ног: рукоять троса — нагрузка и в упражнении на ягодичные (п. 2) */
  lumbar: { on: ['deadlift', 'rdl', 'sllift', 'goodmorning', 'bbrow', 'kbswing', 'squat', 'kbdeadlift', 'kbswing1', 'kbclean', 'kbrow', 'kbsnatch', 'kbsllift', 'pullthrough'], off: ['latpull', 'cablerow', 'dbrow', 'shrug', 'ohp', 'chestrowdb', 'legpress', 'bandlatpull', 'bandbridge'] },
  /* длинный рычаг: руки над головой в упоре при вытянутом теле. Планка, отжимания, скалолаз — кисти под плечами;
     пуловер и «супермен» — туловище лежит на опоре; жимы в упоре согнувшись — таз согнут */
  /* сгибание позвоночника вперёд или вбок в упражнениях на пресс и косые (п. 2). Молчит: удержания без сгибания (планки,
     «мёртвый жук», «птица-собака», «лодочка» — у неё длинный рычаг ног), приседы и наклоны (там позвоночник — не цель движения) */
  lumbarFlex: { on: ['crunch', 'declinecrunch', 'cablecrunch', 'legraise', 'lyinglegraise', 'captainraise', 'hangknee', 'sidebend', 'cablewood'],
    off: ['plank', 'sideplank', 'deadbug', 'birddog', 'hollow', 'rollout', 'squat', 'airsquat', 'deadlift', 'pistolbox', 'burpee', 'rower', 'bridge', 'copenhagen'] },
  /* скручивание корпуса (п. 2): велосипед, дровосек, мельница */
  lumbarTwist: { on: ['bicycle', 'cablewood', 'kbwindmill'], off: ['crunch', 'plank', 'sideplank', 'deadbug', 'birddog', 'farmer', 'treadmill', 'legraise'] },
  /* корпус на весу на мышцах спины лёжа на животе или на станке (п. 2). Молчит: «птица-собака» (руки и колени на полу),
     Y-T-W (грудь на коврике), скандинавские сгибания (таз не на опоре), упоры */
  lumbarExt: { on: ['hyper', 'superman', 'reversesnow'], off: ['birddog', 'ytw', 'plank', 'pushup', 'nordic', 'reversefly', 'pikepush', 'declinepush', 'glutebridge1', 'bridge'] },
  /* прямые ноги на весу у горизонтали: подъём прямых ног лёжа и в висе, «лодочка». Молчит: ноги согнуты, ноги отвесно в висе,
     «супермен» лёжа на животе (это разгибание) */
  lumbarLegs: { on: ['legraise', 'lyinglegraise', 'hollow'], off: ['deadbug', 'hangknee', 'captainraise', 'bicycle', 'superman', 'pullup', 'hang', 'plank', 'burpee', 'copenhagen'] },
  /* осевая нагрузка стоя (п. 6): штанга и валики на плечах, вес над головой, переноска и шраги. Молчит: сидя с опорой спины,
     лёжа, гантели в руках в подъёмах на бицепс и махах, гоблет, выпады, жим ногами, тяга троса сверху (трос тянет руки вверх) */
  axial: { on: ['ohp', 'kbpress', 'farmer', 'shrug', 'smithsquat', 'standcalf', 'hacksquat', 'squat', 'ohext'],
    off: ['dbpress', 'arnold', 'shoulderpressm', 'seatedcalf', 'lpcalf', 'calfraise', 'dbcurl', 'latraise', 'goblet', 'lunge', 'legpress', 'straightpull', 'bandfacepull', 'jumpingjack', 'deadlift', 'bbbench', 'dbbench'] },
  lumbarLever: { on: ['rollout'], off: ['plank', 'plankup', 'pushup', 'kneepush', 'mountain', 'burpee', 'birddog', 'sideplank', 'pullover', 'superman', 'pikepush', 'declinepike', 'hollow', 'deadbug', 'legraise', 'hangknee', 'kbtgu'] },
  /* вращение плеча наружу: плечо у бока, не уходит за линию корпуса */
  shPress: { on: ['bbbench', 'smithbench', 'inclinebb', 'closegrip', 'dip', 'assistdip', 'benchdip', 'pecdeck'], off: ['ohp', 'pushup', 'latpull', 'bbrow', 'dbcurl', 'cableextrot', 'bandextrot', 'kbfloorpress', 'bandlatpull', 'bandfloorpress'] }, /* жим лёжа на полу (с гирей и с эспандером): пол не пускает локоть ниже корпуса */
  shLever: { on: ['dbfly', 'pullover'], off: ['bbbench', 'cablefly', 'latraise', 'bandfly', 'bandfloorpress'] }, /* сведение у двери — стоя, как кроссовер */
  shOverhead: { on: ['ohp', 'dbpress', 'arnold', 'shoulderpressm', 'smithohp', 'pikepush', 'declinepike', 'kbpress'],
    off: ['latraise', 'bandlatraise', 'frontraise', 'facepull', 'bandfacepull', 'latpull', 'pullup', 'ohext', 'cableohext', 'bbbench', 'dbincline', 'pullover', 'bandlatpull'] },
  hang: { on: ['pullup', 'chinup', 'hang', 'legraise', 'hangknee'], off: ['latpull', 'dip', 'ohp', 'bandlatpull'] }, /* на коленях: тело не висит на руках */
  pullTop: { on: ['pullup', 'chinup', 'assistpull'], off: ['hang', 'legraise', 'latpull', 'invrow', 'bandlatpull'] },
  neck: { on: ['pullup', 'chinup', 'assistpull'], off: ['crunch', 'latpull', 'hang', 'shrug', 'bandlatpull'] },
  elbow: { on: ['skull', 'ohext', 'cableohext'], off: ['dbcurl', 'ohp', 'pushdown', 'closegrip'] },
  /* копенгагенская планка — упор на предплечье, как планка: кисть не нагружена */
  wrist: { on: ['pushup', 'diamond', 'burpee', 'mountain', 'birddog', 'plankup'], off: ['plank', 'wallpush', 'nordic', 'bbbench', 'dbcurl', 'copenhagen', 'copenhagenknee'] },
  /* ахилл: тыльное сгибание дальше нейтрали под весом (Jonsson et al. 2008) — и в подъёме на носки в тренажёре для жима ногами
     (пятки уходят за край платформы на 12°); приседания, прыжки и бег — не подъёмы на носки */
  achilles: { on: ['calfraise', 'calf1', 'seatedcalf', 'standcalf', 'lpcalf'], off: ['squat', 'jumpsquat', 'treadmill', 'jumpingjack', 'legpress'] },
  landing: { on: ['jumpsquat', 'burpee', 'jumpingjack'], off: ['pullup', 'dip', 'stepup', 'elliptical', 'stairs', 'squat', 'hangknee'] },
  hams: { on: ['rdl', 'sllift', 'goodmorning', 'nordic', 'kbsllift', 'pullthrough'], off: ['squat', 'legcurl', 'hipthrust', 'lunge'] }
};
test('every rule has texts and lights up where the joint is loaded, and only there', () => {
  assert.deepEqual(plain(A.STRESS_RULES.map(r => r.id)).sort(), Object.keys(EXPECT).sort(), 'each rule is covered by this test');
  for (const r of A.STRESS_RULES) {
    assert(r.zone && r.what.length > 20 && r.tip.length > 15, r.id + ' explains what is loaded and how to protect it');
    for (const id of EXPECT[r.id].on) assert(rules(id).has(r.id), `${r.id} must mark ${id}`);
    for (const id of EXPECT[r.id].off) assert(!rules(id).has(r.id), `${r.id} must not mark ${id}`);
  }
});
test('marks follow the phase: bottom of a squat and a bench press, end range of a leg extension', () => {
  assert.deepEqual(at('squat', 0), ['axial'], 'standing tall: only the bar pressing on the spine');
  assert.deepEqual(at('goblet', 0), [], 'goblet squat standing: no mark');
  assert.deepEqual(keysAt('squat', 'knee', 1).sort(), ['knL', 'knR'], 'bottom: both knees');
  assert(at('squat', 1).includes('lumbar'), 'bottom: lower back too');
  assert(!at('bbbench', 0).includes('shPress') && at('bbbench', 1).includes('shPress'), 'bench: only at the chest');
  const leg = ex('legext');
  for (let i = 0; i <= 40; i++) {
    const on = A.jointStressAt(leg, i / 40).some(x => x.rule.id === 'kneeOpen'), knee = M.jointAngles(leg.anim.catalogRig(i / 40)).L.knee;
    if (on) assert(knee <= 30.5, 'leg extension mark only near a straight knee: ' + knee.toFixed(0));
  }
  assert(at('pullup', 0).includes('hang') && !at('pullup', 0).includes('neck'), 'pull-up bottom: hanging shoulders, neck is fine');
  /* жим вверх: метка только пока плечо в дуге 90–120°; внизу у груди и наверху на прямых руках — нет */
  assert(!at('ohp', 0).includes('shOverhead') && !at('ohp', 1).includes('shOverhead'), 'overhead press: no mark at the chest or at lockout');
  const press = ex('ohp');
  let lit = 0;
  for (let i = 0; i <= 40; i++) {
    const on = A.jointStressAt(press, i / 40).some(x => x.rule.id === 'shOverhead'), el = M.jointAngles(press.anim.catalogRig(i / 40)).L.elevation;
    if (on) { lit++; assert(el >= 89.5 && el <= 120.5, 'overhead press mark only in the 90–120° arc: ' + el.toFixed(0)); }
  }
  assert(lit >= 3, 'the arc is crossed in several frames');
  assert(at('pullup', 1).includes('neck') && at('pullup', 1).includes('pullTop'), 'pull-up top: neck and shoulders');
});
test('open-chain knee extension with a band: only the cuffed leg, only near a straight knee', () => {
  const e = ex('bandlegext'), lit = [];
  for (let i = 0; i <= 40; i++) {
    const keys = keysAt('bandlegext', 'kneeOpen', i / 40), J = M.jointAngles(e.anim.catalogRig(i / 40));
    assert(!keys.includes('knR'), 'the foot of the other leg is on the floor');
    if (keys.includes('knL')) { lit.push(i); assert(J.L.knee <= 30.5, `frame ${i}: knee ${J.L.knee.toFixed(0)}°`); }
    else assert(J.L.knee > 29.5, `frame ${i}: knee ${J.L.knee.toFixed(0)}° near straight is marked`);
  }
  assert(lit.includes(40) && !lit.includes(0), 'straight leg marked, bent start not: ' + lit.join(','));
});
test('fast leg changes: the knee mark is on the leg whose foot has just hit the floor', () => {
  const P = m.get('CATALOG_POSES').mountain, lit = A.jointStress(ex('mountain')).rules.find(r => r.id === 'kneeFast');
  for (const [i, keys] of lit.f.entries()) for (const k of keys) {
    const s = k.slice(-1), t = i / 40;
    assert(P.contacts.some(c => (c.body === 'sole' + s) && c.when && t >= c.when[0] - 1e-6 && t <= c.when[1] + 1e-6), `frame ${i}: ${k} foot is on the mat`);
  }
  assert(lit.f.flat().includes('knL') && lit.f.flat().includes('knR'), 'both legs land in a cycle');
});
test('side load across the knee: the leg on the bench in the Copenhagen plank, the cuffed leg in band adduction', () => {
  assert.deepEqual(plain([...new Set(A.jointStress(ex('copenhagen')).rules.find(r => r.id === 'kneeSide').f.flat())]), ['knL'], 'the upper leg on the bench');
  assert.deepEqual(plain([...new Set(A.jointStress(ex('bandadduct')).rules.find(r => r.id === 'kneeSide').f.flat())]), ['knL'], 'the cuffed leg');
  assert(!rules('copenhagenknee').has('kneeSide'), 'support at the knee — no lever across it');
});
test('lower back: crunch marked in the flexed phase only; overhead press and farmer walk carry the weight on the spine', () => {
  assert(!at('crunch', 0).includes('lumbarFlex') && at('crunch', 1).includes('lumbarFlex'), 'lying flat: no mark; curled up: marked');
  const press = A.jointStress(ex('ohp')).rules.find(r => r.id === 'axial'), farmer = A.jointStress(ex('farmer')).rules.find(r => r.id === 'axial');
  assert(farmer.f.every(k => k.length), 'farmer walk: every frame');
  assert(press.f.some(k => k.length), 'overhead press: while the bar is overhead');
  for (const id of ['dbpress', 'arnold']) assert(!rules(id).has('axial'), id + ': seated with the back supported');
});
test('Achilles: the mark is on only while the heel is below neutral (dorsiflexion ≥ 5°), at the bottom of a calf raise', () => {
  for (const id of ['calfraise', 'lpcalf', 'standcalf']) {
    const e = ex(id); let lit = 0;
    for (let i = 0; i <= 40; i++) {
      const J = M.jointAngles(e.anim.catalogRig(i / 40)), on = keysAt(id, 'achilles', i / 40);
      for (const s of ['L', 'R']) if (on.includes('an' + s)) { lit++; assert(J[s].dorsi >= 4.95, `${id} frame ${i}: dorsiflexion ${J[s].dorsi.toFixed(1)}°`); }
        else assert(J[s].dorsi < 5.05, `${id} frame ${i}: ${s} dorsiflexion ${J[s].dorsi.toFixed(1)}° is not marked`);
    }
    assert(lit > 0, id + ': the bottom is marked');
  }
});
test('bodyweight on both legs: the knee mark needs deep flexion with the knees past the toes (sissy squat), not a deep air squat', () => {
  const ahead = (R, s) => { const fw = M.V.unit([R['toe' + s][0] - R['heel' + s][0], 0, R['toe' + s][2] - R['heel' + s][2]]); return M.V.dot(M.V.sub(R['kn' + s], R['toe' + s]), fw); };
  const sissy = ex('sissysquat'), lit = [];
  for (let i = 0; i <= 40; i++) {
    const R = sissy.anim.catalogRig(i / 40), J = M.jointAngles(R), keys = keysAt('sissysquat', 'knee', i / 40);
    if (keys.length) { lit.push(i); for (const k of keys) { const s = k.slice(-1); assert(J[s].knee >= 84.5 && ahead(R, s) > 0, `frame ${i} ${k}: knee ${J[s].knee.toFixed(0)}°, ${ahead(R, s).toFixed(1)} cm past the toes`); } }
  }
  assert.deepEqual(keysAt('sissysquat', 'knee', 1).sort(), ['knL', 'knR'], 'bottom: both knees');
  assert(!at('sissysquat', 0).includes('knee') && !at('sissysquat', .5).includes('knee'), 'upright and halfway: no mark');
  assert(lit.length >= 3 && lit[0] >= 24, 'only the deep phase: ' + lit.join(','));
  /* присед без веса глубже (до 110°), но колени остаются за линией носков — метки нет */
  const air = ex('airsquat');
  let deep = 0;
  for (let i = 0; i <= 40; i++) { const R = air.anim.catalogRig(i / 40); if (M.jointAngles(R).L.knee >= 85) { deep++; assert(ahead(R, 'L') <= 0, 'air squat keeps the knees behind the toes'); } }
  assert(deep > 0 && !rules('airsquat').has('knee'), 'a deep air squat is not marked');
});
test('kneeling: the mark sits on the knee that rests on the support, in the phase it rests there, with the front of the knee down', () => {
  const V = M.V, down = (R, s) => { const d = V.sub(V.unit(V.sub(R['kn' + s], R['hip' + s])), V.unit(V.sub(R['an' + s], R['kn' + s]))); return d[1] / Math.hypot(...d); };
  for (const id of ['rollout', 'bandlatpull', 'kneepush', 'cablecrunch']) {
    for (const t of [0, .5, 1]) assert.deepEqual(keysAt(id, 'kneel', t).sort(), ['knL', 'knR'], `${id} at ${t}: both knees`);
  }
  assert.deepEqual(plain([...new Set(A.jointStress(ex('dbrow')).rules.find(r => r.id === 'kneel').f.flat())]), ['knR'], 'one-arm row: only the knee on the bench');
  /* турецкий подъём: колено на полу только в выпаде (контакт с окном времени) — не лёжа и не стоя */
  const tgu = A.jointStress(ex('kbtgu')).rules.find(r => r.id === 'kneel'), win = m.get('CATALOG_POSES').kbtgu.contacts.find(c => c.body === 'kneeR').when;
  const lit = tgu.f.map((k, i) => k.length ? i : -1).filter(i => i >= 0);
  assert(lit.length >= 3, 'the kneeling phase is marked: ' + lit.join(','));
  for (const i of lit) assert(i / 40 >= win[0] - 1e-6 && i / 40 <= win[1] + 1e-6, `frame ${i} is inside the kneeling window ${win}`);
  assert(!at('kbtgu', 0).includes('kneel') && !at('kbtgu', 1).includes('kneel'), 'lying and standing: no kneel mark');
  /* передняя поверхность колена: в упоре — вниз, в валиках тренажёра и под валиком скамьи — вверх */
  for (const id of ['bandlatpull', 'birddog', 'assistpull']) assert(down(ex(id).anim.catalogRig(0), 'L') >= .6, id + ': front of the knee faces the support');
  for (const id of ['abduction', 'declinecrunch']) assert(down(ex(id).anim.catalogRig(0), 'L') < 0, id + ': front of the knee faces up');
});
test('long lever: the lower back is marked only while the arms reach overhead with the body extended', () => {
  const roll = ex('rollout'), lit = [];
  for (let i = 0; i <= 40; i++) {
    const R = roll.anim.catalogRig(i / 40), J = M.jointAngles(R), on = at('rollout', i / 40).includes('lumbarLever');
    if (on) { lit.push(i); assert(Math.max(J.L.elevation, J.R.elevation) >= 119.5 && Math.max(J.L.hipFlex, J.R.hipFlex) <= 30.5, `frame ${i}: arm ${J.L.elevation.toFixed(0)}°, hip ${J.L.hipFlex.toFixed(0)}°`); }
    else assert(Math.max(J.L.elevation, J.R.elevation) < 120 || Math.max(J.L.hipFlex, J.R.hipFlex) > 30, `frame ${i} reaches far but is not marked`);
  }
  assert(lit.length >= 10 && !lit.includes(0) && lit.includes(40), 'start on the knees is not marked, full extension is: ' + lit.join(','));
  assert.deepEqual(keysAt('rollout', 'lumbarLever', 1), ['lumbar'], 'the mark is on the lower back');
  /* планка на предплечьях: плечо у 90° — метки нет при том же вытянутом теле */
  const P = M.jointAngles(ex('plank').anim.catalogRig(.5));
  assert(P.L.elevation < 100 && P.L.hipFlex < 10, 'plank: arm about 90°, body straight');
});
test('rowing machine: the knee mark is on the drive, not on the recovery with no resistance', () => {
  const S = A.jointStress(ex('rower')).rules.find(r => r.id === 'knee');
  assert(S && S.f.some(k => k.length), 'drive: deep knee bend while the legs push');
  assert(S.b.every(k => !k.length), 'recovery: the flywheel spins freely, no mark');
  assert(at('rower', 0, 0).includes('knee') && !at('rower', 0, 2).includes('knee'), 'catch: marked when starting the drive, not when sliding in');
  /* резина и тренажёры с нагрузкой в обе стороны — как раньше */
  const lp = A.jointStress(ex('legpress')).rules.find(r => r.id === 'knee');
  assert.deepEqual(plain(lp.f), plain(lp.b), 'leg press: the sled loads both ways');
});
test('Turkish get-up has its own texts: the supporting arm, not push-up advice', () => {
  const gen = id => A.STRESS_RULES.find(r => r.id === id), own = id => A.jointStress(ex('kbtgu')).rules.find(r => r.id === id);
  for (const id of ['shPress', 'wrist']) {
    const r = own(id);
    assert(r, 'kbtgu is marked: ' + id);
    assert.notEqual(r.what, gen(id).what); assert.notEqual(r.tip, gen(id).tip);
    assert(!/отжиман|комфортной глубины/i.test(r.what + r.tip), id + ': no push-up wording: ' + r.tip);
    assert(/опорн/i.test(r.what + r.tip), id + ': speaks of the supporting arm');
  }
  assert.equal(A.jointStress(ex('pushup')).rules.find(r => r.id === 'wrist').tip, gen('wrist').tip, 'push-ups keep the general text');
});
test('standing knee depth for substitutes: air squat and wall sit bend as deep as a goblet squat, a bridge does not count', () => {
  const D = m.get('stressKneeDepth'), deep = m.get('stressKneeDeep');
  for (const id of ['airsquat', 'wallsit', 'goblet', 'squat']) assert(deep(ex(id)), `${id}: ${D(ex(id)).toFixed(0)}°`);
  for (const id of ['bridge', 'hipthrust', 'glutebridge1', 'legpresshigh', 'rdl', 'legext', 'bandlegext', 'bandabduct']) assert(!deep(ex(id)), `${id}: ${D(ex(id)).toFixed(0)}°`);
  assert(D(ex('airsquat')) >= D(ex('goblet')) - 5, 'the air squat is no shallower than the goblet squat');
});
test('fallback sets match the movement table, so marks do not change when it is not loaded', () => {
  const by = p => plain(A.EX.filter(e => A.PATTERN[e.id] === p).map(e => e.id)).sort();
  assert.deepEqual(plain([...A.STRESS_VPUSH]).sort(), by('vpush'));
  for (const id of A.STRESS_HINGE) assert.equal(A.PATTERN[id], 'hinge', id);
});
test('single-leg exercises mark only the working leg', () => {
  const S = A.jointStress(ex('stepup')).rules.find(r => r.id === 'knee'), keys = new Set(S.f.flat());
  assert.deepEqual(plain([...keys]), ['knL'], 'the leg on the bench');
});
test('landing is marked right after the flight phase and follows the direction of playback', () => {
  const jump = ex('jumpsquat'), rig = jump.anim.catalogRig, foot = R => Math.max(R.heelL[1], R.toeL[1], R.heelR[1], R.toeR[1]);
  const ground = Math.max(...Array.from({ length: 41 }, (_, i) => foot(rig(i / 40))));
  const land = A.jointStress(jump).rules.find(r => r.id === 'landing');
  const hits = land.f.map((k, i) => k.length ? i : -1).filter(i => i >= 0);
  assert(hits.length >= 2 && hits.length <= 8, 'a short landing window: ' + hits.join(','));
  for (const i of hits) {
    assert(ground - foot(rig(i / 40)) < 3, 'feet are on the floor at frame ' + i);
    assert([1, 2, 3, 4, 5].some(d => i - d >= 0 && ground - foot(rig((i - d) / 40)) >= 5), 'a flight frame precedes frame ' + i);
  }
  const burpee = A.jointStress(ex('burpee')).rules.find(r => r.id === 'landing');
  assert.notDeepEqual(burpee.f.map(k => k.length > 0), burpee.b.map(k => k.length > 0), 'a reversed burpee lands elsewhere');
});
test('marks sit on their joints', () => {
  const R = ex('squat').anim.catalogRig(1), pts = A.jointStressPoints(ex('squat').anim, R, 1, 0);
  const knee = pts.find(p => p.key === 'knL'), lumbar = pts.find(p => p.key === 'lumbar');
  assert.deepEqual(plain(knee.p), plain(R.knL));
  const between = (p, a, b) => p[1] <= Math.max(a[1], b[1]) + 1 && p[1] >= Math.min(a[1], b[1]) - 1;
  assert(lumbar && between(lumbar.p, R.hip, R.sh), 'lower back mark between pelvis and shoulders');
  const neck = A.jointStressPoints(ex('pullup').anim, ex('pullup').anim.catalogRig(1), 1, 0).find(p => p.key === 'neck');
  assert(neck, 'pull-up top marks the neck');
  const P = ex('pullup').anim.catalogRig(1);
  assert(Math.hypot(...neck.p.map((v, i) => v - P.head[i])) < 20, 'neck mark is just below the head');
});
test('the plan card names the loaded joints in plain words', () => {
  assert.deepEqual(plain(A.stressZones(ex('pullup'))), ['плечи', 'шея']);
  assert.deepEqual(plain(A.stressZones(ex('rdl'))), ['поясница', 'задняя поверхность бедра']);
  assert.deepEqual(plain(A.stressZones(ex('jumpsquat'))), ['колени', 'ахилловы сухожилия']);
  assert.deepEqual(plain(A.stressZones(ex('dbcurl'))), []);
});
test('the SVG figure draws red marks on top at the loaded joints and can hide them', () => {
  const fs = require('node:fs'), path = require('node:path'), { JSDOM } = require('jsdom');
  const dom = new JSDOM('<html><body></body></html>', { runScripts: 'outside-only' });
  try {
    const dir = path.join(__dirname, '../src/js'), files = fs.readdirSync(dir).filter(f => /^\d.*\.js$/.test(f) && parseInt(f) < 11).sort();
    dom.window.eval(files.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') + '\nwindow.api={EX,buildFigure};');
    const { EX, buildFigure } = dom.window.api, squat = EX.find(e => e.id === 'squat');
    const fig = buildFigure(squat.anim, { camera: 'side', t: 0 }), shown = () => [...fig.svg.querySelectorAll('.stress-mark')].filter(n => n.getAttribute('display') !== 'none').map(n => n.dataset.joint).sort();
    assert.deepEqual(shown(), ['lumbar'], 'standing: the bar on the back loads the spine (axial)');
    fig.at(1, { index: 1 });
    assert.deepEqual(shown(), ['knL', 'knR', 'lumbar'], 'bottom of the squat');
    assert.equal(fig.svg.lastElementChild.getAttribute('class'), 'stress-marks', 'marks are drawn last, above the body');
    fig.setStress(false);
    assert.deepEqual(shown(), [], 'switched off');
  } finally { dom.window.close(); }
});
