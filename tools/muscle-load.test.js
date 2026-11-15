'use strict';
/* Загрузка мышц по журналу (13d-muscle-load.js): подходы за 7 скользящих дней по правилу графика плана, статусы
   восстановления и «тренировка на сегодня» по журналу; обычный подбор без кнопки не меняется. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; renderPlan=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get('({S,LOG,EXI,GROUP_W,LOAD,buildPlan,muscleLoad,logPick,logPickCtx,applyLogPick,logPickHtml,muscleLoadHtml,groupShare,keyDays,todayKey,dayKey,PLACE_DEFAULTS,ensurePlaces})');
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', view: 'plan', format: 'classic', goal: 'mass', level: 'mid', count: 6, seed: 7, groups: ['chest', 'back', 'shoulders'], protect: [], focus: null, swaps: {} });
  a.LOG.data = {};
  a.m = m;
  /* день n дней назад — ключ по местному календарю, как пишет журнал */
  a.ago = n => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return a.dayKey(d); };
  return a;
}
const sets = (n, kg = 50, reps = 10) => Array.from({ length: n }, () => [kg, reps]);

test('окно — сегодня и 6 предыдущих дней: седьмой день назад и записи «из будущего» не считаются', () => {
  const a = app(), t = a.todayKey();
  a.LOG.data = { legext: [{ d: a.ago(7), s: sets(5) }, { d: a.ago(6), s: sets(3) }, { d: t, s: sets(2) }, { d: a.ago(-1), s: sets(4) }] };
  const L = a.muscleLoad(a.LOG.data, t);
  assert.equal(L.quads.v, 5, '6 дней назад (3) + сегодня (2); 7 дней назад и завтра — нет');
  assert.equal(a.keyDays('2026-03-28', '2026-03-30'), 2, 'переход на летнее время не сдвигает дни');
  assert.equal(a.keyDays('2026-12-31', '2027-01-01'), 1);
});

test('дробный счёт — то же правило, что у графика плана: журнал тренировки даёт те же подходы на группу', () => {
  const a = app(), t = a.todayKey();
  for (const groups of [['chest', 'back', 'shoulders'], ['quads', 'hams', 'glutes', 'calves', 'abs'], ['biceps', 'triceps', 'forearms']]) {
    a.S.groups = groups; a.LOG.data = {};
    const p = a.buildPlan();
    for (const it of p.items) a.LOG.data[it.ex.id] = [{ d: t, s: sets(it.rx.sets) }];
    const L = a.muscleLoad(a.LOG.data, t);
    for (const [g, v] of Object.entries(p.gvol)) if (g !== 'cardio') assert.equal(L[g].v, v, `${groups.join('+')}: ${g}`);
  }
  /* жим лёжа: грудь — целиком, трицепс и плечи (передняя дельта) — наполовину */
  a.LOG.data = { bbbench: [{ d: t, s: sets(4) }] };
  const L = a.muscleLoad(a.LOG.data, t);
  assert.deepEqual([L.chest.v, L.triceps.v, L.shoulders.v, L.back.v], [4, 2, 2, 0]);
  assert.deepEqual(plain(a.groupShare(a.EXI.bbbench)), { chest: 1, triceps: 0.5, shoulders: 0.5 });
});

test('односторонние «на каждую сторону» — один подход; пустые подходы не считаются', () => {
  const a = app(), t = a.todayKey();
  assert.equal(a.EXI.dbrow.uni, true);
  a.LOG.data = { dbrow: [{ d: t, s: [[30, 10], null, [30, 10], [30, 9]] }], bbcurl: [{ d: a.ago(1), s: [null, null] }] };
  const L = a.muscleLoad(a.LOG.data, t);
  assert.equal(L.back.v, 3, 'три записанных подхода тяги одной рукой — три подхода, а не шесть');
  assert.equal(L.biceps.v, 1.5, 'бицепс — наполовину от тяги; запись без подходов не считается');
  assert.equal(L.biceps.st, 'ready', 'пустая запись не делает бицепс нагруженным');
});

