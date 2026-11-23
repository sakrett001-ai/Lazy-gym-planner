'use strict';
/* Вес гантелей и стороны (src/js/13a-sets.js): число снарядов и режим сторон в каталоге, подпись веса, общий вес
   подхода (тоннаж) по всем режимам, левая и правая сторона отдельно (Л/П) — слабая сторона в основных полях,
   проверка поля сторон, резервная копия, таблица для Excel и совместимость со старыми записями. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadModel} = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const strip = html => String(html).replace(/<[^>]+>/g, '');

function app() {
  const m = loadModel({fullApp:true});
  m.get('renderSetup=()=>{}; renderPlan=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S, EX, EXI, LOG, LOWER_G, SIDE_MODES, sidesOf, perSide, armsAlternate, defaultImpl, itemImpl, sessionImpl, implChoices,
    impCount, impPerRep, weightLabel, pairTotalText, sidePair, weakSide, setSides, makeSidedSet, cleanSet, setTonnage, sessionTonnage,
    dayTonnage, trainingDays, fmtTon, setText, setsText, weakSideNote, lrOn, lrSet, cleanLr, csvText, backupObject, restoreBackup,
    validSessions, mergeSessions, suggest, previewItem, muscleLoad, todayKey, histHtml, available, effEquip, chosenEquip, propHas})`);
  a.LOG.data = {};
  /* карточка плана с выбранным инвентарём (как в плане: eqIds — выбранное, has — по желанию) */
  a.item = (id, equip = ['db', 'kb', 'bb', 'bench', 'incline']) => { const ex = a.EXI[id], E = a.effEquip(equip); return {...a.previewItem(id), eqIds:a.chosenEquip(ex, E), has:a.propHas(ex, E)}; };
  return a;
}
const A = app();
const has = (ex, id) => ex.eq.some(g => g.includes(id)) || (ex.opt || []).includes(id);

/* ---------- каталог ---------- */
test('каталог: у каждого упражнения с гантелями или гирей — число снарядов и режим сторон, согласованный с uni', () => {
  const free = A.EX.filter(ex => has(ex, 'db') || has(ex, 'kb'));
  assert(free.length >= 30, 'упражнений с гантелями и гирей не меньше 30');
  for (const ex of free) {
    assert([1, 2].includes(ex.imp), `${ex.id}: imp — 1 или 2`);
    assert(A.SIDE_MODES.includes(ex.sides), `${ex.id}: sides — both, alt или one`);
    assert.equal(!!ex.uni, ex.sides !== 'both', `${ex.id}: uni (повторы на каждую сторону) — ровно у alt и one`);
  }
  /* у остальных — стороны по uni, снаряд один */
  for (const ex of A.EX.filter(ex => !has(ex, 'db') && !has(ex, 'kb'))) {
    assert.equal(ex.imp, undefined, ex.id + ': imp только у гантелей и гири');
    assert.equal(A.sidesOf(ex), ex.uni ? 'one' : 'both', ex.id);
  }
  /* решения по технике */
  const want = {dbbench:[2, 'both'], dbrow:[1, 'one'], goblet:[1, 'both'], lunge:[2, 'one'], kbswing:[1, 'both'], farmer:[2, 'both'],
    dbcurl:[2, 'alt'], hammer:[2, 'both'], revlunge:[2, 'alt'], ohext:[1, 'both'], pullover:[1, 'both'], concentration:[1, 'one'],
    kickback:[1, 'one'], sidebend:[1, 'one'], sllift:[1, 'one'], bulgarian:[2, 'one'], stepup:[2, 'one'], rdl:[2, 'both'], calfraise:[2, 'both']};
  for (const [id, [n, sides]] of Object.entries(want)) assert.deepEqual([A.EXI[id].imp, A.EXI[id].sides], [n, sides], id);
  /* попеременно: у сгибаний чередуются руки, у выпадов — ноги */
  assert.equal(A.armsAlternate(A.EXI.dbcurl), true);
  assert.equal(A.armsAlternate(A.EXI.revlunge), false);
  assert.equal(A.sidesOf(A.EXI.sideplank), 'one', 'боковая планка — одна сторона за раз');
  assert.equal(A.perSide(A.EXI.bbbench), false);
});

