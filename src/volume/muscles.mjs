import * as THREE from 'three';

/* Слой мышц объёмной сцены (вид «Анатомия» подробного разбора). Мышца — тело вдоль линии действия: путь от начала через
   промежуточные точки к прикреплению, огибающий кости (src/js/09br-muscles.js). Толщина — по объёму брюшка и длинам
   сухожилий (этап М2): при укорочении мышца утолщается; у кожи сечение сплющивается вдоль неё. Вершины тела считает
   Muscles.surface (каталог, см) — те же, что проверяет tools/muscles/check.js; здесь они переводятся в сцену (м, Y вверх).
   Все мышцы — одна сетка постоянной топологии (трубки и ленты широких плоских мышц — Muscles.ribbon, те же кольца по
   8 вершин): кадр обновляет координаты, нормали и (при смене упражнения) цвета.
   Цвет (look из сцены): с «Мышцами по фазам» — участие мышцы в текущей фазе по учебному профилю упражнения (как
   у областей манекена: головка берёт свою область профиля, у упражнений на одну сторону — своя сторона), без них —
   основные мышцы цветом нагрузки, вспомогательные бледнее. Выбранная область оставляет цвет только своим мышцам. */
const ARC_STEP=1.5;   /* шаг дуг огибания, см */
export const MUSCLE_REST='#b98c86';
/* часть мышцы → учебная область профиля (src/js/09d-catalog-muscles.js, MUSCLE_REGIONS); прочие берут значение группы */
export const PART_REGION={pecm1:'pec_clavicular',pecm2:'pec_sternal',pecm3:'pec_costal',trilong:'tri_long',trilat:'tri_lateral',trimed:'tri_medial',
 biclong:'bi_long',bicshort:'bi_short',recfem:'quad_rectus',vaslat:'quad_lateral',vasmed:'quad_medial',vasint:'quad_deep',bflh:'ham_lateral',
 semimem:'ham_medial',semiten:'ham_medial',gasmed:'calf_medial',gaslat:'calf_lateral',soleus:'soleus',glmax:'glute_max',glmed:'glute_lateral',glmin:'glute_lateral',
 trapsup:'trap_upper',trapmid:'trap_mid'};
/* этап А аудита анатомии 4.53.0 (цвет по фазам): части, которые в упражнении работают иначе, чем их группа, — свои области
   (09d-catalog-muscles.js, MUSCLE_REGIONS, REGION_FACTORS): нижняя трапециевидная и поднимающая лопатку, короткая головка
   двуглавой бедра, сгибатели и разгибатели предплечья и плечелучевая, наружная и внутренняя косые, части манжеты; с 4.102 —
   плечевая мышца (область группы «Бицепс»: в «молоте» её доля выше, чем у головок двуглавой) */
Object.assign(PART_REGION,{bra:'brachialis',trapinf:'trap_lower',levscap:'lev_scap',bfsh:'ham_short',eo:'obl_ext',io:'obl_int',pecmin:'pec_minor',
 supsp:'cuff_sup',infsp:'cuff_ext',tmin:'cuff_ext',subsc:'cuff_int',brd:'brachiorad',
 fcr:'forearm_flex',fcu:'forearm_flex',pl:'forearm_flex',fds:'forearm_flex',fdp:'forearm_flex',fpl:'forearm_flex',pt:'forearm_flex',pq:'forearm_flex',
 ecrl:'forearm_ext',ecrb:'forearm_ext',ecu:'forearm_ext',edc:'forearm_ext',edm:'forearm_ext',eip:'forearm_ext',epl:'forearm_ext',epb:'forearm_ext',apl:'forearm_ext',sup:'forearm_ext'});
