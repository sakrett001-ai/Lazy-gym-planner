/* ===================== «ЗАМЕНИТЬ» И «ВЕРНУТЬ» =====================
   «Заменить» в карточке раскрывает прямо под кнопкой короткий список на выбор (как список планов у «+ В свой план»,
   11d-custom.js): до пяти ближайших замен по смыслу — то же движение, те же мышцы (analogScore, 11b-analogs.js) — и одной
   строкой, что меняется. В списке нет того, что уже стоит в этом плане и (в программе на неделю) в других днях недели,
   и хватов той же карточки (они — в переключателе «Хват», 11h-variants.js); подбор — по тем же правилам, что план:
   инвентарь места, уровень, статодинамика, «Беречь суставы» и бережный режим (swapFits, 11g-gentle.js).
   Близких замен нет — так и сказано, и, если есть, одно-два упражнения на те же мышцы другим движением.
   После выбора в карточке строка «Заменено: … → …» с кнопкой «Вернуть»; «Убрать» в своём плане оставляет на месте
   карточки «Убрано: … Вернуть». Одно нажатие возвращает прежнее; строка держится до следующего изменения плана
   или перезагрузки (planUndo, 11-planner.js). Страница не прыгает: нажатая кнопка остаётся на том же месте экрана. */
const SWAP_LIMIT = 5, SWAP_FAR = 2;
/* то же движение — близкая замена, если похоже не меньше чем на SWAP_CLOSE_MIN; другое движение — от SWAP_FAR_MIN */
const SWAP_CLOSE_MIN = .45, SWAP_FAR_MIN = .3;

/* что уже занято: этот план, свой план целиком (и то, что в нём заменено из-за места или суставов), другие дни недели */
function swapTaken(p) {
  const ids = new Set((p.items || []).map(it => it.ex.id));
  if (S.mode === 'custom') for (const it of customOf().items) ids.add(it.id);
  if (S.mode === 'program' && prog) for (const d of prog.days) for (const it of d.plan.items || []) ids.add(it.ex.id);
  return ids;
}
/* все допустимые по инвентарю, уровню и формату — от самых похожих; суставы проверяются позже (расчёт дорогой) */
function swapPool(cur, p) {
  const taken = swapTaken(p), lvlMax = S.level === 'beg' || S.goal === 'gentle' ? 2 : 3, pat = PATTERN[cur.id];
  for (const x of variantsFor(cur, p.E, taken)) taken.add(x.ex.id);
  taken.add(cur.id);
  /* уже тренирующемуся и опытному облегчённые варианты (гравитрон, отжимания и тяги без веса там, где есть то же движение
     с весом) — после вариантов с весом, как в подборе плана (lightAlt, 11-planner.js). Было: для тяги верхнего блока V первым
     стоял гравитрон, для жима узким — брусья в гравитроне (Игорь 15) */
  const lightLast = S.level !== 'beg' ? swapLight(p.E) : () => false;
  return EX.filter(ex => !taken.has(ex.id) && available(ex, p.E) && ex.lvl <= lvlMax && (ex.g === cur.g || (!!pat && PATTERN[ex.id] === pat)) && (S.format !== 'static' || staticOk(ex)))
    /* на одной ноге или руке вместо упражнения двумя — дальше (Марина 18: для румынской тяги — гиперэкстензия и наклоны, а не
       только тяга на одной ноге) */
    .map(ex => ({ex, score:analogScore(cur, ex) - (lightLast(ex) ? 0.25 : 0) - (!cur.uni && ex.uni ? 0.08 : 0)})).sort((a, b) => b.score - a.score);
}
/* облегчённое там, где есть то же движение с весом: противовес гравитрона, многосуставное без веса */
function swapLight(E) {
  const loaded = new Set(EX.filter(ex => !ex.assist && available(ex, E) && weighable(ex, E) && PATTERN[ex.id]).map(ex => famOf(PATTERN[ex.id])));
  return ex => !!PATTERN[ex.id] && loaded.has(famOf(PATTERN[ex.id])) && (ex.assist || (ex.type === 'c' && !ex.kind && ex.g !== 'cardio' && !weighable(ex, E) && !BAR_STAPLE.has(ex.id)));
}
/* все замены, которые можно предложить, от самых похожих (проверка бережного режима — tools/gentle.test.js) */
function swapCandidates(cur, p) { return swapPool(cur, p).filter(r => swapFits(r.ex)).map(r => r.ex); }
/* что меняется: как у аналогов (analogNote); где мышцы те же и вид сопротивления тот же — какая мышца становится
   основной или какой снаряд в руках */
