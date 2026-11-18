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
     Это рекомендации для практически здоровых взрослых («apparently healthy adults»): при хронических болезнях — только
     после осмотра и совета специалиста (из аннотации). Поэтому в пояснении цели и в плашке: после травмы или операции —
     сначала к врачу; нагрузка — словами («лёгкий вес, все повторы спокойно»), а не в процентах от максимума на 1 повтор,
     которого человек после травмы не знает и проверять не должен (замечание кардиолога, Михаил п. 8).
   • Правило боли — модель контроля боли: Silbernagel K.G., Thomeé R., Eriksson B.I., Karlsson J., Am J Sports Med 2007,
     35(6):897–906 — РКИ на 38 больных тендинопатией ахиллова сухожилия (аннотация, PEDro); правила в пересказе
     (physicaltherapyfirst.com): во время нагрузки боль ниже 5 из 10, после — до 5, к утру проходит, боль и скованность
     от недели к неделе не нарастают. Проверено на ахилле — в плашке это сказано прямо.
   • Стоп-сигналы сердца: при боли или давлении в груди, боли в шее, челюсти или руке, одышке, необычной усталости,
     перебоях в сердце, головокружении «прекратите занятие и сразу обратитесь к врачу» — памятка ACSM «Who needs a stress
     test before exercising» (acsm.org; источник в ней — Riebe et al., MSSE 2015, 47(11):2473–2479).
   • Тяжёлая база со штангой (HEAVY_SPINE: присед, становая, наклоны и тяги в наклоне со штангой) в «Бережно» не
     подбирается (отчёт Mike, п. 8: «Бережно» + колени — первой стояла становая 2 × 12–15). Наклон с весом нагружает диски
     поясницы сильнее всего: давление в диске стоя 0,5 МПа, подъём 20 кг с согнутой спиной — 2,3 МПа, с согнутыми коленями —
     1,7 МПа (Wilke et al. 1999, Spine 24(8):755–762), а в долгом подходе 12–15 повторов разгибатели спины устают и хуже её
     защищают (McGill S., Low Back Disorders, 3-е изд., 2016 — см. HEAVY_SPINE, 11-planner.js). */
/* acc — «нагрузка на что»: шею, поясницу, заднюю поверхность бедра */
/* Строгие отметки (решение владельца 15.11.2026, отчёт Елены п. 13): «После операции на колене» и «Грыжа диска» включают
   обычные «Колени» и «Поясницу» (base) и добавляют свои правила (STRICT ниже); собственных меток у них нет — rules пустой.
   В файле состояния — тот же список S.protect: прежние версии незнакомые отметки отбрасывают, а base в списке остаётся. */
const PROTECT = [
  {id:'neck', name:'Шея', acc:'шею', part:'шея'},
  {id:'shoulders', name:'Плечи', acc:'плечи', part:'плечи'},
  {id:'elbows', name:'Локти', acc:'локти', part:'локти'},
  {id:'wrists', name:'Запястья', acc:'запястья', part:'запястья'},
  {id:'lumbar', name:'Поясница', acc:'поясницу', part:'поясница'},
  {id:'disc', name:'Грыжа диска (поясница)', acc:'поясницу с грыжей диска', part:'поясница', base:'lumbar'},
  {id:'knees', name:'Колени', acc:'колени', part:'колени'},
  {id:'kneeOp', name:'После операции на колене', acc:'колено после операции', part:'колени', base:'knees'},
  {id:'achilles', name:'Ахилловы сухожилия', acc:'ахилловы сухожилия', part:'ахилловы сухожилия'},
  {id:'hams', name:'Задняя поверхность бедра', acc:'заднюю поверхность бедра', part:'задняя поверхность бедра'}
].map(p => ({...p, rules:p.base ? [] : STRESS_RULES.filter(r => r.parts.includes(p.part)).map(r => r.id)}));
const PROTECT_BY = Object.fromEntries(PROTECT.map(p => [p.id, p]));
/* ударные и рывковые движения: пиковая нагрузка на суставы в несколько раз больше веса тела */
const GENTLE_SKIP_PATTERNS = new Set(['jump', 'burpee', 'climb']), GENTLE_SKIP = new Set(['kbswing', 'kbswing1', 'kbclean', 'kbsnatch']);
/* Строже обычных отметок — правила, которых нет в метках (метка видна всем, а это — только для отмеченного):
   · kneeOp — без поворота корпуса на опорной ноге (stressPivot ≥ STRESS_PIVOT, 09f-joint-stress.js: Markolf et al. 1995 —
     внутренний поворот голени вместе с силой вперёд даёт наибольшую силу на ПКС; Aspetar, руководство по реабилитации после
     пластики ПКС: смена направления и повороты — после критериев). Разгибание в открытой цепи до прямой ноги, прыжки,
     быстрая смена ног, боковая нагрузка, упор на колени и глубокий сгиб стоя — уже в «Коленях»;
   · disc — без ударной нагрузки (метка «приземление»: прыжки): давление в диске L4–5 при беге трусцой — до 0,95 МПа против
     0,5 стоя (Wilke et al. 1999, Spine 24(8):755–762). Сгибание, скручивание, разгибание корпуса на весу, длинный рычаг
     и осевая нагрузка стоя — уже в «Пояснице». На беговой дорожке при обеих отметках — шаг без бега (treadmillWalk). */
