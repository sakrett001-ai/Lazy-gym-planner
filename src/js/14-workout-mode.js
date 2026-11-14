/* Режим тренировки использует тот же журнал, что и карточки плана. */
let workout=null,workoutTimer=0,workoutReturn=null,workoutReplanning=false;
const WORKOUT_STORE='podhod.workout.v3';
/* Экран не гаснет, пока открыт режим тренировки (Screen Wake Lock: Chrome; Safari с 16.4; приложение с экрана «Домой» на
   iPhone — с iOS 18.4). Уходя с экрана, страница теряет блокировку — при возвращении она берётся снова. Без поддержки всё
   работает как раньше: экран гаснет по настройкам телефона. */
const ScreenAwake=(()=>{
  let want=false,lock=null,asking=false;
  const free=l=>{try{const p=l.release();if(p&&p.catch)p.catch(()=>{});}catch(e){}};
  async function take(){
    const wl=typeof navigator!=='undefined'&&navigator.wakeLock;
    if(!want||lock||asking||!wl||typeof wl.request!=='function'||document.visibilityState==='hidden')return;
    asking=true;
    try{const l=await wl.request('screen');if(!want){free(l);return;}lock=l;if(l&&l.addEventListener)l.addEventListener('release',()=>{if(lock===l)lock=null;});}
    catch(e){}finally{asking=false;}
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)take();});
  return{on(){want=true;return take();},off(){want=false;const l=lock;lock=null;if(l)free(l);},state:()=>({want,held:!!lock})};
})();
/* удержания с таймером — упражнения на время, кроме кардио (беговая дорожка, прыжки — не удержание) */
const isHold=ex=>ex.kind==='time'&&ex.g!=='cardio';
function workoutQueue(p){
  const q=[];
  for(const b of p.blocks){
    if(b.kind==='list')for(const it of b.items)for(let k=0;k<it.rx.sets;k++)q.push({it,k,n:it.rx.sets,rest:restAfter(it.rx,k),phase:it.rx.static?`Статодинамика · серия ${Math.floor(k/3)+1} из ${it.rx.series}`:'Классика'});
    if(b.kind==='pair')for(let k=0;k<Math.max(b.sets,...b.items.map(it=>it.rx.sets));k++){
      const active=b.items.filter(it=>k<it.rx.sets);active.forEach((it,j)=>q.push({it,k,n:it.rx.sets,rest:j===active.length-1?b.rest:0,phase:`Суперсет ${b.letter} · круг ${k+1}`}));
    }
    if(b.kind==='circuit'){
      const rounds=Math.max(b.rounds,...b.items.map(it=>it.rounds||b.rounds));
      for(let k=0;k<rounds;k++){const active=b.items.filter(it=>k<(it.rounds||b.rounds));active.forEach((it,j)=>q.push({it,k,n:it.rounds||b.rounds,rest:j===active.length-1?b.roundRest:b.rest,phase:`Круг ${k+1} из ${rounds}`}));}
    }
  }
  return q;
}
/* план тренировки без даты: день — отдельно (workout.days), чтобы тренировку можно было продолжить и на следующий день
   (14a-workout-flow.js) */
