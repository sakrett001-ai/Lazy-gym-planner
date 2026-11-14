/* ---------- Проигрыватель движений: карточки и увеличенный разбор ---------- */
let figs = [], rafId = 0, io = null;
const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const motionPrefs = (() => {try {return Object.assign({speed:.5,joints:true,trace:false,vectors:false,muscles:true,view:'anatomy'},JSON.parse(localStorage.getItem('podhod.motion.v2') || '{}'));}catch(e){return {speed:.5,joints:true,trace:false,vectors:false,muscles:true,view:'anatomy'};}})();
/* с 4.29.0 векторы движения по умолчанию выключены (мешали разглядывать технику); сохранённое «включено» прежних версий
   было значением по умолчанию — выключаем один раз, дальше выбор человека запоминается как раньше */
if (motionPrefs.vectorsV !== 2) { motionPrefs.vectors = false; motionPrefs.vectorsV = 2; try { localStorage.setItem('podhod.motion.v2', JSON.stringify(motionPrefs)); } catch (e) {} }
if (![.25,.5,1].includes(+motionPrefs.speed)) motionPrefs.speed = .5;
if(typeof motionPrefs.muscles!=='boolean')motionPrefs.muscles=true;
if(typeof motionPrefs.stress!=='boolean')motionPrefs.stress=true;
/* с 4.30.0 основной вид разбора — «Анатомия» (кости и мышцы в почти невидимом силуэте); прежние флажки «Скелет» и
   «Анатомия мышц» заменены выбором вида — один раз ставим анатомию, дальше выбор человека запоминается */
if (motionPrefs.viewV !== 1) { motionPrefs.view = 'anatomy'; motionPrefs.viewV = 1; delete motionPrefs.skeleton; delete motionPrefs.anatomy; try { localStorage.setItem('podhod.motion.v2', JSON.stringify(motionPrefs)); } catch (e) {} }
let detailMotion = null, detailReturn = null, lastMotionNow = null;
function saveMotionPrefs() {try {localStorage.setItem('podhod.motion.v2',JSON.stringify(motionPrefs));}catch(e){}}
function motionDurations(it) {
  const a = it.ex.anim;
  if (a.timing) return a.timing.map(x=>x*1000);
  if (a.hold) return [3000,0,3000,0];
  if (a.period || it.ex.kind || it.ex.g === 'cardio') {const p = a.period || 3200;return [p*.45,p*.05,p*.45,p*.05];}
  const parsed = String(it.rx.tempo || '3-0-1-0').split('-').map(x=>x==='X'?.6:Number(x));
  const q = parsed.length===4 && parsed.every(Number.isFinite) ? parsed : [3,0,1,0];
  return (a.eccFirst ? q : [q[2],q[3],q[0],q[1]]).map(x=>Math.max(0,x)*1000);
}
function motionFrame(F, clock=F.clock) {
  const d = F.durations, total = d.reduce((a,b)=>a+b,0) || 4000;
  let x = ((clock%total)+total)%total, index = 0;
  while (index<3 && x>=d[index]) {x-=d[index];index++;}
  const q = d[index] ? Math.min(1,x/d[index]) : 0;
  const eased = .5-.5*Math.cos(Math.PI*q);
  let t = index===0 ? eased : index===1 ? 1 : index===2 ? 1-eased : 0;
  if (F.it.ex.anim.hold) t=0;
  /* замкнутый цикл (педали, бег, «велосипед»): фаза идёт по кругу без возврата назад */
  if (F.it.ex.anim.loop) {const p=((clock%total)+total)%total/total;t=p;index=p<.5?0:2;}
  /* статодинамика: только рабочая часть амплитуды, без выпрямления и без провала */
  const part=F.it.rx&&F.it.rx.partial;if(part&&!F.it.ex.anim.loop&&!F.it.ex.anim.hold)t=part[0]+(part[1]-part[0])*t;
  const a = F.it.ex.anim;
  let labels = a.eccFirst ? ['Опускание','Нижняя точка','Подъём','Верхняя точка'] : ['Рабочая фаза','Конечная точка','Возврат','Исходное положение'];
  if (F.it.ex.id === 'kbswing' || F.it.ex.id === 'kbswing1') labels=['Мах вперёд','Верхняя точка','Замах назад','Исходное положение'];
  /* скандинавские сгибания: t 0→1 — толчок руками и возврат вверх, главная работа бёдер — медленное опускание 1→0
     (уступающая; профиль мышц — 09b-muscle-profiles.js) */
  if (F.it.ex.id === 'nordic') labels=['Подъём','Верхняя точка','Опускание','Нижняя точка'];
  if (F.it.ex.id === 'kbsnatch') labels=['Рывок','Фиксация над головой','Сброс в замах','Замах'];
  if (F.it.ex.id === 'kbtgu') labels=['Подъём с пола','Стоя','Опускание на пол','Лёжа'];
  if (F.it.ex.id === 'kbhalo') labels=['Вокруг головы вправо','За головой','Вокруг головы влево','Перед грудью'];
  if (F.it.ex.id === 'kbclean') labels=['Взятие на грудь','Стойка','Сброс в замах','Замах'];
  if (F.it.ex.id === 'deadlift' || F.it.ex.id === 'kbdeadlift') labels=['Подъём','Верхняя точка','Опускание','Исходное положение'];
  return {t,index,label:a.hold?'Удержание':labels[index],cue:a.hold?a.cues[0]:a.cues[(index<2)!==!!a.eccFirst?0:1],progress:((clock%total)+total)%total/total,total};
}
/* Часы рисунка карточки — по сетке ≈30 кадров в секунду, целое число кадров на повторение: каждый круг проходит те же
   фазы, и готовые кадры берутся из памяти (FIGURE_FRAMES, 07-rigs-core.js). Кадр отстаёт от точного времени
   не больше чем на полкадра (≤17 мс); сами часы идут без округления. */
