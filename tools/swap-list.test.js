'use strict';
/* «Заменить» — короткий список на выбор (12c-swap.js): до пяти ближайших замен по близости со строкой «что меняется»;
   без того, что уже в плане и в других днях недели; по правилам места, уровня и бережного режима («Беречь колени» — без
   глубокого сгиба стоя). Близких нет — так и сказано, и одно-два упражнения другим движением. «Вернуть» после замены
   и после «Убрать» в своём плане возвращает прежнее одним нажатием; строка держится до следующего изменения плана.
   Поведение в браузере (раскрытие, фокус, Esc, страница не прыгает) — tools/ui-check.mjs. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; renderPlan=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S,EX,EXI,PATTERN,PLACE_DEFAULTS,ensurePlaces,ensureCustoms,customOf,openCustom,swapOptions,swapCandidates,swapPickHtml,swapDoneHtml,rmGoneHtml,
    swapSet,swapBack,rmItem,rmBack,swapFits,available,stressIdsOf,stressKneeDeep,PROTECT_BY,customSet,blocksHtml,cardHtml})`);
  a.m = m;
  a.place = id => { a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.place = id; a.S.adapt = null; a.ensurePlaces(a.S); };
  a.reset = (o = {}) => {
    a.place(o.place || 'gym');
    Object.assign(a.S, { view: 'plan', mode: 'single', format: 'classic', goal: 'mass', level: 'mid', groups: ['chest', 'back', 'shoulders'], count: 6, seed: 7,
      days: 3, split: 'full', week: 1, day: 0, protect: [], focus: null, fold: null }, o);
    m.get('swaps = S.swaps = {}; planUndo = null; done = {}');
  };
  /* как renderPlan, без страницы: план открытого режима и дня */
  a.render = () => m.get(`(() => { if (S.mode === 'program') { prog = buildProgram(); plan = prog.days[S.day].plan; } else { prog = null; plan = buildPlan({swaps:swaps.s || {}, order:swaps.__order?.s}); } return plan; })()`);
  a.undo = () => m.get('planUndo');
  return a;
}
const reEsc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ids = p => plain((p.items || []).map(it => it.ex.id));
const slotOf = (p, id) => p.items.find(it => it.ex.id === id)?.slot;
/* поставить упражнение id в карточку slot собранного плана (как выбор в списке) и пересобрать */
function put(a, slot, id) { assert(a.swapSet(slot, id), `swap ${slot} → ${id}`); return a.render(); }

test('the list: up to five closest swaps, closest first, each says what changes; nothing already in the plan', () => {
  const a = app(); a.reset();
  let p = a.render();
  if (slotOf(p, 'bbbench') === undefined) { p = put(a, p.items.find(it => it.ex.g === 'chest').slot, 'bbbench'); a.m.get('planUndo = null'); }
  const bench = p.items.find(it => it.ex.id === 'bbbench'), o = a.swapOptions(bench.ex, p);
  assert(o.close.length >= 3 && o.close.length <= 5, `3–5 swaps for the bench press: ${o.close.length}`);
  assert.equal(o.far.length, 0, 'with close swaps there are no «another movement» rows');
  assert.equal(o.close[0].ex.id, 'dbbench', 'the dumbbell bench press first');
  assert.match(o.close[0].note, /гантели/, 'the note names what changes: ' + o.close[0].note);
  for (const it of p.items) {
    const { close, far } = a.swapOptions(it.ex, p), list = close.concat(far);
    assert(list.length <= 5);
    for (let i = 1; i < close.length; i++) assert(close[i - 1].score >= close[i].score, `${it.ex.id}: sorted by similarity`);
    for (const r of list) {
      assert(!ids(p).includes(r.ex.id), `${it.ex.id} → ${r.ex.id}: already in the plan`);
      assert(r.ex !== it.ex && a.available(r.ex, p.E) && a.swapFits(r.ex), `${it.ex.id} → ${r.ex.id}: available and fits`);
      assert(typeof r.note === 'string' && r.note.length > 3, `${it.ex.id} → ${r.ex.id}: says what changes`);
    }
    for (const r of close) assert.equal(a.PATTERN[r.ex.id], a.PATTERN[it.ex.id], `${it.ex.id} → ${r.ex.id}: a close swap is the same movement`);
  }
  /* отчёты тестеров: подъём перед собой не уходит в «лодочку», румынская тяга — не в махи и рывок гири */
  for (const [id, pat] of [['frontraise', 'raise'], ['rdl', 'hinge']]) {
    const { close } = a.swapOptions(a.EXI[id], p);
    assert(close.length >= 3, id);
    for (const r of close) assert.equal(a.PATTERN[r.ex.id], pat, `${id} → ${r.ex.id}`);
    assert(!close.some(r => ['superman', 'kbswing', 'kbswing1', 'kbsnatch', 'kbclean'].includes(r.ex.id)), `${id}: ${plain(close.map(r => r.ex.id))}`);
  }
  /* хваты той же карточки — в переключателе «Хват», не в списке */
  assert(!a.swapOptions(a.EXI.pullup, p).close.some(r => r.ex.id === 'chinup'), 'chin-ups are a grip switch of the pull-up card');
  /* разметка: подпись группы, пункты — кнопки с названием и строкой «что меняется» */
  const html = a.swapPickHtml(bench);
  assert.match(html, new RegExp(`^<p class="cp-pick-h" id="sw-pick-${bench.slot}-h">Чем заменить</p><button type="button" class="place cp-pick-i" data-swap-to="dbbench"><span class="cp-pick-n"><b>Жим гантелей лёжа</b><small>`));
  const card = a.cardHtml(bench, 0);
  assert.match(card, new RegExp(`data-swap="${bench.slot}" aria-expanded="false" aria-controls="sw-pick-${bench.slot}"`));
  assert.match(card, new RegExp(`<div class="cp-pick sw-pick" id="sw-pick-${bench.slot}" role="group" aria-labelledby="sw-pick-${bench.slot}-h" hidden></div>`));
});

