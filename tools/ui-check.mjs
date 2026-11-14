/* Проверка поведения интерфейса в браузере: сворачивание блоков на телефоне и компьютере.
   node tools/ui-check.mjs [--file dist/lazy-gym-planner-offline-ru.html] — нужен собранный dist/ (npm run build). */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fileArg = process.argv.indexOf('--file'), file = fileArg > 0 ? path.resolve(process.argv[fileArg + 1]) : path.join(root, 'dist/lazy-gym-planner-offline-ru.html');
if (!fs.existsSync(file)) { console.error('Нет собранного файла — сначала npm run build'); process.exit(2); }

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
/* Каждая новая страница — первый запуск, и на ней открывается мастер (11k-first-run.js). Проверки плана, тренировки и атласа
   его не ждут: мастер закрывается без ответов сразу после запуска приложения (как и раньше, в хранилище — только отметка
   «план показан»). Сам мастер проверяется на страницах с { firstRun: true }. */
const skipFirstRun = () => addEventListener('DOMContentLoaded', () => { try { if (typeof firstRunClose === 'function') firstRunClose(); } catch (e) {} });
{
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (o = {}) => { const { firstRun, ...rest } = o; const c = await newContext(rest); if (!firstRun) await c.addInitScript(skipFirstRun); return c; };
  browser.newPage = async (o = {}) => { const c = await browser.newContext(o), pg = await c.newPage(); pg.on('close', () => c.close().catch(() => {})); return pg; };
}
const fails = [], errors = [];
const check = (ok, what) => { if (!ok) fails.push(what); };
/* рисунки движений — заглушки: проверяется поведение и раскладка, а не фигура */
const fakeFigures = page => page.evaluate(() => {
  const fake = () => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'fig'); return { svg, camera: 'side', at() {}, setTrace() {}, setVectors() {}, setJoints() {}, setStress() {}, setMuscles() {}, setRegion() {}, dispose() {} }; };
  window.buildFigure = fake; window.createMotionFigure = fake;
  /* карточки «Анатомии» (общий рендерер карточек) — тоже без настоящей графики; их проверка — отдельным блоком ниже */
  if (window.GymVolume) window.GymVolume.cards = () => null;
});
async function open(width, height = 800) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + file); await page.waitForTimeout(500);
  await fakeFigures(page);
  await page.evaluate(() => {
    /* мастер первого запуска (новый контекст — первый запуск) закрывается без ответов: здесь проверяется план; мастер — ниже */
    firstRunClose();
    Object.assign(S, { view: 'plan', mode: 'single', format: 'classic', goal: 'mass', level: 'mid', groups: ['chest', 'back', 'shoulders'], count: 5, seed: 3, fold: null, dur: null });
    LOG.data = {}; regen();
  });
  return page;
}
/* прямоугольник элемента простым объектом */
const rect = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; }, sel);
const apart = (a, b) => !!a && !!b && (a.r <= b.l + .5 || b.r <= a.l + .5 || a.b <= b.t + .5 || b.b <= a.t + .5);
/* checkVisibility учитывает и закрытый <details>: его содержимое в Chromium сохраняет размеры, но не рисуется */
const shown = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0 && e.offsetHeight > 0 && (!e.checkVisibility || e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })); }, sel);

/* телефон */
const page = await open(360);
check(await page.evaluate(() => S.fold.cards === 'compact' && !S.fold.setup && !S.fold.load), 'по умолчанию: карточки компактно, параметры и нагрузка раскрыты');
check(await shown(page, '#f-goal') && await shown(page, '#setup-fold-end'), 'параметры раскрыты, внизу кнопка «Свернуть параметры»');
await page.click('#setup-fold-end');
check(await page.evaluate(() => document.querySelector('.setup').classList.contains('folded') && S.fold.setup === true), 'кнопка снизу сворачивает параметры');
check(!(await shown(page, '#f-goal')) && await shown(page, '.sb-chips'), 'свёрнуто: поля скрыты, видна строка выбранного');
check(await page.evaluate(() => document.querySelector('#setup-bar').getBoundingClientRect().top >= -1), 'после сворачивания снизу строка параметров на экране');
await page.click('.sb-chip[data-sgo="#f-goal"]'); await page.waitForTimeout(100);
check(await page.evaluate(() => !S.fold.setup && Math.abs(document.querySelector('#f-goal').closest('.field').getBoundingClientRect().top) < 120), 'нажатие на «цель» раскрывает параметры и ведёт к цели');
await page.click('#setup-bar [data-sfold]');
await page.evaluate(() => regen());
check(await page.evaluate(() => document.querySelector('.setup').classList.contains('folded')), 'свёрнутые параметры остаются свёрнутыми после пересборки');

await page.click('[data-lfold]');
check(await page.evaluate(() => S.fold.load && document.querySelector('.p-load').classList.contains('folded')), 'нагрузка по мышцам сворачивается');
check(!(await shown(page, '.p-load .p-map')), 'свёрнутая нагрузка без схемы');
await page.evaluate(() => regen());
check(await page.evaluate(() => document.querySelector('.p-load.folded [data-lfold]').getAttribute('aria-expanded') === 'false'), 'нагрузка остаётся свёрнутой после пересборки');

const c0 = '.card:nth-child(1)';
check(!(await shown(page, `${c0} .lt-fold`)) && await shown(page, `${c0} .sug`), 'компактно: таблица скрыта, подсказка по весу на виду');
check(!(await shown(page, `${c0} .c-map`)), 'компактно: мышцы одной строкой');
await page.click(`${c0} [data-cfold="log"]`);
check(await shown(page, `${c0} .lt-fold`), 'запись раскрывается в одной карточке');
check(!(await shown(page, '.card:nth-child(2) .lt-fold')), 'соседняя карточка остаётся свёрнутой');
await page.fill(`${c0} .lt-r[data-k="0"] [data-f="reps"]`, '8');
await page.fill(`${c0} .lt-r[data-k="0"] [data-f="kg"]`, '40').catch(() => {});
await page.click(`${c0} [data-tick][data-k="0"]`); await page.waitForTimeout(100);
check(await page.evaluate(s => /^1 из \d+$/.test(document.querySelector(s + ' .lt-tog .cg-s').textContent), c0), 'счётчик записанных подходов обновляется сразу');
await page.click(`${c0} [data-hist]`);
await page.evaluate(() => logRefresh());
check(await page.evaluate(s => { const c = document.querySelector(s); return c.classList.contains('open-log') && c.querySelector('[data-cfold="log"]').getAttribute('aria-expanded') === 'true' && c.querySelector('[data-hist]').getAttribute('aria-expanded') === 'true'; }, c0), 'после перерисовки записи блок открыт, история знает своё состояние');
await page.evaluate(() => regen());
check(await page.evaluate(s => document.querySelector(s).classList.contains('open-log'), c0), 'раскрытая вручную карточка не сворачивается при пересборке');

await page.click('[data-cards="full"]');
check(await page.evaluate(() => S.fold.cards === 'full' && [...document.querySelectorAll('.card')].every(c => c.classList.contains('open-log') && c.classList.contains('open-mus'))), '«Подробно» раскрывает все карточки');
check(await shown(page, `${c0} .c-map`) && await shown(page, '.card:nth-child(2) .lt-fold'), '«Подробно»: схема мышц и таблицы на виду');
await page.click('[data-cards="compact"]');
check(await page.evaluate(() => [...document.querySelectorAll('.card')].every(c => !c.classList.contains('open-log'))), '«Компактно» сворачивает все, ручные раскрытия сбрасываются');

/* хваты: переключатель в карточке меняет упражнение в той же карточке; в своём плане — записывается в план */
await page.evaluate(() => { S.fold.setup = true; S.customs = [{ id: 'v1', name: 'Хваты', items: [{ id: 'pullup', sets: 4 }, { id: 'dbcurl' }] }]; S.custom = 'v1'; ensureCustoms(S); openCustom('v1'); regen(); });
await page.click('.card[data-slot="0"] [data-variant="chinup"]');
check(await page.evaluate(() => customOf().items[0].id === 'chinup' && customOf().items[0].sets === 4 && document.querySelector('.card[data-slot="0"]').dataset.ex === 'chinup'
  && document.querySelector('.card[data-slot="0"] [data-variant="chinup"]').getAttribute('aria-pressed') === 'true'), 'хват в своём плане: упражнение сменилось, подходы остались');
await page.evaluate(() => { S.mode = 'single'; S.groups = ['back', 'biceps']; S.count = 5; S.seed = 3; regen(); });
const gripCard = await page.evaluate(() => { const b = document.querySelector('.card [data-variant][aria-pressed="false"]'); return b ? [b.closest('.card').dataset.slot, b.dataset.variant] : null; });
check(gripCard, 'в собранной тренировке на спину и бицепс есть карточка с хватами');
if (gripCard) {
  await page.click(`.card[data-slot="${gripCard[0]}"] [data-variant="${gripCard[1]}"]`);
  check(await page.evaluate(([slot, id]) => document.querySelector(`.card[data-slot="${slot}"]`).dataset.ex === id, gripCard), 'хват в собранной тренировке: замена в той же карточке');
}
/* бережный режим: отметка сустава сразу перестраивает план, плашка с правилом боли сворачивается и помнит это */
await page.evaluate(() => { S.mode = 'single'; S.groups = ['quads', 'glutes', 'hams', 'calves']; S.fold.setup = false; regen(); });
await page.click('[data-protect="knees"]');
check(await page.evaluate(() => S.protect.includes('knees') && plan.items.every(it => !stressIdsOf(it.ex).some(r => ['knee', 'kneeOpen', 'landing'].includes(r)))), 'отметка «Колени» убирает из плана нагрузку на колени');
check(await shown(page, '.gentle-box p'), 'плашка бережного режима раскрыта');
await page.click('.gentle-box summary'); await page.waitForTimeout(100); /* событие toggle приходит следующей задачей */
check(await page.evaluate(() => S.fold.gentle === true), 'свёрнутая плашка запоминается');
await page.evaluate(() => regen());
check(!(await shown(page, '.gentle-box p')), 'и остаётся свёрнутой после пересборки');
await page.click('[data-protect="knees"]');
check(await page.evaluate(() => !S.protect.length && !document.querySelector('.gentle-box')), 'снятая отметка убирает плашку');
await page.evaluate(() => { S.mode = 'program'; regen(); });
check(await page.evaluate(() => { const d = document.querySelector('details.rule'); return !!d && !d.open; }), 'программа: правило прибавки свёрнуто');
await page.close();

/* атлас движений: витрина с фильтром «Чем работать», миниатюра открывает разбор, «← Все упражнения» возвращает */
{
  const g = await open(1280);
  await g.click('#motion-atlas'); await g.waitForTimeout(150);
  check(await shown(g, '#mv-gallery') && !(await shown(g, '#mv-detail')), 'кнопка атласа открывает витрину, а не разбор');
  check(await g.evaluate(() => document.querySelectorAll('.mv-tile').length === EX.length && document.querySelectorAll('.mv-gsec').length === GROUPS.filter(x => EX.some(e => e.g === x.id)).length), 'на витрине все упражнения по группам мышц');
  await g.click('[data-gallery-kind="band"]');
  check(await g.evaluate(() => { const t = [...document.querySelectorAll('.mv-tile')]; return t.length > 0 && t.every(b => workKind(EXI[b.dataset.galleryOpen]) === 'band') && document.querySelector('[data-gallery-kind="band"]').getAttribute('aria-pressed') === 'true'; }), 'фильтр «Резинки» оставляет только упражнения с резинкой');
  await g.click('[data-gallery-kind="all"]');
  await g.evaluate(() => { S.place = 'home'; ensurePlaces(S); }); await g.click('#mv-ghere');
  check(await g.evaluate(() => { const E = effEquip(S.equip), t = [...document.querySelectorAll('.mv-tile')]; return t.length > 0 && t.length < EX.length && t.every(b => available(EXI[b.dataset.galleryOpen], E)); }), '«только то, что есть в месте» скрывает недоступное');
  await g.click('#mv-ghere');
  await g.fill('#mv-gq', 'тяга верхнего');
  check(await g.evaluate(() => { const t = [...document.querySelectorAll('.mv-tile')].map(b => b.dataset.galleryOpen); return t.includes('latpull') && t.every(id => EXI[id].name.toLowerCase().includes('тяга верхнего')) && document.activeElement.id === 'mv-gq'; }), 'поиск по названию, курсор остаётся в поле');
  /* «ё» и «е» равны, окончания не важны: «отжимание» находит «Отжимания…», «жим лежа» — «Жим штанги лёжа» */
  const tiles = () => g.evaluate(() => [...document.querySelectorAll('.mv-tile')].map(b => b.dataset.galleryOpen));
  await g.fill('#mv-gq', 'отжимание'); let found = await tiles();
  check(found.includes('pushup') && found.includes('dip') && await g.evaluate(ids => ids.every(id => /отжимани/i.test(EXI[id].name)), found), '«отжимание» находит «Отжимания от пола», «Отжимания на брусьях» — и только отжимания');
  await g.fill('#mv-gq', 'жим лежа'); found = await tiles();
  await g.fill('#mv-gq', 'ЖИМ ЛЁЖА');
  check(found.includes('bbbench') && JSON.stringify(found) === JSON.stringify(await tiles()), '«жим лежа» и «ЖИМ ЛЁЖА» находят одно и то же, в том числе «Жим штанги лёжа»');
  await g.fill('#mv-gq', 'тяга верхнего');
  await g.click('[data-gallery-open="latpull"]'); await g.waitForTimeout(100);
  check(await shown(g, '#mv-detail') && !(await shown(g, '#mv-gallery')) && await g.evaluate(() => $('#mv-exercise').value === 'latpull' && detailMotion?.it.ex.id === 'latpull'), 'миниатюра открывает разбор этого упражнения');
  await g.click('#mv-back'); await g.waitForTimeout(100);
  check(await shown(g, '#mv-gallery') && await g.evaluate(() => document.activeElement?.dataset.galleryOpen === 'latpull' && !detailMotion), '«← Все упражнения» возвращает к витрине на то же упражнение');
  await g.keyboard.press('Escape'); await g.waitForTimeout(100);
  check(await g.evaluate(() => !$('#motion-view').open && !gallery.on), 'Esc закрывает атлас');
  await g.evaluate(() => { S.place = 'gym'; ensurePlaces(S); regen(); });
  await g.evaluate(() => openMotion(0)); await g.waitForTimeout(100);
  check(await shown(g, '#mv-detail') && !(await shown(g, '#mv-gallery')), '«Увеличить» в карточке плана открывает сразу разбор');
  /* вид фигуры: по умолчанию «Анатомия» (кости и мышцы в почти невидимом силуэте). Без объёмной графики доступен только
     манекен. У объёмной фигуры анатомия грузит кости и мышцы и передаёт их одним вызовом, «Скелет» — только кости,
     «Манекен» — ничего; выбор запоминается, подпись короткая (источники — в «О демонстрациях») */
  check(await g.evaluate(() => motionPrefs.view === 'anatomy' && $('[data-mv-figure="anatomy"]').disabled && $('[data-mv-figure="skeleton"]').disabled
    && $('[data-mv-figure="mannequin"]').getAttribute('aria-pressed') === 'true' && $('#mv-figure-note').hidden), 'без объёмной графики — только манекен');
  const fig = await g.evaluate(async () => {
    const calls = []; const f = detailMotion.f; f.setLayers = (b, a) => calls.push({ bones: b ? b.bones.length : 0, muscles: a ? a.muscles.muscles.length : 0, level: a?.level || null });
    applyFigureView(); for (let i = 0; i < 60 && !calls.some(c => c.muscles); i++) await new Promise(r => setTimeout(r, 50));
    const pressed = () => [...document.querySelectorAll('[data-mv-figure]')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.mvFigure).join();
    const anat = { last: calls.at(-1), note: $('#mv-figure-note').textContent, pressed: pressed(), pri: detailMotion.it.ex.pri, busy: $('#mv-figure').hasAttribute('aria-busy') };
    $('[data-mv-figure="skeleton"]').click(); const skel = { last: calls.at(-1), note: $('#mv-figure-note').textContent, pressed: pressed(), pref: motionPrefs.view };
    $('[data-mv-figure="mannequin"]').click(); const man = { last: calls.at(-1), hidden: $('#mv-figure-note').hidden, pressed: pressed(), pref: motionPrefs.view, saved: JSON.parse(localStorage.getItem('podhod.motion.v2')).view };
    $('[data-mv-figure="anatomy"]').click();
    return { anat, skel, man, back: { last: calls.at(-1), pref: motionPrefs.view }, thanks: $('#mv-detail').textContent };
  });
  /* костей 111: 102 — MyoSim, 9 — гортань и трахея (подъязычная, щитовидный, перстневидный и 6 отрезков трахеи: с 4.60.0 трахея
     от C6 до бифуркации — 11,6 см, 18 полуколец; до того — 8,6 см, 4 отрезка) */
  check(fig.anat.last?.bones === 111 && fig.anat.last.muscles === 530 && fig.anat.pri.every(m => fig.anat.last.level[m] === 1) && fig.anat.pressed === 'anatomy' && !fig.anat.busy && /О демонстрациях/.test(fig.anat.note) && fig.anat.note.length < 260,
    '«Анатомия» по умолчанию: 530 мышц на 111 костях (102 — MyoSim, 9 — гортань и трахея), основные мышцы выделены, короткая подпись');
  check(fig.skel.last?.bones === 111 && fig.skel.last.muscles === 0 && fig.skel.pressed === 'skeleton' && fig.skel.pref === 'skeleton' && /MyoSim/.test(fig.skel.note), '«Скелет» — только кости');
  check(fig.man.last?.bones === 0 && fig.man.last.muscles === 0 && fig.man.hidden && fig.man.pressed === 'mannequin' && fig.man.saved === 'mannequin', '«Манекен» убирает кости и мышцы, выбор запоминается');
  check(fig.back.last?.muscles === 530 && fig.back.pref === 'anatomy', 'возврат к «Анатомии»');
  check(/Укорачиваясь, мышца утолщается/.test(fig.thanks) && /DAS3/.test(fig.thanks), 'источники костей и мышц — в «О демонстрациях»');
  await g.close();
}

/* порядок упражнений: ↑ ↓ на карточке переставляют упражнение (в суперсетах — пару), порядок переживает перезапуск
   приложения и сбрасывается сменой параметров; в своём плане — свои кнопки */
{
  const o = await open(390), ids = () => o.evaluate(() => [...document.querySelectorAll('.card')].map(c => c.dataset.ex).join());
  const a = await ids();
  await o.click('.card:nth-child(1) [data-move][data-d="1"]'); await o.waitForTimeout(100);
  const b = await ids(), A = a.split(','), B = b.split(',');
  check(A[0] === B[1] && A[1] === B[0] && A.slice(2).join() === B.slice(2).join() && await o.evaluate(() => plan.blocks[0].items.map(it => it.label).join() === '1,2,3,4,5'),
    '↓ на первой карточке меняет местами первое и второе упражнения, номера пересчитаны');
  check(await o.evaluate(() => document.querySelector('.card [data-move][data-d="-1"]').disabled && [...document.querySelectorAll('.card')].at(-1).querySelector('[data-move][data-d="1"]').disabled), 'у крайних карточек лишняя стрелка выключена');
  await o.reload(); await o.waitForTimeout(400);
  check(await ids() === b, 'порядок сохраняется после перезапуска приложения');
  await o.evaluate(() => { S.count = 6; regen(); S.count = 5; regen(); });
  check(await ids() === a, 'смена параметров собирает план заново — порядок по правилам');
  await o.evaluate(() => { S.format = 'superset'; regen(); });
  const pairs = () => o.evaluate(() => plan.blocks.map(b => b.items.map(it => it.ex.id).join('+')).join(' '));
  const p1 = (await pairs()).split(' '); await o.click('.block .card [data-move][data-d="1"]'); await o.waitForTimeout(100);
  const p2 = (await pairs()).split(' ');
  check(p2[0] === p1[1] && p2[1] === p1[0], 'в суперсетах ↑ ↓ переставляют пару целиком');
  await o.evaluate(() => { Object.assign(S, { mode: 'custom', format: 'classic' }); regen(); });
  check(await o.evaluate(() => !document.querySelector('[data-move]')), 'в своём плане — только свои кнопки порядка');
  /* таймер отдыха: сигнал ставится на конец отдыха, ±15 переносит, «Готово» снимает; звук выключается и это запоминается */
  await o.evaluate(() => { Object.assign(S, { mode: 'single' }); regen(); startRest(60, 'Отдых'); });
  const st = () => o.evaluate(() => RestAlarm.state());
  let r = await st(); check(r.end > Date.now() + 55e3 && (r.audio === null || r.queued > 0), 'в конце отдыха запланирован сигнал');
  await o.click('#t-plus'); r = await st(); check(r.end > Date.now() + 70e3, '+15 переносит сигнал');
  await o.click('#t-sound'); check(await o.evaluate(() => !RestAlarm.on && localStorage.getItem('podhod.restSound') === 'off' && RestAlarm.state().queued === 0 && $('#t-sound').getAttribute('aria-pressed') === 'false'), 'кнопка выключает звук и запоминает выбор');
  await o.click('#t-sound'); await o.click('#t-skip'); r = await st(); check(r.end === 0 && r.queued === 0, '«Готово» снимает сигнал');
  /* векторы движения по умолчанию выключены; «включено» прежних версий выключается один раз */
  check(await o.evaluate(() => motionPrefs.vectors === false && !$('#mv-vectors').checked), 'векторы движения по умолчанию выключены');
  /* прежние флажки «Скелет»/«Анатомия мышц» один раз заменяются видом «Анатомия» */
  await o.evaluate(() => localStorage.setItem('podhod.motion.v2', JSON.stringify({ speed: 1, skeleton: true, anatomy: false, vectorsV: 2 }))); await o.reload(); await o.waitForTimeout(400);
  check(await o.evaluate(() => motionPrefs.view === 'anatomy' && motionPrefs.viewV === 1 && !('skeleton' in motionPrefs) && +motionPrefs.speed === 1), 'настройки прежних версий переходят на вид «Анатомия», скорость сохраняется');
  await o.close();
}

/* телефон (разбор 4.23.1, У2–У4, В1–В3): шапка в две строки, при повторном запуске план на первом экране; в разборе
   сцена сразу под заголовком, ракурсы одной строкой под ней; серый переключатель нагрузки на суставы с подписью;
   подписи карточки не закрывают рисунок, фаза — в одну строку; месяцы журнала не наезжают; счётчик оборудования целиком */
{
  const p = await open(390, 844);
  const head = await p.evaluate(() => {
    const q = s => { const r = document.querySelector(s).getBoundingClientRect(); return { t: r.top, b: r.bottom }; };
    return { top: q('.top'), logo: q('.logo'), atlas: q('#motion-atlas'), views: q('#views'), lang: q('.lang'), tag: getComputedStyle(document.querySelector('.tag')).display };
  });
  check(head.top.b - head.top.t <= 120 && head.tag === 'none' && head.atlas.t < head.logo.b && head.views.t >= head.atlas.b - 1 && head.lang.t < head.views.b && head.lang.b > head.views.t,
    'телефон: шапка в две строки — логотип и атлас, под ними разделы и язык; подпись скрыта');
  /* первый запуск теперь — мастер (проверка ниже, «первый запуск»); повторный запуск — параметры свёрнуты */
  await p.reload(); await p.waitForTimeout(500); await fakeFigures(p);
  check(await p.evaluate(() => !document.querySelector('#first-run').open && S.fold.setup === true && document.querySelector('.setup').classList.contains('folded') && document.querySelector('#plan').getBoundingClientRect().top < innerHeight * .6),
    'повторный запуск: мастера нет, параметры на телефоне свёрнуты, план — на первом экране');
  /* разбор: сцена под заголовком, ракурсы под сценой одной строкой, выбор упражнения — после управления движением */
  await p.evaluate(() => openMotionItem(previewItem('latpull'))); await p.waitForTimeout(150);
  const mv = await p.evaluate(() => {
    const q = s => { const r = document.querySelector(s).getBoundingClientRect(); return { t: r.top, b: r.bottom, h: r.height, w: r.width }; };
    return { head: q('.mv-head'), stage: q('#mv-stage'), cams: q('#mv-cameras'), toggles: q('.mv-toggles'), select: q('.mv-select'), tools: q('.mv-tools'),
      rows: new Set([...document.querySelectorAll('#mv-cameras button')].map(b => Math.round(b.getBoundingClientRect().top))).size,
      fit: document.querySelector('#mv-cameras').scrollWidth <= document.querySelector('#mv-cameras').clientWidth + 1, n: document.querySelectorAll('#mv-cameras button').length,
      back: !!document.querySelector('.mv-head #mv-back')?.offsetHeight, vh: innerHeight };
  });
  check(mv.stage.t - mv.head.b < 24 && mv.stage.t < 200, 'разбор на телефоне: сцена сразу под заголовком');
  check(mv.stage.h >= mv.vh * .5 && mv.stage.h > 320, 'разбор на телефоне: сцена выше прежних 320 px — кадр «Сверху под углом» крупнее');
  check(mv.n === 5 && mv.rows === 1 && mv.fit && mv.cams.t >= mv.stage.b, 'ракурсы — одной строкой под сценой, все пять видны');
  check(mv.select.t > mv.toggles.b && mv.tools.t > mv.select.t && mv.back, 'выбор упражнения и избранное — после управления движением, «← Все упражнения» — в шапке');
  check(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'разбор на телефоне без прокрутки вбок');
  /* нагрузка на суставы: без меток переключатель выключен и подписан, с метками — подписи нет */
  const stress = await p.evaluate(() => {
    const none = EX.find(e => !jointStress(e).rules.length), some = EX.find(e => jointStress(e).rules.length);
    const said = id => { const n = $(id); return !!n && !n.hidden && n.offsetParent !== null; };
    selectMotion(previewItem(none.id));
    const a = { off: $('#mv-stress-toggle').disabled, note: said('#mv-stress-none'), desc: $('#mv-stress-toggle').getAttribute('aria-describedby') === 'mv-stress-none' };
    selectMotion(previewItem(some.id));
    const b = { off: $('#mv-stress-toggle').disabled, note: said('#mv-stress-none') };
    configureStressPanel('wv', { it: previewItem(none.id) }); const w1 = !!$('#wv-stress-none') && !$('#wv-stress-none').hidden;
    configureStressPanel('wv', { it: previewItem(some.id) }); const w2 = !!$('#wv-stress-none') && $('#wv-stress-none').hidden;
    return { a, b, w: w1 && w2 };
  });
  check(stress.a.off && stress.a.note && stress.a.desc && !stress.b.off && !stress.b.note && stress.w, 'нагрузка на суставы: «в этом упражнении меток нет» — только у упражнений без меток (разбор и тренировка)');
  await p.click('#mv-back'); await p.waitForTimeout(100);
  check(!(await shown(p, '#mv-back')) && await shown(p, '#mv-close'), 'на витрине «← Все упражнения» скрыта');
  await p.evaluate(() => closeMotion());
  /* журнал: подписи месяцев не наезжают и не обрезаются ни в один день года */
  const months = await p.evaluate(() => {
    const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:0;top:0;width:300px;visibility:hidden'; document.body.append(host);
    const bad = [];
    for (let i = 0; i < 366; i++) {
      const d = new Date(2026, 0, 1 + i, 12); host.innerHTML = heatmap(d);
      const svg = host.querySelector('svg'), W = svg.viewBox.baseVal.width;
      const ls = [...svg.querySelectorAll('text.hm-l[y="10"]')].map(t => t.getBBox()).sort((a, b) => a.x - b.x);
      if (ls.length < 2 || ls.some((b, k) => b.x < 0 || b.x + b.width > W + .5 || (k && ls[k - 1].x + ls[k - 1].width + 2 > b.x))) bad.push(d.toDateString());
    }
    host.remove(); return bad;
  });
  check(!months.length, `журнал: подписи месяцев не наезжают друг на друга (${months.slice(0, 3).join(', ')})`);
  await p.close();

  for (const w of [360, 390]) {
    const c = await open(w, 800);
    await c.evaluate(() => document.querySelector('.card').scrollIntoView()); await c.waitForTimeout(150);
    const fig = await rect(c, '.card .illus > .fig'), view = await rect(c, '.card .illus-v'), zoom = await rect(c, '.card .illus-zoom');
    check(fig && Math.abs(fig.w - fig.h) < 1.5 && apart(fig, view) && apart(fig, zoom), `карточка (${w} px): «3D-вид» и «↗» не лежат на рисунке`);
    const caps = await c.evaluate(() => {
      const cap = document.querySelector('.card .motion-caption'), lh = parseFloat(getComputedStyle(cap).lineHeight), out = [];
      for (const label of ['Рабочая фаза', 'Конечная точка', 'Возврат', 'Исходное положение', 'Опускание', 'Нижняя точка', 'Подъём', 'Верхняя точка']) {
        cap.textContent = label; if (cap.scrollWidth > cap.clientWidth + .5 || cap.getBoundingClientRect().height > lh * 1.5) out.push(label);
      }
      return out;
    });
    check(!caps.length, `карточка (${w} px): фаза в одну строку без обрезки (${caps.join(', ')})`);
    const cnt = await c.evaluate(() => { const e = $('#e-count'), h3 = e.closest('.lbl'); return { h: e.getBoundingClientRect().height, lh: parseFloat(getComputedStyle(h3).lineHeight), text: e.textContent }; });
    check(/^\d+ из \d+$/.test(cnt.text) && cnt.h <= cnt.lh * 1.5, `«Оборудование места» (${w} px): счётчик «${cnt.text}» в одну строку`);
    check(await c.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `план (${w} px) без прокрутки вбок`);
    await c.close();
  }
}

