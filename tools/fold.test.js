'use strict';
/* Сворачивание блоков: состояние в настройках, вид карточек «Компактно / Подробно», карточка в обоих видах,
   сводки для свёрнутых параметров и нагрузки. Поведение кнопок в браузере — tools/ui-check.mjs. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S,EXI,buildPlan,ensureFold,cardOpen,cardFold,cardHtml,logRows,setupSummary,loadTop,PLACE_DEFAULTS,ensurePlaces,ensureCustoms,MUSCLE_NAMES})`);
  a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
  Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 5, groups: ['chest', 'back', 'shoulders'], seed: 3, fold: null });
  a.ensureCustoms(a.S); a.ensureFold(a.S);
  a.m = m;
  return a;
}

test('fold settings: compact cards by default, garbage replaced, kept in the backup', () => {
  const a = app();
  assert.deepEqual(plain(a.S.fold), { setup: false, load: false, cards: 'compact', gentle: false });
  a.S.fold = { setup: 'yes', load: true, cards: 'tiny', extra: 1 };
  assert.deepEqual(plain(a.ensureFold(a.S)), { setup: false, load: true, cards: 'compact', gentle: false }, 'only known values survive');
  a.S.fold = 'broken'; a.ensureFold(a.S);
  assert.equal(a.S.fold.cards, 'compact');
  a.S.fold = { setup: true, load: true, cards: 'full', gentle: true };
  assert.deepEqual(plain(a.m.get('backupObject()')).settings.fold, { setup: true, load: true, cards: 'full', gentle: true }, 'the backup carries the view');
});

test('cards: compact folds muscles and the set table, keeps the weight hint; a card can be opened on its own', () => {
  const a = app();
  const it = a.buildPlan().items[0], id = it.ex.id;
  let html = a.cardHtml(it, 0);
  assert.match(html, /^<li class="card" data-ex=/, 'compact: no open groups');
  assert.match(html, /data-cfold="mus" aria-expanded="false"/);
  const main = it.ex.pri.map(m => a.MUSCLE_NAMES[m])[0];
  assert(html.includes(`<span class="cg-p">${main}`), 'the folded line names the main muscles');
  const log = a.logRows(it).html;
  assert.match(log, /class="sug /, 'the hint stays outside the folded part');
  assert.match(log, /data-cfold="log" aria-expanded="false"/);
  assert.match(log, new RegExp(`0 из ${it.rx.sets}<`), 'how many sets are logged');
  assert(log.indexOf('class="sug ') < log.indexOf('lt-fold') && log.indexOf('data-cfold="log"') < log.indexOf('lt-fold'), 'hint and toggle come before the table');
  assert.match(log, /data-hist="1"/, 'history is reachable while folded');
  a.cardFold.set('log:' + id, true);
  assert.equal(a.cardOpen('log', id), true); assert.equal(a.cardOpen('mus', id), false);
  assert.match(a.cardHtml(it, 0), /^<li class="card open-log"/, 'a card opened by hand stays open after re-rendering');
  a.cardFold.clear(); a.S.fold.cards = 'full';
  html = a.cardHtml(it, 0);
  assert.match(html, /^<li class="card open-mus open-log"/, 'detailed view opens everything');
  assert.match(a.logRows(it).html, /data-cfold="log" aria-expanded="true"/);
});

test('folded summaries: settings show what is selected, load shows the top three', () => {
  const a = app();
  const chips = s => [...a.setupSummary().matchAll(/data-sgo="([^"]+)">([^<]+)</g)].map(m => [m[1], m[2]]);
  assert.deepEqual(chips(), [['#f-mode', 'Тренировка на день'], ['#f-goal', 'Масса · классика · уже тренируюсь'], ['#count-l', '5 упражнений'], ['#f-muscles', 'Грудь, спина и плечи'], ['#e-places', 'Зал']]);
  Object.assign(a.S, { mode: 'program', days: 4 });
  const p = chips();
  assert.equal(p[0][1], 'Программа на неделю'); assert.match(p[1][1], /^4 тренировки · /);
  assert(!p.some(c => c[0] === '#f-muscles'), 'muscles are not a setting of a program');
  Object.assign(a.S, { mode: 'custom' }); a.S.customs[0].name = 'Ноги дома';
  assert.deepEqual(chips().slice(0, 2), [['#f-mode', 'Свой план'], ['#f-custom', 'Ноги дома']]);
  assert.equal(a.loadTop([['Грудные', 12], ['Передняя дельта', 8.5], ['Трицепс', 6], ['Бицепс', 2]]), 'Грудные 12, передняя дельта 8,5, трицепс 6');
});
