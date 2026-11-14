/* ===================== ЖУРНАЛ ===================== */
/* Хранилище: в опубликованной версии — аккаунт (db, личный раздел пользователя),
   в офлайн-файле — браузер. Формат: LOG.data[exId] = [{d:'2026-10-05', wk?:1, eq?:'db', s:[[кг|null, повторы, отдых?, стороны?] | null, …]}, …].
   Третье поле подхода — необязательное: фактический отдых после подхода, целые секунды (пишет режим тренировки). Старые
   записи без него читаются как раньше, прежние версии приложения его просто не видят. Четвёртое — левая и правая
   сторона отдельно {l:[кг, повторы], r:[кг, повторы]} (переключатель «Л/П отдельно»); тогда отдых может быть пустым
   (null), а основные поля — слабая сторона. eq — снаряд (гантели, гиря, штанга) у упражнений с гантелями или гирей:
   по нему считается общий вес. Подробно — 13a-sets.js. */
const LOG_KEY = 'podhod.log.v1';
const LOG = {mode:'connecting', data:{}, col:null, pending:{}, writing:{}, again:{}, timers:{}, err:'', dl:null, canExport:false};
const WEIGHTED = new Set(['db', 'bb', 'kb', 'cable', 'smith', 'legpress', 'legext', 'legcurl', 'pecdeck', 'hack', 'chestpress', 'shoulderpress', 'leverrow', 'tbar', 'abductor', 'calfseat', 'calfstand']);
const LOWER_G = new Set(['quads', 'hams', 'glutes', 'calves']);
const MACHINE = new Set(['cable', 'smith', 'legext', 'legcurl', 'pecdeck', 'chestpress', 'shoulderpress', 'leverrow', 'abductor', 'calfseat', 'calfstand', 'gravitron', 'hack', 'tbar']);
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function dayKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const todayKey = () => dayKey(new Date());
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
const fmtKg = v => isLb() && kgEntered(v) ? fmtU1(toU(v)) : fmtU(toU(v));
const fmtKgR = (v, st = isLb() ? 1 : .5) => fmtU(Math.round(toU(v) / st) * st);
/* вес с подписью: «62,5 кг», «135 lb» */
const fmtW = v => fmtKg(v) + ' ' + wUnit();
/* вписанный вес (в выбранных единицах) — в килограммах */
const parseKg = v => { const n = parseNum(v); return n == null ? null : fromU(n); };
/* «1–2,5 кг» или «2,5–5 фнт»: пара чисел для килограммов и для фунтов */
const unitRange = (kg, lb) => { const [a, b] = isLb() ? lb : kg; return `${fmtU(a)}–${fmtU(b)} ${wUnit()}`; };

function validSessions(ss) {
  return Array.isArray(ss) && ss.every(x => x && typeof x.d === 'string' && /^\d{4}-\d\d-\d\d$/.test(x.d) && Array.isArray(x.s));
}
function logLoadLocal() {
  try {
    const s = JSON.parse(localStorage.getItem(LOG_KEY) || 'null');
    if (s && typeof s === 'object') for (const [k, v] of Object.entries(s)) if (EXI[k] && validSessions(v)) LOG.data[k] = v;
  } catch (e) {}
}
function logSaveLocal() { try { localStorage.setItem(LOG_KEY, JSON.stringify(LOG.data)); } catch (e) {} }

