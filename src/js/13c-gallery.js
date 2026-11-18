/* ===================== АТЛАС ДВИЖЕНИЙ: ВИТРИНА =====================
   Кнопка «Атлас движений» открывает витрину: все упражнения миниатюрами манекена, по группам мышц. Сверху — фильтр
   «Чем работать» (свободные веса, тренажёры и блоки, резинки, свой вес), «только то, что есть в месте» и поиск.
   Миниатюра открывает подробный разбор в том же окне; «← Все упражнения» возвращает к витрине на то же место.
   «Увеличить» в карточке плана по-прежнему открывает сразу разбор.
   Миниатюра — неподвижный SVG-кадр того же манекена, что в карточках плана (конечная точка движения), строится,
   когда подходит к экрану, — сколько успеется за ~8 мс кадра; готовые миниатюры переиспользуются при смене фильтра. Рамка — по самой
   показанной позе (opts.still), а не по всем фазам: так миниатюра в 4–5 раз дешевле.
   С объёмной графикой миниатюра — кадр общего рендерера карточек в выбранном виде (кости и мышцы, скелет, кожа Anny) —
   в простое, сжатой картинкой из памяти или кеша (13e-gallery-anatomy.js); до его готовности — заглушка цвета сцены.
   SVG-манекен — там, где кадров не будет: без WebGL, при ошибке загрузки данных, если телефон не успевает. */
const WORK_KINDS = [
  {id:'all', name:'Всё'}, {id:'free', name:'Свободные веса'}, {id:'mach', name:'Тренажёры и блоки'},
  {id:'band', name:'Резинки'}, {id:'body', name:'Свой вес'}
];
const EQUIP_CAT = Object.fromEntries(EQUIP.map(e => [e.id, e.cat]));
const FREE_WEIGHTS = new Set(['db', 'bb', 'kb']);
/* чем работать: тренажёр или блок важнее всего (без него упражнение не сделать), потом свободный вес, потом резинка;
   без них — свой вес (скамья, турник, брусья, ролик — опора, а не отягощение) */
function workKind(ex) {
  const ids = ex.eq.flat();
  if (ids.some(id => EQUIP_CAT[id] === 'mach')) return 'mach';
  if (ids.some(id => FREE_WEIGHTS.has(id))) return 'free';
  if (ids.includes('band')) return 'band';
  return 'body';
}
const gallery = {kind:'all', here:false, q:'', on:false, scroll:0, pick:null, last:null};
const galleryThumbs = new Map();
let galleryIO = null, galleryQueue = [], galleryRaf = 0;

/* Поиск (searchExercises, 11i-search.js): по названию на обоих языках, синонимам, группе мышц, с опечатками и в другой
   раскладке; лучшие совпадения первыми. Фильтры «Чем работать» и «только то, что есть» — поверх найденного */
function galleryList(kind = gallery.kind) {
  const E = effEquip(S.equip);
  return searchExercises(gallery.q).list.filter(ex => (kind === 'all' || workKind(ex) === kind) && (!gallery.here || available(ex, E)));
}
/* «+» на плитке: тот же выбор плана, что «+ В свой план» в разборе (cpPickHtml, 11d-custom.js); «✓» — упражнение уже
   в плане, который в списке первым (последний выбранный, без него — открытый). Отдельная кнопка рядом с плиткой, а не внутри:
   нажатие на плитку по-прежнему открывает разбор */
