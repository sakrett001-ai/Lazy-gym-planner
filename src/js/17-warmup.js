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
function gearSave() { try { localStorage.setItem(GEAR_KEY, JSON.stringify(gearObject())); } catch (e) {} }
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
  const t = Math.round(toU(target) * 1000) / 1000, bar = g.bar; /* фунты из килограммов — до тысячных: 225 остаётся 225 */
  let perSide = (t - bar) / 2, side = [];
  if (perSide <= 1e-6) return {side, total:fromU(bar), diff:fromU(t - bar)};
  for (const p of g.plates) while (perSide >= p - 1e-6) { side.push(p); perSide -= p; }
  const total = bar + 2 * side.reduce((a, b) => a + b, 0);
  return {side, total:fromU(total), diff:fromU(t - total)};
}
/* ближайший достижимый вес (кг): гриф с блинами — вниз, гантели, стек и гиря — по своему шагу в выбранных единицах */
function roundToGear(target, impl) {
  const g = gearU(), t = toU(target), at = st => fromU(Math.round(t / st) * st);
  if (impl === 'bb') return plateSplit(target, g).total;
  if (impl === 'db') return at(g.dbStep);
  if (impl === 'machine') return at(g.machineStep);
  if (impl === 'kb') return at(g.kbStep);
  return at(g.step);
}
/* пирамида разминки: от грифа/лёгкого к рабочему; число шагов зависит от веса */
function warmupPlan(work, impl, reps) {
  if (!work || work <= 0) return [];
  const [lo] = parseRange(reps);
  const steps = [];
  const bar = fromU(gearU().bar);
  if (impl === 'bb') {
    if (work <= bar * 1.6) return [{kg:bar, reps:Math.max(8, lo + 4), note:'пустой гриф'}];
    steps.push({kg:bar, reps:10, note:'пустой гриф'});
  }
  const ratios = work >= 140 ? [0.4, 0.6, 0.75, 0.9] : work >= 90 ? [0.5, 0.7, 0.85] : work >= 50 ? [0.55, 0.8] : [0.6];
  const repsFor = r => r < 0.55 ? 8 : r < 0.72 ? 5 : r < 0.87 ? 3 : 1;
  for (const r of ratios) {
    const kg = roundToGear(work * r, impl);
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
  const steps = warmupPlan(work, impl, it.rx.reps);
  if (!steps.length) return '';
  const g = gearU(), u = wUnit();
  const rows = steps.map((s, i) => `<li><span class="wu-n">${i + 1}</span><span class="wu-kg">${fmtKg(s.kg)}<small>${u}</small></span><span class="wu-r">× ${s.reps}</span><span class="wu-note">${s.note}</span>${impl === 'bb' ? `<span class="wu-pl">${s.note === 'пустой гриф' ? '' : platesHtml(s.kg)}</span>` : ''}</li>`).join('');
  const workRow = impl === 'bb' ? `<li class="wu-work"><span class="wu-n">→</span><span class="wu-kg">${fmtKg(work)}<small>${u}</small></span><span class="wu-r">рабочий</span><span class="wu-note"></span><span class="wu-pl">${platesHtml(work)}</span></li>` : '';
  return `<details class="wu"><summary>Разминка к ${fmtKg(work)} ${u}<small>${steps.length} ${plural(steps.length, 'подход', 'подхода', 'подходов')}${impl === 'bb' ? ' · блины на сторону' : ''}</small></summary>
    <ol class="wu-list${impl === 'bb' ? ' wu-bb' : ''}">${rows}${workRow}</ol>
    <p class="wu-note-f">Проценты — от рабочего веса. Отдых между разминочными подходами 30–60 с. ${impl === 'bb' ? `Гриф ${fmtU(g.bar)} ${u}, блины: ${g.plates.map(fmtU).join(' · ')} — <button type="button" class="lk" data-gear="1">настроить</button>.` : impl === 'machine' ? `Шаг стека принят ${fmtU(g.machineStep)} ${u}.` : ''}</p>
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
