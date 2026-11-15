'use strict';
/* Пульсометр (src/js/14b-heart.js): разбор Heart Rate Measurement (0x2A37), где пульсометр работает и честная строка без
   Web Bluetooth, понятные ошибки, подключение с обрывом и переподключением (подменённые navigator.bluetooth и таймеры),
   запись пульса подхода, отдыха и тренировки, объединение и проверка записей, отдых «до пульса». Файл исполняется сам по
   себе, без страницы; экран тренировки с подменённым Bluetooth — tools/ui-check.mjs. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const plain = v => JSON.parse(JSON.stringify(v));

function heart() {
  const store = new Map();
  const ctx = { localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
    setTimeout, clearTimeout, setInterval, clearInterval, console, DataView, Uint8Array };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/js/14b-heart.js'), 'utf8'), ctx, { filename: '14b-heart.js' });
  return vm.runInContext('({HR_RETRY, HR_LIVE, HR_REST, HR_THR, HR_HIGH_ANY, hrMaxFor, hrTooHigh, restFloor, hrParse, hrSupport, hrErrorText, hrClient, hrSimBluetooth, hrSimFlag, hrKey, hrDayNew, hrAccumulate, hrSetDone, hrRestDone, hrSummary, hrCleanDays, hrMergeDays, hrRestStep, Heart})', ctx);
}
const H = heart();
const dv = bytes => new DataView(Uint8Array.from(bytes).buffer);

test('0x2A37: 8-bit and 16-bit heart rate, sensor contact, energy and RR intervals', () => {
  /* 8 бит, контакт не поддерживается */
  assert.deepEqual(plain(H.hrParse(dv([0x00, 72]))), { bpm: 72, contact: null, energy: null, rr: [], wide: false });
  /* 16 бит (младший байт первым): 0x00B4 = 180; 0x012C = 300 — ошибка датчика, а не пульс */
  assert.equal(H.hrParse(dv([0x01, 0xB4, 0x00])).bpm, 180);
  assert.equal(H.hrParse(dv([0x01, 0xB4, 0x00])).wide, true);
  assert.equal(H.hrParse(dv([0x01, 0x2C, 0x01])).bpm, null, '300 уд/мин — ошибка датчика, а не пульс');
  /* контакт: бит 2 — сообщает, бит 1 — есть */
  assert.equal(H.hrParse(dv([0x06, 90])).contact, true);
  assert.equal(H.hrParse(dv([0x04, 90])).contact, false);
  assert.equal(H.hrParse(dv([0x02, 90])).contact, null, 'бит «контакт есть» без бита «сообщает» — не учитывается');
  /* энергия (кДж) перед RR; RR — в 1/1024 с */
  const r = H.hrParse(dv([0x18, 120, 0x2C, 0x01, 0x00, 0x02, 0x00, 0x04]));
  assert.deepEqual(plain(r), { bpm: 120, contact: null, energy: 300, rr: [500, 1000], wide: false });
  /* 16 бит + контакт + RR */
  assert.deepEqual(plain(H.hrParse(dv([0x17, 0x8C, 0x00, 0xCD, 0x01]))), { bpm: 140, contact: true, energy: null, rr: [450], wide: true });
  /* пульс 0 — показания нет; короткий пакет — не разбирается */
  assert.equal(H.hrParse(dv([0x04, 0])).bpm, null);
  assert.equal(H.hrParse(dv([0x01, 0x50])), null);
  assert.equal(H.hrParse(dv([0x00])), null);
  /* Uint8Array вместо DataView — тоже */
  assert.equal(H.hrParse(Uint8Array.of(0, 64)).bpm, 64);
});

