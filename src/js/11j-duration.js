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
  /* новичку, которому подход сверх обычного уже прибавлен, — ещё и отдых в полтора раза дольше (суперсеты из пар «жим —
     тяга» короче прежних пар из двух жимов): между подходами новичку уместно 1–2 мин, ACSM, Ratamess et al., MSSE 2009;
     41(3):687–708 */
  return [1, 2, 3].slice(0, n).flatMap(s => [{s, r:1}, {s, r:1.25}]).concat(S.level === 'beg' ? [{s:1, r:1.5}] : []);
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
  /* у тяжёлой базы — не выше потолка таблицы Прилепина (setsMax, 11-planner.js) */
  return {...rx, sets:Math.max(Math.min(DOSE_MIN_SETS, rx.sets), Math.min(DOSE_MAX_SETS, rx.setsMax || DOSE_MAX_SETS, rx.sets + dose.s)), rest:doseRest(rx.rest, dose)};
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
/* Новичку неделя не выходит за шкалу 4–12 подходов на группу (volScale): при 4–5 тренировках по 45–60 мин подходов
   набирается больше, чем нужно новичку (ACSM, Garber et al., MSSE 2011; 43(7):1334–1359 — 2–4 подхода на группу 2–3 раза
   в неделю). buildProgram передаёт ctx.vol.cap — сколько подходов может быть у группы после этого дня (её доля верхней
   границы недели); из вариантов «число упражнений × подходы» берутся только те, что в неё укладываются. Не дотянули до
   коридора времени — под планом сказано почему (durationWarn: 'begvol'), как и для «60+». */
function volOver(p, vol) {
  if (!vol || !vol.cap) return 0;
  let o = 0; for (const [g, c] of Object.entries(vol.cap)) o += Math.max(0, (vol.have[g] || 0) + (p.gvolBase[g] || 0) - c);
  return o;
}
/* перебор: число упражнений при обычной дозировке; не вышло — с уступками. Из попавших в коридор — ближе к середине,
   при равенстве — больше упражнений; не попал никто — ближайший к коридору. С потолком объёма недели (новичок) —
   только варианты в его пределах: в коридоре — как обычно, иначе самый длинный из них */
