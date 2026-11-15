/* ===================== ССЫЛКА НА ПЛАН И ТЕКСТ ПЛАНА =====================
   Решение владельца 15.11.2026 (решение 3; Кира 1, 2, 4; Марина 7): ссылка на план без сервера — план целиком в адресе
   ссылки, после «#plan=». Эта часть адреса остаётся в браузере и не уходит на сервер (ни GitHub Pages, ни Floot её не
   получают), поэтому сервер не нужен и ничего не хранит.
   · В ссылке — только план: упражнения с подходами, повторами, отдыхом, темпом, весом по плану и заметками, имя, цель,
     формат, уровень, мышцы, место с инвентарём и неделя цикла, «для кого» и «от кого», если их вписали. Отметок «Что
     беречь», ответов о здоровье, пульса, возраста, журнала и веса тела в ней нет: упражнения в ссылке — те, что видит
     отправитель, уже с заменами под его отметки (exportPlan, 11e-plan-files.js). Файл .json, наоборот, несёт и отметки.
   · Формат: «z» и base64url (буквы, цифры, «-» и «_» — без экранирования в мессенджерах) сжатого deflate-raw JSON файла плана
     без названий упражнений; где браузер не умеет сжимать (CompressionStream: Chrome 103+, Safari 16.4+, Firefox 113+),
     «j» и тот же JSON без сжатия. Читается тем же readPlanFile, что и файл, — те же проверки и пределы; распакованный
     текст — не больше предела файла плана (PLAN_FILE_MAX), ссылка — не длиннее PLAN_LINK_MAX знаков.
   · Открыли ссылку — то же окно, что у загрузки файла: что в плане, «Добавить в свои планы»; планы добавляются новыми,
     свои планы и журнал не меняются, свои отметки «Что беречь» действуют и в пришедшем плане (protectOn). Адрес сразу
     очищается от плана (перезагрузка не спросит снова). Самый первый запуск — сначала короткие вопросы (там и вопрос
     о здоровье), план — после них. Битая, обрезанная или чужая ссылка — понятное сообщение.
   · «Скопировать план» и «Выгрузить» → «Скопировать текст» дают читаемый текст плана и ссылку в конце; этот текст целиком
     (или одна ссылка) вставляется в «Загрузить план» (readPlanAny). «Поделиться» — тот же текст со ссылкой через меню
     системы. Тесты — tools/plan-link.test.js, в браузере — tools/ui-check.mjs. */
const SITE_URL = 'https://sakrett001-ai.github.io/Lazy-gym-planner/';
const PLAN_HASH = '#plan=', PLAN_LINK_MAX = 100000;
const LINK_BAD = 'Ссылка на план повреждена: возможно, её обрезали при пересылке. Попросите прислать её ещё раз — целиком или файлом.';
const LINK_NOT_PLAN = 'Эта ссылка — не план Lazy Gym Planner.';

/* ---------- base64url ---------- */
const B64U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function b64uEncode(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = bytes[i] << 16 | (bytes[i + 1] || 0) << 8 | (bytes[i + 2] || 0), k = Math.min(3, bytes.length - i);
    out += B64U[n >> 18 & 63] + B64U[n >> 12 & 63] + (k > 1 ? B64U[n >> 6 & 63] : '') + (k > 2 ? B64U[n & 63] : '');
  }
  return out;
}
/* неверный знак или длина — null */
function b64uDecode(str) {
  if (typeof str !== 'string' || str.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor(str.length * 3 / 4));
  let j = 0;
  for (let i = 0; i < str.length; i += 4) {
    let n = 0, k = 0;
    for (; k < 4 && i + k < str.length; k++) { const v = B64U.indexOf(str[i + k]); if (v < 0) return null; n |= v << 18 - 6 * k; }
    out[j++] = n >> 16 & 255; if (k > 2) out[j++] = n >> 8 & 255; if (k > 3) out[j++] = n & 255;
  }
  return out.slice(0, j);
}

/* ---------- сжатие ---------- */
async function streamBytes(stream, max) {
  const rd = stream.getReader(), parts = []; let n = 0;
  for (;;) {
    const {done, value} = await rd.read(); if (done) break;
    n += value.length; if (n > max) { try { rd.cancel(); } catch (e) {} return {big:true}; }
    parts.push(value);
  }
  const out = new Uint8Array(n); let at = 0; for (const p of parts) { out.set(p, at); at += p.length; }
  return {bytes:out};
}
async function deflateBytes(bytes) {
  const CS = globalThis.CompressionStream; if (typeof CS !== 'function' || typeof Blob !== 'function') return null;
  try { return (await streamBytes(new Blob([bytes]).stream().pipeThrough(new CS('deflate-raw')), Infinity)).bytes; } catch (e) { return null; }
}
async function inflateBytes(bytes, max) {
  const DS = globalThis.DecompressionStream; if (typeof DS !== 'function' || typeof Blob !== 'function') return {old:true};
  try { return await streamBytes(new Blob([bytes]).stream().pipeThrough(new DS('deflate-raw')), max); } catch (e) { return {bad:true}; }
}

