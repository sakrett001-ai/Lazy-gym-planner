/* ===================== ЗАГРУЗКА МЫШЦ ПО ЖУРНАЛУ ===================== */
/* Сколько подходов получила каждая группа мышц за 7 скользящих дней и сколько она отдыхает после последней существенной
   нагрузки; по этому собирается «тренировка на сегодня»: сначала недогруженные и отдохнувшие группы.
   Формат журнала прежний (13-log.js): LOG.data[exId] = [{d:'YYYY-MM-DD', s:[[кг, повторы] | null, …]}, …].

   Счёт подходов — то же правило, что у графика «Подходов на группу за неделю» в плане (groupShare, 11-planner.js):
   подход засчитывается целиком целевой группе упражнения и наполовину остальным работающим (Pelland et al.,
   Sports Med 2026; 56(2):481–505 — «дробный» счёт лучше всего предсказывает прирост). Считаются только записанные
   (непустые) подходы; односторонний подход «по 10 на каждую сторону» — одна строка журнала, один подход (с левой
   и правой стороной отдельно — тоже один: стороны лежат в том же подходе, 13a-sets.js).

   Журнал хранит только дату, без времени. Человек обычно тренируется примерно в одно время суток, поэтому часы отдыха —
   24 × число календарных дней между датой записи и сегодня: вчера — 24 ч, позавчера — 48 ч, три дня назад — 72 ч.
   «Середина дня» сделала бы статус зависимым от часа, когда открыт журнал: утром четверга понедельник — 68 ч
   («восстанавливается»), вечером — 78 ч («готова»), хотя тренировка та же. */
const LOAD = {
  days:7,        /* окно: сегодня и 6 предыдущих дней */
  lo:10, hi:20,  /* коридор подходов на группу в неделю: Schoenfeld, Ogborn, Krieger, J Sports Sci 2017; 35(11):1073–1082 —
                    10 и больше подходов в неделю дают больший прирост, чем меньше; верх 20 — как у графика плана и у Fitbod */
  minSets:2,     /* существенная нагрузка — 2 и больше подхода основной работы группы в одной тренировке (в один день) */
  loadedH:48,    /* Morán-Navarro et al., Eur J Appl Physiol 2017; 117(12):2387–2399: без отказа восстановление в основном
                    за 24–48 ч — до 48 ч группа «нагружена», */
  readyH:72,     /* после подходов до отказа — до 72 ч: 48–72 ч — «восстанавливается», от 72 ч — «готова» */
  perGroup:3     /* в тренировке на сегодня — не больше 3 упражнений на одну группу */
};
const LOAD_ST = {loaded:'нагружена', recovering:'восстанавливается', ready:'готова'};
const loadGroups = () => GROUPS.map(g => g.id).filter(g => g !== 'cardio');
/* разница в календарных днях между ключами 'YYYY-MM-DD' (без часовых поясов и перевода часов) */
function keyDays(a, b) {
  const t = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((t(b) - t(a)) / 864e5);
}

/* Статус восстановления — по основной работе группы: подход засчитывается ей, если она целевая для упражнения или
   её мышцы в нём основные (pri). Вспомогательные мышцы (sec) и кардио статус не меняют: восстановление у Morán-Navarro
   и соавт. измерялось по основным мышцам упражнения, а иначе, например, четыре подхода тяги верхнего блока (грудные
   во вспомогательных) и три жима стоя (передняя зубчатая — в группе «Грудь») делали бы грудь «нагруженной» после дня
   спины и плеч. Объём за 7 дней (полосы) — по общему дробному правилу, как в плане. */
const mainGroupsOf = ex => ex.g === 'cardio' ? [] : [...groupsOf(ex)];

/* по каждой группе: v — засчитанные подходы за 7 дней; last — последняя существенная нагрузка {d, age (дней), sets —
   подходов основной работы в тот день}; h — часы отдыха; st — loaded | recovering | ready */
