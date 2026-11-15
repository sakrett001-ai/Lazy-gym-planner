'use strict';
/* Данные без потерь (4.107, замечания второго прогона тестеров к 4.105.0: Ксения 1–15, Артём 3, Галина 3, Mike 3, 5, Михаил 12, Кира 16).
   Главное правило: записи человека не пропадают молча — либо сохраняем, либо ясно говорим, что не сохранилось, и даём выход.
   Здесь — расчёты без браузера: испорченные копии и хранилище (00a-keep.js, 11-planner.js: cleanSettings, 13a-sets.js: checkLog,
   18-measures.js: readBackupText, restoreBackup), слияние двух вкладок (13-log.js: logMergeDisk, settingsMerge), полночь и часовой
   пояс (todayKey, activeDay), нет тихого предела, выгрузка для Excel на русском и английском, восстановление без потери планов,
   тренировка со своим списком (18a-data-keep.js), сервис-воркер берёт оболочку мимо кеша браузера (src/sw.js).
   Нажатия, фокус и сообщения на странице — tools/ui-check.mjs. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const {loadApp} = require('./lang-model');
const root = path.resolve(__dirname, '..');
const plain = x => JSON.parse(JSON.stringify(x));
const day = n => { const x = new Date(); x.setDate(x.getDate() - n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
/* приложение с хранилищем: storage — объект «ключ → текст» */
const app = (storage = {}, lang = 'ru') => loadApp({lang, storage:storage instanceof Map ? storage : new Map(Object.entries(storage))});
/* настройки, как их записала бы прежняя версия */
const SETTINGS = {goal:'strength', format:'classic', level:'adv', count:6, groups:['chest', 'back'], equip:['bb', 'db', 'bench'], seed:7, mode:'single', days:3, split:'full', week:1, day:0,
  view:'plan', protect:['knees'], customs:[{id:'c1', name:'Мой план', items:[{id:'bbbench', sets:3}]}], custom:'c1', fav:['bbbench'],
  places:[{id:'gym', name:'Зал', auto:'gym', equip:['bb', 'db', 'bench']}, {id:'p2', name:'Подвал', equip:['db']}], place:'gym', placesV:1};
const LOG = {bbbench:[{d:'2026-11-02', s:[[60, 8], [60, 8]]}, {d:'2026-11-05', s:[[62.5, 8]]}], squat:[{d:'2026-11-02', s:[[80, 5]]}]};

