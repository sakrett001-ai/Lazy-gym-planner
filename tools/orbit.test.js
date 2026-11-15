/* Свободная камера сцены разбора и экрана тренировки (src/volume/orbit.mjs): математика без браузера.
   Точки движения — настоящие: сцена каталога (src/volume/scene.mjs) по фазам повторения, как рамка фигуры в main.mjs
   (13 положений); проверка «в кадре» — по 25 положениям. Жесты и перерисовка на воспроизведении — tools/ui-check.mjs. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loadModel}=require('./biomechanics-audit');

let ctx=null;
async function setup(){
 if(ctx)return ctx;
 const O=await import('../src/volume/orbit.mjs'),S=await import('../src/volume/scene.mjs'),THREE=await import('three'),m=loadModel();
 const{catalogVolumeData,muscleColor}=m.get('({catalogVolumeData,muscleColor})'),cache=new Map();
 /* точки рамки по фазам: poses[i] — все точки положения t = i/steps (углы деталей и выборка кожи, как в scene.includeBounds) */
 const motion=(id,steps=24)=>{
  const key=id+'|'+steps;if(cache.has(key))return cache.get(key);
  const anim=m.EX.find(e=>e.id===id).anim,view=S.createCatalogScene(catalogVolumeData(anim,0,0)),poses=[];
  for(let i=0;i<=steps;i++){const pts=[];view.apply(catalogVolumeData(anim,i/steps,0),{color:muscleColor});view.includeBounds(undefined,(x,y,z)=>pts.push([x,y,z]));poses.push(pts);}
  view.dispose();cache.set(key,poses);return poses;
 };
 /* рамка фигуры — по 13 положениям (через одно из 25), как в main.mjs */
 const fitOf=(id,o={})=>{const c=O.frameCollector(S.CAMERA_SETTINGS,o);motion(id).forEach((pts,i)=>{if(i%2===0)for(const p of pts)c.add(...p);});return c.data();};
 return ctx={O,S,THREE,m,motion,fitOf,opts:{settings:S.CAMERA_SETTINGS}};
}
const IDS=['latpull','squat','bbbench','legpress','dbcurl','pushup'],ASPECTS=[.75,1.15,1.94,3,4.2];

test('preset frames with perspective hold the whole motion (all 25 poses, all presets, any stage proportions) and stay tight',async()=>{
 const{O,motion,fitOf,opts}=await setup();
 let loosest=1;
 for(const id of IDS){
  const fit=fitOf(id),all=motion(id).flat(),fitted=motion(id).filter((_,i)=>i%2===0).flat();
  assert(O.validFrame(JSON.parse(JSON.stringify(fit)),opts),'рамка переживает запись в память и годится');
  for(const cam of Object.keys(opts.settings))for(const aspect of ASPECTS){
   const v=O.presetView(fit,cam,aspect,opts),ndc=p=>O.projectPoint(fit,v,aspect,p,opts);
   let mx=0,my=0;
   for(const p of fitted){const q=ndc(p);assert(q[2]>0,`${id}/${cam}: точка перед камерой`);mx=Math.max(mx,Math.abs(q[0]));my=Math.max(my,Math.abs(q[1]));}
   /* 13 положений — внутри кадра с полями; все 25 — внутри кадра */
   assert(Math.max(mx,my)<=1/O.FRAME_PAD+1e-6,`${id}/${cam}/${aspect}: 13 положений в кадре с полями (${Math.max(mx,my).toFixed(4)})`);
   for(const p of all){const q=ndc(p);assert(Math.abs(q[0])<=1&&Math.abs(q[1])<=1,`${id}/${cam}/${aspect}: все 25 положений в кадре`);}
   /* кадр не просторнее нужного: по тесному направлению движение доходит почти до полей */
   loosest=Math.min(loosest,Math.max(mx,my)*O.FRAME_PAD);
  }
 }
 assert(loosest>.9,`кадр предустановки тесный, как ортографический (самый свободный — ${loosest.toFixed(3)} от полей)`);
});

test('perspective presets keep the orthographic composition: the motion fills about the same share of the frame, centered alike',async()=>{
 const{O,motion,fitOf,opts}=await setup();
 const ortho={...opts,fov:0};
 for(const id of ['latpull','squat','bbbench']){
  const fit=fitOf(id),flat=fitOf(id,ortho),pts=motion(id).filter((_,i)=>i%2===0).flat();
  for(const cam of Object.keys(opts.settings))for(const aspect of [.85,1.94]){
   const span=(f,o)=>{const v=O.presetView(f,cam,aspect,o);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){const q=O.projectPoint(f,v,aspect,p,o);x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}return{w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2};};
   const a=span(flat,ortho),b=span(fit,opts),fill=x=>Math.max(x.w,x.h);
   assert(Math.abs(fill(b)/fill(a)-1)<.06,`${id}/${cam}/${aspect}: доля кадра под движением почти та же (${fill(a).toFixed(3)} → ${fill(b).toFixed(3)})`);
   assert(Math.abs(b.cx-a.cx)<.08&&Math.abs(b.cy-a.cy)<.08,`${id}/${cam}/${aspect}: движение по центру, как раньше`);
  }
 }
});

