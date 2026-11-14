#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
/* пределы суставов валидатора манекена: переразгибание локтя — тот же предел, что у mannequin:check */
const {LIM} = require('./biomech/validator2.js');

/* Test the model, not a browser projection. No build, DOM package or Playwright needed. */
/* storage — что уже лежит в localStorage до запуска приложения (первый запуск, данные прежних версий: first-run.test.js) */
function loadModel({root = path.resolve(__dirname, '..'), fullApp = false, storage:saved = {}} = {}) {
  const storage = new Map(Object.entries(saved));
  const document = {addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    createElement:() => ({style:{}, addEventListener() {}}), body:{appendChild() {}}};
  const context = {console, document, navigator:{}, location:{},
    localStorage:{getItem:k => storage.get(k) ?? null, setItem:(k,v) => storage.set(k, String(v)), removeItem:k => storage.delete(k)},
    setTimeout:() => 0, clearTimeout() {}, setInterval:() => 0, clearInterval() {},
    requestAnimationFrame:() => 0, cancelAnimationFrame() {}, matchMedia:() => ({matches:false})};
  context.window = context;
  vm.createContext(context);
  const dir = path.join(root, 'src/js');
  const files = fs.readdirSync(dir).filter(f => /^\d.*\.js$/.test(f) && Number.parseInt(f) < (fullApp ? 99 : 11)).sort();
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, {filename:file, timeout:10000});
  const get = expression => vm.runInContext(expression, context, {timeout:10000});
  const api = get('({EX, camera3, CAMERA3, muscleFrame, mannequinMuscleSurfaces, Mannequin:typeof Mannequin === "undefined" ? null : Mannequin})');
  return {...api, get};
}

const distance = (a,b) => Array.isArray(a) && Array.isArray(b) ? Math.hypot(...a.map((x,i) => x - b[i])) : Infinity;
const dot = (a,b) => a.reduce((sum,x,i) => sum + x*b[i], 0);
const sub = (a,b) => a.map((x,i) => x - b[i]);
const unit = a => { const n = Math.hypot(...a) || 1; return a.map(x => x/n); };
const angleDeg = (a,b) => Math.acos(Math.max(-1, Math.min(1, Math.abs(dot(unit(a),unit(b)))))) * 180/Math.PI;
/* расстояние от точки до оси детали: перекладина (beam a→b), гриф, гантель и цилиндр (c, axis) */
function axisOf(p) {
  if (p.kind === 'beam') return [p.a, unit(sub(p.b,p.a))];
  if (p.c && p.axis) return [p.c, unit(p.axis)];
  return null;
}
const axisDistance = (q,[o,d]) => { const w = sub(q,o), t = dot(w,d); return Math.hypot(...w.map((x,i) => x - d[i]*t)); };
const partsOf = (R, id) => R.props.filter(p => p.id === id || (p.id && p.id.startsWith(id + ':')));

/* Опоры и хваты, которые 14 упражнений обязаны сохранять (ключи — точки 3D-позы манекена). Висящие стопы и поднятые пятки
   свободны. floor — стопы, которые стоят на полу весь подход: касание пола заявлено в спецификации позы (контакт подошвы
   с полом) и проверяется валидатором манекена в каждом кадре (тест — biomechanics-audit.test.js). */
