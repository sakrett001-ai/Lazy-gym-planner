/* Таймеры подхода: отдых и удержания по меткам времени (src/js/12a-set-timers.js) и поле фактического отдыха в журнале. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {loadModel} = require('./biomechanics-audit');
const root = path.resolve(__dirname, '..');

/* чистые расчёты — без страницы: файл исполняется сам по себе */
function timers() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/js/12a-set-timers.js'), 'utf8'), ctx, {filename:'12a-set-timers.js'});
  return vm.runInContext('({REST_SIGNAL, HOLD, clockText, restView, restSignals, restDue, restLastAt, restAdjust, restActual, restField, holdTarget, holdNew, holdState, holdPress, holdCues, holdText})', ctx);
}
const T = timers();
const plain = v => JSON.parse(JSON.stringify(v));

test('rest countdown rounds up to the zero moment, then counts overtime up', () => {
  const end = 100000;
  assert.deepEqual(plain(T.restView(end, end - 90000)), {over:false, left:90, extra:0, text:'1:30'});
  assert.equal(T.restView(end, end - 1).text, '0:01', 'последняя миллисекунда — ещё «0:01», а не ноль');
  assert.deepEqual(plain(T.restView(end, end)), {over:true, left:0, extra:0, text:'+0:00'});
  assert.equal(T.restView(end, end + 25400).text, '+0:25');
  assert.equal(T.restView(end, end + 61000).text, '+1:01');
  assert.equal(T.clockText(605), '10:05');
});

test('persistent signal repeats every 20 s at most three times; «once» rings only at zero', () => {
  const end = 1e6;
  assert.deepEqual(plain(T.restSignals(end, {mode:'persist', from:end - 90000})),
    [{at:end, kind:'end'}, {at:end + 20000, kind:'repeat'}, {at:end + 40000, kind:'repeat'}, {at:end + 60000, kind:'repeat'}]);
  assert.deepEqual(plain(T.restSignals(end, {mode:'once', from:end - 90000})), [{at:end, kind:'end'}]);
  assert.equal(T.restSignals(end).length, 1, 'по умолчанию — один раз (настойчивый — по выбору; прежним пользователям 12b-rest-alarm.js оставляет их значение)');
  assert.equal(T.restLastAt(T.restSignals(end, {mode:'persist'})), end + 60000);
  assert.equal(T.restLastAt(T.restSignals(end, {mode:'once'})), end);
});

test('soft warning 10 s before the end only when enabled and the rest is longer than 15 s', () => {
  const end = 1e6;
  assert.deepEqual(plain(T.restSignals(end, {mode:'once', warn:true, from:end - 60000})), [{at:end - 10000, kind:'warn'}, {at:end, kind:'end'}]);
  assert.equal(T.restSignals(end, {mode:'once', warn:false, from:end - 60000}).length, 1, 'выключено по умолчанию');
  assert.equal(T.restSignals(end, {mode:'once', warn:true, from:end - 15000}).length, 1, 'отдых 15 с — без предупреждения');
});

test('due signals are taken by timestamps; signals missed while the page slept are not replayed', () => {
  const end = 1e6, sig = T.restSignals(end, {mode:'persist', from:end - 60000}), fired = sig.map(() => false);
  assert.deepEqual(plain(T.restDue(sig, fired, end - 1)), []);
  assert.deepEqual(plain(T.restDue(sig, fired, end + 300)), [{i:0, kind:'end', late:false}]);
  fired[0] = true;
  /* страница спала 50 с: оба наступивших повтора опоздали — подаются «молча» */
  assert.deepEqual(plain(T.restDue(sig, fired, end + 50000)), [{i:1, kind:'repeat', late:true}, {i:2, kind:'repeat', late:true}]);
  const late = T.restDue(sig, [true, false, false, false], end + 41000);
  assert.deepEqual(plain(late.map(d => [d.i, d.late])), [[1, true], [2, false]]);
});

test('±15 s moves the end during rest; after zero +15 counts from now and −15 does nothing', () => {
  const end = 1e6;
  assert.equal(T.restAdjust(end, end - 30000, 15), end + 15000);
  assert.equal(T.restAdjust(end, end - 30000, -15), end - 15000);
  assert.equal(T.restAdjust(end, end - 10000, -15), end - 10000, 'не раньше «сейчас»');
  assert.equal(T.restAdjust(end, end + 25000, 15), end + 40000, '+15 после нуля — ещё 15 с от текущего момента');
  assert.equal(T.restAdjust(end, end + 25000, -15), end);
});

