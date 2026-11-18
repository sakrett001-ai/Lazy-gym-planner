/* ===================== АТЛАС МЫШЦ =====================
   Обратный путь к упражнениям: сначала мышца, потом движения. Список берётся из инвентаря текущего места;
   то, что требует другого инвентаря, показано отдельно с подсказкой, где оно есть. */
const ATLAS_GROUPS = [
  ['Грудь и плечи', ['chest', 'delt_f', 'delt_s', 'delt_r', 'serratus', 'cuff']],
  ['Руки', ['biceps', 'triceps', 'forearms']],
  ['Спина', ['lats', 'midback', 'traps', 'lowback']],
  ['Корпус', ['abs', 'obliques']],
  ['Ноги', ['glutes', 'quads', 'adductors', 'hipflex', 'hams', 'calves']]
];
const ATLAS_ORDER = ATLAS_GROUPS.flatMap(g => g[1]);
/* что делает мышца — коротко, чтобы было понятно, зачем её тренировать */
const MUSCLE_INFO = {
  chest:'Сводит руки перед собой и опускает их из положения над головой. Верхняя часть сильнее включается в жимах под углом вверх.',
  delt_f:'Поднимает руку вперёд. Помогает во всех жимах — от груди и над головой.',
  delt_s:'Отводит руку в сторону. От неё больше всего зависит ширина плеч.',
  delt_r:'Отводит руку назад и разворачивает плечо наружу. Уравновешивает жимы и держит плечо в правильном положении.',
  biceps:'Сгибает руку в локте и разворачивает ладонь вверх. Помогает во всех тягах.',
  triceps:'Разгибает руку в локте. Длинная головка ещё и отводит плечо назад — поэтому её сильнее растягивают упражнения с рукой над головой.',
  forearms:'Сжимают кисть и держат хват, сгибают и разгибают запястье. Часто первыми устают в тягах.',
  abs:'Сгибает позвоночник и удерживает таз. Не даёт пояснице прогибаться в жимах и планке.',
  obliques:'Поворачивают и наклоняют корпус, удерживают его от скручивания.',
  traps:'Поднимают, сводят и опускают лопатки. Верхняя часть держит плечевой пояс под нагрузкой.',
  midback:'Сводят лопатки. Работают в тягах к поясу и разведениях назад, держат осанку.',
  lats:'Тянут руку вниз и назад к корпусу. Главные мышцы подтягиваний и тяг.',
  lowback:'Держат позвоночник ровным в наклонах, тягах и приседаниях; разгибают корпус.',
  glutes:'Разгибают бедро — выводят из приседа и толкают таз вперёд. Средняя ягодичная удерживает таз и колено на одной линии.',
  quads:'Разгибают колено. Прямая мышца бедра ещё и поднимает бедро вперёд.',
  hams:'Сгибают колено и разгибают бедро. Работают в наклонах от таза и сгибаниях ног.',
  calves:'Поднимают на носки. Икроножная сильнее включается с прямым коленом, камбаловидная — с согнутым.',
  adductors:'Сводят ноги. Большая приводящая ещё и разгибает бедро: в глубоком приседе и выпаде она работает вместе с ягодичными. Прицельно — сведение ног и копенгагенская планка.',
  hipflex:'Поднимают бедро к корпусу — подвздошно-поясничная мышца, прямая мышца бедра, портняжная. Главные мышцы подъёмов ног и коленей.',
  serratus:'Прижимает лопатку к рёбрам, выводит её вперёд и поворачивает вверх. Работает в отжиманиях и жимах над головой.',
  cuff:'Четыре глубокие мышцы вокруг плечевого сустава: держат головку плеча во впадине и вращают руку. Прицельно — вращение плеча наружу; помогают в разведениях назад, «Y-T-W» и тягах сверху.'
};
/* мышцы-помощники: упражнений, где они главная цель, почти нет — в атласе они показаны по упражнениям, в которых работают
   в помощь, а тренировка с акцентом на них не предлагается. Манжета с прицельными упражнениями (вращение плеча наружу
   на блоке и с эспандером) — уже не помощник: у неё есть тренировка с акцентом. */