/* ---------- ссылка ---------- */
async function planLinkEncode(obj) {
  const raw = new TextEncoder().encode(JSON.stringify(obj)), z = await deflateBytes(raw);
  return z ? 'z' + b64uEncode(z) : 'j' + b64uEncode(raw);
}
/* код после «#plan=» → результат readPlanFile или {error} */
async function readPlanLink(code) {
  if (typeof code !== 'string' || !code) return {error:LINK_BAD};
  if (code.length > PLAN_LINK_MAX) return {error:'Ссылка слишком длинная для плана.'};
  const kind = code[0];
  if (kind !== 'z' && kind !== 'j') return {error:'Эта ссылка — не план Lazy Gym Planner или сделана в более новой версии приложения. Обновите приложение.'};
  const bytes = b64uDecode(code.slice(1)); if (!bytes || !bytes.length) return {error:LINK_BAD};
  let raw = bytes;
  if (kind === 'z') {
    const r = await inflateBytes(bytes, PLAN_FILE_MAX);
    if (r.old) return {error:'Этот браузер не открывает сжатые ссылки на план. Обновите браузер — или попросите прислать план файлом.'};
    if (r.big) return {error:'Ссылка слишком длинная для плана.'};
    if (!r.bytes) return {error:LINK_BAD};
    raw = r.bytes;
  }
  let text = '', o = null;
  try { text = new TextDecoder('utf-8', {fatal:true}).decode(raw); o = JSON.parse(text); } catch (e) { return {error:LINK_BAD}; }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return {error:LINK_NOT_PLAN};
  const r = readPlanFile(text);
  if (r.error) return {error:/резервная копия/.test(r.error) ? r.error : /нет планов/.test(r.error) ? 'В ссылке нет планов.' : LINK_NOT_PLAN};
  return r;
}
/* Адрес страницы, на которую ведёт ссылка: сайт, на котором человек сейчас (GitHub Pages и его сборка — своя страница;
   Floot — его страница: приложение там в окне srcdoc с тем же адресом сайта), а для офлайн-файла и встроенных копий —
   сайт на GitHub Pages; английская версия — её папка */
function linkBase() {
  const site = SITE_URL + (typeof window !== 'undefined' && window.PODHOD_LANG === 'en' ? 'en/' : '');
  const web = loc => { try { return loc && /^https?:$/.test(loc.protocol) && loc.host ? loc.origin + loc.pathname.replace(/index\.html$/, '') : null; } catch (e) { return null; } };
  if (typeof window === 'undefined' || typeof location === 'undefined') return site;
  if (window.PODHOD_LANGS) return web(location) || site;
  try { if (window.parent && window.parent !== window && location.protocol === 'about:') return web(window.parent.location) || site; } catch (e) {}
  return site;
}
const LINK_CACHE = new Map();
async function planLinkUrl(obj) {
  const key = JSON.stringify(obj);
  if (!LINK_CACHE.has(key)) { if (LINK_CACHE.size > 20) LINK_CACHE.clear(); LINK_CACHE.set(key, await planLinkEncode(obj)); }
  return linkBase() + PLAN_HASH + LINK_CACHE.get(key);
}
const linkLine = url => `${'Открыть план в Lazy Gym Planner'}: ${url}`;

/* ---------- план, как его видно ---------- */
/* fn(p) над своим планом c, собранным с его целью, форматом, уровнем, мышцами, местом и отметками (как если бы его открыли);
   открытый сейчас — без пересборки. Параметры, план и место после — прежние */
function withPlanView(c, fn) {
  if (S.mode === 'custom' && customOf() === c && plan && plan.custom) return fn(plan);
  const keys = ['mode', 'custom', 'goal', 'format', 'level', 'groups', 'place', 'equip', 'adapt', 'gen'];
  const keep = Object.fromEntries(keys.map(k => [k, S[k]])), keepPlan = plan;
  try {
    S.gen = {...S.gen};
    if (S.mode !== 'custom') for (const k of PLAN_ALL) S.gen[k] = planVal(S[k]);
    S.mode = 'custom'; S.custom = c.id; loadPlanSettings();
    plan = buildPlan({});
    return fn(plan);
  } finally { Object.assign(S, keep); plan = keepPlan; }
}
/* упражнения своего плана, как их видно в p: с заменами (бережный режим, инвентарь места), без не вошедших; дозировка,
   вес, заметка и пара — от упражнения плана на этом месте */