const CONTACT_RULES = {
  bbbench:{bar:true, anchors:['anL','anR'], floor:['L','R'], bench:true},
  dbbench:{anchors:['anL','anR'], floor:['L','R'], bench:true, dumbbells:true},
  bbrow:{bar:true, anchors:['anL','anR'], floor:['L','R']},
  latpull:{bar:true, anchors:['anL','anR'], floor:['L','R']},
  deadlift:{bar:true, anchors:['anL','anR'], floor:['L','R'], straightArms:true},
  dbpress:{anchors:['anL','anR'], floor:['L','R'], dumbbells:true},
  ohp:{bar:true, anchors:['anL','anR'], floor:['L','R']},
  chinup:{bar:true, anchors:['gripL','gripR']},
  hipthrust:{bar:true, anchors:['anL','anR'], floor:['L','R']},
  bulgarian:{anchors:['anL','anR'], floor:['L'], dumbbells:true},
  rdl:{bar:true, anchors:['anL','anR'], floor:['L','R'], straightArms:true, dumbbells:true},
  squat:{bar:true, anchors:['anL','anR'], floor:['L','R']},
  lunge:{anchors:['toeL','toeR'], floor:['L','R'], dumbbells:true},
  chestrowdb:{anchors:['hip','anL','anR'], floor:['L','R'], chestPad:true}
};
/* Неподвижная опора не скользит: сдвиг точки опоры от первого кадра — не больше, чем аудит механики разрешает стопе и кисти
   на детали (LIM.slip, 0,5 см) и тазу или спине на сиденье (LIM.slipTrunk, 1 см; tools/mannequin/mech-audit.js).
   Записанные сдвиги нынешних поз — долг поз: числа только убывают (правка — в спецификации упражнения, с ревью владельца).
   Долг погашен (4.76.0 → fix/anchor-drift): у становой тяги, приседаний, подтягиваний и выпадов опоры ехали между ключами
   позы (углы интерполируются, точка опоры — нет) — ключи чаще; у тяги грудью на скамье таз переставлялся в каждом кадре
   вслед за грудным отделом — теперь ставится один раз. Новая запись — только с причиной. */
const ANCHOR_KNOWN = {};
/* Прямая рука: сгибание локтя до 5° от самой прямой руки манекена. Двухзвенная кинематика манекена не выпрямляет руку до
   конца — тянется до 0,9995 длины (twoBone в 09bm-mannequin.js), и прямая рука — это сгибание 2·acos(0,9995) ≈ 3,6°. */
const STRAIGHT_ARM = 5, REACH = .9995;

