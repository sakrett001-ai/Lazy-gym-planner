/* ===================== РАЗМИНКА И БЛИНЫ ===================== */
const GEAR_KEY = 'podhod.gear.v1';
/* Инвентарь — в своих единицах (13-log.js: wu()): килограммовый зал — гриф 20 кг, блины 25…1,25 кг, гантели через 2 кг,
   стек через 5 кг; фунтовый — гриф 45 фнт, блины 45/35/25/10/5/2,5 фнт, гантели через 5 фнт, стек через 10 фнт. Это разные
   блины, а не пересчёт: 20-килограммовый блин — не 45 фунтов. Хранится {bar, plates} в килограммах, как в прежних версиях,
   и lb:{bar, plates} — в фунтах */
const GEAR_UNITS = {kg:{bar:20, plates:[25, 20, 15, 10, 5, 2.5, 1.25], dbStep:2, machineStep:5, kbStep:4, step:.5},
  lb:{bar:45, plates:[45, 35, 25, 10, 5, 2.5], dbStep:5, machineStep:10, kbStep:5, step:1}};
/* инвентарь выбранных единиц */
const gearU = (u = wu()) => GEAR_UNITS[u];
const PLATE_SETS = {
  kg:{std:{name:'Стандарт', plates:[25, 20, 15, 10, 5, 2.5, 1.25]},
    home:{name:'Домашний', plates:[20, 10, 5, 2.5, 1.25]},
    fine:{name:'С мелкими', plates:[25, 20, 15, 10, 5, 2.5, 1.25, 0.5]}},
  lb:{std:{name:'Стандарт', plates:[45, 35, 25, 10, 5, 2.5]},
    home:{name:'Домашний', plates:[25, 10, 5, 2.5]},
    fine:{name:'С мелкими', plates:[45, 35, 25, 10, 5, 2.5, 1.25]}}
};
function gearPick(to, g) {
  if (!g || typeof g !== 'object') return;
  if (isFinite(g.bar) && +g.bar > 0) to.bar = +g.bar;
  if (Array.isArray(g.plates)) { const pl = [...new Set(g.plates.map(Number).filter(v => v > 0))].sort((a, b) => b - a); if (pl.length) to.plates = pl; }
}
function gearLoad() { try { const g = JSON.parse(localStorage.getItem(GEAR_KEY) || 'null'); if (g && typeof g === 'object') { gearPick(GEAR_UNITS.kg, g); gearPick(GEAR_UNITS.lb, g.lb); } } catch (e) {} }
/* для файла и хранилища: килограммы — на прежних местах, фунты — в lb */
const gearObject = () => ({bar:GEAR_UNITS.kg.bar, plates:GEAR_UNITS.kg.plates, lb:{bar:GEAR_UNITS.lb.bar, plates:GEAR_UNITS.lb.plates}});
function gearSave() { Keep.set(GEAR_KEY, JSON.stringify(gearObject())); }
gearLoad();

/* чем нагружают: штанга (гриф + блины), гантели, тренажёр (стек), гиря */
function implementOf(it) {
  const ids = it.eqIds || [];
  if (ids.includes('bb') || ids.includes('smith')) return 'bb';
  if (ids.includes('db')) return 'db';
  if (ids.includes('kb')) return 'kb';
  if (ids.some(i => MACHINE.has(i) || i === 'legpress')) return 'machine';
  return null;
}
/* раскладка блинов на одну сторону грифа: target — вес из журнала (кг), раскладка — в блинах выбранных единиц;
   возвращает {side:[блины в единицах показа], total, diff} — total и diff в килограммах */
