/* ===================== ПЕРВЫЙ ЗАПУСК: НЕСКОЛЬКО ВОПРОСОВ =====================
   Отчёт тестеров 4.94.0 («Первый запуск»: Ольга п. 5–6, Alex п. 15 и 26, Марина, Виктор): при первом входе — «стена
   параметров», по умолчанию «Зал, Масса, Средний», план на три экрана ниже, цели без пояснений, время тренировки
   задать нельзя, «Беречь суставы» — после 17 кнопок мышц. Теперь самый первый запуск (FIRST_RUN, 11-planner.js) —
   окно с вопросами, по одному на экран:
     1. где тренируетесь — места тренировок (11b-analogs.js);
     2. что есть под рукой — инвентарь этого места; в зале всё есть, шага нет;
     3. цель — с пояснением простыми словами (GOALS.about), без выбора по умолчанию;
     4. время на тренировку (11j-duration.js), опыт, необязательные отметки «что беречь» (11g-gentle.js) и необязательный
        вопрос о здоровье по образцу PAR-Q+ (11l-health.js): при любом «да» — цель «Бережно» и плашка «Здоровье» над планом.
   Вопрос с одним ответом ведёт дальше сразу по нажатию. «Назад» — кнопкой, системной «Назад» телефона (запись в истории
   на каждый шаг, 12d-back.js) и Esc — на предыдущий шаг; с первого шага системная «Назад» уводит, как и раньше.
   «Пропустить» — на оставшиеся вопросы ответы по умолчанию для новичка (FIRST_DEFAULTS). Потом — план сверху,
   параметры на телефоне свёрнуты; всё меняется в параметрах. Ответы → параметры — firstRunApply
   (проверка — tools/first-run.test.js, в браузере — tools/ui-check.mjs). */
/* По умолчанию — для новичка, без «Массы»: «Бережно» (лёгкий вес, 12–15 повторов, 3–4 в запасе, без прыжков и рывков —
   Garber et al., MSSE 2011, 43(7):1334–1359, см. 11g-gentle.js), уровень «Новичок», около 45 минут, всё тело.
   Место по умолчанию — первое в списке (зал). */
const FIRST_DEFAULTS = {goal:'gentle', level:'beg', dur:'mid', protect:[]};
/* инвентарь, о котором спрашиваем дома и на улице, — из оборудования мест; то, что уже есть в месте, добавляется */
const FIRST_EQUIP = ['db', 'kb', 'band', 'pullup', 'dipbars', 'bench', 'incline', 'bb', 'abwheel'];
/* короткие пояснения на шаге «Что есть под рукой?»: какие резинки считаются и что регулируемая скамья даёт и горизонтальную */
const FIRST_EQUIP_HINT = {band:'трубка с рукоятями, петли, крепление на дверь', incline:'со спинкой под наклоном; годится и как горизонтальная'};
/* суставы: чаще всего берегут колени, поясницу и плечи — они первыми */
const FIRST_PROTECT = ['knees', 'kneeOp', 'lumbar', 'disc', 'shoulders', 'neck', 'elbows', 'wrists', 'achilles', 'hams'];
const FIRST_GROUPS = () => GROUP_PRESETS.find(p => p.id === 'full').g.slice();

/* все снаряды места — «как в зале»: спрашивать не о чем */
function placeHasAll(p) { return !!p && EQUIP.every(e => p.equip.includes(e.id)); }
function firstEquipList(place) { const own = place ? place.equip : []; return FIRST_EQUIP.concat(own.filter(id => !FIRST_EQUIP.includes(id))).filter(id => EQN[id]); }
/* что выставить по ответам: невыбранное — по умолчанию; инвентарь — только если его спрашивали для этого места */
function firstRunApply(A = {}, s = S) {
  const place = s.places.some(p => p.id === A.place) ? A.place : s.place;
  s.place = place; s.adapt = null; ensurePlaces(s);
  if (Array.isArray(A.equip) && A.equipFor === place && !placeHasAll(placeOf(s, place))) {
    const list = EQUIP.map(e => e.id).filter(id => A.equip.includes(id));
    placeOf(s, place).equip = list.slice(); s.equip = list.slice();
  }
  /* здоровье: хоть одно «да» — «Бережно», даже если выбрана другая цель (её можно сменить; плашка над планом это говорит) */
  const health = Array.isArray(A.health) ? A.health.filter(id => HEALTH_BY[id]) : [];
  const goal = health.length ? 'gentle' : GOALS[A.goal] ? A.goal : FIRST_DEFAULTS.goal, level = LEVELS[A.level] ? A.level : FIRST_DEFAULTS.level;
  Object.assign(s, {mode:'single', view:'plan', goal, level, format:'classic', dur:DURATIONS[A.dur] ? A.dur : FIRST_DEFAULTS.dur,
    protect:Array.isArray(A.protect) ? A.protect.slice() : FIRST_DEFAULTS.protect.slice(), health, groups:FIRST_GROUPS(), focus:null, day:0});
  s.gen = {...(s.gen || {}), goal, format:'classic', level, groups:s.groups.slice(), place:s.place};
  ensureProtect(s); ensureDur(s); ensureHealth(s);
  return s;
}