const CARD_GRID_MS=1000/30;
function cardClock(F){
  const total=F.durations.reduce((a,b)=>a+b,0)||4000,n=Math.max(1,Math.round(total/CARD_GRID_MS)),step=total/n;
  return (((Math.round(F.clock/step))%n)+n)%n*step;
}
function paintMotion(F, detailed=false, svgOnly=false) {
  const m = motionFrame(F, detailed ? F.clock : cardClock(F));
  /* карточка в «Анатомии» — кадр общего рендерера в её холст; не вышло (нет контекста) — SVG-манекен */
  if (detailed || svgOnly || !F.card || !cardAnatomyLive(F) || !paintCardAnatomy(F,m)) {F.f.at(m.t,m);if(F.extra)F.extra.at(m.t,m);}
  if (!detailed) {
    const cap = F.btn.closest('.motion-tile').querySelector('.motion-caption');
    if (cap && cap.textContent!==m.label) cap.textContent=m.label;
    return;
  }
  $('#mv-phase').textContent=m.label; $('#mv-cue').textContent=m.cue;
  $('#mv-progress').value=String(Math.round(m.progress*1000));
  $('#mv-progress').setAttribute('aria-valuetext',`${m.label}, ${Math.round(m.progress*100)}% повторения`);
  /* имя кнопки — её надпись (WCAG 2.5.3); надпись сама говорит о состоянии, поэтому без aria-pressed */
  $('#mv-play').textContent=F.paused?'Воспроизвести':'Пауза';
  $('#mv-position').textContent=`${Math.round(m.progress*100)}% повторения`;
  paintMusclePanel('mv',F,m);paintStressPanel('mv',F,m);
}
function configureMusclePanel(prefix,it){
 const profile=motionProfile(it.ex.anim),toggle=$('#'+prefix+'-muscle-toggle'),panel=$('#'+prefix+'-muscle-panel');
 toggle.checked=!!profile&&!!motionPrefs.muscles;toggle.disabled=!profile;
 $('#'+prefix+'-muscle-availability').hidden=!!profile;
 panel.hidden=!profile||!motionPrefs.muscles;
 if(!profile){$('#'+prefix+'-muscle-list').replaceChildren();return;}
 const rows=[];
 for(const[id,m]of Object.entries(profile.muscles)){
  rows.push(`<li data-muscle-row="${id}"><span class="muscle-swatch" aria-hidden="true"></span><span class="muscle-row-copy"><strong>${esc(MUSCLE_NAMES[id])}</strong><span>${MUSCLE_ROLES[m.role]}</span></span><span class="muscle-level"></span></li>`);
  for(const[key,r]of Object.entries(profile.regions||{}).filter(([,r])=>r.parent===id&&r.id!==id)){
   if(key===id)continue;
   rows.push(`<li class="muscle-region-row" data-muscle-row="${key}" data-deep="${!r.visible}"><span class="muscle-swatch" aria-hidden="true"></span><span class="muscle-row-copy"><span>${esc(r.label)}</span><small>${r.profileBasis==='shared-group'?'Как вся мышца':'Своя доля работы, примерно'}</small></span><span class="muscle-level"></span></li>`);
  }
 }
 $('#'+prefix+'-muscle-list').innerHTML=rows.join('');
 const region=$('#'+prefix+'-region');region.innerHTML='<option value="all">Все области</option>'+Object.entries(profile.regions||{}).filter(([,r])=>r.visible).map(([id,r])=>`<option value="${id}">${esc(r.label)}</option>`).join('');
 const saved=motionPrefs.regions?.[it.ex.id]||'all';region.value=profile.regions?.[saved]?.visible?saved:'all';
 const F=prefix==='mv'?detailMotion:workout?.motion;for(const f of [F?.f,F?.extra].filter(Boolean))f.setRegion?.(region.value);
}
function paintMusclePanel(prefix,F,m){
 const panel=$('#'+prefix+'-muscle-panel');if(panel.hidden)return;
 const state=muscleFrame(F.it.ex.anim,m.t,m.index);if(!state)return;
 const note=$('#'+prefix+'-muscle-note');if(note.textContent!==state.note)note.textContent=state.note;
 for(const row of panel.querySelectorAll('[data-muscle-row]')){
  const v=state.values[row.dataset.muscleRow],level=row.querySelector('.muscle-level'),text=row.dataset.deep==='true'?'Глубже':MUSCLE_BANDS[muscleBand(v)];
  row.querySelector('.muscle-swatch').style.backgroundColor=muscleColor(v);
  if(level.textContent!==text)level.textContent=text;
 }
}
/* ---------- нагрузка на суставы: панель с подсказками и красные отрезки шкалы повторения ---------- */
function stressTrack(F){
 const ex=F.it.ex;if(!jointStress(ex).rules.length)return '';
 const N=160,total=F.durations.reduce((a,b)=>a+b,0)||4000,on=[];
 for(let i=0;i<=N;i++){const m=motionFrame({...F,clock:i/N*total*.9999});on.push(jointStressAt(ex,m.t,m.index).length>0);}
 if(!on.some(Boolean))return '';
 const stops=[],pct=i=>(i/N*100).toFixed(2)+'%';let start=0;
 for(let i=1;i<=N+1;i++)if(i>N||on[i]!==on[start]){stops.push(`${on[start]?'var(--hot)':'var(--line)'} ${pct(start)} ${pct(Math.min(i,N))}`);start=i;}
 return `linear-gradient(90deg,${stops.join(',')})`;
}
function configureStressPanel(prefix,F){
 const panel=$('#'+prefix+'-stress-panel');if(!panel||!F)return;
 const rules=jointStress(F.it.ex).rules,toggle=$('#'+prefix+'-stress-toggle'),track=$('#'+prefix+'-stress-track');
 if(toggle){toggle.checked=!!motionPrefs.stress;toggle.disabled=!rules.length;}
 /* без пиковых нагрузок переключатель серый — подпись объясняет почему */
 const none=$('#'+prefix+'-stress-none');if(none)none.hidden=!!rules.length;
 panel.hidden=!rules.length||!motionPrefs.stress;
 $('#'+prefix+'-stress-list').innerHTML=rules.map(r=>`<li data-stress-row="${r.id}"><span class="stress-dot" aria-hidden="true"></span><span><b>${esc(r.zone)}.</b> ${esc(r.what)} <em>${esc(r.tip)}</em></span></li>`).join('');
 if(track){const g=motionPrefs.stress?stressTrack(F):'';track.hidden=!g;track.style.background=g;}
}
function paintStressPanel(prefix,F,m){
 const panel=$('#'+prefix+'-stress-panel');if(!panel||panel.hidden)return;
 const now=new Set(jointStressAt(F.it.ex,m.t,m.index).map(x=>x.rule.id));
 for(const row of panel.querySelectorAll('[data-stress-row]'))row.classList.toggle('on',now.has(row.dataset.stressRow));
}
function changeStressPreference(show){
 motionPrefs.stress=!!show;saveMotionPrefs();
 for(const F of [...figs,detailMotion,workout?.motion].filter(Boolean))for(const f of [F.f,F.extra].filter(Boolean))f.setStress?.(motionPrefs.stress);
 for(const line of document.querySelectorAll('.c-joints'))line.hidden=!motionPrefs.stress;
 refreshCardAnatomy();
 if(detailMotion){configureStressPanel('mv',detailMotion);paintMotion(detailMotion,true);}
 if(workout?.motion){configureStressPanel('wv',workout.motion);paintWorkoutMotion();}
}
function changeMusclePreference(show){
 motionPrefs.muscles=!!show;saveMotionPrefs();
 for(const F of [...figs,detailMotion,workout?.motion].filter(Boolean)){
  for(const f of [F.f,F.extra].filter(Boolean))f.setMuscles?.(motionPrefs.muscles);
  const note=F.btn?.closest('.motion-tile').querySelector('.muscle-tile-note');if(note)note.hidden=!motionPrefs.muscles;
 }
 refreshCardAnatomy();
 if(detailMotion){configureMusclePanel('mv',detailMotion.it);paintMotion(detailMotion,true);const note=$('#mv-figure-note'),text=figureNote(figureView(),detailMotion);if(!note.hidden&&!$('#mv-figure').hasAttribute('aria-busy')&&text)note.textContent=text;}
 if(workout?.motion){configureMusclePanel('wv',workout.motion.it);paintWorkoutMotion();}
}
function scheduleMotionLoop() {
  cancelAnimationFrame(rafId); lastMotionNow=null;
  const loop = now => {
    const dt = lastMotionNow===null ? 0 : Math.min(80,now-lastMotionNow); lastMotionNow=now;
    if (!document.hidden) {
      /* кости и мышцы считаются заново в каждом кадре (≈8 мс на компьютере, на телефоне втрое дольше): «Анатомия» и
         «Скелет» рисуются через кадр, как карточки, — часы идут каждый кадр, движение не замедляется */
      if (detailMotion) {if (!detailMotion.paused) {detailMotion.clock+=dt*Number(motionPrefs.speed);detailMotion.since=(detailMotion.since||0)+dt;
        if(figureView()==='mannequin'||detailMotion.since>=CARD_FRAME_MS){detailMotion.since=0;paintMotion(detailMotion,true);}}}
      else if(gallery.on){/* витрина атласа закрывает план: карточки за ней не анимируются */}
      else if(workout && $('#workout-view').open){const F=workout.motion;if(F && !F.paused && !$('#wv-active').hidden){F.clock+=dt;
        /* кости и мышцы — с частотой ступени скорости (workoutFigure.pace), манекен — каждый кадр, как раньше */
        if(!workoutAnatomyLive())paintWorkoutMotion();
        else{F.since=(F.since||0)+dt;if(F.since>=workoutFigure.pace.frameMs-PACE_SLACK){F.since=0;const c0=window.GymVolume?.boneMisses,t0=performance.now();paintWorkoutMotion();workoutPaceSample(performance.now()-t0,window.GymVolume?.boneMisses!==c0);}}}}
      else for (const F of figs) if (F.f && F.vis && !F.paused && F.active!==false) {
        /* карточки и атлас — 30 кадров в секунду: часы идут каждый кадр, рисунок — через кадр; карточка в «Анатомии» —
           с частотой ступени скорости (cardAnatomy.pace: 30, 15, 10 кадров в секунду) */
        F.clock+=dt;F.since=(F.since||0)+dt;
        const live=F.card&&cardAnatomyLive(F);
        if(F.since>=(live?cardAnatomy.pace.frameMs-PACE_SLACK:CARD_FRAME_MS)){F.since=0;
          if(!live)paintMotion(F);else{const t0=performance.now();paintMotion(F);if(!F.av.built)cardPaceSample(performance.now()-t0,F.av.cold);}}
      }
    }
    rafId=requestAnimationFrame(loop);
  };
  rafId=requestAnimationFrame(loop);
}
/* Карточки плана. Рисунок строится, когда карточка подходит к экрану; двигаются только те, на которые смотрят:
   на телефоне — одна (самая видимая или та, где только что нажали «Пуск»), на широком экране — две,
   и ещё та, что под мышью или в фокусе. Остальные стоят в текущей фазе; пауза пользователя не трогается. */
