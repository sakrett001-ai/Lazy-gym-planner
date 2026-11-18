'use strict';
/* Слова и тон, английская версия, мелочи, подсказка «Установить», понятные названия мышц (4.112; отчёты тестеров 4.105.0 —
   Mike 6, 7, 12, 14, 15, 17–19, Кира 12, 13, 16, Галина 10, 11, Руслан 17, 19, Артём 10; прежние — Alex 13–16, Ольга 15, 17,
   19, 26, Дмитрий 6, 16, Виктор 14). Модель приложения на языке сборки — tools/lang-model.js. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {loadApp} = require('./lang-model');
const root = path.resolve(__dirname, '..');
const day = n => { const x = new Date(); x.setDate(x.getDate() - n); return x.toISOString().slice(0, 10); };

test('простые слова: «фунт» вместо «фнт», «лев.» и «прав.» вместо «Л» и «П», «дополнительный вес», без «JSON» и «Эпли»', () => {
  const ru = loadApp({lang:'ru'}); ru.get(`S.units='lb'`);
  assert.deepEqual(ru.json('[wUnit(), fmtW(fromU(135))]'), ['фунт', '135 фунт']);
  assert.match(ru.get('unitsHtml()'), /data-units="kg"[^>]*><b>кг<\/b>.*data-units="lb" aria-pressed="true"><b>фунты<\/b>/);
  ru.get(`S.units='kg'`);
  assert.equal(ru.get(`setText([30, 8, 120, {l:[30, 10], r:[30, 8]}], EXI.dbrow)`), 'лев. 30×10 · прав. 30×8');
  assert.deepEqual(ru.json(`(()=>{const w=weightLabel({...previewItem('pullup'),eqIds:['pullup']});return [loadType(EXI.pullup),w.full,w.short];})()`), ['extra', 'Дополнительный вес, кг', '+ вес, кг']);
  const html = ru.get(`(()=>{LOG.data={bbbench:[{d:'${day(1)}',s:[[60,8]]}]};LOG.canExport=true;let h='';const p={innerHTML:''};const q=document.querySelector;document.querySelector=()=>p;try{renderJournal();}finally{document.querySelector=q;}return p.innerHTML;})()`);
  assert.match(html, />Полная копия<\/button>/);
  assert.doesNotMatch(html, /JSON|Эпли|фнт|Л\/П/);
  assert.match(html, /Версия приложения: 0\.0\.0-test/, 'номер версии — в журнале, а не в заголовке атласа');
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/body.html'), 'utf8'), /mv-eyebrow[^<]*__VERSION__/);
  /* ступени прогрессии — «вариант легче / сложнее» */
  const prog = fs.readFileSync(path.join(root, 'src/js/10-progressions.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(prog, /[Сс]тупен/);
});

test('«3 повтора», «5 повторов», «1 повтор»; диапазон — «повторов»; число и «с» в темпе не разрываются', () => {
  const ru = loadApp({lang:'ru'}), en = loadApp({lang:'en'});
  assert.deepEqual(ru.json(`['1','3','5','21','8–12','10/8/6'].map(repsWord)`), ['повтор', 'повтора', 'повторов', 'повтор', 'повторов', 'повторов']);
  assert.deepEqual(en.json(`['1','3','8–12'].map(repsWord)`), ['rep', 'reps', 'reps']);
  /* в карточке число и «с» держатся вместе (неразрывный пробел), точка-разделитель — за концом темпа; в тексте плана — обычные пробелы */
  const card = ru.get(`(()=>{Object.assign(S,{mode:'single',goal:'strength',level:'mid',format:'classic',groups:['chest'],count:3,seed:3});const p=buildPlan();return cardHtml(p.items.find(it=>it.rx.tempo),0);})()`);
  assert.match(card, /темп: [^<]*\d с<\/span><i> ·<\/i> <span>/);
  assert.equal(ru.get(`tempoWords('2-0-X-0')`), 'быстрое усилие, возврат 2 с');
  /* английский — как говорят в зале (Mike 6) */
  assert.equal(en.get(`tempoWords('2-0-X-0')`), 'lift fast, lower in 2 s');
  assert.equal(en.get(`tempoWords('3-0-1-0')`), 'lift in 1 s, lower in 3 s');
});

