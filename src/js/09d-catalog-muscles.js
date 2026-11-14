/* Anatomical parts and teaching regions are deliberately distinct. Deep muscles
   have an entry but no patch painted on top of the skin. Colour curves are authored
   illustrations; identical head profiles do not pretend to measure head-specific EMG. */
const MUSCLE_REGIONS={
 chest:[['pec_clavicular','Ключичная часть грудной','anatomical'],['pec_sternal','Средняя область грудной','teaching'],['pec_costal','Нижняя область грудной','teaching'],['pec_minor','Малая грудная · глубже','deep']],
 triceps:[['tri_long','Длинная головка трицепса','anatomical'],['tri_lateral','Латеральная головка трицепса','anatomical'],['tri_medial','Медиальная головка трицепса · глубже','deep']],
 biceps:[['bi_long','Длинная головка бицепса','anatomical'],['bi_short','Короткая головка бицепса','anatomical'],['brachialis','Плечевая мышца · глубже','deep']],
 delt_f:[['delt_f','Передняя часть дельтовидной','anatomical']],delt_s:[['delt_s','Средняя часть дельтовидной','anatomical']],delt_r:[['delt_r','Задняя часть дельтовидной','anatomical']],
 quads:[['quad_rectus','Прямая мышца бедра','anatomical'],['quad_lateral','Латеральная широкая мышца','anatomical'],['quad_medial','Медиальная широкая мышца','anatomical'],['quad_deep','Промежуточная широкая · глубже','deep']],
 hams:[['ham_lateral','Двуглавая мышца бедра, длинная головка','anatomical'],['ham_medial','Медиальная область заднего бедра','teaching'],['ham_short','Короткая головка двуглавой бедра · глубже','deep']],
 calves:[['calf_medial','Медиальная головка икроножной','anatomical'],['calf_lateral','Латеральная головка икроножной','anatomical'],['soleus','Камбаловидная · глубже','deep']],
 glutes:[['glute_max','Большая ягодичная','anatomical'],['glute_lateral','Боковая ягодичная область','teaching']],
 traps:[['trap_upper','Верхняя область трапециевидной','teaching'],['trap_mid','Средняя область трапециевидной','teaching'],['trap_lower','Нижняя область трапециевидной','teaching'],['lev_scap','Поднимающая лопатку · глубже','deep']],
 lats:[['lats','Широчайшие · общий профиль','group']],midback:[['midback','Межлопаточная область · общий профиль','group']],
 lowback:[['lowback','Разгибатели спины · общий профиль','group']],abs:[['abs','Прямая мышца живота','anatomical']],
 obliques:[['obl_ext','Наружная косая мышца живота','anatomical'],['obl_int','Внутренняя косая мышца живота · глубже','deep']],
 forearms:[['forearm_flex','Сгибатели запястья и пальцев','anatomical'],['forearm_ext','Разгибатели запястья и пальцев','anatomical'],['brachiorad','Плечелучевая мышца','anatomical']],
 adductors:[['adductors','Приводящие мышцы бедра · общий профиль','group']],hipflex:[['hipflex','Подвздошно-поясничная · глубже','deep']],
 serratus:[['serratus','Передняя зубчатая','anatomical']],
 cuff:[['cuff_ext','Подостная и малая круглая · глубже','deep'],['cuff_int','Подлопаточная · глубже','deep'],['cuff_sup','Надостная · глубже','deep']]
};
const REGION_ANATOMY_SOURCES=[['Анатомия мышц плечевого пояса — OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs'],['Анатомия мышц ног — OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs']];
function motionProfile(anim){return anim.catalogProfile||anim.muscleProfile;}
/* ключичная часть большой грудной сгибает плечо — ярче в наклонных жимах и подъёме перед собой; в тягах сверху
   (плечо разгибается и приводится) работают грудинно-рёберные части, ключичная почти молчит */
