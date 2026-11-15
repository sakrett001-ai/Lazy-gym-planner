/* ===================== ЖУРНАЛ ===================== */
/* Хранилище: в опубликованной версии — аккаунт (db, личный раздел пользователя),
   в офлайн-файле — браузер. Формат: LOG.data[exId] = [{d:'2026-10-05', wk?:1, eq?:'db', s:[[кг|null, повторы, отдых?, стороны?] | null, …]}, …].
   Третье поле подхода — необязательное: фактический отдых после подхода, целые секунды (пишет режим тренировки). Старые
   записи без него читаются как раньше, прежние версии приложения его просто не видят. Четвёртое — левая и правая
   сторона отдельно {l:[кг, повторы], r:[кг, повторы]} (переключатель «Л/П отдельно»); тогда отдых может быть пустым
   (null), а основные поля — слабая сторона. eq — снаряд (гантели, гиря, штанга) у упражнений с гантелями или гирей:
   по нему считается общий вес. Подробно — 13a-sets.js. */
const LOG_KEY = 'podhod.log.v1';
/* foreign — записи упражнений, которых нет в этой версии: хранятся и уходят в копию, не показываются (13a-sets.js: checkLog) */
const LOG = {mode:'connecting', data:{}, foreign:{}, col:null, pending:{}, writing:{}, again:{}, timers:{}, err:'', dl:null, canExport:false, undo:null};
const WEIGHTED = new Set(['db', 'bb', 'kb', 'cable', 'smith', 'legpress', 'legext', 'legcurl', 'pecdeck', 'hack', 'chestpress', 'shoulderpress', 'leverrow', 'tbar', 'abductor', 'calfseat', 'calfstand']);
const LOWER_G = new Set(['quads', 'hams', 'glutes', 'calves']);
const MACHINE = new Set(['cable', 'smith', 'legext', 'legcurl', 'pecdeck', 'chestpress', 'shoulderpress', 'leverrow', 'abductor', 'calfseat', 'calfstand', 'gravitron', 'hack', 'tbar']);
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function dayKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
/* «Сегодня» журнала (Ксения 13, 14). Обычно — дата на часах телефона. Но тренировка, начатая в 23:50 и законченная в 00:10,
   — одна тренировка (и через Новый год тоже), а после перелёта Москва → Нью-Йорк подход, записанный 5 минут назад, не
   «завтрашний». Поэтому день идущей тренировки помнится (podhod.active.v1: день и время последнего подхода, время — по
   абсолютным часам Date.now, они не зависят от часового пояса): если последний подход был не больше 3 часов назад, а дата
   на часах ушла на день вперёд или назад, «сегодня» — день тренировки. Часы, переведённые назад сильнее, — обычная дата:
   записи «из будущего» не теряются, в журнале идут после сегодняшних (recentKey), «прошлым разом» считаются (pastSessions). */
const ACTIVE_KEY = 'podhod.active.v1', ACTIVE_GAP = 3 * 3600e3;
let activeMem;
function activeRead(text) { try { const a = JSON.parse(text || 'null'); return a && typeof a.d === 'string' && /^\d{4}-\d\d-\d\d$/.test(a.d) && Number.isFinite(a.at) ? {d:a.d, at:a.at} : null; } catch (e) { return null; } }
function activeDay(now = Date.now()) {
  if (activeMem === undefined) { activeMem = activeRead(Keep.get(ACTIVE_KEY)); Keep.watch(ACTIVE_KEY, v => { activeMem = activeRead(v); }); }
  const a = activeMem; if (!a) return null;
  const gap = now - a.at; if (!(gap >= 0 && gap <= ACTIVE_GAP)) return null;
  const local = dayKey(new Date(now)); if (a.d === local) return null;
  const ut = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.abs(Math.round((ut(a.d) - ut(local)) / 864e5)) === 1 ? a.d : null;
}
const todayKey = () => activeDay() || dayKey(new Date());
/* подход записан: день тренировки и время */
function markActive(d = todayKey()) { activeMem = {d, at:Date.now()}; Keep.set(ACTIVE_KEY, JSON.stringify(activeMem)); if (typeof keepPersistAsk === 'function') keepPersistAsk(); }
/* порядок «по свежести»: сегодняшние записи — первыми, потом записи «из будущего» (часы переведены назад), потом прошлые */
function recentKey(d, today = todayKey()) { return (d === today ? '2' : d > today ? '1' : '0') + d; }
function byRecent(ss, today = todayKey()) {
  return ss.map(s => [recentKey(s.d, today), s]).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0).map(x => x[1]);
}
/* день записи: «сегодня», «9 ноя», «9 ноя 2025»; в сборке с датами через Intl (английская) — по языку браузера:
   en-US «Nov 9», en-GB «9 Nov» */
function fmtDay(k, withYear) {
  if (k === todayKey()) return 'сегодня';
  const [y, m, d] = k.split('-').map(Number), year = withYear && y !== new Date().getFullYear();
  if (localeOf().dates === 'intl' && typeof Intl !== 'undefined') {
    try { return new Intl.DateTimeFormat(localeTag(), {day:'numeric', month:'short', ...(year ? {year:'numeric'} : {})}).format(new Date(y, m - 1, d, 12)); } catch (e) {}
  }
  return `${d} ${MONTHS[m - 1]}${year ? ' ' + y : ''}`;
}
let DEC = localeOf().dec || ','; /* десятичный разделитель языка сборки (в английской — точка) */
const parseNum = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };
/* ---------- единицы веса ----------
   Хранится всё в килограммах (журнал, планы, вес тела, кг-инвентарь) и в сантиметрах (обхваты), показывается и вводится —
   в выбранных единицах. S.units — 'kg' | 'lb' (переключатель «Единицы» в журнале); не выбирали — по языку сборки:
   PODHOD_LOCALE.units 'kg' или 'region' — фунты, если регион в navigator.language — США, Либерия или Мьянма. В фунтах обхваты —
   в дюймах. Шаги прибавки, гантели, стек, гриф и блины в фунтах — свои, а не пересчёт килограммовых (stepFor, 17-warmup.js):
   вес, вписанный в фунтах, хранится в килограммах с запасом точности и показывается тем же числом фунтов. */
const LB_KG = 0.45359237, IN_CM = 2.54, LB_REGIONS = new Set(['US', 'LR', 'MM']);
function unitsDefault() {
  if (localeOf().units !== 'region') return 'kg';
  const tag = typeof navigator === 'undefined' ? '' : navigator.language || (navigator.languages || [])[0] || '';
  const m = /^[a-z]{2,3}(?:[-_][a-z]{4})?[-_]([a-z]{2}|\d{3})(?:$|[-_])/i.exec(String(tag));
  return m && LB_REGIONS.has(m[1].toUpperCase()) ? 'lb' : 'kg';
}
function wu() { const u = typeof S === 'undefined' ? null : S.units; return u === 'kg' || u === 'lb' ? u : unitsDefault(); }
const isLb = () => wu() === 'lb';
/* килограммы ↔ выбранные единицы; введённое в фунтах — в килограммы с точностью 0,00001 кг */
const toU = kg => isLb() ? kg / LB_KG : kg;
const fromU = v => isLb() ? Math.round(v * LB_KG * 1e5) / 1e5 : v;
/* подписи: «кг» / «фнт» (в английской сборке — kg / lb), обхваты — «см» / «дюйм» (cm / in) */
const wUnit = () => isLb() ? 'фнт' : 'кг';
const lUnit = () => isLb() ? 'дюйм' : 'см';
/* число в единицах показа: до сотых, без лишних нулей; fmtU1 — до десятых */
const fmtU = v => (Math.round(v * 100) / 100).toString().replace('.', DEC);
const fmtU1 = v => (Math.round(v * 10) / 10).toString().replace('.', DEC);
/* вес из хранилища (кг) — числом в выбранных единицах; fmtKgR — округлённый до шага в них (расчётный максимум: 0,5 кг или 1 фнт).
   В фунтах вес, вписанный в килограммах (кратный 50 г: 60, 62,5, 13,75), — с одной цифрой после точки: 60 кг — «132.3»,
   а не «132.28»; вписанный в фунтах хранится с запасом точности (fromU, не кратно 50 г) и показывается тем же числом, до сотых
   (1.25, 137.5). Целые — без точки */
const kgEntered = v => Math.abs(v * 20 - Math.round(v * 20)) < 1e-6;
/* в килограммах вес, вписанный в фунтах и не переведённый к шагу снаряда (hereKg), — до 0,5 кг, а не «102,06» */
const fmtKg = v => isLb() ? (kgEntered(v) ? fmtU1(toU(v)) : fmtU(toU(v))) : lbLike(v) ? fmtU(Math.round(v * 2) / 2) : fmtU(v);
/* число как есть, до сотых, в выбранных единицах — для таблицы Excel (данные, а не показ) */
const fmtKgRaw = v => fmtU(toU(v));
const fmtKgR = (v, st = isLb() ? 1 : .5) => fmtU(Math.round(toU(v) / st) * st);
/* вес с подписью: «62,5 кг», «135 lb» */
const fmtW = v => fmtKg(v) + ' ' + wUnit();
/* вписанный вес (в выбранных единицах) — в килограммах */
const parseKg = v => { const n = parseNum(v); return n == null ? null : fromU(n); };
/* «1–2,5 кг» или «2,5–5 фнт»: пара чисел для килограммов и для фунтов */
const unitRange = (kg, lb) => { const [a, b] = isLb() ? lb : kg; return `${fmtU(a)}–${fmtU(b)} ${wUnit()}`; };

/* ---------- единица ввода веса (замечания 4.108: Руслан 3, Mike 1 и 13) ----------
   Журнал и планы хранят килограммы, как прежние версии. У записи дня — u: в какой единице вписаны веса ('kg', 'lb'; 'mix' —
   в один день вписывали и в той, и в другой); у веса в своём плане — ku. Вес, вписанный в другой единице, показывается
   и подставляется в выбранной — ближайшим настоящим шагом снаряда (convStep): штанга, Смит, тренажёры и блоки — 2,5 кг
   или 5 фнт (пара самых мелких обычных блинов: 1,25 кг или 2,5 фнт на сторону), гантели — набор места (availKg) или шаг
   гантелей 2 кг / 5 фнт, гири — 2 кг / 1 фнт (гири через 2 кг; американские подписаны в фунтах: 16 кг — 35, 24 кг — 53),
   доп. вес и прочее — 0,5 кг / 1 фнт. 225 фнт в килограммах — 102,5, а не 102,06; 105 кг в фунтах — 230, а не 231,5.
   Записанное не меняется: вернули единицу — снова 225. Запись без u (прежние версии) читается как килограммы; вес,
   вписанный в ней в фунтах (4.99–4.107 хранили его с точностью 0,00001 кг), узнаётся по числу: в фунтах он кратен 0,25
   (lbLike; из весов через 0,05 кг до 200 кг на это не похож ни один). */
const lbLike = v => v > 0 && Math.abs(v / LB_KG * 4 - Math.round(v / LB_KG * 4)) < 6e-5;
const UNITS = ['kg', 'lb'];
/* единица, в которой вписан вес v записи с единицей u */
function unitOfKg(v, u) { return UNITS.includes(u) ? u : lbLike(v) ? 'lb' : 'kg'; }
/* шаг выбранной единицы для веса, вписанного в другой; it — {ex, eqIds} карточки или {ex, impl} записи журнала */
function convStep(it) {
  const lb = isLb(), ex = it && it.ex; if (!ex) return lb ? 1 : .5;
  const lt = loadType(ex), ids = Array.isArray(it.eqIds) ? it.eqIds : null, impl = it.impl !== undefined ? it.impl : itemImpl(it);
  if (lt === 'assist') return lb ? 5 : 2.5;
  if (impl === 'db') return lb ? 5 : 2;
  if (impl === 'kb') return lb ? 1 : 2;
  if (impl === 'bb' || (ids ? ids.some(i => i === 'smith' || i === 'legpress' || MACHINE.has(i)) : lt === 'kg')) return lb ? 5 : 2.5;
  return lb ? 1 : .5;
}
/* вес из журнала или плана (кг) — в выбранной единице: вписанный в ней — как есть, в другой — ближайший шаг снаряда */
function hereKg(v, u, it) {
  if (!(v > 0) || unitOfKg(v, u) === wu()) return v;
  const av = it && it.ex && typeof availKg === 'function' ? availKg(it) : null;
  if (av) return av.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);
  const st = convStep(it);
  return fromU(Math.max(st, Math.round(toU(v) / st) * st));
}
/* подход записи с единицей u — в выбранной единице (основные поля и стороны одинаково: слабая сторона остаётся слабой) */
function hereSet(x, u, it) {
  if (!Array.isArray(x)) return x;
  const c = x.slice(); if (x[0] != null) c[0] = hereKg(x[0], u, it);
  const sd = x[3]; if (sd && typeof sd === 'object' && Array.isArray(sd.l) && Array.isArray(sd.r)) c[3] = {l:[sd.l[0] == null ? null : hereKg(sd.l[0], u, it), sd.l[1]], r:[sd.r[0] == null ? null : hereKg(sd.r[0], u, it), sd.r[1]]};
  return c;
}
/* запись дня — в выбранной единице; ничего не меняется — та же запись */
function hereSession(s, it) {
  if (!s || !Array.isArray(s.s)) return s;
  const ctx = it && it.ex ? (Array.isArray(it.eqIds) ? it : {ex:it.ex, impl:sessionImpl(it.ex, s)}) : it, out = s.s.map(x => x && hereSet(x, s.u, ctx));
  return out.every((x, k) => JSON.stringify(x) === JSON.stringify(s.s[k])) ? s : {...s, s:out, conv:true};
}
/* что было в плане и в каких единицах вписано — в запись дня (rp, u: 15-autoreg.js, hereKg); k — номер записанного подхода */
function markSession(s, it, n, k) {
  s.target = Math.max(s.target || 0, n);
  if (it.rx.static) s.fmt = 'static';
  markImpl(s, it);
  const rp = it.rx.reps != null ? String(it.rx.reps) : '';
  if (!it.ex.kind && typeof cleanReps === 'function' && cleanReps(rp) === rp) s.rp = rp; else delete s.rp;
  markUnit(s, k);
}
/* единица записи: первый подход — выбранная; дописали подход к уже записанным в другой единице (или в записи прежней
   версии, без u) — 'mix', тогда единица каждого веса — по числу (unitOfKg) */
function markUnit(s, k) {
  const u = wu(), others = s.s.some((v, i) => v && i !== k);
  s.u = !others || s.u === u ? u : 'mix';
}

function validSessions(ss) {
  return Array.isArray(ss) && ss.every(x => x && typeof x.d === 'string' && /^\d{4}-\d\d-\d\d$/.test(x.d) && Array.isArray(x.s));
}
/* Журнал в хранилище — текст; logBase — каким эта вкладка видела его последним (для слияния вкладок, logMergeDisk).
   Испорченный журнал не затирается (Ксения 15): исходный текст — в отложенные (Keep.quarantine), уцелевшее читается
   (обрезанный JSON — repairJson, неверные записи — мимо, checkLog), человек видит сообщение (18a-data-keep.js). */
let logBase = null;
function logParse(text) {
  if (text == null) return {data:{}, foreign:{}, r:logDrops(), cut:false, whole:false};
  let o = null, cut = false;
  try { o = JSON.parse(text); } catch (e) { const rep = repairJson(text); if (rep) { o = rep.value; cut = true; } }
  const c = checkLog(o);
  return {...c, cut, whole:c.whole || o === null};
}
function logLoadLocal() {
  const raw = Keep.get(LOG_KEY); logBase = raw;
  if (raw == null) return;
  const p = logParse(raw);
  LOG.data = p.data; LOG.foreign = p.foreign;
  if (p.cut || p.whole || p.r.sets || p.r.sessions) {
    Keep.quarantine(LOG_KEY, raw, p.cut ? 'log: cut' : 'log: ' + JSON.stringify(p.r.why));
    Keep.note('log', {cut:p.cut, whole:p.whole && !Object.keys(p.data).length, drops:p.r, kept:Object.values(p.data).reduce((a, ss) => a + ss.length, 0)});
  }
}
const logStoreObject = () => ({...LOG.foreign, ...LOG.data});
/* Запись журнала. Перед ней — что сейчас в хранилище: другая вкладка (или приложение с экрана «Домой») могла записать свои
   подходы (Ксения 3, Артём 3) — они сливаются с нашими, а не затираются */
function logSaveLocal() {
  const disk = Keep.get(LOG_KEY);
  if (disk != null && disk !== logBase) logMergeDisk(disk);
  const text = JSON.stringify(logStoreObject());
  if (Keep.set(LOG_KEY, text)) logBase = text;
}
/* Слияние трёх версий: base — что эта вкладка видела, mine — что у неё сейчас, theirs — что в хранилище. По упражнениям,
   записям дня и номерам подходов: изменённое одной стороной — от неё; обе добавили разный подход под одним номером — оба
   остаются (наш — следующим номером); обе правили один подход — наш (последняя правка). Пустое хранилище (очистили
   данные сайта) не стирает записи вкладки — они запишутся обратно. Вернёт упражнения, которые изменились. */