function plateSplit(target, g = gearU()) {
  /* фунты из килограммов — до сотых: 225 остаётся 225. Вес своего плана хранится до граммов (cleanKg), 225 фнт — 102,058 кг,
     а это 224,9993 фнт: до тысячных выходило «= 220, не хватает 5» (4.108) */
  const t = Math.round(toU(target) * 100) / 100, bar = g.bar;
  let perSide = (t - bar) / 2, side = [];
  if (perSide <= 1e-6) return {side, total:fromU(bar), diff:fromU(t - bar)};
  for (const p of g.plates) while (perSide >= p - 1e-6) { side.push(p); perSide -= p; }
  const total = bar + 2 * side.reduce((a, b) => a + b, 0);
  return {side, total:fromU(total), diff:fromU(t - total)};
}
/* ближайший достижимый вес (кг): гриф с блинами — вниз, гантели, стек и гиря — по своему шагу в выбранных единицах;
   гантели и гири с набором места (availKg) — ближайшие из набора */
function roundToGear(target, impl, it) {
  const g = gearU(), t = toU(target), at = st => fromU(Math.round(t / st) * st);
  if (impl === 'bb') return plateSplit(target, g).total;
  const av = (impl === 'db' || impl === 'kb') && it ? availKg(it) : null;
  if (av) return av.reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a);
  if (impl === 'db') return at(g.dbStep);
  if (impl === 'machine') return at(g.machineStep);
  if (impl === 'kb') return at(g.kbStep);
  return at(g.step);
}
/* Вес разминки на штанге — около доли рабочего, гриф и блины не мельче 2,5 кг (5 фнт): на разминке шаг 5 кг (10 фнт), без
   дисков 1,25 (Руслан 12: «137,5 и 172,5 — с дисками 1,25»). Из весов в пределах ±10 % от доли — тот, что собирается
   наименьшим числом блинов на сторону, при равенстве — ближайший, потом — легче (Mike 13: «45 → 95 → 135 → 185 → 225,
   целые блины, как в американском зале»; к 225 фнт теперь 45 → 115 → 155 → 185). Блины — из набора «Гриф и блины» */
function warmBar(target, g = gearU()) {
  const min = isLb() ? 5 : 2.5, pl = g.plates.filter(p => p >= min - 1e-9);
  const t = toU(target), per = (t - g.bar) / 2;
  if (!pl.length) return plateSplit(target, g).total;
  if (per <= 0) return fromU(g.bar);
  const q = .25, P = [...new Set(pl.map(p => Math.round(p / q)))], want = per / q, lim = Math.ceil(want * 1.3 + 2 * t * .1 / q) + Math.max(...P);
  const cnt = new Array(lim + 1).fill(Infinity); cnt[0] = 0;
  for (let v = 0; v <= lim; v++) if (cnt[v] < Infinity) for (const p of P) if (v + p <= lim && cnt[v] + 1 < cnt[v + p]) cnt[v + p] = cnt[v] + 1;
  const lo = (t * .9 - g.bar) / 2 / q, hi = (t * 1.1 - g.bar) / 2 / q;
  let best = -1;
  const better = (v, b) => b < 0 || cnt[v] < cnt[b] || (cnt[v] === cnt[b] && (Math.abs(v - want) < Math.abs(b - want) - 1e-9 || (Math.abs(Math.abs(v - want) - Math.abs(b - want)) < 1e-9 && v < b)));
  for (let v = Math.max(1, Math.ceil(lo - 1e-9)); v <= Math.min(lim, Math.floor(hi + 1e-9)); v++) if (cnt[v] < Infinity && better(v, best)) best = v;
  if (best < 0) { best = 0; for (let v = 1; v <= lim; v++) if (cnt[v] < Infinity && Math.abs(v - want) < Math.abs(best - want) - 1e-9) best = v; }
  return fromU(g.bar + 2 * best * q);
}
/* Становая — с пола: гриф на правильной высоте только с блинами стандартного диаметра (Rippetoe M., Starting Strength,
   с. 112: «Correct bar height at the start of the deadlift is important. Use standard height Olympic style plates»). Первый
   разминочный подход — гриф и по блину 20 кг (45 фнт) на сторону, 60 кг или 135 фнт, а не пустой гриф (Руслан 12: с пустого
   грифа с пола в позицию не встать). Нет таких блинов в наборе — самые тяжёлые из него. */
