'use strict';
/* Витрина атласа движений: «Чем работать» для каждого упражнения, фильтры и разделы по группам мышц. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const m = loadModel({ fullApp: true });
m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
const a = m.get('({S,EX,EXI,GROUPS,GALLERY_GROUPS,galleryGroup,WORK_KINDS,workKind,gallery,galleryList,galleryHtml,ensurePlaces,PLACE_DEFAULTS,effEquip,available})');
function reset(extra = {}) {
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.ensurePlaces(a.S);
  Object.assign(a.gallery, { kind: 'all', here: false, q: '' }, extra);
}

test('every exercise has exactly one kind; machines, free weights, bands and bodyweight are told apart', () => {
  const kinds = new Set(a.WORK_KINDS.map(k => k.id));
  for (const ex of a.EX) assert(kinds.has(a.workKind(ex)) && a.workKind(ex) !== 'all', ex.id);
  const expect = { latpull: 'mach', cablerow: 'mach', legpress: 'mach', smithincline: 'mach', bbbench: 'free', dbcurl: 'free', kbswing: 'free',
    bandrow: 'band', bandcurl: 'band', pushup: 'body', pullup: 'body', dip: 'body', crunch: 'body' };
  for (const [id, k] of Object.entries(expect)) if (a.EXI[id]) assert.equal(a.workKind(a.EXI[id]), k, id);
  reset();
  const counts = a.WORK_KINDS.filter(k => k.id !== 'all').map(k => a.galleryList(k.id).length);
  assert.equal(counts.reduce((x, y) => x + y, 0), a.EX.length, 'the kinds split the catalogue without overlap');
});

test('filters: kind, only-here, search; sections follow muscle groups', () => {
  reset({ kind: 'band' });
  assert(a.galleryList().length > 0 && a.galleryList().every(ex => a.workKind(ex) === 'band'));
  reset({ here: true }); a.S.place = 'home'; a.ensurePlaces(a.S);
  const E = a.effEquip(a.S.equip), here = a.galleryList();
  assert(here.length > 0 && here.length < a.EX.length && here.every(ex => a.available(ex, E)), 'only what is available at home');
  reset({ q: 'ТЯГА верхнего' });
  assert.deepEqual(plain(a.galleryList().map(ex => ex.id)).sort(), ['latpull', 'latpulluh', 'latpullv'], 'case-insensitive name search');
  reset();
  const html = a.galleryHtml(), order = [...html.matchAll(/id="mv-g-(\w+)"/g)].map(x => x[1]);
  assert.deepEqual(order, plain(a.GALLERY_GROUPS.map(g => g.id).filter(g => a.EX.some(ex => a.galleryGroup(ex) === g))), 'one section per muscle group, in the usual order');
  /* приводящие — своим разделом после квадрицепса, не среди упражнений на квадрицепс (4.110, Alex 18); с 4.109 это и своя
     группа плана (решение владельца 15.11.2026) — раздел витрины тот же, а ex.g — 'adductors', а не 'quads' */
  assert.deepEqual(order.slice(order.indexOf('quads'), order.indexOf('quads') + 2), ['quads', 'adductors']);
  for (const id of ['copenhagen', 'copenhagenknee', 'adduction', 'cableadduct', 'bandadduct']) {
    assert.equal(a.galleryGroup(a.EXI[id]), 'adductors', id); assert.equal(a.EXI[id].g, 'adductors', id + ': own plan group');
    assert.match(html, new RegExp(`id="mv-g-adductors"[^]*?data-gallery-open="${id}"[^]*?id="mv-g-hams"`), id + ' in the adductors section');
  }
  assert.equal([...html.matchAll(/data-gallery-open=/g)].length, a.EX.length);
  a.S.place = 'home'; a.ensurePlaces(a.S);
  assert.match(a.galleryHtml(), /class="mv-tile off" data-gallery-open="bbbench"[\s\S]*?Нет в месте «Дом», нужно: штанга/, 'an exercise not available here says what it needs');
  /* пусто: при «Всё» — без совета выбрать «Всё» (замечание 20 тестера); из-за фильтра — сколько без него и кнопка */
  reset({ q: 'zzz' });
  assert.match(a.galleryHtml(), /<p class="mv-gcount none" aria-live="polite">Ничего не нашлось\.<\/p>/);
  assert.doesNotMatch(a.galleryHtml(), /Выберите «Всё»/);
  reset({ q: 'жим', kind: 'body' });
  const none = a.galleryHtml();
  assert(!a.galleryList().length, 'no bodyweight presses');
  assert.match(none, /<p class="mv-gcount none" aria-live="polite">С этими фильтрами ничего не нашлось\.<\/p>[\s\S]*<div class="mv-gempty"><button type="button" class="btn-ghost" data-gallery-all="1">Искать во всех: \d+<\/button>/, 'nothing among bodyweight exercises — offer all');
});