test('снаряд: выбранный инвентарь карточки, поле eq записи, по умолчанию — первый из списка', () => {
  assert.equal(A.defaultImpl(A.EXI.rdl), 'bb', 'румынская тяга без отметки — штанга, как в полном зале');
  assert.equal(A.defaultImpl(A.EXI.goblet), 'db');
  assert.equal(A.defaultImpl(A.EXI.lunge), 'db', 'гантели по желанию: прежние записи — гантели');
  assert.equal(A.defaultImpl(A.EXI.latpull), null);
  assert.equal(A.itemImpl(A.item('rdl', ['db'])), 'db');
  assert.equal(A.itemImpl(A.item('rdl', ['bb', 'db'])), 'bb');
  assert.equal(A.itemImpl(A.item('goblet', ['kb'])), 'kb');
  assert.equal(A.itemImpl(A.item('lunge', ['db'])), 'db');
  assert.equal(A.itemImpl(A.item('lunge', [])), 'x', 'без гантелей в месте — доп. вес другим снарядом');
  assert.equal(A.sessionImpl(A.EXI.rdl, {eq:'db'}), 'db');
  assert.equal(A.sessionImpl(A.EXI.rdl, {}), 'bb');
  assert.equal(A.sessionImpl(A.EXI.dbbench, {eq:'bb'}), 'db', 'снаряд, которого у упражнения нет, не принимается');
  assert.equal(A.sessionImpl(A.EXI.dbbench, {eq:'zz'}), 'db');
});

/* ---------- подпись веса ---------- */
test('подпись веса: одна гантель из двух, одна гиря, штанга и тренажёр — общий вес; «×2 = 40 кг»', () => {
  const L = (id, eq) => { const w = A.weightLabel(A.item(id, eq)); return w && [w.full, w.n]; };
  assert.deepEqual(L('dbbench', ['db', 'bench']), ['Вес одной гантели, кг', 2]);
  assert.deepEqual(L('dbrow', ['db', 'bench']), ['Вес гантели, кг', 1]);
  assert.deepEqual(L('goblet', ['db']), ['Вес гантели, кг', 1]);
  assert.deepEqual(L('goblet', ['kb']), ['Вес гири, кг', 1]);
  assert.deepEqual(L('farmer', ['kb']), ['Вес одной гири, кг', 2]);
  assert.deepEqual(L('kbswing', ['kb']), ['Вес гири, кг', 1]);
  assert.deepEqual(L('rdl', ['bb']), ['Вес, кг', 1], 'штанга — общий вес');
  assert.deepEqual(L('rdl', ['db']), ['Вес одной гантели, кг', 2]);
  assert.deepEqual(L('lunge', ['db']), ['Вес одной гантели, кг', 2]);
  /* 4.112: «Доп. вес» — полным словом, «Дополнительный вес» (Галина 10: сокращение непонятно) */
  assert.deepEqual(L('lunge', []), ['Дополнительный вес, кг', 1]);
  assert.deepEqual(L('latpull', ['cable']), ['Вес, кг', 1]);
  assert.deepEqual(L('assistpull', ['gravitron']), ['Противовес, кг', 1]);
  assert.equal(L('bandextrot', ['band']), null, 'резинка — без веса');
  assert.equal(A.pairTotalText(2, 20), '×2 = 40 кг');
  assert.equal(A.pairTotalText(2, 12.5), '×2 = 25 кг');
  assert.equal(A.pairTotalText(1, 20), '');
  assert.equal(A.pairTotalText(2, null), '');
});

