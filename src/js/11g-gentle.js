/* ===================== БЕРЕЖНЫЙ РЕЖИМ =====================
   Две независимые настройки:
   • «Беречь суставы» (S.protect) — с любой целью: упражнения с пиковой нагрузкой на отмеченные суставы не
     подбираются, в своём плане и при переносе программы заменяются похожими без неё. Пиковая нагрузка — те же
     правила, что красные метки на манекене (09f-joint-stress.js); пороги здесь не меняются.
   • Цель «Бережно» (GOALS.gentle) — для тех, у кого болят суставы или идёт восстановление: 12–15 повторов лёгким
     весом с запасом 3–4 повтора, медленно; без прыжков, рывковых и сложных (третьего уровня) упражнений;
     при подборе предпочтение упражнениям без пиковой нагрузки на суставы.
     Основание дозировки: Garber C.E. et al. ACSM Position Stand, MSSE 2011, 43(7):1334–1359 — 10–15 повторов
     и 40–50% от 1ПМ для начинающих и старших, 60–70% для новичков; одна-две серии.
   • Правило боли — модель контроля боли: Silbernagel K.G., Thomeé R. et al., Am J Sports Med 2007, 35(6):897–906:
     боль во время нагрузки до 5 из 10, к утру проходит, от недели к неделе не нарастает. */
/* acc — «нагрузка на что»: шею, поясницу, заднюю поверхность бедра */
const PROTECT = [
  {id:'neck', name:'Шея', acc:'шею', part:'шея'},
  {id:'shoulders', name:'Плечи', acc:'плечи', part:'плечи'},
  {id:'elbows', name:'Локти', acc:'локти', part:'локти'},
  {id:'wrists', name:'Запястья', acc:'запястья', part:'запястья'},
  {id:'lumbar', name:'Поясница', acc:'поясницу', part:'поясница'},
  {id:'knees', name:'Колени', acc:'колени', part:'колени'},
  {id:'achilles', name:'Ахилловы сухожилия', acc:'ахилловы сухожилия', part:'ахилловы сухожилия'},
  {id:'hams', name:'Задняя поверхность бедра', acc:'заднюю поверхность бедра', part:'задняя поверхность бедра'}
].map(p => ({...p, rules:STRESS_RULES.filter(r => r.parts.includes(p.part)).map(r => r.id)}));
const PROTECT_BY = Object.fromEntries(PROTECT.map(p => [p.id, p]));
/* ударные и рывковые движения: пиковая нагрузка на суставы в несколько раз больше веса тела */
const GENTLE_SKIP_PATTERNS = new Set(['jump', 'burpee', 'climb']), GENTLE_SKIP = new Set(['kbswing', 'kbswing1', 'kbclean', 'kbsnatch']);

function ensureProtect(s) {
  s.protect = Array.isArray(s.protect) ? PROTECT.map(p => p.id).filter(id => s.protect.includes(id)) : [];
  return s.protect;
}
ensureProtect(S);