const REGION_PARENTS=new WeakMap();
function regionsOf(regions){
 if(!regions)return new Map();let m=REGION_PARENTS.get(regions);if(m)return m;m=new Map();
 for(const[id,r]of Object.entries(regions)){if(!m.has(r.parent))m.set(r.parent,[]);m.get(r.parent).push(id);}
 REGION_PARENTS.set(regions,m);return m;
}
/* цвет мышцы mu: level — уровни групп упражнения (1 — основные), look — {values, sideValues, regions, phases, selected} */
export function muscleTint(mu,level,look,color){
 const groups=mu.group||[];if(!groups.length)return MUSCLE_REST;
 const key=g=>{const r=PART_REGION[mu.part];return r&&look?.regions?.[r]?.parent===g?r:g;};
 const sel=look?.selected&&look.selected!=='all'?look.selected:null;
 if(sel&&!groups.some(g=>key(g)===sel||g===sel))return MUSCLE_REST;
 if(look?.phases&&look.values){
  /* значения стороны мышцы; у части без своей области — наибольшее из
     областей её группы на этой стороне: в упражнении на одну сторону и они на нерабочей стороне в покое */
  const side=look.sideValues?.[mu.side]||look.values,byParent=regionsOf(look.regions);let v=0,any=false;
  for(const g of groups){
   if(look.values[g]===undefined)continue;any=true;const k=key(g);
   const own=k!==g||look.regions?.[g]?side[k]:undefined,rest=own===undefined?(byParent.get(g)||[]).map(id=>side[id]).filter(Number.isFinite):[];
   v=Math.max(v,own??(rest.length?Math.max(...rest):side[g]??look.values[g]));
  }
  /* нерабочая сторона упражнения на одну сторону и часть с долей 0 (подлопаточная в наружном вращении) — цвет покоя, как
     у мышц вне упражнения (09d-catalog-muscles.js, IDLE_SIDE) */
  return any&&v>0?color(v):MUSCLE_REST;
 }
 const v=Math.max(0,...groups.map(g=>level?.[g]||0));return v>=1?color(1):v>0?color(.55):MUSCLE_REST;
}
/* последний расчёт вершин (на все сцены): данные мышц, матрицы костей кадра и вершины */
const LAST={muscles:null,only:null,frames:null,pos:null,nor:null};
const sameFrames=(a,b)=>{if(!a||!b||a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true;};
/* Память кожи по фазе (этап Г; Muscles.surfaceAll, memo; раздел «память кожи по фазе» в 09br-muscles.js). Кожа кадра — самая
   дорогая часть расчёта тел, а анимация циклическая: у каждой фигуры (ключ — функция позы упражнения с вариантом инвентаря,
   data.poseKey) — PHASES ячеек на повторение, в ячейке — «лента» одного кадра с его фазой (Int16, ≈ 60 КБ). Кадр с фазой ленты —
   из неё, кадр между двумя лентами не дальше PHASE_SPAN друг от друга (соседние ячейки; ищутся за PHASE_GAP ячеек в обе
   стороны) — из двух лент линейно, иначе — полный расчёт с записью в свою ячейку, если она пуста. Первое повторение считается полностью, дальше кожа почти не стоит. Всего — не больше PHASE_MEM
   байт на все фигуры страницы (разбор, тренировка, карточки): дольше всех не нужные фигуры забываются целиком. Смена упражнения
   или варианта инвентаря — другой ключ; смена данных мышц или скелета (новый bound) — память фигуры заново. */
const PHASES=64,PHASE_GAP=2,PHASE_SPAN=2/PHASES+1e-9,PHASE_MEM=16<<20,phaseMem=new Map();let phaseBytes=0,phaseMisses=0;
function phaseEntry(key,data){
 let e=phaseMem.get(key);
 if(e&&e.data!==data){phaseBytes-=e.bytes;phaseMem.delete(key);e=null;}
 if(e)phaseMem.delete(key);else e={data,bins:new Array(PHASES+1).fill(null),bytes:0};
 phaseMem.set(key,e);return e;
}
function phaseStore(e,b,t,tape){
 for(const[k,o]of phaseMem){if(phaseBytes+tape.byteLength<=PHASE_MEM||o===e)break;phaseMem.delete(k);phaseBytes-=o.bytes;}
 if(phaseBytes+tape.byteLength>PHASE_MEM||e.bins[b])return;
 e.bins[b]={t,tape};e.bytes+=tape.byteLength;phaseBytes+=tape.byteLength;
}
/* лента для кадра с фазой t: {memo, e, b, rec} — memo для surfaceAll; rec — новая лента (записать после расчёта) */
function phaseMemo(e,t,n){
 const b=Math.min(PHASES,Math.floor(t*PHASES));let lo=null,hi=null;
 for(let j=Math.max(0,b-PHASE_GAP);j<=Math.min(PHASES,b+PHASE_GAP);j++){const s=e.bins[j];if(!s)continue;
  if(Math.abs(s.t-t)<1e-7)return{memo:{a:s.tape,b:s.tape,w:0}};
  if(s.t<t){if(!lo||s.t>lo.t)lo=s;}else if(!hi||s.t<hi.t)hi=s;}
 if(lo&&hi&&hi.t-lo.t<=PHASE_SPAN)return{memo:{a:lo.tape,b:hi.tape,w:(t-lo.t)/(hi.t-lo.t)}};
 if(e.bins[b])return null;
 const rec=new Int16Array(n);return{memo:{rec},e,b,rec};
}
/* память кожи по фазе: байт на все фигуры, фигур, кадров с полным расчётом кожи (для замеров, проверок и ступеней скорости) */
export function phaseMemory(){return{bytes:phaseBytes,figures:phaseMem.size,limit:PHASE_MEM,phases:PHASES,misses:phaseMisses};}
const FLOOR=186;
/* Слой поверх (этап Д): средняя и нижняя части трапециевидной лежат поверх широчайшей и ромбовидных (Gray's, с. 432–435:
   широчайшая подкожна, кроме верхней части, которую закрывает трапециевидная). С ритмом пояса при руке над головой корень ости уходит наружу
   и вверх, пучки трапециевидной ложатся поперёк верха широчайшей, и ленты двух мышц, посчитанные каждая по своему полу, местами
   заходят одна в другую на 1–2 см — в «Анатомии» оранжевые пятна широчайшей в красной трапециевидной. Сдвигать ленты друг
   от друга нельзя без перекоса полос (места до кожи мало, тесты лент), поэтому порядок слоёв задаётся рисунком: вершины этих
   частей при отрисовке смещаются к камере на LAYER_M вдоль луча зрения — на экране они на месте, а в буфере глубины ближе
   любой мышцы и кости, лежащей под ними не глубже LAYER_M. Геометрия (Muscles.surfaceAll) и проверки — без изменений. */
const LAYER_PARTS=new Set(['trapmid','trapinf']),LAYER_M=.02;
function layered(material){
 material.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float layer;')
   .replace('#include <project_vertex>','#include <project_vertex>\n if(layer>0.){vec3 toCam=isOrthographic?vec3(0.,0.,1.):normalize(-mvPosition.xyz);mvPosition.xyz+=toCam*layer*'+LAYER_M.toFixed(3)+';gl_Position=projectionMatrix*mvPosition;}');
 };
 material.customProgramCacheKey=()=>'muscle-layer';
 return material;
}
/* Пласты (межрёберные мышцы, данные формата 3 — sheets; Muscles.sheetMesh): жёсткие, каждый — в рамке своей кости.
   Сетки всех пластов одной кости сливаются в одну (один вызов отрисовки; у межрёберных — грудная клетка, 44 пласта,
   ≈ 4 тыс. вершин) и строятся один раз; в кадре меняется только матрица кости — как у слоя костей (skeleton.mjs).
   В группы приложения межрёберные не входят — цвет покоя, как у мышц шеи. */