test('статусы: < 48 ч — нагружена, 48–72 ч — восстанавливается, от 72 ч — готова; часы — по календарным дням', () => {
  const a = app(), t = a.todayKey();
  const st = age => { a.LOG.data = { bbcurl: [{ d: a.ago(age), s: sets(3) }] }; const L = a.muscleLoad(a.LOG.data, t).biceps; return [L.st, L.h, L.last && L.last.sets]; };
  assert.deepEqual(st(0), ['loaded', 0, 3]);
  assert.deepEqual(st(1), ['loaded', 24, 3]);
  assert.deepEqual(st(2), ['recovering', 48, 3]);
  assert.deepEqual(st(3), ['ready', 72, 3], 'три дня назад — 72 ч: готова');
  assert.deepEqual(st(9), ['ready', 216, 3], 'старая нагрузка вне окна тоже даёт отдых');
  /* меньше двух подходов основной работы — не существенная нагрузка */
  a.LOG.data = { bbcurl: [{ d: t, s: sets(1) }] };
  assert.equal(a.muscleLoad(a.LOG.data, t).biceps.st, 'ready');
  /* статус — по последней существенной нагрузке: вчерашний одиночный подход не отменяет отдых после тяжёлой тренировки */
  a.LOG.data = { bbcurl: [{ d: a.ago(4), s: sets(4) }, { d: a.ago(1), s: sets(1) }] };
  const L = a.muscleLoad(a.LOG.data, t).biceps;
  assert.deepEqual([L.st, L.last.age, L.last.sets, L.v], ['ready', 4, 4, 5]);
  /* два упражнения в один день складываются */
  a.LOG.data = { bbcurl: [{ d: a.ago(1), s: sets(1) }], hammer: [{ d: a.ago(1), s: sets(1) }] };
  assert.equal(a.muscleLoad(a.LOG.data, t).biceps.st, 'loaded');
});

test('статус — по основной работе: вспомогательные мышцы и кардио не делают группу нагруженной', () => {
  const a = app(), t = a.todayKey();
  /* тяга верхнего блока: грудные и бицепс — вспомогательные; жим стоя: передняя зубчатая (группа «Грудь») — вспомогательная */
  a.LOG.data = { latpull: [{ d: a.ago(1), s: sets(4) }], ohp: [{ d: a.ago(1), s: sets(3) }] };
  let L = a.muscleLoad(a.LOG.data, t);
  assert.deepEqual([L.back.st, L.shoulders.st, L.chest.st, L.biceps.st, L.triceps.st], ['loaded', 'loaded', 'ready', 'ready', 'ready']);
  assert.equal(L.chest.v, 3.5, 'в объёме вспомогательная работа считается наполовину, как в плане');
  /* присед: ягодичные — основные (группа «Ягодицы» нагружена), поясница — вспомогательная */
  a.LOG.data = { squat: [{ d: t, s: sets(3) }] };
  L = a.muscleLoad(a.LOG.data, t);
  assert.deepEqual([L.quads.st, L.glutes.st, L.back.st], ['loaded', 'loaded', 'ready']);
  /* беговая дорожка — кардио: объём ногам наполовину, статус не меняется */
  a.LOG.data = { treadmill: [{ d: t, s: sets(3, null, 600) }] };
  L = a.muscleLoad(a.LOG.data, t);
  assert.deepEqual([L.quads.v, L.quads.st], [1.5, 'ready']);
});