/* первый запуск (11k-first-run.js): вместо «стены параметров» — вопросы по одному на экран. Шаги и счётчик, фокус на заголовке
   шага, «Назад» кнопкой, Esc и системной «Назад» — на предыдущий шаг (ответы на месте), цель без выбора по умолчанию, ответы →
   параметры, после — план сверху и параметры свёрнуты, записи шагов убраны из истории; повторный вход — без мастера;
   «Пропустить» — по умолчанию для новичка; данные прежних версий (настройки или только журнал) — без мастера */
{
  const fresh = async (width = 390, height = 844) => {
    const ctx = await browser.newContext({ viewport: { width, height }, firstRun: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errors.push(String(e)));
    await p.goto('file://' + file); await p.waitForTimeout(500); await fakeFigures(p);
    return { ctx, p };
  };
  const st = p => p.evaluate(() => ({ open: $('#first-run').open, step: $('#first-run').dataset.step, count: $('#fr-count').textContent, title: $('#fr-title').textContent,
    focus: document.activeElement.id, back: !$('#fr-back').hidden, skip: !$('#fr-skip').hidden }));
  const pressed = (p, sel) => p.evaluate(s => [...document.querySelectorAll(s)].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => Object.values(b.dataset)[0]).sort().join(), sel);
  {
    const { ctx, p } = await fresh();
    let s = await st(p);
    check(s.open && s.step === 'place' && s.count === 'Шаг 1 из 4' && s.title === 'Где вы будете тренироваться?' && s.focus === 'fr-title' && !s.back && s.skip,
      `первый запуск: мастер, шаг «Где», фокус на заголовке, «Пропустить» есть, «Назад» нет (${JSON.stringify(s)})`);
    check(await p.evaluate(() => [...document.querySelectorAll('[data-fr-place]')].map(b => b.dataset.frPlace).join() === S.places.map(x => x.id).join()), 'варианты места — места тренировок');
    check(await p.evaluate(() => $('#fr-title').getAttribute('aria-describedby') === 'fr-count' && $('#first-run').getAttribute('aria-labelledby') === 'fr-title'), 'окно названо заголовком шага, «Шаг N из M» — его описание');
    check(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth && $('#first-run').scrollWidth <= $('#first-run').clientWidth), 'мастер без прокрутки вбок');
    await p.click('[data-fr-place="home"]');
    s = await st(p);
    check(s.step === 'equip' && s.count === 'Шаг 2 из 4' && s.focus === 'fr-title' && s.back, `«Дом» → «Что есть под рукой?», фокус на заголовке (${JSON.stringify(s)})`);
    check(await pressed(p, '[data-fr-eq]') === await p.evaluate(() => placeOf(S, 'home').equip.slice().sort().join()), 'отмечен инвентарь места');
    await p.click('[data-fr-eq="kb"]'); await p.click('[data-fr-eq="band"]');
    await p.click('#fr-next');
    s = await st(p);
    check(s.step === 'goal' && s.count === 'Шаг 3 из 4' && !(await pressed(p, '[data-fr-goal]')), 'дальше — цель, ничего не выбрано заранее (нет «Массы» по умолчанию)');
    check(await p.evaluate(() => [...document.querySelectorAll('[data-fr-goal] small')].every(x => x.textContent.length > 20 && !/1ПМ|темп|БАЗОВОЕ/i.test(x.textContent))), 'у каждой цели — пояснение простыми словами');
    await p.goBack(); await p.waitForTimeout(250);
    s = await st(p);
    check(s.open && s.step === 'equip' && s.focus === 'fr-title', `системная «Назад» — на предыдущий шаг, а не из приложения (${JSON.stringify(s)})`);
    check(await pressed(p, '[data-fr-eq]') === 'abwheel,db,kb', 'отметки инвентаря сохранились');
    await p.click('#fr-next'); await p.click('[data-fr-goal="cut"]');
    s = await st(p);
    check(s.step === 'more' && s.count === 'Шаг 4 из 4' && !s.skip, 'последний шаг — время и опыт, без «Пропустить»');
    check(await p.evaluate(() => ['fr-q-dur', 'fr-q-lvl', 'fr-q-joint'].every(id => document.querySelector(`[aria-labelledby="${id}"][role="group"]`)) && $('[data-fr-protect="knees"]') === $('[data-fr-protect]')),
      'время, опыт и «Что беречь» — группы с заголовками; колени — первыми');
    await p.click('#fr-back'); s = await st(p);
    check(s.step === 'goal' && await pressed(p, '[data-fr-goal]') === 'cut' && s.focus === 'fr-title', 'кнопка «Назад» — на цель, выбор отмечен');
    await p.click('[data-fr-goal="cut"]'); await p.keyboard.press('Escape'); s = await st(p);
    check(s.open && s.step === 'goal', 'Esc — тоже на шаг назад, окно открыто');
    await p.click('[data-fr-goal="cut"]');
    await p.click('[data-fr-dur="short"]'); await p.click('[data-fr-level="mid"]'); await p.click('[data-fr-protect="knees"]'); await p.click('[data-fr-protect="lumbar"]'); await p.click('[data-fr-protect="lumbar"]');
    check(await pressed(p, '[data-fr-dur]') === 'short' && await pressed(p, '[data-fr-level]') === 'mid' && await pressed(p, '[data-fr-protect]') === 'knees', 'время и опыт — один ответ, суставы — отметки');
    await p.click('#fr-next'); await p.waitForTimeout(400);
    const after = await p.evaluate(() => ({ open: $('#first-run').open, goal: S.goal, level: S.level, dur: S.dur, place: S.place, equip: S.equip.slice().sort().join(), protect: S.protect.join(),
      groups: S.groups.length, fold: S.fold.setup, folded: $('.setup').classList.contains('folded'), planTop: $('#plan').getBoundingClientRect().top, vh: innerHeight, min: plan.minutes,
      focus: document.activeElement.className, durOn: $('#f-dur-seg [aria-pressed="true"]')?.dataset.dur, chip: [...document.querySelectorAll('.sb-chip')].map(c => c.textContent).join(' | ') }));
    check(!after.open && after.goal === 'cut' && after.level === 'mid' && after.dur === 'short' && after.place === 'home' && after.equip === 'abwheel,db,kb' && after.protect === 'knees' && after.groups === 7,
      `ответы мастера — в параметрах плана (${JSON.stringify(after)})`);
    check(after.fold && after.folded && after.planTop < after.vh * .6 && after.min >= 20 && after.min <= 30 && after.durOn === 'short' && /20–30 мин/.test(after.chip),
      `после мастера параметры свёрнуты, план сверху, ≈20–30 мин (${JSON.stringify(after)})`);
    check(/p-title/.test(after.focus), 'фокус — на названии плана');
    await p.waitForTimeout(400);
    check(await p.evaluate(() => !(history.state && history.state.lgOverlay)), 'записи шагов мастера убраны из истории');
    /* «Время на тренировку» в параметрах: другое время — другое число упражнений; «+» — своё число от показанного */
    await p.evaluate(() => setSetupFold(false));
    await p.click('[data-dur="long"]');
    const long = await p.evaluate(() => ({ dur: S.dur, min: plan.minutes, n: plan.items.length, shown: +$('#count-v').textContent, hint: $('#count-hint').textContent,
      seg: [...document.querySelectorAll('#f-dur-seg button')].map(b => b.textContent).join(' | ') }));
    check(long.dur === 'long' && long.min >= 60 && long.min <= 80 && long.shown === long.n && /подобрано под 60 мин и больше/.test(long.hint), `параметры: «60+» — ≈60–80 мин, «Упражнений» показывает подобранное (${JSON.stringify(long)})`);
    check(long.seg === '20–30мин | 45мин | 60+мин | Не задано', `параметры: варианты времени — «20–30 / 45 / 60+ мин / Не задано» (${long.seg})`);
    await p.click('#count-minus');
    const own = await p.evaluate(() => ({ dur: S.dur, count: S.count, n: plan.items.length, on: $('#f-dur-seg [aria-pressed="true"]')?.dataset.dur }));
    check(own.dur === null && own.count === long.n - 1 && own.n === long.n - 1 && own.on === '', `«−» при заданном времени: своё число от подобранного, время «не задано» (${JSON.stringify(own)})`);
    await p.reload(); await p.waitForTimeout(500);
    check(await p.evaluate(() => !$('#first-run').open && S.goal === 'cut' && S.place === 'home' && S.fold.setup === true), 'повторный вход: мастера нет, ответы сохранились');
    await ctx.close();
  }
  {
    /* «Пропустить» на первом шаге: по умолчанию для новичка; повторный вход — без мастера */
    const { ctx, p } = await fresh();
    await p.click('#fr-skip'); await p.waitForTimeout(300);
    const s = await p.evaluate(() => ({ open: $('#first-run').open, goal: S.goal, level: S.level, dur: S.dur, format: S.format, place: S.place, groups: S.groups.join(), fold: S.fold.setup,
      seen: localStorage.getItem('podhod.planSeen.v1'), stored: !!localStorage.getItem('podhod.settings.v1'), min: plan.minutes, eyebrow: $('#plan .eyebrow').textContent }));
    check(!s.open && s.goal === 'gentle' && s.level === 'beg' && s.dur === 'mid' && s.format === 'classic' && s.place === 'gym' && s.groups === 'chest,back,shoulders,quads,hams,glutes,abs' && s.fold && s.seen === '1' && s.stored && s.min >= 40 && s.min <= 50,
      `«Пропустить»: «Бережно», новичок, ≈45 мин, всё тело (${JSON.stringify(s)})`);
    await p.reload(); await p.waitForTimeout(500);
    check(await p.evaluate(() => !$('#first-run').open), '«Пропустить» — при следующем входе мастера нет');
    await ctx.close();
  }
  {
    /* «Пропустить» на шаге цели: место и инвентарь — как ответили, остальное — по умолчанию */
    const { ctx, p } = await fresh();
    await p.click('[data-fr-place="street"]'); await p.click('[data-fr-eq="db"]'); await p.click('#fr-next'); await p.click('#fr-skip'); await p.waitForTimeout(300);
    check(await p.evaluate(() => S.place === 'street' && S.equip.slice().sort().join() === 'db,dipbars,pullup' && S.goal === 'gentle'), '«Пропустить» после ответов: ответы на месте, остальное — по умолчанию');
    await ctx.close();
  }
  for (const [what, key, val] of [['настройки прежней версии', 'podhod.settings.v1', JSON.stringify({ goal: 'strength', format: 'classic', level: 'adv', count: 7, groups: ['chest', 'back', 'shoulders'], equip: ['db', 'bb', 'bench', 'incline', 'pullup', 'cable'], seed: 3, fold: { setup: false, load: false, cards: 'compact' } })],
    ['только журнал', 'podhod.log.v1', JSON.stringify({ bbbench: [{ d: '2026-11-01', s: [[60, 8]] }] })]]) {
    const { ctx, p } = await fresh();
    await p.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, v); }, [key, val]);
    await p.reload(); await p.waitForTimeout(500);
    const s = await p.evaluate(() => ({ open: $('#first-run').open, goal: S.goal, dur: S.dur, n: plan && plan.items ? plan.items.length : 0 }));
    check(!s.open && (key !== 'podhod.settings.v1' || (s.goal === 'strength' && s.dur === null && s.n === 7)), `${what}: мастера нет, план как раньше (${JSON.stringify(s)})`);
    await ctx.close();
  }
  {
    /* компьютер: мастер — окно поверх плана; после него параметры в боковой колонке раскрыты */
    const { ctx, p } = await fresh(1280, 900);
    const box = await rect(p, '#first-run');
    check(box && box.w <= 600 && box.l > 100, `компьютер: мастер — окно по центру (${JSON.stringify(box)})`);
    await p.click('[data-fr-place="gym"]');
    check((await st(p)).count === 'Шаг 2 из 3', 'зал: вопроса об инвентаре нет — три шага');
    await p.click('[data-fr-goal="mass"]'); await p.click('#fr-next'); await p.waitForTimeout(300);
    check(await p.evaluate(() => !$('#first-run').open && S.fold.setup === false && !$('.setup').classList.contains('folded') && S.goal === 'mass' && S.level === 'beg' && S.dur === 'mid'),
      'компьютер: после мастера параметры в колонке раскрыты; невыбранное — по умолчанию');
    await ctx.close();
  }
}

/* компьютер: параметры в боковой колонке не сворачиваются, в том числе при повторном запуске; разбор — как прежде,
   ракурсы над сценой; счётчик оборудования в узкой колонке целиком */
{
  const d = await open(1280);
  await d.reload(); await d.waitForTimeout(400); await fakeFigures(d);
  check(await d.evaluate(() => S.fold.setup === false && !document.querySelector('.setup').classList.contains('folded')), 'на компьютере параметры не сворачиваются и при повторном запуске');
  const cnt = await d.evaluate(() => { const e = $('#e-count'); return e.getBoundingClientRect().height <= parseFloat(getComputedStyle(e.closest('.lbl')).lineHeight) * 1.5; });
  check(cnt, 'компьютер: счётчик оборудования в одну строку');
  await d.evaluate(() => openMotionItem(previewItem('latpull'))); await d.waitForTimeout(100);
  const cams = await rect(d, '#mv-camera-controls'), stage = await rect(d, '#mv-stage');
  check(cams && stage && cams.b <= stage.t && await shown(d, '#mv-view') && await shown(d, '#mv-back'), 'компьютер: ракурсы над сценой, подпись ракурса на месте');
  await d.close();
}

/* режим тренировки на телефоне — время (Date.now) и Screen Wake Lock подделаны: экран не гаснет в тренировке и
   отпускается на выходе; отдых после нуля спокойно считает вверх «Отдых окончен · +0:25», экран цвет не меняет, сигнал по
   умолчанию — один раз (настройка «один раз / настойчиво» запоминается), фактический отдых — третьим полем подхода; таймер удержания:
   «Старт» → 3-2-1 → «до цели» → «сверх цели», «Стоп» пишет секунды в подход и начинает отдых; ручной ввод секунд;
   боковая планка — левая, пауза 10 с, правая, записывается слабая сторона; таймер отдыха в плане тоже считает вверх */
{
  const w = await open(390, 844);
  await w.evaluate(() => {
    const base = Date.now(); window.__dt = 0; Date.now = () => base + window.__dt; /* часы стоят, пока проверка их не сдвинет */
    window.__wl = { req: 0, rel: 0, locks: [] };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async type => {
      window.__wl.req++;
      const l = { type, released: false, onrelease: null, addEventListener(e, f) { if (e === 'release') l.onrelease = f; },
        release: async () => { if (!l.released) { l.released = true; window.__wl.rel++; l.onrelease?.(); } } };
      window.__wl.locks.push(l); return l;
    } } });
    localStorage.removeItem('podhod.restSignal'); localStorage.removeItem('podhod.restWarn');
    S.customs = [{ id: 'h1', name: 'Удержания', items: [{ id: 'plank', sets: 2 }, { id: 'sideplank', sets: 1 }, { id: 'pushup', sets: 1 }] }];
    S.custom = 'h1'; S.mode = 'custom'; ensureCustoms(S); openCustom('h1'); regen();
  });
  const adv = ms => w.evaluate(ms => { window.__dt += ms; workoutTick(); }, ms);
  const hold = () => w.evaluate(() => ({ mode: $('#wv-hold-mode').textContent, time: $('#wv-hold-time').textContent, btn: $('#wv-hold-go').textContent, sides: $('#wv-hold-sides').textContent, shown: !$('#wv-hold').hidden, done: $('#wv-done').disabled }));
  const rest = () => w.evaluate(() => ({ t: $('#wv-rest-time').textContent, done: !$('#wv-rest-done').hidden, mark: $('.wv-rest-clock').textContent, h: $('#wv-rest-heading').textContent, say: $('#wv-rest-say').textContent,
    red: $('#workout-view').classList.contains('rest-over'), hot: getComputedStyle($('#workout-view')).boxShadow.includes('inset'), note: $('#wv-rest-note').textContent, st: RestAlarm.state() }));
  await w.click('#start-workout'); await w.waitForTimeout(50);
  check(await w.evaluate(() => window.__wl.req === 1 && window.__wl.locks[0].type === 'screen' && ScreenAwake.state().held), 'тренировка: экран не гаснет — Wake Lock запрошен');
  await w.evaluate(() => { window.__wl.locks[0].release(); document.dispatchEvent(new Event('visibilitychange')); }); await w.waitForTimeout(50);
  check(await w.evaluate(() => window.__wl.req === 2 && ScreenAwake.state().held), 'система сняла блокировку — при возвращении на экран она берётся снова');

  let h = await hold();
  check(h.shown && h.time === '30 с' && h.btn === 'Старт' && /нижняя граница плана 30–45/.test(await w.textContent('#wv-hold-goal')) && /вручную/.test(await w.textContent('#wv-input-hint')), 'планка: таймер удержания, цель — нижняя граница плана, ручной ввод подписан');
  await w.click('#wv-hold-go'); h = await hold();
  check(h.mode === 'Приготовьтесь' && h.time === '3' && h.btn === 'Отмена' && h.done && await w.evaluate(() => RestAlarm.state().hold.join() === 'tick,tick,tick,go,end'), '«Старт»: отсчёт 3-2-1, звуки в очереди, «Подход выполнен» ждёт');
  await adv(3000 + 12000); h = await hold();
  check(h.mode === 'До цели' && h.time === '18 с' && h.btn === 'Стоп', 'после 3-2-1 — обратный отсчёт «до цели»');
  await adv(25000); h = await hold();
  check(h.mode === 'Сверх цели' && h.time === '+7 с', 'после цели — счёт вверх «сверх цели»');
  await w.click('#wv-hold-go');
  check(await w.evaluate(() => JSON.stringify(LOG.data.plank?.[0].s) === '[[null,37]]' && !$('#wv-rest').hidden && !RestAlarm.state().hold.length), '«Стоп» пишет секунды в подход и начинает отдых');

  let r = await rest();
  check(!r.red && /^\d:\d\d$/.test(r.t) && !r.done && r.st.signals.join() === 'end' && r.st.mode === 'once', `отдых: по умолчанию сигнал один раз — на нуле (${JSON.stringify(r)})`);
  const restSec = await w.evaluate(() => workout.queue[workout.last].rest);
  await adv(restSec * 1000 + 25000); r = await rest();
  check(r.t === '+0:25' && r.done && r.mark === 'Отдых окончен · +0:25' && r.h === 'Можно продолжать' && !r.red && !r.hot && r.say === 'Можно продолжать' && r.st.fired === 1,
    `после нуля спокойно: «Можно продолжать», «Отдых окончен · +0:25», экран не краснеет, диктору — «Можно продолжать» (${JSON.stringify(r)})`);
  check(await w.evaluate(() => $('#wv-rest-minus').disabled && $('#wv-rest-pause').disabled), 'после нуля «−15 сек.» и пауза выключены');
  await w.click('[data-rest-mode="persist"]');
  check(await w.evaluate(() => localStorage.getItem('podhod.restSignal') === 'persist' && RestAlarm.state().signals.join() === 'end,repeat,repeat,repeat' && $('[data-rest-mode="persist"]').getAttribute('aria-pressed') === 'true'), '«Настойчиво» — по выбору: повторы, выбор запоминается');
  await w.click('[data-rest-mode="once"]');
  check(await w.evaluate(() => localStorage.getItem('podhod.restSignal') === 'once' && RestAlarm.state().signals.join() === 'end'), '«Один раз» — снова без повторов');
  await w.click('[data-rest-mode="persist"]'); await w.check('[data-rest-warn]');
  check(await w.evaluate(() => localStorage.getItem('podhod.restSignal') === 'persist' && localStorage.getItem('podhod.restWarn') === 'on' && RestAlarm.warn), 'сигнал за 10 с до конца включается и запоминается');
  await w.uncheck('[data-rest-warn]');
  await w.click('#wv-continue');
  const taken = await w.evaluate(() => LOG.data.plank[0].s[0]);
  check(taken.length === 3 && taken[2] === restSec + 25, `фактический отдых записан третьим полем подхода (${JSON.stringify(taken)}, ждали ${restSec + 25})`);

  h = await hold();
  check(h.shown && !h.done && await w.evaluate(() => $('#wv-title').textContent.startsWith('Планка')), 'второй подход планки: таймер и ручной ввод доступны');
  await w.fill('#wv-reps', '41'); await w.click('#wv-done');
  check(await w.evaluate(() => LOG.data.plank[0].s[1][1] === 41 && LOG.data.plank[0].s[1].length === 2), 'ручной ввод секунд записывает подход');
  await w.click('#wv-continue');
  h = await hold();
  check(h.mode === 'Левая, затем правая' && await w.evaluate(() => /слабой стороны/.test($('#wv-unilateral').textContent) && !$('#wv-unilateral').hidden), 'боковая планка: обе стороны в одном подходе');
  await w.click('#wv-hold-go'); await adv(3000 + 42000); h = await hold();
  check(h.mode === 'Левая · сверх цели' && h.time === '+12 с', 'боковая планка: левая сторона');
  await w.click('#wv-hold-go'); h = await hold();
  check(h.mode === 'Смена стороны' && h.time === '10' && h.btn === 'Правая — сейчас' && /Левая 42 с/.test(h.sides), 'пауза 10 с перед правой, время левой на виду');
  await adv(10000 + 38000); h = await hold();
  check(h.mode === 'Правая · сверх цели' && h.time === '+8 с', 'правая сторона начинается сама после паузы');
  await w.click('#wv-hold-go'); r = await rest();
  check(await w.evaluate(() => LOG.data.sideplank?.[0].s[0][1] === 38) && /левая 42 с, правая 38 с/.test(r.note), 'записано время слабой стороны, обе цифры — в подсказке');
  check(await w.evaluate(() => JSON.stringify(LOG.data.sideplank[0].s[0].slice(3)) === '[{"l":[null,42],"r":[null,38]}]'), 'таймер боковой планки пишет обе стороны в поле сторон');
  await w.click('#wv-close');
  check(await w.evaluate(() => window.__wl.locks.at(-1).released && !ScreenAwake.state().want && !ScreenAwake.state().held && !$('#workout-view').classList.contains('rest-over')), 'выход из тренировки отпускает блокировку экрана');
  await w.evaluate(() => Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined }));
  await w.click('#start-workout'); await w.waitForTimeout(50);
  check(await w.evaluate(() => $('#workout-view').open && !ScreenAwake.state().held), 'без Wake Lock тренировка работает как раньше');
  await w.click('#wv-close');

  await w.evaluate(() => { localStorage.setItem('podhod.restSignal', 'persist'); S.mode = 'single'; regen(); startRest(60, 'Отдых'); });
  const bar = ms => w.evaluate(ms => { window.__dt += ms; tick(); return { t: $('#t-time').textContent, over: $('#timer').classList.contains('over'), hidden: $('#timer').hidden }; }, ms);
  let b = await bar(70000);
  check(b.t === '+0:10' && b.over && !b.hidden, 'таймер в плане после нуля считает вверх');
  b = await bar(50000);
  check(b.t === '+1:00' && !b.hidden, 'таймер в плане ждёт, пока идут повторы сигнала');
  b = await bar(6000);
  check(b.hidden && await w.evaluate(() => RestAlarm.state().end === 0), 'таймер в плане уходит через 5 с после последнего повтора');
  await w.close();
}