function logMergeDisk(diskText) {
  const changed = [];
  if (diskText == null) return changed;
  const theirs = logParse(diskText), base = logParse(logBase);
  logBase = diskText;
  const J = v => JSON.stringify(v ?? null);
  for (const id of new Set([...Object.keys(LOG.data), ...Object.keys(theirs.data), ...Object.keys(base.data)])) {
    const mine = LOG.data[id] || [], was = base.data[id] || [], th = theirs.data[id] || [];
    let out;
    if (J(mine) === J(was)) out = th;
    else if (J(th) === J(was) || J(th) === J(mine)) out = mine;
    else out = mergeThree(mine, was, th);
    if (J(out) !== J(LOG.data[id] || [])) { changed.push(id); if (out.length) LOG.data[id] = out; else delete LOG.data[id]; }
  }
  for (const [id, ss] of Object.entries(theirs.foreign)) if (!LOG.foreign[id]) LOG.foreign[id] = ss;
  return changed;
}
function mergeThree(mine, was, th) {
  const J = v => JSON.stringify(v ?? null), at = (ss, d) => ss.find(x => x.d === d), out = [];
  for (const d of new Set([...mine, ...was, ...th].map(x => x.d))) {
    const m = at(mine, d), w = at(was, d), t = at(th, d);
    if (J(m) === J(w)) { if (t) out.push(t); continue; }
    if (J(t) === J(w) || J(t) === J(m)) { if (m) out.push(m); continue; }
    if (!m || !t) { out.push(m || t); continue; } /* одна сторона удалила запись, другая дописала — остаётся дописанное */
    const s = [], extra = [], wk = k => w && w.s[k] || null;
    for (let k = 0; k < Math.max(m.s.length, t.s.length); k++) {
      const a = m.s[k] || null, b = t.s[k] || null, o = wk(k);
      if (J(a) === J(o)) s[k] = b; else if (J(b) === J(o) || J(a) === J(b)) s[k] = a;
      else if (!o && a && b) { s[k] = b; extra.push(a); } /* обе вкладки записали подход под этим номером */
      else s[k] = a;
    }
    while (s.length && !s[s.length - 1]) s.pop();
    s.push(...extra);
    const o = {...t, ...m, s:s.map(v => v || null)};
    if (m.target || t.target) o.target = Math.max(m.target || 0, t.target || 0);
    if (m.at || t.at) o.at = Math.min(...[m.at, t.at].filter(Number.isFinite));
    if ((m.u || t.u) && m.u !== t.u) o.u = 'mix'; /* вкладки вписывали в разных единицах — единица каждого веса по числу */
    out.push(o);
  }
  return out.filter(x => x && x.s.some(Boolean)).sort((p, q) => p.d < q.d ? -1 : 1);
}

/* Объединение двух историй (аккаунт и браузер, копия и журнал): по дате; запись одного дня — подходы по номерам: где у одной
   пусто, берётся другая; где обе записаны и различаются — первая (a). Предела числа записей нет (Ксения 5): раньше хранились
   только 150 последних занятий упражнения, старые молча удалялись — годовой журнал жима занимает ~10 КБ из ~5 МБ хранилища. */
function mergeSessions(a, b) {
  const by = new Map();
  for (const x of a || []) by.set(x.d, x);
  for (const x of b || []) { const cur = by.get(x.d); by.set(x.d, cur ? unionSession(cur, x) : x); }
  return [...by.values()].sort((p, q) => p.d < q.d ? -1 : 1);
}

async function logInit() {
  const c = window.claude;
  if (!c || typeof c.use !== 'function') { LOG.mode = 'local'; LOG.canExport = true; logRefresh(null); return; }
  let db = null, user = null;
  try { [db, user, LOG.dl] = await Promise.all([c.use('db'), c.use('user'), c.use('downloads')]); } catch (e) {}
  LOG.canExport = !!LOG.dl;
  const uid = user ? await user.id() : null;
  if (!db || !uid) { LOG.mode = 'local'; logRefresh(null); return; }
  try { LOG.col = db.collection('data/users/' + uid); } catch (e) { LOG.mode = 'local'; logRefresh(null); return; }
  LOG.mode = 'cloud';
  const before = JSON.parse(JSON.stringify(LOG.data));
  let first = true;
  LOG.col.onSnapshot(snap => {
    const remote = {};
    let bodyDoc = null, heartDoc = null;
    for (const d of snap.docs) { const b = d.data(); if (d.id === '_body') bodyDoc = b; else if (d.id === '_heart') heartDoc = b; else if (b && EXI[d.id] && validSessions(b.sessions)) remote[d.id] = b.sessions; }
    const changed = [], wasFirst = first;
    if (first) {
      first = false;
      /* записи, сделанные в этом браузере до подключения, переносим в аккаунт */
      for (const id of new Set([...Object.keys(remote), ...Object.keys(before)])) {
        const merged = mergeSessions(remote[id], before[id]);
        if (JSON.stringify(merged) !== JSON.stringify(remote[id] || [])) { LOG.data[id] = merged; logTouch(id, true); }
        else LOG.data[id] = remote[id];
        changed.push(id);
      }
    } else {
      for (const id of new Set([...Object.keys(remote), ...Object.keys(LOG.data)])) {
        if (LOG.pending[id]) continue;
        const r = remote[id] || [];
        if (JSON.stringify(r) === JSON.stringify(LOG.data[id] || [])) continue;
        if (r.length) LOG.data[id] = r; else delete LOG.data[id];
        changed.push(id);
      }
    }
    logSaveLocal();
    bodyRemote(bodyDoc, wasFirst);
    heartRemote(heartDoc, wasFirst); /* пульс: 14b-heart.js */
    logRefresh(changed);
  }, err => {
    if (err && err.code === 'unavailable') return;
    LOG.mode = 'local'; LOG.err = 'Связь с аккаунтом потеряна — новые записи сохраняются в этом браузере.'; logRefresh(null);
  });
  logRefresh(null);
}

function logTouch(id, now) {
  logSaveLocal();
  if (LOG.mode !== 'cloud') return;
  LOG.pending[id] = true;
  clearTimeout(LOG.timers[id]);
  LOG.timers[id] = setTimeout(() => logFlush(id), now ? 0 : 800);
}
async function logFlush(id, retried) {
  if (LOG.writing[id]) { LOG.again[id] = true; return; }
  LOG.writing[id] = true;
  try {
    const ss = (LOG.data[id] || []).filter(x => x.s.some(Boolean));
    if (ss.length) await LOG.col.doc(id).set({ex:id, sessions:ss});
    else await LOG.col.doc(id).delete();
  } catch (e) {
    const code = e && e.code;
    if (code === 'unavailable' && !retried) { LOG.writing[id] = false; setTimeout(() => logFlush(id, true), 600 + Math.random() * 900); return; }
    if (code === 'quota_exceeded') LOG.err = 'Хранилище журнала заполнено. Удалите старые записи или сделайте резервную копию.';
    else { LOG.mode = 'local'; LOG.err = 'Сохранить в аккаунт не получилось — записи сохраняются в этом браузере.'; }
    logRefresh(null);
  } finally {
    LOG.writing[id] = false;
    if (LOG.again[id]) { LOG.again[id] = false; logFlush(id); } else LOG.pending[id] = false;
  }
}

function todaySession(id, create) {
  let ss = LOG.data[id];
  if (!ss) { if (!create) return null; ss = LOG.data[id] = []; }
  const d = todayKey();
  let s = ss.find(x => x.d === d);
  if (!s && create) {
    /* at — когда начато упражнение: порядок выполнения внутри дня (выгрузка для Excel) */
    s = {d, s:[], at:Date.now()};
    if (S.mode === 'program') s.wk = S.week;
    ss.push(s); ss.sort((a, b) => a.d < b.d ? -1 : 1);
  }
  return s;
}
/* прошлые записи упражнения — все, кроме сегодняшней: запись «из будущего» (часы переведены назад) — тоже прошлый раз */
function pastSessions(id) { const d = todayKey(); return byRecent((LOG.data[id] || []).filter(x => x.d !== d && x.s.some(Boolean)), d); }
function cleanToday(id) {
  const ss = LOG.data[id]; if (!ss) return;
  const s = ss.find(x => x.d === todayKey()); if (!s) return;
  while (s.s.length && !s.s[s.s.length - 1]) s.s.pop();
  if (!s.s.length) ss.splice(ss.indexOf(s), 1);
  if (!ss.length) delete LOG.data[id];
}

/* ---------- что записываем ---------- */
function loadType(ex) {
  if (ex.assist) return 'assist'; /* гравитрон: записываем противовес, меньше — тяжелее */
  if (ex.eq.some(g => g.every(id => WEIGHTED.has(id)))) return 'kg';
  if (ex.g === 'cardio' || ex.eq.some(g => g.includes('band') || g.includes('abwheel'))) return 'none';
  return 'extra';
}
function repLabel(ex) { return ex.kind === 'time' ? 'Секунды' : ex.kind === 'dist' ? 'Метры' : 'Повторы'; }
/* шаг прибавки, кг. В фунтах — свои шаги (блины 2,5 и 5 фнт, гантели через 5 фнт): штанга и тренажёры +5 фнт на верх тела,
   +10 на ноги, жим ногами +20, гантели и гири +5; в килограммах они хранятся точно — показываются целыми фунтами */
function stepFor(it) {
  const ids = it.eqIds || [], lower = LOWER_G.has(it.ex.g), lb = isLb();
  const st = ids.includes('legpress') || ids.includes('hack') ? (lb ? 20 : 10)
    : ids.includes('bb') || ids.includes('smith') || ids.some(i => MACHINE.has(i)) ? (lb ? (lower ? 10 : 5) : (lower ? 5 : 2.5))
    : ids.includes('db') ? (lb ? 5 : 2) : ids.includes('kb') ? (lb ? 5 : 4) : (lb ? 5 : 2.5);
  return lb ? st * LB_KG : st;
}
const roundTo = (v, st) => Math.max(0, Math.round(v / st) * st);
/* сетка весов в фунтах (кг): гантели и гири — через 5 фнт, штанга, тренажёры и стек — через 2,5 фнт */
function gridFor(it) { const ids = it.eqIds || []; return (ids.includes('db') || ids.includes('kb') ? 5 : 2.5) * LB_KG; }
/* следующий вес вверх и вниз на шаг st; в фунтах — с округлением до сетки g: вес, записанный в килограммах, в фунтах
   не круглый (60 кг = 132,28 фнт → 137,5, а не 137,28). В килограммах — как раньше, ± шаг от записанного */
function stepUp(w, st, g) {
  if (!isLb() || !g) return w + st;
  let v = Math.round((w + st) / g) * g; if (v <= w + 1e-6) v += g; return v;
}
function stepDown(w, st, g) {
  if (!isLb() || !g) return Math.max(0, w - st);
  let v = Math.round((w - st) / g) * g; if (v >= w - 1e-6) v -= g; return Math.max(0, v);
}
/* повторы плана по подходам (пирамида своего плана, 11d-custom.js: cleanReps): «10/8/6/5» → [10, 8, 6, 5];
   диапазон или одно число — null */
function repsPlanOf(r) { const s = String(r ?? ''); if (!s.includes('/')) return null; const l = s.split('/').map(Number); return l.length > 1 && l.every(v => v > 0) ? l : null; }
/* цель подхода k (с нуля): у пирамиды — своё число (подходов больше списка — последнее), иначе диапазон как есть */
function planReps(rx, k) { const l = repsPlanOf(rx.reps); return l ? String(l[Math.min(k, l.length - 1)]) : String(rx.reps); }
/* границы повторов: «8–12» → [8, 12]; у пирамиды — от меньшего до большего */
function parseRange(r) { const l = repsPlanOf(r); if (l) return [Math.min(...l), Math.max(...l)]; const m = String(r).match(/(\d+)\D+(\d+)/); if (m) return [+m[1], +m[2]]; const n = parseInt(r, 10); return [n || 0, n || 0]; }
/* расчётный максимум по Эпли: вес × (1 + повторы / 30), повторы сверх 12 не в счёт. Подход в один повтор — это и есть
   максимум того дня: сам вес, без +3 % формулы (Руслан 7: сингл 160 давал «165,5») */
const e1rm = (kg, reps) => reps <= 1 ? kg : kg * (1 + Math.min(reps, 12) / 30);
/* следующий вес вверх (Руслан 8, Ольга 1): у гантелей и гирь с набором места (availKg, 17-warmup.js) — следующий из набора,
   а тяжелее нет — null (прогресс повторами); без набора — шаг прибавки, но гантели в килограммах, кратные 2,5 и не кратные 2
   (12,5, 52,5), — через 2,5: в таком ряду гантелей 54,5 нет */
function nextUp(it, w, step) {
  const av = typeof availKg === 'function' ? availKg(it) : null;
  if (av) { const n = av.find(v => v > w + 1e-6); return n == null ? null : n; }
  if (!isLb() && itemImpl(it) === 'db' && Math.abs(w / 2.5 - Math.round(w / 2.5)) < 1e-6 && Math.abs(w / 2 - Math.round(w / 2)) > 1e-6) return w + 2.5;
  return stepUp(w, step, gridFor(it));
}
/* повторов в подходе с весом, до которых ведёт прогресс повторами, когда тяжелее гантелей нет: 30 — в пределах лёгких весов,
   с которыми мышцы растут при подходах до отказа (Schoenfeld et al., J Strength Cond Res 2015; 29(10):2954–2963: лёгкая
   группа — 25–35 повторов в подходе) */
const REPS_CAP = 30;

/* ---------- подсказка по двойной прогрессии ---------- */
/* прогрессия — по основным полям подхода (у Л/П это слабая сторона); если в прошлый раз одна сторона отставала —
   короткая строка об этом */