test('actual rest is whole seconds from the logged set to the next one; breaks over 30 min are not rest', () => {
  assert.equal(T.restActual(1e6, 1e6 + 104400), 104);
  assert.equal(T.restActual(1e6, 1e6 + 30 * 60000), 1800);
  assert.equal(T.restActual(1e6, 1e6 + 30 * 60000 + 1000), null);
  assert.equal(T.restActual(0, 5000), null, 'нет начала отдыха');
  assert.equal(T.restActual(1e6, 1e6 - 1), null);
  assert.equal(T.restActual(1e6, 1e6 + 300), null, 'меньше секунды');
  for (const v of [90, '90']) assert.equal(T.restField(v), 90);
  for (const v of [undefined, null, '', 0, -5, 1.5, 1801, 'x', [90]]) assert.equal(T.restField(v), null, String(v));
});

test('hold target: lower bound of the plan, or the journal progression capped at the top + 10 s', () => {
  assert.deepEqual(plain(T.holdTarget('30–45 с')), {sec:30, lo:30, hi:45, from:'plan'});
  assert.deepEqual(plain(T.holdTarget('20–30 с', undefined)), {sec:20, lo:20, hi:30, from:'plan'});
  assert.equal(T.holdTarget('30–45 с', 39).sec, 39);
  assert.equal(T.holdTarget('30–45 с', 39).from, 'log');
  assert.equal(T.holdTarget('30–45 с', 55).sec, 55, 'все подходы на верхней границе — на 10 с дольше');
  assert.equal(T.holdTarget('30–45 с', 90).sec, 55, 'не выше верхней границы + 10 с');
  assert.equal(T.holdTarget('30–45 с', 25).sec, 30, 'ниже плана — цель плана');
  assert.equal(T.holdTarget('30–45 с', '').sec, 30);
  assert.equal(T.holdTarget('45 с').sec, 45);
  assert.equal(T.holdTarget('').sec, 30, 'неразборчивый план — 30 с');
});

test('hold timer: 3-2-1, countdown to the target, then overtime; Stop records whole seconds', () => {
  const t0 = 5e6, h = T.holdNew(t0, 30);
  assert.deepEqual(plain(T.holdState(h, t0)), {phase:'lead', side:0, count:3, results:[]});
  assert.equal(T.holdState(h, t0 + 2100).count, 1);
  const s0 = t0 + 3000;
  assert.deepEqual(plain(T.holdState(h, s0)), {phase:'hold', side:0, mode:'to', left:30, elapsed:0, results:[]});
  assert.equal(T.holdState(h, s0 + 29999).left, 1);
  assert.deepEqual(plain(T.holdState(h, s0 + 37400)), {phase:'hold', side:0, mode:'over', over:7, elapsed:37, results:[]});
  const r = T.holdPress(h, s0 + 37400);
  assert.equal(r.action, 'done');
  assert.deepEqual(plain(T.holdState(r.h, s0 + 99999)), {phase:'done', side:0, results:[37], value:37});
  assert.equal(h.stops.length, 0, 'нажатие не меняет прежнее состояние');
});

test('Start pressed by mistake: the button cancels during 3-2-1', () => {
  const h = T.holdNew(0, 30), r = T.holdPress(h, 1500);
  assert.equal(r.action, 'cancel'); assert.equal(r.h, null);
});

test('side plank: left → 10 s pause → right in one set; the weaker side is recorded', () => {
  const t0 = 1e6, s0 = t0 + 3000;
  let h = T.holdNew(t0, 30, 2), r = T.holdPress(h, s0 + 42300);
  assert.equal(r.action, 'side'); h = r.h;
  assert.deepEqual(plain(T.holdState(h, s0 + 42300)), {phase:'switch', side:1, count:10, results:[42]});
  const s1 = s0 + 42300 + 10000;
  assert.equal(T.holdState(h, s1 - 2500).count, 3);
  assert.deepEqual(plain(T.holdState(h, s1 + 5000)), {phase:'hold', side:1, mode:'to', left:25, elapsed:5, results:[42]});
  r = T.holdPress(h, s1 + 38900); assert.equal(r.action, 'done');
  assert.deepEqual(plain(T.holdState(r.h, s1 + 40000)), {phase:'done', side:1, results:[42, 38], value:38});
});

test('side plank: the right side can start at once instead of waiting out the pause', () => {
  const t0 = 0, s0 = 3000;
  let h = T.holdPress(T.holdNew(t0, 20, 2), s0 + 25000).h;
  const r = T.holdPress(h, s0 + 27000);
  assert.equal(r.action, 'skip'); h = r.h;
  assert.deepEqual(plain(T.holdState(h, s0 + 27000 + 20000)), {phase:'hold', side:1, mode:'over', over:0, elapsed:20, results:[25]});
});