test('английская версия: Easy вместо Gentle везде, compound / isolation, Est. 1RM, physical therapist, короткие названия', () => {
  const dict = JSON.parse(fs.readFileSync(path.join(root, 'i18n/en.json'), 'utf8'));
  const {collect} = require('../i18n/translate');
  const js = fs.readdirSync(path.join(root, 'src/js')).filter(f => f.endsWith('.js')).sort().map(f => [f, fs.readFileSync(path.join(root, 'src/js', f), 'utf8')]);
  const css = fs.readdirSync(path.join(root, 'src/css')).filter(f => f.endsWith('.css')).sort().map(f => fs.readFileSync(path.join(root, 'src/css', f), 'utf8')).join('\n');
  const live = [...collect(js, fs.readFileSync(path.join(root, 'src/body.html'), 'utf8'), css).keys()];
  /* только строки, которые есть в приложении (в словаре остаются и прежние ключи) */
  const bad = live.filter(k => /\bgentle\b|physiotherapist|multi-muscle|\btargeted\b|fast effort|\bimplements?\b|\bback rest\b/i.test((dict[k] || '').replace(/<[^>]+>/g, ' ')) && !/Targeted work/.test(dict[k]));
  assert.deepEqual(bad.map(k => dict[k].slice(0, 80)), []);
  const en = loadApp({lang:'en'});
  assert.deepEqual(en.json(`['bbcurl','dbcurl','declinecrunch','leverrowm','cablefly','pushdown','bandcurl','rollout'].map(id => EXI[id].name)`),
    ['Barbell curl', 'Dumbbell curl', 'Decline crunch', 'Chest-supported machine row', 'Cable crossover', 'Triceps pushdown', 'Band curl', 'Ab wheel rollout']);
  assert.equal(en.get('GOALS.gentle.name'), 'Easy');
  /* id цели, групп и упражнений — прежние: сохранённые настройки, планы, журнал и ссылки читаются как раньше */
  assert.equal(en.get(`typeof GOALS.gentle + EXI.bbcurl.id + GN.hams`), 'objectbbcurlHamstrings');
  /* ракурсы вкладки «Мышцы» — в том же порядке и теми же словами, что в разборе (Mike 19) */
  assert.deepEqual(en.json('Object.values(ATLAS_CAMS)'), ['Top', 'Side', 'Front', 'Back']);
  assert.deepEqual(en.json(`CATALOG_CAMERAS.map(c => CAMERA3[c].label)`), ['Top', 'Angle', 'Side', 'Front', 'Back']);
});

test('поиск: BSS, JM press, pec fly, lat pull down; прежние названия и слова находят по-прежнему', () => {
  const en = loadApp({lang:'en'}), ru = loadApp({lang:'ru'});
  const ids = (app, q) => app.json(`searchExercises(${JSON.stringify(q)}).list.map(e => e.id)`);
  assert(ids(en, 'BSS').slice(0, 3).includes('bulgarian'), 'BSS → Bulgarian split squat');
  assert(ids(en, 'JM press').some(id => id === 'closegrip' || id === 'skull'), 'JM press → жим узким хватом и французский жим');
  for (const id of ['dbfly', 'cablefly', 'pecdeck']) assert(ids(en, 'pec fly').includes(id), 'pec fly → ' + id);
  assert.deepEqual(ids(en, 'lat pull down').sort(), ids(en, 'lat pulldown').sort(), '«lat pull down» находит то же, что «lat pulldown»');
  assert(ids(en, 'lat pull down').length >= 4);
  /* переименованное находится и по старому названию */
  for (const [q, id] of Object.entries({'barbell biceps curl':'bbcurl', 'ab bench crunch':'declinecrunch', 'cable crossover fly':'cablefly', 'resistance band curl':'bandcurl',
    'chest-supported lever row':'leverrowm', 'kneeling ab wheel rollout':'rollout', 'cable triceps pushdown':'pushdown'})) assert(ids(en, q).slice(0, 3).includes(id), `${q} → ${id}: ${ids(en, q).slice(0, 3)}`);
  assert(ids(ru, 'бицепс бедра').length > 0, '«бицепс бедра» по-прежнему находит заднюю поверхность бедра');
});

