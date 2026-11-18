'use strict';
/* Язык при заходе на сайт (src/lang.js): корень сайта без сохранённого выбора открывает язык браузера, выбор
   переключателем и явная ссылка на язык запоминаются, переадресация — только с корня и без циклов. Языки — списком
   (сейчас ru и en; проверено и на трёх). */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const SRC = fs.readFileSync(path.join(__dirname, '../src/lang.js'), 'utf8');
const L = require('../src/lang.js');
const CFG = {langs:{ru:'', en:'en/'}, root:'ru', fallback:'en'};

test('new visitor on the root: Russian anywhere in navigator.languages keeps Russian, otherwise the first available language', () => {
  const t = (nav, saved = null) => L.langTarget(CFG, 'ru', saved, nav, null);
  assert.equal(t(['en-US', 'en']), 'en');
  assert.equal(t(['en-GB']), 'en');
  assert.equal(t(['de-DE', 'en-GB']), 'en', 'German first, English is the first available');
  assert.equal(t(['de-DE', 'fr']), 'en', 'no available language — the fallback');
  assert.equal(t(['ru-RU', 'en-US']), null);
  assert.equal(t(['en-US', 'de', 'ru']), null, 'Russian anywhere in the list keeps the Russian root');
  assert.equal(t(['RU']), null, 'case does not matter');
  assert.equal(t('en-US'), 'en', 'a single navigator.language string');
  assert.equal(t([]), 'en', 'nothing known — the fallback');
});
test('a saved choice decides on the root; other language pages never redirect by themselves', () => {
  assert.equal(L.langTarget(CFG, 'ru', 'ru', ['en-US'], null), null, 'chose Russian with an English browser');
  assert.equal(L.langTarget(CFG, 'ru', 'en', ['ru-RU'], null), 'en', 'chose English with a Russian browser');
  assert.equal(L.langTarget(CFG, 'ru', 'xx', ['ru-RU'], null), null, 'an unknown saved value is ignored');
  assert.equal(L.langTarget(CFG, 'ru', '{"a":1}', ['en-US'], null), 'en');
  for (const saved of [null, 'ru', 'en']) for (const nav of [['ru'], ['en-US'], ['de']]) assert.equal(L.langTarget(CFG, 'en', saved, nav, null), null, `/en/ stays (saved ${saved}, ${nav})`);
});
test('?lang= is an explicit choice on any page; unknown codes are ignored', () => {
  assert.equal(L.langTarget(CFG, 'ru', 'ru', ['ru'], 'en'), 'en');
  assert.equal(L.langTarget(CFG, 'en', 'en', ['en'], 'ru'), 'ru');
  assert.equal(L.langTarget(CFG, 'ru', 'en', ['en'], 'ru'), null, 'asked for the page language — stay, even with another choice saved');
  assert.equal(L.langTarget(CFG, 'ru', null, ['en-US'], 'de'), 'en', 'unknown ?lang= — as without it');
  assert.equal(L.langRemember(CFG, 'ru', null), null, 'the root without a choice remembers nothing');
  assert.equal(L.langRemember(CFG, 'en', null), 'en', 'an open /en/ page is a choice');
  assert.equal(L.langRemember(CFG, 'en', 'ru'), 'ru');
  assert.equal(L.langRemember(CFG, 'ru', 'zz'), null);
});
test('the address keeps the site folder, the file, the query (without lang) and the hash', () => {
  const u = (page, target, pathname, search = '', hash = '') => L.langUrl(CFG, page, target, {pathname, search, hash});
  assert.equal(u('ru', 'en', '/'), '/en/');
  assert.equal(u('ru', 'en', '/Lazy-gym-planner/'), '/Lazy-gym-planner/en/');
  assert.equal(u('ru', 'en', '/app/index.html', '?perf=1', '#plan'), '/app/en/index.html?perf=1#plan');
  assert.equal(u('ru', 'en', '/app/', '?lang=en&x=1', '#a'), '/app/en/?x=1#a');
  assert.equal(u('en', 'ru', '/app/en/', '?lang=ru'), '/app/');
  assert.equal(u('en', 'ru', '/app/en/index.html', '?a=1&lang=ru&b=2'), '/app/index.html?a=1&b=2');
  assert.equal(u('en', 'en', '/app/en/', '?lang=en'), '/app/en/', 'the same page without the parameter');
  const three = {langs:{ru:'', en:'en/', de:'de/'}, root:'ru', fallback:'en'};
  assert.equal(L.langUrl(three, 'de', 'en', {pathname:'/app/de/', search:'', hash:''}), '/app/en/');
  assert.equal(L.langTarget(three, 'ru', null, ['de-AT', 'en'], null), 'de', 'a third language is picked from the list like the others');
  assert.equal(L.langTarget(three, 'ru', null, ['fr', 'pl'], null), 'en');
});

