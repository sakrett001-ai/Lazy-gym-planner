/* ===================== ТРЕНИРОВКА БЕЗ СЛУЧАЙНЫХ ПОТЕРЬ: чистые расчёты =====================
   Экран — 14-workout-mode.js, проверки — tools/workout-flow.test.js и tools/ui-check.mjs.
   Начатая тренировка хранится в WORKOUT_STORE: план (stamp — без даты), дни журнала, в которые она шла (days), время на
   экране тренировки (spent), пропущенные упражнения (skipped), заменённые в ней упражнения с уже записанными подходами
   (gone), «закончена» (ended), сколько сделано (done из total — для вопроса на следующий день).
   · «К плану» посреди тренировки — без вопроса: в плане вместо «Начать тренировку →» — «Продолжить тренировку →»
     с числом сделанных подходов.
   · Открыли на следующий день, тренировка не закончена — в плане вопрос «Продолжить вчерашнюю» / «Закончить её». Новые
     подходы пишутся в журнал сегодняшним днём (когда сделаны), записанные вчера остаются вчерашними и считаются сделанными:
     подход ищется во всех днях тренировки, сначала в сегодняшнем.
   · Время тренировки — сколько был открыт её экран: время в плане и между днями не идёт. Счёт от начала по часам после
     перерыва показывал бы «73 мин», а на следующий день — сутки.
   Подход в журнале — LOG.data[id] = [{d, s:[…]}], номер подхода k — место в s (как в карточке плана). */
const WK_DAY = /^\d{4}-\d\d-\d\d$/;
/* сохранённое состояние → проверенное; в записях прежних версий дата — первым полем stamp, времени на экране нет (берётся
   от начала, если тренировка сегодняшняя, не больше 4 ч) */
function wkNormalize(o, now, today) {
  if (!o || typeof o !== 'object' || typeof o.stamp !== 'string') return null;
  const x = {...o};
  if (!WK_DAY.test(x.day || '')) {
    try { const a = JSON.parse(x.stamp); if (Array.isArray(a) && WK_DAY.test(a[0])) { x.day = a[0]; x.stamp = JSON.stringify(a.slice(1)); } } catch (e) {}
  }
  if (!WK_DAY.test(x.day || '')) return null;
  const days = (Array.isArray(x.days) ? x.days : []).filter(d => typeof d === 'string' && WK_DAY.test(d));
  x.days = [...new Set([x.day, ...days])].sort().slice(-7);
  x.skipped = Array.isArray(x.skipped) ? [...new Set(x.skipped.filter(id => typeof id === 'string'))] : [];
  x.gone = Array.isArray(x.gone) ? x.gone.filter(g => g && typeof g.id === 'string' && Array.isArray(g.ks))
    .map(g => ({id:g.id, name:String(g.name || ''), ks:[...new Set(g.ks.filter(k => Number.isInteger(k) && k >= 0))]})).filter(g => g.ks.length) : [];
  if (Number.isFinite(x.spent) && x.spent >= 0) x.spent = Math.round(x.spent);
  else x.spent = Number.isFinite(x.started) && x.day === today ? Math.max(0, Math.min(now - x.started, 4 * 3600e3)) : 0;
  x.ended = !!x.ended;
  x.restPaused = Number(x.restPaused) > 0 ? Number(x.restPaused) : 0;
  for (const k of ['done', 'total']) x[k] = Number.isInteger(x[k]) && x[k] >= 0 ? x[k] : null;
  /* список упражнений тренировки (18a-data-keep.js: workoutSnap) — только в верном виде, иначе тренировка идёт по плану */
  const sn = x.snap;
  x.snap = sn && typeof sn === 'object' && typeof sn.ctx === 'string' && Array.isArray(sn.items) && Array.isArray(sn.q) && sn.items.length && sn.q.length
    && sn.items.every(it => it && typeof it.id === 'string' && it.rx && typeof it.rx === 'object')
    && sn.q.every(s => Array.isArray(s) && Number.isInteger(s[0]) && s[0] >= 0 && s[0] < sn.items.length && Number.isInteger(s[1]) && s[1] >= 0) ? sn : null;
  return x;
}
/* подход k упражнения id в днях тренировки: сначала самый поздний день */
function wkSession(data, id, k, days) {
  const ss = data && data[id]; if (!Array.isArray(ss)) return null;
  for (let i = days.length - 1; i >= 0; i--) { const s = ss.find(x => x.d === days[i]); if (s && s.s[k]) return s; }
  return null;
}
function wkSet(data, id, k, days) { const s = wkSession(data, id, k, days); return s ? s.s[k] : null; }
/* дни тренировки и сегодняшний (тренировка, открытая за полночь, пишет уже в новый день) */
const wkDaysWith = (days, today) => days.includes(today) ? days : [...days, today];
/* сделано и всего: пропущенное без записей в «всего» не входит; заменённое в тренировке — его записанные подходы */
function wkCount(queue, value, {skipped = [], gone = []} = {}, goneValue = () => null) {
  const skip = new Set(skipped), inQ = new Set(queue.map(s => s.it.ex.id));
  let done = 0, total = 0;
  for (const s of queue) { if (value(s)) { done++; total++; } else if (!skip.has(s.it.ex.id)) total++; }
  for (const g of gone) if (!inQ.has(g.id)) for (const k of g.ks) if (goneValue(g.id, k)) { done++; total++; }
  return {done, total};
}
/* следующий несделанный подход после after (по кругу), пропущенные упражнения — мимо */
function wkFirstOpen(queue, after, value, skipped = []) {
  const skip = new Set(skipped);
  for (let j = 1; j <= queue.length; j++) { const i = (after + j) % queue.length; if (!value(queue[i]) && !skip.has(queue[i].it.ex.id)) return i; }
  return -1;
}
/* «Начать / Продолжить тренировку»: 'same' — сегодняшняя продолжается (тот же план или в этом плане уже есть её подходы),
   'past' — прошлого дня, если выбрано «Продолжить вчерашнюю», иначе 'new' — новая */