/* ---------- 1. испорченное значение в хранилище не роняет приложение (Ксения 1, 15) ---------- */
test('испорченные настройки в хранилище: приложение запускается, поле — обычное, исходное отложено, человеку сказано', () => {
  const cases = {groups:'chest', protect:'knees', places:null, customs:5, equip:'bb', count:1e308, days:-3, week:'abc', fav:{a:1}};
  for (const [k, v] of Object.entries(cases)) {
    const raw = JSON.stringify({...SETTINGS, [k]:v});
    const a = app({'podhod.settings.v1':raw, 'podhod.log.v1':JSON.stringify(LOG)});
    const S = a.json('S');
    assert(Array.isArray(S.groups) && Array.isArray(S.equip) && Array.isArray(S.protect) && Array.isArray(S.customs) && Array.isArray(S.places) && S.places.length, k);
    assert(a.get('(()=>{const p=buildPlan();return !!(p.items||p.empty);})()'), `${k}: план собирается`);
    const broken = a.json('Keep.broken()');
    assert.equal(broken[0].key, 'podhod.settings.v1'); assert.equal(broken[0].raw, raw, `${k}: исходное значение отложено как было`);
    assert(a.json('[...Keep.notes().keys()]').includes('settings'), `${k}: есть сообщение`);
    assert.equal(a.json('LOG.data') && Object.keys(a.json('(logLoadLocal(), LOG.data)')).length, 2, `${k}: журнал на месте`);
  }
  /* мусор в местах: не объекты, имя-число, инвентарь строкой */
  const a = app({'podhod.settings.v1':JSON.stringify({...SETTINGS, places:[{id:'pX', name:5, equip:'bb'}, null, 'x'], place:'pX'})});
  assert.deepEqual(a.json('S.places.map(p => [p.id, p.name, p.equip])'), [['pX', 'Место', []]]);
  /* обрезанный текст настроек: уцелевшее читается */
  const cut = app({'podhod.settings.v1':JSON.stringify(SETTINGS).slice(0, 120)});
  assert.equal(cut.get('S.goal'), 'strength'); assert.equal(cut.json('Keep.broken()').length, 1);
  /* целые настройки — без сообщений и без отложенного */
  const ok = app({'podhod.settings.v1':JSON.stringify(SETTINGS)});
  assert.equal(ok.json('Keep.broken()').length, 0); assert.equal(ok.json('[...Keep.notes().keys()]').length, 0);
});
test('испорченный журнал в хранилище не затирается: исходное отложено, уцелевшее читается (Ксения 15)', () => {
  const raw = JSON.stringify(LOG), cut = raw.slice(0, Math.floor(raw.length * .6));
  const a = app({'podhod.log.v1':cut}); a.get('logLoadLocal()');
  assert(a.json('Object.keys(LOG.data)').includes('bbbench'), 'уцелевшее прочитано');
  assert.equal(a.json('Keep.broken()')[0].raw, cut);
  /* запись после этого — уже исправленный журнал, а исходное лежит отдельно */
  a.get('logSaveLocal()');
  assert.notEqual(a.storage.get('podhod.log.v1'), cut); assert.equal(JSON.parse(a.storage.get('podhod.broken.v1'))[0].raw, cut);
  /* неверный вид: годное остаётся, неверное — мимо, но не молча */
  const b = app({'podhod.log.v1':JSON.stringify({bbrow:'x', inclinebb:[{d:5, s:'y'}], latpulluh:[{d:'2026-11-02', s:[[40, 5]]}], nope_ex:[{d:'2026-11-02', s:[[1, 1]]}]})});
  b.get('logLoadLocal()');
  assert.deepEqual(b.json('Object.keys(LOG.data)'), ['latpulluh']);
  assert.deepEqual(b.json('Object.keys(LOG.foreign)'), ['nope_ex'], 'упражнение, которого нет в этой версии, хранится');
  b.get('logSaveLocal()'); assert(JSON.parse(b.storage.get('podhod.log.v1')).nope_ex, 'и записывается обратно');
  /* замеры: строка вместо списка — отложено */
  const c = app({'podhod.body.v1':'{"rows":"x"}'});
  assert.equal(c.json('Keep.broken()')[0].key, 'podhod.body.v1');
});
test('обрезанный JSON: repairJson возвращает всё, что уцелело до обрыва', () => {
  const a = app();
  const obj = {app:'podhod', v:2, settings:{goal:'mass'}, log:{bbbench:[{d:'2026-11-01', s:[[60, 8], [60, 7]]}, {d:'2026-11-03', s:[[62, 8]]}]}};
  const text = JSON.stringify(obj);
  for (let n = text.indexOf('"log"') + 30; n < text.length; n += 7) {
    const r = a.json(`repairJson(${JSON.stringify(text.slice(0, n))})`);
    assert(r && r.cut && r.value.app === 'podhod' && r.value.settings.goal === 'mass', 'срез ' + n);
  }
  assert.equal(a.get('repairJson("не json")'), null);
});

/* ---------- 1, 2, 7. восстановление копии: проверка содержимого, понятный итог (Ксения 9, 10) ---------- */
const BAD = {app:'podhod', v:2, exported:new Date().toISOString(),
  log:{
    bbbench:[
      {d:'2026-11-01', s:[['abc', 5], [null, 5], [-50, 5], ['NaN', 8], [1e308, 3], [60, -5], [60, 1e308], [60, 'десять'], [60, null], ['60', '8']]},
      {d:'2026-13-45', s:[[70, 5]]}, {d:'2038-01-19', s:[[80, 5]]}, {d:'1970-01-01', s:[[20, 5]]}],
    unknown_ex:[{d:'2026-11-02', s:[[50, 5]]}]},
  body:[{d:'2026-11-01', kg:'abc', waist:-5}, {d:'2026-11-02', kg:1e308, chest:999.99}, {d:'2026-11-03', kg:'80,5'}]};