test('an honest line instead of an empty button where Web Bluetooth is missing', () => {
  const bt = { requestDevice() {} };
  const line = 'Пульсометр работает в Chrome и Edge на Android и компьютере.';
  assert.deepEqual(plain(H.hrSupport({ bluetooth: undefined, secure: true })), { ok: false, why: 'browser', line }, 'iPhone, Safari, Firefox');
  assert.equal(H.hrSupport({ bluetooth: {}, secure: true }).ok, false, 'объект без requestDevice — тоже нет');
  assert.match(H.hrSupport({ bluetooth: undefined, secure: false }).line, /^Пульсометр работает в Chrome и Edge на Android и компьютере, по защищённому адресу \(https\)\.$/);
  assert.match(H.hrSupport({ bluetooth: bt, secure: true, policy: false }).line, /встроенного окна.*отдельной вкладкой/, 'iframe без allow="bluetooth"');
  assert.deepEqual(plain(H.hrSupport({ bluetooth: bt, secure: true, policy: true })), { ok: true });
  assert.deepEqual(plain(H.hrSupport({ bluetooth: bt, secure: true, policy: null })), { ok: true }, 'неизвестно — пробуем');
  assert.deepEqual(plain(H.hrSupport({ bluetooth: undefined, secure: false, sim: true })), { ok: true, sim: true }, 'тестовый датчик — везде');
  assert.equal(H.hrSimFlag('?hr=sim'), true); assert.equal(H.hrSimFlag('?a=1&hr=sim#x'), true);
  assert.equal(H.hrSimFlag('?hr=simple'), false); assert.equal(H.hrSimFlag(''), false);
});

test('Web Bluetooth errors become plain words; a closed chooser offers «show all devices»', () => {
  const e = (name, message) => Object.assign(new Error(message), { name });
  assert.deepEqual(plain(H.hrErrorText(e('NotFoundError', 'User cancelled the requestDevice() chooser.'), 'choose')), { text: '', help: true });
  assert.match(H.hrErrorText(e('NotFoundError', 'Bluetooth adapter not available.'), 'choose').text, /Bluetooth выключен/);
  assert.match(H.hrErrorText(e('NotFoundError', 'No Services matching UUID 0000180d found in Device.'), 'connect').text, /нет службы пульса/);
  assert.match(H.hrErrorText(e('SecurityError', 'Access to the feature "bluetooth" is disallowed by permissions policy.'), 'choose').text, /встроенного окна/);
  assert.match(H.hrErrorText(e('NotAllowedError', 'Globally disabled.'), 'choose').text, /запретил Bluetooth/);
  assert.match(H.hrErrorText(e('NetworkError', 'Connection attempt failed.'), 'connect').text, /Не удалось подключиться/);
  assert.ok(H.hrErrorText(new TypeError('x'), 'choose').text, 'неизвестная ошибка — общее сообщение, не текст браузера');
});

/* подменённый Bluetooth и часы: таймеры — вручную */
function fakeTimers() {
  let id = 0; const q = new Map();
  return { setTimeout: (f, ms) => { q.set(++id, { f, ms }); return id; }, clearTimeout: i => q.delete(i), setInterval: () => 0, clearInterval() {},
    pending: () => [...q.values()].map(x => x.ms), async run() { const all = [...q.entries()]; q.clear(); for (const [, x] of all) await x.f(); await new Promise(r => setImmediate(r)); } };
}
function fakeBt({ services = ['heart_rate', 'battery_service'] } = {}) {
  const ev = o => { const l = {}; o.addEventListener = (t, f) => { (l[t] = l[t] || []).includes(f) || l[t].push(f); }; o.removeEventListener = (t, f) => { l[t] = (l[t] || []).filter(x => x !== f); }; o.fire = (t, e) => (l[t] || []).slice().forEach(f => f(e)); o.count = t => (l[t] || []).length; return o; };
  const s = { connected: false, fail: 0, connects: 0, opts: null, notify: 0 };
  const chr = ev({ value: null, async startNotifications() { s.notify++; }, async stopNotifications() { s.notify--; } });
  const err = (name, m) => Object.assign(new Error(m), { name });
  const server = { async getPrimaryService(n) { if (!services.includes(n)) throw err('NotFoundError', 'No Services matching UUID'); return n === 'heart_rate' ? { async getCharacteristic() { return chr; } } : { async getCharacteristic() { return { async readValue() { return dv([64]); } }; } }; } };
  const dev = ev({ name: 'Galaxy Watch Active2', gatt: { get connected() { return s.connected; }, async connect() { s.connects++; if (s.fail > 0) { s.fail--; throw err('NetworkError', 'Connection attempt failed.'); } s.connected = true; return server; }, disconnect() { s.connected = false; } } });
  return { s, chr, dev, bt: { async requestDevice(o) { s.opts = o; if (s.cancel) throw err('NotFoundError', 'User cancelled the requestDevice() chooser.'); return dev; } },
    push(bytes) { chr.value = dv(bytes); chr.fire('characteristicvaluechanged', { target: chr }); },
    drop() { s.connected = false; dev.fire('gattserverdisconnected', { target: dev }); } };
}
const tickMicro = () => new Promise(r => setImmediate(r));

