/* ===================== ПЕРВЫЙ ЗАПУСК: НЕСКОЛЬКО ВОПРОСОВ =====================
   Отчёт тестеров 4.94.0 («Первый запуск»: Ольга п. 5–6, Alex п. 15 и 26, Марина, Виктор): при первом входе — «стена
   параметров», по умолчанию «Зал, Масса, Средний», план на три экрана ниже, цели без пояснений, время тренировки
   задать нельзя, «Беречь суставы» — после 17 кнопок мышц. Теперь самый первый запуск (FIRST_RUN, 11-planner.js) —
   окно с вопросами, по одному на экран:
     1. где тренируетесь — места тренировок (11b-analogs.js);
     2. что есть под рукой — инвентарь этого места; в зале всё есть, шага нет;
     3. цель — с пояснением простыми словами (GOALS.about), без выбора по умолчанию;
     4. время на тренировку (11j-duration.js), опыт и необязательные отметки «что беречь» (11g-gentle.js).
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
const FIRST_PROTECT = ['knees', 'lumbar', 'shoulders', 'neck', 'elbows', 'wrists', 'achilles', 'hams'];
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
  const goal = GOALS[A.goal] ? A.goal : FIRST_DEFAULTS.goal, level = LEVELS[A.level] ? A.level : FIRST_DEFAULTS.level;
  Object.assign(s, {mode:'single', view:'plan', goal, level, format:'classic', dur:DURATIONS[A.dur] ? A.dur : FIRST_DEFAULTS.dur,
    protect:Array.isArray(A.protect) ? A.protect.slice() : FIRST_DEFAULTS.protect.slice(), groups:FIRST_GROUPS(), focus:null, day:0});
  s.gen = {...(s.gen || {}), goal, format:'classic', level};
  ensureProtect(s); ensureDur(s);
  return s;
}

const FR = {A:{}, i:0, done:false, closing:false};
/* шаги для текущих ответов: в зале вопроса об инвентаре нет (место не выбрано — считаем с ним: «Шаг 1 из 4») */
function frSteps() {
  const p = FR.A.place ? placeOf(S, FR.A.place) : null;
  return ['place'].concat(!p || !placeHasAll(p) ? ['equip'] : [], ['goal', 'more']);
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
      const on = new Set(FR.A.protect || []);
      return frQ('fr-q-dur', 'Сколько времени на одну тренировку?',
          `<div class="fr-seg">${Object.entries(DURATIONS).map(([k, d]) => `<button type="button" data-fr-dur="${k}"${frPressed(FR.A.dur === k)}><b>${d.name}</b><small>${d.hint}</small></button>`).join('')}</div>`,
          'Без разминки и заминки — на них ещё 10–15 минут.')
        + frQ('fr-q-lvl', 'Ваш опыт', `<div class="fr-opts">${Object.entries(LEVELS).map(([k, l]) => frOpt(`data-fr-level="${k}"`, FR.A.level === k, l.ask, l.about)).join('')}</div>`)
        + frQ('fr-q-joint', `${'Что беречь?'} <em>${'Необязательно'}</em>`,
          `<div class="chips">${FIRST_PROTECT.map(id => PROTECT_BY[id]).map(p => `<button type="button" class="chip${on.has(p.id) ? ' on' : ''}" data-fr-protect="${p.id}" aria-pressed="${on.has(p.id)}">${ICON.check}<span>${p.name}</span></button>`).join('')}</div>`,
          'Отметьте, что болит или восстанавливается: в план не попадут упражнения с сильной нагрузкой на эти места.');
    }}
};
/* вопрос последнего шага: заголовок, варианты, пояснение под ними */
const frQ = (id, title, inner, note = '') => `<section class="fr-q" role="group" aria-labelledby="${id}"><h3 id="${id}">${title}</h3>${inner}${note ? `<p class="fr-note">${note}</p>` : ''}</section>`;

function frRender(focus = true) {
  const steps = frSteps(); FR.i = Math.min(FR.i, steps.length - 1);
  const id = steps[FR.i], st = FR_STEP[id], last = FR.i === steps.length - 1;
  $('#fr-count').textContent = `Шаг ${FR.i + 1} из ${steps.length}`;
  $('#fr-title').textContent = st.title;
  $('#fr-lead').textContent = st.lead; $('#fr-lead').hidden = !st.lead;
  $('#fr-body').innerHTML = st.body();
  $('#fr-back').hidden = FR.i === 0; $('#fr-skip').hidden = last;
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
  FR.done = true;
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
}
function openFirstRun() {
  const d = $('#first-run');
  if (!FIRST_RUN || FR.done || !d || typeof d.showModal !== 'function') return false;
  FR.A = {}; FR.i = 0;
  stopFigures(); /* фигуры плана под окном не крутятся */
  document.documentElement.classList.add('first-run');
  d.showModal(); frRender();
  return true;
}
/* для проверок: закрыть окно, ничего не меняя в параметрах, — приложение как при первом запуске прежних версий
   (план по умолчанию, его фигуры запущены, в хранилище — только отметка «план показан») */
function firstRunClose() {
  if (FR.done) return; FR.done = true;
  try { localStorage.setItem(PLAN_SEEN, '1'); } catch (e) {}
  const d = $('#first-run'); FR.closing = true; if (d && d.open) d.close(); FR.closing = false;
  document.documentElement.classList.remove('first-run');
  if (S.view === 'plan') renderPlanView();
}
function setupFirstRun() {
  const d = $('#first-run'); if (!d) return;
  d.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t || !d.contains(t)) return;
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
      return;
    }
    /* последний шаг: время и опыт — один ответ, суставы — сколько угодно */
    const one = (key, attr) => { A[key] = t.dataset[attr]; d.querySelectorAll(`[data-${attr.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}]`).forEach(b => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); };
    if (t.dataset.frDur) return one('dur', 'frDur');
    if (t.dataset.frLevel) return one('level', 'frLevel');
    if (t.dataset.frProtect) {
      const id = t.dataset.frProtect, list = A.protect || [], on = !list.includes(id);
      A.protect = on ? list.concat(id) : list.filter(x => x !== id);
      t.classList.toggle('on', on); t.setAttribute('aria-pressed', String(on));
    }
  });
  /* Esc и системная «Назад» там, где она закрывает окно (Chrome на Android), — на предыдущий шаг; с первого — пропустить */
  d.addEventListener('cancel', e => { e.preventDefault(); if (FR.i > 0) frBack(); else frFinish(true); });
  /* окно закрылось само (браузер не дал отменить закрытие) — как «Пропустить» */
  d.addEventListener('close', () => { if (!FR.closing && !FR.done) frFinish(true); });
}
