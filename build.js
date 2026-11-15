#!/usr/bin/env node
/* Сборка Lazy Gym Planner: node build.js
   dist/index.html                    — PWA, русский (отдельные css/js/шрифты, кешируются сервис-воркером)
   dist/en/index.html                 — PWA, английский (перевод накладывается при сборке, словарь i18n/en.json)
   dist/lazy-gym-planner-offline-ru.html, -en.html — один файл, всё встроено
   dist/artifact.html                 — тело русской страницы для публикации артефактом */
const fs = require('fs'), path = require('path');
const {translateJs, translateHtml, translateCss} = require('./i18n/translate');
const {searchData} = require('./i18n/search-data');
const SRC = path.join(__dirname, 'src'), DIST = path.join(__dirname, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const VERSION = pkg.version;
const read = p => fs.readFileSync(p, 'utf8');
const list = (dir, ext) => fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort().map(f => path.join(dir, f));

/* Языки сборки. dir — папка языка ('' — корень сайта); fallback — язык для браузера, в списке языков которого нет
   ни одного из доступных (src/lang.js); locale — правила чисел и дат (PODHOD_LOCALE в начале app.js):
   dec — десятичный разделитель, plural — правило множественного числа ('ru' — три формы, 'one' — 1 и остальное),
   dates — 'intl': даты через Intl по языку браузера (en-US — «Nov 9», en-GB — «9 Nov»), иначе русские сокращения месяцев;
   units — единицы веса по умолчанию: 'kg' или 'region' (фунты для США, Либерии и Мьянмы по navigator.language). */
/* Сайт на GitHub Pages: предпросмотр ссылки (Open Graph) требует полных адресов страницы и картинки. Ссылка на план
   (src/js/11m-plan-link.js) ведёт сюда же, если её сделали в офлайн-файле. */
const SITE = 'https://sakrett001-ai.github.io/Lazy-gym-planner/';
const OG_IMAGE = 'og-image.png', OG_W = 1200, OG_H = 630;
const LANGS = {
  ru:{dir:'', html:'ru', title:'Lazy Gym Planner', desc:'Lazy Gym Planner — планировщик тренировок: подбор под мышцы и оборудование, техника, журнал весов.',
    ogTitle:'Lazy Gym Planner — тренировка под ваш зал и цель', ogDesc:'План за пару нажатий, 3D-разбор техники, мышцы по фазам и журнал весов. Бесплатно, без регистрации, работает без интернета.',
    ogAlt:'Lazy Gym Planner: кот с гирей и трёхмерный манекен в упражнениях', ogLocale:'ru_RU',
    manifestName:'Lazy Gym Planner — планировщик тренировок', manifestDesc:'Подбор тренировки под мышцы и оборудование, техника, журнал весов.',
    other:{lang:'en', href:'en/', label:'EN', offline:'lazy-gym-planner-offline-en.html', title:'English version'},
    locale:{dec:',', plural:'ru', dates:'ru', units:'kg'}},
  en:{dir:'en', html:'en', title:'Lazy Gym Planner', desc:'Lazy Gym Planner — workout planner: picks exercises for your muscles and equipment, shows technique, logs your weights.',
    ogTitle:'Lazy Gym Planner — workouts for your gym and goal', ogDesc:'A plan in a couple of taps, 3D technique breakdowns, muscles by phase and a weight log. Free, no sign-up, works offline.',
    ogAlt:'Lazy Gym Planner: a cat with a kettlebell and a 3D mannequin doing exercises', ogLocale:'en_US',
    manifestName:'Lazy Gym Planner — workout planner', manifestDesc:'Workouts built around your muscles and equipment, technique, weight log.',
    other:{lang:'ru', href:'../', label:'RU', offline:'lazy-gym-planner-offline-ru.html', title:'Русская версия'}, fallback:true, quotes:'“”',
    locale:{dec:'.', plural:'one', dates:'intl', units:'region'}}
};
/* выбор языка при заходе (src/lang.js): папки языков, язык корня, запасной */
const LANG_CFG = {langs:Object.fromEntries(Object.entries(LANGS).map(([k, L]) => [k, L.dir ? L.dir + '/' : ''])),
  root:Object.keys(LANGS).find(k => !LANGS[k].dir), fallback:Object.keys(LANGS).find(k => LANGS[k].fallback) || null};

fs.rmSync(DIST, {recursive:true, force:true});
fs.mkdirSync(path.join(DIST, 'fonts'), {recursive:true});
require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'tools/build-volume.mjs')],{stdio:'inherit'});
const volumeSrc=read(path.join(DIST,'volume.js'));