/* ---------- общий вес ---------- */
test('общий вес подхода: вес × повторы × снарядов в повторе × сторон — по всем режимам', () => {
  const T = (id, x, impl) => A.setTonnage(A.EXI[id], x, impl);
  assert.equal(T('dbbench', [20, 10]), 400, 'жим 2 × 20 кг × 10');
  assert.equal(T('dbrow', [30, 10]), 600, 'тяга одной рукой 30 кг по 10 на сторону');
  assert.equal(T('goblet', [24, 10]), 240, 'гоблет 24 кг × 10');
  assert.equal(T('goblet', [24, 10], 'kb'), 240, 'гоблет с гирей');
  assert.equal(T('dbcurl', [12, 10]), 240, 'попеременные сгибания 2 × 12 кг по 10 на руку');
  assert.equal(T('revlunge', [10, 10]), 400, 'обратные выпады с 2 × 10 кг по 10 на ногу: гантели поднимаются в каждом повторе');
  assert.equal(T('lunge', [10, 10]), 400, 'сплит-приседания с двумя гантелями, по 10 на ногу');
  assert.equal(T('lunge', [10, 10], 'x'), 200, 'жилет 10 кг, по 10 на ногу');
  assert.equal(T('lunge', [null, 10]), 0, 'без гантелей — вес тела, не считается');
  assert.equal(T('kbswing', [16, 15]), 240);
  assert.equal(T('sllift', [20, 8]), 320, 'одна гантель, по 8 на ногу');
  assert.equal(T('bbbench', [100, 5]), 500, 'штанга — общий вес');
  assert.equal(T('rdl', [60, 10]), 600, 'румынская тяга без отметки — штанга');
  assert.equal(T('rdl', [20, 10], 'db'), 400, 'румынская тяга с гантелями');
  assert.equal(T('cablelat', [10, 12]), 240, 'блок одной рукой: стек × повторы × 2 стороны');
  assert.equal(T('latpull', [50, 10]), 500);
  assert.equal(T('pullup', [null, 8]), 0, 'подтягивания без доп. веса — 0');
  assert.equal(T('pullup', [10, 8]), 80, 'с поясом 10 кг — только доп. вес');
  assert.equal(T('assistpull', [30, 8]), 0, 'противовес гравитрона облегчает — не считается');
  assert.equal(T('plank', [10, 60]), 0, 'удержание на время');
  assert.equal(T('farmer', [24, 30]), 0, 'дистанция');
  assert.equal(T('bandextrot', [null, 15]), 0, 'резинка');
  /* Л/П — сумма сторон */
  assert.equal(T('dbrow', [30, 8, null, {l:[30, 10], r:[30, 8]}]), 540);
  assert.equal(T('bulgarian', [12, 8, null, {l:[12, 10], r:[12, 8]}]), 432, 'две гантели по 12 кг: (10 + 8) × 12 × 2');
  assert.equal(T('dbcurl', [12, 8, 90, {l:[12, 10], r:[12, 8]}]), 216, 'у каждой руки своя гантель');
  assert.equal(T('sideplank', [null, 35, null, {l:[null, 42], r:[null, 35]}]), 0);
  /* запись и день */
  const s = {d:'2026-10-01', eq:'db', s:[[20, 10], null, [20, 8, 95]]};
  assert.equal(A.sessionTonnage(A.EXI.dbbench, s), 720);
  assert.equal(A.sessionTonnage(A.EXI.rdl, {d:'2026-10-01', eq:'db', s:[[20, 10]]}), 400);
  assert.equal(A.sessionTonnage(A.EXI.rdl, {d:'2026-10-01', s:[[60, 10]]}), 600);
  const data = {dbbench:[s], dbrow:[{d:'2026-10-01', s:[[30, 10]]}], pushup:[{d:'2026-10-01', s:[[null, 20]]}], goblet:[{d:'2026-09-30', s:[[24, 10]]}]};
  assert.equal(A.dayTonnage('2026-10-01', data), 1320);
  assert.deepEqual(plain(A.trainingDays(data)['2026-10-01']), {d:'2026-10-01', ex:3, sets:4, t:1320});
  assert.equal(A.fmtTon(4320), '4 320');
  assert.equal(A.fmtTon(999.6), '1 000');
});

/* ---------- слабая сторона ---------- */
test('слабая сторона: по расчётному максимуму; без веса, у удержаний и противовеса — по повторам; поровну — левая', () => {
  const W = (id, l, r) => A.weakSide(l, r, A.EXI[id]);
  assert.equal(W('dbrow', [30, 10], [30, 8]), 'r');
  assert.equal(W('dbrow', [30, 10], [32, 6]), 'r', 'e1RM 40 против 38,4: правая слабее, хоть вес больше');
  assert.equal(W('dbrow', [28, 12], [30, 8]), 'r', '28 × 12 (39,2) сильнее 30 × 8 (38)');
  assert.equal(W('dbrow', [30, 8], [30, 8]), 'l', 'поровну — левая');
  assert.equal(W('dbrow', [30, 13], [30, 15]), 'l', 'расчётный максимум ограничен 12 повторами — дальше по повторам');
  assert.equal(W('pistolbox', [null, 8], [null, 6]), 'r', 'вес тела — по повторам');
  assert.equal(W('lunge', [null, 10], [12, 10]), 'l', 'вес только у одной стороны — по повторам, затем по весу');
  assert.equal(W('sideplank', [null, 42], [null, 38]), 'r', 'удержание — по секундам');
  assert.equal(W('sideplank', [5, 30], [null, 40]), 'l');
});