/* тренировка без случайных потерь (14a-workout-flow.js) на телефоне 390×844, часы подделаны: «К плану» — в плане «Продолжить
   тренировку →» и сколько сделано, время тренировки в плане не идёт; системная «Назад» (page.goBack) закрывает тренировку
   и разбор, а не приложение, Esc — как раньше, «Назад» в плане уходит со страницы, как раньше; пауза отдыха (время стоит,
   ±15 с, пульс — дальше); «Пропустить» и «Заменить» под выбором упражнения; длинное название переносится; экран отдыха при
   масштабе 150 % — таймер на виду; тренировка вчерашнего дня — вопрос «Продолжить вчерашнюю / Закончить её» */
{
  const f = await open(390, 844);
  await f.evaluate(() => {
    const base = Date.now(); window.__dt = 0; Date.now = () => base + window.__dt;
    localStorage.removeItem('podhod.workout.v3');
    S.customs = [{ id: 'wf', name: 'Поток', items: [{ id: 'declinepike', sets: 2 }, { id: 'dbbench', sets: 2 }, { id: 'dbrow', sets: 2 }, { id: 'squat', sets: 2 }] }];
    S.custom = 'wf'; S.mode = 'custom'; ensureCustoms(S); openCustom('wf'); LOG.data = {}; regen();
  });
  const adv = ms => f.evaluate(ms => { window.__dt += ms; workoutTick(); }, ms);
  const ws = () => f.evaluate(() => ({ open: $('#workout-view').open, btn: $('#start-workout')?.textContent, ask: !!$('#wip-ask'), el: $('#wv-elapsed').textContent, prog: $('#wv-progress-label').textContent,
    title: $('#wv-title').textContent, stack: OverlayBack.state().stack.join(), ov: history.state?.lgOverlay || '', motion: $('#motion-view').open }));
  /* длинное название в выборе — целиком, с переносом */
  await f.click('#start-workout'); await f.waitForTimeout(50);
  const pick = await f.evaluate(() => { const t = $('#wv-exercise-text'), o = $('#wv-exercise').selectedOptions[0], r = t.getBoundingClientRect(), sel = $('#wv-exercise').getBoundingClientRect();
    return { text: t.textContent, opt: o.textContent, lines: Math.round(r.height / parseFloat(getComputedStyle(t).lineHeight)), clip: t.scrollWidth > t.clientWidth + 1, cover: Math.abs(sel.height - r.height) < 2 && Math.abs(sel.width - r.width) < 2, right: r.right <= 390 }; });
  check(pick.text === pick.opt && /с ногами на возвышении$/.test(pick.text) && pick.lines >= 2 && !pick.clip && pick.cover && pick.right, `длинное название упражнения в выборе — целиком, переносится; выбор поверх подложки (${JSON.stringify(pick)})`);
  check(await f.evaluate(() => { const l = $('label[for="wv-exercise"]'); return l.contains($('#wv-exercise')) && $('#wv-exercise-text').getAttribute('aria-hidden') === 'true'; }), 'выбор упражнения остаётся настоящим <select> с подписью; подложка скрыта от диктора');
  /* подход, «К плану»: «Продолжить тренировку →» и «1 из 8 подходов»; время в плане не идёт */
  await f.fill('#wv-reps', '8'); await f.click('#wv-done');
  await adv(3 * 60000);
  let s = await ws();
  check(s.el === '3 мин в тренировке' && s.prog === '1 из 8 подходов', `время тренировки и прогресс (${JSON.stringify(s)})`);
  await f.click('#wv-close'); s = await ws();
  check(!s.open && s.btn === 'Продолжить тренировку →1 из 8 подходов' && await f.evaluate(() => document.activeElement === $('#start-workout')), `«К плану» без вопроса: в плане «Продолжить тренировку →», 1 из 8 подходов (${JSON.stringify(s)})`);
  await f.evaluate(() => { window.__dt += 40 * 60000; });
  await f.click('#start-workout'); s = await ws();
  check(s.open && s.el === '3 мин в тренировке', `40 минут в плане — время тренировки не шло (${s.el})`);
  /* пауза отдыха: время стоит, ±15 с от паузы, «▶» — дальше с того же места; пульсометр не мешает */
  const rs = () => f.evaluate(() => ({ t: $('#wv-rest-time').textContent, h: $('#wv-rest-heading').textContent, p: $('#wv-rest-pause').getAttribute('aria-pressed'), name: $('#wv-rest-pause').getAttribute('aria-label'), say: $('#wv-rest-say').textContent, note: $('#wv-rest-over').textContent, end: RestAlarm.state().end, hr: !!$('#wv-hr') }));
  check(!(await f.evaluate(() => $('#wv-rest').hidden)), 'вернулись — отдых продолжается');
  await f.evaluate(() => { window.__dt = workout.restUntil - Date.now() + window.__dt - 60000; workoutTick(); });
  await f.click('#wv-rest-pause'); let r = await rs();
  check(r.p === 'true' && r.name === 'Пауза отдыха' && r.h === 'Отдых на паузе' && r.say === 'Отдых на паузе' && r.t === '1:00' && r.end === 0 && r.hr, `⏸: отдых на паузе, сигнал снят (${JSON.stringify(r)})`);
  await adv(5 * 60000); r = await rs();
  check(r.t === '1:00' && r.h === 'Отдых на паузе', `на паузе время стоит (${r.t})`);
  await f.click('[data-wv-rest="15"]'); r = await rs();
  check(r.t === '1:15', `+15 с на паузе (${r.t})`);
  await f.click('#wv-rest-pause'); r = await rs();
  check(r.p === 'false' && r.h === 'Отдых' && r.t === '1:15' && r.end > 0 && r.say === 'Отдых продолжается', `▶: отдых дальше с того же места, сигнал снова стоит (${JSON.stringify(r)})`);
  await adv(16000); r = await rs();
  check(r.t === '0:59', `после паузы время снова идёт (${r.t})`);
  /* экран отдыха при масштабе 150 % (260×563 CSS-пикселей): фокус на «Перейти к подходу», таймер не уехал за верх */
  await f.click('#wv-continue');
  await f.setViewportSize({ width: 260, height: 563 });
  await f.fill('#wv-reps', '8'); await f.click('#wv-done'); await f.waitForTimeout(50);
  const z = await f.evaluate(() => { const t = $('#wv-rest-time').getBoundingClientRect(); return { top: t.top, bottom: t.bottom, focus: document.activeElement.id, scroll: $('#workout-view').scrollTop, wide: document.documentElement.scrollWidth <= 260 + 1 }; });
  check(z.focus === 'wv-continue' && z.top >= 0 && z.bottom <= 563, `масштаб 150 %: фокус на «Перейти к подходу», таймер на экране (${JSON.stringify(z)})`);
  await f.setViewportSize({ width: 390, height: 844 });
  await f.click('#wv-continue');
  /* «Пропустить»: следующее упражнение, «Пропущено: … Вернуть», в журнале ничего; «Вернуть» — обратно */
  s = await ws();
  const skipFrom = await f.evaluate(() => workout.queue[workout.index].it.ex.id);
  await f.click('#wv-skip');
  const sk = await f.evaluate(id => ({ cur: workout.queue[workout.index].it.ex.id, line: $('#wv-skip-line').hidden ? '' : $('#wv-skip-t').textContent, focus: document.activeElement.id, opt: [...$('#wv-exercise').options].find(o => o.value === id).textContent, log: !!LOG.data[id], prog: $('#wv-progress-label').textContent }), skipFrom);
  check(sk.cur !== skipFrom && /^Пропущено: /.test(sk.line) && sk.focus === 'wv-unskip' && /· пропущено$/.test(sk.opt) && !sk.log && sk.prog === '2 из 6 подходов', `«Пропустить»: дальше следующее, «Пропущено: … Вернуть», в журнале ничего (${JSON.stringify(sk)})`);
  await f.click('#wv-unskip');
  check(await f.evaluate(id => workout.queue[workout.index].it.ex.id === id && !workout.skipped.length && $('#wv-progress-label').textContent === '2 из 8 подходов', skipFrom), '«Вернуть»: пропущенное снова в тренировке');
  /* «Заменить»: тот же список, что в карточке плана; выбор меняет упражнение в плане и в тренировке, записанные подходы остаются */
  await f.evaluate(() => workoutShow(0));
  await f.click('#wv-swap');
  const sw = await f.evaluate(() => { const it = workout.queue[workout.index].it, o = swapOptions(it.ex, plan), want = (o.close.length ? o.close : o.far).map(r => r.ex.id);
    return { got: [...document.querySelectorAll('#wv-swap-pick [data-wv-swap]')].map(b => b.dataset.wvSwap), want, exp: $('#wv-swap').getAttribute('aria-expanded'), focus: document.activeElement.dataset.wvSwap || '' }; });
  check(sw.got.length > 0 && sw.got.join() === sw.want.join() && sw.exp === 'true' && sw.focus === sw.got[0], `«Заменить» в тренировке — тот же список, что в карточке (${JSON.stringify(sw)})`);
  await f.keyboard.press('Escape');
  check(await f.evaluate(() => $('#workout-view').open && $('#wv-swap-pick').hidden && document.activeElement.id === 'wv-swap'), 'Esc сворачивает список замен, тренировка остаётся');
  await f.click('#wv-swap'); await f.click(`#wv-swap-pick [data-wv-swap="${sw.got[0]}"]`);
  const sd = await f.evaluate(({ to }) => ({ cur: workout.queue[workout.index].it.ex.id, plan: customOf().items.map(i => i.id).join(), log: JSON.stringify(LOG.data.declinepike?.[0].s.map(x => x[1])), prog: $('#wv-progress-label').textContent, status: $('#wv-save-status').textContent,
    card: document.querySelector('.card[data-slot="0"] .sw-done')?.textContent || '', open: $('#workout-view').open, opt: $('#wv-exercise').value }), { to: sw.got[0] });
  check(sd.open && sd.cur === sw.got[0] && sd.opt === sw.got[0] && sd.plan.startsWith(sw.got[0] + ',') && sd.log === '[8,8]' && sd.prog === '2 из 10 подходов' && /^Заменено: /.test(sd.status) && /Записанные подходы остаются в журнале/.test(sd.status) && /^Заменено: /.test(sd.card),
    `замена: в плане и в тренировке новое упражнение, два записанных подхода в журнале и в прогрессе (${JSON.stringify(sd)})`);
  /* «Назад»: тренировка закрывается, план на месте; разбор поверх тренировки — сначала разбор; Esc — как раньше */
  const url = f.url();
  await f.goBack(); await f.waitForTimeout(150); s = await ws();
  check(!s.open && f.url() === url && !s.stack && !s.ov && /^Продолжить тренировку →/.test(s.btn), `«Назад» на экране тренировки — к плану, не из приложения (${JSON.stringify(s)})`);
  await f.click('#start-workout'); await f.click('#wv-technique'); await f.waitForTimeout(50); s = await ws();
  check(s.open && s.motion && s.stack === 'workout,motion' && s.ov === 'motion', `разбор поверх тренировки — две записи (${JSON.stringify(s)})`);
  await f.goBack(); await f.waitForTimeout(150); s = await ws();
  check(s.open && !s.motion && s.stack === 'workout', `«Назад» в разборе — к тренировке (${JSON.stringify(s)})`);
  await f.keyboard.press('Escape'); await f.waitForTimeout(150); s = await ws();
  check(!s.open && !s.stack && !s.ov && f.url() === url, `Esc по-прежнему закрывает тренировку, запись истории снята (${JSON.stringify(s)})`);
  await f.click('#motion-atlas'); await f.waitForTimeout(50);
  await f.click('[data-gallery-open]'); await f.waitForTimeout(50); s = await ws();
  check(s.motion && s.stack === 'motion,motion-detail' && await f.evaluate(() => !$('#mv-detail').hidden), `атлас → карточка упражнения (${JSON.stringify(s)})`);
  await f.goBack(); await f.waitForTimeout(150); s = await ws();
  check(s.motion && s.stack === 'motion' && await f.evaluate(() => !$('#mv-gallery').hidden), `«Назад» из карточки атласа — к витрине (${JSON.stringify(s)})`);
  await f.goBack(); await f.waitForTimeout(150); s = await ws();
  check(!s.motion && !s.stack && f.url() === url, `«Назад» в витрине — к плану (${JSON.stringify(s)})`);
  await f.click('#mv-close').catch(() => {});
  /* тренировка вчерашнего дня: вопрос в плане; «Продолжить вчерашнюю» — вчерашние подходы сделаны, новый — сегодняшним днём */
  const seedYesterday = () => f.evaluate(() => {
    const d = new Date(); d.setDate(d.getDate() - 1); const y = dayKey(d);
    S.customs.find(c => c.id === 'wf').items = [{ id: 'declinepike', sets: 2 }, { id: 'dbbench', sets: 2 }, { id: 'dbrow', sets: 2 }, { id: 'squat', sets: 2 }]; LOG.data = { declinepike: [{ d: y, s: [[null, 8], [null, 8]] }], dbbench: [{ d: y, s: [[20, 10]] }] };
    regen(); const q = workoutQueue(plan);
    localStorage.setItem('podhod.workout.v3', JSON.stringify({ stamp: workoutStamp(q), day: y, days: [y], index: 3, spent: 20 * 60000, done: 3, total: 8, drafts: {}, skipped: [], gone: [] }));
    regen(); return y;
  });
  const y = await seedYesterday();
  const ask = await f.evaluate(() => ({ h: $('#wip-ask h2')?.textContent, p: $('#wip-ask p')?.textContent, b: [...document.querySelectorAll('#wip-ask button')].map(b => b.textContent).join(), btn: $('#start-workout').textContent }));
  check(ask.h === 'Вчерашняя тренировка не закончена' && ask.p === '3 из 8 подходов — они уже в журнале.' && ask.b === 'Продолжить вчерашнюю,Закончить её' && ask.btn === 'Начать тренировку →', `на следующий день — вопрос, а не молчаливая потеря (${JSON.stringify(ask)})`);
  await f.click('[data-wip="go"]'); s = await ws();
  check(s.open && s.prog === '3 из 8 подходов' && s.el === '20 мин в тренировке' && await f.evaluate(() => workout.queue[workout.index].it.ex.id === 'dbbench' && workout.queue[workout.index].k === 1), `«Продолжить вчерашнюю»: вчерашние подходы сделаны, дальше — второй подход жима (${JSON.stringify(s)})`);
  await f.fill('#wv-kg', '20'); await f.fill('#wv-reps', '9'); await f.click('#wv-done');
  check(await f.evaluate(y => JSON.stringify(LOG.data.dbbench.map(x => [x.d === y ? 'y' : x.d === todayKey() ? 't' : x.d, x.s.filter(Boolean).length])) === '[["y",1],["t",1]]' && $('#wv-progress-label').textContent === '4 из 8 подходов', y), 'новый подход — сегодняшним днём, вчерашний на месте');
  await f.click('#wv-close');
  check(await f.evaluate(() => !$('#wip-ask') && $('#start-workout').textContent === 'Продолжить тренировку →4 из 8 подходов'), 'после продолжения вопроса нет — «Продолжить тренировку →»');
  await seedYesterday();
  await f.click('[data-wip="end"]');
  check(await f.evaluate(() => !$('#wip-ask') && $('#start-workout').textContent === 'Начать тренировку →' && $('#save-msg').textContent === 'Вчерашняя тренировка закончена. Её подходы — в журнале.' && document.activeElement === $('#start-workout') && JSON.parse(localStorage.getItem('podhod.workout.v3')).ended === true),
    '«Закончить её»: вопрос убран, «Начать тренировку →», подходы — в журнале');
  /* «Назад» в плане без окон — как раньше: уходит со страницы */
  await f.goBack(); await f.waitForTimeout(150);
  check(f.url() !== url, `«Назад» в плане уходит со страницы, как раньше (${f.url()})`);
  await f.close();
}