function suggest(it) {
  const res = suggestBase(it), last = res.prev || pastSessions(it.ex.id).slice(-1)[0], note = weakSideNote(it.ex, last);
  if (note) res.text += ' ' + note;
  return res;
}
function suggestBase(it) {
  /* статодинамика и обычные подходы ведутся раздельно: вес в них отличается примерно вдвое */
  /* прошлые записи — в выбранной единице (hereSession): вписанное в другой — к шагу снаряда, и подсказка, и прибавка в ней */
  const ex = it.ex, lt = loadType(ex), all = pastSessions(ex.id).map(s => hereSession(s, it)), past = all.filter(s => (s.fmt === 'static') === !!it.rx.static);
  const [lo, hi] = parseRange(it.rx.reps), rp = repsPlanOf(it.rx.reps);
  /* цель подхода k (с нуля): [нижняя, верхняя]; у пирамиды повторов — своё число подхода */
  const tgt = k => { if (!rp) return [lo, hi]; const v = rp[Math.min(k, rp.length - 1)]; return [v, v]; };
  const unit = ex.kind === 'time' ? ' с' : ex.kind === 'dist' ? ' м' : '';
  const week = S.mode === 'program' ? WEEKS[S.week - 1] : null;
  const step = stepFor(it);
  const res = {tone:'new', kg:null, reps:[], text:'', prev:null};
  /* вес по плану (свой план, план тренера) — цель вместо подсказки по прогрессии */
  if (it.rx.kgPlan && lt !== 'none') {
    const prev = past[past.length - 1] || null, ps = prev ? prev.s.filter(Boolean) : [], plan = planKgsHere(it);
    res.tone = 'plan'; res.kgs = plan; res.kg = plan[0]; res.prev = prev;
    const what = lt === 'assist' ? 'Противовес по плану' : lt === 'extra' ? 'Доп. вес по плану' : 'Вес по плану';
    res.text = `${what}: ${planKgText(plan)} ${wUnit()}.` + (rp ? ` Повторы по плану: ${rp.join(' / ')}.` : '') + (ps.length ? ` В прошлый раз: ${ps.map(x => (x[0] ? fmtKg(x[0]) + '×' : '') + x[1]).join(', ')}.` : '');
    /* после перерыва — и вес по плану ниже, на то же число (layoffInfo, 15-autoreg.js); противовес — не трогаем */
    const lay = past.length && lt === 'kg' && typeof layoffInfo === 'function' ? layoffInfo() : null;
    if (lay) {
      const fine = isLb() ? 5 * LB_KG : (it.eqIds || []).includes('kb') ? 4 : (it.eqIds || []).includes('db') ? 2 : 2.5;
      res.tone = 'deload'; res.layoff = true; res.kgs = plan.map(v => roundTo(v * (1 - lay.pct / 100), fine)); res.kg = res.kgs[0];
      res.text = 'После перерыва в {g}: {kg} вместо {was} по плану (примерно на {p}% меньше), не до предела.'.replace(/\{(\w+)\}/g, (_, k) => ({g:`${lay.gap} ${plural(lay.gap, 'день', 'дня', 'дней')}`, kg:planKgText(res.kgs) + ' ' + wUnit(), was:planKgText(plan), p:lay.pct})[k]);
    }
    return res;
  }
  /* прошлых тренировок нет, а сегодня подходы уже записаны — не «Первая запись», а сколько сделано и что дальше */
  const today = !past.length && todayNote(it, lt);
  if (today) { res.tone = 'today'; res.text = today; return res; }
  if (it.rx.static && !past.length) {
    const last = all[all.length - 1], kgs = last ? last.s.filter(Boolean).map(x => x[0]).filter(v => v > 0) : [];
    if (lt === 'kg' && kgs.length) {
      const w = Math.max(...kgs); res.kg = roundTo(w * .6, step);
      res.text = `Статодинамика: около ${fmtKg(res.kg)} ${wUnit()} — примерно 60% от прошлого рабочего веса (${fmtKg(w)} ${wUnit()}). К концу подхода мышца сильно горит, но повторы ещё получаются.`;
    } else res.text = lt === 'kg' ? 'Первая запись в статодинамике. Возьмите около половины обычного рабочего веса: к концу подхода мышца сильно горит, но повторы ещё получаются.'
      : lt === 'assist' ? 'Первая запись в статодинамике. Подберите противовес, при котором к концу подхода мышца сильно горит, но повторы ещё получаются.'
      : 'Первая запись в статодинамике. Отметьте, сколько медленных повторов получилось в каждом подходе.';
    return res;
  }
  if (!past.length) {
    /* запас — тот же, что в строке нагрузки карточки (rx.rir из prescribe, reserveOf в 11-planner.js) */
    const rir = it.rx.rir !== undefined ? it.rx.rir : reserveOf(week);
    /* простыми словами (11-planner.js): запас — «остаются силы ещё на 2», «почти до отказа» — «получаются чисто, а больше —
       уже нет», «без отказа» — «не до предела»; фразы с {r} и {n} переводятся целиком */
    const range = rp ? rp.join(' / ') : lo === hi ? String(lo) : lo + '–' + hi, r = range + (unit || ' ' + plural(hi, 'повтор', 'повтора', 'повторов'));
    const say = (f, n) => f.replace('{r}', r).replace('{n}', n || '');
    const nr = week && week.deload ? 'deload' : ex.type === 'i' && S.goal === 'cut' ? 'burn' : 'near';
    res.text = lt === 'assist' ? (rir ? say('Первая запись. Подберите противовес, с которым {r} получаются и остаются силы ещё на {n}.', reserveNum(rir))
        : nr === 'deload' ? say('Первая запись. Подберите противовес, с которым {r} даются не до предела.')
        : nr === 'burn' ? say('Первая запись. Подберите противовес, с которым {r} доводят мышцу до сильного жжения.')
        : say('Первая запись. Подберите противовес, с которым {r} получаются чисто, а больше — уже нет.'))
      : lt === 'kg'
      ? (ex.kind === 'dist' ? 'Первая запись. Возьмите тяжёлые снаряды, с которыми проходите дистанцию без остановок.'
        : rir ? say('Первая запись. Подберите вес, с которым {r} получаются и остаются силы ещё на {n}.', reserveNum(rir))
        : nr === 'deload' ? say('Первая запись. Подберите вес, с которым {r} даются не до предела.')
        : nr === 'burn' ? say('Первая запись. Подберите вес, с которым {r} доводят мышцу до сильного жжения.')
        : say('Первая запись. Подберите вес, с которым {r} получаются чисто, а больше — уже нет.'))
      : `Первая запись. Отметьте, сколько ${ex.kind === 'time' ? 'секунд' : ex.kind === 'dist' ? 'метров' : 'повторов'} получилось в каждом подходе.`;
    return res;
  }
  const prev = past[past.length - 1];
  res.prev = prev;
  const sets = prev.s.filter(Boolean);
  const kgs = sets.map(x => x[0]).filter(v => v > 0);
  const work = kgs.length ? Math.max(...kgs) : null;
  const prevList = sets.map(x => (x[0] ? fmtKg(x[0]) + '×' : '') + x[1]).join(', ');
  if (ex.kind === 'dist') { res.tone = 'same'; res.kg = work; res.text = work ? `В прошлый раз — ${fmtKg(work)} ${wUnit()}. Попробуйте пройти дальше или взять тяжелее.` : `В прошлый раз: ${prevList} м.`; return res; }
  /* после перерыва (layoffInfo, 15-autoreg.js): вес ниже прежнего по шкале — то же число, что в плашке «По вашему журналу»;
     у пирамиды — каждый подход; у противовеса — больше; без веса — повторы по нижней границе, не до предела */
  const lay = typeof layoffInfo === 'function' ? layoffInfo() : null;
  if (lay && !ex.kind) {
    /* шаг округления — мельче шага прибавки (у жима ногами прибавка 10 кг, а сбросить на 10 % от 60 — до 55): блины 2,5 кг
       (гантели 2, гири 4; в фунтах — 5) — тогда число на экране близко к проценту шкалы */
    const ids = it.eqIds || [], fine = isLb() ? 5 * LB_KG : ids.includes('kb') ? 4 : ids.includes('db') ? 2 : 2.5;
    const f = 1 - lay.pct / 100, pk = sets.map(x => x[0]), mixed = (lt === 'kg' || lt === 'extra') && pk.length > 1 && pk.every(v => v > 0) && !pk.every(v => v === pk[0]);
    /* фразы с {g} (перерыв), {kg}, {was}, {p} переводятся целиком: в английском слова стоят в другом порядке */
    const say = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? ''), g = `${lay.gap} ${plural(lay.gap, 'день', 'дня', 'дней')}`, u = ' ' + wUnit();
    res.tone = 'deload'; res.reps = sets.map((x, i) => tgt(i)[0]);
    if (lt === 'kg' && work) {
      if (mixed) { res.kgs = pk.map(v => roundTo(v * f, fine)); res.kg = res.kgs[0]; res.text = say('После перерыва в {g}: веса примерно на {p}% меньше прошлых — {kg}, не до предела.', {g, p:lay.pct, kg:res.kgs.map(fmtKg).join(' / ') + u}); }
      else { res.kg = roundTo(work * f, fine); res.text = say('После перерыва в {g}: {kg} вместо {was} (примерно на {p}% меньше), не до предела.', {g, p:lay.pct, kg:fmtKg(res.kg) + u, was:fmtKg(work)}); }
      return res;
    }
    if (lt === 'assist' && work) {
      res.kg = Math.max((Math.floor(work / step) + 1) * step, roundTo(work / f, fine));
      res.text = say('После перерыва в {g}: противовес {kg} вместо {was}, не до предела.', {g, kg:fmtKg(res.kg) + u, was:fmtKg(work)});
      return res;
    }
    res.kg = work; res.text = say('После перерыва в {g}: повторы по нижней границе плана, не до предела. В прошлый раз: {prev}.', {g, prev:prevList});
    return res;
  }
  /* пирамида или сброс (веса подходов в прошлый раз разные): совет — по верхнему подходу, подсказки — по каждому подходу */
  const pyr = !ex.kind && (lt === 'kg' || lt === 'extra') && pyramidAdvice(it, res, sets, past, tgt, step, week, rp);
  if (pyr) return pyr;
  if (!week && AR.light && work && (lt === 'kg' || lt === 'assist')) {
    res.tone = 'deload'; res.kg = lt === 'assist' ? Math.max((Math.floor(work / step) + 1) * step, roundTo(work * 1.1, step)) : roundTo(work * .9, step); res.reps = sets.map((x, i) => tgt(i)[0]);
    res.text = lt === 'assist' ? `Облегчённый режим: противовес ${fmtKg(res.kg)} ${wUnit()} вместо ${fmtKg(work)}, не до предела.` : `Облегчённый режим: ${fmtKg(res.kg)} ${wUnit()} вместо ${fmtKg(work)}, не до предела.`;
    return res;
  }
  if (week && week.deload && work) {
    res.tone = 'deload'; res.kg = lt === 'assist' ? Math.max((Math.floor(work / step) + 1) * step, roundTo(work * 1.15, step)) : roundTo(work * .85, step);
    res.reps = sets.map((x, i) => tgt(i)[0]);
    res.text = lt === 'assist' ? `Разгрузка: противовес ${fmtKg(res.kg)} ${wUnit()} вместо ${fmtKg(work)}, не до предела.` : `Разгрузка: ${fmtKg(res.kg)} ${wUnit()} вместо ${fmtKg(work)}, не до предела.`;
    return res;
  }
  const required=prev.target || (it.rx.circ ? it.rounds : it.rx.sets) || 1;
  const allTop=prev.s.length>=required && Array.from({length:required},(_,k)=>prev.s[k]).every((v,k)=>v && v[1]>=tgt(k)[1] && (!work || v[0]===work));
  const anyLow = sets.some((x, i) => (!work || x[0] === work) && x[1] < tgt(i)[0]);
  /* тяжелее гантелей или гирь в этом месте нет — прогресс повторами (Руслан 8, Ольга 1): тот же вес, на повтор больше,
     до REPS_CAP; дальше — медленнее опускание или ступень тяжелее */
  const up = allTop && lt === 'kg' && work ? nextUp(it, work, step) : undefined;
  if (allTop && lt === 'kg' && work && up == null) {
    const name = itemImpl(it) === 'kb' ? 'гирь' : 'гантелей', place = typeof placeOf === 'function' ? placeOf().name : '';
    res.tone = 'same'; res.kg = work; res.noHeavier = true;
    const capped = sets.every(x => x[1] >= REPS_CAP);
    res.reps = sets.map(x => Math.min(REPS_CAP, x[1] + 1));
    res.text = (capped ? 'В месте «{place}» нет {what} тяжелее {w}, а повторов уже {n}: замедлите опускание до 3–4 с или возьмите упражнение тяжелее.'
      : 'В месте «{place}» нет {what} тяжелее {w} — прибавляйте повторы: в следующий раз на 1 больше в каждом подходе. В прошлый раз: {prev}.')
      .replace(/\{(\w+)\}/g, (_, k) => ({w:fmtKg(work) + ' ' + wUnit(), what:name, place, n:REPS_CAP, prev:prevList})[k]);
    return res;
  }
  if (allTop) {
    if (lt === 'kg' && work) {
      res.tone = 'up'; res.kg = up; res.reps = sets.map((x, i) => tgt(i)[0]);
      res.text = rp ? `Прибавьте до ${fmtKg(res.kg)} ${wUnit()} (+${fmtKg(res.kg - work)}). В прошлый раз все подходы по плану: ${prevList}.` : `Прибавьте до ${fmtKg(res.kg)} ${wUnit()} (+${fmtKg(res.kg - work)}). В прошлый раз все подходы на верхней границе: ${prevList}.`;
    } else if (lt === 'assist' && work) {
      res.tone = 'up'; res.kg = stepDown(work, step, gridFor(it)); res.reps = sets.map((x, i) => tgt(i)[0]);
      res.text = rp ? `Уменьшите противовес до ${fmtKg(res.kg)} ${wUnit()} (−${fmtKg(work - res.kg)}). В прошлый раз все подходы по плану: ${prevList}.` : `Уменьшите противовес до ${fmtKg(res.kg)} ${wUnit()} (−${fmtKg(work - res.kg)}). В прошлый раз все подходы на верхней границе: ${prevList}.`;
    } else if (ex.kind === 'time') {
      res.tone = 'up'; res.kg = work; res.reps = sets.map(() => hi + 10);
      res.text = `Все подходы на верхней границе. Держите на 10 с дольше${lt === 'extra' ? ' или добавьте отягощение' : ''}.`;
    } else {
      res.tone = 'up'; res.kg = work; res.reps = sets.map((x, k) => x[1] + 1);
      res.text = lt === 'extra' ? `Все подходы на верхней границе (${prevList}). Добавьте отягощение или замедлите опускание до 4 с.` : `Все подходы на верхней границе (${prevList}). Возьмите ленту потуже.`;
    }
    return res;
  }
  if (anyLow) {
    const before = past.length > 1 ? past[past.length - 2].s.filter(Boolean) : [];
    const bWork = before.length ? Math.max(0, ...before.map(x => x[0] || 0)) : 0;
    const lowAgain = work && bWork === work && before.some((x, i) => x[0] === work && x[1] < tgt(i)[0]);
    if (lt === 'kg' && work && lowAgain) {
      res.tone = 'down'; res.kg = roundTo(work * 0.9, step); res.reps = sets.map((x, i) => tgt(i)[0]);
      res.text = rp ? `Две тренировки подряд меньше плана — снизьте до ${fmtKg(res.kg)} ${wUnit()} и наберите повторы.` : `Две тренировки подряд меньше ${lo}${unit} — снизьте до ${fmtKg(res.kg)} ${wUnit()} и наберите повторы.`;
    } else if (lt === 'assist' && work != null && lowAgain) {
      res.tone = 'down'; res.kg = stepUp(work, step, gridFor(it)); res.reps = sets.map((x, i) => tgt(i)[0]);
      res.text = rp ? `Две тренировки подряд меньше плана — увеличьте противовес до ${fmtKg(res.kg)} ${wUnit()} и наберите повторы.` : `Две тренировки подряд меньше ${lo} — увеличьте противовес до ${fmtKg(res.kg)} ${wUnit()} и наберите повторы.`;
    } else {
      res.tone = 'same'; res.kg = work; res.reps = sets.map((x, i) => Math.max(tgt(i)[0], x[1]));
      const keep = work ? `Оставьте ${fmtKg(work)} ${wUnit()}` : 'Тот же вариант';
      res.text = rp ? `${keep} и доберите до плана: ${rp.join(' / ')}. В прошлый раз: ${prevList}.` : `${keep} и доберите до ${lo}${unit} в каждом подходе. В прошлый раз: ${prevList}.`;
    }
    return res;
  }
  res.tone = 'same'; res.kg = work; res.reps = sets.map((x, i) => Math.min(tgt(i)[1], x[1] + 1));
  res.text = `${work ? `${lt === 'assist' ? 'Тот же противовес' : 'Тот же вес'} — ${fmtKg(work)} ${wUnit()}` : 'Тот же вариант'}, цель — на 1${unit || ' повтор'} больше: в прошлый раз ${prevList}.`;
  return res;
}
/* Пирамида или сброс в прошлый раз: веса подходов разные (все записаны с весом). Совет — по верхнему подходу (самый
   тяжёлый вес; таких подходов может быть несколько), остальные подходы — как в прошлый раз; не «оставьте верхний вес
   в каждом подходе». res.kgs — вес каждого подхода (подсказки в таблице и в режиме тренировки, ownKgs), res.reps —
   повторы. Иначе null — один вес на все подходы, обычная двойная прогрессия. */
function pyramidAdvice(it, res, sets, past, tgt, step, week, rp) {
  const pk = sets.map(x => x[0]);
  if (pk.length < 2 || pk.some(v => !(v > 0)) || pk.every(v => v === pk[0])) return null;
  const W = Math.max(...pk), top = pk.map((v, i) => i).filter(i => pk[i] === W), one = top.length === 1;
  res.kgs = pk.slice(); res.reps = sets.map((x, i) => rp ? tgt(i)[0] : x[1]);
  const topText = one ? `Верхний подход: ${fmtKg(W)} ${wUnit()} × ${sets[top[0]][1]}` : `Подходы с ${fmtKg(W)} ${wUnit()}: ${top.map(i => sets[i][1]).join(', ')}`;
  const rest = 'Остальные подходы — как в прошлый раз.';
  const ease = !week && AR.light ? .9 : week && week.deload ? .85 : 0;
  if (ease) {
    res.tone = 'deload'; res.kgs = pk.map(v => roundTo(v * ease, step)); res.reps = sets.map((x, i) => tgt(i)[0]); res.kg = res.kgs[0];
    res.text = `${ease === .9 ? 'Облегчённый режим' : 'Разгрузка'}: веса на ${Math.round((1 - ease) * 100)}% меньше прошлых — ${res.kgs.map(fmtKg).join(' / ')} ${wUnit()}, не до предела.`;
    return res;
  }
  const nw = top.every(i => sets[i][1] >= tgt(i)[1]) ? nextUp(it, W, step) : null; /* тяжелее нет — повторы, как ниже */
  if (nw != null) {
    for (const i of top) { res.kgs[i] = nw; res.reps[i] = tgt(i)[0]; }
    res.tone = 'up'; res.kg = res.kgs[0];
    res.text = `${topText} — ${one ? 'на верхней границе. В следующий раз в нём' : 'все на верхней границе. В следующий раз в них'} ${fmtKg(nw)} ${wUnit()} (+${fmtKg(nw - W)}). ${rest}`;
    return res;
  }
  /* верхний подход второй раз подряд ниже нижней границы при том же весе — снизить его */
  const before = past.length > 1 ? past[past.length - 2].s.filter(Boolean) : [];
  const bW = before.length ? Math.max(0, ...before.map(x => x[0] || 0)) : 0;
  const lowAgain = bW === W && top.some(i => sets[i][1] < tgt(i)[0]) && before.some((x, i) => x[0] === W && x[1] < tgt(i)[0]);
  if (lowAgain) {
    const nw = roundTo(W * .9, step);
    for (const i of top) { res.kgs[i] = nw; res.reps[i] = tgt(i)[0]; }
    res.tone = 'down'; res.kg = res.kgs[0];
    res.text = one ? `Две тренировки подряд в верхнем подходе не хватило повторов — в следующий раз возьмите в нём ${fmtKg(nw)} ${wUnit()} и наберите повторы. ${rest}`
      : `Две тренировки подряд в подходах с ${fmtKg(W)} ${wUnit()} не хватило повторов — в следующий раз возьмите в них ${fmtKg(nw)} ${wUnit()} и наберите повторы. ${rest}`;
    return res;
  }
  const goal = top.map(i => { const [a, b] = tgt(i), r = sets[i][1]; return r < a ? a : Math.min(r >= b ? REPS_CAP : b, r + 1); });
  top.forEach((i, j) => { res.reps[i] = goal[j]; });
  const same = goal.every(v => v === goal[0]);
  res.tone = 'same'; res.kg = res.kgs[0];
  res.text = `${topText} — в следующий раз доберите до ${same ? goal[0] : goal.join(', ')}${one || !same ? '' : ' в каждом из них'}. ${rest}`;
  return res;
}
/* Сегодня уже записаны подходы, а прошлых тренировок нет: «Сегодня: 3 из 4. Следующий — с тем же весом (50 кг).»;
   все подходы сделаны — «упражнение выполнено». Нет записей сегодня — '' (подсказка первой записи) */
function todayNote(it, lt) {
  const t = hereSession(todaySession(it.ex.id, false), it), done = t ? t.s.filter(Boolean) : [];
  if (!done.length) return '';
  const total = Math.max(it.rx.circ ? (it.rounds || it.rx.sets) : it.rx.sets, done.length), n = done.length;
  const head = `Сегодня: ${n} из ${total}.`;
  if (n >= total) return `${head} Упражнение выполнено — в следующий раз здесь будет подсказка по прогрессии.`;
  const kgs = done.map(x => x[0]);
  if (lt !== 'none' && kgs[0] > 0 && kgs.every(v => v === kgs[0])) return `${head} Следующий — ${lt === 'assist' ? 'с тем же противовесом' : 'с тем же весом'} (${fmtKg(kgs[0])} ${wUnit()}).`;
  return head;
}

/* ---------- блок записи в карточке ---------- */
const SUG_ICON = {up:'↑', same:'→', down:'↓', deload:'↓', new:'+', plan:'≡', today:'✓'};
/* строк в таблице: по плану (у круговой — кругов), но не меньше, чем уже записано сегодня */
function logRowCount(it) {
  const today = todaySession(it.ex.id, false);
  return Math.max(it.rx.circ ? (it.rounds || it.rx.sets) : it.rx.sets, today ? today.s.length : 0);
}
/* «− N подходов +» под таблицей: убрать можно только последний подход; заполненный — после подтверждения в его строке.
   setArm[упражнение] — номер строки, в которой ждёт подтверждение (переживает перерисовку записи) */
