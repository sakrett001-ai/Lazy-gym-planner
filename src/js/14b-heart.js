/* ===================== ПУЛЬСОМЕТР ===================== */
/* Один клиент для любых датчиков по общему стандарту Bluetooth: сервис пульса GATT «heart_rate» (0x180D), характеристика
   Heart Rate Measurement (0x2A37, уведомления), по желанию — уровень батареи (сервис 0x180F, характеристика 0x2A19).
   Так подключаются нагрудные датчики, часы Garmin, Polar, Coros, Suunto, Amazfit в режиме трансляции пульса, Pixel Watch 2–4.
   Galaxy Watch сам пульс по этому стандарту не транслирует — через приложение на часах, которое транслирует пульс как обычный
   датчик (Active 2 на Tizen — приложения из Galaxy Store вроде «Bluetooth Heart Rate monitor»; Wear OS — Heart for Bluetooth).
   Браузер — Web Bluetooth: Chrome и Edge на Android и компьютере; в Safari на iPhone и в Firefox его нет, в небезопасном
   контексте (http) — тоже. Во Floot приложение работает в iframe с allow="fullscreen; bluetooth" (floot/components/Planner.tsx);
   встроенное окно без этого разрешения Bluetooth не получит — об этом честная строка, а не пустая кнопка.
   Galaxy Watch меняет Bluetooth-адрес: часы выбираются в системном окне браузера заново в каждом сеансе — это нормально;
   обрыв в том же сеансе (gattserverdisconnected) — до пяти попыток переподключиться к тому же устройству (HR_RETRY).
   Пульс пишется так же, как журнал: localStorage (podhod.heart.v1) и, при входе в аккаунт, документ «_heart» той же
   коллекции, что журнал (как замеры «_body»); входит в полную резервную копию. Никуда больше не отправляется.
   Тестовый датчик: ?hr=sim в адресе (во Floot — у страницы-хозяина) подставляет поддельное устройство с меняющимся пульсом;
   в обычном интерфейсе его не видно. В проверках — подмена navigator.bluetooth (tools/heart.test.js, tools/ui-check.mjs).

   Отдых «до пульса» — порог задаёт человек (по умолчанию выключено). Что найдено (11.2026):
   · Buskard и др., 2017 (JEPonline 20(1):13–22, 34 тренированных мужчины, жим лёжа 60 % 1ПМ до отказа): порог не числом,
     а свой у каждого — пульс через 45 с после первого рабочего подхода; следующий подход — когда пульс вернулся к нему
     (±2 уд/мин). Повторов больше, чем при отдыхе 60 с; сами авторы пишут, что этот ориентир ещё нужно проверить.
   · Sippola, Piirainen и др., 2011 (J Strength Cond Res 25:2265–2273): отдых по пульсу пульсометром Polar FT80 против
     постоянных 2 мин — сила 10ПМ росла больше; формула порога в статье и в описании Polar «Work-rest guide» не раскрыта.
   · Edwards и др., 2011 (Psychophysiology) — интервалы бега 5 × 1000 м, отдых до 130 уд/мин: отдых короче и бег медленнее,
     чем при отдыхе 1:1; Schoenmakers и Reed (IJSPP, комментарий) — отдых до числа пульса или до доли от максимума для
     назначения отдыха не подходит.
   · Yoon и Kim, 2023 (Applied Sciences 13:7850) — постоянный отдых 30 с … 5 мин, восстановление пульса только измерялось.
   Надёжного общего числа (уд/мин, % от максимума или резерва) для отдыха между подходами нет — числа по умолчанию нет.

   Безопасность (замечания кардиолога, Михаил п. 5, 6; 4.106):
   · Предупреждение при очень высоком пульсе — выше расчётного максимума для возраста: 208 − 0,7 × возраст (Tanaka H.,
     Monahan K.D., Seals D.R., J Am Coll Cardiol 2001, 37(1):153–156 — метаанализ 351 исследования, 18 712 человек без
     лекарств и некурящих, и лабораторная проверка на 514; разброс у разных людей около ±10 уд/мин). Возраст — по желанию,
     в настройке отдыха; без него — выше 195: это расчётный максимум уже в 18 лет (208 − 0,7 × 18 ≈ 195), выше него — у любого
     взрослого (HR_HIGH_ANY). Слова — «снизьте темп, отдохните; если плохо — остановитесь», без диагнозов.
   · Лекарства, снижающие пульс: бета-блокаторы уменьшают пульс в покое и при нагрузке; у здоровых при той же нагрузке пульс
     ниже на 16–19 % (Levinger I., Bronks R., Cody D.V., Linton I., Davie A., J Sports Sci Med 2004, 3(YISI 1):23–27 —
     со ссылкой на Sjöberg, Frankenhaeuser 1979); пульс при них не отражает нагрузку — строка в настройке отдыха.
   · Отдых «до пульса» не короче минимума (restFloor ниже): обычно не короче минуты (или плана, если он короче) —
     самый короткий отдых в исследованиях для массы — 30–60 с, для силы 3–5 мин (de Salles B.F. et al., Sports Med 2009,
     39(9):765–777); ACSM: 1–2 мин во вспомогательных, 2–3 мин в базовых (Ratamess et al., MSSE 2009, 41(3):687–708).
     В «Бережно» пульс отдых только продлевает, не сокращает.
   · Нет предупреждения — ещё не «безопасно» (замечание владельца, 15.11.2026): формула даёт средний максимум для возраста
     (разброс у разных людей около ±10 уд/мин, Tanaka 2001), а не безопасный предел для конкретного человека; AHA о целевом
     пульсе: «These figures are averages, so use them as general guidelines» (heart.org, Target Heart Rates). Поэтому рядом
     с живым пульсом, пока предупреждения нет, — строка об этом и стоп-сигналы; в настройке отдыха — стоп-сигналы целиком
     (HEART_STOP, 11g-gentle.js: памятка ACSM, Riebe et al. 2015).
   · Порог — до 190 (было до 250): порог выше расчётного максимума молодого взрослого значит «почти без отдыха». */

/* Технические, а не физиологические числа: попытки переподключения (мс), пульс старше 5 с — уже не «живой», шаг продления
   отдыха по пульсу — как у кнопок «±15 сек.», ниже порога — два показания подряд (не одно случайное). */