/* вес гантелей и стороны (13a-sets.js): «Вес одной гантели, кг» и «×2 = 40 кг»; «Л/П отдельно» в тренировке и в карточке
   пишет обе стороны, слабую — в основные поля; общий вес — после подхода, в итогах и в журнале; «Л … · П …» в истории */
{
  const v = await open(390, 844);
  await v.evaluate(() => {
    S.customs = [{ id: 'g1', name: 'Гантели', items: [{ id: 'dbbench', sets: 1 }, { id: 'dbrow', sets: 2 }, { id: 'goblet', sets: 1 }] }];
    S.custom = 'g1'; S.mode = 'custom'; S.lr = {}; ensureCustoms(S); openCustom('g1'); regen();
  });
  const f = () => v.evaluate(() => ({ cap: $('#wv-weight-caption').textContent, rep: $('#wv-rep-caption').textContent, x2: $('#wv-kg-total').textContent,
    bar: !$('#wv-lr-bar').hidden, lr: $('#wv-lr').getAttribute('aria-pressed'), one: !$('#wv-one').hidden, two: !$('#wv-lr-fields').hidden }));
  await v.click('#start-workout'); await v.waitForTimeout(50);
  await v.fill('#wv-kg', '20'); await v.fill('#wv-reps', '10');
  let s = await f();
  check(s.cap === 'Вес одной гантели, кг' && s.x2 === '×2 = 40 кг' && s.rep === 'Повторы' && !s.bar && s.one, `жим гантелей: «Вес одной гантели, кг», «×2 = 40 кг», без Л/П (${JSON.stringify(s)})`);
  await v.fill('#wv-kg', '22');
  check(await v.evaluate(() => $('#wv-kg-total').textContent === '×2 = 44 кг'), '«×2» обновляется при вводе веса');
  await v.fill('#wv-kg', '20'); await v.click('#wv-done');
  check(await v.evaluate(() => JSON.stringify(LOG.data.dbbench[0].s) === '[[20,10]]' && LOG.data.dbbench[0].eq === 'db' && /общий вес подхода 400 кг/.test($('#wv-rest-note').textContent)), 'подход записан как вес одной гантели; после подхода — общий вес 400 кг');
  await v.click('#wv-continue');
  s = await f();
  check(s.cap === 'Вес гантели, кг' && !s.x2 && s.rep === 'Повторы на каждую сторону' && s.bar && s.lr === 'false' && s.one && !s.two, `тяга одной рукой: одна гантель, повторы на каждую сторону, «Л/П отдельно» выключен (${JSON.stringify(s)})`);
  await v.click('#wv-lr'); s = await f();
  check(s.lr === 'true' && !s.one && s.two && await v.evaluate(() => S.lr.dbrow === true && JSON.parse(localStorage.getItem('podhod.settings.v1')).lr.dbrow === true), '«Л/П отдельно»: две строки — левая и правая, выбор запоминается');
  await v.fill('#wv-kg-l', '30'); await v.fill('#wv-reps-l', '10'); await v.fill('#wv-kg-r', '30'); await v.fill('#wv-reps-r', '8'); await v.click('#wv-done');
  check(await v.evaluate(() => JSON.stringify(LOG.data.dbrow[0].s[0]) === '[30,8,null,{"l":[30,10],"r":[30,8]}]'), 'тренировка: обе стороны в поле сторон, слабая (правая) — в основных полях');
  check(await v.evaluate(() => /общий вес подхода 540 кг/.test($('#wv-rest-note').textContent) && /слабая сторона — правая/i.test($('#wv-rest-note').textContent)), 'после подхода с Л/П: общий вес — сумма сторон, слабая сторона названа');
  await v.click('#wv-continue');
  s = await f();
  check(s.two && await v.evaluate(() => $('#wv-kg-l').value === '30' && $('#wv-kg-r').value === '30' && $('#wv-reps-l').value === ''), 'второй подход: Л/П остаётся включённым, вес сторон подставлен из первого');
  await v.fill('#wv-reps-l', '9'); await v.fill('#wv-reps-r', '9');
  await v.click('#wv-lr'); s = await f();
  check(s.one && await v.evaluate(() => $('#wv-kg').value === '30' && $('#wv-reps').value === '9' && !S.lr.dbrow), 'выключили Л/П — введённое переходит в общую пару');
  await v.click('#wv-done');
  check(await v.evaluate(() => JSON.stringify(LOG.data.dbrow[0].s[1].slice(0, 2)) === '[30,9]' && LOG.data.dbrow[0].s[1].length <= 3), 'без Л/П — одна пара «вес × повторы», как раньше');
  await v.click('#wv-continue');
  s = await f();
  check(s.cap === 'Вес гантели, кг' && !s.x2 && !s.bar, 'гоблет: одна гантель, без «×2» и без Л/П');
  await v.fill('#wv-kg', '24'); await v.fill('#wv-reps', '10'); await v.click('#wv-done');
  check(await v.evaluate(() => !$('#wv-finish').hidden && /Общий вес — 1 720 кг/.test($('#wv-finish-text').textContent) && /1 080 кг/.test($('#wv-summary').textContent)), 'итоги тренировки: общий вес за тренировку и по упражнениям');
  await v.click('#wv-finish-close');
  /* карточка плана: Л/П в таблице, подпись столбца, «×2» под таблицей */
  await v.evaluate(() => { document.querySelectorAll('.card').forEach(c => { const b = c.querySelector('[data-cfold="log"]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); }); });
  check(await v.evaluate(() => { const h = document.querySelector('.card[data-ex="dbbench"] .lt-h span[title]'); return h && h.title === 'Вес одной гантели, кг' && h.textContent === 'Гантель, кг' && document.querySelector('.card[data-ex="dbbench"] .lt-x2').textContent.includes('×2 = 40 кг'); }), 'карточка: столбец «Гантель, кг» (подсказка — вес одной гантели), под таблицей «×2 = 40 кг»');
  await v.click('.card[data-ex="dbbench"] [data-addset]');
  await v.fill('.card[data-ex="dbbench"] .lt-r[data-k="1"] [data-f="kg"]', '24');
  check(await v.evaluate(() => document.querySelector('.card[data-ex="dbbench"] .lt-x2 b').textContent === '×2 = 48 кг'), 'карточка: «×2» обновляется при вводе');
  await v.click('.card[data-ex="dbrow"] [data-lr]');
  check(await v.evaluate(() => S.lr.dbrow === true && document.querySelectorAll('.card[data-ex="dbrow"] .lt-r.lt-lr').length === 2 && document.querySelector('.card[data-ex="dbrow"] [data-lr]').getAttribute('aria-pressed') === 'true' && document.activeElement?.dataset.lr === 'dbrow'), 'карточка: «Л/П отдельно» — подход в две строки, фокус на переключателе');
  check(await v.evaluate(() => { const r = document.querySelector('.card[data-ex="dbrow"] .lt-r[data-k="0"]'); return r.classList.contains('done') && r.querySelector('[data-side="l"][data-f="reps"]').value === '10' && r.querySelector('[data-side="r"][data-f="reps"]').value === '8'; }), 'карточка: записанный подход показывает обе стороны');
  await v.click('.card[data-ex="dbrow"] [data-tick][data-k="1"]'); /* снять второй подход и записать его заново по сторонам */
  await v.fill('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="kg"][data-side="l"]', '28');
  await v.fill('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="reps"][data-side="l"]', '12');
  await v.fill('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="kg"][data-side="r"]', '30');
  await v.fill('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="reps"][data-side="r"]', '8');
  await v.click('.card[data-ex="dbrow"] [data-tick][data-k="1"]');
  check(await v.evaluate(() => JSON.stringify(LOG.data.dbrow[0].s[1]) === '[30,8,null,{"l":[28,12],"r":[30,8]}]'), 'карточка: обе стороны записаны, слабая по расчётному максимуму (30 × 8 слабее 28 × 12) — в основных полях');
  await v.fill('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="reps"][data-side="r"]', '11');
  await v.dispatchEvent('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="reps"][data-side="r"]', 'change');
  check(await v.evaluate(() => JSON.stringify(LOG.data.dbrow[0].s[1]) === '[28,12,null,{"l":[28,12],"r":[30,11]}]'), 'карточка: исправление стороны пересчитывает слабую');
  await v.click('.card[data-ex="dbrow"] [data-lr]');
  check(await v.evaluate(() => !S.lr.dbrow && !document.querySelector('.card[data-ex="dbrow"] .lt-r.lt-lr') && document.querySelector('.card[data-ex="dbrow"] .lt-r[data-k="1"] [data-f="reps"]').value === '12'), 'карточка: выключили Л/П — в строке слабая сторона');
  /* журнал: последние тренировки с общим весом, история «Л … · П …» */
  await v.evaluate(() => { S.view = 'journal'; renderSetup(); renderPlan(); });
  const j = await v.evaluate(() => ({ day: document.querySelector('.j-days li')?.textContent || '', hist: [...document.querySelectorAll('.j-row')].find(li => li.querySelector('[data-del="dbrow"]'))?.textContent || '' }));
  check(/сегодня/.test(j.day) && /3 упражнения · 4 подхода/.test(j.day) && /1 846\s*кг/.test(j.day), `журнал: тренировка дня — упражнения, подходы, общий вес (${j.day})`);
  check(/Л 30×10 · П 30×8; Л 28×12 · П 30×11/.test(j.hist) && /общий вес 1 206 кг/.test(j.hist), `журнал: история — «Л … · П …» и общий вес (${j.hist.replace(/\s+/g, ' ').slice(0, 200)})`);
  await v.close();
}

/* загрузка мышц по журналу (13d-muscle-load.js): панели нет при пустом журнале; с записями — 11 групп со статусами;
   «Собрать тренировку на сегодня» собирает разовую тренировку с объяснением по группам; смена мышц — обычный подбор */
{
  const seedLog = page => page.evaluate(() => {
    const d = n => { const x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - n); return dayKey(x); };
    const s = n => Array.from({ length: n }, () => [50, 10]);
    LOG.data = { squat: [{ d: d(3), s: s(4) }], bbbench: [{ d: d(3), s: s(4) }], latpull: [{ d: d(1), s: s(4) }], ohp: [{ d: d(1), s: s(3) }], bbcurl: [{ d: d(2), s: s(3) }] };
    S.view = 'journal'; renderSetup(); renderPlan();
  });
  const st = (page, g) => page.evaluate(g => { const li = document.querySelector(`#ml [data-lg="${g}"]`); return li ? ['loaded', 'recovering', 'ready'].find(x => li.classList.contains('st-' + x)) : null; }, g);
  const noSide = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  const j = await open(390, 844);
  await j.evaluate(() => { S.view = 'journal'; renderSetup(); renderPlan(); });
  check(await j.evaluate(() => !document.querySelector('#ml') && !document.querySelector('[data-logpick]')), 'пустой журнал: панели «Загрузка мышц» и кнопки «По журналу» нет');
  await seedLog(j);
  check(await shown(j, '#ml') && await j.evaluate(() => document.querySelectorAll('#ml .ml-list li').length === 11), 'журнал с записями: панель загрузки мышц видна, 11 групп');
  check(await st(j, 'back') === 'loaded' && await st(j, 'biceps') === 'recovering' && await st(j, 'chest') === 'ready'
    && await j.evaluate(() => /вчера, 4 подхода/.test(document.querySelector('#ml [data-lg="back"] .ml-st').textContent)), 'статусы: спина вчера — нагружена, бицепс позавчера — восстанавливается, грудь — готова');
  check(await noSide(j), 'журнал с панелью загрузки (390 px) без прокрутки вбок');
  await j.click('[data-logpick="journal"]'); await j.waitForTimeout(100);
  const built = await j.evaluate(() => ({ view: S.view, mode: S.mode, byLog: !!plan.byLog, groups: S.groups.slice(), lines: document.querySelectorAll('.lp li').length,
    text: document.querySelector('.lp')?.textContent || '', eyebrow: document.querySelector('.p-head .eyebrow').textContent, pre: !!document.querySelector('.pre-log.on'),
    ex: plan.items.map(it => it.ex.g) }));
  check(built.view === 'plan' && built.mode === 'single' && built.byLog && built.lines === built.groups.length && built.lines > 0 && /^По журналу/.test(built.eyebrow) && built.pre,
    'кнопка собирает тренировку на сегодня: строка-объяснение по каждой группе, заготовка «По журналу» отмечена');
  check(!built.groups.includes('back') && !built.groups.includes('shoulders') && !built.ex.includes('back') && /Спина: \d/.test(built.text) === false && /Отдыхают.*спина \(вчера\)/.test(built.text),
    'нагруженные вчера спина и плечи пропущены и названы в объяснении');
  check(await noSide(j), 'план по журналу (390 px) без прокрутки вбок');
  await j.click('#g-chips [data-g="back"]'); await j.waitForTimeout(100);
  check(await j.evaluate(() => !plan.byLog && !document.querySelector('.lp') && !document.querySelector('.pre-log.on')), 'смена мышц вручную — обычный подбор без объяснения');
  await j.click('.pre-log'); await j.waitForTimeout(100);
  check(await j.evaluate(() => plan.byLog && !!document.querySelector('.lp')), '«По журналу» в параметрах собирает заново');
  /* всё нагружено сегодня: тренировку не собираем, объясняем */
  await j.evaluate(() => {
    for (const id of ['bbbench', 'latpull', 'ohp', 'bbcurl', 'pushdown', 'wristcurl', 'crunch', 'hipthrust', 'legext', 'legcurl', 'calfraise']) LOG.data[id] = [{ d: todayKey(), s: [[20, 10], [20, 10]] }];
    S.view = 'journal'; renderSetup(); renderPlan();
  });
  await j.click('[data-logpick="journal"]'); await j.waitForTimeout(100);
  check(await j.evaluate(() => S.view === 'journal' && /лучше отдохнуть/.test(document.querySelector('#ml-msg').textContent)), 'всё нагружено: план не собирается, в панели — объяснение');
  await j.close();
  const jd = await open(1280);
  await seedLog(jd);
  check(await jd.evaluate(() => { const li = [...document.querySelectorAll('#ml .ml-list li')]; const t = li.slice(0, 2).map(x => Math.round(x.getBoundingClientRect().top)); return t[0] === t[1]; }), 'компьютер: группы загрузки в две колонки');
  await jd.close();
}

/* «Анатомия» вне разбора (этап 2) — настоящая объёмная графика (программный WebGL): карточки плана рисует общий рендерер
   (у карточки нет своего WebGL), анимируется одна, у остальных — один неподвижный кадр; «↗» открывает разбор; выбор
   «Манекен» в разборе — карточки с кожей Anny (без её данных — SVG), «Анатомия» — кадры; экран тренировки — в «Анатомии» с переключателем;
   подделанные медленные кадры — откат на манекен с подписью, выбор человека не сбрасывается */
{
  const a = await browser.newPage({ viewport: { width: 390, height: 844 } });
  a.on('pageerror', e => errors.push(String(e)));
  await a.goto('file://' + file); await a.waitForTimeout(400);
  await a.evaluate(() => {
    Object.assign(S, { view: 'plan', fold: { ...S.fold, setup: true } }); LOG.data = {}; motionPrefs.view = 'anatomy';
    S.mode = 'custom'; S.customs = [{ id: 'ua', name: 'Анатомия', items: ['squat', 'pushup', 'dbcurl', 'latpull'].map(id => ({ id })) }]; S.custom = 'ua'; ensureCustoms(S); openCustom('ua'); regen();
    document.querySelector('.card .illus').scrollIntoView({ block: 'start' }); window.scrollBy(0, -40);
  });
  const anat = () => a.evaluate(() => figs.map(F => !!F.av?.on));
  const ok = await a.waitForFunction(() => figs.filter(F => F.vis && F.av?.on).length >= 2, null, { timeout: 90000 }).then(() => true, () => false);
  check(ok, 'карточки в «Анатомии»: кадры костей и мышц появляются у карточек рядом с экраном');
  const pic = await a.evaluate(() => {
    const F = figs.find(F => F.av?.on), c = F.av.canvas, g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data;
    let lo = 255, hi = 0, warm = 0; for (let i = 0; i < d.length; i += 16) { const v = d[i] + d[i + 1] + d[i + 2]; lo = Math.min(lo, v); hi = Math.max(hi, v); if (d[i] > d[i + 2] + 60 && d[i] > 120) warm++; }
    return { w: c.width, h: c.height, svgHidden: getComputedStyle(F.f.svg).visibility === 'hidden', range: hi - lo, warm, contexts: GymVolume.cards().stats() };
  });
  check(pic.w > 100 && pic.w === pic.h && pic.svgHidden && pic.range > 200 && pic.warm > 5, `в карточке — картинка анатомии (холст ${pic.w}×${pic.h}, мышцы цветом), SVG-манекен под ней скрыт`);
  check(pic.contexts.context && pic.contexts.scenes <= 3, 'у карточек один общий рендерер, сцен — не больше трёх');
  const motion = await a.evaluate(async () => {
    const act = figs.find(F => F.active && !F.paused), rest = figs.filter(F => F !== act && F.av?.on), calls = new Map();
    for (const F of rest) { const p = F.av.handle.paint; F.av.handle.paint = (...x) => { calls.set(F, (calls.get(F) || 0) + 1); return p.apply(F.av.handle, x); }; }
    const s0 = act?.av?.still; await new Promise(r => setTimeout(r, 1500));
    return { act: !!act, moved: !!act && act.av.still !== s0, restPaints: [...calls.values()].reduce((x, y) => x + y, 0), rest: rest.length };
  });
  check(motion.act && motion.moved, 'анимируемая карточка двигается в «Анатомии»');
  check(motion.rest > 0 && motion.restPaints === 0, `неподвижные карточки — один кадр, без перерисовки (${motion.restPaints})`);
  await a.click('.card .illus.anatomy-on'); await a.waitForTimeout(200);
  check(await a.evaluate(() => $('#motion-view').open && !!detailMotion && detailMotion.it.ex.id === figs.find(F => F.btn === document.querySelector('.card .illus.anatomy-on'))?.it.ex.id), '«↗» в карточке с анатомией открывает разбор этого упражнения');
  await a.evaluate(() => { $('[data-mv-figure="mannequin"]').disabled = false; $('[data-mv-figure="mannequin"]').click(); }); await a.click('#mv-close'); await a.waitForTimeout(200);
  /* «Манекен» — кожа Anny тем же общим рендерером (без костей и мышц); без её данных — снова SVG-манекен.
     Ждём карточки, перерисованные кожей: до первого кадра цикла после закрытия разбора у карточек ещё кадр «Анатомии»
     (av.on с прошлого вида), а кадры анимации в безголовом браузере под нагрузкой идут реже чем раз в 200 мс */
  const skin = await a.waitForFunction(() => motionPrefs.view === 'mannequin' && cardAnatomy.view === 'skin' && figs.filter(F => F.vis && F.av?.on && F.av.layers?.startsWith('skin')).length >= 2, null, { timeout: 60000 }).then(() => true, () => false);
  check(skin && await a.evaluate(() => figs.filter(F => F.av?.on).every(F => F.av.layers.startsWith('skin')) && GymVolume.cards().stats().scenes <= 3), '«Манекен» в разборе — карточки: кожа Anny кадрами общего рендерера, без костей и мышц');
  check(await a.evaluate(() => { const A = AnnySkin, d = A.data; A.data = null; cardAnatomy.annyFailed = true; applyCardsView(); const r = cardAnatomy.view === 'mannequin' && figs.every(F => !F.av?.on && (!F.f || getComputedStyle(F.f.svg).visibility !== 'hidden')); A.data = d; cardAnatomy.annyFailed = false; applyCardsView(); return r; }), '«Манекен» без данных кожи Anny — карточки снова SVG-манекен');
  await a.evaluate(() => openMotion(0)); await a.waitForTimeout(100);
  await a.evaluate(() => $('[data-mv-figure="anatomy"]').click()); await a.click('#mv-close');
  check(await a.waitForFunction(() => cardAnatomy.view === 'anatomy' && figs.filter(F => F.vis && F.av?.on && F.av.layers?.startsWith('anatomy')).length >= 2, null, { timeout: 60000 }).then(() => true, () => false), 'и обратно «Анатомия» — кадры костей и мышц возвращаются');
  /* экран тренировки */
  await a.evaluate(() => startWorkout('squat'));
  const wv = await a.waitForFunction(() => document.querySelector('#wv-stage .volume-figure')?.dataset.anatomy === 'on', null, { timeout: 60000 }).then(() => true, () => false);
  const wstate = await a.evaluate(() => ({ pressed: [...document.querySelectorAll('[data-wv-figure]')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.wvFigure).join(), note: $('#wv-figure-note').hidden, renderer: document.querySelector('#wv-stage .volume-figure')?.dataset.renderer }));
  check(wv && wstate.pressed === 'anatomy' && wstate.note && wstate.renderer === 'webgl', 'экран тренировки — в «Анатомии»: кости и мышцы, выбор виден, подписи нет');
  await a.click('[data-wv-figure="mannequin"]');
  check(await a.evaluate(() => document.querySelector('#wv-stage .volume-figure').dataset.anatomy === 'off' && motionPrefs.view === 'mannequin' && JSON.parse(localStorage.getItem('podhod.motion.v2')).view === 'mannequin'), 'тренировка: «Манекен» убирает кости и мышцы, выбор общий с разбором');
  await a.click('[data-wv-figure="anatomy"]');
  check(await a.evaluate(() => document.querySelector('#wv-stage .volume-figure').dataset.anatomy === 'on' && motionPrefs.view === 'anatomy'), 'тренировка: снова «Анатомия»');
  /* подделанные медленные кадры (120 мс — дольше бюджета 10 кадров в секунду): откат на манекен с подписью */
  const slow = await a.evaluate(() => { for (let i = 0; i < 80; i++) workoutPaceSample(120); return { view: workoutFigure.view, anat: document.querySelector('#wv-stage .volume-figure').dataset.anatomy, note: $('#wv-figure-note').hidden ? '' : $('#wv-figure-note').textContent, pref: motionPrefs.view, pressed: $('[data-wv-figure="mannequin"]').getAttribute('aria-pressed') }; });
  check(slow.view === 'mannequin' && slow.anat === 'off' && /не успевает — показан манекен/.test(slow.note) && slow.pref === 'anatomy' && slow.pressed === 'true', `тренировка: медленные кадры — манекен с подписью «${slow.note}», выбор «Анатомия» сохранён`);
  await a.evaluate(() => closeWorkout());
  await a.evaluate(() => startWorkout('squat'));
  check(await a.waitForFunction(() => document.querySelector('#wv-stage .volume-figure')?.dataset.anatomy === 'on', null, { timeout: 60000 }).then(() => true, () => false), 'следующее открытие тренировки — снова попытка «Анатомии»');
  await a.evaluate(() => closeWorkout());
  const cslow = await a.evaluate(() => { for (let i = 0; i < 80; i++) cardPaceSample(120); const t = figs[0].btn.closest('.motion-tile').querySelector('.figure-tile-note'); return { view: cardAnatomy.view, on: figs.some(F => F.av?.on), note: t.hidden ? '' : t.textContent, pref: motionPrefs.view }; });
  check(cslow.view === 'mannequin' && !cslow.on && /не успевает — показан манекен/.test(cslow.note) && cslow.pref === 'anatomy', 'карточки: медленные кадры — SVG-манекен с подписью, выбор не сброшен');
  check(await a.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'план с подписью отката (390 px) без прокрутки вбок');
  await a.close();
}
/* Свободная камера сцены (src/volume/orbit.mjs, controls.mjs) — настоящая объёмная графика (программный WebGL):
   компьютер — на воспроизведении перетаскивание поворачивает камеру, а фаза движения идёт дальше; подпись «Свободный
   ракурс», кнопки ракурсов без нажатой; колесо приближает; кнопка ракурса плавно возвращает предустановку (при уменьшении
   движения — сразу); двойной щелчок и клавиша 0 сбрасывают; стрелки поворачивают; подсказка под сценой уходит после
   первого жеста и больше не показывается. Телефон (касания через CDP): палец вбок — поворот без листания, вверх — листание
   без поворота, щипок — приближение, два пальца — сдвиг кадра, двойное касание — вернуть ракурс. Экран тренировки — та же
   камера. Программная графика рисует медленно: проверки по состоянию камеры и фазе, а не по скорости кадров. */
{
  const d = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  d.on('pageerror', e => errors.push(String(e)));
  await d.goto('file://' + file); await d.waitForTimeout(400);
  await d.waitForFunction(() => window.GymVolume, null, { timeout: 30000 });
  await d.evaluate(() => { localStorage.removeItem('podhod.orbit-hint.v1'); motionPrefs.view = 'mannequin'; motionPrefs.dual = false; motionPrefs.views = { latpull: 'above' }; openMotionItem(previewItem('latpull')); detailMotion.paused = false; });
  await d.waitForFunction(() => document.querySelector('#mv-stage .volume-figure')?.dataset.renderer === 'webgl', null, { timeout: 60000 });
  const cam = page => page.evaluate(() => { const F = detailMotion, s = F.f.cameraState(); return { ...s, label: $('#mv-view').textContent, pressed: [...document.querySelectorAll('#mv-cameras [aria-pressed="true"]')].map(b => b.dataset.motionCamera).join(), hint: $('#mv-orbit-hint').hidden ? '' : $('#mv-orbit-hint').textContent, clock: F.clock, pose: document.querySelector('#mv-stage .volume-figure').dataset.pose, scroll: $('#motion-view').scrollTop, views: motionPrefs.views.latpull }; });
  const c0 = await cam(d);
  check(c0.camera === 'above' && !c0.free && c0.pressed === 'above' && c0.label === 'Сверху под углом' && c0.zoom === 1, `свободная камера: разбор открывается в предустановке «Сверху под углом» (${c0.label}, ${c0.pressed})`);
  check(/колесо — приблизить/.test(c0.hint), `компьютер: под сценой подсказка про колесо (${c0.hint})`);
  check(await d.evaluate(() => { const r = document.querySelector('#mv-stage .volume-figure'); return r.tabIndex === 0 && r.getAttribute('role') === 'application' && getComputedStyle(r).touchAction === 'pan-y'; }), 'сцена фокусируема, роль — приложение, на касание — листание по вертикали');
  const b = await d.locator('#mv-stage .volume-figure').boundingBox(), mx = b.x + b.width / 2, my = b.y + b.height / 2;
  await d.mouse.move(mx, my); await d.mouse.down();
  for (let i = 1; i <= 8; i++) { await d.mouse.move(mx + i * 14, my + i * 3); await d.waitForTimeout(40); }
  await d.mouse.up(); await d.waitForTimeout(600);
  const c1 = await cam(d);
  check(Math.abs(c1.yaw - c0.yaw) > .3 && c1.free && c1.label === 'Свободный ракурс' && c1.pressed === '' && c1.views === 'above', `перетаскивание поворачивает камеру: подпись «${c1.label}», кнопки без нажатой, запомнен прежний ракурс`);
  check(c1.clock > c0.clock && c1.pose !== c0.pose, `на воспроизведении фаза движения идёт дальше (часы ${Math.round(c0.clock)} → ${Math.round(c1.clock)} мс)`);
  check(c1.hint === '' && await d.evaluate(() => localStorage.getItem('podhod.orbit-hint.v1') === '1'), 'после первого жеста подсказка исчезла и запомнена');
  await d.mouse.move(mx, my - 40);
  for (let i = 0; i < 5; i++) { await d.mouse.wheel(0, -120); await d.waitForTimeout(60); }
  await d.waitForTimeout(300);
  const c2 = await cam(d);
  check(c2.zoom > 1.5 && c2.zoom <= 4 && c2.scroll === c1.scroll, `колесо приближает (×${c2.zoom.toFixed(2)}), страница не листается`);
  /* кнопка ракурса — плавный переход к предустановке */
  const mid = await d.evaluate(() => { document.querySelector('#mv-cameras [data-motion-camera="side"]').click(); return detailMotion.f.cameraState(); });
  await d.waitForTimeout(900);
  const c3 = await cam(d);
  check(mid.moving && !c3.moving && c3.camera === 'side' && !c3.free && c3.zoom === 1 && c3.pressed === 'side' && c3.label === 'Сбоку' && c3.views === 'side', `кнопка «Сбоку» плавно переводит камеру в предустановку (переход шёл: ${mid.moving}; ${c3.label})`);
  await d.evaluate(() => { const r = document.querySelector('#mv-stage .volume-figure'); r.focus(); });
  await d.keyboard.press('ArrowRight'); await d.keyboard.press('ArrowRight'); await d.keyboard.press('+');
  await d.waitForTimeout(500);
  const c4 = await cam(d);
  check(c4.free && Math.abs(c4.yaw - c3.yaw) > .4 && c4.zoom > 1.2, `клавиатура: стрелки поворачивают, «+» приближает (×${c4.zoom.toFixed(2)})`);
  await d.keyboard.press('0'); await d.waitForTimeout(800);
  const c5 = await cam(d);
  check(!c5.free && c5.zoom === 1 && Math.abs(c5.yaw - c3.yaw) < 1e-9, 'клавиша 0 возвращает ракурс');
  /* двойной щелчок: на паузе тоже перерисовывается */
  await d.evaluate(() => { detailMotion.paused = true; });
  await d.mouse.move(mx, my); await d.mouse.down(); for (let i = 1; i <= 5; i++) await d.mouse.move(mx - i * 15, my); await d.mouse.up();
  await d.waitForTimeout(300);
  /* программная графика рисует кадр за сотни миллисекунд: ждём простоя, потом жест — и первый кадр после него */
  await d.waitForTimeout(1500);
  const renders = await d.evaluate(() => new Promise(r => { const R = document.querySelector('#mv-stage canvas'), gl = R.getContext('webgl2'), f = gl.drawElements.bind(gl); let n = 0; gl.drawElements = (...a) => { n++; return f(...a); };
    setTimeout(() => { const before = n; detailMotion.f.svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })); const end = performance.now() + 8000, wait = () => { if (n > before || performance.now() > end) { gl.drawElements = f; r({ idle: before, after: n }); } else setTimeout(wait, 50); }; wait(); }, 1200); }));
  check(renders.idle === 0 && renders.after > 0, `на паузе без жеста кадр не перерисовывается, жест — перерисовывает (${renders.idle} → ${renders.after} вызовов отрисовки)`);
  const c6 = await cam(d);
  await d.mouse.dblclick(mx, my); await d.waitForTimeout(900);
  const c7 = await cam(d);
  check(c6.free && !c7.free && c7.camera === 'side' && c7.zoom === 1 && c7.pressed === 'side', 'двойной щелчок возвращает текущую предустановку');
  /* уменьшение движения: переход сразу */
  await d.emulateMedia({ reducedMotion: 'reduce' });
  await d.click('#mv-cameras [data-motion-camera="front"]');
  const c8 = await cam(d);
  check(!c8.moving && c8.camera === 'front' && c8.label === 'Спереди', 'при уменьшении движения ракурс меняется сразу');
  await d.emulateMedia({ reducedMotion: 'no-preference' });
  /* подсказка больше не показывается; без WebGL-фигуры (схема) её нет */
  await d.evaluate(() => selectMotion(previewItem('squat'))); await d.waitForTimeout(300);
  check(await d.evaluate(() => $('#mv-orbit-hint').hidden), 'подсказка не возвращается при следующем разборе');
  /* экран тренировки — та же камера */
  await d.evaluate(() => { closeMotion(); S.mode = 'custom'; S.customs = [{ id: 'fc', name: 'Камера', items: [{ id: 'squat' }] }]; S.custom = 'fc'; ensureCustoms(S); openCustom('fc'); regen(); startWorkout('squat'); workout.motion.paused = true; });
  await d.waitForFunction(() => document.querySelector('#wv-stage .volume-figure')?.dataset.orbit === '', null, { timeout: 60000 });
  const wb = await d.locator('#wv-stage .volume-figure').boundingBox();
  await d.mouse.move(wb.x + wb.width / 2, wb.y + wb.height / 2); await d.mouse.down(); for (let i = 1; i <= 6; i++) await d.mouse.move(wb.x + wb.width / 2 + i * 15, wb.y + wb.height / 2); await d.mouse.up();
  await d.waitForTimeout(300);
  const w1 = await d.evaluate(() => ({ free: workout.motion.f.free, label: $('#wv-angle').textContent, pressed: [...document.querySelectorAll('#wv-cameras [aria-pressed="true"]')].length }));
  check(w1.free && w1.label === 'Свободный ракурс' && w1.pressed === 0, `экран тренировки: сцена поворачивается, подпись «${w1.label}»`);
  await d.evaluate(() => closeWorkout());
  await d.close();

  /* телефон: настоящие касания (CDP) */
  const pc = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const t = await pc.newPage();
  t.on('pageerror', e => errors.push(String(e)));
  await t.goto('file://' + file); await t.waitForTimeout(400);
  await t.waitForFunction(() => window.GymVolume, null, { timeout: 30000 });
  await t.evaluate(() => { localStorage.removeItem('podhod.orbit-hint.v1'); motionPrefs.view = 'mannequin'; motionPrefs.dual = false; motionPrefs.views = {}; openMotionItem(previewItem('latpull')); detailMotion.paused = false; });
  await t.waitForFunction(() => document.querySelector('#mv-stage .volume-figure')?.dataset.renderer === 'webgl', null, { timeout: 60000 });
  check(/щипок — приблизить/.test(await t.evaluate(() => $('#mv-orbit-hint').hidden ? '' : $('#mv-orbit-hint').textContent)), 'телефон: под сценой подсказка про касания');
  const cdp = await pc.newCDPSession(t);
  const touch = async (fingers, steps = 10) => {
    const at = k => fingers.map(([x0, y0, x1, y1], id) => ({ x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, id }));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: at(0) });
    for (let i = 1; i <= steps; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: at(i / steps) }); await t.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await t.waitForTimeout(300);
  };
  const centre = async () => { const r = await t.locator('#mv-stage .volume-figure').boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
  let [x, y] = await centre();
  const p0 = await cam(t);
  await touch([[x - 80, y, x + 80, y + 8]]);
  const p1 = await cam(t);
  check(Math.abs(p1.yaw - p0.yaw) > .3 && p1.free && p1.scroll === p0.scroll && p1.clock > p0.clock, `телефон: палец вбок поворачивает сцену, страница стоит, движение идёт (листание ${p0.scroll} → ${p1.scroll})`);
  const label = () => t.evaluate(() => { const l = $('#mv-view'); return l.offsetHeight > 0 ? l.textContent : ''; });
  check(await label() === 'Свободный ракурс' && p1.pressed === '' && p0.pressed === 'above' && await t.evaluate(() => getComputedStyle($('#mv-view')).pointerEvents === 'none'), 'телефон: повернули — поверх сцены подпись «Свободный ракурс», кнопки без нажатой');
  await touch([[x, y + 60, x + 4, y - 140]]);
  const p2 = await cam(t);
  check(p2.scroll > p1.scroll + 40 && Math.abs(p2.yaw - p1.yaw) < 1e-9 && Math.abs(p2.pitch - p1.pitch) < 1e-9, `телефон: палец вверх листает разбор и не трогает камеру (листание ${p1.scroll} → ${p2.scroll})`);
  await t.evaluate(() => { $('#motion-view').scrollTop = 0; }); await t.waitForTimeout(200);
  [x, y] = await centre();
  await touch([[x - 30, y, x - 95, y - 8], [x + 30, y, x + 95, y + 8]]);
  const p3 = await cam(t);
  check(p3.zoom > 1.6 && p3.scroll === 0, `телефон: щипок приближает (×${p3.zoom.toFixed(2)}) и не листает`);
  await touch([[x - 40, y - 30, x - 40, y + 50], [x + 40, y - 30, x + 40, y + 50]]);
  const p4 = await cam(t);
  check(p4.oy > p3.oy + .02 && p4.scroll === 0 && Math.abs(p4.zoom - p3.zoom) < .05, 'телефон: два пальца сдвигают кадр и не листают');
  await t.evaluate(() => { detailMotion.paused = true; }); await t.waitForTimeout(1500);
  /* метки времени касаний — как у живого двойного касания (программная графика задерживает события) */
  const t0 = Date.now() / 1000;
  for (const [type, dt] of [['touchStart', 0], ['touchEnd', .05], ['touchStart', .16], ['touchEnd', .21]]) await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 0 }], timestamp: t0 + dt });
  await t.waitForTimeout(900);
  const p5 = await cam(t);
  check(!p5.free && p5.zoom === 1 && p5.pressed === 'above' && await label() === '', 'телефон: двойное касание возвращает ракурс (подпись над сценой снова скрыта, как раньше)');
  check(await t.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'телефон: разбор с подсказкой без прокрутки вбок');
  await pc.close();
}
/* без WebGL — как раньше: карточки SVG, в тренировке плоская схема, виды с костями недоступны */
{
  const n = await browser.newPage({ viewport: { width: 390, height: 844 } });
  n.on('pageerror', e => errors.push(String(e)));
  await n.addInitScript(() => { delete window.WebGL2RenderingContext; });
  await n.goto('file://' + file); await n.waitForTimeout(400);
  await n.evaluate(() => { Object.assign(S, { view: 'plan', mode: 'single', groups: ['chest', 'back'], count: 4, seed: 3, fold: { ...S.fold, setup: true } }); LOG.data = {}; motionPrefs.view = 'anatomy'; regen(); document.querySelector('.card .illus').scrollIntoView({ block: 'center' }); });
  await n.waitForTimeout(1500);
  const r = await n.evaluate(() => ({ svg: figs.filter(F => F.vis).every(F => F.f && F.f.svg.tagName.toLowerCase() === 'svg' && getComputedStyle(F.f.svg).visibility !== 'hidden'), canvas: document.querySelectorAll('canvas.card-anatomy').length, view: cardAnatomy.view }));
  check(r.svg && r.canvas === 0 && r.view === 'mannequin', 'без WebGL карточки — SVG-манекен, как раньше');
  await n.evaluate(() => startWorkout()); await n.waitForTimeout(200);
  check(await n.evaluate(() => document.querySelector('#wv-stage .volume-figure')?.dataset.renderer === 'svg' && $('[data-wv-figure="anatomy"]').disabled && $('[data-wv-figure="mannequin"]').getAttribute('aria-pressed') === 'true' && $('#wv-figure-note').hidden), 'без WebGL тренировка — плоская схема, «Анатомия» недоступна');
  await n.close();
}

