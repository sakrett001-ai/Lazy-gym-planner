/* ===================== ВРЕМЯ НА ТРЕНИРОВКУ =====================
   S.dur — сколько времени у человека на тренировку: 'short' (20–30 мин), 'mid' (около 45), 'long' (час и больше) или
   null — не задано: тогда число упражнений — из «Упражнений» (S.count), как раньше (сохранённые настройки прежних версий
   поля не знают и работают по-старому). Время задано — генератор сам подбирает число упражнений под коридор времени,
   а если и трёх упражнений слишком много (сила: 5 подходов, отдых по 3 минуты) — убирает подходы и сокращает отдых
   на пятую часть; если и десяти мало — добавляет подходы (в круговой — круги, в статодинамике — серии).
   Порядок уступок: сначала число упражнений при обычной дозировке, затем подходы, затем отдых. При нехватке времени
   меньше упражнений, а в коротких тренировках — больше базовых (Iversen et al., «No Time to Lift?», Sports Med 2021;
   51(10):2079–2095); отдых в силе и после сокращения не короче двух минут.
   Время — та же оценка, что «время ≈N мин» в шапке плана: подходы, отдых и переходы, без разминки и заминки.
   Подбор идёт по обычной неделе: в разгрузочную неделю, при «Облегчить тренировку» и для восстанавливающихся мышц
   тренировка та же, но короче; в неделях нагрузки и пика (+1 подход в базовых) — немного длиннее. Упражнения от недели
   к неделе не меняются: по ним идёт прогрессия. Проверка — tools/duration.test.js. */
const DURATIONS = {
  short:{name:'20–30', hint:'мин', lo:20, hi:30, target:25, say:'20–30 мин'},
  mid:{name:'45', hint:'мин', lo:40, hi:50, target:45, say:'45 мин'},
  long:{name:'60+', hint:'мин', lo:60, hi:80, target:65, say:'60 мин и больше'}
};
const DOSE_MIN_SETS = 2, DOSE_MAX_SETS = 6, DOSE_MAX_ROUNDS = 6, DOSE_MAX_SERIES = 4, DOSE_COUNTS = [3, 4, 5, 6, 7, 8, 9, 10];
/* новичку — не больше 8 упражнений: за одну тренировку не больше новых названий, остальное время добирается подходами
   (решение владельца 14.11.2026: «Рельеф» на 45 минут давал новичку 10 упражнений по 2 подхода) */
const DOSE_BEG_MAX = 8;
const doseCounts = () => S.level === 'beg' ? DOSE_COUNTS.filter(c => c <= DOSE_BEG_MAX) : DOSE_COUNTS;
/* уступки по порядку: короче — подходы, затем отдых; длиннее — подходы, затем отдых на четверть дольше (дольше
   отдых — не хуже для роста мышц: Schoenfeld et al., J Strength Cond Res 2016; 30(7):1805–1812). Новичку — не больше
   одного подхода сверх обычного (в круговой — двух кругов): объём растёт постепенно, лишнее время — на разминку и заминку */
const DOSE_LESS = [{s:-1, r:1}, {s:-1, r:.8}, {s:-2, r:.8}, {s:-3, r:.8}];
function doseMore() {
  const n = (S.level === 'beg' ? 1 : 2) + (S.format === 'circuit' ? 1 : 0);
  return [1, 2, 3].slice(0, n).flatMap(s => [{s, r:1}, {s, r:1.25}]);
}
function ensureDur(s) { if (!DURATIONS[s.dur]) s.dur = null; return s.dur; }
ensureDur(S);
/* время учитывается в собранной тренировке и неделе; в своём плане упражнения и подходы задал человек */
function durationOf() { return S.mode !== 'custom' && DURATIONS[S.dur] ? DURATIONS[S.dur] : null; }
const round5 = v => Math.round(v / 5) * 5;
/* отдых с уступкой: не короче 30 с, в силе — не короче 2 мин */
function doseRest(rest, dose) {
  if (!dose || dose.r === 1 || !rest) return rest;
  return Math.max(Math.min(rest, S.goal === 'strength' ? 120 : 30), round5(rest * dose.r));
}
/* подходы с уступкой: не меньше двух (и не больше, чем было, если было меньше), не больше шести */
function applyDose(rx, dose) {
  if (!dose || (!dose.s && dose.r === 1)) return rx;
  if (rx.static) {
    const series = Math.max(Math.min(1, rx.series), Math.min(DOSE_MAX_SERIES, rx.series + dose.s));
    return {...rx, series, sets:series * STATIC.perSeries, seriesRest:doseRest(rx.seriesRest, dose)};
  }
  return {...rx, sets:Math.max(Math.min(DOSE_MIN_SETS, rx.sets), Math.min(DOSE_MAX_SETS, rx.sets + dose.s)), rest:doseRest(rx.rest, dose)};
}

