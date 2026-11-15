/* ===================== ДАННЫЕ БЕЗ ПОТЕРЬ: вкладки, тренировка, сообщения =====================
   Хранилище и безопасный запуск — 00a-keep.js; проверка записей журнала — 13a-sets.js (checkLog); восстановление копии —
   18-measures.js. Здесь:
   · начатая тренировка хранит свой список упражнений (workoutSnap): обновление приложения или новая сборка плана не меняют
     оставшиеся упражнения (Ксения 12);
   · другая вкладка записала подход — журнал и настройки сливаются (13-log.js: logMergeDisk, 11-planner.js: settingsMerge),
     экран обновляется; подход, записанный в двух вкладках под одним номером, остаётся в обеих (Ксения 3, Артём 3);
   · сообщения о спасённых данных и о хранилище, которое не принимает записи (Ксения 1, 6, 7, 15), просьба к браузеру хранить
     данные постоянно (navigator.storage.persist) и строка «где хранятся данные» в журнале (Кира 16, Михаил 12).
   Проверки — tools/data-keep.test.js, в браузере — tools/ui-check.mjs. */

/* ---------- тренировка хранит свой список ---------- */
/* что определяет состав тренировки: если это не менялось, а список вышел другим, — изменилась сборка плана (новая версия),
   и начатая тренировка идёт по своему списку */
function planCtx() {
  const c = S.mode === 'custom' && typeof customOf === 'function' ? customOf() : null;
  return JSON.stringify([S.mode, S.day, S.week, S.days, S.split, S.goal, S.format, S.level, S.count, [...S.groups].sort(), [...S.equip].sort(), S.seed,
    S.focus, S.dur, [...(S.protect || [])].sort(), S.place, S.adapt || null, S.swaps || {}, S.logPick ? S.logPick.d + JSON.stringify(S.logPick.groups) : null,
    c ? [c.id, c.items, c.goal, c.format, c.level] : null, !!(typeof AR !== 'undefined' && AR.light)]);
}
/* очередь подходов → {ctx, items:[упражнение с дозировкой], q:[[номер упражнения, подход, подходов, отдых, этап]]} */
function workoutSnap(queue) {
  if (!Array.isArray(queue) || !queue.length) return null;
  const items = [], at = new Map();
  for (const s of queue) if (!at.has(s.it)) {
    at.set(s.it, items.length);
    const it = s.it;
    items.push({id:it.ex.id, slot:it.slot, label:it.label, name:it.name, eqIds:it.eqIds || [], eqLine:it.eqLine || '', rounds:it.rounds, rx:JSON.parse(JSON.stringify(it.rx || {}))});
  }
  return {ctx:planCtx(), items, q:queue.map(s => [at.get(s.it), s.k, s.n, s.rest, s.phase])};
}
function snapItem(o) {
  const ex = EXI[o.id]; if (!ex) return null;
  const E = effEquip(S.equip);
  return {ex, slot:o.slot, label:o.label, name:typeof o.name === 'string' ? o.name : exName(ex, E), eqIds:Array.isArray(o.eqIds) ? o.eqIds : chosenEquip(ex, E),
    eqLine:typeof o.eqLine === 'string' ? o.eqLine : equipLine(ex, E), has:propHas(ex, E), rx:{...o.rx}, rounds:o.rounds, sub:null};
}
/* сохранённая тренировка → очередь: из списка (с 4.107) или, у тренировок прежних версий, из её отметки stamp — там упражнения,
   номера подходов, число подходов, отдых и повторы каждого подхода; дозировка остального — как сейчас */
