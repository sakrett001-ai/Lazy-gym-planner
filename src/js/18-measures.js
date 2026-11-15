/* ===================== ТЕЛО: ВЕС И ЗАМЕРЫ ===================== */
/* BODY.rows = [{d:'2026-10-06', kg:82.4, waist:88, …}] — одна запись на день, любые поля.
   Хранится в localStorage (podhod.body.v1) и, при входе в аккаунт, в документе «_body» той же коллекции, что журнал. */
const BODY_KEY = 'podhod.body.v1';
/* вес хранится в килограммах, обхваты — в сантиметрах; показываются и вводятся в выбранных единицах (13-log.js: wu()):
   в фунтах — вес в фунтах, обхваты в дюймах. Хранится до сотых — 180 фунтов остаются 180 */
const BODY_FIELDS = [
  {k:'kg', name:'Вес', w:true, main:true},
  {k:'waist', name:'Талия'}, {k:'chest', name:'Грудь'}, {k:'hips', name:'Таз'},
  {k:'arm', name:'Бицепс'}, {k:'thigh', name:'Бедро'}, {k:'calf', name:'Голень'}, {k:'neck', name:'Шея'}
];
const bodyUnit = f => f.w ? wUnit() : lUnit();
const bodyToU = (f, v) => f.w ? toU(v) : isLb() ? v / IN_CM : v;
const bodyFromU = (f, v) => f.w ? fromU(v) : isLb() ? v * IN_CM : v;
/* значение замера в выбранных единицах, до десятых */
const fmtBody = (f, v) => fmtU1(bodyToU(f, v));
const BODY = {rows:[], pending:false, writing:false, again:false, undo:null};
/* Границы значений (кг и см). hard — так не бывает: в форме — отказ с причиной, в копии — значение отбрасывается (Ксения 8, 9);
   ask — необычно: в форме переспрашиваем «Записать?». В хранилище — как раньше, больше нуля и меньше 1000: записанное
   прежними версиями не теряется. */
const BODY_LIMITS = {kg:{hard:[20, 400], ask:[35, 250]}, waist:{hard:[30, 250], ask:[50, 180]}, chest:{hard:[40, 250], ask:[60, 180]}, hips:{hard:[40, 250], ask:[60, 180]},
  arm:{hard:[10, 80], ask:[18, 60]}, thigh:{hard:[20, 120], ask:[35, 100]}, calf:{hard:[15, 80], ask:[22, 60]}, neck:{hard:[15, 80], ask:[25, 60]}};
function validBodyRows(rows) { return Array.isArray(rows) && rows.every(r => r && typeof r.d === 'string' && /^\d{4}-\d\d-\d\d$/.test(r.d)); }
/* strict — из копии: значение в пределах hard, иначе — мимо (dropped считает отброшенные поля) */
function cleanBodyRow(r, strict = false, dropped = null) {
  const o = {d:r.d};
  for (const f of BODY_FIELDS) {
    if (r[f.k] == null || r[f.k] === '') continue;
    const v = parseNum(r[f.k]), [lo, hi] = strict ? BODY_LIMITS[f.k].hard : [0, 1000];
    if (v != null && (strict ? v >= lo && v <= hi : v > lo && v < hi)) o[f.k] = Math.round(v * 100) / 100; else if (dropped) dropped.n++;
  }
  return o;
}
function bodyHasValues(r) { return BODY_FIELDS.some(f => r[f.k] != null); }
/* замеры из текста хранилища: строки по одной, неверные — мимо (не весь список, как раньше) */
function bodyParse(text) {
  let o = null, cut = false;
  try { o = JSON.parse(text); } catch (e) { const r = repairJson(text); if (r) { o = r.value; cut = true; } }
  if (!o || typeof o !== 'object' || !Array.isArray(o.rows)) return o == null && !cut ? null : {rows:[], dropped:1, cut, whole:true};
  const dropped = {n:0}, rows = [];
  for (const r of o.rows) { if (!r || typeof r !== 'object' || !realDay(r.d)) { dropped.n++; continue; } const c = cleanBodyRow(r, false, dropped); if (bodyHasValues(c)) rows.push(c); }
  return {rows:mergeBodyRows([], rows), dropped:dropped.n, cut, whole:false};
}
let bodyBase = null;
function bodyLoad() {
  const raw = Keep.get(BODY_KEY); bodyBase = raw;
  if (raw == null) return;
  const p = bodyParse(raw);
  if (!p) { Keep.quarantine(BODY_KEY, raw, 'body: unreadable'); Keep.note('body', {dropped:'все'}); return; }
  BODY.rows = p.rows;
  if (p.dropped || p.cut) { Keep.quarantine(BODY_KEY, raw, 'body'); Keep.note('body', {dropped:p.whole ? 'все' : p.dropped}); }
}
/* запись поверх хранилища: замеры, записанные в другой вкладке, остаются (по дате: строка, которую эта вкладка не меняла, —
   из хранилища; удалённая другой вкладкой — удалена) */