function workoutStamp(q){return JSON.stringify([S.mode,S.day,S.week,S.format,S.goal,q.map(x=>[x.it.ex.id,x.k,x.n,x.rest,x.it.rx.reps])]);}
/* дни журнала этой тренировки и сегодняшний */
function workoutDays(){return wkDaysWith(workout?.days||[],todayKey());}
/* записанный подход: в любом дне тренировки (вчерашние подходы продолженной тренировки — сделаны) */
function workoutValue(step){return wkSet(LOG.data,step.it.ex.id,step.k,workoutDays());}
/* запись дня, где лежит подход (правка вчерашнего подхода — во вчерашней записи), или сегодняшняя для нового */
function workoutSession(step,create){return wkSession(LOG.data,step.it.ex.id,step.k,workoutDays())||todaySession(step.it.ex.id,!!create);}
/* подходы упражнения во всех днях тренировки по номерам (сегодняшние — поверх вчерашних): как запись дня в карточке */
function workoutSetsOf(id){const days=workoutDays(),out=[];for(let i=days.length-1;i>=0;i--){const x=(LOG.data[id]||[]).find(v=>v.d===days[i]);if(x)x.s.forEach((v,k)=>{if(v&&!out[k])out[k]=v;});}return out;}
function workoutFirstOpen(q,after=-1){return wkFirstOpen(q,after,workoutValue,workout?.skipped);}
function workoutCount(){return workout?wkCount(workout.queue,workoutValue,workout,(id,k)=>wkSet(LOG.data,id,k,workoutDays())):{done:0,total:0};}
function workoutDraftKey(step){return step.it.ex.id+':'+step.k;}
/* время на экране тренировки, мс (до этого открытия и с момента открытия) */
function workoutSpent(now=Date.now()){return workout.spent+(workout.openAt?Math.max(0,now-workout.openAt):0);}
function saveWorkout(){
  if(!workout)return;
  const now=Date.now(),c=workoutCount();workout.savedAt=now;
  Keep.set(WORKOUT_STORE,JSON.stringify({stamp:workout.stamp,day:workout.days[0],days:workout.days,index:workout.index,started:workout.started,spent:workoutSpent(now),restUntil:workout.restUntil,restTotal:workout.restTotal,restFrom:workout.restFrom,restPaused:workout.restPaused,next:workout.next,last:workout.last,drafts:workout.drafts,skipped:workout.skipped,gone:workout.gone,ended:workout.ended,done:c.done,total:c.total,snap:workoutSnap(workout.queue)}));
}
function workoutLoad(){let o=null;try{o=JSON.parse(localStorage.getItem(WORKOUT_STORE)||'null');}catch(e){}return wkNormalize(o,Date.now(),todayKey());}
/* план: «Начать тренировку →», «Продолжить тренировку →» со сделанным или вопрос о тренировке прошлого дня */
function workoutPlanState(){
  if(!plan?.items?.length)return{kind:'start'};
  const saved=workoutLoad();
  return wkPlanState(saved,{today:todayKey(),queue:workoutQueueNow(saved),data:LOG.data});
}
function yesterdayKey(){const d=new Date();d.setDate(d.getDate()-1);return dayKey(d);}
const doneOfText=(n,total)=>`${n} ${'из'} ${total} ${plural(total,'подхода','подходов','подходов')}`;
function workoutStartHtml(w=workoutPlanState()){
  return w.kind==='continue'?`${'Продолжить тренировку →'}<small class="wip-n">${doneOfText(w.done,w.total)}</small>`:'Начать тренировку →';
}
/* вопрос в плане: тренировка прошлого дня не закончена — её подходы уже в журнале */
function workoutAskHtml(w=workoutPlanState()){
  if(w.kind!=='ask')return '';
  const y=yesterdayKey()===w.day,when=y?'Вчерашняя тренировка не закончена':`${'Тренировка'} ${fmtDay(w.day,true)} ${'не закончена'}`;
  return `<section class="wip-ask" id="wip-ask" aria-labelledby="wip-ask-h"><h2 id="wip-ask-h">${when}</h2><p>${doneOfText(w.done,w.total)} ${'— они уже в журнале.'}${w.can?'':` ${'В нынешнем плане этих упражнений нет — продолжить её здесь нельзя.'}`}</p>`
    +`<div class="wip-ask-b">${w.can?`<button type="button" class="btn" data-wip="go">${y?'Продолжить вчерашнюю':'Продолжить её'}</button>`:''}<button type="button" class="btn btn-2" data-wip="end">${'Закончить её'}</button></div></section>`;
}
/* после выхода из тренировки и ответа на вопрос: кнопка и вопрос в плане — без пересборки плана (фокус и прокрутка на месте) */
function paintStartButtons(){
  const w=workoutPlanState(),b=$('#start-workout');if(!b)return;
  const html=workoutStartHtml(w);if(b.innerHTML!==html)b.innerHTML=html;
  const ask=$('#wip-ask'),want=workoutAskHtml(w);
  if(ask&&!want)ask.remove();else if(!ask&&want)b.closest('.p-btns')?.insertAdjacentHTML('beforebegin',want);
}
/* «Закончить её»: тренировка прошлого дня закрыта, её подходы остаются в журнале */
function workoutEndSaved(){
  const o=workoutLoad();if(!o)return;o.ended=true;
  Keep.set(WORKOUT_STORE,JSON.stringify(o));
}
/* введённое в полях подхода: общее (kg, reps) и по сторонам (kl, rl — левая, kr, rr — правая) */
function workoutInputs(){return{kg:$('#wv-kg').value,reps:$('#wv-reps').value,kl:$('#wv-kg-l').value,rl:$('#wv-reps-l').value,kr:$('#wv-kg-r').value,rr:$('#wv-reps-r').value};}
function workoutCapture(){
  if(!workout||$('#wv-active').hidden)return;
  const step=workout.queue[workout.index];if(!step)return;
  workout.drafts[workoutDraftKey(step)]=workoutInputs();saveWorkout();
}
/* opts.cont — «Продолжить вчерашнюю» в вопросе плана: тренировка прошлого дня продолжается, новые подходы — сегодняшним днём */
function startWorkout(id,opts={}){
  if(!plan?.items?.length)return;
  workoutReturn=document.activeElement;
  /* начатая тренировка идёт по своему списку упражнений, даже если план с тех пор собрался иначе (новая версия приложения):
     workoutQueueNow, 18a-data-keep.js (Ксения 12) */
  const old=workoutLoad(),queue=workoutQueueNow(old),stamp=workoutStamp(queue),today=todayKey(),now=Date.now();
  const oldDays=old?wkDaysWith(old.days,today):[today],done=old?wkCount(queue,s=>wkSet(LOG.data,s.it.ex.id,s.k,oldDays),old).done:0;
  const how=wkResume(old,{today,stamp,cont:!!opts.cont,done}),keep=how!=='new',same=how==='same'&&old.stamp===stamp;
  workout={queue,stamp,index:0,days:keep?oldDays:[today],started:keep&&Number.isFinite(old.started)?old.started:now,spent:keep?old.spent:0,openAt:now,
    drafts:keep&&old.drafts&&typeof old.drafts==='object'?old.drafts:{},skipped:keep?old.skipped:[],gone:keep?old.gone:[],ended:false,
    restUntil:0,restTotal:0,restFrom:0,restPaused:0,next:-1,last:-1,motion:null,hold:null,restOver:null,sideNote:'',skipUndo:null};
  const first=workoutFirstOpen(queue);
  if(same){workout.index=Math.max(0,Math.min(queue.length-1,Math.trunc(old.index)||0));workout.restUntil=Number(old.restUntil)||0;workout.restTotal=Number(old.restTotal)||0;workout.restFrom=Number(old.restFrom)||0;workout.restPaused=old.restPaused;workout.next=Number.isInteger(old.next)?old.next:-1;workout.last=Number.isInteger(old.last)?old.last:-1;}
  else workout.index=Math.max(0,first);
  if(id){const i=queue.findIndex(x=>x.it.ex.id===id&&!workoutValue(x));workout.index=i>=0?i:Math.max(0,queue.findIndex(x=>x.it.ex.id===id));workout.restUntil=0;workout.restPaused=0;}
  /* каждое открытие тренировки — новая попытка показать кости и мышцы (и загрузить их, если прошлая не удалась) */
  workoutFigure.slow=false;workoutFigure.failed=false;workoutFigure.pace.reset();
  const d=$('#workout-view');if(!d.open)d.showModal();document.documentElement.classList.add('workout-open');stopRest();ScreenAwake.on();
  /* системная «Назад» закрывает тренировку, а не приложение (12d-back.js) */
  OverlayBack.open('workout',()=>closeWorkout(true));
  Heart.open(); /* пульсометр: 14b-heart.js */
  $('#wv-context').textContent=S.mode==='program'?`${WD_FULL[prog.days[S.day].wd]} · ${prog.days[S.day].name}`:`${GOALS[S.goal].name} · ${FORMATS[S.format].name}`;
  workoutOptions();
  if(first<0&&!id)workoutFinish();
  else if(workout.restUntil&&workout.next>=0&&workout.next<queue.length){RestAlarm.unlock();if(!workout.restPaused)RestAlarm.arm(workout.restUntil,{from:workout.restFrom||undefined});workoutShowRest();}
  else workoutShow(workout.index);
  clearInterval(workoutTimer);workoutTimer=setInterval(workoutTick,250);workoutTick();saveWorkout();$('#wv-close').focus();scheduleMotionLoop();
}
/* список упражнений в выборе: пропущенные — с пометкой */
function workoutOptions(){
  const its=[...new Map(workout.queue.map(x=>[x.it.ex.id,x.it])).values()],skip=new Set(workout.skipped);
  $('#wv-exercise').innerHTML=its.map(it=>`<option value="${it.ex.id}">${esc(it.label+'. '+it.name)}${skip.has(it.ex.id)?' · '+'пропущено':''}</option>`).join('');
}
/* fromBack — закрыто системной «Назад»: запись истории уже снята */
function closeWorkout(fromBack){
  if(!workout)return;holdStop();workoutCapture();if(workout.openAt){workout.spent=workoutSpent();workout.openAt=0;}saveWorkout();disposeMotion(workout.motion);clearInterval(workoutTimer);workoutTimer=0;ScreenAwake.off();
  Heart.close();
  const d=$('#workout-view');if(d.open)d.close();document.documentElement.classList.remove('workout-open');d.classList.remove('rest-over');workout.restOver=null;
  if(fromBack!==true)OverlayBack.closed('workout');
  /* кнопка, с которой открыли, могла пересобраться вместе с планом (замена в тренировке) — тогда фокус на «Продолжить тренировку» */
  logRefresh(null);paintStartButtons();(workoutReturn?.isConnected?workoutReturn:$('#start-workout'))?.focus();workoutReturn=null;
  /* вид фигуры мог смениться на экране тренировки — карточки плана берут его же */
  if(figs.some(F=>F.card))applyCardsView();
}
function workoutShow(index){
  if(!workout)return;
  workout.index=Math.max(0,Math.min(workout.queue.length-1,index));workout.restUntil=0;workout.restFrom=0;workout.restPaused=0;workout.next=-1;workout.sideNote='';workout.holdPair=null;RestAlarm.cancel();paintRestPhase(false);workoutAskHide();
  const s=workout.queue[workout.index],it=s.it,ex=it.ex,stored=workoutValue(s),sg=suggest(it),hold=isHold(ex);
  workout.shown=JSON.stringify(stored||null); /* что было записано у подхода, когда его показали (запись из другой вкладки — workoutTaken) */
  const prev=sg.prev?.s[s.k]||sg.prev?.s.filter(Boolean).slice(-1)[0];
  $('#wv-active').hidden=false;$('#wv-rest').hidden=true;$('#wv-finish').hidden=true;
  $('#wv-title').textContent=it.name;$('#wv-exercise').value=ex.id;paintExerciseTools();
  $('#wv-set-label').textContent=`${s.phase} · подход ${s.k+1} из ${s.n}`;
  $('#wv-equipment').textContent=it.eqLine;
  /* цель подхода: у пирамиды повторов своего плана — число этого подхода */
  $('#wv-target').textContent=planReps(it.rx,s.k)+(ex.kind?'':' повторов');
  const unit=ex.kind==='time'?'с':ex.kind==='dist'?'м':'повт.',psd=prev&&setSides(prev,ex);
  /* прошлых тренировок нет: «Первая запись», пока в тренировке ничего не записано, потом — «—» */
  const todayN=workoutSetsOf(ex.id).filter(Boolean).length;
  $('#wv-previous').textContent=psd?`${setText(prev,ex)} ${unit}`:prev?`${prev[0]!=null?fmtW(prev[0])+' × ':''}${prev[1]} ${unit}`:todayN?'—':'Первая запись';
  $('#wv-previous-date').textContent=sg.prev?fmtDay(sg.prev.d,true):'';
  $('#wv-set-chips').innerHTML=workout.queue.map((x,i)=>x.it.ex.id===ex.id?`<button type="button" data-wv-index="${i}" class="${workoutValue(x)?'is-done ':''}${i===workout.index?'is-current':''}" aria-label="Подход ${x.k+1}${workoutValue(x)?', выполнен':''}" aria-current="${i===workout.index?'step':'false'}">${workoutValue(x)?'✓ ':''}${x.k+1}</button>`:'').join('');
  workoutFill(s,sg,prev);
  $('#wv-done').textContent=stored?'Сохранить изменения':'Подход выполнен';$('#wv-save-status').textContent=stored?'Этот подход уже записан.':'Запись появится в общем журнале.';
  $('#wv-suggestion').textContent=sg.text;
  holdSetup(s,sg);
  const cue=MOTION_FOCUS[ex.id];$('#wv-setup').textContent=cue?.setup||ex.tech[0];$('#wv-control').textContent=cue?.control||ex.tech[1];$('#wv-breath').textContent=ex.breath;
  disposeMotion(workout.motion);workout.motion={it,f:null,clock:0,paused:reduceMotion,durations:motionDurations(it)};$('#wv-angle').textContent=CAMERA3[motionCamera(ex)].label;
  $('#wv-motion').textContent=reduceMotion?'Воспроизвести':'Пауза';mountWorkoutCameras();
  $('#wv-prev').disabled=workout.index===0;$('#wv-next').disabled=workout.index===workout.queue.length-1;
  Heart.set(s);
  saveWorkout();workoutTick();
}
/* поля подхода: подписи (вес одной гантели, повторы на каждую сторону), общий ввод или Л/П, подстановка веса */
function workoutFill(s,sg,prev){
  const it=s.it,ex=it.ex,stored=workoutValue(s),lt=loadType(ex),hold=isHold(ex),wl=weightLabel(it),lr=lrOn(ex),side=perSide(ex);
  $('#wv-unilateral').hidden=!side;$('#wv-unilateral').textContent=hold?'Обе стороны — в одном подходе: левая, пауза 10 с, правая. Записываются обе стороны, прогресс — по времени слабой стороны.'
    :lr?'Запишите результат каждой стороны. Прогресс и подсказки — по слабой стороне.':sidesOf(ex)==='alt'?'Чередуйте стороны. Запишите количество повторов для одной стороны.':'Выполните обе стороны. Запишите количество повторов для одной стороны.';
  $('#wv-lr-bar').hidden=!side;$('#wv-lr').setAttribute('aria-pressed',String(lr));$('#wv-one').hidden=lr;$('#wv-lr-fields').hidden=!lr;
  $('#wv-weight-label').hidden=lt==='none';$('#wv-weight-caption').textContent=wl?wl.full:`Вес, ${wUnit()}`;$('#wv-rep-caption').textContent=side&&!ex.kind?'Повторы на каждую сторону':repLabel(ex);
  $('#wv-lr-fields').classList.toggle('wv-lr-nokg',lt==='none');$('#wv-lr-kg-cap').textContent=wl?wl.full:`Вес, ${wUnit()}`;$('#wv-lr-rep-cap').textContent=repLabel(ex);
  for(const id of ['wv-reps','wv-reps-l','wv-reps-r'])$('#'+id).setAttribute('inputmode',ex.kind==='dist'?'decimal':'numeric');
  /* подходы упражнения в этой тренировке (продолженной — и вчерашние): по ним вес на следующие подходы */
  const draft=workout.drafts[workoutDraftKey(s)],today=workoutSetsOf(ex.id);
  /* вес: записанный сегодня в подходе выше (carriedKg — то же правило, что в карточке: свой вес подхода по плану или
     по пирамиде прошлого раза не перетирается), иначе свой вес подхода, иначе из прошлой тренировки */
  const own=ownKgs(it,sg.prev?sg.prev.s.filter(Boolean):[],sg),planned=own(s.k),kgText=v=>v!=null?fmtKg(v):'',carried=carriedKg(it,today,s.k,null,own);
  $('#wv-kg').value=draft?draft.kg:stored?kgText(stored[0]):carried!=null?fmtKg(carried):planned!=null?fmtKg(planned):prev?.[0]!=null?fmtKg(prev[0]):'';
  /* подсказка повторов — цель подхода со словом «цель»: серое «12–15» без него выглядело введённым */
  const goal='цель '+planReps(it.rx,s.k);
  $('#wv-reps').value=draft?draft.reps:stored?String(stored[1]):'';$('#wv-reps').placeholder=goal;
  /* Л/П: записанные стороны, иначе — общий вес; вес стороны по умолчанию — из подхода выше по своей стороне, из прошлых
     сторон, если они были */
  const ssd=stored&&setSides(stored,ex),psd=prev&&setSides(prev,ex);
  for(const k of ['l','r']){
    const ck=carriedKg(it,today,s.k,k,own),kgDef=ck!=null?fmtKg(ck):planned!=null?fmtKg(planned):psd?kgText(psd[k][0]):prev?.[0]!=null?fmtKg(prev[0]):'';
    $('#wv-kg-'+k).value=draft&&draft['k'+k]!==undefined?draft['k'+k]:ssd?kgText(ssd[k][0]):stored?kgText(stored[0]):kgDef;
    $('#wv-reps-'+k).value=draft&&draft['r'+k]!==undefined?draft['r'+k]:ssd?String(ssd[k][1]):stored?String(stored[1]):'';$('#wv-reps-'+k).placeholder=goal;
  }
  workoutPairTotal();
  $('#wv-input-hint').textContent=hold?(lt==='extra'?'Доп. вес можно оставить пустым. ':'')+'«Стоп» запишет секунды и начнёт отдых. Секунды можно ввести и вручную.'
    :lt==='extra'?(wl.impl==='db'?'Без гантелей оставьте вес пустым. Введите фактический результат.':'Дополнительный вес можно оставить пустым. Введите фактический результат.'):lt==='none'?'Укажите фактический результат подхода.':'Вес подставлен из последней записи, если она есть. Уточните его и введите результат.';
  $('#wv-error').textContent='';for(const id of ['wv-kg','wv-reps','wv-kg-l','wv-reps-l','wv-kg-r','wv-reps-r'])$('#'+id).removeAttribute('aria-invalid');
}
/* «×2 = 40 кг» под весом одной гантели, когда их две */
function workoutPairTotal(){
  const step=workout?.queue[workout.index];if(!step)return;
  const wl=weightLabel(step.it),v=parseKg($('#wv-kg').value),t=wl&&wl.n>1&&!lrOn(step.it.ex)?pairTotalText(wl.n,v):'';
  if($('#wv-kg-total').textContent!==t)$('#wv-kg-total').textContent=t;
}
/* «Л/П отдельно»: включили — введённое общее значение в обе стороны (вес — всегда, повторы — в пустые поля сторон);
   выключили — слабая сторона (если обе заполнены), иначе левая */