function queueFromSaved(saved) {
  const sn = saved && saved.snap;
  if (sn) {
    const items = sn.items.map(snapItem); if (items.some(x => !x)) return null;
    return sn.q.map(([i, k, n, rest, phase]) => ({it:items[i], k, n:Number.isInteger(n) && n > 0 ? n : items[i].rx.sets, rest:Number(rest) || 0, phase:typeof phase === 'string' ? phase : 'Классика'}));
  }
  let a = null; try { a = JSON.parse(saved.stamp); } catch (e) { return null; }
  if (!Array.isArray(a) || a.length < 6 || !Array.isArray(a[5])) return null;
  const [, , , format] = a, steps = a[5], items = new Map(), q = [];
  for (const st of steps) {
    if (!Array.isArray(st) || !EXI[st[0]] || !Number.isInteger(st[1])) return null;
    let it = items.get(st[0]);
    if (!it) { it = previewItem(st[0]); it.label = String(items.size + 1); it.eqIds = chosenEquip(it.ex, effEquip(S.equip)); it.slot = items.size; it.sub = null; it.rx = {...it.rx}; items.set(st[0], it); }
    const n = Number.isInteger(st[2]) && st[2] > 0 ? st[2] : it.rx.sets;
    it.rx.sets = n; if (st[4] != null) it.rx.reps = st[4]; if (format === 'circuit') { it.rx.circ = true; it.rounds = n; }
    q.push({it, k:st[1], n, rest:Number(st[3]) || 0, phase:format === 'circuit' ? `Круг ${st[1] + 1} из ${n}` : format === 'superset' ? `Суперсет · круг ${st[1] + 1}` : 'Классика'});
  }
  return q.length ? q : null;
}
/* очередь для «Начать / Продолжить тренировку»: начатая сегодня (или не законченная вчера) тренировка, в которой уже есть
   подходы, — по своему списку, пока не меняли то, из чего собирается план; иначе — по плану */
function workoutQueueNow(saved = workoutLoad()) {
  const q = plan && plan.items && plan.items.length ? workoutQueue(plan) : [];
  if (!saved || saved.ended || saved.stamp === workoutStamp(q)) return q;
  if (saved.snap ? saved.snap.ctx !== planCtx() : !legacyCtxSame(saved.stamp)) return q;
  const sq = queueFromSaved(saved); if (!sq) return q;
  const days = wkDaysWith(saved.days, todayKey());
  return sq.some(s => wkSet(LOG.data, s.it.ex.id, s.k, days)) ? sq : q;
}
/* у тренировки прежней версии: что собрать, день, неделя, формат и цель — те же */
function legacyCtxSame(stamp) {
  try { const a = JSON.parse(stamp); return Array.isArray(a) && a[0] === S.mode && a[1] === S.day && a[2] === S.week && a[3] === S.format && a[4] === S.goal; } catch (e) { return false; }
}

/* ---------- подход, который записала другая вкладка ---------- */
/* у подхода на экране сейчас запись, которой не было, когда его показали: её сделала другая вкладка */
function workoutTaken(step) {
  if (!workout || workout.shown !== 'null') return null;
  return workoutValue(step) || null;
}
/* «Подход выполнен» на таком подходе: записывается следующим номером этого упражнения сегодня, оба подхода остаются */
function workoutCommitTaken(step, got, taken) {
  const ex = step.it.ex, s = todaySession(ex.id, true), lr = lrOn(ex);
  let rec = lr ? makeSidedSet([got[0].kg, got[0].reps], [got[1].kg, got[1].reps], ex) : null;
  if (!rec) rec = [got[0].kg, got[0].reps];
  const days = workoutDays(), used = k => !!s.s[k] || !!wkSet(LOG.data, ex.id, k, days);
  let k = step.k + 1; while (used(k)) k++;
  while (s.s.length < k) s.s.push(null);
  s.s[k] = rec; s.target = Math.max(s.target || 0, step.n); if (step.it.rx.static) s.fmt = 'static'; markImpl(s, step.it); markActive(s.d);
  if (!workout.days.includes(s.d)) workout.days.push(s.d);
  delete workout.drafts[workoutDraftKey(step)];
  logTouch(ex.id); logRefresh([ex.id]);
  const next = workoutFirstOpen(workout.queue, workout.index);
  if (next < 0) { workoutFinish(); return; }
  workoutShow(next);
  $('#wv-save-status').textContent = `${'Подход'} ${step.k + 1} ${'уже записан в другой вкладке:'} ${setText(taken, ex)}. ${'Этот записан подходом'} ${k + 1}.`;
  saveWorkout();
}
/* журнал изменила другая вкладка: экран тренировки — по журналу. Подход на экране записан там, а здесь в полях ничего
   не вписано — переход к следующему несделанному */
function workoutOtherTab() {
  if (!workout || !$('#workout-view') || !$('#workout-view').open || $('#wv-active').hidden) return;
  const step = workout.queue[workout.index]; if (!step) return;
  const v = workoutTaken(step), d = workout.drafts[workoutDraftKey(step)], typed = d && Object.values(d).some(x => String(x || '').trim());
  if (v && !typed) {
    const next = workoutFirstOpen(workout.queue, workout.index);
    if (next < 0) { workoutFinish(); return; }
    workoutShow(next);
    $('#wv-save-status').textContent = `${'Подход'} ${step.k + 1} ${'записан в другой вкладке:'} ${setText(v, step.it.ex)}.`;
  } else if (typeof workoutTick === 'function') workoutTick();
}