function swapNote(a, b, E) {
  const n = analogNote(a, b, E), parts = n ? n.split('; ') : [];
  /* новая основная мышца уже работала в прежнем упражнении — analogNote о ней молчит («добавляется» — только о новых) */
  if (b.pri[0] !== a.pri[0] && a.pri.concat(a.sec).includes(b.pri[0])) {
    const other = PATTERN[b.id] && PATTERN[a.id] !== PATTERN[b.id] ? 1 : 0;   /* «другое движение» analogNote ставит первым */
    parts.splice(other, 0, 'основная мышца: ' + MUSCLE_NAMES[b.pri[0]].toLowerCase());
  }
  if (parts.length) return parts.slice(0, 3).join('; ');
  const had = new Set(chosenEquip(a, E)), eq = id => EQUIP.find(e => e.id === id) || {}, name = id => { const v = eq(id).name || ''; return v.charAt(0).toLowerCase() + v.slice(1); };
  const now = chosenEquip(b, E).filter(id => !had.has(id) && eq(id).name);
  if (!now.length) return 'то же движение и те же мышцы';
  return (now.every(id => eq(id).cat === 'mach') ? 'другой тренажёр: ' : 'другой снаряд: ') + now.slice(0, 2).map(name).join(', ');
}
/* список на выбор: close — то же движение, до SWAP_LIMIT; far — другое движение на те же мышцы, только когда близких нет */
function swapOptions(cur, p) {
  const pat = PATTERN[cur.id], close = [], far = [];
  for (const r of swapPool(cur, p)) {
    const same = pat ? PATTERN[r.ex.id] === pat : r.ex.g === cur.g;
    if (same) {
      if (r.score < SWAP_CLOSE_MIN || !swapFits(r.ex)) continue;
      close.push({...r, note:swapNote(cur, r.ex, p.E)});
      if (close.length >= SWAP_LIMIT) break;
    } else if (!close.length && far.length < SWAP_FAR && r.score >= SWAP_FAR_MIN && swapFits(r.ex)) far.push({...r, note:swapNote(cur, r.ex, p.E)});
  }
  return {close, far:close.length ? [] : far};
}