const ATLAS_SUPPORT = new Set(['serratus']);
/* мышцы задней поверхности: камера для превью ищет их со спины */
const ATLAS_BACK = new Set(['delt_r', 'triceps', 'traps', 'midback', 'lats', 'lowback', 'glutes', 'hams', 'calves', 'cuff']);
let atlasEx = null, atlasCam = null;
/* ракурсы превью: «спереди» и «сзади» — три четверти, так видно и мышцу, и движение */
/* порядок и слова — как у ракурсов разбора и тренировки («Сверху · … · Сбоку · Спереди · Сзади»; Mike 19, Alex 14):
   было «Спереди · Со спины · Сбоку · Сверху» */
const ATLAS_CAMS = {above:'Сверху', side:'Сбоку', angle:'Спереди', rear:'Сзади'};

/* пик учебной кривой участия мышцы в упражнении (0…1) */
function atlasPeak(ex, m) {
  const p = motionProfile(ex.anim)?.muscles?.[m];
  if (p) return Math.max(...p.concentric, ...p.eccentric);
  return ex.pri.includes(m) ? .83 : ex.sec.includes(m) ? .6 : 0;
}
/* порядок в списке: мышца — единственная цель выше, чем одна из нескольких; затем выраженность и «полезность» упражнения */
function atlasScore(ex, m) {
  const pri = ex.pri.includes(m), share = pri ? 1 / Math.sqrt(ex.pri.length) : .45;
  /* кардио нагружает мышцы ног, но силовые упражнения для них идут первыми */
  return share * (.6 + .4 * atlasPeak(ex, m)) * Math.sqrt(EX_W[ex.id] ?? 1) * (ex.g === 'cardio' ? .6 : 1) + (pri && ex.pri[0] === m ? .05 : 0);
}
function atlasNeed(ex, E) {
  return ex.eq.filter(g => !g.some(id => E.has(id))).map(g => g.map(id => eqName(id).toLowerCase()).join(' или '));
}
function atlasFor(m, E) {
  const rows = EX.filter(ex => ex.pri.includes(m) || ex.sec.includes(m))
    .map(ex => ({ex, role:ex.pri.includes(m) ? 'pri' : 'sec', v:atlasPeak(ex, m), score:atlasScore(ex, m)}))
    .sort((a, b) => b.score - a.score || a.ex.lvl - b.ex.lvl);
  const here = rows.filter(r => available(r.ex, E));
  const other = rows.filter(r => !available(r.ex, E)).map(r => ({...r, need:atlasNeed(r.ex, E),
    places:S.places.filter(p => p.id !== S.place && available(r.ex, effEquip(p.equip))).map(p => p.name)}));
  return {pri:here.filter(r => r.role === 'pri'), sec:here.filter(r => r.role === 'sec'), other};
}
function atlasCounts(E) {
  const out = {};
  for (const m of ATLAS_ORDER) out[m] = EX.filter(ex => ex.pri.includes(m) && available(ex, E)).length;
  return out;
}
/* акцент тренировки на мышцу: в разовой тренировке её группа добавляется к выбранным */
function setFocus(m) {
  S.focus = m && MUSCLE_NAMES[m] ? m : null;
  if (S.focus && S.mode !== 'program' && !S.groups.includes(MUSCLE_GROUP[S.focus])) {
    S.groups = S.groups.concat(MUSCLE_GROUP[S.focus]).sort((a, b) => GROUPS.findIndex(x => x.id === a) - GROUPS.findIndex(x => x.id === b));
    if (typeof storePlanSetting === 'function') storePlanSetting('groups'); /* в своём плане — его мышцы (11d-custom.js) */
  }
}
/* ракурс превью, с которого мышцу видно: сравниваем направление на камеру с нормалью груди в середине повторения */
function atlasCamera(ex, m) {
  const R = ex.anim.catalogRig ? ex.anim.catalogRig(.5) : null;
  if (!R || !R.n) return ATLAS_BACK.has(m) ? 'back' : 'front';
  const want = (ATLAS_BACK.has(m) ? -1 : 1), n = [R.n[0] * want, -R.n[1] * want, R.n[2] * want];
  let best = 'side', top = .5;
  for (const key of ['angle', 'rear', 'above', 'front', 'back']) {
    const C = CAMERA3[key], y = C.yaw * Math.PI / 180, e = C.elevation * Math.PI / 180;
    const eye = [-Math.sin(y) * Math.cos(e), -Math.sin(e), Math.cos(y) * Math.cos(e)];
    /* три четверти объёмнее плоского вида, но только если мышца к ним действительно повёрнута */
    /* средняя дельта смотрит вбок: её и отведение руки лучше всего видно прямо спереди */
    const d = eye[0] * n[0] + eye[1] * n[1] + eye[2] * n[2], s = d + ((key === 'angle' || key === 'rear') && d > .4 && m !== 'delt_s' ? .5 : 0);
    if (s > top) { top = s; best = key; }
  }
  return best;
}