test('connect: the chooser lists heart-rate sensors; readings, no skin contact, battery', async () => {
  const f = fakeBt(), t = fakeTimers(), seen = [];
  let now = 1000;
  const c = H.hrClient({ bluetooth: f.bt, timers: t, now: () => now, onChange: x => seen.push(x.state) });
  assert.equal(await c.choose(false), true);
  assert.deepEqual(plain(f.s.opts), { filters: [{ services: ['heart_rate'] }], optionalServices: ['battery_service'] }, 'в окне выбора — только датчики пульса');
  assert.deepEqual(seen.slice(0, 3), ['choosing', 'connecting', 'waiting']);
  assert.equal(c.c.name, 'Galaxy Watch Active2'); assert.equal(f.s.notify, 1, 'уведомления включены');
  await tickMicro(); await tickMicro();
  assert.equal(c.c.battery, 64, 'батарея прочитана (по желанию)');
  f.push([0x06, 131]); assert.equal(c.c.state, 'live'); assert.equal(c.c.bpm, 131); assert.equal(c.c.at, 1000);
  f.push([0x04, 0]); assert.equal(c.c.state, 'nocontact', 'датчик сообщает: контакта с кожей нет');
  f.push([0x06, 128]); assert.equal(c.c.state, 'live');
  await c.choose(true);
  assert.deepEqual(plain(f.s.opts), { acceptAllDevices: true, optionalServices: ['heart_rate', 'battery_service'] }, '«Показать все устройства»');
  /* без службы пульса — понятная ошибка и подсказка */
  const g = fakeBt({ services: ['battery_service'] }), c2 = H.hrClient({ bluetooth: g.bt, timers: t });
  assert.equal(await c2.choose(false), false);
  assert.equal(c2.c.state, 'error'); assert.match(c2.c.error, /нет службы пульса/); assert.equal(c2.c.help, true);
  /* окно выбора закрыли — тихо, с подсказкой «часов нет в списке» */
  const h = fakeBt(); h.s.cancel = true; const c3 = H.hrClient({ bluetooth: h.bt, timers: t });
  assert.equal(await c3.choose(false), false);
  assert.deepEqual([c3.c.state, c3.c.error, c3.c.help], ['idle', '', true]);
});

test('a dropped link retries the same device by itself; after five failures — «lost»; switching off does not retry', async () => {
  const f = fakeBt(), t = fakeTimers();
  const c = H.hrClient({ bluetooth: f.bt, timers: t });
  await c.choose(false); f.push([0x06, 120]);
  f.drop();
  assert.equal(c.c.state, 'reconnecting'); assert.equal(c.c.attempt, 1); assert.deepEqual(t.pending(), [H.HR_RETRY[0]]);
  assert.equal(c.c.bpm, null, 'пока связи нет — пульса нет');
  await t.run();
  assert.equal(c.c.state, 'waiting', 'переподключился сам, без окна выбора'); assert.equal(c.c.attempt, 0);
  assert.equal(f.chr.count('characteristicvaluechanged'), 1, 'обработчик уведомлений не задвоен');
  f.push([0x06, 118]); assert.equal(c.c.state, 'live');
  /* часы ушли: пять попыток с растущей паузой, потом «потеряна» */
  f.s.fail = 99; f.drop();
  const waits = [];
  for (let i = 0; i < H.HR_RETRY.length; i++) { waits.push(...t.pending()); assert.equal(c.c.state, 'reconnecting'); assert.equal(c.c.attempt, i + 1); await t.run(); }
  assert.deepEqual(waits, plain(H.HR_RETRY));
  assert.equal(c.c.state, 'lost'); assert.deepEqual(t.pending(), []);
  assert.equal(f.s.connects, 2 + H.HR_RETRY.length);
  /* новый выбор после «потеряна» (Galaxy с новым адресом) */
  f.s.fail = 0; await c.choose(false); assert.equal(c.c.state, 'waiting');
  /* отключил человек — без попыток */
  c.stop(); assert.equal(c.c.state, 'off'); f.drop(); assert.equal(c.c.state, 'off'); assert.deepEqual(t.pending(), []);
  assert.equal(f.chr.count('characteristicvaluechanged'), 0, 'обработчик снят');
});

