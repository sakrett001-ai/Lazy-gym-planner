/* ===================== ФАЙЛЫ ПЛАНОВ =====================
   Свои планы выгружаются в JSON и загружаются обратно — свои, от тренера, для ученика. Формат описан в docs/plan-format.md.
   Упражнения хранятся кодами каталога (общими для русской и английской версий), название — для чтения человеком.
   Подходы, повторы и отдых пишутся явно, как их видно в плане, — у получателя план выглядит так же. С 4.111 план несёт
   и то, от чего зависят его упражнения (Марина 1, 2, перепроверка Ксении: у ученика были «Зал» вместо «Дома» и гоблет
   вместо приседа без веса): мышцы, место с инвентарём и наборами гантелей и гирь, отметки «Что беречь» (свои и плана) и
   неделю цикла. Свои отметки получателя действуют поверх отметок плана (protectOn, 11g-gentle.js). Ссылка на план —
   11m-plan-link.js: в ней тот же план, но без отметок «Что беречь» (упражнения в ней уже с заменами). */
const PLAN_FILE = 'lazy-gym-planner/plans', PLAN_FILE_V = 1, PLAN_FILE_MAX = 256 * 1024, PLAN_FILE_PLANS = 50;
let planIn = null;

/* план с его целью, форматом и уровнем: дозировка считается так, как её видит владелец плана */
function withPlanSettings(c, fn) {
  const keep = PLAN_KEYS.map(k => S[k]);
  for (const k of PLAN_KEYS) if (c[k]) S[k] = c[k];
  try { return fn(); } finally { PLAN_KEYS.forEach((k, i) => { S[k] = keep[i]; }); }
}
function exportItem(c, item) {
  const ex = EXI[item.id];
  return withPlanSettings(c, () => {
    const rx = customRx(prescribe(ex, null, effEquip(EQUIP.map(e => e.id))), item, ex), o = {id:ex.id, name:exNameHere(ex)};
    if (!rx.static) {
      if (S.format !== 'circuit') { o.sets = rx.sets; o.rest = rx.rest; }
      if (!ex.kind) o.reps = item.reps || (S.format === 'circuit' ? GOALS[S.goal].circ.reps : String(rx.reps));
      if (item.tempo) o.tempo = item.tempo;
    } else if (item.sets) o.sets = item.sets; /* статодинамика: число серий человек задаёт сам, остальное — метод */
    if (item.kg) o.kg = item.kg.length === 1 ? item.kg[0] : item.kg.slice();
    if (item.note) o.note = item.note;
    if (item.ss === false) o.ss = false;
    return o;
  });
}
/* место для файла: имя (с ключом имени по умолчанию), инвентарь, наборы гантелей и гирь (4.108: dw) */
function placeFile(p) {
  const o = {name:p.name};
  if (p.auto) o.auto = p.auto;
  o.equip = EQUIP.map(e => e.id).filter(id => p.equip.includes(id));
  const dw = {}; for (const impl of ['db', 'kb']) { const a = typeof availOf === 'function' ? availOf(p, impl) : null; if (a) dw[impl] = a; }
  if (Object.keys(dw).length) o.dw = dw;
  return o;
}
/* место плана: своё (c.place) или, у плана прежних версий, то, где человек сейчас */
function planPlace(c) { return S.places.find(p => p.id === c.place) || placeOf(); }
/* отметки «Что беречь», под которые собран план у владельца: его свои и пришедшие с планом */
function planProtect(c) { return protectNorm(ensureProtect(S).concat(c.protect || [])); }
/* opts.items — упражнения вместо c.items (ссылка: с заменами, как их видно); opts.link — без отметок «Что беречь»
   (решение владельца 3: в ссылке нет данных о здоровье) и без названий упражнений (ссылка короче) */