/* ---------- поле сторон ---------- */
test('поле сторон: старые записи, с отдыхом и без, с Л/П, мусор — подход читается, неверные стороны отбрасываются', () => {
  const ex = A.EXI.dbrow, sd = x => plain(A.setSides(x, ex));
  assert.equal(sd([30, 10]), null, 'старая запись');
  assert.equal(sd([30, 10, 90]), null, 'с отдыхом');
  assert.deepEqual(sd([30, 8, null, {l:[30, 10], r:[30, 8]}]), {l:[30, 10], r:[30, 8], weak:'r'});
  assert.deepEqual(sd([30, 8, 120, {l:[30, 10], r:[30, 8]}]), {l:[30, 10], r:[30, 8], weak:'r'}, 'с отдыхом и Л/П');
  assert.deepEqual(sd([30, 8, null, {l:['30', '10'], r:[30, 8]}]), {l:[30, 10], r:[30, 8], weak:'r'}, 'числа строкой');
  for (const bad of [{l:'x', r:[30, 8]}, {l:[30], r:[30, 8]}, {l:[-1, 10], r:[30, 8]}, {l:[30, 0], r:[30, 8]}, {l:[30, 10]}, [[30, 10], [30, 8]], 'Л/П', 7, null])
    assert.equal(sd([30, 8, null, bad]), null, 'мусор: ' + JSON.stringify(bad));
  assert.equal(sd([30, 10, null, {l:[30, 10], r:[30, 8]}]), null, 'основные поля — не слабая сторона (старая версия исправила подход): стороны не верны');
  assert.equal(sd([32, 8, null, {l:[30, 10], r:[30, 8]}]), null);
  assert.equal(A.setSides([100, 5, null, {l:[100, 5], r:[100, 5]}], A.EXI.bbbench), null, 'у двусторонних упражнений сторон нет');
  /* запись подхода из двух сторон: основные поля — слабая, отдых — если есть */
  assert.deepEqual(plain(A.makeSidedSet([30, 10], [30, 8], ex)), [30, 8, null, {l:[30, 10], r:[30, 8]}]);
  assert.deepEqual(plain(A.makeSidedSet([28, 12], [30, 8], ex, 95)), [30, 8, 95, {l:[28, 12], r:[30, 8]}]);
  assert.deepEqual(plain(A.makeSidedSet([null, 42], [null, 38], A.EXI.sideplank)), [null, 38, null, {l:[null, 42], r:[null, 38]}]);
  assert.equal(A.makeSidedSet([30, 0], [30, 8], ex), null);
  /* очистка подхода (копия): неверный отдых и неверные стороны отбрасываются, подход остаётся */
  const C = v => plain(A.cleanSet(v, ex));
  assert.deepEqual(C([30, 10]), [30, 10]);
  assert.deepEqual(C([30, 10, 90]), [30, 10, 90]);
  assert.deepEqual(C([30, 8, null, {l:[30, 10], r:[30, 8]}]), [30, 8, null, {l:[30, 10], r:[30, 8]}]);
  assert.deepEqual(C([30, 8, 'x', {l:[30, 10], r:[30, 8]}]), [30, 8, null, {l:[30, 10], r:[30, 8]}], 'неверный отдых — пусто, стороны остаются');
  assert.deepEqual(C([30, 8, 90, {l:[30, 10]}]), [30, 8, 90], 'неверные стороны — без них, отдых остаётся');
  assert.deepEqual(C([30, 8, null, 'мусор']), [30, 8]);
  assert.deepEqual(C([30, 10, null, {l:[30, 10], r:[30, 8]}]), [30, 10], 'стороны не сходятся с основными полями');
  assert.equal(C('x'), null);
  assert.equal(C(null), null);
  /* старые валидаторы журнала и объединение принимают оба вида */
  const ss = [{d:'2026-10-01', s:[[30, 10], [30, 8, null, {l:[30, 10], r:[30, 8]}], [30, 9, 90, {l:[30, 9], r:[30, 10]}]]}];
  assert(A.validSessions(ss));
  assert.deepEqual(plain(A.mergeSessions([], ss)), ss);
});

