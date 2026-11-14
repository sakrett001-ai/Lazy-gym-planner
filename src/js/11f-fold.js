/* ===================== СВОРАЧИВАНИЕ БЛОКОВ =====================
   Объёмные блоки сворачиваются в строку-сводку, из которой видно главное:
   • параметры (на телефоне и планшете — на компьютере они в боковой колонке и не мешают);
   • нагрузка по мышцам в шапке плана;
   • в карточке упражнения — мышцы и таблица записи подходов (подсказка по весу остаётся на виду).
   «Подробно / Компактно» над карточками задаёт, как они открываются; отдельную карточку можно развернуть или
   свернуть — это помнится до перезагрузки страницы. Параметры, нагрузка и вид карточек сохраняются в настройках. */
const FOLD_CARDS = ['compact', 'full'];
function ensureFold(s) {
  const f = s.fold && typeof s.fold === 'object' ? s.fold : {};
  s.fold = {setup:f.setup === true, load:f.load === true, cards:FOLD_CARDS.includes(f.cards) ? f.cards : 'compact', gentle:f.gentle === true};
  return s.fold;
}
ensureFold(S);
/* После первого плана параметры на телефоне и планшете свёрнуты: при каждом следующем запуске на первом экране —
   план, а не два с половиной экрана параметров (выбранное видно строкой, нажатие ведёт к полю). Самый первый
   запуск открывает мастер из нескольких вопросов (11k-first-run.js); после него параметры тоже свёрнуты, а отметка
   «план показан» пишется, только когда мастер пройден или пропущен (FIRST_RUN, 11-planner.js). На компьютере параметры
   в боковой колонке. */
const PLAN_SEEN = 'podhod.planSeen.v1';
const setupFoldsHere = () => typeof matchMedia === 'function' && matchMedia('(max-width:959px)').matches;
(() => {
  if (FIRST_RUN) return;
  let seen = false;
  try { seen = !!(localStorage.getItem(PLAN_SEEN) || localStorage.getItem(STORE)); localStorage.setItem(PLAN_SEEN, '1'); } catch (e) {}
  if (seen && setupFoldsHere()) S.fold.setup = true;
})();
const FOLD_GROUPS = ['mus', 'log'];
const cardFold = new Map(); /* «группа:упражнение» → раскрыт ли блок в этой карточке, если человек менял его сам */
function cardOpen(g, id) { const k = g + ':' + id; return cardFold.has(k) ? cardFold.get(k) : ensureFold(S).cards === 'full'; }
function cardFoldClass(id) { return FOLD_GROUPS.filter(g => cardOpen(g, id)).map(g => ' open-' + g).join(''); }
const lowFirst = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
const chev = '<i class="cg-chev" aria-hidden="true"></i>';