const FR = {A:{}, i:0, done:false, closing:false, again:false, at:0};
/* шаги для текущих ответов: в зале вопроса об инвентаре нет */
function frSteps() {
  const p = FR.A.place ? placeOf(S, FR.A.place) : null;
  return ['place'].concat(!p || !placeHasAll(p) ? ['equip'] : [], ['goal', 'more']);
}
/* Счётчик шагов (Игорь 21, Руслан 18, Артём 8, Mike 10, Кира 10): вопросов всегда четыре, у каждого свой номер. В зале вопрос
   об инвентаре не нужен — после «Шаг 1 из 4» идёт «Шаг 3 из 4», и на нём сказано, почему. Раньше число шагов менялось на
   ходу: «1 из 4 → 2 из 3». */
const FR_ORDER = ['place', 'equip', 'goal', 'more'];
/* Двойное касание (Артём 1, 2): второе касание попадало уже в следующий вопрос — выбирало цель или снимало галочку
   инвентаря. Нажатия в первые FR_GUARD мс после смены вопроса не считаются (у Артёма — до 250 мс между касаниями). */
const FR_GUARD = 500;
/* Незаконченные вопросы (Артём 11): ответы и шаг — в хранилище; закрыли вкладку — продолжение с того же вопроса.
   Пройдено или пропущено — запись стирается. */