const STRICT = {
  kneeOp:{why:'поворот корпуса на опорной ноге', test:ex => typeof stressPivot === 'function' && stressPivot(ex) >= STRESS_PIVOT},
  disc:{why:'ударная нагрузка на позвоночник', test:ex => stressIdsOf(ex).includes('landing')}
};

/* известные отметки в порядке списка; строгая отметка включает обычную */
function protectNorm(list) {
  const on = new Set((Array.isArray(list) ? list : []).filter(id => PROTECT_BY[id])); for (const id of [...on]) if (PROTECT_BY[id].base) on.add(PROTECT_BY[id].base);
  return PROTECT.map(p => p.id).filter(id => on.has(id));
}
function ensureProtect(s) { s.protect = protectNorm(s.protect); return s.protect; }
/* Что бережём сейчас: свои отметки человека (S.protect, для всех планов) и, в своём плане, — отметки, с которыми план пришёл
   из файла (c.protect: тренер берёг колени ученика — у ученика без отметок план тот же, Марина 2, перепроверка Ксении).
   Свои отметки действуют всегда: план из файла или по ссылке им подчиняется */
function protectOn(s = S) {
  const own = ensureProtect(s), c = s.mode === 'custom' && Array.isArray(s.customs) && typeof customOf === 'function' ? customOf(s) : null;
  return c && c.protect && c.protect.length ? protectNorm(own.concat(c.protect)) : own;
}
/* отметки, которые пришли с открытым своим планом, а у человека их нет */
function protectFromPlan(s = S) { const own = new Set(ensureProtect(s)); return protectOn(s).filter(id => !own.has(id)); }
/* что показать словами: строгая отметка вместо своей обычной («колено после операции», а не «колени и колено…») */
function protectShown(list = protectOn(S)) { const strict = new Set(list.map(id => PROTECT_BY[id].base).filter(Boolean)); return list.filter(id => !strict.has(id)).map(id => PROTECT_BY[id]); }

/* ---------- «Пропустить → больно» (14-workout-mode.js): упражнение не возвращается в план само ----------
   S.pain = {off: [id] — убраны из подбора и замен до «Вернуть», log: [{d, id, how: 'removed' | 'swapped', to}] — пометки
   в журнале (последние 200), pend: [id] — отмечены посреди тренировки: в подбор не идут только после её закрытия, чтобы
   оставшиеся упражнения открытой тренировки не пересобрались (painFlush)}. Хранится в параметрах — значит, и в копии. */
