const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loadModel}=require('./biomechanics-audit');
const model=loadModel({fullApp:true});
const {muscleFrame,mannequinMuscleSurfaces,camera3,motionFrame,muscleColor}=model.get('({muscleFrame,mannequinMuscleSurfaces,camera3,motionFrame,muscleColor})');
/* три исходных профиля ригов и профили прицельных упражнений каталога; области мышц — на поверхности манекена (catalogProfile) */
const ORIGINAL=['bbbench','latpull','squat'],TARGETED=['bandextrot','cableadduct','cableextrot','copenhagen','copenhagenknee'],ECCENTRIC=['nordic'],SWING=['kbswing','kbswing1'];
const authored=model.EX.filter(ex=>ex.anim.muscleProfile),pilot=authored.filter(ex=>ORIGINAL.includes(ex.id));
test('three original hand-authored profiles remain intact alongside the catalog',()=>{
 assert.deepEqual(Array.from(authored,ex=>ex.id).sort(),[...ORIGINAL,...TARGETED,...ECCENTRIC,...SWING].sort());
 assert.deepEqual(Array.from(pilot,ex=>ex.id).sort(),ORIGINAL);
 for(const ex of pilot){
  const p=ex.anim.muscleProfile;
  assert.equal(p.curveBasis,'illustrative');assert(p.sources.length>0);
  assert(ex.anim.catalogCameras.includes(p.pair));
  for(const id of ex.pri)assert.equal(p.muscles[id].role,'primary');
 }
 const unsupported=model.EX.find(ex=>ex.id==='deadlift');
 assert.equal(unsupported.anim.muscleProfile,undefined);
 assert.equal(unsupported.anim.catalogProfile.muscles.lowback.role,'primary');
 assert(muscleFrame(unsupported.anim,.5,0).values.lowback>0);
});
test('lowering remains active and differs from lifting at the same pose',()=>{
 for(const ex of pilot){
  const first=muscleFrame(ex.anim,.5,0),second=muscleFrame(ex.anim,.5,2),primary=ex.pri[0];
  assert.notEqual(first.phase,second.phase);
  assert(first.values[primary]>0);assert(second.values[primary]>0);
  assert.notEqual(first.values[primary],second.values[primary]);
  const concentric=first.phase==='concentric'?first:second;
  const eccentric=first.phase==='eccentric'?first:second;
  assert(concentric.values[primary]>eccentric.values[primary]);
 }
});
test('all phase turns and long holds preserve brightness without flashes',()=>{
 for(const ex of pilot)for(const t of [0,1]){
  const pause=muscleFrame(ex.anim,t,t===1?1:3);
  for(const index of [0,2]){
   const exact=muscleFrame(ex.anim,t,index),near=muscleFrame(ex.anim,t===0?1e-5:1-1e-5,index);
   for(const id of Object.keys(pause.values)){
    assert.equal(exact.values[id],pause.values[id]);
    assert(Math.abs(near.values[id]-pause.values[id])<1e-7);
   }
  }
  const F={it:{ex},durations:[2000,1000,3000,1000],clock:t===1?2400:6400};
  const frame=motionFrame(F);assert.equal(frame.t,t);
  assert.deepEqual(muscleFrame(ex.anim,frame.t,frame.index).values,pause.values);
 }
});
test('scrubbing, playback speed and zero-duration pauses use the same phase model',()=>{
 for(const ex of pilot){
  const F={it:{ex},durations:[3000,0,1000,0],clock:1500},a=motionFrame(F);
  F.clock=3500;const b=motionFrame(F);
  assert(Math.abs(a.t-b.t)<1e-12);assert.equal(a.index,0);assert.equal(b.index,2);
  const state=muscleFrame(ex.anim,b.t,b.index);F.paused=true;
  assert.deepEqual(muscleFrame(ex.anim,motionFrame(F).t,motionFrame(F).index),state);
 }
});
test('curves and colors stay finite and continuous across a dense sweep',()=>{
 for(const ex of pilot)for(const index of [0,2]){
  let previous;
  for(let i=0;i<=1000;i++){
   const state=muscleFrame(ex.anim,i/1000,index);
   for(const[id,v]of Object.entries(state.values)){
    assert(Number.isFinite(v)&&v>=0&&v<=1);assert.match(muscleColor(v),/^#[0-9a-f]{6}$/);
    if(previous)assert(Math.abs(v-previous[id])<.003);
   }
   previous=state.values;
  }
 }
});
test('surfaces follow the skeleton and cannot alter the pose or contacts',()=>{
 for(const ex of pilot)for(const t of [0,.25,.5,.75,1]){
  const p=ex.anim.catalogProfile,R=ex.anim.catalogRig(t),before=JSON.stringify(R),faces=mannequinMuscleSurfaces(R,p);
  assert.equal(JSON.stringify(R),before);
  const ids=new Set(faces.map(f=>f.id));
  /* каждая мышца авторского профиля видна хотя бы одной своей областью на поверхности манекена */
  for(const id of Object.keys(ex.anim.muscleProfile.muscles))assert(Object.entries(p.regions).some(([k,r])=>r.parent===id&&ids.has(k)),ex.id+' '+id);
  for(const id of ids)assert(id in p.regions,ex.id+' '+id);
  for(const face of faces){
   assert(face.points.every(p=>p.length===3&&p.every(Number.isFinite)));
   assert(Math.abs(Math.hypot(...face.normal)-1)<1e-8);
  }
 }
});
/* видимость — тот же отбор по нормали к ракурсу, что у SVG-фигуры (buildSpatialFigure, 07-rigs-core.js) */
const visible=(R,p,camera)=>{const project=camera3(camera),o=project([0,0,0]);return mannequinMuscleSurfaces(R,p,{coarse:true}).filter(f=>project(f.normal)[2]-o[2]>.035);};
test('rear torso muscles disappear in front views and appear in their own rear view',()=>{
 const lat=pilot.find(ex=>ex.id==='latpull'),R=lat.anim.catalogRig(.5),p=lat.anim.catalogProfile;
 const front=visible(R,p,'front'),back=visible(R,p,'back');
 assert(!front.some(f=>f.id==='midback'));assert(back.some(f=>f.id==='midback'));
 assert(back.some(f=>f.id==='lats'));assert(!back.some(f=>f.id==='abs'));
 const bench=pilot.find(ex=>ex.id==='bbbench'),bp=bench.anim.catalogProfile;
 assert(visible(bench.anim.catalogRig(.5),bp,'above').some(f=>bp.regions[f.id]?.parent==='chest'));
});
/* прицельные упражнения на приводящие и манжету: профиль ведёт каталог (catalogProfile), цель — основная мышца,
   опускание слабее подъёма, на краях фаз яркость одна и та же, источники — исследования ЭМГ */
test('targeted adductor and rotator-cuff profiles drive the catalog colours',()=>{
 for(const id of TARGETED){
  const ex=model.EX.find(e=>e.id===id),p=ex.anim.muscleProfile,c=ex.anim.catalogProfile;
  assert.equal(p.curveBasis,'illustrative');assert(p.sources.length>0&&p.sources.every(([t,u])=>t.length>10&&/^https:\/\/doi\.org\//.test(u)),id+' cites the EMG study by DOI');
  for(const m of ex.pri){assert.equal(p.muscles[m].role,'primary',id+' '+m);assert.equal(c.muscles[m].role,'primary');}
  for(const m of ex.sec)assert(p.muscles[m],id+' profiles its helper '+m);
  for(const[m,v]of Object.entries(p.muscles)){
   assert.equal(v.concentric[0],v.eccentric[0]);assert.equal(v.concentric[2],v.eccentric[2]);
   if(v.role!=='stabilizer')assert(v.concentric[1]>v.eccentric[1],id+' '+m+': lifting brighter than lowering');
  }
  const up=muscleFrame(ex.anim,.5,0).values,down=muscleFrame(ex.anim,.5,2).values,main=ex.pri[0];
  assert(up[main]>down[main]&&up[main]>.6,id+' main muscle is bright in the working phase');
 }
});
/* уступающий акцент (этап А аудита анатомии): скандинавские сгибания — поза 0→1 поднимается толчком рук, главная работа
   задней поверхности бедра — медленное опускание 1→0: ярче всего горит в нём, края фаз общие, источник — по DOI */
test('the Nordic curl profile is brightest while lowering',()=>{
 for(const id of ECCENTRIC){
  const ex=model.EX.find(e=>e.id===id),p=ex.anim.muscleProfile,c=ex.anim.catalogProfile;
  assert.equal(ex.anim.eccFirst,false,id+': the pose rises first, the lowering is the return');
  assert(p.sources.length>0&&p.sources.every(([t,u])=>t.length>10&&/^https:\/\/doi\.org\//.test(u)),id+' cites the study by DOI');
  for(const m of ex.pri){assert.equal(p.muscles[m].role,'primary');assert.equal(c.muscles[m].role,'primary');}
  for(const m of ex.sec)assert(p.muscles[m],id+' profiles its helper '+m);
  for(const v of Object.values(p.muscles)){assert.equal(v.concentric[0],v.eccentric[0]);assert.equal(v.concentric[2],v.eccentric[2]);}
  const up=muscleFrame(ex.anim,.5,0),down=muscleFrame(ex.anim,.5,2),main=ex.pri[0];
  assert.equal(up.phase,'concentric');assert.equal(down.phase,'eccentric');
  assert(down.values[main]>up.values[main]+.2&&down.values[main]>.8,id+' main muscle is brightest while lowering');
 }
});
/* махи гирей (4.110, замечание анатома 7): доли — по ЭМГ McGill и Marshall, 2012 (табл. 1): разгибатели спины около половины
   MVC с пиком в первой половине разгона — уже в нижней точке «заметное участие», а не стабилизатор; большая ягодичная — 76 %
   у полного разгибания таза наверху — ярче всего в конце разгона; в нижней точке (замах) ягодичные и задняя поверхность бедра
   держат вес — не «слабое участие» */
test('kettlebell swings: shares follow the EMG — erectors and glutes work at the bottom, glutes peak at the top',()=>{
 for(const id of SWING){
  const ex=model.EX.find(e=>e.id===id),p=ex.anim.muscleProfile,c=ex.anim.catalogProfile;
  assert(p.sources.length>0&&p.sources.every(([t,u])=>/McGill/.test(t)&&/^https:\/\//.test(u)),id+' cites McGill and Marshall, 2012');
  for(const m of ex.pri){assert.equal(p.muscles[m].role,'primary');assert.equal(c.muscles[m].role,'primary');}
  assert.equal(p.muscles.lowback.role,'support',id+': the erectors are not a stabilizer here');
  for(const v of Object.values(p.muscles)){assert.equal(v.concentric[0],v.eccentric[0]);assert.equal(v.concentric[2],v.eccentric[2]);}
  const bottom=muscleFrame(ex.anim,0,3).values,top=muscleFrame(ex.anim,1,1).values,up=muscleFrame(ex.anim,.5,0).values;
  for(const m of ['glutes','hams','lowback'])assert(bottom[m]>=.45,id+' '+m+' at the bottom: '+bottom[m]);
  assert(top.glutes>=.72&&top.glutes>up.glutes,id+': glutes brightest at full hip extension');
  assert(up.lowback>=.45&&up.lowback>top.lowback,id+': the erectors peak early in the drive');
 }
});