const setArm = {};
function setWords(it) { return it.rx.circ ? ['круг', 'круга', 'кругов'] : ['подход', 'подхода', 'подходов']; }
function setStepHtml(it, n) {
  const id = it.ex.id, circ = it.rx.circ;
  return `<div class="lt-sets" role="group" aria-label="${circ ? 'Число кругов' : 'Число подходов'}">`
    + `<button type="button" class="lt-st" data-delset="${id}" aria-label="${circ ? 'Убрать круг' : 'Убрать подход'} ${n}"${n <= 1 ? ' disabled' : ''}>−</button>`
    + `<span class="lt-sn">${n} ${plural(n, ...setWords(it))}</span>`
    + `<button type="button" class="lt-st" data-addset="${id}" aria-label="${circ ? 'Добавить круг' : 'Добавить подход'}">+</button></div>`;
}
function setArmHtml(it, n, done) {
  const id = it.ex.id;
  return `<div class="lt-cf" role="group" aria-labelledby="lt-cf-${id}"><span class="lt-cft" id="lt-cf-${id}">${it.rx.circ ? 'Круг' : 'Подход'} ${n} ${done ? 'записан. Убрать вместе с записью?' : 'заполнен. Убрать его?'}</span>`
    + `<button type="button" class="lt-cfy" data-delyes="${id}">${'Убрать'}</button><button type="button" class="lt-cfn" data-delno="${id}">${'Оставить'}</button></div>`;
}
function logRows(it) {
  const ex = it.ex, lt = loadType(ex), sg = suggest(it), wl = weightLabel(it), lr = lrOn(ex);
  const today = todaySession(ex.id, false);
  const tset = today ? hereSession(today, it).s : []; /* сегодняшние подходы — в выбранной единице (сменили её посреди дня) */
  const n = logRowCount(it);
  if (setArm[ex.id] !== n - 1 || n <= 1) delete setArm[ex.id];
  /* вопрос о весе переживает перерисовку, пока строка не отмечена; вопрос о правке отмеченной — нет (в поле снова записанное) */
  const kq = kgAsk[ex.id];
  if (kq && (kq.edit || kq.k >= n || tset[kq.k])) delete kgAsk[ex.id];
  const prevSets = sg.prev ? sg.prev.s.filter(Boolean) : [], own = ownKgs(it, prevSets, sg);
  const [lo, hi] = parseRange(it.rx.reps), rp = repsPlanOf(it.rx.reps);
  const SIDE = {l:'левая', r:'правая'};
  /* поле веса и повторов; side — 'l' | 'r' в режиме Л/П. Подсказка веса — вес последнего записанного сегодня подхода
     выше (carriedKg), иначе свой вес подхода (план, пирамида прошлого раза) или прогрессия; data-ph — она же без переноса
     (к ней поле возвращается, когда вписанный выше вес стёрт — carryKgBox) */
  const fields = (k, side, val, phKg, phR) => `${lt === 'none' ? '' : `<input class="lt-in" id="kg-${ex.id}-${k}${side ? '-' + side : ''}" data-f="kg"${side ? ` data-side="${side}"` : ''} type="text" inputmode="decimal" autocomplete="off" aria-label="${wl.full}${side ? ', ' + SIDE[side] : ''}, подход ${k + 1}" placeholder="${carryPh(carriedKg(it, tset, k, side, own), phKg)}" data-ph="${phKg}" value="${val && val[0] != null ? fmtKg(val[0]) : ''}">`}
      <input class="lt-in" id="rp-${ex.id}-${k}${side ? '-' + side : ''}" data-f="reps"${side ? ` data-side="${side}"` : ''} type="text" inputmode="numeric" autocomplete="off" aria-label="${repLabel(ex)}${side ? ', ' + SIDE[side] : ''}, подход ${k + 1}" placeholder="${phR}" value="${val ? val[1] : ''}">`;
  const prevText = p => (p[0] ? fmtKg(p[0]) + ' × ' : '') + p[1];
  const sideTag = side => `<b class="lt-sd" aria-hidden="true">${side === 'l' ? 'Л' : 'П'}</b><span class="vh">${side === 'l' ? 'Левая:' : 'Правая:'}</span>`;
  let rows = '';
  for (let k = 0; k < n; k++) {
    const v = tset[k];
    const p = prevSets[k] || prevSets[prevSets.length - 1];
    const pk = own(k), phKg = pk != null ? fmtKg(pk) : sg.kg != null ? fmtKg(sg.kg) : (lt === 'kg' ? '' : '—');
    /* повторы: по прогрессии, у пирамиды плана — число подхода, иначе диапазон плана */
    const phR = sg.reps[k] ?? (rp ? planReps(it.rx, k) : sg.reps[sg.reps.length - 1] ?? (lo === hi ? String(lo) : `${lo}–${hi}`));
    const ask = kgAsk[ex.id] && kgAsk[ex.id].k === k, arm = !ask && setArm[ex.id] === k, cf = arm ? setArmHtml(it, n, !!v) : ask ? kgAskHtml(ex.id, kgAsk[ex.id]) : '';
    const done = !!v, cls = `lt-r${done ? ' done' : ''}${lr ? ' lt-lr' : ''}${it.rx.static && k > 0 && k % 3 === 0 ? ' lt-series' : ''}${arm || ask ? ' lt-arm' : ''}`;
    const ownAt = pk != null && lt !== 'none' ? ` data-own="${pk}"` : ''; /* свой вес подхода — для переноса при вводе (carryKgBox) */
    const ok = `<button type="button" class="lt-ok" data-tick="${ex.id}" data-k="${k}" aria-pressed="${done}" aria-label="Подход ${k + 1} выполнен">${ICON.check}</button>`;
    if (lr) {
      /* Л/П: две строки в одном подходе; прошлый раз — по сторонам, если они были записаны, иначе общее значение */
      const sd = v && setSides(v, ex), psd = p && setSides(p, ex);
      const val = side => v ? (sd ? sd[side] : [v[0], v[1]]) : null, pv = side => p ? prevText(psd ? psd[side] : p) : '—';
      rows += `<div class="${cls}" data-k="${k}"${ownAt}>
      <span class="lt-n">${k + 1}</span><span class="lt-p">${sideTag('l')} ${pv('l')}</span>
      ${fields(k, 'l', val('l'), phKg, phR)}
      ${ok}
      <span class="lt-p">${sideTag('r')} ${pv('r')}</span>
      ${fields(k, 'r', val('r'), phKg, phR)}${cf}
    </div>`;
    } else rows += `<div class="${cls}" data-k="${k}"${ownAt}>
      <span class="lt-n">${k + 1}</span><span class="lt-p">${p ? prevText(p) : '—'}</span>
      ${fields(k, null, done ? v : null, phKg, phR)}
      ${ok}${cf}
    </div>`;
  }
  const doneN = tset.slice(0, n).filter(Boolean).length;
  /* вес одной гантели: подсказка «×2 = 40 кг» — по первому заполненному полю (пока не вводили — по подсказке) */
  const x2 = wl && wl.n > 1 && !lr ? `<span class="lt-x2" data-n="${wl.n}">${wl.impl === 'kb' ? 'вес — одной гири' : 'вес — одной гантели'}<b>${pairTotalText(wl.n, firstKg(tset, sg, own))}</b></span>` : '';
  const lrBtn = perSide(ex) ? `<button type="button" class="lt-lrb" data-lr="${ex.id}" aria-pressed="${lr}">${'Л/П отдельно'}</button>` : '';
  const perSideNote = perSide(ex) ? `<span>${ex.kind === 'time' ? 'секунды — на каждую сторону' : 'повторы — на каждую сторону'}</span>` : '';
  return {sg, html:`<p class="sug sug-${sg.tone}"><b aria-hidden="true">${SUG_ICON[sg.tone]}</b><span>${esc(sg.text)}</span></p>${planUpHtml(it, sg)}
    ${logFoldBar(it, n, doneN)}
    <div class="lt-fold" id="lt-${ex.id}"><div class="lt${lt === 'none' ? ' lt-nokg' : ''}" role="group" aria-label="Запись подходов">
      <div class="lt-h"><span>№</span><span>Прошлый раз</span>${lt === 'none' ? '' : `<span title="${wl.full}">${wl.short}</span>`}<span>${repLabel(ex)}</span><span></span></div>
      ${rows}
    </div>
    <div class="lt-foot">${setStepHtml(it, n)}${lrBtn}${perSideNote}${x2}${it.rx.circ ? '<span>строка — один круг</span>' : ''}</div></div>`};
}
/* ---------- вес плана по журналу (Руслан 10: «4 недели прибавлял: присед 215, а в плане навсегда 200») ----------
   В своём плане вес задан, а в прошлый раз в этом упражнении работали тяжелее: в каждом записанном подходе не легче плана,
   хотя бы в одном — тяжелее. Тогда под подсказкой — «Записать в план 215 кг»: по подходам — вес прошлого раза, где он
   тяжелее плана. Легче плана не предлагаем — разгрузку и возврат после перерыва делают нарочно. Возвращает список весов
   для плана (кг, в выбранной единице) или null. */
function planUpOf(it, sg) {
  if (S.mode !== 'custom' || !it.rx.kgPlan || loadType(it.ex) !== 'kg' || it.rx.static || !sg || !sg.prev || sg.layoff || typeof customOf !== 'function') return null;
  const o = customOf().items[it.slot]; if (!o || o.id !== it.ex.id || !o.kg) return null;
  const plan = planKgsHere(it), sets = sg.prev.s.filter(Boolean), n = Math.min(10, Math.max(1, it.rx.sets)), at = (l, k) => l[Math.min(k, l.length - 1)];
  if (!sets.length || sets.some(x => !(x[0] > 0))) return null;
  if (sets.some((x, k) => k < n && x[0] < at(plan, k) - 1e-6)) return null;
  const next = Array.from({length:n}, (_, k) => k < sets.length ? Math.max(at(plan, k), sets[k][0]) : at(plan, k));
  if (!next.some((v, k) => v > at(plan, k) + 1e-6)) return null;
  return next.every(v => v === next[0]) ? [next[0]] : next;
}
function planUpHtml(it, sg) {
  const next = planUpOf(it, sg); if (!next) return '';
  return `<p class="sug sug-planup"><b aria-hidden="true">≡</b><span>${'В прошлый раз — тяжелее, чем в плане:'} ${planKgText(next)} ${wUnit()} ${'вместо'} ${planKgText(planKgsHere(it))}.</span>`
    + `<button type="button" class="lk" data-kgplan="${it.ex.id}">${'Записать в план'} ${planKgText(next)} ${wUnit()}</button></p>`;
}
/* «Записать в план»: вес своего плана — как в прошлый раз (в выбранной единице, ku — она же) */
function planUpApply(id) {
  const it = plan && plan.items && plan.items.find(x => x.ex.id === id); if (!it) return;
  const next = planUpOf(it, suggest(it)); if (!next) return;
  const c = customOf(), o = c.items[it.slot]; if (!o) return;
  o.kg = next.map(v => Math.round(v * 1e5) / 1e5); o.ku = wu();
  customRerender(`.card[data-ex="${id}"] [data-hist]`);
  const m = document.querySelector(`.card[data-ex="${id}"] .sug`); if (m) m.insertAdjacentHTML('afterend', `<p class="p-hint" role="status">${esc('Вес в плане:')} ${planKgText(next)} ${wUnit()}.</p>`);
}
/* вес для подсказки «×2»: записанный или введённый в первом подходе, иначе подсказка по весу первого подхода */
function firstKg(tset, sg, own) {
  const v = tset.find(x => x && x[0] > 0);
  if (v) return v[0];
  const pk = own(0);
  return pk != null ? pk : sg.kg;
}

/* ---------- вес на следующие подходы ---------- */
/* Вписали вес в подход или отметили его — следующие неотмеченные подходы с пустым полем берут этот вес подсказкой,
   и отметка без ввода записывает его; другой вес вписывается как раньше. Переносится вес ближайшего подхода выше,
   у Л/П — по своей стороне, а вписанный в левую сторону — ещё и в пустую правую того же подхода. Повторы не переносятся
   (у них подсказка из плана). Свой вес подхода (ownKgs: по плану; без плана — пирамида или сброс прошлого раза)
   не перетирается: свои веса обоих подходов заданы и различаются — переноса нет. То же правило — в режиме тренировки
   (workoutFill в 14-workout-mode.js). */
/* свой вес подхода k: по плану; без плана — вес подхода k прошлой тренировки (подходов меньше — последний), если веса
   подходов в ней разные (пирамида, сброс); иначе null — один вес на все подходы (подсказка — по прогрессии, sg.kg).
   prevSets — записанные подходы прошлой тренировки */
function ownKgs(it, prevSets, sg) {
  /* вес по плану; после перерыва — сниженный (suggestBase: sg.layoff) */
  if (it.rx.kgPlan) { const l = sg && Array.isArray(sg.kgs) && sg.kgs.length ? sg.kgs : planKgsHere(it); return k => l[Math.min(k, l.length - 1)]; }
  /* пирамида прошлого раза с советом по верхнему подходу (pyramidAdvice): вес каждого подхода — из совета */
  if (sg && Array.isArray(sg.kgs) && sg.kgs.length) return k => sg.kgs[Math.min(k, sg.kgs.length - 1)];
  const kgs = prevSets.map(x => x[0]);
  if (kgs.length < 2 || kgs.some(v => v == null) || kgs.every(v => v === kgs[0])) return () => null;
  return k => kgs[Math.min(k, kgs.length - 1)];
}
function kgCarries(own, i, k) { const a = own(i), b = own(k); return a == null || b == null || a === b; }
/* вес из последнего записанного сегодня подхода до k (tset — подходы дня; side — 'l' | 'r' в режиме Л/П; own — ownKgs)
   или null: выше ничего не записано, у записанного нет веса или у подхода k свой вес */
function carriedKg(it, tset, k, side, own) {
  for (let i = Math.min(k, tset.length) - 1; i >= 0; i--) {
    const v = tset[i]; if (!v) continue;
    const sd = side ? setSides(v, it.ex) : null, kg = sd ? sd[side][0] : v[0];
    return kg != null && kg >= 0 && kgCarries(own, i, k) ? kg : null;
  }
  return null;
}
const carryPh = (kg, ph) => kg != null ? fmtKg(kg) : ph;
/* подсказки веса в таблице карточки по введённому сейчас: неотмеченное пустое поле берёт вес ближайшего выше подхода,
   где вес вписан или подход отмечен (отмеченный без веса — переноса нет), иначе прежнюю подсказку (data-ph). У Л/П левая
   сторона — по левой; правая — по правой, а вписанный в левую сторону вес подхода становится и подсказкой его пустой
   правой стороны и дальше идёт по правой. Свой вес подхода — data-own строки. Вписанное и отмеченное не меняется */
function carryKgBox(box) {
  const rows = box ? [...box.querySelectorAll('.lt-r')] : []; if (!rows.length) return;
  const ownBy = new Map(rows.map(r => [+r.dataset.k, r.dataset.own != null ? parseNum(r.dataset.own) : null]));
  const own = k => ownBy.get(k) ?? null, lr = rows[0].classList.contains('lt-lr');
  /* вписанный, но не отмеченный неправдоподобный вес («5000», kgDoubt) дальше подсказкой не идёт — сначала ответ на вопрос о нём */
  const it = plan && plan.items && plan.items.find(x => x.ex.id === box.dataset.log);
  const filled = (row, inp) => {
    const done = row.classList.contains('done'); if (!done && inp.value.trim() === '') return null;
    const v = parseKg(inp.value), odd = !done && v > 0 && it && kgDoubt(it, [v], +row.dataset.k);
    return {kg:v != null && v >= 0 && !odd ? v : null};
  };
  const hint = (inp, src, k) => { const ph = carryPh(src && kgCarries(own, src.k, k) ? src.kg : null, inp.dataset.ph ?? inp.placeholder); if (inp.placeholder !== ph) inp.placeholder = ph; };
  let srcL = null, srcR = null;
  for (const row of rows) {
    const k = +row.dataset.k, L = rowFields(row, lr ? 'l' : null).kgIn; if (!L) return; /* без поля веса */
    const fl = filled(row, L);
    if (fl) srcL = {k, kg:fl.kg}; else hint(L, srcL, k);
    if (!lr) continue;
    const R = rowFields(row, 'r').kgIn, fr = filled(row, R);
    if (fr) { srcR = {k, kg:fr.kg}; continue; }
    if (fl) srcR = {k, kg:fl.kg}; /* левая вписана, правая пуста — правая берёт левую */
    hint(R, srcR, k);
  }
}
/* ввод веса в таблице: подсказки следующих подходов, затем «×2 = …» — по вписанному или перенесённому весу */
function logKgInput(inp) {
  const box = inp.closest('.c-log'); if (!box) return;
  /* вес исправляют — вопрос о нём больше не нужен */
  const a = kgAsk[box.dataset.log], row = inp.closest('.lt-r');
  if (a && row && +row.dataset.k === a.k) dropKgAsk(box.dataset.log, box);
  carryKgBox(box); updatePairTotal(inp);
}
/* подсказка над таблицей после отметки: «Первая запись…» сменяется на «Сегодня: 1 из 4…» */
function refreshSug(box, it) {
  const p = box && box.querySelector('.sug'); if (!p) return;
  const sg = suggest(it), b = p.querySelector('b'), t = p.querySelector('span');
  p.className = `sug sug-${sg.tone}`; if (b) b.textContent = SUG_ICON[sg.tone]; if (t && t.textContent !== sg.text) t.textContent = sg.text;
}
function logBlock(it) { return `<div class="c-log" data-log="${it.ex.id}">${logRows(it).html}</div>`; }