function exportPlan(c, opts = {}) {
  const o = {name:c.name};
  /* ключ имени по умолчанию (11a-names.js): получатель увидит имя на своём языке; прежние версии ключ пропускают */
  if (c.auto) o.auto = c.auto;
  for (const k of ['group', 'for', 'note']) if (c[k]) o[k] = c[k];
  if (c.group && c.gauto) o.gauto = c.gauto;
  for (const k of PLAN_KEYS) o[k] = c[k] || S.gen[k] || S[k];
  const gs = Array.isArray(c.groups) ? c.groups : groupsOfItems(c.items); if (gs) o.groups = gs.slice();
  o.place = placeFile(planPlace(c));
  if (c.week) o.week = c.week;
  if (!opts.link) { const pr = planProtect(c); if (pr.length) o.protect = pr; }
  o.items = (opts.items || c.items).map(it => exportItem(c, it));
  if (opts.link) for (const it of o.items) delete it.name;
  return o;
}
function planFileObject(plans, from, opts = {}) {
  const o = {format:PLAN_FILE, version:PLAN_FILE_V};
  if (!opts.link) Object.assign(o, {app:typeof window !== 'undefined' && window.PODHOD_VERSION || '', exported:new Date().toISOString().slice(0, 10)});
  if (from) o.from = from;
  o.plans = plans.map((c, i) => exportPlan(c, {...opts, items:opts.items ? opts.items[i] : undefined}));
  return o;
}
/* имя файла латиницей: браузеры подменяют имя с кириллицей на «download» */
const TRANSLIT = {а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'sch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya'};
function planFileName(plans) {
  const slug = v => String(v).toLowerCase().replace(/[а-яё]/g, ch => TRANSLIT[ch] ?? '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'plan';
  const c = plans[0], group = plans.length > 1 && plans.every(p => p.group && p.group === c.group) ? c.group : null;
  /* с датой: файлы разных дней не путаются и не перезаписывают друг друга (Дмитрий 23) */
  return `lazy-gym-${plans.length > 1 ? (group ? 'program-' + slug(group) : 'plans') : 'plan-' + slug(c.name)}-${dayKey(new Date())}.json`;
}

/* ---------- чтение файла: только известные поля, разумные значения, понятные ошибки ---------- */
function readPlanFile(text) {
  if (typeof text !== 'string' || !text.trim()) return {error:'Файл пустой.'};
  if (text.length > PLAN_FILE_MAX) return {error:'Файл слишком большой для плана.'};
  let o; try { o = JSON.parse(text); } catch (e) { return {error:'Это не файл плана: текст не читается как JSON. Возможно, файл обрезан при пересылке.'}; }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return {error:'Это не файл плана.'};
  if (o.v && (o.log || o.settings || o.body)) return {error:'Это резервная копия приложения, а не план. Её восстанавливают в разделе «Журнал».'};
  const raw = Array.isArray(o.plans) ? o.plans : Array.isArray(o.items) ? [o] : null;
  if (!raw || (o.format && o.format !== PLAN_FILE)) return {error:'Это не файл плана Lazy Gym Planner.'};
  const newer = Number(o.version) > PLAN_FILE_V;
  const from = cleanText(o.from, CUSTOM_TEXT), plans = [], unknown = [];
  for (const p of raw.slice(0, PLAN_FILE_PLANS)) {
    if (!p || typeof p !== 'object') continue;
    const items = Array.isArray(p.items) ? p.items : [];
    for (const it of items) if (it && !EXI[it.id]) unknown.push(cleanText(it.name, 60) || cleanText(String(it.id || ''), 30) || '?');
    const prep = items.map(it => it && typeof it === 'object' ? {...it, sets:Number.isInteger(it.sets) ? it.sets : undefined, rest:Number.isInteger(it.rest) ? it.rest : undefined} : it);
    /* место в файле — имя и инвентарь (код места у получателя свой: его подберёт addPlans) */
    const c = cleanPlan({...p, place:undefined, items:prep}, ''), pin = cleanPlaceIn(p.place);
    if (pin) c.placeIn = pin;
    /* в своём плане — не больше CUSTOM_MAX упражнений: остальные не пропадают молча (Ксения 11) — сказано, сколько войдёт,
       и можно разбить план на несколько (all — все упражнения плана по порядку) */
    const ids = new Set(), all = prep.map(cleanCustomItem).filter(it => it && !ids.has(it.id) && ids.add(it.id));
    if (all.length > CUSTOM_MAX) c.all = all;
    if (from && !c.from) c.from = from;
    plans.push(c);
  }
  if (!plans.length) return {error:'В файле нет планов.'};
  return {plans, from, note:cleanText(o.note, CUSTOM_NOTE, true), unknown:[...new Set(unknown)], newer, cut:raw.length > PLAN_FILE_PLANS};
}
/* план больше CUSTOM_MAX упражнений → несколько планов по CUSTOM_MAX: «Тест (1/9)», «Тест (2/9)»… */
function splitPlan(p) {
  if (!p.all) return [p];
  const n = Math.ceil(p.all.length / CUSTOM_MAX), base = String(p.name).slice(0, CUSTOM_NAME - 8), out = [];
  for (let i = 0; i < n; i++) { const c = {...p, name:`${base} (${i + 1}/${n})`, items:p.all.slice(i * CUSTOM_MAX, (i + 1) * CUSTOM_MAX)}; delete c.all; delete c.auto; out.push(c); }
  return out;
}
/* место из файла: имя, ключ имени по умолчанию, известный инвентарь, наборы гантелей и гирь; не место — null */
function cleanPlaceIn(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || !Array.isArray(v.equip)) return null;
  const known = new Set(EQUIP.map(e => e.id)), name = cleanText(v.name, 24) || 'Место', o = {name, equip:EQUIP.map(e => e.id).filter(id => known.has(id) && v.equip.includes(id))};
  const auto = autoKey(v.auto, name, 'place'); if (auto) { o.auto = auto; o.name = autoName(auto); }
  const dw = {}; if (v.dw && typeof v.dw === 'object') for (const impl of ['db', 'kb']) { const a = typeof availOf === 'function' ? availOf({dw:v.dw}, impl) : null; if (a) dw[impl] = a; }
  if (Object.keys(dw).length) o.dw = dw;
  return o;
}
/* Место плана у получателя: своё место с тем же инвентарём и теми же наборами гантелей и гирь (одноимённое — первым);
   такого нет — новое место с именем из файла. Свои места не меняются (dryRun — только узнать, какое место будет) */