/* ---------- отрисовка ---------- */
/* суставы под пиковой нагрузкой у замены — как строка в карточке (jointsLine): по ней видно, уходит ли метка */
function swapJoints(ex) {
  if (typeof motionPrefs !== 'undefined' && motionPrefs.stress === false) return '';
  const zones = [...new Set(stressIdsOf(ex).flatMap(id => STRESS_RULE[id] ? STRESS_RULE[id].parts : []))];
  const label = 'Пиковая нагрузка:';
  return zones.length ? `<small class="sw-j"><span class="stress-dot" aria-hidden="true"></span>${label} ${esc(zones.join(', '))}</small>` : '';
}
/* attr — атрибут кнопки выбора, hid — id заголовка списка (экран тренировки: data-wv-swap, 14-workout-mode.js) */
function swapPickHtml(it, {attr = 'data-swap-to', hid = `sw-pick-${it.slot}-h`} = {}) {
  const {close, far} = swapOptions(it.ex, plan), list = close.length ? close : far;
  const row = r => `<button type="button" class="place cp-pick-i" ${attr}="${r.ex.id}"><span class="cp-pick-n"><b>${esc(exName(r.ex, plan.E))}</b><small>${esc(r.note)}</small>${swapJoints(r.ex)}</span></button>`;
  const gentle = S.goal === 'gentle' || ensureProtect(S).length > 0;
  const none = close.length ? '' : `<p class="sw-none">${far.length ? 'Близких замен нет. На те же мышцы — другое движение:'
    : gentle ? 'Близких замен нет: другие упражнения на эти мышцы уже в плане, здесь недоступны или не подходят бережному режиму.'
    : 'Близких замен нет: другие упражнения на эти мышцы уже в плане или здесь недоступны.'}</p>`;
  const head = 'Чем заменить';
  return `<p class="cp-pick-h" id="${hid}">${head}</p>${none}${list.map(row).join('')}`;
}
/* «Вернуть»: подпись кнопки — строка рядом (aria-describedby) */
const undoBtn = (attr, desc) => { const label = 'Вернуть'; return `<button type="button" class="sw-undo" ${attr} aria-describedby="${desc}">${label}</button>`; };
const undoKey = () => S.mode === 'custom' ? 'c:' + customOf().id : swapKey();
/* замена ещё в силе: тот же план (день, свой план), на месте — то, что поставили */
function swapUndoLive(u) {
  if (!u || u.kind !== 'swap' || u.key !== undoKey()) return false;
  return S.mode === 'custom' ? customOf().items[u.slot]?.id === u.to : (swaps[u.key] || {})[u.slot] === u.to;
}
/* строка в карточке после замены (cardHtml, 11-planner.js) */
function swapDoneHtml(it) {
  const u = planUndo;
  if (!swapUndoLive(u) || u.slot !== it.slot || it.ex.id !== u.to) return '';
  const line = `Заменено: ${esc(u.fromName)} → ${esc(it.name)}.`;
  return `<p class="sw-done"><span id="sw-done-${it.slot}">${line}</span>${undoBtn('data-swap-undo="1"', 'sw-done-' + it.slot)}</p>`;
}
/* на месте убранной карточки своего плана (blocksHtml, 11-planner.js); tag — 'li' в списке карточек */
function rmGoneHtml(tag = 'li') {
  const u = planUndo;
  if (!u || u.kind !== 'rm' || S.mode !== 'custom' || u.key !== undoKey()) return '';
  const line = `Убрано: ${esc(u.name)}.`;
  return `<${tag} class="sw-gone"><span id="sw-gone-t">${line}</span>${undoBtn('data-rm-undo="1"', 'sw-gone-t')}</${tag}>`;
}

/* ---------- действия ---------- */
/* после перерисовки el встаёт туда, где на экране было y0 (верх нажатой кнопки), и получает фокус */
function keepAt(el, y0) {
  if (!el) return;
  const dy = el.getBoundingClientRect().top - y0;
  if (Math.abs(dy) > 1) window.scrollBy(0, dy);
  el.focus({preventScroll:true});
}
/* раскрыть (open = true) или свернуть список под кнопкой «Заменить»; открытый список в другой карточке сворачивается */
function swapToggle(btn, open = btn.getAttribute('aria-expanded') !== 'true') {
  const box = document.getElementById(btn.getAttribute('aria-controls'));
  if (!box || !plan || !plan.items) return;
  if (open) for (const b of document.querySelectorAll('[data-swap][aria-expanded="true"]')) if (b !== btn) swapToggle(b, false);
  btn.setAttribute('aria-expanded', String(open));
  if (!open) { box.hidden = true; box.replaceChildren(); return; }
  const it = plan.items.find(x => x.slot === +btn.dataset.swap); if (!it) return;
  box.innerHTML = swapPickHtml(it); box.hidden = false;
  const first = box.querySelector('[data-swap-to]');
  if (first) first.focus({preventScroll:true});
  box.scrollIntoView({block:'nearest', behavior:reduceMotion ? 'auto' : 'smooth'});
}
/* Правка плана — отдельно от экрана (проверки — tools/swap-list.test.js): возвращают true, если план изменился */
/* замена упражнения в карточке slot открытого плана на nextId; запоминает, что вернуть */
function swapSet(slot, nextId) {
  const it = plan && plan.items && plan.items.find(x => x.slot === slot), next = EXI[nextId];
  if (!it || !next || it.ex === next) return false;
  if (S.mode === 'custom') {
    /* в своём плане замена записывается в сам план; подходы, вес и заметка остаются */
    const items = customOf().items, item = items[slot];
    if (!item || items.some(x => x.id === next.id)) return false;
    planUndo = {kind:'swap', key:undoKey(), slot, from:item.id, to:next.id, fromName:it.name};
    item.id = next.id;
  } else {
    const k = swapKey(); swaps[k] = swaps[k] || {}; delete swaps.__tried; /* перебор по кругу прежних версий */
    planUndo = {kind:'swap', key:k, slot, prev:swaps[k][slot], to:next.id, fromName:it.name};
    swaps[k][slot] = next.id;
  }
  done = {}; saveSettings();
  return true;
}
function swapBack() {
  const u = planUndo; if (!swapUndoLive(u)) return false;
  if (S.mode === 'custom') customOf().items[u.slot].id = u.from;
  else if (u.prev === undefined) delete swaps[u.key][u.slot]; else swaps[u.key][u.slot] = u.prev;
  planUndo = null; done = {}; saveSettings();
  return true;
}
/* «Убрать» в своём плане: сразу, без подтверждения; на месте карточки — «Убрано: … Вернуть» */
function rmItem(slot) {
  const item = customOf().items[slot]; if (!item) return false;
  const it = plan && plan.items && plan.items.find(x => x.slot === slot);
  customRemove(slot);
  planUndo = {kind:'rm', key:undoKey(), slot, item, name:it ? it.name : EXI[item.id].name};
  saveSettings();
  return true;
}
/* возвращает убранное на прежнее место; план полон или упражнение снова в нём (добавлено из атласа) — некуда */
function rmBack() {
  const u = planUndo;
  if (!u || u.kind !== 'rm' || S.mode !== 'custom' || u.key !== undoKey()) return -1;
  const items = customOf().items; planUndo = null;
  if (items.length >= CUSTOM_MAX || items.some(x => x.id === u.item.id)) return -1;
  const at = Math.min(u.slot, items.length);
  items.splice(at, 0, u.item);
  cpOpen = new Set([...cpOpen].map(i => i >= at ? i + 1 : i));
  saveSettings();
  return at;
}

