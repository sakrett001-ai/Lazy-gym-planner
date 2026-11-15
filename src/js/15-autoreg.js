/* ===================== АВТОРЕГУЛИРОВКА ===================== */
/* Решения принимаются по журналу. Правила:
   1. Застой: 3 последние тренировки по упражнению без роста расчётного максимума (±1%) и без выхода на верх диапазона → заменить упражнение или поработать в другом диапазоне.
   2. Недобор: 2 последние тренировки подряд ниже нижней границы повторов → снизить вес (это уже делает подсказка) — здесь только отмечаем.
   3. Усталость: за последние 10 дней не меньше 4 записей, и в половине из них хотя бы один подход ниже нижней границы → внеплановая разгрузка.
   4. Пропуск: последняя запись старше 14 дней при наличии истории → мягкий возврат по ступенчатой шкале (LAYOFF_STEPS):
      чем дольше перерыв, тем ниже вес; одно и то же число — в плашке, в подсказке карточки, в разминке и в поле веса на экране
      тренировки (suggestBase, 13-log.js). */
/* Шкала после перерыва (замечание кардиолога, Михаил п. 1: было «на 10 % ниже» и после 14, и после 200 дней, а подставлялся
   прежний вес). Что найдено (11.2026):
   · Bosquet L. et al., Scand J Med Sci Sports 2013, 23(3):e140–e149 (метаанализ, аннотация): прекращение силовых тренировок
     снижает все виды силы; эффект растёт с длительностью перерыва, больше — у старших 65 лет и у малоактивных. По пересказу
     (Stronger by Science, «Detraining»): до 28 дней максимальная сила почти не меняется, после — потери ускоряются.
   · Encarnação I.G.A. et al., Muscles 2022, 1(1):1–15 (систематический обзор, текст): после 3 недель — минимальные изменения;
     через 24 недели сила ниже на 4–12 % (Häkkinen и др.) и на 17 % (в другой работе); к 32–48 неделям — возвращается
     к уровню до тренировок.
   Ступени — потеря силы за этот срок плюс запас на первую тренировку (связки и сухожилия отвыкли от веса, техника): 14–27 дней —
   10 %, 4–12 недель — 15 %, 12–24 недели — 20 %, больше 24 недель — 30 % (сила могла вернуться к исходной — начать как
   с новичка, «подберите вес заново»). */
const LAYOFF_STEPS = [{from:14, pct:10}, {from:28, pct:15}, {from:84, pct:20}, {from:168, pct:30}];
function layoffPct(gap) { let pct = 0; for (const s of LAYOFF_STEPS) if (gap >= s.from) pct = s.pct; return pct; }
const AR = {dismissed:{}, light:false};
try { Object.assign(AR, JSON.parse(localStorage.getItem('podhod.autoreg.v1') || '{}')); } catch (e) {}
function arSave() { try { localStorage.setItem('podhod.autoreg.v1', JSON.stringify({dismissed:AR.dismissed, light:AR.light})); } catch (e) {} }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