const CARD_FRAME_MS=30, CARD_NEAR='400px 0px';
let ioSeen=null;
function activeCardCount(){return window.innerWidth>=900?2:1;}
function pickActiveCards(){
  const cards=figs.filter(F=>F.card&&F.f);
  const mid=window.innerHeight/2,dist=F=>{const r=F.btn.getBoundingClientRect();return Math.abs(r.top+r.height/2-mid);};
  /* порядок: под мышью или в фокусе, потом последняя нажатая «Пуск» (пока видна хотя бы наполовину),
     потом самая видимая и ближе к середине экрана */
  const pick=F=>F.seen>=.4?F.pick||0:0;
  const order=cards.filter(F=>!F.paused&&(F.seen>0||F.hover)).sort((a,b)=>(b.hover|0)-(a.hover|0)||pick(b)-pick(a)||Math.round(b.seen*5)-Math.round(a.seen*5)||dist(a)-dist(b));
  const on=new Set(order.slice(0,activeCardCount()+(order[0]?.hover?1:0)));
  let k=0,fresh=false;for(const F of figs)if(F.card){const was=F.active;F.active=on.has(F);if(F.active&&!was){F.since=CARD_FRAME_MS/2*(k++%2);fresh=true;}}
  /* в движении другая карточка: её первые кадры (сборка сцены, холодная память кадров) скорость не меряют */
  if(fresh)cardAnatomy.pace.settle();
}
function buildCardFigure(F){
  if(F.f||F.failed)return;
  try {
    /* начатую заранее рамку досчитать, а не начинать заново */
    if(F.job){F.job.step(41);F.job=null;}
    F.f=buildFigure(F.it.ex.anim,{primary:F.it.ex.pri,has:F.it.has,ratio:1,t:0,label:F.it.name,muscles:motionPrefs.muscles,frameCache:true});
    /* сразу — SVG-манекен (первая картинка плана не ждёт анатомию); кадр анатомии нарисуется в простое */
    F.btn.prepend(F.f.svg);paintMotion(F,false,true);
  } catch(e) {F.failed=true;console.error('Демонстрация',F.it.ex.id,e);}
}
/* Рамки ещё не построенных карточек досчитываются заранее, по два положения за раз: в простое, а если простоя
   нет (идёт анимация на слабом телефоне) — не реже чем раз в четверть секунды. Тогда при прокрутке карточка
   строится сразу, без долгой паузы. */
let framePrefetchGen=0;
function prefetchCardFrames(){
  const gen=++framePrefetchGen,queue=figs.filter(F=>F.card);let F=null;
  const idle=window.requestIdleCallback?cb=>requestIdleCallback(cb,{timeout:200}):cb=>setTimeout(()=>{const end=performance.now()+8;cb({timeRemaining:()=>Math.max(0,end-performance.now())});},40);
  const work=deadline=>{
    if(gen!==framePrefetchGen)return;
    do {
      if(!F||!F.job){
        F=queue.shift();if(!F)return;
        if(F.f||F.failed){F=null;continue;}
        try{F.job=figureFrameJob(F.it.ex.anim,{has:F.it.has,ratio:1});}catch(e){F.job=null;}
        if(!F.job||F.job.done){F.job=null;continue;}
      }
      /* без простоя (сработал таймаут) — кусок побольше: шесть положений ≈ 3 мс на компьютере */
      if(F.job.step(deadline.didTimeout?6:2))F.job=null;
    } while(deadline.timeRemaining()>3);
    idle(work);
  };
  idle(work);
}
/* ---------- «Анатомия» в карточках плана (этап 2) ----------
   В виде «Анатомия» (или «Скелет») карточка показывает кости и мышцы в почти невидимом силуэте кожи, как разбор.
   Своего WebGL у карточки нет: кадры рисует общий рендерер вне экрана (GymVolume.cards(), src/volume/main.mjs) и
   копирует в холст карточки. Анимируются те же карточки, что и раньше (на телефоне одна, на широком экране — две);
   кости и мышцы обновляются с частотой ступени скорости (cardAnatomy.pace, 12-figure-pace.js), часы — каждый кадр.
   Остальные карточки показывают один неподвижный кадр своей фазы: он рисуется один раз в простое (queueCardStills) и
   хранится в холсте карточки; карточка, ушедшая далеко от экрана, его отпускает (stillsToFree). До готовности кадра,
   пока грузятся кости и мышцы, без объёмной графики и после отката по скорости — SVG-манекен, как раньше.
   Ракурс — как у карточки (cardCamera), рамка — по телу. Цвет мышц — как в разборе: по фазам или основные ярче.
   В виде «Манекен» тот же путь рисует кожу Anny (вид 'skin', skinViewFor): без костей и мышц, области мышц — цветом
   кожи; пока её данные грузятся, не загрузились или телефон не успевает — SVG-манекен. */
