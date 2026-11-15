/* One spatial skeleton per movement. Cameras only project the same pose. */
const V3={
 add:(a,b,k=1)=>a.map((v,i)=>v+b[i]*k),sub:(a,b)=>a.map((v,i)=>v-b[i]),
 dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),unit:a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);},
 cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
};
const CAMERA3={front:{label:'Спереди',yaw:0,elevation:0},side:{label:'Сбоку',yaw:90,elevation:0},angle:{label:'Под углом',yaw:55,elevation:-15},
 back:{label:'Сзади',yaw:180,elevation:0},above:{label:'Сверху под углом',yaw:35,elevation:-55},rear:{label:'Сзади под углом',yaw:235,elevation:-15}};
function camera3(key){
 const C=CAMERA3[key]||CAMERA3.side,sy=Math.sin(C.yaw*D2R),cy=Math.cos(C.yaw*D2R),se=Math.sin(C.elevation*D2R),ce=Math.cos(C.elevation*D2R);
 return p=>{const depth=-p[0]*sy+p[2]*cy;return [p[0]*cy+p[2]*sy,p[1]*ce-depth*se,depth*ce+p[1]*se];};
}
/* Рамки кадров SVG-фигур: «упражнение|ракурс|пропорция|пол|видимый инвентарь» → {viewBox, floor, trace}.
   Хранятся и между запусками (localStorage), пока не сменится сборка: хэш сборки — PODHOD_BUILD. */
const SPATIAL_FRAMES=new Map(),SPATIAL_FRAMES_KEY='podhod.frames.v1';
let spatialFramesLoaded=false,spatialFramesSave=0;
function spatialFramesBuild(){return typeof window!=='undefined'&&window.PODHOD_BUILD||null;}
function spatialFrameGet(key){
 if(!spatialFramesLoaded){
  spatialFramesLoaded=true;
  try{const saved=JSON.parse(localStorage.getItem(SPATIAL_FRAMES_KEY)||'null');if(saved&&saved.build&&saved.build===spatialFramesBuild())for(const[k,v]of Object.entries(saved.frames||{}))if(!SPATIAL_FRAMES.has(k)&&v&&typeof v.viewBox==='string'&&typeof v.trace==='string'&&Array.isArray(v.floor)&&v.floor.length===4)SPATIAL_FRAMES.set(k,v);}catch(e){}
 }
 return SPATIAL_FRAMES.get(key)||null;
}
/* запись пачкой через полторы секунды или при уходе со страницы; запись другой сборки заменяется целиком, объём ограничен */
function spatialFramesFlush(){
 clearTimeout(spatialFramesSave);spatialFramesSave=0;
 const build=spatialFramesBuild();if(!build)return;
 try{localStorage.setItem(SPATIAL_FRAMES_KEY,JSON.stringify({build,frames:Object.fromEntries([...SPATIAL_FRAMES].slice(-240))}));}catch(e){}
}
function spatialFrameSet(key,frame){
 SPATIAL_FRAMES.set(key,frame);
 if(!spatialFramesBuild()||spatialFramesSave)return;
 if(!spatialFramesSave&&typeof addEventListener==='function'&&!spatialFrameSet.hooked){spatialFrameSet.hooked=true;addEventListener('pagehide',()=>{if(spatialFramesSave)spatialFramesFlush();});}
 spatialFramesSave=setTimeout(spatialFramesFlush,1500);
}
/* Готовые кадры SVG-фигур карточек плана (opts.frameCache). Карточка крутит одно и то же повторение: со второго круга
   кадр не считается заново (поза, поверхность манекена, силуэты, мышцы — ≈¾ времени кадра), а берётся из памяти.
   Ключ набора — рамка кадра (упражнение, ракурс, пропорция, видимый инвентарь) и вариант позы; ключ кадра — фаза
   (t, index). Записи кадра не зависят от фигуры (цвета атлета — метки, см. buildSpatialFigure), поэтому набор общий
   для всех карточек упражнения и переживает перестройку плана. Кадр карточки — ≈25–35 КБ (силуэты и мышцы — пути
   SVG), повторение в 4 с — ≈120 кадров, ≈3–4 МБ. Память ограничена оценкой объёма (FIGURE_FRAMES_LIMIT): первыми
   уходят наборы давно не показанных упражнений; если не помещается и один набор (медленный темп), новые кадры
   не запоминаются — первые остаются. Записи, не изменившиеся с прошлого кадра (неподвижный инвентарь, тело в паузе),
   хранятся один раз — общим объектом, и узел SVG с такой записью в кадре не трогается.
   Сброс — figureFramesReset (смена темы, языка, инвентаря места). */