/* витрина атласа в «Анатомии» (этап 3) — настоящая объёмная графика (программный WebGL): пока кадра нет — заглушка цвета сцены
   (SVG-манекен не показывается ни разу), потом у видимых — кадры костей и мышц (картинки из общего рендерера карточек); клик открывает разбор, «← Все упражнения»
   возвращает на то же место и кадры — сразу из памяти; фильтр и поиск работают; «Манекен» — кожа Anny (без её данных — SVG). Без WebGL — SVG.
   Кеш между сеансами — по http (офлайн-файлу Cache Storage недоступен): после перезагрузки кадры берутся из кеша. */
{
  const thumbsState = page => page.evaluate(() => { const s = galleryAnatStats(); return { ...s, svg: document.querySelectorAll('#mv-gallery .mv-thumb.ready:not(.anat)').length, anat: document.querySelectorAll('#mv-gallery .mv-thumb.anat img.mv-anat').length }; });
  const visAnat = (page, ms = 120000) => page.waitForFunction(() => { const s = galleryAnatStats(); return s.vis > 0 && s.visReady >= s.vis && [...document.querySelectorAll('#mv-gallery .mv-thumb.anat img.mv-anat')].some(i => i.complete && i.naturalWidth > 0); }, null, { timeout: ms, polling: 200 }).then(() => true, () => false);
  const g = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  g.on('pageerror', e => errors.push(String(e)));
  await g.goto('file://' + file); await g.waitForTimeout(400);
  await g.evaluate(() => { motionPrefs.view = 'anatomy'; LOG.data = {}; });
  await g.waitForFunction(() => window.GymVolume, null, { timeout: 30000 });
  /* SVG-манекен в миниатюрах: считается каждое появление, пока WebGL есть — их быть не должно */
  const watchSvg = page => page.evaluate(() => { window.__thumbSvg = 0; new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches?.('.mv-thumb svg, .mv-thumb > svg') || n.querySelector?.('.mv-thumb svg'))) window.__thumbSvg++; }).observe(document.querySelector('#mv-gallery'), { childList: true, subtree: true }); });
  await watchSvg(g);
  await g.click('#motion-atlas');
  const hold = await g.evaluate(() => { const box = document.querySelector('#mv-gallery'), el = box.querySelector('.mv-thumb:not(.ready)'), cs = el && getComputedStyle(el);
    return { gl: box.classList.contains('mv-gl'), expect: galleryAnat.expect, bg: cs?.backgroundColor, image: cs?.backgroundImage, anim: cs?.animationName, svg: box.querySelectorAll('.mv-thumb svg').length }; });
  check(hold.gl && hold.expect && hold.bg === 'rgb(11, 17, 25)' && hold.image === 'none' && hold.anim === 'none' && hold.svg === 0, `витрина с WebGL: до кадра — неподвижная заглушка цвета сцены, не SVG (${JSON.stringify(hold)})`);
  check(await visAnat(g), 'витрина в «Анатомии»: у видимых миниатюр — кадры костей и мышц');
  await g.waitForFunction(() => ThumbEncoder.pending === 0 && !document.querySelector('#mv-gallery canvas.mv-draft'), null, { timeout: 60000 }).catch(() => {});
  check(await g.evaluate(() => window.__thumbSvg === 0 && !document.querySelector('#mv-gallery .mv-thumb svg')), 'витрина с WebGL: SVG-манекен не появился ни в одной миниатюре');
  const pic = await g.evaluate(async () => {
    const img = document.querySelector('#mv-gallery .mv-thumb.anat img.mv-anat'), c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
    let lo = 765, hi = 0, warm = 0; for (let i = 0; i < d.length; i += 16) { const v = d[i] + d[i + 1] + d[i + 2]; lo = Math.min(lo, v); hi = Math.max(hi, v); if (d[i] > d[i + 2] + 60 && d[i] > 120) warm++; }
    const el = img.closest('.mv-thumb'), svg = el.querySelector('svg');
    return { w: c.width, src: img.src.slice(0, 5), range: hi - lo, warm, svgHidden: !svg || getComputedStyle(svg).visibility === 'hidden', canvases: document.querySelectorAll('#mv-gallery canvas:not(.mv-draft)').length, stage: GymVolume.cards().stats() };
  });
  check(pic.w >= 200 && pic.src === 'blob:' && pic.range > 200 && pic.warm > 5 && pic.svgHidden, `миниатюра — сжатая картинка анатомии (${pic.w} точек, мышцы цветом), SVG под ней скрыт`);
  check(pic.canvases === 0 && pic.stage.scenes <= 3, `у витрины нет своих холстов и WebGL: общий рендерер, сцен ${pic.stage.scenes} (не больше трёх)`);
  /* миниатюра открывает разбор, возврат — на то же место, кадры — сразу из памяти */
  const id = await g.evaluate(() => document.querySelector('#mv-gallery .mv-thumb.anat img.mv-anat').closest('[data-gallery-open]').dataset.galleryOpen);
  await g.click(`[data-gallery-open="${id}"]`); await g.waitForTimeout(150);
  check(await g.evaluate(id => !$('#mv-detail').hidden && detailMotion?.it.ex.id === id && !gallery.on && !galleryAnat.io, id), 'миниатюра анатомии открывает разбор этого упражнения, очередь витрины стоит');
  await g.click('#mv-back');
  const back = await g.evaluate(id => ({ focus: document.activeElement?.dataset.galleryOpen, anat: !!document.querySelector(`[data-gallery-open="${id}"] .mv-thumb.anat img.mv-anat`), painted: galleryAnat.stats.painted }), id);
  check(back.focus === id && back.anat, '«← Все упражнения» — на то же упражнение, его кадр анатомии сразу из памяти');
  /* фильтр и поиск в «Анатомии» */
  await g.click('[data-gallery-kind="band"]');
  check(await g.evaluate(() => { const t = [...document.querySelectorAll('.mv-tile')]; return t.length > 0 && t.every(b => workKind(EXI[b.dataset.galleryOpen]) === 'band'); }), 'витрина в «Анатомии»: фильтр «Резинки» работает');
  check(await visAnat(g), 'после фильтра видимые миниатюры — тоже анатомия');
  await g.click('[data-gallery-kind="all"]');
  await g.fill('#mv-gq', 'тяга верхнего');
  check(await g.evaluate(() => { const t = [...document.querySelectorAll('.mv-tile')].map(b => b.dataset.galleryOpen); return t.includes('latpull') && t.every(id => EXI[id].name.toLowerCase().includes('тяга верхнего')) && document.activeElement.id === 'mv-gq'; }), 'поиск в «Анатомии» работает, курсор в поле');
  check(await visAnat(g), 'найденные миниатюры — анатомия');
  await g.fill('#mv-gq', '');
  /* «Манекен» в разборе — витрина: кожа Anny кадрами того же рендерера; без её данных — снова SVG; «Анатомия» — кадры из памяти */
  await g.click('[data-gallery-open="latpull"]'); await g.waitForTimeout(100);
  await g.evaluate(() => { const b = $('[data-mv-figure="mannequin"]'); b.disabled = false; b.click(); });
  await g.click('#mv-back');
  const skinThumbs = await visAnat(g, 60000), sk = await thumbsState(g);
  check(skinThumbs && sk.view === 'skin' && sk.anat > 0, `«Манекен» — миниатюры: кожа Anny (${JSON.stringify({ view: sk.view, anat: sk.anat })})`);
  await g.evaluate(() => { AnnySkin._kept = AnnySkin.data; AnnySkin.data = null; galleryAnat.annyFailed = true; galleryAnatApply(); });
  /* SVG видимых миниатюр строится, как раньше, в кадрах (на стенде — до нескольких секунд) */
  const svgBack = await g.waitForFunction(() => (v => v.length > 0 && v.every(el => el.querySelector('svg') && !el.classList.contains('anat')))([...document.querySelectorAll('#mv-gallery .mv-thumb')].filter(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })), null, { timeout: 20000 }).then(() => true, () => false);
  const man = await thumbsState(g);
  check(svgBack && man.view === 'mannequin' && man.anat === 0 && man.svg > 0, `«Манекен» без данных кожи Anny — миниатюры снова SVG (${JSON.stringify({ view: man.view, anat: man.anat, svg: man.svg })})`);
  await g.evaluate(() => { AnnySkin.data = AnnySkin._kept; delete AnnySkin._kept; galleryAnat.annyFailed = false; });
  await g.click('[data-gallery-open="latpull"]'); await g.waitForTimeout(100);
  await g.evaluate(() => $('[data-mv-figure="anatomy"]').click()); await g.click('#mv-back');
  check(await visAnat(g, 60000), 'снова «Анатомия» — кадры костей и мышц');
  /* память: сжатые кадры, а не холсты */
  const mem = await thumbsState(g);
  check(mem.mem > 0 && mem.bytes / mem.mem < 40e3 && mem.bytes < 3 << 20, `кадры в памяти сжаты: ${mem.mem} шт., ${(mem.bytes / 1024).toFixed(0)} КБ`);
  check(await g.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'витрина в «Анатомии» (390 px) без прокрутки вбок');
  await g.keyboard.press('Escape'); await g.waitForTimeout(100);
  check(await g.evaluate(() => !gallery.on && !galleryAnat.io && !galleryAnat.job), 'закрытая витрина — очередь кадров остановлена');
  await g.close();
}
/* без WebGL — витрина как раньше: SVG-миниатюры, картинок анатомии нет */
{
  const n = await browser.newPage({ viewport: { width: 390, height: 844 } });
  n.on('pageerror', e => errors.push(String(e)));
  await n.addInitScript(() => { delete window.WebGL2RenderingContext; });
  await n.goto('file://' + file); await n.waitForTimeout(400);
  await n.evaluate(() => { motionPrefs.view = 'anatomy'; });
  await n.click('#motion-atlas'); await n.waitForTimeout(1500);
  const r = await n.evaluate(() => ({ svg: document.querySelectorAll('#mv-gallery .mv-thumb.ready svg').length, img: document.querySelectorAll('#mv-gallery img.mv-anat').length, view: galleryAnat.view, note: document.querySelector('.mv-gnote')?.hidden }));
  check(r.svg > 0 && r.img === 0 && r.view === 'mannequin' && r.note === true, `без WebGL витрина — SVG, как раньше (${JSON.stringify(r)})`);
  await n.close();
}
/* кеш между сеансами: PWA по http (Cache Storage), после перезагрузки кадры — из кеша, без отрисовки. Ключ кадра — по
   содержимому: «новая версия» (другой номер сборки, то же содержимое) берёт те же кадры и не показывает SVG; у упражнения с
   изменённой позой кадр рисуется заново */
{
  const dist = path.dirname(file), types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.bin': 'application/octet-stream', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    let u = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (u.endsWith('/')) u += 'index.html';
    const f = path.join(dist, u); if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    /* «новая версия»: тот же код с другим номером сборки */
    if (bumped && /\.(html|js)$/.test(f)) { res.end(fs.readFileSync(f, 'utf8').split(buildId).join(bumped)); return; }
    fs.createReadStream(f).pipe(res);
  });
  const buildId = /PODHOD_BUILD='([^']+)'/.exec(fs.readFileSync(path.join(dist, 'app.js'), 'utf8'))[1]; let bumped = '';
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const c = await ctx.newPage(); c.on('pageerror', e => errors.push(String(e)));
  const url = `http://127.0.0.1:${srv.address().port}/`;
  const openGal = async (before) => { await c.goto(url); await c.waitForFunction(() => window.GymVolume && typeof galleryAnat === 'object', null, { timeout: 30000 }); await c.evaluate(() => { motionPrefs.view = 'anatomy'; });
    await c.evaluate(() => { window.__thumbSvg = 0; new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches?.('.mv-thumb > svg') || n.querySelector?.('.mv-thumb svg'))) window.__thumbSvg++; }).observe(document.querySelector('#mv-gallery'), { childList: true, subtree: true }); });
    if (before) await c.evaluate(before); await c.click('#motion-atlas'); };
  const stored = () => c.waitForFunction(() => ThumbEncoder.pending === 0 && !galleryAnat.job, null, { timeout: 60000 }).then(() => c.waitForTimeout(800), () => {});
  await openGal();
  const okFirst = await c.waitForFunction(() => { const s = galleryAnatStats(); return s.vis > 0 && s.visReady >= s.vis; }, null, { timeout: 120000, polling: 200 }).then(() => true, () => false);
  await stored();
  const saved = await c.evaluate(async () => { const names = (await caches.keys()).filter(n => n.startsWith('podhod-thumbs')); const c0 = names.length ? await caches.open(names[0]) : null; return { names, want: thumbCacheName(thumbScope()), n: c0 ? (await c0.keys()).length : 0, build: window.PODHOD_BUILD, painted: galleryAnat.stats.painted, vis: [...galleryAnat.vis] }; });
  check(okFirst && saved.names.length === 1 && saved.names[0] === saved.want && !saved.want.includes(saved.build) && saved.n >= saved.painted && saved.n > 0, `кадры сохранены в Cache Storage места, корзина не привязана к сборке (${saved.n} шт., корзина ${saved.names.join()})`);
  /* корзина прежней схемы (по сборке) удаляется при открытии витрины; «новая версия» — другой номер сборки */
  await c.evaluate(async () => { await caches.open('podhod-thumbs@' + thumbScope() + ':0.0.0-old'); });
  bumped = buildId.replace(/-[0-9a-f]+$/, '-0000update00');
  await openGal();
  const t0 = Date.now();
  const okCache = await c.waitForFunction(() => { const s = galleryAnatStats(); return s.vis > 0 && s.visReady >= s.vis; }, null, { timeout: 30000, polling: 50 }).then(() => true, () => false);
  const fromCache = await c.evaluate(() => ({ painted: galleryAnat.stats.painted, cached: galleryAnat.stats.cached, stage: !!GymVolume.cards().stats().context }));
  const after = await c.evaluate(() => ({ build: window.PODHOD_BUILD, svg: window.__thumbSvg, svgNow: document.querySelectorAll('#mv-gallery .mv-thumb svg').length }));
  check(okCache && after.build === bumped && after.build !== saved.build && fromCache.painted === 0 && fromCache.cached > 0, `после «обновления версии» (${saved.build} → ${after.build}) видимые кадры — из кеша, без отрисовки (${Date.now() - t0} мс, ${JSON.stringify(fromCache)})`);
  check(after.svg === 0 && after.svgNow === 0, 'после «обновления версии» SVG-манекен не показан ни в одной миниатюре');
  await c.waitForTimeout(3600);
  const left = await c.evaluate(async () => (await caches.keys()).filter(n => n.startsWith('podhod-thumbs')));
  check(left.length === 1 && left[0] === saved.want, `корзина прежней схемы удалена, корзина места осталась (${left.join()})`);
  /* поза одного упражнения изменилась — его кадр рисуется заново, остальные — из кеша */
  const moved = saved.vis.find(id => true);
  await openGal(`(() => { const a = EXI['${moved}'].anim, rig = a.catalogRig; a.catalogVariants = null; a.catalogRig = t => { const R = rig(t); R.head = [R.head[0], R.head[1] - 2, R.head[2]]; return R; }; })()`);
  const okMoved = await c.waitForFunction(() => { const s = galleryAnatStats(); return s.vis > 0 && s.visReady >= s.vis; }, null, { timeout: 120000, polling: 100 }).then(() => true, () => false);
  await stored();
  const redo = await c.evaluate(() => ({ painted: galleryAnat.stats.painted, cached: galleryAnat.stats.cached, vis: galleryAnat.vis.size, svg: window.__thumbSvg }));
  check(okMoved && redo.painted >= 1 && redo.painted <= 1 + Math.max(0, redo.vis - saved.vis.length) + 4 && redo.cached >= saved.vis.length - 1 && redo.svg === 0, `изменилась поза ${moved} — её кадр нарисован заново, остальные видимые — из кеша (${JSON.stringify(redo)})`);
  const movedKey = await c.evaluate(id => { const b = galleryAnatBase(id); return { has: galleryAnat.mem.has(galleryAnatKey(b)) }; }, moved);
  check(movedKey.has, 'кадр изменённой позы лежит под новым ключом');
  await ctx.close(); srv.close();
}

/* скрытая панель замера скорости (?perf, 19-perf-panel.js): без флага панели нет, а крючки только читают флаг
   (globalThis.GymPerf); с флагом — плашка на телефоне, живые цифры карточек (в «Анатомии» — кадр карточки, копия,
   ступень скорости) и объёма, панель переезжает в открытое окно; «Замерить» проходит все 11 шагов (карточка и
   тренировка — в «Анатомии» и «Манекене»; короткие длительности, фигуры — заглушки) и не меняет журнал, настройки,
   планы и вид фигуры; «Остановить» прерывает и всё возвращает; «Скопировать результат» — текст или поле для ручного
   копирования; ?perf=0 выключает */
{
  const off = await browser.newPage({ viewport: { width: 390, height: 844 } });
  off.on('pageerror', e => errors.push(String(e)));
  await off.addInitScript(() => { let reads = 0; Object.defineProperty(window, 'GymPerf', { configurable: true, get() { reads++; return undefined; } }); window.__perfReads = () => reads; });
  await off.goto('file://' + file); await off.waitForTimeout(400);
  await off.evaluate(() => document.querySelector('.card')?.scrollIntoView({ block: 'center' })); await off.waitForTimeout(800);
  const o = await off.evaluate(() => ({ panel: !!document.querySelector('#perf-panel'), flag: localStorage.getItem('podhod.perf'), reads: window.__perfReads() }));
  check(!o.panel && o.flag === null && o.reads > 0, `без ?perf: панели нет, крючки только проверяют флаг (${o.reads} проверок)`);
  await off.close();

  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errors.push(String(e)));
  await p.goto('file://' + file + '?perf'); await p.waitForTimeout(500);
  const box = await rect(p, '#perf-panel .perf-body');
  check(await p.evaluate(() => localStorage.getItem('podhod.perf') === 'open' && !!globalThis.GymPerf) && box && box.l >= 0 && box.r <= 390 && box.b <= 844 && box.w >= 300,
    '?perf: панель включена и запомнена, плашка целиком на экране телефона');
  check(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '?perf: страница без прокрутки вбок');
  await p.evaluate(() => document.querySelector('.card').scrollIntoView({ block: 'center' }));
  /* карточки по умолчанию — в «Анатомии»: живые цифры — кадр карточки общего рендерера, копия в её холст, ступень скорости */
  await p.waitForFunction(() => /кадр \d/.test(document.querySelector('[data-perf-k="screen"]').textContent) && /анатомия \d/.test(document.querySelector('[data-perf-k="cards"]').textContent), null, { timeout: 30000 }).catch(() => {});
  const live = await p.evaluate(() => ({ pill: document.querySelector('[data-perf-pill]').textContent, screen: document.querySelector('[data-perf-k="screen"]').textContent, cards: document.querySelector('[data-perf-k="cards"]').textContent, view: document.querySelector('[data-perf-k="view"]').textContent }));
  check(/^\d/.test(live.pill) && /^\d+(,\d)? к\/с · кадр \d/.test(live.screen) && /анатомия \d.* · копия \d/.test(live.cards) && /^План — Анатомия; ступень (30|15|10) к\/с, медиана /.test(live.view),
    `живые цифры: кадры, карточка в «Анатомии» и её ступень (${live.screen} | ${live.cards} | ${live.view})`);
  /* «Манекен» — кожа Anny кадрами общего рендерера: кадр карточки, копия и ступень; без данных кожи — SVG-карточки */
  await p.evaluate(() => { motionPrefs.view = 'mannequin'; applyCardsView(); });
  const skinLive = await p.waitForFunction(() => /кожа \d.* · копия \d/.test(document.querySelector('[data-perf-k="cards"]').textContent) && /^План — Манекен; ступень (30|15|10) к\/с/.test(document.querySelector('[data-perf-k="view"]').textContent), null, { timeout: 30000 }).then(() => true, () => false);
  check(skinLive, 'живые цифры в «Манекене»: кадр карточки с кожей Anny и его ступень');
  await p.evaluate(() => { AnnySkin._kept = AnnySkin.data; AnnySkin.data = null; cardAnatomy.annyFailed = true; applyCardsView(); });
  const svgLive = await p.waitForFunction(() => /заново \d/.test(document.querySelector('[data-perf-k="cards"]').textContent) && /^План — рисунок SVG$/.test(document.querySelector('[data-perf-k="view"]').textContent), null, { timeout: 15000 }).then(() => true, () => false);
  check(svgLive, 'живые цифры в «Манекене» без данных кожи: SVG-карточки, без ступени');
  await p.evaluate(() => { AnnySkin.data = AnnySkin._kept; delete AnnySkin._kept; cardAnatomy.annyFailed = false; });
  await p.evaluate(() => { motionPrefs.view = 'mannequin'; openMotionItem(previewItem('legpress')); detailMotion.paused = false; });
  const volLive = await p.waitForFunction(() => /поза \d/.test(document.querySelector('[data-perf-k="volume"]')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false);
  /* программная графика стенда отстаёт от кадров — фигуру сразу на паузу */
  await p.evaluate(() => { if (detailMotion) detailMotion.paused = true; });
  check(volLive && await p.evaluate(() => document.querySelector('#perf-panel').parentElement.id === 'motion-view' && /Разбор — Манекен/.test(document.querySelector('[data-perf-k="view"]').textContent)),
    'разбор: панель в окне разбора, живые цифры объёма по частям, вид фигуры');
  await p.click('#perf-panel [data-perf="dev"]');
  check(await p.evaluate(() => /Устройство: .*\nВидеокарта: /.test(document.querySelector('[data-perf-dev]').textContent) && !document.querySelector('[data-perf-dev]').hidden), 'в открытом окне панель нажимается: сведения об устройстве и видеокарте');
  await p.click('#perf-panel [data-perf="dev"]');
  await p.evaluate(() => { closeMotion(); motionPrefs.view = 'anatomy'; });
  check(await p.evaluate(() => document.querySelector('#perf-panel').parentElement === document.body), 'окно закрыто — панель снова на странице');
  await p.waitForFunction(() => GymPerf.frames.filter(f => f.t > performance.now() - 500).length >= 10, null, { timeout: 20000 }).catch(() => {});

  /* сценарий: журнал с записью, сохранённая тренировка — снимок до и после */
  await fakeFigures(p);
  const snap = () => p.evaluate(() => {
    const ls = {}, keys = []; for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    for (const k of keys.sort()) if (!/^podhod\.(frames|volume-bounds|stress)\.v\d|^podhod\.perf/.test(k)) ls[k] = localStorage.getItem(k);
    return JSON.stringify({ ls, log: LOG.data, S, prefs: motionPrefs, view: figureView(), dialogs: document.querySelectorAll('dialog[open]').length, y: Math.round(scrollY) });
  });
  await p.evaluate(() => {
    LOG.data = { squat: [{ d: todayKey(), s: [[60, 8]] }] }; logSaveLocal();
    localStorage.setItem('podhod.workout.v3', JSON.stringify({ stamp: 'старый день', index: 2, started: 1, restUntil: 0, drafts: {} }));
    window.scrollTo(0, 300);
  });
  const before = await snap();
  await p.click('[data-perf="run"]'); await p.waitForTimeout(400);
  check(/^Идёт замер… не трогайте экран, шаг 1 из 11$/.test(await p.evaluate(() => document.querySelector('[data-perf-runtext]').textContent)), '«Замерить»: надпись «Идёт замер… не трогайте экран, шаг 1 из 11»');
  await p.click('[data-perf="stop"]');
  await p.waitForFunction(() => !GymPerf.run && GymPerf.result, null, { timeout: 5000 });
  check(await p.evaluate(() => GymPerf.result.aborted && /Замер остановлен/.test(document.querySelector('[data-perf-result]').textContent)) && await snap() === before, '«Остановить» прерывает замер и возвращает всё как было');
  /* экран не гаснет на время замера: блокировка берётся и отпускается (тренировка берёт свою — тоже отпускает) */
  await p.evaluate(() => { window.__wk = { req: 0, rel: 0 }; Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => { __wk.req++; return { release: async () => { __wk.rel++; } }; } } }); });
  const run = await p.evaluate(() => perfRun({ plan: 700, step: 500, warm: 150 }).then(r => ({ kinds: r.steps.map(s => s.kind + (s.id ? ':' + s.id : '')), labels: r.steps.map(s => s.label), bad: r.steps.filter(s => s.skip || s.error).map(s => s.label + ' ' + (s.skip || s.error)), text: perfReportText(r) })));
  await p.waitForTimeout(50);
  check(await p.evaluate(() => __wk.req >= 2 && __wk.rel === __wk.req), 'на время замера экран не гаснет: блокировка экрана взята и отпущена');
  check(run.kinds.length === 11 && /^plan:\w+$/.test(run.kinds[0]) && run.kinds[1] === run.kinds[0] && /^workout:\w+$/.test(run.kinds[8]) && run.kinds[9] === run.kinds[8] && run.kinds[10] === 'gallery' && !run.bad.length
    && run.kinds.slice(2, 8).join() === 'detail:latpulluh,detail:latpulluh,detail:legpress,detail:legpress,detail:squat,detail:squat',
    `«Замерить»: все 11 шагов — карточка и тренировка в двух видах, три разбора в двух видах, витрина атласа (${run.kinds.join(', ')}${run.bad.length ? '; ' + run.bad.join('; ') : ''})`);
  check(/^Атлас движений: витрина — Манекен \(объёмная графика недоступна\)$/.test(run.labels[10]), `шаг витрины подписан по тому, что показано (${run.labels[10]})`);
  /* фигуры — заглушки (объёма нет): шаги «Анатомии» честно подписаны манекеном без объёмной графики */
  check(/ — Манекен \(объёмная графика недоступна\)$/.test(run.labels[0]) && / — Манекен$/.test(run.labels[1]) && /^Тренировка: .* \(объёмная графика недоступна\)$/.test(run.labels[8]) && /^Тренировка: /.test(run.labels[9]),
    `подписи шагов — по тому, что показано (${run.labels[0]} | ${run.labels[1]} | ${run.labels[8]} | ${run.labels[9]})`);
  const after = await snap();
  check(after === before, 'после замера журнал, настройки, планы, сохранённая тренировка, вид фигуры и прокрутка — как были');
  check(await p.evaluate(() => document.querySelectorAll('#perf-panel .perf-table tbody tr').length === 11 && !document.querySelector('[data-perf-run]').offsetHeight), 'итог: таблица из 11 шагов');
  /* копирование: буфер обмена; не вышло — поле с выделенным текстом */
  await p.evaluate(() => { window.__copied = null; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: t => { window.__copied = t; return Promise.resolve(); } } }); });
  await p.click('[data-perf="copy"]'); await p.waitForTimeout(100);
  const copied = await p.evaluate(() => ({ text: window.__copied, msg: document.querySelector('[data-perf-msg]').textContent }));
  check(copied.text && /^Lazy Gym Planner .* — замер скорости, /.test(copied.text) && /\nУстройство: .*\nВидеокарта: /.test(copied.text) && (copied.text.match(/^\d+\. /gm) || []).length === 11 && /Скопировано/.test(copied.msg),
    '«Скопировать результат»: устройство и 11 шагов в буфере обмена');
  await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('нет доступа')); });
  await p.click('[data-perf="copy"]'); await p.waitForTimeout(100);
  check(await p.evaluate(() => { const ta = document.querySelector('[data-perf-msg] textarea'); return !!ta && ta.value === window.__copied && document.activeElement === ta && ta.selectionEnd - ta.selectionStart === ta.value.length; }),
    'без доступа к буферу — поле с выделенным текстом для ручного копирования');
  await p.click('[data-perf="min"]');
  check(await p.evaluate(() => localStorage.getItem('podhod.perf') === 'min' && !document.querySelector('#perf-panel .perf-body').offsetHeight && /^\d|—/.test(document.querySelector('.perf-pill').textContent.trim())), 'свёрнутая панель — кружок с кадрами в секунду');
  await p.goto('file://' + file + '?perf=0'); await p.waitForTimeout(300);
  check(await p.evaluate(() => !document.querySelector('#perf-panel') && localStorage.getItem('podhod.perf') === null && globalThis.GymPerf === null), '?perf=0 выключает панель');
  await p.close();
}