test('the orbit pivot is the middle of the whole-motion box: it stays put on screen while turning, and zoomed out to the limit the motion stays in frame at any angle',async()=>{
 const{O,motion,fitOf,opts}=await setup();
 for(const id of ['kbswing','latpull']){
  const fit=fitOf(id),pts=motion(id).filter((_,i)=>i%2===0).flat(),C=O.boxCenter(fit.box);
  /* коробка рамки — по всем фазам, а не по одной позе */
  const lo=[0,1,2].map(k=>Math.min(...pts.map(p=>p[k]))),hi=[0,1,2].map(k=>Math.max(...pts.map(p=>p[k])));
  for(let k=0;k<3;k++)assert(Math.abs(C[k]-(lo[k]+hi[k])/2)<2e-4,`${id}: центр вращения — середина рамки движения`);
  const one=motion(id)[0],c0=[0,1,2].map(k=>(Math.min(...one.map(p=>p[k]))+Math.max(...one.map(p=>p[k])))/2);
  if(id==='kbswing')assert(Math.hypot(...c0.map((v,k)=>v-C[k]))>.1,'центр одной позы — не центр вращения: мах гирей уходит далеко от исходной позы');
  const aspect=1.15,v0=O.presetView(fit,'angle',aspect,opts),at0=O.projectPoint(fit,v0,aspect,C,opts);
  let v=v0;
  for(const[dy,dp]of [[.7,.1],[1.9,.3],[-2.5,-.2],[3.1,.6]]){
   v=O.rotateView(v,dy,dp,O.viewLimits(fit,v,aspect,opts));const q=O.projectPoint(fit,v,aspect,C,opts);
   assert(Math.abs(q[0]-at0[0])<1e-9&&Math.abs(q[1]-at0[1])<1e-9,`${id}: при повороте центр движения на месте`);
  }
  /* предельное отдаление: всё движение в кадре при любом повороте */
  for(let i=0;i<24;i++){
   const w={...v0,yaw:i*.7,pitch:(i%6)/6*1.2-.1,ox:0,oy:0},lim=O.viewLimits(fit,w,aspect,opts),z={...w,zoom:lim.zMin};
   assert(lim.zMin<=1&&lim.zMin>=O.ZOOM_FLOOR);
   for(const p of pts){const q=O.projectPoint(fit,z,aspect,p,opts);assert(Math.abs(q[0])<=1&&Math.abs(q[1])<=1,`${id}: отдалено до предела — движение в кадре (поворот ${i})`);}
  }
 }
});

test('tilt and zoom limits: the camera never goes under the floor, zoom runs from the whole motion to ×4; a camera already past a limit is not yanked back',async()=>{
 const{O,fitOf,opts}=await setup();
 const D=Math.PI/180;
 for(const id of ['pushup','squat','legpress']){
  const fit=fitOf(id),aspect=1.15;
  for(const cam of ['front','side','above']){
   const start=O.presetView(fit,cam,aspect,opts);let v=start;
   const up=O.rotateView(v,0,3,O.viewLimits(fit,v,aspect,opts));assert(Math.abs(up.pitch-O.PITCH_MAX*D)<1e-9,'наклон вверх — до почти отвесного');
   for(let i=0;i<40;i++)v=O.rotateView(v,.05,-.05,O.viewLimits(fit,v,aspect,opts));
   const lim=O.viewLimits(fit,v,aspect,opts),pose=O.cameraPose(fit,v,aspect,opts);
   assert(v.pitch>=O.PITCH_MIN*D-1e-9,`${id}/${cam}: не ниже ${O.PITCH_MIN}°`);
   /* упёрлись в нижнюю границу (или остались на высоте предустановки, если она уже ниже) */
   assert(Math.abs(v.pitch-Math.min(lim.pitchMin,start.pitch))<1e-6,`${id}/${cam}: наклон вниз — до границы`);
   assert(pose.position[1]>=Math.min(O.FLOOR_CLEAR,O.cameraPose(fit,start,aspect,opts).position[1])-.02,`${id}/${cam}: камера над полом (${pose.position[1].toFixed(3)} м)`);
   const zin=O.zoomView(v,100,0,0,aspect,lim),zout=O.zoomView(v,.001,0,0,aspect,lim);
   assert.equal(zin.zoom,O.ZOOM_MAX,'приближение — до ×4');
   assert(Math.abs(zout.zoom-lim.zMin)<1e-12&&zout.zoom<=1,'отдаление — до «всё движение в кадре»');
  }
  /* наклон уже ниже границы (её сдвинул сдвиг кадра) — вниз дальше нельзя, но и назад не прыгает */
  const v=O.presetView(fit,'front',1.15,opts),low={...v,pitch:-.5},lim=O.viewLimits(fit,low,1.15,opts);
  assert.equal(O.rotateView(low,0,-.1,lim).pitch,-.5);assert(O.rotateView(low,0,.1,lim).pitch>-.5);
  const far={...v,zoom:6};assert.equal(O.zoomView(far,1.1,0,0,1.15,O.viewLimits(fit,far,1.15,opts)).zoom,6,'вне диапазона — без рывка');
 }
});