const cssSrc = list(path.join(SRC, 'css'), '.css').map(read).join('\n');
/* язык и локаль (PODHOD_LANG, PODHOD_LOCALE) дописываются в начало app.js: модули читают их при загрузке, и первая
   отрисовка (99-boot.js) уже идёт по правилам языка */
const jsSrc = list(path.join(SRC, 'js'), '.js').map(read).join('\n');
/* в <head> — без пояснений (они в исходнике): комментарии с начала строки убираются, код проверяется разбором */
const langSrc = read(path.join(SRC, 'lang.js')).replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*\n/gm, '');
new Function(langSrc);
const bodySrc = read(path.join(SRC, 'body.html'));
const pwaSrc = read(path.join(SRC, 'pwa.js')).replace(/__VERSION__/g, VERSION);
const manifestSrc = JSON.parse(read(path.join(SRC, 'manifest.webmanifest')));
/* кости манекена (виды «Анатомия» и «Скелет» разбора): PWA грузит файл по требованию, офлайн-файлы — со встроенными данными (base64) */
const skeletonBin = fs.readFileSync(path.join(SRC, 'data', 'skeleton.bin')), skeletonB64 = skeletonBin.toString('base64');
/* пути мышц (вид «Анатомия») — так же: файл по требованию, в офлайн-файлах встроены */
const musclesBin = fs.readFileSync(path.join(SRC, 'data', 'muscles.bin')), musclesB64 = musclesBin.toString('base64');
/* кожа Anny (вид «Манекен», src/js/09bs-anny.js) — так же: файл по требованию, в офлайн-файлах встроена */
const annyBin = fs.readFileSync(path.join(SRC, 'data', 'anny.bin')), annyB64 = annyBin.toString('base64');
/* Иконки: адрес — по хэшу содержимого (?v=<sha256>), а не по версии сборки. Иконка не менялась — адрес прежний: браузер
   и сервис-воркер (sw.js берёт файл из кеша прежней версии) не скачивают ≈0,3 МБ иконок заново в каждом выпуске. */
const ICON_FILES = ['icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-32.png'];
const iconUrl = Object.fromEntries(ICON_FILES.filter(f => fs.existsSync(path.join(SRC, f)))
  .map(f => [f, f + '?v=' + require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(SRC, f))).digest('hex').slice(0, 16)]));
const ASSET_VERSION = VERSION + '-' + require('node:crypto').createHash('sha256').update([volumeSrc,cssSrc,jsSrc,bodySrc,pwaSrc,JSON.stringify(manifestSrc),read(path.join(SRC,'sw.js')),langSrc,read(path.join(__dirname,'i18n/en.json')),read(path.join(SRC,'data','search.json')),skeletonB64,musclesB64,annyB64].join('\n')).digest('hex').slice(0,12);
/* Версия отрисовки каждого вида фигуры — для ключа готовых кадров витрины (thumbCacheKey, src/js/12-figure-pace.js): хэш того,
   от чего зависит картинка кадра при той же позе, — объёмная сцена (volume.js: свет, материалы, камеры, кисти, инвентарь),
   манекен и его области (09bm, 09b, 09d) и данные вида: кожа Anny, кости, мышцы. Поза и детали инвентаря входят в ключ сами
   (хэш позы). Номер версии сюда не входит: выпуск, не тронувший эти файлы, оставляет кадры в кеше. */
const jsFile = f => read(path.join(SRC, 'js', f));
const renderHash = (...parts) => require('node:crypto').createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 10);
const renderBase = [volumeSrc, jsFile('09bm-mannequin.js'), jsFile('09b-muscle-profiles.js'), jsFile('09d-catalog-muscles.js')];
const RENDER = {
  skin:renderHash(...renderBase, jsFile('09bs-anny.js'), annyB64),
  skeleton:renderHash(...renderBase, jsFile('09bq-skeleton.js'), skeletonB64),
  anatomy:renderHash(...renderBase, jsFile('09bq-skeleton.js'), skeletonB64, jsFile('09br-muscles.js'), musclesB64)
};
const reset = `:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}`;
const headMeta = L => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ECEFF3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1116" media="(prefers-color-scheme: dark)">
<meta name="description" content="${L.desc}">`;
/* Предпросмотр ссылки в мессенджерах и соцсетях (Кира 4): заголовок, описание и картинка 1200 × 630 — стандарт Open Graph.
   Только в страницах сайта: офлайн-файлу и документу для Floot они не нужны (у Floot своя страница — docs/floot-deployment.md).
   Адреса полные: так их требуют Telegram, WhatsApp, VK и Facebook. */
const ogMeta = L => { const url = SITE + (L.dir ? L.dir + '/' : ''), alt = L.other.lang;
  return `<meta property="og:type" content="website">
