import * as THREE from 'three';
import {createCatalogScene,world,CAMERA_SETTINGS} from './scene.mjs';
import {phaseMemory} from './muscles.mjs';
import {PERSPECTIVE_FOV,FRAME_PAD,PRESET_MS,KEY_MS,KEY_YAW,KEY_PITCH,KEY_ZOOM,frameCollector,validFrame,presetView,presetAngles,cameraPose,projectPoint,viewLimits,rotateView,panView,zoomView,blendView,sameAngles,sameView,dragAngle} from './orbit.mjs';
import {attachOrbit} from './controls.mjs';

let rendererUnavailable=false;
/* Слабая графика: если кадры анимации идут реже ~20 в секунду, тени выключаются — до конца сеанса и для следующих фигур. */
let lowPower=false;
const PACE_SAMPLES=40,PACE_LIMIT=48;

/* Рендереры переиспользуются. Новый WebGL-контекст и сборка шейдеров — самая дорогая часть открытия разбора и смены
   ракурса (≈0,2 с на компьютере, втрое дольше на слабом телефоне). Закрытая фигура отдаёт рендерер в запас: геометрия
   и текстуры освобождаются сразу, а материалы — после первого кадра следующей фигуры на этом рендерере. Тогда её
   такие же материалы берут уже собранные программы: кеш программ three.js держит программу, пока на неё ссылается
   хоть один материал. В запасе не больше трёх рендереров (разбор в два ракурса и тренировка). */
const SPARE_LIMIT=3,spare=[],attributes={antialias:true,alpha:false,powerPreference:'low-power'};
function dropRenderer(slot){try{slot.release?.();}catch(e){}slot.renderer.dispose?.();slot.renderer.forceContextLoss?.();}
function takeRenderer(){
 while(spare.length){const slot=spare.pop();if(!slot.renderer.getContext?.()?.isContextLost?.())return slot;dropRenderer(slot);}
 const canvas=document.createElement('canvas');let renderer=null,context=null;
 try{context=canvas.getContext('webgl2',attributes);if(context){renderer=new THREE.WebGLRenderer({canvas,context,...attributes});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));}}catch(e){renderer=null;}
 if(!renderer){context?.getExtension('WEBGL_lose_context')?.loseContext();return null;}
 return{renderer,canvas,release:null};
}
function spareRenderer(slot){if(spare.length>=SPARE_LIMIT)dropRenderer(slot);else spare.push(slot);}

/* Рамка всех фаз по всем ракурсам считается один раз на упражнение и набор видимого инвентаря и хранится между
   запусками (localStorage), пока не сменится сборка — как рамки карточек (PODHOD_BUILD). 13 положений вместо 25:
   по всем 146 упражнениям и пяти ракурсам кадр сдвигается не больше чем на 0,4 % своего размера, а тело и инвентарь
   всех 25 прежних положений остаются в кадре (сверка 4.24.0, tools/volume-lifecycle.test.js); первое открытие
   упражнения вдвое короче. */
const FIT_STEPS=12,FADE_EVERY=3; /* точки тела для прозрачности инвентаря — с каждой третьей позы выборки (5 поз): хранятся вместе с рамкой */
const fittedBounds=new Map(),BOUNDS_STORE='podhod.volume-bounds.v1',BOUNDS_LIMIT=256;
let boundsLoaded=false,boundsSave=0;
const boundsBuild=()=>window.PODHOD_BUILD||null;
function hashText(s){let h1=0x811c9dc5,h2=0x01000193;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,0x01000193);h2=Math.imul(h2^c,0x5bd1e995)^(h2>>>15);}return(h1>>>0).toString(36)+(h2>>>0).toString(36);}
/* _view — рамка свободной камеры (orbit.mjs: коробка движения и кадры предустановок с перспективой) */
const boundsValid=b=>b&&typeof b==='object'&&Object.entries(b).every(([k,e])=>k==='_view'||k==='_fade'||e&&['minX','maxX','minY','maxY'].every(k=>Number.isFinite(e[k])));
function boundsGet(key){
 if(!boundsLoaded){
  boundsLoaded=true;
  try{const saved=JSON.parse(localStorage.getItem(BOUNDS_STORE)||'null');if(saved&&saved.build&&saved.build===boundsBuild())for(const[k,v]of Object.entries(saved.bounds||{}))if(!fittedBounds.has(k)&&boundsValid(v))fittedBounds.set(k,v);}catch(e){}
 }
 return fittedBounds.get(key)||null;
}
function boundsSet(key,value){
 fittedBounds.delete(key);fittedBounds.set(key,value);
 while(fittedBounds.size>BOUNDS_LIMIT)fittedBounds.delete(fittedBounds.keys().next().value);
 if(!boundsBuild())return;clearTimeout(boundsSave);
 boundsSave=setTimeout(()=>{try{localStorage.setItem(BOUNDS_STORE,JSON.stringify({build:boundsBuild(),bounds:Object.fromEntries(fittedBounds)}));}catch(e){}},1500);
}
const round4=v=>Math.round(v*1e4)/1e4;
const clock=()=>typeof performance!=='undefined'?performance.now():Date.now();
const calm=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* настройки свободной камеры — при первой фигуре (верх модуля не трогает импорты: проверки на заглушках их подменяют) */
let viewSettings=null;
const viewOptions=()=>viewSettings||(viewSettings={fov:PERSPECTIVE_FOV,pad:FRAME_PAD,settings:CAMERA_SETTINGS});

/* Память матриц костей по фазе: кадры с той же фазой t (часы карточек и экрана тренировки идут по сетке ≈30 кадров
   в секунду) со второго круга повторения не раскладывают скелет заново — ≈5 КБ на кадр (102 кости × 12 чисел), а
   лопатка с поднятой рукой стоит до 5 мс процессора на кадр (втрое больше на бюджетном телефоне). Не больше BONE_FRAMES
   фаз: первые уходят первыми. Матрицы — те же, что посчитал бы scene.apply (data.boneFrames). */