function auditModel(model, {samples = 101} = {}) {
  if (!Number.isInteger(samples) || samples < 9 || samples > 2001) throw new Error('samples must be an integer from 9 to 2001');
  const {EX, CAMERA3, Mannequin, mannequinMuscleSurfaces} = model, M = Mannequin;
  const {regionPoints, bodyPoints, collider} = require('./biomech/validator2.js');
  const SLIP = require('./mannequin/mech-audit.js').LIM;
  const straight = (() => { const a = M.B.ua, b = M.B.fa, d = REACH*(a+b); return 180 - Math.acos((a*a+b*b-d*d)/(2*a*b))*180/Math.PI; })();
  const failures = new Map(), warnings = new Map();
  const stats = {exercises:0, poses:0, mannequinPoses:0, cameraChecks:0, muscleProfiles:0, musclePoses:0, contactPoses:0, checks:0};
  function check(ok, ex, rule, t, detail, magnitude = 1) {
    stats.checks++;
    if (ok) return;
    const key = ex.id + ':' + rule;
    const old = failures.get(key);
    if (!old || magnitude > old.magnitude) failures.set(key, {exercise:ex.id, rule, t, detail, magnitude});
  }
  function warn(ex, rule, t, detail, magnitude = 1) {
    const key = ex.id + ':' + rule;
    const old = warnings.get(key);
    if (!old || magnitude > old.magnitude) warnings.set(key, {exercise:ex.id, rule, t, detail, magnitude});
  }
  for (const ex of EX) {
    const a = ex.anim;
    if (!a || typeof a.catalogRig !== 'function') { check(false, ex, 'missing-animation', 0, 'Exercise has no mannequin pose'); continue; }
    stats.exercises++;
    if (a.muscleProfile) {
      stats.muscleProfiles++;
      check(a.muscleProfile.curveBasis === 'illustrative',ex,'muscle-curve-basis',0,'Pilot curves must be identified as illustrative');
      for (const [id,m] of Object.entries(a.muscleProfile.muscles)) {
        check(['primary','support','stabilizer'].includes(m.role),ex,'muscle-role:'+id,0,'Unknown muscle role');
        const valid = ['concentric','eccentric'].every(k=>Array.isArray(m[k])&&m[k].length===3&&m[k].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
        check(valid,ex,'muscle-curve:'+id,0,'Brightness knots must be finite values in [0,1]');
        if(valid)check(m.concentric[0]===m.eccentric[0]&&m.concentric[2]===m.eccentric[2],ex,'muscle-turn:'+id,0,'Phase endpoints must match to avoid flashes at holds/turns');
      }
    }
    /* каждый ракурс разбора — своя проекция той же позы */
    for (const camera of a.catalogCameras || []) { stats.cameraChecks++; check(Object.prototype.hasOwnProperty.call(CAMERA3,camera),ex,'camera-defined:'+camera,0,'Declared camera must have its own projection'); }
    const rules = CONTACT_RULES[ex.id], profile = a.catalogProfile;
    const rigs = [['', a.catalogRig, () => false], ...Object.entries(a.catalogVariants || {}).map(([v,rig]) => [v, rig, k => k === v])];
    for (const [variant, rig, has] of rigs) {
      const tag = variant ? ' ('+variant+')' : '', first = rig(0);
      let previous;
      for (let i=0; i<samples; i++) {
        const t = i/(samples-1), R = rig(t);
        if (!variant) stats.poses++;
        stats.mannequinPoses++;
        for (const [key,p] of Object.entries(R)) if (Array.isArray(p) && typeof p[0] === 'number') {
          const finite = p.every(Number.isFinite);
          check(finite, ex, 'finite:'+key, t, 'Pose coordinates must be finite'+tag);
          if (finite && previous?.[key]) {
            const step = distance(p,previous[key]);
            /* порог по плотности выборки: настоящий разрыв (телепорт) виден при любой */
            check(step <= 12 * 100/(samples-1), ex, 'continuity:'+key, t, `Jump ${step.toFixed(3)} cm${tag}`, step);
          }
        }
        /* переразгибание локтя — Mannequin.jointAngles, тот же расчёт и предел, что у валидатора (LIM.elbow) */
        const A = M.jointAngles(R);
        for (const side of ['L','R']) {
          const elbow = A[side].elbow;
          check(Number.isFinite(elbow), ex, 'elbow-angle:'+side, t, 'Elbow angle of the 3D pose must be finite');
          if (elbow < LIM.elbow[0]) warn(ex, 'elbow-hyperextension:'+side, t, `Elbow hyperextended by ${(-elbow).toFixed(1)}° in the 3D pose${tag} (limit ${-LIM.elbow[0]}°)`, LIM.elbow[0]-elbow);
        }
        /* области мышц на поверхности манекена: не трогают позу, конечны и принадлежат профилю упражнения */
        if (!variant && profile && (i%10 === 0 || i === samples-1)) {
          stats.musclePoses++;
          const before = JSON.stringify(R), zones = mannequinMuscleSurfaces(R,profile);
          check(JSON.stringify(R) === before, ex, 'muscle-pose-integrity', t, 'Muscle surfaces must not change joints or equipment');
          for (const zone of zones) {
            check(zone.points.every(p=>p.length===3&&p.every(Number.isFinite))&&zone.normal.every(Number.isFinite)&&(!zone.anchor||zone.anchor.every(Number.isFinite)),ex,'muscle-surface:'+zone.id,t,'Muscle surface coordinates must be finite');
            check(zone.id in profile.regions, ex, 'muscle-profile:'+zone.id, t, 'A surface must belong to the exercise profile');
          }
        }
        if (rules) {
          stats.contactPoses++;
          for (const key of rules.anchors) {
            const drift = distance(R[key], first[key]), trunk = key === 'hip', limit = ANCHOR_KNOWN[ex.id+':'+key] ?? (trunk ? SLIP.slipTrunk : SLIP.slip);
            check(drift <= limit, ex, 'anchor:'+key, t, `Support drift ${drift.toFixed(3)} cm${tag} (limit ${limit} cm)`, drift);
          }
          for (const side of ['L','R']) {
            if (rules.bar) {
              /* кисть может скользить вдоль грифа или перекладины, но не уходить с его оси */
              const c = R.contacts.find(k => k.body === 'grip'+side), parts = c ? partsOf(R, c.prop).map(axisOf).filter(Boolean) : [];
              const error = parts.length ? Math.min(...parts.map(ax => axisDistance(R['grip'+side], ax))) : Infinity;
              check(error <= .75, ex, 'grip:'+side, t, `Hand/bar gap ${error.toFixed(3)} cm${tag}`, error);
            }
            if (rules.straightArms) {
              const bend = A[side].elbow - straight;
              check(bend <= STRAIGHT_ARM, ex, 'straight-arm:'+side, t, `Elbow flexion ${bend.toFixed(2)}° beyond the straight arm${tag}`, bend);
            }
            if (rules.bench && t >= .9) {
              const headward = dot(sub(R['el'+side],R['sh'+side]),R.u);
              check(headward <= 0, ex, 'bench-elbow:'+side, t, 'At the bottom, elbow must not point toward the head', headward);
            }
            if (['ohp','dbpress'].includes(ex.id) && t < .85) {
              const forward = dot(sub(R['el'+side],R['sh'+side]),R.n);
              check(forward >= -2, ex, 'press-elbow:'+side, t, 'Elbow is behind the shoulder plane', -forward);
            }
          }
          if (rules.dumbbells) for (const p of R.props.filter(q => q.kind === 'dumbbell' && GymEquipmentVisible(model, q, has))) {
            const error = Math.min(distance(p.c,R.gripL), distance(p.c,R.gripR));
            check(error <= .75, ex, 'dumbbell-contact', t, `Hand/dumbbell gap ${error.toFixed(3)} cm${tag}`, error);
          }
          if (rules.bench) {
            /* скамья под спиной: голова (с запасом на её радиус), плечи и таз — в пределах длины подушки */
            const c = R.contacts.find(k => k.body === 'back'), pad = c && partsOf(R, c.prop).find(p => p.kind === 'obox');
            check(!!pad, ex, 'bench-present', t, 'Support bench missing');
            if (pad) {
              const k = pad.size.indexOf(Math.max(...pad.size)), ax = unit([pad.x,pad.y,pad.z][k]), half = pad.size[k]/2;
              for (const key of ['head','sh','hip']) {
                const along = Math.abs(dot(sub(R[key],pad.c),ax)), margin = key === 'head' ? 9 : 0;
                check(along + margin <= half, ex, 'bench-support:'+key, t, 'Body point falls outside the bench length', along + margin - half);
              }
            }
          }
          if (rules.chestPad) {
            /* грудь на наклонной подушке: одна опора груди, подушка перед грудью, грудь в пределах её длины и на её поверхности,
               корпус вдоль подушки, наклон подушки как в описании (30–45°) */
            const pads = R.contacts.filter(k => k.body === 'front').map(k => partsOf(R, k.prop).find(p => p.kind === 'obox')).filter(Boolean);
            check(pads.length === 1, ex, 'chest-pad-present', t, 'Exactly one chest-support pad is required');
            if (pads.length === 1) {
              const pad = pads[0], k = pad.size.indexOf(Math.max(...pad.size)), ax = unit([pad.x,pad.y,pad.z][k]), half = pad.size[k]/2;
              const col = [collider(pad)].flat()[0], chest = regionPoints('front', bodyPoints(R), R), cache = M.torsoCache(R);
              let nearest = null, gap = Infinity; for (const p of chest) { const d = col.sdf(p.p); if (d < gap) { gap = d; nearest = p.p; } }
              /* насколько подушка ушла в корпус: глубина её точек внутри поверхности туловища */
              const depth = Math.max(0, ...col.pts.map(q => -M.torsoSDF(R, q, cache)));
              const forward = dot(sub(pad.c, R.sh), R.chestN || R.n);
              check(forward > 0, ex, 'chest-pad-side', t, 'Pad must be in front of the chest, not behind the back', -forward);
              const along = dot(sub(nearest, pad.c), ax);
              check(Math.abs(along) <= half, ex, 'chest-pad-coverage', t, 'Chest contact falls outside the pad length');
              /* грудь не отходит от подушки дальше 0,75 см и не проходит сквозь неё: поджатие мягких тканей и обивки заявленной
                 опорой — в пределах допуска валидатора манекена (мягкая 4 см, жёсткая 2 см; validator2.js, проникновение) */
              const sink = col.soft ? 4 : 2;
              check(gap <= .75 && depth <= sink, ex, 'chest-pad-contact', t, `Chest/pad gap ${gap.toFixed(3)} cm, pad ${depth.toFixed(2)} cm inside the chest`, Math.max(gap, depth - sink));
              const tilt = angleDeg(ax, R.u);
              check(tilt <= 5, ex, 'chest-pad-angle', t, `Pad/torso angle mismatch ${tilt.toFixed(2)}°`, tilt);
              const incline = Math.asin(Math.min(1, Math.abs(ax[1]))) * 180/Math.PI;
              check(incline >= 30 && incline <= 45, ex, 'chest-pad-incline', t, `Bench incline ${incline.toFixed(2)}° does not match the exercise description`);
            }
          }
        }
        previous = R;
      }
    }
  }
  return {stats, failures:[...failures.values()], warnings:[...warnings.values()],
    limitations:['This audits the 3D mannequin poses the app shows (all variants, all samples) for declared supports, grips, bars and pads; it does not validate medical safety, individual mobility, muscle force or collisions (tools/biomech/validator2.js does).', 'Floor contact, penetration, joint limits (knee, elbow), holds and balance are checked frame by frame by the mannequin validator (npm run mannequin:check).', 'Muscle checks validate illustrative brightness curves and finite attached surfaces, not physiological activation or force.']};
}
function GymEquipmentVisible(model, p, has) {
  return model.get('GymEquipment').visible(p, has);
}

function elbowProfile(model) {
  for (const id of Object.keys(CONTACT_RULES)) {
    const ex = model.EX.find(e => e.id === id);
    console.log(ex.id);
    for (const t of [0,.25,.5,.75,1]) {
      const R = ex.anim.catalogRig(t);
      console.log('  '+t+' '+['L','R'].map(s => {
        const d = sub(R['el'+s],R['sh'+s]);
        return `${s}: forward=${dot(d,R.n).toFixed(2)}, headward=${dot(d,R.u).toFixed(2)}, lateral=${d[0].toFixed(2)}`;
      }).join(' | '));
    }
  }
}

function main(args) {
  const opts = {};
  let json = false, elbows = false;
  for (let i=0; i<args.length; i++) {
    if (args[i] === '--samples') opts.samples = Number(args[++i]);
    else if (args[i] === '--json') json = true;
    else if (args[i] === '--elbows') elbows = true;
    else if (args[i] === '--help') { console.log('node tools/biomechanics-audit.js [--samples 101] [--json] [--elbows]'); return; }
    else throw new Error('Unknown argument: '+args[i]);
  }
  const model = loadModel();
  if (elbows) { elbowProfile(model); return; }
  const report = auditModel(model,opts);
  if (json) console.log(JSON.stringify(report,null,2));
  else {
    console.log(`Biomechanics (3D): ${report.stats.exercises} exercises, ${report.stats.mannequinPoses} mannequin poses (${report.stats.contactPoses} with support rules), ${report.stats.musclePoses} muscle-surface poses, ${report.stats.muscleProfiles} muscle profiles; ${report.failures.length} errors, ${report.warnings.length} review flags.`);
    for (const f of report.failures) console.log(`ERROR ${f.exercise} / ${f.rule} @ ${f.t.toFixed(3)}: ${f.detail}`);
    for (const f of report.warnings) console.log(`REVIEW ${f.exercise} / ${f.rule} @ ${f.t.toFixed(3)}: ${f.detail}`);
  }
  process.exitCode = report.failures.length ? 1 : 0;
}

module.exports = {loadModel, auditModel, CONTACT_RULES, ANCHOR_KNOWN, main};
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