test('hold sounds: ticks 3-2-1, «go», target reached; Stop before the target drops its signal', () => {
  const h = T.holdNew(0, 30);
  assert.deepEqual(plain(T.holdCues(h)), [{at:0, kind:'tick'}, {at:1000, kind:'tick'}, {at:2000, kind:'tick'}, {at:3000, kind:'go'}, {at:33000, kind:'end'}]);
  const two = T.holdPress(T.holdNew(0, 30, 2), 3000 + 20000).h; /* левая остановлена раньше цели */
  const cues = T.holdCues(two);
  assert(!cues.some(c => c.kind === 'end' && c.at === 33000), 'сигнал цели левой снят');
  const s1 = 23000 + 10000;
  assert.deepEqual(plain(cues.slice(-5)), [{at:s1 - 3000, kind:'tick'}, {at:s1 - 2000, kind:'tick'}, {at:s1 - 1000, kind:'tick'}, {at:s1, kind:'go'}, {at:s1 + 30000, kind:'end'}]);
  const skipped = T.holdPress(two, 25000).h;
  assert.deepEqual(plain(T.holdCues(skipped).slice(-2)), [{at:25000, kind:'go'}, {at:55000, kind:'end'}]);
});

test('hold time text: seconds, minutes from 60 s, plus sign over the target', () => {
  assert.equal(T.holdText(23), '23 с');
  assert.equal(T.holdText(7, true), '+7 с');
  assert.equal(T.holdText(65), '1:05');
  assert.equal(T.holdText(75, true), '+1:15');
});

/* журнал: подход [кг, повторы] и [кг, повторы, отдых] — оба читаются, копия и таблица их сохраняют */
function appModel() {
  const m = loadModel({fullApp:true});
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  return m.get('({LOG, suggest, previewItem, backupObject, restoreBackup, validSessions, csvText, mergeSessions})');
}
test('log accepts sets with and without the rest field; backup keeps a valid rest and drops a broken one', () => {
  const a = appModel();
  const old = [{d:'2000-01-01', s:[[60, 8], [60, 8]]}], fresh = [{d:'2000-01-02', s:[[60, 9, 95], [60, 8, 120], null, [62.5, 6]]}];
  assert(a.validSessions(old) && a.validSessions(fresh));
  a.LOG.data = {bbbench:[...old, ...fresh]};
  const copy = JSON.parse(JSON.stringify(a.backupObject()));
  a.LOG.data = {}; a.restoreBackup(copy);
  assert.deepEqual(plain(a.LOG.data.bbbench), [...old, ...fresh]);
  a.LOG.data = {}; a.restoreBackup({v:1, log:{bbbench:[{d:'2000-01-03', s:[[60, 8, 'x'], [60, 8, -3], [60, 8, 99999], [60, 7, 90]]}]}});
  assert.deepEqual(plain(a.LOG.data.bbbench[0].s), [[60, 8], [60, 8], [60, 8], [60, 7, 90]], 'неверный отдых отброшен, подход остался');
});
test('suggestions ignore the rest field, CSV gets a rest column', () => {
  const a = appModel(), item = {...a.previewItem('bbbench'), eqIds:['bb']};
  /* вчерашняя запись: после долгого перерыва совет — сниженный вес (layoffInfo, 15-autoreg.js), здесь проверяется поле отдыха */
  const y = new Date(Date.now() - 864e5), yd = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  a.LOG.data = {bbbench:[{d:yd, target:4, s:[[60, 10], [60, 10], [60, 10], [60, 10]]}]};
  const advice = () => { const {prev, ...rest} = plain(a.suggest(item)); return rest; }, before = advice();
  a.LOG.data = {bbbench:[{d:yd, target:4, s:[[60, 10, 90], [60, 10, 95], [60, 10, 100], [60, 10]]}]};
  assert.equal(before.tone, 'up'); assert.deepEqual(advice(), before);
  const rows = a.csvText().replace(/^﻿/, '').split('\r\n').map(r => r.split(';'));
  const rest = rows[0].indexOf('Отдых после подхода, с');
  assert.equal(rest, 7, 'столбец отдыха на прежнем месте; новые столбцы (стороны, общий вес) — после него');
  assert.deepEqual(rows.slice(1).map(r => r[rest]), ['90', '95', '100', '']);
  assert(rows.every(r => r.length === rows[0].length));
});