const FLOOR_START = new Set(['deadlift']);
function floorStart(g = gearU()) {
  const std = isLb() ? 45 : 20, big = g.plates.includes(std) ? std : Math.max(...g.plates);
  return fromU(g.bar + 2 * big);
}
/* пирамида разминки: от грифа/лёгкого к рабочему; число шагов зависит от веса; it — упражнение (становая — с пола,
   гантели и гири — из набора места) */
function warmupPlan(work, impl, reps, it) {
  if (!work || work <= 0) return [];
  const [lo] = parseRange(reps);
  const steps = [];
  const bar = fromU(gearU().bar), floor = impl === 'bb' && it && FLOOR_START.has(it.ex.id) ? floorStart() : null;
  if (floor) {
    /* рабочий вес не тяжелее стартового — разминаться с пола нечем легче: разминки нет */
    if (work <= floor + 1e-6) return [];
    const r0 = floor / work; steps.push({kg:floor, reps:r0 < 0.55 ? 8 : r0 < 0.72 ? 5 : 3, note:`${Math.round(r0 * 100)}%`, floor:true});
  } else if (impl === 'bb') {
    if (work <= bar * 1.6) return [{kg:bar, reps:Math.max(8, lo + 4), note:'пустой гриф'}];
    steps.push({kg:bar, reps:10, note:'пустой гриф'});
  }
  const ratios = work >= 140 ? [0.4, 0.6, 0.75, 0.9] : work >= 90 ? [0.5, 0.7, 0.85] : work >= 50 ? [0.55, 0.8] : [0.6];
  const repsFor = r => r < 0.55 ? 8 : r < 0.72 ? 5 : r < 0.87 ? 3 : 1;
  for (const r of ratios) {
    const kg = impl === 'bb' ? warmBar(work * r) : roundToGear(work * r, impl, it);
    if (kg <= (steps.length ? steps[steps.length - 1].kg + 1e-6 : 0) || kg >= work - 1e-6) continue;
    /* процент — от веса, который получился с инвентарём (30 из 50 — 60%, а не заданные 55%: замечание 10 тестера) */
    steps.push({kg, reps:repsFor(r), note:`${Math.round(kg / work * 100)}%`});
  }
  return steps;
}
function platesHtml(target) {
  const s = plateSplit(target), g = gearU(), u = wUnit(), cls = isLb() ? 'pl-lb' : 'pl-'; /* цвета блинов: в фунтах — свои (10-base.css) */
  if (!s.side.length && s.diff <= 0.01) return `<span class="pl-empty">пустой гриф ${fmtU(g.bar)}</span>`;
  const chips = s.side.map(p => `<i class="pl ${cls}${String(p).replace('.', '_')}" title="${fmtU(p)} ${u}">${fmtU(p)}</i>`).join('');
  const warn = s.diff > 0.01 ? `<small class="pl-diff">= ${fmtKg(s.total)}, не хватает ${fmtKg(s.diff)}</small>` : '';
  return `<span class="pl-row" aria-label="На каждую сторону: ${s.side.map(fmtU).join(', ')} ${u}">${chips}</span>${warn}`;
}
function warmupHtml(it, work) {
  const impl = implementOf(it);
  if (!impl || !work) return '';
  const steps = warmupPlan(work, impl, it.rx.reps, it);
  if (!steps.length) return '';
  const g = gearU(), u = wUnit();
  const rows = steps.map((s, i) => `<li><span class="wu-n">${i + 1}</span><span class="wu-kg">${fmtKg(s.kg)}<small>${u}</small></span><span class="wu-r">× ${s.reps}</span><span class="wu-note">${s.note}</span>${impl === 'bb' ? `<span class="wu-pl">${s.note === 'пустой гриф' ? '' : platesHtml(s.kg)}</span>` : ''}</li>`).join('');
  const workRow = impl === 'bb' ? `<li class="wu-work"><span class="wu-n">→</span><span class="wu-kg">${fmtKg(work)}<small>${u}</small></span><span class="wu-r">рабочий</span><span class="wu-note"></span><span class="wu-pl">${platesHtml(work)}</span></li>` : '';
  return `<details class="wu"><summary>Разминка к ${fmtKg(work)} ${u}<small>${steps.length} ${plural(steps.length, 'подход', 'подхода', 'подходов')}${impl === 'bb' ? ' · блины на сторону' : ''}</small></summary>
    <ol class="wu-list${impl === 'bb' ? ' wu-bb' : ''}">${rows}${workRow}</ol>
    <p class="wu-note-f">Проценты — от рабочего веса. Отдых между разминочными подходами 30–60 с. ${steps.some(s => s.floor) ? 'Становая — с пола: первый подход с блинами стандартного размера, чтобы гриф был на правильной высоте. ' : ''}${impl === 'bb' ? `Гриф ${fmtU(g.bar)} ${u}, блины: ${g.plates.map(fmtU).join(' · ')} — <button type="button" class="lk" data-gear="1">настроить</button>.` : impl === 'machine' ? `Шаг стека принят ${fmtU(g.machineStep)} ${u}.` : ''}</p>
  </details>`;
}
/* рабочий вес для разминки: из первого введённого поля (неправдоподобный и ещё не подтверждённый — «5000», kgDoubt
   в 13-log.js — не в счёт), иначе из подсказки */