/* Тренировка с учётом времени. Не задано, свой план или число упражнений передано явно — как раньше. */
function buildPlan(ctx = {}) {
  const D = durationOf();
  if (!D || ctx.count) return buildPlanAt(ctx);
  const fit = fitDuration(ctx, D);
  if (!fit) return buildPlanAt(ctx);
  const p = buildPlanAt({...ctx, count:fit.c, dose:fit.dose});
  /* «Подобрано N из M» не к месту: число упражнений выбрал подбор, а не человек */
  if (p.items) { p.count = p.items.length; p.fit = {dur:S.dur, lo:D.lo, hi:D.hi, est:fit.m, ok:fit.m >= D.lo && fit.m <= D.hi, dose:fit.dose, why:fit.why || null}; }
  return p;
}
/* перебор: число упражнений при обычной дозировке; не вышло — с уступками. Из попавших в коридор — ближе к середине,
   при равенстве — больше упражнений; не попал никто — ближайший к коридору */
function fitDuration(ctx, D) {
  const all = [];
  const run = dose => {
    const got = [];
    for (const c of doseCounts()) {
      const p = buildPlanAt({...ctx, count:c, dose, fitBase:true});
      if (!p.items) return null;
      /* упражнений меньше, чем просили (всё доступное уже в плане), — та же тренировка, что при меньшем числе */
      const r = {c, dose, m:p.minutes, n:p.items.length};
      all.push(r); got.push(r);
      if (p.items.length < c) break;
    }
    return got;
  };
  const inside = r => r.m >= D.lo && r.m <= D.hi;
  const best = list => list.filter(inside).sort((a, b) => Math.abs(a.m - D.target) - Math.abs(b.m - D.target) || b.n - a.n)[0] || null;
  const first = run({s:0, r:1});
  if (!first) return null;
  let hit = best(first);
  if (hit) return hit;
  const under = first.every(r => r.m < D.lo), over = first.every(r => r.m > D.hi);
  for (const dose of under ? doseMore() : over ? DOSE_LESS : DOSE_LESS.concat(doseMore())) { const got = run(dose); if (got && (hit = best(got))) return hit; }
  const gap = r => r.m < D.lo ? D.lo - r.m : r.m > D.hi ? r.m - D.hi : 0;
  const near = all.sort((a, b) => gap(a) - gap(b) || Math.abs(a.dose.s) - Math.abs(b.dose.s) || b.n - a.n)[0];
  /* почему не уложились: длиннее — меньше подходов уже некуда; короче — не хватило упражнений или новичку больше не прибавляем */
  const counts = doseCounts(), most = counts[counts.length - 1];
  return {...near, why:near.m > D.hi ? 'long' : S.level === 'beg' && near.n >= most ? 'beg' : 'few'};
}
/* сколько упражнений показать в «Упражнений»: при заданном времени — сколько подобрано в открытой тренировке */
function shownCount() {
  if (!durationOf()) return S.count;
  const p = S.mode === 'program' && prog ? prog.days[S.day] && prog.days[S.day].plan : plan;
  return p && p.items ? p.items.length : S.count;
}
/* строка под планом, если время не уложилось в коридор: не хватило упражнений или короче не получается */
function durationWarn(p) {
  const f = p && p.fit; if (!f || f.ok) return '';
  const D = DURATIONS[f.dur];
  return f.why === 'long' ? `Короче ≈${p.minutes} мин с этой целью не получается: в каждом упражнении уже наименьшее число подходов.`
    : f.why === 'beg' ? `Новичку больше подходов не прибавляем: тренировка ≈${p.minutes} мин. Остальное время — на разминку, заминку и спокойную ходьбу.`
    : `Под ${D.say} не хватает упражнений с этим оборудованием и мышцами: тренировка ≈${p.minutes} мин.`;
}