const PAIN_LOG_MAX = 200;
function ensurePain(s) {
  const p = s.pain && typeof s.pain === 'object' ? s.pain : {};
  const off = Array.isArray(p.off) ? [...new Set(p.off.filter(id => typeof id === 'string' && EXI[id]))] : [];
  const log = Array.isArray(p.log) ? p.log.filter(x => x && typeof x.id === 'string' && /^\d{4}-\d\d-\d\d$/.test(x.d || '') && ['removed', 'swapped'].includes(x.how))
    .map(x => ({d:x.d, id:x.id, how:x.how, ...(typeof x.to === 'string' && EXI[x.to] ? {to:x.to} : {})})).slice(-PAIN_LOG_MAX) : [];
  const pend = Array.isArray(p.pend) ? [...new Set(p.pend.filter(id => typeof id === 'string' && EXI[id] && !off.includes(id)))] : [];
  s.pain = {off, log, pend};
  return s.pain;
}
function painOff(ex) { return ensurePain(S).off.includes(ex.id); }
/* отметить «больно»: убрать из подбора (посреди тренировки — после её закрытия), записать в журнал дня d */
function painMark(id, how, d, to, pending = false) {
  const p = ensurePain(S);
  if (!EXI[id]) return;
  if (pending) { if (!p.off.includes(id) && !p.pend.includes(id)) p.pend.push(id); }
  else if (!p.off.includes(id)) p.off.push(id);
  p.log = p.log.filter(x => !(x.d === d && x.id === id)).concat({d, id, how, ...(to && EXI[to] ? {to} : {})}).slice(-PAIN_LOG_MAX);
  saveSettings();
}
function painReturn(id) { const p = ensurePain(S); p.off = p.off.filter(x => x !== id); p.pend = p.pend.filter(x => x !== id); saveSettings(); }
function painFlush() { const p = ensurePain(S); if (!p.pend.length) return false; p.off = [...new Set(p.off.concat(p.pend))]; p.pend = []; saveSettings(); return true; }
/* пометка в журнале за день (13-log.js) */
function painDayHtml(d) {
  const marks = ensurePain(S).log.filter(x => x.d === d && EXI[x.id]);
  if (!marks.length) return '';
  return marks.map(x => `<p class="j-pain"><b>${'Больно:'}</b> ${esc(exNameHere(EXI[x.id]))} — ${x.how === 'swapped' && x.to ? `${'заменено на'} ${esc(exNameHere(EXI[x.to]))}` : 'убрано из плана'}</p>`).join('');
}
ensureProtect(S); ensurePain(S);
/* отметки своих планов, прочитанные до этого файла (11d-custom.js: cleanPlanProtect), — только известные */
for (const c of S.customs) if (c.protect) { c.protect = protectNorm(c.protect); if (!c.protect.length) delete c.protect; }
/* отмеченное посреди прошлой тренировки, если приложение закрыли, не закрыв её */
if (S.pain.pend.length) { S.pain.off = [...new Set(S.pain.off.concat(S.pain.pend))]; S.pain.pend = []; }

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
function protectRules() { const set = new Set(); for (const id of protectOn(S)) for (const r of PROTECT_BY[id].rules) set.add(r); return set; }
function protectHits(ex) {
  const on = protectOn(S);
  if (!on.length) return [];
  const ids = stressIdsOf(ex);
  return on.map(id => PROTECT_BY[id]).filter(p => p.rules.some(r => ids.includes(r)));
}
/* строгая отметка, правило которой нарушает упражнение (первая) */
function strictHit(ex) { for (const id of protectOn(S)) if (STRICT[id] && STRICT[id].test(ex)) return id; return null; }
function jointOk(ex) { return !protectHits(ex).length && !strictHit(ex); }
function gentleOk(ex) { return S.goal !== 'gentle' || (ex.lvl <= 2 && !GENTLE_SKIP.has(ex.id) && !GENTLE_SKIP_PATTERNS.has(PATTERN[ex.id]) && !HEAVY_SPINE.has(ex.id)); }
/* «Беречь колени»: кроме меток — никакого приседа и выпада стоя глубже порога правила колен (85°, на одной ноге 80°;
   Fry et al. 2003, Lorenzetti et al. 2012 — 09f-joint-stress.js), даже с весом тела и с коленями за носками: ни в подборе,
   ни в замене, ни в своём плане. Решение владельца 12.11.2026: «по коленям надо максимально застраховаться от того, что
   человек травмирует колено по нашей рекомендации». Гоблет-присед → присед без веса снимает лишь гантель, сгиб остаётся
   тем же (stressKneeDepth); подходят меньший сгиб или упражнения без опоры на стопы (мостик, сгибания ног) */