function galleryAddTarget() { return cpPickOrder()[0]; }
function galleryAddLabel(id, name) {
  const p = galleryAddTarget(), has = !!p && p.items.some(it => it.id === id);
  return {has, label:has ? `Добавить в план: ${name} (уже в плане «${p.name}»)` : `Добавить в план: ${name}`};
}
function galleryAddBtn(id, name) {
  const {has, label} = galleryAddLabel(id, name);
  return `<button type="button" class="mv-tadd${has ? ' in' : ''}" data-gadd="${id}" aria-expanded="false" aria-controls="mv-gpick" aria-label="${esc(label)}"><span aria-hidden="true">${has ? '✓' : '+'}</span></button>`;
}
/* название на плитке: с инвентарём этого места, а если здесь упражнения нет — с полным инвентарём */
const galleryTileName = (ex, E = effEquip(S.equip), all = effEquip(EQUIP.map(e => e.id))) => exName(ex, available(ex, E) ? E : all);
/* бережный режим: «нагружает колени — в плане будет замена», как во вкладке «Мышцы» и в «Добавить упражнение» (Елена, п. 5) */
function galleryUnfit(ex) { const why = unfitWhy(ex); return why ? `<span class="mv-tunfit unfit">${esc('{why} — в плане будет замена'.replace('{why}', why))}</span>` : ''; }
function galleryTile(ex, E, all) {
  const here = available(ex, E), name = galleryTileName(ex, E, all), fav = isFav(ex.id);
  const sub = here ? equipLine(ex, E) : `Нет в месте «${placeOf().name}», нужно: ${equipLine(ex, all).toLowerCase()}`;
  return `<div class="mv-tw"><button type="button" class="mv-tile${here ? '' : ' off'}" data-gallery-open="${ex.id}"><span class="mv-thumb" data-thumb="${ex.id}" aria-hidden="true"></span>`
    + `<span class="mv-tname">${fav ? '<span class="mv-tfav" aria-label="В избранном">★</span> ' : ''}${esc(name)}</span><span class="mv-tsub">${esc(sub)}</span>${galleryUnfit(ex)}</button>${galleryAddBtn(ex.id, name)}</div>`;
}
/* ничего не нашлось (строка над витриной — живая, её слышит диктор): из-за фильтров — «Искать во всех: N»; иначе —
   ближайшие по написанию названия или совет. Совет выбрать «Всё», когда «Всё» уже выбрано, не нужен (замечание 20 тестера) */
const galleryFiltered = () => gallery.kind !== 'all' || gallery.here;
function galleryEmptyHtml() {
  const R = searchExercises(gallery.q), wide = R.list.length;
  if (wide && galleryFiltered()) return `<div class="mv-gempty"><button type="button" class="btn-ghost" data-gallery-all="1">${'Искать во всех: {n}'.replace('{n}', wide)}</button></div>`;
  const near = R.near.map(ex => `<button type="button" class="btn-ghost" data-gallery-q="${esc(exNameHere(ex))}">${esc(exNameHere(ex))}</button>`).join('');
  return `<div class="mv-gempty">${near ? `<p>Похожие по написанию:</p><div class="mv-gnear">${near}</div>` : '<p>Проверьте написание или попробуйте другое слово: «жим», «тяга», «присед».</p>'}</div>`;
}
/* Разделы витрины — группы плана; упражнения на приводящие (сведение ног, копенгагенская планка) — своим разделом после
   квадрицепса (4.110; Alex 18, замечание анатома: приводящие — не квадрицепс). С 4.109 приводящие — и своя группа плана
   (GROUPS, 01-exercises-base.js); название раздела — полное, как в атласе */