/* ---------- изменения из другой вкладки ---------- */
/* фокус в поле ввода — перерисовка позже (когда поле отпустят), чтобы не сбить ввод */
let keepRepaint = null;
function keepPaintLater(fn) {
  const ae = document.activeElement, typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT');
  if (!typing) { fn(); return; }
  keepRepaint = fn;
  ae.addEventListener('blur', () => { const f = keepRepaint; keepRepaint = null; if (f) setTimeout(f, 0); }, {once:true});
}
Keep.watch(LOG_KEY, text => {
  if (text == null || text === logBase) return;
  const changed = logMergeDisk(text);
  if (!changed.length) return;
  workoutOtherTab();
  keepPaintLater(() => logRefresh(changed));
});
Keep.watch(STORE, text => {
  const took = settingsMerge(text); if (!took.length) return;
  ensurePlaces(S); ensureCustoms(S); ensureFold(S); ensureProtect(S);
  S.lr = cleanLr(S.lr);
  swaps = S.swaps && typeof S.swaps === 'object' && !Array.isArray(S.swaps) ? S.swaps : (S.swaps = {});
  if (workout && $('#workout-view') && $('#workout-view').open) return; /* план перерисуется, когда тренировку закроют */
  keepPaintLater(() => { const y = window.scrollY; renderSetup(); renderPlan(); window.scrollTo(0, y); });
});
Keep.watch(BODY_KEY, text => {
  if (text == null) return;
  const p = bodyParse(text); if (!p) return;
  const merged = mergeBodyRows(BODY.rows, p.rows);
  if (JSON.stringify(merged) === JSON.stringify(BODY.rows)) return;
  BODY.rows = merged;
  if (S.view === 'journal') keepPaintLater(renderJournal);
});

/* ---------- сообщения: спасённые данные, хранилище ---------- */
const KEEP_DISMISSED = new Set();
/* хранилище не принимает записи: заметно, с выходом — полная копия в файл (и на странице, и на экране тренировки) */
function keepBadHtml() {
  const st = Keep.state(); if (st === 'ok') return '';
  return `<div class="keep-note keep-bad" role="alert"><p><b>${st === 'full' ? 'Записи не сохраняются: хранилище браузера переполнено.' : 'Записи не сохраняются на этом устройстве: браузер запретил сайту хранить данные.'}</b> `
    + `${st === 'full' ? 'Место могли занять и другие страницы этого сайта.' : 'Так бывает в приватном окне или при запрете сохранять данные сайтов.'} ${'Пока страница открыта, записанное есть в памяти — сохраните полную копию в файл, чтобы его не потерять.'}</p>`
    + `<div class="keep-b"><button type="button" class="btn" data-keep="backup">${'Сохранить копию в файл'}</button></div></div>`;
}
function keepNoteHtml() {
  const notes = Keep.notes(), parts = [keepBadHtml()];
  const fixed = [];
  const s = notes.get('settings'); if (s && !KEEP_DISMISSED.has('settings')) fixed.push(s.whole ? 'Сохранённые настройки не читались — открыты обычные.' : `Часть сохранённых настроек была испорчена и заменена обычными: ${settingsBadText(s.fields)}.`);
  const l = notes.get('log'); if (l && !KEEP_DISMISSED.has('log')) fixed.push(l.whole ? 'Журнал в памяти браузера не читался.' : l.cut ? `Журнал в памяти браузера был обрезан — уцелело записей: ${l.kept}.` : `В журнале в памяти браузера были испорченные записи — они не показываются: ${logDropText(l.drops)}.`);
  const b = notes.get('body'); if (b && !KEEP_DISMISSED.has('body')) fixed.push(`Часть замеров в памяти браузера не читалась — пропущено: ${b.dropped}.`);
  const safe = notes.get('safe'); if (safe && !KEEP_DISMISSED.has('safe')) fixed.push('Приложение не открылось с сохранёнными настройками и запущено с обычными. Журнал и замеры на месте.');
  if (fixed.length) parts.push(`<div class="keep-note" role="status"><p>${fixed.map(esc).join(' ')} ${'Испорченное не стёрто: оно сохранено отдельно, его можно скачать файлом.'}</p>`
    + `<div class="keep-b"><button type="button" class="btn btn-2" data-keep="broken">${'Скачать испорченное'}</button><button type="button" class="btn btn-2" data-keep="ok">${'Понятно'}</button></div></div>`);
  return parts.join('');
}
function keepPaint() {
  if (typeof document === 'undefined' || !document.body || !document.querySelector) return;
  const html = keepNoteHtml();
  let box = document.getElementById('keep-notes');
  if (!box) { if (!html) return; box = document.createElement('div'); box.id = 'keep-notes'; const main = document.querySelector('main'); if (main && main.parentNode) main.parentNode.insertBefore(box, main); else document.body.prepend(box); }
  if (box.innerHTML !== html) box.innerHTML = html;
  /* на экране тренировки (модальное окно поверх страницы) — то же предупреждение о хранилище */
  const wv = document.getElementById('workout-view');
  if (wv) {
    let w = document.getElementById('keep-notes-wv'); const bad = keepBadHtml();
    if (!w && bad) { w = document.createElement('div'); w.id = 'keep-notes-wv'; wv.prepend(w); }
    if (w && w.innerHTML !== bad) w.innerHTML = bad;
  }
  const st = $('#log-status'); if (st) st.innerHTML = statusHtml();
}
Keep.on(() => keepPaint());
async function keepBackupFile() {
  const name = `${backupStem()}-${todayKey()}.json`;
  const r = await saveFile(name, JSON.stringify(backupObject()), 'application/json');
  return r;
}
function keepBrokenFile() {
  const list = Keep.broken();
  return saveFile(`lazy-gym-broken-${todayKey()}.json`, JSON.stringify({app:'podhod', broken:true, exported:new Date().toISOString(), items:list}, null, 1), 'application/json');
}
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-keep]'); if (!t) return;
  const a = t.dataset.keep;
  if (a === 'backup') keepBackupFile().then(r => { if (r === 'ok') t.textContent = 'Копия сохранена'; });
  else if (a === 'broken') keepBrokenFile();
  else if (a === 'ok') { for (const k of ['settings', 'log', 'body', 'safe']) KEEP_DISMISSED.add(k); keepPaint(); const f = $('#views button[aria-selected="true"]') || $('#views button'); if (f) f.focus(); }
});