test('копия с мусором: неверные подходы, даты, замеры — отброшены с отчётом; «Infinityкг» и «45 undefined» не бывает', () => {
  const a = app();
  a.get('LOG.data = {}');
  const r = a.json(`restoreBackup(${JSON.stringify(BAD)})`);
  assert.equal(r.drops.sets, 8); assert.equal(r.drops.sessions, 3);
  assert.deepEqual(r.drops.why, {kg:4, reps:4, date:1, future:1, old:1});
  const ss = a.json('LOG.data.bbbench');
  assert.deepEqual(ss.map(s => s.d), ['2026-11-01']);
  assert.deepEqual(ss[0].s.filter(Boolean), [[null, 5], [60, 8]]);
  assert(ss[0].s.filter(Boolean).every(x => x[0] === null || (Number.isFinite(x[0]) && x[0] <= 2000)));
  assert.equal(r.bodyDropped, 4); assert.deepEqual(a.json('BODY.rows.map(r => [r.d, r.kg])'), [['2026-11-03', 80.5]]);
  assert.deepEqual(a.json('Object.keys(LOG.foreign)'), ['unknown_ex']);
  const text = a.get(`logDropText(${JSON.stringify(r.drops)})`);
  assert.match(text, /^8 подходов \(вес не число, меньше нуля или больше 2000 кг — 4; повторы .* — 4\), 3 записи \(нет такой даты — 1; дата раньше 2000 года — 1; дата позже дня, когда сделана копия — 1\)$/);
});
test('испорченные настройки в копии не роняют приложение и не затирают здешние (Ксения 1)', () => {
  for (const s of [{groups:'chest'}, {protect:'knees'}, {customs:'x', places:'y', protect:'knees', fav:5}, {count:1e308, days:-3, week:'abc'}]) {
    const a = app({'podhod.settings.v1':JSON.stringify(SETTINGS)});
    const before = a.json('S');
    a.get(`restoreBackup(${JSON.stringify({app:'podhod', v:2, settings:s})})`);
    const S = a.json('S');
    for (const k of Object.keys(s)) assert.deepEqual(S[k], before[k], `${Object.keys(s)}: ${k} — здешнее`);
    assert(a.get('(()=>{const p=buildPlan();return !!(p.items||p.empty);})()'));
  }
});
test('чтение файла копии: пустой, чужой, обрезанный, файл плана — каждому своё сообщение (Ксения 10)', () => {
  const a = app({'podhod.log.v1':JSON.stringify(LOG)}); a.get('logLoadLocal()');
  const read = t => a.json(`readBackupText(${JSON.stringify(t)})`);
  assert.equal(read('').error, 'Файл пустой.');
  assert.match(read('Привет, это не JSON').error, /^Это не резервная копия/);
  assert.match(read('[1,2,3]').error, /^Это не резервная копия/);
  assert.match(read(JSON.stringify({app:'Strong', workouts:[]})).error, /^Это не резервная копия/);
  assert.match(read(JSON.stringify({format:'lazy-gym-planner/plans', version:1, plans:[]})).error, /^Это файл плана/);
  const full = JSON.stringify(a.json('backupObject()'));
  const half = read(full.slice(0, Math.floor(full.length / 2)));
  assert(half.cut && half.obj.app === 'podhod', 'своя обрезанная копия — «обрезан», уцелевшее читается');
  assert.match(read(full.slice(0, 40)).error, /повреждён или обрезан/);
});