test('the test sensor (?hr=sim) speaks the same protocol: chooser, notifications, drop, no contact', async () => {
  let ph = 'work', iv = null;
  const timers = { setTimeout, clearTimeout, setInterval: (f) => { iv = f; return 1; }, clearInterval: () => { iv = null; } };
  const sim = H.hrSimBluetooth({ phase: () => ph, timers, rand: () => .5 });
  const t = fakeTimers(), c = H.hrClient({ bluetooth: sim, timers: t });
  await c.choose(false);
  assert.equal(c.c.name, 'Тестовый датчик'); assert.equal(c.c.state, 'live', 'первое показание сразу');
  const a = c.c.bpm; for (let i = 0; i < 10; i++) iv(); assert.ok(c.c.bpm > a, 'в подходе пульс растёт');
  ph = 'rest'; const b = c.c.bpm; for (let i = 0; i < 10; i++) iv(); assert.ok(c.c.bpm < b, 'на отдыхе — падает');
  assert.ok(c.c.rr.length === 1 && Math.abs(c.c.rr[0] - 60000 / c.c.bpm) < 10, 'RR-интервал по пульсу');
  sim.sim.contact(false); iv(); assert.equal(c.c.state, 'nocontact');
  sim.sim.contact(true); sim.sim.drop(); assert.equal(c.c.state, 'reconnecting');
  await t.run(); iv(); assert.equal(c.c.state, 'live');
});

test('recording: workout average over time and max, end of set and set max, start and end of rest', () => {
  const day = H.hrDayNew();
  /* показания раз в секунду: 100, 120 (через 1 с), 140 (через 3 с) — средний по времени */
  H.hrAccumulate(day, 100, 1000, 0);
  H.hrAccumulate(day, 120, 2000, 1000);
  H.hrAccumulate(day, 140, 5000, 2000);
  assert.equal(day.t, 5); assert.equal(Math.round(day.avg * 10) / 10, 128); assert.equal(day.max, 140);
  /* разрыв больше HR_LIVE.gap — в счёт идёт не больше gap секунд */
  H.hrAccumulate(day, 90, 65000, 5000);
  assert.equal(day.t, 5 + H.HR_LIVE.gap); assert.equal(day.max, 140);
  H.hrAccumulate(day, 0, 66000, 65000); assert.equal(day.t, 5 + H.HR_LIVE.gap, 'ноль — не показание');
  assert.deepEqual(plain(H.hrSummary(day)), { avg: Math.round(day.avg), max: 140 });
  assert.equal(H.hrSummary(H.hrDayNew()), null, 'без пульса — в журнале ничего');
  /* подход: пульс в конце и максимум (максимум не меньше конца) */
  H.hrSetDone(day, 'bbbench:0', 142, 151);
  H.hrSetDone(day, 'bbbench:1', 150, 0);
  H.hrSetDone(day, 'bbbench:2', null, 149);
  H.hrSetDone(day, 'bbbench:3', null, 0);
  assert.deepEqual(plain(day.sets), { 'bbbench:0': [142, 151], 'bbbench:1': [150, 150], 'bbbench:2': [null, 149] });
  /* отдых после подхода: в начале и в конце */
  H.hrRestDone(day, 'bbbench:0', 142, 108);
  H.hrRestDone(day, 'bbbench:1', null, 112);
  H.hrRestDone(day, 'bbbench:2', null, null);
  assert.deepEqual(plain(day.rests), { 'bbbench:0': [142, 108], 'bbbench:1': [null, 112] });
  assert.equal(H.hrKey({ it: { ex: { id: 'dbrow' } }, k: 3 }), 'dbrow:3');
});

