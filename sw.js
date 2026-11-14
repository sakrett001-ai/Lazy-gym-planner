/* Сервис-воркер Lazy Gym Planner: кеширует оболочку приложения, работает без сети, обновляется при новой версии.
   Языки: при установке и обновлении скачивается только тот язык, которым пользуются, — по адресам открытых страниц и по
   отметкам «язык открыт» за последние 30 дней (их присылает pwa.js). Второй язык скачивается целиком, когда его откроют
   с сетью; без сети вместо пустой страницы браузера — подсказка (здесь и в pwa.js). Общие файлы (объём, шрифты, иконки)
   кешируются всегда. Если о языках ничего не известно — оба, как раньше. */
const VERSION = '4.104.0-293ee9592e2d';
const SCOPE = self.registration.scope;
const CACHE_PREFIX = 'podhod@' + SCOPE + ':';
const CACHE = CACHE_PREFIX + VERSION;
/* отметки языков — в своём кеше: он переживает обновления (старые кеши удаляются по CACHE_PREFIX) */
const LANGS_CACHE = 'podhod-langs@' + SCOPE, LANGS_URL = SCOPE + '__podhod-langs.json', LANG_DAYS = 30;
/* готовые миниатюры витрины атласа (13e-gallery-anatomy.js): корзина одна на место приложения, ключ кадра — по его содержимому,
   поэтому обновление её не трогает (кадры неизменившихся упражнений остаются). Корзины прежней схемы — по одной на сборку
   (THUMBS_LEGACY) — удаляются */
const THUMBS = 'podhod-thumbs2@' + SCOPE, THUMBS_LEGACY = 'podhod-thumbs@' + SCOPE + ':';
/* Иконки — адрес с хэшем содержимого (список подставляет build.js): файл по такому адресу не меняется, поэтому новая версия
   берёт иконки из кеша прежней, а не из сети (≈0,3 МБ на каждый выпуск; fillShell). В исходнике (проверки) — адреса с версией. */
const ICON_LIST = '["./icon.svg?v=e6dd9bfb04688dd4","./icon-192.png?v=a879f7a39b2ac9f3","./icon-512.png?v=2f8e3566ab73f211","./icon-maskable-512.png?v=e146f466e6ce003f","./apple-touch-icon.png?v=a74303c486c0d24d","./favicon-32.png?v=fc40014dc8612440"]';
const ICONS = ICON_LIST.startsWith('[') ? JSON.parse(ICON_LIST) : ['./icon.svg?v=' + VERSION, './icon-192.png?v=' + VERSION, './icon-512.png?v=' + VERSION,
  './icon-maskable-512.png?v=' + VERSION, './apple-touch-icon.png?v=' + VERSION, './favicon-32.png?v=' + VERSION];
const COMMON = ['./volume.js?v=' + VERSION, ...ICONS,
  'fonts/golos-text-cyrillic-400.woff2', 'fonts/golos-text-cyrillic-500.woff2', 'fonts/golos-text-cyrillic-600.woff2',
  'fonts/golos-text-latin-400.woff2', 'fonts/golos-text-latin-500.woff2', 'fonts/golos-text-latin-600.woff2',
  'fonts/russo-one-cyrillic-400.woff2', 'fonts/russo-one-latin-400.woff2', 'fonts/jetbrains-mono-cyrillic-500.woff2', 'fonts/jetbrains-mono-latin-500.woff2'];
const page = dir => ['./' + dir, './' + dir + 'index.html', './' + dir + 'app.css?v=' + VERSION, './' + dir + 'app.js?v=' + VERSION, './' + dir + 'pwa.js?v=' + VERSION,
  './' + dir + 'manifest.webmanifest', './' + dir + 'manifest.webmanifest?v=' + VERSION];