/* ---------- 3. восстановление не стирает молча планы и настройки (Ksenia 4) ---------- */
test('восстановление: журнал добавляется, планы и настройки — по выбору; итог соответствует делу', () => {
  const copyApp = app({'podhod.settings.v1':JSON.stringify(SETTINGS), 'podhod.log.v1':JSON.stringify(LOG)}); copyApp.get('logLoadLocal()');
  const copy = copyApp.json('backupObject()');
  const mine = {...SETTINGS, goal:'gentle', customs:[{id:'c9', name:'Сегодняшний план', items:[{id:'squat'}]}], custom:'c9', protect:['knees', 'lumbar']};
  const today = [{d:'2026-11-05', s:[[62.5, 8], [62.5, 7]]}, {d:'2026-11-10', s:[[65, 5]]}];
  const a = app({'podhod.settings.v1':JSON.stringify(mine), 'podhod.log.v1':JSON.stringify({bbbench:today})}); a.get('logLoadLocal()');
  const sp = a.json(`restoreSettingsPlan(${JSON.stringify(copy)})`);
  assert(sp.differs && !sp.fresh, 'настройки различаются — спросить; устройство не новое — по умолчанию «оставить мои»');
  const plan = a.json(`(()=>{const p=restoreLogPlan(${JSON.stringify(copy)});return {added:p.added,joined:p.joined,same:p.same,conflicts:[...p.conflicts]};})()`);
  assert.deepEqual(plan, {added:2, joined:0, same:1, conflicts:[]}, '2026-11-05 здесь полнее: копия ничего не добавляет');
  const r = a.json(`restoreBackup(${JSON.stringify(copy)}, {settings:'mine'})`);
  assert.equal(a.get('S.customs[0].name'), 'Сегодняшний план'); assert.equal(a.get('S.goal'), 'gentle'); assert.deepEqual(a.json('S.protect').sort(), ['knees', 'lumbar']);
  assert.equal(r.settings, false); assert.equal(r.added, 2);
  assert.deepEqual(a.json('LOG.data.bbbench.map(s => [s.d, s.s.length])'), [['2026-11-02', 2], ['2026-11-05', 2], ['2026-11-10', 1]], 'здешние подходы 5 ноя не заменены копией');
  /* «взять из копии» — планы, цель, суставы и места из копии */
  const b = app({'podhod.settings.v1':JSON.stringify(mine)});
  b.get(`restoreBackup(${JSON.stringify(copy)}, {settings:'copy'})`);
  assert.equal(b.get('S.customs[0].name'), 'Мой план'); assert.equal(b.get('S.goal'), 'strength'); assert(b.json('S.places.map(p => p.id)').includes('p2'), 'свои места из копии тоже');
  /* день, где подходы различаются, — здешние остаются, в итоге сказано */
  const c = app({'podhod.log.v1':JSON.stringify({bbbench:[{d:'2026-11-02', s:[[70, 3]]}]})}); c.get('logLoadLocal()');
  const rc = c.json(`restoreBackup(${JSON.stringify({app:'podhod', v:2, log:{bbbench:[{d:'2026-11-02', s:[[60, 8], [60, 8]]}]}})})`);
  assert.deepEqual(rc.conflicts, ['2026-11-02']); assert.equal(rc.joined, 1);
  assert.deepEqual(c.json('LOG.data.bbbench[0].s'), [[70, 3], [60, 8]], 'здешний первый подход не заменён, второй добавлен из копии');
  /* новое устройство: по умолчанию — из копии */
  assert(app().json(`restoreSettingsPlan(${JSON.stringify(copy)})`).fresh);
});

/* ---------- 4. нет тихого предела (Ксения 5) ---------- */
test('нет тихого предела: 200 занятий упражнения и 450 замеров сохраняются целиком', () => {
  const a = app();
  const d0 = Date.UTC(2023, 0, 1), dk = k => new Date(d0 + k * 864e5).toISOString().slice(0, 10);
  const log200 = {bbbench:Array.from({length:200}, (_, k) => ({d:dk(k * 3), s:[[50 + k * .25, 5]]}))};
  a.get('LOG.data = {}');
  const r = a.json(`restoreBackup(${JSON.stringify({app:'podhod', v:2, log:log200})})`);
  assert.equal(r.added, 200); assert.equal(a.get('LOG.data.bbbench.length'), 200);
  a.get('todaySession("bbbench", true).s.push([60, 5])'); assert.equal(a.get('LOG.data.bbbench.length'), 201, 'новая запись не вытесняет первую');
  assert.equal(a.get('LOG.data.bbbench[0].d'), '2023-01-01');
  assert.equal(a.get(`mergeSessions([], ${JSON.stringify(Array.from({length:300}, (_, k) => ({d:dk(k), s:[[1, 1]]})))}).length`), 300);
  const body = Array.from({length:450}, (_, k) => ({d:dk(k), kg:90 - k * .02}));
  a.get(`restoreBackup(${JSON.stringify({app:'podhod', v:2, body})})`);
  assert.equal(a.get('BODY.rows.length'), 450);
  assert.equal(a.get(`mergeBodyRows([], ${JSON.stringify(body)}).length`), 450);
});