const GALLERY_GROUPS = GROUPS.map(g => g.id === 'adductors' ? {...g, name:'Приводящие бедра'} : g);
const galleryGroup = ex => ex.g;
function galleryHtml() {
  const E = effEquip(S.equip), all = effEquip(EQUIP.map(e => e.id)), list = galleryList(), R = searchExercises(gallery.q);
  const chips = WORK_KINDS.map(k => `<button type="button" class="${gallery.kind === k.id ? 'on' : ''}" data-gallery-kind="${k.id}" aria-pressed="${gallery.kind === k.id}">${esc(k.name)} <small>${galleryList(k.id).length}</small></button>`).join('');
  /* с запросом группы идут по лучшему совпадению в них (при равенстве — по порядку), без запроса — по порядку */
  const rank = new Map(list.map((ex, i) => [ex.id, i])), first = g => Math.min(...list.filter(ex => galleryGroup(ex) === g.id).map(ex => rank.get(ex.id)));
  const groups = R.mode === 'all' ? GALLERY_GROUPS : GALLERY_GROUPS.slice().sort((a, b) => first(a) - first(b));
  const sections = groups.map(g => {
    const xs = list.filter(ex => galleryGroup(ex) === g.id); if (!xs.length) return '';
    return `<section class="mv-gsec" aria-labelledby="mv-g-${g.id}"><h3 id="mv-g-${g.id}">${esc(g.name)} <small>${xs.length}</small></h3><div class="mv-ggrid">${xs.map(ex => galleryTile(ex, E, all)).join('')}</div></section>`;
  }).join('');
  const note = list.length ? searchNoteText(R) : '';
  return `<div class="mv-gtools"><div class="mv-gkinds" role="group" aria-label="Чем работать">${chips}</div>`
    /* «…» вокруг названия места — в одном шаблоне со следующей подписью: перевод закрывающей кавычки идёт вместе с ней */
    + `<div class="mv-gfilters"><label class="mv-ghere"><input type="checkbox" id="mv-ghere"${gallery.here ? ' checked' : ''}> Только то, что есть в месте «${esc(placeOf().name)}»</label><label class="mv-gsearch"><span class="vh">Найти упражнение</span><input type="search" id="mv-gq" value="${esc(gallery.q)}" placeholder="Найти: жим, тяга, присед…" autocomplete="off"></label></div></div>`
    + `<p class="mv-gcount${list.length ? '' : ' none'}" aria-live="polite">${list.length ? list.length + ' ' + plural(list.length, 'упражнение', 'упражнения', 'упражнений') : R.list.length && galleryFiltered() ? 'С этими фильтрами ничего не нашлось.' : 'Ничего не нашлось.'}</p><p class="mv-gnote" hidden></p>`
    + (note ? `<p class="mv-gsnote">${esc(note)}</p>` : '')
    + (sections || galleryEmptyHtml());
}
/* «+» на плитках — заново по плану, который в списке первым (после добавления им становится выбранный) */
function galleryAddRefresh() {
  const E = effEquip(S.equip), all = effEquip(EQUIP.map(e => e.id));
  for (const b of document.querySelectorAll('#mv-gallery [data-gadd]')) {
    const ex = EXI[b.dataset.gadd], {has, label} = galleryAddLabel(ex.id, galleryTileName(ex, E, all));
    b.classList.toggle('in', has); b.setAttribute('aria-label', label); b.firstElementChild.textContent = has ? '✓' : '+';
  }
}
/* список планов над нижним краем окна (#mv-gpick): открыт для одного упражнения; повторное нажатие, Esc, «Отмена» и
   нажатие мимо закрывают его, фокус — на «+» */
function galleryPickBtn() { return gallery.pick && $('#mv-gallery')?.querySelector(`[data-gadd="${gallery.pick}"]`); }
function galleryPickClose(focus) {
  const box = $('#mv-gpick'), btn = galleryPickBtn();
  if (btn) { btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus({preventScroll:true}); }
  gallery.pick = null;
  if (box) { box.hidden = true; box.replaceChildren(); }
  $('#motion-view')?.classList.remove('mv-has-pick');
}
function galleryPickOpen(btn) {
  const id = btn.dataset.gadd, box = $('#mv-gpick');
  if (gallery.pick === id) return galleryPickClose(true);
  galleryPickClose(false); galleryMsgHide();
  gallery.pick = id; btn.setAttribute('aria-expanded', 'true');
  box.innerHTML = `<p class="mv-gpick-t">${esc(exNameHere(EXI[id]))}</p>${cpPickHtml(id, 'mv-gpick')}<button type="button" class="btn-ghost mv-gpick-x" data-gpick-x="1">Отмена</button>`;
  box.hidden = false; $('#motion-view').classList.add('mv-has-pick');
  box.querySelector('.cp-pick-i').focus({preventScroll:true});
}
/* после выбора: сообщение «Добавлено в «Низ А»» с «Открыть план» у нижнего края — витрина не перерисовывается и не
   прокручивается, атлас остаётся открытым; диктору — тем же текстом (#mv-glive) */