function muscleLoad(data = LOG.data, today = todayKey()) {
  const days = {};
  for (const [id, ss] of Object.entries(data || {})) {
    const ex = EXI[id]; if (!ex || !Array.isArray(ss)) continue;
    const share = groupShare(ex), main = mainGroupsOf(ex);
    for (const s of ss) {
      if (!s || typeof s.d !== 'string' || !Array.isArray(s.s)) continue;
      const n = s.s.filter(Boolean).length, age = keyDays(s.d, today);
      if (!n || !(age >= 0)) continue; /* записи «из будущего» (часы телефона) не считаем */
      const day = days[s.d] || (days[s.d] = {age, g:{}, m:{}});
      for (const [g, x] of Object.entries(share)) day.g[g] = (day.g[g] || 0) + n * x;
      for (const g of main) day.m[g] = (day.m[g] || 0) + n;
    }
  }
  const out = {};
  for (const g of loadGroups()) {
    let v = 0, last = null;
    for (const [d, day] of Object.entries(days)) {
      if (day.age < LOAD.days) v += day.g[g] || 0;
      const x = day.m[g] || 0;
      if (x >= LOAD.minSets && (!last || day.age < last.age)) last = {d, age:day.age, sets:x};
    }
    const h = last ? last.age * 24 : Infinity;
    out[g] = {v, last, h, st:h < LOAD.loadedH ? 'loaded' : h < LOAD.readyH ? 'recovering' : 'ready'};
  }
  return out;
}

/* ---------- тренировка на сегодня ---------- */
/* Кандидаты — «готовые» и «восстанавливающиеся» группы (у вторых вес вдвое меньше, одно упражнение и на подход меньше);
   «нагруженные» пропускаются, упражнения, где они основные, отодвигаются. Порядок — по недобору до 10 подходов
   за 7 дней, умноженному на долю группы в обычном плане (GROUP_W): 6 недостающих подходов спины важнее 6 подходов
   предплечий, которые и так работают в каждой тяге. Групп — не больше, чем упражнений; при меньше 3 групп с недобором
   добавляются готовые без недобора. Группы без упражнений в этом месте (инвентарь, уровень, бережный режим) не берутся. */
function logPick(load = muscleLoad(), opt = {}) {
  const count = opt.count || S.count, E = opt.E || effEquip(S.equip), lvlMax = S.level === 'beg' ? 2 : 3;
  const can = g => EX.some(ex => ex.g === g && available(ex, E) && ex.lvl <= lvlMax && (S.format !== 'static' || staticOk(ex)) && fitsBody(ex));
  const order = g => GROUPS.findIndex(x => x.id === g);
  const rows = loadGroups().map(g => {
    const L = load[g], need = Math.max(0, LOAD.lo - L.v);
    return {g, v:L.v, st:L.st, age:L.last ? L.last.age : null, sets:L.last ? L.last.sets : 0, need,
      p:GROUP_W[g] * (need / LOAD.lo + 0.1) * (L.st === 'recovering' ? 0.5 : 1)};
  });
  const rest = rows.filter(r => r.st === 'loaded');
  const cand = rows.filter(r => r.st !== 'loaded' && r.v < LOAD.hi && can(r.g)).sort((a, b) => b.p - a.p || order(a.g) - order(b.g));
  let chosen = cand.filter(r => r.need > 0).slice(0, count);
  if (chosen.length < 3) chosen = chosen.concat(cand.filter(r => !chosen.includes(r)).slice(0, 3 - chosen.length));
  return {rows:chosen, rest, groups:chosen.map(r => r.g).sort((a, b) => order(a) - order(b))};
}
/* доли групп для подбора: каждой — по упражнению, остальные упражнения — готовым группам пропорционально приоритету */
function pickWeights(rows, count) {
  const fresh = rows.filter(r => r.st !== 'recovering'), sumP = fresh.reduce((a, r) => a + r.p, 0), extra = Math.max(0, count - rows.length);
  const weights = {};
  for (const r of rows) weights[r.g] = Math.min(LOAD.perGroup, 1 + (r.st !== 'recovering' && sumP > 0 ? extra * r.p / sumP : 0));
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return {weights, count:Math.max(1, Math.min(count, Math.round(total)))};
}
/* подбор по журналу действует в день, когда собран, пока группы в параметрах те же; иначе — обычный подбор */
function logPickCtx() {
  const p = S.logPick;
  if (S.mode !== 'single' || !p || typeof p !== 'object' || p.d !== todayKey() || !Array.isArray(p.groups) || !Array.isArray(p.rows) || !p.groups.length) return null;
  if (p.groups.length !== S.groups.length || !p.groups.every(g => S.groups.includes(g))) return null;
  const rows = p.rows.filter(r => r && GROUP_W[r.g] && p.groups.includes(r.g) && r.p > 0);
  if (rows.length !== p.groups.length) return null;
  return {...pickWeights(rows, S.count), rest:new Set((p.rest || []).map(r => r && r.g).filter(g => GROUP_W[g])),
    light:new Set(rows.filter(r => r.st === 'recovering').map(r => r.g)), pick:p};
}
/* восстанавливающаяся группа: на подход меньше (не меньше двух; в статодинамике — на серию меньше) */
function easeRx(rx) {
  if (rx.static) { if (rx.series > 1) { rx.eased = rx.sets; rx.series -= 1; rx.sets = rx.series * STATIC.perSeries; } }
  else if (rx.sets > 2) { rx.eased = rx.sets; rx.sets -= 1; }
  return rx;
}
function easedTag(r) { return r.eased && r.sets < r.eased && !r.circ ? '<span class="rx-light">на подход меньше: мышцы восстанавливаются</span>' : ''; }