function workoutLrToggle(){
  const step=workout.queue[workout.index],ex=step.it.ex,on=!lrOn(ex),d=workoutInputs();
  if(on){if(d.kg.trim())d.kl=d.kr=d.kg;if(d.reps.trim()){if(!d.rl.trim())d.rl=d.reps;if(!d.rr.trim())d.rr=d.reps;}}
  else{
    const L=[parseNum(d.kl),parseNum(d.rl)],R=[parseNum(d.kr),parseNum(d.rr)];
    if(L[1]>0&&R[1]>0){const w=weakSide(L,R,ex)==='l';d.kg=w?d.kl:d.kr;d.reps=w?d.rl:d.rr;}else if(d.kl||d.rl){d.kg=d.kl||d.kg;d.reps=d.rl||d.reps;}
  }
  workout.drafts[workoutDraftKey(step)]=d;lrSet(ex,on);saveWorkout();
  const sg=suggest(step.it);workoutFill(step,sg,sg.prev?.s[step.k]||sg.prev?.s.filter(Boolean).slice(-1)[0]);
  $('#wv-lr').focus();
}
/* в «Анатомии» фаза — по сетке кадров карточек (cardClock, отличие от точного времени ≤17 мс): со второго круга матрицы костей
   фаз берутся из памяти фигуры (memoBones в src/volume/main.mjs) */
function paintWorkoutMotion(){if(!workout?.motion)return;const F=workout.motion,m=motionFrame(F,workoutAnatomyLive()?cardClock(F):F.clock);F.f.at(m.t,m);if($('#wv-cue').textContent!==m.cue)$('#wv-cue').textContent=m.cue;paintMusclePanel('wv',F,m);paintStressPanel('wv',F,m);}
/* вопрос о весе под полями подхода: «Записать» записывает как есть, «Исправить» (и Esc) — фокус в поле веса; пока вопрос
   открыт, «Подход выполнен» скрыта — ответ один из двух; правка веса закрывает вопрос */