/* объединение двух историй: по дате; при совпадении берём запись с большим числом подходов */
function mergeSessions(a, b) {
  const by = new Map();
  for (const x of a || []) by.set(x.d, x);
  for (const x of b || []) {
    const cur = by.get(x.d);
    if (!cur || x.s.filter(Boolean).length > cur.s.filter(Boolean).length) by.set(x.d, x);
  }
  return [...by.values()].sort((p, q) => p.d < q.d ? -1 : 1).slice(-150);
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
    s = {d, s:[]};
    if (S.mode === 'program') s.wk = S.week;
    ss.push(s); ss.sort((a, b) => a.d < b.d ? -1 : 1);
    if (ss.length > 150) ss.splice(0, ss.length - 150);
  }
  return s;
}
function pastSessions(id) { const d = todayKey(); return (LOG.data[id] || []).filter(x => x.d < d && x.s.some(Boolean)); }
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
const e1rm = (kg, reps) => kg * (1 + Math.min(reps, 12) / 30);

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
  const ex = it.ex, lt = loadType(ex), all = pastSessions(ex.id), past = all.filter(s => (s.fmt === 'static') === !!it.rx.static);
  const [lo, hi] = parseRange(it.rx.reps), rp = repsPlanOf(it.rx.reps);
  /* цель подхода k (с нуля): [нижняя, верхняя]; у пирамиды повторов — своё число подхода */
  const tgt = k => { if (!rp) return [lo, hi]; const v = rp[Math.min(k, rp.length - 1)]; return [v, v]; };
  const unit = ex.kind === 'time' ? ' с' : ex.kind === 'dist' ? ' м' : '';
  const week = S.mode === 'program' ? WEEKS[S.week - 1] : null;
  const step = stepFor(it);
  const res = {tone:'new', kg:null, reps:[], text:'', prev:null};
  /* вес по плану (свой план, план тренера) — цель вместо подсказки по прогрессии */
  if (it.rx.kgPlan && lt !== 'none') {
    const prev = past[past.length - 1] || null, ps = prev ? prev.s.filter(Boolean) : [];
    res.tone = 'plan'; res.kgs = it.rx.kgPlan; res.kg = it.rx.kgPlan[0]; res.prev = prev;
    const what = lt === 'assist' ? 'Противовес по плану' : lt === 'extra' ? 'Доп. вес по плану' : 'Вес по плану';
    res.text = `${what}: ${planKgText(it.rx.kgPlan)} ${wUnit()}.` + (rp ? ` Повторы по плану: ${rp.join(' / ')}.` : '') + (ps.length ? ` В прошлый раз: ${ps.map(x => (x[0] ? fmtKg(x[0]) + '×' : '') + x[1]).join(', ')}.` : '');
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
  if (allTop) {
    if (lt === 'kg' && work) {
      res.tone = 'up'; res.kg = stepUp(work, step, gridFor(it)); res.reps = sets.map((x, i) => tgt(i)[0]);
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
  if (top.every(i => sets[i][1] >= tgt(i)[1])) {
    const nw = stepUp(W, step, gridFor(it));
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
  const goal = top.map(i => { const [a, b] = tgt(i), r = sets[i][1]; return r < a ? a : Math.min(b, r + 1); });
  top.forEach((i, j) => { res.reps[i] = goal[j]; });
  const same = goal.every(v => v === goal[0]);
  res.tone = 'same'; res.kg = res.kgs[0];
  res.text = `${topText} — в следующий раз доберите до ${same ? goal[0] : goal.join(', ')}${one || !same ? '' : ' в каждом из них'}. ${rest}`;
  return res;
}
/* Сегодня уже записаны подходы, а прошлых тренировок нет: «Сегодня: 3 из 4. Следующий — с тем же весом (50 кг).»;
   все подходы сделаны — «упражнение выполнено». Нет записей сегодня — '' (подсказка первой записи) */
function todayNote(it, lt) {
  const t = todaySession(it.ex.id, false), done = t ? t.s.filter(Boolean) : [];
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
  const tset = today ? today.s : [];
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
  return {sg, html:`<p class="sug sug-${sg.tone}"><b aria-hidden="true">${SUG_ICON[sg.tone]}</b><span>${esc(sg.text)}</span></p>
    ${logFoldBar(it, n, doneN)}
    <div class="lt-fold" id="lt-${ex.id}"><div class="lt${lt === 'none' ? ' lt-nokg' : ''}" role="group" aria-label="Запись подходов">
      <div class="lt-h"><span>№</span><span>Прошлый раз</span>${lt === 'none' ? '' : `<span title="${wl.full}">${wl.short}</span>`}<span>${repLabel(ex)}</span><span></span></div>
      ${rows}
    </div>
    <div class="lt-foot">${setStepHtml(it, n)}${lrBtn}${perSideNote}${x2}${it.rx.circ ? '<span>строка — один круг</span>' : ''}</div></div>`};
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
  if (it.rx.kgPlan) return k => planKg(it.rx, k);
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
  const ask = why => ({kg, text:`${why} Записать ${fmtKg(kg)} ${wUnit()}?`});
  if (ref != null) return kg >= 2 * ref && kg - ref >= 5 ? ask(last ? `Это намного больше, чем в прошлый раз (${fmtKg(ref)} ${wUnit()}).` : `Это намного больше, чем сегодня в других подходах (${fmtKg(ref)} ${wUnit()}).`) : null;
  const kind = kgLimitOf(it);
  return kg > KG_LIMIT[kind] ? ask(KG_LIMIT_NOTE[kind]) : null;
}
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
  kgAsk[id] = {k, text:q.text, side:extra.side || null, edit:!!extra.edit};
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
  return {row, inp:rowFields(row, row.classList.contains('lt-lr') ? a.side || 'l' : null).kgIn};
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
  const m = metricOf(ex);
  if (loadType(ex) !== 'kg' || ex.kind) return m;
  const tops = ss.map(topSet).filter(Boolean);
  if (tops.length < 2 || !tops.every(t => t.w === tops[0].w)) return m;
  const w = tops[0].w;
  return {name:`Повторы с ${fmtKg(w)} ${wUnit()}`, unit:'повт.', bare:true, f:s => { const t = topSet(s); return t && t.w === w ? t.r : null; }};
}
/* Сводка упражнения в строке журнала. С весом: крупно — рабочий вес и лучшие повторы с ним в последней записи, мельче
   и с подписью — расчётный максимум; изменение с первой записи — по весу, а при том же весе — по повторам («+3 повт.»,
   а не «0 %»: с одними гантелями прогресс — это повторы). Без веса — как раньше: значение метрики и изменение в процентах. */
function journalVal(ex, ss) {
  const m = metricOf(ex), tops = loadType(ex) === 'kg' && !ex.kind ? ss.map(topSet).filter(Boolean) : [];
  if (!tops.length) {
    const vals = ss.map(s => m.f(s)).filter(v => v != null), firstV = vals[0], lastV = vals[vals.length - 1];
    const ch = vals.length > 1 && firstV ? Math.round((lastV / firstV - 1) * 100) : null;
    return `<span class="j-val">${lastV != null ? metricFmt(m)(lastV) : '—'}<small>${m.unit}</small>${ch != null ? `<em class="${ch > 0 ? 'pos' : ch < 0 ? 'neg' : ''}">${ch > 0 ? '+' : ''}${ch}%</em>` : ''}</span>`;
  }
  const a = tops[0], b = tops[tops.length - 1], e = [...ss].reverse().map(m.f).find(v => v != null);
  const chip = (d, u, w) => `<em class="${d > 0 ? 'pos' : 'neg'}">${d > 0 ? '+' : '−'}${w ? fmtKg(Math.abs(d)) : Math.abs(d)} ${u}</em>`;
  const ch = tops.length < 2 ? '' : b.w !== a.w ? chip(b.w - a.w, wUnit(), true) : b.r !== a.r ? chip(b.r - a.r, 'повт.') : '';
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
/* подходы записи и её общий вес второй строкой (если есть внешний вес) */
function histSets(ex, s) {
  const t = sessionTonnage(ex, s);
  return `${setsText(s.s, ex)}${t > 0 ? `<small class="h-ton">${'общий вес ' + fmtTon(t) + ' ' + wUnit()}</small>` : ''}`;
}
function histHtml(ex) {
  const ss = (LOG.data[ex.id] || []).filter(x => x.s.some(Boolean));
  if (!ss.length) return `<p class="h-empty">Записей пока нет. Отметьте подходы выше — здесь появится история и график.</p>${variantHistNote(ex)}`;
  const m = histMetric(ex, ss);
  const pts = ss.map(s => ({d:s.d, v:m.f(s)})).filter(p => p.v != null).slice(-24);
  const best = pts.length ? Math.max(...pts.map(p => p.v)) : null;
  const rows = ss.slice(-6).reverse().map(s => `<li><span class="h-d">${fmtDay(s.d, true)}${s.wk ? `<small>нед. ${s.wk}</small>` : ''}${s.fmt === 'static' ? '<small>статодинамика</small>' : ''}</span>
    <span class="h-s">${histSets(ex, s)}</span>
    <button type="button" class="h-del" data-del="${ex.id}" data-d="${s.d}" aria-label="Удалить запись за ${fmtDay(s.d, true)}">Удалить</button></li>`).join('');
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
function statusHtml() {
  const m = LOG.mode;
  const t = m === 'cloud' ? 'Записи сохраняются в вашем аккаунте и доступны на любом устройстве, где вы открываете эту страницу.'
    : m === 'connecting' ? 'Подключаю хранилище записей…'
    : 'Записи хранятся в этом браузере. Делайте резервную копию, чтобы перенести журнал на другое устройство или не потерять его при очистке браузера.';
  return `<span class="ls-dot ls-${m}" aria-hidden="true"></span><span>${LOG.err ? esc(LOG.err) + ' Делайте резервную копию, чтобы не потерять записи.' : t}</span>`;
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
  const days = Object.values(by).sort((a, b) => a.d < b.d ? 1 : -1).slice(0, limit);
  if (!days.length) return '';
  return `<div class="j-days"><p class="lb-h">${'Последние тренировки · общий вес'}</p><ul>${days.map(x => `<li><span class="j-dd">${fmtDay(x.d, true)}</span><span class="j-dn">${x.ex} ${plural(x.ex, 'упражнение', 'упражнения', 'упражнений')} · ${x.sets} ${plural(x.sets, 'подход', 'подхода', 'подходов')}${heartDayHtml(x.d)}</span><b class="j-dt">${x.t > 0 ? fmtTon(x.t) + `<small>${wUnit()}</small>` : '—'}</b></li>`).join('')}</ul></div>`;
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
  const entries = Object.entries(LOG.data).map(([id, ss]) => [id, ss.filter(x => x.s.some(Boolean))]).filter(([id, ss]) => EXI[id] && ss.length);
  const days = journalDays();
  const sets = entries.reduce((a, [, ss]) => a + ss.reduce((b, x) => b + x.s.filter(Boolean).length, 0), 0);
  const last = entries.reduce((m, [, ss]) => ss[ss.length - 1].d > m ? ss[ss.length - 1].d : m, '');
  const byDays = trainingDays();
  entries.sort((a, b) => a[1][a[1].length - 1].d < b[1][b[1].length - 1].d ? 1 : -1);
  const tools = `<div class="j-tools">
      ${LOG.canExport ? `<button type="button" class="btn btn-2" id="exp-json">Полная копия (JSON)</button><button type="button" class="btn btn-2" id="exp-csv">Журнал для Excel</button><button type="button" class="btn btn-2" id="exp-body">Замеры для Excel</button>` : ''}
      <label class="btn btn-2" for="imp-file">Восстановить из копии</label><input type="file" id="imp-file" accept=".json,application/json" hidden>
    </div>${unitsHtml()}<p class="p-hint" id="j-msg" role="status"></p>
    <p class="p-hint">Полная копия — настройки, инвентарь, журнал и замеры одним файлом: перенесёт всё на другой телефон или вернёт после очистки браузера.</p>`;
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
  if (!entries.length) {
    html += `<div class="empty"><h2>Записей пока нет</h2><p>Откройте план и отмечайте подходы в карточках упражнений: вес и повторы сохранятся здесь, а планировщик начнёт подсказывать, когда прибавлять вес.</p><button type="button" class="btn" data-view="plan">Перейти к плану</button></div>`;
  } else {
    html += `<ul class="j-list">${entries.map(([id, ss]) => {
      const ex = EXI[id];
      const lastS = ss[ss.length - 1];
      return `<li class="j-row">
        <details>
          <summary>
            <span class="j-name">${esc(ex.name)}<small>${GN[ex.g]} · ${ss.length} ${plural(ss.length, 'запись', 'записи', 'записей')} · ${fmtDay(lastS.d, true)}</small></span>
            ${journalVal(ex, ss)}
          </summary>
          <div class="j-body">${histHtml(ex).replace(/<p class="h-more">.*?<\/p>/, '')}${ss.length > 6 ? `<details class="j-all"><summary>Все записи (${ss.length})</summary><ul class="h-list">${ss.slice(0, -6).reverse().map(s => `<li><span class="h-d">${fmtDay(s.d, true)}</span><span class="h-s">${histSets(ex, s)}</span><button type="button" class="h-del" data-del="${id}" data-d="${s.d}">Удалить</button></li>`).join('')}</ul></details>` : ''}</div>
        </details>
      </li>`;
    }).join('')}</ul>
    <p class="legend">Справа — рабочий вес и лучшие повторы с ним в последней тренировке, ниже — расчётный максимум и изменение с первой записи: по весу, а при том же весе — по повторам. У гантелей и гирь вес — одного снаряда.</p>
    <p class="legend">Расчётный максимум — вес, который вы, по формуле Эпли, подняли бы один раз: вес × (1 + повторы / 30). Он растёт и когда прибавляете вес, и когда делаете больше повторов с тем же весом, но повторы сверх 12 в нём не учитываются. Если вес во всех записях один, график показывает повторы с ним.</p>
    <p class="legend">Общий вес — сумма «вес × повторы» по всем снарядам и сторонам: ${tonnageExample()}. Считается только внешний вес: гантели, гири, штанга, тренажёр, доп. вес; вес тела, противовес гравитрона, удержания на время и дистанция не входят. Л/П — подход с левой и правой стороной отдельно: прогресс и рекорды — по слабой стороне.</p>`;
  }
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
   у подходов без внешнего веса пусто. */
function csvText() {
  /* вес и общий вес — в выбранных единицах, единица — в заголовке столбца */
  const rows = [['Дата', 'Упражнение', 'Группа мышц', 'Подход', `Вес, ${wUnit()}`, 'Повторы / секунды / метры', 'Неделя цикла', 'Отдых после подхода, с', 'Левая', 'Правая', `Общий вес за подход, ${wUnit()}`]];
  const all = [], side = p => (p[0] != null ? fmtKg(p[0]) + '×' : '') + p[1];
  for (const [id, ss] of Object.entries(LOG.data)) {
    const ex = EXI[id]; if (!ex) continue;
    for (const s of ss) {
      const impl = sessionImpl(ex, s);
      s.s.forEach((x, k) => {
        if (!x) return;
        const sd = setSides(x, ex), t = setTonnage(ex, x, impl);
        all.push([s.d, ex.name, GN[ex.g], k + 1, x[0] != null ? fmtKg(x[0]) : '', x[1], s.wk || '', restField(x[2]) ?? '', sd ? side(sd.l) : '', sd ? side(sd.r) : '', t > 0 ? fmtKg(t) : '']);
      });
    }
  }
  all.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1);
  return '﻿' + rows.concat(all).map(r => r.map(v => /[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v).join(';')).join('\r\n');
}
async function exportLog(kind) {
  const msg = $('#j-msg'), d = todayKey();
  const r = kind === 'csv' ? await saveFile(`lazy-gym-log-${d}.csv`, csvText(), 'text/csv')
    : await saveFile(`lazy-gym-kopiya-${d}.json`, JSON.stringify(backupObject()), 'application/json');
  if (msg) msg.textContent = r === 'ok' ? (kind === 'csv' ? 'Таблица сохранена. Откройте её в Excel: столбцы разделены точкой с запятой.' : 'Полная копия сохранена. Восстановить из неё всё можно здесь же, на любом устройстве.')
    : r === 'declined' ? 'Сохранение отменено.' : 'Сохранить файл не удалось.';
}
function importLog(file) {
  const msg = $('#j-msg');
  const rd = new FileReader();
  rd.onload = () => {
    let obj; try { obj = JSON.parse(rd.result); } catch (e) { obj = null; }
    if (!obj || obj.app !== 'podhod' || (!obj.log && !obj.body && !obj.settings)) { if (msg) msg.textContent = 'Это не резервная копия Lazy Gym Planner. Выберите файл lazy-gym-kopiya-….json.'; return; }
    const r = restoreBackup(obj);
    renderJournal();
    const m2 = $('#j-msg');
    const parts = [];
    if (r.exercises) parts.push(`записей журнала: ${r.sessions} (упражнений: ${r.exercises})`);
    if (r.body > 0) parts.push(`замеров: ${r.body}`);
    if (r.heart > 0) parts.push(`дней с пульсом: ${r.heart}`);
    if (r.settings) parts.push('настройки');
    if (m2) m2.textContent = parts.length ? `Восстановлено: ${parts.join(', ')}. Совпадающие даты объединены.` : 'Нового в копии нет — всё из неё уже есть.';
  };
  rd.readAsText(file);
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
/* значения поля (пустое — подсказка); bad — поле, которое надо заполнить */
function readFields({kgIn, rIn}, lt) {
  const reps = parseNum(rIn.value !== '' ? rIn.value : rIn.placeholder);
  let kg = kgIn ? parseKg(kgIn.value !== '' ? kgIn.value : kgIn.placeholder) : null;
  if (reps == null || reps <= 0) return {bad:rIn};
  if (lt === 'kg' && kg == null && kgIn) return {bad:kgIn};
  if (kg != null && kg < 0) kg = null;
  return {kg, reps:Math.round(reps * 10) / 10};
}
/* sure — вес уже подтвердили («Записать» в вопросе о весе) */
function tickSet(btn, sure) {
  const id = btn.dataset.tick, k = +btn.dataset.k;
  const row = btn.closest('.lt-r');
  const it = plan.items.find(x => x.ex.id === id);
  const lt = loadType(it.ex), lr = row.classList.contains('lt-lr');
  const F = (lr ? ['l', 'r'] : [null]).map(side => rowFields(row, side));
  const s = todaySession(id, true);
  if (s.s[k]) {
    if (kgAsk[id] && kgAsk[id].k === k) dropKgAsk(id, row.closest('.c-log'));
    s.s[k] = null; cleanToday(id);
    row.classList.remove('done'); btn.setAttribute('aria-pressed', 'false');
    for (const f of F) { if (f.kgIn) f.kgIn.value = ''; f.rIn.value = ''; }
    carryKgBox(row.closest('.c-log'));
    logTouch(id); refreshHist(id); refreshSug(row.closest('.c-log'), it); return;
  }
  const got = F.map(f => readFields(f, lt)), bad = got.find(g => g.bad);
  if (bad) {
    cleanToday(id);
    bad.bad.focus(); bad.bad.classList.add('need'); setTimeout(() => bad.bad.classList.remove('need'), 1600);
    return;
  }
  /* неправдоподобный вес — не записывать, переспросить в строке */
  const q = !sure && kgDoubt(it, got.map(g => g.kg), k);
  if (q) { cleanToday(id); askKg(row, it, k, q, {side:lr ? (got[1].kg > got[0].kg ? 'r' : 'l') : null}); return; }
  dropKgAsk(id, row.closest('.c-log'));
  while (s.s.length < k) s.s.push(null);
  s.s[k] = lr ? makeSidedSet([got[0].kg, got[0].reps], [got[1].kg, got[1].reps], it.ex) : [got[0].kg, got[0].reps];
  s.target=Math.max(s.target||0,it.rx.circ?(it.rounds||it.rx.sets):it.rx.sets);
  if (it.rx.static) s.fmt = 'static';
  markImpl(s, it);
  F.forEach((f, i) => { if (f.kgIn) f.kgIn.value = got[i].kg != null ? fmtKg(got[i].kg) : ''; f.rIn.value = got[i].reps; });
  row.classList.add('done'); btn.setAttribute('aria-pressed', 'true');
  carryKgBox(row.closest('.c-log'));
  logTouch(id); refreshHist(id); refreshSug(row.closest('.c-log'), it);
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
  const v = inp.dataset.f === 'kg' ? parseKg(inp.value) : parseNum(inp.value), x = s.s[k], side = inp.dataset.side;
  /* неправдоподобный вес — запись прежняя, вопрос в строке */
  if (inp.dataset.f === 'kg' && v > 0 && !sure) {
    const it = (plan && plan.items && plan.items.find(y => y.ex.id === id)) || {ex, rx:{}}, q = kgDoubt(it, [v], k);
    if (q) { askKg(row, it, k, q, {side, edit:true}); return; }
  }
  if (kgAsk[id] && kgAsk[id].k === k) dropKgAsk(id, box);
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
const delArm = {};
function deleteSession(btn) {
  const id = btn.dataset.del, d = btn.dataset.d, key = id + d;
  if (!delArm[key]) {
    delArm[key] = true; btn.textContent = 'Точно удалить?'; btn.classList.add('armed');
    setTimeout(() => { delArm[key] = false; if (btn.isConnected) { btn.textContent = 'Удалить'; btn.classList.remove('armed'); } }, 3500);
    return;
  }
  delArm[key] = false;
  const ss = LOG.data[id]; if (!ss) return;
  const i = ss.findIndex(x => x.d === d); if (i < 0) return;
  ss.splice(i, 1); if (!ss.length) delete LOG.data[id];
  logTouch(id, true);
  if (S.view === 'journal') renderJournal();
  else { const card = document.querySelector(`.card[data-ex="${id}"]`); if (card) refreshCard(card); }
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
  if (t.dataset.hist) {
    const card = t.closest('.card'), h = card.querySelector('.c-hist');
    h.hidden = !h.hidden; t.setAttribute('aria-expanded', String(!h.hidden));
    if (!h.hidden) h.innerHTML = histHtml(EXI[card.dataset.ex]);
    return;
  }
  if (t.dataset.del) { deleteSession(t); return; }
  if (t.dataset.view) { S.view = t.dataset.view; saveSettings(); renderSetup(); renderPlan(); window.scrollTo({top:0}); return; }
  if (t.dataset.units) { S.units = t.dataset.units === 'lb' ? 'lb' : 'kg'; saveSettings(); renderJournal(); const b = document.querySelector(`[data-units="${S.units}"]`); if (b) b.focus(); return; }
  if (t.id === 'exp-csv') { exportLog('csv'); return; }
  if (t.id === 'exp-json') { exportLog('json'); return; }
});
document.addEventListener('change', e => {
  if (e.target.id === 'imp-file' && e.target.files && e.target.files[0]) { importLog(e.target.files[0]); e.target.value = ''; }
  else if (e.target.classList && e.target.classList.contains('lt-in')) editSet(e.target);
});
document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('lt-in') && e.target.dataset.f === 'kg') logKgInput(e.target); });
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