function workWeightOf(it, card) {
  if (card) {
    const inp = card.querySelector('.lt-r:not(.done) [data-f="kg"], .lt-r [data-f="kg"]'), row = inp && inp.closest('.lt-r');
    if (inp && inp.value) { const v = parseKg(inp.value); if (v > 0 && !(row && !row.classList.contains('done') && kgDoubt(it, [v], +row.dataset.k))) return v; }
  }
  const sg = suggest(it); return sg.kg && sg.kg > 0 ? sg.kg : null;
}
function refreshWarmup(card) {
  if (!plan || !plan.items) return;
  const it = plan.items.find(x => x.ex.id === card.dataset.ex); if (!it) return;
  const box = card.querySelector('.c-warm'); if (!box) return;
  const open = box.querySelector('details') && box.querySelector('details').open;
  box.innerHTML = warmupHtml(it, workWeightOf(it, card));
  if (open && box.querySelector('details')) box.querySelector('details').open = true;
}
/* настройка инвентаря — в выбранных единицах: в фунтах свои гриф и блины */
function gearDialogHtml() {
  const g = gearU(), sets = PLATE_SETS[wu()], u = wUnit(), cur = Object.entries(sets).find(([, v]) => v.plates.join() === g.plates.join());
  return `<form method="dialog" class="gear">
    <h2>Гриф и блины</h2>
    <label>Вес грифа, ${u}<input id="gear-bar" type="text" inputmode="decimal" value="${fmtU(g.bar)}"></label>
    <p class="gear-l">Набор блинов</p>
    <div class="pres">${Object.entries(sets).map(([k, v]) => `<button type="button" class="pre${cur && cur[0] === k ? ' on' : ''}" data-pset="${k}">${v.name}</button>`).join('')}</div>
    <label>Свои блины, ${u} через запятую<input id="gear-plates" type="text" inputmode="decimal" value="${g.plates.map(fmtU).join(', ')}"></label>
    <p class="gear-hint">Калькулятор раскладывает блины на одну сторону от самого тяжёлого к лёгкому. Укажите те, что есть в зале.</p>
    <div class="gear-btns"><button type="button" class="btn btn-2" value="cancel" id="gear-cancel">Отмена</button><button type="submit" class="btn" id="gear-save">Сохранить</button></div>
  </form>`;
}
function openGear() {
  let d = $('#gear-view');
  if (!d) { d = document.createElement('dialog'); d.id = 'gear-view'; d.className = 'gear-view'; document.body.appendChild(d); }
  d.innerHTML = gearDialogHtml(); d.showModal();
  d.querySelector('form').addEventListener('submit', () => {
    const g = gearU(), bar = parseNum($('#gear-bar').value); if (bar > 0) g.bar = bar;
    /* «25, 20, 2,5»: запятая с пробелом, «;» и пробел разделяют блины, запятая внутри числа — десятичная */
    const pl = $('#gear-plates').value.split(/\s*;\s*|,\s+|\s+/).map(parseNum).filter(v => v > 0).sort((a, b) => b - a);
    if (pl.length) g.plates = [...new Set(pl)];
    gearSave(); document.querySelectorAll('.card').forEach(refreshWarmup);
  });
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.gear) { openGear(); return; }
  if (t.dataset.pset) { $('#gear-plates').value = PLATE_SETS[wu()][t.dataset.pset].plates.map(fmtU).join(', '); t.parentElement.querySelectorAll('.pre').forEach(b => b.classList.toggle('on', b === t)); return; }
  if (t.id === 'gear-cancel') { $('#gear-view').close(); return; }
});
document.addEventListener('input', e => {
  if (e.target.classList && e.target.classList.contains('lt-in') && e.target.dataset.f === 'kg') {
    const card = e.target.closest('.card'); if (card) { clearTimeout(card._wuT); card._wuT = setTimeout(() => refreshWarmup(card), 400); }
  }
});