const INCLINE_CHEST=new Set(['dbincline','smithincline','inclinebb','declinepush','cablelowfly','frontraise']);
const PULL_CHEST=new Set(['latpull','latpullv','latpulluh','bandlatpull','assistpull','pullup','chinup','pullover']);
const LOWER_CHEST=new Set(['declinebb','dip','assistdip']);
/* Стороны упражнений на одну сторону: upper — руки и плечевой пояс, lower — ноги, regions — отдельные области корпуса
   (косые мышцы: наклон в сторону — одна сторона целиком, поворот — наружная косая одной стороны с внутренней другой).
   Этап А аудита анатомии 4.53.0 (стороны — по длинам мышц в позе, tools/muscles/phase.js):
   - копенгагенская планка: рабочая — верхняя нога на скамье (левая; её приводящие укорачиваются, когда таз поднимается,
     и держат тело — Serner и др., 2014; Ishøi и др., 2016); у нижней ноги в позе манекена бедро при подъёме отводится
     (к скамье она не подтягивается — поза на ревью), её приводящие удлиняются — цвет покоя;
   - наклон в сторону: гантель в правой руке, работают косые левой стороны — сдерживают наклон и возвращают корпус
     (OpenStax A&P 2e, 11.4: наклон корпуса в сторону — косые своей стороны);
   - «дровосек» сверху вниз: корпус поворачивается вправо — наружная косая левой стороны и внутренняя правой (Gray's
     Anatomy; OpenStax A&P 2e, 11.4: наружная косая поворачивает корпус в противоположную сторону, внутренняя — в свою);
   - «мельница» с гирей в левой руке: внизу грудь развёрнута влево, к гире; на подъёме корпус разворачивается вправо —
     наружная косая левой стороны и внутренняя правой (то же правило; по длинам мышц они укорачиваются). */
const CATALOG_LATERALITY={dbrow:{upper:'L'},kbsnatch:{upper:'L'},kbsllift:{lower:'L'},kbwindmill:{upper:'L',regions:{obl_ext:'L',obl_int:'R'}},kbswing1:{upper:'L'},kbclean:{upper:'L'},kbpress:{upper:'L'},kbrow:{upper:'L'},kbfloorpress:{upper:'L'},cablelat:{upper:'R'},concentration:{upper:'L'},kickback:{upper:'L'},archer:{upper:'R'},bulgarian:{lower:'L'},stepup:{lower:'L'},lunge:{lower:'L'},revlunge:{lower:'L'},sidelunge:{lower:'R'},pistolbox:{lower:'L'},sllift:{lower:'L'},glutebridge1:{lower:'L'},glutekick:{lower:'L'},cablekickback:{lower:'L'},calf1:{lower:'L'},cableadduct:{lower:'L'},bandadduct:{lower:'L'},bandlegext:{lower:'L'},cableextrot:{upper:'R'},bandextrot:{upper:'R'},
 copenhagen:{lower:'L'},copenhagenknee:{lower:'L'},sidebend:{regions:{obl_ext:'L',obl_int:'L'}},cablewood:{regions:{obl_ext:'L',obl_int:'R'}}};
function catalogSideValues(profile,values){
 const sides={L:{...values},R:{...values}},lower=new Set(['quads','hams','calves','glutes','adductors','hipflex']),lat=profile.laterality||{};
 for(const[part,active]of Object.entries(lat))if(part!=='regions')for(const[id,r]of Object.entries(profile.regions)){
  const applies=part==='lower'?lower.has(r.parent):!lower.has(r.parent)&&!['abs','obliques','lowback','traps'].includes(r.parent);
  if(applies)sides[active==='L'?'R':'L'][id]=.28;
 }
 for(const[id,active]of Object.entries(lat.regions||{}))if(profile.regions[id])sides[active==='L'?'R':'L'][id]=.28;
 return sides;
}
/* Учебные акценты частей мышц (этап А аудита анатомии 4.53.0: цвет по фазам против длины мышц — tools/muscles/phase.js,
   проверка — tools/muscle-phase.test.js): доля значения группы у области в упражнении; без записи — 1. */
