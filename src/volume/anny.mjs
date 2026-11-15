import * as THREE from 'three';

/* Слой кожи Anny (вид «Манекен», только внешний вид; данные и рамки — src/js/09bs-anny.js, AnnySkin). Сетка — в стойке
   манекена, в координатах каталога (см, Y вниз, пол 186): сцена (м, Y вверх) = C·каталог — матрица объекта C (отражение по Y,
   поэтому обход треугольников развёрнут: лицевые стороны и нормали те же, что у процедурной кожи). Скиннинг — на видеокарте:
   двойные кватернионы рамок сегментов кадра (uniform-массив, по два vec4 на рамку), четыре веса на вершину; корректирующие
   формы — морфы three.js (до скиннинга). Кожа прижата к полу (вершины ниже пола — на полу; почему — AnnySkin.skin). Мышечные зоны — цвет вершины (sRGB, альфа — доля зоны): та же раскраска, что у
   областей манекена (цвет по фазам, выбранная область), с тем же собственным свечением. Материал — материал кожи манекена.
   Рамка кадра и тени: сетка в стойке, поэтому её габарит в кадре — по точкам выборки вершин, скиннингом на процессоре
   (userData.boundsPoints: их берёт сцена для рамки камер и для тени). */
const FLOOR=186,BOUNDS_STEP=37,SUP_MAX=4,SUP_LEN=24;
/* Внешний вид кожи (только свет и цвет; форма и проверки — в данных anny.bin):
   ao — затенённость впадин (запечена в стойке, AnnySkin.data.shade — доля открытого неба): [для рассеянного света неба,
        для прямого]; рассеянный — как карта затенения three.js (aoMap), прямой — слабее (впадины глубже, но тень
        ключевого света на теле не рисуется: тело тень не принимает, иначе она перекрывает цвет мышц);
   relief — контраст формы: нормали «с нерезкой маской» (нормаль + relief·(нормаль − сглаженная по relief[1] кольцам)):
        граница грудной, пресс, дельты читаются при той же геометрии и том же матовом материале;
   roughness — шероховатость материала Anny (у манекена 0,62): матовее, без пластикового блика;
   trunks — тон плавок: цвет и доля смешения (по умолчанию выключен — владелец выбрал пах эталона без плавок). Граница —
        линия плавок-брифов (trunkLine), ровная: в шейдере по расстоянию до неё со сглаживанием в пиксель (fwidth).
   Выключенная часть в шейдер не попадает: без плавок атрибут вида вершины — одно число (затенённость), без затенённости и
   плавок его нет совсем (цена растра — как без них). Переопределение для листов — globalThis.ANNY_LOOK (те же ключи). */
export const ANNY_LOOK={ao:[.85,.35],relief:[.6,6],roughness:.72};
const look=()=>({...ANNY_LOOK,...(globalThis.ANNY_LOOK||{})});
/* Линия плавок-брифов в стойке (см над полом, x — влево, z — вперёд; тазобедренные суставы — 89,5 над полом, ±8,8):
   пояс — 96,5 спереди, 97,5 сбоку, 98,5 сзади (≈ 8 см ниже пупка: у ANSUR II пупок — 105,5); вырез ноги — по углу a вокруг
   оси бедра (0 — спереди, +90° — снаружи, −90° — внутри, у промежности): h = 85 + 1,5·cos a + 8·sin a — у промежности 77
   (купол плавок закрыт), спереди 86,5, снаружи 93 (высокий вырез брифов), сзади 83,5 (ягодичная складка). Возвращает
   знаковое расстояние по высоте, см: плюс — внутри плавок. */