const PACE_SLACK=4;
const cardAnatomy={pace:anatomyPace(),slow:false,failed:false,annyFailed:false,loading:false,view:'mannequin',theme:0,queued:false,far:null,idleFree:0};
const annySkinModule=()=>typeof AnnySkin!=='undefined'?AnnySkin:null;
const coarsePointer=()=>typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches;
/* ракурс анатомии в карточке: тот, что выбран для упражнения в разборе, иначе «Сверху под углом», как у SVG-карточки */
function cardCamera(F){return motionCamera(F.it.ex);}
function cardStage(){try{return window.GymVolume?.cards?.()||null;}catch(e){return null;}}
function cardAnatomyState(view=figureView()){
  if(view==='mannequin'||view==='skin')return annySkinModule()?.data?'ready':cardAnatomy.annyFailed?'error':'loading';
  const need=view==='anatomy'?[Skeleton,Muscles]:[Skeleton];
  return need.every(x=>x.data)?'ready':cardAnatomy.failed?'error':'loading';
}
function cardAnatomyChoice(){
  if(figureView()==='mannequin')return skinViewFor({able:!!annySkinModule()&&!!cardStage(),state:cardAnatomyState('skin'),slow:cardAnatomy.slow});
  return figureViewFor(motionPrefs.view,{able:!!cardStage(),state:cardAnatomyState(),slow:cardAnatomy.slow,coarse:coarsePointer()});
}
const cardAnatomyLive=F=>cardAnatomy.view!=='mannequin'&&!!F.av;
/* холст и фигура общего рендерера для карточки (один раз); null — у упражнения нет манекена каталога */
function cardAnatomyFor(F){
  if(F.av)return F.av;
  const ex=F.it.ex,stage=cardStage();if(!stage||!ex.anim.catalogRig)return null;
  const A=catalogAnimFor(ex.anim,F.it.has),bits=A.catalogRig(0).props.map(q=>GymEquipment.visible(q,F.it.has)?1:0).join('');
  const canvas=document.createElement('canvas');canvas.className='fig card-anatomy';canvas.setAttribute('aria-hidden','true');canvas.width=canvas.height=0;
  F.btn.prepend(canvas);
  const handle=stage.figure({key:[A.catalogId,A.catalogVariant||'',bits].join('|'),fit:'body',color:muscleColor,muscles:motionPrefs.muscles,stress:motionPrefs.stress,
    data:(t,index,coarse,lean)=>catalogVolumeData(A,t,index,F.it.has,coarse,lean)});
  return F.av={canvas,handle,level:anatomyLevel(ex),on:false,still:null,size:null,seenAt:0,layers:null};
}
/* слои фигуры карточки по виду: кости, мышцы (уровни упражнения), цвет по фазам и метки нагрузки — из настроек */
function cardAnatomyLayers(F){
  const av=F.av,view=cardAnatomy.view,key=view+(motionPrefs.muscles?1:0)+(motionPrefs.stress?1:0);if(av.layers===key)return;
  av.handle.setLayers(view==='skin'?null:Skeleton.data,view==='anatomy'?{skeleton:Skeleton.data,muscles:Muscles.data,level:av.level}:null);
  av.handle.setLook({muscles:motionPrefs.muscles,stress:motionPrefs.stress});av.layers=key;
}
function cardStillKey(F,m){const av=F.av,s=av.size;return [m.t,m.index,cardAnatomy.view,av.layers,cardAnatomy.theme,s?s.width+'x'+s.height:'',cardCamera(F)].join('|');}
/* кадр анатомии в холст карточки; true — нарисован (SVG под ним скрыт) */
function paintCardAnatomy(F,m){
  const av=F.av;if(!av)return false;
  if(!av.size){const r=(F.f?.svg||F.btn).getBoundingClientRect();av.size=cardCanvasSize(r.width,r.height,window.devicePixelRatio);if(!av.size)return false;}
  cardAnatomyLayers(F);
  if(av.canvas.width!==av.size.width||av.canvas.height!==av.size.height){av.canvas.width=av.size.width;av.canvas.height=av.size.height;}
  const stage=cardStage(),b0=stage?.builds,c0=window.GymVolume?.boneMisses;
  let ok=false;try{ok=av.handle.paint(av.canvas,m.t,m.index,cardCamera(F));}catch(e){console.error('Анатомия карточки',F.it.ex.id,e);ok=false;}
  /* кадр со сборкой сцены (новое упражнение) — не для замера скорости */
  av.built=!!stage&&stage.builds!==b0;av.cold=window.GymVolume?.boneMisses!==c0;
  if(!ok)return false;
  av.still=cardStillKey(F,m);av.seenAt=performance.now();
  if(!av.on){av.on=true;F.btn.classList.add('anatomy-on');}
  return true;
}
/* отпустить кадр карточки: холст без памяти, на виду — SVG-манекен в текущей фазе */
function freeCardStill(F){
  const av=F.av;if(!av)return;
  if(av.on){av.on=false;F.btn.classList.remove('anatomy-on');if(F.f){const m=motionFrame(F,cardClock(F));F.f.at(m.t,m);}}
  av.canvas.width=av.canvas.height=0;av.still=null;
}
function freeFarStills(){
  const list=figs.map((F,id)=>({id,has:!!F.av?.on,near:!!F.vis,far:F.far!==false,seenAt:F.av?.seenAt||0}));
  for(const id of stillsToFree(list))freeCardStill(figs[id]);
}
function anatomyDialogOpen(){return !!(detailMotion||gallery.on||($('#workout-view')?.open)||$('#motion-view')?.open);}
/* неподвижные кадры: в простое, по одному, начиная с ближних к середине экрана; анимируемые карточки рисует цикл */
function queueCardStills(){
  /* одна заявка на всех: в простое берётся текущее состояние (вид, карточки, фазы), а не то, что было при заявке */
  if(cardAnatomy.queued)return;cardAnatomy.queued=true;
  const idle=window.requestIdleCallback?cb=>requestIdleCallback(cb,{timeout:300}):cb=>setTimeout(()=>cb({timeRemaining:()=>8,didTimeout:true}),60);
  idle(()=>{
    cardAnatomy.queued=false;
    if(cardAnatomy.view==='mannequin'||document.hidden||anatomyDialogOpen())return;
    const mid=window.innerHeight/2,dist=F=>{const r=F.btn.getBoundingClientRect();return Math.abs(r.top+r.height/2-mid);};
    const todo=figs.filter(F=>F.card&&F.vis&&F.f&&F.av&&!(F.active&&!F.paused)).map(F=>[F,motionFrame(F,cardClock(F))]).filter(([F,m])=>F.av.still!==cardStillKey(F,m));
    if(!todo.length)return;
    const [F,m]=todo.sort((a,b)=>dist(a[0])-dist(b[0]))[0];
    paintMotion(F);
    /* не нарисовался (контекст потерян) — не крутиться вхолостую: следующая попытка — по событию */
    if(F.av.still===cardStillKey(F,m)&&todo.length>1)queueCardStills();
  });
}
/* загрузка костей и мышц для карточек (одна на всех; ошибка — манекен с подписью, повтор — при следующем плане) */
function loadCardAnatomy(){
  if(cardAnatomy.loading)return;cardAnatomy.loading=true;
  /* в простое: разбор данных (≈1 МБ JSON мышц) не задерживает первую картинку плана — SVG-карточки */
  const idle=window.requestIdleCallback?cb=>requestIdleCallback(cb,{timeout:3000}):cb=>setTimeout(cb,300);
  idle(()=>{
    /* «Манекен» — данные кожи Anny (≈ 0,2 МБ) */
    if(figureView()==='mannequin'){const A=annySkinModule();if(!A){cardAnatomy.loading=false;return;}
      A.load().then(()=>{cardAnatomy.loading=false;cardAnatomy.annyFailed=false;applyCardsView();},()=>{cardAnatomy.loading=false;cardAnatomy.annyFailed=true;applyCardsView();});return;}
    const need=figureView()==='anatomy'?[Skeleton,Muscles]:[Skeleton];
    Promise.all(need.map(x=>x.load())).then(()=>{cardAnatomy.loading=false;cardAnatomy.failed=false;applyCardsView();},()=>{cardAnatomy.loading=false;cardAnatomy.failed=true;applyCardsView();});
  });
}
/* подпись под карточкой: откат по скорости или ошибка загрузки (пока грузится — просто SVG-манекен) */
function paintCardNotes(note){
  for(const F of figs){if(!F.card)continue;const el=F.btn.closest('.motion-tile')?.querySelector('.figure-tile-note');if(!el)continue;
    if(el.textContent!==note)el.textContent=note;el.hidden=!note;}
}
/* вид карточек: выбор человека, объёмная графика, данные, откат по скорости — перерисовать всё нужное */
function applyCardsView(){
  const choice=cardAnatomyChoice(),was=cardAnatomy.view;cardAnatomy.view=choice.view;if(was!==choice.view)cardAnatomy.pace.settle();
  paintCardNotes(choice.wait?'':choice.note);
  if(choice.view==='mannequin'){
    for(const F of figs)if(F.card)freeCardStill(F);
    if(choice.wait)loadCardAnatomy();
    /* без анатомии общий рендерер не нужен: контекст WebGL и сцены освобождаются */
    else if(was!=='mannequin'||!figs.some(F=>F.av))cardStage()?.dispose();
    return;
  }
  /* холсты и фигуры карточек; неподвижный кадр перерисуется, только если сменилось то, что в нём видно (ключ кадра:
     фаза, вид, слои, тема, размер, ракурс), — закрытие разбора без перемен ничего не перерисовывает */
  for(const F of figs)if(F.card)cardAnatomyFor(F);
  /* анимируемые карточки рисует цикл, остальные — в простое */
  queueCardStills();
}
/* настройки цвета мышц или меток нагрузки сменились: неподвижные кадры — заново */
function refreshCardAnatomy(){if(cardAnatomy.view==='mannequin')return;for(const F of figs)if(F.av)F.av.still=null;queueCardStills();}
function cardPaceSample(ms,cold=false){
  const r=cardAnatomy.pace.sample(ms,figs.filter(F=>F.card&&F.active&&!F.paused&&F.vis).length,cold);
  if(r==='fallback'){cardAnatomy.slow=true;applyCardsView();}
}
/* человек заново выбрал вид с костями: откат по скорости забывается — новая попытка с 30 кадров */
function retryAnatomyPace(){cardAnatomy.slow=false;cardAnatomy.pace.reset();workoutFigure.slow=false;workoutFigure.pace.reset();}
/* тема (кадр анатомии от неё сейчас не зависит, но перерисовка дешёвая и не пропустит будущих правок) */
if(typeof matchMedia==='function')try{matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{cardAnatomy.theme++;refreshCardAnatomy();});}catch(e){}
if(typeof MutationObserver==='function'&&typeof document!=='undefined'&&document.documentElement)new MutationObserver(()=>{cardAnatomy.theme++;refreshCardAnatomy();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cardAnatomy.view!=='mannequin')queueCardStills();});