<meta property="og:site_name" content="Lazy Gym Planner">
<meta property="og:title" content="${L.ogTitle}">
<meta property="og:description" content="${L.ogDesc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}${OG_IMAGE}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta property="og:image:alt" content="${L.ogAlt}">
<meta property="og:locale" content="${L.ogLocale}">
<meta property="og:locale:alternate" content="${LANGS[alt].ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${L.ogTitle}">
<meta name="twitter:description" content="${L.ogDesc}">
<meta name="twitter:image" content="${SITE}${OG_IMAGE}">
<link rel="canonical" href="${url}">`; };

/* шрифты: inline base64 для single-file сборок, относительные пути для PWA */
const fontsDir = path.join(SRC, 'fonts');
const inlineFonts = c => c.replace(/url\(\.\.\/fonts\/([\w.-]+)\)/g, (m, f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(fontsDir, f)).toString('base64')})`);
for (const f of fs.readdirSync(fontsDir)) fs.copyFileSync(path.join(fontsDir, f), path.join(DIST, 'fonts', f));
for (const f of Object.keys(iconUrl)) fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));
/* картинка предпросмотра ссылки — статический файл проекта, в корне сайта; в офлайн-файл и документ Floot не встраивается */
fs.copyFileSync(path.join(SRC, OG_IMAGE), path.join(DIST, OG_IMAGE));
fs.writeFileSync(path.join(DIST, 'sw.js'), read(path.join(SRC, 'sw.js')).replace(/__VERSION__/g, ASSET_VERSION).replace('__ICONS__', JSON.stringify(Object.values(iconUrl).map(u => './' + u))));
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
fs.writeFileSync(path.join(DIST, 'skeleton.bin'), skeletonBin);
fs.copyFileSync(path.join(__dirname, 'third_party', 'myosim', 'LICENSE'), path.join(DIST, 'skeleton-LICENSE.txt'));
fs.copyFileSync(path.join(__dirname, 'third_party', 'myosim', 'NOTICE.md'), path.join(DIST, 'skeleton-NOTICE.md'));
fs.writeFileSync(path.join(DIST, 'muscles.bin'), musclesBin);
fs.copyFileSync(path.join(__dirname, 'third_party', 'das3', 'LICENSE'), path.join(DIST, 'muscles-DAS3-LICENSE.txt'));
fs.copyFileSync(path.join(__dirname, 'third_party', 'das3', 'NOTICE.md'), path.join(DIST, 'muscles-NOTICE.md'));
fs.writeFileSync(path.join(DIST, 'anny.bin'), annyBin);
fs.copyFileSync(path.join(__dirname, 'third_party', 'anny', 'LICENSE'), path.join(DIST, 'anny-LICENSE.txt'));
fs.copyFileSync(path.join(__dirname, 'third_party', 'anny', 'NOTICE.md'), path.join(DIST, 'anny-NOTICE.md'));