function galleryAddMsg(r) {
  const n = r.plan.name;
  return r.created ? `Создан план «${n}», упражнение добавлено.` : r.added ? `Добавлено в «${n}»` : r.has ? `Уже в плане «${n}»` : `План «${n}» полон: в нём уже ${CUSTOM_MAX} упражнений.`;
}
function galleryMsgShow(r) {
  const box = $('#mv-gmsg'), text = galleryAddMsg(r);
  box.querySelector('#mv-gmsg-t').textContent = text; box.querySelector('[data-cp-go]').dataset.cpGo = r.plan.id;
  box.hidden = false; $('#motion-view').classList.add('mv-has-msg');
  const live = $('#mv-glive'); live.textContent = ''; requestAnimationFrame(() => { live.textContent = text; });
}
function galleryMsgHide() {
  const box = $('#mv-gmsg'); if (box) box.hidden = true;
  $('#motion-view')?.classList.remove('mv-has-msg');
}
function thumbKey(id) { return id + '|' + S.place + '|' + S.equip.join(','); }
/* конечная точка движения узнаётся лучше всего: штанга у груди, присед в нижней точке; у циклических — середина шага */
function thumbT(ex) { return ex.anim.hold ? 0 : ex.anim.loop ? .3 : 1; }
function buildThumb(el) {
  const id = el.dataset.thumb, key = thumbKey(id);
  let svg = galleryThumbs.get(key);
  if (!svg) {
    const it = previewItem(id);
    try { svg = buildFigure(it.ex.anim, {primary:it.ex.pri, has:it.has, ratio:1, camera:'angle', t:thumbT(it.ex), label:it.name, muscles:false, stress:false, still:true}).svg; }
    catch (e) { console.error('Миниатюра', id, e); return; }
    galleryThumbs.set(key, svg);
  }
  /* кадр анатомии (если уже есть) остаётся поверх SVG */
  el.prepend(svg); for (const x of [...el.children]) if (x.tagName.toLowerCase() === 'svg' && x !== svg) x.remove();
  el.classList.add('ready');
}
/* SVG-манекен — только там, где кадра не будет (galleryAnatWantsSvg): иначе до кадра — заглушка цвета сцены */
const galleryNeedsSvg = el => el.isConnected && !el.classList.contains('anat') && !el.querySelector('svg') && galleryAnatWantsSvg(el);
/* за кадр — сколько успеется за ~8 мс, но не меньше одной миниатюры: на быстром телефоне экран заполняется сразу */
function pumpThumbs() {
  galleryRaf = 0;
  const end = performance.now() + 8;
  do {
    const el = galleryQueue.shift(); if (!el) return;
    if (galleryNeedsSvg(el)) buildThumb(el);
  } while (galleryQueue.length && performance.now() < end);
  if (galleryQueue.length) galleryRaf = requestAnimationFrame(pumpThumbs);
}
/* миниатюре на экране нужен SVG (кадра анатомии нет или он убран) */
const gallerySeen = new WeakSet();
function galleryNeedSvg(el) {
  if (!gallerySeen.has(el) || !galleryNeedsSvg(el) || galleryQueue.includes(el)) return;
  galleryQueue.push(el); if (!galleryRaf) galleryRaf = requestAnimationFrame(pumpThumbs);
}
function renderGallery() {
  galleryPickClose(false);
  const box = $('#mv-gallery'); box.innerHTML = galleryHtml();
  if (galleryIO) galleryIO.disconnect();
  galleryQueue = [];
  const thumbs = [...box.querySelectorAll('[data-thumb]')];
  /* вид миниатюр (кадры или SVG) — до первой картинки; готовые ставятся сразу (кадр из памяти — без SVG, готовый SVG —
     только там, где кадров не будет), остальные — когда подходят к экрану */
  galleryAnatMount(box);
  for (const el of thumbs) { if (galleryAnatPlace(el) || !galleryAnatWantsSvg(el)) continue; const svg = galleryThumbs.get(thumbKey(el.dataset.thumb)); if (svg) { el.replaceChildren(svg); el.classList.add('ready'); } }
  if (typeof IntersectionObserver === 'function') {
    galleryIO = new IntersectionObserver(es => {
      for (const e of es) {
        if (e.isIntersecting) gallerySeen.add(e.target); else gallerySeen.delete(e.target);
        /* кадр анатомии уже в памяти — SVG не нужен (или подождёт ответа кеша) */
        if (e.isIntersecting && !e.target.classList.contains('ready') && !galleryQueue.includes(e.target) && !galleryAnatPeek(e.target) && galleryAnatWantsSvg(e.target)) galleryQueue.push(e.target);
      }
      if (galleryQueue.length && !galleryRaf) galleryRaf = requestAnimationFrame(pumpThumbs);
    }, {rootMargin:'300px 0px'});
    for (const el of thumbs) galleryIO.observe(el);
  }
}
function showGallery(focusId) {
  disposeMotion(detailMotion); detailMotion = null;
  gallery.on = true;
  $('#motion-view').classList.add('mv-mode-gallery');
  $('#mv-detail').hidden = true; $('#mv-gallery').hidden = false;
  $('#mv-title').textContent = 'Все упражнения';
  renderGallery();
  const tile = focusId && $('#mv-gallery').querySelector(`[data-gallery-open="${focusId}"]`);
  if (tile) { tile.scrollIntoView({block:'center'}); tile.focus({preventScroll:true}); }
  else $('#mv-gallery').querySelector('[data-gallery-kind].on')?.focus({preventScroll:true});
}
function showDetail() {
  const was = gallery.on; gallery.on = false;
  galleryPickClose(false); galleryMsgHide();
  $('#motion-view').classList.remove('mv-mode-gallery');
  $('#mv-gallery').hidden = true; $('#mv-detail').hidden = false;
  if (galleryIO) galleryIO.disconnect(); cancelAnimationFrame(galleryRaf); galleryRaf = 0; galleryQueue = [];
  if (was) galleryAnatStop();
}
function openGallery() {
  detailReturn = document.activeElement;
  const d = $('#motion-view'); if (!d.open) d.showModal();
  document.documentElement.classList.add('motion-open');
  OverlayBack.open('motion', () => closeMotion(true)); /* системная «Назад» закрывает атлас (12d-back.js) */
  showGallery();
  scheduleMotionLoop();
}
function closeGallery() {
  const was = gallery.on; gallery.on = false;
  galleryPickClose(false); galleryMsgHide();
  if (galleryIO) galleryIO.disconnect(); cancelAnimationFrame(galleryRaf); galleryRaf = 0; galleryQueue = [];
  if (was) galleryAnatStop();
}
function setupGallery() {
  $('#mv-gallery').addEventListener('click', e => {
    const add = e.target.closest('[data-gadd]');
    if (add) { galleryPickOpen(add); return; }
    if (gallery.pick) galleryPickClose(false);
    const all = e.target.closest('[data-gallery-all]');
    if (all) { gallery.kind = 'all'; gallery.here = false; renderGallery(); $('#mv-gq')?.focus(); return; }
    const near = e.target.closest('[data-gallery-q]');
    if (near) { gallery.q = near.dataset.galleryQ; renderGallery(); const q = $('#mv-gq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); return; }
    const k = e.target.closest('[data-gallery-kind]');
    if (k) { gallery.kind = k.dataset.galleryKind; renderGallery(); $('#mv-gallery').querySelector(`[data-gallery-kind="${gallery.kind}"]`)?.focus(); return; }
    const t = e.target.closest('[data-gallery-open]');
    /* карточка упражнения из витрины — своя запись истории: «Назад» возвращает к витрине, как «← Все упражнения» */
    if (t) { showDetail(); selectMotion(previewItem(t.dataset.galleryOpen)); OverlayBack.open('motion-detail', () => showGallery(detailMotion?.it.ex.id)); $('#mv-back').focus(); }
  });
  $('#mv-gallery').addEventListener('change', e => { if (e.target.id === 'mv-ghere') { gallery.here = e.target.checked; renderGallery(); $('#mv-ghere').focus(); } });
  $('#mv-gallery').addEventListener('input', e => {
    if (e.target.id !== 'mv-gq') return;
    gallery.q = e.target.value; const at = e.target.selectionStart;
    renderGallery(); const q = $('#mv-gq'); q.focus(); q.setSelectionRange(at, at);
  });
  $('#mv-back').addEventListener('click', () => { OverlayBack.closed('motion-detail'); showGallery(detailMotion?.it.ex.id); });
  /* выбор плана для «+» на плитке */
  $('#mv-gpick').addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.gpickX) return galleryPickClose(true);
    if (t.dataset.cpTo === undefined || !gallery.pick) return;
    const r = customAddTo(gallery.pick, t.dataset.cpTo || null);
    gallery.last = gallery.pick; galleryPickClose(true);
    if (r) { cpAfterAdd(r); galleryAddRefresh(); galleryMsgShow(r); }
  });
  $('#mv-gmsg').addEventListener('click', e => { if (e.target.closest('.mv-gmsg-x')) { galleryMsgHide(); $('#mv-gallery').querySelector(`[data-gadd="${gallery.last}"]`)?.focus({preventScroll:true}); } });
  /* Esc закрывает список планов, а не атлас */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !gallery.pick) return;
    e.preventDefault(); e.stopPropagation(); galleryPickClose(true);
  });
  setupGalleryAnatomy();
}