const BONE_FRAMES=240;let boneMisses=0;
function memoBones(memo,sk,t,d){
 if(!sk||!d.body||!globalThis.Skeleton?.frames)return;
 if(memo.data!==sk){memo.map.clear();memo.data=sk;}
 let fr=memo.map.get(t);
 if(!fr){boneMisses++;fr=globalThis.Skeleton.frames(d.pose,d.body,sk.bones);if(memo.map.size>=BONE_FRAMES)memo.map.delete(memo.map.keys().next().value);memo.map.set(t,fr);}
 d.boneFrames=fr;
}
/* одинаковые слои фигуры (setLayers): те же кости и мышцы и те же уровни групп */
function sameBody(a,b){
 if(a===b)return true;if(!a||!b||a.skeleton!==b.skeleton||a.muscles!==b.muscles)return false;
 const x=a.level||{},y=b.level||{},kx=Object.keys(x);if(kx.length!==Object.keys(y).length)return false;
 return kx.every(k=>x[k]===y[k]);
}
export function createVolumeFigure(options){
 /* Второй ракурс разбора (options.share — первая фигура пары): та же сцена и тот же рендерер, своя камера и свой холст.
    Нет второго WebGL-контекста и второй сборки шейдеров (≈0,6 с на бюджетном телефоне), поза и мышцы считаются один раз
    на кадр, карта тени — тоже. Не вышло (у первой фигуры нет свободной камеры) — отдельная фигура, как раньше. */
 if(options.share?.linkView){const linked=options.share.linkView(options);if(linked)return linked;}
 if(rendererUnavailable)return null;
 if(typeof window.WebGL2RenderingContext==='undefined'){rendererUnavailable=true;return null;}
 const root=document.createElement('div');root.className='fig volume-figure';root.setAttribute('role','img');root.setAttribute('aria-label',options.label);root.dataset.camera=options.camera||'above';
 const slot=takeRenderer();
 if(!slot){rendererUnavailable=true;return null;}root.dataset.renderer='webgl';
 const{renderer,canvas}=slot,releasePrevious=slot.release;slot.release=null;
 /* lean — кадр для костей и мышц: области манекена тогда скрыты, их поверхности не считаются */
 const data=(t,index,lean=false)=>options.data(t,index,false,lean),initial=data(0,0);
 const scene=createCatalogScene(initial),cameras=scene.cameras;
 /* ракурсы этой фигуры — от человека (scene.settings: в упражнениях у двери повёрнуты вместе с телом) */
 const SETTINGS=scene.settings||CAMERA_SETTINGS,VIEW=SETTINGS===CAMERA_SETTINGS?viewOptions():{...viewOptions(),settings:SETTINGS};root.append(renderer.domElement);let disposed=false,lastT=options.t||0,lastIndex=0,selected='all',muscles=options.muscles!==false,joints=!!options.joints,stress=options.stress!==false,skeleton=null,anatomy=null;
 if(!cameras[options.camera||'above'])throw Error('Unknown volume camera '+options.camera);
 let updateVectors=()=>{};
 /* options.memoBones — фигура, которой показывают одно и то же повторение по сетке фаз (экран тренировки): матрицы костей — из памяти */
 const bonesMemo=options.memoBones?{map:new Map(),data:null}:null;
 /* кожа Anny (вид «Манекен», src/js/09bs-anny.js): данные грузятся при первом кадре фигуры без костей и мышц; пришли — кадр
    заново (до того и при ошибке — процедурная кожа) */
 let annyAsked=false,annyWarm=false;
 const loadAnny=()=>{
  const A=globalThis.AnnySkin;if(annyAsked||!A||A.data)return;annyAsked=true;
  A.load().then(()=>{if(disposed)return;if(!skeleton&&!anatomy)at(lastT,{index:lastIndex});else warmAnny();},()=>{});
 };
 /* Фигура в «Анатомии» или «Скелете», а данные кожи Anny уже есть: в простое строится (скрытая) сетка кожи и собираются её
    программы — compileAsync (без остановки главного потока), затем, тоже в простое, кадр 1 × 1 с видимой кожей: программа её
    тени и загрузка сетки в видеокарту. Сразу за ним — обычный кадр (кожа снова скрыта, карта тени — заново), поэтому на экране
    тот же кадр. Переключение на «Манекен» потом не ждёт ни сборки шейдеров, ни загрузки сетки */
 const idleTask=cb=>typeof requestIdleCallback==='function'?requestIdleCallback(cb,{timeout:3000}):setTimeout(cb,200);
 function warmAnny(){
  const A=globalThis.AnnySkin;if(annyWarm||disposed||!A?.data||!(skeleton||anatomy)||!renderer.compileAsync||!scene.anny)return;annyWarm=true;
  const usable=()=>!disposed&&(skeleton||anatomy)&&!renderer.getContext?.()?.isContextLost?.();
  idleTask(()=>{
   if(!usable())return;
   try{const d=data(lastT,lastIndex,false);scene.anny.update(A.data,d,{on:muscles,color:options.color,values:d.values,sideValues:d.sideValues,regions:d.regions,selected});scene.anny.hide();}catch(e){return;}
   Promise.all([renderer.compileAsync(scene.scene,cameras.angle),compileShadowDepth(scene.anny.mesh)]).then(()=>idleTask(()=>{
    if(!usable()||!renderer.setViewport)return;
    /* кадр заготовки — не кадр анимации: мимо обёртки панели замера (?perf, 19-perf-panel.js), в «отрисовку» он не идёт */
    const g=scene.anny.group,render=renderer.render.perfOrig||renderer.render;g.visible=true;
    try{renderer.setViewport(0,0,1,1);renderer.setScissor(0,0,1,1);renderer.setScissorTest(true);render.call(renderer,scene.scene,cameras.angle);}
    catch(e){}finally{renderer.setScissorTest(false);g.visible=false;if(!copy)renderer.setViewport(0,0,main.w,main.h);}
    draw();
   }),()=>{});
  });
 }
 /* Программа тени сетки (её материал глубины) — тоже без остановки главного потока. compileAsync собирает только основные
    материалы, а материал глубины собирается в проходе тени — синхронно, кадр ждёт сборку. Здесь он собирается так, как его
    возьмёт проход тени: та же сторона (проход тени ставит её по стороне основного материала), свет сцены и запись в
    текстуру (в текстуру — без тонального отображения и в линейном цвете: иначе другая программа) */
 function compileShadowDepth(mesh){
  const depth=mesh?.customDepthMaterial;
  if(!depth||!mesh.castShadow||!renderer.shadowMap?.enabled||!renderer.setRenderTarget||!renderer.compileAsync)return Promise.resolve();
  const side={[THREE.FrontSide]:THREE.BackSide,[THREE.BackSide]:THREE.FrontSide,[THREE.DoubleSide]:THREE.DoubleSide};
  depth.side=mesh.material.shadowSide??side[mesh.material.side];
  const helper=new THREE.Scene(),twin=new THREE.Mesh(mesh.geometry,depth);twin.frustumCulled=false;twin.receiveShadow=mesh.receiveShadow;twin.morphTargetInfluences=mesh.morphTargetInfluences;helper.add(twin);
  const target=new THREE.WebGLRenderTarget(1,1),prev=renderer.getRenderTarget();let done;
  try{renderer.setRenderTarget(target);done=renderer.compileAsync(helper,cameras.angle,scene.scene);}
  catch(e){done=Promise.resolve();}finally{renderer.setRenderTarget(prev);}
  return done.catch(()=>{}).then(()=>target.dispose());
 }
 const wantAnny=()=>{if(!skeleton&&!anatomy)loadAnny();};
 /* shape — кадр только для рамки (без нормалей, scene.apply) */
 /* Инвентарь между камерой и человеком — полупрозрачный (4.110, замечание анатома 6: «Спереди» у блоков человека загораживала
    стойка со стеком, у жима ногами — платформа). В каждом ракурсе перед кадром: деталь, чья рамка пересекает отрезок от камеры
    к голове, плечам, локтям, тазу или коленям (не у самой точки — так рукоять в кулаке не в счёт), рисуется прозрачной; остальные — как были.
    Мелкие детали (рамка меньше 2 л: рукояти, трос, гантели) не трогаются. Цвета и тени те же */
 let lastPose=null;const FADE_KEEP=/^(barbell|dumbbell|kettlebell|cable|line)$/,FADE_MIN=.002,fadeMats=new Map(),fadeBox=new THREE.Box3(),fadeRay=new THREE.Ray(),fadeHit=new THREE.Vector3(),fadeTo=new THREE.Vector3(),fadeFrom=new THREE.Vector3();
 const fadeOf=m=>{let f=fadeMats.get(m);if(!f){f=m.clone();f.transparent=true;f.opacity=.22;f.depthWrite=false;f.name=(m.name||'')+'-fade';fadeMats.set(m,f);}return f;};
 /* Решение «прозрачна ли деталь» зависит только от ракурса, а не от кадра повторения (4.110.1, замечание владельца 18.11.2026:
    в жиме лёжа «Сверху» стойки мерцали — локоть то заходил за стойку, то выходил, и материал менялся по ходу движения).
    Точки тела берутся по всему движению — из той же выборки поз, что рамка камеры (FIT_STEPS + 1 поз, хранятся вместе с
    рамкой: смена ракурса позы заново не считает), и текущая; решение держится, пока камера на месте; у подвижных
    деталей оно только добавляется (деталь, однажды заслонившая человека в этом ракурсе, остаётся прозрачной). */
 let fadePoints=null,fadeNodes=null;const fadeStates=new Map(),FADE_VIEWS=4;
 /* Повод для прозрачности — только голова и туловище (4.112, вопрос владельца 19.11.2026): в жиме лёжа «Сверху под углом»
    стойка закрывала один локоть, а прозрачной становилась вся рама — она слита в одну сетку. Руки и ноги не считаются:
    их и так видно, а заслонённый локоть — не повод прятать тренажёр. */
 const fadeTargets=P=>[P.head,P.sh,P.waist,P.hip].filter(Boolean).map(p=>new THREE.Vector3(...world(p)));
 const fadeKey=cam=>{cam.updateMatrixWorld?.();return Array.from(cam.matrixWorld.elements,x=>Math.round(x*500)).join(',')+'|'+Math.round((cam.zoom||1)*100);};
 function fadeOccluders(cam){
  const P=lastPose;if(!P||!scene.propNodes)return;
  /* инвентарь собран заново (другой вариант снаряда) — решения и точки считаются снова */
  const nodes=scene.propNodes();if(nodes!==fadeNodes){fadeNodes=nodes;fadeStates.clear();}
  const targets=(fadePoints||[]).concat(fadeTargets(P));
  cam.getWorldPosition(fadeFrom);
  const key=fadeKey(cam);let state=fadeStates.get(key);
  if(!state){state={fixed:new Map(),moving:new Set()};fadeStates.set(key,state);if(fadeStates.size>FADE_VIEWS)fadeStates.delete(fadeStates.keys().next().value);}
  /* подвижные детали — каждая своей рамкой; неподвижные слиты в сетки по материалу (staticMeshes) — проверяются рамки их
     деталей (userData.sources), а прозрачной становится вся слитая сетка */
  const list=[];
  /* снаряд в руках (гриф, гантель, гиря) и тросы с лентами не прячутся: их и показывают */
  for(const n of nodes){if(!n.group||!n.group.parent?.visible||FADE_KEEP.test(n.kind||''))continue;n.group.traverse(o=>{if(o.isMesh&&o.visible)list.push([o,[o],true]);});}
  for(const o of scene.staticMeshes?.()||[])if(o.isMesh&&o.visible)list.push([o,o.userData.sources||[o],false]);
  const blocks=src=>{
   fadeBox.setFromObject(src);const sz=fadeBox.getSize(fadeHit);if(sz.x*sz.y*sz.z<FADE_MIN)return false;
   for(const t of targets){
    if(fadeBox.containsPoint(t))continue;
    fadeTo.copy(t).sub(fadeFrom);const d=fadeTo.length();fadeRay.set(fadeFrom,fadeTo.normalize());
    if(fadeRay.intersectBox(fadeBox,fadeHit)&&fadeHit.distanceTo(fadeFrom)<d-.05)return true;
   }
   return false;
  };
  for(const[o,sources,moving]of list){
   const orig=o.userData.fadeOrig||o.material;let hit;
   if(moving){hit=state.moving.has(o)||sources.some(blocks);if(hit)state.moving.add(o);}
   else{hit=state.fixed.get(o);if(hit===undefined){hit=sources.some(blocks);state.fixed.set(o,hit);}}
   if(hit){if(!o.userData.fadeOrig)o.userData.fadeOrig=orig;o.material=Array.isArray(orig)?orig.map(fadeOf):fadeOf(orig);}
   else if(o.userData.fadeOrig){o.material=o.userData.fadeOrig;delete o.userData.fadeOrig;}
  }
 }
 const apply=(t,index,shape=false)=>{const d=data(t,index,!!(skeleton||anatomy));lastPose=d.pose;if(bonesMemo)memoBones(bonesMemo,anatomy?.skeleton||skeleton,t,d);scene.apply(d,{color:options.color,selected,muscles,joints,stress,skeleton,anatomy},{shape});updateVectors(t,index,d.pose);wantAnny();};
 const trace=new THREE.Line(new THREE.BufferGeometry().setFromPoints(options.trace.map(p=>new THREE.Vector3(...world(p)))),new THREE.LineBasicMaterial({color:'#b4c3d9',transparent:true,opacity:.7}));trace.visible=false;scene.scene.add(trace);
 const vectors=new THREE.Group();vectors.name='movement-vectors';vectors.visible=false;scene.scene.add(vectors);
 for(const v of options.vectors){const a=new THREE.Vector3(...world(v.a)),b=new THREE.Vector3(...world(v.b)),d=b.clone().sub(a);vectors.add(new THREE.ArrowHelper(d.clone().normalize(),a,d.length(),/^(sh|hip)$/.test(v.key)?0x77a9d3:0xe97155,.075,.035));}
 updateVectors=(t,index,pose)=>{options.vectors.forEach((v,i)=>{const q=options.vectorFrame?options.vectorFrame(v,t,index,pose):v,arrow=vectors.children[i];arrow.visible=!!q;if(!q)return;const a=new THREE.Vector3(...world(q.a)),b=new THREE.Vector3(...world(q.b)),d=b.sub(a);arrow.position.copy(a);arrow.setDirection(d.clone().normalize());arrow.setLength(d.length(),.06,.03);});vectors.updateMatrixWorld(true);};
 // Camera changes reuse the full-motion fit for this exercise/equipment combination.
 /* та же выборка поз даёт и рамку свободной камеры (_view, orbit.mjs): коробку движения и кадры предустановок с перспективой.
    Кадры выборки — только точки (нормали кожи и областей рамке не нужны): рамка та же, считается быстрее */
 const fitKey=initial.exerciseId+'|'+hashText(JSON.stringify([initial.props,options.vectors])),savedBounds=boundsGet(fitKey);
 let fit=null;
 if(savedBounds&&Object.keys(scene.bounds).every(key=>savedBounds[key])&&validFrame(savedBounds._view,VIEW)&&Array.isArray(savedBounds._fade)){for(const key of Object.keys(scene.bounds))Object.assign(scene.bounds[key],savedBounds[key]);fit=savedBounds._view;fadePoints=savedBounds._fade.map(p=>new THREE.Vector3(p[0],p[1],p[2]));}
 else{
  const collect=frameCollector(SETTINGS,VIEW);
  fadePoints=[];
  for(let i=0;i<=FIT_STEPS;i++){apply(i/FIT_STEPS,0,true);scene.includeBounds(undefined,collect.add);if(lastPose&&i%FADE_EVERY===0)fadePoints.push(...fadeTargets(lastPose));}
  fit=collect.data();
  boundsSet(fitKey,{...Object.fromEntries(Object.entries(scene.bounds).map(([key,e])=>[key,{minX:round4(e.minX),maxX:round4(e.maxX),minY:round4(e.minY),maxY:round4(e.maxY)}])),...(fit?{_view:fit}:{}),_fade:fadePoints.map(v=>[Math.round(v.x*100)/100,Math.round(v.y*100)/100,Math.round(v.z*100)/100])});
 }
 /* вид фигуры с первого кадра (options.layers — кости и мышцы, как setLayers): без лишнего кадра манекена перед анатомией.
    Тогда и материалы прежней фигуры на этом рендерере отпускаются после кадра в нужном виде — их собранные программы
    шейдеров переходят к этой фигуре (раньше первым был кадр манекена, и программы костей и мышц собирались заново).
    Данные кожи Anny грузятся, как и раньше, при создании фигуры */
 if(!options.layers){apply(lastT,0);scene.studio?.(renderer);}
 else{
  /* свет и рамка тени (studio → fitShadow — по сетям сцены) — по кадру без костей и мышц, как раньше, когда первым был кадр
     манекена: рамка тени та же, та же и картинка. Этот кадр — только точки (рамке тени нормали не нужны) и не рисуется */
  apply(lastT,0,true);scene.studio?.(renderer);
  skeleton=options.layers.bones||null;anatomy=options.layers.body||null;root.dataset.skeleton=skeleton?'on':'off';root.dataset.anatomy=anatomy?'on':'off';loadAnny();
  apply(lastT,0);
 }
 if(lowPower)scene.setShadows?.(false);
 /* замер скорости (?perf, src/js/19-perf-panel.js): обёртки вызовов этой фигуры; выключенный — одна проверка при создании */
 globalThis.GymPerf?.volume({scene,renderer,options,root,low:()=>lowPower});
 const pace=[];let lastAt=0;
 function watchPace(){
  const now=typeof performance!=='undefined'?performance.now():Date.now(),dt=now-lastAt;lastAt=now;if(lowPower||!(dt>0&&dt<200))return;
  pace.push(dt);if(pace.length<PACE_SAMPLES)return;
  const median=pace.sort((a,b)=>a-b)[pace.length>>1];pace.length=0;
  if(median>PACE_LIMIT){lowPower=true;scene.setShadows?.(false);for(const v of views)v.root.dataset.quality='low';}
 }
 /* Ракурсы фигуры. Первый — свой холст (root). Связанные (второй ракурс разбора, linkView) — свои холсты и камеры той же сцены.
    С одним ракурсом холст WebGL — на странице, как раньше. С двумя (copy) холст WebGL уходит со страницы: кадр каждого ракурса
    рисуется в его левый нижний угол (размер холста — наибольший из ракурсов) и в той же задаче копируется в 2D-холст ракурса
    (как у карточек плана) — кадр одного ракурса не трогает картинку другого. Пиксели те же: та же область просмотра и та же
    плотность, что у отдельного холста этого размера.
    Свободная камера (options.interactive — разбор и экран тренировки): своя камера у ракурса, жесты на его холсте (controls.mjs),
    математика — orbit.mjs. Карточки, атлас и листы — по-прежнему ортографические камеры сцены (scene.cameras). Жест меняет
    только камеру: поза и сцена не пересчитываются, кадр рисуется не чаще раза на requestAnimationFrame — и только если
    в этом кадре его ещё не нарисовал проигрыватель (at). */
 const views=[];let copy=false;
 function makeView(vroot,key,vo){
  const o=vo.interactive&&fit?{cam:PERSPECTIVE_FOV>0?new THREE.PerspectiveCamera(PERSPECTIVE_FOV,1,.05,40):new THREE.OrthographicCamera(-1,1,1,-1,.01,40),
   aspect:vo.ratio||1.15,v:null,go:null,free:false,user:false,basis:new THREE.Matrix4(),R:new THREE.Vector3(),U:new THREE.Vector3(),B:new THREE.Vector3()}:null;
  const v={root:vroot,camera:key,o:vo,orbit:o,canvas:null,ctx:null,w:0,h:0,stale:true,pending:0,dirty:false,drawnAt:-1,closed:false,detach:null,observer:null};
  const presetOf=k=>presetView(fit,k,o.aspect,VIEW);
  if(o){o.v=presetOf(key);vroot.dataset.orbit='';vroot.dataset.free='0';vroot.tabIndex=0;}
  /* положение камеры сейчас: во время перехода — по времени кадра; переход дошёл — он закончен */
  v.viewNow=()=>{
   const g=o.go;if(!g)return o.v;
   const u=(clock()-g.t0)/g.ms;if(u<1)return blendView(g.from,g.to,u);
   o.v=g.to;o.go=null;return o.v;
  };
  /* жест или клавиша: переход останавливается там, где камера сейчас */
  const settle=()=>{if(o?.go){o.v=v.viewNow();o.go=null;}};
  v.place=()=>{
   const q=v.viewNow(),p=cameraPose(fit,q,o.aspect,VIEW),c=o.cam;
   c.position.fromArray(p.position);c.quaternion.setFromRotationMatrix(o.basis.makeBasis(o.R.fromArray(p.right),o.U.fromArray(p.up),o.B.fromArray(p.back)));
   if(c.isPerspectiveCamera){c.fov=p.fov;c.aspect=o.aspect;}else{c.left=-p.half[0];c.right=p.half[0];c.top=p.half[1];c.bottom=-p.half[1];}
   c.near=p.near;c.far=p.far;c.zoom=p.zoom;c.updateProjectionMatrix();
  };
  /* кадр по запросу камеры: не рисуется, если проигрыватель уже нарисовал этот кадр (drawnAt — после метки кадра) */
  v.schedule=()=>{if(!disposed&&!v.closed&&!v.pending&&typeof requestAnimationFrame==='function')v.pending=requestAnimationFrame(tick);};
  function tick(ts){v.pending=0;if(disposed||v.closed)return;if(v.dirty||(o?.go&&v.drawnAt<ts))drawView(v);else if(o?.go)v.schedule();}
  const changed=()=>{v.dirty=true;v.schedule();};
  /* ракурс свободный — углы ушли от нажатой предустановки; подпись и кнопки ракурсов — у приложения (options.onCamera) */
  function checkFree(){
   const q=o.go?o.go.to:o.v,free=!sameAngles(q,presetAngles(SETTINGS,v.camera));
   if(free===o.free)return;o.free=free;vroot.dataset.free=free?'1':'0';try{vo.onCamera?.({camera:v.camera,free});}catch(e){console.error(e);}
  }
  const limits=q=>viewLimits(fit,q,o.aspect,VIEW);
  function input(next){
   if(disposed||v.closed||!o)return false;settle();const q=o.v,n=next(q);if(n===q||sameView(n,q))return false;
   o.v=n;o.user=true;checkFree();changed();try{vo.onGesture?.();}catch(e){}return true;
  }
  /* к положению to за ms (уменьшение движения в системе — сразу) */
  function glide(to,ms){
   settle();if(ms>0&&!calm())o.go={from:o.v,to,t0:clock(),ms};else o.v=to;
   checkFree();changed();
  }
  v.reset=()=>{if(!o||disposed||v.closed)return;o.user=false;glide(presetOf(v.camera),PRESET_MS);};
  /* пропорции ракурса: кадр предустановки зависит от них; повёрнутая или приближенная вручную камера остаётся как есть */
  v.aspect=a=>{if(!o)return;o.aspect=a;if(!o.user){const to=presetOf(v.camera);if(o.go)o.go.to=to;else o.v=to;}};
  /* смена ракурса без новой сцены: рамки всех камер уже посчитаны, поза та же. Свободная камера переходит к предустановке
     плавно (PRESET_MS; при уменьшении движения — сразу), {instant:true} — сразу */
  v.setCamera=(k,how={})=>{
   if(disposed||v.closed||!cameras[k])return false;v.camera=k;vroot.dataset.camera=k;
   if(!o){drawView(v);return true;}
   o.user=false;glide(presetOf(k),how.instant?0:PRESET_MS);return true;
  };
  const size=()=>{const r=vroot.getBoundingClientRect();return[Math.max(1,r.width),Math.max(1,r.height)];};
  v.detach=o?attachOrbit(vroot,{
   start:settle,
   rotate:(dx,dy)=>{const[w]=size();return input(q=>rotateView(q,dragAngle(dx,w),dragAngle(dy,w)*.8,limits(q)));},
   pan:(dx,dy)=>{const[w,h]=size();return input(q=>panView(q,2*dx/w,-2*dy/h,o.aspect,limits(q)));},
   zoom:(f,x,y)=>{const[w,h]=size();return input(q=>zoomView(q,f,2*x/w-1,1-2*y/h,o.aspect,limits(q)));},
   reset:()=>{v.reset();try{vo.onGesture?.();}catch(e){}},
   key(a){
    if(a==='reset'){v.reset();return;}
    /* шаг — от цели идущего перехода: частые нажатия и удержание клавиши складываются, а не теряются. Стрелки вбок
       поворачивают фигуру, как перетаскивание вбок; вверх — камера выше (взгляд сверху), вниз — ниже */
    const q=o.go?o.go.to:o.v,lim=limits(q),D=Math.PI/180;
    const n=a==='left'||a==='right'?rotateView(q,(a==='left'?-1:1)*KEY_YAW*D,0,lim):a==='up'||a==='down'?rotateView(q,0,(a==='up'?1:-1)*KEY_PITCH*D,lim):zoomView(q,a==='in'?KEY_ZOOM:1/KEY_ZOOM,0,0,o.aspect,lim);
    if(sameView(n,q))return;o.user=true;glide(n,KEY_MS);try{vo.onGesture?.();}catch(e){}
   }
  }):null;
  v.close=()=>{if(v.closed)return;v.closed=true;if(v.pending&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(v.pending);v.pending=0;v.detach?.();v.observer?.disconnect();};
  return v;
 }
 /* Ракурс не на странице (фигура только создана, приложение ещё не вставило её) — кадр не рисуется: его размер неизвестен
    (раньше — кадр 620 × 539 впустую, потом ещё один по настоящему размеру). Нарисует первый кадр после вставки: размер
    тогда берётся заново, а наблюдатель размера потом нового кадра не просит. Без ResizeObserver — как раньше. */
 let firstDrawn=false;
 function drawView(v){
  if(disposed||v.closed)return;
  if(v.stale&&observing){if(!v.root.isConnected){v.dirty=true;return;}layout();}
  v.dirty=false;v.drawnAt=clock();
  const o=v.orbit;if(o){v.place();if(o.go)v.schedule();}
  const cam=o?o.cam:cameras[v.camera];
  try{fadeOccluders(cam);}catch(e){}
  if(!copy)renderer.render(scene.scene,cam);
  else{
   /* контекст WebGL потерян: холст ракурса хранит прежнюю картинку (кадр — после webglcontextrestored) */
   if(renderer.getContext?.()?.isContextLost?.())return;
   renderer.setViewport(0,0,v.w,v.h);renderer.setScissor(0,0,v.w,v.h);renderer.setScissorTest(true);
   try{renderer.render(scene.scene,cam);}finally{renderer.setScissorTest(false);}
   const c=v.canvas;if(v.ctx&&c.width&&c.height)v.ctx.drawImage(canvas,0,canvas.height-c.height,c.width,c.height,0,0,c.width,c.height);
  }
  /* первый кадр нарисован: материалы прежней фигуры на этом рендерере больше не держат программы */
  if(!firstDrawn){firstDrawn=true;try{releasePrevious?.();}catch(e){}}
 }
 /* кадр во всех ракурсах. Тень ключевого света от камеры не зависит: со второго ракурса карта тени не пересчитывается */
 function draw(){
  const sm=renderer.shadowMap,auto=sm?.autoUpdate;let first=true;
  try{for(const v of views){if(v.closed)continue;if(!first&&sm?.enabled){sm.autoUpdate=false;sm.needsUpdate=false;}drawView(v);first=false;}}
  finally{if(sm)sm.autoUpdate=auto;}
 }
 /* размер ракурса — по его месту на странице; true — изменился */
 function measure(v){
  const rect=v.root.getBoundingClientRect(),w=Math.max(1,Math.min(1100,rect.width||620)),h=Math.max(1,Math.round(rect.height||w/(v.o.ratio||1.15)));
  const was=v.stale;v.stale=!v.root.isConnected;if(v.w===w&&v.h===h)return was&&!v.stale;
  v.w=w;v.h=h;v.aspect(w/h);
  if(v.canvas){const pr=renderer.getPixelRatio?.()||1,cw=Math.floor(w*pr),ch=Math.floor(h*pr);if(v.canvas.width!==cw)v.canvas.width=cw;if(v.canvas.height!==ch)v.canvas.height=ch;}
  return true;
 }
 /* размеры ракурсов и холста; true — что-то изменилось (тогда нужен новый кадр) */
 const sizeNow=new THREE.Vector2();let sized=false;
 function layout(){
  let changed=!sized;sized=true;
  for(const v of views)if(!v.closed&&measure(v))changed=true;
  const main=views[0];
  if(!copy){if(changed||!renderer.getSize)renderer.setSize(main.w,main.h);}
  else{
   /* холст вне страницы: наибольший из ракурсов (без стиля) */
   let W=1,H=1;for(const v of views)if(!v.closed){W=Math.max(W,v.w);H=Math.max(H,v.h);}
   renderer.getSize?.(sizeNow);if(sizeNow.x!==W||sizeNow.y!==H){renderer.setSize(W,H,false);changed=true;}
  }
  if(changed||!renderer.getSize)scene.resize(main.w,main.h);
  return changed;
 }
 /* force — кадр и без перемены размера (контекст WebGL вернулся) */
 function resize(force){if(disposed)return;if(layout()||force===true||!renderer.getSize)draw();}
 /* первый ракурс — в 2D-холст: холст WebGL уходит со страницы (у фигуры появился второй ракурс) */
 function toCopy(){
  if(copy)return;copy=true;const main=views[0];
  main.canvas=document.createElement('canvas');main.ctx=main.canvas.getContext?.('2d',{alpha:false})||null;
  if(canvas.parentNode===root)root.replaceChild(main.canvas,canvas);else root.append(main.canvas);
  main.w=main.h=0;
 }
 const stamp=()=>{for(const v of views)if(!v.closed){v.root.dataset.pose=String(lastT);v.root.dataset.phase=String(lastIndex);}};
 function at(t,frame){if(disposed)return;lastT=t;lastIndex=frame?.index||0;apply(t,lastIndex);stamp();draw();watchPace();}
 const main=makeView(root,options.camera||'above',options);views.push(main);
 // Three restores its GPU resources first; paused views also need a fresh frame.
 const restore=()=>{if(!disposed){apply(lastT,lastIndex);resize(true);}};
 canvas.addEventListener('webglcontextrestored',restore);
 const observing=typeof ResizeObserver==='function';
 main.observer=observing?new ResizeObserver(resize):null;main.observer?.observe(root);resize();
 /* настройки вида: то же значение — без нового кадра (раньше каждый вызов пересчитывал позу и рисовал кадр: при открытии
    разбора — до шести одинаковых кадров подряд) */
 const again=()=>at(lastT,{index:lastIndex});
 const setMuscles=show=>{if(muscles===!!show)return;muscles=!!show;again();};
 const setRegion=id=>{if(selected===id)return;selected=id;again();};
 const setJoints=show=>{if(joints===!!show)return;joints=!!show;again();};
 const setStress=show=>{if(stress===!!show)return;stress=!!show;again();};
 const layersOn=()=>{for(const v of views){v.root.dataset.skeleton=skeleton?'on':'off';v.root.dataset.anatomy=anatomy?'on':'off';}};
 /* кости (данные Skeleton.load()) или null — выключить */
 const setSkeleton=d=>{d=d||null;if(skeleton===d&&main.root.dataset.skeleton)return;skeleton=d;layersOn();again();};
 /* мышцы: {skeleton, muscles (Muscles.load()), level: {группа: 0..1}} или null — выключить */
 const setAnatomy=d=>{d=d||null;if(sameBody(anatomy,d)&&main.root.dataset.anatomy)return;anatomy=d;layersOn();again();};
 /* вид фигуры одним кадром: кости и мышцы (или null) */
 const setLayers=(bones,body)=>{bones=bones||null;body=body||null;if(skeleton===bones&&sameBody(anatomy,body)&&main.root.dataset.skeleton&&main.root.dataset.anatomy)return;skeleton=bones;anatomy=body;layersOn();again();};
 const setTrace=show=>{if(trace.visible===!!show)return;trace.visible=!!show;draw();};
 const setVectors=show=>{if(vectors.visible===!!show)return;vectors.visible=!!show;draw();};
 at(lastT,{index:lastIndex});
 if(skeleton||anatomy)warmAnny();
 /* закрыта, не нарисовав ни кадра: материалы прежней фигуры отпускаются вместе с её — после первого кадра следующей */
 function dispose(){if(disposed)return;disposed=true;for(const v of views)v.close();canvas.removeEventListener('webglcontextrestored',restore);
  /* прозрачные копии материалов: детали — снова со своими материалами; копии отпускаются вместе с материалами сцены (после
     первого кадра следующей фигуры — их программы тоже ей пригодятся) */
  scene.scene.traverse(o=>{if(o.userData?.fadeOrig){o.material=o.userData.fadeOrig;delete o.userData.fadeOrig;}});const fades=[...fadeMats.values()];fadeMats.clear();
  const releaseOwn=()=>{scene.disposeMaterials();for(const f of fades)f.dispose();};
  scene.disposeGeometry();
  slot.release=firstDrawn||!releasePrevious?releaseOwn:()=>{try{releasePrevious();}catch(e){}releaseOwn();};spareRenderer(slot);}
 /* фигура ракурса: первая (main) или связанная (linkView). У связанной at и настройки вида — общие с первой: тот же кадр
    и те же значения — без работы (приложение вызывает их у обеих фигур) */
 function figure(v,linked){
  return{svg:v.root,
   at:linked?(t,frame)=>{if(disposed||v.closed||(t===lastT&&(frame?.index||0)===lastIndex))return;at(t,frame);}:at,
   get camera(){return v.camera;},setCamera:(key,how)=>v.setCamera(key,how),setMuscles,setRegion,setJoints,setStress,setSkeleton,setAnatomy,setLayers,setTrace,setVectors,
   /* свободная камера: есть ли она, повёрнута ли вручную, вернуть предустановку, положение (для проверок) */
   get orbit(){return !!v.orbit;},get free(){return !!v.orbit?.free;},resetCamera:()=>v.reset(),cameraState:()=>v.orbit?{...v.viewNow(),aspect:v.orbit.aspect,free:v.orbit.free,moving:!!v.orbit.go,camera:v.camera}:null,
   /* точка мира (м) — в доли половины кадра (−1…1) и глубину: где она на экране сейчас */
   projectWorld:p=>v.orbit?projectPoint(fit,v.viewNow(),v.orbit.aspect,p,VIEW):null,
   /* связанный ракурс: закрыт — его холст и жесты отпускаются, сцена остаётся у первой фигуры */
   dispose:linked?()=>{v.close();const i=views.indexOf(v);if(i>0)views.splice(i,1);}:dispose,
   ...(linked?{linked:true}:{linkView})};
 }
 /* второй ракурс той же сцены: только со свободной камерой (у ортографических камер сцены пропорции — общие) */
 function linkView(vo){
  if(disposed||!fit||!vo.interactive||!cameras[vo.camera||'above'])return null;
  const vroot=document.createElement('div');vroot.className='fig volume-figure';vroot.setAttribute('role','img');vroot.setAttribute('aria-label',vo.label);vroot.dataset.camera=vo.camera||'above';vroot.dataset.renderer='webgl';
  toCopy();
  const v=makeView(vroot,vo.camera||'above',vo);v.canvas=document.createElement('canvas');v.ctx=v.canvas.getContext?.('2d',{alpha:false})||null;vroot.append(v.canvas);
  views.push(v);stamp();if(main.root.dataset.skeleton)layersOn();if(lowPower)vroot.dataset.quality='low';
  v.observer=observing?new ResizeObserver(resize):null;v.observer?.observe(vroot);
  resize(true);
  return figure(v,true);
 }
 return figure(main,false);
}

/* ---------- Карточки плана: один общий рендерер вне экрана (вид «Анатомия», этап 2) ----------
   WebGL-контекстов в браузере мало (8–16), а карточек в плане 3–10 (за неделю больше), поэтому своего рендерера у
   карточки нет. Один рендерер с холстом вне страницы рисует кадр нужной карточки и сразу, в той же задаче, копирует его
   в её холст 2D (drawImage; буфер кадра цел до конца задачи — preserveDrawingBuffer не нужен). Холст карточки и хранит
   картинку: неподвижная карточка больше ничего не считает, а потеря контекста WebGL картинку не стирает.
   Сцены упражнений — общий запас по ключу «упражнение, видимый инвентарь»: карточки одного упражнения рисуются из одной
   сцены, и поза кадра (кости, пути и тела мышц) считается один раз на фазу, а не на карточку. В запасе не больше
   CARD_SCENES сцен (анимируемые карточки и одна под неподвижные кадры); давняя сцена освобождается: геометрия — сразу,
   материалы — после кадра следующей сцены, как у фигур разбора (собранные программы шейдеров переходят к ней).
   Рамка карточки — по телу (fit:'body'): в маленьком кадре человек крупнее, тренажёр может уйти за край.
   Миниатюры витрины атласа (этап 3, 13e-gallery-anatomy.js) — неподвижный кадр одной фазы (still:true): рамка — по
   показанной позе (как у SVG-миниатюр), а не по 13 положениям повторения; она считается после самого кадра, без
   лишних расчётов позы, и не пишется в общую память рамок (в ней — рамки карточек и разбора). Сцену такой фигуры
   можно собрать заранее, отдельной задачей (prepare), — тогда кадр (поза, кости, мышцы, отрисовка) идёт следующей.
   Теней нет (CARD_SHADOWS): в кадре 130–200 px их почти не видно, а проход тени — ещё одна отрисовка всех костей. */
const CARD_SCENES=3,CARD_SHADOWS=false,CARD_PAD=1.1;
function createCardStage(){
 let slot=null,width=0,height=0,renders=0,builds=0;const scenes=new Map(),afterRender=[],timing={apply:0,render:0,copy:0};
 const now=()=>typeof performance!=='undefined'?performance.now():Date.now();
 function drop(){
  for(const e of scenes.values())disposeEntry(e,true);scenes.clear();
  for(const f of afterRender.splice(0))try{f();}catch(e){}
  if(slot){slot.canvas.removeEventListener('webglcontextrestored',restored);dropRenderer(slot);slot=null;}width=height=0;
 }
 /* контекст вернулся: сцены собираются заново по требованию (картинки карточек остались в их холстах) */
 function restored(){for(const e of scenes.values())disposeEntry(e,true);scenes.clear();width=height=0;}
 function ensure(){
  if(slot)return slot;
  if(rendererUnavailable)return null;
  if(typeof window.WebGL2RenderingContext==='undefined'){rendererUnavailable=true;return null;}
  const canvas=document.createElement('canvas');let renderer=null,context=null;
  try{context=canvas.getContext('webgl2',attributes);if(context){renderer=new THREE.WebGLRenderer({canvas,context,...attributes});renderer.setPixelRatio(1);}}catch(e){renderer=null;}
  if(!renderer){context?.getExtension?.('WEBGL_lose_context')?.loseContext();rendererUnavailable=true;return null;}
  slot={renderer,canvas,release:null};canvas.addEventListener('webglcontextrestored',restored);return slot;
 }
 function build(key,options){
  const data=(t,index,lean)=>options.data(t,index,false,lean),initial=data(0,0,true),scene=createCatalogScene(initial);
  const fit=options.fit==='body'?'body':'all',still=!!options.still,fitKey=initial.exerciseId+'|'+hashText(JSON.stringify([initial.props,[]]))+'|'+fit,saved=still?null:boundsGet(fitKey);
  if(still){/* рамка неподвижного кадра — по нему самому, при отрисовке (paint) */}
  else if(saved&&Object.keys(scene.bounds).every(k=>saved[k]))for(const k of Object.keys(scene.bounds))Object.assign(scene.bounds[k],saved[k]);
  else{
   /* рамка по телу: поза без областей манекена (lean) — их поверхности для рамки не нужны */
   for(let i=0;i<=FIT_STEPS;i++){scene.apply(data(i/FIT_STEPS,0,true),{color:options.color});scene.includeBounds(fit==='body'?'body':undefined);}
   boundsSet(fitKey,Object.fromEntries(Object.entries(scene.bounds).map(([k,e])=>[k,{minX:round4(e.minX),maxX:round4(e.maxX),minY:round4(e.minY),maxY:round4(e.maxY)}])));
  }
  scene.studio?.(slot.renderer);if(!CARD_SHADOWS)scene.setShadows?.(false);builds++;
  /* замер скорости (?perf, src/js/19-perf-panel.js): обёртки вызовов этой сцены и общего рендерера (card — не трогать
     признак облегчённого режима фигур разбора); выключенный — одна проверка на сборку сцены */
  globalThis.GymPerf?.volume({scene,renderer:slot.renderer,options,root:null,card:true});
  return{key,scene,data,color:options.color,applied:null,aspect:0,bones:{map:new Map(),data:null},still,fit,framed:null};
 }
 function disposeEntry(e,now){try{e.scene.disposeGeometry();}catch(x){}if(now)try{e.scene.disposeMaterials();}catch(x){}else afterRender.push(e.scene.disposeMaterials);}
 function entry(key,options){
  let e=scenes.get(key);
  if(e){scenes.delete(key);scenes.set(key,e);return e;}
  e=build(key,options);scenes.set(key,e);
  for(const[k,old]of scenes){if(scenes.size<=CARD_SCENES)break;if(old===e)continue;scenes.delete(k);disposeEntry(old,false);}
  return e;
 }
 /* фигура карточки: ключ сцены, данные кадра и свой вид (кости, мышцы, цвет по фазам, метки нагрузки) */
 function figure(options){
  let bones=null,body=null,muscles=options.muscles!==false,stress=options.stress!==false,released=false;
  const layerKey=()=>(bones?'b':'')+(body?'a'+Object.entries(body.level||{}).map(([k,v])=>k+v).join(','):'')+(muscles?'m':'')+(stress?'s':'');
  return{key:options.key,
   setLayers(b,a){bones=b||null;body=a||null;},
   setLook(o){if('muscles'in o)muscles=!!o.muscles;if('stress'in o)stress=!!o.stress;},
   /* кадр фазы (t, index) ракурсом camera — в холст target (размер — его width × height в точках экрана); false — не нарисован */
   paint(target,t,index,camera='above'){
    if(released||!target?.width||!target?.height)return false;
    const s=ensure();if(!s)return false;
    if(s.renderer.getContext?.()?.isContextLost?.())return false;
    const e=entry(options.key,options),cam=e.scene.cameras[camera]||e.scene.cameras.above;
    if(width!==target.width||height!==target.height){width=target.width;height=target.height;s.renderer.setSize(width,height,false);}
    if(!e.still&&e.aspect!==width/height){e.aspect=width/height;e.scene.resize(width,height,CARD_PAD);}
    const k=t+'|'+(index||0)+'|'+layerKey(),t0=now();
    if(e.applied!==k){
     const d=e.data(t,index||0,!!(bones||body));
     /* матрицы костей фазы — из памяти сцены (memoBones): часы карточки идут по сетке кадров */
     memoBones(e.bones,body?.skeleton||bones,t,d);
     e.scene.apply(d,{color:e.color,selected:'all',muscles,joints:false,stress,skeleton:bones,anatomy:body});e.applied=k;
    }
    /* неподвижный кадр: рамка — по показанной позе (тело или всё в кадре), один раз на фазу и размер */
    const fk=k+'|'+width/height;
    if(e.still&&e.framed!==fk){
     for(const b of Object.values(e.scene.bounds))Object.assign(b,{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});
     e.scene.includeBounds(e.fit==='body'?'body':undefined);e.scene.resize(width,height,CARD_PAD);e.framed=fk;e.aspect=width/height;
    }
    const t1=now();s.renderer.render(e.scene.scene,cam);renders++;
    const t2=now(),g=target.getContext('2d');if(!g)return false;g.drawImage(s.canvas,0,0,width,height);
    /* время частей последнего кадра (мс): поза и сцена, отрисовка, копия в холст карточки — для замеров */
    timing.apply=t1-t0;timing.render=t2-t1;timing.copy=now()-t2;
    /* панель замера: весь кадр карточки и копия в её холст (части кадра пишут обёртки сцены); миниатюры витрины
       панель считает сама (13e-gallery-anatomy.js) */
    const pf=globalThis.GymPerf;if(pf&&!e.still)pf.card?.(timing.apply+timing.render+timing.copy,timing.copy);
    for(const f of afterRender.splice(0))try{f();}catch(x){}
    return true;
   },
   /* сцена упражнения — заранее, отдельной задачей (витрина: сборка сцены и кадр — две задачи покороче вместо одной
      длинной); true — сцена готова (собрана сейчас или уже была), false — рисовать нечем */
   prepare(){
    if(released)return false;const s=ensure();if(!s||s.renderer.getContext?.()?.isContextLost?.())return false;
    entry(options.key,options);return true;
   },
   /* сцена этой фигуры больше не нужна (миниатюра витрины нарисована: её упражнение второй раз не рисуется) — отпустить
      сразу, не дожидаясь вытеснения: геометрия — сейчас, материалы — после следующего кадра (собранные программы шейдеров
      переходят к следующей сцене); фигура отпускается */
   forget(){released=true;const e=scenes.get(options.key);if(e){scenes.delete(options.key);disposeEntry(e,false);}},
   release(){released=true;}};
 }
 /* builds — сколько сцен собрано: кадр со сборкой сцены не годится для замера скорости (12-motion-player.js) */
 return{figure,dispose:drop,stats:()=>({scenes:scenes.size,renders,builds,context:!!slot,size:[width,height],timing:{...timing}}),get builds(){return builds;},get available(){return !rendererUnavailable;}};
}
let cardStage=null;
/* общий рендерер карточек — один на страницу; null — объёмной графики нет (тогда карточки — SVG-манекен) */
function cards(){
 if(!rendererUnavailable&&typeof window.WebGL2RenderingContext==='undefined')rendererUnavailable=true;
 if(rendererUnavailable)return null;if(!cardStage)cardStage=createCardStage();return cardStage;
}
/* Заготовка рендерера разбора (первое открытие разбора за сеанс ≈1,1 с на бюджетном телефоне: новый WebGL-контекст, сборка
   шейдеров, рамка упражнения). В простое после первого экрана приложение (12-motion-player.js) просит заготовку: контекст и
   программы шейдеров для сцены выбранного вида — compileAsync (KHR_parallel_shader_compile: сборка идёт в процессе видеокарты,
   главный поток не ждёт), затем, тоже в простое, один кадр 1×1 — программы тени и фона. Готовый рендерер лежит в запасе:
   первая фигура разбора или тренировки берёт его, как рендерер закрытой фигуры, — материалы заготовки отпускаются после её
   первого кадра, собранные программы переходят к ней. Взяли раньше, чем сборка кончилась, — фигура дождётся её сама (как
   без заготовки, но контекст уже есть). Одна заготовка за сеанс и только если в запасе пусто. */
let warmed=false;
function prewarm(options){
 if(warmed||rendererUnavailable||spare.length)return Promise.resolve(false);
 if(typeof window.WebGL2RenderingContext==='undefined'){rendererUnavailable=true;return Promise.resolve(false);}
 warmed=true;
 const slot=takeRenderer();if(!slot){rendererUnavailable=true;return Promise.resolve(false);}
 const{renderer}=slot,layers=options.layers||null;let scene;
 try{
  scene=createCatalogScene(options.data(0,0,false,false));
  /* без ключа позы: кадры заготовки не попадают в память кожи мышц по фазе — первый кадр разбора считается, как раньше, заново */
  const look={color:options.color,selected:'all',muscles:options.muscles!==false,joints:!!options.joints,stress:options.stress!==false};
  const frame=lean=>{const d=options.data(options.t||0,0,false,lean);d.poseKey=null;return d;};
  /* вид «Анатомия» или «Скелет», а данные кожи Anny уже есть: сетка кожи строится тоже (скрыта) — её программы собираются вместе
     с остальными, и переключение разбора на «Манекен» их не ждёт */
  if(layers&&globalThis.AnnySkin?.data)scene.apply(frame(false),{...look,skeleton:null,anatomy:null});
  scene.apply(frame(!!layers),{...look,skeleton:layers?.bones||null,anatomy:layers?.body||null});
  scene.studio?.(renderer);if(lowPower)scene.setShadows?.(false);
 }catch(e){dropRenderer(slot);return Promise.resolve(false);}
 const cam=scene.cameras.angle;scene.resize(1,1);renderer.setSize(1,1,false);
 slot.release=scene.dispose;spareRenderer(slot);
 /* три задачи покороче вместо одной длинной: сцена (эта), сборка программ, кадр 1 × 1 — каждая в своём простое. Рендерер
    взяли раньше (открыли разбор) — дальше не идём: фигура соберёт недостающее сама */
 const idle=cb=>typeof requestIdleCallback==='function'?requestIdleCallback(cb,{timeout:2000}):setTimeout(cb,50);
 const own=()=>spare.includes(slot)&&!renderer.getContext?.()?.isContextLost?.();
 return new Promise(done=>idle(()=>{
  if(!own()){done(false);return;}
  const compiled=renderer.compileAsync?renderer.compileAsync(scene.scene,cam):Promise.resolve();
  compiled.then(()=>idle(()=>{if(own())try{renderer.render(scene.scene,cam);}catch(e){}done(own());}),()=>done(false));
 }));
}
/* boneMisses — сколько раз скелет раскладывался заново или кожа мышц считалась без памяти по фазе (кадр «с холодной памятью»:
   его время — не мерило скорости устройства; первое повторение в «Анатомии» дороже) */
window.GymVolume={create:createVolumeFigure,cards,prewarm,get boneMisses(){return boneMisses+phaseMemory().misses;}};