function placeForIn(pin, dryRun = false) {
  const key = p => JSON.stringify([EQUIP.map(e => e.id).filter(id => p.equip.includes(id)), placeFile(p).dw || null]), want = key({equip:pin.equip, dw:pin.dw, name:pin.name});
  const same = S.places.filter(p => key(p) === want);
  const hit = same.find(p => p.name === pin.name) || same[0];
  if (hit || dryRun) return {place:hit || null, isNew:!hit};
  const names = new Set(S.places.map(p => p.name));
  let name = pin.name; for (let k = 2; names.has(name); k++) name = `${pin.name.slice(0, 20)} (${k})`;
  const p = {id:'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), name, equip:pin.equip.slice(), ...(pin.dw ? {dw:JSON.parse(JSON.stringify(pin.dw))} : {})};
  if (pin.auto && name === pin.name) p.auto = pin.auto;
  S.places.push(p);
  return {place:p, isNew:true};
}
/* добавление: всегда новыми планами, занятые имена получают «(2)»; место из файла — своё такое же или новое; пустая
   заготовка «Мой план» уходит (dropEmptyMy) */
function addPlans(plans) {
  const taken = S.customs.map(c => c.name), added = [];
  for (const p of plans) {
    const c = {...p, id:newPlanId()}; delete c.auto; delete c.all; delete c.placeIn;
    if (p.placeIn) c.place = placeForIn(p.placeIn).place.id;
    Object.assign(c, namedPlan(p.name, p.auto, taken)); taken.push(c.name); S.customs.push(c); added.push(c);
  }
  dropEmptyMy();
  saveSettings(); return added;
}

/* ---------- окно выгрузки ---------- */
function planOutScope(scope) {
  const c = customOf();
  return scope === 'all' ? S.customs.filter(p => p.items.length) : scope === 'group' && c.group ? S.customs.filter(p => p.group === c.group) : [c];
}
function planOutHtml() {
  const c = customOf(), group = c.group ? S.customs.filter(p => p.group === c.group).length : 0, all = S.customs.filter(p => p.items.length).length;
  const radio = (v, label, on, dis) => `<label class="po-opt"><input type="radio" name="po-scope" value="${v}"${on ? ' checked' : ''}${dis ? ' disabled' : ''}><span>${label}</span></label>`;
  /* «Поделиться» — текст со ссылкой через системное меню (Кира 1): его умеют и телефоны без отправки файлов */
  const share = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  return `<form method="dialog" class="gear po">
    <h2>${'Выгрузить план'}</h2>
    <p class="gear-hint">${'Файл .json откроется в Lazy Gym Planner на любом устройстве: «Свой план» → «Загрузить план». В файле — и место, и отметки «Что беречь»; журнала в нём нет.'}</p>
    <p class="gear-hint">${'Текст и «Поделиться» — со ссылкой: по ней план откроется сразу, без файла. Отметок «Что беречь» в ссылке нет — упражнения в ней уже с заменами.'}</p>
    <fieldset class="po-set"><legend>${'Что выгрузить'}</legend>
      ${radio('one', `Этот план: ${esc(c.name)}`, true)}
      ${group > 1 ? radio('group', `Всю программу (${esc(c.group)}): ${group} ${plural(group, 'план', 'плана', 'планов')}`) : ''}
      ${all > 1 ? radio('all', `Все свои планы: ${all}`) : ''}
    </fieldset>
    <div class="ics-grid">
      <label>Для кого<input id="po-for" type="text" maxlength="${CUSTOM_TEXT}" value="${esc(c.for || '')}" placeholder="Имя ученика" autocomplete="off"></label>
      <label>От кого<input id="po-from" type="text" maxlength="${CUSTOM_TEXT}" value="${esc(S.author || '')}" placeholder="Ваше имя" autocomplete="off"></label>
    </div>
    <p class="p-hint" id="po-msg" role="status"></p>
    <div class="gear-btns po-btns">
      <button type="button" class="btn btn-2" id="po-close">Закрыть</button>
      <button type="button" class="btn btn-2" id="po-copy">Скопировать текст</button>
      ${share ? '<button type="button" class="btn btn-2" id="po-share">Поделиться</button>' : ''}
      <button type="button" class="btn" id="po-save">Сохранить файл</button>
    </div>
  </form>`;
}
function openPlanOut() {
  let d = $('#plan-out');
  if (!d) { d = document.createElement('dialog'); d.id = 'plan-out'; d.className = 'gear-view'; d.setAttribute('aria-label', 'Выгрузить план'); document.body.appendChild(d); }
  d.innerHTML = planOutHtml(); d.showModal();
}
function planOutPayload() {
  const scope = (document.querySelector('input[name="po-scope"]:checked') || {}).value || 'one', plans = planOutScope(scope);
  const forWho = cleanText($('#po-for').value, CUSTOM_TEXT), from = cleanText($('#po-from').value, CUSTOM_TEXT);
  S.author = from;
  /* «для кого» остаётся в самих планах: при следующей выгрузке подставится */
  for (const p of plans) { if (forWho) p.for = forWho; else delete p.for; }
  saveSettings();
  const obj = planFileObject(plans, from);
  return {plans, from, text:JSON.stringify(obj, null, 1) + '\n', name:planFileName(plans)};
}
async function planOutAction(kind) {
  const msg = $('#po-msg'), {plans, from, text, name} = planOutPayload();
  if (!plans.length || plans.every(p => !p.items.length)) { msg.textContent = 'В плане нет упражнений — выгружать нечего.'; return; }
  /* текст и ссылка: план, как его видно (11m-plan-link.js) */
  if (kind === 'copy') {
    const made = plansShareText(plans, from);
    const r = await clipText(made.then(m => m.text));
    if (r === true) msg.textContent = 'Скопировано: текст плана и ссылка. По ссылке план откроется сразу; текст целиком можно вставить и в «Загрузить план».';
    else clipFallback(msg, r);
    return;
  }
  if (kind === 'share') {
    try {
      const m = await plansShareText(plans, from);
      await navigator.share({title:plans.length > 1 ? 'Планы тренировок' : plans[0].name, text:m.body, url:m.url});
      msg.textContent = 'Отправлено.';
    } catch (e) { msg.textContent = e && e.name === 'AbortError' ? 'Отправка отменена.' : 'Поделиться не получилось — скопируйте текст или сохраните файл.'; }
    return;
  }
  const r = await saveFile(name, text, 'application/json');
  msg.textContent = r === 'ok' ? `Файл сохранён: ${name}` : r === 'declined' ? 'Сохранение отменено.' : 'Сохранить файл не получилось.';
}

/* ---------- окно загрузки: файл, вставленный текст или ссылка ---------- */
/* что будет у плана: цель, формат, уровень, место, неделя цикла, отметки «Что беречь» */
function planInSetup(p) {
  const out = [GOALS[p.goal]?.name, FORMATS[p.format]?.name, LEVELS[p.level]?.name].filter(Boolean).map(x => x.toLowerCase());
  if (p.placeIn) { const f = placeForIn(p.placeIn, true); out.push(f.isNew ? 'новое место: {name}'.replace('{name}', p.placeIn.name) : 'место: {name}'.replace('{name}', f.place.name)); }
  if (p.week && WEEKS[p.week - 1]) out.push('неделя цикла {n}: {name}'.replace('{n}', p.week).replace('{name}', WEEKS[p.week - 1].name.toLowerCase()));
  if (p.protect && p.protect.length) out.push('бережёт: {what}'.replace('{what}', hitsText(protectNorm(p.protect).map(id => PROTECT_BY[id]))));
  return out.join(', ');
}
/* упражнения плана — как их увидит получатель: названия по инвентарю места плана, подходы и повторы из файла */
function planInItems(p) {
  const E = effEquip(p.placeIn ? p.placeIn.equip : S.equip), all = effEquip(EQUIP.map(e => e.id));
  return p.items.map(it => {
    const ex = EXI[it.id], name = exName(ex, available(ex, E) ? E : all), dose = it.sets && it.reps ? `${it.sets} × ${it.reps}` : it.reps || (it.sets ? `${it.sets} ${plural(it.sets, 'подход', 'подхода', 'подходов')}` : '');
    return `<li>${esc(name)}${dose ? ` <small>${esc(dose)}</small>` : ''}</li>`;
  }).join('');
}
function planInHtml() {
  const r = planIn, link = !!(r && r.link);
  let body = '';
  if (r && r.error) body = `<p class="warn">${esc(r.error)}</p>`;
  else if (r) {
    /* общая программа и адресат — один раз сверху; у плана — только то, что отличает его от соседей */
    const groups = [...new Set(r.plans.map(p => p.group || ''))], common = groups.length === 1 && groups[0];
    const meta = [common ? `<span>программа: <b>${esc(common)}</b></span>` : '', r.from ? `<span>от: <b>${esc(r.from)}</b></span>` : '', r.plans[0].for ? `<span>для: <b>${esc(r.plans[0].for)}</b></span>` : ''].join('');
    /* один план — список упражнений сразу открыт: человек видит, что ему прислали (решение владельца 3) */
    const one = r.plans.length === 1;
    body = `${meta ? `<p class="cp-sub pi-meta">${meta}</p>` : ''}${r.note ? `<p class="c-note">${esc(r.note)}</p>` : ''}
      ${r.newer ? `<p class="warn">${link ? 'Ссылка сделана в более новой версии приложения: то, что эта версия не знает, будет пропущено. Обновите приложение.' : 'Файл сделан в более новой версии приложения: то, что эта версия не знает, будет пропущено. Обновите приложение.'}</p>` : ''}
      ${r.unknown.length ? `<p class="warn">Этой версии приложения неизвестны упражнения: ${esc(r.unknown.join(', '))}. Они будут пропущены.</p>` : ''}
      ${r.cut ? `<p class="warn">В файле больше ${PLAN_FILE_PLANS} планов — загрузятся первые ${PLAN_FILE_PLANS}.</p>` : ''}
      ${r.plans.filter(p => p.all).map(p => { const i = r.plans.indexOf(p), n = Math.ceil(p.all.length / CUSTOM_MAX); return `<div class="warn pi-over"><p>${`В плане «${esc(p.name)}» — ${p.all.length} ${plural(p.all.length, 'упражнение', 'упражнения', 'упражнений')}, а в один свой план помещается ${CUSTOM_MAX}: войдут первые ${CUSTOM_MAX}, остальные ${p.all.length - CUSTOM_MAX} не войдут.`}</p><label class="pi-split"><input type="checkbox" data-pi-split="${i}"> ${`Разбить на ${n} ${plural(n, 'план', 'плана', 'планов')} — войдут все упражнения`}</label></div>`; }).join('')}
      <fieldset class="po-set"><legend>${link ? 'Планы по ссылке' : 'Планы в файле'}</legend>${r.plans.map((p, i) => `<div class="pi-row"><label class="po-opt pi-plan"><input type="checkbox" data-pi="${i}" checked><span><b>${esc(p.name)}</b><small>${p.items.length} ${plural(p.items.length, 'упражнение', 'упражнения', 'упражнений')}${p.all ? ` ${'из'} ${p.all.length}` : ''}${planInSetup(p) ? ` — ${esc(planInSetup(p))}` : ''}</small>${!common && p.group ? `<small>программа: ${esc(p.group)}</small>` : ''}</span></label>`
        + (p.items.length ? `<details class="pi-items"${one ? ' open' : ''}><summary>${'Упражнения'}</summary><ol>${planInItems(p)}</ol></details>` : '') + `</div>`).join('')}</fieldset>`;
  }
  return `<form method="dialog" class="gear pi">
    <h2>${link ? 'План по ссылке' : 'Загрузить план'}</h2>
    <p class="gear-hint">${link ? 'Вам прислали план. Он добавится к вашим планам: ваши планы и журнал не изменятся. Ваши отметки «Что беречь» действуют и в нём.'
      : 'Выберите файл .json, который выгрузили из Lazy Gym Planner, — свой или от тренера, или вставьте текст плана со ссылкой. Планы добавятся к вашим, ничего не перезапишется.'}</p>
    ${link ? '' : `<label class="btn btn-2 pi-file" for="pi-file">${'Выбрать файл'}</label><input type="file" id="pi-file" accept=".json,application/json,text/plain" hidden>
    <details class="pi-paste"${r && r.pasted && r.error ? ' open' : ''}><summary>${'или вставить текст плана'}</summary><textarea id="pi-text" rows="4" placeholder="${esc('Текст со ссылкой на план или текст файла .json')}"></textarea><button type="button" class="btn btn-2" id="pi-read">${'Прочитать'}</button></details>`}
    ${body}
    <p class="p-hint" id="pi-msg" role="status"></p>
    <div class="gear-btns"><button type="button" class="btn btn-2" id="pi-close">Закрыть</button>${r && r.plans ? `<button type="button" class="btn" id="pi-add">Добавить в свои планы</button>` : ''}</div>
  </form>`;
}
function openPlanIn(result = null) {
  planIn = result;
  let d = $('#plan-in');
  if (!d) { d = document.createElement('dialog'); d.id = 'plan-in'; d.className = 'gear-view'; d.setAttribute('aria-label', 'Загрузить план'); document.body.appendChild(d); }
  d.setAttribute('aria-label', result && result.link ? 'План по ссылке' : 'Загрузить план');
  d.innerHTML = planInHtml(); if (!d.open) d.showModal();
  if (result) { const f = $('#pi-add') || $('#pi-close'); if (f) f.focus(); }
}
function showPlanIn(result) { planIn = result; $('#plan-in').innerHTML = planInHtml(); const f = $('#pi-add') || $('#pi-close'); if (f) f.focus(); }
/* Добавленные планы — сразу на экране (Марина 8, Кира: после «Добавить» на телефоне были развёрнутые параметры, а план —
   на 2–3 экрана ниже): открыт первый добавленный, параметры на телефоне свёрнуты, план — вверху экрана, фокус на названии */
function showAddedPlan(id) {
  openCustom(id);
  if (typeof setupFoldsHere === 'function') ensureFold(S).setup = setupFoldsHere();
  regen();
  const root = $('#plan'), h = $('#plan .p-title, #plan .empty h2');
  if (root) root.scrollIntoView({block:'start'});
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
}

document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.id === 'plan-export') { openPlanOut(); return; }
  if (t.id === 'po-close') { $('#plan-out').close(); return; }
  if (t.id === 'po-save') { planOutAction('save'); return; }
  if (t.id === 'po-share') { planOutAction('share'); return; }
  if (t.id === 'po-copy') { planOutAction('copy'); return; }
  if (t.dataset.cpImport !== undefined) { openPlanIn(); return; }
  if (t.id === 'pi-close') { $('#plan-in').close(); return; }
  if (t.id === 'pi-read') { const v = $('#pi-text').value; readPlanAny(v).then(r => showPlanIn({...r, pasted:true})); return; }
  if (t.id === 'pi-add') {
    const split = new Set([...document.querySelectorAll('[data-pi-split]')].filter(x => x.checked).map(x => +x.dataset.piSplit));
    const pick = [...document.querySelectorAll('[data-pi]')].filter(x => x.checked).flatMap(x => { const p = planIn.plans[+x.dataset.pi]; if (split.has(+x.dataset.pi)) return splitPlan(p); const c = {...p}; delete c.all; return [c]; });
    if (!pick.length) { $('#pi-msg').textContent = 'Отметьте хотя бы один план.'; return; }
    const added = addPlans(pick); $('#plan-in').close(); planIn = null;
    showAddedPlan(added[0].id);
    return;
  }
});
document.addEventListener('change', e => {
  if (e.target.id !== 'pi-file') return;
  const f = e.target.files && e.target.files[0]; if (!f) return;
  if (f.size > PLAN_FILE_MAX) { showPlanIn({error:'Файл слишком большой для плана.'}); return; }
  const rd = new FileReader();
  rd.onload = () => readPlanAny(String(rd.result || '')).then(showPlanIn);
  rd.onerror = () => showPlanIn({error:'Файл не читается.'});
  rd.readAsText(f);
});
