const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadModel, auditModel, CONTACT_RULES, ANCHOR_KNOWN} = require('./biomechanics-audit');
const {auditCatalog} = require('./catalog-audit');
const {checkFrame} = require('./biomech/validator2.js');
const POSES = require('../src/js/09bp-poses.js');
const model = loadModel();
/* Аудит смотрит 3D-позы манекена, которые показывает приложение (catalogRig и варианты инвентаря). Старые плоские
   2D-описания и пространственные риги удалены; правила, которые на них держались, перенесены сюда или проверяются валидатором
   манекена — отрицательные примеры ниже ловят каждое из них на подложенной 3D-позе. */
const only = id => model.EX.filter(ex => ex.id === id);
function corrupted(id, mutate) {
  return {...model, EX:only(id).map(ex => ({...ex, anim:{...ex.anim, catalogVariants:null,
    catalogRig:t => {const R = ex.anim.catalogRig(t); mutate(R,t); return R;}}}))};
}
function detects(id, mutate, rule) {
  const r = auditModel(corrupted(id,mutate));
  assert(r.failures.some(f => f.rule === rule), JSON.stringify(r.failures));
  return r;
}
const unit = a => { const n = Math.hypot(...a); return a.map(x => x/n); };
const chestPad = R => R.props.find(p => p.id === 'bench:back');
/* толщина подушки — её короткая ось */
const padNormal = p => unit([p.x,p.y,p.z][p.size.indexOf(Math.min(...p.size))]);
const movePad = (R, d) => { R.props = R.props.map(p => p === chestPad(R) ? {...p, c:p.c.map((v,i) => v + d[i])} : p); };

test('all 3D poses satisfy declared supports, grips, bars and pads', () => {
  const r = auditModel(model), rigs = model.EX.reduce((n, ex) => n + 1 + Object.keys(ex.anim.catalogVariants || {}).length, 0);
  const contactRigs = Object.keys(CONTACT_RULES).reduce((n, id) => n + 1 + Object.keys(model.EX.find(e => e.id === id).anim.catalogVariants || {}).length, 0);
  assert.equal(r.stats.exercises,171);
  assert.equal(r.stats.poses,171*101);
  /* все варианты инвентаря, все кадры */
  assert.equal(r.stats.mannequinPoses,rigs*101);
  assert(rigs > 171, 'equipment variants are checked too');
  assert.equal(r.stats.contactPoses,contactRigs*101);
  /* три исходных профиля ригов, пять профилей прицельных упражнений на приводящие и манжету, уступающий акцент
     скандинавских сгибаний и махи гирей двумя и одной рукой по ЭМГ (4.110; 09b-muscle-profiles.js) */
  assert.equal(r.stats.muscleProfiles,11);
  /* области мышц на манекене — у всех 171 упражнений, каждый десятый кадр */
  assert.equal(r.stats.musclePoses,171*11);
  assert.equal(r.stats.cameraChecks,171*5);
  assert.deepEqual(r.failures,[]);
  assert.deepEqual(r.warnings,[]);
});
/* Прежнее contact-coverage (пространственный риг без правил опор): теперь у каждой позы каталога контакты заявлены
   в спецификации, валидатор манекена проверяет их в каждом кадре */
test('every catalog pose declares its contacts', () => {
  for (const ex of model.EX) assert(ex.anim.catalogRig(.5).contacts.length > 0, ex.id);
});
/* Переразгибание локтя по 3D-позе манекена (4.72.0). Отрицательный пример: шесть упражнений, которые старое правило
   projected-elbow помечало по плоским 2D-описаниям (12 ложных пометок), в 3D согнуты в локте 3,6–113° — пометок нет. */
test('elbow hyperextension: no flags on the 3D poses the app shows, including the old projected-elbow false flags', () => {
  const ids = ['invrow', 'goodmorning', 'burpee', 'tablerow', 'plankup', 'cableohext'];
  const r = auditModel({...model, EX:model.EX.filter(ex => ids.includes(ex.id))});
  assert.equal(r.warnings.filter(f => /elbow/.test(f.rule)).length, 0, JSON.stringify(r.warnings));
  assert(!r.warnings.some(f => f.rule.startsWith('projected-elbow')), 'the 2D rule is gone');
  for (const id of ids) {
    const ex = model.EX.find(e => e.id === id);
    for (const t of [0, .28, .5, .63, 1]) for (const s of ['L', 'R']) assert(model.Mannequin.jointAngles(ex.anim.catalogRig(t))[s].elbow > 0, `${id} t=${t} ${s}`);
  }
});
/* Положительный пример: подложенная поза — тот же манекен с локтем, разогнутым кинематикой на 25° за прямую линию (не сдвигом
   точек), между ключами (t 0,37–0,39), — правило её ловит; на 4° (в пределах нормы) — молчит */