/* экран: после перерисовки нажатая кнопка (или то, что встало на её место) — там же, где была, и с фокусом */
function swapApply(t) {
  const card = t.closest('.card'), slot = card ? +card.dataset.slot : -1;
  const y0 = card ? card.querySelector('[data-swap]').getBoundingClientRect().top : 0;
  if (!swapSet(slot, t.dataset.swapTo)) return;
  renderPlan();
  const c = document.querySelector(`.card[data-slot="${slot}"]`); if (!c) return;
  c.classList.add('flash');
  keepAt(c.querySelector('[data-swap]'), y0);
  (c.querySelector('[data-swap-undo]') || c.querySelector('[data-swap]')).focus({preventScroll:true});
}
function swapRevert(t) {
  const card = t.closest('.card'), u = planUndo; if (!card) return;
  const y0 = card.querySelector('[data-swap]').getBoundingClientRect().top;
  if (!swapBack()) return;
  renderPlan();
  keepAt(document.querySelector(`.card[data-slot="${u.slot}"] [data-swap]`), y0);
}
function planRemove(slot, btn) {
  const y0 = btn.getBoundingClientRect().top;
  if (!rmItem(slot)) return;
  renderSetup(); renderPlan();
  keepAt(document.querySelector('[data-rm-undo]'), y0);
}
function rmRevert(t) {
  const y0 = t.getBoundingClientRect().top, at = rmBack();
  renderSetup(); renderPlan();
  if (at >= 0) keepAt(document.querySelector(`.card[data-slot="${at}"] [data-cp-rm]`), y0);
}

document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.swap !== undefined) return swapToggle(t);
  if (t.dataset.swapTo) return swapApply(t);
  if (t.dataset.swapUndo !== undefined) return swapRevert(t);
  if (t.dataset.rmUndo !== undefined) return rmRevert(t);
});
/* Esc в списке замен (или на его кнопке) сворачивает список и возвращает фокус на «Заменить» */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !e.target.closest || !e.target.closest('.sw-pick, [data-swap]')) return;
  const card = e.target.closest('.card'), btn = card && card.querySelector('[data-swap][aria-expanded="true"]');
  if (!btn) return;
  e.preventDefault(); swapToggle(btn, false); btn.focus();
});

/* ---------- «Другой вариант» (Елена 11, Галина 4, Виктор 22) ----------
   Новый вариант подбора — до 8 попыток, пока не поменяется набор упражнений (в программе — хотя бы в одном дне). Не поменялся —
   «Других вариантов нет», подбор остаётся прежним (порядок не перемешивается, замены не теряются). Поменялся — строка над
   планом «Другой вариант: A → B» и «Вернуть» (прежний подбор с прежними заменами); диктору — то же. Строка держится до
   следующего изменения плана (regen) или перезагрузки. Было: «Другой вариант» менял порядок тех же упражнений или молча менял
   планку на «снежных ангелов», вернуть было нечем, диктор слышал «План обновлён: 4 упражнения». */