/* ---------- 5. хранилище не принимает записи — это видно (Ксения 6, 7) ---------- */
test('запись, которую браузер не принял, не теряется молча: Keep.state и освобождение служебных копий', () => {
  const store = new Map([['podhod.frames.v1', 'x'.repeat(1000)]]);
  let room = 1200, refuse = false;
  const a = loadApp({storage:store});
  /* хранилище на 1200 знаков: при переполнении — QuotaExceededError */
  a.context.localStorage = {getItem:k => store.get(k) ?? null, removeItem:k => store.delete(k),
    setItem:(k, v) => { if (refuse) { const e = new Error('denied'); e.name = 'SecurityError'; throw e; } const used = [...store].reduce((n, [kk, vv]) => n + (kk === k ? 0 : vv.length), 0); if (used + v.length > room) { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e; } store.set(k, String(v)); }};
  assert.equal(a.get(`Keep.set('podhod.log.v1', 'y'.repeat(500))`), true, 'место нашлось: служебные копии удалены');
  assert(!store.has('podhod.frames.v1')); assert.equal(a.get('Keep.state()'), 'ok');
  assert.equal(a.get(`Keep.set('podhod.log.v1', 'y'.repeat(5000))`), false); assert.equal(a.get('Keep.state()'), 'full');
  assert.match(a.get('statusHtml()'), /Записи не сохраняются: хранилище браузера переполнено/);
  assert.match(a.get('keepNoteHtml()'), /role="alert".*Сохранить копию в файл/s);
  assert.equal(a.get(`Keep.set('podhod.log.v1', 'y'.repeat(100))`), true); assert.equal(a.get('Keep.state()'), 'ok', 'место освободилось — предупреждение уходит');
  refuse = true; a.get(`Keep.set('podhod.settings.v1', '{}')`);
  assert.equal(a.get('Keep.state()'), 'off'); assert.match(a.get('statusHtml()'), /браузер запретил сайту хранить данные/);
  /* в журнале — где хранятся данные; iPhone; копия — открытый файл (Кира 16, Михаил 12) */
  const b = app();
  assert.match(b.get('privacyHtml()'), /Пульс, вес и отметки о суставах хранятся только на этом устройстве.*открытый файл/);
  b.context.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)';
  assert.match(b.get('storageLineHtml()'), /Safari стирает данные сайта, если его не открывать 7 дней/);
});

/* ---------- 6. замер «5000» (Ксения 8) ---------- */
test('замер: 5000 и 1e308 — отказ с причиной, 270 — переспрос, обычное — записывается', () => {
  const a = app();
  const read = (k, v) => { a.get(`document.querySelector = s => s === '#b-date' ? {value:'${day(0)}'} : null`); return a.json(`(()=>{const r=bodyRead({querySelectorAll:()=>[{value:${JSON.stringify(v)}, dataset:{bf:'${k}'}}]});return {text:r.text||'', ask:(r.ask||[]).map(x=>x.t), row:r.row||null};})()`); };
  assert.match(read('kg', '5000').text, /^Вес 5000 кг — так не бывает/);
  assert.match(read('kg', '1e308').text, /впишите число/);
  assert.match(read('kg', '-80').text, /не может быть нулём или меньше нуля/);
  assert.match(read('kg', 'восемьдесят').text, /впишите число/);
  assert.match(read('waist', '300').text, /^Талия 300 см — так не бывает/);
  assert.deepEqual(read('kg', '270').ask, ['вес 270 кг']);
  assert.deepEqual(read('kg', '80,5').row.kg, 80.5);
});

/* ---------- 7. «Загрузить план» со 100 упражнениями (Ксения 11) ---------- */
test('план больше 12 упражнений: сказано, сколько войдёт, и можно разбить на несколько', () => {
  const a = app();
  const ids = a.json('EX.map(e => e.id)').slice(0, 100);
  const r = a.json(`readPlanFile(${JSON.stringify(JSON.stringify({format:'lazy-gym-planner/plans', version:1, plans:[{name:'Тест', items:ids.map(id => ({id}))}]}))})`);
  assert.equal(r.plans[0].items.length, 12); assert.equal(r.plans[0].all.length, 100);
  const parts = a.json(`splitPlan(${JSON.stringify(r.plans[0])})`);
  assert.equal(parts.length, 9); assert.deepEqual(parts.flatMap(p => p.items.map(it => it.id)), ids);
  assert.deepEqual(parts.map(p => p.name).slice(0, 2), ['Тест (1/9)', 'Тест (2/9)']); assert(parts.every(p => !p.all && p.items.length <= 12));
});