function fitDuration(ctx, D) {
  const all = [], capped = !!(ctx.vol && ctx.vol.cap);
  const run = dose => {
    const got = [];
    for (const c of doseCounts()) {
      /* подбор по времени — без замен и своего порядка: «Заменить» меняет одно упражнение, а не число упражнений и подходы
         всего плана (было: замена приседа на гоблет в «Сила · 60+» перестроила план из 5 упражнений в 6, Игорь 12) */
      const p = buildPlanAt({...ctx, swaps:{}, order:null, count:c, dose, fitBase:true});
      if (!p.items) return null;
      /* упражнений меньше, чем просили (всё доступное уже в плане), — та же тренировка, что при меньшем числе */
      const r = {c, dose, m:p.minutes, n:p.items.length, over:capped ? volOver(p, ctx.vol) : 0, cap:p.capped || p.trimmed};
      all.push(r); got.push(r);
      if (p.items.length < c) break;
    }
    return got;
  };
  const inside = r => r.m >= D.lo && r.m <= D.hi && !(r.over > 0.2);
  const best = list => list.filter(inside).sort((a, b) => Math.abs(a.m - D.target) - Math.abs(b.m - D.target) || b.n - a.n)[0] || null;
  const first = run({s:0, r:1});
  if (!first) return null;
  let hit = best(first);
  if (hit) return hit;
  if (capped && first.some(r => r.over > 0.2)) {
    for (const dose of DOSE_LESS) { const got = run(dose); if (got && (hit = best(got))) return hit; }
    const fits = all.filter(r => !(r.over > 0.2)).sort((a, b) => b.m - a.m || b.n - a.n);
    const pick = fits.find(r => r.m <= D.hi) || fits[fits.length - 1] || all.slice().sort((a, b) => a.over - b.over || a.m - b.m)[0];
    return {...pick, why:pick.m < D.lo ? 'begvol' : null};
  }
  const under = first.every(r => r.m < D.lo), over = first.every(r => r.m > D.hi);
  for (const dose of under ? doseMore() : over ? DOSE_LESS : DOSE_LESS.concat(doseMore())) { const got = run(dose); if (got && (hit = best(got))) return hit; }
  const gap = r => r.m < D.lo ? D.lo - r.m : r.m > D.hi ? r.m - D.hi : 0;
  /* с потолком объёма недели — только варианты в его пределах (если такие есть) */
  const ok = capped ? all.filter(r => !(r.over > 0.2)) : [], from = ok.length ? ok : all;
  const near = from.sort((a, b) => gap(a) - gap(b) || Math.abs(a.dose.s) - Math.abs(b.dose.s) || b.n - a.n)[0];
  /* почему не уложились: длиннее — меньше подходов уже некуда; короче — объём недели новичка, не хватило упражнений или
     новичку больше не прибавляем */
  const counts = doseCounts(), most = counts[counts.length - 1];
  const volCut = capped && near.m < D.lo && all.some(r => r.over > 0.2 && r.m > near.m);
  /* потолок подходов на группу за тренировку (sessionCap, 11-planner.js): упражнений и подходов больше не прибавляем */
  return {...near, why:near.m > D.hi ? 'long' : volCut ? 'begvol' : near.cap || all.some(r => r.cap) ? 'cap' : S.level === 'beg' && near.n >= most ? 'beg' : 'few'};
}
/* сколько упражнений показать в «Упражнений»: при заданном времени — сколько подобрано в открытой тренировке */
function shownCount() {
  if (!durationOf()) return S.count;
  const p = S.mode === 'program' && prog ? prog.days[S.day] && prog.days[S.day].plan : plan;
  return p && p.items ? p.items.length : S.count;
}
/* потолок подходов на группу (sessionCap): почему тренировка короче заданного времени или упражнений меньше. Фразы с {n}
   переводятся целиком (i18n/en.json) */
function capWhy(minutes) {
  if (S.format === 'static') return 'В статодинамике — одно упражнение на группу мышц: тренировка ≈{n} мин.'.replace('{n}', minutes);
  return (sessionCap() < 11 ? 'Больше подходов на эти мышцы за одну тренировку не прибавляем: тренировка ≈{n} мин. Новичку и в бережном режиме — до 6 подходов на группу за раз, остальное время — на разминку и заминку.'
    : 'Больше подходов на эти мышцы за одну тренировку не прибавляем: тренировка ≈{n} мин. После 11 подходов на группу за раз мышцы растут уже не заметнее — лучше ещё одна тренировка в неделю.').replace('{n}', minutes);
}
/* строка под планом, если время не уложилось в коридор: не хватило упражнений или короче не получается */
function durationWarn(p) {
  const f = p && p.fit; if (!f || f.ok) return '';
  const D = DURATIONS[f.dur];
  return f.why === 'begvol' ? `Новичку больше подходов не прибавляем: тренировка ≈${p.minutes} мин, иначе за неделю мышцам выйдет больше 12 подходов. Остальное время — на разминку, заминку и спокойную ходьбу.`
    : f.why === 'cap' ? capWhy(p.minutes)
    : f.why === 'week' ? 'Больше подходов за неделю этим мышцам не нужно: тренировка ≈{n} мин. Остальное время — на разминку и заминку.'.replace('{n}', p.minutes)
    : f.why === 'long' ? `Короче ≈${p.minutes} мин с этой целью не получается: в каждом упражнении уже наименьшее число подходов.`
    : f.why === 'beg' ? `Новичку больше подходов не прибавляем: тренировка ≈${p.minutes} мин. Остальное время — на разминку, заминку и спокойную ходьбу.`
    : `Под ${D.say} не хватает упражнений с этим оборудованием и мышцами: тренировка ≈${p.minutes} мин.`;
}