function workoutAsk(q,side){const b=$('#wv-kg-ask');$('#wv-kg-ask-t').textContent=q.text;b.dataset.side=side||'';b.hidden=false;$('#wv-done').hidden=true;$('#wv-kg-fix').focus();}
function workoutAskHide(){const b=$('#wv-kg-ask');if(!b||b.hidden)return false;b.hidden=true;$('#wv-done').hidden=false;return true;}
function workoutAskFix(){const side=$('#wv-kg-ask').dataset.side;workoutAskHide();const inp=$(side?'#wv-kg-'+side:'#wv-kg');inp.focus();inp.select();}
function strictWorkoutNumber(value){const s=String(value).trim().replace(',','.');return /^\d+(\.\d+)?$/.test(s)?Number(s):null;}
/* sure — вес уже подтвердили («Записать» в вопросе о весе) */
function commitWorkout(e,sure){
  if(e)e.preventDefault();if(!workout||$('#wv-active').hidden)return;
  const step=workout.queue[workout.index],ex=step.it.ex,lt=loadType(ex),lr=lrOn(ex);
  /* одна пара «вес × повторы» или две — левая и правая */
  const read=(kgEl,repsEl)=>{
    const kgRaw=kgEl.value.trim(),reps=strictWorkoutNumber(repsEl.value),kg=lt==='none'?null:kgRaw?strictWorkoutNumber(kgRaw):null;
    if(lt!=='none'&&kgRaw&&kg===null)return{bad:kgEl,msg:'Введите вес числом, например 12,5.'};
    if(lt==='kg'&&(kg===null||kg<=0))return{bad:kgEl,msg:'Укажите фактический вес снаряда.'};
    if(reps===null||reps<=0||(!ex.kind&&!Number.isInteger(reps)))return{bad:repsEl,msg:ex.kind?'Укажите фактический результат числом больше нуля.':'Укажите целое количество выполненных повторов.'};
    return{kg:kg==null?null:fromU(kg),reps:Math.round(reps*10)/10}; /* вписано в выбранных единицах, хранится в килограммах */
  };
  const got=lr?[read($('#wv-kg-l'),$('#wv-reps-l')),read($('#wv-kg-r'),$('#wv-reps-r'))]:[read($('#wv-kg'),$('#wv-reps'))],bad=got.find(g=>g.bad),pair=workout.holdPair;
  workout.holdPair=null;
  if(bad){$('#wv-error').textContent=bad.msg;bad.bad.setAttribute('aria-invalid','true');bad.bad.focus();return;}
  /* неправдоподобный вес («5000» вместо «50») — не записывать, переспросить под полями: «Записать» / «Исправить» (kgDoubt, 13-log.js) */
  const q=!sure&&kgDoubt(step.it,got.map(g=>g.kg),step.k);
  if(q){workout.holdPair=pair;workoutAsk(q,lr?(got[1].kg>got[0].kg?'r':'l'):'');return;}
  workoutAskHide();
  /* отдых, уже записанный у этого подхода (третье поле), при исправлении сохраняется; правка подхода — в его же дне журнала,
     новый подход — сегодняшним днём */
  /* подход под этим номером записала другая вкладка, пока здесь он был пустым (Артём 3, Ксения 3): здешний — следующим номером,
     ни один не затирается (workoutTaken, 18a-data-keep.js) */
  const taken=workoutTaken(step);
  if(taken)return workoutCommitTaken(step,got,taken);
  const already=!!workoutValue(step),session=workoutSession(step,true),rest=already?restField(session.s[step.k][2]):null;
  if(!already&&!workout.days.includes(session.d))workout.days.push(session.d);
  if(!already)markActive(session.d);
  /* записали пропущенное упражнение — оно снова в тренировке */
  if(workout.skipped.includes(ex.id)){workout.skipped=workout.skipped.filter(x=>x!==ex.id);workoutOptions();}
  while(session.s.length<step.k)session.s.push(null);
  let rec;
  if(lr)rec=makeSidedSet([got[0].kg,got[0].reps],[got[1].kg,got[1].reps],ex,rest);
  else if(pair)rec=makeSidedSet([got[0].kg,pair[0]],[got[0].kg,pair[1]],ex,rest); /* таймер боковой планки: обе стороны, основное — слабая */
  if(!rec){rec=[got[0].kg,got[0].reps];if(rest)rec.push(rest);}
  session.s[step.k]=rec;session.target=Math.max(session.target||0,step.n);if(step.it.rx.static)session.fmt='static';markImpl(session,step.it);delete workout.drafts[workoutDraftKey(step)];
  logTouch(ex.id);logRefresh([ex.id]);workout.last=workout.index;
  if(already){workoutShow(workout.index);$('#wv-save-status').textContent='Изменения сохранены.';return;}
  Heart.setDone(step);
  const next=workoutFirstOpen(workout.queue,workout.index);
  if(next<0){workoutFinish();return;}
  if(step.rest>0){const now=Date.now();workout.next=next;workout.restTotal=step.rest;workout.restFrom=now;workout.restUntil=now+step.rest*1000;workout.restPaused=0;RestAlarm.unlock();RestAlarm.arm(workout.restUntil,{from:now});workoutShowRest();}
  else workoutShow(next);
  saveWorkout();
}
/* фактический отдых — от записи подхода до «Перейти к подходу» — третьим полем в запись подхода, после которого отдыхали */
function workoutRestTaken(){
  Heart.restDone();
  const sec=restActual(workout.restFrom,Date.now()),step=workout.queue[workout.last];workout.restFrom=0;workout.restPaused=0;
  if(!sec||!step)return;
  const v=workoutValue(step);
  if(Array.isArray(v)){v[2]=sec;logTouch(step.it.ex.id);}
}
function workoutShowRest(){
  holdStop();$('#wv-active').hidden=true;$('#wv-rest').hidden=false;$('#wv-finish').hidden=true;RestAlarm.paintButton($('#wv-sound'));RestAlarm.paintPrefs();
  const next=workout.queue[workout.next];
  $('#wv-next-name').textContent=next.it.name;$('#wv-next-detail').textContent=`${next.phase} · подход ${next.k+1} из ${next.n} · ${planReps(next.it.rx,next.k)}${next.it.ex.kind?'':' повторов'}`;
  $('#wv-rest-note').textContent=workout.sideNote||restNote();workout.sideNote='';workout.restOver=null;paintRestPause();workoutTick();
  /* экран отдыха — с начала, фокус на «Перейти к подходу»; при крупном масштабе кнопка докручивается в окно, а таймер
     остаётся сверху (.wv-rest-clock прилипает к верху — 40-workout-flow.css) */
  $('#workout-view').scrollTop=0;const go=$('#wv-continue');go.focus({preventScroll:true});go.scrollIntoView({block:'nearest'});
}
/* после подхода: общий вес подхода, если он считается (внешний вес), и слабая сторона, если стороны отличались */
function restNote(){
  const step=workout.queue[workout.last],x=step&&workoutValue(step);
  if(!x)return 'Результат сохранён. Переходите дальше, когда будете готовы.';
  const ex=step.it.ex,t=setTonnage(ex,x,sessionImpl(ex,workoutSession(step))),w=weakSideNote(ex,{s:[x]});
  return (t>0?`Результат сохранён: общий вес подхода ${fmtTon(t)} ${wUnit()}.`:'Результат сохранён.')+(w?' '+w:'')+' Переходите дальше, когда будете готовы.';
}
/* общий вес упражнения за тренировку (продолженной — за все её дни) */
function workoutTonnage(ex){return workoutDays().reduce((a,d)=>a+sessionTonnage(ex,(LOG.data[ex.id]||[]).find(x=>x.d===d)),0);}
/* Отдых закончился — спокойно: без смены цвета экрана, заголовок «Можно продолжать», рядом с ним нейтральная отметка
   «Отдых окончен · +0:25» (время считает вверх), диктору — один раз «Можно продолжать» */
function paintRestPhase(over){
  if(!workout)return;workout.restOver=over;
  $('#wv-rest').classList.toggle('is-done',over);$('#wv-rest-done').hidden=!over;
  $('#wv-rest-say').textContent=over?'Можно продолжать':'';$('#wv-rest-minus').disabled=over;paintRestPause();
}
/* ⏸ — пауза отдыха: время стоит, сигналов нет; ▶ — дальше с того же места. После нуля паузы нет. Имя кнопки одно —
   «Пауза отдыха», нажата — отдых на паузе (как 🔔 «Звук таймеров») */