/* ---------- 8. две вкладки не затирают подходы друг друга (Ксения 3, Артём 3) ---------- */
test('две вкладки: подходы обеих остаются, правка настроек в одной не стирает правку в другой', () => {
  const store = new Map();
  const A = app(store), B = app(store);
  const tick = (X, id, k, set) => X.get(`(()=>{const s=todaySession(${JSON.stringify(id)}, true);while(s.s.length<${k})s.s.push(null);s.s[${k}]=${JSON.stringify(set)};logSaveLocal();})()`);
  /* B: тренировка, два подхода; A (открыта раньше, в памяти пусто): подход в карточке другого упражнения */
  tick(B, 'legpresshigh', 0, [70, 12]); tick(B, 'legpresshigh', 1, [70, 12]);
  tick(A, 'dbincline', 0, [20, 12]);
  tick(B, 'latpullv', 0, [72, 12]);
  const log = JSON.parse(store.get('podhod.log.v1'));
  assert.equal(log.legpresshigh[0].s.filter(Boolean).length, 2); assert.equal(log.dbincline[0].s.length, 1); assert.equal(log.latpullv[0].s.length, 1);
  /* один и тот же подход в двух вкладках (16×8; 16×9 и 16×7 под вторым номером) — остаются все три */
  const st2 = new Map(), C = app(st2), D = app(st2);
  tick(C, 'legpress', 0, [16, 8]);
  D.get('logLoadLocal()');
  tick(D, 'legpress', 1, [16, 9]);
  tick(C, 'legpress', 1, [16, 7]);
  assert.deepEqual(JSON.parse(st2.get('podhod.log.v1')).legpress[0].s, [[16, 8], [16, 9], [16, 7]]);
  /* удаление в одной вкладке не возвращается записью из другой */
  D.get('logLoadLocal()'); D.get(`LOG.data.legpress[0].s.pop(); logSaveLocal()`);
  tick(C, 'squat', 0, [80, 5]);
  assert.deepEqual(JSON.parse(st2.get('podhod.log.v1')).legpress[0].s, [[16, 8], [16, 9]]);
  /* настройки: A меняет цель, B (не видела) — свой план; обе правки на месте */
  A.get(`S.goal = 'cut'; saveSettings()`);
  B.get(`S.customs[0].name = 'План из вкладки Б'; saveSettings()`);
  const S = JSON.parse(store.get('podhod.settings.v1'));
  assert.equal(S.goal, 'cut'); assert.equal(S.customs[0].name, 'План из вкладки Б');
});

/* ---------- 11. полночь, Новый год, часовой пояс, часы назад (Ксения 13, 14) ---------- */
test('«сегодня» журнала: тренировка через полночь и через Новый год — один день; перелёт — тренировка продолжается', () => {
  const a = app();
  const mark = (d, at) => a.get(`activeMem = ${JSON.stringify({d, at})}`);
  const t = (y, m, d, h, mi) => new Date(y, m - 1, d, h, mi).getTime();
  mark('2026-11-16', t(2026, 11, 16, 23, 55));
  assert.equal(a.get(`activeDay(${t(2026, 11, 17, 0, 10)})`), '2026-11-16', 'подход в 23:55, сейчас 00:10 — та же тренировка');
  assert.equal(a.get(`activeDay(${t(2026, 11, 17, 3, 30)})`), null, 'через 3,5 часа — уже новый день');
  mark('2026-12-31', t(2026, 12, 31, 23, 50));
  assert.equal(a.get(`activeDay(${t(2027, 1, 1, 0, 20)})`), '2026-12-31', 'Новый год');
  /* Москва 01:00 17 ноя → через 5 минут Нью-Йорк, по местным часам 16 ноя 17:05: «сегодня» — день тренировки */
  mark('2026-11-17', t(2026, 11, 16, 17, 0));
  assert.equal(a.get(`activeDay(${t(2026, 11, 16, 17, 5)})`), '2026-11-17');
  /* часы переведены назад сильнее (время подхода «в будущем») — обычная дата, записи не теряются */
  mark('2026-11-17', t(2026, 11, 17, 19, 0));
  assert.equal(a.get(`activeDay(${t(2026, 11, 10, 19, 0)})`), null);
  /* записи «из будущего» — после сегодняшних, «прошлый раз» — самая свежая из них */
  const today = a.get('todayKey()'), fut = a.get(`dayKey(new Date(Date.now() + 3 * 864e5))`), past = day(2);
  a.get(`LOG.data = {bbbench:[{d:'${past}', s:[[50, 8]]}, {d:'${today}', s:[[55, 8]]}, {d:'${fut}', s:[[60, 8]]}]}`);
  assert.deepEqual(a.json('byRecent(LOG.data.bbbench).map(s => s.d)'), [past, fut, today]);
  assert.deepEqual(a.json('pastSessions("bbbench").map(s => s.d)'), [past, fut]);
  /* начатая тренировка «из будущего» — вопрос «Продолжить её / Закончить её», а не молча новая */
  const st = a.json(`wkPlanState({days:['${fut}'], skipped:[], gone:[], done:2, total:10}, {today:'${today}', queue:[], data:{}})`);
  assert.equal(st.kind, 'ask'); assert.equal(a.get(`wkResume({days:['${fut}'], ended:false}, {today:'${today}', stamp:'x', cont:true})`), 'past');
});

