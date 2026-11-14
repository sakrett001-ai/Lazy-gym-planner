/* ===================== СТАТОДИНАМИКА =====================
   Медленно, без пауз и без расслабления, в неполной амплитуде: мышца всё время напряжена, кровоток в ней пережат,
   к концу подхода — сильное жжение, но не отказ. Три подхода с короткой паузой — одна серия.
   Основания: В. Н. Селуянов — статодинамический режим (30–70% от максимума, подход 30–60 с, отдых 20–60 с,
   не меньше трёх подходов, без полного расслабления); Tanimoto, Ishii 2006, J Appl Physiol 100(4):1150–1157 —
   около 50% 1ПМ, 3 с опускание и 3 с подъём без расслабления, 3 подхода: прирост массы и силы как при 80% 1ПМ. */
const STATIC = {
  tempo:'3-0-3-0', reps:'5–7', work:36, rest:30, perSeries:3, nextExercise:120,
  series:{beg:1, mid:2, adv:3}, seriesRest:{beg:180, mid:180, adv:240},
  /* показ на манекене: рабочая часть амплитуды без выпрямления вверху и без провала внизу */
  partial:[.12, .88]
};
/* где медленная неполная амплитуда не имеет смысла или опасна при утомлении:
   кардио, удержания, прыжки, махи гирей, тяги с пола и наклоны со штангой (поясница), подтягивания на весе тела
   (30–40 с без расслабления почти никому не по силам), уступающие сгибания, ролик, пистолет */
const STATIC_SKIP = new Set(['kbswing', 'kbswing1', 'kbclean', 'kbsnatch', 'kbhalo', 'kbtgu', 'kbdeadlift', 'deadlift', 'goodmorning', 'pullup', 'chinup', 'nordic', 'rollout', 'pistolbox']);
function staticOk(ex) {
  if (ex.g === 'cardio' || ex.kind || ex.anim.hold || ex.anim.loop || STATIC_SKIP.has(ex.id)) return false;
  return !['jump', 'burpee', 'climb'].includes(PATTERN[ex.id]);
}
/* назначение в статодинамике поверх обычного: серии по три подхода, медленный темп, нагрузка по жжению */
function staticRx(rx, ex, week, E) {
  let series = STATIC.series[S.level] || 2;
  if (week && week.deload) series = Math.max(1, series - 1);
  const band = ex.eq.length && ex.eq.every(g => g.every(id => id === 'band')), assisted = ex.eq.some(g => g.includes('gravitron'));
  /* простыми словами (11-planner.js: pctText): «не отказ» — «повторы ещё получаются» */
  const load = weighable(ex, E) ? `к концу подхода мышца сильно горит, но повторы ещё получаются (${pctText('≈ 40–60%')})`
    : band ? 'натяжение ленты: к концу подхода мышца сильно горит, но повторы ещё получаются'
    : assisted ? 'противовес: к концу подхода мышца сильно горит, но повторы ещё получаются'
    : 'вес тела: если жжения нет — медленнее и без отдыха в крайних точках';
  return {...rx, sets:series * STATIC.perSeries, series, reps:STATIC.reps, unit:'повт.', rest:STATIC.rest, seriesRest:STATIC.seriesRest[S.level] || 180,
    tempo:STATIC.tempo, load, work:STATIC.work * (ex.uni ? 2 : 1), static:true, partial:STATIC.partial,
    notes:[...rx.notes, 'Подход ≈ 30–40 с: 3 с вниз и 3 с вверх без пауз, не выпрямляйтесь до конца и не расслабляйтесь внизу.']};
}
/* отдых после подхода k (с нуля): внутри серии коротко, между сериями долго, после последнего — переход к следующему */
function restAfter(rx, k) {
  if (!rx.static) return rx.restShown !== undefined ? rx.restShown : rx.rest;
  if (k + 1 >= rx.sets) return STATIC.nextExercise;
  return (k + 1) % STATIC.perSeries === 0 ? rx.seriesRest : rx.rest;
}
/* время упражнения в статодинамике, секунды */
function staticSeconds(rx) {
  return rx.series * (STATIC.perSeries * rx.work + (STATIC.perSeries - 1) * rx.rest) + (rx.series - 1) * rx.seriesRest + STATIC.nextExercise;
}