function bodySaveLocal() {
  const disk = Keep.get(BODY_KEY);
  if (disk != null && disk !== bodyBase) {
    const t = bodyParse(disk), b = bodyBase != null ? bodyParse(bodyBase) : null;
    if (t) {
      const J = v => JSON.stringify(v ?? null), at = (rs, d) => (rs || []).find(r => r.d === d), was = b ? b.rows : [], out = [];
      for (const d of new Set([...BODY.rows, ...was, ...t.rows].map(r => r.d))) {
        const m = at(BODY.rows, d), w = at(was, d), th = at(t.rows, d);
        const v = J(m) === J(w) ? th : J(th) === J(w) ? m : m && th ? {...th, ...m} : m || th;
        if (v) out.push(v);
      }
      BODY.rows = mergeBodyRows([], out);
    }
  }
  const text = JSON.stringify({rows:BODY.rows});
  if (Keep.set(BODY_KEY, text)) bodyBase = text;
}
/* объединение по дате: поля складываются, при совпадении приоритет у b. Предела числа замеров нет (было 400 — старые молча
   удалялись, Ксения 5) */
function mergeBodyRows(a, b) {
  const by = new Map();
  for (const r of a || []) by.set(r.d, {...r});
  for (const r of b || []) by.set(r.d, {...(by.get(r.d) || {}), ...r});
  return [...by.values()].filter(bodyHasValues).sort((p, q) => p.d < q.d ? -1 : 1);
}
/* синхронизация с аккаунтом: вызывается из logInit при каждом снимке коллекции */
function bodyRemote(doc, first) {
  const remote = doc && validBodyRows(doc.rows) ? doc.rows.map(cleanBodyRow).filter(bodyHasValues) : [];
  if (first) {
    const merged = mergeBodyRows(remote, BODY.rows);
    if (JSON.stringify(merged) !== JSON.stringify(remote)) { BODY.rows = merged; bodyTouch(true); } else BODY.rows = remote;
  } else {
    if (BODY.pending || JSON.stringify(remote) === JSON.stringify(BODY.rows)) return;
    BODY.rows = remote;
  }
  bodySaveLocal();
  if (S.view === 'journal' && !$('#b-form input:focus')) renderJournal();
}
function bodyTouch(now) {
  bodySaveLocal();
  if (LOG.mode !== 'cloud' || !LOG.col) return;
  BODY.pending = true;
  clearTimeout(BODY.timer);
  BODY.timer = setTimeout(bodyFlush, now ? 0 : 800);
}
async function bodyFlush(retried) {
  if (BODY.writing) { BODY.again = true; return; }
  BODY.writing = true;
  try {
    if (BODY.rows.length) await LOG.col.doc('_body').set({ex:'_body', rows:BODY.rows});
    else await LOG.col.doc('_body').delete();
  } catch (e) {
    if (e && e.code === 'unavailable' && !retried) { BODY.writing = false; setTimeout(() => bodyFlush(true), 800); return; }
    LOG.err = 'Сохранить замеры в аккаунт не получилось — они остаются в этом браузере.'; logRefresh(null);
  } finally {
    BODY.writing = false;
    if (BODY.again) { BODY.again = false; bodyFlush(); } else BODY.pending = false;
  }
}
function bodyLatest(k) { for (let i = BODY.rows.length - 1; i >= 0; i--) if (BODY.rows[i][k] != null) return BODY.rows[i]; return null; }
/* изменение за период: сравниваем последнее значение с ближайшим не позже cutoff */
function bodyDelta(k, days) {
  const last = bodyLatest(k); if (!last) return null;
  const cutoff = dayKey(new Date(new Date(last.d + 'T12:00:00') - days * 86400000));
  const prev = [...BODY.rows].reverse().find(r => r[k] != null && r.d <= cutoff && r.d !== last.d);
  return prev ? {v:Math.round((last[k] - prev[k]) * 100) / 100, from:prev.d} : null;
}
/* изменение в выбранных единицах; меньше 0,05 — не показывается */
const fmtDelta = (v, f = BODY_FIELDS[0]) => (v > 0 ? '+' : v < 0 ? '−' : '±') + fmtBody(f, Math.abs(v));
const deltaShown = (dl, f = BODY_FIELDS[0]) => dl && Math.abs(bodyToU(f, dl.v)) >= .05;
/* окраска изменения веса зависит от цели: на массе рост — хорошо, на рельефе — наоборот; на силе нейтрально */
function deltaClass(v) { const g = S.goal === 'mass' ? 1 : S.goal === 'cut' ? -1 : 0; return !g || !v ? '' : v * g > 0 ? 'good' : 'bad'; }
function bodyHtml() {
  const last = bodyLatest('kg'), d4 = bodyDelta('kg', 28);
  const pts = BODY.rows.filter(r => r.kg != null).slice(-40).map(r => ({d:r.d, v:r.kg}));
  const chips = BODY_FIELDS.filter(f => !f.main).map(f => { const l = bodyLatest(f.k); if (!l) return ''; const dl = bodyDelta(f.k, 28); return `<li><span>${f.name}</span><b>${fmtBody(f, l[f.k])}<small>${bodyUnit(f)}</small></b>${deltaShown(dl, f) ? `<em>${fmtDelta(dl.v, f)}</em>` : ''}</li>`; }).join('');
  const form = `<form class="b-form" id="b-form" autocomplete="off">
    <label class="b-date">Дата<input type="date" id="b-date" value="${todayKey()}" max="${todayKey()}" required></label>
    ${BODY_FIELDS.map(f => { const l = bodyLatest(f.k), u = bodyUnit(f); return `<label${f.main ? ' class="b-main"' : ''}>${f.name}, ${u}<input class="lt-in" type="text" inputmode="decimal" data-bf="${f.k}" placeholder="${l ? fmtBody(f, l[f.k]) : '—'}" aria-label="${f.name}, ${u}"></label>`; }).join('')}
    <button type="submit" class="btn">Записать</button>
    <p class="b-msg" id="b-msg" role="status">${bodyAskHtml()}</p>
    <p class="b-hint">Заполняйте то, что измерили: вес — утром натощак, обхваты — мерной лентой без натяжения, в одних и тех же точках. Остальное можно оставить пустым.</p>
  </form>`;
  /* удалённый замер — на его месте «Удалено · Вернуть», пока не истекло время (bodyDelete) */
  const u = BODY.undo && BODY.undo.until > Date.now() ? BODY.undo : null;
  const rows = byRecent(u && !BODY.rows.some(r => r.d === u.row.d) ? BODY.rows.concat({...u.row, gone:true}) : BODY.rows).reverse();
  const rowHtml = r => r.gone ? undoLineHtml(`Удалён замер за ${fmtDay(r.d, true)}.`, 'data-bundo="1"', 'b-gone')
    : `<li><span class="h-d">${fmtDay(r.d, true)}</span><span class="h-s">${BODY_FIELDS.filter(f => r[f.k] != null).map(f => `${f.main ? '' : f.name.toLowerCase() + ' '}${fmtBody(f, r[f.k])}${f.main ? ' ' + wUnit() : ''}`).join(' · ')}</span><button type="button" class="h-del" data-bdel="${r.d}" aria-label="Удалить замер за ${fmtDay(r.d, true)}">Удалить</button></li>`;
  const list = rows.length ? `<ul class="h-list b-list">${rows.slice(0, 6).map(rowHtml).join('')}</ul>${rows.length > 6 ? `<details class="j-all"${u && rows.slice(6).some(r => r.gone) ? ' open' : ''}><summary>Все замеры (${rows.length})</summary><ul class="h-list b-list">${rows.slice(6).map(rowHtml).join('')}</ul></details>` : ''}` : '';
  return `<section class="b-sec" aria-labelledby="b-title">
    <div class="b-head">
      <div>
        <p class="eyebrow">Тело</p>
        <h2 id="b-title">Вес и замеры</h2>
        ${last ? `<p class="b-now"><b>${fmtBody(BODY_FIELDS[0], last.kg)}<small>${wUnit()}</small></b>${deltaShown(d4) ? `<em class="${deltaClass(d4.v)}">${fmtDelta(d4.v)} за 4 нед.</em>` : `<em>${fmtDay(last.d, true)}</em>`}</p>` : `<p class="b-empty">Записей о весе пока нет. Взвешивайтесь раз в неделю в одно и то же время — по графику будет видно, куда идёт масса, а не дневные колебания воды.</p>`}
        ${chips ? `<ul class="b-chips">${chips}</ul>` : ''}
      </div>
      ${pts.length > 1 ? `<div class="h-chart b-chart"><p class="h-cap">Вес, ${wUnit()} · ${pts.length} ${plural(pts.length, 'запись', 'записи', 'записей')}</p>${sparkSvg(pts, wUnit(), v => fmtBody(BODY_FIELDS[0], v))}</div>` : ''}
    </div>
    ${form}
    ${list}
  </section>`;
}
/* Замер: не число, ноль или меньше, «так не бывает» (вес 5000 кг, 1e308) — отказ с причиной у поля, ничего не пишется;
   необычное (вес 270 кг) — вопрос «Записать?» (Ксения 8). «Записан» — только когда записан. */