/* ---------- гантели и гири, которые есть в месте (4.108: Руслан 8, Ольга 1) ----------
   У места — dw: {db:{u, v:[…]}, kb:{u, v:[…]}} — веса в той единице, в которой их вписали (u: 'kg' | 'lb'; гантели подписаны
   в своей единице: 52,5 кг — не 115,74 фнт). Набор задан — «прибавьте» ведёт только до веса, который есть, дальше прогресс
   повторами (13-log.js: nextUp, REPS_CAP); разминка и пересчёт из другой единицы берут ближайший из набора. Не задан — как
   раньше, шагом гантелей 2 кг (5 фнт) и гирь 4 кг (5 фнт). Прежние версии поле dw не знают и не трогают. */
const AVAIL_MAX = {kg:100, lb:220}, AVAIL_N = 120;
/* набор места для снаряда упражнения — в килограммах, по возрастанию; null — не задан */
function availKg(it) {
  const impl = it && it.ex ? (it.impl !== undefined && !Array.isArray(it.eqIds) ? it.impl : itemImpl(it)) : null;
  if (impl !== 'db' && impl !== 'kb' || typeof placeOf !== 'function' || !S.places) return null;
  const a = availOf(placeOf(), impl); if (!a) return null;
  return a.v.map(v => a.u === 'lb' ? Math.round(v * LB_KG * 1e5) / 1e5 : v);
}
/* набор места, проверенный: {u, v} или null */
function availOf(place, impl) {
  const a = place && place.dw && place.dw[impl];
  if (!a || !UNITS.includes(a.u) || !Array.isArray(a.v)) return null;
  const v = [...new Set(a.v.filter(x => typeof x === 'number' && x > 0 && x <= AVAIL_MAX[a.u]))].sort((x, y) => x - y).slice(0, AVAIL_N);
  return v.length ? {u:a.u, v} : null;
}
/* «5», «4 6 8 10», «2–30 через 2», «10, 12,5, 15»; u — единица; пусто — {list:null}; неверно — {bad:true} */
function parseAvail(text, impl, u = wu()) {
  const src = String(text || '').trim().toLowerCase(); if (!src) return {list:null};
  const step = GEAR_UNITS[u][impl === 'kb' ? 'kbStep' : 'dbStep'], N = v => parseFloat(v.replace(',', '.'));
  const toks = src.replace(/\s*(?:через|шагом|шаг|по|step|by|every)\s*/g, '@').replace(/\s*[–—-]\s*/g, '–').split(/\s*;\s*|,\s+|\s+/).filter(Boolean);
  const out = new Set();
  for (const t of toks) {
    const m = t.match(/^(\d+(?:[.,]\d+)?)(?:–(\d+(?:[.,]\d+)?)(?:@(\d+(?:[.,]\d+)?))?)?$/);
    if (!m) return {bad:true};
    const a = N(m[1]), b = m[2] ? N(m[2]) : a, st = m[3] ? N(m[3]) : step;
    if (!(a > 0) || !(b >= a) || b > AVAIL_MAX[u] || !(st > 0)) return {bad:true};
    for (let k = 0; a + k * st <= b + 1e-9; k++) { out.add(Math.round((a + k * st) * 100) / 100); if (out.size > AVAIL_N) return {bad:true}; }
  }
  return {list:[...out].sort((x, y) => x - y)};
}
/* набор — коротко: ровный ряд от трёх весов — «2–30 через 2», иначе через пробел */
function availText(a) {
  if (!a) return '';
  const v = a.v, st = v.length > 2 ? Math.round((v[1] - v[0]) * 100) / 100 : 0;
  if (st > 0 && v.every((x, i) => !i || Math.abs(x - v[i - 1] - st) < 1e-6)) return `${fmtU(v[0])}–${fmtU(v[v.length - 1])} ${'через'} ${fmtU(st)}`;
  return v.map(fmtU).join(' ');
}
/* поля набора в инструментах места (11-planner.js: renderSetup) — только если в месте есть гантели или гири */
function placeWeightsHtml(place) {
  const has = id => place.equip.includes(id), rows = [['db', 'Гантели'], ['kb', 'Гири']].filter(([id]) => has(id));
  if (!rows.length) return '';
  return rows.map(([id, name]) => {
    const a = availOf(place, id), u = a ? a.u : wu(), unit = u === 'lb' ? 'фнт' : 'кг', step = GEAR_UNITS[u][id === 'kb' ? 'kbStep' : 'dbStep'];
    return `<label class="place-w">${name} ${'в этом месте'}, ${unit}<input id="place-w-${id}" data-place-w="${id}" data-u="${u}" type="text" autocomplete="off" value="${esc(availText(a))}" placeholder="${'все, через'} ${fmtU(step)}" aria-describedby="place-w-${id}-h"></label>`
      + `<p class="f-note" id="place-w-${id}-h">${'Через пробел: 5 — одна пара; 4 6 8 10; или ряд: 2–30 через 2. «Прибавьте» ведёт до самого тяжёлого из списка, дальше — повторами. Пусто — любые, шагом'} ${fmtU(step)} ${unit}.</p>`;
  }).join('');
}
document.addEventListener('change', e => {
  const t = e.target; if (!t || !t.dataset || !t.dataset.placeW) return;
  const impl = t.dataset.placeW, u = t.dataset.u === 'lb' ? 'lb' : 'kg', r = parseAvail(t.value, impl, u), place = placeOf();
  const hint = document.getElementById(`place-w-${impl}-h`);
  if (r.bad) {
    t.setAttribute('aria-invalid', 'true');
    if (hint) hint.textContent = 'Не получилось прочитать. Впишите веса через пробел, например 4 6 8, или ряд: 2–30 через 2.';
    return;
  }
  t.removeAttribute('aria-invalid');
  place.dw = {...(place.dw && typeof place.dw === 'object' ? place.dw : {})};
  if (r.list) place.dw[impl] = {u, v:r.list}; else delete place.dw[impl];
  if (!Object.keys(place.dw).length) delete place.dw;
  saveSettings(); renderSetup(); renderPlan();
  const f = document.getElementById(`place-w-${impl}`); if (f) f.focus();
});