const SQUAT_LIKE=new Set('squat goblet airsquat smithsquat hacksquat legpress legpresshigh legpresslow lunge revlunge bulgarian stepup pistolbox sidelunge wallsit jumpsquat thruster kbfrontsquat'.split(' '));
const PULL_DOWN=new Set(['latpull','latpullv','latpulluh','bandlatpull','assistpull','pullup','chinup']);
const EXT_ROT=new Set(['cableextrot','bandextrot']);
const REGION_FACTORS={
 /* прямая бедра в приседаниях, выпадах и жиме ногами работает слабее широких: двусуставная, в разгибании колена с
    разгибанием бедра длина почти не меняется (ЭМГ: Escamilla и др., 1998) */
 quad_rectus:id=>SQUAT_LIKE.has(id)?.65:1,
 /* короткая головка двуглавой бедра — односуставной сгибатель колена: разгибание бедра её не нагружает (фМРТ: Bourne и др.,
    2017), в приседаниях и тягах она удлиняется */
 ham_short:id=>id==='legcurl'||id==='nordic'?1:.3,
 /* шраги поднимают лопатку верхняя часть трапециевидной и поднимающая лопатку, нижняя часть — опускатель (Neumann, 2017;
    ЭМГ — Pizzari и др., 2014); в тягах сверху и подтягиваниях лопатку опускает нижняя часть (ЭМГ — Youdas и др., 2010),
    верхняя при этом удлиняется */
 trap_upper:id=>PULL_DOWN.has(id)?.35:1,
 trap_mid:id=>id==='shrug'?.6:PULL_DOWN.has(id)?.8:1,
 trap_lower:id=>id==='shrug'?.25:1,
 lev_scap:id=>id==='shrug'?1:.5,
 /* предплечье: сгибание запястий — сгибатели, разгибатели растягиваются, плечелучевая запястье не пересекает (OpenStax A&P 2e,
    11.5); «молот» — плечелучевая сгибает локоть (ЭМГ — Boland и др., 2008), мышцы кисти держат рукоять */
 forearm_flex:id=>id==='hammer'?.6:1,
 /* группа «Бицепс» на манекене — сгибатели локтя плеча: двуглавая и под ней плечевая (часть BRA данных мышц, tools/muscles/pack.js).
    Плечевая сгибает локоть при любом положении предплечья (ЭМГ — Basmajian и Latif, 1957) — её доля 1 во всех упражнениях;
    в нейтральном хвате («молот») двуглавая работает слабее, чем в хвате снизу, а плечелучевая — сильнее (ЭМГ — Kleiber и др.,
    2015): у головок двуглавой в «молоте» — 0,8 */
 bi_long:id=>id==='hammer'?.8:1,
 bi_short:id=>id==='hammer'?.8:1,
 forearm_ext:id=>id==='wristcurl'?.3:id==='hammer'?.6:1,
 brachiorad:id=>id==='wristcurl'?.3:1,
 /* манжета: наружу плечо поворачивают подостная и малая круглая, надостная помогает (ЭМГ — Reinold и др., 2004),
    подлопаточная — внутренний ротатор (OpenStax A&P 2e, 11.5) и растягивается */
 cuff_int:id=>EXT_ROT.has(id)?.25:id==='ytw'?.3:1,
 cuff_sup:id=>EXT_ROT.has(id)?.6:id==='ytw'?.9:1,
 /* малая грудная плечо не сгибает — опускает и выводит вперёд лопатку (OpenStax A&P 2e, 11.5): в подъёме рук вперёд
    лопатка поворачивается вверх и малая грудная растягивается; руку поднимает ключичная часть большой грудной */
 pec_minor:id=>id==='frontraise'?.3:1
};
/* Источники акцентов — к источникам упражнения в разборе (тем, чьи области меняются) */
const REGION_SOURCES={
 rectus:['Широкие и прямая мышцы бедра в приседаниях и жиме ногами: замеры активности мышц — Escamilla и др., 1998','https://doi.org/10.1097/00005768-199804000-00014'],
 hamShort:['Короткая головка двуглавой бедра в разгибании бедра: фМРТ — Bourne и др., 2017','https://doi.org/10.1136/bjsports-2015-095739'],
 shrug:['Трапециевидная в шрагах: замеры активности мышц — Pizzari и др., 2014','https://doi.org/10.1016/j.clinbiomech.2013.11.011'],
 pull:['Нижняя часть трапециевидной в подтягиваниях: замеры активности мышц — Youdas и др., 2010','https://doi.org/10.1519/JSC.0b013e3181f1598c'],
 brd:['Плечелучевая в сгибании локтя: замеры активности мышц — Boland и др., 2008','https://doi.org/10.1016/j.jhsa.2008.07.019'],
 bra:['Плечевая мышца сгибает локоть при любом положении предплечья: замеры активности мышц — Basmajian и Latif, 1957','https://pubmed.ncbi.nlm.nih.gov/13475410/'],
 grip:['Двуглавая и плечелучевая при хвате снизу, нейтральном и сверху: замеры активности мышц — Kleiber и др., 2015','https://doi.org/10.3389/fphys.2015.00215'],
 cuff:['Мышцы манжеты и дельтовидная в упражнениях на наружную ротацию: замеры активности мышц — Reinold и др., 2004','https://doi.org/10.2519/jospt.2004.34.7.385']
};
const regionSources=(id,muscles)=>[
 ...(SQUAT_LIKE.has(id)&&muscles.quads?[REGION_SOURCES.rectus]:[]),...(muscles.hams&&id!=='legcurl'&&id!=='nordic'?[REGION_SOURCES.hamShort]:[]),
 ...(id==='shrug'?[REGION_SOURCES.shrug]:[]),...(PULL_DOWN.has(id)?[REGION_SOURCES.pull]:[]),...(id==='hammer'?[REGION_SOURCES.brd,REGION_SOURCES.bra,REGION_SOURCES.grip]:[]),
 ...(EXT_ROT.has(id)||id==='ytw'?[REGION_SOURCES.cuff]:[])];