/* запись подходов (телефон): «− N подходов +» под таблицей. Добавить → убрать: записанное в первых подходах и введённое
   в других строках на месте. Отмеченный или заполненный последний подход убирается только после «Убрать» в его строке;
   повторное «−» и Esc его не убирают; минимум один подход; всё доступно с клавиатуры */
{
  const L = await open(390, 844), c = '.card:nth-child(1)';
  await L.evaluate(s => { const card = document.querySelector(s); plan.items.find(x => x.ex.id === card.dataset.ex).rx.sets = 4; refreshCard(card); }, c);
  await L.click(`${c} [data-cfold="log"]`);
  const st = () => L.evaluate(s => {
    const card = document.querySelector(s), id = card.dataset.ex, ae = document.activeElement, day = todaySession(id, false);
    return { rows: card.querySelectorAll('.lt-r').length, sets: plan.items.find(x => x.ex.id === id).rx.sets, num: card.querySelector('.lt-sn').textContent,
      bar: card.querySelector('.lt-tog .cg-s').textContent, log: day ? JSON.stringify(day.s) : null, target: day ? day.target : null,
      ask: card.querySelectorAll('.lt-cf').length, armRow: card.querySelector('.lt-r.lt-arm')?.dataset.k ?? null,
      focus: ae?.dataset.delset ? 'minus' : ae?.dataset.addset ? 'plus' : ae?.dataset.delno ? 'keep' : ae?.dataset.delyes ? 'remove' : ae?.closest?.('.lt-r') ? 'row' + ae.closest('.lt-r').dataset.k : '',
      typed: card.querySelector('.lt-r[data-k="2"] [data-f="reps"]')?.value ?? null, minusOff: card.querySelector('[data-delset]').disabled };
  }, c);
  const log = async (k, reps) => { await L.fill(`${c} .lt-r[data-k="${k}"] [data-f="reps"]`, reps); if (await L.$(`${c} .lt-r[data-k="${k}"] [data-f="kg"]`)) await L.fill(`${c} .lt-r[data-k="${k}"] [data-f="kg"]`, '40'); await L.click(`${c} [data-tick][data-k="${k}"]`); };
  await log(0, '10'); await log(1, '9');
  const first = (await st()).log;
  await L.fill(`${c} .lt-r[data-k="2"] [data-f="reps"]`, '7');
  await L.click(`${c} [data-addset]`);
  let s = await st();
  check(s.rows === 5 && s.sets === 5 && s.num === '5 подходов' && s.bar === '2 из 5' && s.focus === 'row4' && s.typed === '7',
    `«+» добавляет подход в план, счётчик и заголовок, фокус в новой строке, введённое в других строках на месте (${JSON.stringify(s)})`);
  await L.click(`${c} [data-delset]`);
  s = await st();
  check(s.rows === 4 && s.sets === 4 && s.num === '4 подхода' && s.log === first && s.typed === '7' && s.focus === 'minus' && !s.ask,
    `«−» у пустой строки убирает её сразу: записанные подходы и введённое на месте, фокус на «−» (${JSON.stringify(s)})`);
  await log(3, '8');
  const four = (await st()).log;
  await L.click(`${c} [data-delset]`);
  s = await st();
  check(s.rows === 4 && s.log === four && s.ask === 1 && s.armRow === '3' && s.focus === 'keep' && await L.evaluate(s => /Подход 4 записан/.test(document.querySelector(s + ' .lt-cft').textContent), c),
    `отмеченный последний подход: в его строке вопрос «Убрать / Оставить», ничего не убрано, фокус на «Оставить» (${JSON.stringify(s)})`);
  await L.click(`${c} [data-delset]`);
  s = await st();
  check(s.rows === 4 && s.log === four && s.ask === 1, 'повторное «−» (двойное касание) ничего не убирает');
  await L.keyboard.press('Escape');
  s = await st();
  check(s.rows === 4 && s.log === four && !s.ask && s.focus === 'minus', `Esc закрывает вопрос, подход на месте, фокус на «−» (${JSON.stringify(s)})`);
  await L.click(`${c} [data-delset]`); await L.click(`${c} [data-delno]`);
  s = await st();
  check(s.rows === 4 && s.log === four && !s.ask && s.focus === 'minus', '«Оставить» — подход на месте');
  /* с клавиатуры: Enter на «−», Shift+Tab к «Убрать», Enter */
  await L.focus(`${c} [data-delset]`); await L.keyboard.press('Enter');
  check((await st()).focus === 'keep', 'с клавиатуры: Enter на «−» открывает вопрос, фокус на «Оставить»');
  await L.keyboard.press('Shift+Tab');
  check((await st()).focus === 'remove', 'Shift+Tab — к «Убрать»');
  await L.keyboard.press('Enter');
  s = await st();
  check(s.rows === 3 && s.sets === 3 && s.log === first && s.target === 3 && s.bar === '2 из 3' && s.focus === 'minus' && s.typed === '7',
    `«Убрать» — подход ушёл из записи и из плана, первые подходы и введённое на месте, фокус на «−» (${JSON.stringify(s)})`);
  /* строка с цифрами без отметки — тоже с подтверждением; убрать до одного */
  await L.click(`${c} [data-delset]`);
  s = await st();
  check(s.ask === 1 && s.armRow === '2' && await L.evaluate(s => /Подход 3 заполнен/.test(document.querySelector(s + ' .lt-cft').textContent), c), 'строка с введёнными цифрами без отметки — тоже с вопросом');
  await L.click(`${c} [data-delyes]`);
  await L.click(`${c} [data-delset]`); await L.click(`${c} [data-delyes]`);
  s = await st();
  check(s.rows === 1 && s.sets === 1 && s.minusOff && s.focus === 'plus' && s.log === JSON.stringify(JSON.parse(first).slice(0, 1)) && s.num === '1 подход',
    `минимум один подход: «−» выключен, фокус на «+», первый подход на месте (${JSON.stringify(s)})`);
  await L.close();
}

/* вес на следующие подходы (телефон, свой план, новое упражнение без веса): вписали вес в первый подход — во 2–4 он
   подсказкой; второй и третий отмечены без ввода — в журнале тот же вес; «×2» — по нему; повторы не переносятся */
{
  const W = await open(390, 844), c = '.card[data-ex="dbbench"]';
  await W.evaluate(() => {
    S.customs = [{ id: 'wc', name: 'Перенос веса', items: [{ id: 'dbbench', sets: 4 }] }];
    S.custom = 'wc'; S.mode = 'custom'; ensureCustoms(S); openCustom('wc'); regen();
  });
  await W.click(`${c} [data-cfold="log"]`);
  const hints = () => W.evaluate(s => [...document.querySelectorAll(s + ' .lt-r [data-f="kg"]')].map(i => i.value || '[' + i.placeholder + ']'), c);
  check((await hints()).join() === '[],[],[],[]', `новое упражнение без веса: подсказки веса нет (${await hints()})`);
  const rp = await W.evaluate(s => document.querySelector(s + ' .lt-r[data-k="1"] [data-f="reps"]').placeholder, c);
  await W.fill(`${c} .lt-r[data-k="0"] [data-f="kg"]`, '40');
  check((await hints()).join() === '40,[40],[40],[40]', `вписали 40 в первый подход — во 2–4 подсказка 40 (${await hints()})`);
  await W.fill(`${c} .lt-r[data-k="0"] [data-f="reps"]`, '10');
  check(await W.evaluate(([s, rp]) => document.querySelector(s + ' .lt-r[data-k="1"] [data-f="reps"]').placeholder === rp && document.querySelector(s + ' .lt-x2 b').textContent === '×2 = 80 кг', [c, rp]), 'повторы не переносятся; «×2 = 80 кг» по вписанному весу');
  for (const k of [0, 1, 2]) await W.click(`${c} [data-tick][data-k="${k}"]`);
  const day = await W.evaluate(() => JSON.stringify(todaySession('dbbench', false).s.map(x => x[0])));
  check(day === '[40,40,40]', `второй и третий подходы отмечены без ввода — записан тот же вес (${day})`);
  check((await hints()).join() === '40,40,40,[40]', `отмеченные показывают записанное, четвёртый — подсказку 40 (${await hints()})`);
  await W.evaluate(() => logRefresh(null));
  check((await hints()).join() === '40,40,40,[40]', `после перерисовки — так же (${await hints()})`);
  await W.close();
}

/* «Заменить» (телефон 390×844): кнопка раскрывает под собой список замен (role="group" с подписью, aria-expanded),
   пункты не ниже 44 px, без того, что уже в плане; Esc и повторное нажатие сворачивают, фокус — на кнопку; выбор меняет
   упражнение в той же карточке, «Заменено: … Вернуть» с фокусом на «Вернуть», карточка на месте; «Вернуть» — прежнее.
   В программе — без повторов недели; «Убрать» в своём плане → «Убрано: … Вернуть» на месте карточки; «Беречь колени» —
   в заменах приседа нет глубокого сгиба стоя. */
{
  const w = await open(390, 844);
  await w.evaluate(() => { S.fold = { setup: true, load: true, cards: 'compact' }; Object.assign(S, { count: 6, seed: 7 }); regen(); });
  const at = async slot => {
    const card = `.card[data-slot="${slot}"]`;
    await w.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center' }), `${card} [data-swap]`);
    return { card, btn: `${card} [data-swap]`, box: `#sw-pick-${slot}` };
  };
  const st = s => w.evaluate(({ card, btn, box }) => {
    const b = document.querySelector(btn), x = document.querySelector(box), c = document.querySelector(card), r = b.getBoundingClientRect(), items = [...x.querySelectorAll('[data-swap-to]')];
    const a = document.activeElement, inPlan = new Set(plan.items.map(it => it.ex.id)), u = c.querySelector('[data-swap-undo]');
    return { exp: b.getAttribute('aria-expanded'), ctl: b.getAttribute('aria-controls') === x.id, open: !x.hidden && x.getClientRects().length > 0,
      label: x.getAttribute('role') === 'group' && document.getElementById(x.getAttribute('aria-labelledby'))?.textContent, none: x.querySelector('.sw-none')?.textContent || '',
      ids: items.map(i => i.dataset.swapTo), notes: items.every(i => (i.querySelector('small')?.textContent || '').length > 3),
      minH: items.length ? Math.min(...items.map(i => i.getBoundingClientRect().height)) : 0, below: items.every(i => i.getBoundingClientRect().top >= r.bottom - 1),
      inside: items.every(i => i.getBoundingClientRect().left >= 0 && i.getBoundingClientRect().right <= innerWidth), dup: items.some(i => inPlan.has(i.dataset.swapTo)),
      focus: a === b ? 'button' : a?.dataset.swapTo ?? (a?.dataset.swapUndo ? 'undo' : a?.tagName), ex: c.dataset.ex, top: r.top,
      line: c.querySelector('.sw-done')?.textContent.trim() || '', undoH: u ? u.getBoundingClientRect().height : 0, wide: document.documentElement.scrollWidth > document.documentElement.clientWidth };
  }, s);
  const slot = await w.evaluate(() => plan.blocks[0].items[1].slot), other = await w.evaluate(() => plan.blocks[0].items[2].slot);
  let s1 = await at(slot), s = await st(s1);
  check(s.exp === 'false' && s.ctl && !s.open, '«Заменить»: список свёрнут, у кнопки aria-expanded="false" и aria-controls');
  await w.click(s1.btn); s = await st(s1);
  check(s.exp === 'true' && s.open && s.label === 'Чем заменить' && s.ids.length >= 3 && s.ids.length <= 5 && s.notes && s.focus === s.ids[0] && !s.dup && !s.wide,
    `«Заменить» раскрывает под кнопкой 3–5 замен со строкой «что меняется», фокус на первой, без упражнений плана (${JSON.stringify(s)})`);
  check(s.minH >= 44 && s.below && s.inside, `замены: пункты не ниже 44 px, под кнопкой, в пределах экрана (${s.minH})`);
  const before = s.ex, pick = s.ids[1];
  await w.keyboard.press('Escape'); s = await st(s1);
  check(s.exp === 'false' && !s.open && s.focus === 'button' && s.ex === before, 'Esc сворачивает список замен, фокус — на «Заменить», упражнение прежнее');
  await w.click(s1.btn); await w.click(s1.btn); s = await st(s1);
  check(s.exp === 'false' && !s.open, 'повторное нажатие на «Заменить» сворачивает список');
  await w.click(s1.btn); const s2 = await at(other); await w.click(s2.btn);
  check(!(await st(s1)).open && (await st(s2)).open, 'список в другой карточке сворачивает первый');
  await w.keyboard.press('Escape'); s1 = await at(slot); await w.click(s1.btn); await w.waitForTimeout(700); /* список докручивается в экран плавно */
  const y0 = (await st(s1)).top;
  await w.click(`${s1.box} [data-swap-to="${pick}"]`); s = await st(s1);
  const names = await w.evaluate(([a, b]) => [a, b].map(id => exName(EXI[id], plan.E)), [before, pick]);
  check(s.ex === pick && s.line === `Заменено: ${names[0]} → ${names[1]}.Вернуть` && s.focus === 'undo' && s.undoH >= 44 && Math.abs(s.top - y0) < 2,
    `выбор меняет упражнение в той же карточке: «Заменено: … Вернуть», фокус на «Вернуть», карточка на месте (${JSON.stringify({ ...s, y0, names })})`);
  check(await w.evaluate(([sl, id]) => S.swaps.s[sl] === id && JSON.parse(localStorage.getItem('podhod.settings.v1')).swaps.s[sl] === id, [slot, pick]), 'замена сохраняется с настройками');
  await w.click(`${s1.card} [data-swap-undo]`); s = await st(s1);
  check(s.ex === before && !s.line && s.focus === 'button' && Math.abs(s.top - y0) < 2 && await w.evaluate(sl => !(sl in S.swaps.s), slot),
    `«Вернуть» одним нажатием возвращает прежнее, фокус — на «Заменить» (${JSON.stringify(s)})`);
  /* программа на неделю: в списке нет упражнений других дней */
  await w.evaluate(() => { S.mode = 'program'; S.day = 0; regen(); });
  const ps = await w.evaluate(() => plan.blocks[0].items[0].slot); s1 = await at(ps); await w.click(s1.btn); s = await st(s1);
  const week = await w.evaluate(() => prog.days.flatMap(d => (d.plan.items || []).map(it => it.ex.id)));
  check(s.open && s.ids.length > 0 && !s.ids.some(id => week.includes(id)), `программа: в заменах нет упражнений других дней недели (${JSON.stringify(s.ids)})`);
  await w.click(`${s1.box} [data-swap-to="${s.ids[0]}"]`);
  check(await w.evaluate(([sl, id]) => S.swaps.d0[sl] === id && document.querySelector(`.card[data-slot="${sl}"]`).dataset.ex === id && !!document.querySelector('[data-swap-undo]'), [ps, s.ids[0]]), 'программа: замена в дне и «Вернуть»');
  /* свой план: «Убрать» сразу, «Убрано: … Вернуть» на месте карточки, страница не прыгает */
  await w.evaluate(() => { S.customs = [{ id: 'sw', name: 'Верх', items: [{ id: 'bbbench', sets: 5 }, { id: 'latpull', kg: [40] }, { id: 'ohp' }] }]; ensureCustoms(S); openCustom('sw'); regen(); });
  await w.evaluate(() => document.querySelector('.card[data-slot="1"] [data-cp-rm]').scrollIntoView({ block: 'center' }));
  const rm = await w.evaluate(() => ({ top: document.querySelector('.card[data-slot="1"] [data-cp-rm]').getBoundingClientRect().top, name: document.querySelector('.card[data-slot="1"] .c-name').textContent }));
  await w.click('.card[data-slot="1"] [data-cp-rm]');
  let g = await w.evaluate(() => { const u = document.querySelector('[data-rm-undo]'), li = u?.closest('.sw-gone'); return { items: customOf().items.map(i => i.id).join(), text: li?.textContent.trim(), top: u?.getBoundingClientRect().top, h: u?.getBoundingClientRect().height, focus: document.activeElement === u, next: li?.nextElementSibling?.dataset.ex }; });
  check(g.items === 'bbbench,ohp' && g.text === `Убрано: ${rm.name}.Вернуть` && g.focus && g.h >= 44 && g.next === 'ohp' && Math.abs(g.top - rm.top) < 2,
    `«Убрать»: сразу, «Убрано: … Вернуть» на месте карточки, фокус на «Вернуть», страница не прыгает (${JSON.stringify({ ...g, rm })})`);
  await w.click('[data-rm-undo]');
  g = await w.evaluate(() => { const b = document.querySelector('.card[data-slot="1"] [data-cp-rm]'); return { items: JSON.stringify(customOf().items), gone: !!document.querySelector('.sw-gone'), focus: document.activeElement === b, top: b.getBoundingClientRect().top }; });
  check(g.items === '[{"id":"bbbench","sets":5},{"id":"latpull","kg":[40]},{"id":"ohp"}]' && !g.gone && g.focus && Math.abs(g.top - rm.top) < 2, `«Вернуть» возвращает упражнение на место с его весом, фокус — на его «Убрать» (${JSON.stringify(g)})`);
  /* свой план: «Заменить» работает так же и сохраняет подходы */
  s1 = await at(0); await w.click(s1.btn); s = await st(s1);
  check(s.open && !s.ids.some(id => ['latpull', 'ohp'].includes(id)), 'свой план: в заменах нет упражнений плана');
  await w.click(`${s1.box} [data-swap-to="${s.ids[0]}"]`);
  check(await w.evaluate(id => customOf().items[0].id === id && customOf().items[0].sets === 5 && !!document.querySelector('.card[data-slot="0"] [data-swap-undo]'), s.ids[0]), 'свой план: замена записана в план, подходы сохранены, «Вернуть» на месте');
  /* «Беречь колени» (бережно): в заменах упражнения на присед — без глубокого сгиба стоя */
  await w.evaluate(() => { S.mode = 'single'; switchModeSettings('custom'); Object.assign(S, { goal: 'gentle', groups: ['quads', 'glutes', 'hams'], protect: ['knees'] }); regen(); });
  const sq = await w.evaluate(() => plan.items.find(it => PATTERN[it.ex.id] === 'squat')?.slot);
  if (sq === undefined) check(false, 'бережно с «Беречь колени»: в плане нет упражнения на присед для проверки замен');
  else {
    s1 = await at(sq); await w.click(s1.btn); s = await st(s1);
    check(s.open && (s.ids.length > 0 || /Близких замен нет/.test(s.none)) && await w.evaluate(ids => ids.every(id => !stressKneeDeep(EXI[id]) && fitsBody(EXI[id])), s.ids),
      `«Беречь колени»: замены приседа без глубокого сгиба стоя (${JSON.stringify(s.ids)})`);
  }
  await w.close();
}

/* защита журнала (телефон, 13-log.js, 14-workout-mode.js): «5000» вместо «50» — вопрос в строке подхода «Записать /
   Исправить», ничего не записано, фокус на «Исправить», Esc — в поле веса; «Записать» пишет как есть. Без прошлых
   тренировок после отметки — «Сегодня: 1 из 3…», в тренировке «Прошлый раз: —». Пирамида повторов «10/8/6/5» в поле
   «Повторов»: карточка «4 × 10/8/6/5», цели подходов в таблице и в тренировке («6 повторов», «цель 6»). Тот же вопрос
   о весе в тренировке: «Подход выполнен» ждёт, Esc закрывает вопрос, а не тренировку. Журнал: «5 кг × 15» крупно */
{
  const G = await open(390, 844), sq = '.card[data-ex="squat"]', db = '.card[data-ex="dbbench"]';
  await G.evaluate(() => {
    const y = dayKey(new Date(Date.now() - 864e5));
    S.customs = [{ id: 'dg', name: 'Защита', items: [{ id: 'squat', sets: 4 }, { id: 'dbbench', sets: 3 }, { id: 'bbbench', sets: 3 }] }];
    S.custom = 'dg'; S.mode = 'custom'; ensureCustoms(S); openCustom('dg');
    LOG.data = { squat: [{ d: y, s: [[52.5, 8], [52.5, 8], [52.5, 8], [52.5, 8]] }] }; regen();
  });
  await G.click(`${sq} [data-cfold="log"]`); await G.click(`${db} [data-cfold="log"]`);
  const q = s => G.evaluate(s => { const k = document.querySelector(s + ' .lt-kq'), ae = document.activeElement;
    return { text: k?.querySelector('.lt-cft').textContent ?? null, row: k?.closest('.lt-r').dataset.k ?? null, arm: !!k?.closest('.lt-r.lt-arm'),
      focus: ae?.dataset.kgfix ? 'fix' : ae?.dataset.kgyes ? 'yes' : ae?.dataset.tick ? 'tick' + ae.dataset.k : ae?.dataset.f ? ae.dataset.f + ae.closest('.lt-r').dataset.k : '',
      log: JSON.stringify(todaySession(document.querySelector(s).dataset.ex, false)?.s ?? null), wide: document.documentElement.scrollWidth > innerWidth + 1,
      btn: k ? Math.min(...[...k.querySelectorAll('button')].map(b => b.getBoundingClientRect().height)) : 0 }; }, s);
  await G.fill(`${sq} .lt-r[data-k="0"] [data-f="kg"]`, '5000'); await G.fill(`${sq} .lt-r[data-k="0"] [data-f="reps"]`, '8');
  await G.click(`${sq} [data-tick][data-k="0"]`);
  let r = await q(sq);
  check(r.text === 'Это намного больше, чем в прошлый раз (52,5\u00a0кг). Записать 5000\u00a0кг?' && r.row === '0' && r.arm && r.focus === 'fix' && r.log === 'null' && !r.wide && r.btn >= 38,
    `«5000» не записано: вопрос в строке подхода, фокус на «Исправить», кнопки не меньше 38 px, без прокрутки вбок (${JSON.stringify(r)})`);
  await G.keyboard.press('Escape'); r = await q(sq);
  check(r.text === null && r.focus === 'kg0' && r.log === 'null' && await G.evaluate(s => getSelection().toString() === '5000' || document.activeElement.selectionEnd - document.activeElement.selectionStart === 4, sq),
    `Esc закрывает вопрос, фокус в поле веса, вписанное выделено (${JSON.stringify(r)})`);
  await G.keyboard.type('50'); await G.click(`${sq} [data-tick][data-k="0"]`); r = await q(sq);
  check(r.log === '[[50,8]]' && r.text === null, `исправленный вес записан сразу (${JSON.stringify(r)})`);
  await G.fill(`${sq} .lt-r[data-k="1"] [data-f="kg"]`, '5000'); await G.fill(`${sq} .lt-r[data-k="1"] [data-f="reps"]`, '8'); await G.click(`${sq} [data-tick][data-k="1"]`);
  await G.click(`${sq} [data-kgyes]`); r = await q(sq);
  check(r.log === '[[50,8],[5000,8]]' && r.text === null && r.focus === 'tick1', `«Записать» пишет как вписано, фокус на отметке подхода (${JSON.stringify(r)})`);
  /* без истории: после отметки — «Сегодня: 1 из 3» */
  const sug = s => G.evaluate(s => document.querySelector(s + ' .sug span').textContent, s);
  check(/^Первая запись/.test(await sug(db)), 'жим гантелей без истории — «Первая запись…»');
  await G.fill(`${db} .lt-r[data-k="0"] [data-f="kg"]`, '20'); await G.fill(`${db} .lt-r[data-k="0"] [data-f="reps"]`, '10'); await G.click(`${db} [data-tick][data-k="0"]`);
  check(await sug(db) === 'Сегодня: 1 из 3. Следующий — с тем же весом (20 кг).', `после отметки — «Сегодня: 1 из 3…» (${await sug(db)})`);
  /* пирамида повторов в поле «Повторов» своего плана */
  await G.click('[data-cp-edit="2"]');
  await G.fill('[data-cp-reps="2"]', '10 / 8 / 6 / 5'); await G.press('[data-cp-reps="2"]', 'Tab'); await G.waitForTimeout(100);
  const pyr = await G.evaluate(() => { const c = document.querySelector('.card[data-ex="bbbench"]');
    return { rx: c.querySelector('.rx-big').textContent, field: c.querySelector('[data-cp-reps]').value, ph: [...c.querySelectorAll('.lt-r [data-f="reps"]')].map(i => i.placeholder).join(), item: JSON.stringify(customOf().items[2]) }; });
  check(pyr.rx.startsWith('4 × 10/8/6/5') && pyr.field === '10/8/6/5' && pyr.ph === '10,8,6,5' && pyr.item === '{"id":"bbbench","sets":4,"reps":"10/8/6/5"}',
    `«10 / 8 / 6 / 5» в поле «Повторов»: 4 подхода, карточка «4 × 10/8/6/5», цели подходов в таблице (${JSON.stringify(pyr)})`);
  /* тренировка: цель подхода пирамиды, «Прошлый раз: —», вопрос о весе */
  await G.click('#start-workout'); await G.waitForTimeout(200);
  const wv = () => G.evaluate(() => ({ target: $('#wv-target').textContent, ph: $('#wv-reps').placeholder, prev: $('#wv-previous').textContent, ask: !$('#wv-kg-ask').hidden,
    askText: $('#wv-kg-ask-t').textContent, done: !$('#wv-done').hidden, open: $('#workout-view').open, focus: document.activeElement?.id, log: JSON.stringify(todaySession(workout.queue[workout.index].it.ex.id, false)?.s ?? null) }));
  await G.evaluate(() => workoutShow(workout.queue.findIndex(s => s.it.ex.id === 'bbbench' && s.k === 2)));
  let w = await wv();
  check(w.target === '6 повторов' && w.ph === 'цель 6', `тренировка: цель третьего подхода пирамиды — «6 повторов», подсказка «цель 6» (${JSON.stringify(w)})`);
  await G.evaluate(() => workoutShow(workout.queue.findIndex(s => s.it.ex.id === 'dbbench' && s.k === 1)));
  w = await wv();
  check(w.prev === '—' && w.ph === 'цель 6–10', `без прошлых тренировок, но с записью сегодня — «Прошлый раз: —» (${JSON.stringify(w)})`);
  await G.fill('#wv-kg', '5000'); await G.fill('#wv-reps', '10'); await G.click('#wv-done');
  w = await wv();
  check(w.ask && !w.done && w.focus === 'wv-kg-fix' && w.askText === 'Это намного больше, чем сегодня в других подходах (20\u00a0кг). Записать 5000\u00a0кг?' && w.log === '[[20,10]]',
    `тренировка: вопрос о весе под полями, «Подход выполнен» ждёт, ничего не записано (${JSON.stringify(w)})`);
  await G.keyboard.press('Escape'); w = await wv();
  check(w.open && !w.ask && w.done && w.focus === 'wv-kg', `Esc закрывает вопрос, а не тренировку; фокус в поле веса (${JSON.stringify(w)})`);
  await G.click('#wv-done'); await G.click('#wv-kg-yes');
  check(await G.evaluate(() => JSON.stringify(todaySession('dbbench', false).s) === '[[20,10],[5000,10]]' && !$('#wv-rest').hidden), '«Записать» в тренировке пишет подход и начинает отдых');
  await G.click('#wv-close');
  /* журнал: рабочий вес и повторы крупно, расчётный максимум мелко */
  await G.evaluate(() => { const d = n => dayKey(new Date(Date.now() - n * 864e5)); LOG.data = { dbcurl: [{ d: d(9), s: [[5, 12], [5, 12]] }, { d: d(5), s: [[5, 13]] }, { d: d(2), s: [[5, 15], [5, 14]] }] }; S.view = 'journal'; renderSetup(); renderPlan(); });
  const j = await G.evaluate(() => { const v = document.querySelector('.j-row .j-val'), big = v.querySelector('.j-big'), e1 = v.querySelector('.j-e1');
    return { big: [...big.childNodes].filter(n => !n.classList?.contains('vh')).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim(), e1: e1.textContent, em: v.querySelector('em')?.textContent, size: [parseFloat(getComputedStyle(big).fontSize), parseFloat(getComputedStyle(e1).fontSize)], wide: document.documentElement.scrollWidth > innerWidth + 1 }; });
  check(j.big === '5кг × 15' && j.e1 === 'расч. максимум 7 кг' && j.em === '+3 повт.' && j.size[0] > j.size[1] * 1.4 && !j.wide,
    `журнал: «5 кг × 15» крупно, расчётный максимум мелко с подписью, «+3 повт.» вместо «0 %» (${JSON.stringify(j)})`);
  await G.close();
}