test('stored heart data is checked and merged by date like the journal', () => {
  const days = H.hrCleanDays({ '2026-11-10': { t: 1800.04, avg: 126.44, max: 171, sets: { 'squat:0': [150, 160], 'bad key': [1, 2], 'squat:1': [0, 500] }, rests: { 'squat:0': ['140', 105] } },
    'не дата': { t: 1, avg: 1, max: 1 }, '2026-11-11': { t: 'x', max: 0 }, '2026-11-12': null });
  assert.deepEqual(plain(days), { '2026-11-10': { t: 1800, avg: 126.4, max: 171, sets: { 'squat:0': [150, 160] }, rests: { 'squat:0': [140, 105] } } });
  const a = { '2026-11-10': { t: 600, avg: 120, max: 160, sets: { 'squat:0': [150, 160] }, rests: {} } };
  const b = { '2026-11-10': { t: 1200, avg: 130, max: 170, sets: { 'squat:1': [155, 165] }, rests: { 'squat:0': [150, 110] } }, '2026-11-11': { t: 60, avg: 100, max: 110, sets: {}, rests: {} } };
  const m = H.hrMergeDays(a, b);
  assert.deepEqual(plain(m['2026-11-10']), { t: 1200, avg: 130, max: 170, sets: { 'squat:0': [150, 160], 'squat:1': [155, 165] }, rests: { 'squat:0': [150, 110] } }, 'основа — день, где пульса дольше; подходы из обоих');
  assert.ok(m['2026-11-11']);
});

test('rest «until heart rate»: by heart rate, or by plan / heart rate — whichever comes first; without pulse — by time', () => {
  const step = (st, o) => plain(H.hrRestStep(st, { thr: 110, now: 10000, until: 70000, ...o }));
  /* по времени — пульс только показывается */
  assert.deepEqual(step({}, { mode: 'time', bpm: 90, at: 1 }), { act: null, until: 70000, why: 'time' });
  /* порог не задан — по времени */
  assert.equal(step({}, { mode: 'hr', thr: null, bpm: 90, at: 1 }).why, 'nothr');
  /* ниже порога — два показания подряд (одно случайное не считается); тот же момент показания не считается дважды */
  let st = {};
  assert.equal(step(st, { mode: 'first', bpm: 105, at: 1 }).act, null);
  assert.equal(step(st, { mode: 'first', bpm: 105, at: 1 }).act, null, 'тот же показ — не второе');
  assert.equal(step(st, { mode: 'first', bpm: 118, at: 2 }).act, null, 'выше — счёт сначала');
  assert.equal(step(st, { mode: 'first', bpm: 104, at: 3 }).act, null);
  assert.deepEqual(step(st, { mode: 'first', bpm: 103, at: 4 }), { act: 'end', until: 10100, why: 'below' }, 'отдых кончается раньше плана');
  assert.equal(step(st, { mode: 'first', bpm: 130, at: 5 }).act, null, 'кончился — больше не двигается');
  /* «что раньше»: к концу плана пульс выше — отдых по плану, без продления */
  st = {};
  assert.equal(step(st, { mode: 'first', bpm: 125, at: 1, now: 69500 }).act, null);
  assert.equal(step(st, { mode: 'first', bpm: 125, at: 2, now: 70000 }).why, 'timeup');
  /* «по пульсу»: к концу плана пульс выше — продление на 15 с, и снова; потом пульс опустился — конец */
  st = {};
  let r = step(st, { mode: 'hr', bpm: 125, at: 1, now: 69200 });
  assert.deepEqual(r, { act: 'extend', until: 70000 + H.HR_REST.step * 1000, why: 'extended' });
  r = step(st, { mode: 'hr', bpm: 121, at: 2, now: 84100, until: 85000 });
  assert.equal(r.act, 'extend'); assert.equal(r.until, 100000);
  assert.equal(step(st, { mode: 'hr', bpm: 108, at: 3, now: 90000, until: 100000 }).act, null);
  assert.deepEqual(step(st, { mode: 'hr', bpm: 107, at: 4, now: 91000, until: 100000 }), { act: 'end', until: 91100, why: 'below' });
  /* «по пульсу» и пульс сразу ниже порога — отдых кончается раньше плана */
  st = {};
  step(st, { mode: 'hr', bpm: 98, at: 1 }); assert.equal(step(st, { mode: 'hr', bpm: 97, at: 2 }).act, 'end');
  /* нет пульса (обрыв, нет контакта) — без продления, отдых по времени */
  st = {};
  assert.deepEqual(step(st, { mode: 'hr', bpm: null, at: 1, now: 69500 }), { act: null, until: 70000, why: 'nohr' });
  assert.equal(step(st, { mode: 'hr', bpm: null, at: 1, now: 70000 }).why, 'timeup');
});