function paintRestPause(){
  if(!workout)return;
  const p=!!workout.restPaused,over=!!workout.restOver,b=$('#wv-rest-pause');
  $('#wv-rest-heading').textContent=over?'Можно продолжать':p?'Отдых на паузе':'Отдых';
  $('#wv-rest-over').textContent=p?'Время стоит — ▶ продолжит отдых':'';$('#wv-rest').classList.toggle('is-paused',p);
  if(b){b.setAttribute('aria-pressed',String(p));b.textContent=p?'▶':'⏸';b.disabled=over&&!p;}
}
function workoutRestPause(){
  const now=Date.now(),r=restPauseToggle(workout.restUntil,workout.restPaused,now);
  if(r.end===workout.restUntil&&r.paused===workout.restPaused)return;
  workout.restUntil=r.end;workout.restPaused=r.paused;
  if(r.paused)RestAlarm.cancel();else RestAlarm.arm(r.end,{from:workout.restFrom||undefined});
  $('#wv-rest-say').textContent=r.paused?'Отдых на паузе':'Отдых продолжается';
  paintRestPause();saveWorkout();workoutTick();
}
function workoutFinish(){
  workout.restUntil=0;workout.restFrom=0;workout.restPaused=0;workout.next=-1;workout.ended=true;RestAlarm.cancel();holdStop();paintRestPhase(false);$('#wv-active').hidden=true;$('#wv-rest').hidden=true;$('#wv-finish').hidden=false;
  const skip=new Set(workout.skipped),its=[...new Map(workout.queue.map(s=>[s.it.ex.id,s.it])).values()],doneOf=id=>workout.queue.filter(s=>s.it.ex.id===id&&workoutValue(s)).length;
  /* заменённые в тренировке упражнения с записанными подходами — тоже в итогах */
  const inQ=new Set(its.map(it=>it.ex.id)),days=workoutDays(),gone=workout.gone.filter(g=>!inQ.has(g.id)&&EXI[g.id]).map(g=>({ex:EXI[g.id],name:g.name||EXI[g.id].name,n:g.ks.filter(k=>wkSet(LOG.data,g.id,k,days)).length})).filter(g=>g.n);
  const rows=its.map(it=>({ex:it.ex,name:it.name,n:doneOf(it.ex.id),skip:skip.has(it.ex.id)})).concat(gone.map(g=>({...g,swapped:true})));
  const n=rows.reduce((a,r)=>a+r.n,0),worked=rows.filter(r=>r.n).length,tons=rows.map(r=>r.n?workoutTonnage(r.ex):0),total=tons.reduce((a,b)=>a+b,0);
  $('#wv-finish-text').textContent=`Выполнено ${n} ${plural(n,'подход','подхода','подходов')} в ${worked} ${plural(worked,'упражнении','упражнениях','упражнениях')}.`+(total>0?` Общий вес — ${fmtTon(total)} ${wUnit()}.`:'');
  Heart.finish();
  $('#wv-summary').innerHTML=rows.map((r,i)=>`<p><span>${esc(r.name)}${r.swapped?` <small>${'заменено'}</small>`:''}</span><strong>${tons[i]>0?`<small>${fmtTon(tons[i])+' '+wUnit()}</small>`:''}${!r.n&&r.skip?`<small>${'пропущено'}</small>`:r.n+' ✓'}</strong></p>`).join('');saveWorkout();workoutTick();
}
function workoutTick(){
  if(!workout)return;
  const now=Date.now(),c=workoutCount();$('#wv-progress').max=Math.max(1,c.total);$('#wv-progress').value=c.done;$('#wv-progress-label').textContent=doneOfText(c.done,c.total);
  /* время тренировки — сколько открыт её экран (14a-workout-flow.js): в плане и между днями не идёт */
  const elapsed=wkMinutes(workout.spent,workout.openAt,now);$('#wv-elapsed').textContent=elapsed?`${elapsed} ${'мин в тренировке'}`:'';
  if(!$('#wv-rest').hidden){
    /* отдых «до пульса» может сдвинуть workout.restUntil; на паузе отдых стоит — пульс только показывается (Heart.paint) */
    if(!workout.restPaused)Heart.restTick(now);
    const v=restView(workout.restUntil,restClock(workout.restPaused,now));RestAlarm.poll(now);
    if($('#wv-rest-time').textContent!==v.text)$('#wv-rest-time').textContent=v.text;
    if(v.over!==workout.restOver)paintRestPhase(v.over);
  }
  if(workout.hold&&!$('#wv-active').hidden)paintHold(now);
  /* время на экране — в хранилище и без нажатий (страницу могут выгрузить в фоне) */
  if(workout.openAt&&now-(workout.savedAt||0)>15000)saveWorkout();
}

/* ---------- таймер удержания (планка, боковая планка, «стульчик», вис, «лодочка») ----------
   «Старт» → 3-2-1 → отсчёт до цели со звуком на нуле → счёт вверх «+7 с»; «Стоп» пишет секунды в поле и отмечает подход,
   как «Подход выполнен». Боковая планка — левая, пауза 10 с, правая в одном подходе; записывается слабая сторона.
   Фазы и времена — по меткам нажатий (holdState в 12a-set-timers.js). */