const LANG_FILES = {ru:page(''), en:page('en/')};
/* файлы оболочки для набора языков */
const shellFor = langs => COMMON.concat(...Object.keys(LANG_FILES).filter(l => langs.includes(l)).map(l => LANG_FILES[l]));
/* язык страницы приложения по адресу; другие адреса (офлайн-файлы, данные) — null */
function langOf(url) {
  if (typeof url !== 'string' || !url.startsWith(SCOPE)) return null;
  const rest = url.slice(SCOPE.length).replace(/[?#].*$/, '');
  return rest === 'en' || rest.startsWith('en/') ? 'en' : rest === '' || rest === 'index.html' ? 'ru' : null;
}
async function readLangs() {
  try { const hit = await (await caches.open(LANGS_CACHE)).match(LANGS_URL); const v = hit && await hit.json(); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
}
async function noteLangs(langs) {
  const used = await readLangs(), now = Date.now();
  for (const l of langs) if (LANG_FILES[l]) used[l] = now;
  await (await caches.open(LANGS_CACHE)).put(LANGS_URL, new Response(JSON.stringify(used), {headers:{'Content-Type':'application/json'}}));
}
/* какие языки скачать: открытые сейчас страницы и языки, открытые за последние 30 дней */
async function wantedLangs() {
  const used = await readLangs(), now = Date.now(), want = new Set(), open = [];
  for (const l of Object.keys(LANG_FILES)) if (Number.isFinite(used[l]) && now - used[l] < LANG_DAYS * 864e5) want.add(l);
  let clients = [];
  try { clients = await self.clients.matchAll({type:'window', includeUncontrolled:true}); } catch (e) {}
  for (const c of clients) { const l = langOf(c.url); if (l) { want.add(l); open.push(l); } }
  if (open.length) await noteLangs(open).catch(() => {});
  return want.size ? [...want] : Object.keys(LANG_FILES);
}
/* язык, открытый с сетью: отметить и докачать его оболочку в текущий кеш */
async function useLang(lang) {
  if (!LANG_FILES[lang]) return;
  await noteLangs([lang]).catch(() => {});
  const c = await caches.open(CACHE), missing = [];
  for (const f of LANG_FILES[lang]) if (!await c.match(f)) missing.push(f);
  if (missing.length) await c.addAll(missing);
}
/* без сети и без скачанной версии этого языка: подсказка на обоих языках со ссылкой на скачанную версию. В ссылке —
   ?lang=: это явный выбор языка (src/lang.js), корень сайта не вернёт на нескачанный язык по прежнему выбору */
function notDownloaded(lang) {
  const ru = lang === 'en' ? ['Английская версия', 'русскую версию', '../?lang=ru'] : ['Русская версия', 'английскую версию', './en/?lang=en'];
  const en = lang === 'en' ? ['The English version', 'the Russian version'] : ['The Russian version', 'the English version'];
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>Lazy Gym Planner</title>
<style>body{margin:0;padding:24px 16px;font:16px/1.5 system-ui,-apple-system,sans-serif;background:Canvas;color:CanvasText}main{max-width:34em;margin:0 auto}a{font-weight:600}</style></head>
<body><main><h1>Нет сети</h1><p>${ru[0]} ещё не скачана на это устройство. Откройте её один раз с интернетом — потом она будет работать и без сети.</p>
<p><a href="${ru[2]}">Открыть ${ru[1]}</a></p><hr><p lang="en">No connection. ${en[0]} is not downloaded on this device yet. Open it once while online — after that it works offline too. <a href="${ru[2]}">Open ${en[1]}</a></p></main></body></html>`;
  return new Response(html, {status:503, headers:{'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store'}});
}
/* оболочка в новый кеш: иконки — из кеша прежней версии, если там есть тот же адрес (тот же хэш — тот же файл), остальное — из сети */
async function fillShell(files) {
  const c = await caches.open(CACHE), old = (await caches.keys()).filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE), net = [];
  for (const f of files) {
    let hit = null;
    if (ICONS.includes(f)) for (const k of old) { hit = await (await caches.open(k)).match(f); if (hit) break; }
    if (hit) await c.put(f, hit); else net.push(f);
  }
  await c.addAll(net);
}
self.addEventListener('install', e => { e.waitUntil(wantedLangs().then(langs => fillShell(shellFor(langs)))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith(CACHE_PREFIX) && k !== CACHE) || k.startsWith(THUMBS_LEGACY)).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, {ignoreSearch:false})).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(async () => {
    const lang = e.request.url.includes('/en/') ? 'en' : 'ru';
    const index = await caches.open(CACHE).then(c => c.match(lang === 'en' ? './en/index.html' : './index.html'));
    return index || (e.request.mode === 'navigate' ? notDownloaded(lang) : Response.error());
  })));
});
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
  else if (e.data && e.data.type === 'lang') { const p = useLang(e.data.lang).catch(() => {}); if (e.waitUntil) e.waitUntil(p); }
});