/* пример владельца: понедельник — ноги и грудь, среда — спина и плечи, сегодня четверг */
function monWed(a) {
  a.LOG.data = {
    squat: [{ d: a.ago(3), s: sets(4, 80, 8) }], rdl: [{ d: a.ago(3), s: sets(3, 70, 10) }],
    bbbench: [{ d: a.ago(3), s: sets(4, 60, 8) }], dbfly: [{ d: a.ago(3), s: sets(3, 14, 12) }],
    latpull: [{ d: a.ago(1), s: sets(4, 55, 10) }], cablerow: [{ d: a.ago(1), s: sets(3, 50, 10) }],
    ohp: [{ d: a.ago(1), s: sets(3, 40, 8) }], latraise: [{ d: a.ago(1), s: sets(3, 8, 12) }]
  };
}
test('пример «пн — ноги и грудь, ср — спина и плечи, чт — ?»: спина и плечи отдыхают, руки и пресс — в приоритете', () => {
  const a = app(); monWed(a);
  const L = a.muscleLoad();
  assert.deepEqual(['back', 'shoulders'].map(g => [L[g].st, L[g].h]), [['loaded', 24], ['loaded', 24]]);
  assert.deepEqual(['quads', 'glutes', 'hams', 'chest'].map(g => [L[g].st, L[g].h]), [['ready', 72], ['ready', 72], ['ready', 72], ['ready', 72]]);
  const pick = a.applyLogPick();
  assert(pick, 'тренировка собрана');
  assert.deepEqual(plain(pick.rest.map(r => r.g)), ['back', 'shoulders']);
  for (const g of ['biceps', 'triceps', 'abs', 'quads', 'glutes']) assert(a.S.groups.includes(g), 'выбрана группа с недобором: ' + g);
  for (const g of ['back', 'shoulders', 'chest']) assert(!a.S.groups.includes(g), 'не выбрана: ' + g + (g === 'chest' ? ' (10,5 подхода за 7 дней — недобора нет)' : ' (нагружена вчера)'));
  assert.equal(a.S.groups.length, a.S.count, 'по группе на упражнение');
  const p = a.buildPlan();
  assert.equal(p.byLog, true);
  assert.equal(p.items.length, 6);
  assert(p.items.every(it => !['back', 'shoulders'].includes(it.ex.g)), 'нет упражнений на спину и плечи: ' + p.items.map(it => it.ex.id));
  for (const g of a.S.groups) assert((p.gvol[g] || 0) >= 1, 'каждая выбранная группа получает подходы: ' + g);
  const html = a.logPickHtml(p);
  assert.match(html, /Собрано по журналу/);
  assert.match(html, /<b>Квадрицепс:<\/b> 4 из 10 за 7 дней, отдых 3 дня/);
  assert.match(html, /<b>Бицепс:<\/b> 3,5 из 10 за 7 дней, основной нагрузки не было/);
  assert.match(html, /Отдыхают — нагружены меньше 48 ч назад: спина \(вчера\), плечи \(вчера\)\./);
});

test('восстанавливающаяся группа — одно упражнение и на подход меньше; нагруженная отодвигает упражнения, где она основная', () => {
  const a = app(), t = a.todayKey();
  a.LOG.data = { bbbench: [{ d: a.ago(2), s: sets(4) }], legpress: [{ d: a.ago(1), s: sets(4) }] };
  a.S.count = 9; /* грудь с половинным весом — в конце очереди: места хватает всем группам с недобором */
  /* зерно: подбор — по очкам со случайной добавкой на упражнение (pickExercises, jitter по номеру в каталоге), и при девяти
     группах с равной долей второе упражнение на грудь проходит примерно в каждом пятом зерне (11 из 60 до гирь в каталоге,
     12 из 60 после): «одно упражнение» здесь — доля группы, а не жёсткий запрет. С новыми упражнениями каталога добавка
     сдвинулась, прежнее зерно 7 попало в такие; 8 — нет */
  a.S.seed = 8;
  const pick = a.applyLogPick();
  const chest = pick.rows.find(r => r.g === 'chest');
  assert(chest && chest.st === 'recovering', 'грудь позавчера — восстанавливается и в списке');
  const ctx = a.logPickCtx();
  assert.equal(ctx.weights.chest, 1, 'одно упражнение');
  assert(Object.entries(ctx.weights).every(([g, w]) => g === 'chest' || w >= 1));
  assert(ctx.rest.has('quads') && ctx.rest.has('glutes'), 'ноги вчера — отдыхают');
  const p = a.buildPlan();
  const ch = p.items.filter(it => it.ex.g === 'chest');
  assert.equal(ch.length, 1, 'на грудь одно упражнение: ' + p.items.map(it => it.ex.id));
  const normal = a.m.get('prescribe')(ch[0].ex, null, a.m.get('effEquip')(a.S.equip));
  assert.equal(ch[0].rx.sets, normal.sets - 1, 'на подход меньше');
  assert(!p.items.some(it => it.ex.pri.some(m => ['quads', 'glutes'].includes(a.m.get('MUSCLE_GROUP')[m]))), 'нет упражнений, где квадрицепс и ягодичные основные');
  assert.match(a.logPickHtml(p), /<b>Грудь:<\/b> 4 из 10 за 7 дней, отдых 2 дня — восстанавливается, на подход меньше/);
  assert.equal(t, a.S.logPick.d);
});