/* Группы, которых нет в составе упражнения, но которые по ЭМГ участвуют: нижняя часть трапециевидной опускает лопатку в тягах
   сверху и подтягиваниях (Youdas и др., 2010) — в профиле как вспомогательная, в составе упражнения (pri/sec) не меняется */
const PROFILE_EXTRA={traps:PULL_DOWN};
for(const ex of EX){
 const base=ex.anim.muscleProfile,hold=ex.anim.hold,cyclic=ex.g==='cardio'||!!ex.kind,muscles=base?JSON.parse(JSON.stringify(base.muscles)):{};
 const extra=Object.entries(PROFILE_EXTRA).filter(([id,set])=>set.has(ex.id)&&!ex.pri.includes(id)&&!ex.sec.includes(id)).map(([id])=>[id,'support']);
 for(const[id,role]of [...ex.pri.map(id=>[id,'primary']),...ex.sec.filter(id=>!ex.pri.includes(id)).map(id=>[id,'support']),...extra])if(!muscles[id]){
  const stabilizer=['abs','obliques','lowback','forearms','cuff'].includes(id)&&role!=='primary';
  const start=role==='primary'?.42:.30,end=role==='primary'?.62:.44;
  const c=hold?[.58,.58,.58]:stabilizer?[.34,.37,.34]:[start,role==='primary'?.83:.60,end];
  muscles[id]={role:stabilizer?'stabilizer':role,concentric:c,eccentric:hold?[...c]:stabilizer?[...c]:[start,role==='primary'?.62:.46,end]};
 }
 const regions={};
 for(const[parent,m]of Object.entries(muscles)){
  const factors=MUSCLE_REGIONS[parent].map(([id])=>REGION_FACTORS[id]?REGION_FACTORS[id](ex.id):parent==='chest'?(INCLINE_CHEST.has(ex.id)?{pec_clavicular:1,pec_sternal:.80,pec_costal:.68}[id]:LOWER_CHEST.has(ex.id)?{pec_clavicular:.70,pec_sternal:.90,pec_costal:1}[id]:PULL_CHEST.has(ex.id)?{pec_clavicular:.35,pec_sternal:.90,pec_costal:1}[id]:{pec_clavicular:.80,pec_sternal:1,pec_costal:.88}[id]):1);
  /* области группы с разной долей — учебный региональный акцент, иначе общий профиль группы */
  const basis=factors.some(f=>f!==factors[0])?'illustrative-regional':'shared-group';
  MUSCLE_REGIONS[parent].forEach(([id,label,kind],i)=>{regions[id]={parent,label,kind,role:m.role,factor:factors[i],visible:kind!=='deep',profileBasis:basis};});
 }
 const names=ex.pri.map(id=>MUSCLE_NAMES[id]).join(', ');
 const notes=base?base.notes:{concentric:hold?'Удержание: мышцы сохраняют положение.':cyclic?'Движение по кругу: цвет примерно показывает, какие мышцы работают сильнее.':names+' участвуют в рабочей фазе.',eccentric:cyclic?'Дальше по кругу: участие мышц меняется плавно.':'Мышцы контролируют возврат.',end:'Конечная точка: сохраняйте контроль и опору.',start:'Исходное положение: подготовьтесь к следующему повторению.'};
 ex.anim.catalogProfile={curveBasis:'illustrative',muscles,regions,notes,pair:ex.pri.some(id=>['lats','midback','lowback','glutes','hams','traps'].includes(id))?'back':'above',sources:[...(base?.sources||[]),...regionSources(ex.id,muscles),...REGION_ANATOMY_SOURCES],cyclic,hold,laterality:CATALOG_LATERALITY[ex.id]};
}
/* Мышечные зоны на манекене: те же учебные области, но на поверхности нового тела.
   Корпус: h — высота вдоль оси корпуса от середины тазобедренных суставов, угол от передней линии к боку и спине.
   Конечности: t — доля сегмента, угол от передней поверхности к латеральной. Дельты лежат на «шапке» плеча. */