export function trunkLine(x,h,z){
 const phi=Math.atan2(x,z),top=97.5-Math.cos(phi);
 const s=x>=0?1:-1,a=Math.atan2((x-8.8*s)*s,z),leg=85+1.5*Math.cos(a)+8*Math.sin(a);
 return Math.min(top-h,h-leg);
}
const TRUNK_FRAMES=new Set(['pelvis','lumbar','thorax','thL','thR']);
/* нормали «с нерезкой маской»: n + k·(n − n̄), n̄ — нормали, усреднённые по соседям rings раз */
function reliefNormals(g,idx,nv,k,rings){
 if(!(k>0))return;
 const n=g.attributes.normal.array,adj=Array.from({length:nv},()=>new Set());
 for(let t=0;t<idx.length;t+=3){const a=idx[t],b=idx[t+1],c=idx[t+2];adj[a].add(b).add(c);adj[b].add(a).add(c);adj[c].add(a).add(b);}
 let s=Float32Array.from(n);
 for(let r=0;r<rings;r++){const o=new Float32Array(s.length);for(let v=0;v<nv;v++){let x=s[v*3],y=s[v*3+1],z=s[v*3+2];for(const u of adj[v]){x+=s[u*3];y+=s[u*3+1];z+=s[u*3+2];}const l=Math.hypot(x,y,z)||1;o[v*3]=x/l;o[v*3+1]=y/l;o[v*3+2]=z/l;}s=o;}
 for(let v=0;v<nv;v++){const x=n[v*3]+k*(n[v*3]-s[v*3]),y=n[v*3+1]+k*(n[v*3+1]-s[v*3+1]),z=n[v*3+2]+k*(n[v*3+2]-s[v*3+2]),l=Math.hypot(x,y,z)||1;n[v*3]=x/l;n[v*3+1]=y/l;n[v*3+2]=z/l;}
 g.attributes.normal.needsUpdate=true;
}
/* нормали форм: форма двигает кожу, а нормаль шейдера — нормаль стойки, повёрнутая скиннингом. Без своей нормали форма,
   выглаживающая складку (подмышка в висе — armsUpTw, руки вверх — armsUp), освещена как прежняя складка: на гладкой
   коже — светлое пятно, похожее на вздутие (с нормалями граней, по самой поверхности, его нет). Сдвиг нормали —
   нормаль стойки с формой минус нормаль стойки, как сдвиг позиций (morphTargetsRelative); нормали — как computeVertexNormals */
