/* Проверка доступности в браузере: крупный шрифт и масштаб, контраст, диктор (отчёт тестера «Виктор Петрович», выпуск 4.98).
   node tools/a11y-check.mjs [--file dist/lazy-gym-planner-offline-ru.html] — нужен собранный dist/ (npm run build).
   1. Переразметка (WCAG 1.4.4, 1.4.10): шрифт 150 и 200 % (html{font-size}) при ширине 390 и 320 px и масштаб страницы
      150 и 200 % (окно 260 и 195 px) — план, атлас мышц, журнал, разбор движения, тренировка и отдых: нет прокрутки вбок,
      ничего не выходит за край, строки текста не налезают друг на друга, текст не обрезан. При обычном шрифте подписи
      не мельче 12 px (кроме фазы под миниатюрой на телефоне — 11 px, см. 39-big-text.css).
   2. Контраст (WCAG 1.4.3, 1.4.11): токены цвета текста на фонах — по формуле WCAG из вычисленных стилей — и весь видимый
      текст плана, атласа и разбора в светлой и тёмной теме.
   3. Диктор: у #plan нет живой области, пересборка объявляется коротко в #plan-status, подписи фаз анимации — вне живых
      областей; имя кнопки содержит её видимую надпись (WCAG 2.5.3), одинаковые кнопки карточек различаются упражнением;
      конец отдыха объявляется «Можно продолжать».
   4. «Пиковая нагрузка» в карточке раскрывается кнопкой (aria-expanded) — тот же текст, что в разборе движения.
   Плашка пульса (14b-heart.js) — с подменой Web Bluetooth, чтобы её раскладка и имя кнопки тоже проверялись.
   5. «0 из 21 подхода»; «легче · тяжелее» — цели не меньше 24×24 px (WCAG 2.5.8); на экране отдыха при масштабе 150 %
      таймер виден, когда фокус на «Перейти к подходу».
   6. Атлас движений: «+» на плитке — имя «Добавить в план: …», цель 44×44; выбор плана и сообщение «Добавлено в …» —
      имена, раскладка, контраст (обычный и крупный шрифт, тёмная тема).
   7. Мастер первого запуска: каждый шаг — раскладка при крупном шрифте и масштабе, контраст в обеих темах, имена кнопок,
      фокус на заголовке шага. */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fileArg = process.argv.indexOf('--file'), file = fileArg > 0 ? path.resolve(process.argv[fileArg + 1]) : path.join(root, 'dist/lazy-gym-planner-offline-ru.html');
if (!fs.existsSync(file)) { console.error('Нет собранного файла — сначала npm run build'); process.exit(2); }

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const fails = [], errors = [];
const check = (ok, what) => { if (!ok) fails.push(what); };

/* страница: рисунки движений — заглушки (проверяется раскладка и текст, а не фигура) */
async function open({ width, height = Math.round(width * 844 / 390), font = 100, theme = 'light', firstRun = false }) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, colorScheme: theme, reducedMotion: 'reduce' });
  /* Web Bluetooth есть (подмена): на экране тренировки и отдыха видна плашка «♥ Пульс» и настройка конца отдыха (14b-heart.js) */
  await ctx.addInitScript(() => { const bt = { async requestDevice() { throw Object.assign(new Error('отмена'), { name: 'NotFoundError' }); }, async getAvailability() { return true; } }; Object.defineProperty(navigator, 'bluetooth', { configurable: true, get: () => bt }); });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + file); await page.waitForTimeout(300);
  if (font !== 100) await page.addStyleTag({ content: `html{font-size:${font}%}` });
  /* мастер первого запуска (новый контекст — первый запуск): проверяется отдельно (7); для остальных экранов закрывается без ответов */
  if (firstRun) return { ctx, page };
  await page.evaluate(() => {
    firstRunClose();
    const fake = () => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'fig'); return { svg, camera: 'side', at() {}, setTrace() {}, setVectors() {}, setJoints() {}, setStress() {}, setMuscles() {}, setRegion() {}, dispose() {} }; };
    window.buildFigure = fake; window.createMotionFigure = fake;
    if (window.GymVolume) window.GymVolume.cards = () => null;
    Object.assign(S, { view: 'plan', mode: 'single', format: 'classic', goal: 'mass', level: 'mid', groups: ['chest', 'back', 'shoulders'], count: 6, seed: 3, fold: null, dur: null });
    LOG.data = {}; regen(); scrollTo(0, 0);
  });
  await page.waitForTimeout(100);
  return { ctx, page };
}