/* нижняя область трапециевидной — между разгибателями спины (до 24) и межлопаточной областью (от 33), медиальнее
   широчайших: восходящая часть идёт от остистых отростков Th6–Th12 к основанию ости лопатки (OpenStax A&P 2e, 11.5) */
const MANNEQUIN_TORSO_PATCHES=[['pec_clavicular',43,51.8,.06,1.12],['pec_sternal',34,43,.06,1.22],['pec_costal',29,34,.08,1.02],['abs',3,29,.04,.5],['obl_ext',3,28,.56,1.36],
 ['lats',13,40.2,1.52,2.62],['serratus',28,39,1.24,1.5],['midback',33,51.8,2.62,3.1],['lowback',3,24,2.7,3.1],['glute_max',-5.3,4,1.72,3.1],['glute_lateral',-3.5,7,1.16,1.7],['trap_upper',50.8,59.8,2.05,3.1],['trap_mid',40.2,50.8,2.3,2.68],
 ['trap_lower',24,33,2.62,3.1]];
const MANNEQUIN_LIMB_PATCHES={
 ua:[['bi_long',.33,.84,.05,.8],['bi_short',.33,.84,-.8,-.05],['tri_long',.3,.86,2.5,3.9],['tri_lateral',.3,.85,1.7,2.45]],
 /* предплечье (угол 0 — ладонная сторона, +π/2 — лучевая, Mannequin.limbAxes): сгибатели — ладонная и локтевая стороны,
    плечелучевая — лучевая сторона верхних двух третей, разгибатели — тыльная сторона (OpenStax A&P 2e, 11.5) */
 fa:[['forearm_flex',.12,.76,-1.9,.7],['brachiorad',.05,.62,.75,1.65],['forearm_ext',.12,.76,1.7,4.35]],
 th:[['quad_rectus',.15,.8,-.44,.44],['quad_lateral',.12,.82,.48,1.48],['quad_medial',.44,.91,-1.38,-.48],['ham_lateral',.16,.82,1.67,2.71],['ham_medial',.18,.84,2.77,4.45],
  /* приводящие: внутренняя поверхность бедра — широко вверху (длинная, короткая, большая приводящие), узко ниже, до колена (тонкая, большая) */
  ['adductors',.04,.42,-1.8,-.5],['adductors',.42,.86,-1.8,-1.42]],
 sk:[['calf_lateral',.1,.56,2.05,3.12],['calf_medial',.1,.56,3.16,4.22]]
};
const MANNEQUIN_DELTS=[['delt_f',-.75,.75],['delt_s',.8,1.75],['delt_r',1.8,2.75]];
function mannequinMuscleSurfaces(R,profile,{coarse=false}={}){
 const faces=[],V=Mannequin.V,lift=.25;
 /* row(u) возвращает точку ряда (v, e): сечение ряда считается один раз — и для вершин, и для центров граней */
 const grid=(id,side,rows,cols,row)=>{
  if(!profile.regions[id]?.visible)return;
  const P=[];for(let r=0;r<=rows;r++){const at=row(r/rows);P.push([]);for(let c=0;c<=cols;c++)P[r].push(at(c/cols,lift));}
  for(let r=0;r<rows;r++){const at=row((r+.5)/rows);for(let c=0;c<cols;c++){
   const pts=[P[r][c],P[r][c+1],P[r+1][c+1],P[r+1][c]],mid=at((c+.5)/cols,0),out=at((c+.5)/cols,1);
   faces.push({id,parent:profile.regions[id].parent,side,points:pts,normal:V.unit(V.sub(out,mid)),anchor:mid});
  }}
 };
 const step=coarse?2:1;
 for(const side of ['L','R']){
  for(const[id,h0,h1,a0,a1]of MANNEQUIN_TORSO_PATCHES)grid(id,side,Math.max(1,Math.round((h1-h0)/(2.5*step))),Math.max(2,Math.round((a1-a0)/(.13*step))),u=>{const at=Mannequin.torsoRow(R,h0+(h1-h0)*u,side);return(v,e)=>at(a0+(a1-a0)*v,e);});
  for(const[kind,list]of Object.entries(MANNEQUIN_LIMB_PATCHES))for(const[id,t0,t1,a0,a1]of list)
   grid(id,side,Math.max(1,Math.round((t1-t0)/(.06*step))),Math.max(2,Math.round((a1-a0)/(.2*step))),u=>{const at=Mannequin.limbRow(R,kind,side,t0+(t1-t0)*u);return(v,e)=>at(a0+(a1-a0)*v,e);});
  /* дельтовидная: сектор «шапки» плечевого сустава, от верха вниз на ~95° */
  const ua=R.frames['ua'+side],g=side==='L'?1:-1,cap=V.add(V.add(R['sh'+side],ua.y,Mannequin.SH_CAP[0]),ua.x,g*Mannequin.SH_CAP[1]),lat=V.scale(ua.x,g),r=Mannequin.CAPS.sh;
  for(const[id,a0,a1]of MANNEQUIN_DELTS)grid(id,side,coarse?3:5,coarse?3:6,u=>(v,e)=>{
   const polar=(.18+.85*u)*Math.PI/2*1.05,az=a0+(a1-a0)*v,dir=V.add(V.add(V.scale(ua.y,Math.cos(polar)),ua.z,Math.sin(polar)*Math.cos(az)),lat,Math.sin(polar)*Math.sin(az));
   return V.add(cap,dir,r+e);
  });
 }
 return faces;
}
/* Область мышцы в точке процедурной кожи по её адресу — то же правило, что у областей манекена (mannequinMuscleSurfaces):
   part 'torso' (a1 — высота h, a2 — угол сечения), 'ua'/'fa'/'th'/'sk' (a1 — доля t, a2 — угол), 'delt' (a1 — полярный угол
   на «шапке» плеча, a2 — азимут). По нему кожа Anny (09bs-anny.js) красит свои вершины: адрес вершины — на процедурной коже
   стойки (tools/anny-look/build.py). Пустая строка — вне областей. */