const HR_RETRY = [1000, 2000, 4000, 8000, 15000];
const HR_LIVE = {stale:5000, gap:5};
const HR_REST = {step:15, confirm:2};
/* поле порога: снизу — от опечаток, сверху — 190 (см. шапку: выше — почти без отдыха); возраст — 10…100 лет */
const HR_THR = {min:30, max:190}, HR_AGE = {min:10, max:100};
/* расчётный максимум пульса для возраста (Tanaka et al. 2001); без возраста — порог предупреждения для любого взрослого */
const HR_HIGH_ANY = 195;
function hrMaxFor(age) { return Number.isInteger(age) && age >= HR_AGE.min && age <= HR_AGE.max ? Math.round(208 - 0.7 * age) : null; }
function hrTooHigh(bpm, age) { if (!(bpm > 0)) return false; const m = hrMaxFor(age); return bpm > (m || HR_HIGH_ANY); }
const HEART_KEY = 'podhod.heart.v1', HEART_PREFS_KEY = 'podhod.heart.prefs.v1';

/* ---------- разбор Heart Rate Measurement (0x2A37) ----------
   Байт 0 — флаги: бит 0 — пульс 16 бит (иначе 8), биты 1–2 — контакт с кожей (бит 2 — датчик его сообщает, бит 1 — контакт
   есть), бит 3 — затраченная энергия (uint16, кДж), бит 4 — RR-интервалы (uint16 каждый, в 1/1024 с). Пульс 0 — показания нет. */
function hrParse(v) {
  const dv = v && typeof v.getUint8 === 'function' ? v : v && v.buffer ? new DataView(v.buffer, v.byteOffset || 0, v.byteLength) : null;
  if (!dv || dv.byteLength < 2) return null;
  const f = dv.getUint8(0), wide = (f & 1) === 1;
  let i = 1;
  if (dv.byteLength < i + (wide ? 2 : 1)) return null;
  const raw = wide ? dv.getUint16(i, true) : dv.getUint8(i);
  i += wide ? 2 : 1;
  const contact = f & 4 ? (f & 2) === 2 : null;
  let energy = null;
  if (f & 8) { if (dv.byteLength >= i + 2) energy = dv.getUint16(i, true); i += 2; }
  const rr = [];
  if (f & 16) for (; i + 1 < dv.byteLength; i += 2) rr.push(Math.round(dv.getUint16(i, true) * 1000 / 1024));
  return {bpm:raw > 0 && raw < 300 ? raw : null, contact, energy, rr, wide};
}

/* ---------- где пульсометр работает ----------
   env: bluetooth — navigator.bluetooth, secure — isSecureContext, policy — разрешает ли окно Bluetooth (null — неизвестно),
   sim — тестовый датчик. Без поддержки — одна честная строка. */
function hrSupport(env) {
  if (env.sim) return {ok:true, sim:true};
  if (env.secure === false) return {ok:false, why:'insecure', line:'Пульсометр работает в Chrome и Edge на Android и компьютере, по защищённому адресу (https).'};
  if (!env.bluetooth || typeof env.bluetooth.requestDevice !== 'function') return {ok:false, why:'browser', line:'Пульсометр работает в Chrome и Edge на Android и компьютере.'};
  if (env.policy === false) return {ok:false, why:'policy', line:'Bluetooth закрыт для этого встроенного окна. Откройте приложение отдельной вкладкой в Chrome или Edge.'};
  return {ok:true};
}
/* ошибка Web Bluetooth → понятное сообщение; help — показать подсказку «часов нет в списке» */
function hrErrorText(e, phase) {
  const name = e && e.name || '', msg = String(e && e.message || '');
  if (name === 'NotFoundError') {
    if (/cancel/i.test(msg)) return {text:'', help:true};
    if (/adapter|bluetooth.*(off|unavailable|not available)/i.test(msg)) return {text:'Bluetooth выключен или недоступен. Включите его и нажмите «♥ Пульс» ещё раз.'};
    if (phase === 'connect' || /service|uuid/i.test(msg)) return {text:'На устройстве нет службы пульса. Включите на часах трансляцию пульса и подключите снова.', help:true};
    return {text:'', help:true};
  }
  if (name === 'SecurityError') {
    if (/policy|disallowed/i.test(msg)) return {text:'Bluetooth закрыт для этого встроенного окна. Откройте приложение отдельной вкладкой в Chrome или Edge.'};
    if (/gesture/i.test(msg)) return {text:'Нажмите «♥ Пульс» ещё раз.'};
    return {text:'Браузер не разрешил Bluetooth на этой странице.'};
  }
  if (name === 'NotAllowedError') return {text:'Браузер запретил Bluetooth. Разрешите его в настройках сайта и нажмите «♥ Пульс» ещё раз.'};
  if (name === 'NotSupportedError') return {text:'Устройство не передаёт пульс по стандарту Bluetooth. Включите на часах трансляцию пульса.', help:true};
  if (name === 'NetworkError' || name === 'InvalidStateError') return {text:'Не удалось подключиться. Проверьте, что трансляция пульса включена и устройство рядом, и попробуйте ещё раз.'};
  return {text:'Не удалось подключить пульсометр. Попробуйте ещё раз.'};
}

/* ---------- подключение: один клиент для любого датчика ----------
   Состояния: idle, choosing (системное окно выбора), connecting, waiting (подключено, пульса ещё нет), live, nocontact,
   reconnecting (обрыв — новая попытка через HR_RETRY[i]), lost (попытки кончились), off (отключил человек), error.
   timers и now подменяются в проверках. */