/* схема для выбора: средняя дельта выделена из передней и задней, каждая мышца — кнопка */
const ATLAS_SPLIT = {
  delt_f:[['delt_f', [[64, 36], [71, 36], [75, 47], [76, 58], [73, 54], [69, 45], [64, 40]]], ['delt_s', [[71, 36], [73, 36], [80, 42], [82, 53], [78, 61], [76, 58], [75, 47]]]],
  delt_r:[['delt_r', [[67, 36], [73, 36.8], [76, 46], [76.5, 55.5], [72, 48]]], ['delt_s', [[73, 36.8], [75, 37], [81, 43], [82, 53], [78, 58], [76.5, 55.5], [76, 46]]]]
};
function atlasMapSvg(sel, counts) {
  const neutral = new Set(['head', 'neck', 'hand', 'pelvis', 'knee', 'foot', 'flank']);
  const view = (shapes, dx, label) => {
    const by = new Map(), base = [];
    for (const [m, kind, d] of shapes) {
      const parts = ATLAS_SPLIT[m] ? ATLAS_SPLIT[m].map(([id, pts]) => [id, 'p', pts]) : [[m, kind, d]];
      for (const [id, k, dd] of parts) for (const q of [dd, mirrorShape(k, dd)]) {
        if (neutral.has(id)) { base.push(shapeSvg(k, q, {class:'mm-n'})); continue; }
        if (!by.has(id)) by.set(id, []);
        by.get(id).push(shapeSvg(k, q, {class:'mm-b'}));
      }
    }
    let s = `<g transform="translate(${dx},0)">${base.join('')}`;
    for (const [id, list] of by) {
      const on = id === sel, none = !counts[id];
      s += `<g class="am-m${on ? ' on' : ''}${none ? ' none' : ''}" data-atlas-m="${id}" role="button" tabindex="0" aria-pressed="${on}" aria-label="${esc(MUSCLE_NAMES[id])}"><title>${esc(MUSCLE_NAMES[id])}</title>${list.join('')}</g>`;
    }
    return s + `<text x="50" y="216" class="mm-l">${label}</text></g>`;
  };
  return `<svg viewBox="0 0 206 222" class="mmap amap" aria-label="Схема мышц: нажмите на мышцу">${view(MAP_FRONT, 0, 'спереди')}${view(MAP_BACK, 106, 'сзади')}</svg>`;
}