/* экраны по очереди на одной странице */
const SCREENS = {
  plan: p => p.evaluate(() => { S.view = 'plan'; regen(); scrollTo(0, 0); }),
  atlas: p => p.evaluate(() => { S.view = 'atlas'; S.atlasM = 'chest'; regen(); scrollTo(0, 0); }),
  journal: p => p.evaluate(() => {
    const d = n => dayKey(new Date(Date.now() - n * 864e5));
    LOG.data = { dbcurl: [{ d: d(9), s: [[5, 12], [5, 12]] }, { d: d(5), s: [[5, 13]] }, { d: d(2), s: [[5, 15], [5, 14]] }], bbbench: [{ d: d(3), s: [[60, 8], [60, 8], [62.5, 6]] }] };
    S.view = 'journal'; renderSetup(); renderPlan(); scrollTo(0, 0);
  }),
  detail: p => p.evaluate(() => { LOG.data = {}; S.view = 'plan'; regen(); openMotion(0); }),
  workout: p => p.evaluate(() => { closeMotion(); document.querySelector('#start-workout').click(); }),
  rest: async p => {
    await p.fill('#wv-reps', '10'); await p.fill('#wv-kg', '20').catch(() => {});
    await p.click('#wv-done'); await p.waitForTimeout(50);
    if (await p.evaluate(() => !document.querySelector('#wv-kg-ask').hidden)) await p.click('#wv-kg-yes');
    await p.focus('#wv-continue');
  },
};