function holdSetup(s,sg){
  const it=s.it,ex=it.ex;RestAlarm.hush();
  if(!isHold(ex)){workout.hold=null;$('#wv-hold').hidden=true;$('#wv-done').classList.remove('wv-secondary');$('#wv-done').disabled=false;return;}
  const sug=sg.reps[s.k]??sg.reps[sg.reps.length-1],T=holdTarget(it.rx.reps,sug);
  workout.hold={target:T,sides:ex.uni?2:1,h:null,last:null};
  $('#wv-hold').hidden=false;$('#wv-done').classList.add('wv-secondary');RestAlarm.paintButton($('#wv-hold-sound'));
  $('#wv-hold-goal').textContent=T.from==='log'?`Цель ${holdText(T.sec)} — по журналу (план ${it.rx.reps})`:`Цель ${holdText(T.sec)} — нижняя граница плана ${it.rx.reps}`;
  paintHold();
}
function paintHold(now=Date.now()){
  const H=workout?.hold;if(!H)return;
  const st=H.h?holdState(H.h,now):null,two=H.sides===2,sideName=i=>i?'Правая':'Левая';
  let mode,time,btn,cls='';
  if(!st){mode=two?'Левая, затем правая':'Таймер удержания';time=holdText(H.target.sec);btn='Старт';}
  else if(st.phase==='lead'){mode='Приготовьтесь';time=String(st.count);btn='Отмена';cls='is-lead';}
  else if(st.phase==='switch'){mode='Смена стороны';time=String(st.count);btn='Правая — сейчас';cls='is-lead';}
  else if(st.phase==='hold'){mode=(two?sideName(st.side)+' · ':'')+(st.mode==='to'?(two?'до цели':'До цели'):(two?'сверх цели':'Сверх цели'));time=st.mode==='to'?holdText(st.left):holdText(st.over,true);btn='Стоп';cls=st.mode==='over'?'is-over':'is-run';}
  else{mode='Записано';time=holdText(st.value);btn='Старт заново';}
  let sides='';
  if(two&&st){
    const r=st.results;
    sides=st.phase==='done'?`Левая ${holdText(r[0])}, правая ${holdText(r[1])} — записывается слабая сторона: ${holdText(st.value)}`
      :st.phase==='switch'?`Левая ${holdText(r[0])} · правая — через ${st.count} с`:r.length?`Левая ${holdText(r[0])} · правая идёт`:'';
  }
  const box=$('#wv-hold');box.className='wv-hold'+(cls?' '+cls:'');
  if($('#wv-hold-mode').textContent!==mode)$('#wv-hold-mode').textContent=mode;
  /* единица «с» — мельче числа и не моноширинная, иначе «30  с» расползается */
  const tEl=$('#wv-hold-time');if(tEl.textContent!==time){const i=time.lastIndexOf(' ');if(i>0){const u=document.createElement('span');u.className='wv-hold-unit';u.textContent=time.slice(i);tEl.replaceChildren(time.slice(0,i),u);}else tEl.textContent=time;}
  if($('#wv-hold-sides').textContent!==sides){$('#wv-hold-sides').textContent=sides;$('#wv-hold-sides').hidden=!sides;}
  const go=$('#wv-hold-go');if(go.textContent!==btn)go.textContent=btn;
  const running=!!st&&st.phase!=='done';go.classList.toggle('is-stop',running);$('#wv-hold-reset').hidden=!running||st.phase==='lead';$('#wv-done').disabled=running;
  /* вибрация (Android) на «пошли» и на достижении цели — по смене фазы */
  const key=st?st.phase+(st.mode||'')+st.side:'idle';
  if(H.last!==key){if(st?.phase==='hold'&&(st.mode==='over'?H.last===`holdto${st.side}`:/^(lead|switch)/.test(H.last||'')))RestAlarm.buzz(st.mode==='over'?'end':'go');H.last=key;}
}
function holdGo(){
  const H=workout?.hold;if(!H)return;
  const now=Date.now();
  if(!H.h||holdState(H.h,now).phase==='done'){RestAlarm.unlock();H.h=holdNew(now,H.target.sec,H.sides);H.last=null;RestAlarm.cue(holdCues(H.h));$('#wv-error').textContent='';paintHold(now);return;}
  const r=holdPress(H.h,now);
  if(r.action==='cancel'){H.h=null;RestAlarm.hush();}
  else if(r.action==='done'){H.h=r.h;RestAlarm.hush();holdCommit();return;}
  else if(r.h){H.h=r.h;RestAlarm.cue(holdCues(H.h));}
  paintHold(now);
}
/* «Стоп» последней стороны: секунды — в поле подхода, дальше — как «Подход выполнен» */
function holdCommit(){
  const H=workout.hold,st=holdState(H.h,Date.now());paintHold();
  if(!(st.value>0)){H.h=null;paintHold();$('#wv-error').textContent='Таймер остановлен в первую секунду — подход не записан.';return;}
  /* обе стороны — в поле сторон подхода (основное — слабая); при «Л/П отдельно» — в поля левой и правой */
  if(H.sides===2&&lrOn(workout.queue[workout.index].it.ex)){$('#wv-reps-l').value=String(st.results[0]);$('#wv-reps-r').value=String(st.results[1]);}
  else{$('#wv-reps').value=String(st.value);$('#wv-reps').removeAttribute('aria-invalid');workout.holdPair=H.sides===2?[st.results[0],st.results[1]]:null;}
  workout.sideNote=H.sides===2?`Записано ${holdText(st.value)} — время слабой стороны (левая ${holdText(st.results[0])}, правая ${holdText(st.results[1])}).`:'';
  commitWorkout();
}
function holdStop(){if(workout?.hold){workout.hold.h=null;workout.hold.last=null;}RestAlarm.hush();}
/* ---------- «Заменить» и «Пропустить» под выбором упражнения ----------
   «Пропустить» — к следующему упражнению; пропущенное помечено в выборе и в итогах, в журнал ничего не пишется; на следующем
   упражнении строка «Пропущено: … Вернуть». Записанный подход пропущенного упражнения возвращает его в тренировку.
   «Заменить» — тот же список замен, что в карточке плана (swapOptions, 12c-swap.js): выбор меняет упражнение в плане
   (в карточке — «Заменено: … Вернуть») и в тренировке; записанные подходы прежнего упражнения остаются в журнале и
   считаются в прогрессе и итогах тренировки (workout.gone). */
function paintExerciseTools(){
  const s=workout.queue[workout.index],id=s.it.ex.id,self=workout.skipped.includes(id),u=workout.skipUndo;
  workout.skipUndo=null;workoutSwapToggle(false);
  const line=self?{id,text:'Упражнение пропущено.'}:u&&workout.skipped.includes(u.id)?{id:u.id,text:`${'Пропущено:'} ${u.name}.`}:null;
  $('#wv-skip').hidden=self;$('#wv-skip-line').hidden=!line;
  if(line){$('#wv-skip-t').textContent=line.text;$('#wv-unskip').dataset.id=line.id;}
  /* название целиком над выбором: у <select> текст не переносится */
  const o=$('#wv-exercise').selectedOptions?.[0];$('#wv-exercise-text').textContent=o?o.textContent:s.it.label+'. '+s.it.name;
}
function workoutSkip(){
  workoutCapture();
  const s=workout.queue[workout.index],id=s.it.ex.id;
  if(!workout.skipped.includes(id))workout.skipped.push(id);
  workoutOptions();
  const next=workoutFirstOpen(workout.queue,workout.index);
  if(next<0){workoutFinish();$('#wv-finish-close').focus();return;}
  workout.skipUndo={id,name:s.it.name};workoutShow(next);$('#wv-unskip').focus();
}
function workoutUnskip(id){
  if(!id)return;
  workout.skipped=workout.skipped.filter(x=>x!==id);workout.ended=false;workoutOptions();
  const i=workout.queue.findIndex(x=>x.it.ex.id===id&&!workoutValue(x));
  workoutShow(i>=0?i:Math.max(0,workout.queue.findIndex(x=>x.it.ex.id===id)));$('#wv-skip').focus();
}
function workoutSwapToggle(open){
  const b=$('#wv-swap'),box=$('#wv-swap-pick');if(!b||!box)return;
  if(open===undefined)open=b.getAttribute('aria-expanded')!=='true';
  b.setAttribute('aria-expanded',String(open));
  if(!open){if(!box.hidden){box.hidden=true;box.replaceChildren();}return;}
  box.innerHTML=swapPickHtml(workout.queue[workout.index].it,{attr:'data-wv-swap',hid:'wv-swap-pick-h'});box.hidden=false;
  const first=box.querySelector('[data-wv-swap]');if(first)first.focus({preventScroll:true});
  box.scrollIntoView({block:'nearest',behavior:reduceMotion?'auto':'smooth'});
}
function workoutSwap(nextId){
  const it=workout.queue[workout.index].it,from=it.ex.id;
  workoutCapture();
  if(!swapSet(it.slot,nextId))return;
  /* план за окном тренировки: в карточке — «Заменено: … → … Вернуть»; тренировка при этом не закрывается (stopFigures) */
  workoutReplanning=true;try{renderPlan();}finally{workoutReplanning=false;}
  const queue=workoutQueue(plan),r=wkRequeue(workout.queue,queue,workout,{from,name:it.name,value:workoutValue});
  workout.queue=queue;workout.stamp=workoutStamp(queue);workout.last=r.last;workout.gone=wkAddGone(workout.gone,r.gone);
  workout.skipped=workout.skipped.filter(x=>x!==from);workoutOptions();
  const i=queue.findIndex(x=>x.it.ex.id===nextId&&!workoutValue(x)),j=Math.max(0,i>=0?i:queue.findIndex(x=>x.it.ex.id===nextId));
  workoutShow(j);
  $('#wv-save-status').textContent=`${'Заменено:'} ${it.name} → ${queue[j].it.name}.`+(r.gone?` ${'Записанные подходы остаются в журнале.'}`:'');
  $('#wv-swap').focus();
}
function setupWorkout(){
  $('#wv-form').addEventListener('submit',commitWorkout);
  for(const id of ['wv-kg','wv-reps','wv-kg-l','wv-reps-l','wv-kg-r','wv-reps-r'])$('#'+id).addEventListener('input',()=>{workoutCapture();$('#wv-error').textContent='';$('#'+id).removeAttribute('aria-invalid');if(id==='wv-kg')workoutPairTotal();if(id.startsWith('wv-kg'))workoutAskHide();});
  $('#wv-exercise').addEventListener('change',e=>{workoutCapture();const i=workout.queue.findIndex(s=>s.it.ex.id===e.target.value&&!workoutValue(s));workoutShow(i>=0?i:workout.queue.findIndex(s=>s.it.ex.id===e.target.value));});
  /* Esc: открыт вопрос о весе — он закрывается («Исправить»), открыт список замен — сворачивается, тренировка остаётся */
  $('#workout-view').addEventListener('cancel',e=>{e.preventDefault();if(!$('#wv-kg-ask').hidden){workoutAskFix();return;}if($('#wv-swap').getAttribute('aria-expanded')==='true'){workoutSwapToggle(false);$('#wv-swap').focus();return;}closeWorkout();});
  /* вопрос в плане о тренировке прошлого дня */
  document.addEventListener('click',e=>{
    const t=e.target.closest&&e.target.closest('[data-wip]');if(!t)return;
    if(t.dataset.wip==='go'){startWorkout(null,{cont:true});return;}
    const w=workoutPlanState(),y=w.day&&yesterdayKey()===w.day;workoutEndSaved();paintStartButtons();
    const msg=$('#save-msg');if(msg&&w.day)msg.textContent=(y?'Вчерашняя тренировка закончена.':`${'Тренировка'} ${fmtDay(w.day,true)} ${'закончена.'}`)+' '+'Её подходы — в журнале.';
    $('#start-workout')?.focus();
  });
  /* вернулись на экран: таймеры страницы в фоне редки — обновить отдых и удержание сразу */
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&workout&&$('#workout-view').open)workoutTick();});
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.id==='start-workout'||t.dataset.workout!==undefined){startWorkout(t.dataset.workout);return;}
    if(!workout||!$('#workout-view').open)return;
    if(t.id==='wv-close'||t.id==='wv-finish-close'){closeWorkout();return;}
    if(t.id==='wv-prev'||t.id==='wv-next'){workoutCapture();workoutShow(workout.index+(t.id==='wv-next'?1:-1));return;}
    if(t.dataset.wvIndex!==undefined){workoutCapture();workoutShow(Number(t.dataset.wvIndex));return;}
    if(t.id==='wv-review'){workoutShow(0);return;}
    if(t.id==='wv-undo'){workoutShow(workout.last);return;}
    if(t.id==='wv-continue'){workoutRestTaken();workoutShow(workout.next);return;}
    if(t.id==='wv-lr'){workoutLrToggle();return;}
    if(t.id==='wv-kg-yes'){commitWorkout(null,true);return;}
    if(t.id==='wv-kg-fix'){workoutAskFix();return;}
    if(t.id==='wv-hold-go'){holdGo();return;}
    if(t.id==='wv-hold-reset'){holdStop();paintHold();return;}
    if(t.id==='wv-skip'){workoutSkip();return;}
    if(t.id==='wv-unskip'){workoutUnskip(t.dataset.id);return;}
    if(t.id==='wv-swap'){workoutSwapToggle();return;}
    if(t.dataset.wvSwap){workoutSwap(t.dataset.wvSwap);return;}
    if(t.id==='wv-rest-pause'){workoutRestPause();return;}
    /* ±15 с на паузе — от момента паузы (время стоит), сигнал — после «▶» */
    if(t.dataset.wvRest){const end=restAdjust(workout.restUntil,restClock(workout.restPaused,Date.now()),Number(t.dataset.wvRest));if(end!==workout.restUntil){workout.restUntil=end;if(!workout.restPaused)RestAlarm.arm(end,{from:workout.restFrom||undefined});saveWorkout();workoutTick();}return;}
    if(t.id==='wv-motion'){const m=workout.motion;m.paused=!m.paused;t.textContent=m.paused?'Воспроизвести':'Пауза';return;}
    if(t.id==='wv-technique'){workoutCapture();if(workout.motion)openMotionItem(workout.motion.it,workout.motion.clock);}
  });
}