/* скрипт на странице: настоящий src/lang.js в песочнице с адресом, хранилищем и языками браузера */
function visit(store, href, {nav = ['en-US'], ua = 'Mozilla/5.0', cfg = CFG} = {}) {
  const url = new URL(href, 'https://site.invalid/');
  const page = Object.keys(cfg.langs).filter(l => cfg.langs[l]).find(l => url.pathname.includes('/' + cfg.langs[l])) || cfg.root;
  let replaced = null, rewritten = null, click = null;
  const ctx = {PODHOD_LANGS:{...cfg, page}, navigator:{languages:nav, language:nav[0], userAgent:ua},
    localStorage:{getItem:k => store.has(k) ? store.get(k) : null, setItem:(k, v) => store.set(k, String(v))},
    location:{pathname:url.pathname, search:url.search, hash:url.hash, replace:u => { replaced = u; }},
    history:{state:null, replaceState:(s, t, u) => { rewritten = u; }},
    document:{addEventListener:(type, fn, capture) => { if (type === 'click' && capture) click = fn; }}};
  vm.runInNewContext(SRC, ctx);
  const tap = lang => click({target:{closest:sel => sel === 'a[hreflang]' ? {getAttribute:() => lang} : null}});
  return {replaced, rewritten, tap, saved:store.get(L.KEY) ?? null};
}
test('in the browser: an English visitor is sent to /en/, the switch to Russian is remembered, an explicit /en/ link changes the choice', () => {
  const store = new Map();
  assert.equal(visit(store, '/app/?x=1#top').replaced, '/app/en/?x=1#top', 'en-US on the root → /en/ with query and hash');
  assert.equal(store.get(L.KEY), undefined, 'the redirect itself does not decide for the person');
  const en = visit(store, '/app/en/?x=1#top');
  assert.equal(en.replaced, null, '/en/ does not redirect'); assert.equal(store.get(L.KEY), 'en', 'the open English page is remembered');
  en.tap('ru'); assert.equal(store.get(L.KEY), 'ru', 'the RU switch remembers Russian before leaving');
  assert.equal(visit(store, '/app/').replaced, null, 'the root opens Russian now, no loop back to English');
  assert.equal(visit(store, '/app/index.html').replaced, null, 'and after a reload');
  visit(store, '/app/en/');
  assert.equal(store.get(L.KEY), 'en', 'a link to /en/ is an explicit choice');
  assert.equal(visit(store, '/app/').replaced, '/app/en/', 'the root follows the new choice');
});
test('in the browser: Russian visitors stay, ?lang= switches and is removed from the address, robots are not redirected', () => {
  const ru = new Map();
  assert.equal(visit(ru, '/', {nav:['ru-RU', 'en-US']}).replaced, null);
  assert.equal(visit(ru, '/', {nav:['en-US', 'ru']}).replaced, null, 'Russian second in the list');
  assert.equal(ru.size, 0, 'nothing saved while nobody chose');
  const s = new Map([[L.KEY, 'en']]);
  const back = visit(s, '/app/?lang=ru&a=1');
  assert.equal(back.replaced, null); assert.equal(back.rewritten, '/app/?a=1', 'the parameter is removed'); assert.equal(s.get(L.KEY), 'ru');
  assert.equal(visit(s, '/app/en/?lang=ru').replaced, '/app/', 'an explicit ?lang=ru on /en/ goes to the root');
  assert.equal(visit(new Map(), '/app/', {ua:'Mozilla/5.0 (compatible; Googlebot/2.1)'}).replaced, null, 'a search robot sees the root in Russian');
  const three = {langs:{ru:'', en:'en/', de:'de/'}, root:'ru', fallback:'en'};
  assert.equal(visit(new Map(), '/app/', {nav:['de-DE'], cfg:three}).replaced, '/app/de/');
});
test('without the language list (offline file, Floot document) the script changes nothing', () => {
  let replaced = false;
  vm.runInNewContext(SRC, {navigator:{languages:['en-US']}, localStorage:{getItem:() => null, setItem() { throw new Error('no write'); }}, location:{pathname:'/', search:'', hash:'', replace:() => { replaced = true; }}});
  assert.equal(replaced, false);
});
test('the build puts the language script into the PWA pages only, never into the offline files that Floot embeds', () => {
  const build = fs.readFileSync(path.join(__dirname, '../build.js'), 'utf8');
  const pwa = build.indexOf('/* 1. PWA */'), offline = build.indexOf('/* 2. офлайн-файл');
  assert(pwa > 0 && offline > pwa);
  const at = build.indexOf('${langSrc}');
  assert(at > pwa && at < offline, 'langSrc is used in the PWA index.html template');
  assert.equal(build.indexOf('${langSrc}', at + 1), -1, 'and nowhere else');
  /* 4.111 (Кира 17): офлайн-файл собирается из двух частей — заголовок со стилями (singleHead, в <head>) и разметка с кодом
     (singleBody, в <body>), чтобы «</head><body>» был один; в обеих — ни выбора языка, ни списка языков */
  for (const part of ['singleHead', 'singleBody']) {
    const re = new RegExp(`const ${part} = [^\\n]*`);
    assert.match(build, re); assert.doesNotMatch(build.match(re)[0], /langSrc|PODHOD_LANGS/);
  }
});