/* ---------- какие суставы нагружает упражнение: считается по 41 положению манекена один раз за сборку ---------- */
const STRESS_IDS = new Map(), STRESS_IDS_KEY = 'podhod.stress.v1';
let stressIdsLoaded = false, stressIdsSave = 0;
function stressIdsBuild() { return typeof window !== 'undefined' && window.PODHOD_BUILD || null; }
function stressIdsOf(ex) {
  if (!stressIdsLoaded) {
    stressIdsLoaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(STRESS_IDS_KEY) || 'null');
      if (saved && saved.build && saved.build === stressIdsBuild())
        for (const [id, v] of Object.entries(saved.ids || {})) if (EXI[id] && Array.isArray(v) && v.every(r => STRESS_RULE[r])) STRESS_IDS.set(id, v);
    } catch (e) {}
  }
  let v = STRESS_IDS.get(ex.id);
  if (!v) { v = jointStress(ex).rules.map(r => r.id); STRESS_IDS.set(ex.id, v); stressIdsSchedule(); }
  return v;
}
function stressIdsSchedule() {
  if (!stressIdsBuild() || stressIdsSave) return;
  stressIdsSave = setTimeout(() => {
    stressIdsSave = 0;
    try { localStorage.setItem(STRESS_IDS_KEY, JSON.stringify({build:stressIdsBuild(), ids:Object.fromEntries(STRESS_IDS)})); } catch (e) {}
  }, 1500);
}
/* досчитать заранее, в простое: тогда переключение суставов и цели не ждёт расчёта */
function prefetchStressIds() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const queue = EX.filter(ex => !STRESS_IDS.has(ex.id));
  const idle = window.requestIdleCallback ? cb => requestIdleCallback(cb, {timeout:1500}) : cb => setTimeout(() => { const end = performance.now() + 8; cb({timeRemaining:() => Math.max(0, end - performance.now())}); }, 60);
  const work = deadline => {
    do { const ex = queue.shift(); if (!ex) return; try { stressIdsOf(ex); } catch (e) {} } while (deadline.timeRemaining() > 10);
    idle(work);
  };
  idle(work);
}

/* ---------- подходит ли упражнение при выбранных суставах и цели ---------- */
function protectRules() { const set = new Set(); for (const id of ensureProtect(S)) for (const r of PROTECT_BY[id].rules) set.add(r); return set; }
function protectHits(ex) {
  if (!ensureProtect(S).length) return [];
  const ids = stressIdsOf(ex);
  return S.protect.map(id => PROTECT_BY[id]).filter(p => p.rules.some(r => ids.includes(r)));
}
function jointOk(ex) { return !protectHits(ex).length; }
function gentleOk(ex) { return S.goal !== 'gentle' || (ex.lvl <= 2 && !GENTLE_SKIP.has(ex.id) && !GENTLE_SKIP_PATTERNS.has(PATTERN[ex.id])); }
/* «Беречь колени»: кроме меток — никакого приседа и выпада стоя глубже порога правила колен (85°, на одной ноге 80°;
   Fry et al. 2003, Lorenzetti et al. 2012 — 09f-joint-stress.js), даже с весом тела и с коленями за носками: ни в подборе,
   ни в замене, ни в своём плане. Решение владельца 12.11.2026: «по коленям надо максимально застраховаться от того, что
   человек травмирует колено по нашей рекомендации». Гоблет-присед → присед без веса снимает лишь гантель, сгиб остаётся
   тем же (stressKneeDepth); подходят меньший сгиб или упражнения без опоры на стопы (мостик, сгибания ног) */
function kneeDeepBlocked(ex) { return ensureProtect(S).includes('knees') && typeof stressKneeDeep === 'function' && stressKneeDeep(ex); }
function fitsBody(ex) { return gentleOk(ex) && jointOk(ex) && !kneeDeepBlocked(ex); }
/* замена (в своём плане, в программе другого места, кнопкой «Заменить») — по тем же правилам, что подбор */
function swapFits(ex) { return fitsBody(ex); }
const joinNames = list => list.length > 1 ? list.slice(0, -1).join(', ') + ' и ' + list[list.length - 1] : list[0] || '';
function hitsText(hits) { return joinNames(hits.map(p => p.acc)); }
/* почему упражнение не подходит — для замены и для списка «нечем заменить» */
function unfitWhy(ex) {
  const hits = protectHits(ex);
  if (hits.length) return `нагружает ${hitsText(hits)}`;
  if (kneeDeepBlocked(ex)) return 'глубокий сгиб колена';
  if (!gentleOk(ex)) return ex.lvl > 2 ? 'сложный вариант' : 'ударная или рывковая нагрузка';
  return '';
}