let bodyAsk = null; /* {row, text} — ждёт ответа «Записать / Исправить» */
function bodyAskHtml() {
  if (!bodyAsk) return '';
  return `<span class="b-ask" role="group" aria-labelledby="b-ask-t"><span id="b-ask-t">${esc(bodyAsk.text)}</span><button type="button" class="lt-cfy" data-bask="yes">${'Записать'}</button><button type="button" class="lt-cfn" data-bask="fix">${'Исправить'}</button></span>`;
}
function bodyMsg(text, bad) {
  const m = $('#b-msg'); if (m) m.textContent = text;
  document.querySelectorAll('#b-form [data-bf]').forEach(i => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
  if (bad) { bad.setAttribute('aria-invalid', 'true'); bad.setAttribute('aria-describedby', 'b-msg'); bad.classList.add('need'); setTimeout(() => bad.classList.remove('need'), 1600); bad.focus(); }
}
function bodyRead(form) {
  const d = $('#b-date').value, row = {d}, ask = [];
  for (const inp of form.querySelectorAll('[data-bf]')) {
    const raw = inp.value.trim(), f = BODY_FIELDS.find(x => x.k === inp.dataset.bf); if (!raw || !f) continue;
    const u = bodyUnit(f), v = /^[+-]?\d+([.,]\d+)?$/.test(raw) ? parseNum(raw) : null;
    if (v == null) return {bad:inp, text:`${f.name}: «${raw.slice(0, 20)}» — впишите число, например ${f.w ? (isLb() ? '176' : '80' + DEC + '5') : (isLb() ? '32' : '82')}.`};
    if (v <= 0) return {bad:inp, text:`${f.name} не может быть нулём или меньше нуля.`};
    const x = bodyFromU(f, v), L = BODY_LIMITS[f.k];
    if (x < L.hard[0] || x > L.hard[1]) return {bad:inp, text:`${f.name} ${fmtU(v)} ${u} — так не бывает. Проверьте число: возможно, лишняя или пропущенная цифра.`};
    if (x < L.ask[0] || x > L.ask[1]) ask.push({inp, t:`${f.name.toLowerCase()} ${fmtU(v)} ${u}`});
    row[f.k] = x;
  }
  return {row, ask};
}
function bodySubmit(form, sure = false) {
  const d = $('#b-date').value;
  if (!realDay(d) || d > todayKey() || d < LOG_DAY_MIN) { bodyMsg(d > todayKey() ? 'Дата замера — не позже сегодняшней.' : 'Укажите дату замера.'); $('#b-date').focus(); return; }
  const r = bodyRead(form);
  if (r.bad) { bodyAsk = null; bodyMsg(r.text, r.bad); return; }
  if (!bodyHasValues(r.row)) { bodyAsk = null; bodyMsg('Впишите хотя бы одно число — например, вес.', form.querySelector('[data-bf="kg"]')); return; }
  if (!sure && r.ask.length) {
    bodyAsk = {text:`Необычное значение: ${r.ask.map(x => x.t).join(', ')}. Записать?`, inp:r.ask[0].inp};
    const m = $('#b-msg'); if (m) { m.innerHTML = bodyAskHtml(); const b = m.querySelector('[data-bask="fix"]'); if (b) b.focus(); }
    return;
  }
  bodyAsk = null;
  const row = cleanBodyRow(r.row);
  BODY.rows = mergeBodyRows(BODY.rows, [row]);
  bodyTouch(false);
  renderJournal();
  const what = BODY_FIELDS.filter(f => row[f.k] != null).map(f => `${f.name.toLowerCase()} ${fmtBody(f, row[f.k])} ${bodyUnit(f)}`).join(', ');
  const m = $('#b-msg'); if (m) m.textContent = `Замер за ${fmtDay(d, true)} записан: ${what}.`;
  const sb = $('#b-form [type="submit"]'); if (sb) sb.focus();
}
/* «Удалить» у замера: первое нажатие — «Точно удалить замер за …?» (и для диктора: подпись кнопки — тот же вопрос), второе —
   удаляет; на месте замера «Удалено · Вернуть» на 10 секунд, фокус — на «Вернуть» (Галина 3) */
function bodyDelete(btn) {
  const d = btn.dataset.bdel;
  if (!btn.classList.contains('armed')) { armDelete(btn, `Точно удалить замер за ${fmtDay(d, true)}?`, `Удалить замер за ${fmtDay(d, true)}`); return; }
  const row = BODY.rows.find(r => r.d === d); if (!row) return;
  BODY.rows = BODY.rows.filter(r => r.d !== d);
  BODY.undo = {row, until:Date.now() + UNDO_MS};
  bodyTouch(false); renderJournal();
  focusUndo('[data-bundo]');
  undoExpire(() => { if (BODY.undo && BODY.undo.row === row) { BODY.undo = null; if (S.view === 'journal') undoRepaint('[data-bundo]', '#b-date'); } }, '[data-bundo]', BODY.undo);
}
function bodyUndo() {
  const u = BODY.undo; if (!u) return;
  BODY.undo = null;
  BODY.rows = mergeBodyRows(BODY.rows, [u.row]); bodyTouch(true); renderJournal();
  const b = document.querySelector(`[data-bdel="${u.row.d}"]`); if (b) b.focus();
  const m = $('#b-msg'); if (m) m.textContent = `Замер за ${fmtDay(u.row.d, true)} возвращён.`;
}
function bodyCsv() {
  /* в выбранных единицах, единица — в заголовке столбца */
  const head = ['Дата'].concat(BODY_FIELDS.map(f => `${f.name}, ${bodyUnit(f)}`));
  const rows = BODY.rows.map(r => [r.d].concat(BODY_FIELDS.map(f => r[f.k] != null ? fmtBody(f, r[f.k]) : '')));
  return '\ufeff' + [head].concat(rows).map(r => csvLine(r)).join('\r\n');
}
document.addEventListener('submit', e => { if (e.target.id === 'b-form') { e.preventDefault(); bodySubmit(e.target); } });
document.addEventListener('input', e => { if (bodyAsk && e.target.closest && e.target.closest('#b-form')) { bodyAsk = null; const m = $('#b-msg'); if (m) m.textContent = ''; } });
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.bdel) { bodyDelete(t); return; }
  if (t.dataset.bundo) { bodyUndo(); return; }
  if (t.dataset.bask === 'yes') { bodySubmit($('#b-form'), true); return; }
  if (t.dataset.bask === 'fix') { const inp = bodyAsk && bodyAsk.inp; bodyAsk = null; const m = $('#b-msg'); if (m) m.textContent = ''; const f = inp && inp.isConnected ? inp : $('#b-form [data-bf="kg"]'); if (f) { f.focus(); f.select(); } return; }
  if (t.id === 'exp-body') { saveFile(`lazy-gym-body-${todayKey()}.csv`, bodyCsv(), 'text/csv').then(r => { const m = $('#j-msg'); if (m) m.textContent = r === 'ok' ? 'Таблица замеров сохранена.' : r === 'declined' ? 'Сохранение отменено.' : 'Сохранить файл не удалось.'; }); }
});
bodyLoad();