function shapeNormals(pos,idx,morphs){
 const vn=P=>{const N=new Float32Array(P.length);
  for(let t=0;t<idx.length;t+=3){const a=idx[t]*3,b=idx[t+1]*3,c=idx[t+2]*3,ux=P[c]-P[b],uy=P[c+1]-P[b+1],uz=P[c+2]-P[b+2],wx=P[a]-P[b],wy=P[a+1]-P[b+1],wz=P[a+2]-P[b+2],
   nx=uy*wz-uz*wy,ny=uz*wx-ux*wz,nz=ux*wy-uy*wx;N[a]+=nx;N[a+1]+=ny;N[a+2]+=nz;N[b]+=nx;N[b+1]+=ny;N[b+2]+=nz;N[c]+=nx;N[c+1]+=ny;N[c+2]+=nz;}
  for(let i=0;i<N.length;i+=3){const l=Math.hypot(N[i],N[i+1],N[i+2])||1;N[i]/=l;N[i+1]/=l;N[i+2]/=l;}return N;};
 const N0=vn(pos),P=new Float32Array(pos.length);
 return morphs.map(m=>{for(let i=0;i<P.length;i++)P[i]=pos[i]+m.array[i];const N=vn(P);for(let i=0;i<N.length;i++)N[i]-=N0[i];return new THREE.BufferAttribute(N,3);});
}
const DQ_PARS=`
uniform vec4 annyDQ[ANNY_FRAMES*2];
#define ANNY_FLOOR ${FLOOR.toFixed(1)}
#define ANNY_SUP ${SUP_MAX}
attribute vec4 annyIndex;
attribute vec4 annyWeight;
/* рамка закрутки плеча (AnnySkin.slotDQ): [ячейка плеча (0–3), его рамка закрутки, доля закрутки в ячейке]; доля 0 — нет.
   Смешанный кватернион ячейки считается один раз на вершину до цикла (в цикле — только подстановка): ветвление и выборки из
   uniform-массива в каждой ячейке стоили растру SwiftShader около 10 % */
attribute vec3 annyRoll;
int annyRollSlot(ivec4 ix,out vec4 mr,out vec4 md){
 mr=vec4(0.);md=vec4(0.);if(annyRoll.z<=0.)return -1;
 int s=int(annyRoll.x+.5),i=ix[s],j=int(annyRoll.y+.5);vec4 ur=annyDQ[i*2],ud=annyDQ[i*2+1],rr=annyDQ[j*2],rd=annyDQ[j*2+1];
 float sg=dot(ur,rr)<0.?-1.:1.;mr=mix(ur,sg*rr,annyRoll.z);md=mix(ud,sg*rd,annyRoll.z);return s;
}
void annyBlend(out vec4 r,out vec4 d){
 ivec4 ix=ivec4(annyIndex+.5);
 vec4 mr,md;int rs=annyRollSlot(ix,mr,md);
 vec4 r0=rs==0?mr:annyDQ[ix.x*2];r=vec4(0.);d=vec4(0.);
 for(int k=0;k<4;k++){
  float w=annyWeight[k];if(w<=0.)continue;
  vec4 qr=annyDQ[ix[k]*2],qd=annyDQ[ix[k]*2+1];
  if(k==rs){qr=mr;qd=md;}
  if(dot(qr,r0)<0.)w=-w;
  r+=w*qr;d+=w*qd;
 }
 float l=length(r);r/=l;d/=l;
}
vec3 annyRotate(vec4 q,vec3 p){return p+2.*cross(q.xyz,cross(q.xyz,p)+q.w*p);}
vec3 annyMove(vec4 r,vec4 d,vec3 p){return annyRotate(r,p)+2.*(r.w*d.xyz-d.w*r.xyz+cross(r.xyz,d.xyz));}
/* опоры (AnnySkin.supports, supportMove — тот же расчёт): кожа части тела контакта у опоры ложится на неё. На опору 6 vec4:
   центр и тип (0 — коробка со скруглением, 1 — цилиндр по оси y), три оси с полуразмерами, [скругление, a, переход, сила],
   [биты рамок части тела (по 19 в числе), пятка: 1000 + порог z в стойке (0 — вся часть тела)]; st — вершина в стойке */
uniform vec4 annySup[ANNY_SUP*6];
uniform int annySupN;
float annySupBit(vec4 m,int i){int c=i/19;float v=c==0?m.x:c==1?m.y:m.z;return float((int(v+.5)>>(i-c*19))&1);}
vec3 annySupport(vec3 p,vec3 st){
 if(annySupN==0)return p;
 ivec4 ix=ivec4(annyIndex+.5);
 for(int k=0;k<ANNY_SUP;k++){
  if(k>=annySupN)break;
  vec4 c0=annySup[k*6],X=annySup[k*6+1],Y=annySup[k*6+2],Z=annySup[k*6+3],pr=annySup[k*6+4],mk=annySup[k*6+5];
  float m=0.;for(int j=0;j<4;j++){float w=annyWeight[j];if(w>0.)m+=w*annySupBit(mk,ix[j]);}
  if(mk.w>0.){float u=clamp((mk.w-1000.+1.-st.z)*.5,0.,1.);m*=u*u*(3.-2.*u);}
  if(m<=0.)continue;
  vec3 d=p-c0.xyz,l=vec3(dot(d,X.xyz),dot(d,Y.xyz),dot(d,Z.xyz)),g;float h;
  if(c0.w<.5){vec3 q=abs(l)-vec3(X.w,Y.w,Z.w)+pr.x,qp=max(q,0.);float lo=length(qp);h=lo+min(max(q.x,max(q.y,q.z)),0.)-pr.x;
   g=lo>0.?qp/lo*sign(l):q.x>=q.y&&q.x>=q.z?vec3(sign(l.x),0.,0.):q.y>=q.z?vec3(0.,sign(l.y),0.):vec3(0.,0.,sign(l.z));}
  else{float rd=length(l.xz);vec2 e=vec2(rd-X.w,abs(l.y)-Y.w),ep=max(e,0.);float lo=length(ep);h=min(max(e.x,e.y),0.)+lo;
   vec3 rv=rd>1e-6?vec3(l.x/rd,0.,l.z/rd):vec3(1.,0.,0.),yv=vec3(0.,sign(l.y),0.);g=lo>0.?(rv*ep.x+yv*ep.y)/lo:e.x>=e.y?rv:yv;}
  float a=pr.y,H=pr.z,b=a+H;if(h<0.||h>=b)continue;
  float t=clamp((h-a)/H,0.,1.),f=h<=a?0.:b*t*t*(3.-2.*t)+H*t*t*(t-1.);
  p+=(X.xyz*g.x+Y.xyz*g.y+Z.xyz*g.z)*((f-h)*m*pr.w);
 }
 return p;
}
#ifdef ANNY_LBS
/* линейное смешение тех же преобразований (только для сравнения на листах: globalThis.ANNY_METHOD = 'lbs') */
vec3 annyLinear(vec3 p,bool dir){
 ivec4 ix=ivec4(annyIndex+.5);vec3 o=vec3(0.);vec4 mr,md;int rs=annyRollSlot(ix,mr,md);
 for(int k=0;k<4;k++){float w=annyWeight[k];if(w<=0.)continue;vec4 r=annyDQ[ix[k]*2],d=annyDQ[ix[k]*2+1];if(k==rs){r=mr;d=md;}o+=w*(dir?annyRotate(r,p):annyMove(r,d,p));}
 return o;
}
#endif
`;
const COLOR_PARS='attribute vec4 annyColor;\nvarying vec4 vAnnyColor;\n',COLOR_OUT='\nvAnnyColor=annyColor;';
/* атрибут вида вершины: n = 2 — затенённость и расстояние до линии плавок, 1 — только затенённость, 0 — нет */
const lookType=n=>n===2?'vec2':'float',LOOK_PARS=n=>n?'attribute '+lookType(n)+' annyLook;\nvarying '+lookType(n)+' vAnnyLook;\n':'',LOOK_OUT=n=>n?'vAnnyLook=annyLook;':'';
function patch(shader,frames,{normals=true,color=false,lookN=0}={}){
 const pars=(color?COLOR_PARS:'')+LOOK_PARS(lookN),out=(color?COLOR_OUT:'')+LOOK_OUT(lookN);
 if(globalThis.ANNY_METHOD==='lbs'){
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\n#define ANNY_LBS\n#define ANNY_FRAMES '+frames+'\n'+DQ_PARS+pars);
  if(normals)shader.vertexShader=shader.vertexShader.replace('#include <skinnormal_vertex>','objectNormal=normalize(annyLinear(objectNormal,true));');
  shader.vertexShader=shader.vertexShader.replace('#include <skinning_vertex>','transformed=annySupport(annyLinear(transformed,false),transformed);transformed.y=min(transformed.y,ANNY_FLOOR);'+out);
  return;
 }
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\n#define ANNY_FRAMES '+frames+'\n'+DQ_PARS+pars);
 if(normals)shader.vertexShader=shader.vertexShader.replace('#include <skinnormal_vertex>','vec4 annyR,annyD;annyBlend(annyR,annyD);objectNormal=annyRotate(annyR,objectNormal);\n#ifdef USE_TANGENT\nobjectTangent=annyRotate(annyR,objectTangent);\n#endif');
 shader.vertexShader=shader.vertexShader.replace('#include <skinning_vertex>',(normals?'':'vec4 annyR,annyD;annyBlend(annyR,annyD);\n')+'transformed=annySupport(annyMove(annyR,annyD,transformed),transformed);transformed.y=min(transformed.y,ANNY_FLOOR);'+out);
}
export function createAnnyLayer(parent,skin){
 const group=new THREE.Group();group.name='anny';group.visible=false;parent.add(group);
 let source=null,mesh=null,material=null,depth=null,uniforms=null,colorAttr=null,lastColors='',boundsIdx=null;
 const glow={value:.28};
 function build(d){
  dispose();
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(d.pos,3));
  /* каталог — зеркальная система: обход треугольников разворачиваем, нормали считаем в ней же */
  const idx=new Uint16Array(d.idx.length);for(let i=0;i<idx.length;i+=3){idx[i]=d.idx[i];idx[i+1]=d.idx[i+2];idx[i+2]=d.idx[i+1];}
  g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();
  const L=look();reliefNormals(g,idx,d.nv,L.relief?.[0]??0,L.relief?.[1]??6);
  const tc=new THREE.Color(L.trunks?.color||'#000'),ta=L.trunks?.alpha||0,aoOn=(L.ao?.[0]||0)>0||(L.ao?.[1]||0)>0,lookN=ta>0?2:aoOn?1:0;
  const shadeOf=lookN===2?'vAnnyLook.x':'vAnnyLook';
  g.setAttribute('annyIndex',new THREE.BufferAttribute(Float32Array.from(d.wi),4));
  g.setAttribute('annyWeight',new THREE.BufferAttribute(d.ww,4));
  /* рамка закрутки плеча: у вершины с ячейкой плеча — [номер ячейки плеча, рамка закрутки, доля] (AnnySkin.rollShare) */
  const roll=new Float32Array(d.nv*3);if(d.roll)for(let v=0;v<d.nv;v++){const k=d.roll.share[v];if(!(k>0))continue;for(let j=0;j<4;j++){const i=d.wi[v*4+j],r=d.roll.map[i];if(r>=0&&d.ww[v*4+j]>0){roll[v*3]=j;roll[v*3+1]=r;roll[v*3+2]=k;break;}}}
  g.setAttribute('annyRoll',new THREE.BufferAttribute(roll,3));
  colorAttr=new THREE.BufferAttribute(new Uint8Array(d.nv*4),4,true);colorAttr.setUsage(THREE.DynamicDrawUsage);g.setAttribute('annyColor',colorAttr);
  /* вид вершины: затенённость впадин (доля открытого неба) и расстояние до линии плавок (см, плюс — внутри; только таз и
     бёдра — кисти и предплечья у бёдер в стойке не красятся) */
  if(lookN){
   const lk=new Float32Array(d.nv*lookN);
   for(let v=0;v<d.nv;v++){lk[v*lookN]=d.shade?d.shade[v]:1;if(lookN===2){const f=d.frames[d.wi[v*4]];lk[v*2+1]=TRUNK_FRAMES.has(f)?Math.max(-8,Math.min(8,trunkLine(d.pos[v*3],FLOOR-d.pos[v*3+1],d.pos[v*3+2]))):-8;}}
   g.setAttribute('annyLook',new THREE.BufferAttribute(lk,lookN));
  }
  if(d.correctives.length){
   g.morphAttributes.position=d.correctives.map(c=>{const a=new Float32Array(d.nv*3);for(let j=0;j<c.n;j++){const v=c.i[j];a[v*3]=c.d[j*3];a[v*3+1]=c.d[j*3+1];a[v*3+2]=c.d[j*3+2];}return new THREE.BufferAttribute(a,3);});
   g.morphTargetsRelative=true;g.morphAttributes.normal=shapeNormals(d.pos,idx,g.morphAttributes.position);
  }
  /* габарит задаём сами (по точкам кадра): сетка в стойке, без него отсечение по пирамиде видимости ошибётся */
  g.boundingSphere=new THREE.Sphere(new THREE.Vector3(),1e3);g.boundingBox=new THREE.Box3(new THREE.Vector3(-1e3,-1e3,-1e3),new THREE.Vector3(1e3,1e3,1e3));
  uniforms={annyDQ:{value:new Float32Array(d.frames.length*8)},annySup:{value:new Float32Array(SUP_MAX*SUP_LEN)},annySupN:{value:0}};
  /* сетка замкнута, лицевая сторона — снаружи: изнанка не рисуется (у материала манекена — обе стороны: у процедурной
     кожи открытые края). Иначе в прорези век видна изнанка их внутренней стороны, и её перевёрнутую нормаль ярко
     освещает контровой свет — «белые глаза»; заодно вдвое меньше работы фрагментам. */
  material=skin.clone();material.name='anny-skin';material.side=THREE.FrontSide;material.roughness=L.roughness??skin.roughness;
  uniforms.annyAO={value:new THREE.Vector2(L.ao?.[0]??0,L.ao?.[1]??0)};uniforms.annyTrunk={value:new THREE.Vector4(tc.r,tc.g,tc.b,ta)};
  material.onBeforeCompile=s=>{
   s.uniforms.annyDQ=uniforms.annyDQ;s.uniforms.annySup=uniforms.annySup;s.uniforms.annySupN=uniforms.annySupN;s.uniforms.annyGlow=glow;s.uniforms.annyAO=uniforms.annyAO;s.uniforms.annyTrunk=uniforms.annyTrunk;patch(s,d.frames.length,{color:true,lookN});
   s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec4 vAnnyColor;\n'+(lookN?'varying '+lookType(lookN)+' vAnnyLook;\n':'')+'uniform float annyGlow;\nuniform vec2 annyAO;\nuniform vec4 annyTrunk;\nvec3 annyLinear(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(.04045,c));}')
    /* плавки — под цветом мышц: активная зона закрашивает и их. Ветвления — только экономия (вне плавок и вне активных зон
       смешение ничего не меняет, а растр на телефоне — работа фрагментов); производная — до ветвления (в нём она не определена) */
    .replace('#include <color_fragment>','#include <color_fragment>\n'+(ta>0?'float annyFw=max(fwidth(vAnnyLook.y)*.75,1e-3);if(vAnnyLook.y>-annyFw)diffuseColor.rgb=mix(diffuseColor.rgb,annyTrunk.rgb,smoothstep(-annyFw,annyFw,vAnnyLook.y)*annyTrunk.a);\n':'')+'vec3 annyZone=vec3(0.);if(vAnnyColor.a>0.){annyZone=annyLinear(vAnnyColor.rgb);diffuseColor.rgb=mix(diffuseColor.rgb,annyZone,vAnnyColor.a);}')
    .replace('#include <aomap_fragment>','#include <aomap_fragment>\n'+(aoOn?'reflectedLight.indirectDiffuse*=mix(1.,'+shadeOf+',annyAO.x);float annyDir=mix(1.,'+shadeOf+',annyAO.y);reflectedLight.directDiffuse*=annyDir;reflectedLight.directSpecular*=annyDir;':''))
    .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=annyZone*annyGlow*vAnnyColor.a;');
  };
  material.customProgramCacheKey=()=>'anny-skin-'+d.frames.length+(ta>0?'-trunks':'')+(aoOn?'-ao':'')+(globalThis.ANNY_METHOD||'');
  /* тень: та же деформация в материале глубины */
  depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});
  depth.onBeforeCompile=s=>{s.uniforms.annyDQ=uniforms.annyDQ;s.uniforms.annySup=uniforms.annySup;s.uniforms.annySupN=uniforms.annySupN;patch(s,d.frames.length,{normals:false});};
  depth.customProgramCacheKey=()=>'anny-depth-'+d.frames.length+(globalThis.ANNY_METHOD||'');
  mesh=new THREE.Mesh(g,material);mesh.name='anny-skin';mesh.customDepthMaterial=depth;mesh.castShadow=true;mesh.receiveShadow=false;mesh.frustumCulled=false;
  mesh.matrixAutoUpdate=false;mesh.matrix.set(.01,0,0,0, 0,-.01,0,FLOOR/100, 0,0,.01,0, 0,0,0,1);
  if(d.correctives.length)mesh.morphTargetInfluences=new Array(d.correctives.length).fill(0);
  group.add(mesh);source=d;lastColors='';
  boundsIdx=[];for(let v=0;v<d.nv;v+=BOUNDS_STEP)boundsIdx.push(v);
 }
 /* кадр: data — данные кадра сцены (поза), look — цвета зон: {on, color, values, sideValues, regions, selected} */
 function update(d,data,look){
  if(source!==d)build(d);
  const A=globalThis.AnnySkin,R=data.pose,S=A.skinMats(R,d),cw=A.correctiveWeights(R,d),DQ=A.dualQuats(S,d.frames.length);
  uniforms.annyDQ.value.set(DQ);
  if(mesh.morphTargetInfluences)cw.forEach((w,i)=>{mesh.morphTargetInfluences[i]=w;});
  /* опоры кадра: заявленные контакты позы с видимыми деталями сцены */
  const sup=A.supports?A.supports(R,d,data.props||null,cw,{S,DQ}):null;
  if(sup){uniforms.annySup.value.set(sup.u);uniforms.annySupN.value=sup.n;}else uniforms.annySupN.value=0;
  paint(d,look);
  /* точки рамки — каталог → сцена */
  const P=A.skin(R,{d,only:boundsIdx,corr:cw,mats:{S,DQ},sup}),pts=[];for(let k=0;k<boundsIdx.length;k++)pts.push(new THREE.Vector3(P[k*3]/100,(FLOOR-P[k*3+1])/100,P[k*3+2]/100));
  mesh.userData.boundsPoints=pts;
  group.visible=true;return mesh;
 }
 /* цвет зон: тот же, что у областей манекена в scene.mjs (активная — цвет нагрузки, иначе — цвет кожи) */
 function paint(d,look){
  const reg=look?.on?globalThis.AnnySkin.regions(d):null,ids=reg?reg.ids:[];
  const tint=[];let key='';
  for(const id of ids)for(const side of ['L','R']){
   const r=look.regions?.[id],vis=!!r?.visible,active=vis&&(!look.selected||look.selected==='all'||look.selected===id||look.selected===r.parent);
   /* значение 0 — нерабочая сторона или часть с долей 0: цвет кожи, как у мышц вне упражнения */
   const v=look.sideValues?.[side]?.[id]??look.values?.[id]??.28,c=active&&v>0?look.color(v):null;tint.push(c);key+=(c||'-')+'|';
  }
  if(key===lastColors)return;lastColors=key;
  /* в атрибуте — sRGB (8 бит без полос в тенях), в шейдере — в линейные, как у цвета материала областей манекена */
  const col=new THREE.Color(),s={},rgba=tint.map(c=>{if(!c)return[0,0,0,0];col.set(c).getRGB(s,THREE.SRGBColorSpace);return[Math.round(s.r*255),Math.round(s.g*255),Math.round(s.b*255),255];});
  const a=colorAttr.array;a.fill(0);
  if(reg)for(let v=0;v<d.nv;v++){const r=reg.rid[v];if(!r)continue;const q=rgba[(r-1)*2+d.region.side[v]];if(!q[3])continue;a[v*4]=q[0];a[v*4+1]=q[1];a[v*4+2]=q[2];a[v*4+3]=255;}
  colorAttr.needsUpdate=true;
 }
 function hide(){group.visible=false;}
 function dispose(){if(mesh){mesh.geometry.dispose();group.remove(mesh);}material?.dispose();depth?.dispose();mesh=material=depth=null;source=null;}
 return{group,update,hide,dispose,setGlow(v){glow.value=v;},get mesh(){return mesh;}};
}