function atlasRow(r, m, sel) {
  const ex = r.ex, E = effEquip(S.equip), name = exName(ex, E);
  const others = ex.pri.filter(x => x !== m).map(x => MUSCLE_NAMES[x].toLowerCase());
  const how = r.role === 'pri' ? (others.length ? 'вместе с: ' + others.slice(0, 2).join(', ') : 'главная цель') : 'основная работа: ' + ex.pri.slice(0, 2).map(x => MUSCLE_NAMES[x].toLowerCase()).join(', ');
  return `<li class="at-row${sel ? ' on' : ''}">${favButton(ex.id)}<button type="button" class="at-ex" data-atlas-ex="${ex.id}" aria-pressed="${sel}"><span class="at-sw" style="background:${muscleColor(r.v)}" title="${MUSCLE_BANDS[muscleBand(r.v)]}"></span><span class="at-n"><b>${esc(name)}</b><small>${esc(equipLine(ex, E))} · ${esc(how)}${ex.lvl >= 3 ? ' · сложное' : ''}${unfitHtml(ex)}</small></span></button>`
    + `<button type="button" class="at-open" data-atlas-open="${ex.id}" aria-haspopup="dialog" aria-controls="motion-view" aria-label="Разобрать движение: ${esc(name)}">↗</button></li>`;
}
/* избранное и свой план для упражнения в превью (выбор плана — 11d-custom.js) */
function atlasKeepHtml(id) { return cpKeepHtml(id, 'at'); }
function atlasList(rows, m, sel, limit) {
  return `<ol class="at-list">${rows.map((r, i) => atlasRow(r, m, r.ex.id === sel).replace('<li class="at-row', i >= limit ? '<li hidden class="at-more at-row' : '<li class="at-row')).join('')}</ol>`
    + (rows.length > limit ? `<button type="button" class="at-show" data-atlas-show="1">Показать все: ${rows.length}</button>` : '');
}