function wkResume(saved, {today, stamp, cont = false, done = 0}) {
  if (!saved || saved.ended) return 'new';
  const last = saved.days[saved.days.length - 1];
  if (last === today) return saved.stamp === stamp || done > 0 ? 'same' : 'new';
  /* «прошлого дня» — и день «из будущего» (часы переведены назад, 13-log.js: todayKey) */
  return last !== today && cont ? 'past' : 'new';
}
/* что показать в плане: 'continue' — «Продолжить тренировку →» и сколько сделано; 'ask' — тренировка прошлого дня не
   закончена (can — в нынешнем плане её можно продолжить); 'start' — «Начать тренировку →» */
function wkPlanState(saved, {today, queue, data}) {
  if (!saved || saved.ended) return {kind:'start'};
  const last = saved.days[saved.days.length - 1], days = wkDaysWith(saved.days, today);
  const c = wkCount(queue, s => wkSet(data, s.it.ex.id, s.k, days), saved, (id, k) => wkSet(data, id, k, days));
  if (last === today) return c.done > 0 && c.done < c.total ? {kind:'continue', ...c} : {kind:'start'};
  const done = saved.done ?? c.done, total = saved.total ?? c.total;
  if (last !== today && done > 0) return {kind:'ask', day:last, done, total, can:c.done > 0 && c.done < c.total};
  return {kind:'start'};
}
/* минут на экране тренировки: spent — до этого открытия, openAt — когда открыт (0 — закрыт) */
function wkMinutes(spent, openAt, now) { return Math.max(0, Math.floor((spent + (openAt > 0 ? Math.max(0, now - openAt) : 0)) / 60000)); }
/* замена from → to в тренировке: где теперь стоят подходы (по ключу «упражнение:подход»; заменённого нет — -1),
   и записанные подходы прежнего упражнения — в gone */
function wkRequeue(oldQ, newQ, at, {from, name, value}) {
  const key = s => s.it.ex.id + ':' + s.k, pos = new Map(newQ.map((s, i) => [key(s), i]));
  const map = i => Number.isInteger(i) && i >= 0 && oldQ[i] ? pos.get(key(oldQ[i])) ?? -1 : -1;
  const ks = oldQ.filter(s => s.it.ex.id === from && value(s)).map(s => s.k);
  return {index:map(at.index), last:map(at.last), next:map(at.next), gone:ks.length ? {id:from, name, ks} : null};
}
function wkAddGone(gone, g) {
  if (!g) return gone;
  const old = gone.find(x => x.id === g.id);
  if (old) { old.ks = [...new Set([...old.ks, ...g.ks])].sort((a, b) => a - b); return gone; }
  return [...gone, g];
}