test('heart settings are remembered; the threshold has no default number', () => {
  assert.deepEqual(plain(H.Heart.prefs()), { rest: 'time', thr: null, age: null }, 'по умолчанию — отдых по времени, порога и возраста нет');
  H.Heart.setPrefs({ rest: 'first', thr: 112 });
  assert.deepEqual(plain(H.Heart.prefs()), { rest: 'first', thr: 112, age: null });
  H.Heart.setPrefs({ rest: 'бег', thr: 5 });
  assert.deepEqual(plain(H.Heart.prefs()), { rest: 'time', thr: null, age: null }, 'неверное не принимается');
  /* порог — не выше 190 (было до 250: «почти без отдыха»), возраст — 10…100 */
  H.Heart.setPrefs({ thr: 200, age: 64 }); assert.deepEqual(plain(H.Heart.prefs()), { rest: 'time', thr: null, age: 64 });
  H.Heart.setPrefs({ thr: 190, age: 300 }); assert.deepEqual(plain(H.Heart.prefs()), { rest: 'time', thr: 190, age: null });
  assert.equal(H.HR_THR.max, 190);
});

test('very high heart rate: above the age-predicted maximum (Tanaka 2001: 208 − 0.7 × age), without age — above 195', () => {
  assert.equal(H.hrMaxFor(60), 166); assert.equal(H.hrMaxFor(20), 194); assert.equal(H.hrMaxFor(null), null);
  assert(H.hrTooHigh(170, 60) && !H.hrTooHigh(160, 60), '60 years: above 166');
  assert(H.hrTooHigh(200, null) && !H.hrTooHigh(190, null), 'no age: above 195 for any adult');
  assert.equal(H.HR_HIGH_ANY, Math.floor(208 - 0.7 * 18), 'the predicted maximum already at 18');
});

test('rest «until heart rate» is never shorter than the minimum: a minute (or the plan), the whole plan in «Easy»', () => {
  const step = (st, o) => plain(H.hrRestStep(st, { thr: 110, now: 10000, until: 100000, mode: 'hr', ...o }));
  let st = {};
  step(st, { bpm: 90, at: 1, floorAt: 60000 });
  assert.deepEqual(step(st, { bpm: 90, at: 2, floorAt: 60000 }), { act: 'end', until: 60000, why: 'floor' }, 'below the threshold at 10 s — rest still ends at the minimum');
  st = {}; step(st, { bpm: 90, at: 1, now: 70000, floorAt: 60000 });
  assert.deepEqual(step(st, { bpm: 90, at: 2, now: 70000, floorAt: 60000 }), { act: 'end', until: 70100, why: 'below' }, 'after the minimum — right away');
  assert.equal(H.restFloor(90, false), 60); assert.equal(H.restFloor(40, false), 40, 'a shorter plan is the minimum itself');
  assert.equal(H.restFloor(90, true), 90, '«Easy»: heart rate only extends rest');
});