function motionCamera(ex){
 const cameras=ex.anim.catalogCameras||[],saved=motionPrefs.views?.[ex.id];
 return cameras.includes(saved)?saved:'above';
}
function cameraButtons(ex,current){
 return (ex.anim.catalogCameras||[]).map(key=>`<button type="button" data-motion-camera="${key}" aria-pressed="${current===key}">${CAMERA3[key].label}</button>`).join('');
}
function rememberCamera(ex,key){
 if(!ex.anim.catalogCameras?.includes(key))return false;
 motionPrefs.views=Object.assign({},motionPrefs.views,{[ex.id]:key});saveMotionPrefs();return true;
}
function mountDetailCameras(){
 if(!detailMotion)return;
 const F=detailMotion,ex=F.it.ex,a=ex.anim,key=motionCamera(ex),cameras=a.catalogCameras||[];
 disposeMotion(F);
 /* кости и мышцы — с первого кадра фигуры, если уже загружены (иначе их покажет applyFigureView, когда придут); второй ракурс
    пары — та же сцена первой фигуры (share): без второго WebGL-контекста и второй сборки шейдеров */
 const m=motionFrame(F),layers=detailLayers(ex),make=(camera,share)=>{
  const f=createMotionFigure(a,{primary:ex.pri,has:F.it.has,ratio:1.15,t:m.t,label:F.it.name,camera,muscles:motionPrefs.muscles,interactive:true,onCamera:paintDetailCamera,onGesture:orbitGesture,layers,share});
  f.svg.classList.toggle('show-joints',!!motionPrefs.joints);f.setTrace(!!motionPrefs.trace);f.setVectors(!!motionPrefs.vectors);return f;
 };
 F.f=make(key);$('#mv-stage').replaceChildren(F.f.svg);
 $('#mv-camera-controls').hidden=cameras.length<2;
 $('#mv-cameras').innerHTML=cameraButtons(ex,key);
 $('#mv-view').textContent=CAMERA3[key].label;
 $('#mv-camera-hint').textContent=a.cameraHints?.[key]||'';
 $('#mv-camera-hint').hidden=!a.cameraHints;
 const pair=cameras.length>1&&!!motionPrefs.dual;
 $('#mv-dual').checked=!!motionPrefs.dual;$('#mv-second').hidden=!pair;$('#mv-projections').classList.toggle('is-dual',pair);
 F.extra=null;
 if(pair){
  const other=pairCamera(a,key);F.extra=make(other,F.f);$('#mv-second-stage').replaceChildren(F.extra.svg);
  $('#mv-second-label').textContent=CAMERA3[other].label;$('#mv-second-hint').textContent=a.cameraHints?.[other]||'';
 }else $('#mv-second-stage').replaceChildren();
 configureMusclePanel('mv',F.it);configureStressPanel('mv',F);applyFigureView(F);paintMotion(F,true);paintOrbitHint(F);
}
/* вид разбора с первого кадра: кости и мышцы (как applyFigureView) или null — манекен либо данные ещё грузятся */
function detailLayers(ex){
 const view=figureView();if(view==='mannequin'||!Skeleton.data||(view==='anatomy'&&!Muscles.data))return null;
 return{bones:Skeleton.data,body:view==='anatomy'?{skeleton:Skeleton.data,muscles:Muscles.data,level:anatomyLevel(ex)}:null};
}
/* второй ракурс пары: из профиля мышц упражнения, иначе первый другой */
function pairCamera(a,key){const cameras=a.catalogCameras||[],preferred=motionProfile(a)?.pair;return preferred!==key&&cameras.includes(preferred)?preferred:cameras.find(c=>c!==key);}
/* Смена ракурса в разборе: объёмная фигура переключает камеру сама — без новой сцены и пересчёта позы (≈0,2 с на
   компьютере, втрое дольше на слабом телефоне). Плоская запасная схема и смена числа видов пересобирают окно. */
function switchDetailCamera(){
 const F=detailMotion,a=F.it.ex.anim,key=motionCamera(F.it.ex),pair=(a.catalogCameras||[]).length>1&&!!motionPrefs.dual,other=pair?pairCamera(a,key):null;
 /* второй ракурс пары, повёрнутый вручную, не сбрасывается, если его предустановка та же */
 if(!F.f?.setCamera||(pair?!F.extra?.setCamera:!!F.extra)||!F.f.setCamera(key)||(pair&&F.extra.camera!==other&&!F.extra.setCamera(other)))return mountDetailCameras();
 paintDetailCamera();
 $('#mv-camera-hint').textContent=a.cameraHints?.[key]||'';
 if(pair)$('#mv-second-hint').textContent=a.cameraHints?.[other]||'';
}
function switchWorkoutCamera(){
 const F=workout.motion,key=motionCamera(F.it.ex);
 if(!F.f?.setCamera||!F.f.setCamera(key))return mountWorkoutCameras();
 paintWorkoutCamera();
}
/* кнопки ракурсов не перерисовываются — фокус остаётся на нажатой; key = null — ни одна не нажата (свободный ракурс) */
function pressCamera(sel,key){for(const b of $(sel).querySelectorAll('[data-motion-camera]'))b.setAttribute('aria-pressed',String(b.dataset.motionCamera===key));}
/* Свободная камера сцены (src/volume/main.mjs, orbit.mjs): повернули вручную — подпись «Свободный ракурс», кнопки ракурсов
   без нажатой; кнопка или двойное касание возвращают предустановку. Запоминается по-прежнему последняя нажатая кнопка
   (motionPrefs.views): поворот её не меняет. Приближение и сдвиг без поворота ракурс не меняют. */