function kneeDeepBlocked(ex) { return protectOn(S).includes('knees') && typeof stressKneeDeep === 'function' && stressKneeDeep(ex); }
function fitsBody(ex) { return gentleOk(ex) && jointOk(ex) && !kneeDeepBlocked(ex) && !painOff(ex) && (typeof healthOk !== 'function' || healthOk(ex)); }
/* замена (в своём плане, в программе другого места, кнопкой «Заменить») — по тем же правилам, что подбор */
function swapFits(ex) { return fitsBody(ex); }
const joinNames = list => list.length > 1 ? list.slice(0, -1).join(', ') + ' и ' + list[list.length - 1] : list[0] || '';
function hitsText(hits) {
  /* строгая отметка вместо своей обычной: «колено после операции», а не «колени и колено после операции» */
  const strict = new Set(hits.filter(p => p.base).map(p => p.base));
  return joinNames(hits.filter(p => !strict.has(p.id)).map(p => p.acc));
}
/* почему упражнение не подходит — для замены и для списка «нечем заменить» */
function unfitWhy(ex) {
  const hits = protectHits(ex);
  if (hits.length) return `нагружает ${hitsText(hits)}`;
  const strict = strictHit(ex);
  if (strict) return `${STRICT[strict].why} — ${PROTECT_BY[strict].name.toLowerCase()}`;
  if (kneeDeepBlocked(ex)) return 'глубокий сгиб колена';
  if (painOff(ex)) return 'вы отметили «больно»';
  if (typeof healthOk === 'function' && !healthOk(ex)) return 'положение вниз головой';
  if (!gentleOk(ex)) return ex.lvl > 2 ? 'сложный вариант' : HEAVY_SPINE.has(ex.id) ? 'тяжёлая штанга на спину и поясницу' : 'ударная или рывковая нагрузка';
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
  /* в своём плане отмечены и отметки, с которыми план пришёл: снять их можно той же кнопкой (снимается и в плане) */
  const list = protectOn(S), on = new Set(list), fromPlan = protectShown(protectFromPlan(S));
  $('#j-chips').innerHTML = PROTECT.map(p => `<button type="button" class="chip${p.base ? ' chip-strict' : ''}${on.has(p.id) ? ' on' : ''}" data-protect="${p.id}" aria-pressed="${on.has(p.id)}">${ICON.check}<span>${p.name}</span></button>`).join('');
  const strict = [...on].filter(id => PROTECT_BY[id].base);
  $('#j-note').textContent = on.size
    ? `Упражнения с пиковой нагрузкой на ${hitsText(list.map(id => PROTECT_BY[id]))} не подбираются, в своём плане заменяются похожими.`
      + (strict.length ? ' ' + strict.map(id => STRICT_NOTE[id]).join(' ') : '')
      + (fromPlan.length ? ' ' + 'Отметки пришли вместе с этим планом: {list}.'.replace('{list}', fromPlan.map(p => '«' + p.name + '»').join(', ')) : '')
    : 'Отметьте суставы, которые болят или восстанавливаются: план обойдёт упражнения с пиковой нагрузкой на них — по тем же правилам, что красные метки на манекене.';
  const box = $('#j-pain'); if (box) box.innerHTML = painListHtml();
}
/* что добавляют строгие отметки — простыми словами */
const STRICT_NOTE = {
  kneeOp:'После операции на колене — ещё и без поворотов корпуса на опорной ноге; на дорожке — шагом, без бега. Нагрузку и сроки согласуйте с врачом или реабилитологом.',
  disc:'При грыже диска — ещё и без прыжков; на дорожке — шагом, без бега. Нагрузку согласуйте с врачом.'
};
/* убранные «Пропустить → больно»: вернуть в подбор */
function painListHtml() {
  const off = [...ensurePain(S).off, ...S.pain.pend].filter(id => EXI[id]);
  if (!off.length) return '';
  return `<p class="f-note">${'Убраны, потому что было больно:'}</p><div class="chips">${off.map(id => `<button type="button" class="chip on" data-pain-back="${id}" aria-label="${esc('Вернуть в подбор: ' + exNameHere(EXI[id]))}">${esc(exNameHere(EXI[id]))} <span aria-hidden="true">×</span></button>`).join('')}</div>`;
}