test('неделя календаря активности: с воскресенья для en-US, с понедельника для en-GB, без региона и в русской версии', () => {
  const from = (lang, nav) => loadApp({lang, nav}).get('weekFromSunday()');
  assert.equal(from('en', ['en-US', 'en']), true);
  assert.equal(from('en', ['en-CA']), true);
  assert.equal(from('en', ['en-GB', 'en']), false);
  assert.equal(from('en', ['en-AU']), false);
  assert.equal(from('en', ['en']), false);
  assert.equal(from('ru', ['en-US']), false, 'русская версия — всегда с понедельника');
  /* среда 18.11.2026: в последней колонке en-US четыре дня (вс–ср), в en-GB — три (пн–ср) */
  const lastCol = nav => { const xs = [...loadApp({lang:'en', nav}).get(`heatmap(new Date(2026, 10, 18), {})`).matchAll(/<rect class="hm hm\d" x="([\d.]+)"/g)].map(m => +m[1]); return xs.filter(x => x === Math.max(...xs)).length; };
  assert.equal(lastCol(['en-US']), 4);
  assert.equal(lastCol(['en-GB']), 3);
  const us = loadApp({lang:'en', nav:['en-US']}).get(`heatmap(new Date(2026, 10, 18), {})`);
  assert.match(us, /y="45">Mon<.*y="81">Wed<.*y="117">Fri</s, 'подписи дней сдвинуты на строку: Mon — вторая');
});

test('карточка плана: мышцы простыми словами, пояснение — при первом упоминании; в разборе — термины; «молот» — «Бицепс и плечевая»', () => {
  const ru = loadApp({lang:'ru'}), en = loadApp({lang:'en'});
  const seen = `(()=>{const s=new Set();return [muscleCardHtml('midback',EXI.bbrow,s),muscleCardHtml('midback',EXI.dbrow,s),muscleCardHtml('abs',EXI.crunch,s),muscleCardHtml('biceps',EXI.bbcurl,s),muscleCardHtml('delt_r',EXI.facepull,s,true)];})()`;
  assert.deepEqual(ru.json(seen), ['Ромбовидные<span class="mus-w"> — между лопатками</span>', 'Ромбовидные', 'Пресс', 'Бицепс', 'задняя дельта<span class="mus-w"> — задняя часть плеча</span>']);
  assert.deepEqual(en.json(seen).slice(0, 2), ['Rhomboids<span class="mus-w"> — between the shoulder blades</span>', 'Rhomboids']);
  /* разбор движения — терминология, как в 4.110 */
  assert.equal(ru.get(`muscleLabel('midback', EXI.bbrow)`), 'Ромбовидные и середина спины');
  assert.equal(ru.get(`muscleLabel('abs', EXI.crunch)`), 'Прямая мышца живота');
  /* «молот»: подпись — только у него, ключ мышцы и группа — прежние */
  assert.equal(ru.get(`muscleLabel('biceps', EXI.hammer)`), 'Бицепс и плечевая');
  assert.equal(ru.get(`muscleLabel('biceps', EXI.hammer, true)`), 'Бицепс и плечевая');
  assert.equal(ru.get(`muscleLabel('biceps', EXI.bbcurl)`), 'Бицепс');
  assert.equal(en.get(`muscleLabel('biceps', EXI.hammer)`), 'Biceps & brachialis');
  assert.deepEqual(ru.json(`[EXI.hammer.g, EXI.hammer.pri, Object.keys(MUSCLE_NAMES).length, GROUPS.length]`), ['biceps', ['biceps', 'forearms'], 21, 13]);
  /* у каждой мышцы с пояснением оно переведено, ключи — из MUSCLE_NAMES */
  assert.deepEqual(ru.json(`Object.keys(MUSCLE_WHERE).concat(Object.keys(MUSCLE_CARD)).filter(m => !MUSCLE_NAMES[m])`), []);
  assert.deepEqual(en.json(`Object.values(MUSCLE_WHERE).filter(s => /[а-яё]/i.test(s))`), []);
});