function viewItems(c, p) {
  if (!p || !p.items) return [];
  return p.blocks.flatMap(b => b.items).map(it => { const o = {...(c.items[it.slot] || {}), id:it.ex.id}; delete o.all; return o; });
}
/* свои планы → читаемый текст, ссылка и текст со ссылкой */
async function plansShareText(plans, from) {
  const views = plans.map(c => withPlanView(c, p => ({lines:customPlanText(c, p), items:viewItems(c, p)})));
  const url = await planLinkUrl(planFileObject(plans, from, {link:true, items:views.map(v => v.items)}));
  const body = views.map(v => v.lines.join('\n')).join('\n\n');
  return {body, url, text:body + '\n\n' + linkLine(url)};
}
/* то, что открыто: свой план — он сам; тренировка и неделя — как при «Сохранить как свой план» (frozenPlans) */
function currentLinkObject() {
  if (S.mode === 'custom') { const c = customOf(); return planFileObject([c], c.from || S.author || '', {link:true, items:[viewItems(c, plan)]}); }
  return planFileObject(frozenPlans([]), S.author || '', {link:true});
}

/* ---------- копирование ---------- */
/* Текст готовится не сразу (ссылка сжимается асинхронно): ClipboardItem с обещанием — так браузер (Safari) принимает запись,
   готовую после ожидания, в рамках того же нажатия; иначе — writeText по готовности. true — скопировано, иначе — текст */
async function clipText(made) {
  const cb = typeof navigator !== 'undefined' && navigator.clipboard;
  if (cb && typeof ClipboardItem === 'function' && typeof cb.write === 'function') {
    try { await cb.write([new ClipboardItem({'text/plain':made.then(t => new Blob([t], {type:'text/plain'}))})]); return true; } catch (e) {}
  }
  const text = await made;
  try { await cb.writeText(text); return true; } catch (e) { return text; }
}
function clipFallback(msg, text) {
  msg.innerHTML = 'Скопировать автоматически не удалось. Выделите текст:<textarea readonly rows="6"></textarea>';
  const ta = msg.querySelector('textarea'); ta.value = text; ta.focus(); ta.select();
}
/* «Скопировать план» над планом: текст и ссылка */
async function planCopy() {
  const msg = $('#copy-msg'); if (!plan && !prog) return;
  const text = planText(), r = await clipText(planLinkUrl(currentLinkObject()).then(url => text + '\n\n' + linkLine(url)));
  if (r === true) msg.textContent = 'Скопировано: текст плана и ссылка на него. По ссылке план откроется сразу — можно вставить в заметки или мессенджер.';
  else clipFallback(msg, r);
}

/* ---------- вставленный текст: файл .json, текст со ссылкой или одна ссылка ---------- */
async function readPlanAny(text) {
  const t = typeof text === 'string' ? text.trim() : '';
  if (!t || t[0] === '{' || t[0] === '[') return readPlanFile(text);
  const m = t.match(/#plan=([A-Za-z0-9_-]+)/);
  if (m) return readPlanLink(m[1]);
  return {error:'В тексте нет ссылки на план. Скопируйте план заново («Скопировать план» или «Выгрузить» → «Скопировать текст»): в конце текста будет ссылка. Или выберите файл .json.'};
}

/* ---------- открыли ссылку ---------- */
/* код плана из адреса (или из адреса страницы Floot вокруг окна приложения); адрес — без плана */
function planHashTake() {
  const grab = w => { try { const h = w.location.hash || ''; return h.startsWith(PLAN_HASH) ? h.slice(PLAN_HASH.length) : null; } catch (e) { return null; } };
  let w = typeof window !== 'undefined' ? window : null, code = w ? grab(w) : null;
  if (code == null && w) try { if (w.parent && w.parent !== w && location.protocol === 'about:') { code = grab(w.parent); if (code != null) w = w.parent; } } catch (e) {}
  if (code == null) return null;
  try { w.history.replaceState(w.history.state, '', w.location.pathname + w.location.search); } catch (e) {}
  return code;
}
let planLinkPending = null;
async function planHashOpen() {
  const code = planHashTake(); if (code == null) return false;
  const r = await readPlanLink(code);
  planLinkPending = {...r, link:true};
  /* первый запуск: вопросы первыми (11k-first-run.js: frFinish покажет план) */
  if (typeof FIRST_RUN !== 'undefined' && FIRST_RUN && typeof FR !== 'undefined' && !FR.done && document.documentElement.classList.contains('first-run')) { if (typeof frRender === 'function') frRender(false); return true; }
  planLinkShow();
  return true;
}
function planLinkShow() { const r = planLinkPending; planLinkPending = null; if (r) openPlanIn(r); }
/* строка в первом шаге вопросов: план по ссылке откроется после них */
function planLinkNote() {
  const r = planLinkPending; if (!r || !r.plans || !r.plans.length) return '';
  return 'После вопросов откроется план, который вам прислали: «{name}».'.replace('{name}', r.plans[0].name);
}
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('hashchange', () => { if (String(location.hash).startsWith(PLAN_HASH)) planHashOpen(); });