test('elbow hyperextension: a substituted 3D pose with the elbow bent backwards is flagged between keyframes', () => {
  const M = model.Mannequin, bent = deg => { const q = M.neutral(); q.L.elbow = deg; return M.catalogPose(q); };
  const pose = deg => ({...model, EX:model.EX.filter(ex => ex.id === 'invrow').map(ex => ({...ex, anim:{...ex.anim, catalogVariants:null,
    catalogRig:t => t >= .37 && t <= .39 ? bent(deg) : ex.anim.catalogRig(t)}}))});
  assert(M.jointAngles(bent(-25)).L.elbow < -24, 'the substituted elbow really is hyperextended');
  const r = auditModel(pose(-25)), flag = r.warnings.find(f => f.rule === 'elbow-hyperextension:L');
  assert(flag && flag.t >= .37 && flag.t <= .39 && flag.magnitude > 19, JSON.stringify(r.warnings));
  assert(!r.warnings.some(f => f.rule === 'elbow-hyperextension:R'), 'the other arm is fine');
  assert(!auditModel(pose(-4)).warnings.some(f => /elbow/.test(f.rule)), '4° is within the limit (validator: −5°)');
});
test('detects a transient hand leaving the bar between keyframes', () => {
  const r = detects('bbrow',(R,t) => {if(t >= .37 && t <= .39) R.gripL[1] += 10;},'grip:L');
  const f = r.failures.find(f => f.rule === 'grip:L');
  assert(f.t >= .37 && f.t <= .39 && f.magnitude > 9);
});
test('detects a sliding support even when limb lengths remain valid', () => {
  detects('lunge',(R,t) => {R.toeR[2] += 8*t;},'anchor:toeR');
});
test('detects a sliding foot in the chest-supported row', () => {
  const r = detects('chestrowdb',(R,t) => {R.anL[2] += 8*t; R.anR[2] += 8*t;},'anchor:anL');
  assert(r.failures.some(f => f.rule === 'anchor:anR'));
});
/* известные сдвиги опор нынешних поз (ANCHOR_KNOWN) — долг поз: запись не выше замера и не ниже общего предела, иначе её
   пора убрать или правка позы ухудшила опору */