/* ---------- где хранятся данные: постоянное хранилище, iPhone ---------- */
const KEEP_STORE = {persisted:null, asked:false};
const isIOS = () => typeof navigator !== 'undefined' && (/iP(hone|ad|od)/.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
const isStandalone = () => typeof navigator !== 'undefined' && (navigator.standalone === true || (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches));
function keepPersistRead() {
  const sm = typeof navigator !== 'undefined' && navigator.storage;
  if (!sm || typeof sm.persisted !== 'function') return;
  sm.persisted().then(v => { KEEP_STORE.persisted = !!v; const st = $('#log-status'); if (st) st.innerHTML = statusHtml(); }).catch(() => {});
}
/* Просьба к браузеру не стирать данные сайта самому (при нехватке места, у Safari — после 7 дней без захода): после первого
   записанного подхода — человек уже пользуется журналом (Firefox спрашивает разрешения окном) */
function keepPersistAsk() {
  const sm = typeof navigator !== 'undefined' && navigator.storage;
  if (KEEP_STORE.asked || KEEP_STORE.persisted || !sm || typeof sm.persist !== 'function' || LOG.mode === 'cloud') return;
  KEEP_STORE.asked = true;
  sm.persist().then(v => { KEEP_STORE.persisted = !!v; const st = $('#log-status'); if (st) st.innerHTML = statusHtml(); }).catch(() => {});
}
/* строка о хранении в журнале (statusHtml, 13-log.js): где хранится, просил ли браузер не стирать, что с iPhone */
function storageLineHtml() {
  if (LOG.mode === 'cloud') return '';
  const st = Keep.state();
  if (st !== 'ok') return '';
  const parts = [];
  if (KEEP_STORE.persisted === true) parts.push('Браузер обещал не стирать их сам.');
  else if (KEEP_STORE.persisted === false) parts.push('Браузер может стереть их сам, если на устройстве кончится место.');
  if (isIOS() && !isStandalone()) parts.push('На iPhone и iPad Safari стирает данные сайта, если его не открывать 7 дней, — добавьте приложение на экран «Домой» («Поделиться» → «На экран „Домой“») и делайте копию.');
  const big = Keep.usage(); if (big > 3.5e6) parts.push(`Данные приложения занимают ${(big / 1e6).toFixed(1).replace('.', DEC)} млн знаков из примерно 5 млн, которые браузер даёт сайту, — сохраните полную копию в файл.`);
  return parts.length ? ' ' + parts.join(' ') : '';
}