function exerciseStall(it) {
  const ex = it.ex, past = pastSessions(ex.id);
  if (past.length < 3 || ex.kind || loadType(ex) !== 'kg') return null;
  const m = metricOf(ex), [lo, hi] = parseRange(it.rx.reps);
  const last3 = past.slice(-3), vals = last3.map(m.f);
  if (vals.some(v => v == null)) return null;
  const grew = vals[2] > vals[0] * 1.01 || vals[2] > vals[1] * 1.01;
  const topReached = last3.some(s => { const sets = s.s.filter(Boolean); const w = Math.max(...sets.map(x => x[0] || 0)); return sets.filter(x => x[0] === w).every(x => x[1] >= hi); });
  if (grew || topReached) return null;
  return {kind:'stall', ex, since:last3[0].d, text:`${ex.name}: три тренировки подряд без роста (${fmtDay(last3[0].d, true)} — ${fmtDay(last3[2].d, true)}). Смените упражнение на 3–4 недели или поработайте в диапазоне ${hi + 2}–${hi + 5} повторов с меньшим весом.`};
}
function fatigueCheck(items) {
  const today = todayKey(), cutoff = dayKey(new Date(Date.now() - 10 * 86400000));
  let n = 0, low = 0;
  const seen = new Set();
  for (const [id, ss] of Object.entries(LOG.data)) {
    const ex = EXI[id]; if (!ex || ex.kind) continue;
    const it = items.find(x => x.ex.id === id);
    const [lo] = parseRange(it ? it.rx.reps : GOALS[S.goal].reps[ex.type]);
    for (const s of ss) {
      if (s.d < cutoff || s.d >= today || !s.s.some(Boolean)) continue;
      n++; seen.add(s.d);
      if (s.s.filter(Boolean).some(x => x[1] < lo)) low++;
    }
  }
  if (n < 4 || low * 2 < n) return null;
  return {kind:'fatigue', n, low, text:`За 10 дней в ${low} из ${n} записей не дотянули до нижней границы повторов. Похоже на накопленную усталость: возьмите разгрузочную неделю — подходов на 40% меньше, веса на 10–15% ниже.`};
}
/* перерыв: дней с последней записи до сегодняшнего дня и снижение веса (%), null — перерыва нет */
function layoffInfo() {
  let last = '';
  for (const ss of Object.values(LOG.data)) for (const s of ss) if (Array.isArray(s.s) && s.s.some(Boolean) && s.d > last && s.d < todayKey()) last = s.d;
  if (!last) return null;
  const gap = daysBetween(last, todayKey()), pct = layoffPct(gap);
  return pct ? {last, gap, pct} : null;
}
function layoffCheck() {
  const L = layoffInfo(); if (!L) return null;
  const long = L.gap >= LAYOFF_STEPS[LAYOFF_STEPS.length - 1].from;
  const text = 'Последняя запись {d}, перерыв {g}. Первую тренировку проведите на весах на {p}% ниже прежних — они уже подставлены в карточки и на экран тренировки; дальше возвращайтесь по правилу прибавок.'
    .replace('{d}', fmtDay(L.last, true)).replace('{g}', `${L.gap} ${plural(L.gap, 'день', 'дня', 'дней')}`).replace('{p}', L.pct);
  return {kind:'layoff', gap:L.gap, pct:L.pct, text:text + (long ? ' ' + 'После полугода сила могла вернуться к той, что была до тренировок: если и этот вес тяжёл, подберите его заново, как в первый раз.' : '')};
}
function autoreg() {
  if (!plan || !plan.items) return [];
  const out = [];
  const lay = layoffCheck(); if (lay) out.push(lay);
  const fat = !lay && fatigueCheck(plan.items); if (fat) out.push(fat);
  if (!fat && !lay) for (const it of plan.items) { const st = exerciseStall(it); if (st) out.push(st); }
  return out.filter(r => !AR.dismissed[arKey(r)]);
}
function arKey(r) { return r.kind === 'stall' ? 'stall:' + r.ex.id + ':' + r.since : r.kind + ':' + todayKey().slice(0, 7); }
function autoregHtml() {
  const recs = autoreg();
  const items = recs.map(r => {
    const key = arKey(r);
    let act = '';
    if (r.kind === 'stall') act = `<button type="button" class="btn-ghost" data-ar-swap="${r.ex.id}">${ICON.swap}<span>Заменить</span></button>`;
    else if (r.kind === 'fatigue') act = S.mode === 'program' ? `<button type="button" class="btn-ghost" data-ar-deload="1">Включить разгрузку</button>` : `<button type="button" class="btn-ghost" data-ar-light="1">${AR.light ? 'Вернуть обычный объём' : 'Облегчить тренировку'}</button>`;
    return `<li><span class="ar-i ar-${r.kind}" aria-hidden="true"></span><p>${esc(r.text)}</p><div class="ar-act">${act}<button type="button" class="lk" data-ar-dismiss="${esc(key)}">Скрыть</button></div></li>`;
  }).join('');
  if (!items && !AR.light) return '';
  const lightNote = AR.light ? `<li><span class="ar-i ar-fatigue" aria-hidden="true"></span><p>Облегчённый режим: подходов на 40% меньше, подсказки весов на 10% ниже. Действует, пока вы его не выключите.</p><div class="ar-act"><button type="button" class="btn-ghost" data-ar-light="1">Вернуть обычный объём</button></div></li>` : '';
  return `<section class="ar" aria-label="Рекомендации по нагрузке"><h2>По вашему журналу</h2><ul>${items}${lightNote}</ul></section>`;
}
/* облегчённый режим влияет на дозировку в одиночном режиме */
function applyLight(rx, ex) {
  if (!AR.light || S.mode === 'program') return rx;
  if (rx.static) { rx.series = Math.max(1, rx.series - 1); rx.sets = rx.series * 3; }
  else if (!rx.circ) rx.sets = Math.max(2, Math.ceil(rx.sets * 0.6));
  rx.light = true;
  return rx;
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.arDismiss) { AR.dismissed[t.dataset.arDismiss] = true; arSave(); renderPlan(); return; }
  if (t.dataset.arSwap) {
    const it = plan.items.find(x => x.ex.id === t.dataset.arSwap); if (!it) return;
    const btn = document.querySelector(`.card[data-ex="${it.ex.id}"] [data-swap]`); if (btn) btn.click();
    return;
  }
  if (t.dataset.arDeload) { S.week = 4; AR.dismissed['fatigue:' + todayKey().slice(0, 7)] = true; arSave(); saveSettings(); renderPlan(); return; }
  if (t.dataset.arLight) { AR.light = !AR.light; if (AR.light) AR.dismissed['fatigue:' + todayKey().slice(0, 7)] = true; arSave(); renderPlan(); return; }
});