/* ---------- 10. тренировка хранит свой список (Ксения 12) ---------- */
test('начатая тренировка идёт по своему списку, даже если план собрался иначе (новая версия)', () => {
  const store = new Map(), a = app(store);
  a.get(`Object.assign(S, {mode:'single', format:'classic', goal:'mass', level:'mid', groups:['chest', 'back'], count:5, seed:3, dur:null}); plan = buildPlan()`);
  const q0 = a.json('workoutQueue(plan).map(s => [s.it.ex.id, s.k])');
  /* тренировка начата, один подход записан, состояние сохранено */
  a.get(`workout = {queue:workoutQueue(plan), stamp:workoutStamp(workoutQueue(plan)), days:[todayKey()], index:0, started:Date.now(), spent:0, openAt:0, drafts:{}, skipped:[], gone:[], ended:false, restUntil:0, restTotal:0, restFrom:0, restPaused:0, next:-1, last:-1};
    todaySession(workout.queue[0].it.ex.id, true).s[0] = [40, 10]; saveWorkout()`);
  /* «новая версия»: тот же выбор человека, другой план (подменяем сборку) */
  a.get(`plan = buildPlan({seed:99}); workout = null`);
  assert.notDeepEqual(a.json('workoutQueue(plan).map(s => [s.it.ex.id, s.k])'), q0, 'план действительно другой');
  assert.deepEqual(a.json('workoutQueueNow().map(s => [s.it.ex.id, s.k])'), q0, 'тренировка — по своему списку');
  assert.equal(a.get('workoutStamp(workoutQueueNow())'), JSON.parse(store.get('podhod.workout.v3')).stamp, 'та же тренировка — продолжается с того же места');
  /* не законченная в прошлый день: «Продолжить её» — по своему списку, новая тренировка — по плану */
  const sv = JSON.parse(store.get('podhod.workout.v3')); sv.days = [day(1)]; sv.day = day(1); store.set('podhod.workout.v3', JSON.stringify(sv));
  assert.deepEqual(a.json('workoutQueueNow(workoutLoad(), {cont:true}).map(s => [s.it.ex.id, s.k])'), q0);
  assert.deepEqual(a.json('workoutQueueNow(workoutLoad(), {cont:false}).map(s => [s.it.ex.id, s.k])'), a.json('workoutQueue(plan).map(s => [s.it.ex.id, s.k])'));
  /* человек сам поменял выбор (мышцы) — тренировка по новому плану */
  a.get(`S.groups = ['quads']; plan = buildPlan()`);
  assert.deepEqual(a.json('workoutQueueNow().map(s => s.it.ex.id)'), a.json('workoutQueue(plan).map(s => s.it.ex.id)'));
  /* тренировка прежней версии (без списка): упражнения, подходы, отдых и повторы — из её отметки */
  const legacy = {stamp:JSON.stringify(['2026-11-15', 'single', 0, 1, 'classic', 'strength', [['bbrow', 0, 6, 180, '3–5'], ['bbrow', 1, 6, 180, '3–5'], ['bbbench', 0, 5, 150, '3–5']]])};
  const b = app({'podhod.workout.v3':JSON.stringify(legacy)});
  const q = b.json(`queueFromSaved(wkNormalize(${JSON.stringify(legacy)}, Date.now(), '2026-11-15')).map(s => [s.it.ex.id, s.k, s.n, s.rest, s.it.rx.reps])`);
  assert.deepEqual(q, [['bbrow', 0, 6, 180, '3–5'], ['bbrow', 1, 6, 180, '3–5'], ['bbbench', 0, 5, 150, '3–5']]);
});

