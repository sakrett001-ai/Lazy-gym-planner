/* ===================== ПОДСКАЗКА «УСТАНОВИТЬ» (4.112; Ольга 26, Кира 16) =====================
   Как поставить приложение на телефон — по делу, один раз, с возможностью закрыть.
   · Кому: телефон или планшет (iPhone, iPad, Android), страница сайта (http/https, не файл и не встроенное окно),
     приложение ещё не установлено (isStandalone, 18a-data-keep.js) и подсказку не закрывали.
   · Когда: в журнале уже есть тренировка — человек пользуется приложением, и ему есть что терять (на iPhone Safari стирает
     данные сайта после 7 дней без захода, если приложение не на экране «Домой»). В первый запуск подсказки нет.
   · Шаги разные: iPhone и iPad — «Поделиться» → «На экран „Домой“» (своего окна установки у Safari нет); Android — кнопка
     «Установить», если браузер дал событие beforeinstallprompt (Chrome, Edge, Samsung Internet), иначе — где это в меню.
   · «Понятно» закрывает навсегда (podhod.install.v1 в хранилище браузера: в копию и на другие устройства не переносится —
     там своя установка); после установки (appinstalled) подсказка исчезает сама.
   Кнопка «Установить» — единственная новая кнопка: это и есть действие подсказки, без неё на Android пришлось бы искать
   пункт в меню браузера. */
const INSTALL_KEY = 'podhod.install.v1';
const INSTALL = {evt:null, closed:false};
try { INSTALL.closed = !!(JSON.parse(localStorage.getItem(INSTALL_KEY) || 'null') || {}).closed; } catch (e) {}
const isAndroid = () => typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
/* можно ли здесь установить: страница сайта, не во встроенном окне */
function installPlace() {
  if (typeof location === 'undefined' || !/^https?:$/.test(location.protocol)) return false;
  try { return window.self === window.top; } catch (e) { return false; }
}
/* какая подсказка нужна: 'ios', 'android' или null (не нужна). days — тренировок в журнале */
function installKind(days = typeof journalDays === 'function' ? journalDays() : 0) {
  if (INSTALL.closed || !installPlace() || isStandalone() || days < 1) return null;
  return isIOS() ? 'ios' : isAndroid() ? 'android' : null;
}
function installHintHtml(kind = installKind(), canPrompt = !!INSTALL.evt) {
  if (!kind) return '';
  const close = `<button type="button" class="btn btn-2" data-install="close">${'Понятно'}</button>`;
  if (kind === 'ios') return `<div class="keep-note install-note" role="note"><p><b>${'Поставьте приложение на экран «Домой».'}</b> ${'Оно будет открываться как обычное приложение, и Safari не сотрёт журнал. В Safari нажмите «Поделиться» (квадрат со стрелкой вверх), затем «На экран „Домой“».'}</p><div class="keep-b">${close}</div></div>`;
  return `<div class="keep-note install-note" role="note"><p><b>${'Установите приложение на телефон.'}</b> ${canPrompt ? 'Значок появится на главном экране, приложение работает и без интернета.' : 'Значок появится на главном экране, приложение работает и без интернета. Откройте меню браузера (⋮) и выберите «Установить приложение» или «Добавить на главный экран».'}</p><div class="keep-b">${canPrompt ? `<button type="button" class="btn" data-install="go">${'Установить'}</button>` : ''}${close}</div></div>`;
}
function installPaint() {
  if (typeof document === 'undefined' || !document.body || !document.querySelector) return;
  /* первый запуск и окна поверх страницы подсказку не получают: она — на странице плана и журнала */
  const html = document.querySelector('#first-run[open]') ? '' : installHintHtml();
  let box = document.getElementById('install-hint');
  if (!box) { if (!html) return; box = document.createElement('div'); box.id = 'install-hint'; const main = document.querySelector('main'); if (main && main.parentNode) main.parentNode.insertBefore(box, main); else return; }
  if (box.innerHTML !== html) box.innerHTML = html;
}
function installClose() {
  INSTALL.closed = true;
  try { localStorage.setItem(INSTALL_KEY, JSON.stringify({closed:true})); } catch (e) {}
  installPaint();
}
if (typeof window !== 'undefined' && window.addEventListener) {
  /* Chrome на Android: событие с окном установки. Своё окно браузера (полоска внизу) отменяется, только когда показана
     наша подсказка с кнопкой — иначе всё как раньше. Если окно по сохранённому событию не открылось, подсказка
     остаётся — с тем, где это в меню браузера */
  window.addEventListener('beforeinstallprompt', e => {
    INSTALL.evt = e;
    if (installKind() === 'android') { e.preventDefault(); installPaint(); }
  });
  window.addEventListener('appinstalled', () => { INSTALL.evt = null; installClose(); });
  window.addEventListener('load', () => setTimeout(installPaint, 600));
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-install]'); if (!t) return;
    if (t.dataset.install === 'close') { installClose(); const f = document.querySelector('#views button[aria-selected="true"]'); if (f) f.focus(); return; }
    const ev = INSTALL.evt; if (!ev || typeof ev.prompt !== 'function') return;
    INSTALL.evt = null;
    Promise.resolve().then(() => ev.prompt()).then(() => ev.userChoice).then(c => { if (c && c.outcome === 'accepted') installClose(); else installPaint(); }).catch(() => installPaint());
  });
  /* после тренировки (окно закрылось) в журнале появилась первая запись — подсказка к месту */
  document.addEventListener('close', e => { if (e.target && e.target.id === 'workout-view') installPaint(); }, true);
}
