'use strict';
/* 4.111 «Свой план целиком и обмен»: ссылка на план (план целиком после «#plan=», без сервера), текст со ссылкой, который
   загружается обратно, и файл плана с местом, мышцами, отметками «Что беречь» и неделей цикла (src/js/11m-plan-link.js,
   11e-plan-files.js, 11d-custom.js). Замечания: Кира 1, 2, 4, 11; Марина 1, 2, 3, 5, 7, 8; Дмитрий 9, 15, 23; Ксения —
   перепроверка файла плана. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app(storage = {}) {
  const m = loadModel({ fullApp: true, storage });
  /* сжатие ссылки — потоки браузера; в Node они те же */
  Object.assign(m.get('globalThis'), { CompressionStream, DecompressionStream, Blob, TextEncoder, TextDecoder });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S,EXI,WEEKS,buildPlan,buildProgram,effEquip,ensureCustoms,customOf,openCustom,switchModeSettings,storePlanSetting,loadPlanSettings,
    savePlansFrom,frozenPlans,planFileObject,planFileName,readPlanFile,readPlanLink,readPlanAny,addPlans,planLinkUrl,currentLinkObject,plansShareText,
    b64uEncode,b64uDecode,planLinkEncode,PLACE_DEFAULTS,ensurePlaces,placeOf,customHints,planCtx,protectOn,dropEmptyMy,PLAN_FILE,PLAN_LINK_MAX,linkBase})`);
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, auto: p.id, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 5, groups: ['chest', 'back', 'shoulders'], fav: [], customs: [], custom: null, gen: null, seed: 7, protect: [] });
  a.ensureCustoms(a.S);
  a.m = m;
  a.setMode = mode => { const prev = a.S.mode; a.S.mode = mode; a.switchModeSettings(prev); };
  a.view = () => { a.m.get('plan = buildPlan({})'); return plain(a.m.get('plan').items.map(it => [it.ex.id, it.name])); };
  return a;
}
/* тренер Марина: «Анна, низ» дома, с отметкой «Колени» (Марина 1, 2; перепроверка Ксении) */
function trainer() {
  const a = app();
  a.S.place = 'home'; a.ensurePlaces(a.S); a.S.protect = ['knees'];
  a.S.customs = [{ id: 'pa', name: 'Анна, низ', goal: 'cut', format: 'classic', level: 'beg', items: [{ id: 'goblet' }, { id: 'rdl', kg: [8] }, { id: 'dbbench', note: 'Локти под 45°' }, { id: 'latpull' }] }];
  a.ensureCustoms(a.S); a.setMode('custom'); a.openCustom('pa');
  return a;
}
const deepKeys = (o, out = new Set()) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { out.add(k); deepKeys(v, out); } return out; };

test('base64url: обратимо для любой длины, чужие знаки и неверная длина — null', () => {
  const a = app();
  for (const n of [0, 1, 2, 3, 4, 5, 31, 256]) {
    const bytes = Uint8Array.from({ length: n }, (_, i) => (i * 73 + 11) & 255), s = a.b64uEncode(bytes);
    assert.match(s, /^[A-Za-z0-9_-]*$/, 'только буквы, цифры, «-» и «_»');
    assert.deepEqual([...a.b64uDecode(s)], [...bytes]);
  }
  assert.equal(a.b64uDecode('ab+c'), null); assert.equal(a.b64uDecode('abcde'), null);
});

test('файл плана несёт место, мышцы, отметки и неделю: у ученика без отметок — те же упражнения, что у тренера', () => {
  const t = trainer(), sent = t.view();
  assert(sent.some(([, n]) => /с гантелями/.test(n)), 'дома — румынская тяга с гантелями');
  assert(!sent.some(([id]) => id === 'goblet'), 'при «Коленях» гоблета нет');
  const file = plain(t.planFileObject([t.customOf()], 'Марина')), p = file.plans[0];
  assert.deepEqual([p.place.name, p.place.equip], ['Дом', ['db', 'band', 'abwheel']]);
  assert.deepEqual(p.protect, ['knees']); assert.deepEqual(p.groups, ['chest', 'back', 'quads', 'hams'].filter(g => p.groups.includes(g)));
  /* ученица: чистый телефон, место по умолчанию — зал, отметок нет */
  const s = app(), r = plain(s.readPlanFile(JSON.stringify(file)));
  const [c] = s.addPlans(r.plans); s.setMode('custom'); s.openCustom(c.id);
  assert.equal(s.placeOf().name, 'Дом', 'план открывается в своём месте');
  assert.deepEqual(s.view(), sent, 'у ученицы — те же упражнения и названия, что видит тренер');
  assert.deepEqual(plain(s.S.protect), [], 'свои отметки ученицы не тронуты: отметка — у плана');
  assert.deepEqual(plain(s.protectOn()), ['knees']);
  assert.deepEqual(plain(s.S.customs.map(c => c.name)), ['Анна, низ'], 'пустой «Мой план» ушёл (Дмитрий 23)');
});

test('свои отметки получателя действуют и в плане из файла: он им подчиняется', () => {
  const t = trainer(), file = JSON.stringify(t.planFileObject([t.customOf()], ''));
  const s = app(); s.S.protect = ['lumbar'];
  const [c] = s.addPlans(plain(s.readPlanFile(file)).plans); s.setMode('custom'); s.openCustom(c.id);
  assert.deepEqual(plain(s.protectOn()), ['lumbar', 'knees']);
  const ids = s.view().map(x => x[0]);
  assert(!ids.includes('rdl'), 'румынская тяга при «Пояснице» заменена');
  assert.equal(s.m.get(`plan.items.every(it => fitsBody(it.ex))`), true, 'все упражнения — по отметкам «Поясница» и «Колени»');
});

test('старый файл (без места, мышц и отметок) загружается как раньше', () => {
  const s = app(); s.S.place = 'street'; s.ensurePlaces(s.S);
  const r = plain(s.readPlanFile(JSON.stringify({ format: s.PLAN_FILE, version: 1, plans: [{ name: 'Верх', goal: 'mass', items: [{ id: 'bbbench', sets: 4, reps: '8–10', rest: 120 }, { id: 'latpull' }] }] })));
  assert.equal(r.error, undefined); assert.equal(r.plans[0].placeIn, undefined);
  const [c] = s.addPlans(r.plans); s.setMode('custom'); s.openCustom(c.id);
  assert.equal(s.placeOf().name, 'Улица', 'место — где человек сейчас, как раньше');
  assert.deepEqual(plain(s.S.groups), ['chest', 'back'], 'мышцы плана — по его упражнениям');
  assert.deepEqual(plain(s.customOf().items[0]), { id: 'bbbench', sets: 4, reps: '8–10', rest: 120 });
});

test('место из файла: своё такое же — им, другое — новым местом с именем из файла; свои места не меняются', () => {
  const s = app(), before = plain(s.S.places);
  const mk = place => plain(s.readPlanFile(JSON.stringify({ format: s.PLAN_FILE, version: 1, plans: [{ name: 'X', place, items: [{ id: 'squat' }] }] }))).plans;
  const [a1] = s.addPlans(mk({ name: 'Дом', auto: 'home', equip: ['db', 'band', 'abwheel'] }));
  assert.equal(a1.place, 'home', 'такой же инвентарь — своё место');
  const [a2] = s.addPlans(mk({ name: 'Анна, дом', equip: ['db', 'kb'], dw: { db: { u: 'kg', v: [2, 4, 6] } } }));
  const p2 = s.S.places.find(p => p.id === a2.place);
  assert.deepEqual(plain([p2.name, p2.equip, p2.dw.db.v]), ['Анна, дом', ['db', 'kb'], [2, 4, 6]], 'новое место — с инвентарём и гантелями из файла');
  assert.deepEqual(plain(s.S.places.slice(0, before.length)), before, 'свои места не изменились');
  const [a3] = s.addPlans(mk({ name: 'Анна, дом', equip: ['db', 'kb'], dw: { db: { u: 'kg', v: [2, 4, 6] } } }));
  assert.equal(a3.place, a2.place, 'тот же файл второй раз — то же место, не дубль');
});

test('у каждого своего плана — свои мышцы; у обычной тренировки — свои (Дмитрий 9)', () => {
  const a = app();
  a.S.customs = [{ id: 'up', name: 'Верх А', items: [{ id: 'bbbench' }, { id: 'latpull' }] }, { id: 'lo', name: 'Низ А', items: [{ id: 'squat' }, { id: 'rdl' }] }];
  a.S.groups = ['chest', 'back', 'shoulders', 'biceps', 'triceps']; a.ensureCustoms(a.S);
  a.setMode('custom'); a.openCustom('lo'); a.m.get('plan = buildPlan({})');
  assert.deepEqual(plain(a.S.groups), ['quads', 'hams'], 'план прежней версии — мышцы по его упражнениям');
  assert.deepEqual(plain(a.customHints(a.m.get('plan'))), [], '«Низ А» не упрекает «не нагружены: грудь, плечи»');
  a.S.groups = ['quads', 'hams', 'glutes']; a.storePlanSetting('groups');
  a.openCustom('up'); assert.deepEqual(plain(a.S.groups), ['chest', 'back']);
  a.openCustom('lo'); assert.deepEqual(plain(a.S.groups), ['quads', 'hams', 'glutes'], 'мышцы «Низа» запомнились у него');
  a.setMode('single'); assert.deepEqual(plain(a.S.groups), ['chest', 'back', 'shoulders', 'biceps', 'triceps'], 'обычная тренировка — со своими мышцами');
});

test('место у своего плана своё: план открывается в нём, обычная тренировка возвращается в своё', () => {
  const a = app();
  a.S.customs = [{ id: 'h', name: 'Дома', place: 'home', items: [{ id: 'rdl' }] }]; a.ensureCustoms(a.S);
  a.setMode('custom'); a.openCustom('h');
  assert.equal(a.S.place, 'home'); assert.match(a.view()[0][1], /с гантелями/);
  a.setMode('single'); assert.equal(a.S.place, 'gym', 'обычная тренировка — в зале, как была');
});

test('свои пары суперсетов: «не в паре со следующим» — отдельное упражнение (Дмитрий 15)', () => {
  const a = app();
  a.S.customs = [{ id: 'p', name: 'Руки', format: 'superset', items: [{ id: 'bbcurl' }, { id: 'skull' }, { id: 'latpull', ss: false }, { id: 'bbbench' }, { id: 'squat' }] }]; a.ensureCustoms(a.S);
  a.setMode('custom'); a.openCustom('p'); a.m.get('plan = buildPlan({})');
  assert.deepEqual(plain(a.m.get('plan.blocks.map(b => b.items.map(it => it.ex.id))')), [['bbcurl', 'skull'], ['latpull'], ['bbbench', 'squat']]);
  const single = a.m.get('plan.blocks[1]');
  assert.equal(single.items[0].rx.restShown, single.rest, 'отдельное — со своим отдыхом');
  const file = plain(a.readPlanFile(JSON.stringify(a.planFileObject([a.customOf()], ''))));
  assert.equal(file.plans[0].items[2].ss, false, 'пара — в файле');
  /* без отметок — соседние пары, как раньше */
  a.S.customs[0].items.forEach(it => delete it.ss); a.m.get('plan = buildPlan({})');
  assert.deepEqual(plain(a.m.get('plan.blocks.map(b => b.items.length)')), [2, 2, 1]);
});

test('неделя цикла переходит в сохранённый план и в файл: строка нагрузки — как в программе (Марина 3)', () => {
  const a = app();
  Object.assign(a.S, { goal: 'cut', level: 'beg' }); a.setMode('program'); a.S.week = 1; a.S.days = 3;
  a.m.get('prog = buildProgram(); plan = prog.days[0].plan');
  const loads = () => plain(a.m.get('Object.fromEntries(plan.items.map(it => [it.ex.id, it.rx.load]))'));
  const inProg = loads();
  const added = plain(a.savePlansFrom());
  assert(added.every(c => c.week === 1), 'неделя — в каждом плане дня');
  a.setMode('custom'); a.openCustom(added[0].id); a.m.get('plan = buildPlan({})');
  assert.deepEqual(loads(), inProg, 'запас и процент — как в программе');
  const r = plain(a.readPlanFile(JSON.stringify(a.planFileObject([a.customOf()], ''))));
  assert.equal(r.plans[0].week, 1);
});

test('сохранённый план — открытым своим планом; пустая заготовка «Мой план» не стоит первой (Кира 11)', () => {
  const a = app(); a.m.get('plan = buildPlan({})');
  assert.deepEqual(plain(a.S.customs.map(c => c.name)), ['Мой план']);
  const [c] = plain(a.savePlansFrom());
  a.setMode('custom');
  assert.equal(a.customOf().id, c.id, '«Свой план» открывает сохранённый');
  assert.deepEqual(plain(a.S.customs.map(c => c.items.length > 0)), [true], 'пустой «Мой план» убран');
  /* «Мой план» с упражнениями или переименованный — не заготовка */
  a.S.customs.unshift({ id: 'c1', name: 'Мой план', auto: 'my', items: [{ id: 'squat' }] }); assert.equal(a.dropEmptyMy(), false);
});

test('имя файла — с датой (Дмитрий 23)', () => {
  const a = app();
  assert.match(a.planFileName([{ name: 'Верх А', items: [] }]), /^lazy-gym-plan-verh-a-\d{4}-\d\d-\d\d\.json$/);
});

test('ссылка: план целиком после #plan=, без отметок «Что беречь» и данных о здоровье; открывается тем же планом', async () => {
  const t = trainer();
  Object.assign(t.S, { health: ['heart'], pain: { off: ['squat'], log: [], pend: [] } });
  t.m.get(`LOG.data = {bbbench: [{d: '2026-11-10', s: [[80, 5]]}]}`);
  const sent = t.view();
  const url = await t.planLinkUrl(t.currentLinkObject());
  assert.match(url, /^https:\/\/sakrett001-ai\.github\.io\/Lazy-gym-planner\/#plan=z[A-Za-z0-9_-]+$/, 'офлайн-файл и проверки — ссылка на сайт');
  const code = url.split('#plan=')[1], r = plain(await t.readPlanLink(code));
  assert.equal(r.error, undefined);
  /* что лежит в самой ссылке: распаковать её код */
  const z = Buffer.from(code.slice(1).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const payload = JSON.parse(require('node:zlib').inflateRawSync(z).toString('utf8')), raw = deepKeys(payload);
  for (const k of ['protect', 'health', 'pain', 'log', 'body', 'heart', 'age', 'hr', 'bw', 'units']) assert(!raw.has(k), `в ссылке нет «${k}»`);
  assert(!/knees|heart|Колен|80,5|2026-11-10/.test(JSON.stringify(payload)), 'ни отметок, ни здоровья, ни журнала');
  assert(payload.plans.every(p => p.items.every(it => !('name' in it))), 'названий упражнений в ссылке нет — она короче');
  /* получатель: чистый телефон, без отметок — тот же план, что видел тренер */
  const s = app(), [c] = s.addPlans(r.plans); s.setMode('custom'); s.openCustom(c.id);
  assert.deepEqual(s.view(), sent, 'упражнения ссылки — с заменами, как у отправителя');
  assert.deepEqual(plain(s.protectOn()), [], 'отметок у плана из ссылки нет');
  assert.equal(s.customOf().items.find(it => it.id === 'rdl').kg[0], 8, 'вес по плану — в ссылке');
});

test('ссылка: битая, обрезанная, чужая, резервная копия, без сжатия, слишком длинная — понятное сообщение, без падения', async () => {
  const a = trainer(), url = await a.planLinkUrl(a.currentLinkObject()), code = url.split('#plan=')[1];
  for (const bad of [code.slice(0, code.length / 2 | 0), 'z!!!', 'z', '', 'zAAAA']) assert.match((await a.readPlanLink(bad)).error, /повреждена|обрезали/, bad.slice(0, 12));
  assert.match((await a.readPlanLink('q' + code.slice(1))).error, /не план|новой версии/);
  const enc = async o => (await a.planLinkEncode(o));
  assert.match((await a.readPlanLink(await enc({ hello: 1 }))).error, /не план/);
  assert.match((await a.readPlanLink(await enc(plain(a.m.get('backupObject()'))))).error, /резервная копия/);
  const j = 'j' + a.b64uEncode(new TextEncoder().encode(JSON.stringify(a.currentLinkObject())));
  assert.equal((await a.readPlanLink(j)).plans.length, 1, 'ссылка без сжатия (старый браузер) тоже читается');
  assert.match((await a.readPlanLink('z' + 'A'.repeat(a.PLAN_LINK_MAX))).error, /слишком длинная/);
});

test('текст со ссылкой загружается обратно; текст без ссылки — понятно, что делать (Кира 2, Марина 7)', async () => {
  const a = trainer(), m = await a.plansShareText([a.customOf()], 'Марина');
  assert.match(m.text, /^Анна, низ — рельеф, классика/); assert.match(m.text, /Место: Дом/); assert.match(m.text, /Заметка: Локти под 45°|Локти под 45°/);
  assert.match(m.text, /Открыть план в Lazy Gym Planner: https:\/\/\S+#plan=z/);
  const r = plain(await a.readPlanAny('Привет! Вот план:\n' + m.text + '\nУдачи.'));
  assert.equal(r.error, undefined); assert.equal(r.plans[0].name, 'Анна, низ'); assert.equal(r.from, 'Марина');
  assert.match((await a.readPlanAny('1. Жим лёжа — 3 × 8')).error, /нет ссылки на план/);
  assert.equal(plain(await a.readPlanAny(JSON.stringify(a.planFileObject([a.customOf()], '')))).plans.length, 1, 'текст файла .json — как раньше');
});

test('ссылка на собранную тренировку и неделю — без сохранения в свои планы; длина ссылки разумная', async () => {
  const a = app(); a.m.get('plan = buildPlan({})');
  const one = await a.planLinkUrl(a.currentLinkObject());
  assert.equal(plain(a.S.customs).length, 1, 'ничего не сохранено');
  a.setMode('program'); a.S.days = 5; a.m.get('prog = buildProgram(); plan = prog.days[0].plan');
  const week = await a.planLinkUrl(a.currentLinkObject()), r = plain(await a.readPlanLink(week.split('#plan=')[1]));
  assert.equal(r.plans.length, 5); assert(r.plans.every(p => p.week === 1 && p.group));
  /* большой свой план: 12 упражнений, вес по подходам, длинные заметки */
  const b = app();
  b.S.customs = [{ id: 'big', name: 'Большой план на всё тело', note: 'Разминка 10 минут, без отказа, последний подход — с запасом в 2 повтора.',
    items: b.m.get('EX.filter(e => !e.kind && e.g !== "cardio").slice(0, 12).map(e => e.id)').map((id, i) => ({ id, sets: 4, reps: '10/8/6/5', kg: [40 + i, 45 + i, 50 + i, 55 + i], tempo: '3-1-1-0', note: 'Контроль внизу, без рывка, пауза 1 с; спина ровная, лопатки сведены, дыхание ровное.' })) }];
  b.ensureCustoms(b.S); b.setMode('custom'); b.openCustom('big'); b.m.get('plan = buildPlan({})');
  const big = await b.planLinkUrl(b.currentLinkObject());
  console.log(`длина ссылки: тренировка ${one.length}, неделя из 5 дней ${week.length}, большой свой план ${big.length} знаков`);
  assert(one.length < 900, `тренировка — ${one.length}`); assert(week.length < 3000, `неделя — ${week.length}`); assert(big.length < 3000, `большой план — ${big.length}`);
});

test('начатая до обновления тренировка своего плана идёт по своему списку: отметка плана та же для данных прежних версий', () => {
  const groups = ['chest', 'back', 'shoulders'];
  const a = app();
  a.S.customs = [{ id: 'lo', name: 'Низ', goal: 'mass', format: 'classic', level: 'mid', items: [{ id: 'squat' }, { id: 'rdl' }] }];
  a.S.groups = groups.slice(); a.S.gen = { goal: 'mass', format: 'classic', level: 'mid' }; a.ensureCustoms(a.S);
  a.S.mode = 'custom'; a.S.custom = 'lo';
  /* отметка так, как её писала 4.108: мышцы общие, у плана — id, состав, цель, формат, уровень */
  const S = a.S, c = a.S.customs[0];
  const old = JSON.stringify([S.mode, S.day, S.week, S.days, S.split, S.goal, S.format, S.level, S.count, [...groups].sort(), [...S.equip].sort(), S.seed,
    S.focus, S.dur, [...(S.protect || [])].sort(), S.place, S.adapt || null, S.swaps || {}, S.logPick ? S.logPick.d + JSON.stringify(S.logPick.groups) : null,
    [c.id, c.items, c.goal, c.format, c.level], false]);
  a.loadPlanSettings();
  assert.deepEqual(plain(a.S.groups), ['quads', 'hams'], 'у плана теперь свои мышцы');
  assert.equal(a.planCtx(), old, 'а отметка состава — прежняя');
});