test('zoom keeps the point under the cursor, pan follows the finger and stops at the motion box; at ×4 the hand on the handle fills the view',async()=>{
 const{O,m,fitOf,opts}=await setup();
 const fit=fitOf('latpull'),aspect=1.6,C=O.boxCenter(fit.box);let v=O.presetView(fit,'side',aspect,opts);
 const lim=()=>O.viewLimits(fit,v,aspect,opts),A=O.axes(v.yaw,v.pitch);
 /* точка в плоскости центра движения под курсором */
 const P=[0,1,2].map(i=>C[i]+.3*A.right[i]+.2*A.up[i]),q0=O.projectPoint(fit,v,aspect,P,opts);
 const z=O.zoomView(v,2.5,q0[0],q0[1],aspect,lim()),q1=O.projectPoint(fit,z,aspect,P,opts);
 assert(Math.abs(q1[0]-q0[0])<1e-9&&Math.abs(q1[1]-q0[1])<1e-9,'приближение — к точке под курсором');
 /* сдвиг: точка плоскости центра смещается ровно на сдвиг пальца */
 const p=O.panView(z,.1,-.05,aspect,O.viewLimits(fit,z,aspect,opts)),q2=O.projectPoint(fit,p,aspect,P,opts);
 assert(Math.abs(q2[0]-q1[0]-.1)<1e-9&&Math.abs(q2[1]-q1[1]+.05)<1e-9,'кадр идёт за пальцем');
 /* сдвиг без конца не уводит фигуру: центр кадра остаётся над коробкой движения */
 let far=v;for(let i=0;i<50;i++)far=O.panView(far,-.5,.5,aspect,O.viewLimits(fit,far,aspect,opts));
 const l=O.viewLimits(fit,far,aspect,opts);
 assert(Math.abs(far.ox)<=Math.max(l.ex*O.panReach(far.zoom),Math.abs(far.px))+1e-9&&Math.abs(far.oy)<=Math.max(l.ey*O.panReach(far.zoom),Math.abs(far.py))+1e-9,'сдвиг ограничен');
 const qc=O.projectPoint(fit,far,aspect,C,opts);assert(Math.abs(qc[0])<1&&Math.abs(qc[1])<1,'середина движения не уходит за край кадра');
 /* крупный план кисти: приближение ×4 к рукояти в нижней точке тяги */
 const{catalogVolumeData}=m.get('({catalogVolumeData})'),anim=m.EX.find(e=>e.id==='latpull').anim,R=catalogVolumeData(anim,1,0).pose,g=R.gripL,G=[g[0]/100,(186-g[1])/100,g[2]/100];
 let w=O.presetView(fit,'front',aspect,opts);const g0=O.projectPoint(fit,w,aspect,G,opts);
 for(let i=0;i<8;i++){const q=O.projectPoint(fit,w,aspect,G,opts);w=O.zoomView(w,Math.pow(4,1/8),q[0],q[1],aspect,O.viewLimits(fit,w,aspect,opts));}
 const g1=O.projectPoint(fit,w,aspect,G,opts);
 assert(Math.abs(w.zoom-4)<1e-9,'приближение ×4');
 assert(Math.abs(g1[0])<1&&Math.abs(g1[1])<1&&Math.hypot(g1[0]-g0[0],g1[1]-g0[1])<.25,`кисть на рукояти — в кадре, почти там же, где была (${g0.map(x=>x.toFixed(2))} → ${g1.map(x=>x.toFixed(2))})`);
});