/* «+ В свой план» (телефон): в атласе мышц и в разборе кнопка раскрывает под собой список своих планов и «+ Новый план».
   Выбор добавляет в выбранный план и не открывает его; повторное нажатие и Esc сворачивают список, фокус — на кнопку;
   последний выбранный — первым. На странице своего плана кнопка, как раньше, добавляет в открытый план. */
{
  const k = await open(390, 844), add = '#at-keep [data-cp-add]', box = '#cp-pick-at';
  await k.evaluate(() => {
    Object.assign(S, { view: 'atlas', mode: 'single', atlasM: 'chest', cpLast: null, custom: 'up',
      customs: [{ id: 'up', name: 'Верх', items: [{ id: 'bbbench' }] }, { id: 'low', name: 'Низ', group: 'Сила', items: [{ id: 'squat' }] }, { id: 'band', name: 'Дома с эспандером', items: [] }] });
    ensureCustoms(S); atlasEx = 'bbbench'; regen();
  });
  const st = (sel = box, btn = add) => k.evaluate(([sel, btn]) => {
    const b = document.querySelector(btn), x = document.querySelector(sel), m = b.parentElement.querySelector('.cp-msg'), r = b.getBoundingClientRect();
    const items = [...x.querySelectorAll('.cp-pick-i')];
    return { exp: b.getAttribute('aria-expanded'), open: !x.hidden && x.getClientRects().length > 0, label: x.getAttribute('role') === 'group' && document.getElementById(x.getAttribute('aria-labelledby'))?.textContent,
      names: items.map(i => i.querySelector('b')?.textContent || i.textContent), first: items[0]?.dataset.cpTo, firstState: items[0]?.querySelector('.cp-pick-st')?.textContent || '', firstOff: items[0]?.getAttribute('aria-disabled'),
      minH: Math.min(...items.map(i => i.getBoundingClientRect().height)), below: items.every(i => i.getBoundingClientRect().top >= r.bottom - 1), inside: items.every(i => i.getBoundingClientRect().right <= innerWidth && i.getBoundingClientRect().left >= 0),
      focus: document.activeElement === b ? 'button' : document.activeElement?.dataset.cpTo ?? document.activeElement?.tagName,
      msg: m && !m.hidden ? m.textContent.trim() : '', go: m?.querySelector('[data-cp-go]').dataset.cpGo, where: [S.custom, S.mode, S.view].join() };
  }, [sel, btn]);
  let s = await st();
  check(s.exp === 'false' && !s.open, 'атлас: список планов свёрнут, у кнопки aria-expanded="false"');
  await k.click(add); s = await st();
  check(s.exp === 'true' && s.open && s.label === 'В какой план добавить' && s.names.join('|') === 'Верх|Низ|Дома с эспандером|+ Новый план' && s.focus === 'up',
    `нажатие раскрывает под кнопкой список: планы и «+ Новый план» последним, первым — открытый план, фокус на нём (${JSON.stringify(s)})`);
  check(s.firstOff === 'true' && s.firstState === '✓ уже в плане', 'план, где упражнение уже есть, помечен «✓ уже в плане»');
  check(s.minH >= 44 && s.below && s.inside, `пункты не ниже 44 px, под кнопкой, в пределах экрана (${s.minH})`);
  await k.keyboard.press('Escape'); s = await st();
  check(s.exp === 'false' && !s.open && s.focus === 'button', 'Esc сворачивает список, фокус возвращается на кнопку');
  await k.click(add); await k.click(add); s = await st();
  check(s.exp === 'false' && !s.open, 'повторное нажатие на кнопку сворачивает список');
  await k.click(add); await k.click(`${box} [data-cp-to="up"]`, { force: true }); s = await st(); /* aria-disabled: Playwright без force не нажимает */
  check(!s.open && s.msg === 'Уже в плане: Верх. Открыть план →' && await k.evaluate(() => customOf().items.length === 1), '«✓ уже в плане» не добавляет повторно и сообщает об этом');
  await k.click(add); await k.click(`${box} [data-cp-to="low"]`); s = await st();
  check(!s.open && s.exp === 'false' && s.focus === 'button' && s.msg === 'Добавлено в план: Низ. Открыть план →' && s.go === 'low' && s.where === 'up,single,atlas'
    && await k.evaluate(() => S.customs.find(c => c.id === 'low').items.map(i => i.id).join() === 'squat,bbbench' && S.cpLast === 'low' && JSON.parse(localStorage.getItem('podhod.settings.v1')).cpLast === 'low'),
    `выбор второго плана: упражнение в нём, открытый план, режим и вид прежние, сообщение со ссылкой на этот план (${JSON.stringify(s)})`);
  await k.click(add); s = await st();
  check(s.first === 'low' && s.firstState === '✓ уже в плане' && !s.msg, 'последний выбранный план — первым; прежнее сообщение убрано');
  await k.click(`${box} [data-cp-to=""]`); s = await st();
  const made = await k.evaluate(() => { const c = S.customs.at(-1); return { n: S.customs.length, name: c.name, items: c.items.map(i => i.id).join(), id: c.id, last: S.cpLast }; });
  check(made.n === 4 && made.name === 'План 4' && made.items === 'bbbench' && made.last === made.id && s.go === made.id && s.where === 'up,single,atlas' && s.msg === 'Создан план «План 4», упражнение добавлено. Открыть план →',
    `«+ Новый план» создаёт «План 4» с упражнением и не открывает его (${JSON.stringify({ ...made, ...s })})`);
  await k.click('#at-keep [data-cp-go]');
  check(await k.evaluate(id => S.custom === id && S.mode === 'custom' && S.view === 'plan' && document.querySelector('.p-title')?.textContent === 'План 4', made.id), '«Открыть план →» открывает именно этот план');
  /* разбор движения поверх атласа: тот же список, Esc сворачивает его, а разбор остаётся открытым */
  await k.evaluate(() => { S.custom = 'up'; S.mode = 'single'; switchModeSettings('custom'); S.view = 'atlas'; regen(); openMotionItem(previewItem('dbcurl')); });
  const mv = ['#cp-pick-mv', '#mv-tools [data-cp-add]'];
  await k.click(mv[1]); s = await st(...mv);
  check(s.open && s.exp === 'true' && s.first === made.id && s.focus === made.id && s.minH >= 44 && s.inside, `разбор: список планов под кнопкой, первым — последний выбранный (${JSON.stringify(s)})`);
  await k.keyboard.press('Escape'); s = await st(...mv);
  check(!s.open && s.focus === 'button' && await k.evaluate(() => $('#motion-view').open), 'разбор: Esc сворачивает список, а не закрывает разбор');
  await k.click(mv[1]); await k.click(`${mv[0]} [data-cp-to="band"]`); s = await st(...mv);
  check(s.msg === 'Добавлено в план: Дома с эспандером. Открыть план →' && s.go === 'band' && s.where === 'up,single,atlas' && await k.evaluate(() => $('#motion-view').open && S.customs.find(c => c.id === 'band').items[0]?.id === 'dbcurl'),
    `разбор: выбор плана добавляет в него, разбор открыт, план не открылся (${JSON.stringify(s)})`);
  /* полный план — «полон», без добавления */
  await k.evaluate(() => { const c = S.customs.find(c => c.id === 'low'); c.items = EX.filter(ex => ex.id !== 'dbcurl').slice(0, CUSTOM_MAX).map(ex => ({ id: ex.id })); });
  await k.click(mv[1]);
  check(await k.evaluate(() => { const b = document.querySelector('#cp-pick-mv [data-cp-to="low"]'); return b.getAttribute('aria-disabled') === 'true' && b.querySelector('.cp-pick-st').textContent === 'полон'; }), 'полный план помечен «полон»');
  await k.click(`${mv[0]} [data-cp-to="low"]`, { force: true }); s = await st(...mv);
  check(/^План «Низ» полон/.test(s.msg) && await k.evaluate(() => S.customs.find(c => c.id === 'low').items.length === CUSTOM_MAX), 'полный план не принимает упражнение');
  await k.evaluate(() => closeMotion());
  /* страница своего плана (замечание 12 тестера: добавлялось молча в открытый план): тот же список, открытый план — первым;
     выбор не закрывает разбор и не перерисовывает план под ним — план перерисовывается, когда разбор закрыт */
  await k.evaluate(() => { openCustom('band'); S.cpLast = null; regen(); openMotionItem(previewItem('legext')); });
  await k.click(mv[1]); s = await st(...mv);
  check(s.open && s.exp === 'true' && s.first === 'band' && s.focus === 'band', `на странице своего плана — тоже список, открытый план первым (${JSON.stringify(s)})`);
  const cards0 = await k.evaluate(() => document.querySelectorAll('#plan .card').length);
  await k.click(`${mv[0]} [data-cp-to="band"]`); s = await st(...mv);
  check(s.msg === 'Добавлено в план: Дома с эспандером. Открыть план →' && await k.evaluate(n => $('#motion-view').open && customOf().items.some(i => i.id === 'legext') && document.querySelectorAll('#plan .card').length === n, cards0),
    `выбор открытого плана: разбор открыт, план под ним пока прежний (${JSON.stringify(s)})`);
  await k.evaluate(() => closeMotion());
  check(await k.evaluate(n => !$('#motion-view').open && document.querySelectorAll('#plan .card').length === n + 1 && !!document.querySelector('#plan .card[data-ex="legext"]'), cards0), 'разбор закрыт — в плане новая карточка');
  /* «+ В план» в «Добавить упражнение» своего плана — сразу в открытый план; поиск там же находит по всему каталогу */
  await k.evaluate(() => { const q = document.querySelector('#cp-q'); q.value = 'бенч'; q.dispatchEvent(new Event('input', { bubbles: true })); });
  check(await k.evaluate(() => /^Найдено: 1/.test(document.querySelector('#cp-list .cp-gh')?.textContent || '') && !!document.querySelector('#cp-list [data-cp-add="bbbench"]')), '«Добавить упражнение»: поиск «бенч» — жим штанги лёжа');
  await k.click('#cp-list [data-cp-add="bbbench"]');
  check(await k.evaluate(() => customOf().items.some(i => i.id === 'bbbench') && document.activeElement?.id === 'cp-q' && document.querySelector('#cp-q').value === 'бенч'), '«+ В план» из поиска: сразу в открытый план, поиск и фокус в поле остаются');
  await k.close();
}

/* «+» на плитке атласа (замечание 6 тестера, телефон 390×844, русская и английская версии): поиск «бенч» и «bench press»;
   «+» — цель 44×44 с именем «Добавить в план: …»; нажатие раскрывает выбор плана над нижним краем (последний выбранный
   первым), выбор добавляет, атлас открыт, прокрутка та же, сообщение «Добавлено в «…»» с «Открыть план», на плитке «✓»,
   фокус — на ней; Esc закрывает выбор, а не атлас; нажатие на плитку по-прежнему открывает разбор */
for (const lang of ['ru', 'en']) {
  const g = await browser.newPage({ viewport: { width: 390, height: 844 } });
  g.on('pageerror', e => errors.push(String(e)));
  await g.goto('file://' + path.join(path.dirname(file), `lazy-gym-planner-offline-${lang}.html`)); await g.waitForTimeout(500);
  await fakeFigures(g);
  const T = lang === 'ru' ? { up: 'Верх А', low: 'Низ А', added: 'Добавлено в «Низ А»', has: '(уже в плане «Низ А»)', add: 'Добавить в план: ', head: 'В какой план добавить', open: 'Открыть план', none: 'Ничего не нашлось.', squat: 'присед' }
    : { up: 'Upper A', low: 'Lower A', added: 'Added to “Lower A”', has: '(already in “Lower A”)', add: 'Add to plan: ', head: 'Choose a plan', open: 'Open plan', none: 'Nothing found.', squat: 'squat' };
  await g.evaluate(T => { Object.assign(S, { view: 'plan', mode: 'single', cpLast: null, custom: 'up', customs: [{ id: 'up', name: T.up, items: [{ id: 'bbbench' }] }, { id: 'low', name: T.low, items: [] }] }); ensureCustoms(S); LOG.data = {}; regen(); scrollTo(0, 0); }, T);
  await g.click('#motion-atlas'); await g.waitForTimeout(150);
  const tiles = () => g.evaluate(() => [...document.querySelectorAll('#mv-gallery .mv-tile')].map(b => b.dataset.galleryOpen));
  for (const q of ['бенч', 'bench press']) { await g.fill('#mv-gq', q); const t = await tiles(); check(t[0] === 'bbbench' && await g.evaluate(() => document.activeElement.id === 'mv-gq'), `${lang}: «${q}» — первым «${lang === 'ru' ? 'Жим штанги лёжа' : 'Barbell bench press'}» (${t.slice(0, 3)})`); }
  await g.fill('#mv-gq', 'zzzz');
  const empty = await g.evaluate(() => document.querySelector('#mv-gallery .mv-gcount').textContent + ' ' + (document.querySelector('#mv-gallery .mv-gempty')?.textContent || ''));
  check(empty.startsWith(T.none) && !/«Всё»|“All”/.test(empty), `${lang}: пустая выдача — «${T.none}» без совета выбрать «Всё» (${empty})`);
  await g.fill('#mv-gq', T.squat);
  await g.evaluate(() => { $('#motion-view').scrollTop = 260; }); await g.waitForTimeout(50);
  const plus = '#mv-gallery [data-gadd="squat"]';
  const b0 = await g.evaluate(sel => { const b = document.querySelector(sel), r = b.getBoundingClientRect(), tile = b.parentElement.querySelector('.mv-tile'); return { w: r.width, h: r.height, label: b.getAttribute('aria-label'), exp: b.getAttribute('aria-expanded'), text: b.textContent, name: tile.querySelector('.mv-tname').textContent.trim(), y: $('#motion-view').scrollTop, wy: scrollY }; }, plus);
  check(b0.w >= 44 && b0.h >= 44 && b0.label === T.add + b0.name && b0.exp === 'false' && b0.text === '+', `${lang}: «+» на плитке — 44×44, имя «${T.add}${b0.name}» (${JSON.stringify(b0)})`);
  await g.click(plus); await g.waitForTimeout(80);
  const pk = await g.evaluate(() => { const box = $('#mv-gpick'), items = [...box.querySelectorAll('.cp-pick-i')], r = box.getBoundingClientRect(); return { open: !box.hidden, head: document.getElementById(box.getAttribute('aria-labelledby'))?.textContent, first: items[0]?.dataset.cpTo, focus: document.activeElement?.dataset.cpTo, minH: Math.min(...items.map(i => i.getBoundingClientRect().height)), inside: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, exp: document.querySelector('[data-gadd="squat"]').getAttribute('aria-expanded') }; });
  check(pk.open && pk.head === T.head && pk.first === 'up' && pk.focus === 'up' && pk.minH >= 44 && pk.inside && pk.exp === 'true', `${lang}: «+» раскрывает выбор плана у нижнего края, открытый план первым (${JSON.stringify(pk)})`);
  await g.keyboard.press('Escape'); await g.waitForTimeout(50);
  check(await g.evaluate(() => $('#motion-view').open && $('#mv-gpick').hidden && document.activeElement?.dataset.gadd === 'squat'), `${lang}: Esc закрывает выбор плана, атлас открыт, фокус на «+»`);
  await g.click(plus); await g.click('#mv-gpick [data-cp-to="low"]'); await g.waitForTimeout(80);
  const done = await g.evaluate(sel => { const b = document.querySelector(sel), m = $('#mv-gmsg'); return { open: $('#motion-view').open, gallery: !$('#mv-gallery').hidden, y: $('#motion-view').scrollTop, wy: scrollY, msg: m.hidden ? '' : $('#mv-gmsg-t').textContent, go: m.querySelector('[data-cp-go]').dataset.cpGo, goText: m.querySelector('[data-cp-go]').textContent, live: $('#mv-glive').textContent, text: b.textContent, label: b.getAttribute('aria-label'), focus: document.activeElement === b, items: S.customs.find(c => c.id === 'low').items.map(i => i.id).join(), last: S.cpLast, where: [S.custom, S.mode, S.view].join(), sheet: !$('#mv-gpick').hidden }; }, plus);
  check(done.open && done.gallery && Math.abs(done.y - b0.y) <= 1 && done.wy === b0.wy && !done.sheet, `${lang}: после выбора атлас открыт, прокрутка та же (${b0.y} → ${done.y})`);
  check(done.msg === T.added && done.go === 'low' && done.goText === T.open && done.live === T.added, `${lang}: сообщение «${T.added}» с «${T.open}» (${JSON.stringify(done)})`);
  check(done.items === 'squat' && done.last === 'low' && done.where === 'up,single,plan', `${lang}: упражнение в выбранном плане, открытый план и режим прежние (${JSON.stringify(done)})`);
  check(done.text === '✓' && done.label === `${T.add}${b0.name} ${T.has}` && done.focus, `${lang}: на плитке «✓», имя называет план, фокус на ней (${done.label})`);
  /* «✓» — и у упражнений этого плана на других плитках; у остальных — «+» */
  await g.fill('#mv-gq', lang === 'ru' ? 'жим лёжа' : 'bench press');
  check(await g.evaluate(() => document.querySelector('[data-gadd="bbbench"]').textContent === '+' && !document.querySelector('[data-gadd="bbbench"]').classList.contains('in')), `${lang}: «✓» — по плану, выбранному последним («Жим штанги лёжа» есть только в первом плане)`);
  /* нажатие на плитку открывает разбор, как раньше */
  await g.click('#mv-gallery [data-gallery-open="bbbench"]'); await g.waitForTimeout(80);
  check(await g.evaluate(() => detailMotion?.it.ex.id === 'bbbench' && $('#mv-gmsg').hidden), `${lang}: плитка открывает разбор; сообщение убрано`);
  await g.click('#mv-back'); await g.waitForTimeout(80);
  /* «Открыть план» из сообщения: атлас закрыт, открыт выбранный план */
  await g.fill('#mv-gq', T.squat); await g.click('[data-gadd="smithsquat"]'); await g.click('#mv-gpick [data-cp-to="low"]');
  await g.click('#mv-gmsg [data-cp-go]'); await g.waitForTimeout(100);
  check(await g.evaluate(() => !$('#motion-view').open && S.custom === 'low' && S.mode === 'custom' && customOf().items.map(i => i.id).join() === 'squat,smithsquat'), `${lang}: «${T.open}» открывает этот план`);
  check(await g.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${lang}: без прокрутки вбок`);
  await g.close();
}

/* простые слова (замечания тестеров к 4.94.0: Ольга п. 7, Виктор п. 14, Alex п. 15–16), телефон 390×844, русская и
   английская версии: в видимом тексте карточек (с раскрытой техникой и разминкой), разбора (мышцы по фазам, «О демонстрациях»)
   и тренировки (подсказка по нагрузке, отдых) нет «1ПМ», «отказа», «БАЗОВОЕ», «ЭМГ», «изометрии», «запаса» оборотом
   «в запасе / с запасом N» и темпа числами; в английской — «1RM», «failure», «reps in reserve», «EMG», «compound»;
   под планом 1ПМ назван только после простого объяснения. Строки нагрузки во всех режимах — tools/plain-words.test.js */
{
  const JARGON = { ru: /1ПМ|отказ|базов|изолирующ|ЭМГ|региональн|изометри|в запасе|с запасом \d|выраженного жжения|двойной прогресс/i,
    en: /1RM|failure|\bcompound\b|\bisolation\b|\bEMG\b|regional emphasis|isometr|in reserve|reserve of|educational|double progression|Another option|Load cue|Go to set|no main work/i };
  const CODE = /\b\d{1,2}-\d{1,2}-[\dX]{1,2}-\d{1,2}\b/;
  for (const lang of ['ru', 'en']) {
    const g = await browser.newPage({ viewport: { width: 390, height: 844 } });
    g.on('pageerror', e => errors.push(String(e)));
    await g.goto('file://' + path.join(path.dirname(file), `lazy-gym-planner-offline-${lang}.html`)); await g.waitForTimeout(500);
    await fakeFigures(g);
    const seen = [], look = async (where, sel) => {
      const t = await g.evaluate(s => { for (const r of document.querySelectorAll(s)) r.querySelectorAll('details').forEach(d => d.open = true); return [...document.querySelectorAll(s)].map(r => r.innerText).join('\n'); }, sel);
      const j = t.match(JARGON[lang]), c = t.match(CODE);
      if (j) seen.push(`${where}: «${j[0]}» — …${t.slice(Math.max(0, j.index - 50), j.index + 50).replace(/\s+/g, ' ')}…`);
      if (c) seen.push(`${where}: темп числами «${c[0]}»`);
      return t;
    };
    /* Ольга (рельеф, новичок, дома и в зале), масса, сила в пиковую неделю, бережно с суставами */
    for (const [goal, level, place, mode, week] of [['cut', 'beg', 'gym', 'single', 1], ['cut', 'beg', 'home', 'single', 1], ['mass', 'mid', 'gym', 'single', 1], ['strength', 'adv', 'gym', 'program', 3], ['gentle', 'beg', 'gym', 'program', 4]]) {
      await g.evaluate(o => { Object.assign(S, { view: 'plan', mode: o.mode, week: o.week, day: 0, format: 'classic', goal: o.goal, level: o.level, place: o.place, adapt: null, groups: ['chest', 'back', 'quads'], count: 5, seed: 3, protect: o.goal === 'gentle' ? ['knees'] : [], customs: [], custom: null });
        ensurePlaces(S); ensureCustoms(S); LOG.data = { bbbench: [{ d: '2020-01-06', s: [[60, 10], [60, 10]] }], squat: [{ d: '2020-01-06', s: [[80, 10], [80, 10]] }] }; S.fold = { setup: true, load: true, cards: 'full' }; regen(); }, { goal, level, place, mode, week });
      await look(`${lang} ${goal}/${level}/${place}/${mode}: карточки`, '#plan .card, #plan .gentle-box, #plan .phase, #plan .week-note, #plan .wk-note');
      const legend = await g.evaluate(() => document.querySelector('#plan .legend')?.innerText || '');
      check(lang === 'ru' ? legend.startsWith('Максимум на 1 повтор (1ПМ) — вес') : legend.startsWith('One-rep max (1RM) is the weight'), `${lang}: под планом сначала простое объяснение, потом обозначение (${legend.slice(0, 50)})`);
    }
    /* разбор: жим лёжа, присед, планка — мышцы по фазам, нагрузка на суставы, источники */
    for (const id of ['bbbench', 'squat', 'plank', 'kbswing']) {
      await g.evaluate(id => { motionPrefs.muscles = true; motionPrefs.stress = true; openMotionItem(previewItem(id)); }, id); await g.waitForTimeout(80);
      await look(`${lang} разбор ${id}`, '#mv-detail');
      await g.evaluate(() => closeMotion());
    }
    /* тренировка: каждое упражнение с раскрытой подсказкой, затем отдых */
    await g.evaluate(() => { Object.assign(S, { mode: 'single', goal: 'cut', level: 'beg', place: 'gym', protect: [] }); ensurePlaces(S); LOG.data = {}; regen(); document.querySelector('#start-workout').click(); });
    await g.waitForTimeout(150);
    const n = await g.evaluate(() => workout.queue.length);
    for (let i = 0; i < n; i += 2) { await g.evaluate(i => workoutShow(i), i); await look(`${lang} тренировка #${i}`, '#wv-active'); }
    await g.evaluate(() => workoutShow(0)); await g.fill('#wv-reps', '12'); await g.click('#wv-done'); await g.waitForTimeout(80);
    await look(`${lang} отдых`, '#wv-rest');
    await g.evaluate(() => closeWorkout());
    check(!seen.length, `${lang}: простые слова в карточках, разборе и тренировке (${seen.slice(0, 3).join(' | ')})`);
    await g.close();
  }
}