/* собрать: группы — в параметры плана, снимок журнала — в S.logPick (план не меняется от записей по ходу тренировки) */
function applyLogPick(today = todayKey()) {
  const pick = logPick(muscleLoad(LOG.data, today));
  if (!pick.rows.length) return null;
  const prev = S.mode;
  S.view = 'plan';
  if (S.mode !== 'single') { S.mode = 'single'; S.day = 0; switchModeSettings(prev); }
  S.groups = pick.groups;
  S.logPick = {d:today, groups:pick.groups, rows:pick.rows, rest:pick.rest.map(r => ({g:r.g, age:r.age, sets:r.sets}))};
  regen();
  return pick;
}

/* ---------- тексты ---------- */
function setsWord(v) { return Number.isInteger(v) ? plural(v, 'подход', 'подхода', 'подходов') : 'подхода'; }
function agoText(age, d) {
  if (age === 0) return 'сегодня';
  if (age === 1) return 'вчера';
  if (age === 2) return 'позавчера';
  return age < LOAD.days ? `${age} ${plural(age, 'день', 'дня', 'дней')} назад` : fmtDay(d, true);
}
function restText(r) {
  if (r.age == null) return r.v > 0 ? 'основной нагрузки не было' : 'нагрузки не было';
  return `отдых ${r.age} ${plural(r.age, 'день', 'дня', 'дней')}`;
}
function loadStatusHtml(L) {
  const det = L.last ? `${agoText(L.last.age, L.last.d)}, ${L.last.sets} ${setsWord(L.last.sets)}` : L.v > 0 ? 'основной нагрузки не было' : 'нагрузки не было';
  return `<span class="ml-st"><i aria-hidden="true"></i><b>${LOAD_ST[L.st]}</b><span>${det}</span></span>`;
}