/* раскладка в странице: прокрутка вбок, выход за край, наложение строк текста, обрезанный текст */
const LAYOUT = () => {
  const vw = document.documentElement.clientWidth, dlg = document.querySelector('dialog[open]'), top = dlg || document.body, out = [];
  if (document.documentElement.scrollWidth > vw + 1) out.push(`прокрутка вбок: ширина ${document.documentElement.scrollWidth} при окне ${vw}`);
  if (dlg && dlg.scrollWidth > dlg.clientWidth + 1) out.push(`прокрутка вбок в окне ${dlg.id}: ${dlg.scrollWidth} > ${dlg.clientWidth}`);
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (!e.checkVisibility || e.checkVisibility({ visibilityProperty: true, opacityProperty: true })) && !e.closest('[aria-hidden=true]'); };
  const desc = e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : ''} «${(e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 28)}»`;
  const clipsX = a => /(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX);
  const inScroller = e => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (clipsX(a)) return true; return false; };
  const pinned = e => { for (let a = e; a; a = a.parentElement) { const ps = getComputedStyle(a).position; if (ps === 'sticky' || ps === 'fixed') return a.tagName !== 'DIALOG'; } return false; };
  for (const e of top.querySelectorAll('*')) {
    if (e.closest('svg') && e.tagName !== 'svg' || e.closest('.vh') || !vis(e)) continue;
    const r = e.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !inScroller(e)) out.push(`за краем экрана: ${desc(e)} [${Math.round(r.left)}…${Math.round(r.right)}]`);
    const cs = getComputedStyle(e);
    if ((/(hidden|clip)/.test(cs.overflowX + cs.overflowY) || cs.textOverflow === 'ellipsis') && e.tagName !== 'svg' && e.clientWidth > 0
      && ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || e.querySelector('b,span,small,strong,em'))
      && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 3)) out.push(`текст обрезан: ${desc(e)} ${e.scrollWidth}×${e.scrollHeight} > ${e.clientWidth}×${e.clientHeight}`);
  }
  /* строки текста разных элементов не налезают друг на друга (видимая часть — с учётом прокручиваемых предков) */
  const boxes = [], tw = document.createTreeWalker(top, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const p = n.parentElement;
    if (!n.textContent.trim() || !p || p.closest('svg,script,style,[aria-hidden=true],option,select,.vh') || !vis(p) || pinned(p)) continue;
    let clip = null;
    for (let a = p; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a); if (!/(auto|scroll|hidden|clip)/.test(cs.overflowX + cs.overflowY)) continue;
      const q = a.getBoundingClientRect(); clip = clip ? { l: Math.max(clip.l, q.left), t: Math.max(clip.t, q.top), r: Math.min(clip.r, q.right), b: Math.min(clip.b, q.bottom) } : { l: q.left, t: q.top, r: q.right, b: q.bottom };
    }
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const q of rg.getClientRects()) {
      let r = { l: q.left, t: q.top, r: q.right, b: q.bottom };
      if (clip) r = { l: Math.max(r.l, clip.l), t: Math.max(r.t, clip.t), r: Math.min(r.r, clip.r), b: Math.min(r.b, clip.b) };
      if (r.r - r.l > 1 && r.b - r.t > 1) boxes.push({ ...r, h: r.b - r.t, p, t: n.textContent.trim().slice(0, 24) });
    }
  }
  boxes.sort((a, b) => a.t - b.t);
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length && boxes[j].t < boxes[i].b; j++) {
    const a = boxes[i], b = boxes[j]; if (a.p === b.p) continue;
    const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l), iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    if (ix > 2 && iy > Math.min(a.h, b.h) * .35) out.push(`текст налезает: «${a.t}» и «${b.t}» (${desc(a.p)} / ${desc(b.p)})`);
  }
  return [...new Set(out)].slice(0, 8);
};

/* контраст по WCAG: цвета — из вычисленных стилей; фон — первый непрозрачный у предков (с наложением полупрозрачных) */
const CONTRAST = () => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
  const bgOf = el => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } }
    let bg = parse(getComputedStyle(document.body).backgroundColor);
    for (let i = stack.length - 1; i >= 0; i--) bg = stack[i].a >= 1 ? stack[i] : blend(stack[i], bg);
    return bg;
  };
  const tokens = {};
  const probe = document.createElement('div'); document.body.append(probe);
  const col = v => { probe.style.color = `var(${v})`; return parse(getComputedStyle(probe).color); };
  const TEXT = ['--ink', '--muted', '--faint', '--accent', '--hot', '--good', '--warn-ink'], BG = ['--bg', '--surface', '--surface-2', '--illus'];
  const pairs = [...TEXT.flatMap(t => BG.map(b => [t, b, 4.5])), ['--accent-ink', '--accent', 4.5], ['--warn-ink', '--warn-bg', 4.5], ['--hot', '--hot-soft', 4.5], ['--good', '--good-soft', 4.5],
    ['--ink', '--accent-soft', 4.5], ['--muted', '--accent-soft', 4.5], ['--faint', '--accent-soft', 4.5], ['--ink', '--hot-soft', 4.5], ['--muted', '--hot-soft', 4.5], ['--ink', '--mus-soft', 4.5], ['--muted', '--warn-bg', 4.5]];
  for (const [t, b, need] of pairs) { const r = ratio(col(t), col(b)); tokens[`${t} на ${b}`] = [Math.round(r * 100) / 100, need]; }
  probe.remove();
  /* весь видимый текст (кроме выключенных кнопок — WCAG их не требует) */
  const low = [], seen = new Set(), dlg = document.querySelector('dialog[open]');
  const tw = document.createTreeWalker(dlg || document.body, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const t = n.textContent.trim(), el = n.parentElement; if (!t || !el || el.closest('svg,script,style,.vh,option,[disabled],[aria-disabled=true]') || el.closest('label')?.querySelector('input:disabled')) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true, opacityProperty: true }))) continue;
    const cs = getComputedStyle(el), fg0 = parse(cs.color), bg = bgOf(el); if (!fg0 || !bg) continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
    const k = ratio(blend({ ...fg0, a: fg0.a * op }, bg), bg), fs = parseFloat(cs.fontSize), large = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700);
    if (k < (large ? 3 : 4.5) - .005) { const key = t.slice(0, 30) + cs.color; if (!seen.has(key)) { seen.add(key); low.push(`«${t.slice(0, 30)}» ${Math.round(k * 100) / 100}:1 (${el.tagName.toLowerCase()}.${typeof el.className === 'string' ? el.className.split(' ')[0] : ''})`); } }
  }
  return { tokens, low: low.slice(0, 10) };
};

/* имя кнопки (упрощённый расчёт по aria-labelledby, aria-label и тексту) против её видимой надписи */
const NAMES = () => {
  /* сравнение без пробелов: на границах элементов (<b>…</b><small>…</small>) пробелы в имени ставит браузер */
  const norm = s => s.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, '');
  const nameOf = b => {
    if (b.hasAttribute('aria-labelledby')) return b.getAttribute('aria-labelledby').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ');
    if (b.getAttribute('aria-label')) return b.getAttribute('aria-label');
    let s = ''; const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) if (!n.parentElement.closest('[aria-hidden=true]')) s += n.textContent; return s;
  };
  /* видимые надписи кнопки по элементам («Изометрия · 5 ракурсов» и «Увеличить ↗» — две): каждая должна быть в имени */
  const visibleText = b => {
    const parts = new Map(), tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) { const p = n.parentElement; if (p.closest('.vh') || (p.checkVisibility && !p.checkVisibility({ visibilityProperty: true }))) continue; parts.set(p, (parts.get(p) || '') + n.textContent); }
    return [...parts.values()].map(norm).filter(Boolean);
  };
  const bad = [], dlg = document.querySelector('dialog[open]');
  for (const b of (dlg || document).querySelectorAll('button, [role=button], a[href]')) {
    if (!b.getClientRects().length || (b.checkVisibility && !b.checkVisibility({ visibilityProperty: true }))) continue;
    const v = visibleText(b), name = norm(nameOf(b));
    for (const x of v) if (!name.includes(x)) bad.push(`«${x}» → имя «${name.slice(0, 60)}»`);
  }
  return [...new Set(bad)].slice(0, 10);
};

/* 1. Переразметка: шрифт 150/200 % и масштаб 150/200 % */
for (const cfg of [{ width: 390, font: 150 }, { width: 390, font: 200 }, { width: 320, font: 150 }, { width: 320, font: 200 }, { width: 260 }, { width: 195 }]) {
  const tag = cfg.font ? `шрифт ${cfg.font} %, ${cfg.width} px` : `масштаб ${Math.round(390 / cfg.width * 100)} % (${cfg.width} px)`;
  const { ctx, page } = await open(cfg);
  for (const [name, go] of Object.entries(SCREENS)) {
    await go(page); await page.waitForTimeout(80);
    const bad = await page.evaluate(LAYOUT);
    check(!bad.length, `${tag}, ${name}: ${bad.join('; ')}`);
  }
  await ctx.close();
}

/* при обычном шрифте подписи не мельче 12 px */
{
  const { ctx, page } = await open({ width: 390 });
  const small = await page.evaluate(() => {
    const out = new Set(), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const el = n.parentElement; if (!n.textContent.trim() || !el || el.closest('svg,script,style,.vh') || !el.getClientRects().length) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > 0 && fs < 12 - .01 && !el.closest('.c-top .motion-caption')) out.add(`«${n.textContent.trim().slice(0, 24)}» ${fs}px`);
    }
    return [...out].slice(0, 8);
  });
  check(!small.length, `при обычном шрифте подписи не мельче 12 px: ${small.join(', ')}`);
  await ctx.close();
}

/* 2. Контраст: токены и весь видимый текст в обеих темах */
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open({ width: 390, theme });
  await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
  for (const screen of ['plan', 'atlas', 'detail']) {
    await SCREENS[screen](page); await page.waitForTimeout(80);
    if (screen === 'detail') await page.evaluate(() => document.querySelector('#mv-cameras button')?.click());
    const { tokens, low } = await page.evaluate(CONTRAST);
    if (screen === 'plan') for (const [k, [r, need]] of Object.entries(tokens)) check(r >= need, `контраст (${theme}): ${k} — ${r}:1, нужно ${need}:1`);
    check(!low.length, `контраст текста (${theme}, ${screen}): ${low.join('; ')}`);
  }
  await ctx.close();
}

/* 3–5. Диктор, «Пиковая нагрузка», склонение, цели, отдых */
{
  const { ctx, page } = await open({ width: 390 });
  const live = await page.evaluate(() => ({
    plan: document.querySelector('#plan').getAttribute('aria-live'), status: document.querySelector('#plan-status')?.getAttribute('role'),
    caps: [...document.querySelectorAll('.motion-caption, #mv-phase')].filter(c => c.closest('[aria-live], [role=status], [role=log], [role=alert]')).length,
  }));
  check(live.plan === null && live.status === 'status' && live.caps === 0, `диктор: у #plan нет aria-live, есть #plan-status с role="status", подписи фаз вне живых областей (${JSON.stringify(live)})`);
  await page.click('#count-plus'); await page.waitForTimeout(250);
  const said = await page.evaluate(() => ({ text: document.querySelector('#plan-status').textContent, cards: document.querySelectorAll('.card').length, min: plan.minutes }));
  check(said.text === `План обновлён: ${said.cards} упражнений, ≈${said.min} мин` || said.text === `План обновлён: ${said.cards} упражнения, ≈${said.min} мин`, `после «+» объявляется «План обновлён: N упражнений, ≈M мин» (${JSON.stringify(said)})`);
  await page.evaluate(() => { document.querySelector('#plan-status').textContent = 'x'; S.count = 6; regen(); });
  await page.waitForTimeout(250);
  check(await page.evaluate(() => /^План обновлён: 6 упражнений, ≈\d+ мин$/.test(document.querySelector('#plan-status').textContent)), 'повторная пересборка объявляется снова');

  const names = await page.evaluate(NAMES);
  check(!names.length, `план: имя кнопки содержит её видимую надпись (WCAG 2.5.3): ${names.join('; ')}`);
  const cards = await page.evaluate(() => [...document.querySelectorAll('.card')].map(c => {
    const nm = c.querySelector('.c-name').textContent, label = sel => { const b = c.querySelector(sel); return b ? (b.getAttribute('aria-label') || [...b.childNodes].filter(n => !(n.nodeType === 1 && n.getAttribute('aria-hidden') === 'true')).map(n => n.textContent).join('')).replace(/\s+/g, ' ').trim() : ''; };
    return { nm, start: label('[data-workout]'), hist: label('[data-hist]'), swap: label('[data-swap]'), zoom: label('.illus'), pause: label('[data-motion-pause]') };
  }));
  for (const k of ['start', 'hist', 'swap', 'zoom', 'pause']) check(new Set(cards.map(c => c[k])).size === cards.length, `одинаковые кнопки карточек различаются для диктора: ${k} (${cards.map(c => c[k]).join(' | ')})`);
  check(cards.every(c => c.start.startsWith('Начать тренировку') && c.start.includes(c.nm) && c.hist.startsWith('История') && c.hist.includes(c.nm) && c.swap.startsWith('Заменить') && c.swap.includes(c.nm)
    && c.zoom.startsWith('Увеличить: ') && c.zoom.includes(c.nm) && /^(Пауза|Пуск): /.test(c.pause) && c.pause.includes(c.nm)), `кнопки карточки: имя начинается с надписи и называет упражнение (${JSON.stringify(cards[0])})`);
  check(await page.evaluate(() => !document.querySelector('[data-motion-pause][aria-pressed], #mv-play[aria-pressed], #wv-motion[aria-pressed]')), '«Пауза» и «Пуск» меняют надпись — без aria-pressed (WCAG 4.1.2)');

  /* «Пиковая нагрузка»: кнопка раскрывает пояснение из разбора движения */
  await page.evaluate(() => { S.groups = ['quads', 'glutes', 'hams', 'calves']; regen(); });
  const pk = () => page.evaluate(() => {
    const b = document.querySelector('.c-joints-b'), box = b && document.getElementById(b.getAttribute('aria-controls')), ex = b && EXI[b.dataset.peak], r = b && b.getBoundingClientRect();
    return b && { exp: b.getAttribute('aria-expanded'), shown: !!box && !box.hidden && box.getClientRects().length > 0, text: box?.textContent.replace(/\s+/g, ' ').trim() || '', h: r.height,
      lead: document.querySelector('#mv-stress-panel .stress-explanation').textContent.trim(), rules: jointStress(ex).rules.map(x => `${x.zone}. ${x.what} ${x.tip}`.replace(/\s+/g, ' ')), title: b.closest('.c-joints').hasAttribute('title') };
  });
  let s = await pk();
  check(s && s.exp === 'false' && !s.shown && !s.title, `«Пиковая нагрузка»: кнопка со свёрнутым пояснением, без подсказки только для мыши (${JSON.stringify(s)})`);
  if (s) {
    await page.click('.c-joints-b'); s = await pk();
    check(s.exp === 'true' && s.shown && s.text.startsWith(s.lead) && s.rules.every(x => s.text.includes(x)) && s.h >= 24, `нажатие раскрывает то же пояснение, что в разборе движения; цель не ниже 24 px (${JSON.stringify(s)})`);
    await page.focus('.c-joints-b'); await page.keyboard.press('Enter'); s = await pk();
    check(s.exp === 'false' && !s.shown, 'Enter на кнопке сворачивает пояснение');
  }

  /* «легче · тяжелее» — цели не меньше 24×24 */
  const lk = await page.evaluate(() => { const out = []; for (const [g, n] of [['chest', 6], ['back', 6], ['quads', 6], ['abs', 5]]) { S.groups = [g]; S.count = n; regen(); for (const b of document.querySelectorAll('.prog .lk')) { const r = b.getBoundingClientRect(); out.push([b.textContent, Math.round(r.width), Math.round(r.height)]); } if (out.length) break; } return out; });
  check(lk.length && lk.every(([, w, h]) => w >= 24 && h >= 24), `«легче · тяжелее»: цели не меньше 24×24 px (${JSON.stringify(lk.slice(0, 4))})`);

  /* тренировка: «0 из 21 подхода», имена кнопок, «Можно продолжать» в конце отдыха (спокойный конец, без красного экрана) */
  await page.evaluate(() => { S.groups = ['chest', 'back', 'shoulders']; S.count = 6; regen(); document.querySelector('#start-workout').click(); });
  await page.waitForTimeout(100);
  const prog = await page.evaluate(() => { const q = workout.queue, out = {}; for (const n of [21, 23, 1, 2]) { workout.queue = Array.from({ length: n }, (_, i) => q[i % q.length]); workoutTick(); out[n] = $('#wv-progress-label').textContent; } workout.queue = q; workoutTick(); return out; });
  check(prog[21] === '0 из 21 подхода' && prog[23] === '0 из 23 подходов' && prog[1] === '0 из 1 подхода' && prog[2] === '0 из 2 подходов', `тренировка: «из 21 подхода», «из 23 подходов» (${JSON.stringify(prog)})`);
  const wnames = await page.evaluate(NAMES);
  check(!wnames.length, `тренировка: имя кнопки содержит её видимую надпись: ${wnames.join('; ')}`);
  await SCREENS.rest(page);
  await page.evaluate(() => { workout.restUntil = Date.now() - 1000; workoutTick(); });
  const rest = await page.evaluate(() => ({ say: $('#wv-rest-say').textContent, role: $('#wv-rest-say').getAttribute('role'), done: !$('#wv-rest-done').hidden, heading: $('#wv-rest-heading').textContent, overRole: $('#wv-rest-over').getAttribute('role') }));
  check(await page.evaluate(() => !$('#wv-hr-btn').hidden), 'на экране тренировки видна плашка «♥ Пульс» (проверена и её раскладка)');
  check(rest.say === 'Можно продолжать' && rest.role === 'status' && rest.done && rest.heading === 'Можно продолжать' && !rest.overRole, `конец отдыха объявляется «Можно продолжать» (${JSON.stringify(rest)})`);
  await ctx.close();
}
{
  /* разбор движения: имена кнопок */
  const { ctx, page } = await open({ width: 390 });
  await SCREENS.detail(page); await page.waitForTimeout(100);
  const names = await page.evaluate(NAMES);
  check(!names.length, `разбор: имя кнопки содержит её видимую надпись: ${names.join('; ')}`);
  await ctx.close();
}
/* атлас движений, поиск и «+» на плитке (13c-gallery.js): у «+» имя «Добавить в план: <упражнение>» и цель не меньше 44×44;
   выбор плана и сообщение «Добавлено в …» — имена кнопок с надписью, раскладка без наложений и обрезки при обычном и крупном
   шрифте, контраст в светлой и тёмной теме */