/* ===================== ПОЛНАЯ РЕЗЕРВНАЯ КОПИЯ ===================== */
/* v2: настройки планировщика, инвентарь, авторегулировка, календарь, атлас, журнал и замеры. v1 (только журнал) тоже читается.
   Подход в журнале — [кг, повторы], [кг, повторы, отдых, с] или [кг, повторы, отдых | null, {l, r}] (Л/П, 13a-sets.js):
   отдых и стороны необязательны, неверные отбрасываются, подход остаётся. Снаряд записи (eq) — только допустимый
   для упражнения. В копию уходят и записи упражнений, которых нет в этой версии (LOG.foreign). */
function backupObject() {
  return {app:'podhod', v:2, exported:new Date().toISOString(), version:window.PODHOD_VERSION || '',
    settings:{...S}, gear:gearObject(), autoreg:{dismissed:AR.dismissed, light:AR.light}, ics:{...ICS}, motion:{...motionPrefs},
    log:logStoreObject(), body:BODY.rows, heart:heartBackup()};
}
/* Чтение файла копии (Ксения 10): пустой; обрезанный или повреждённый — так и сказать и спасти уцелевшее (repairJson); файл плана;
   чужой файл. Вернёт {obj, cut} или {error} */
function readBackupText(text) {
  if (typeof text !== 'string' || !text.trim()) return {error:'Файл пустой.'};
  let obj = null, cut = false;
  try { obj = JSON.parse(text); }
  catch (e) {
    if (!/"app"\s*:\s*"podhod"/.test(text.slice(0, 4000))) return {error:'Это не резервная копия Lazy Gym Planner: файл не читается. Выберите файл lazy-gym-backup-….json.'};
    const r = repairJson(text);
    if (!r || !r.value || r.value.app !== 'podhod' || !(r.value.log || r.value.body || r.value.settings)) return {error:'Файл копии повреждён или обрезан (например, при пересылке) — прочитать из него ничего не получается. Сделайте копию заново на том устройстве, где она сделана.'};
    obj = r.value; cut = true;
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {error:'Это не резервная копия Lazy Gym Planner. Выберите файл lazy-gym-backup-….json.'};
  if (obj.format === PLAN_FILE) return {error:'Это файл плана, а не резервная копия. Его загружают в «Свой план» → «Загрузить план».'};
  if (obj.app !== 'podhod' || (!obj.log && !obj.body && !obj.settings && !obj.heart)) return {error:'Это не резервная копия Lazy Gym Planner. Выберите файл lazy-gym-backup-….json.'};
  return {obj, cut};
}
/* самая поздняя дата записи в копии: день, когда копия сделана (или завтра — часовые пояса), но не раньше завтрашнего */
function restoreMaxDay(obj) {
  const plus = (k, n) => { const [y, m, d] = k.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n, 12)); };
  const tomorrow = plus(todayKey(), 1), ex = obj && typeof obj.exported === 'string' ? obj.exported.slice(0, 10) : '';
  return realDay(ex) && plus(ex, 1) > tomorrow ? plus(ex, 1) : tomorrow;
}
/* журнал из копии и здешний: {next — объединённый по упражнениям, added — новых записей, joined — дополненных подходами из копии,
   same — уже были здесь, conflicts — дни, где подходы в копии и здесь различаются (оставлены здешние), drops, foreign} */