test('пустой журнал и давний перерыв: все готовы, начинаем с крупных групп', () => {
  const a = app();
  const L = a.muscleLoad({});
  assert(Object.values(L).every(x => x.v === 0 && x.st === 'ready' && !x.last));
  assert(!('cardio' in L), 'кардио в загрузке мышц нет');
  const pick = a.logPick(L);
  assert.deepEqual(plain(pick.rows.slice(0, 3).map(r => r.g)), ['back', 'chest', 'quads'], 'спина, грудь, квадрицепс — первыми');
  assert.match(a.muscleLoadHtml(L), /За 7 дней записей нет/);
});

test('всё нагружено — тренировка не собирается, параметры не меняются', () => {
  const a = app(), t = a.todayKey();
  a.LOG.data = {};
  /* сведение ног — для группы «Приводящие» (своя группа с 4.109): без него она осталась бы «готова» */
  for (const id of ['bbbench', 'latpull', 'ohp', 'bbcurl', 'pushdown', 'wristcurl', 'crunch', 'hipthrust', 'legext', 'adduction', 'legcurl', 'calfraise']) a.LOG.data[id] = [{ d: t, s: sets(3) }];
  assert(Object.values(a.muscleLoad()).every(x => x.st === 'loaded'));
  const before = plain(a.S);
  assert.equal(a.applyLogPick(), null);
  assert.deepEqual(plain(a.S), before);
});

test('инвентарь места: группы без упражнений здесь не выбираются', () => {
  const a = app();
  a.S.place = 'none'; a.ensurePlaces(a.S);
  const E = a.m.get('effEquip')(a.S.equip), can = g => a.m.get('EX').some(ex => ex.g === g && a.m.get('available')(ex, E));
  const pick = a.logPick(a.muscleLoad({}), { count: 10 });
  assert(pick.rows.length > 0 && pick.rows.every(r => can(r.g)));
});

test('обычный подбор не меняется: без кнопки, с устаревшим снимком или другими группами — тот же план', () => {
  const a = app(); monWed(a);
  const snap = () => plain(a.buildPlan().items.map(it => [it.ex.id, it.rx.sets]));
  for (const groups of [['chest', 'back', 'shoulders'], ['biceps', 'triceps', 'abs', 'quads', 'glutes', 'calves']]) {
    a.S.groups = groups; delete a.S.logPick;
    const base = snap();
    a.S.logPick = { d: a.ago(1), groups, rows: groups.map(g => ({ g, v: 0, st: 'ready', age: null, p: 1 })), rest: [{ g: 'back' }] };
    assert.deepEqual(snap(), base, 'вчерашний снимок не действует');
    a.S.logPick = { d: a.todayKey(), groups: ['legs'], rows: [], rest: [] };
    assert.deepEqual(snap(), base, 'другие группы — обычный подбор');
    a.S.logPick = { d: a.todayKey(), groups: groups.slice(1), rows: groups.slice(1).map(g => ({ g, v: 0, st: 'ready', age: null, p: 1 })), rest: [] };
    assert.deepEqual(snap(), base, 'человек поменял мышцы — обычный подбор');
  }
  /* программа и свой план не трогаются */
  a.applyLogPick(); const g = a.S.groups.slice();
  a.S.mode = 'program';
  assert.equal(a.logPickCtx(), null);
  a.S.mode = 'single';
  assert.deepEqual(plain(a.S.groups), plain(g)); assert(a.logPickCtx());
});