test('a weekly programme: no swap repeats another day; a swap on one day leaves the other days as they were', () => {
  for (const place of ['gym', 'home']) for (const seed of [7, 23]) {
    const a = app(); a.reset({ mode: 'program', place, seed });
    a.render();
    const week = () => plain(a.m.get('prog.days.map(d => (d.plan.items || []).map(it => it.ex.id))'));
    const before = week(), all = new Set(before.flat());
    for (let d = 0; d < before.length; d++) {
      a.S.day = d; const p = a.render();
      for (const it of p.items) {
        const { close, far } = a.swapOptions(it.ex, p);
        for (const r of close.concat(far)) assert(!all.has(r.ex.id), `${place} ${seed} day ${d}: ${it.ex.id} → ${r.ex.id} is already in the week`);
        for (const x of a.swapCandidates(it.ex, p)) assert(!all.has(x.id), `${place} ${seed} day ${d}: candidate ${x.id} is already in the week`);
      }
    }
    a.S.day = 0; let p = a.render();
    /* с 4.104.0 в каждом дне «Всё тело» есть тяга (11-planner.js): дома все тяги на ленте и полотенце уже заняты в неделе,
       и у первой карточки близкой замены может не быть — берётся первая карточка, у которой она есть */
    const it0 = p.items.find(it => a.swapOptions(it.ex, p).close.length);
    const slot = it0.slot, next = a.swapOptions(it0.ex, p).close[0].ex.id;
    p = put(a, slot, next);
    const after = week();
    assert(after[0].includes(next) && !before[0].includes(next), 'the swap is in day 1');
    assert.deepEqual(after.slice(1), before.slice(1), `${place} ${seed}: the other days stay as they were`);
    assert.equal(a.S.swaps.d0[slot], next, 'stored per day');
    assert(a.swapBack()); a.render();
    assert.deepEqual(week(), before, '«Вернуть» restores the week exactly');
  }
});

test('«Protect knees» (gentle too): swaps never bend the knee deeply standing and never load a protected joint', () => {
  const a = app();
  const rules = new Set(a.PROTECT_BY.knees.rules);
  let squats = 0;
  for (const goal of ['mass', 'gentle']) for (const place of ['gym', 'home', 'street']) for (const groups of [['quads', 'glutes', 'hams'], ['quads', 'glutes', 'hams', 'calves', 'abs']]) {
    a.reset({ goal, place, groups, protect: ['knees'], count: 6 });
    const p = a.render();
    for (const it of p.items || []) {
      if (a.PATTERN[it.ex.id] === 'squat') squats++;
      const { close, far } = a.swapOptions(it.ex, p);
      for (const r of close.concat(far)) {
        assert(!a.stressKneeDeep(r.ex), `${goal} ${place}: ${it.ex.id} → ${r.ex.id}: deep knee bend standing`);
        assert(!a.stressIdsOf(r.ex).some(x => rules.has(x)), `${goal} ${place}: ${it.ex.id} → ${r.ex.id}: loads the knees`);
      }
    }
  }
  assert(squats > 0, 'there were squat-pattern cards to swap');
  /* сам присед: в зале без защиты есть что предложить, с «Беречь колени» — только без глубокого сгиба */
  a.reset({ groups: ['quads', 'glutes', 'hams'] }); let p = a.render();
  const free = a.swapOptions(a.EXI.squat, p).close.map(r => r.ex.id);
  assert(free.some(id => a.stressKneeDeep(a.EXI[id])), 'without protection deep squats are offered — the check above is not empty');
  a.reset({ groups: ['quads', 'glutes', 'hams'], protect: ['knees'] }); p = a.render();
  for (const r of [...a.swapOptions(a.EXI.squat, p).close, ...a.swapOptions(a.EXI.squat, p).far]) assert(!a.stressKneeDeep(r.ex), r.ex.id);
});

