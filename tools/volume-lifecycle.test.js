const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const {loadModel}=require('./biomechanics-audit');
const source=fs.readFileSync(path.join(__dirname,'../src/volume/main.mjs'),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export function createVolumeFigure','function createVolumeFigure');
/* link — рендерер с областью просмотра, размером и сборкой шейдеров (второй ракурс в общем холсте, заготовка) */
async function runtime({available=true,link=false}={}){
 const THREE=await import('three'),{createCatalogScene,world,CAMERA_SETTINGS}=await import('../src/volume/scene.mjs'),orbit=await import('../src/volume/orbit.mjs'),{attachOrbit}=await import('../src/volume/controls.mjs');
 const dom=new JSDOM('<body></body>'),w=dom.window,counters={probes:0,constructors:0,renders:0,disposals:0,losses:0,copies:0,compiled:0,viewports:[]};
 w.WebGL2RenderingContext=function(){};
 w.HTMLCanvasElement.prototype.getContext=function(type){if(type==='2d')return{drawImage:(...a)=>{counters.copies++;counters.copy=a;}};counters.probes++;return available?{}:null;};
 class Renderer{
  constructor({canvas}){counters.constructors++;this.domElement=canvas;(counters.canvases||(counters.canvases=[])).push(canvas);this.shadowMap={enabled:true,autoUpdate:true,needsUpdate:false};}
  setPixelRatio(){} setSize(w,h){this.domElement.width=w;this.domElement.height=h;} render(scene,camera){counters.renders++;counters.scene=scene;counters.camera=camera;(counters.shadows||(counters.shadows=[])).push(this.shadowMap.autoUpdate||this.shadowMap.needsUpdate);} dispose(){counters.disposals++;} forceContextLoss(){counters.losses++;}
 }
 if(link)Object.assign(Renderer.prototype,{getPixelRatio(){return 1;},getSize(v){return v.set(this.domElement.width||0,this.domElement.height||0);},
  setViewport(x,y,w,h){counters.viewports.push([x,y,w,h]);},setScissor(){},setScissorTest(){},compileAsync(){counters.compiled++;return Promise.resolve();}});
 const env={window:w,document:w.document,THREE:{...THREE,WebGLRenderer:Renderer},createCatalogScene,world,CAMERA_SETTINGS,...orbit,attachOrbit,setTimeout};
 vm.runInNewContext(source,env);
 const m=loadModel(),{catalogVolumeData,muscleColor}=m.get('({catalogVolumeData,muscleColor})');
 const options=(id='bbbench',camera='above',has)=>({label:id,camera,t:.43,trace:[],vectors:[],color:muscleColor,data:(t,index)=>catalogVolumeData(m.EX.find(ex=>ex.id===id).anim,t,index,has)});
 return{dom,w,counters,create:w.GymVolume.create,options,model:m};
}
test('unavailable WebGL2 is probed once and never constructs a failing renderer on later cameras',async()=>{
 const r=await runtime({available:false});
 try{for(const camera of ['above','side','front','back'])assert.equal(r.create(r.options('bbbench',camera)),null);assert.equal(r.counters.probes,1);assert.equal(r.counters.constructors,0);}finally{r.dom.window.close();}
});
test('drawn arrows follow the current grip, reverse on return, and disappear during holds',async()=>{
 const r=await runtime();let figure;
 try{
  const {catalogVectors,catalogVectorFrame}=r.model.get('({catalogVectors,catalogVectorFrame})'),anim=r.model.EX.find(e=>e.id==='dbincline').anim;
  const vectors=catalogVectors(anim),opts={...r.options('dbincline'),vectors,vectorFrame:catalogVectorFrame};figure=r.create(opts);figure.setVectors(true);
  const i=vectors.findIndex(v=>v.key==='gripL'),arrows=r.counters.scene.getObjectByName('movement-vectors'),arrow=arrows.children[i],THREE=await import('three');
  for(const t of [.2,.7]){
   figure.at(t,{index:0});const grip=anim.catalogRig(t).gripL,base=[grip[0]/100,(186-grip[1])/100,grip[2]/100];
   assert(arrow.position.distanceTo(new THREE.Vector3(...base))<1e-8,'arrow must start at the moving grip');
   const lowering=new THREE.Vector3(0,1,0).applyQuaternion(arrow.quaternion);assert(lowering.y<0,'first phase of incline press lowers the weight');
   figure.at(t,{index:2});const lifting=new THREE.Vector3(0,1,0).applyQuaternion(arrow.quaternion);assert(lifting.y>0,'return phase lifts the weight');assert(lowering.dot(lifting)<-.999);
  }
  for(const index of [1,3]){figure.at(.5,{index});assert(arrows.children.every(a=>!a.visible),'holds must not claim movement');}
 }finally{figure?.dispose();r.dom.window.close();}
});
test('camera rebuilds reuse full-motion bounds without losing pose or equipment distinction',async()=>{
 const r=await runtime();let first,second,third;
 try{
  let samples=0;const base=r.options(),original=base.data;const counted={...base,data:(...args)=>{samples++;return original(...args);}};
  first=r.create(counted);const firstSamples=samples;first.at(.47,{index:2});first.dispose();
  samples=0;second=r.create({...counted,camera:'side',t:.47});assert.equal(second.svg.dataset.pose,'0.47');assert(samples<=5,'a camera change must not resample the motion poses');assert(firstSamples>=13,'the first figure fits the frame over 13 motion poses');
  samples=0;const changed={...counted,data:(...args)=>{const d=counted.data(...args);return{...d,props:d.props.filter(p=>p.kind!=='barbell')};}};
  third=r.create(changed);assert(samples>=13,'changed equipment must receive its own fitted bounds');
 }finally{first?.dispose();second?.dispose();third?.dispose();r.dom.window.close();}
});
test('restored WebGL redraws a paused pose and disposal blocks later frames',async()=>{
 const r=await runtime();let figure;
 try{
  figure=r.create(r.options());figure.at(.61,{index:2});const canvas=figure.svg.querySelector('canvas'),before=r.counters.renders;
  canvas.dispatchEvent(new r.w.Event('webglcontextrestored'));assert(r.counters.renders>before);assert.equal(figure.svg.dataset.pose,'0.61');assert.equal(figure.svg.dataset.phase,'2');
  figure.dispose();const after=r.counters.renders;canvas.dispatchEvent(new r.w.Event('webglcontextrestored'));figure.at(.2,{index:0});figure.dispose();
  assert.equal(r.counters.renders,after);assert.equal(figure.svg.dataset.pose,'0.61');
  /* рендерер закрытой фигуры уходит в запас, а не теряет контекст */
  assert.equal(r.counters.disposals,0);assert.equal(r.counters.losses,0);
 }finally{figure?.dispose();r.dom.window.close();}
});
test('a closed figure lends its renderer to the next one; its materials live until the next first frame; at most three spare renderers',async()=>{
 const r=await runtime(),figures=[];
 try{
  const first=r.create(r.options('squat','above')),scene=r.counters.scene,materials=new Set();
  scene.traverse(o=>{if(o.material)for(const m of [].concat(o.material))materials.add(m);});
  let released=0;for(const m of materials)m.addEventListener('dispose',()=>released++);
  const canvas=first.svg.querySelector('canvas');first.dispose();assert.equal(released,0,'materials of a closed figure keep their programs for the next figure');
  const next=r.create(r.options('squat','side'));figures.push(next);
  assert.equal(r.counters.constructors,1,'the next figure reuses the spare renderer');
  assert.equal(next.svg.querySelector('canvas'),canvas,'the same canvas moves to the next figure');
  assert.equal(released,materials.size,'after its first frame the old materials are released');
  for(let i=0;i<4;i++)figures.push(r.create(r.options('bbbench','above')));
  assert.equal(r.counters.constructors,5);
  for(const f of figures)f.dispose();
  assert.equal(r.counters.disposals,2,'two of five renderers are dropped');assert.equal(r.counters.losses,2);
  const again=r.create(r.options('bbbench','front'));figures.push(again);assert.equal(r.counters.constructors,5,'a spare renderer is reused');
 }finally{for(const f of figures)f.dispose();r.dom.window.close();}
});
test('3D joint-stress marks appear at the loaded joints, show through the body, and can be switched off',async()=>{
 const r=await runtime();let figure;
 try{
  figure=r.create(r.options('squat','side'));const group=r.counters.scene.getObjectByName('joint-stress'),visible=()=>group.children.filter(g=>g.visible);
  /* стоя со штангой на спине — одна метка: осевая нагрузка на поясницу (09f-joint-stress.js, правило axial) */
  figure.at(0,{index:0});assert.equal(visible().length,1,'standing tall: only the bar pressing on the lower back');
  figure.at(1,{index:1});const R=r.model.EX.find(e=>e.id==='squat').anim.catalogRig(1),marks=visible();
  assert.equal(marks.length,3,'both knees and the lower back');
  const knee=[R.knL[0]/100,(186-R.knL[1])/100,R.knL[2]/100];
  assert(marks.some(g=>Math.hypot(g.position.x-knee[0],g.position.y-knee[1],g.position.z-knee[2])<1e-9),'a mark sits on the left knee');
  assert(marks.every(g=>g.children.every(o=>o.material.depthTest===false)),'marks show through the body and the bar');
  figure.setStress(false);assert.equal(visible().length,0,'switched off');
 }finally{figure?.dispose();r.dom.window.close();}
});
test('studio light: semantic colours bypass tone mapping, the body casts but never receives shadows',async()=>{
 const THREE=await import('three'),{createCatalogScene,STUDIO}=await import('../src/volume/scene.mjs');
 const m=loadModel(),{catalogVolumeData,muscleColor}=m.get('({catalogVolumeData,muscleColor})'),anim=m.EX.find(e=>e.id==='bbbench').anim;
 const view=createCatalogScene(catalogVolumeData(anim,.5,0));
 try{
  view.apply(catalogVolumeData(anim,.5,0),{color:muscleColor,muscles:true,stress:true,joints:true});
  assert.equal(view.studio({}),false,'without a real WebGL renderer the scene stays plain');
  const renderer={isWebGLRenderer:true,shadowMap:{}};assert.equal(view.studio(renderer),true);
  assert.equal(renderer.toneMapping,THREE.NeutralToneMapping);assert.equal(renderer.shadowMap.enabled,!!STUDIO.shadow);
  assert(STUDIO.exposure<1,'muted a little so lit muscles keep their colour');
  const s=view.scene,dots=s.getObjectByName('joint-dots'),stress=s.getObjectByName('joint-stress');
  dots.traverse(o=>{if(o.isMesh){assert.equal(o.material.toneMapped,false,'joint dots keep their exact colour');assert.equal(o.castShadow,false,'markers cast no shadow');}});
  view.apply(catalogVolumeData(m.EX.find(e=>e.id==='squat').anim,1,1),{color:muscleColor,muscles:true,stress:true});
  stress.traverse(o=>{if(o.isMesh)assert.equal(o.material.toneMapped,false,'red joint marks are not tone-mapped');});
  const body=s.getObjectByName('mannequin'),regions=s.getObjectByName('regions');
  for(const g of [body,regions])g.traverse(o=>{if(o.isMesh)assert.equal(o.receiveShadow,false,'no shadow falls on the body or muscle colour: '+o.name);});
  assert.equal(s.getObjectByName('floor').receiveShadow,true,'the floor shows contact shadows');
  assert(body.getObjectByName('torso').castShadow,'the body casts a shadow');
  view.setShadows(false);assert.equal(renderer.shadowMap.enabled,false,'slow graphics: shadows switch off');
 }finally{view.dispose();}
});
test('skeleton mode: bones follow the pose inside a see-through silhouette, phase muscle colours hide, switching off restores the body',async()=>{
 const r=await runtime();let figure;
 const zlib=require('node:zlib'),Skeleton=require('../src/js/09bq-skeleton.js');
 globalThis.Skeleton=Skeleton;
 const data=Skeleton.decode(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../src/data/skeleton.bin'))));
 try{
  figure=r.create({...r.options('squat','side'),muscles:true});figure.at(1,{index:1});
  const s=r.counters.scene,layer=s.getObjectByName('skeleton'),torso=s.getObjectByName('torso'),regions=s.getObjectByName('regions');
  assert.equal(layer.visible,false,'off by default');
  assert(regions.children.some(o=>o.visible),'phase muscle colours are on');
  figure.setSkeleton(data);
  assert.equal(figure.svg.dataset.skeleton,'on');
  /* все кости — одна сетка (4.72.0): один вызов отрисовки и один в проходе тени */
  const bones=layer.userData.layer;
  assert.equal(layer.visible,true);assert.equal(layer.children.length,1);assert.equal(bones.names.length,data.bones.length);
  assert.equal(layer.children[0].geometry.attributes.position.count,data.bones.reduce((s,b)=>s+b.nv,0));
  /* силуэт: цветной проход рисует один ближний слой кожи (прозрачная середина, плотнее к контуру), невидимый двойник
     сетки пишет глубину кожи раньше него и после костей */
  const twin=torso.getObjectByName('ghost-depth');
  assert.equal(torso.material.name,'ghost-skin');assert.equal(torso.material.transparent,true);assert.equal(torso.material.depthWrite,false);
  assert(twin?.visible&&twin.material.colorWrite===false&&twin.material.depthWrite===true&&twin.material.transparent&&twin.geometry===torso.geometry,'depth twin of the skin');
  assert(twin.renderOrder<torso.renderOrder,'skin depth is written before the silhouette colour');
  let skinMeshes=0;s.getObjectByName('mannequin').traverse(o=>{if(o.isMesh&&!o.userData.ghostTwin){skinMeshes++;assert.equal(o.material.name,'ghost-skin',o.name);assert.equal(o.getObjectByName('ghost-depth')?.visible,true,o.name);}});
  assert(skinMeshes>20,'every part of the mannequin turns into the silhouette');
  assert.equal(torso.castShadow,false,'the skin does not shadow the bones');
  assert(regions.children.every(o=>!o.visible),'phase muscle colours hide while the skeleton is on');
  /* бедренная кость: начало рамки — тазобедренный сустав позы */
  const R=r.model.EX.find(e=>e.id==='squat').anim.catalogRig(1),femur=bones.matrixOf('femurL'),e=femur.elements;
  const hip=[R.hipL[0]/100,(186-R.hipL[1])/100,R.hipL[2]/100];
  assert(Math.hypot(e[12]-hip[0],e[13]-hip[1],e[14]-hip[2])<1e-6,'the femur hangs from the hip joint');
  for(const name of bones.names)assert(bones.matrixOf(name).elements.every(Number.isFinite),'finite matrix: '+name);
  figure.setSkeleton(null);
  assert.equal(layer.visible,false);assert.equal(torso.material.transparent,false);assert.equal(torso.material.opacity,1);assert.equal(torso.castShadow,true);
  assert.notEqual(torso.material.name,'ghost-skin');assert.equal(torso.getObjectByName('ghost-depth').visible,false,'the depth twin hides with the silhouette');
  assert(regions.children.some(o=>o.visible),'muscle colours return');
 }finally{figure?.dispose();r.dom.window.close();delete globalThis.Skeleton;}
});

test('anatomy colours follow the phase profile: heads take their region, a one-sided exercise its side, a selected region keeps colour only on its muscles',async()=>{
 const r=await runtime();let figure;
 const zlib=require('node:zlib'),Skeleton=require('../src/js/09bq-skeleton.js'),Muscles=require('../src/js/09br-muscles.js');
 globalThis.Skeleton=Skeleton;globalThis.Muscles=Muscles;
 const read=f=>zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../src/data/'+f)));
 const bones=Skeleton.decode(read('skeleton.bin')),muscles=Muscles.decode(read('muscles.bin'));
 const {muscleTint,PART_REGION,MUSCLE_REST}=await import('../src/volume/muscles.mjs'),THREE=await import('three');
 const {muscleColor,catalogVolumeData}=r.model.get('({muscleColor,catalogVolumeData})'),REGIONS=r.model.get('MUSCLE_REGIONS');
 const by=name=>{const m=muscles.muscles.find(x=>x.name===name);assert(m,name);return m;};
 try{
  /* каждая головка ведёт в настоящую область своей группы */
  const parts=new Map(muscles.muscles.map(m=>[m.part,m.group||[]]));
  for(const[part,region]of Object.entries(PART_REGION)){
   const parent=Object.entries(REGIONS).find(([,rows])=>rows.some(([id])=>id===region))?.[0];
   assert(parts.has(part)&&parent&&parts.get(part).includes(parent),part+' → '+region);
  }
  const ex=id=>r.model.EX.find(e=>e.id===id).anim,look=(d,extra={})=>({values:d.values,sideValues:d.sideValues,regions:d.regions,phases:true,...extra});
  const inc=catalogVolumeData(ex('dbincline'),.5,0),L=look(inc),tint=(name,l,level=null)=>muscleTint(by(name),level,l,muscleColor);
  /* наклонный жим: ключичная часть — своя, более яркая область; мышцы вне упражнения и без группы — в покое */
  assert(inc.values.pec_clavicular>inc.values.pec_costal);
  assert.equal(tint('PECM1_r',L),muscleColor(inc.values.pec_clavicular));assert.equal(tint('PECM3_r',L),muscleColor(inc.values.pec_costal));
  assert.equal(tint('glmax1_r',L),MUSCLE_REST);assert.equal(tint('SUPSP_r',L),MUSCLE_REST);
  /* цвет идёт за фазой */
  assert.notEqual(tint('PECM1_r',look(catalogVolumeData(ex('dbincline'),.05,0))),tint('PECM1_r',L));
  /* тяга гантели одной рукой работает левой стороной: у правой широчайшей — значение покоя профиля */
  const row=catalogVolumeData(ex('dbrow'),.5,0),RL=look(row);
  assert.equal(tint('LAT1_l',RL),muscleColor(row.values.lats));assert.equal(tint('LAT1_r',RL),muscleColor(.28));assert.notEqual(row.values.lats,.28);
  /* плечевая мышца (своя область группы бицепса, доля 1 вне «молота») — тоже по сторонам */
  assert.equal(tint('BRA_l',RL),muscleColor(row.values.biceps));assert.equal(tint('BRA_r',RL),muscleColor(.28));
  /* в упражнении на обе стороны та же часть берёт значение группы */
  assert.equal(tint('BRA_r',look(catalogVolumeData(ex('dbcurl'),.5,0))),muscleColor(catalogVolumeData(ex('dbcurl'),.5,0).values.biceps));
  /* выбранная область: цвет только у её мышц */
  const S=look(inc,{selected:'pec_clavicular'});
  assert.equal(tint('PECM1_l',S),muscleColor(inc.values.pec_clavicular));assert.equal(tint('PECM2_l',S),MUSCLE_REST);assert.equal(tint('TRIlong_l',S),MUSCLE_REST);
  /* без «Мышц по фазам»: основные — полным цветом, вспомогательные — бледнее */
  const level={chest:1,triceps:.38},off={phases:false};
  assert.equal(tint('PECM2_l',off,level),muscleColor(1));assert.equal(tint('TRIlat_l',off,level),muscleColor(.55));assert.equal(tint('glmax1_l',off,level),MUSCLE_REST);
  /* в сцене: поверхности областей манекена не считаются и скрыты, цвета мышц меняются по фазе, выбор области гасит прочие */
  figure=r.create({...r.options('dbincline','angle'),muscles:true});figure.setLayers(bones,{skeleton:bones,muscles,level:{chest:1}});
  const s=r.counters.scene,body=s.getObjectByName('muscle-bodies'),colors=()=>Float32Array.from(body.geometry.attributes.color.array);
  assert(s.getObjectByName('regions').children.every(o=>!o.visible),'phase regions of the mannequin hide');
  assert.equal(s.getObjectByName('muscles').visible,true);assert.equal(s.getObjectByName('skeleton').visible,true);
  figure.at(.05,{index:0});const a=colors();figure.at(.5,{index:0});const b=colors();
  assert(a.some((v,i)=>v!==b[i]),'phase changes muscle colours');
  const rest=new THREE.Color(MUSCLE_REST),lit=c=>{let n=0;for(let i=0;i<c.length;i+=3)if(Math.abs(c[i]-rest.r)+Math.abs(c[i+1]-rest.g)+Math.abs(c[i+2]-rest.b)>1e-4)n++;return n;};
  figure.setRegion('pec_clavicular');const c=colors();assert(lit(c)>0&&lit(c)<lit(b)/3,'a selected region keeps colour only on its muscles');
  figure.setLayers(null,null);assert.equal(s.getObjectByName('muscles').visible,false);assert(s.getObjectByName('regions').children.some(o=>o.visible),'mannequin regions return');
 }finally{figure?.dispose();r.dom.window.close();delete globalThis.Skeleton;delete globalThis.Muscles;}
});

test('13-pose framing keeps every one of 25 poses in frame (exercises with the largest deviation)',async()=>{
 /* полная сверка 146 упражнений — 0,4 % кадра наибольший сдвиг (4.24.0); здесь — те, где он наибольший */
 const THREE=await import('three'),{createCatalogScene}=await import('../src/volume/scene.mjs'),m=require('./biomechanics-audit').loadModel(),{catalogVolumeData}=m.get('({catalogVolumeData})');
 const fit=(anim,n)=>{const data=t=>catalogVolumeData(anim,t,0,undefined),sc=createCatalogScene(data(0));for(let i=0;i<=n;i++){sc.apply(data(i/n),{color:()=>'#fff',selected:'all',muscles:true,joints:false,stress:true,skeleton:null});sc.includeBounds();}return sc.bounds;};
 const frame=b=>{const cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2;let w=(b.maxX-b.minX)*1.13,h=(b.maxY-b.minY)*1.13;if(w/h<1.15)w=h*1.15;else h=w/1.15;return{l:cx-w/2,r:cx+w/2,t:cy+h/2,b:cy-h/2,s:Math.max(w,h)};};
 const source=fs.readFileSync(path.join(__dirname,'../src/volume/main.mjs'),'utf8'),steps=+source.match(/FIT_STEPS=(\d+)/)[1];
 assert(steps>=12,'at least 13 poses');
 for(const id of ['thruster','bicycle','ohext','nordic','birddog','jumpingjack']){
  const anim=m.EX.find(e=>e.id===id).anim,all=fit(anim,24),few=fit(anim,steps);
  for(const cam of Object.keys(all)){
   const f=frame(few[cam]),b=all[cam];
   assert(b.minX>=f.l&&b.maxX<=f.r&&b.minY>=f.b&&b.maxY<=f.t,`${id} ${cam}: all 25 poses inside the ${steps+1}-pose frame`);
   const g=frame(b);assert(Math.max(Math.abs(g.l-f.l),Math.abs(g.r-f.r),Math.abs(g.t-f.t),Math.abs(g.b-f.b))/g.s<.006,`${id} ${cam}: frame shift under 0.6 %`);
  }
 }
});

/* Второй ракурс разбора — та же сцена тем же рендерером (4.72.0): без второго WebGL-контекста и второй сборки шейдеров,
   поза и мышцы — один раз на кадр, карта тени — один раз; кадр каждого ракурса копируется в его 2D-холст */
test('the second view shares the scene and the renderer: one pose per frame, one shadow pass, a copy per view',async()=>{
 const r=await runtime({link:true});let first,second;
 try{
  let samples=0;const base={...r.options('squat','above'),interactive:true},original=base.data,counted={...base,data:(...a)=>{samples++;return original(...a);}};
  first=r.create(counted);const scene=r.counters.scene,constructors=r.counters.constructors;
  second=r.create({...counted,camera:'side',share:first});
  assert(second.linked,'linked view');assert.equal(r.counters.constructors,constructors,'no second renderer');
  assert(!first.svg.contains(r.counters.canvases.at(-1)),'the WebGL canvas leaves the page');
  assert.equal(first.svg.querySelectorAll('canvas').length,1);assert.equal(second.svg.querySelectorAll('canvas').length,1);
  assert.notEqual(first.svg.querySelector('canvas'),second.svg.querySelector('canvas'),'each view has its own canvas');
  assert.equal(second.camera,'side');assert.equal(first.camera,'above');assert(second.orbit&&first.orbit);
  samples=0;const renders=r.counters.renders,copies=r.counters.copies;r.counters.shadows=[];
  first.at(.6,{index:0});second.at(.6,{index:0});
  assert.equal(samples,1,'the pose is computed once for both views');
  assert.equal(r.counters.renders-renders,2,'one render per view');assert.equal(r.counters.copies-copies,2,'each view gets its frame');
  assert.deepEqual(r.counters.shadows,[true,false],'the shadow map is drawn once per frame');
  assert.equal(r.counters.scene,scene,'the same scene');
  assert.equal(second.svg.dataset.pose,'0.6');
  /* настройки вида — общие: тот же вызов у второй фигуры кадр не повторяет */
  const before=r.counters.renders;second.setTrace(false);second.setMuscles(true);second.setVectors(false);assert.equal(r.counters.renders,before,'unchanged settings draw nothing');
  first.setMuscles(false);assert(r.counters.renders>before);const after=r.counters.renders;second.setMuscles(false);assert.equal(r.counters.renders,after);
  /* свой ракурс у каждой: смена камеры второго первый не трогает */
  assert(second.setCamera('front',{instant:true}));assert.equal(second.camera,'front');assert.equal(first.camera,'above');
  /* второй закрыт — первая фигура рисует один свой ракурс */
  second.dispose();const n=r.counters.renders;first.at(.7,{index:0});assert.equal(r.counters.renders-n,1);
 }finally{second?.dispose();first?.dispose();r.dom.window.close();}
});
test('a view without a free camera cannot be linked: the second view becomes its own figure, as before',async()=>{
 const r=await runtime({link:true});let first,second;
 try{
  first=r.create(r.options('squat','above'));const c=r.counters.constructors;
  second=r.create({...r.options('squat','side'),share:first});
  assert(!second.linked);assert.equal(r.counters.constructors,c+1);
 }finally{second?.dispose();first?.dispose();r.dom.window.close();}
});
/* вид с первого кадра (options.layers): рамка — без костей и мышц, как раньше, а первый кадр — уже со скелетом; повторный
   setLayers с теми же данными кадр не перерисовывает */
test('figure layers from the first frame: the fit ignores them, the first render shows them, the same layers again draw nothing',async()=>{
 const r=await runtime();let figure;
 const zlib=require('node:zlib'),Skeleton=require('../src/js/09bq-skeleton.js');globalThis.Skeleton=Skeleton;
 const data=Skeleton.decode(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../src/data/skeleton.bin'))));
 try{
  let renders=0;const base={...r.options('squat','side'),interactive:true};
  figure=r.create({...base,layers:{bones:data,body:null}});
  const layer=r.counters.scene.getObjectByName('skeleton');assert.equal(layer.visible,true,'bones on the first frame');
  assert.equal(figure.svg.dataset.skeleton,'on');assert.equal(figure.svg.dataset.anatomy,'off');
  renders=r.counters.renders;figure.setLayers(data,null);assert.equal(r.counters.renders,renders,'the same layers draw nothing');
  figure.setLayers(null,null);assert.equal(layer.visible,false);assert(r.counters.renders>renders);
  /* рамка та же, что у фигуры без слоёв (отдельная страница: своя память рамок) */
  const r2=await runtime(),plain=r2.create({...r2.options('squat','side'),interactive:true});
  const same=x=>JSON.parse(JSON.stringify(x));assert.deepEqual(same(plain.cameraState()),same(figure.cameraState()));plain.dispose();r2.dom.window.close();
 }finally{figure?.dispose();r.dom.window.close();delete globalThis.Skeleton;}
});
/* Заготовка рендерера (первое открытие разбора за сеанс): контекст и программы — заранее, в простое; фигура берёт этот рендерер,
   материалы заготовки отпускаются после её первого кадра */
test('a prewarmed renderer: compiled ahead, lent to the first figure, its materials released after that figure\'s first frame',async()=>{
 const r=await runtime({link:true});let figure;
 const zlib=require('node:zlib'),Skeleton=require('../src/js/09bq-skeleton.js');globalThis.Skeleton=Skeleton;
 const data=Skeleton.decode(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../src/data/skeleton.bin'))));
 try{
  const base=r.options('squat','side'),ready=r.w.GymVolume.prewarm({...base,layers:{bones:data,body:null}});
  /* три задачи в простое: сцена — сразу, сборка программ — в следующей, кадр 1 × 1 — после неё */
  assert.equal(r.counters.constructors,1);assert.equal(r.counters.compiled,0,'programs are compiled in a later idle task');assert.equal(r.counters.renders,0,'no frame before idle');
  assert.equal(await ready,true,'a frame of the warm scene (in idle) builds shadow and background programs');
  assert.equal(r.counters.compiled,1,'programs compiled ahead');assert.equal(r.counters.renders,1,'one 1×1 frame');
  const warm=r.counters.scene;let released=0;warm.traverse(o=>{if(o.material)o.material.addEventListener('dispose',()=>released++);});
  assert(warm.getObjectByName('skeleton').visible,'the warm scene has the chosen view');
  assert.equal(await r.w.GymVolume.prewarm(base),false,'once per session');
  figure=r.create({...base,layers:{bones:data,body:null}});
  assert.equal(r.counters.constructors,1,'the first figure takes the warm renderer');
  assert(released>0,'warm materials released after the first frame');
 }finally{figure?.dispose();r.dom.window.close();delete globalThis.Skeleton;}
});
/* Рамка нового упражнения (13 положений повторения) считается кадрами «только точки» (scene.apply, how.shape: без нормалей кожи
   и областей мышц) — рамка та же до последнего знака: и ортографические рамки ракурсов, и рамка свободной камеры */
test('the motion fit from shape-only frames equals the fit from full frames',async()=>{
 const {createCatalogScene,CAMERA_SETTINGS}=await import('../src/volume/scene.mjs'),orbit=await import('../src/volume/orbit.mjs');
 const dom=new JSDOM('<body></body>');globalThis.window=dom.window;globalThis.document=dom.window.document;
 try{
  const m=loadModel(),{catalogVolumeData,muscleColor}=m.get('({catalogVolumeData,muscleColor})'),VIEW={fov:orbit.PERSPECTIVE_FOV,pad:orbit.FRAME_PAD,settings:CAMERA_SETTINGS};
  for(const id of ['frontraise','deadlift','latpull','pushup']){
   const anim=m.EX.find(e=>e.id===id).anim,fits=[];
   for(const shape of [false,true]){
    const scene=createCatalogScene(catalogVolumeData(anim,0,0)),collect=orbit.frameCollector(CAMERA_SETTINGS,VIEW);
    for(let i=0;i<=12;i++){scene.apply(catalogVolumeData(anim,i/12,0),{color:muscleColor},{shape});scene.includeBounds(undefined,collect.add);}
    fits.push(JSON.stringify([scene.bounds,collect.data()]));scene.dispose();
   }
   assert.equal(fits[1],fits[0],id);
  }
 }finally{delete globalThis.window;delete globalThis.document;dom.window.close();}
});