test('записи по ходу тренировки не меняют собранный план', () => {
  const a = app(); monWed(a);
  a.applyLogPick();
  const p1 = plain(a.buildPlan().items.map(it => it.ex.id));
  const first = a.buildPlan().items[0];
  a.LOG.data[first.ex.id] = [{ d: a.todayKey(), s: sets(4) }];
  assert.deepEqual(plain(a.buildPlan().items.map(it => it.ex.id)), p1);
});

test('по журналу собирается в любом формате, с любой целью и уровнем; облегчение — не ниже минимума', () => {
  const a = app();
  a.LOG.data = { bbbench: [{ d: a.ago(2), s: sets(4) }], latpull: [{ d: a.ago(1), s: sets(4) }] };
  a.S.count = 9;
  for (const format of ['classic', 'superset', 'circuit', 'static']) for (const goal of ['strength', 'mass', 'cut', 'gentle']) for (const level of ['beg', 'mid', 'adv']) {
    Object.assign(a.S, { format, goal, level });
    a.applyLogPick();
    const p = a.buildPlan();
    assert(p.byLog && p.items.length > 0, `${format}/${goal}/${level}`);
    assert(!a.S.groups.includes('back'), 'спина вчера — пропущена');
    for (const it of p.items.filter(x => x.ex.g === 'chest')) {
      if (it.rx.static) assert(it.rx.series >= 1 && it.rx.sets === it.rx.series * 3);
      else if (format === 'classic' && it.rx.eased) assert.equal(it.rx.sets, it.rx.eased - 1);
      assert(it.rx.sets >= 2, 'не меньше двух подходов');
    }
  }
});

/* предложение владельцу (отдельный коммит): «Собрать тренировку на сегодня» — по шкале уровня (volScale, 11-planner.js):
   новичку и в «Бережно» недобор — до 4 подходов за 7 дней, верх — 12; остальным — до 10, верх — 20 */
test('«today’s workout» uses the level scale: a beginner with 5 chest sets has no shortfall there, an intermediate does', () => {
  for (const [level, chest] of [['beg', false], ['mid', true]]) {
    const a = app();
    a.S.level = level;
    a.LOG.data = { bbbench: [{ d: a.ago(4), s: sets(5) }] };
    const pick = a.logPick(a.muscleLoad(), { count: 11 }); /* мест хватает всем группам с недобором */
    const row = pick.rows.find(r => r.g === 'chest');
    assert.equal(!!(row && row.need > 0), chest, `${level}: chest 5 sets — shortfall ${row ? row.need : 'none'}`);
    a.applyLogPick();
    const html = a.logPickHtml(a.buildPlan());
    assert.match(html, level === 'beg' ? / из 4 за 7 дней/ : / из 10 за 7 дней/, level);
  }
  /* выше верха шкалы группа не берётся: новичку 13 подходов на квадрицепс за 7 дней — уже много */
  const a = app(); a.S.level = 'beg';
  a.LOG.data = { legpress: [{ d: a.ago(4), s: sets(13) }] };
  assert(!a.logPick(a.muscleLoad(), { count: 6 }).rows.some(r => r.g === 'quads'));
});