/* одна строка сверху: кто нагружен, кто восстанавливается, сколько групп готово */
function loadSummaryHtml(load) {
  const by = st => loadGroups().filter(g => load[g].st === st), names = gs => gs.map(g => GN[g].toLowerCase()).join(', ');
  const loaded = by('loaded'), rec = by('recovering'), ready = by('ready').length;
  if (!loaded.length && !rec.length) return `<p class="ml-sum"><span class="st-ready"><i aria-hidden="true"></i>Все группы готовы к нагрузке.</span></p>`;
  return `<p class="ml-sum">${loaded.length ? `<span class="st-loaded"><i aria-hidden="true"></i>Нагружены: ${names(loaded)}</span>` : ''}${rec.length ? `<span class="st-recovering"><i aria-hidden="true"></i>Восстанавливаются: ${names(rec)}</span>` : ''}${ready ? `<span class="st-ready"><i aria-hidden="true"></i>Готовы: ${ready} ${plural(ready, 'группа', 'группы', 'групп')}</span>` : ''}</p>`;
}
/* панель в журнале: подходы за 7 дней (полосы как в плане) и статус восстановления */
function muscleLoadHtml(load = muscleLoad()) {
  const ids = loadGroups(), any = ids.some(g => load[g].v > 0);
  const max = Math.max(22, ...ids.map(g => load[g].v));
  const body = any ? `<ul class="vbars ml-list">${ids.map(g => volRow(g, load[g].v, max, loadStatusHtml(load[g]), 'st-' + load[g].st)).join('')}</ul>
    <p class="ml-legend"><span class="st-loaded"><i></i>нагружена — меньше 48 ч</span><span class="st-recovering"><i></i>восстанавливается — 48–72 ч</span><span class="st-ready"><i></i>готова — от 72 ч</span></p>`
    : `<p class="ml-empty">За 7 дней записей нет — все мышцы отдохнули. Тренировка на сегодня начнётся с крупных групп.</p>`;
  return `<section class="ml" id="ml" aria-labelledby="ml-title">
    <div class="ml-head">
      <div><p class="eyebrow">Загрузка мышц</p><h2 id="ml-title">Подходы за 7 дней и отдых</h2>
        <p class="ml-sub">Сегодня и 6 предыдущих дней, по записанным подходам. Полоса — ориентир для роста: 10–20 подходов на группу в неделю.</p>
        ${any ? loadSummaryHtml(load) : ''}</div>
      <div class="ml-act"><button type="button" class="btn" data-logpick="journal">Собрать тренировку на сегодня →</button>
        <p class="p-hint ml-msg" id="ml-msg" role="status"></p></div>
    </div>
    ${body}
    <details class="rule ml-how"><summary>Как считается</summary>
      <p>Подход засчитывается целиком целевой группе упражнения и наполовину остальным работающим — как в графике недели в плане (Pelland и соавт., 2026). Считаются только записанные подходы; «по 10 на каждую сторону» — один подход.</p>
      <p>Ориентир — 10–20 подходов на группу в неделю: от 10 подходов мышцы растут заметнее (Schoenfeld, Ogborn, Krieger, 2017).</p>
      <p>Статус — по последней тренировке, где группа сделала 2 подхода и больше как основная: меньше 48 ч назад — нагружена, 48–72 ч — восстанавливается, от 72 ч — готова. Если подходы не доводить до предела, мышцы восстанавливаются в основном за 24–48 ч, после подходов до предела — до 72 ч (Morán-Navarro и соавт., 2017). Вспомогательная работа и кардио статус не меняют. В журнале только даты, поэтому часы считаются по дням: вчера — 24 ч, позавчера — 48 ч, три дня назад — 72 ч.</p>
      <p>Тренировка на сегодня: сначала группы с наибольшим недобором до 10 подходов (крупные мышцы — раньше мелких), нагруженные пропускаются, восстанавливающиеся получают одно упражнение и на подход меньше. Инвентарь места, уровень и число упражнений — из параметров плана.</p>
    </details>
  </section>`;
}

/* строка-объяснение в плане по каждой выбранной группе */
function logPickHtml(p) {
  const lp = p && p.byLog ? logPickCtx() : null;
  if (!lp) return '';
  const order = g => GROUPS.findIndex(x => x.id === g);
  const rows = lp.pick.rows.slice().sort((a, b) => b.p - a.p || order(a.g) - order(b.g));
  const li = rows.map(r => {
    const today = Math.round((p.gvol[r.g] || 0) * 2) / 2;
    return `<li><span class="ar-i st-${r.st}" aria-hidden="true"></span><p><b>${GN[r.g]}:</b> ${fmtNum(r.v)} из 10 за 7 дней, ${restText(r)}${r.st === 'recovering' ? ' — восстанавливается, на подход меньше' : ''}<em class="lp-add">${today ? `сегодня +${fmtNum(today)}` : 'сегодня без упражнений'}</em></p></li>`;
  }).join('');
  const rest = (lp.pick.rest || []).filter(r => r && GN[r.g]);
  const skip = rest.length ? `<p class="lp-skip">Отдыхают — нагружены меньше 48 ч назад: ${rest.map(r => `${GN[r.g].toLowerCase()} (${agoText(r.age)})`).join(', ')}.</p>` : '';
  return `<section class="ar lp" aria-label="Подбор по журналу"><h2>Собрано по журналу</h2><ul>${li}</ul>${skip}</section>`;
}
/* «По журналу» среди заготовок мышц — в разовой тренировке, когда в журнале есть записи */
function logPresetHtml() {
  if (S.mode !== 'single' || !journalDays()) return '';
  const on = !!logPickCtx();
  return `<button type="button" class="pre pre-log${on ? ' on' : ''}" data-logpick="setup" aria-pressed="${on}" title="Недогруженные и отдохнувшие мышцы по журналу за 7 дней">По журналу</button>`;
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-logpick]'); if (!t) return;
  const from = t.dataset.logpick;
  if (applyLogPick()) { window.scrollTo({top:0}); return; }
  const msg = 'Все группы мышц нагружены меньше 48 ч назад или для них нет упражнений здесь — сегодня лучше отдохнуть.';
  const el = from === 'journal' ? $('#ml-msg') : $('#lp-msg');
  if (el) { el.hidden = false; el.textContent = msg; }
});