const inArc=(a,a0,a1)=>{for(const k of [0,1,-1])if(a+k*2*Math.PI>=a0&&a+k*2*Math.PI<=a1)return true;return false;};
function mannequinRegionOf(part,side,a1,a2){
 if(part==='torso'){for(const[id,h0,h1,b0,b1]of MANNEQUIN_TORSO_PATCHES)if(a1>=h0&&a1<=h1&&a2>=b0&&a2<=b1)return id;return '';}
 if(part==='delt'){const polar=a1/(Math.PI/2*1.05),u=(polar-.18)/.85;if(u<0||u>1)return '';for(const[id,b0,b1]of MANNEQUIN_DELTS)if(inArc(a2,b0,b1))return id;return '';}
 for(const[id,t0,t1,b0,b1]of MANNEQUIN_LIMB_PATCHES[part]||[])if(a1>=t0&&a1<=t1&&inArc(a2,b0,b1))return id;
 return '';
}
/* анимация каталога под инвентарь показа: если хват зависит от необязательного снаряда (catalogVariants), берётся его поза —
   выбор тот же, что у видимости деталей (GymEquipment.variantOf); копия запоминается, чтобы кеши фигуры не путались */
function catalogAnimFor(anim,has){
 const vs=anim&&anim.catalogVariants;if(!vs)return anim;
 const v=Object.keys(vs).find(k=>!has||has(k));if(!v)return anim;
 const memo=anim.catalogVariantAnims||(anim.catalogVariantAnims={});
 return memo[v]||(memo[v]={...anim,catalogRig:vs[v],catalogVariants:null,catalogVariantAnims:null,catalogVariant:v});
}
function catalogFigureAnim(anim){
 return {...anim,rig3d:anim.catalogRig,muscleProfile:anim.catalogProfile,camera:'above',catalogRig:null};
}
/* lean — для вида «Анатомия»/«Скелет»: области манекена скрыты, их поверхности не нужны; phase и poseKey (функция позы — своя у
   каждого варианта инвентаря, catalogAnimFor) — память кожи по фазе в слое мышц (src/volume/muscles.mjs) */
/* сетка процедурной кожи (body) и области мышц на ней (surfaces) считаются по первому обращению: с кожей Anny (вид «Манекен»)
   сцена их не берёт (src/volume/scene.mjs) — кадр без них дешевле */
function catalogVolumeData(anim,t,index,has,coarse=false,lean=false){
 const R=anim.catalogRig(t),state=muscleFrame(anim,t,index),profile=motionProfile(anim);
 let body=null,surfaces=lean?[]:null;
 return{exerciseId:anim.catalogId,phase:t,poseKey:anim.catalogRig,pose:R,get body(){return body||(body=Mannequin.bodyData(R));},stress:jointStressPoints(anim,R,t,index),get surfaces(){return surfaces||(surfaces=mannequinMuscleSurfaces(R,profile,{coarse}));},values:state.values,sideValues:catalogSideValues(profile,state.values),regions:profile.regions,props:R.props.filter(s=>GymEquipment.visible(s,has))};
}