/* ---------- неправдоподобный вес: переспросить в строке подхода ---------- */
/* «5000» вместо «50» не записывается молча: от записанного считаются разминка, прогрессия, рекорды и общий вес. Вес —
   одного снаряда, как он записывается. С историей — вписанный вес в 2 раза и больше прошлого (самый тяжёлый подход
   последней тренировки с весом; без прошлых — сегодняшних подходов) и больше него хотя бы на 5 кг: шаг гантелей
   2 → 4 кг — обычная прибавка, а не опечатка. Без истории — больше предела снаряда. Пределы — с большим запасом над
   рекордами и самым тяжёлым инвентарём, чтобы не мешать сильным людям, но ловить лишний ноль:
   гантель или гиря — 100 кг (самые тяжёлые серийные гантели и гири — около 90–100 кг);
   штанга и Смит — 500 кг (рекорды в приседе и становой тяге — около 500 кг; столько же допускает вес в своём плане);
   жим ногами и гакк-машина — 1000 кг (платформа с грузом у сильных людей — несколько сотен килограммов);
   остальные тренажёры и блоки — 300 кг (стеки — обычно 100–150 кг, рычажные с блинами — до 250–300 кг);
   доп. вес к собственному (пояс, жилет) — 200 кг (рекордные отягощения в подтягиваниях и на брусьях — 100–150 кг);
   противовес гравитрона — 150 кг (стек — около 100 кг, противовес больше веса тела не нужен). */
const KG_LIMIT = {db:100, kb:100, bb:500, press:1000, machine:300, extra:200, assist:150};
const KG_LIMIT_NOTE = {db:'Для одной гантели это необычно много.', kb:'Для одной гири это необычно много.', bb:'Для штанги это необычно много.',
  press:'Для тренажёра это необычно много.', machine:'Для тренажёра это необычно много.', extra:'Для доп. веса это необычно много.', assist:'Для противовеса это необычно много.'};
function kgLimitOf(it) {
  const lt = loadType(it.ex), ids = it.eqIds || [];
  if (lt === 'assist') return 'assist';
  if (ids.includes('legpress') || ids.includes('hack')) return 'press';
  if (ids.includes('bb') || ids.includes('smith')) return 'bb';
  if (ids.some(i => MACHINE.has(i))) return 'machine';
  const impl = typeof itemImpl === 'function' ? itemImpl(it) : null;
  if (impl === 'db' || impl === 'kb') return impl;
  return lt === 'extra' ? 'extra' : 'bb';
}
/* вписанный вес подхода k (kgs — общий или левая и правая) неправдоподобен: {kg, text} — что спросить; иначе null */
function kgDoubt(it, kgs, k) {
  const ex = it.ex; if (loadType(ex) === 'none') return null;
  const vs = kgs.filter(v => v > 0); if (!vs.length) return null;
  const kg = Math.max(...vs);
  const weights = (s, skip = -1) => s ? s.s.flatMap((x, i) => { if (!x || i === skip) return []; const sd = setSides(x, ex); return sd ? [sd.l[0], sd.r[0]] : [x[0]]; }).filter(v => v > 0) : [];
  const last = pastSessions(ex.id).reverse().find(s => weights(s).length), today = weights(todaySession(ex.id, false), k);
  const ref = last ? Math.max(...weights(last)) : today.length ? Math.max(...today) : null;
  const ask = why => ({kg, f:'kg', text:`${why} Записать ${fmtKg(kg)} ${wUnit()}?`});
  /* с прошлой тренировкой — больше её веса на четверть (и хотя бы на 5 кг): ACSM советует прибавлять 2–10 % (Ratamess
     et al., Med Sci Sports Exerc 2009; 41(3):687–708), 300 вместо 202,5 — опечатка, а не прибавка (Руслан 4). Сегодняшние
     подходы — прежнее правило «вдвое»: в пирамиде 60 → 100 → 140 обычны */
  if (ref != null) return (last ? kg > 1.25 * ref : kg >= 2 * ref) && kg - ref >= 5 ? ask(last ? `Это намного больше, чем в прошлый раз (${fmtKg(hereKg(ref, last.u, it))} ${wUnit()}).` : `Это намного больше, чем сегодня в других подходах (${fmtKg(ref)} ${wUnit()}).`) : null;
  const kind = kgLimitOf(it);
  return kg > KG_LIMIT[kind] ? ask(KG_LIMIT_NOTE[kind]) : null;
}
/* Неправдоподобные повторы (Артём 6: 1000 повторов с 16 кг молча давали «общий вес 32 000 кг»). С прошлой записью — втрое
   больше её лучшего подхода и хотя бы на 15; без неё — больше предела: с весом — 50 (лёгкие веса до отказа — 25–35 повторов,
   Schoenfeld et al., J Strength Cond Res 2015; 29(10):2954–2963), без веса — 150, удержание — 900 с. Кардио и дистанция —
   без вопроса. Это защита от опечатки, а не правило тренировки: «Записать» записывает как есть. */
const REPS_LIMIT = {kg:50, none:150, hold:900};
function repsDoubt(it, reps, kgs) {
  const ex = it.ex, n = Math.max(0, ...reps.filter(v => v > 0)); if (!(n > 0) || ex.kind === 'dist' || ex.g === 'cardio') return null;
  const unit = '\u00a0' + (ex.kind === 'time' ? 'с' : plural(n, 'повтор', 'повтора', 'повторов')), say = why => ({reps:n, f:'reps', text:`${why} Записать ${n}${unit}?`});
  const best = s => s ? Math.max(0, ...s.s.filter(Boolean).flatMap(x => { const sd = setSides(x, ex); return sd ? [sd.l[1], sd.r[1]] : [x[1]]; })) : 0;
  const last = pastSessions(ex.id).reverse().find(s => best(s) > 0), r0 = best(last), heavy = kgs.some(v => v > 0);
  if (r0 > 0) return n >= 3 * r0 && n - r0 >= 15 ? say(`Это намного больше, чем в прошлый раз (лучший подход — ${r0}).`) : null;
  const lim = ex.kind === 'time' ? REPS_LIMIT.hold : heavy ? REPS_LIMIT.kg : REPS_LIMIT.none;
  return n > lim ? say(ex.kind === 'time' ? 'Для удержания это необычно долго.' : heavy ? 'Для подхода с весом это необычно много повторов.' : 'Это необычно много повторов для одного подхода.') : null;
}
/* вес, затем повторы: о чём переспросить перед записью подхода k */
function setDoubt(it, kgs, reps, k) { return kgDoubt(it, kgs, k) || repsDoubt(it, reps, kgs); }
/* kgAsk[упражнение] = {k, text, side, edit} — строка, где ждёт ответ «Записать / Исправить» (как подтверждение «Убрать»
   у подхода: строка подсвечена, вопрос и две кнопки под полями); edit — правка уже отмеченного подхода */
const kgAsk = {};
function kgAskHtml(id, a) {
  return `<div class="lt-kq" role="group" aria-labelledby="lt-kq-${id}"><span class="lt-cft" id="lt-kq-${id}">${esc(a.text)}</span>`
    + `<button type="button" class="lt-cfy" data-kgyes="${id}">${'Записать'}</button><button type="button" class="lt-cfn" data-kgfix="${id}">${'Исправить'}</button></div>`;
}
function askKg(row, it, k, q, extra = {}) {
  const id = it.ex.id, box = row.closest('.c-log');
  dropKgAsk(id, box);
  if (setArm[id] !== undefined) { delete setArm[id]; box.querySelectorAll('.lt-r.lt-arm').forEach(r => { r.classList.remove('lt-arm'); const c = r.querySelector('.lt-cf'); if (c) c.remove(); }); }
  kgAsk[id] = {k, text:q.text, side:extra.side || null, edit:!!extra.edit, f:q.f === 'reps' ? 'reps' : 'kg'};
  row.classList.add('lt-arm'); row.insertAdjacentHTML('beforeend', kgAskHtml(id, kgAsk[id]));
  row.querySelector('[data-kgfix]').focus();
}
function dropKgAsk(id, box) {
  delete kgAsk[id];
  if (box) box.querySelectorAll('.lt-kq').forEach(q => { const r = q.closest('.lt-r'); q.remove(); if (r && !r.querySelector('.lt-cf')) r.classList.remove('lt-arm'); });
}
/* поле веса, о котором спросили: сторона из вопроса, иначе общее */
function kgAskField(box, a) {
  const row = box && box.querySelector(`.lt-r[data-k="${a.k}"]`); if (!row) return {row:null, inp:null};
  const f = rowFields(row, row.classList.contains('lt-lr') ? a.side || 'l' : null);
  return {row, inp:a.f === 'reps' ? f.rIn : f.kgIn};
}
/* «Записать»: подход записывается с вписанным весом (правка отмеченного — правится) */
function kgYes(id, box) {
  const a = kgAsk[id]; if (!a || !box) return;
  const {row, inp} = kgAskField(box, a);
  dropKgAsk(id, box); if (!row) return;
  if (a.edit) { if (inp) { editSet(inp, true); inp.focus(); } return; }
  const tick = row.querySelector('[data-tick]'); tickSet(tick, true); tick.focus();
}
/* «Исправить» или Esc: вопрос закрывается, фокус — в поле веса, вписанное выделено */
function kgFix(id, box) {
  const a = kgAsk[id]; if (!a || !box) return;
  const {inp} = kgAskField(box, a);
  dropKgAsk(id, box);
  if (inp) { inp.focus(); inp.select(); }
}

/* ---------- история упражнения ---------- */
function metricOf(ex) {
  /* расчётный максимум по медленным подходам без расслабления занижен — статодинамика в него не входит */
  if (loadType(ex) === 'kg' && ex.kind !== 'dist') return {name:'Расчётный максимум', unit:wUnit(), w:true, f:s => { if (s.fmt === 'static') return null; const v = s.s.filter(x => x && x[0] > 0).map(x => e1rm(x[0], x[1])); return v.length ? Math.max(...v) : null; }};
  if (ex.kind === 'time') return {name:'Лучший подход', unit:'с', f:s => { const v = s.s.filter(Boolean).map(x => x[1]); return v.length ? Math.max(...v) : null; }};
  if (ex.kind === 'dist') return {name:'Лучшая дистанция', unit:'м', f:s => { const v = s.s.filter(Boolean).map(x => x[1]); return v.length ? Math.max(...v) : null; }};
  return {name:'Лучший подход', unit:'повт.', f:s => { const v = s.s.filter(Boolean).map(x => x[1]); return v.length ? Math.max(...v) : null; }};
}
/* самый тяжёлый подход записи: вес и лучшие повторы с ним (статодинамика и записи без веса — null) */
function topSet(s) {
  if (!s || s.fmt === 'static') return null;
  const xs = s.s.filter(x => x && x[0] > 0); if (!xs.length) return null;
  const w = Math.max(...xs.map(x => x[0]));
  return {w, r:Math.max(...xs.filter(x => x[0] === w).map(x => x[1]))};
}
/* график истории: у упражнений с весом — расчётный максимум; если вес во всех записях один и тот же (одни гантели дома),
   максимум почти не меняется (повторы больше 12 в нём не считаются) — тогда график повторов с этим весом */
function histMetric(ex, ss) {
  const m = metricOf(ex), lt = loadType(ex);
  if (ex.kind || (lt !== 'kg' && !(lt === 'extra' && extraWeighted(ss)))) return m;
  const here = s => hereSession(s, {ex}), tops = ss.map(s => topSet(here(s))).filter(Boolean);
  /* доп. вес (болгарские с гантелями, Дмитрий 17): расчётного максимума нет — вес тела в нём не учтён; вес менялся — график веса */
  if (lt === 'extra' && !(tops.length >= 2 && tops.every(t => t.w === tops[0].w))) return {name:'Вес в лучшем подходе', unit:wUnit(), w:true, f:s => { const t = topSet(here(s)); return t ? t.w : null; }};
  if (tops.length < 2 || !tops.every(t => t.w === tops[0].w)) return m;
  const w = tops[0].w;
  return {name:`Повторы с ${fmtKg(w)} ${wUnit()}`, unit:'повт.', bare:true, f:s => { const t = topSet(here(s)); return t && t.w === w ? t.r : null; }};
}
/* у упражнения с доп. весом есть записи с весом (гантели в болгарских, жилет в подтягиваниях) */
const extraWeighted = ss => ss.some(s => s.fmt !== 'static' && s.s.some(x => x && x[0] > 0));
/* Сводка упражнения в строке журнала. С весом: крупно — рабочий вес и лучшие повторы с ним в последней записи, мельче
   и с подписью — расчётный максимум; изменение с первой записи — по весу, а при том же весе — по повторам («+3 повт.»,
   а не «0 %»: с одними гантелями прогресс — это повторы). Без веса — как раньше: значение метрики и изменение в процентах. */
/* Доп. вес (болгарские с гантелями, подтягивания с поясом) — так же, рабочий вес и повторы, но без расчётного максимума: вес
   тела в нём не учтён (Дмитрий 17: было «9 повт.» без веса). Вес — в выбранной единице (hereSession). Изменения нет —
   «без изменений», а не «0 %» (Mike 16). */