test('preset transition: exact ends, the short way round, eased; zoom by ratio',async()=>{
 const{O}=await setup();
 const D=Math.PI/180,a={yaw:170*D,pitch:.1,d:4,s:1,ox:.1,oy:0,zoom:4,px:0,py:0},b={yaw:-170*D,pitch:.5,d:5,s:1.25,ox:0,oy:-.1,zoom:1,px:.02,py:-.01};
 assert.deepEqual(O.blendView(a,b,0),a);assert.deepEqual(O.blendView(a,b,1),b);assert.deepEqual(O.blendView(a,b,1.3),b);
 const mid=O.blendView(a,b,.5);
 assert(Math.abs(Math.abs(mid.yaw)-Math.PI)<1e-9,'поворот — коротким путём, через 180°, а не через 0°');
 assert(Math.abs(mid.zoom-2)<1e-9,'приближение — по логарифму: середина ×4 и ×1 — ×2');
 assert(Math.abs(mid.d-4.5)<1e-9&&Math.abs(O.ease(.5)-.5)<1e-12);
 let prev=-1;for(let u=0;u<=1.0001;u+=.05){const e=O.ease(Math.min(1,u));assert(e>=prev);prev=e;}
 assert(O.ease(.1)<.1&&O.ease(.9)>.9,'разгон и торможение');
 assert(O.PRESET_MS>=300&&O.PRESET_MS<=500,'переход к предустановке — около 0,4 с');
 assert(O.sameAngles(b,{...b,zoom:3,ox:1})&&!O.sameAngles(a,b),'ракурс — по углам; приближение и сдвиг его не меняют');
});

test('one constant returns the drawing view: with fov 0 a preset is the old orthographic frame of the scene camera',async()=>{
 const{O,S,THREE,m,fitOf,opts}=await setup();
 const ortho={...opts,fov:0},fit=fitOf('bbbench',ortho),{catalogVolumeData,muscleColor}=m.get('({catalogVolumeData,muscleColor})');
 assert(O.validFrame(fit,ortho)&&!O.validFrame(fit,opts),'рамка помнит свой угол обзора');
 const anim=m.EX.find(e=>e.id==='bbbench').anim,view=S.createCatalogScene(catalogVolumeData(anim,0,0));
 for(let i=0;i<=12;i++){view.apply(catalogVolumeData(anim,i/12,0),{color:muscleColor});view.includeBounds();}
 const W=640,H=420;view.resize(W,H);
 for(const cam of Object.keys(opts.settings)){
  const v=O.presetView(fit,cam,W/H,ortho),c=view.cameras[cam];
  for(const p of [[0,1,0],[.4,.6,-.3],[-.5,1.5,.8]]){
   const a=new THREE.Vector3(...p).project(c),b=O.projectPoint(fit,v,W/H,p,ortho);
   assert(Math.abs(a.x-b[0])<2e-3&&Math.abs(a.y-b[1])<2e-3,`${cam}: тот же кадр, что у ортографической камеры сцены`);
  }
 }
 view.dispose();
});
/* ракурсы от человека (4.110, замечание анатома 5): у двери тело повёрнуто к креплению — «Спереди» смотрит в лицо, «Сбоку» —
   в профиль; лёжа и стоя лицом вперёд — прежние ракурсы; рамки фигуры — по повёрнутым ракурсам */
test('presets follow the person: door exercises turn the presets with the body, lying and front-facing ones do not',async()=>{
 const{S,m,O}=await setup(),{catalogVolumeData}=m.get('({catalogVolumeData})'),yaw=id=>S.facingYaw(catalogVolumeData(m.EX.find(e=>e.id===id).anim,0,0).pose);
 for(const id of ['bandfacepull','bandpushdown','bandlatpull'])assert.equal(Math.abs(yaw(id)),90,id);
 assert.equal(yaw('towelrow'),180,'towel row faces the door');
 for(const id of ['facepull','squat','bbbench','tablerow','legpress','bandextrot','pushup'])assert.equal(yaw(id),0,id);
 assert.equal(S.cameraSettings(0),S.CAMERA_SETTINGS);
 const turned=S.cameraSettings(90);for(const[id,[y,e]]of Object.entries(S.CAMERA_SETTINGS))assert.deepEqual(turned[id],[y+90,e],id);
 /* «Спереди» смотрит туда, куда грудь: ось камеры к зрителю совпадает с горизонтальной нормалью груди */
 for(const id of ['bandfacepull','towelrow','facepull']){
  const d=catalogVolumeData(m.EX.find(e=>e.id===id).anim,0,0),n=d.pose.chestN,h=Math.hypot(n[0],n[2]),a=O.presetAngles(S.cameraSettings(S.facingYaw(d.pose)),'front'),B=O.axes(a.yaw,a.pitch).back;
  assert(B[0]*n[0]/h+B[2]*n[2]/h>.7,id+': the front camera faces the chest');
 }
 const view=S.createCatalogScene(catalogVolumeData(m.EX.find(e=>e.id==='bandfacepull').anim,0,0));
 assert.equal(view.settings.front[0],S.facingYaw(catalogVolumeData(m.EX.find(e=>e.id==='bandfacepull').anim,0,0).pose),'the scene carries its own presets');view.dispose();
});