test('места: до трёх снарядов — названиями; кнопка карточки — «Начать отсюда» / «Продолжить отсюда»', () => {
  const ru = loadApp({lang:'ru'});
  assert.equal(ru.get(`placeGearText({equip:['db','band','abwheel']})`), 'гантели, эспандер-лента, ролик для пресса');
  assert.equal(ru.get(`placeGearText({equip:['band']})`), 'эспандер-лента');
  assert.equal(ru.get(`placeGearText({equip:['db','bb','kb','band']})`), '4 снаряда');
  assert.equal(ru.get(`placeGearText({equip:[]})`), 'без снаряжения');
  assert.match(ru.get(`cardStartHtml(previewItem('bbbench'), false)`), /^Начать отсюда<span class="vh"> — начать тренировку с упражнения: Жим штанги лёжа<\/span>/);
  assert.match(ru.get(`cardStartHtml(previewItem('bbbench'), true)`), /^Продолжить отсюда</);
  assert.match(loadApp({lang:'en'}).get(`cardStartHtml(previewItem('bbbench'), false)`), /^Start here<span class="vh"> — start the workout with: Barbell bench press</);
});

test('подсказка «Установить»: телефон, сайт, есть тренировка, не установлено, не закрыта; шаги для iPhone и Android разные', () => {
  const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
  const AND = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';
  const WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
  const app = (ua, {protocol = 'https:', standalone = false, storage, lang = 'ru'} = {}) => {
    const a = loadApp({lang, storage});
    a.context.navigator.userAgent = ua; a.context.navigator.standalone = standalone; a.context.location.protocol = protocol;
    return a;
  };
  assert.equal(app(IOS).get('installKind(1)'), 'ios');
  assert.equal(app(AND).get('installKind(3)'), 'android');
  assert.equal(app(WIN).get('installKind(3)'), null, 'на компьютере подсказки нет');
  assert.equal(app(IOS).get('installKind(0)'), null, 'пока в журнале нет тренировки — нет и подсказки');
  assert.equal(app(IOS, {standalone:true}).get('installKind(5)'), null, 'установленному приложению подсказка не нужна');
  assert.equal(app(AND, {protocol:'file:'}).get('installKind(5)'), null, 'офлайн-файл не устанавливается');
  /* шаги разные */
  const ios = app(IOS).get(`installHintHtml('ios')`), and = app(AND).get(`installHintHtml('android', true)`), menu = app(AND).get(`installHintHtml('android', false)`);
  assert.match(ios, /«Поделиться».*«На экран „Домой“»/); assert.doesNotMatch(ios, /data-install="go"/);
  assert.match(and, /data-install="go">Установить</); assert.doesNotMatch(and, /Поделиться|меню браузера/);
  assert.match(menu, /меню браузера \(⋮\).*«Установить приложение»/); assert.doesNotMatch(menu, /data-install="go"/);
  for (const h of [ios, and, menu]) assert.match(h, /data-install="close">Понятно</, 'подсказку можно закрыть');
  assert.match(app(IOS, {lang:'en'}).get(`installHintHtml('ios')`), /tap Share .* then Add to Home Screen/);
  /* закрыли — больше не показывается, и после перезапуска тоже */
  const storage = new Map(), a = app(IOS, {storage});
  a.get('installClose()');
  assert.equal(a.get('installKind(5)'), null);
  assert.equal(app(IOS, {storage}).get('installKind(5)'), null, 'выбор запомнен');
  assert.equal(storage.get('podhod.install.v1'), '{"closed":true}');
});