let rerollMsg = null;
const REROLL_TRIES = 8;
function rerollIds() {
  if (S.mode === 'program') return buildProgram().days.map(d => (d.plan.items || []).map(it => it.ex.id));
  const p = buildPlan({swaps:swaps.s || {}, order:swaps.__order?.s});
  return [(p.items || []).map(it => it.ex.id)];
}
function rerollDiff(a, b) {
  const out = [];
  a.forEach((ids, d) => { const now = b[d] || [], gone = ids.filter(id => !now.includes(id)), came = now.filter(id => !ids.includes(id)); if (gone.length || came.length) out.push({d, gone, came}); });
  return out.length ? out : null;
}
/* вернёт true, если подбор поменялся */
function rerollPlan() {
  const before = rerollIds(), seed0 = S.seed, sw0 = JSON.parse(JSON.stringify(swaps || {}));
  let diff = null, after = null;
  for (let i = 0; i < REROLL_TRIES && !diff; i++) {
    S.seed = (S.seed * 48271 + 11) % 2147483647; swaps = S.swaps = {};
    diff = rerollDiff(before, after = rerollIds());
  }
  if (!diff) { S.seed = seed0; swaps = S.swaps = sw0; }
  rerollMsg = diff ? {diff, after, seed:seed0, swaps:sw0, now:S.seed, mode:S.mode} : {none:true, now:S.seed, mode:S.mode};
  done = {}; planUndo = null; saveSettings(); renderSetup();
  planNote = rerollText(); renderPlan();
  return !!diff;
}
function rerollBack() {
  const u = rerollMsg; if (!u || !u.diff || u.now !== S.seed) return false;
  S.seed = u.seed; swaps = S.swaps = u.swaps; rerollMsg = null;
  done = {}; planUndo = null; saveSettings(); renderSetup();
  planNote = 'Вернули прежний вариант.'; renderPlan();
  return true;
}
const rerollName = id => EXI[id] ? exNameHere(EXI[id]) : id;
/* «Другой вариант: Планка на предплечьях → Обратные «снежные ангелы».» — по дню, открытому сейчас; в программе — и сколько
   поменялось в других днях */
function rerollText() {
  const u = rerollMsg; if (!u || u.now !== S.seed || u.mode !== S.mode) return '';
  if (u.none) return 'Других вариантов нет: для этих мышц, места и отметок подбираются те же упражнения.';
  const day = S.mode === 'program' ? S.day : 0, here = u.diff.find(x => x.d === day), other = u.diff.filter(x => x.d !== day).length;
  /* одно-два — «было → стало», больше — сколько новых и какие (длинная строка «A, B, C, D → E, F, G, H» не читается) */
  const total = (u.after && u.after[day] || []).length;
  const first = !here ? 'Другой вариант: в этом дне упражнения те же.'
    : here.gone.length <= 2 ? 'Другой вариант: {list}.'.replace('{list}', `${here.gone.map(rerollName).join(', ') || '—'} → ${here.came.map(rerollName).join(', ') || '—'}`)
    : 'Другой вариант: новых упражнений {n} из {m} — {list}.'.replace('{n}', here.came.length).replace('{m}', total || here.came.length).replace('{list}', here.came.map(rerollName).join(', '));
  return first + (other ? ' ' + 'Поменялись и другие дни недели: {n}.'.replace('{n}', other) : '');
}
function rerollHtml() {
  const t = rerollText(); if (!t) return '';
  const back = rerollMsg.diff ? `<button type="button" class="sw-undo" data-reroll-undo="1" aria-describedby="reroll-t">${'Вернуть'}</button>` : '';
  return `<p class="p-hint reroll-msg"><span id="reroll-t">${esc(t)}</span>${back}</p>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t || t.dataset.rerollUndo === undefined) return;
  if (rerollBack()) { const b = document.getElementById('reroll'); if (b) b.focus({preventScroll:true}); }
});