const FR_DRAFT = 'podhod.firstRun.v1';
function frDraftSave() { if (FR.again) return; try { localStorage.setItem(FR_DRAFT, JSON.stringify({A:FR.A, step:frSteps()[FR.i]})); } catch (e) {} }
function frDraftClear() { try { localStorage.removeItem(FR_DRAFT); } catch (e) {} }
function frDraftLoad() {
  let o = null; try { o = JSON.parse(localStorage.getItem(FR_DRAFT) || 'null'); } catch (e) {}
  if (!o || typeof o !== 'object' || !o.A || typeof o.A !== 'object') return false;
  const A = {}, a = o.A, list = v => Array.isArray(v) ? v.filter(x => typeof x === 'string') : null;
  if (S.places.some(p => p.id === a.place)) A.place = a.place;
  if (A.place && a.equipFor === A.place && list(a.equip)) { A.equipFor = A.place; A.equip = list(a.equip).filter(id => EQN[id]); }
  if (GOALS[a.goal]) A.goal = a.goal;
  if (DURATIONS[a.dur]) A.dur = a.dur;
  if (LEVELS[a.level]) A.level = a.level;
  if (list(a.protect)) A.protect = list(a.protect).filter(id => PROTECT_BY[id]);
  if (list(a.health)) A.health = list(a.health).filter(id => HEALTH_BY[id]);
  FR.A = A;
  /* шаг — не дальше первого вопроса без ответа */
  const steps = frSteps(), want = steps.indexOf(o.step), open = !A.place ? 0 : !A.goal ? steps.indexOf('goal') : steps.length - 1;
  FR.i = Math.max(0, Math.min(want < 0 ? 0 : want, open));
  return true;
}
const frPressed = on => ` aria-pressed="${on}"${on ? ' class="on"' : ''}`;
function frOpt(attr, on, title, about) {
  return `<button type="button" class="fr-opt${on ? ' on' : ''}" ${attr} aria-pressed="${on}"><span class="fr-opt-t"><b>${esc(title)}</b>${about ? `<small>${esc(about)}</small>` : ''}</span>${ICON.check}</button>`;
}
function frPlaceAbout(p) {
  if (placeHasAll(p)) return 'Всё оборудование зала';
  if (!p.equip.length) return 'Только вес тела';
  const names = EQUIP.filter(e => p.equip.includes(e.id)).map(e => lowFirst(e.name));
  return names.length > 3 ? names.slice(0, 3).join(', ') + ` +${names.length - 3}` : names.join(', ');
}
const FR_STEP = {
  place:{title:'Где вы будете тренироваться?', lead:'Несколько коротких вопросов — и план готов. Всё можно поменять потом в параметрах.',
    body:() => `<div class="fr-opts">${S.places.map(p => frOpt(`data-fr-place="${esc(p.id)}"`, FR.A.place === p.id, p.name, frPlaceAbout(p))).join('')}</div>`},
  equip:{title:'Что есть под рукой?', lead:'Отметьте всё, что есть. Упражнения с весом тела доступны всегда.', next:'Дальше',
    body:() => {
      const p = placeOf(S, FR.A.place), have = new Set(FR.A.equipFor === p.id ? FR.A.equip : p.equip);
      return `<div class="fr-opts fr-list" role="group" aria-labelledby="fr-title">${firstEquipList(p).map(id => frOpt(`data-fr-eq="${id}"`, have.has(id), EQN[id], FIRST_EQUIP_HINT[id] || '')).join('')}</div><p class="fr-note" id="fr-eq-note">${have.size ? '' : 'Ничего не отмечено — план из упражнений с весом тела.'}</p>`;
    }},
  goal:{title:'Какая у вас цель?', lead:'Её можно сменить в любой момент.',
    body:() => `<div class="fr-opts">${Object.entries(GOALS).map(([k, g]) => frOpt(`data-fr-goal="${k}"`, FR.A.goal === k, g.name, g.about)).join('')}</div>`},
  more:{title:'Время и опыт', lead:'', next:'Показать план',
    body:() => {
      /* время и опыт: ничего не выбрано — отмечено то, с чем соберётся план (Артём 9: план собирался на «45 мин · Новичок»,
         а на экране ничего не было выделено) */
      const on = new Set(FR.A.protect || []), dur = FR.A.dur || FIRST_DEFAULTS.dur, level = FR.A.level || FIRST_DEFAULTS.level;
      return frQ('fr-q-dur', 'Сколько времени на одну тренировку?',
          `<div class="fr-seg">${Object.entries(DURATIONS).map(([k, d]) => `<button type="button" data-fr-dur="${k}"${frPressed(dur === k)}><b>${d.name}</b><small>${d.hint}</small></button>`).join('')}</div>`,
          'Без разминки и заминки — на них ещё 10–15 минут.')
        + frQ('fr-q-lvl', 'Ваш опыт', `<div class="fr-opts">${Object.entries(LEVELS).map(([k, l]) => frOpt(`data-fr-level="${k}"`, level === k, l.ask, l.about)).join('')}</div>`)
        + frQ('fr-q-joint', `${'Что беречь?'} <em>${'Необязательно'}</em>`,
          `<div class="chips">${FIRST_PROTECT.map(id => PROTECT_BY[id]).map(p => `<button type="button" class="chip${on.has(p.id) ? ' on' : ''}" data-fr-protect="${p.id}" aria-pressed="${on.has(p.id)}">${ICON.check}<span>${p.name}</span></button>`).join('')}</div>`,
          'Отметьте, что болит или восстанавливается: в план не попадут упражнения с сильной нагрузкой на эти места.')
        + frQ('fr-q-health', `${'Здоровье'} <em>${'Необязательно'}</em>`,
          `<div class="chips">${HEALTH.map(h => `<button type="button" class="chip${(FR.A.health || []).includes(h.id) ? ' on' : ''}" data-fr-health="${h.id}" aria-pressed="${(FR.A.health || []).includes(h.id)}">${ICON.check}<span>${esc(h.name)}</span></button>`).join('')}</div>`,
          'Если что-то из этого про вас — сначала посоветуйтесь с врачом. План будет бережным, а над ним — что важно. Ответы остаются только на этом устройстве.');
    }}
};
/* вопрос последнего шага: заголовок, варианты, пояснение под ними */
const frQ = (id, title, inner, note = '') => `<section class="fr-q" role="group" aria-labelledby="${id}"><h3 id="${id}">${title}</h3>${inner}${note ? `<p class="fr-note">${note}</p>` : ''}</section>`;