function sheetGroups(md,skel,only){
 const M=globalThis.Muscles,by=new Map();
 (md.sheets||[]).forEach((sh,i)=>{
  if(only&&!only.test(sh.name))return;
  const bi=skel.bones.findIndex(b=>b.name===sh.bone[0]&&(b.side||'')===(sh.bone[1]||''));if(bi<0)throw Error('muscles: no bone '+sh.bone.join(' '));
  if(!by.has(bi))by.set(bi,[]);by.get(bi).push([i,M.sheetMesh(sh)]);
 });
 return [...by].map(([bone,list])=>{
  const nv=list.reduce((s,[,m])=>s+m.n,0),pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),idx=[],owner=[];let v0=0;
  for(const[i,m]of list){pos.set(m.pos,v0*3);nor.set(m.nor,v0*3);for(const k of m.idx)idx.push(k+v0);for(let f=0;f<m.idx.length/3;f++)owner.push(i);v0+=m.n;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));
  g.setIndex(nv>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));
  return{bone,geo:g,owner};
 });
}
export function createMuscleLayer(parent){
 const group=new THREE.Group();group.name='muscles';group.visible=false;parent.add(group);
 /* геометрия — при первом включении: сцена строится и для миниатюр атласа, где мышц нет */
 let mesh=null,geo=null,material=null,bound=null,key=null,tint=null,start=null,owner=null,SIDES=0;
 let sheets=[],sheetKey=null,sheetMaterial=null;
 function buildSheets(anatomy,only){
  for(const s of sheets){group.remove(s.mesh);s.geo.dispose();}
  if(!sheetMaterial)sheetMaterial=new THREE.MeshStandardMaterial({color:MUSCLE_REST,roughness:.55,metalness:0});
  sheets=sheetGroups(anatomy.muscles,anatomy.skeleton,only).map(s=>{
   const m=new THREE.Mesh(s.geo,sheetMaterial);m.name='muscle-sheets';m.matrixAutoUpdate=false;m.frustumCulled=false;m.castShadow=false;m.receiveShadow=false;group.add(m);return{...s,mesh:m};
  });
 }
 /* матрица кости кадра (каталог, см, Y вниз) → сцена (м, Y вверх), как у слоя костей */
 function placeSheets(frames){
  for(const s of sheets){const o=s.bone*12,a=k=>frames[o+k];
   s.mesh.matrix.set(a(0)/100,a(1)/100,a(2)/100,a(3)/100, -a(4)/100,-a(5)/100,-a(6)/100,(FLOOR-a(7))/100, a(8)/100,a(9)/100,a(10)/100,a(11)/100, 0,0,0,1);s.mesh.matrixWorldNeedsUpdate=true;}
 }
 const c=new THREE.Color();
 function build(){
  const M=globalThis.Muscles;SIDES=M.SIDES;
  start=M.ringStarts(bound);
  const nv=start[bound.length]*SIDES,idx=[];owner=[];
  for(let i=0;i<bound.length;i++)for(let r=start[i];r<start[i+1]-1;r++)for(let j=0;j<SIDES;j++){
   /* обход против часовой снаружи (Muscles.surface: кольцо идёт от оси к коже o к w) */
   const a=r*SIDES+j,b=r*SIDES+(j+1)%SIDES,d=a+SIDES,e=b+SIDES;idx.push(a,b,d,b,e,d);owner.push(i,i);
  }
  geo?.dispose();geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(nv*3),3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(nv*3),3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(nv*3),3));
  const layer=new Float32Array(nv);for(let i=0;i<bound.length;i++)if(LAYER_PARTS.has(bound[i].part))layer.fill(1,start[i]*SIDES,start[i+1]*SIDES);
  geo.setAttribute('layer',new THREE.BufferAttribute(layer,1));
  geo.setIndex(nv>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));
  if(!material)material=layered(new THREE.MeshStandardMaterial({roughness:.55,metalness:0,vertexColors:true}));
  if(mesh){group.remove(mesh);}
  mesh=new THREE.Mesh(geo,material);mesh.name='muscle-bodies';mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=false;group.add(mesh);
  tint=new Array(bound.length).fill(null);
 }
 /* перекрашиваются только мышцы, чей цвет сменился (по фазам цвет меняется плавно, кадр за кадром — немногие) */
 function paint(level,look,color){
  const col=geo.attributes.color.array;let changed=false;
  bound.forEach((mu,i)=>{
   const hex=muscleTint(mu,level,look,color);if(tint[i]===hex)return;tint[i]=hex;changed=true;c.set(hex);
   for(let k=start[i]*SIDES;k<start[i+1]*SIDES;k++){col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b;}
  });
  if(changed)geo.attributes.color.needsUpdate=true;
 }
 /* phase — {t, key}: фаза повторения 0…1 и ключ позы фигуры (память кожи по фазе); без неё — полный расчёт */
 function update(anatomy,frames,color,look=null,phase=null){
  const M=globalThis.Muscles,k=anatomy.muscles;
  if(key!==k||bound?.skel!==anatomy.skeleton){bound=M.bind(k,anatomy.skeleton);bound.skel=anatomy.skeleton;key=k;build();}
  paint(anatomy.level,look,color);
  const pos=geo.attributes.position.array,nor=geo.attributes.normal.array,only=anatomy.only||null;
  /* пласты: сетка — при смене данных или фильтра, в кадре — только матрицы костей */
  const sk=[k,anatomy.skeleton,only?only.source:''];
  if(!sheetKey||sheetKey.some((v,i)=>v!==sk[i])){buildSheets(anatomy,only);sheetKey=sk;}
  placeSheets(frames);
  /* второй вид разбора показывает ту же позу: вершины берутся из прошлого расчёта, если кости кадра те же */
  if(LAST.muscles===k&&!only&&!LAST.only&&LAST.pos?.length===pos.length&&sameFrames(LAST.frames,frames)){pos.set(LAST.pos);nor.set(LAST.nor);finish();return;}
  /* трубки и ленты (широкие плоские мышцы — полосы между соседними линиями, Muscles.ribbon) */
  const pm=phase&&phase.key&&bound.tapeN&&phase.t>=0&&phase.t<=1?phaseMemo(phaseEntry(phase.key,bound),phase.t,bound.tapeN):null;
  if(phase&&(!pm||pm.rec))phaseMisses++;
  M.surfaceAll(bound,M.layoutDrawn(bound,frames,ARC_STEP),frames,pos,nor,start,pm?pm.memo:null);
  if(pm&&pm.rec)phaseStore(pm.e,pm.b,phase.t,pm.rec);
  /* каталог (см, Y вниз, пол 186) → сцена (м, Y вверх): отражение по Y — у нормалей меняется знак y */
  for(let v=0;v<pos.length;v+=3){pos[v]/=100;pos[v+1]=(186-pos[v+1])/100;pos[v+2]/=100;nor[v+1]=-nor[v+1];}
  /* только выбранные мышцы (просмотрщик, контактные листы): остальные — в точку */
  if(only)for(let i=0;i<bound.length;i++)if(!only.test(bound[i].name))pos.fill(0,start[i]*SIDES*3,start[i+1]*SIDES*3);
  /* копии — в те же массивы, если размер прежний (≈1 МБ на кадр без новых выделений и сборки мусора) */
  const keep=(a,b)=>a&&a.length===b.length?(a.set(b),a):Float32Array.from(b);
  LAST.muscles=k;LAST.only=only;LAST.frames=keep(LAST.frames,frames);LAST.pos=keep(LAST.pos,pos);LAST.nor=keep(LAST.nor,nor);
  finish();
 }
 function finish(){geo.attributes.position.needsUpdate=true;geo.attributes.normal.needsUpdate=true;geo.boundingSphere=null;geo.boundingBox=null;group.visible=true;}
 function hide(){group.visible=false;}
 function dispose(){if(mesh)group.remove(mesh);geo?.dispose();material?.dispose();mesh=geo=material=null;bound=null;key=null;
  for(const s of sheets){group.remove(s.mesh);s.geo.dispose();}sheets=[];sheetKey=null;sheetMaterial?.dispose();sheetMaterial=null;}
 /* мышца под лучом (просмотрщик для ревью): номер в данных мышц или −1 */
 function pick(raycaster){
  if(!group.visible||!mesh)return -1;geo.computeBoundingSphere();const hit=raycaster.intersectObject(mesh,false)[0];
  return hit?owner[hit.faceIndex]:-1;
 }
 /* мышца или пласт под лучом — ближайшее: {muscle: номер в muscles} или {sheet: номер в sheets}, иначе null */
 function pickAny(raycaster){
  if(!group.visible||!mesh)return null;geo.computeBoundingSphere();let best=null;
  const h=raycaster.intersectObject(mesh,false)[0];if(h)best={muscle:owner[h.faceIndex],distance:h.distance};
  for(const s of sheets){s.geo.boundingSphere||s.geo.computeBoundingSphere();const q=raycaster.intersectObject(s.mesh,false)[0];if(q&&(!best||q.distance<best.distance))best={sheet:s.owner[q.faceIndex],distance:q.distance};}
  return best;
 }
 return{group,update,hide,dispose,pick,pickAny,get mesh(){return mesh;},get sheets(){return sheets.map(s=>s.mesh);}};
}