/* ---------- плашка в плане: дозировка, правило боли, стоп-сигналы, когда к врачу ---------- */
/* стоп-сигналы сердца — одна строка для плашки и вопроса о здоровье (11k-first-run.js; памятка ACSM, см. шапку) */
const HEART_STOP = 'Остановитесь и обратитесь к врачу, если появились боль или давление в груди, боль в шее, челюсти или руке, необычная одышка, головокружение, перебои в сердце.';
function gentleHtml() {
  const gentle = S.goal === 'gentle', prot = protectShown();
  if (!gentle && !prot.length) return '';
  /* запас — тот же, что в строке нагрузки карточек (reserveOf: неделя цикла, уровень) */
  const rir = gentle ? reserveOf(planWeek()) : null;
  const lead = gentle
    ? `<p><b>Бережно.</b> 12–15 повторов лёгким весом — таким, с которым все повторы даются спокойно${rir ? ' и ' + 'остаются силы ещё на {n}'.replace('{n}', reserveReps(rir)) : `, ${NOT_LIMIT}`}; медленно и без рывков. Прыжки, рывковые, сложные упражнения, тяжёлая штанга на спину и упражнения вниз головой не подбираются.${prot.length ? ` Без пиковой нагрузки на ${hitsText(prot)}.` : ''}</p>`
    : `<p><b>Без пиковой нагрузки на ${hitsText(prot)}.</b> Такие упражнения не подбираются, а в своём плане заменяются похожими.</p>`;
  return `<details class="gentle-box"${ensureFold(S).gentle ? '' : ' open'}><summary>Бережный режим: правило боли и когда остановиться</summary>${lead}
    <p><b>Боль в суставах во время упражнения</b> по шкале от 0 до 10: до 2 — продолжайте; 3–5 — можно, если к утру боль проходит и от недели к неделе не нарастает; больше 5 — остановитесь, уменьшите вес или амплитуду либо замените упражнение.</p>
    <p class="gentle-stop">${HEART_STOP}</p>
    <p class="gentle-warn">Правило боли взято из лечения боли в ахилловом сухожилии, нагрузка — из рекомендаций для здоровых взрослых: это ориентир, а не лечение. После травмы или операции, при острой боли, отёке, онемении, ощущении нестабильности сустава — сначала к врачу или реабилитологу.</p></details>`;
}
/* беговая дорожка при «Коленях» и «Грыже диска»: шаг без бега (отчёт Елены, п. 14) — у бега есть фаза полёта и удар стопы:
   давление в диске при беге трусцой до 0,95 МПа против 0,5 стоя (Wilke et al. 1999); после пластики ПКС бег — только после
   критериев (Aspetar, см. 09f-joint-stress.js). На дорожке скорость задаёт человек, поэтому упражнение остаётся — шагом */
function treadmillWalk(ex) { const on = protectOn(S); return (on.includes('knees') || on.includes('disc')) && typeof stressFlight === 'function' && stressFlight(ex); }

document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.painBack) { painReturn(t.dataset.painBack); regen(); return; }
  if (!t.dataset.protect) return;
  const id = t.dataset.protect; if (!PROTECT_BY[id]) return;
  /* снять обычную отметку — снять и строгую, которая её включает; отмеченная планом снимается и в нём */
  const drop = list => list.filter(x => x !== id && (PROTECT_BY[x].base !== id));
  if (protectOn(S).includes(id)) {
    S.protect = drop(S.protect);
    const c = S.mode === 'custom' ? customOf() : null;
    if (c && c.protect) { c.protect = drop(c.protect); if (!c.protect.length) delete c.protect; }
  } else S.protect = S.protect.concat(id);
  ensureProtect(S); regen();
});
document.addEventListener('toggle', e => {
  if (!e.target.classList || !e.target.classList.contains('gentle-box')) return;
  ensureFold(S).gentle = !e.target.open; saveSettings();
}, true);