const report = [];
for (const [lang, L] of Object.entries(LANGS)) {
  const out = path.join(DIST, L.dir); fs.mkdirSync(out, {recursive:true});
  const up = L.dir ? '../' : '';
  let css = cssSrc, js = jsSrc, body = bodySrc, pwa = pwaSrc;
  if (lang !== 'ru') {
    const dictPath = path.join(__dirname, 'i18n', lang + '.json');
    const dict = fs.existsSync(dictPath) ? JSON.parse(read(dictPath)) : {};
    const missing = new Set();
    const opts = {quotes:L.quotes}; /* кавычки языка вместо «ёлочек» (i18n/translate.js) */
    css = translateCss(css, dict, missing, opts); js = translateJs(js, dict, missing, opts); body = translateHtml(body, dict, missing, opts); pwa = translateJs(pwa, dict, missing, opts);
    if (missing.size) report.push(`${lang}: не переведено ${missing.size} строк (node i18n/extract.js ${lang})`);
  }
  /* язык, версия и локаль — до кода приложения: первая отрисовка (99-boot.js) уже с точкой, английским множественным числом и датами.
     Данные поиска (i18n/search-data.js) — после перевода: названия на другом языке и русские синонимы остаются как есть */
  const search = searchData(lang, jsSrc, JSON.parse(read(path.join(__dirname, 'i18n', 'en.json'))));
  const code = js; /* переведённый код без строки версии — для офлайн-файла (ниже) */
  js = `window.PODHOD_VERSION='${VERSION}';window.PODHOD_BUILD='${ASSET_VERSION}';window.PODHOD_RENDER=${JSON.stringify(RENDER)};window.PODHOD_SEARCH=${JSON.stringify(search)};window.PODHOD_LANG='${lang}';window.PODHOD_LOCALE=${JSON.stringify(L.locale)};\n` + js;
  const head = js.slice(0, js.length - code.length);
  body = body.replace(/__VERSION__/g, VERSION).replace(/__LANG_CODE__/g, L.other.lang).replace(/__LANG_HREF__/g, L.other.href).replace(/__LANG_LABEL__/g, L.other.label).replace(/__LANG_TITLE__/g, L.other.title);
  const manifest = {...manifestSrc, name:L.manifestName, description:L.manifestDesc, lang, scope:up || './', icons:manifestSrc.icons.map(i => ({...i, src:up + iconUrl[i.src]}))};

  /* 1. PWA */
  fs.writeFileSync(path.join(out, 'app.css'), css.replace(/\.\.\/fonts\//g, up + 'fonts/'));
  fs.writeFileSync(path.join(out, 'app.js'), js);
  fs.writeFileSync(path.join(out, 'pwa.js'), pwa.replace(/__SW__/g, up + 'sw.js'));
  fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
  /* Объёмная графика (volume.js, ≈140 КБ в сжатом виде) нужна только в разборе и в тренировке: она грузится после
     первого экрана и не отнимает у плана ни канал, ни процессор. Пришла — событие gym-volume (12-motion-player.js). */
  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="${L.html}">
<head>
${headMeta(L)}
<title>${L.title}</title>
${ogMeta(L)}
<link rel="manifest" href="manifest.webmanifest?v=${ASSET_VERSION}">
<link rel="icon" href="${up}${iconUrl['favicon-32.png']}" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${up}${iconUrl['apple-touch-icon.png']}" sizes="180x180">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Lazy Gym">
<link rel="alternate" hreflang="${L.other.lang}" href="${L.other.href}">
<script>window.PODHOD_LANGS=${JSON.stringify({...LANG_CFG, page:lang})};
${langSrc}</script>
<style>${reset}</style>
<link rel="stylesheet" href="app.css?v=${ASSET_VERSION}">
</head>
<body>
${body}
<script>addEventListener('load',()=>setTimeout(()=>{const s=document.createElement('script');s.src='${up}volume.js?v=${ASSET_VERSION}';s.onload=()=>dispatchEvent(new Event('gym-volume'));document.body.append(s);}));</script>
<script src="app.js?v=${ASSET_VERSION}"></script>
<script src="pwa.js?v=${ASSET_VERSION}"></script>
</body>
</html>
`);

  /* 2. офлайн-файл: ссылка на другой язык ведёт на соседний офлайн-файл. Код в нём — без комментариев и лишних пробелов
     (esbuild, только пробелы: имена и порядок те же, кириллица как есть): этот же файл — документ для Floot, у которого
     предел 4,5 МБ (tools/build-floot-release.mjs); 4.107.0 с комментариями вышел за предел. Строка с версией и языком —
     как есть: Floot ищет её дословно. */
  const singleJs = head + require('esbuild').transformSync(code, {minifyWhitespace:true, charset:'utf8', legalComments:'none'}).code;
  /* заголовок и стили — в <head>, разметка и код — в <body>: один <head> и один <body> (Кира 17: «</head><body>» стоял дважды) */
  const singleHead = `<title>${L.title}</title>\n<style>\n${inlineFonts(css)}\n</style>\n`;
  const singleBody = `${body.replace(`href="${L.other.href}"`, `href="${L.other.offline}"`)}\n<script>\n${volumeSrc}\n</script>\n<script>window.SKELETON_BIN='${skeletonB64}';window.MUSCLES_BIN='${musclesB64}';window.ANNY_BIN='${annyB64}';</script>\n<script>\n${singleJs}\n</script>\n`;
  fs.writeFileSync(path.join(DIST, `lazy-gym-planner-offline-${lang}.html`), `<!doctype html>
<html lang="${L.html}">
<head>
${headMeta(L)}
<style>${reset}</style>
${singleHead}</head>
<body>
${singleBody}
</body>
</html>
`);
  /* 3. артефакт (только русский): тело страницы для обёртки при публикации — как раньше, со стилями до «</head><body>» */
  if (lang === 'ru') fs.writeFileSync(path.join(DIST, 'artifact.html'), `${singleHead}</head>\n<body>\n${singleBody}`);
  report.push(`${lang}: app.js ${(js.length / 1024 | 0)} КБ, offline ${(fs.statSync(path.join(DIST, `lazy-gym-planner-offline-${lang}.html`)).size / 1024 | 0)} КБ`);
}
console.log(`Lazy Gym Planner ${VERSION} — ` + report.join('; '));