function restoreLogPlan(obj) {
  const c = checkLog(obj && obj.log, {strict:true, maxDay:restoreMaxDay(obj)}), out = {next:{}, added:0, joined:0, same:0, conflicts:new Set(), exercises:0, drops:c.r, foreign:Object.keys(c.foreign).filter(id => !LOG.foreign[id]), foreignData:c.foreign};
  const J = v => JSON.stringify(v ?? null);
  for (const [id, ss] of Object.entries(c.data)) {
    const cur = LOG.data[id] || [];
    let changed = false;
    for (const x of ss) {
      const y = cur.find(v => v.d === x.d);
      if (!y) { out.added++; changed = true; continue; }
      const fills = x.s.some((v, k) => v && !y.s[k]), clash = x.s.some((v, k) => v && y.s[k] && J(v) !== J(y.s[k]));
      if (fills) { out.joined++; changed = true; } else out.same++;
      if (clash) out.conflicts.add(x.d);
    }
    if (changed) { out.next[id] = mergeSessions(cur, ss); out.exercises++; }
  }
  return out;
}
/* замеры из копии: строго (BODY_LIMITS.hard); здешние значения за ту же дату остаются */
function restoreBodyPlan(obj) {
  const dropped = {n:0}, rows = [], maxDay = restoreMaxDay(obj);
  if (Array.isArray(obj && obj.body)) for (const r of obj.body) {
    if (!r || typeof r !== 'object' || !realDay(r.d) || r.d < LOG_DAY_MIN || r.d > maxDay) { dropped.n++; continue; }
    const c = cleanBodyRow(r, true, dropped); if (bodyHasValues(c)) rows.push(c);
  }
  const next = mergeBodyRows(rows, BODY.rows), J = v => JSON.stringify(v);
  const added = next.filter(r => { const y = BODY.rows.find(v => v.d === r.d); return !y || J(y) !== J(r); }).length;
  return {next, added, dropped:dropped.n, changed:J(next) !== J(BODY.rows)};
}
/* настройки копии отличаются от здешних тем, что видно человеку: планы, места, цель, суставы */
const RESTORE_KEYS = ['goal', 'format', 'level', 'mode', 'customs', 'places', 'protect', 'groups', 'dur', 'days', 'split', 'units'];
function restoreSettingsPlan(obj) {
  if (!obj || obj.v < 2 || !obj.settings || typeof obj.settings !== 'object' || Array.isArray(obj.settings)) return null;
  const {s, bad} = cleanSettings(obj.settings), J = v => JSON.stringify(v ?? null);
  const differs = RESTORE_KEYS.some(k => k in obj.settings && J(s[k]) !== J(S[k]));
  /* новое устройство: здесь нет ни журнала, ни своих планов — по умолчанию берём из копии */
  const fresh = !journalDays() && S.customs.every(c => !c.items.length);
  return {s, bad:bad.filter(k => k !== '*'), differs, fresh};
}
/* «цель — Сила, своих планов — 2, мест — 4» */
function settingsSummary(s) {
  const plans = (Array.isArray(s.customs) ? s.customs : []).filter(c => c && Array.isArray(c.items) && c.items.length).length;
  const places = Array.isArray(s.places) ? s.places.length : 0, g = GOALS[s.goal];
  return [g ? `цель — ${g.name}` : '', `своих планов — ${plans}`, places ? `мест — ${places}` : '', Array.isArray(s.protect) && s.protect.length ? `суставов бережём — ${s.protect.length}` : ''].filter(Boolean).join(', ');
}
/* Восстановление. opts.settings: 'copy' — планы и настройки из копии (по умолчанию, как раньше), 'mine' — остаются здешние.
   Журнал и замеры добавляются к здешним, ничего здешнего не стирается (Ксения 4); неверное отбрасывается с отчётом (Ксения 9). */