for (const cfg of [{ width: 390 }, { width: 390, font: 200 }, { width: 390, theme: 'dark' }]) {
  const tag = `витрина атласа (${cfg.font ? 'шрифт ' + cfg.font + ' %' : cfg.theme === 'dark' ? 'тёмная тема' : '390 px'})`;
  const { ctx, page } = await open(cfg);
  if (cfg.theme) await page.evaluate(t => { document.documentElement.dataset.theme = t; }, cfg.theme);
  await page.evaluate(() => { S.customs = [{ id: 'up', name: 'Верх А', items: [{ id: 'bbbench' }] }, { id: 'low', name: 'Низ А', items: [] }]; S.custom = 'up'; S.cpLast = null; ensureCustoms(S); openGallery(); });
  await page.fill('#mv-gq', 'присед'); await page.waitForTimeout(80);
  const plus = await page.evaluate(() => [...document.querySelectorAll('#mv-gallery [data-gadd]')].map(b => { const r = b.getBoundingClientRect(), n = b.parentElement.querySelector('.mv-tname').textContent.trim(); return { id: b.dataset.gadd, w: Math.round(r.width), h: Math.round(r.height), ok: b.getAttribute('aria-label') === 'Добавить в план: ' + n }; }));
  check(plus.length > 3 && plus.every(x => x.ok && x.w >= 44 && x.h >= 44), `${tag}: «+» — имя «Добавить в план: …» и цель 44×44 (${JSON.stringify(plus.filter(x => !x.ok || x.w < 44 || x.h < 44).slice(0, 3))})`);
  const steps = [['поиск', async () => {}], ['выбор плана', () => page.click('#mv-gallery [data-gadd="squat"]')], ['сообщение', () => page.click('#mv-gpick [data-cp-to="low"]')]];
  for (const [name, go] of steps) {
    await go(); await page.waitForTimeout(80);
    const names = await page.evaluate(NAMES), bad = await page.evaluate(LAYOUT), { low } = await page.evaluate(CONTRAST);
    check(!names.length, `${tag}, ${name}: имя кнопки содержит её видимую надпись: ${names.join('; ')}`);
    check(!bad.length, `${tag}, ${name}: ${bad.join('; ')}`);
    check(!low.length, `${tag}, ${name}: контраст текста: ${low.join('; ')}`);
  }
  check(await page.evaluate(() => document.querySelector('[data-gadd="squat"]').getAttribute('aria-label') === 'Добавить в план: Приседания со штангой (уже в плане «Низ А»)' && $('#mv-glive').getAttribute('role') === 'status' && $('#mv-glive').textContent === 'Добавлено в «Низ А»'),
    `${tag}: «✓» называет план, сообщение — в живой области для диктора`);
  await ctx.close();
}
{
  /* отдых при масштабе 150 %: фокус на «Перейти к подходу», таймер на экране и над кнопкой */
  const { ctx, page } = await open({ width: 260 });
  await SCREENS.workout(page); await page.waitForTimeout(100); await SCREENS.rest(page); await page.waitForTimeout(100);
  const r = await page.evaluate(() => { const t = $('#wv-rest-time').getBoundingClientRect(), c = $('#wv-continue').getBoundingClientRect(); return { t: [Math.round(t.top), Math.round(t.bottom)], c: [Math.round(c.top), Math.round(c.bottom)], vh: innerHeight, focus: document.activeElement.id, scrolled: $('#workout-view').scrollTop }; });
  check(r.focus === 'wv-continue' && r.t[0] >= 0 && r.t[1] <= r.c[0] && r.c[1] <= r.vh, `отдых при масштабе 150 %: таймер виден над «Перейти к подходу» (${JSON.stringify(r)})`);
  await ctx.close();
}