test('no close swaps: said honestly, with one or two exercises of another movement — or nothing', () => {
  const a = app(); a.reset({ place: 'street' });
  let p = a.render();
  if (slotOf(p, 'pullup') === undefined) { p = put(a, p.items.find(it => it.ex.g === 'back').slot, 'pullup'); a.m.get('planUndo = null'); }
  const it = p.items.find(x => x.ex.id === 'pullup'), o = a.swapOptions(it.ex, p);
  assert.equal(o.close.length, 0, 'no other vertical pull on the street');
  assert(o.far.length >= 1 && o.far.length <= 2, `one or two from another movement: ${plain(o.far.map(r => r.ex.id))}`);
  for (const r of o.far) { assert.notEqual(a.PATTERN[r.ex.id], 'vpull'); assert.match(r.note, /^другое движение: /); }
  const html = a.swapPickHtml(it);
  assert.match(html, /Чем заменить<\/p><p class="sw-none">Близких замен нет\. На те же мышцы — другое движение:<\/p><button/);
  /* нечем вовсе: дома, бережно, «Беречь колени» — гоблет-присед */
  a.reset({ place: 'home', goal: 'gentle', groups: ['quads', 'glutes', 'hams'], protect: ['knees'] }); p = a.render();
  const none = a.swapOptions(a.EXI.goblet, p);
  assert.equal(none.close.length + none.far.length, 0, plain(none));
  assert.match(a.swapPickHtml({ ex: a.EXI.goblet, slot: 9, name: 'Гоблет' }), /<p class="sw-none">Близких замен нет: другие упражнения на эти мышцы уже в плане, здесь недоступны или не подходят бережному режиму\.<\/p>$/);
});

test('«Вернуть» after a swap restores the previous exercise in one press; the line lives until the next plan change', () => {
  const a = app(); a.reset();
  let p = a.render();
  const first = ids(p), seed = a.S.seed, it = p.items[0], slot = it.slot;
  const [b, c] = a.swapOptions(it.ex, p).close.map(r => r.ex.id);
  p = put(a, slot, b);
  assert.equal(p.items.find(x => x.slot === slot).ex.id, b);
  const line = a.swapDoneHtml(p.items.find(x => x.slot === slot));
  assert.match(line, new RegExp(`^<p class="sw-done"><span id="sw-done-${slot}">Заменено: ${reEsc(it.name)} → ${reEsc(p.items.find(x => x.slot === slot).name)}\\.</span><button type="button" class="sw-undo" data-swap-undo="1" aria-describedby="sw-done-${slot}">Вернуть</button></p>$`));
  assert.equal(a.swapDoneHtml(p.items.find(x => x.slot !== slot)), '', 'only on the swapped card');
  assert.equal(JSON.parse(a.m.get('localStorage.getItem(STORE)')).swaps.s[slot], b, 'the swap is saved');
  /* перезапуск: замена на месте, подбор тот же, строки «Вернуть» нет */
  const b2 = app(); b2.m.get(`localStorage.setItem(STORE, ${JSON.stringify(a.m.get('localStorage.getItem(STORE)'))}); Object.assign(S, loadSettings()); swaps = S.swaps; ensurePlaces(S);`);
  const q = b2.render();
  assert.deepEqual(ids(q), ids(p), 'after a restart the plan is the same, with the swap');
  assert.equal(b2.S.seed, seed);
  assert(!q.items.some(x => b2.swapDoneHtml(x)), 'no «Undo» line after a restart');
  /* «Вернуть» — к подобранному: в сохранённых заменах этой карточки больше ничего нет */
  assert(a.swapBack()); p = a.render();
  assert.deepEqual(ids(p), first, 'back to the generated plan');
  assert(!(slot in a.S.swaps.s), 'nothing left in the saved swaps');
  assert(!p.items.some(x => a.swapDoneHtml(x)), 'the line is gone');
  /* две замены подряд: «Вернуть» — к предыдущей, а не к исходной; шаг назад один */
  put(a, slot, b); p = put(a, slot, c);
  assert(a.swapBack()); p = a.render();
  assert.equal(p.items.find(x => x.slot === slot).ex.id, b, 'back to the previous swap');
  assert.equal(a.undo(), null); assert.equal(a.swapBack(), false, 'one undo step');
  /* строка уходит при следующем изменении плана: смена параметров (regen) */
  p = put(a, slot, c); assert(a.swapDoneHtml(p.items.find(x => x.slot === slot)));
  a.m.get('regen()'); p = a.render();
  assert.equal(a.undo(), null); assert.deepEqual(ids(p), first, 'a new setting rebuilds the plan from scratch, as before');
});

