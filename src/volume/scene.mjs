import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createMannequinBody} from './body.mjs';
import {createSkeletonLayer} from './skeleton.mjs';
import {createMuscleLayer} from './muscles.mjs';
import {createAnnyLayer} from './anny.mjs';
import {isNewProp,propKey,createPropNode,updatePropNode} from './props.mjs';

const add=(a,b,k=1)=>a.map((v,i)=>v+b[i]*k),sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),len=a=>Math.hypot(...a);
const unit=a=>{const l=len(a);if(l<1e-8)throw Error('Degenerate scene direction');return a.map(v=>v/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const world=p=>[p[0]/100,(186-p[1])/100,p[2]/100];
const direction=p=>[p[0],-p[1],p[2]],vec=p=>new THREE.Vector3(...p);
/* ракурсы: [yaw, elev] в градусах (elev < 0 — камера выше); те же углы — у свободной камеры разбора (orbit.mjs) */
export const CAMERA_SETTINGS={above:[35,-55],angle:[55,-15],side:[90,0],front:[0,0],back:[180,0],rear:[235,-15]};
/* Ракурсы — от человека, а не от сцены (4.110, замечание анатома 5): в упражнениях у двери тело повёрнуто к креплению
   боком или спиной (turn в спецификации), и «Сбоку» показывал спину, «Спереди» — бок. Поворот ракурсов — куда смотрит
   грудь в первом кадре (R.chestN, горизонтальная часть), с шагом 90°; лёжа и в глубоком наклоне (горизонтальная часть
   меньше половины) — прежние ракурсы */
export function facingYaw(pose){
 const n=pose?.chestN;if(!n)return 0;const h=Math.hypot(n[0],n[2]);if(h<.5)return 0;
 const yaw=Math.atan2(-n[0],n[2])*180/Math.PI,q=Math.round(yaw/90)*90;return q===-180?180:q===-0?0:q;
}
export function cameraSettings(yaw=0){
 if(!yaw)return CAMERA_SETTINGS;
 return Object.fromEntries(Object.entries(CAMERA_SETTINGS).map(([id,[y,e]])=>[id,[y+yaw,e]]));
}
function frame(a,b,reference){
 const z=unit(sub(b,a));let x=sub(reference,z.map(v=>v*dot(reference,z)));
 if(len(x)<1e-5)x=cross(z,Math.abs(z[0])<.8?[1,0,0]:[0,0,1]);x=unit(x);return{x,y:unit(cross(z,x)),z};
}
function quaternion(x,y,z){return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(vec(x),vec(y),vec(z)));}
/* Студийный свет и материалы. Материалы физические (roughness/metalness): матовый манекен, порошковая краска рамы,
   хром грифа, резина блинов, винил подушек. Свет — три источника и небо: ключевой тёплый сверху-слева с мягкой тенью,
   холодный заполняющий, контровой сзади, отделяющий силуэт от фона. Тон — Khronos PBR Neutral: цвета мышц не уплывают;
   у него глубокий «носок» в тенях, поэтому тёмные материалы заданы светлее, чем выглядят в кадре. */
function material(color,{roughness=.6,metalness=0}={}){return new THREE.MeshStandardMaterial({color,roughness,metalness,side:THREE.DoubleSide});}
function mesh(parent,g,m,name){const o=new THREE.Mesh(g,m);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
export const STUDIO={
 background:['#1b2636','#0b1119'],           /* фон: центр и края виньетки */
 floor:['#44536b','#111925'],                /* пол: световое пятно под сценой и края */
 hemi:[0xe4ecf7,0x3a4252,2.1],              /* небо, земля, сила */
 key:[0xfff1e0,1.9,[-2.2,5.2,3.2]],          /* ключевой: цвет, сила, направление (откуда светит) */
 fill:[0xbcd2ff,.9,[3.4,1.6,2.4]],
 rim:[0xd8e6ff,1.5,[1.2,3.2,-4.6]],
 environment:0,                              /* отражения студии на металле (PMREM). Выключены: на программном GL кадр в 10–20 раз дороже,
                                                на телефонах не измерено; металл держится на бликах трёх источников */
 shadow:'pcf',                               /* 'soft' | 'pcf' | false */
 exposure:.93,                               /* на 7 % тише: сверху освещённые мышцы не выцветают */
 muscleGlow:.28                              /* собственное свечение мышц: держит цвет в тени, не пересвечивает на свету */
};
/* Силуэт кожи поверх костей и мышц: непрозрачность середины (кожа смотрит на зрителя) и контура (кожа идёт вдоль
   взгляда), крутизна перехода и цвет. Контур держит форму тела, середина не заслоняет цвет мышц. */
export const GHOST={core:.03,rim:.62,power:2.2,color:'#cfdbec',order:4};
function ghostMaterial(){
 const m=new THREE.MeshStandardMaterial({color:GHOST.color,roughness:.7,metalness:0,transparent:true,depthWrite:false,side:THREE.DoubleSide});
 const f=v=>v.toFixed(4);
 m.onBeforeCompile=s=>{
  s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`
   vec3 ghostView=isOrthographic?vec3(0.,0.,1.):normalize(vViewPosition);
   float ghostRim=pow(1.-clamp(abs(dot(normalize(normal),ghostView)),0.,1.),${f(GHOST.power)});
   gl_FragColor=vec4(outgoingLight,${f(GHOST.core)}+${f(GHOST.rim-GHOST.core)}*ghostRim);`);
 };
 m.name='ghost-skin';m.customProgramCacheKey=()=>'ghost-skin';
 /* один проход на обе стороны: three.js рисует прозрачный двусторонний материал в два прохода (изнанка, потом лицо) и
    перед каждым помечает его needsUpdate — на каждой из ~80 сеток кожи дважды за кадр поиск программы шейдера (≈⅓
    отрисовки кадра «Анатомии») и вдвое больше вызовов. Здесь порядок сторон не нужен: виден только ближний слой кожи
    (предпроход глубины ghostDepth), а прозрачность считается по модулю косинуса — изнанка выглядит так же */
 m.forceSinglePass=true;
 return m;
}
/* радиальная растяжка пола без DOM: светлое пятно под сценой, к краям — в цвет фона */
function radialTexture(inner,outer,size=128){
 const a=new THREE.Color(inner),b=new THREE.Color(outer),data=new Uint8Array(size*size*4),c=new THREE.Color();
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const r=Math.min(1,Math.hypot(x/(size-1)-.5,y/(size-1)-.5)*2),k=r*r*(3-2*r);c.copy(a).lerp(b,k);
  const i=(y*size+x)*4;data[i]=Math.round(c.r*255);data[i+1]=Math.round(c.g*255);data[i+2]=Math.round(c.b*255);data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,size,size);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;t.needsUpdate=true;return t;
}
/* сетка пола гаснет к краям, а не обрывается */
function fadingGrid(size,divisions,color,center){
 const pts=[],cols=[],h=size/2,step=size/divisions,c=new THREE.Color(color),fade=(x,z)=>Math.max(0,1-Math.hypot(x,z)/h)**1.6;
 for(let i=0;i<=divisions;i++){const v=-h+i*step;for(let j=0;j<divisions;j++){const u0=-h+j*step,u1=u0+step;
  pts.push(v,0,u0,v,0,u1,u0,0,v,u1,0,v);for(const[x,z]of [[v,u0],[v,u1],[u0,v],[u1,v]])cols.push(c.r,c.g,c.b,fade(x,z));}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cols,4));
 const lines=new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.55,depthWrite:false}));lines.name='floor-grid';lines.position.set(...center);return lines;
}
function placeSphere(o,p,scale){o.position.fromArray(world(p));o.scale.set(...scale.map(v=>v/100));}
function placeBeam(o,a,b,width){
 const d=sub(b,a),l=len(d);o.visible=l>1e-5;if(!o.visible)return;
 o.position.fromArray(world(add(a,b).map(v=>v/2)));o.scale.set(width/200,l/100,width/200);
 o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vec(direction(unit(d))));
}
/* Неподвижные детали инвентаря — рама, стойки, подушки тренажёров (без dyn: их положение не зависит от позы,
   GymEquipment.build) — рисуются объединёнными сетками, по одной на материал: вызовов отрисовки и теней меньше в разы.
   Подвижные детали (dyn: гриф, рукояти, трос, каретка, рычаги) — как раньше, сетка на деталь. */