/* 4.112: стороны — словами «лев.» и «прав.» вместо букв «Л» и «П» (Галина 10: «Л/П» непонятно); хранение подхода прежнее */
test('текст подхода: «лев. 12×10 · прав. 12×8»; подходы со сторонами разделены «; »', () => {
  const ex = A.EXI.dbcurl;
  assert.equal(A.setText([12, 8, null, {l:[12, 10], r:[12, 8]}], ex), 'лев. 12×10 · прав. 12×8');
  assert.equal(A.setText([12, 8], ex), '12×8');
  assert.equal(strip(A.setsText([[12, 10], null, [12, 8]], ex)), '12×10 · 12×8');
  assert.equal(strip(A.setsText([[12, 10], [12, 8, null, {l:[12, 10], r:[12, 8]}]], ex)), '12×10; лев. 12×10 · прав. 12×8');
  assert.equal(A.setText([null, 38, null, {l:[null, 42], r:[null, 38]}], A.EXI.sideplank), 'лев. 42 · прав. 38');
  assert.equal(A.weakSideNote(ex, {s:[[12, 8, null, {l:[12, 10], r:[12, 8]}], [12, 9, null, {l:[12, 10], r:[12, 9]}]]}), 'Слабая сторона — правая: догоняйте её.');
  assert.equal(A.weakSideNote(ex, {s:[[12, 8, null, {l:[12, 10], r:[12, 8]}], [12, 8, null, {l:[12, 8], r:[12, 10]}]]}), '', 'слабая сторона меняется — без подсказки');
  assert.equal(A.weakSideNote(ex, {s:[[12, 10, null, {l:[12, 10], r:[12, 10]}]]}), '', 'стороны равны');
  assert.equal(A.weakSideNote(ex, {s:[[12, 10]]}), '');
});

/* ---------- прогрессия, мышцы, история ---------- */
test('подсказки и загрузка мышц — по слабой стороне и одному подходу, как раньше; строка о слабой стороне', () => {
  const a = app(), it = a.item('dbrow', ['db', 'bench']);
  a.S.mode = 'single'; a.S.goal = 'mass';
  const [, hi] = it.rx.reps.split(/\D+/).map(Number);
  const plainRec = Array.from({length:it.rx.sets}, () => [30, hi]);
  a.LOG.data = {dbrow:[{d:'2000-01-01', target:it.rx.sets, s:plainRec}]};
  const before = a.suggest(it);
  /* те же основные поля, сильная сторона — больше: подсказка та же, плюс строка о слабой стороне */
  a.LOG.data = {dbrow:[{d:'2000-01-01', target:it.rx.sets, s:plainRec.map(x => [x[0], x[1], null, {l:[30, hi + 2], r:[30, hi]}])}]};
  const after = a.suggest(it);
  assert.equal(after.tone, before.tone); assert.equal(after.kg, before.kg); assert.deepEqual(plain(after.reps), plain(before.reps));
  assert(after.text.startsWith(before.text) && after.text.endsWith('Слабая сторона — правая: догоняйте её.'), after.text);
  /* загрузка мышц: подход с Л/П — один подход */
  const t = a.todayKey();
  a.LOG.data = {dbrow:[{d:t, s:[[30, 8, null, {l:[30, 10], r:[30, 8]}], [30, 9]]}]};
  assert.equal(a.muscleLoad(a.LOG.data, t).back.v, 2);
  /* история: «лев. … · прав. …» (4.112) и объём (4.108: «общий вес» → «объём») */
  const h = strip(a.histHtml(a.EXI.dbrow));
  assert(h.includes('лев. 30×10 · прав. 30×8; 30×9'), h);
  assert(h.includes('объём 1 080 кг'), h);
});