test('recorded support drifts only decrease and stay above the general limit', () => {
  const {LIM} = require('./mannequin/mech-audit.js');
  for (const [key, limit] of Object.entries(ANCHOR_KNOWN)) {
    const [id, point] = key.split(':'), ex = model.EX.find(e => e.id === id), base = point === 'hip' ? LIM.slipTrunk : LIM.slip;
    const rigs = [ex.anim.catalogRig, ...Object.values(ex.anim.catalogVariants || {})];
    let drift = 0; for (const rig of rigs) { const first = rig(0)[point]; for (let i = 0; i <= 100; i++) drift = Math.max(drift, Math.hypot(...rig(i/100)[point].map((v,k) => v - first[k]))); }
    assert(drift <= limit, `${key}: drift ${drift.toFixed(3)} cm grew past the record ${limit}`);
    assert(drift > base, `${key}: drift ${drift.toFixed(3)} cm is within the general ${base} cm — remove the record`);
    assert(limit - drift < .02, `${key}: lower the record to ${Math.ceil(drift*100)/100}`);
  }
});
test('detects a bench that does not support the head', () => {
  /* голова съехала за торец скамьи */
  detects('bbbench',R => {R.head[2] += 25;},'bench-support:head');
});
test('detects a missing bench under the back', () => {
  detects('dbbench',R => {R.props = R.props.filter(p => !(p.id || '').startsWith('bench:'));},'bench-present');
});
test('detects an elbow pointing toward the head at the bottom of the bench press', () => {
  detects('bbbench',(R,t) => {if (t >= .9) R.elL = R.shL.map((v,i) => v + R.u[i]*10);},'bench-elbow:L');
});
test('detects an overhead-press elbow behind the shoulder plane', () => {
  detects('ohp',R => {R.elL = R.shL.map((v,i) => v - R.n[i]*20);},'press-elbow:L');
});
test('detects bent arms in the deadlift beyond the straight arm', () => {
  const M = model.Mannequin, bent = () => { const q = M.neutral(); q.L.elbow = 25; return M.catalogPose(q); };
  const ex = only('deadlift')[0], r = auditModel({...model, EX:[{...ex, anim:{...ex.anim, catalogVariants:null,
    catalogRig:t => t >= .37 && t <= .39 ? bent() : ex.anim.catalogRig(t)}}]});
  const f = r.failures.find(f => f.rule === 'straight-arm:L');
  assert(f && f.t >= .37 && f.t <= .39 && f.magnitude > 15, JSON.stringify(r.failures));
  assert(!r.failures.some(f => f.rule === 'straight-arm:R' && f.magnitude > 5), 'the other arm hangs straight');
});
test('detects a dumbbell that left the hand', () => {
  detects('dbbench',(R,t) => {if (t > .5) R.props = R.props.map(p => p.kind === 'dumbbell' ? {...p, c:p.c.map((v,i) => v + [0,4,0][i])} : p);},'dumbbell-contact');
});
test('nonfinite coordinates are failures', () => {
  detects('latpull',R => {R.elR[0] = NaN;},'finite:elR');
});
test('detects a teleport between neighbouring samples', () => {
  detects('squat',(R,t) => {if (t >= .5) R.head = R.head.map((v,i) => v + [0,0,30][i]);},'continuity:head');
});
test('invalid sampling options fail clearly', () => {
  assert.throws(() => auditModel(model,{samples:1}),/samples/);
});
test('detects an out-of-range muscle curve instead of hiding it with color clamping', () => {
  const ex=model.EX.find(e=>e.id==='squat'),p=ex.anim.muscleProfile;
  const anim={...ex.anim,muscleProfile:{...p,muscles:{...p.muscles,quads:{...p.muscles.quads,concentric:[.34,1.5,.72]}}}};
  const r=auditModel({...model,EX:[{...ex,anim}]});
  assert(r.failures.some(f=>f.rule==='muscle-curve:quads'));
});
test('detects a missing camera rather than silently accepting the fallback projection', () => {
  const ex=model.EX.find(e=>e.id==='bbbench');
  const r=auditModel({...model,EX:[{...ex,anim:{...ex.anim,catalogCameras:['missing-camera']}}]});
  assert(r.failures.some(f=>f.rule==='camera-defined:missing-camera'));
});
/* Тяга гантелей лёжа на наклонной скамье: грудь на подушке спинки */
test('detects the inclined pad placed behind the back', () => {
  const r = detects('chestrowdb',R => {const p = chestPad(R); movePad(R, R.chestN.map(v => -v*45));},'chest-pad-side');
  assert(!r.failures.some(f => f.rule.startsWith('anchor:')));
});
test('detects a chest pad moved forward without contact', () => {
  const r = detects('chestrowdb',R => {const p = chestPad(R), n = padNormal(p), s = Math.sign(n.reduce((a,v,i) => a + v*(p.c[i]-R.sh[i]),0)) || 1; movePad(R, n.map(v => v*s*8));},'chest-pad-contact');
  assert(!r.failures.some(f => f.rule === 'chest-pad-side'));
});
test('detects chest liftoff between keyframes instead of checking only endpoints', () => {
  const r = auditModel(corrupted('chestrowdb',(R,t) => {if (t >= .37 && t <= .39) {const p = chestPad(R), n = padNormal(p), s = Math.sign(n.reduce((a,v,i) => a + v*(p.c[i]-R.sh[i]),0)) || 1; movePad(R, n.map(v => v*s*8));}}));
  const failure = r.failures.find(f => f.rule === 'chest-pad-contact');
  assert(failure && failure.t >= .37 && failure.t <= .39, JSON.stringify(r.failures));
});
test('detects a chest pad pushed through the chest', () => {
  detects('chestrowdb',R => {const p = chestPad(R), n = padNormal(p), s = Math.sign(n.reduce((a,v,i) => a + v*(p.c[i]-R.sh[i]),0)) || 1; movePad(R, n.map(v => -v*s*8));},'chest-pad-contact');
});
test('detects an inclined chest pad with the wrong orientation', () => {
  const r = detects('chestrowdb',R => {
    const p = chestPad(R), a = 15*Math.PI/180, rot = v => [v[0], v[1]*Math.cos(a) - v[2]*Math.sin(a), v[1]*Math.sin(a) + v[2]*Math.cos(a)];
    R.props = R.props.map(q => q === p ? {...q, x:rot(q.x), y:rot(q.y), z:rot(q.z)} : q);
  },'chest-pad-angle');
  assert(r.failures.some(f => f.rule === 'chest-pad-incline'), 'the bench incline no longer matches the description either');
});
test('detects a removed chest-support pad', () => {
  detects('chestrowdb',R => {R.props = R.props.filter(p => p.id !== 'bench:back');},'chest-pad-present');
});
/* Перенесено: длины сегментов — tools/catalog-audit.js (антропометрия манекена, Mannequin.B) */
test('catalog audit detects changed anatomical bone length', () => {
  const r = auditCatalog(corrupted('deadlift',R => {R.wrR[1] += 10;}), {samples:9});
  assert(r.failures.some(f => f.rule === 'bone:elR-wrR'), JSON.stringify(r.failures));
});
/* Перенесено: стопа на полу — заявленный контакт подошвы с полом (спецификация позы), его проверяет валидатор манекена в каждом
   кадре всех упражнений */
test('floor supports of the audited exercises are declared and a floating foot fails the validator', () => {
  for (const [id, rules] of Object.entries(CONTACT_RULES)) {
    const feet = POSES[id].contacts.filter(c => c.prop === 'floor' && !c.when).map(c => /^(sole|foot)(L|R)$/.exec(c.body)?.[2]).filter(Boolean).sort();
    assert.deepEqual(feet, [...(rules.floor || [])].sort(), id);
  }
  /* поза без отклонений проходит, та же поза над полом — нет */
  const M = model.Mannequin, FEET = [{body:'soleL', prop:'floor'}, {body:'soleR', prop:'floor'}];
  const stand = lift => { const q = M.neutral(); q.root.p = [0, M.B.hipHeight + lift, 0]; const R = M.catalogPose(q); R.props = []; return R; };
  const errors = R => checkFrame(R, {contacts:FEET}).issues.filter(i => i.rule === 'contact' && i.severity === 'error');
  assert.deepEqual(errors(stand(0)), []);
  assert(errors(stand(8)).length);
});