function renderAtlas() {
  const m = MUSCLE_NAMES[S.atlasM] ? S.atlasM : 'chest', E = effEquip(S.equip);
  const A = atlasFor(m, E), counts = atlasCounts(E);
  const first = A.pri[0] || A.sec[0];
  if (!atlasEx || ![...A.pri, ...A.sec].some(r => r.ex.id === atlasEx)) { atlasEx = first ? first.ex.id : null; atlasCam = null; }
  const place = placeOf();
  /* у места — сколько упражнений с основной нагрузкой на мышцу (как число у мышцы выше) и сколько всего, со вспомогательной */
  const here = p => { const PE = effEquip(p.equip), all = EX.filter(ex => (ex.pri.includes(m) || ex.sec.includes(m)) && available(ex, PE)); return {main:all.filter(ex => ex.pri.includes(m)).length, all:all.length}; };
  const name = MUSCLE_NAMES[m], lower = name.toLowerCase();
  let html = `<header class="at-head">
    <p class="eyebrow">Атлас мышц</p>
    <h1 class="p-title">Выберите мышцу</h1>
    <p class="at-lead">Нажмите на мышцу — покажем упражнения, в которых она работает, из инвентаря выбранного места.</p>
    <p class="at-favs"><span>★ В избранном: <b class="at-favn">${S.fav.length}</b></span><button type="button" class="link" data-cp-go="1">Собрать свой план →</button></p>
  </header>
  <div class="at-grid">
    <section class="at-pick" aria-label="Мышцы">
      <div class="at-map">${atlasMapSvg(m, counts)}</div>
      ${ATLAS_GROUPS.map(([g, ids]) => `<h2 class="at-gh">${g}</h2><div class="at-chips">${ids.map(id => `<button type="button" class="at-chip${id === m ? ' on' : ''}${counts[id] ? '' : ' none'}" data-atlas-m="${id}" aria-pressed="${id === m}"><span>${esc(MUSCLE_NAMES[id])}</span><small>${counts[id] || '—'}</small></button>`).join('')}</div>`).join('')}
      <p class="f-note">Число — упражнения с основной нагрузкой на мышцу в месте «${esc(place.name)}».</p>
    </section>
    <section class="at-detail" id="at-detail" aria-labelledby="at-name">
      <h2 class="at-name" id="at-name">${esc(name)}</h2>
      <p class="at-desc">${esc(MUSCLE_INFO[m])}</p>
      <div class="at-where"><span class="at-wl">Упражнений на эту мышцу</span><div class="places at-places" role="group" aria-label="Где тренируетесь">${S.places.map(p => { const n = here(p); return `<button type="button" class="place${p.id === S.place ? ' on' : ''}" data-place="${p.id}" aria-pressed="${p.id === S.place}"><b>${esc(p.name)}</b><small>${n.main} ${plural(n.main, 'основное', 'основных', 'основных')} · ${n.all} всего</small></button>`; }).join('')}</div></div>
      <div class="at-acts">
        ${ATLAS_SUPPORT.has(m) ? '<p class="f-note">Эта мышца работает в помощь основным и отдельной тренировки не требует: она включается в упражнениях ниже.</p>' : `<button type="button" class="btn" data-atlas-focus="${m}">Тренировка с акцентом на эту мышцу →</button>
        ${S.focus === m ? '<span class="at-focus-on">Акцент уже выбран</span>' : ''}`}
      </div>`;
  if (first) {
    const it = previewItem(atlasEx);
    html += `<div class="motion-tile at-tile" id="at-preview">
        <button type="button" class="illus" data-fig="0" aria-haspopup="dialog" aria-controls="motion-view" aria-label="Разобрать движение: ${esc(it.name)}"><span class="at-stage"></span><span class="illus-zoom" aria-hidden="true">Разобрать технику ↗</span></button>
        <div class="motion-bar"><span class="motion-caption">Исходное положение</span><button type="button" data-motion-pause="0">Пауза</button></div>
      </div>
      <div class="at-under"><p class="at-pv"><b id="at-pv-name">${esc(it.name)}</b></p><div class="at-cams" role="group" aria-label="Ракурс">${Object.entries(ATLAS_CAMS).map(([c, label]) => `<button type="button" data-atlas-cam="${c}" aria-pressed="false">${label}</button>`).join('')}</div></div>
      <div class="at-keep" id="at-keep">${atlasKeepHtml(atlasEx)}</div>
      <p class="at-hint">Оранжевым выделена выбранная мышца: чем ярче цвет, тем сильнее она работает в этот момент повторения.</p>`;
    if (A.pri.length) html += `<h3 class="at-h">Основная нагрузка <small>${A.pri.length}</small></h3>${atlasList(A.pri, m, atlasEx, 8)}`;
    else if (!ATLAS_SUPPORT.has(m)) html += `<p class="warn-inline">Здесь нет упражнений, где ${esc(lower)} — основная цель. Ниже — те, где она помогает, и что нужно для остальных.</p>`;
    if (A.sec.length) html += `<h3 class="at-h">Помогает <small>${A.sec.length}</small></h3>${atlasList(A.sec, m, atlasEx, 5)}`;
  } else {
    html += `<div class="empty"><h2>Здесь нечем нагрузить эту мышцу</h2><p>В месте «${esc(place.name)}» нет подходящего инвентаря. Ниже — что для этого нужно.</p></div>`;
  }
  if (A.other.length) {
    html += `<details class="at-other"><summary>Нужен другой инвентарь <small>${A.other.length}</small></summary><ul class="at-olist">${A.other.map(r => `<li><button type="button" class="at-open at-orow" data-atlas-open="${r.ex.id}" aria-haspopup="dialog" aria-controls="motion-view"><b>${esc(r.ex.name)}</b><small>${r.role === 'pri' ? 'основная' : 'помогает'} · нужно: ${esc(r.need.join('; '))}${r.places.length ? ` · есть: ${esc(r.places.join(', '))}` : ''}</small></button></li>`).join('')}</ul></details>`;
  }
  html += `<p class="legend">Схема и цвет — учебная иллюстрация участия мышц, а не замер электрической активности.</p></section></div>`;
  $('#plan').innerHTML = html;
  mountAtlasPreview(m);
}
function mountAtlasPreview(m = S.atlasM) {
  for (const F of figs) disposeMotion(F);
  figs = [];
  const tile = $('#at-preview');
  if (!tile || !atlasEx) return;
  const it = previewItem(atlasEx), btn = tile.querySelector('.illus');
  const cam = atlasCam || atlasCamera(it.ex, m);
  try {
    const f = createMotionFigure(it.ex.anim, {primary:it.ex.pri, has:it.has, ratio:1.25, t:0, label:it.name, camera:cam, muscles:true});
    f.setRegion?.(m); f.setVectors?.(false); f.setTrace?.(false); f.setJoints?.(false); f.svg.classList.remove('show-joints');
    tile.querySelector('.at-stage').replaceChildren(f.svg);
    const F = {btn, it, f, vis:true, paused:reduceMotion, clock:0, durations:motionDurations(it)};
    figs = [F]; paintMotion(F);
    const pause = tile.querySelector('[data-motion-pause]');
    pause.textContent = F.paused ? 'Пуск' : 'Пауза';
  } catch (e) { console.error('Атлас', it.ex.id, e); }
  btn.setAttribute('aria-label', 'Разобрать движение: ' + it.name);
  $('#at-pv-name').textContent = it.name;
  /* плоский вид спереди или сзади отмечается на ближайшей кнопке */
  const near = {front:'angle', back:'rear'}[cam] || cam;
  for (const b of document.querySelectorAll('[data-atlas-cam]')) b.setAttribute('aria-pressed', String(b.dataset.atlasCam === near));
  for (const b of document.querySelectorAll('[data-atlas-ex]')) { const on = b.dataset.atlasEx === atlasEx; b.setAttribute('aria-pressed', String(on)); b.parentElement.classList.toggle('on', on); }
  scheduleMotionLoop();
}
function selectAtlasMuscle(m, scroll) {
  if (!MUSCLE_NAMES[m]) return;
  S.atlasM = m; atlasEx = null; atlasCam = null; saveSettings(); renderAtlas();
  if (scroll && window.innerWidth < 900) $('#at-detail').scrollIntoView({block:'start', behavior:reduceMotion ? 'auto' : 'smooth'});
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-focus-clear]')) { setFocus(null); regen(); return; }
  if (S.view !== 'atlas') return;
  const g = e.target.closest('[data-atlas-m]');
  if (g) { selectAtlasMuscle(g.dataset.atlasM, true); return; }
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.atlasEx) { atlasEx = t.dataset.atlasEx; atlasCam = null; mountAtlasPreview(); const k = $('#at-keep'); if (k) k.innerHTML = atlasKeepHtml(atlasEx); return; }
  if (t.dataset.atlasCam) { atlasCam = t.dataset.atlasCam; mountAtlasPreview(); return; }
  if (t.dataset.atlasOpen) { openMotionItem(previewItem(t.dataset.atlasOpen)); return; }
  if (t.dataset.atlasShow) { for (const li of t.previousElementSibling.querySelectorAll('.at-more')) li.hidden = false; t.remove(); return; }
  if (t.dataset.atlasFocus) { setFocus(t.dataset.atlasFocus); S.view = 'plan'; regen(); $('#plan').scrollIntoView({block:'start'}); return; }
});
document.addEventListener('keydown', e => {
  if ((e.key !== 'Enter' && e.key !== ' ') || !e.target.closest) return;
  const g = e.target.closest('g[data-atlas-m]');
  if (!g) return;
  e.preventDefault(); selectAtlasMuscle(g.dataset.atlasM, true);
  const again = document.querySelector(`g[data-atlas-m="${g.dataset.atlasM}"]`); if (again) again.focus();
});