function journalVal(ex, ss) {
  const m = metricOf(ex), lt = loadType(ex), weighted = !ex.kind && (lt === 'kg' || (lt === 'extra' && extraWeighted(ss)));
  const tops = weighted ? ss.map(s => topSet(hereSession(s, {ex}))).filter(Boolean) : [];
  const same = `<em class="j-same">${'без изменений'}</em>`;
  if (!tops.length) {
    const vals = ss.map(s => m.f(s)).filter(v => v != null), firstV = vals[0], lastV = vals[vals.length - 1];
    const ch = vals.length > 1 && firstV ? Math.round((lastV / firstV - 1) * 100) : null;
    return `<span class="j-val">${lastV != null ? metricFmt(m)(lastV) : '—'}<small>${m.unit}</small>${ch == null ? '' : ch === 0 ? same : `<em class="${ch > 0 ? 'pos' : 'neg'}">${ch > 0 ? '+' : ''}${ch}%</em>`}</span>`;
  }
  const a = tops[0], b = tops[tops.length - 1], e = lt === 'kg' ? [...ss].reverse().map(m.f).find(v => v != null) : null;
  const chip = (d, u, w) => `<em class="${d > 0 ? 'pos' : 'neg'}">${d > 0 ? '+' : '−'}${w ? fmtKg(Math.abs(d)) : Math.abs(d)} ${u}</em>`;
  const ch = tops.length < 2 ? '' : b.w !== a.w ? chip(b.w - a.w, wUnit(), true) : b.r !== a.r ? chip(b.r - a.r, 'повт.') : same;
  return `<span class="j-val j-wr"><span class="j-big"><span class="vh">${'Рабочий вес'} </span>${fmtKg(b.w)}<small>${wUnit()}</small> × ${b.r}<span class="vh"> ${'повт.'}</span></span>`
    + `${e != null ? `<small class="j-e1">${'расч. максимум'} ${fmtKgR(e)} ${wUnit()}</small>` : ''}${ch}</span>`;
}
/* число метрики: вес (кг из журнала) — в выбранных единицах до 0,5 кг или 1 фнт, остальное (повторы, секунды, метры) — до 0,5 */
const metricFmt = m => m.w ? v => fmtKgR(v) : v => fmtU(Math.round(v * 2) / 2);
/* fmt — подпись значения точки (метрика: metricFmt; вес тела — 18-measures.js) */
function sparkSvg(pts, unit, fmt = v => fmtU(Math.round(v * 2) / 2)) {
  if (!pts.length) return '';
  const W = 300, H = 74, L = 6, R = 40, T = 12, B = 14;
  const vs = pts.map(p => p.v);
  let mn = Math.min(...vs), mx = Math.max(...vs);
  if (mx - mn < 1e-9) { mn -= 1; mx += 1; }
  const pad = (mx - mn) * 0.12; mn -= pad; mx += pad;
  const x = i => pts.length === 1 ? (L + W - R) / 2 : L + i * (W - L - R) / (pts.length - 1);
  const y = v => T + (1 - (v - mn) / (mx - mn)) * (H - T - B);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const area = pts.length > 1 ? `${line}L${x(pts.length - 1).toFixed(1)},${H - B}L${x(0).toFixed(1)},${H - B}Z` : '';
  const last = pts[pts.length - 1], first = pts[0];
  const fv = fmt;
  const data = esc(JSON.stringify(pts.map((p, i) => [x(i), y(p.v), `${fmtDay(p.d, true)} · ${fv(p.v)} ${unit}`])));
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Динамика: от ${fv(first.v)} до ${fv(last.v)} ${unit}" data-pts="${data}">
    <line class="sp-base" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>
    ${area ? `<path class="sp-area" d="${area}"/>` : ''}
    ${pts.length > 1 ? `<path class="sp-line" d="${line}"/>` : ''}
    <circle class="sp-end" cx="${x(pts.length - 1).toFixed(1)}" cy="${y(last.v).toFixed(1)}" r="4"/>
    <text class="sp-lab" x="${(x(pts.length - 1) + 8).toFixed(1)}" y="${(y(last.v) + 4).toFixed(1)}">${fv(last.v)}</text>
    ${pts.length > 1 ? `<text class="sp-d" x="${L}" y="${H - 2}">${fmtDay(first.d, true)}</text><text class="sp-d" x="${W - R}" y="${H - 2}" text-anchor="end">${fmtDay(last.d, true)}</text>` : ''}
    <line class="sp-x" x1="0" x2="0" y1="${T - 4}" y2="${H - B}" visibility="hidden"/><circle class="sp-dot" r="4" cx="0" cy="0" visibility="hidden"/>
  </svg>`;
}
/* подходы записи (в выбранной единице) и её объём второй строкой (если есть внешний вес); вписанное в другой единице —
   ещё строкой, теми числами, что вписали (Руслан 3: «мои круглые числа в той единице, в которой я их записал») */
function histSets(ex, s) {
  const t = sessionTonnage(ex, s);
  return `${setsText(hereSession(s, {ex}).s, ex)}${t > 0 ? `<small class="h-ton">${'объём ' + fmtTon(t) + ' ' + wUnit()}</small>` : ''}${origNote(ex, s)}`;
}
/* «вписано в фунтах: 225×5 · 225×5» — подходы записи, вписанные не в выбранной единице, в их собственной */
function origNote(ex, s) {
  const here = wu(), xs = s.s.filter(x => x && x[0] > 0 && unitOfKg(x[0], s.u) !== here); if (!xs.length) return '';
  const own = v => fmtU(Math.round((here === 'kg' ? v / LB_KG : v) * 100) / 100), side = p => (p[0] > 0 ? own(p[0]) + '×' : '') + p[1];
  const text = xs.map(x => { const sd = setSides(x, ex); return sd ? `${'Л'} ${side(sd.l)} · ${'П'} ${side(sd.r)}` : side(x); }).join(xs.some(x => setSides(x, ex)) ? '; ' : ' · ');
  return `<small class="h-u">${here === 'kg' ? 'вписано в фунтах:' : 'вписано в килограммах:'} ${text}</small>`;
}
/* записи упражнения «по свежести» и, пока не истекло время, место удалённой записи («Удалено · Вернуть») */
function histList(ex) {
  const ss = byRecent((LOG.data[ex.id] || []).filter(x => x.s.some(Boolean))), u = undoFor(ex.id);
  return {ss, list:u ? byRecent(ss.concat({d:u.s.d, s:[], gone:true})) : ss};
}
function histRowHtml(ex, s) {
  if (s.gone) return undoLineHtml(`Удалена запись за ${fmtDay(s.d, true)}.`, `data-hist-undo="${ex.id}"`, `h-gone-${ex.id}`);
  return `<li><span class="h-d">${fmtDay(s.d, true)}${s.wk ? `<small>нед. ${s.wk}</small>` : ''}${s.fmt === 'static' ? '<small>статодинамика</small>' : ''}</span>
    <span class="h-s">${histSets(ex, s)}</span>
    <button type="button" class="h-del" data-del="${ex.id}" data-d="${s.d}" aria-label="Удалить запись за ${fmtDay(s.d, true)}">Удалить</button></li>`;
}
function histHtml(ex) {
  const {ss, list} = histList(ex);
  if (!ss.length && list.length) return `<ul class="h-list">${list.map(s => histRowHtml(ex, s)).join('')}</ul>${variantHistNote(ex)}`;
  if (!ss.length) return `<p class="h-empty">Записей пока нет. Отметьте подходы выше — здесь появится история и график.</p>${variantHistNote(ex)}`;
  const m = histMetric(ex, ss);
  const pts = ss.map(s => ({d:s.d, v:m.f(s)})).filter(p => p.v != null).slice(-24);
  const best = pts.length ? Math.max(...pts.map(p => p.v)) : null;
  const rows = list.slice(-6).reverse().map(s => histRowHtml(ex, s)).join('');
  return `<div class="h-chart"><p class="h-cap">${m.name}${m.bare ? '' : ', ' + m.unit}${best != null ? ` · лучший ${metricFmt(m)(best)}` : ''}</p>${sparkSvg(pts, m.unit, metricFmt(m))}</div>
    <ul class="h-list">${rows}</ul>${ss.length > 6 ? `<p class="h-more">Всего записей: ${ss.length}. Полная история — в разделе «Журнал».</p>` : ''}${variantHistNote(ex)}`;
}
function histCount(id) { return (LOG.data[id] || []).filter(x => x.s.some(Boolean)).length; }

/* ---------- обновление на странице ---------- */
function refreshCard(card) {
  if (!plan || !plan.items) return;
  const it = plan.items.find(x => x.ex.id === card.dataset.ex);
  if (!it) return;
  const box = card.querySelector('.c-log');
  const ae = document.activeElement;
  if (box && !(box.contains(ae) && ae.tagName === 'INPUT')) {
    const refocus = !box.contains(ae) ? null : ae.dataset.k !== undefined ? `[data-${ae.dataset.tick ? 'tick' : 'addset'}][data-k="${ae.dataset.k}"]`
      : ae.dataset.cfold ? '[data-cfold]' : ae.dataset.hist ? '[data-hist]' : ae.dataset.lr ? '[data-lr]'
      : ['addset', 'delset', 'delyes', 'delno'].map(a => ae.dataset[a] ? `[data-${a}]` : '').find(Boolean) || null;
    renderLogBox(box, it);
    if (refocus) { const n = box.querySelector(refocus); if (n) n.focus(); }
  }
  refreshWarmup(card);
  const pg = card.querySelector('.c-prog'); if (pg) pg.innerHTML = progressionHint(it);
  const h = card.querySelector('.c-hist');
  if (h && !h.hidden) h.innerHTML = histHtml(it.ex);
  const hb = card.querySelector('[data-hist]');
  if (hb) { const n = histCount(it.ex.id); hb.querySelector('small').textContent = n ? n : ''; }
}
function logRefresh(ids) {
  const st = $('#log-status'); if (st) st.innerHTML = statusHtml();
  const tab = document.querySelector('[data-view="journal"] small'); if (tab) tab.textContent = journalDays() || '';
  if (S.view === 'journal') { if (!$('#plan').contains(document.activeElement) || document.activeElement === document.body) renderJournal(); return; }
  document.querySelectorAll('.card').forEach(c => { if (!ids || ids.includes(c.dataset.ex)) refreshCard(c); });
}
/* где хранятся записи; хранилище не принимает записи — так и сказано (Ксения 6, 7); постоянное хранилище и iPhone —
   storageLineHtml (18a-data-keep.js) */
function statusHtml() {
  const m = LOG.mode, st = Keep.state();
  if (st !== 'ok' && m !== 'cloud') return `<span class="ls-dot ls-bad" aria-hidden="true"></span><span>${st === 'full' ? 'Записи не сохраняются: хранилище браузера переполнено.' : 'Записи не сохраняются на этом устройстве: браузер запретил сайту хранить данные.'} ${'Сохраните полную копию в файл, пока страница открыта.'}</span>`;
  const t = m === 'cloud' ? 'Записи сохраняются в вашем аккаунте и доступны на любом устройстве, где вы открываете эту страницу.'
    : m === 'connecting' ? 'Подключаю хранилище записей…'
    : 'Записи хранятся в этом браузере на этом устройстве.' + (typeof storageLineHtml === 'function' ? storageLineHtml() : '') + ' Делайте резервную копию, чтобы перенести журнал на другое устройство или не потерять его при очистке браузера.';
  return `<span class="ls-dot ls-${m}" aria-hidden="true"></span><span>${LOG.err ? esc(LOG.err) + ' Делайте резервную копию, чтобы не потерять записи.' : t}</span>`;
}
/* одна строка о личных данных (Михаил 12): что где хранится и что копия — открытый файл */
function privacyHtml() {
  return `<p class="p-hint j-private">${LOG.mode === 'cloud' ? 'Пульс и замеры хранятся в вашем аккаунте и на этом устройстве, отметки о суставах — только на этом устройстве.' : 'Пульс, вес и отметки о суставах хранятся только на этом устройстве — приложение их никуда не отправляет.'} ${'Резервная копия — обычный открытый файл: всё это в нём читается без пароля.'}</p>`;
}
function journalDays() { const s = new Set(); for (const ss of Object.values(LOG.data)) for (const x of ss) if (x.s.some(Boolean)) s.add(x.d); return s.size; }

/* ---------- экран «Журнал» ---------- */
/* тренировки по дням: упражнений, подходов и общий вес за день */
function trainingDays(data = LOG.data) {
  const by = {};
  for (const [id, ss] of Object.entries(data || {})) {
    const ex = EXI[id]; if (!ex || !Array.isArray(ss)) continue;
    for (const s of ss) {
      const n = s && Array.isArray(s.s) ? s.s.filter(Boolean).length : 0; if (!n) continue;
      const d = by[s.d] || (by[s.d] = {d:s.d, ex:0, sets:0, t:0});
      d.ex++; d.sets += n; d.t += sessionTonnage(ex, s);
    }
  }
  return by;
}
/* последние тренировки списком: дата, упражнений и подходов, общий вес за день */
function daysHtml(by = trainingDays(), limit = 5) {
  /* дни с пометкой «Больно» (11g-gentle.js: «Пропустить → больно» на экране тренировки) — и без записанных подходов */
  const pain = typeof painDayHtml === 'function' ? painDayHtml : () => '', all = {...by};
  if (typeof ensurePain === 'function') for (const x of ensurePain(S).log) if (!all[x.d]) all[x.d] = {d:x.d, ex:0, sets:0, t:0};
  const today = todayKey(), days = Object.values(all).sort((a, b) => recentKey(a.d, today) < recentKey(b.d, today) ? 1 : -1).slice(0, limit);
  if (!days.length) return '';
  return `<div class="j-days"><p class="lb-h">${'Последние тренировки · объём'}</p><ul>${days.map(x => `<li><span class="j-dd">${fmtDay(x.d, true)}</span><span class="j-dn">${x.sets ? `${x.ex} ${plural(x.ex, 'упражнение', 'упражнения', 'упражнений')} · ${x.sets} ${plural(x.sets, 'подход', 'подхода', 'подходов')}${heartDayHtml(x.d)}` : ''}${pain(x.d)}</span><b class="j-dt">${x.t > 0 ? fmtTon(x.t) + `<small>${wUnit()}</small>` : '—'}</b></li>`).join('')}</ul></div>`;
}
function heatmap(today = new Date(), by = trainingDays()) {
  const byDay = {};
  for (const x of Object.values(by)) byDay[x.d] = x.sets;
  const W = 12, cell = 15, gap = 3, LX = 22, TY = 16;
  const now = new Date(today); now.setHours(12, 0, 0, 0);
  const dow = (now.getDay() + 6) % 7;
  const start = new Date(now); start.setDate(now.getDate() - dow - (W - 1) * 7);
  let cells = '', lastM = -1;
  const marks = [];
  for (let w = 0; w < W; w++) for (let d = 0; d < 7; d++) {
    const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
    if (dt > now) continue;
    const k = dayKey(dt), n = byDay[k] || 0;
    const lv = n === 0 ? 0 : n < 10 ? 1 : n < 20 ? 2 : 3;
    const t = n && by[k] ? by[k].t : 0;
    cells += `<rect class="hm hm${lv}" x="${LX + w * (cell + gap)}" y="${TY + d * (cell + gap)}" width="${cell}" height="${cell}" rx="3" data-tip="${fmtDay(k, true)}: ${n ? n + ' ' + plural(n, 'подход', 'подхода', 'подходов') + (t > 0 ? ` · ${fmtTon(t)} ${wUnit()}` : '') : 'без тренировки'}"/>`;
    if (d === 0 && dt.getMonth() !== lastM) { lastM = dt.getMonth(); marks.push([w, lastM]); }
  }
  /* подпись месяца — над его первой неделей; хвост прошлого месяца в первой колонке подписывается, только если до
     следующей подписи не меньше двух колонок (иначе подписи наезжают: «июлавг») */
  const months = marks.filter(([w], i) => i + 1 >= marks.length || marks[i + 1][0] - w >= 2)
    .map(([w, m]) => w < W - 1 ? `<text class="hm-l" x="${LX + w * (cell + gap)}" y="10">${MONTHS[m]}</text>`
      : `<text class="hm-l" x="${LX + W * (cell + gap) - gap}" y="10" text-anchor="end">${MONTHS[m]}</text>`).join(''); /* в последней колонке — по правому краю, не обрезается */
  const days = ['Пн', '', 'Ср', '', 'Пт', '', ''].map((t, i) => t ? `<text class="hm-l" x="0" y="${TY + i * (cell + gap) + 11}">${t}</text>` : '').join('');
  const w = LX + W * (cell + gap), h = TY + 7 * (cell + gap);
  return `<svg class="heat" viewBox="0 0 ${w} ${h}" role="img" aria-label="Тренировочные дни за 12 недель">${months}${days}${cells}</svg>
    <p class="hm-legend"><span>меньше</span><i class="hm0"></i><i class="hm1"></i><i class="hm2"></i><i class="hm3"></i><span>больше подходов за день</span></p>`;
}
function renderJournal() {
  stopFigures();
  /* записи — «по свежести» (byRecent): сегодняшние первыми, записи «из будущего» (часы переведены назад) — за ними */
  const today = todayKey();
  const entries = Object.entries(LOG.data).map(([id, ss]) => [id, byRecent(ss.filter(x => x.s.some(Boolean)), today)]).filter(([id, ss]) => EXI[id] && ss.length);
  const days = journalDays();
  const sets = entries.reduce((a, [, ss]) => a + ss.reduce((b, x) => b + x.s.filter(Boolean).length, 0), 0);
  const lastK = entries.reduce((m, [, ss]) => { const k = recentKey(ss[ss.length - 1].d, today); return k > m ? k : m; }, ''), last = lastK.slice(1);
  const byDays = trainingDays();
  entries.sort((a, b) => recentKey(a[1][a[1].length - 1].d, today) < recentKey(b[1][b[1].length - 1].d, today) ? 1 : -1);
  const broken = Keep.broken().length;
  const tools = `<div class="j-tools">
      ${LOG.canExport ? `<button type="button" class="btn btn-2" id="exp-json">Полная копия (JSON)</button><button type="button" class="btn btn-2" id="exp-csv">Журнал для Excel</button><button type="button" class="btn btn-2" id="exp-body">Замеры для Excel</button>` : ''}
      <label class="btn btn-2" for="imp-file">Восстановить из копии</label><input type="file" id="imp-file" accept=".json,application/json" hidden>
      ${broken ? `<button type="button" class="btn btn-2" data-keep="broken">${'Испорченные данные'} (${broken})</button>` : ''}
    </div>${restorePanelHtml()}${unitsHtml()}<p class="p-hint" id="j-msg" role="status" tabindex="-1">${esc(LOG.msg || '')}</p>
    <p class="p-hint">Полная копия — настройки, инвентарь, журнал и замеры одним файлом: перенесёт всё на другой телефон или вернёт после очистки браузера.</p>${privacyHtml()}`;
  LOG.msg = '';
  let html = `<header class="p-head j-head">
    <div class="p-sum">
      <p class="eyebrow">Журнал</p>
      <h1 class="p-title">Ваш прогресс</h1>
      <dl class="stats">
        <div><dt>${plural(days, 'тренировка', 'тренировки', 'тренировок')}</dt><dd>${days}</dd></div>
        <div><dt>${plural(sets, 'подход', 'подхода', 'подходов')}</dt><dd>${sets}</dd></div>
        <div><dt>${plural(entries.length, 'упражнение', 'упражнения', 'упражнений')}</dt><dd>${entries.length}</dd></div>
      </dl>
      <p class="ls" id="log-status">${statusHtml()}</p>
      ${tools}
    </div>
    <figure class="j-heat"><figcaption class="lb-h">Активность за 12 недель${last ? ` · последняя тренировка ${fmtDay(last, true)}` : ''}</figcaption>${heatmap(new Date(), byDays)}${daysHtml(byDays)}</figure>
  </header>${entries.length ? muscleLoadHtml() : ''}${bodyHtml()}`;
  /* упражнение, у которого удалили последнюю запись, остаётся в списке, пока видно «Удалено · Вернуть» */
  const gone = undoLive(LOG.undo);
  if (gone && EXI[gone.id] && !entries.some(([id]) => id === gone.id)) entries.unshift([gone.id, []]);
  if (!entries.length) {
    html += `<div class="empty"><h2>Записей пока нет</h2><p>Откройте план и отмечайте подходы в карточках упражнений: вес и повторы сохранятся здесь, а планировщик начнёт подсказывать, когда прибавлять вес.</p><button type="button" class="btn" data-view="plan">Перейти к плану</button></div>`;
  } else {
    html += `<ul class="j-list">${entries.map(([id, ss]) => {
      const ex = EXI[id], list = histList(ex).list;
      const lastS = ss[ss.length - 1], open = LOG.openId === id;
      return `<li class="j-row">
        <details data-jex="${id}"${open ? ' open' : ''}>
          <summary>
            <span class="j-name">${esc(ex.name)}<small>${GN[ex.g]} · ${ss.length} ${plural(ss.length, 'запись', 'записи', 'записей')}${lastS ? ' · ' + fmtDay(lastS.d, true) : ''}</small></span>
            ${ss.length ? journalVal(ex, ss) : ''}
          </summary>
          <div class="j-body">${histHtml(ex).replace(/<p class="h-more">.*?<\/p>/, '')}${list.length > 6 ? `<details class="j-all"${open && list.slice(0, -6).some(s => s.gone) ? ' open' : ''}><summary>Все записи (${ss.length})</summary><ul class="h-list">${list.slice(0, -6).reverse().map(s => histRowHtml(ex, s)).join('')}</ul></details>` : ''}</div>
        </details>
      </li>`;
    }).join('')}</ul>
    <p class="legend">Справа — рабочий вес и лучшие повторы с ним в последней тренировке, ниже — расчётный максимум и изменение с первой записи: по весу, а при том же весе — по повторам. У гантелей и гирь вес — одного снаряда.</p>
    <p class="legend">Расчётный максимум — вес, который вы, по формуле Эпли, подняли бы один раз: вес × (1 + повторы / 30). Он растёт и когда прибавляете вес, и когда делаете больше повторов с тем же весом, но повторы сверх 12 в нём не учитываются. Подход в один повтор — это и есть максимум: сам вес. Если вес во всех записях один, график показывает повторы с ним.</p>
    <p class="legend">Объём — сумма «вес × повторы» по всем снарядам и сторонам: ${tonnageExample()}. Считается только внешний вес: гантели, гири, штанга, тренажёр, доп. вес; вес тела, противовес гравитрона, удержания на время и дистанция не входят. Л/П — подход с левой и правой стороной отдельно: прогресс и рекорды — по слабой стороне.</p>`;
  }
  LOG.openId = null;
  $('#plan').innerHTML = html;
}
/* единицы веса — рядом с копией и выгрузкой: общая настройка приложения (S.units) */
function unitsHtml() {
  const u = wu(), b = (v, label) => `<button type="button" class="pre${u === v ? ' on' : ''}" data-units="${v}" aria-pressed="${u === v}">${label}</button>`;
  return `<div class="pres j-units" role="group" aria-labelledby="j-units-l"><span class="pres-l" id="j-units-l">Единицы веса</span>${b('kg', 'кг')}${b('lb', 'фнт')}</div>`;
}
/* пример общего веса в пояснении журнала — в выбранных единицах: гантели 2 × 20 кг (2 × 45 фнт), тяга 30 кг (65 фнт) */
function tonnageExample() {
  const [a, b] = isLb() ? [45, 65] : [20, 30], u = wUnit();
  return `жим гантелей 2 × ${a} ${u} на 10 повторов — ${fmtTon(fromU(a * 20))} ${u}, тяга гантели одной рукой ${b} ${u} по 10 на каждую сторону — ${fmtTon(fromU(b * 20))} ${u}`;
}
function viewTabs() {
  const n = journalDays(), v = ['atlas', 'journal'].includes(S.view) ? S.view : 'plan';
  const tab = (id, label, extra = '') => `<button type="button" role="tab" data-view="${id}" aria-selected="${v === id}" class="${v === id ? 'on' : ''}">${label}${extra}</button>`;
  return tab('plan', 'План') + tab('atlas', 'Мышцы') + tab('journal', 'Журнал', ` <small>${n || ''}</small>`);
}

/* ---------- экспорт и восстановление ---------- */
async function saveFile(name, text, mime) {
  if (LOG.dl) {
    try { await LOG.dl.save({filename:name, data:text}); return 'ok'; }
    catch (e) { return e && e.code === 'declined' ? 'declined' : 'fail'; }
  }
  if (!window.claude) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], {type:mime}));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    return 'ok';
  }
  return 'fail';
}
/* Таблица для Excel: подход — строка. Вес — одного снаряда (как записан); «Левая» и «Правая» — у подходов с Л/П
   («12×10», у удержаний — секунды), основные вес и повторы тогда — слабая сторона; общий вес — последний столбец,
   у подходов без внешнего веса пусто. Разделитель — как ждёт Excel языка (Mike 3): где десятичная запятая (русская версия) —
   точка с запятой, где точка (английская) — запятая. Внутри дня — по порядку выполнения (Дмитрий 22): упражнения — по времени
   первого подхода (at записи дня), подходы — по номерам; записи прежних версий без времени — первыми, в порядке журнала. */
const csvSep = () => DEC === ',' ? ';' : ',';
function csvLine(r, sep = csvSep()) { return r.map(v => { const t = String(v); return t.includes(sep) || /["\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }).join(sep); }
function csvText() {
  /* вес и общий вес — в выбранных единицах, единица — в заголовке столбца */
  const rows = [['Дата', 'Упражнение', 'Группа мышц', 'Подход', `Вес, ${wUnit()}`, 'Повторы / секунды / метры', 'Неделя цикла', 'Отдых после подхода, с', 'Левая', 'Правая', `Объём за подход, ${wUnit()}`]];
  const all = [], side = p => (p[0] != null ? fmtKgRaw(p[0]) + '×' : '') + p[1];
  let order = 0;
  for (const [id, ss] of Object.entries(LOG.data)) {
    const ex = EXI[id]; order++; if (!ex) continue;
    for (const s of ss) {
      const impl = sessionImpl(ex, s), at = Number.isFinite(s.at) ? s.at : -Infinity;
      s.s.forEach((x, k) => {
        if (!x) return;
        const sd = setSides(x, ex), t = setTonnage(ex, x, impl);
        all.push({key:[s.d, at, order, k], row:[s.d, ex.name, GN[ex.g], k + 1, x[0] != null ? fmtKgRaw(x[0]) : '', x[1], s.wk || '', restField(x[2]) ?? '', sd ? side(sd.l) : '', sd ? side(sd.r) : '', t > 0 ? fmtKgRaw(t) : '']});
      });
    }
  }
  all.sort((a, b) => { for (let i = 0; i < 4; i++) if (a.key[i] !== b.key[i]) return a.key[i] < b.key[i] ? -1 : 1; return 0; });
  const sep = csvSep();
  return '﻿' + rows.concat(all.map(x => x.row)).map(r => csvLine(r, sep)).join('\r\n');
}
/* имя файла копии: в английской версии — backup, в русской — как раньше (Mike 5) */
/* имя копии одно на обоих языках, латиницей, как остальные файлы lazy-gym-… (решение владельца по 4.107, вопрос 9) */
const backupStem = () => 'lazy-gym-backup';
async function exportLog(kind) {
  const msg = $('#j-msg'), d = todayKey();
  const r = kind === 'csv' ? await saveFile(`lazy-gym-log-${d}.csv`, csvText(), 'text/csv')
    : await saveFile(`${backupStem()}-${d}.json`, JSON.stringify(backupObject()), 'application/json');
  if (msg) msg.textContent = r === 'ok' ? (kind === 'csv' ? (csvSep() === ';' ? 'Таблица сохранена. Откройте её в Excel: столбцы разделены точкой с запятой.' : 'Таблица сохранена. Откройте её в Excel: столбцы разделены запятой.') : 'Полная копия сохранена. Восстановить из неё всё можно здесь же, на любом устройстве.')
    : r === 'declined' ? 'Сохранение отменено.' : 'Сохранить файл не удалось.';
}
/* ---------- восстановление из копии: сначала — что будет, и выбор для планов и настроек (Ксения 4) ---------- */
let restorePending = null; /* {obj, cut, log, body, settings, heart, choice} */
function importLog(file) {
  const rd = new FileReader();
  rd.onload = () => restoreRead(String(rd.result || ''));
  rd.onerror = () => { const m = $('#j-msg'); if (m) m.textContent = 'Файл не читается.'; };
  rd.readAsText(file);
}
function restoreRead(text) {
  const r = readBackupText(text);
  restorePending = null;
  if (r.error) { LOG.msg = r.error; renderJournalKeep('#j-msg'); return; }
  const sp = restoreSettingsPlan(r.obj);
  restorePending = {obj:r.obj, cut:r.cut, log:restoreLogPlan(r.obj), body:restoreBodyPlan(r.obj), settings:sp,
    heart:r.obj.heart && typeof r.obj.heart === 'object' && r.obj.heart.days && typeof r.obj.heart.days === 'object' ? Object.keys(r.obj.heart.days).length : 0,
    choice:sp && (sp.fresh || !sp.differs) ? 'copy' : 'mine'};
  renderJournalKeep('#jr-h');
}
/* перерисовать журнал, сохранив прокрутку, и поставить фокус */
function renderJournalKeep(focusSel) {
  if (S.view !== 'journal') return;
  const y = window.scrollY; renderJournal(); window.scrollTo(0, y);
  const f = focusSel && $(focusSel); if (f) f.focus();
}
function restorePanelHtml() {
  const p = restorePending; if (!p) return '';
  const L = p.log, made = typeof p.obj.exported === 'string' && realDay(p.obj.exported.slice(0, 10)) ? fmtDay(p.obj.exported.slice(0, 10), true) : '';
  const inCopy = [L.added + L.joined + L.same ? `записей журнала — ${L.added + L.joined + L.same}` : '', p.body.added ? `замеров — ${p.body.added}` : '', p.heart ? `дней с пульсом — ${p.heart}` : '', p.settings ? 'планы и настройки' : ''].filter(Boolean).join(', ');
  const warn = [];
  if (p.cut) warn.push('Файл обрезан или повреждён (например, при пересылке): восстановится уцелевшая часть.');
  const drop = logDropText(L.drops); if (drop) warn.push(`Не годятся и будут пропущены: ${drop}.`);
  if (p.body.dropped) warn.push(`Пропущено значений замеров: ${p.body.dropped} — дата или число не годятся.`);
  if (L.foreign.length) warn.push(`Упражнений, которых нет в этой версии приложения: ${L.foreign.length}. Их записи сохранятся (и попадут в следующую копию), но показываться не будут.`);
  if (p.settings && p.settings.bad.length) warn.push(`В настройках копии испорчено: ${settingsBadText(p.settings.bad)} — их не возьмём, останутся здешние.`);
  const radio = (v, label, sum) => `<label class="po-opt"><input type="radio" name="jr-set" value="${v}"${p.choice === v ? ' checked' : ''}><span><b>${label}</b>${sum ? `<small>${esc(sum)}</small>` : ''}</span></label>`;
  const choice = p.settings && p.settings.differs ? `<fieldset class="po-set"><legend>${'Планы и настройки'}</legend>${radio('mine', 'Оставить мои', settingsSummary(S))}${radio('copy', 'Взять из копии', settingsSummary(p.settings.s))}</fieldset>` : '';
  return `<section class="j-restore" aria-labelledby="jr-h"><h2 id="jr-h" tabindex="-1">${made ? `${'Восстановить из копии от'} ${made}` : 'Восстановить из копии'}</h2>
    <p>${inCopy ? `В копии: ${inCopy}.` : 'В копии нет записей.'} ${'Журнал и замеры добавятся к записанным здесь — здешнее не сотрётся.'}</p>
    ${warn.map(w => `<p class="warn">${esc(w)}</p>`).join('')}${choice}
    <div class="j-restore-b"><button type="button" class="btn" id="jr-go">${'Восстановить'}</button><button type="button" class="btn btn-2" id="jr-cancel">${'Отмена'}</button></div></section>`;
}
function restoreApply() {
  const p = restorePending; if (!p) return;
  const pick = document.querySelector('input[name="jr-set"]:checked'), choice = pick ? pick.value : p.choice;
  restorePending = null;
  const r = restoreBackup(p.obj, {settings:choice});
  const parts = [];
  if (r.added) parts.push(`${'новых записей журнала —'} ${r.added}`);
  if (r.joined) parts.push(`${'записей, дополненных подходами из копии, —'} ${r.joined}`);
  if (r.body > 0) parts.push(`${'замеров —'} ${r.body}`);
  if (r.heart > 0) parts.push(`${'дней с пульсом —'} ${r.heart}`);
  if (r.settings) parts.push('планы и настройки — из копии');
  let text = parts.length ? `${'Восстановлено:'} ${parts.join(', ')}.` : 'Нового в копии нет — всё из неё уже есть.';
  if (p.obj.v >= 2 && p.settings && choice === 'mine') text += ' ' + 'Планы и настройки — здешние.';
  if (r.same) text += ` ${'Уже были здесь, без изменений:'} ${r.same}.`;
  if (r.conflicts.length) text += ` ${'Подходы в копии отличались от записанных здесь'} (${r.conflicts.length} ${plural(r.conflicts.length, 'день', 'дня', 'дней')}: ${r.conflicts.slice(0, 5).map(d => fmtDay(d, true)).join(', ')}${r.conflicts.length > 5 ? '…' : ''}) ${'— оставлены здешние.'}`;
  const drop = logDropText(r.drops); if (drop) text += ` ${'Пропущено:'} ${drop}.`;
  if (r.bodyDropped) text += ` ${'Пропущено значений замеров:'} ${r.bodyDropped}.`;
  LOG.msg = text;
  renderJournalKeep('#j-msg');
}
/* ---------- всплывающая подсказка для графиков ---------- */
const tipEl = document.createElement('div'); tipEl.className = 'tip'; tipEl.hidden = true; document.body.appendChild(tipEl);
function showTip(text, cx, cy) {
  tipEl.textContent = text; tipEl.hidden = false;
  const r = tipEl.getBoundingClientRect();
  tipEl.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, cx - r.width / 2)) + 'px';
  tipEl.style.top = Math.max(8, cy - r.height - 12) + 'px';
}
document.addEventListener('pointermove', e => {
  const sp = e.target.closest && e.target.closest('.spark');
  if (sp) {
    const pts = JSON.parse(sp.dataset.pts || '[]'); if (!pts.length) return;
    const b = sp.getBoundingClientRect(), vb = sp.viewBox.baseVal, sx = b.width / vb.width;
    const px = (e.clientX - b.left) / sx;
    let bi = 0; pts.forEach((p, i) => { if (Math.abs(p[0] - px) < Math.abs(pts[bi][0] - px)) bi = i; });
    const p = pts[bi], xl = sp.querySelector('.sp-x'), dot = sp.querySelector('.sp-dot');
    xl.setAttribute('x1', p[0]); xl.setAttribute('x2', p[0]); xl.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.setAttribute('visibility', 'visible');
    showTip(p[2], b.left + p[0] * sx, b.top + p[1] * (b.height / vb.height));
    return;
  }
  const c = e.target.closest && e.target.closest('[data-tip]');
  if (c) { const b = c.getBoundingClientRect(); showTip(c.dataset.tip, b.left + b.width / 2, b.top); return; }
  if (!tipEl.hidden) { tipEl.hidden = true; document.querySelectorAll('.spark .sp-x, .spark .sp-dot').forEach(n => n.setAttribute('visibility', 'hidden')); }
}, {passive:true});
document.addEventListener('pointerleave', () => { tipEl.hidden = true; });

/* ---------- действия журнала ---------- */
/* снаряд — в запись дня (по нему считается общий вес: гантели, гиря или штанга у румынской тяги) */
function markImpl(s, it) { if (!hasFreeWeights(it.ex)) return; const impl = itemImpl(it); if (impl) s.eq = impl; else delete s.eq; }
/* поля подхода в строке карточки: side — 'l' | 'r' в режиме Л/П, иначе null */
function rowFields(row, side) {
  const q = f => row.querySelector(side ? `[data-f="${f}"][data-side="${side}"]` : `[data-f="${f}"]:not([data-side])`);
  return {kgIn:q('kg'), rIn:q('reps')};
}
/* Проверка вписанного подхода — одна для таблицы в карточке и для экрана тренировки (Руслан 5: в таблице «−20» уходило
   подходом без веса, «0» на штанге принимался, «2,5» повтора записывались, на «абв» кнопка молчала). Вес — число не меньше
   нуля («12,5» и «12.5»), у снаряда с весом — больше нуля, пустое у доп. веса — без веса; повторы — целое больше нуля,
   секунды и метры — число больше нуля. Вписано в выбранных единицах — в ответе килограммы. Неверное — {bad:'kg' | 'reps', msg}. */
const strictNum = v => { const s = String(v ?? '').trim().replace(',', '.'); return /^\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
function readSetInput(kgRaw, repsRaw, ex) {
  const lt = loadType(ex), kRaw = String(kgRaw ?? '').trim(), reps = strictNum(repsRaw), kg = lt === 'none' || !kRaw ? null : strictNum(kRaw);
  if (lt !== 'none' && kRaw && kg === null) return {bad:'kg', msg:/^[−–-]\s*\d/.test(kRaw) ? 'Вес не может быть меньше нуля.' : 'Введите вес числом, например 12,5.'};
  if (lt === 'kg' && (kg === null || kg <= 0)) return {bad:'kg', msg:'Укажите фактический вес снаряда.'};
  if (reps === null || reps <= 0 || (!ex.kind && !Number.isInteger(reps))) return {bad:'reps', msg:ex.kind ? 'Укажите фактический результат числом больше нуля.' : 'Укажите целое количество выполненных повторов.'};
  return {kg:kg == null ? null : fromU(kg), reps:Math.round(reps * 10) / 10};
}
/* значения полей строки (пустое — подсказка в поле, если в ней число); bad — поле с ошибкой, msg — что не так */
function readFields({kgIn, rIn}, ex) {
  const ph = el => el && /\d/.test(el.placeholder || '') ? el.placeholder : '';
  const r = readSetInput(kgIn ? (kgIn.value !== '' ? kgIn.value : ph(kgIn)) : '', rIn.value !== '' ? rIn.value : ph(rIn), ex);
  return r.bad ? {bad:r.bad === 'kg' ? kgIn : rIn, msg:r.msg} : r;
}
/* сообщение о неверном вводе — под полями подхода, поле отмечено для диктора (aria-invalid и описание); ввод в поле его убирает */
function rowErr(row, inp, msg) {
  rowErrClear(row);
  const id = 'lt-err-' + inp.id;
  row.insertAdjacentHTML('beforeend', `<p class="lt-err" id="${id}" role="alert">${esc(msg)}</p>`);
  inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', id);
}
function rowErrClear(row) {
  if (!row) return;
  row.querySelectorAll('.lt-err').forEach(p => p.remove());
  row.querySelectorAll('[aria-invalid]').forEach(i => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
}
/* sure — вес уже подтвердили («Записать» в вопросе о весе) */
function tickSet(btn, sure) {
  const id = btn.dataset.tick, row = btn.closest('.lt-r');
  let k = +btn.dataset.k;
  const it = plan.items.find(x => x.ex.id === id);
  const lt = loadType(it.ex), lr = row.classList.contains('lt-lr');
  const F = (lr ? ['l', 'r'] : [null]).map(side => rowFields(row, side));
  const s = todaySession(id, true);
  /* строка пустая, а подход под этим номером уже записан — другой вкладкой (Ксения 3): не снимать его, а записать этот
     следующим номером */
  const other = s.s[k] && !row.classList.contains('done');
  if (other) { while (s.s[k]) k++; }
  if (s.s[k]) {
    if (kgAsk[id] && kgAsk[id].k === k) dropKgAsk(id, row.closest('.c-log'));
    s.s[k] = null; cleanToday(id);
    row.classList.remove('done'); btn.setAttribute('aria-pressed', 'false');
    for (const f of F) { if (f.kgIn) f.kgIn.value = ''; f.rIn.value = ''; }
    carryKgBox(row.closest('.c-log'));
    logTouch(id); refreshHist(id); refreshSug(row.closest('.c-log'), it); return;
  }
  const got = F.map(f => readFields(f, it.ex)), bad = got.find(g => g.bad);
  if (bad) {
    cleanToday(id);
    rowErr(row, bad.bad, bad.msg);
    bad.bad.focus(); bad.bad.classList.add('need'); setTimeout(() => bad.bad.classList.remove('need'), 1600);
    return;
  }
  rowErrClear(row);
  /* неправдоподобный вес или повторы — не записывать, переспросить в строке */
  const q = !sure && setDoubt(it, got.map(g => g.kg), got.map(g => g.reps), k);
  if (q) { cleanToday(id); askKg(row, it, k, q, {side:lr ? (q.f === 'reps' ? (got[1].reps > got[0].reps ? 'r' : 'l') : got[1].kg > got[0].kg ? 'r' : 'l') : null}); return; }
  dropKgAsk(id, row.closest('.c-log'));
  while (s.s.length < k) s.s.push(null);
  s.s[k] = lr ? makeSidedSet([got[0].kg, got[0].reps], [got[1].kg, got[1].reps], it.ex) : [got[0].kg, got[0].reps];
  markSession(s, it, it.rx.circ ? (it.rounds || it.rx.sets) : it.rx.sets, k); markActive(s.d);
  F.forEach((f, i) => { if (f.kgIn) f.kgIn.value = got[i].kg != null ? fmtKg(got[i].kg) : ''; f.rIn.value = got[i].reps; });
  row.classList.add('done'); btn.setAttribute('aria-pressed', 'true');
  carryKgBox(row.closest('.c-log'));
  logTouch(id); refreshHist(id); refreshSug(row.closest('.c-log'), it);
  if (other) { const card = row.closest('.card'); if (card) refreshCard(card); }
  const total = it.rx.circ ? 0 : it.rx.sets;
  const doneN = s.s.filter(Boolean).length;
  if (!it.rx.circ) {
    const r = restAfter(it.rx, doneN - 1);
    if (r) startRest(r, doneN >= total ? 'Отдых перед следующим упражнением' : it.rx.static && doneN % 3 === 0 ? `Отдых после серии ${doneN / 3}` : `Отдых после подхода ${doneN}`);
  }
}
/* правка отмеченного подхода; sure — вес уже подтвердили */
function editSet(inp, sure) {
  const row = inp.closest('.lt-r'); if (!row || !row.classList.contains('done')) return;
  const box = inp.closest('.c-log'), id = box.dataset.log, k = +row.dataset.k, ex = EXI[id];
  const s = todaySession(id, false); if (!s || !s.s[k]) return;
  const x = s.s[k], side = inp.dataset.side, isKg = inp.dataset.f === 'kg';
  /* те же правила ввода, что у новой записи (readSetInput): неверное — запись прежняя, сообщение под полями */
  const chk = readSetInput(isKg ? inp.value : '1', isKg ? '1' : inp.value, ex);
  if (chk.bad) { rowErr(row, inp, chk.msg); return; }
  rowErrClear(row);
  const v = isKg ? chk.kg : chk.reps;
  /* неправдоподобный вес или повторы — запись прежняя, вопрос в строке */
  if (v > 0 && !sure) {
    const it = (plan && plan.items && plan.items.find(y => y.ex.id === id)) || {ex, rx:{}}, q = isKg ? kgDoubt(it, [v], k) : repsDoubt(it, [v], [x[0]]);
    if (q) { askKg(row, it, k, q, {side, edit:true}); return; }
  }
  if (kgAsk[id] && kgAsk[id].k === k) dropKgAsk(id, box);
  markUnit(s, k);
  if (side) {
    /* Л/П: правится одна сторона, основные поля — снова слабая сторона, отдых остаётся */
    const sd = setSides(x, ex), l = sd ? [...sd.l] : [x[0], x[1]], r = sd ? [...sd.r] : [x[0], x[1]], p = side === 'l' ? l : r;
    if (inp.dataset.f === 'kg') p[0] = v != null && v >= 0 ? v : null;
    else if (v != null && v > 0) p[1] = Math.round(v * 10) / 10; else return;
    const nx = makeSidedSet(l, r, ex, x[2]); if (!nx) return;
    s.s[k] = nx;
  } else {
    if (inp.dataset.f === 'kg') x[0] = v != null && v >= 0 ? v : null;
    else if (v != null && v > 0) x[1] = Math.round(v * 10) / 10; else return;
    /* одно значение на обе стороны: прежние стороны больше не верны */
    if (x.length > 3) x.length = restField(x[2]) ? 3 : 2;
  }
  logTouch(id); refreshHist(id);
}
/* перерисовать запись подходов, не теряя введённого в неотмеченных строках; drop — номер убранной строки */
function renderLogBox(box, it, drop = -1) {
  const typed = [...box.querySelectorAll('.lt-r:not(.done) .lt-in')].filter(i => i.value !== '' && +i.closest('.lt-r').dataset.k !== drop).map(i => [i.id, i.value]);
  box.innerHTML = logRows(it).html;
  let kg = null;
  for (const [id, v] of typed) {
    const inp = box.querySelector(`[id="${id}"]`);
    if (!inp || inp.closest('.lt-r').classList.contains('done')) continue;
    inp.value = v; if (!kg && inp.dataset.f === 'kg') kg = inp;
  }
  carryKgBox(box);
  if (kg) updatePairTotal(kg);
  const card = box.closest('.card'); if (card) syncCardLog(card);
}
/* подход в план тренировки (в памяти: при новой сборке плана число подходов снова по плану, записанное остаётся);
   возвращает номер новой строки */
function growSets(it) {
  const n = logRowCount(it);
  delete setArm[it.ex.id];
  it.extra = (it.extra || 0) + 1;
  it.rx.sets = Math.max(it.rx.sets, n + 1);
  if (it.rx.circ) it.rounds = Math.max(it.rounds || 0, n + 1);
  return n;
}
/* последний подход — из записи дня (и цель записи, число подходов по плану) и из плана тренировки; минимум один.
   Возвращает номер убранной строки (−1 — убирать нечего) и изменилась ли запись дня */
function dropLastSet(it) {
  const id = it.ex.id, n = logRowCount(it);
  delete setArm[id];
  if (n <= 1) return {k:-1, changed:false};
  const k = n - 1, s = todaySession(id, false);
  let changed = false;
  if (s) {
    if (s.s.length > k) { s.s.length = k; changed = true; }
    if (s.target > k) { s.target = k; changed = true; }
    cleanToday(id);
  }
  it.rx.sets = Math.max(1, Math.min(it.rx.sets, k));
  if (it.rx.circ && it.rounds) it.rounds = Math.max(1, Math.min(it.rounds, k));
  it.extra = Math.max(0, (it.extra || 0) - 1);
  return {k, changed};
}
/* «+»: новая строка, фокус на её первом поле */
function addSet(id, box) {
  const it = plan && plan.items && plan.items.find(x => x.ex.id === id); if (!it || !box) return;
  const n = growSets(it);
  renderLogBox(box, it);
  const inp = box.querySelector(`.lt-r[data-k="${n}"] .lt-in`); if (inp) inp.focus();
}
/* «−»: последний подход. Пустой убирается сразу; отмеченный или с цифрами — только после «Убрать» в его строке.
   Повторное нажатие «−» (двойное касание) ничего не убирает — фокус на «Оставить». */
function askRemoveSet(id, box) {
  const it = plan && plan.items && plan.items.find(x => x.ex.id === id); if (!it || !box) return;
  const n = logRowCount(it); if (n <= 1) return;
  if (kgAsk[id]) dropKgAsk(id, box);
  const row = box.querySelector(`.lt-r[data-k="${n - 1}"]`);
  const armed = row && row.querySelector('.lt-cf');
  if (armed) { armed.querySelector('[data-delno]').focus(); return; }
  const filled = row && (row.classList.contains('done') || [...row.querySelectorAll('.lt-in')].some(i => i.value.trim() !== ''));
  if (!filled) { removeSet(id, box); return; }
  setArm[id] = n - 1;
  row.classList.add('lt-arm'); row.insertAdjacentHTML('beforeend', setArmHtml(it, n, row.classList.contains('done')));
  row.querySelector('[data-delno]').focus();
}
/* «Убрать» (или «−» у пустой строки): строка уходит, фокус остаётся на «−» (у последнего подхода — на «+») */
function removeSet(id, box) {
  delete setArm[id];
  const it = plan && plan.items && plan.items.find(x => x.ex.id === id); if (!it || !box) return;
  const {k, changed} = dropLastSet(it); if (k < 0) return;
  renderLogBox(box, it, k);
  if (changed) logTouch(id, true);
  refreshHist(id);
  const f = box.querySelector('[data-delset]:not([disabled])') || box.querySelector('[data-addset]'); if (f) f.focus();
}
/* «Оставить» или Esc: подтверждение закрывается, введённое в строке остаётся */
function keepSet(id, box) {
  delete setArm[id];
  if (!box) return;
  box.querySelectorAll('.lt-r.lt-arm').forEach(r => { r.classList.remove('lt-arm'); const c = r.querySelector('.lt-cf'); if (c) c.remove(); });
  const b = box.querySelector('[data-delset]'); if (b) b.focus();
}
/* «Л/П отдельно» в карточке: запоминается для упражнения, таблица перерисовывается */
function toggleLr(btn) {
  const id = btn.dataset.lr, ex = EXI[id]; if (!ex) return;
  lrSet(ex, !lrOn(ex));
  const box = btn.closest('.c-log'), it = plan && plan.items && plan.items.find(x => x.ex.id === id);
  if (box && it) { box.innerHTML = logRows(it).html; const card = box.closest('.card'); if (card) syncCardLog(card); const b = box.querySelector(`[data-lr="${id}"]`); if (b) b.focus(); }
}
/* «×2 = 40 кг» под таблицей обновляется при вводе веса */
function updatePairTotal(inp) {
  const box = inp.closest('.c-log'), x2 = box && box.querySelector('.lt-x2 b'); if (!x2) return;
  const n = +box.querySelector('.lt-x2').dataset.n, v = parseKg(inp.value !== '' ? inp.value : inp.placeholder);
  x2.textContent = pairTotalText(n, v);
}
function refreshHist(id) {
  const card = document.querySelector(`.card[data-ex="${id}"]`); if (!card) return;
  const h = card.querySelector('.c-hist'); if (h && !h.hidden) h.innerHTML = histHtml(EXI[id]);
  const hb = card.querySelector('[data-hist] small'); if (hb) { const n = histCount(id); hb.textContent = n || ''; }
  logBarUpdate(card);
  const tab = document.querySelector('[data-view="journal"] small'); if (tab) tab.textContent = journalDays() || '';
}
/* ---------- «Удалить запись» (Галина 3) ----------
   Первое нажатие — переспрос: надпись «Точно удалить?», имя кнопки для диктора — «Точно удалить запись за 16 ноя?», фокус на месте;
   через 4 с без ответа — снова «Удалить». Второе — удаляет, и на месте записи на 10 с — «Удалена запись за … · Вернуть»,
   фокус на «Вернуть». Время вышло — строка уходит, фокус — на заголовок упражнения (в журнале) или «История» (в карточке).
   Пока фокус на «Точно удалить?» или «Вернуть», время не идёт: отсчёт начинается заново, когда фокус уйдёт — диктору и
   клавиатуре нужно время (решение владельца по 4.107, вопрос 3). */
const UNDO_MS = 10000, ARM_MS = 4000;
const undoLive = u => u && u.until > Date.now() ? u : null;
function undoFor(id) { const u = undoLive(LOG.undo); return u && u.id === id ? u : null; }
function undoLineHtml(text, attr, id) { return `<li class="sw-gone h-gone"><span id="${id}">${text}</span>${undoBtn(attr, id)}</li>`; }
/* надпись — коротко («Точно удалить?»: длинная не помещается в строке истории), имя для диктора — весь вопрос с датой */
function whileFocused(sel, ms, fn, hold) {
  const tick = () => {
    const b = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (b && b.isConnected && document.activeElement === b) {
      if (hold) hold(Infinity);
      b.addEventListener('blur', () => { if (hold) hold(Date.now() + ms); setTimeout(tick, ms); }, {once:true});
      return;
    }
    fn();
  };
  setTimeout(tick, ms);
}
function armDelete(btn, ask, label) {
  btn.classList.add('armed'); btn.textContent = 'Точно удалить?'; btn.setAttribute('aria-label', ask); keepSay(ask);
  whileFocused(btn, ARM_MS, () => { if (btn.isConnected && btn.classList.contains('armed')) { btn.classList.remove('armed'); btn.textContent = 'Удалить'; btn.setAttribute('aria-label', label); } });
}
function focusUndo(sel) { const b = document.querySelector(sel); if (b) b.focus(); }
function undoExpire(fn, sel, u) { whileFocused(sel, UNDO_MS + 50, fn, u ? t => { u.until = t; } : null); }
/* строка «Вернуть» уходит без перерисовки; фокус с неё — на fallback */
function undoRepaint(sel, fallbackSel) {
  const b = document.querySelector(sel); if (!b) return;
  const had = document.activeElement === b, li = b.closest('li'); if (li) li.remove();
  if (had) { const f = document.querySelector(fallbackSel); if (f) f.focus(); }
}
function deleteSession(btn) {
  const id = btn.dataset.del, d = btn.dataset.d, when = fmtDay(d, true);
  if (!btn.classList.contains('armed')) { armDelete(btn, `Точно удалить запись за ${when}?`, `Удалить запись за ${when}`); return; }
  const ss = LOG.data[id]; if (!ss) return;
  const i = ss.findIndex(x => x.d === d); if (i < 0) return;
  const s = ss[i];
  ss.splice(i, 1); if (!ss.length) delete LOG.data[id];
  LOG.undo = {id, s, until:Date.now() + UNDO_MS};
  logTouch(id, true);
  histRepaint(id);
  focusUndo(`[data-hist-undo="${id}"]`);
  undoExpire(() => { if (LOG.undo && LOG.undo.s === s) { LOG.undo = null; undoRepaint(`[data-hist-undo="${id}"]`, S.view === 'journal' ? `[data-jex="${id}"] > summary` : `.card[data-ex="${id}"] [data-hist]`); } }, `[data-hist-undo="${id}"]`, LOG.undo);
}
function histUndo(id) {
  const u = undoFor(id); if (!u) return;
  LOG.undo = null;
  LOG.data[id] = mergeSessions(LOG.data[id] || [], [u.s]);
  logTouch(id, true);
  histRepaint(id);
  focusUndo(`[data-del="${id}"][data-d="${u.s.d}"]`);
  const m = $('#j-msg'); if (m && S.view === 'journal') m.textContent = `Запись за ${fmtDay(u.s.d, true)} возвращена.`;
}
/* история упражнения после удаления или возврата: в журнале — с раскрытым упражнением, в карточке — открытая история */
function histRepaint(id) {
  if (S.view === 'journal') { LOG.openId = id; const y = window.scrollY; renderJournal(); window.scrollTo(0, y); return; }
  const card = document.querySelector(`.card[data-ex="${id}"]`); if (card) refreshCard(card);
}

document.addEventListener('click', e => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.tick) { tickSet(t); return; }
  if (t.dataset.lr) { toggleLr(t); return; }
  if (t.dataset.addset) { addSet(t.dataset.addset, t.closest('.c-log')); return; }
  if (t.dataset.delset) { askRemoveSet(t.dataset.delset, t.closest('.c-log')); return; }
  if (t.dataset.delyes) { removeSet(t.dataset.delyes, t.closest('.c-log')); return; }
  if (t.dataset.delno) { keepSet(t.dataset.delno, t.closest('.c-log')); return; }
  if (t.dataset.kgyes) { kgYes(t.dataset.kgyes, t.closest('.c-log')); return; }
  if (t.dataset.kgfix) { kgFix(t.dataset.kgfix, t.closest('.c-log')); return; }
  if (t.dataset.kgplan) { planUpApply(t.dataset.kgplan); return; }
  if (t.dataset.hist) {
    const card = t.closest('.card'), h = card.querySelector('.c-hist');
    h.hidden = !h.hidden; t.setAttribute('aria-expanded', String(!h.hidden));
    if (!h.hidden) h.innerHTML = histHtml(EXI[card.dataset.ex]);
    return;
  }
  if (t.dataset.del) { deleteSession(t); return; }
  if (t.dataset.histUndo) { histUndo(t.dataset.histUndo); return; }
  if (t.id === 'jr-go') { restoreApply(); return; }
  if (t.id === 'jr-cancel') { restorePending = null; LOG.msg = 'Восстановление отменено — ничего не изменилось.'; renderJournalKeep('#j-msg'); return; }
  if (t.dataset.view) { S.view = t.dataset.view; saveSettings(); renderSetup(); renderPlan(); window.scrollTo({top:0}); return; }
  if (t.dataset.units) { S.units = t.dataset.units === 'lb' ? 'lb' : 'kg'; saveSettings(); renderJournal(); const b = document.querySelector(`[data-units="${S.units}"]`); if (b) b.focus(); return; }
  if (t.id === 'exp-csv') { exportLog('csv'); return; }
  if (t.id === 'exp-json') { exportLog('json'); return; }
});
document.addEventListener('change', e => {
  if (e.target.id === 'imp-file' && e.target.files && e.target.files[0]) { importLog(e.target.files[0]); e.target.value = ''; }
  else if (e.target.classList && e.target.classList.contains('lt-in')) editSet(e.target);
});
document.addEventListener('input', e => {
  if (!e.target.classList || !e.target.classList.contains('lt-in')) return;
  if (e.target.getAttribute('aria-invalid')) rowErrClear(e.target.closest('.lt-r')); /* исправляют — сообщение об ошибке уходит */
  if (e.target.dataset.f === 'kg') logKgInput(e.target);
});
document.addEventListener('keydown', e => {
  const box = e.key === 'Escape' && e.target.closest && e.target.closest('.c-log');
  if (box && box.querySelector('.lt-kq')) { e.preventDefault(); kgFix(box.dataset.log, box); return; }
  if (box && box.querySelector('.lt-cf')) { e.preventDefault(); keepSet(box.dataset.log, box); return; }
  if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('lt-in')) {
    e.preventDefault();
    const row = e.target.closest('.lt-r');
    if (row.classList.contains('done')) { editSet(e.target); return; }
    const ins = [...row.querySelectorAll('.lt-in')];
    const i = ins.indexOf(e.target);
    if (i < ins.length - 1) ins[i + 1].focus(); else row.querySelector('.lt-ok').click();
  }
});