test('a swap in a custom plan keeps sets, weight and note; «Вернуть» is bound to that plan', () => {
  const a = app(); a.reset({ mode: 'custom' });
  a.S.customs = [{ id: 'up', name: 'Верх', items: [{ id: 'bbbench', sets: 5, kg: [60], note: 'пауза' }, { id: 'latpull' }] }, { id: 'low', name: 'Низ', items: [{ id: 'squat' }] }];
  a.ensureCustoms(a.S); a.openCustom('up');
  let p = a.render();
  const next = a.swapOptions(a.EXI.bbbench, p).close[0].ex.id;
  p = put(a, 0, next);
  assert.deepEqual(plain(a.customOf().items[0]), { id: next, sets: 5, kg: [60], note: 'пауза' });
  assert.match(a.swapDoneHtml(p.items[0]), /Заменено: Жим штанги лёжа → /);
  a.openCustom('low'); p = a.render();
  assert.equal(a.swapBack(), false, 'another plan open — nothing to undo there');
  a.openCustom('up'); p = a.render();
  assert(a.swapDoneHtml(p.items[0]), 'back in the plan — the line is there');
  assert(a.swapBack()); a.render();
  assert.deepEqual(plain(a.customOf().items[0]), { id: 'bbbench', sets: 5, kg: [60], note: 'пауза' });
  /* правка подходов — изменение плана: «Вернуть» после неё не действует */
  put(a, 0, next); a.customSet(0, 'sets', 3);
  assert.equal(a.undo(), null);
});

test('«Убрать» → «Вернуть»: the card comes back to its place with its sets, weight and note', () => {
  const a = app(); a.reset({ mode: 'custom' });
  a.S.customs = [{ id: 'up', name: 'Верх', items: [{ id: 'bbbench', sets: 5, kg: [60], note: 'пауза' }, { id: 'latpull' }, { id: 'ohp' }] }];
  a.ensureCustoms(a.S); a.openCustom('up');
  let p = a.render();
  assert(a.rmItem(0)); p = a.render();
  assert.deepEqual(plain(a.customOf().items.map(x => x.id)), ['latpull', 'ohp'], 'removed at once, without a confirmation');
  assert.equal(a.rmGoneHtml(), '<li class="sw-gone"><span id="sw-gone-t">Убрано: Жим штанги лёжа.</span><button type="button" class="sw-undo" data-rm-undo="1" aria-describedby="sw-gone-t">Вернуть</button></li>');
  let html = a.blocksHtml(p);
  assert(html.indexOf('class="sw-gone"') < html.indexOf('data-slot="0"'), '«Removed» stands where the card was — before the next card');
  assert.equal(a.rmBack(), 0); p = a.render();
  assert.deepEqual(plain(a.customOf().items), [{ id: 'bbbench', sets: 5, kg: [60], note: 'пауза' }, { id: 'latpull' }, { id: 'ohp' }]);
  assert.equal(a.rmGoneHtml(), ''); assert.equal(a.rmBack(), -1, 'one undo step');
  /* последняя карточка: строка после неё */
  assert(a.rmItem(2)); p = a.render(); html = a.blocksHtml(p);
  assert(html.indexOf('class="sw-gone"') > html.lastIndexOf('data-slot="1"') && html.indexOf('class="sw-gone"') < html.lastIndexOf('</ol>'), 'after the last card');
  assert.equal(a.rmBack(), 2); assert.deepEqual(plain(a.customOf().items.map(x => x.id)), ['bbbench', 'latpull', 'ohp']);
  /* единственное упражнение: план пуст, «Вернуть» — над пустым планом */
  a.S.customs[0].items = [{ id: 'ohp' }]; a.render();
  assert(a.rmItem(0)); assert.equal(a.render().empty, 'custom');
  assert.match(a.rmGoneHtml('div'), /^<div class="sw-gone">.*Убрано: Жим штанги стоя\./);
  assert.equal(a.rmBack(), 0); assert.deepEqual(plain(a.customOf().items), [{ id: 'ohp' }]);
  /* упражнение тем временем снова добавили из атласа — возвращать нечего, повтора нет */
  a.S.customs[0].items = [{ id: 'ohp' }, { id: 'latpull' }]; a.render();
  assert(a.rmItem(0)); a.m.get(`customAddTo('ohp', 'up')`);
  assert.equal(a.rmBack(), -1); assert.deepEqual(plain(a.customOf().items.map(x => x.id)), ['latpull', 'ohp']);
});