/* пульсометр (14b-heart.js) на телефоне — navigator.bluetooth подменён до загрузки (addInitScript): плашка «♥ Пульс» до
   подключения, окно выбора только с датчиками пульса, живой пульс и максимум подхода, запись пульса подхода и отдыха,
   отдых «пульс или время» (кончается раньше плана) и «по пульсу» (продление на 15 с), обрыв и переподключение без окна
   выбора, нет контакта с кожей, итоги тренировки и журнал, полная копия, отключение с подтверждением; без Web Bluetooth —
   честная строка вместо кнопки */
const fakeBluetooth = () => {
  const ev = o => { const l = {}; o.addEventListener = (t, f) => { (l[t] = l[t] || []).includes(f) || l[t].push(f); }; o.removeEventListener = (t, f) => { l[t] = (l[t] || []).filter(x => x !== f); }; o.fire = (t, e) => (l[t] || []).slice().forEach(f => f(e)); return o; };
  const s = { connected: false, opts: [], connects: 0 };
  const chr = ev({ value: null, async startNotifications() {}, async stopNotifications() {} });
  const server = { async getPrimaryService(n) { if (n === 'heart_rate') return { async getCharacteristic() { return chr; } }; if (n === 'battery_service') return { async getCharacteristic() { return { async readValue() { return new DataView(Uint8Array.of(64).buffer); } }; } }; throw Object.assign(new Error('No Services matching UUID'), { name: 'NotFoundError' }); } };
  const dev = ev({ name: 'Polar H10', gatt: { get connected() { return s.connected; }, async connect() { s.connects++; s.connected = true; return server; }, disconnect() { s.connected = false; } } });
  const bt = { async requestDevice(o) { s.opts.push(o); return dev; }, async getAvailability() { return true; } };
  Object.defineProperty(navigator, 'bluetooth', { configurable: true, get: () => bt });
  /* показание: флаги 0x16 — 8 бит, контакт есть, RR; contact=false — флаги 0x14, пульс 0 */
  window.__hr = { s, push(bpm, contact = true) { chr.value = new DataView(Uint8Array.of(contact ? 0x16 : 0x14, contact ? bpm : 0, 0, 3).buffer); chr.fire('characteristicvaluechanged', { target: chr }); }, drop() { s.connected = false; dev.fire('gattserverdisconnected', { target: dev }); } };
};
{
  const h = await browser.newPage({ viewport: { width: 390, height: 844 } });
  h.on('pageerror', e => errors.push(String(e)));
  await h.addInitScript(fakeBluetooth);
  await h.goto('file://' + file); await h.waitForTimeout(500); await fakeFigures(h);
  await h.evaluate(() => {
    const base = Date.now(); window.__dt = 0; Date.now = () => base + window.__dt;
    localStorage.removeItem('podhod.heart.v1'); localStorage.removeItem('podhod.heart.prefs.v1'); HEART.days = {}; Heart.setPrefs({ rest: 'time', thr: null });
    S.customs = [{ id: 'hr', name: 'Пульс', items: [{ id: 'squat', sets: 3, kg: [60] }, { id: 'pushup', sets: 1 }] }]; S.custom = 'hr'; S.mode = 'custom'; ensureCustoms(S); openCustom('hr'); LOG.data = {}; regen();
  });
  const hs = () => h.evaluate(() => ({ st: $('#wv-hr').dataset.state, val: $('#wv-hr-val').textContent, note: $('#wv-hr-note').hidden ? '' : $('#wv-hr-note').textContent, meta: $('#wv-hr-meta').hidden ? '' : $('#wv-hr-meta').textContent,
    btn: !$('#wv-hr-btn').hidden, unit: !$('#wv-hr-unit').hidden, rest: !$('#wv-hr-rest').hidden && $('#wv-hr-rest-val').textContent, rnote: $('#wv-hr-rest-note').textContent, day: HEART.days[todayKey()] && JSON.parse(JSON.stringify(HEART.days[todayKey()])) }));
  const push = bpm => h.evaluate(b => { window.__dt += 1000; window.__hr.push(b); workoutTick(); }, bpm);
  await h.click('#start-workout'); await h.waitForTimeout(50);
  let s = await hs();
  check(s.st === 'idle' && s.btn && s.val === 'Пульс' && s.note === 'Часы или нагрудный датчик по Bluetooth' && await shown(h, '#wv-hr-btn'), `пульс: до подключения — плашка «♥ Пульс» (${JSON.stringify(s)})`);
  check(apart(await rect(h, '#wv-hr-btn'), await rect(h, '#wv-close')) && (await rect(h, '#wv-hr')).r <= 390, 'плашка пульса не наезжает на «К плану» и не выходит за экран');
  await h.click('#wv-hr-btn'); await h.waitForTimeout(50);
  s = await hs();
  check(await h.evaluate(() => JSON.stringify(window.__hr.s.opts[0]) === JSON.stringify({ filters: [{ services: ['heart_rate'] }], optionalServices: ['battery_service'] })) && s.st === 'waiting' && s.val === '—' && /Polar H10/.test(s.note), `окно выбора — только датчики пульса; подключено, ждём пульс (${JSON.stringify(s)})`);
  await push(131); await push(152); await push(149);
  s = await hs();
  check(s.st === 'live' && s.val === '149' && s.unit && /^макс\. за подход 152 · Polar H10 · батарея 64 %$/.test(s.meta), `живой пульс крупно, максимум подхода, батарея (${JSON.stringify(s)})`);
  await h.fill('#wv-kg', '60'); await h.fill('#wv-reps', '8'); await h.click('#wv-done');
  s = await hs();
  check(JSON.stringify(s.day?.sets) === '{"squat:0":[149,152]}' && s.day.max === 152 && s.day.t >= 2, `подход: пульс в конце и максимум записаны (${JSON.stringify(s.day)})`);
  check(s.rest === '149' && s.rnote === 'В начале отдыха 149' && await shown(h, '#wv-hr-rest') && await shown(h, '#wv-hr-set'), `отдых: пульс крупно, «в начале отдыха», настройка конца отдыха (${JSON.stringify(s)})`);
  check(await h.evaluate(() => [...document.querySelectorAll('[data-hr-rest]')].map(b => b.textContent + ':' + b.getAttribute('aria-pressed')).join() === 'Время:true,Пульс:false,Пульс или время:false' && $('.wv-hr-thr').hidden && /не медицинское измерение/.test($('#wv-hr-set').textContent)), 'по умолчанию отдых по времени, порога нет, строка «не медицинское измерение»');
  /* «пульс или время»: порог 110 — отдых кончается раньше плана, когда пульс ниже порога два показания подряд */
  await h.click('[data-hr-rest="first"]'); await h.fill('#wv-hr-thr', '110');
  check(await h.evaluate(() => JSON.stringify(Heart.prefs()) === '{"rest":"first","thr":110}' && JSON.parse(localStorage.getItem('podhod.heart.prefs.v1')).thr === 110), 'выбор «Пульс или время» и порог запоминаются');
  await push(126); s = await hs();
  check(s.rnote === 'Отдых до пульса ниже 110 · в начале отдыха 149' && await h.evaluate(() => !$('#workout-view').classList.contains('rest-over')), `отдых до пульса: подпись (${s.rnote})`);
  await push(108); await push(104); await h.evaluate(() => { window.__dt += 300; workoutTick(); });
  s = await hs();
  const r1 = await h.evaluate(() => ({ h: $('#wv-rest-heading').textContent, red: $('#workout-view').classList.contains('rest-over'), done: !$('#wv-rest-done').hidden, end: RestAlarm.state().end, left: workout.restUntil - Date.now() }));
  check(r1.h === 'Можно продолжать' && !r1.red && r1.done && r1.left <= 0 && s.rnote === 'Пульс ниже 110 — можно к подходу · в начале отдыха 149', `пульс ниже порога — отдых кончился раньше плана (${JSON.stringify(r1)}, ${s.rnote})`);
  await h.click('#wv-continue');
  s = await hs();
  check(JSON.stringify(s.day.rests) === '{"squat:0":[149,104]}', `отдых: пульс в начале и в конце записан (${JSON.stringify(s.day.rests)})`);
  /* «по пульсу»: к концу плана пульс выше порога — отдых продлевается на 15 с, сигнал переносится */
  await h.fill('#wv-reps', '8'); /* второй подход: вес подставлен из первого */
  await h.click('#wv-done');
  await h.click('[data-hr-rest="hr"]');
  const until = await h.evaluate(() => workout.restUntil);
  await h.evaluate(() => { window.__dt = workout.restUntil - Date.now() + window.__dt - 600; window.__hr.push(124); workoutTick(); });
  s = await hs();
  const r2 = await h.evaluate(() => ({ until: workout.restUntil, end: RestAlarm.state().end, red: $('#workout-view').classList.contains('rest-over'), t: $('#wv-rest-time').textContent }));
  check(r2.until === until + 15000 && r2.end === r2.until && !r2.red && r2.t === '0:16' && /^Пульс выше 110 — отдых продлён на 15 с/.test(s.rnote), `«по пульсу»: пульс выше порога к концу плана — +15 с (${JSON.stringify(r2)}, ${s.rnote})`);
  /* обрыв: переподключение к тому же устройству без окна выбора */
  await h.evaluate(() => window.__hr.drop());
  s = await hs();
  check(s.st === 'reconnecting' && s.note === 'Связь прервалась — переподключаюсь, попытка 1 из 5' && s.val === '…' && s.rest === '—', `обрыв: «переподключаюсь» (${JSON.stringify(s)})`);
  await h.waitForFunction(() => Heart.state().client.state === 'waiting', null, { timeout: 5000, polling: 50 }).catch(() => {});
  await push(118); s = await hs();
  check(s.st === 'live' && s.val === '118' && await h.evaluate(() => window.__hr.s.opts.length === 1 && window.__hr.s.connects === 2), `переподключился сам, без нового окна выбора (${JSON.stringify(s)})`);
  await h.evaluate(() => { window.__dt += 1000; window.__hr.push(0, false); });
  s = await hs();
  check(s.st === 'nocontact' && s.val === '—' && s.note === 'Нет контакта с кожей — поправьте ремешок или датчик', `нет контакта с кожей (${JSON.stringify(s)})`);
  await push(112);
  /* итоги и журнал: средний и максимальный пульс */
  await h.evaluate(() => workoutFinish());
  const fin = await h.evaluate(() => ({ t: $('#wv-hr-finish-t').textContent, shown: !$('#wv-hr-finish').hidden, sum: hrSummary(HEART.days[todayKey()]) }));
  check(fin.shown && fin.t === `Пульс за тренировку: средний ${fin.sum.avg}, максимальный 152.` && fin.sum.avg > 100 && fin.sum.avg < 152, `итоги тренировки: средний и максимальный пульс (${JSON.stringify(fin)})`);
  /* отключение — с подтверждением */
  await h.click('#wv-hr-btn'); s = await hs();
  check(s.st === 'armed' && s.val === 'Отключить?' && await h.evaluate(() => Heart.state().client.state === 'live'), 'первое нажатие по плашке — «Отключить?»');
  await h.click('#wv-hr-btn'); s = await hs();
  check(s.st === 'off' && s.note === 'Пульсометр отключён.' && s.val === 'Пульс', `второе — отключает (${JSON.stringify(s)})`);
  await h.evaluate(() => { closeWorkout(); S.view = 'journal'; renderSetup(); renderPlan(); });
  const j = await h.evaluate(() => document.querySelector('.j-days .j-hr')?.textContent);
  check(j === `♥ ср. ${fin.sum.avg} · макс. 152`, `журнал: пульс тренировки за день (${j})`);
  check(await h.evaluate(() => { const b = backupObject(); return !!b.heart.days[todayKey()].sets['squat:0'] && b.heart.prefs.rest === 'hr'; }), 'пульс и настройки — в полной копии');
  await h.close();
  /* без Web Bluetooth (iPhone, Safari, Firefox): честная строка там же, без кнопки и без настройки отдыха по пульсу */
  const n = await browser.newPage({ viewport: { width: 390, height: 844 } });
  n.on('pageerror', e => errors.push(String(e)));
  await n.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'bluetooth', { configurable: true, get: () => undefined }); try { delete navigator.bluetooth; } catch (e) {} });
  await n.goto('file://' + file); await n.waitForTimeout(500); await fakeFigures(n);
  await n.evaluate(() => { S.mode = 'single'; regen(); }); await n.click('#start-workout'); await n.waitForTimeout(50);
  const u = await n.evaluate(() => ({ line: $('#wv-hr-line-t').textContent, shown: !$('#wv-hr-line').hidden, btn: !$('#wv-hr-btn').hidden, set: !$('#wv-hr-set').hidden, st: $('#wv-hr').dataset.state }));
  check(u.shown && !u.btn && !u.set && u.st === 'unsupported' && u.line === 'Пульсометр работает в Chrome и Edge на Android и компьютере.', `без Web Bluetooth — честная строка вместо кнопки (${JSON.stringify(u)})`);
  await n.close();
}

/* язык и фунты (src/lang.js, 13-log.js: единицы) на телефоне 390×844, PWA по http: новый посетитель с en-US на корне сайта
   попадает в /en/ (путь, запрос и якорь сохранены), вес — в фунтах (поле, подсказка, журнал), калькулятор блинов — гриф 45 lb
   и блины в фунтах, тренировка — в фунтах; переключатель RU запоминается (корень больше не уводит на английский), явная
   ссылка на /en/ меняет выбор обратно; русский браузер остаётся на корне; планы и места, созданные в русской версии, в
   английской — без кириллицы; в офлайн-файле (его же встраивает Floot) адрес не меняется */
{
  const dist = path.dirname(file), types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.bin': 'application/octet-stream', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    let u = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (u.endsWith('/')) u += 'index.html';
    const f = path.join(dist, u); if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/`, CYR = /[А-Яа-яЁё]/;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US', serviceWorkers: 'block' });
  const p = await ctx.newPage(); p.on('pageerror', e => errors.push(String(e)));
  const ready = async () => { await p.waitForFunction(() => typeof S === 'object' && document.querySelector('#plan .card, #plan .empty'), null, { timeout: 30000 }); await fakeFigures(p); };
  await p.goto(base + '?from=home#plan'); await p.waitForURL(/\/en\//, { timeout: 15000 }).catch(() => {}); await ready();
  const at = new URL(p.url());
  check(at.pathname === '/en/' && at.search === '?from=home' && at.hash === '#plan' && await p.evaluate(() => document.documentElement.lang === 'en' && window.PODHOD_LANG === 'en'), `en-US на корне → /en/ с запросом и якорем (${p.url()})`);
  check(await p.evaluate(() => localStorage.getItem('podhod.lang') === 'en' && wu() === 'lb' && S.units == null), 'выбор en запомнен, фунты — по региону en-US, не по сохранённой настройке');
  /* вес в фунтах в карточке: подпись столбца, ввод 135 → в журнале 61,23 кг, в поле снова 135 */
  await p.evaluate(() => { Object.assign(S, { view: 'plan', mode: 'single', format: 'classic', goal: 'mass', level: 'mid', groups: ['chest', 'back', 'shoulders'], count: 5, seed: 3, fold: null }); LOG.data = {}; regen(); });
  const id = await p.evaluate(() => (plan.items.find(it => (it.eqIds || []).includes('bb')) || plan.items.find(it => loadType(it.ex) === 'kg')).ex.id);
  const card = `.card[data-ex="${id}"]`;
  await p.click(`${card} [data-cfold="log"]`);
  const head = await p.evaluate(s => document.querySelector(s + ' .lt-h span[title]')?.textContent || '', card);
  await p.fill(`${card} .lt-r[data-k="0"] [data-f="kg"]`, '135'); await p.fill(`${card} .lt-r[data-k="0"] [data-f="reps"]`, '8');
  await p.click(`${card} [data-tick][data-k="0"]`); await p.waitForTimeout(150);
  const logged = await p.evaluate(i => ({ kg: todaySession(i, false)?.s[0]?.[0], shown: document.querySelector(`.card[data-ex="${i}"] .lt-r[data-k="0"] [data-f="kg"]`).value }), id);
  check(/lb/.test(head) && Math.abs(logged.kg - 61.235) < 0.01 && logged.shown === '135', `карточка в фунтах: «${head}», 135 lb хранится как ${logged.kg} кг и показывается ${logged.shown}`);
  /* калькулятор блинов: гриф 45 lb, блины в фунтах; настройка — в фунтах */
  const warm = await p.evaluate(i => { const it = plan.items.find(x => x.ex.id === i); return warmupHtml({ ...it, eqIds: ['bb', 'bench'] }, parseKg('225')); }, id);
  check(/Warm-up for 225 lb/.test(warm) && /Bar 45 lb, plates: 45 · 35 · 25 · 10 · 5 · 2\.5/.test(warm) && /pl-lb45/.test(warm), 'разминка и блины в фунтах: гриф 45 lb, 45 + 45 на сторону для 225 lb');
  await p.evaluate(() => openGear()); await p.waitForTimeout(80);
  check(await p.evaluate(() => /lb/.test(document.querySelector('#gear-view label').textContent) && document.querySelector('#gear-bar').value === '45'), 'настройка «Bar and plates»: вес грифа в фунтах, 45');
  await p.evaluate(() => document.querySelector('#gear-view').close());
  /* тренировка: подпись поля и прошлый раз — в фунтах */
  await p.click('#start-workout'); await p.waitForTimeout(250);
  const wv = await p.evaluate(() => ({ cap: $('#wv-weight-caption').textContent, hidden: $('#wv-weight-label').hidden }));
  check(wv.hidden || /lb/.test(wv.cap), `экран тренировки: «${wv.cap}»`);
  await p.evaluate(() => closeWorkout());
  /* журнал: переключатель единиц, 135 lb; кг — и запись та же, 61,23 */
  await p.evaluate(() => { S.view = 'journal'; renderSetup(); renderPlan(); });
  const j = await p.evaluate(() => ({ on: document.querySelector('[data-units="lb"]')?.getAttribute('aria-pressed'), text: document.querySelector('.j-list')?.textContent || '' }));
  await p.click('[data-units="kg"]');
  const jk = await p.evaluate(() => ({ units: S.units, text: document.querySelector('.j-list')?.textContent || '' }));
  check(j.on === 'true' && /135\s*lb/.test(j.text) && jk.units === 'kg' && /61\.23\s*kg/.test(jk.text), `журнал: единицы lb → kg (${j.text.slice(0, 60)} → ${jk.text.slice(0, 60)})`);
  await p.click('[data-units="lb"]');
  /* переключатель RU: выбор запоминается до перехода, корень больше не уводит на английский */
  await p.evaluate(() => { S.view = 'plan'; regen(); });
  await Promise.all([p.waitForURL(u => new URL(u).pathname === '/', { timeout: 15000 }), p.click('a.lang')]); await ready();
  check(await p.evaluate(() => localStorage.getItem('podhod.lang') === 'ru' && document.documentElement.lang === 'ru'), 'RU-переключатель: открыта русская версия, выбор ru запомнен');
  await p.goto(base); await p.waitForTimeout(400); await ready();
  check(new URL(p.url()).pathname === '/' && await p.evaluate(() => window.PODHOD_LANG === 'ru'), 'после выбора RU корень с en-US открывает русскую версию, без возврата на английский');
  /* в русской версии создаются план и место по умолчанию, неделя сохраняется в свои планы */
  await p.evaluate(() => { Object.assign(S, { mode: 'program', days: 3, split: 'full', week: 2 }); regen(); document.querySelector('#save-plan')?.click(); });
  /* кнопки «+ Место» и «+ План» — нажатием в документе: на телефоне параметры могут быть свёрнуты */
  await p.evaluate(() => document.querySelector('[data-place-add]').click()); await p.waitForTimeout(100);
  await p.evaluate(() => { openCustom(S.customs[0].id); regen(); document.querySelector('[data-cp-new]').click(); }); await p.waitForTimeout(100);
  const ruNames = await p.evaluate(() => ({ plans: S.customs.map(c => c.name), places: S.places.map(x => x.name) }));
  check(ruNames.plans.includes('Мой план') && ruNames.plans.some(n => /^План \d/.test(n)) && ruNames.plans.some(n => /^Пн · /.test(n)) && ruNames.places.includes('Зал') && ruNames.places.some(n => /^Место \d/.test(n)), `в русской версии — имена по умолчанию: ${ruNames.plans.join(', ')}; ${ruNames.places.join(', ')}`);
  /* явная ссылка на /en/ — снова английский; имена по умолчанию — по-английски */
  await p.goto(base + 'en/'); await ready();
  await p.evaluate(() => { S.view = 'plan'; openCustom(S.customs[0].id); S.place = 'gym'; ensurePlaces(S); regen(); document.querySelectorAll('.cp-about').forEach(d => d.open = true); });
  const enText = await p.evaluate(() => [...document.querySelectorAll('#e-places, #f-custom-body, #e-place-tools, #plan .p-head')].map(n => n.textContent).join(' | ') + ' | ' + [...document.querySelectorAll('#f-custom-body input, #e-place-tools input, #place-adapt option')].map(i => i.value || i.textContent).join(' | '));
  check(!CYR.test(enText) && /My plan/.test(enText) && /Plan \d/.test(enText) && /Mon · Full body/.test(enText) && /Gym/.test(enText) && /Place \d/.test(enText), `данные из русской версии в английской без кириллицы: ${enText.replace(/\s+/g, ' ').slice(0, 300)}`);
  check(await p.evaluate(() => localStorage.getItem('podhod.lang') === 'en'), 'ссылка на /en/ вернула выбор en');
  await p.goto(base); await p.waitForURL(/\/en\//, { timeout: 15000 }).catch(() => {});
  check(new URL(p.url()).pathname === '/en/', 'и корень снова открывает английскую версию');
  await ctx.close();
  /* русский браузер: корень остаётся русским; русский вторым языком — тоже */
  for (const locale of ['ru-RU', 'de-DE']) {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, locale, serviceWorkers: 'block' }), q = await c2.newPage();
    q.on('pageerror', e => errors.push(String(e)));
    await q.goto(base); await q.waitForTimeout(600);
    const path0 = new URL(q.url()).pathname;
    check(locale === 'ru-RU' ? path0 === '/' : path0 === '/en/', `браузер ${locale}: ${path0}`);
    await c2.close();
  }
  srv.close();
  /* офлайн-файл (и сборка Floot, которая его встраивает): без выбора языка при заходе — адрес не меняется */
  const off = await browser.newPage({ locale: 'en-US' }); off.on('pageerror', e => errors.push(String(e)));
  await off.goto('file://' + path.join(dist, 'lazy-gym-planner-offline-ru.html')); await off.waitForTimeout(500);
  check(off.url().endsWith('lazy-gym-planner-offline-ru.html') && !fs.readFileSync(path.join(dist, 'lazy-gym-planner-offline-ru.html'), 'utf8').includes('PODHOD_LANGS') && !fs.readFileSync(path.join(dist, 'lazy-gym-planner-offline-en.html'), 'utf8').includes('PODHOD_LANGS'), 'офлайн-файлы без переадресации языка (Floot)');
  await off.close();
}

/* компьютер: параметры в боковой колонке не сворачиваются */
const desk = await open(1280);
await desk.evaluate(() => { S.fold.setup = true; regen(); });
check(await shown(desk, '#f-goal') && !(await shown(desk, '#setup-bar')) && !(await shown(desk, '#setup-fold-end')), 'на компьютере параметры всегда раскрыты');
await desk.close();

await browser.close();
if (errors.length) console.error('Ошибки страницы:\n' + [...new Set(errors)].slice(0, 10).join('\n'));
if (fails.length || errors.length) { console.error(`Проверка интерфейса: ${fails.length} замечаний`); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); }
console.log('Интерфейс: мастер первого запуска (шаги, «Назад» кнопкой, Esc и системной «Назад», «Пропустить», повторный вход, данные прежних версий), время на тренировку в параметрах, сворачивание блоков, хваты, «Заменить» со списком и «Вернуть», «Убрать» с «Вернуть», «+ В свой план» с выбором плана (и на странице своего плана), поиск витрины (ё = е, второй язык, синонимы, пусто) и «+» на плитке с выбором плана и «✓», поиск в «Добавить упражнение», бережный режим, порядок упражнений, сигнал отдыха, тренировка (экран не гаснет, отдых сверх нуля, таймер удержания), витрина атласа (в «Анатомии» и «Манекене» — кадры из общего рендерера, кеш между сеансами, без WebGL — SVG), виды фигуры «Анатомия», «Скелет» и «Манекен» (кожа Anny в карточках и витрине, без её данных — SVG), анатомия в карточках плана и на экране тренировки (откат на манекен, без WebGL — SVG), свободная камера сцены (поворот на воспроизведении, колесо, кнопки ракурсов, двойной щелчок, клавиатура, касания на телефоне), первый экран и разбор на телефоне, карточка, число подходов («−» с подтверждением в строке, «+»), вес на следующие подходы, вопрос о неправдоподобном весе, «Сегодня: N из M», пирамида повторов, журнал, вес гантелей, Л/П и общий вес, загрузка мышц и тренировка по журналу, счётчик оборудования, панель замера скорости ?perf, выбор языка при заходе и его запоминание, фунты в карточке, тренировке, разминке и журнале, имена по умолчанию из русской версии в английской работают на телефоне и компьютере.');