/* ---------- копия ---------- */
test('резервная копия: стороны, снаряд и «Л/П отдельно» сохраняются; неверное отбрасывается, подход остаётся', () => {
  const a = app();
  const good = [{d:'2026-10-01', eq:'db', s:[[30, 10], [30, 8, null, {l:[30, 10], r:[30, 8]}], null, [30, 9, 95, {l:[30, 9], r:[30, 10]}]]}];
  a.LOG.data = {dbrow:good, sideplank:[{d:'2026-10-01', s:[[null, 38, 60, {l:[null, 42], r:[null, 38]}]]}]};
  a.S.lr = {dbrow:true};
  const copy = JSON.parse(JSON.stringify(a.backupObject()));
  a.LOG.data = {}; a.S.lr = {};
  a.restoreBackup(copy);
  assert.deepEqual(plain(a.LOG.data.dbrow), good);
  assert.deepEqual(plain(a.LOG.data.sideplank[0].s), [[null, 38, 60, {l:[null, 42], r:[null, 38]}]]);
  assert.deepEqual(plain(a.S.lr), {dbrow:true});
  /* мусор: стороны, снаряд, переключатель */
  a.LOG.data = {}; a.S.lr = {};
  a.restoreBackup({app:'podhod', v:2, settings:{...plain(a.S), lr:{dbrow:true, bbbench:true, nope:true, dbcurl:'да', revlunge:true}}, log:{
    dbrow:[{d:'2026-10-02', eq:'bb', s:[[30, 8, null, {l:[30, 10]}], [30, 10, null, {l:[30, 10], r:[30, 8]}], [30, 8, 'x', {l:[30, 10], r:[30, 8]}], 'мусор']}],
    rdl:[{d:'2026-10-02', eq:'db', s:[[20, 10]]}]}});
  assert.deepEqual(plain(a.LOG.data.dbrow), [{d:'2026-10-02', s:[[30, 8], [30, 10], [30, 8, null, {l:[30, 10], r:[30, 8]}], null]}], 'снаряд «штанга» у тяги гантели отброшен');
  assert.equal(a.LOG.data.rdl[0].eq, 'db');
  assert.deepEqual(plain(a.S.lr), {dbrow:true, revlunge:true}, 'Л/П — только у упражнений со сторонами');
  assert.deepEqual(plain(a.cleanLr('x')), {});
});

/* ---------- таблица для Excel ---------- */
test('таблица для Excel: столбцы «Левая», «Правая» и «Объём за подход, кг» в конце (до 4.108 — «Общий вес за подход»)', () => {
  const a = app();
  a.LOG.data = {
    dbrow:[{d:'2026-10-01', s:[[30, 10], [30, 8, null, {l:[30, 10], r:[30, 8]}]]}],
    dbbench:[{d:'2026-10-02', s:[[20, 10, 90]]}],
    sideplank:[{d:'2026-10-02', s:[[null, 38, null, {l:[null, 42], r:[null, 38]}]]}],
    pushup:[{d:'2026-10-03', s:[[null, 20]]}],
    bulgarian:[{d:'2026-10-03', s:[[12.5, 8, null, {l:[12.5, 10], r:[12.5, 8]}]]}]
  };
  const rows = a.csvText().replace(/^﻿/, '').split('\r\n').map(r => r.split(';'));
  assert.deepEqual(rows[0].slice(-4), ['Отдых после подхода, с', 'Левая', 'Правая', 'Объём за подход, кг']);
  assert(rows.every(r => r.length === rows[0].length));
  const by = (ex, k) => rows.find(r => r[1] === a.EXI[ex].name && r[3] === String(k)).slice(-3);
  assert.deepEqual(by('dbrow', 1), ['', '', '600']);
  assert.deepEqual(by('dbrow', 2), ['30×10', '30×8', '540']);
  assert.deepEqual(by('dbbench', 1), ['', '', '400']);
  assert.deepEqual(by('sideplank', 1), ['42', '38', ''], 'удержание: секунды сторон, общего веса нет');
  assert.deepEqual(by('pushup', 1), ['', '', ''], 'вес тела — общий вес не считается');
  assert.deepEqual(by('bulgarian', 1), ['12,5×10', '12,5×8', '450']);
  const r = rows.find(r => r[1] === a.EXI.dbrow.name && r[3] === '2');
  assert.deepEqual(r.slice(4, 6), ['30', '8'], 'основные вес и повторы — слабая сторона');
});

/* ---------- переключатель ---------- */
test('«Л/П отдельно» запоминается для упражнения и есть только у упражнений со сторонами', () => {
  const a = app();
  a.S.lr = {};
  assert.equal(a.lrOn(a.EXI.dbrow), false, 'по умолчанию выключен');
  a.lrSet(a.EXI.dbrow, true);
  assert.equal(a.lrOn(a.EXI.dbrow), true);
  assert.equal(a.lrOn(a.EXI.dbcurl), false, 'у другого упражнения — своё');
  a.lrSet(a.EXI.bbbench, true);
  assert.equal(a.lrOn(a.EXI.bbbench), false, 'у двусторонних переключателя нет');
  a.lrSet(a.EXI.dbrow, false);
  assert.equal(a.lrOn(a.EXI.dbrow), false);
});