function restoreBackup(obj, opts = {}) {
  const take = opts.settings !== 'mine';
  const out = {sessions:0, exercises:0, added:0, joined:0, same:0, conflicts:[], body:0, heart:0, settings:false, drops:logDrops(), bodyDropped:0, foreign:0, bad:[]};
  if (obj.log && typeof obj.log === 'object') {
    const p = restoreLogPlan(obj);
    for (const [id, ss] of Object.entries(p.next)) { LOG.data[id] = ss; logTouch(id, true); }
    for (const id of p.foreign) LOG.foreign[id] = p.foreignData[id];
    Object.assign(out, {exercises:p.exercises, added:p.added, joined:p.joined, same:p.same, sessions:p.added + p.joined, conflicts:[...p.conflicts].sort(), drops:p.drops, foreign:p.foreign.length});
    logSaveLocal();
  }
  if (Array.isArray(obj.body)) {
    const b = restoreBodyPlan(obj);
    out.bodyDropped = b.dropped;
    if (b.changed) { out.body = b.added; BODY.rows = b.next; bodyTouch(true); }
  }
  /* пульс: 14b-heart.js; его настройки — вместе с остальными настройками */
  out.heart = heartRestore(take || !obj.heart || typeof obj.heart !== 'object' ? obj.heart : {...obj.heart, prefs:undefined});
  if (obj.v >= 2 && take) {
    const sp = restoreSettingsPlan(obj);
    if (sp) {
      const ok = {};
      /* испорченное поле копии не затирает здешнее: остаётся как было (в сообщении — «эти поля будут обычными» → здешними) */
      for (const k of [...Object.keys(DEFAULTS), 'places', 'place', 'placesV', 'adapt', 'swaps']) if (k in obj.settings && k !== 'view' && k !== 'logPick' && !sp.bad.includes(k)) ok[k] = sp.s[k];
      if ('lr' in ok) ok.lr = cleanLr(ok.lr);
      if ('dur' in ok && !DURATIONS[ok.dur]) ok.dur = null;
      Object.assign(S, ok); ensurePlaces(S); ensureCustoms(S); ensureFold(S); ensureProtect(S); /* имена по умолчанию — на языке страницы */
      swaps = S.swaps && typeof S.swaps === 'object' && !Array.isArray(S.swaps) ? S.swaps : (S.swaps = {});
      saveSettings(); out.settings = true; out.bad = sp.bad;
    }
    if (obj.gear && typeof obj.gear === 'object') { gearPick(GEAR_UNITS.kg, obj.gear); gearPick(GEAR_UNITS.lb, obj.gear.lb); gearSave(); }
    if (obj.autoreg && typeof obj.autoreg === 'object') { if (obj.autoreg.dismissed && typeof obj.autoreg.dismissed === 'object' && !Array.isArray(obj.autoreg.dismissed)) AR.dismissed = obj.autoreg.dismissed; AR.light = obj.autoreg.light === true; arSave(); }
    if (obj.ics && typeof obj.ics === 'object') { Object.assign(ICS, icsClean(obj.ics)); Keep.set(ICS_KEY, JSON.stringify(ICS)); }
    if (obj.motion && typeof obj.motion === 'object' && !Array.isArray(obj.motion)) { Object.assign(motionPrefs, motionClean(obj.motion)); saveMotionPrefs(); }
  }
  if (obj.v >= 2) { S.view = 'journal'; renderSetup(); }
  return out;
}
/* настройки атласа из копии: только простые значения */
function motionClean(o) {
  const x = {};
  for (const [k, v] of Object.entries(o)) if (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.length < 40)) x[k] = v;
  if ('speed' in x && !(typeof x.speed === 'number' && x.speed > 0 && x.speed <= 4)) delete x.speed;
  return x;
}