/* 7. Первый запуск (11k-first-run.js): каждый шаг мастера — при шрифте 150 и 200 % (390 и 320 px) и масштабе 150 и 200 %
   без прокрутки вбок, наложений и обрезки; в светлой и тёмной теме — контраст текста; имена кнопок содержат видимую надпись;
   после смены шага фокус — на заголовке шага, у заголовка описание «Шаг N из M»; кнопки-варианты не ниже 44 px */
const FR_WALK = [['где', async () => {}], ['что есть', p => p.click('[data-fr-place="home"]')], ['цель', p => p.click('#fr-next')], ['время и опыт', p => p.click('[data-fr-goal="cut"]')]];
for (const cfg of [{ width: 390 }, { width: 390, font: 150 }, { width: 390, font: 200 }, { width: 320, font: 150 }, { width: 320, font: 200 }, { width: 260 }, { width: 195 }, { width: 390, theme: 'dark' }, { width: 320, font: 200, theme: 'dark' }]) {
  const tag = `мастер (${cfg.font ? 'шрифт ' + cfg.font + ' %, ' + cfg.width + ' px' : cfg.width < 320 ? 'масштаб ' + Math.round(390 / cfg.width * 100) + ' %' : cfg.width + ' px'}${cfg.theme === 'dark' ? ', тёмная тема' : ''})`;
  const { ctx, page } = await open({ ...cfg, firstRun: true });
  if (cfg.theme) await page.evaluate(t => { document.documentElement.dataset.theme = t; }, cfg.theme);
  for (const [name, go] of FR_WALK) {
    await go(page); await page.waitForTimeout(80);
    await page.evaluate(() => document.querySelector('#first-run').scrollTo(0, 1e5));
    const bad = await page.evaluate(LAYOUT), names = await page.evaluate(NAMES), { low } = await page.evaluate(CONTRAST);
    await page.evaluate(() => document.querySelector('#first-run').scrollTo(0, 0));
    const bad0 = await page.evaluate(LAYOUT);
    check(!bad.length && !bad0.length, `${tag}, ${name}: ${bad0.concat(bad).join('; ')}`);
    check(!names.length, `${tag}, ${name}: имя кнопки содержит её видимую надпись: ${names.join('; ')}`);
    check(!low.length, `${tag}, ${name}: контраст текста: ${low.join('; ')}`);
    const f = await page.evaluate(() => ({ open: document.querySelector('#first-run').open, focus: document.activeElement.id, desc: document.activeElement.getAttribute('aria-describedby'),
      count: document.querySelector('#fr-count').textContent, small: [...document.querySelectorAll('#first-run .fr-opt, #first-run .fr-seg button, #first-run .fr-primary, #first-run .fr-link')].filter(b => b.offsetHeight && b.getBoundingClientRect().height < 44).length }));
    check(f.open && f.focus === 'fr-title' && f.desc === 'fr-count' && /^Шаг \d из \d$/.test(f.count) && !f.small, `${tag}, ${name}: фокус на заголовке шага с «Шаг N из M», цели не ниже 44 px (${JSON.stringify(f)})`);
  }
  await ctx.close();
}

await browser.close();
if (errors.length) console.error('Ошибки страницы:\n' + [...new Set(errors)].slice(0, 10).join('\n'));
if (fails.length || errors.length) { console.error(`Проверка доступности: ${fails.length} замечаний`); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); }
console.log('Доступность: шрифт 150 и 200 % и масштаб 150 и 200 % без прокрутки вбок, наложений и обрезки (план, атлас, журнал, разбор, тренировка, отдых, шаги мастера первого запуска), подписи не мельче 12 px, контраст токенов и текста в светлой и тёмной теме, план без живой области и с коротким объявлением, имена кнопок с видимой надписью и упражнением, «Пиковая нагрузка» раскрывается кнопкой, «из 21 подхода», цели «легче · тяжелее», таймер отдыха при фокусе внизу, «+» на плитках атласа и выбор плана.');