/* ---------- 13, 14. выгрузка для Excel и имя копии на русском и английском (Mike 3, 5; Дмитрий 22) ---------- */
test('Excel: в русской версии — точка с запятой, в английской — запятая; внутри дня — по порядку выполнения', () => {
  const data = {squat:[{d:'2026-11-02', at:1000, s:[[80, 5], [80, 5]]}], bbbench:[{d:'2026-11-02', at:3000, s:[[60, 8]]}], bbrow:[{d:'2026-11-02', at:2000, s:[[50, 10]]}], pushup:[{d:'2026-11-01', s:[[null, 20]]}]};
  for (const [lang, sep] of [['ru', ';'], ['en', ',']]) {
    const a = app({}, lang); a.get(`LOG.data = ${JSON.stringify(data)}; S.units = 'kg'`);
    const lines = a.get('csvText()').replace(/^﻿/, '').split('\r\n');
    assert.equal(lines[0].split(sep).length >= 11, true, lang + ': разделитель ' + sep);
    const order = lines.slice(1).map(l => l.split(sep)[0] + ' ' + l.split(sep)[3]);
    assert.deepEqual(order, ['2026-11-01 1', '2026-11-02 1', '2026-11-02 2', '2026-11-02 1', '2026-11-02 1'], lang);
    const names = lines.slice(1).map(l => l.split(sep)[1]);
    assert.deepEqual(names.slice(1).map(n => n.toLowerCase().includes('squat') || n.toLowerCase().includes('присед') ? 'squat' : n.toLowerCase().includes('row') || n.toLowerCase().includes('тяга') ? 'row' : 'bench'), ['squat', 'squat', 'row', 'bench'], lang + ': присед → тяга → жим, по времени первого подхода');
  }
  const en = app({}, 'en');
  assert.match(en.get('csvText()'), /^﻿Date,Exercise,Muscle group,Set,"Weight, (kg|lb)",/, 'заголовок с запятой — в кавычках');
  assert.equal(en.get('backupStem()'), 'lazy-gym-backup'); assert.equal(app().get('backupStem()'), 'lazy-gym-kopiya');
});

/* ---------- 9. сервис-воркер: оболочка — из сети, мимо HTTP-кеша браузера (Ксения 2) ---------- */
test('сервис-воркер скачивает оболочку с cache: reload — при установке и при докачке языка', async () => {
  const src = fs.readFileSync(path.join(root, 'src/sw.js'), 'utf8');
  assert.match(src, /new Request\(.*\{cache:'reload'\}\)/);
  assert.match(src, /await c\.addAll\(fresh\(net\)\)/); assert.match(src, /await c\.addAll\(fresh\(missing\)\)/);
  assert(!/c\.addAll\((net|missing)\)/.test(src), 'нигде не осталось addAll без cache: reload');
  const SCOPE = 'https://test.invalid/app/', added = [], handlers = {};
  class Request { constructor(url, init) { this.url = url; this.cache = init && init.cache; } }
  const caches = {open:async () => ({addAll:async list => { added.push(...list); }, match:async () => undefined, put:async () => {}}), keys:async () => [], delete:async () => true};
  const self = {addEventListener:(n, f) => handlers[n] = f, skipWaiting() {}, location:{origin:'https://test.invalid'}, registration:{scope:SCOPE}, clients:{claim() {}, matchAll:async () => [{url:SCOPE}]}};
  vm.runInNewContext(src.replace(/__VERSION__/g, '1.0.0'), {self, caches, Request, URL, Response:class {}});
  let p; handlers.install({waitUntil:x => p = x}); await p;
  assert(added.length > 10 && added.every(r => r instanceof Request && r.cache === 'reload' && r.url.startsWith(SCOPE)), 'все файлы оболочки — с cache: reload');
  assert(added.some(r => r.url === SCOPE) && added.some(r => r.url === SCOPE + 'index.html'), 'страница и index.html — тоже');
});

/* копия → чистый браузер → копия: то же самое (кроме времени выгрузки и открытого раздела) — новые проверки ничего не теряют */
test('выгрузка → восстановление в чистом браузере → выгрузка: данные те же', () => {
  const a = app({'podhod.settings.v1':JSON.stringify(SETTINGS), 'podhod.log.v1':JSON.stringify({...LOG, dbrow:[{d:'2026-11-03', at:1794844800000, eq:'db', target:3, wk:2, s:[[30, 10, 95], [30, 8, null, {l:[30, 10], r:[30, 8]}]]}], nope_ex:[{d:'2026-11-02', s:[[1, 1]]}]}),
    'podhod.body.v1':JSON.stringify({rows:[{d:'2026-11-01', kg:80.5, waist:88}]})});
  a.get('logLoadLocal()');
  const one = a.json('backupObject()'), b = app();
  b.get(`restoreBackup(${JSON.stringify(one)}, {settings:'copy'})`);
  const two = b.json('backupObject()');
  for (const o of [one, two]) { delete o.exported; delete o.settings.view; }
  assert.deepEqual(two.log, one.log); assert.deepEqual(two.body, one.body); assert.deepEqual(two.settings.customs, one.settings.customs); assert.deepEqual(two.settings.places, one.settings.places);
});