const FIGURE_FRAMES=new Map(),FIGURE_FRAMES_LIMIT={bytes:8<<20,frames:600};let figureFramesBytes=0;
function figureFrameGet(set,key){
 const s=FIGURE_FRAMES.get(set),F=s&&s.frames.get(key);if(!F)return null;
 if(FIGURE_FRAMES.size>1){FIGURE_FRAMES.delete(set);FIGURE_FRAMES.set(set,s);}
 return F;
}
const sameAttrs=(a,b)=>{let n=0;for(const k in a){if(a[k]!==b[k])return false;n++;}for(const k in b)n--;return n===0;};
/* оценка памяти кадра (байты): строки и объекты записей; общие с прошлым кадром записи не считаются */
function figureFrameBytes(F,prev){
 let n=96+F.joints.length*40;
 F.records.forEach((r,i)=>{if(prev&&prev.records[i]===r)return;n+=48;for(const k in r.attrs){const v=r.attrs[k];n+=16+(typeof v==='string'?16+v.length:0);}});
 for(const s of F.stress)n+=64+s.transform.length;
 for(const v of F.vectors||[])n+=v?16+v.length:8;
 return n;
}
function figureFramePut(set,key,F){
 let s=FIGURE_FRAMES.get(set);
 if(s)FIGURE_FRAMES.delete(set);else s={frames:new Map(),last:null,bytes:0};
 FIGURE_FRAMES.set(set,s);
 if(s.frames.has(key))return;
 const prev=s.last;if(prev)F.records.forEach((r,i)=>{const q=prev.records[i];if(q&&q!==r&&q.tag===r.tag&&sameAttrs(q.attrs,r.attrs))F.records[i]=q;});
 const size=figureFrameBytes(F,prev);
 for(const[k,o]of FIGURE_FRAMES){if(o===s||figureFramesBytes+size<=FIGURE_FRAMES_LIMIT.bytes)break;FIGURE_FRAMES.delete(k);figureFramesBytes-=o.bytes;}
 if(figureFramesBytes+size>FIGURE_FRAMES_LIMIT.bytes||s.frames.size>=FIGURE_FRAMES_LIMIT.frames){if(!s.frames.size)FIGURE_FRAMES.delete(set);return;}
 s.frames.set(key,F);s.last=F;s.bytes+=size;figureFramesBytes+=size;
}
function figureFramesReset(){FIGURE_FRAMES.clear();figureFramesBytes=0;}
/* тема (цвета атлета — переменные CSS, в записях их нет, но набор после смены темы считается заново) и язык страницы */
if(typeof matchMedia==='function')try{matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',figureFramesReset);}catch(e){}
if(typeof MutationObserver==='function'&&typeof document!=='undefined'&&document.documentElement)new MutationObserver(figureFramesReset).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','lang']});
function buildSpatialFigure(anim,opts={}){
 const camera=opts.camera||anim.camera||'side',project=camera3(camera),paletteRoot=el('svg',{}),fills=athletePalette(paletteRoot);
 /* цвета атлета в записях кадра — метки ('\u0001skin'…): градиент у каждой фигуры свой (id), метка заменяется
    им при записи в узел — так готовый кадр годится любой карточке этого упражнения */
 const palette=Object.fromEntries(Object.keys(fills).map(k=>[k,'\u0001'+k]));
 const svg=el('svg',{class:'fig spatial-figure',role:'img','aria-label':`${opts.label||''} — ${CAMERA3[camera].label}`});
 svg.appendChild(paletteRoot.firstChild);
 const ground=el('g',{'aria-hidden':'true'},svg),trace=el('path',{class:'motion-trace',display:'none','aria-hidden':'true'},svg),scene=el('g',{},svg),dots=el('g',{class:'rig-dots','aria-hidden':'true'},svg);
 const allBounds=[],tracePts=[];let records=[];
 function queue(tag,attrs,points,offset=0){
  const pts=points.map(project),depth=pts.reduce((s,p)=>s+p[2],0)/pts.length+offset;
  allBounds.push(...pts);records.push({tag,attrs,depth});
 }
 const path2=p=>'M'+p.map(q=>`${f1(q[0])},${f1(q[1])}`).join('L')+'Z';
 function face(points,fill,extra={}){queue('path',{d:path2(points.map(project)),fill,...extra},points);}
 function silhouette(points,fill,attrs={}){
  const p=points.map(project).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const half=ps=>{const h=[];for(const q of ps){while(h.length>1&&cross(h[h.length-2],h[h.length-1],q)<=0)h.pop();h.push(q);}return h;};
  const a=half(p),b=half([...p].reverse());a.pop();b.pop();
  queue('path',{d:closedSpline(a.concat(b).map(v=>v.slice(0,2))),fill,...attrs},points);
 }
 function line3(a,b,width,fill,offset=0,attrs={}){const p=project(a),q=project(b);queue('line',{x1:f1(p[0]),y1:f1(p[1]),x2:f1(q[0]),y2:f1(q[1]),stroke:fill,'stroke-width':width,'stroke-linecap':'round',...attrs},[a,b],offset);}
 function circle3(c,r,axis,count=48){
  axis=V3.unit(axis);const a=V3.unit(V3.cross(axis,Math.abs(axis[1])<.8?[0,1,0]:[0,0,1])),b=V3.cross(axis,a);
  return Array.from({length:count},(_,i)=>V3.add(V3.add(c,a,r*Math.cos(i*Math.PI*2/count)),b,r*Math.sin(i*Math.PI*2/count)));
 }
 const TONE3={frame:'#5f708a',pad:'#46566e',chrome:'#b7c4d6',plate:'#3b4c66',rubber:'#2f3a4b',cable:'#8a9ab0',band:'#6d9dc6',mat:'#2f3d52',wood:'#8a755e',wall:'#4a586c',stack:'#56667e',rope:'#b8a07a',towel:'#c9cfd8'};
 const shade=(hex,k)=>{const n=parseInt(hex.slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*k))));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');};
 const facing=d=>{const a=project([0,0,0]),b=project(d);return b[2]-a[2];};
 function obox(c,ax,size,tone,attrs={}){
  const h=size.map(v=>v/2),P=(i,j,k)=>V3.add(V3.add(V3.add(c,ax[0],i*h[0]),ax[1],j*h[1]),ax[2],k*h[2]),base=TONE3[tone]||TONE3.frame;
  for(let a=0;a<3;a++)for(const sg of [-1,1]){
   const n=ax[a].map(v=>v*sg);if(facing(n)<=1e-6)continue;
   const b=(a+1)%3,cc=(a+2)%3,q=(u,v)=>{const idx=[0,0,0];idx[a]=sg;idx[b]=u;idx[cc]=v;return P(...idx);};
   face([q(-1,-1),q(1,-1),q(1,1),q(-1,1)],shade(base,.78+.32*Math.abs(project(n)[1]-project([0,0,0])[1]<0?.9:.55)),attrs);
  }
 }
 function cylinder(c,axis,r,len,tone,attrs={}){
  axis=V3.unit(axis);const a=V3.add(c,axis,-len/2),b=V3.add(c,axis,len/2),ca=circle3(a,r,axis,20),cb=circle3(b,r,axis,20),base=TONE3[tone]||TONE3.frame;
  silhouette(ca.concat(cb),shade(base,.85),attrs);const end=facing(axis)>0?cb:ca;face(end,shade(base,1.08),attrs);
 }
 function prop(s){
  if(s.optional&&opts.has&&!opts.has(s.optional))return;
  if(s.optionalNot&&(!opts.has||opts.has(s.optionalNot)))return;
  if(s.kind==='beam')line3(s.a,s.b,s.r?2*s.r:Math.max(s.w,s.h),TONE3[s.tone]||TONE3.frame,0,{'data-prop':s.id||'beam'});
  else if(s.kind==='obox')obox(s.c,[s.x,s.y,s.z].map(V3.unit),s.size,s.tone,{'data-prop':s.id||'box'});
  else if(s.kind==='cyl')cylinder(s.c,s.axis,s.r,s.len,s.tone,{'data-prop':s.id||'cyl'});
  else if(s.kind==='prism'){const P=[];for(const k of [-.5,.5])for(const q of s.pts)P.push(V3.add(V3.add(V3.add(s.c,s.u,q[0]),s.v,q[1]),s.w,k*s.len));silhouette(P,shade(TONE3[s.tone]||TONE3.frame,.9),{'data-prop':s.id||'prism'});}
  else if(s.kind==='sphere'){const q=project(s.c);queue('circle',{cx:f1(q[0]),cy:f1(q[1]),r:f1(s.r),fill:TONE3[s.tone]||TONE3.frame},[s.c]);}
  else if(s.kind==='cable')for(let i=1;i<s.pts.length;i++)line3(s.pts[i-1],s.pts[i],Math.max(1,2*s.r),TONE3[s.tone]||TONE3.cable,0,{'data-prop':s.id||'cable'});
  else if(s.kind==='barbell'&&s.len){
   const ax=V3.unit(s.axis);line3(V3.add(s.c,ax,-s.inner),V3.add(s.c,ax,s.inner),2*s.shaftR,TONE3.chrome,0,{'data-prop':'barbell','data-part':'shaft'});
   for(const sg of [-1,1]){line3(V3.add(s.c,ax,sg*(s.inner+2)),V3.add(s.c,ax,sg*s.len/2),2*s.sleeveR,TONE3.chrome,0,{'data-prop':'barbell','data-part':'sleeve'});
    let at=s.inner+2.4;for(const[r,th]of s.plates){cylinder(V3.add(s.c,ax,sg*(at+th/2)),ax,r,th,'plate',{'data-prop':'barbell','data-part':'plate'});at+=th+.3;}}
  }else if(s.kind==='dumbbell'&&s.handle){
   const ax=V3.unit(s.axis);line3(V3.add(s.c,ax,-s.handle/2-1),V3.add(s.c,ax,s.handle/2+1),3.2,TONE3.chrome,0,{'data-prop':'dumbbell','data-part':'shaft'});
   for(const sg of [-1,1])cylinder(V3.add(s.c,ax,sg*(s.handle/2+1.2+s.headLen/2)),ax,s.headR,s.headLen,'plate',{'data-prop':'dumbbell','data-part':'plate'});
  }
  else if(s.kind==='kettlebell'&&s.handleAxis){
   const q=project(s.c);queue('circle',{cx:f1(q[0]),cy:f1(q[1]),r:f1(s.radius),fill:TONE3.plate,'data-prop':'kettlebell'},[s.c]);
   const up=V3.unit(V3.sub(s.grip,s.c)),ax=V3.unit(s.handleAxis),P=(x,y)=>V3.add(V3.add(s.c,ax,x*s.radius/10.5),up,y*s.radius/10.5);
   const hu=(s.handleUp??15.6*s.radius/10.5)/s.radius*10.5,pts=[P(-7.2,6.5),P(-9,hu-3.6),P(-5,hu),P(5,hu),P(9,hu-3.6),P(7.2,6.5)].map(project);
   queue('path',{d:'M'+pts.map(p=>f1(p[0])+','+f1(p[1])).join('L'),fill:'none',stroke:TONE3.plate,'stroke-width':3.2,'stroke-linejoin':'round','data-prop':'kettlebell'},[s.grip],.5);
  }
  else throw Error('Unknown spatial equipment kind: '+s.kind);
 }
 /* Манекен: силуэты сегментов строятся из той же поверхности, что и объёмная сцена */
 function mannequinBody(R,boundsOnly){
  /* для рамки — только нужные точки поверхности (все ряды туловища, каждый третий ряд конечностей) */
  if(boundsOnly){const B=Mannequin.boundsSurface(R);for(const row of B.torso)allBounds.push(...row.map(project));for(const rows of Object.values(B.limbs))for(const row of rows)allBounds.push(...row.map(project));allBounds.push(project(V3.add(R.head,R.headU,12)));return;}
  const B=Mannequin.bodyData(R),H=B.torsoHeights,every=(rows,k)=>rows.filter((_,i)=>i%k===0||i===rows.length-1);
  const L=(f,p)=>[f.o[0]+f.x[0]*p[0]+f.y[0]*p[1]+f.z[0]*p[2],f.o[1]+f.x[1]*p[0]+f.y[1]*p[1]+f.z[1]*p[2],f.o[2]+f.x[2]*p[0]+f.y[2]*p[1]+f.z[2]*p[2]];
  const part=(lo,hi)=>B.torso.filter((_,i)=>H[i]>=lo&&H[i]<=hi).flat();
  silhouette(part(-9,10),palette.shorts,{'data-part':'pelvis'});silhouette(part(8,26),palette.kit,{'data-part':'waist'});silhouette(part(23,56),palette.kit,{'data-part':'chest'});
  silhouette(B.neck.flat(),palette.skin,{'data-part':'neck'});
  for(const s of ['R','L']){
   const skin=palette[s==='R'?'far':'skin'];
   for(const k of ['th','sk','ua','fa'])silhouette(every(B.limbs[k+s],2).flatMap(r=>r.filter((_,j)=>j%2===0)),skin,{'data-limb':k+s});
   silhouette(B.limbs['th'+s].slice(0,3).flat(),palette.shorts,{'data-limb':'shorts'+s});
   for(const c of B.caps.filter(c=>c.key.endsWith(s))){const q=project(c.c);queue('circle',{cx:f1(q[0]),cy:f1(q[1]),r:f1(c.r),fill:skin},[c.c]);}
   const h=B.hands[s],hand=[...h.shape.fingers.flatMap(f=>f.pts),...h.shape.thumb.pts];
   for(const dx of [-.5,.5])for(const dy of [-.5,.5])for(const dz of [-.5,.5])hand.push([h.shape.palm.c[0]+dx*h.shape.palm.size[0],h.shape.palm.c[1]+dy*h.shape.palm.size[1],h.shape.palm.c[2]+dz*h.shape.palm.size[2]]);
   silhouette(hand.map(p=>L(h.frame,p)),skin,{'data-limb':'hand'+s});
   /* стопа: силуэт заднего и среднего отдела (каждое третье кольцо, каждая вторая точка) и пальцев */
   const ft=B.feet[s],foot=[...every(ft.rows,3).flatMap(r=>r.filter((_,j)=>j%2===0)),...ft.shape.toes.flatMap(t=>t.pts.flatMap(p=>[[p[0],p[1]-t.r,p[2]],[p[0],p[1]+t.r,p[2]]])).map(p=>L(ft.toes,p))];
   silhouette(foot,skin,{'data-limb':'foot'+s});
  }
  /* голова — силуэт по точкам её поверхности (Mannequin.headSamples, с ушами); нос — треугольник по спинке и кончику */
  const hf=R.frames.head,HF={o:R.head,x:hf.x,y:hf.y,z:hf.z},head=Mannequin.headSamples().map(p=>L(HF,p));
  silhouette(head,palette.skin,{'data-part':'head'});
  face([L(HF,[-1.1,-0.8,9.4]),L(HF,[0,-3.0,11.6]),L(HF,[1.1,-0.8,9.4])],'#a3b3cb');
 }
 function compile(t,index=0,withMuscles=true){
  records=[];const R=anim.rig3d(t);mannequinBody(R,!withMuscles);
  const muscles=muscleFrame(anim,t,index);
  const sideValues=muscles?catalogSideValues(anim.muscleProfile,muscles.values):null;
  const facingCam=f=>{const a=project([0,0,0]),b=project(f.normal);return b[2]-a[2]>.035;};
  const surfaces=!muscles||!withMuscles?[]:mannequinMuscleSurfaces(R,anim.muscleProfile,{coarse:true}).filter(facingCam);
  if(muscles&&withMuscles)for(const zone of muscleContours(surfaces)){
   /* нерабочая сторона (значение 0) — без зоны: кожа, как у мышц вне упражнения (09d-catalog-muscles.js, IDLE_SIDE) */
   const value=sideValues?.[zone.side]?.[zone.id]??muscles.values[zone.id];if(!(value>0))continue;const fill=muscleColor(value);
   queue('path',{d:closedSpline(zone.points.map(p=>project(p).slice(0,2))),fill,class:'muscle-zone','data-muscle':zone.id,'data-side':zone.side,
    'data-role':(anim.muscleProfile.regions?.[zone.id]||anim.muscleProfile.muscles[zone.id]).role,'data-band':muscleBand(value),
    stroke:fill,'stroke-width':.25,'stroke-linejoin':'round','aria-hidden':'true'},zone.points);
   /* Слой связан с глубиной своего сегмента: не проступает сквозь ближнюю руку/реквизит. */
   if(zone.anchor)records[records.length-1].depth=project(zone.anchor)[2]+.15;
  }
  R.props.forEach(prop);return{R,muscles,records:records.sort((a,b)=>a.depth-b.depth)};
 }
 // Bounds include equipment, every sampled pose, and the floor; camera stays still.
 /* Рамка кадра (viewBox, пол, след хвата) по 41 положению. Считается один раз на упражнение, ракурс, пропорцию
    и набор видимого инвентаря и запоминается (SPATIAL_FRAMES, между запусками — в localStorage по хэшу сборки).
    opts.frameOnly: только рамка, по частям — figureFrameJob() досчитывает её в простое, пока карточка не на экране. */
 /* opts.still — неподвижная миниатюра (витрина атласа): рамка по показанной позе, а не по 41 фазе, и без стрелок
    векторов. Миниатюра строится в 4–5 раз быстрее; пол — тот же, по всему движению. */
 const still=!!opts.still;
 const frameKey=[anim.catalogId,camera,opts.ratio||1.15,anim.rig3d(0).props.map(q=>GymEquipment.visible(q,opts.has)?1:0).join(''),...(still?['still'+(opts.t||0)]:[])].join('|');
 let framed=spatialFrameGet(frameKey),frameNext=0;
 const setVectors=still?Object.assign(()=>{},{bounds:null,at(){}}):catalogVectorGroup(svg,anim,camera);
 function frameSample(){const{R}=compile(frameNext/40,0,false);tracePts.push(project(R.gripL));frameNext++;}
 function frameFinish(){
  if(setVectors.bounds)allBounds.push(...setVectors.bounds);
  /* пол под всей сценой манекена: суставы по фазам и детали инвентаря */
  const xs=[],zs=[],add=p=>{if(p&&p.length===3){xs.push(p[0]);zs.push(p[2]);}};
  for(let i=0;i<=4;i++){const R=anim.rig3d(i/4);for(const k of ['hip','head','anL','anR','toeL','toeR','heelL','heelR','gripL','gripR','knL','knR'])add(R[k]);
   for(const q of R.props){if(!GymEquipment.visible(q,opts.has))continue;for(const k of ['a','b','c'])add(q[k]);if(q.pts)q.pts.forEach(add);if(q.size&&q.c){const r=Math.max(...q.size)/2;add(V3.add(q.c,[r,0,r]));add(V3.add(q.c,[-r,0,-r]));}}}
  const fx0=Math.min(...xs)-18,fx1=Math.max(...xs)+18,fz0=Math.min(...zs)-18,fz1=Math.max(...zs)+18;
  const floor=[[fx0,186.5,fz0],[fx1,186.5,fz0],[fx1,186.5,fz1],[fx0,186.5,fz1]];
  allBounds.push(...floor.map(project));
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
  for(const p of allBounds){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
  const minX=x0-13,maxX=x1+13,minY=y0-16,maxY=y1+10;
  const ratio=opts.ratio||1.15,cx=(minX+maxX)/2,cy=(minY+maxY)/2;let w=maxX-minX,h=maxY-minY;
  if(w/h<ratio)w=h*ratio;else h=w/ratio;
  framed={viewBox:`${f1(cx-w/2)} ${f1(cy-h/2)} ${f1(w)} ${f1(h)}`,floor,trace:tracePts.map((p,i)=>`${i?'L':'M'}${f1(p[0])},${f1(p[1])}`).join(' ')};
  allBounds.length=0;spatialFrameSet(frameKey,framed);
  return framed;
 }
 if(opts.frameOnly)return{key:frameKey,done:!!framed,step(n=1){if(this.done)return true;for(let k=0;k<n&&frameNext<=40;k++)frameSample();if(frameNext>40){frameFinish();this.done=true;}return this.done;}};
 if(!framed){if(still)compile(opts.t||0,0,false);else while(frameNext<=40)frameSample();frameFinish();}
 svg.setAttribute('viewBox',framed.viewBox);
 {
  const floorCorners=framed.floor;
  el('path',{d:path2(floorCorners.map(project)),class:'spatial-floor'},ground);
  const fx0=floorCorners[0][0]+6,fx1=floorCorners[1][0]-6,fz0=floorCorners[0][2],fz1=floorCorners[2][2];
  for(let z=Math.ceil(fz0/50)*50;z<fz1;z+=50){const a=project([fx0,187,z]),b=project([fx1,187,z]);el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:'spatial-grid'},ground);}
 }
 trace.setAttribute('d',framed.trace);
 let nodes=[],nodeAttrs=[],jointNodes=[],selectedRegion='all';
 /* метки нагрузки на суставы — поверх всего рисунка */
 const stressLayer=el('g',{class:'stress-marks','aria-hidden':'true'},svg),stressNodes=[];
 let stressOn=(opts.stress??(typeof motionPrefs!=='undefined'?motionPrefs.stress:true))!==false,lastT=opts.t||0,lastFrame=null;
 /* метки нагрузки кадра: в памяти кадров — всегда (показ — по stressOn), без неё — только когда показаны */
 function stressMarks(R,t,frame,always){
  if(!(always||stressOn)||typeof jointStressPoints!=='function')return[];
  return jointStressPoints(anim,R,t,frame?.index||0).map(m=>{const p=project(m.p);return{key:m.key,transform:`translate(${f1(p[0])},${f1(p[1])})`};});
 }
 function paintStress(all){
  const marks=stressOn?all:[];
  marks.forEach((m,i)=>{let n=stressNodes[i];if(!n){n=stressNodes[i]=el('g',{class:'stress-mark'},stressLayer);el('circle',{r:9,class:'stress-halo'},n);el('circle',{r:3.4,class:'stress-core'},n);}n.setAttribute('transform',m.transform);n.dataset.joint=m.key;n.removeAttribute('display');});
  for(let i=marks.length;i<stressNodes.length;i++)stressNodes[i].setAttribute('display','none');
 }
 const JOINT_DOTS=['shL','elL','wrL','hipL','knL','anL','shR','elR','wrR','hipR','knR','anR'];
 /* кадр: записи узлов, точки суставов, фаза мышц, метки нагрузки, стрелки векторов — из памяти кадров (карточки) или
    посчитанный заново */
 const cacheKey=opts.frameCache&&!still&&setVectors.frame?frameKey+'|'+(anim.catalogVariant||''):null;
 function frameData(t,frame){
  const key=t+'|'+(frame?.index||0),hit=cacheKey&&figureFrameGet(cacheKey,key);if(hit)return hit;
  const {R,muscles,records}=compile(t,frame?.index||0);
  const F={records,joints:JOINT_DOTS.map(name=>{const p=project(R[name]);return[f1(p[0]),f1(p[1])];}),pose:String(t),phase:muscles?muscles.phase:null,
   stress:stressMarks(R,t,frame,!!cacheKey),vectors:cacheKey?setVectors.frame(t,frame,R):null,R:cacheKey?null:R};
  if(cacheKey)figureFramePut(cacheKey,key,F);
  return F;
 }
 function at(t,frame){
  lastT=t;lastFrame=frame||null;
  /* замер скорости (?perf, 19-perf-panel.js): выключенный — одна проверка */
  const pf=globalThis.GymPerf,p0=pf&&performance.now(),F=frameData(t,frame),records=F.records,p1=pf&&performance.now();
  /* атрибут пишется, только если он изменился с прошлого кадра: у неподвижного инвентаря и цветов — почти никогда;
     запись из памяти кадров, та же, что в прошлом кадре, — узел не трогается совсем */
  records.forEach((s,i)=>{let node=nodes[i];if(!node||node.tagName!==s.tag){const replacement=el(s.tag,{});if(node)node.replaceWith(replacement);else scene.appendChild(replacement);node=nodes[i]=replacement;nodeAttrs[i]=null;}const old=nodeAttrs[i];if(old===s.attrs)return;for(const attr of [...node.attributes])if(!(attr.name in s.attrs))node.removeAttribute(attr.name);for(const k in s.attrs){const v=s.attrs[k];if(!old||old[k]!==v||!node.hasAttribute(k))node.setAttribute(k,k==='fill'&&typeof v==='string'&&v.charCodeAt(0)===1?fills[v.slice(1)]:v);}nodeAttrs[i]=s.attrs;});
  for(let i=records.length;i<nodes.length;i++)nodes[i].remove();nodes.length=nodeAttrs.length=records.length;
  F.joints.forEach(([x,y],i)=>{const node=jointNodes[i]||(jointNodes[i]=el('circle',{r:2.1,class:'joint-dot'},dots));node.setAttribute('cx',x);node.setAttribute('cy',y);});
  svg.dataset.pose=F.pose;if(F.phase)svg.dataset.musclePhase=F.phase;allBounds.length=0;setRegion(selectedRegion);
  if(F.vectors)setVectors.paint(F.vectors);else setVectors?.at?.(t,frame,F.R);
  paintStress(F.stress);
  if(pf)pf.svg(p0,p1,F);
 }
 const setStress=show=>{stressOn=!!show;at(lastT,lastFrame);};
 const setTrace=show=>trace.setAttribute('display',show?'inline':'none');
 const setMuscles=show=>svg.classList.toggle('show-muscles',!!show&&!!anim.muscleProfile);
 const setRegion=id=>{selectedRegion=id;for(const node of svg.querySelectorAll('[data-muscle]'))node.style.opacity=id==='all'||node.dataset.muscle===id?'1':'.12';};
 setMuscles(opts.muscles);at(opts.t||0);return{svg,at,setTrace,setVectors,setMuscles,setRegion,setStress,camera};
}