function frRender(focus = true) {
  const steps = frSteps(); FR.i = Math.min(FR.i, steps.length - 1);
  const id = steps[FR.i], st = FR_STEP[id], last = FR.i === steps.length - 1;
  $('#fr-count').textContent = `Шаг ${FR_ORDER.indexOf(id) + 1} из ${FR_ORDER.length}`;
  $('#fr-title').textContent = st.title;
  /* прислали ссылку на план — в первом шаге сказано, что он откроется после вопросов (11m-plan-link.js) */
  const note = FR.i === 0 && typeof planLinkNote === 'function' && !FR.again ? planLinkNote() : '';
  /* «Пройти вопросы заново»: что изменят ответы; зал — почему нет вопроса об инвентаре */
  const lead = FR.again && FR.i === 0 ? 'Ответы заменят место, цель, время, опыт и мышцы в параметрах. Журнал и свои планы останутся.'
    : id === 'goal' && !steps.includes('equip') ? 'В зале есть всё оборудование — вопрос об инвентаре пропущен. Цель можно сменить в любой момент.' : st.lead;
  $('#fr-lead').textContent = lead + (note ? ' ' + note : ''); $('#fr-lead').hidden = !lead && !note;
  $('#fr-body').innerHTML = st.body();
  $('#fr-back').hidden = FR.i === 0; $('#fr-skip').hidden = last && !FR.again; $('#fr-skip').textContent = FR.again ? 'Отмена' : 'Пропустить';
  FR.at = Date.now(); frDraftSave();
  $('#fr-next').hidden = !st.next; $('#fr-next').textContent = st.next || '';
  $('#first-run').dataset.step = id;
  /* диктор: заголовок шага (с «Шаг N из M» в описании) — сразу после смены шага; окно прокручено к началу */
  $('#first-run .fr-shell').scrollTop = 0; $('#first-run').scrollTop = 0;
  if (focus) $('#fr-title').focus({preventScroll:true});
}
/* вперёд: запись в истории на каждый шаг — системная «Назад» вернёт на предыдущий */
function frForward() {
  const steps = frSteps();
  if (FR.i >= steps.length - 1) return frFinish(false);
  FR.i++; OverlayBack.open('fr:' + FR.i, () => frBack(true)); frRender();
}
/* назад: fromHistory — запись уже снята системной «Назад»; иначе (кнопка, Esc) — снять её самим */
function frBack(fromHistory) {
  if (FR.i === 0 || FR.done) return;
  if (fromHistory !== true) OverlayBack.closed('fr:' + FR.i);
  FR.i--; frRender();
}
function frFinish(skip) {
  if (FR.done) return;
  /* «Пройти вопросы заново» → «Отмена» (и Esc с первого вопроса): ничего не меняется */
  if (FR.again && skip) return frCancel();
  FR.done = true; frDraftClear();
  firstRunApply(FR.A);
  for (let k = 1; k <= 3; k++) if (OverlayBack.has('fr:' + k)) { OverlayBack.closed('fr:' + k); break; }
  try { localStorage.setItem(PLAN_SEEN, '1'); } catch (e) {}
  ensureFold(S).setup = setupFoldsHere();
  const d = $('#first-run'); FR.closing = true; if (d.open) d.close(); FR.closing = false;
  document.documentElement.classList.remove('first-run');
  regen(); scrollTo(0, 0);
  /* фокус — на название плана: диктор начинает с него */
  const h = $('#plan .p-title, #plan .empty h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
  FR.skipped = !!skip;
  /* план по ссылке, открытой в первый запуск, — после вопросов */
  if (typeof planLinkShow === 'function') planLinkShow();
}
/* «Отмена» повторных вопросов: окно закрывается, параметры прежние, фокус — на кнопку, с которой открыли */
function frCancel() {
  FR.done = true;
  for (let k = 1; k <= 3; k++) if (OverlayBack.has('fr:' + k)) { OverlayBack.closed('fr:' + k); break; }
  const d = $('#first-run'); FR.closing = true; if (d.open) d.close(); FR.closing = false;
  document.documentElement.classList.remove('first-run');
  if (S.view === 'plan') renderPlanView();
  $('#fr-again')?.focus();
}
/* «Пройти вопросы заново» в параметрах (Галина 6: после «Пропустить» вернуть вопросы было нечем): те же вопросы, отмечены
   нынешние ответы; «Отмена» ничего не меняет */
function firstRunAgain() {
  const d = $('#first-run'); if (!d || typeof d.showModal !== 'function' || d.open) return false;
  const p = placeOf(S, S.place);
  FR.A = {place:S.place, goal:S.goal, level:S.level, dur:S.dur || FIRST_DEFAULTS.dur, protect:(S.protect || []).slice(), health:(S.health || []).slice()};
  if (p) { FR.A.equipFor = p.id; FR.A.equip = p.equip.slice(); }
  FR.i = 0; FR.done = false; FR.again = true;
  stopFigures(); document.documentElement.classList.add('first-run');
  d.showModal(); frRender();
  return true;
}
function openFirstRun() {
  const d = $('#first-run');
  if (!FIRST_RUN || FR.done || !d || typeof d.showModal !== 'function') return false;
  FR.A = {}; FR.i = 0; FR.again = false;
  frDraftLoad(); /* закрыли вкладку посреди вопросов — с того же вопроса */
  stopFigures(); /* фигуры плана под окном не крутятся */
  document.documentElement.classList.add('first-run');
  d.showModal(); frRender();
  return true;
}
/* для проверок: закрыть окно, ничего не меняя в параметрах, — приложение как при первом запуске прежних версий
   (план по умолчанию, его фигуры запущены, в хранилище — только отметка «план показан») */
function firstRunClose() {
  if (FR.done) return; FR.done = true; frDraftClear();
  try { localStorage.setItem(PLAN_SEEN, '1'); } catch (e) {}
  const d = $('#first-run'); FR.closing = true; if (d && d.open) d.close(); FR.closing = false;
  document.documentElement.classList.remove('first-run');
  if (S.view === 'plan') renderPlanView();
  if (typeof planLinkShow === 'function') planLinkShow();
}
function setupFirstRun() {
  const d = $('#first-run'); if (!d) return;
  d.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t || !d.contains(t)) return;
    /* двойное касание: нажатие сразу после смены вопроса — не ответ на новый вопрос */
    if (Date.now() - FR.at < FR_GUARD) return;
    const A = FR.A;
    if (t.id === 'fr-back') return frBack();
    if (t.id === 'fr-skip') return frFinish(true);
    if (t.id === 'fr-next') return frForward();
    if (t.dataset.frPlace) { if (A.place !== t.dataset.frPlace) { A.place = t.dataset.frPlace; delete A.equip; delete A.equipFor; } return frForward(); }
    if (t.dataset.frGoal) { A.goal = t.dataset.frGoal; return frForward(); }
    if (t.dataset.frEq) {
      const p = placeOf(S, A.place);
      if (A.equipFor !== p.id) { A.equipFor = p.id; A.equip = p.equip.slice(); }
      const id = t.dataset.frEq, on = !A.equip.includes(id);
      A.equip = on ? A.equip.concat(id) : A.equip.filter(x => x !== id);
      t.classList.toggle('on', on); t.setAttribute('aria-pressed', String(on));
      $('#fr-eq-note').textContent = A.equip.some(x => firstEquipList(p).includes(x)) ? '' : 'Ничего не отмечено — план из упражнений с весом тела.';
      frDraftSave(); return;
    }
    /* последний шаг: время и опыт — один ответ, суставы — сколько угодно */
    const one = (key, attr) => { A[key] = t.dataset[attr]; d.querySelectorAll(`[data-${attr.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}]`).forEach(b => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); };
    if (t.dataset.frDur) { one('dur', 'frDur'); return frDraftSave(); }
    if (t.dataset.frLevel) { one('level', 'frLevel'); return frDraftSave(); }
    if (t.dataset.frProtect) {
      const id = t.dataset.frProtect, list = A.protect || [], on = !list.includes(id);
      /* строгая отметка включает обычную, снятая обычная снимает строгую (как в параметрах, 11g-gentle.js) */
      const base = PROTECT_BY[id].base, strict = PROTECT.filter(p => p.base === id).map(p => p.id);
      A.protect = on ? [...new Set(list.concat(id, base ? [base] : []))] : list.filter(x => x !== id && !strict.includes(x));
      d.querySelectorAll('[data-fr-protect]').forEach(b => { const v = A.protect.includes(b.dataset.frProtect); b.classList.toggle('on', v); b.setAttribute('aria-pressed', String(v)); });
    }
    if (t.dataset.frHealth) {
      const id = t.dataset.frHealth, list = A.health || [], on = !list.includes(id);
      A.health = on ? list.concat(id) : list.filter(x => x !== id);
      t.classList.toggle('on', on); t.setAttribute('aria-pressed', String(on));
    }
    frDraftSave();
  });
  /* «Пройти вопросы заново» — внизу параметров */
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('#fr-again'); if (t) firstRunAgain(); });
  /* Esc и системная «Назад» там, где она закрывает окно (Chrome на Android), — на предыдущий шаг; с первого — пропустить */
  d.addEventListener('cancel', e => { e.preventDefault(); if (FR.i > 0) frBack(); else frFinish(true); });
  /* окно закрылось само (браузер не дал отменить закрытие) — как «Пропустить» */
  d.addEventListener('close', () => { if (!FR.closing && !FR.done) frFinish(true); });
}