/* ---------- карточка: мышцы и запись подходов ---------- */
function musFoldHead(ex) {
  const open = cardOpen('mus', ex.id), list = ms => ms.map((m, i) => i ? lowFirst(MUSCLE_NAMES[m]) : MUSCLE_NAMES[m]).join(', ');
  return `<button type="button" class="cg-h" data-cfold="mus" aria-expanded="${open}"><span class="cg-x"><span class="cg-t">Мышцы</span><span class="cg-s cg-mus"><span class="cg-p">${list(ex.pri)}</span>${ex.sec.length ? `<span class="cg-sec">${list(ex.sec)}</span>` : ''}</span></span>${chev}</button>`;
}
function logFoldBar(it, n, done) {
  const id = it.ex.id, open = cardOpen('log', id), cnt = histCount(id);
  return `<div class="lt-bar"><button type="button" class="cg-h lt-tog" data-cfold="log" aria-expanded="${open}" aria-controls="lt-${id}"><span class="cg-x"><span class="cg-t">Подходы</span><span class="cg-s${done ? ' cg-done' : ''}">${logBarText(done, n)}</span></span>${chev}</button>
    <button type="button" class="btn-ghost" data-hist="1" aria-expanded="false">${ICON.chart}<span>История</span><span class="vh">: ${esc(it.name)}</span><small>${cnt || ''}</small></button></div>`;
}
function logBarText(done, n) { return `${done} из ${n}`; }
/* отметили или сняли подход — счётчик в заголовке записи */
function logBarUpdate(card) {
  const s = card && card.querySelector('.lt-tog .cg-s'); if (!s) return;
  const done = card.querySelectorAll('.lt-r.done').length;
  s.textContent = logBarText(done, card.querySelectorAll('.lt-r').length); s.classList.toggle('cg-done', done > 0);
}
/* после перерисовки записи: кнопка «История» знает, открыта ли история */
function syncCardLog(card) {
  const h = card.querySelector('.c-hist'), hb = card.querySelector('[data-hist]');
  if (h && hb) hb.setAttribute('aria-expanded', String(!h.hidden));
}
function setCardsView(v) {
  ensureFold(S).cards = v; cardFold.clear(); saveSettings();
  document.querySelectorAll('.card[data-ex]').forEach(card => {
    for (const g of FOLD_GROUPS) {
      const open = cardOpen(g, card.dataset.ex);
      card.classList.toggle('open-' + g, open);
      card.querySelectorAll(`[data-cfold="${g}"]`).forEach(b => b.setAttribute('aria-expanded', String(open)));
    }
  });
  document.querySelectorAll('[data-cards]').forEach(b => { const on = b.dataset.cards === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
}
function cardsViewHtml() {
  const v = ensureFold(S).cards, b = (k, label) => `<button type="button" data-cards="${k}" class="${v === k ? 'on' : ''}" aria-pressed="${v === k}">${label}</button>`;
  return `<div class="fold-bar"><span>Карточки</span><div class="fold-seg" role="group" aria-label="Вид карточек">${b('compact', 'Компактно')}${b('full', 'Подробно')}</div></div>`;
}

/* ---------- шапка плана: нагрузка по мышцам ---------- */
function loadFoldHead(title, top) {
  const open = !ensureFold(S).load;
  return `<button type="button" class="cg-h lb-h" data-lfold="1" aria-expanded="${open}"><span class="cg-x"><span class="cg-t">${title}</span><span class="cg-s">${top}</span></span>${chev}</button>`;
}
function loadTop(rows) { return rows.slice(0, 3).map(([n, v], i) => `${i ? lowFirst(n) : n} ${fmtNum(v)}`).join(', '); }

/* ---------- параметры на телефоне ---------- */
function setupSummary() {
  const out = [];
  const go = (sel, text) => out.push(`<button type="button" class="sb-chip" data-sgo="${sel}">${esc(text)}</button>`);
  if (S.mode === 'program') { go('#f-mode', 'Программа на неделю'); go('#f-prog', `${S.days} ${plural(S.days, 'тренировка', 'тренировки', 'тренировок')} · ${SPLITS[splitFor(S.days)].name}`); }
  else if (S.mode === 'custom') { go('#f-mode', 'Свой план'); go('#f-custom', customOf().name); }
  else go('#f-mode', 'Тренировка на день');
  go('#f-goal', `${GOALS[S.goal].name} · ${FORMATS[S.format].name.toLowerCase()} · ${LEVELS[S.level].name.toLowerCase()}`);
  /* время на тренировку задано — вместо числа упражнений (оно подобрано под время, 11j-duration.js) */
  const D = typeof durationOf === 'function' ? durationOf() : null;
  if (D) go('#f-dur', D.say);
  if (S.mode === 'single') { if (!D) go('#count-l', `${S.count} ${plural(S.count, 'упражнение', 'упражнения', 'упражнений')}`); go('#f-muscles', S.groups.length ? titleFor() : 'Мышцы не выбраны'); }
  if (typeof PROTECT_BY !== 'undefined' && S.protect && S.protect.length) go('#f-joints', 'Бережём ' + hitsText(S.protect.map(id => PROTECT_BY[id])));
  go('#e-places', placeOf().name);
  return out.join('');
}
function setupBarHtml() {
  const folded = ensureFold(S).setup;
  return `<div class="sb-head"><h2 class="lbl">Параметры</h2><button type="button" class="sb-tog" data-sfold="1" aria-expanded="${!folded}">${folded ? 'Развернуть' : 'Свернуть'}${chev}</button></div>${folded ? `<div class="sb-chips">${setupSummary()}</div>` : ''}`;
}
function renderSetupFold() {
  const folded = ensureFold(S).setup, bar = $('#setup-bar');
  $('.setup').classList.toggle('folded', folded);
  if (bar) bar.innerHTML = setupBarHtml();
}
function setSetupFold(folded, from) {
  ensureFold(S).setup = folded; saveSettings(); renderSetupFold();
  /* свернули снизу — возвращаемся к сводке, иначе план «уезжает» вверх */
  if (folded && from === 'end') { const bar = $('#setup-bar'); if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({block:'start'}); }
}

document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.cfold) {
    const card = t.closest('.card'), g = t.dataset.cfold, id = card.dataset.ex, open = !card.classList.contains('open-' + g);
    cardFold.set(g + ':' + id, open); card.classList.toggle('open-' + g, open);
    card.querySelectorAll(`[data-cfold="${g}"]`).forEach(b => b.setAttribute('aria-expanded', String(open)));
    return;
  }
  if (t.dataset.cards) { setCardsView(t.dataset.cards); return; }
  if (t.dataset.lfold) {
    const folded = !ensureFold(S).load; S.fold.load = folded; saveSettings();
    const fig = t.closest('.p-load'); if (fig) fig.classList.toggle('folded', folded);
    const head = t.closest('.p-head'); if (head) head.classList.toggle('load-folded', folded);
    t.setAttribute('aria-expanded', String(!folded));
    return;
  }
  if (t.dataset.sfold) { setSetupFold(!ensureFold(S).setup, t.id === 'setup-fold-end' ? 'end' : 'top'); return; }
  if (t.dataset.sgo) {
    setSetupFold(false);
    const n = $(t.dataset.sgo), f = n && (n.closest('.field') || n);
    if (f) { f.scrollIntoView({block:'start'}); const b = f.querySelector('button, input, select'); if (b) b.focus({preventScroll:true}); }
  }
});