export const isStaticProp=s=>!s.dyn&&isNewProp(s);
/* та же деталь (значения, не объекты: деталь копируется из общего запаса в каждом кадре) */
export function sameProp(a,b){
 if(a===b)return true;
 if(Array.isArray(a)){if(!Array.isArray(b)||a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(!sameProp(a[i],b[i]))return false;return true;}
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(b))return false;
 const keys=Object.keys(a);if(keys.length!==Object.keys(b).length)return false;
 for(const k of keys)if(!sameProp(a[k],b[k]))return false;
 return true;
}
/* одна сетка из нескольких: вершины и нормали — в мировых координатах детали; у зеркальной детали обход треугольников
   разворачивается, как это делает рендерер (frontFaceCW), — лицевая сторона та же */
export function mergeMeshes(list){
 let vertices=0,indices=0;for(const o of list){const g=o.geometry;vertices+=g.attributes.position.count;indices+=g.index?g.index.count:g.attributes.position.count;}
 const pos=new Float32Array(vertices*3),nor=new Float32Array(vertices*3),idx=vertices>65535?new Uint32Array(indices):new Uint16Array(indices);
 const v=new THREE.Vector3(),nm=new THREE.Matrix3();let base=0,k=0;
 for(const o of list){
  const g=o.geometry,p=g.attributes.position,n=g.attributes.normal,M=o.matrixWorld,flip=M.determinant()<0,ix=g.index;nm.getNormalMatrix(M);
  for(let j=0;j<p.count;j++){
   v.fromBufferAttribute(p,j).applyMatrix4(M);pos[(base+j)*3]=v.x;pos[(base+j)*3+1]=v.y;pos[(base+j)*3+2]=v.z;
   v.fromBufferAttribute(n,j).applyMatrix3(nm).normalize();nor[(base+j)*3]=v.x;nor[(base+j)*3+1]=v.y;nor[(base+j)*3+2]=v.z;
  }
  const count=ix?ix.count:p.count,at=j=>base+(ix?ix.getX(j):j);
  for(let j=0;j+2<count;j+=3){idx[k++]=at(j);if(flip){idx[k++]=at(j+2);idx[k++]=at(j+1);}else{idx[k++]=at(j+1);idx[k++]=at(j+2);}}
  base+=p.count;
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setIndex(new THREE.BufferAttribute(idx.subarray(0,k),1));
 g.computeBoundingSphere();g.computeBoundingBox();return g;
}
export function createCatalogScene(first){
 const scene=new THREE.Scene();scene.background=new THREE.Color(STUDIO.background[1]);
 /* манекен — матовый «скульптурный» пластик: светлее прежнего, чтобы жёлто-оранжевые мышцы и тени читались */
 const skin=material('#a0adc0',{roughness:.62}),joint=material('#96a4b8',{roughness:.6}),sole=material('#323c4c',{roughness:.78});
 const mats={steel:material('#6a7fa2',{roughness:.42,metalness:.25}),bar:material('#d3dbe6',{roughness:.26,metalness:.5}),pad:material('#3c4a62',{roughness:.66}),plate:material('#3d506b',{roughness:.5,metalness:.15}),
  cable:material('#8494aa',{roughness:.35,metalness:.4}),band:material('#6f9fc7',{roughness:.7}),mat:material('#2a3a52',{roughness:.95}),
  frame:material('#7186a7',{roughness:.45,metalness:.25}),chrome:material('#dde4ee',{roughness:.24,metalness:.5}),rubber:material('#2b3341',{roughness:.95}),wood:material('#7a6450',{roughness:.78}),
  wall:material('#2a3546',{roughness:.92}),stack:material('#53668a',{roughness:.4,metalness:.3}),rope:material('#b8a07a',{roughness:.92}),towel:material('#c9cfd8',{roughness:1})};
 const hemi=new THREE.HemisphereLight(STUDIO.hemi[0],STUDIO.hemi[1],STUDIO.hemi[2]);scene.add(hemi);
 const light=(color,power,dir)=>{const l=new THREE.DirectionalLight(color,power);l.position.set(...dir);scene.add(l);scene.add(l.target);return l;};
 const key=light(...STUDIO.key),fill=light(...STUDIO.fill),rim=light(...STUDIO.rim);key.name='key-light';fill.name='fill-light';rim.name='rim-light';
 const floorTexture=radialTexture(...STUDIO.floor);
 const floor=mesh(scene,new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({map:floorTexture,roughness:.94,metalness:0}),'floor');floor.rotation.x=-Math.PI/2;floor.position.y=-.014;floor.castShadow=false;floor.position.z=.6;
 const floorGrid=fadingGrid(5,20,0x485b76,[0,-.01,1]);scene.add(floorGrid);
 /* тело — всегда манекен (src/volume/body.mjs): прежней запасной фигуры из колец и профилей больше нет */
 const mannequin=createMannequinBody(scene,first,{skin,joint,sole,mesh});
 const parts=mannequin.parts,body=mannequin.parts.torso.mesh,head=mannequin.parts.head.mesh;
 /* вид «Манекен»: видимая кожа — сетка Anny (src/volume/anny.mjs), когда её данные загружены (AnnySkin, src/js/09bs-anny.js);
    процедурная кожа тогда скрыта и не считается (рамки, проверки и мышцы её считают сами). Виды «Анатомия» и «Скелет» — прежний
    процедурный силуэт кожи (GHOST): мышцы проверены против него. options.anny === false — прежняя кожа и в «Манекене». */
 const anny=createAnnyLayer(scene,skin);let annyShown=false;
 /* вид «Скелет» (options.skeleton): кости внутри почти невидимого силуэта кожи, области манекена скрыты. Вид «Анатомия» —
    то же с мышцами (options.anatomy: {skeleton, muscles, level}); кости при этом — по options.skeleton */
 const skeletonLayer=createSkeletonLayer(scene),muscleLayer=createMuscleLayer(scene);let ghosted=false;
 /* Кожа в режимах «Анатомия» и «Скелет» — почти невидимый силуэт: виден один ближний к зрителю слой кожи, середина
    почти прозрачна, к контуру плотнее (как у стекла). Иначе части манекена (корпус, конечности, шаровые «крышки»
    суставов) просвечивают друг через друга пятнами. Два прохода: невидимый двойник каждой сетки пишет глубину кожи
    уже после костей и мышц (прозрачные рисуются после непрозрачных), затем цветной проход рисует только этот слой.
    Кисти пересобираются при смене хвата — двойники заводятся заново в каждом кадре. */
 const ghostSkin=ghostMaterial(),ghostDepth=new THREE.MeshBasicMaterial({name:'ghost-depth',colorWrite:false,depthWrite:true,transparent:true,side:THREE.DoubleSide,forceSinglePass:true});
 function ghost(on){
  ghosted=on;
  const list=[];mannequin.group.traverse(o=>{if(o.isMesh&&!o.userData.ghostTwin)list.push(o);});
  for(const o of list){
   if(!o.userData.skin)o.userData.skin=o.material;
   o.material=on?ghostSkin:o.userData.skin;o.castShadow=!on;o.renderOrder=on?GHOST.order+1:0;
   let twin=o.userData.twin;
   if(on&&!twin){twin=new THREE.Mesh(o.geometry,ghostDepth);twin.name='ghost-depth';twin.userData.ghostTwin=true;twin.castShadow=twin.receiveShadow=false;twin.renderOrder=GHOST.order;o.add(twin);o.userData.twin=twin;}
   if(twin){twin.visible=on;twin.geometry=o.geometry;twin.frustumCulled=o.frustumCulled;}
  }
 }
 const regionMeshes=new Map(),regionsGroup=new THREE.Group();regionsGroup.name='regions';scene.add(regionsGroup);
 const equipment=new THREE.Group();equipment.name='equipment';scene.add(equipment);let propNodes=[],lastData,options={};
 /* неподвижные детали: сами детали — в скрытой группе (по ним считаются рамка камер, тень и проверки отрисовки,
    из них собирается объединение), на экране — объединённые сетки (isStaticProp, mergeMeshes) */
 const staticParts=new THREE.Group();staticParts.name='equipment-static-parts';staticParts.visible=false;staticParts.userData.drawnMerged=true;scene.add(staticParts);
 const staticMerged=new THREE.Group();staticMerged.name='equipment-static';scene.add(staticMerged);let mergedFrom=null;
 function mergeStatic(props){
  staticMerged.traverse(o=>o.geometry?.dispose());staticMerged.clear();
  const byMaterial=new Map();
  propNodes.forEach((n,i)=>{if(isStaticProp(props[i]))n.group.traverse(o=>{if(o.isMesh&&o.visible){if(!byMaterial.has(o.material))byMaterial.set(o.material,[]);byMaterial.get(o.material).push(o);}});});
  for(const[m,list]of byMaterial){const o=mesh(staticMerged,mergeMeshes(list),m,'static-'+list.length);o.userData.merged=true;o.userData.sources=list;}
  mergedFrom=props.map(s=>isStaticProp(s)?s:null);
 }
 /* метки нагрузки на суставы: красный ореол с ядром, видны сквозь тело и снаряд */
 const stressGroup=new THREE.Group();stressGroup.name='joint-stress';scene.add(stressGroup);
 const stressGeo=new THREE.SphereGeometry(1,18,12),stressHalo=new THREE.MeshBasicMaterial({color:'#ff3b30',transparent:true,opacity:.36,depthTest:false,depthWrite:false,toneMapped:false}),stressCore=new THREE.MeshBasicMaterial({color:'#ff453a',depthTest:false,depthWrite:false,toneMapped:false});
 const stressMarks=[],calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function stressMark(i){
  while(stressMarks.length<=i){const g=new THREE.Group();g.name='stress-mark';const halo=new THREE.Mesh(stressGeo,stressHalo),core=new THREE.Mesh(stressGeo,stressCore);halo.renderOrder=20;core.renderOrder=21;core.scale.setScalar(.03);g.add(halo,core);stressGroup.add(g);stressMarks.push(g);}
  return stressMarks[i];
 }
 function applyStress(marks){
  const pulse=calm?1:1+.18*Math.sin((typeof performance!=='undefined'?performance.now():0)/170);
  marks.forEach((m,i)=>{const g=stressMark(i);g.visible=true;g.position.fromArray(world(m.p));g.children[0].scale.setScalar(.078*pulse);});
  for(let i=marks.length;i<stressMarks.length;i++)stressMarks[i].visible=false;
 }
 function propNode(s,i){
  if(isNewProp(s))return createPropNode(isStaticProp(s)?staticParts:equipment,s,mats,mesh);
  const g=new THREE.Group();g.name='prop-'+i+'-'+s.kind;equipment.add(g);const m=mats[s.tone]||mats.steel;
  if(s.kind==='box'||s.kind==='panel')mesh(g,new RoundedBoxGeometry(1,1,1,2,.012),m,'pad');
  else if(s.kind==='line')mesh(g,new THREE.CylinderGeometry(1,1,1,12),m,'beam');
  else if(['wheel','roller','weight'].includes(s.kind))mesh(g,new THREE.CylinderGeometry(1,1,1,18),s.kind==='weight'?mats.plate:m,'cylinder');
  else if(['barbell','dumbbell'].includes(s.kind)){
   mesh(g,new THREE.CylinderGeometry(1,1,1,18),mats.bar,'shaft');
   for(const sign of [-1,1]){const p=mesh(g,new THREE.CylinderGeometry(1,1,1,20),mats.plate,'plate');p.userData.sign=sign;const c=mesh(g,new THREE.CylinderGeometry(1,1,1,12),mats.bar,'collar');c.userData.sign=sign;if(s.kind==='barbell'){const sleeve=mesh(g,new THREE.CylinderGeometry(1,1,1,16),mats.bar,'sleeve');sleeve.userData.sign=sign;}}
  }else if(s.kind==='kettlebell'){
   const ball=mesh(g,new THREE.SphereGeometry(1,18,12),mats.plate,'kettlebell-body');
   const points=Array.from({length:13},(_,i)=>new THREE.Vector3(-.055+i/12*.11,.042*Math.sin(Math.PI*i/12),0));
   mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),14,.008,7,false),mats.bar,'kettlebell-handle');
  }else throw Error('Unknown scene prop '+s.kind);
  return{group:g,kind:s.kind,key:s.kind};
 }
 function updateProp(node,s){
  if(isNewProp(s))return updatePropNode(node,s);
  const g=node.group,c=s.c,axis=s.axis||[1,0,0];g.visible=true;
  if(s.kind==='box'){
   const o=g.children[0],size=sub(s.hi,s.lo);o.position.fromArray(world(add(s.lo,s.hi).map(v=>v/2)));o.scale.set(...size.map(v=>Math.max(.002,v/100)));
  }else if(s.kind==='line')placeBeam(g.children[0],s.a,s.b,s.width);
  else if(s.kind==='panel'){
   const o=g.children[0],f=frame(s.a,s.b,[1,0,0]);o.position.fromArray(world(add(s.a,s.b).map(v=>v/2)));o.quaternion.copy(quaternion(direction(f.x),direction(f.y),direction(f.z).map(v=>-v)));o.scale.set(s.width/100,s.thickness/100,len(sub(s.b,s.a))/100);
  }else if(['wheel','roller','weight'].includes(s.kind)){
   const o=g.children[0];o.position.fromArray(world(c));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vec(direction(unit(axis))));const r=(s.radius||6)/100;o.scale.set(r,s.kind==='roller'?.36:.055,r);
  }else if(['barbell','dumbbell'].includes(s.kind)){
   const big=s.kind==='barbell',half=big?61:12,plateAt=big?48:9,r=big?(s.radius||17):6;
   const shaft=g.children[0];placeBeam(shaft,add(c,axis,-half),add(c,axis,half),big?2.8:2.4);
   for(const o of g.children.slice(1)){
    if(o.name==='sleeve'){placeBeam(o,add(c,axis,34*o.userData.sign),add(c,axis,61*o.userData.sign),5);continue;}
    const collar=o.name==='collar',at=plateAt+(collar?3:0);o.position.fromArray(world(add(c,axis,at*o.userData.sign)));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vec(direction(unit(axis))));o.scale.set((collar?3.5:r)/100,collar?.018:(big?.050:.035),(collar?3.5:r)/100);
   }
  }else if(s.kind==='kettlebell'){
   placeSphere(g.children[0],c,[s.radius||8.5,s.radius||8.5,s.radius||8.5]);
   const h=g.children[1],d=unit(sub(c,s.grip)),x=[1,0,0],z=unit(cross(x,d));h.position.fromArray(world(add(s.grip,d,3)));h.quaternion.copy(quaternion(direction(x),direction(d).map(v=>-v),direction(z)));
  }
 }
 /* how.shape — кадр только для рамки (13 положений повторения, main.mjs): точки те же, нормали кожи и областей не считаются
    (их досчитывает следующий обычный кадр) */
 function apply(data,nextOptions={},how={}){
  lastData=data;options={...options,...nextOptions};const R=data.pose,shape=!!how.shape;
  const bonesOn=!!(options.skeleton&&data.body),musclesOn=!!(options.anatomy&&data.body),skeletonOn=bonesOn||musclesOn;
  const annyData=!skeletonOn&&options.anny!==false&&data.pose?.frames?globalThis.AnnySkin?.data:null;annyShown=!!annyData;
  mannequin.group.visible=!annyData;if(annyData)mannequin.dots(data,options);else mannequin.apply(data,options,shape);
  if(annyData)anny.update(annyData,data,{on:options.muscles!==false,color:options.color,values:data.values,sideValues:data.sideValues,regions:data.regions,selected:options.selected});else anny?.hide();
  /* матрицы костей кадра: готовые (data.boneFrames — память кадров карточек плана, main.mjs) или посчитанные здесь */
  const frames=musclesOn?data.boneFrames||globalThis.Skeleton.frames(R,data.body,options.anatomy.skeleton.bones):null;
  if(bonesOn)skeletonLayer.update(options.skeleton,R,data.body,frames&&options.anatomy.skeleton===options.skeleton?frames:data.boneFrames||undefined);else skeletonLayer.hide();
  /* фаза и ключ позы (catalogVolumeData) — память кожи по фазе в слое мышц */
  if(musclesOn)muscleLayer.update(options.anatomy,frames,options.color,{values:data.values,sideValues:data.sideValues,regions:data.regions,phases:options.muscles!==false,selected:options.selected},data.poseKey&&typeof data.phase==='number'?{t:data.phase,key:data.poseKey}:null);else muscleLayer.hide();
  if(skeletonOn||ghosted)ghost(skeletonOn);
  /* области мышц на процедурной коже; с кожей Anny зоны — цвет её вершин (поверхности областей не считаются) */
  const surfaces=annyData?[]:data.surfaces;
  if(skeletonOn||!surfaces.length)for(const o of regionMeshes.values())o.visible=false;
  const groups=new Map();for(const f of surfaces){const key=f.id+':'+f.side;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(f);}
  for(const[key,faces]of groups){
   let o=regionMeshes.get(key);if(!o){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(faces.length*6*3),3));const m=material('#a7b3c6',{roughness:.82});m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;o=mesh(regionsGroup,g,m,key);o.receiveShadow=false;o.userData={region:faces[0].id,side:faces[0].side};regionMeshes.set(key,o);}
   if(o.geometry.attributes.position.count!==faces.length*6){o.geometry.dispose();o.geometry=new THREE.BufferGeometry();o.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(faces.length*6*3),3));}
   let i=0;const p=o.geometry.attributes.position;for(const f of faces)for(const j of [0,1,2,0,2,3])p.setXYZ(i++,...world(f.points[j]));p.needsUpdate=true;if(!shape){o.geometry.computeVertexNormals();o.geometry.computeBoundingSphere();}o.geometry.computeBoundingBox();
   const id=faces[0].id,side=faces[0].side,muscles=options.muscles!==false&&!skeletonOn,active=muscles&&(!options.selected||options.selected==='all'||options.selected===id||options.selected===faces[0].parent);o.visible=muscles;const val=data.sideValues?.[side]?.[id]??data.values[id]??.28;o.material.color.set(active&&val>0?options.color(val):'#a0adc0');
   /* собственное свечение участка: жёлтый и оранжевый в тени не уходят в коричневый */
   if(active)o.material.emissive.copy(o.material.color).multiplyScalar(STUDIO.muscleGlow);else o.material.emissive.setRGB(0,0,0);
  }
  if(propNodes.length!==data.props.length||propNodes.some((n,i)=>n.key!==(isNewProp(data.props[i])?propKey(data.props[i]):data.props[i].kind)||n.group.parent!==(isStaticProp(data.props[i])?staticParts:equipment))){
   for(const g of [equipment,staticParts,staticMerged]){g.traverse(o=>o.geometry?.dispose());g.clear();}
   propNodes=data.props.map(propNode);mergedFrom=null;
  }
  /* неподвижные детали те же, что в объединении, — их не трогаем; иначе — расставить и собрать объединение заново */
  const keep=!!mergedFrom&&data.props.every((s,i)=>!isStaticProp(s)||sameProp(mergedFrom[i],s));
  data.props.forEach((s,i)=>{if(!keep||!isStaticProp(s))updateProp(propNodes[i],s);});applyStress(options.stress?data.stress||[]:[]);scene.updateMatrixWorld(true);
  if(!keep)mergeStatic(data.props);
 }
 const settings=cameraSettings(facingYaw(first?.pose));
 const cameras=Object.fromEntries(Object.entries(settings).map(([id,[yaw,elev]])=>{
  const y=yaw*Math.PI/180,e=elev*Math.PI/180,eye=[-Math.sin(y)*Math.cos(e),-Math.sin(e),Math.cos(y)*Math.cos(e)];
  const c=new THREE.OrthographicCamera(-1,1,1,-1,.01,30);c.position.fromArray(eye.map(v=>v*8));c.lookAt(0,0,0);c.updateMatrixWorld(true);return[id,c];
 }));
 const bounds=Object.fromEntries(Object.keys(cameras).map(id=>[id,{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity}]));
 /* рамка — по самим деталям (и неподвижным: их сетки в скрытой группе), а не по объединённой сетке: кадр тот же, что до объединения.
    only='body' — только тело манекена (карточки плана в виде «Анатомия»: человек крупнее, тренажёр может уйти за край) */
 /* скрытая кожа тела: процедурная при показанной Anny и наоборот (их сетки остаются в сцене) */
 const under=(o,g)=>{for(let p=o;p;p=p.parent)if(p===g)return true;return false;};
 const offBody=o=>(annyShown?under(o,mannequin.group):under(o,anny.group));
 /* visit(x, y, z) — каждая точка рамки в мире (рамка свободной камеры разбора, orbit.mjs) */
 function includeBounds(only,visit){
  const root=only==='body'?(annyShown?anny.group:mannequin.group):scene;
  const add=p=>{visit?.(p.x,p.y,p.z);for(const[id,c]of Object.entries(cameras)){const q=p.clone().applyMatrix4(c.matrixWorldInverse),e=bounds[id];e.minX=Math.min(e.minX,q.x);e.maxX=Math.max(e.maxX,q.x);e.minY=Math.min(e.minY,q.y);e.maxY=Math.max(e.maxY,q.y);}};
  root.traverse(o=>{if(!o.isMesh||!o.visible||o===floor||o.name==='dot-ring'||o.parent?.name==='joint-dots'||o.parent?.parent===stressGroup||o.userData.merged||o.userData.ghostTwin||offBody(o))return;
   /* кожа Anny — сетка в стойке, скиннинг на видеокарте: её место в кадре — по точкам выборки (сцена, м) */
   if(o.userData.boundsPoints){for(const p of o.userData.boundsPoints)add(p);return;}
   if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;
   for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])add(vec([x,y,z]).applyMatrix4(o.matrixWorld));
  });
 }
 function resize(width,height,pad=1.13){
  for(const[id,c]of Object.entries(cameras)){
   const b=bounds[id],cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2;let w=(b.maxX-b.minX)*pad,h=(b.maxY-b.minY)*pad;
   const ratio=width/height;if(w/h<ratio)w=h*ratio;else h=w/ratio;c.left=cx-w/2;c.right=cx+w/2;c.top=cy+h/2;c.bottom=cy-h/2;c.updateProjectionMatrix();
  }
 }
 /* Студия для настоящего рендерера: тон, мягкие тени, отражения, фон. Без WebGL (тесты, аудит) сцена остаётся той же,
    только без этих эффектов. Тень отбрасывают все; принимают пол и инвентарь — на теле тень не перекрывает цвет мышц. */
 let studioTextures=[],metalEnv=null;
 function studio(renderer){
  if(!renderer?.isWebGLRenderer)return false;studioRenderer=renderer;
  renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=STUDIO.exposure;renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=!!STUDIO.shadow;renderer.shadowMap.type=STUDIO.shadow==='soft'?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;
  if(STUDIO.environment)try{
   const pmrem=new THREE.PMREMGenerator(renderer),env=new RoomEnvironment(),rt=pmrem.fromScene(env,.04);studioTextures.push(rt);env.dispose?.();pmrem.dispose();
   metalEnv=rt.texture;for(const m of Object.values(mats))if(m.metalness>=.3){m.envMap=metalEnv;m.envMapIntensity=STUDIO.environment;m.needsUpdate=true;}
  }catch(e){metalEnv=null;}
  if(typeof document!=='undefined'){
   const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
   if(g){const grad=g.createRadialGradient(128,112,10,128,128,190);grad.addColorStop(0,STUDIO.background[0]);grad.addColorStop(1,STUDIO.background[1]);g.fillStyle=grad;g.fillRect(0,0,256,256);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;scene.background=t;studioTextures.push(t);}
  }
  key.castShadow=!!STUDIO.shadow;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;key.shadow.normalBias=.02;key.shadow.radius=4;
  /* тело тень отбрасывает, но не принимает: манекен и мышцы настраивают это при создании */
  /* точки суставов — разметка, а не предметы: тени не отбрасывают */
  scene.getObjectByName('joint-dots')?.traverse(o=>{o.castShadow=false;o.receiveShadow=false;});
  fitShadow();return true;
 }
 /* тени можно выключить на ходу (слабая графика): материалы пересобираются без теневого кода */
 let studioRenderer=null;
 function setShadows(on){
  if(!studioRenderer)return;on=!!on&&!!STUDIO.shadow;if(studioRenderer.shadowMap.enabled===on)return;
  studioRenderer.shadowMap.enabled=on;key.castShadow=on;scene.traverse(o=>{if(o.material)for(const m of [].concat(o.material))m.needsUpdate=true;});
 }
 /* теневая камера ключевого света охватывает всю сцену со всеми фазами (по рамке камер) с запасом */
 function fitShadow(){
  const box=new THREE.Box3();scene.traverse(o=>{if(!o.isMesh||!o.visible||o===floor||o.name==='dot-ring'||o.parent?.name==='joint-dots'||o.parent?.parent===stressGroup||o.userData.merged||offBody(o))return;if(o.userData.boundsPoints){for(const p of o.userData.boundsPoints)box.expandByPoint(p);return;}box.expandByObject(o);});
  if(box.isEmpty())box.set(new THREE.Vector3(-1,0,-1),new THREE.Vector3(1,2,2));
  box.expandByScalar(.7);const center=box.getCenter(new THREE.Vector3()),r=box.getSize(new THREE.Vector3()).length()/2;
  for(const l of [key,fill,rim]){l.target.position.copy(center);l.position.copy(center).add(l.userData.dir||(l.userData.dir=l.position.clone().normalize().multiplyScalar(8)));l.target.updateMatrixWorld();}
  const cam=key.shadow.camera;cam.left=-r;cam.right=r;cam.top=r;cam.bottom=-r;cam.near=.1;cam.far=8+r*2;cam.updateProjectionMatrix();key.shadow.needsUpdate=true;
 }
 apply(first,{color:()=> '#a7b3c6'});
 return{scene,cameras,settings,apply,includeBounds,resize,bounds,regionMeshes,parts,body,head,mannequin,skeleton:skeletonLayer,muscleLayer,propNodes:()=>propNodes,staticMeshes:()=>staticMerged.children,studio,fitShadow,setShadows,
  anny,dispose(){disposeGeometry();disposeMaterials();},disposeGeometry,disposeMaterials};
 /* геометрия, текстуры и карты теней освобождаются сразу; материалы — отдельно: пока они живы, рендерер держит их
    собранные программы для следующей фигуры (main.mjs) */
 function disposeGeometry(){scene.traverse(o=>{o.geometry?.dispose();if(o.isLight&&o.shadow?.map)o.shadow.dispose();if(o.material)for(const m of [].concat(o.material))m.map?.dispose();});for(const t of studioTextures)t.dispose();studioTextures=[];skeletonLayer.disposeTexture();}
 function disposeMaterials(){const materials=new Set([ghostSkin,ghostDepth]);scene.traverse(o=>{if(o.material)for(const m of [].concat(o.material))materials.add(m);if(o.customDepthMaterial)materials.add(o.customDepthMaterial);});for(const m of materials)m.dispose();}
}