/* пометка в списках атласа и «Добавить упражнение»: чем упражнение не подходит бережному режиму */
function unfitHtml(ex, willSwap = false) {
  const why = unfitWhy(ex);
  return why ? ` · <span class="unfit">${esc(why)}${willSwap ? ' — в плане будет замена' : ''}</span>` : '';
}
/* что не вошло в свой план или перенесённую программу и почему */
function lostMessages(lost, E) {
  const eq = lost.filter(ex => !available(ex, E)), body = lost.filter(ex => available(ex, E)), out = [];
  if (eq.length) out.push(`Здесь нечем выполнить и нечем заменить: ${eq.map(ex => ex.name).join(', ')}. В другом месте ${eq.length > 1 ? 'они вернутся' : 'оно вернётся'} в план.`);
  if (body.length) out.push(`${body.length > 1 ? 'Бережный режим: нечем заменить, в план не вошли' : 'Бережный режим: нечем заменить, в план не вошло'}: ${body.map(ex => `${ex.name} (${unfitWhy(ex)})`).join(', ')}.`);
  return out;
}

/* ---------- настройки: «Беречь суставы» ---------- */
function renderProtect() {
  const on = new Set(ensureProtect(S));
  $('#j-chips').innerHTML = PROTECT.map(p => `<button type="button" class="chip${on.has(p.id) ? ' on' : ''}" data-protect="${p.id}" aria-pressed="${on.has(p.id)}">${ICON.check}<span>${p.name}</span></button>`).join('');
  $('#j-note').textContent = on.size
    ? `Упражнения с пиковой нагрузкой на ${hitsText(S.protect.map(id => PROTECT_BY[id]))} не подбираются, в своём плане заменяются похожими.`
    : 'Отметьте суставы, которые болят или восстанавливаются: план обойдёт упражнения с пиковой нагрузкой на них — по тем же правилам, что красные метки на манекене.';
}

/* ---------- плашка в плане: дозировка, правило боли, когда к врачу ---------- */
function gentleHtml() {
  const gentle = S.goal === 'gentle', prot = ensureProtect(S).map(id => PROTECT_BY[id]);
  if (!gentle && !prot.length) return '';
  /* запас — тот же, что в строке нагрузки карточек (reserveOf: неделя цикла, уровень) */
  const rir = gentle ? reserveOf(S.mode === 'program' ? WEEKS[S.week - 1] : null) : null;
  const lead = gentle
    ? `<p><b>Бережно.</b> 12–15 повторов лёгким весом, ${rir ? 'оставляя силы ещё на {n}'.replace('{n}', reserveReps(rir)) : NOT_LIMIT}, медленно и без рывков. Прыжки, рывковые и сложные упражнения не подбираются.${prot.length ? ` Без пиковой нагрузки на ${hitsText(prot)}.` : ''}</p>`
    : `<p><b>Без пиковой нагрузки на ${hitsText(prot)}.</b> Такие упражнения не подбираются, а в своём плане заменяются похожими.</p>`;
  return `<details class="gentle-box"${ensureFold(S).gentle ? '' : ' open'}><summary>Бережный режим: правило боли</summary>${lead}
    <p><b>Боль во время упражнения</b> по шкале от 0 до 10: до 2 — продолжайте; 3–5 — можно, если к утру боль проходит и от недели к неделе не нарастает; больше 5 — остановитесь, уменьшите вес или амплитуду либо замените упражнение.</p>
    <p class="gentle-warn">Не заменяет врача. Острая боль, отёк, онемение, ощущение нестабильности сустава, недавняя травма или операция — сначала к врачу или реабилитологу.</p></details>`;
}

document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t || !t.dataset.protect) return;
  const id = t.dataset.protect; if (!PROTECT_BY[id]) return;
  S.protect = S.protect.includes(id) ? S.protect.filter(x => x !== id) : S.protect.concat(id);
  ensureProtect(S); regen();
});
document.addEventListener('toggle', e => {
  if (!e.target.classList || !e.target.classList.contains('gentle-box')) return;
  ensureFold(S).gentle = !e.target.open; saveSettings();
}, true);