let mountedKit=null;
function mountFigures() {
  figs=[];
  /* инвентарь места сменился: готовые кадры карточек прежнего набора больше не понадобятся */
  const kit=S.place+':'+(S.equip||[]).slice().sort().join(',');if(mountedKit!==null&&kit!==mountedKit)figureFramesReset();mountedKit=kit;
  const flat=plan.blocks.flatMap(b=>b.items);
  document.querySelectorAll('[data-fig]').forEach(btn=>{
    const it=flat[+btn.dataset.fig];if(!it)return;
    const F={btn,it,f:null,av:null,card:true,vis:false,far:true,seen:0,active:false,paused:reduceMotion,clock:0,durations:motionDurations(it)};
    figs.push(F);
    const tile=btn.closest('.motion-tile');
    if(motionProfile(it.ex.anim)){const note=document.createElement('p');note.className='muscle-tile-note';note.textContent='Цвет — учебная схема';note.hidden=!motionPrefs.muscles;tile.appendChild(note);}
    {const note=document.createElement('p');note.className='figure-tile-note';note.hidden=true;tile.appendChild(note);}
    const pause=tile.querySelector('[data-motion-pause]');
    if(pause){pause.textContent=F.paused?'Пуск':'Пауза';pause.setAttribute('aria-label',`${F.paused?'Пуск':'Пауза'}: ${it.name}`);}
    const hover=on=>e=>{if(e.pointerType&&e.pointerType!=='mouse')return;F.hover=on;pickActiveCards();};
    tile.addEventListener('pointerenter',hover(true));tile.addEventListener('pointerleave',hover(false));
    btn.addEventListener('focus',()=>{F.hover=true;pickActiveCards();});btn.addEventListener('blur',()=>{F.hover=false;pickActiveCards();});
  });
  if ('IntersectionObserver' in window) {
    const byBtn=new Map(figs.map(F=>[F.btn,F]));
    io=new IntersectionObserver(es=>{for(const e of es){const F=byBtn.get(e.target);if(!F)continue;F.vis=e.isIntersecting;if(F.vis){buildCardFigure(F);if(F.av)F.av.seenAt=performance.now();}}pickActiveCards();if(cardAnatomy.view!=='mannequin')queueCardStills();},{rootMargin:CARD_NEAR});
    ioSeen=new IntersectionObserver(es=>{for(const e of es){const F=byBtn.get(e.target);if(F)F.seen=e.isIntersecting?e.intersectionRatio:0;}pickActiveCards();},{threshold:[0,.2,.4,.6,.8,1]});
    /* дальняя зона (два экрана): ушедшая за неё карточка отпускает неподвижный кадр анатомии */
    cardAnatomy.far=new IntersectionObserver(es=>{for(const e of es){const F=byBtn.get(e.target);if(F)F.far=e.isIntersecting;}freeFarStills();},{rootMargin:CARD_STILLS.far});
    for(const F of figs){io.observe(F.btn);ioSeen.observe(F.btn);cardAnatomy.far.observe(F.btn);}
    prefetchCardFrames();
  } else for(const F of figs){F.vis=true;F.active=true;buildCardFigure(F);}
  /* новый план — новая попытка загрузки костей и мышц, если прошлая не удалась */
  if(cardAnatomy.failed&&!cardAnatomy.loading)cardAnatomy.failed=false;
  applyCardsView();
  scheduleMotionLoop();
}
function stopFigures() {
  /* план пересобирается и при замене упражнения на экране тренировки (workoutSwap) — тогда тренировка остаётся открытой */
  if(workout && $('#workout-view').open && !workoutReplanning)closeWorkout();
  if(detailMotion) closeMotion();
  cancelAnimationFrame(rafId);framePrefetchGen++;if(io)io.disconnect();if(ioSeen)ioSeen.disconnect();cardAnatomy.far?.disconnect();io=ioSeen=cardAnatomy.far=null;
  for(const F of figs){disposeMotion(F);if(F.av){F.av.handle.release();F.av.canvas.width=F.av.canvas.height=0;}}figs=[];
  /* журнал, атлас мышц: карточек нет — через несколько секунд общий рендерер карточек отдаёт контекст WebGL и сцены
     (сразу нельзя: «Заменить» или новый подбор строят план заново, и сцены пригодятся) */
  clearTimeout(cardAnatomy.idleFree);cardAnatomy.idleFree=setTimeout(()=>{if(!figs.some(F=>F.av)&&!gallery.on)cardStage()?.dispose();},4000);
}
function previewItem(id) {
  const ex=EXI[id];let E=effEquip(S.equip);
  if(!available(ex,E)) E=effEquip(EQUIP.map(e=>e.id));
  return {ex,name:exName(ex,E),rx:prescribe(ex,S.mode==='program'?WEEKS[S.week-1]:null,E),has:propHas(ex,E),eqLine:equipLine(ex,E)};
}
function selectMotion(it, clock=0) {
  disposeMotion(detailMotion);
  detailMotion={it,f:null,clock,paused:true,durations:motionDurations(it)};
  $('#mv-title').textContent=it.name;
  $('#mv-exercise').value=it.ex.id;
  $('#mv-tools').innerHTML=cpKeepHtml(it.ex.id,'mv');
  $('#mv-view').textContent=CAMERA3[motionCamera(it.ex)].label;
  $('#mv-speed').value=String(motionPrefs.speed);$('#mv-joints').checked=!!motionPrefs.joints;$('#mv-trace').checked=!!motionPrefs.trace;$('#mv-vectors').checked=!!motionPrefs.vectors;
  $('#mv-tempo').textContent=it.ex.anim.hold?'Удерживайте положение и дышите ровно.':it.ex.anim.timing||it.ex.g==='cardio'||it.ex.kind?'Ритм показан схематично. Замедление помогает разобрать движение.':it.rx.static?`Статодинамика: ${tempoWords(it.rx.tempo)}, без пауз; показана рабочая часть амплитуды — без выпрямления до конца и без расслабления внизу.`:`Темп по плану: ${tempoWords(it.rx.tempo)}. Скорость просмотра темп не меняет.`;
  const level={};it.ex.pri.forEach(m=>level[m]=1);it.ex.sec.forEach(m=>{if(!level[m])level[m]=.38;});
  $('#mv-muscles').innerHTML=muscleMapSvg(level,{labels:true,aria:'Основные и вспомогательные мышцы'});
  $('#mv-primary').textContent=it.ex.pri.map(m=>MUSCLE_NAMES[m]).join(', ');
  $('#mv-secondary').textContent=it.ex.sec.length?it.ex.sec.map(m=>MUSCLE_NAMES[m]).join(', '):'—';
  $('#mv-steps').innerHTML=it.ex.tech.map(x=>`<li>${esc(x)}</li>`).join('');
  $('#mv-errors').innerHTML=it.ex.err.map(x=>`<li>${esc(x)}</li>`).join('');
  $('#mv-breath').textContent=it.ex.breath;
  $('#mv-note').textContent=it.ex.note||'';
  const links=[...(SOURCES_BY_EX[it.ex.id]||[]),...(motionProfile(it.ex.anim)?.sources||[])];
  const src=links.filter((v,i)=>links.findIndex(x=>x[1]===v[1])===i).map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`);
  $('#mv-sources').innerHTML=src.length?`<p class="mv-muscle-label">Подробнее о технике</p>${src.join('')}`:'';
  mountDetailCameras();
}
/* Вид фигуры в подробном разборе (с 4.30.0 по умолчанию — «Анатомия»):
   · «Анатомия» — кости и мышцы объёмом (толщина — по объёму на МРТ) внутри почти невидимого силуэта кожи; цвет мышц —
     как у областей манекена: с «Мышцами по фазам» — участие в текущей фазе, без них — основные и вспомогательные;
   · «Скелет» — только кости в том же силуэте;
   · «Манекен» — прежний манекен с подсветкой мышечных областей.
   Кости (≈220 КБ) и мышцы (≈38 КБ) грузятся один раз — заранее, в простое после первого экрана (setupMotionViewer), или
   при первом открытии разбора; пока они грузятся, показан манекен. Без объёмной графики доступен только манекен. */
const FIGURE_VIEWS=['anatomy','skeleton','mannequin'];
const figureView=()=>FIGURE_VIEWS.includes(motionPrefs.view)?motionPrefs.view:'anatomy';
function anatomyLevel(ex){const level={};ex.pri.forEach(m=>level[m]=1);ex.sec.forEach(m=>{if(!level[m])level[m]=.38;});return level;}
function figureNote(view,F){
  if(view==='skeleton')return 'Кости — по открытым моделям MyoSim, источники — в «О демонстрациях». Мышцы в этом виде скрыты.';
  if(view!=='anatomy')return '';
  return 'Кости и мышцы — по открытым моделям, толщина мышц — по МРТ; источники — в «О демонстрациях». '+(motionPrefs.muscles&&F&&motionProfile(F.it.ex.anim)
    ?'Цвет мышцы — её участие в этой фазе: чем оранжевее, тем сильнее.':'Цветом — мышцы упражнения: основные ярче, вспомогательные бледнее.');
}
function applyFigureView(F=detailMotion){
  const group=$('#mv-figure'),note=$('#mv-figure-note');if(!group)return;
  const list=F?[F.f,F.extra].filter(Boolean):[],able=list.length>0&&list.every(f=>typeof f.setLayers==='function');
  const view=able?figureView():'mannequin';
  for(const b of group.querySelectorAll('[data-mv-figure]')){const off=!able&&b.dataset.mvFigure!=='mannequin';b.disabled=off;b.title=off?'Нужна объёмная графика (WebGL)':'';b.setAttribute('aria-pressed',String(b.dataset.mvFigure===view));}
  const say=text=>{note.textContent=text;note.hidden=!text;};
  if(view==='mannequin'){for(const f of list)f.setLayers?.(null,null);say('');return;}
  const put=()=>{for(const f of list)f.setLayers(Skeleton.data,view==='anatomy'?{skeleton:Skeleton.data,muscles:Muscles.data,level:anatomyLevel(F.it.ex)}:null);say(figureNote(view,F));};
  const need=view==='anatomy'?[Skeleton,Muscles]:[Skeleton];
  if(need.every(x=>x.data)){put();return;}
  for(const f of list)f.setLayers(null,null);
  group.setAttribute('aria-busy','true');say(view==='anatomy'?'Загружаем кости и мышцы…':'Загружаем кости…');
  Promise.all(need.map(x=>x.load())).then(()=>{
    group.removeAttribute('aria-busy');if(detailMotion!==F||figureView()!==view)return;put();
  },()=>{
    /* выбор не сбрасывается: при следующем открытии разбора загрузка повторится */
    group.removeAttribute('aria-busy');if(detailMotion!==F||figureView()!==view)return;
    for(const b of group.querySelectorAll('[data-mv-figure]'))b.setAttribute('aria-pressed',String(b.dataset.mvFigure==='mannequin'));
    say('Не удалось загрузить кости и мышцы — показан манекен. Проверьте связь и выберите вид ещё раз.');
  });
}
/* Заготовка рендерера разбора (GymVolume.prewarm, src/volume/main.mjs): WebGL-контекст и программы шейдеров выбранного вида
   собираются в простое, пока человек смотрит план, — первое открытие разбора и тренировки их не ждёт. Сцена — первого
   упражнения плана (без плана — первого в каталоге): программы от упражнения почти не зависят. «Манекен» — с кожей Anny, когда
   её данные пришли. */
function prewarmDetail(){
  const V=window.GymVolume;if(!V?.prewarm||detailMotion||document.hidden)return;
  const F=figs.find(f=>f.it?.ex?.anim?.catalogRig),it=F?F.it:previewItem(EX[0].id),layers=detailLayers(it.ex);if(!it.ex.anim.catalogRig)return;
  if(figureView()==='mannequin'?!annySkinModule()?.data:!layers)return;
  const A=catalogAnimFor(it.ex.anim,it.has);
  V.prewarm({data:(t,index,coarse,lean)=>catalogVolumeData(A,t,index,it.has,coarse,lean),color:muscleColor,layers,muscles:motionPrefs.muscles,stress:motionPrefs.stress,joints:motionPrefs.joints}).catch(()=>{});
}
function openMotion(idx) {
  const F=figs.find(f=>+f.btn.dataset.fig===Number(idx));
  openMotionItem(F?F.it:previewItem(EX[0].id),F?F.clock:0);
}
function openMotionItem(it,clock=0){
  detailReturn=document.activeElement;
  showDetail();selectMotion(it,clock);
  const d=$('#motion-view');if(!d.open)d.showModal();
  document.documentElement.classList.add('motion-open');
  OverlayBack.open('motion',()=>closeMotion(true)); /* системная «Назад» закрывает разбор (12d-back.js) */
  $('#mv-close').focus();scheduleMotionLoop();
}
/* fromBack — закрыт системной «Назад»: запись истории уже снята */
function closeMotion(fromBack) {
  const d=$('#motion-view');disposeMotion(detailMotion);detailMotion=null;closeGallery();
  if(d&&d.open)d.close();
  if(fromBack!==true)OverlayBack.closed('motion');
  document.documentElement.classList.remove('motion-open');
  if(detailReturn&&detailReturn.isConnected)detailReturn.focus();
  detailReturn=null;
  /* вид фигуры мог смениться в разборе — карточки плана берут его же */
  if(figs.some(F=>F.card))applyCardsView();
  /* добавили в открытый свой план из атласа или разбора — его страница перерисовывается теперь (11d-custom.js) */
  cpFlush();
}
function setupMotionViewer() {
  window.addEventListener('resize',()=>{pickActiveCards();for(const F of figs)if(F.av)F.av.size=null;if(cardAnatomy.view!=='mannequin')queueCardStills();},{passive:true});
  $('#mv-exercise').innerHTML=GROUPS.map(g=>`<optgroup label="${esc(g.name)}">${EX.filter(ex=>ex.g===g.id).map(ex=>`<option value="${ex.id}">${esc(exNameHere(ex))}</option>`).join('')}</optgroup>`).join('');

  document.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.motionPause!==undefined){const F=figs.find(f=>+f.btn.dataset.fig===+t.dataset.motionPause);if(F){F.paused=!F.paused;if(F.card){F.pick=performance.now();pickActiveCards();}t.textContent=F.paused?'Пуск':'Пауза';t.setAttribute('aria-label',`${F.paused?'Пуск':'Пауза'}: ${F.it.name}`);}return;}
    if(t.id==='motion-atlas'){openGallery();return;}
    if(t.id==='mv-close'){closeMotion();return;}
    if(!detailMotion)return;
    if(t.dataset.mvFigure){if(t.dataset.mvFigure!==figureView()||t.getAttribute('aria-pressed')!=='true'){motionPrefs.view=t.dataset.mvFigure;saveMotionPrefs();if(motionPrefs.view!=='mannequin')retryAnatomyPace();applyFigureView();}return;}
    if(t.id==='mv-play'){detailMotion.paused=!detailMotion.paused;paintMotion(detailMotion,true);}
    if(t.dataset.mvStep){const m=motionFrame(detailMotion);detailMotion.paused=true;detailMotion.clock=Math.max(0,Math.min(m.total-1,(m.progress+Number(t.dataset.mvStep))*m.total));paintMotion(detailMotion,true);}
    if(t.dataset.mvPose){const d=detailMotion.durations;detailMotion.paused=true;detailMotion.clock=({start:0,middle:d[0]*.5,end:d[0]+d[1]*.5,return:d[0]+d[1]+d[2]*.5})[t.dataset.mvPose];paintMotion(detailMotion,true);}
    /* соседние упражнения — в том же порядке, что в списке (по группам мышц) */
    if(t.dataset.mvNav){const ids=[...$('#mv-exercise').options].map(o=>o.value),i=ids.indexOf(detailMotion.it.ex.id);selectMotion(previewItem(ids[(i+Number(t.dataset.mvNav)+ids.length)%ids.length]));}
  });
  $('#mv-progress').addEventListener('input',e=>{if(!detailMotion)return;const m=motionFrame(detailMotion);detailMotion.paused=true;detailMotion.clock=Number(e.target.value)/1000*(m.total-1);paintMotion(detailMotion,true);});
  $('#mv-speed').addEventListener('change',e=>{motionPrefs.speed=Number(e.target.value);saveMotionPrefs();});
  $('#mv-exercise').addEventListener('change',e=>selectMotion(previewItem(e.target.value)));
  $('#mv-joints').addEventListener('change',e=>{motionPrefs.joints=e.target.checked;if(detailMotion)for(const f of [detailMotion.f,detailMotion.extra].filter(Boolean)){f.svg.classList.toggle('show-joints',e.target.checked);f.setJoints?.(e.target.checked);}saveMotionPrefs();});
  $('#mv-vectors').addEventListener('change',e=>{motionPrefs.vectors=e.target.checked;if(detailMotion)for(const f of [detailMotion.f,detailMotion.extra].filter(Boolean))f.setVectors(e.target.checked);saveMotionPrefs();});
  $('#mv-trace').addEventListener('change',e=>{motionPrefs.trace=e.target.checked;if(detailMotion)for(const f of [detailMotion.f,detailMotion.extra].filter(Boolean))f.setTrace(e.target.checked);saveMotionPrefs();});
  $('#mv-muscle-toggle').addEventListener('change',e=>changeMusclePreference(e.target.checked));
  $('#wv-muscle-toggle').addEventListener('change',e=>changeMusclePreference(e.target.checked));
  for(const prefix of ['mv','wv'])$('#'+prefix+'-stress-toggle').addEventListener('change',e=>changeStressPreference(e.target.checked));
  for(const prefix of ['mv','wv'])$('#'+prefix+'-region').addEventListener('change',e=>selectMuscleRegion(prefix,e.target.value));
  $('#motion-view').addEventListener('cancel',e=>{e.preventDefault();closeMotion();});
  $('#motion-view').addEventListener('close',()=>{disposeMotion(detailMotion);detailMotion=null;closeGallery();document.documentElement.classList.remove('motion-open');OverlayBack.closed('motion');cpFlush();});
  /* объёмная графика грузится после первого экрана (build.js): если разбор или тренировка открыты раньше, показывается
     плоская схема, а с приходом объёма та же фаза перерисовывается в нём */
  window.addEventListener('gym-volume',()=>{
    if(detailMotion&&!gallery.on)mountDetailCameras();if(workout?.motion&&$('#workout-view').open)mountWorkoutCameras();
    /* карточки плана: объёмная графика пришла — анатомия (неподвижные кадры в простое, анимируемая — в цикле) */
    if(figs.some(F=>F.card))applyCardsView();
    /* сетка головы (≈55 мс на компьютере) одна на все упражнения: готовится в простое, а не при первом открытии разбора */
    const idle=window.requestIdleCallback||(f=>setTimeout(f,2000));idle(()=>{try{Mannequin.headMesh();}catch(e){}},{timeout:6000});
    /* кости и мышцы для вида «Анатомия» — тоже заранее: первое открытие разбора сразу показывает анатомию */
    if(figureView()!=='mannequin')idle(()=>{
      const need=figureView()==='anatomy'?[Skeleton,Muscles]:[Skeleton];
      Promise.all(need.map(x=>x.load())).then(()=>idle(prewarmDetail,{timeout:8000}),()=>{});
    },{timeout:8000});
    /* «Манекен»: кожа Anny нужна и карточкам плана (loadCardAnatomy), и разбору — заготовка рендерера, когда она пришла */
    else idle(()=>{const A=annySkinModule();if(A)A.load().then(()=>idle(prewarmDetail,{timeout:8000}),()=>{});},{timeout:8000});
  });
  $('#motion-view').addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','SELECT','BUTTON','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(detailMotion){detailMotion.paused=!detailMotion.paused;paintMotion(detailMotion,true);}}});
}


/* ---------- таймер отдыха в плане ----------
   Время — по меткам (restView в 12a-set-timers.js). После нуля таймер считает вверх «+0:25» и повторяет сигнал (если
   выбран «настойчивый»), пока не отмечен следующий подход или не нажато «Готово»; уходит через 5 с после последнего сигнала. */
const T = {left:0, total:0, id:0, end:0, from:0, label:''};
function startRest(sec, label) {
  if (!sec) return;
  T.total = sec; T.left = sec; T.from = Date.now(); T.end = T.from + sec * 1000; T.label = label || 'Отдых';
  $('#t-label').textContent = T.label;
  $('#timer').hidden = false; $('#timer').classList.remove('over');
  RestAlarm.unlock(); RestAlarm.arm(T.end, {from:T.from}); RestAlarm.paintButton($('#t-sound'));
  clearInterval(T.id); clearTimeout(T.id); tick(); T.id = setInterval(tick, 250);
}
function tick() {
  const now = Date.now(), v = restView(T.end, now);
  T.left = v.left;
  $('#t-time').textContent = v.text;
  $('#t-bar').style.width = (T.total ? (1 - v.left / T.total) * 100 : 100) + '%';
  RestAlarm.poll(now);
  $('#timer').classList.toggle('over', v.over); $('#t-minus').disabled = v.over;
  const label = v.over ? 'Пора к следующему подходу · сверх отдыха' : T.label;
  if ($('#t-label').textContent !== label) $('#t-label').textContent = label;
  if (v.over && now >= Math.max(T.end, RestAlarm.lastAt()) + 5000) stopRest();
}
function adjustRest(d) {
  if ($('#timer').hidden) return;
  const now = Date.now(), end = restAdjust(T.end, now, d);
  if (end === T.end) return;
  T.total = Math.max(1, T.total + Math.round((end - T.end) / 1000)); T.end = end;
  RestAlarm.arm(T.end, {from:T.from}); clearTimeout(T.id); clearInterval(T.id); tick(); T.id = setInterval(tick, 250);
}
function stopRest() { clearInterval(T.id); clearTimeout(T.id); RestAlarm.cancel(); $('#timer').hidden = true; $('#t-minus').disabled = false; }

/* ---------- текст для копирования ---------- */
function blocksText(p) {
  const lines = [];
  for (const b of p.blocks) {
    if (b.kind === 'pair') lines.push(b.items.length > 1 ? `Суперсет ${b.letter}: ${b.sets} ${plural(b.sets, 'круг', 'круга', 'кругов')}, отдых ${fmtRest(b.rest)} после пары` : `${b.letter}:`);
    if (b.kind === 'circuit') lines.push(`Круг × ${b.rounds}: переход ${fmtRest(b.rest)}, отдых после круга ${fmtRest(b.roundRest)}`);
    for (const it of b.items) {
      const r = it.rx;
      const side = r.uni ? ' на сторону' : '';
      if (r.static) { const kgS = r.kgPlan && loadType(it.ex) !== 'none' ? `, ${planKgText(r.kgPlan)} ${wUnit()}` : ''; lines.push(`${it.label}. ${it.name} — ${r.series} × 3 × ${r.reps}${r.unit ? ' ' + r.unit : ''}${side}, ${tempoWords(r.tempo)}, без расслабления, отдых ${fmtRest(r.rest)}${r.series > 1 ? `, между сериями ${fmtRest(r.seriesRest)}` : ''}${kgS}`); if (r.coachNote) lines.push(`   Заметка: ${r.coachNote.replace(/\n+/g, ' ')}`); continue; }
      const kg = r.kgPlan && loadType(it.ex) !== 'none' ? `, ${planKgText(r.kgPlan)} ${wUnit()}` : '';
      lines.push(r.circ ? `${it.label}. ${it.name} — ${r.reps}${r.unit ? ' ' + r.unit : ''}${side}${kg}` : `${it.label}. ${it.name} — ${r.sets} × ${r.reps}${r.unit ? ' ' + r.unit : ''}${side}${kg}${b.kind === 'list' ? `, отдых ${fmtRest(r.rest)}` : ''}`);
      if (r.coachNote) lines.push(`   Заметка: ${r.coachNote.replace(/\n+/g, ' ')}`);
    }
  }
  return lines;
}
function planText() {
  const G = GOALS[S.goal];
  if (S.mode === 'program' && prog) {
    const out = [`${SPLITS[prog.split].name}, ${S.days} ${plural(S.days, 'тренировка', 'тренировки', 'тренировок')} в неделю — ${G.name.toLowerCase()}`,
      `Неделя ${S.week} из 4: ${prog.week.name.toLowerCase()}. ${prog.week.note}`];
    for (const d of prog.days) {
      out.push('', `${WD_FULL[d.wd]} — ${d.name}${d.plan.items ? `, ≈${d.plan.minutes} мин` : ''}`);
      if (d.plan.items) out.push(...blocksText(d.plan)); else out.push('нет упражнений с выбранным оборудованием');
    }
    return out.join('\n');
  }
  return [`${titleFor()} — ${G.name.toLowerCase()}, ${FORMATS[S.format].name.toLowerCase()}, ≈${plan.minutes} мин`, ''].concat(blocksText(plan)).join('\n');
}

/* ---------- события ---------- */
/* место тренировок: название и источник программы */
document.addEventListener('change', e => {
  if (e.target.id === 'place-name') { const v = e.target.value.trim().slice(0, 24), p = placeOf(); if (v && v !== p.name) { p.name = v; delete p.auto; } saveSettings(); renderSetup(); return; }
  if (e.target.id === 'place-adapt') { S.adapt = e.target.value || null; ensurePlaces(S); return regen(); }
});
const swapKey = () => S.mode === 'program' ? 'd' + S.day : 's';
function regen(resetSwaps = true) { if (resetSwaps) swaps = S.swaps = {}; done = {}; planUndo = null; saveSettings(); renderSetup(); renderPlan(); }
document.addEventListener('click', e => {
  const t = e.target.closest('button, summary');
  if (!t) return;
  if (t.dataset.set) {
    const k = t.dataset.set, prev = S.mode; S[k] = t.dataset.v;
    if (k === 'mode') { S.day = 0; switchModeSettings(prev); } else storePlanSetting(k);
    return regen();
  }
  if (t.dataset.days) { S.days = +t.dataset.days; S.split = DEFAULT_SPLIT[S.days]; S.day = 0; return regen(); }
  if (t.dataset.split) { S.split = t.dataset.split; S.day = 0; return regen(); }
  if (t.dataset.week) { S.week = +t.dataset.week; done = {}; saveSettings(); renderPlan(); return; }
  if (t.dataset.day !== undefined) {
    S.day = +t.dataset.day; done = {}; saveSettings(); renderPlan();
    const dh = $('.day-head'); if (dh) dh.scrollIntoView({block:'nearest', behavior:reduceMotion ? 'auto' : 'smooth'});
    return;
  }
  /* время на тренировку (11j-duration.js); «−» и «+» при заданном времени — своё число от подобранного, время снимается */
  if (t.dataset.dur !== undefined) { S.dur = t.dataset.dur || null; ensureDur(S); return regen(); }
  if (t.id === 'count-minus' || t.id === 'count-plus') {
    const n = shownCount(); S.dur = null;
    S.count = Math.max(3, Math.min(10, n + (t.id === 'count-plus' ? 1 : -1))); return regen();
  }
  if (t.dataset.g) { const g = t.dataset.g; S.groups = S.groups.includes(g) ? S.groups.filter(x => x !== g) : S.groups.concat(g); S.groups.sort((a, b) => GROUPS.findIndex(x => x.id === a) - GROUPS.findIndex(x => x.id === b)); return regen(); }
  if (t.dataset.gp) { S.groups = GROUP_PRESETS.find(p => p.id === t.dataset.gp).g.slice(); return regen(); }
  if (t.dataset.e) { eqOpen = true; const id = t.dataset.e; setPlaceEquip(S.equip.includes(id) ? S.equip.filter(x => x !== id) : S.equip.concat(id)); return regen(); }
  if (t.dataset.ep) { setPlaceEquip(EQUIP_PRESETS.find(p => p.id === t.dataset.ep).eq); return regen(); }
  if (t.dataset.place) { S.place = t.dataset.place; ensurePlaces(S); placeDel = false; return regen(); }
  if (t.dataset.placeAdd !== undefined) {
    const id = 'p' + Date.now().toString(36);
    S.places.push({id, name:'Место ' + (S.places.length + 1), auto:'place:' + (S.places.length + 1), equip:[]});
    S.place = id; ensurePlaces(S); eqOpen = true; placeDel = false; regen();
    const inp = $('#place-name'); if (inp) { inp.focus(); inp.select(); }
    return;
  }
  if (t.dataset.placeDel !== undefined) {
    if (!placeDel) { placeDel = true; return renderSetup(); }
    S.places = S.places.filter(p => p.id !== S.place); placeDel = false; ensurePlaces(S); return regen();
  }
  if (t.id === 'reroll') { S.seed = (S.seed * 48271 + 11) % 2147483647; regen(); $('#plan').scrollIntoView({behavior:reduceMotion ? 'auto' : 'smooth', block:'start'}); return; }
  if (t.id === 'copy') {
    const txt = planText(), msg = $('#copy-msg');
    const fallback = () => { msg.innerHTML = 'Скопировать автоматически не удалось. Выделите текст:<textarea readonly rows="6"></textarea>'; const ta = msg.querySelector('textarea'); ta.value = txt; ta.focus(); ta.select(); };
    try { navigator.clipboard.writeText(txt).then(() => { msg.textContent = 'Скопировано — можно вставить в заметки или мессенджер.'; }, fallback); } catch (err) { fallback(); }
    return;
  }
  /* «Заменить» — список замен под кнопкой и «Вернуть»: 12c-swap.js */
  /* порядок упражнений: ↑ ↓ на карточке (в своём плане — свои кнопки, 11d-custom.js) */
  if (t.dataset.move !== undefined) {
    const slot = +t.dataset.move, d = +t.dataset.d;
    if (!movePlanItem(slot, d)) return;
    planUndo = null; saveSettings(); renderPlan();
    const card = document.querySelector(`.card[data-slot="${slot}"]`);
    if (card) {
      card.classList.add('flash'); card.scrollIntoView({block:'nearest', behavior:reduceMotion ? 'auto' : 'smooth'});
      const b = card.querySelector(`[data-move][data-d="${d}"]:not([disabled])`) || card.querySelector('[data-move]:not([disabled])'); if (b) b.focus({preventScroll:true});
    }
    return;
  }
  if (t.dataset.round !== undefined) {
    const k = +t.dataset.round, cur = done.__rounds || 0;
    done.__rounds = cur === k + 1 ? k : k + 1;
    t.parentElement.querySelectorAll('.set').forEach((b, i) => b.classList.toggle('done', i < done.__rounds));
    const b = plan.blocks[0];
    if (done.__rounds > cur && done.__rounds < b.rounds) startRest(b.roundRest, `Отдых после круга ${done.__rounds}`);
    return;
  }
  if (t.dataset.fig !== undefined) {openMotion(t.dataset.fig);return;}
  if (t.id === 'e-toggle' || t.id === 'e-toggle-top') {
    eqOpen = !eqOpen; renderSetup();
    /* свернули снизу длинного списка — вернуть взгляд к заголовку раздела */
    if (!eqOpen && t.id === 'e-toggle') { const h = $('.e-head'); if (h && h.getBoundingClientRect().top < 0) h.scrollIntoView({block:'start', behavior:reduceMotion ? 'auto' : 'smooth'}); }
    return;
  }
  if (t.id === 't-minus') return adjustRest(-15);
  if (t.id === 't-plus') return adjustRest(15);
  if (t.id === 't-skip') return stopRest();
});