function hrClient({bluetooth, timers = globalThis, now = () => Date.now(), retry = HR_RETRY, onChange = () => {}, onReading = () => {}}) {
  const c = {state:'idle', name:'', bpm:null, contact:null, rr:[], energy:null, at:0, battery:null, attempt:0, max:retry.length, error:'', help:false};
  let dev = null, chr = null, gen = 0, timer = 0;
  const set = p => { Object.assign(c, p); onChange(c); };
  const onValue = e => {
    const r = hrParse(e && e.target ? e.target.value : null); if (!r) return;
    const t = now();
    set({bpm:r.bpm, contact:r.contact, rr:r.rr, energy:r.energy, at:t, state:r.contact === false || r.bpm == null ? 'nocontact' : 'live'});
    onReading(r, t);
  };
  const onDrop = () => { gen++; chr = null; retryLater(); };
  function retryLater() {
    if (!dev) return;
    timers.clearTimeout(timer);
    if (c.attempt >= retry.length) { set({state:'lost', bpm:null}); return; }
    const wait = retry[c.attempt];
    set({state:'reconnecting', bpm:null, attempt:c.attempt + 1});
    timer = timers.setTimeout(() => { open(true); }, wait);
  }
  function battery(server, my) {
    Promise.resolve().then(() => server.getPrimaryService('battery_service')).then(s => s.getCharacteristic('battery_level')).then(ch => ch.readValue())
      .then(v => { if (my === gen && v && typeof v.getUint8 === 'function') set({battery:v.getUint8(0)}); }).catch(() => {});
  }
  async function open(re) {
    const my = ++gen;
    set(re ? {state:'reconnecting'} : {state:'connecting', error:'', help:false});
    try {
      const server = await dev.gatt.connect(); if (my !== gen) return false;
      const svc = await server.getPrimaryService('heart_rate'); if (my !== gen) return false;
      const ch = await svc.getCharacteristic('heart_rate_measurement'); if (my !== gen) return false;
      if (chr) chr.removeEventListener('characteristicvaluechanged', onValue);
      ch.removeEventListener('characteristicvaluechanged', onValue);
      ch.addEventListener('characteristicvaluechanged', onValue);
      chr = ch;
      set({state:'waiting', attempt:0, error:'', help:false, bpm:null});
      await ch.startNotifications(); if (my !== gen) return false;
      battery(server, my);
      return true;
    } catch (e) {
      if (my !== gen) return false;
      if (re) { retryLater(); return false; }
      const x = hrErrorText(e, 'connect');
      detach();
      set({state:'error', error:x.text || 'Не удалось подключить пульсометр. Попробуйте ещё раз.', help:!!x.help, bpm:null});
      return false;
    }
  }
  function detach() {
    timers.clearTimeout(timer); gen++;
    if (chr) { chr.removeEventListener('characteristicvaluechanged', onValue); try { const p = chr.stopNotifications(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    chr = null;
    if (dev) { dev.removeEventListener('gattserverdisconnected', onDrop); try { if (dev.gatt.connected) dev.gatt.disconnect(); } catch (e) {} }
    dev = null;
  }
  /* выбор устройства: requestDevice — первым же вызовом, пока нажатие ещё «свежее» (иначе браузер окно не откроет).
     all — показать все устройства (часы, которые не объявляют службу пульса в рекламе Bluetooth) */
  async function choose(all) {
    const opts = all ? {acceptAllDevices:true, optionalServices:['heart_rate', 'battery_service']}
      : {filters:[{services:['heart_rate']}], optionalServices:['battery_service']};
    let p;
    try { p = bluetooth.requestDevice(opts); } catch (e) { p = Promise.reject(e); }
    detach();
    set({state:'choosing', error:'', help:false, bpm:null, battery:null, attempt:0});
    let d;
    try { d = await p; } catch (e) { const x = hrErrorText(e, 'choose'); set({state:x.text ? 'error' : 'idle', error:x.text, help:!!x.help}); return false; }
    dev = d; c.name = d.name || '';
    d.addEventListener('gattserverdisconnected', onDrop);
    return open(false);
  }
  function stop() { detach(); set({state:'off', bpm:null, contact:null, attempt:0, error:'', help:false}); }
  return {c, choose, stop, bluetooth, get device() { return dev; }};
}

/* ---------- тестовый датчик (?hr=sim) ----------
   Поддельный navigator.bluetooth: устройство «Тестовый датчик», уведомления раз в секунду. Пульс тянется к условной цели по
   фазе экрана тренировки (подход — выше, отдых — ниже) — числа модели условные, только для ручной проверки, не рекомендация.
   Управление из консоли: HeartSim.drop() — обрыв, HeartSim.contact(false) — нет контакта, HeartSim.set(140), HeartSim.fail(2). */
function hrSimBluetooth({phase = () => 'idle', timers = globalThis, rand = Math.random} = {}) {
  const st = {bpm:86, contact:true, connected:false, fail:0, timer:0};
  const err = (name, message) => { const e = new Error(message); e.name = name; return e; };
  const events = o => {
    const l = {};
    o.addEventListener = (t, f) => { (l[t] = l[t] || []).includes(f) || l[t].push(f); };
    o.removeEventListener = (t, f) => { l[t] = (l[t] || []).filter(x => x !== f); };
    o.dispatch = (t, ev) => { for (const f of (l[t] || []).slice()) f(ev); };
    return o;
  };
  const stop = () => { timers.clearInterval(st.timer); st.timer = 0; };
  const chr = events({value:null, async startNotifications() { stop(); st.timer = timers.setInterval(beat, 1000); beat(); return chr; }, async stopNotifications() { stop(); }});
  function beat() {
    if (!st.connected) return;
    const p = phase(), target = p === 'work' ? 152 : p === 'rest' ? 94 : 88;
    st.bpm += (target - st.bpm) * (p === 'work' ? .09 : .07) + (rand() - .5) * 2.4;
    const b = Math.max(40, Math.min(220, Math.round(st.bpm))), rr = Math.round(60 / b * 1024);
    chr.value = new DataView(Uint8Array.of(0x16 | (st.contact ? 2 : 0), st.contact ? b : 0, rr & 255, rr >> 8).buffer);
    chr.dispatch('characteristicvaluechanged', {target:chr});
  }
  const svc = {async getCharacteristic(n) { if (n !== 'heart_rate_measurement') throw err('NotFoundError', 'No Characteristics matching UUID'); return chr; }};
  const bat = {async getCharacteristic() { return {async readValue() { return new DataView(Uint8Array.of(76).buffer); }}; }};
  const server = {get connected() { return st.connected; }, async getPrimaryService(n) { if (n === 'heart_rate') return svc; if (n === 'battery_service') return bat; throw err('NotFoundError', 'No Services matching UUID'); }};
  const dev = events({id:'sim', name:'Тестовый датчик', gatt:{get connected() { return st.connected; },
    async connect() { if (st.fail > 0) { st.fail--; throw err('NetworkError', 'Connection attempt failed.'); } st.connected = true; return server; },
    disconnect() { if (!st.connected) return; st.connected = false; stop(); dev.dispatch('gattserverdisconnected', {target:dev}); }}});
  return {async requestDevice() { return dev; }, async getAvailability() { return true; },
    sim:{drop() { if (!st.connected) return; st.connected = false; stop(); dev.dispatch('gattserverdisconnected', {target:dev}); }, contact(v) { st.contact = !!v; }, set(b) { st.bpm = +b || st.bpm; }, fail(n) { st.fail = Math.max(0, n | 0); }, state:() => ({...st})}};
}
function hrSimFlag(search) { return /[?&]hr=sim(?=[&#]|$)/.test(search || ''); }
/* минимальный отдых при отдыхе «до пульса», с: в «Бережно» — весь план (пульс отдых только продлевает), иначе не короче минуты
   или плана, если он короче (см. шапку: de Salles et al. 2009, Ratamess et al. 2009) */
function restFloor(planned, gentle) { const p = Math.max(0, Number(planned) || 0); return gentle ? p : Math.min(60, p); }

/* ---------- запись: пульс подхода, отдыха и тренировки (без страницы — tools/heart.test.js) ----------
   День: {t: секунды с пульсом, avg: средний (по времени), max, sets: {'id:k': [в конце подхода, максимум за подход]},
   rests: {'id:k': [в начале отдыха, в конце]}} — k — номер подхода, после которого отдыхали. null — показания не было. */
const hrKey = step => step.it.ex.id + ':' + step.k;
function hrDayNew() { return {t:0, avg:0, max:0, sets:{}, rests:{}}; }
/* показание bpm в момент at; prevAt — прошлое показание (вес — время до него, не больше HR_LIVE.gap с; первое — 1 с) */
function hrAccumulate(day, bpm, at, prevAt) {
  if (!(bpm > 0)) return day;
  const w = prevAt ? Math.max(0, Math.min(HR_LIVE.gap, (at - prevAt) / 1000)) : 1;
  if (w > 0) { day.avg = (day.avg * day.t + bpm * w) / (day.t + w); day.t += w; }
  if (bpm > (day.max || 0)) day.max = bpm;
  return day;
}
function hrSetDone(day, key, end, max) {
  const m = [end, max].filter(v => v > 0);
  if (m.length) day.sets[key] = [end > 0 ? end : null, Math.max(...m)];
  return day;
}
function hrRestDone(day, key, from, to) {
  if (from > 0 || to > 0) day.rests[key] = [from > 0 ? from : null, to > 0 ? to : null];
  return day;
}
const hrSummary = day => day && day.t > 0 ? {avg:Math.round(day.avg), max:day.max} : null;
/* проверка данных из хранилища и копии: только числа пульса 1…299, ключи «id:k» */
const hrBpm = v => Number.isFinite(+v) && +v > 0 && +v < 300 ? Math.round(+v) : null;
function hrCleanDay(x) {
  if (!x || typeof x !== 'object') return null;
  const t = +x.t, avg = +x.avg, d = hrDayNew();
  if (Number.isFinite(t) && t > 0 && Number.isFinite(avg) && avg > 0 && avg < 300) { d.t = Math.round(t * 10) / 10; d.avg = Math.round(avg * 10) / 10; }
  d.max = hrBpm(x.max) || 0;
  for (const k of ['sets', 'rests']) if (x[k] && typeof x[k] === 'object') for (const [key, v] of Object.entries(x[k])) {
    if (!/^[\w-]+:\d{1,3}$/.test(key) || !Array.isArray(v)) continue;
    const a = hrBpm(v[0]), b = hrBpm(v[1]);
    if (a || b) d[k][key] = [a, b];
  }
  return d.t > 0 || d.max || Object.keys(d.sets).length || Object.keys(d.rests).length ? d : null;
}
function hrCleanDays(o) {
  const out = {};
  if (o && typeof o === 'object') for (const [d, x] of Object.entries(o)) if (/^\d{4}-\d\d-\d\d$/.test(d)) { const c = hrCleanDay(x); if (c) out[d] = c; }
  return out;
}
/* объединение по дате: основа — день с бо́льшим временем пульса, подходы и отдых — из обоих (у основы приоритет).
   Все дни: день пульса — несколько чисел, а предел в 400 дней молча стирал историю (решение владельца по 4.107, вопрос 5). */
function hrMergeDays(a, b) {
  const out = {...(a || {})};
  for (const [d, y] of Object.entries(b || {})) {
    const x = out[d];
    if (!x) { out[d] = y; continue; }
    const [base, other] = (y.t || 0) > (x.t || 0) ? [y, x] : [x, y];
    out[d] = {...base, max:Math.max(base.max || 0, other.max || 0), sets:{...other.sets, ...base.sets}, rests:{...other.rests, ...base.rests}};
  }
  return out;
}

/* ---------- отдых «до пульса»: шаг по меткам времени ----------
   mode: 'time' — пульс только показывается; 'hr' — отдых кончается, когда пульс ниже порога (раньше плана — сразу; к концу
   плана пульс выше — продление по HR_REST.step с); 'first' — по плану или раньше, если пульс опустился ниже порога.
   st — состояние этого отдыха {below, lastAt, done, ext}; at — время показания (ниже порога — HR_REST.confirm показаний
   подряд). Без живого пульса — отдых по времени. Вернёт {act: null | 'end' | 'extend', until, why}. */
function hrRestStep(st, {mode, thr, now, until, bpm, at, floorAt = 0}) {
  if (mode !== 'hr' && mode !== 'first') return {act:null, until, why:'time'};
  if (!(thr > 0)) return {act:null, until, why:'nothr'};
  if (st.done) return {act:null, until, why:st.done};
  if (until <= now) { st.done = 'timeup'; return {act:null, until, why:'timeup'}; }
  if (bpm == null) { st.below = 0; return {act:null, until, why:'nohr'}; }
  if (at && at !== st.lastAt) { st.lastAt = at; st.below = bpm < thr ? (st.below || 0) + 1 : 0; }
  /* ниже порога, но отдых ещё короче минимума (floorAt) — конец отдыха на минимуме, а не сразу */
  if ((st.below || 0) >= HR_REST.confirm) { st.done = now + 100 < floorAt ? 'floor' : 'below'; return {act:'end', until:Math.min(until, Math.max(now + 100, floorAt)), why:st.done}; }
  if (mode === 'hr' && bpm >= thr && until - now <= 1000) { st.ext = (st.ext || 0) + 1; return {act:'extend', until:until + HR_REST.step * 1000, why:'extended'}; }
  return {act:null, until, why:st.ext ? 'extended' : 'waiting'};
}

/* ---------- хранилище пульса ---------- */
const HEART = {days:{}, pending:false, writing:false, again:false, timer:0};
function heartLoad() { try { const s = JSON.parse(localStorage.getItem(HEART_KEY) || 'null'); if (s && typeof s === 'object') HEART.days = hrCleanDays(s.days); } catch (e) {} }
/* через Keep (00a-keep.js): переполненное хранилище — плашка, а не тихая потеря пульса */
function heartSaveLocal() { return Keep.set(HEART_KEY, JSON.stringify({v:1, days:HEART.days})); }
function heartDay(d, create) { if (!HEART.days[d] && create) HEART.days[d] = hrDayNew(); return HEART.days[d] || null; }
function heartTouch(now) {
  heartSaveLocal();
  if (typeof LOG === 'undefined' || LOG.mode !== 'cloud' || !LOG.col) return;
  HEART.pending = true; clearTimeout(HEART.timer); HEART.timer = setTimeout(heartFlush, now ? 0 : 800);
}
async function heartFlush(retried) {
  if (HEART.writing) { HEART.again = true; return; }
  HEART.writing = true;
  try {
    if (Object.keys(HEART.days).length) await LOG.col.doc('_heart').set({ex:'_heart', days:HEART.days});
    else await LOG.col.doc('_heart').delete();
  } catch (e) {
    if (e && e.code === 'unavailable' && !retried) { HEART.writing = false; setTimeout(() => heartFlush(true), 800); return; }
    LOG.err = 'Сохранить пульс в аккаунт не получилось — он остаётся в этом браузере.'; logRefresh(null);
  } finally {
    HEART.writing = false;
    if (HEART.again) { HEART.again = false; heartFlush(); } else HEART.pending = false;
  }
}
/* снимок коллекции журнала (logInit): документ «_heart» */
function heartRemote(doc, first) {
  const remote = doc ? hrCleanDays(doc.days) : {};
  if (first) {
    const merged = hrMergeDays(remote, HEART.days);
    if (JSON.stringify(merged) !== JSON.stringify(remote)) { HEART.days = merged; heartTouch(true); } else HEART.days = remote;
  } else {
    if (HEART.pending || JSON.stringify(remote) === JSON.stringify(HEART.days)) return;
    HEART.days = remote;
  }
  heartSaveLocal();
}
/* полная резервная копия (18-measures.js) */
function heartBackup() { return {days:HEART.days, prefs:Heart.prefs()}; }
function heartRestore(o) {
  if (!o || typeof o !== 'object') return 0;
  const before = Object.keys(HEART.days).length, merged = hrMergeDays(HEART.days, hrCleanDays(o.days));
  let n = 0;
  if (JSON.stringify(merged) !== JSON.stringify(HEART.days)) { n = Math.max(1, Object.keys(merged).length - before); HEART.days = merged; heartTouch(true); }
  if (o.prefs && typeof o.prefs === 'object') Heart.setPrefs(o.prefs);
  return n;
}
/* журнал: средний и максимальный пульс тренировки за день */
function heartDayHtml(d) {
  const s = hrSummary(HEART.days[d]);
  return s ? `<span class="j-hr"><i aria-hidden="true">♥</i> ${'ср.'} ${s.avg} ${'· макс.'} ${s.max}</span>` : '';
}

/* ---------- экран тренировки ----------
   Плашка «♥ Пульс» под полосой прогресса: нажатие — системное окно выбора устройства, подключено — живой пульс крупно,
   нажатие — «Отключить?», второе нажатие в течение 3 с — отключить. На экране отдыха — пульс крупно и «Конец отдыха»:
   время, пульс или что раньше, порог. В итогах тренировки — средний и максимальный пульс. Код подключения — в 14-workout-mode.js
   (Heart.open, close, set, setDone, restDone, restTick, finish). */
const Heart = (() => {
  let P = {rest:'time', thr:null, age:null};
  try { const s = JSON.parse(localStorage.getItem(HEART_PREFS_KEY) || 'null'); if (s && typeof s === 'object') P = cleanPrefs(s); } catch (e) {}
  function cleanPrefs(s) {
    const thr = Number(s.thr);
    const age = Number(s.age);
    return {rest:['time', 'hr', 'first'].includes(s.rest) ? s.rest : 'time', thr:Number.isInteger(thr) && thr >= HR_THR.min && thr <= HR_THR.max ? thr : null,
      age:Number.isInteger(age) && age >= HR_AGE.min && age <= HR_AGE.max ? age : null};
  }
  function savePrefs() { Keep.set(HEART_PREFS_KEY, JSON.stringify(P)); }
  let client = null, simBt = null, simOn = null, mounted = false, opened = false, armed = 0, ticker = 0;
  const cur = {set:null, rest:null, rule:null, feedAt:0, savedAt:0, why:'', ruleFrom:null};
  const q = sel => typeof document !== 'undefined' && document.querySelector ? document.querySelector(sel) : null;
  function query() {
    let s = '';
    try { s = location.search || ''; } catch (e) {}
    if (!hrSimFlag(s)) try { if (window.parent && window.parent !== window) s = window.parent.location.search || ''; } catch (e) {}
    return s;
  }
  const sim = () => { if (simOn === null) simOn = hrSimFlag(query()); return simOn; };
  const phase = () => { const r = q('#wv-rest'), a = q('#wv-active'); return r && !r.hidden ? 'rest' : a && !a.hidden && opened ? 'work' : 'idle'; };
  function bt() {
    if (sim()) { if (!simBt) { simBt = hrSimBluetooth({phase}); try { window.HeartSim = simBt.sim; } catch (e) {} } return simBt; }
    return typeof navigator !== 'undefined' ? navigator.bluetooth : null;
  }
  function policy() {
    /* браузер, которому Bluetooth неизвестен, на allowsFeature тоже отвечает «нет» — тогда судит наличие navigator.bluetooth */
    try {
      const pp = document.permissionsPolicy || document.featurePolicy;
      if (pp && typeof pp.allowsFeature === 'function') return typeof pp.features === 'function' && !pp.features().includes('bluetooth') ? null : pp.allowsFeature('bluetooth');
    } catch (e) {}
    return null;
  }
  const support = () => hrSupport({sim:sim(), bluetooth:bt(), secure:typeof isSecureContext === 'boolean' ? isSecureContext : null, policy:policy()});
  const C = () => client ? client.c : null;
  function live(now = Date.now()) { const c = C(); return c && c.state === 'live' && c.bpm > 0 && now - c.at <= HR_LIVE.stale ? c.bpm : null; }
  function ensureClient() {
    const b = bt();
    if (!client || client.bluetooth !== b) { if (client) client.stop(); client = hrClient({bluetooth:b, onChange:() => paint(), onReading:feed}); }
    return client;
  }
  function feed(r, at) {
    if (!opened || !(r.bpm > 0) || r.contact === false) { cur.feedAt = 0; return; }
    hrAccumulate(heartDay(todayKey(), true), r.bpm, at, cur.feedAt); cur.feedAt = at;
    if (cur.set) cur.set.max = Math.max(cur.set.max || 0, r.bpm);
    if (at - cur.savedAt > 30000) { cur.savedAt = at; heartTouch(); }
  }
  /* ---------- разметка (создаётся при первом открытии тренировки) ---------- */
  function el(tag, attrs, html) { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v); if (html) e.innerHTML = html; return e; }
  function mount() {
    if (mounted) return true;
    const prog = q('#wv-progress'); if (!prog || typeof document.createElement !== 'function') return false;
    const row = el('div', {id:'wv-hr', class:'wv-hr', 'data-state':'idle'},
      `<button type="button" id="wv-hr-btn" class="wv-hr-btn" aria-describedby="wv-hr-note wv-hr-meta"><span class="wv-hr-heart" aria-hidden="true">♥</span><span id="wv-hr-val" class="wv-hr-val">${'Пульс'}</span><small id="wv-hr-unit" class="wv-hr-unit" hidden>${'уд/мин'}</small></button>`
      + `<div class="wv-hr-text"><p id="wv-hr-note" class="wv-hr-note" role="status"></p><p id="wv-hr-meta" class="wv-hr-meta"></p></div>`
      + `<p id="wv-hr-warn" class="wv-hr-warn" role="alert" hidden></p>`
      + `<p id="wv-hr-safe" class="wv-hr-safe" hidden>${'Нет предупреждения — это ещё не значит, что нагрузка безопасна. При боли в груди, головокружении, необычной одышке — остановитесь.'}</p>`
      + `<p id="wv-hr-line" class="wv-hr-line" hidden><span class="wv-hr-heart" aria-hidden="true">♥</span> <span id="wv-hr-line-t"></span></p>`
      + `<p id="wv-hr-help" class="wv-hr-help" hidden>${'Часов нет в списке? Включите на них трансляцию пульса: на Galaxy Watch — приложение, которое транслирует пульс как датчик.'} <button type="button" id="wv-hr-all" class="wv-hr-all">${'Показать все устройства'}</button></p>`);
    prog.after(row);
    const over = q('#wv-rest-over');
    if (over) over.after(el('div', {id:'wv-hr-rest', class:'wv-hr-rest', hidden:''},
      `<p class="wv-hr-big"><span class="wv-hr-heart" aria-hidden="true">♥</span><b id="wv-hr-rest-val">—</b><small>${'уд/мин'}</small></p><p id="wv-hr-rest-note" class="wv-hr-rest-note" role="status"></p>`));
    const signal = q('#wv-rest .wv-signal') || q('#wv-rest');
    if (signal) signal.append(el('div', {id:'wv-hr-set', class:'wv-hr-set', hidden:''},
      `<span id="wv-hr-mode-label">${'Конец отдыха'}</span><div class="wv-seg" role="group" aria-labelledby="wv-hr-mode-label"><button type="button" data-hr-rest="time" aria-pressed="true">${'Время'}</button><button type="button" data-hr-rest="hr" aria-pressed="false">${'Пульс'}</button><button type="button" data-hr-rest="first" aria-pressed="false">${'Пульс или время'}</button></div>`
      + `<p id="wv-hr-mode-note" class="wv-signal-note"></p>`
      + `<label class="wv-hr-thr" for="wv-hr-thr"><span>${'Порог пульса'}</span><input id="wv-hr-thr" type="text" inputmode="numeric" autocomplete="off" maxlength="3" aria-describedby="wv-hr-thr-note"><span>${'уд/мин'}</span></label>`
      + `<p id="wv-hr-thr-note" class="wv-signal-note">${'Порог задаёте вы: общего числа для отдыха между подходами в исследованиях нет.'}</p>`
      + `<p class="wv-signal-note wv-hr-med">${'Пульс с часов и датчиков — ориентир, а не медицинское измерение.'}</p>`
      + `<label class="wv-hr-age" for="wv-hr-age"><span>${'Возраст'}</span><input id="wv-hr-age" type="text" inputmode="numeric" autocomplete="off" maxlength="3" aria-describedby="wv-hr-age-note"><span>${'лет'}</span></label>`
      + `<p id="wv-hr-age-note" class="wv-signal-note">${'По желанию: тогда предупреждение о слишком высоком пульсе — по вашему возрасту (расчётный максимум 208 − 0,7 × возраст, у разных людей ±10 уд/мин). Это средняя оценка, а не безопасный предел для вас.'}</p>`
      + `<p class="wv-signal-note wv-hr-med">${'Если вы принимаете лекарства, которые снижают пульс (например, бета-блокаторы), пульс не показывает нагрузку — ориентируйтесь на дыхание и самочувствие.'}</p>`
      + (typeof HEART_STOP === 'string' ? `<p class="wv-signal-note wv-hr-med">${HEART_STOP}</p>` : '')));
    const fin = q('#wv-finish-text');
    if (fin) fin.after(el('p', {id:'wv-hr-finish', class:'wv-hr-finish', hidden:''}, `<span class="wv-hr-heart" aria-hidden="true">♥</span> <span id="wv-hr-finish-t"></span>`));
    mounted = true; paintPrefs(); return true;
  }
  const text = (sel, t) => { const e = q(sel); if (e && e.textContent !== t) e.textContent = t; };
  const show = (sel, on) => { const e = q(sel); if (e && e.hidden === !!on) e.hidden = !on; };
  /* ---------- отрисовка: плашка, пульс на отдыхе, настройка, итоги ---------- */
  function paint(now = Date.now()) {
    if (!mounted) return;
    const sup = support(), row = q('#wv-hr');
    if (!sup.ok) {
      row.dataset.state = 'unsupported'; show('#wv-hr-btn', false); show('.wv-hr-text', false); show('#wv-hr-help', false);
      text('#wv-hr-line-t', sup.line); show('#wv-hr-line', true); show('#wv-hr-rest', false); show('#wv-hr-set', false); return;
    }
    show('#wv-hr-btn', true); show('.wv-hr-text', true); show('#wv-hr-line', false); show('#wv-hr-set', true);
    const c = C(), st = c ? c.state : 'idle', bpm = live(now), name = c && c.name || 'датчик';
    let view = st, val = 'Пульс', note = '', meta = '';
    if (st === 'live' && bpm == null) view = 'waiting';
    if (view === 'idle') note = 'Часы или нагрудный датчик по Bluetooth';
    else if (view === 'choosing') note = 'Выберите пульсометр в окне браузера';
    else if (view === 'connecting') { val = '…'; note = `${'Подключение:'} ${name}`; }
    else if (view === 'waiting') { val = '—'; note = st === 'live' ? 'Пульс не приходит — проверьте часы или датчик' : `${'Ждём пульс:'} ${name}`; }
    else if (view === 'live') {
      val = String(bpm);
      const m = cur.set && cur.set.max > 0 ? cur.set.max : null;
      meta = [m ? `${'макс. за подход'} ${m}` : '', name, c.battery != null ? `${'батарея'} ${c.battery} %` : ''].filter(Boolean).join(' · ');
    }
    else if (view === 'nocontact') { val = '—'; note = 'Нет контакта с кожей — поправьте ремешок или датчик'; }
    else if (view === 'reconnecting') { val = '…'; note = `${'Связь прервалась — переподключаюсь, попытка'} ${c.attempt} ${'из'} ${c.max}`; }
    else if (view === 'lost') note = `${'Связь потеряна:'} ${name}. ${'Нажмите «♥ Пульс», чтобы подключить снова.'}`;
    else if (view === 'off') note = 'Пульсометр отключён.';
    else if (view === 'error') note = c.error;
    const on = ['connecting', 'waiting', 'live', 'nocontact', 'reconnecting'].includes(st);
    if (armed && on) { val = 'Отключить?'; note = 'Нажмите ещё раз, чтобы отключить пульсометр.'; }
    row.dataset.state = armed && on ? 'armed' : view; row.dataset.screen = phase();
    text('#wv-hr-val', val); show('#wv-hr-unit', view === 'live' && !(armed && on)); text('#wv-hr-note', note); text('#wv-hr-meta', meta);
    show('#wv-hr-note', !!note); show('#wv-hr-meta', !!meta);
    const btn = q('#wv-hr-btn');
    btn.setAttribute('aria-label', armed && on ? 'Отключить пульсометр' : view === 'live' ? `${'Пульс'} ${bpm} ${'уд/мин. Нажмите, чтобы отключить пульсометр'}` : on ? 'Пульсометр подключается. Нажмите, чтобы отключить' : 'Пульс: подключить пульсометр');
    const wv = q('#workout-view'); if (wv && view === 'live') wv.style.setProperty('--hr-beat', (60 / bpm).toFixed(2) + 's');
    show('#wv-hr-help', !!(c && c.help) && !on);
    /* очень высокий пульс — заметная строка (hrTooHigh) */
    const high = view === 'live' && hrTooHigh(bpm, P.age), mx = hrMaxFor(P.age);
    text('#wv-hr-warn', !high ? '' : mx ? 'Пульс выше расчётного максимума для вашего возраста (≈ {n}). Снизьте темп и отдохните; если стало плохо — остановитесь.'.replace('{n}', mx)
      : 'Очень высокий пульс. Снизьте темп и отдохните; если стало плохо — остановитесь. Укажите возраст в настройке отдыха — предупреждение будет точнее.');
    show('#wv-hr-warn', high);
    /* без предупреждения — строка «это ещё не значит, что безопасно» (шапка: формула — средняя, не предел для человека) */
    show('#wv-hr-safe', view === 'live' && !high && !(armed && on));
    paintRest(now, bpm, on);
  }
  function paintRest(now, bpm, on) {
    const box = q('#wv-hr-rest'); if (!box) return;
    const resting = typeof workout !== 'undefined' && workout && workout.restFrom > 0;
    show('#wv-hr-rest', on && resting);
    if (!on || !resting) return;
    text('#wv-hr-rest-val', bpm != null ? String(bpm) : '—');
    /* пульс упал раньше минимума отдыха: до минимума — «отдохните ещё немного», после — «можно к подходу» */
    const from = cur.rest && cur.rest.from > 0 ? cur.rest.from : null, thr = P.thr, why = cur.why === 'floor' && workout.restUntil <= now ? 'below' : cur.why;
    const start = from ? `${'в начале отдыха'} ${from}` : '';
    let lead = '';
    if (P.rest !== 'time') {
      if (why === 'nothr') lead = 'Порог пульса не задан — отдых по времени';
      else if (why === 'below') lead = `${'Пульс ниже'} ${thr} ${'— можно к подходу'}`;
      else if (why === 'floor') lead = `${'Пульс ниже'} ${thr} ${'— отдохните ещё немного: отдых не короче минимума'}`;
      else if (why === 'timeup') lead = 'Отдых по плану закончился';
      else if (why === 'nohr') lead = 'Пульса нет — отдых по времени';
      else if (why === 'extended') lead = `${'Пульс выше'} ${thr} ${'— отдых продлён на 15 с'}`;
      else lead = `${'Отдых до пульса ниже'} ${thr}`;
    }
    text('#wv-hr-rest-note', lead ? lead + (start ? ' · ' + start : '') : from ? `${'В начале отдыха'} ${from}` : '');
    box.classList.toggle('is-ready', why === 'below');
  }
  function paintPrefs() {
    if (!mounted) return;
    for (const b of document.querySelectorAll('[data-hr-rest]')) b.setAttribute('aria-pressed', String(b.dataset.hrRest === P.rest));
    const inp = q('#wv-hr-thr');
    if (inp && document.activeElement !== inp) inp.value = P.thr ? String(P.thr) : '';
    const ag = q('#wv-hr-age');
    if (ag && document.activeElement !== ag) ag.value = P.age ? String(P.age) : '';
    text('#wv-hr-mode-note', P.rest === 'hr' ? 'Отдых кончается, когда пульс опустится ниже порога: раньше плана — сразу, позже — продлевается по 15 с.'
      : P.rest === 'first' ? 'Отдых кончается по плану или раньше — как только пульс опустится ниже порога.'
      : 'Отдых по плану, пульс только показывается.');
    show('.wv-hr-thr', P.rest !== 'time'); show('#wv-hr-thr-note', P.rest !== 'time');
  }
  function paintFinish() {
    const s = hrSummary(HEART.days[todayKey()]);
    show('#wv-hr-finish', !!s);
    if (s) text('#wv-hr-finish-t', `${'Пульс за тренировку: средний'} ${s.avg}, ${'максимальный'} ${s.max}.`);
  }
  /* ---------- действия ---------- */
  function press(all) {
    const c = C(), on = c && ['connecting', 'waiting', 'live', 'nocontact', 'reconnecting'].includes(c.state);
    if (on && !all) {
      if (armed) { clearTimeout(armed); armed = 0; client.stop(); return; }
      armed = setTimeout(() => { armed = 0; paint(); }, 3000); paint(); return;
    }
    if (!support().ok) { paint(); return; }
    ensureClient().choose(!!all);
  }
  function setRest(mode) { P.rest = ['time', 'hr', 'first'].includes(mode) ? mode : 'time'; savePrefs(); paintPrefs(); cur.rule = null; if (typeof workout !== 'undefined' && workout) restTick(); }
  function thrInput(inp) {
    const s = inp.value.trim(), n = Number(s);
    if (!s) { P.thr = null; inp.removeAttribute('aria-invalid'); }
    else if (Number.isInteger(n) && n >= HR_THR.min && n <= HR_THR.max) { P.thr = n; inp.removeAttribute('aria-invalid'); }
    else { inp.setAttribute('aria-invalid', 'true'); return; }
    savePrefs(); cur.rule = null; if (typeof workout !== 'undefined' && workout) restTick();
  }
  function ageInput(inp) {
    const s = inp.value.trim(), n = Number(s);
    if (!s) { P.age = null; inp.removeAttribute('aria-invalid'); }
    else if (Number.isInteger(n) && n >= HR_AGE.min && n <= HR_AGE.max) { P.age = n; inp.removeAttribute('aria-invalid'); }
    else { inp.setAttribute('aria-invalid', 'true'); return; }
    savePrefs(); paint();
  }
  /* шаг таймера отдыха (workoutTick): отдых «до пульса» двигает конец отдыха (workout.restUntil) и сигнал */
  function restTick(now = Date.now()) {
    if (typeof workout === 'undefined' || !workout || !(workout.restFrom > 0)) return;
    if (!cur.rule || cur.ruleFrom !== workout.restFrom) { cur.rule = {below:0, lastAt:0, done:null, ext:0}; cur.ruleFrom = workout.restFrom; }
    const c = C(), r = hrRestStep(cur.rule, {mode:P.rest, thr:P.thr, now, until:workout.restUntil, bpm:live(now), at:c ? c.at : 0, floorAt:workout.restFrom + restFloor(workout.restTotal, typeof S !== 'undefined' && S.goal === 'gentle') * 1000});
    if (r.act) { workout.restUntil = r.until; RestAlarm.arm(r.until, {from:workout.restFrom}); saveWorkout(); }
    cur.why = r.why;
    const row = q('#wv-hr'); if (row && row.dataset.screen !== 'rest') row.dataset.screen = 'rest';
    if (mounted) paintRest(now, live(now), !!c && ['connecting', 'waiting', 'live', 'nocontact', 'reconnecting'].includes(c.state));
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', e => {
      const t = e.target && e.target.closest ? e.target.closest('button') : null; if (!t) return;
      if (t.id === 'wv-hr-btn') press(false);
      else if (t.id === 'wv-hr-all') press(true);
      else if (t.dataset && t.dataset.hrRest) setRest(t.dataset.hrRest);
    });
    document.addEventListener('input', e => { if (e.target && e.target.id === 'wv-hr-thr') thrInput(e.target); if (e.target && e.target.id === 'wv-hr-age') ageInput(e.target); });
    document.addEventListener('focusout', e => { if (e.target && (e.target.id === 'wv-hr-thr' || e.target.id === 'wv-hr-age')) paintPrefs(); });
  }
  return {
    /* возраст из настройки отдыха (по желанию) — и для шкалы после перерыва (15-autoreg.js: layoffInfo) */
    age() { return P.age; },
    /* тренировка открыта / закрыта: подключение остаётся (вернулись к плану и обратно), пульс пишется только в тренировке */
    open() { if (!mount()) return; opened = true; cur.feedAt = 0; clearInterval(ticker); ticker = setInterval(() => paint(), 1000); paintPrefs(); paint(); },
    close() { opened = false; clearInterval(ticker); ticker = 0; cur.set = null; cur.feedAt = 0; if (HEART.days[todayKey()]) heartTouch(); },
    /* экран подхода показан: максимум подхода — с этого момента */
    set(step) { cur.set = step ? {key:hrKey(step), max:live() || 0} : null; paint(); },
    /* подход записан: пульс в конце и максимум; отдых начинается с этого пульса */
    setDone(step) {
      const bpm = live(), key = hrKey(step), m = cur.set && cur.set.key === key ? cur.set.max : 0;
      if (bpm > 0 || m > 0) { hrSetDone(heartDay(todayKey(), true), key, bpm, m); heartTouch(); }
      cur.set = null; cur.rest = {key, from:bpm}; cur.rule = null;
    },
    /* «Перейти к подходу»: пульс в конце отдыха */
    restDone() {
      const step = typeof workout !== 'undefined' && workout ? workout.queue[workout.last] : null;
      if (step && cur.rest && cur.rest.key === hrKey(step)) { const to = live(); if (cur.rest.from > 0 || to > 0) { hrRestDone(heartDay(todayKey(), true), cur.rest.key, cur.rest.from, to); heartTouch(); } }
      cur.rest = null; cur.rule = null;
    },
    restTick,
    finish() { if (HEART.days[todayKey()]) heartTouch(); paintFinish(); },
    prefs:() => ({...P}),
    setPrefs(p) { P = cleanPrefs({...P, ...p}); savePrefs(); paintPrefs(); },
    /* для проверок (tools/ui-check.mjs, tools/i18n-audit.mjs) */
    state:() => ({client:C() ? {...C()} : null, live:live(), support:support(), prefs:{...P}, set:cur.set && {...cur.set}, rest:cur.rest && {...cur.rest}, why:cur.why, mounted, opened}),
    paint, mount
  };
})();
heartLoad();