const FREE_VIEW_LABEL='Свободный ракурс';
function paintDetailCamera(){
 const F=detailMotion;if(!F?.f)return;
 const a=F.it.ex.anim,key=motionCamera(F.it.ex),free=!!F.f.free;
 pressCamera('#mv-cameras',free?null:key);
 $('#mv-view').textContent=free?FREE_VIEW_LABEL:CAMERA3[key].label;
 if(F.extra?.orbit)$('#mv-second-label').textContent=F.extra.free?FREE_VIEW_LABEL:CAMERA3[F.extra.camera]?.label||'';
}
function paintWorkoutCamera(){
 const F=workout?.motion;if(!F?.f)return;
 const ex=F.it.ex,key=motionCamera(ex),free=!!F.f.free;
 pressCamera('#wv-cameras',free?null:key);
 $('#wv-angle').textContent=free?FREE_VIEW_LABEL:CAMERA3[key].label;
}
/* Подсказка под сценой разбора — одна строка, пока человек ни разу не повернул и не приблизил сцену (флаг в localStorage;
   без хранилища — до конца сеанса). Первый жест на любой сцене её убирает. */
const ORBIT_HINT_STORE='podhod.orbit-hint.v1';
let orbitHintDone=null;
function orbitHintSeen(){if(orbitHintDone===null){try{orbitHintDone=localStorage.getItem(ORBIT_HINT_STORE)==='1';}catch(e){orbitHintDone=false;}}return orbitHintDone;}
function orbitGesture(){
 if(orbitHintSeen())return;orbitHintDone=true;
 try{localStorage.setItem(ORBIT_HINT_STORE,'1');}catch(e){}
 const el=$('#mv-orbit-hint');if(el)el.hidden=true;
}
function paintOrbitHint(F){
 const el=$('#mv-orbit-hint');if(!el)return;
 const on=!!F?.f?.orbit&&!orbitHintSeen();el.hidden=!on;
 if(on)el.textContent=coarsePointer()?'Потяните вбок — повернуть, щипок — приблизить':'Потяните — повернуть, колесо — приблизить, двойной щелчок — вернуть ракурс';
}
function mountWorkoutCameras(){
 if(!workout?.motion)return;
 const F=workout.motion,ex=F.it.ex,key=motionCamera(ex),m=motionFrame(F);
 disposeMotion(F);F.f=createMotionFigure(ex.anim,{has:F.it.has,ratio:1.15,t:m.t,label:F.it.name,camera:key,muscles:motionPrefs.muscles,memoBones:true,interactive:true,onCamera:paintWorkoutCamera,onGesture:orbitGesture,layers:workoutLayers(F)});F.f.setVectors(!!motionPrefs.vectors);
 $('#wv-stage').replaceChildren(F.f.svg);$('#wv-cameras').innerHTML=cameraButtons(ex,key);$('#wv-cameras').hidden=!ex.anim.catalogCameras;
 $('#wv-angle').textContent=CAMERA3[key].label;configureMusclePanel('wv',F.it);configureStressPanel('wv',F);workoutFigure.pace.settle();applyWorkoutView(F);paintWorkoutMotion();
}
/* Вид фигуры на экране тренировки — тот же выбор, что в разборе (motionPrefs.view; по умолчанию «Анатомия»): кости и мышцы
   в почти невидимом силуэте кожи, цвет мышц по фазам. Переключатель «Анатомия · Скелет · Манекен» — маленький, в углу
   сцены. Пока кости и мышцы грузятся — манекен с подписью; ошибка загрузки — манекен с честной подписью; без объёмной
   графики (WebGL) — как раньше, плоская схема. Кости и мышцы обновляются с частотой ступени скорости (workoutFigure.pace:
   30, 15, 10 кадров в секунду, часы — каждый кадр); ниже — манекен с подписью «… не успевает — показан манекен»: выбор
   человека не сбрасывается, при следующем открытии тренировки — снова попытка. */
const workoutFigure={pace:anatomyPace(),slow:false,failed:false,view:'mannequin'};
const workoutAnatomyLive=()=>workoutFigure.view!=='mannequin'&&typeof workout?.motion?.f?.setLayers==='function';
function workoutPaceSample(ms,cold=false){if(workoutFigure.pace.sample(ms,1,cold)==='fallback'){workoutFigure.slow=true;applyWorkoutView();}}
/* вид экрана тренировки с первого кадра: кости и мышцы, если applyWorkoutView их и покажет (данные готовы, телефон успевает) */
function workoutLayers(F){
 const pref=figureView(),need=pref==='anatomy'?[Skeleton,Muscles]:[Skeleton],state=need.every(x=>x.data)?'ready':workoutFigure.failed?'error':'loading';
 const choice=figureViewFor(motionPrefs.view,{able:true,state,slow:workoutFigure.slow,coarse:coarsePointer()});
 if(choice.wait||choice.view==='mannequin')return null;
 return{bones:Skeleton.data,body:choice.view==='anatomy'?{skeleton:Skeleton.data,muscles:Muscles.data,level:anatomyLevel(F.it.ex)}:null};
}
function applyWorkoutView(F=workout?.motion){
 const group=$('#wv-figure'),note=$('#wv-figure-note');if(!group||!F?.f)return;
 const able=typeof F.f.setLayers==='function',pref=figureView(),need=pref==='anatomy'?[Skeleton,Muscles]:[Skeleton];
 const state=need.every(x=>x.data)?'ready':workoutFigure.failed?'error':'loading';
 const choice=figureViewFor(motionPrefs.view,{able,state,slow:workoutFigure.slow,coarse:coarsePointer()});workoutFigure.view=choice.view;
 /* нажата — то, что показано; пока грузится — выбранная (она и появится) */
 const shown=choice.wait?pref:choice.view;
 for(const b of group.querySelectorAll('[data-wv-figure]')){const off=!able&&b.dataset.wvFigure!=='mannequin';b.disabled=off;b.title=off?'Нужна объёмная графика (WebGL)':'';b.setAttribute('aria-pressed',String(b.dataset.wvFigure===shown));}
 group.toggleAttribute('aria-busy',choice.wait);
 if(note.textContent!==choice.note)note.textContent=choice.note;note.hidden=!choice.note;
 if(!able)return;
 if(choice.view==='mannequin'){
  F.f.setLayers(null,null);
  if(choice.wait)Promise.all(need.map(x=>x.load())).then(()=>{workoutFigure.failed=false;},()=>{workoutFigure.failed=true;}).then(()=>{if(workout?.motion===F&&figureView()===pref)applyWorkoutView(F);});
  return;
 }
 F.f.setLayers(Skeleton.data,choice.view==='anatomy'?{skeleton:Skeleton.data,muscles:Muscles.data,level:anatomyLevel(F.it.ex)}:null);
}
function setupMotionCameras(){
 $('#mv-cameras').addEventListener('click',e=>{const b=e.target.closest('[data-motion-camera]');if(b&&detailMotion&&rememberCamera(detailMotion.it.ex,b.dataset.motionCamera))switchDetailCamera();});
 $('#wv-cameras').addEventListener('click',e=>{const b=e.target.closest('[data-motion-camera]');if(b&&workout?.motion&&rememberCamera(workout.motion.it.ex,b.dataset.motionCamera))switchWorkoutCamera();});
 $('#wv-figure').addEventListener('click',e=>{
  const b=e.target.closest('[data-wv-figure]');if(!b||b.disabled||!workout?.motion)return;
  if(b.dataset.wvFigure===figureView()&&b.getAttribute('aria-pressed')==='true')return;
  motionPrefs.view=b.dataset.wvFigure;saveMotionPrefs();if(motionPrefs.view!=='mannequin'){retryAnatomyPace();workoutFigure.failed=false;}
  applyWorkoutView();paintWorkoutMotion();
 });
 $('#mv-dual').addEventListener('change',e=>{motionPrefs.dual=e.target.checked;saveMotionPrefs();mountDetailCameras();});
}
