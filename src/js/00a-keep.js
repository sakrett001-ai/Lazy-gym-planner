/* ===================== ДАННЫЕ БЕЗ ТИХИХ ПОТЕРЬ: хранилище браузера =====================
   Главное правило: записи человека не пропадают молча. Либо сохраняем, либо ясно говорим, что не сохранилось, и даём выход.
   · Keep.get / Keep.set — чтение и запись localStorage. Запись, которую браузер не принял, не теряется молча: Keep.state()
     становится 'off' (браузер запретил сайту хранить данные) или 'full' (хранилище переполнено), и приложение показывает
     заметное предупреждение (18a-data-keep.js). При переполнении сначала освобождается место от служебных копий, которые
     приложение умеет пересчитать (кадры фигур, суставы упражнений), и запись повторяется.
   · Keep.quarantine — испорченное значение из хранилища не затирается: до того как приложение запишет на его место исправленное,
     исходный текст откладывается в podhod.broken.v1 (у каждого ключа до 3 последних, одинаковые — один раз). Отложенное можно
     скачать файлом в журнале.
   · repairJson — обрезанный текст JSON (копия, переданная не до конца; журнал, записанный наполовину): всё, что уцелело до
     места обрыва.
   · Безопасный запуск: если при запуске что-то падает (BOOT), приложение один раз перезапускается с обычными настройками —
     журнал, замеры и пульс на месте, прежние настройки отложены; если падает и так — экран спасения без кода приложения:
     «Сохранить все данные в файл» и «Открыть без сохранённых данных» (данные остаются отложенными, их можно восстановить из
     файла в журнале).
   · Keep.watch — изменения из другой вкладки (событие storage): журнал и настройки сливаются, а не затираются (13-log.js,
     18a-data-keep.js).
   Проверки — tools/data-keep.test.js, в браузере — tools/ui-check.mjs. */
const KEEP_BROKEN = 'podhod.broken.v1', KEEP_SAFE = 'podhod.safe', KEEP_BROKEN_MAX = 3;
/* служебные копии, которые приложение пересчитает само: при переполнении хранилища удаляются первыми */
const KEEP_CACHES = ['podhod.frames.v1', 'podhod.stress.v1'];
/* ключи данных человека: их отражает экран спасения и файл «все данные» */
const KEEP_DATA = ['podhod.settings.v1', 'podhod.log.v1', 'podhod.body.v1', 'podhod.heart.v1', 'podhod.heart.prefs.v1', 'podhod.workout.v3',
  'podhod.gear.v1', 'podhod.autoreg.v1', 'podhod.ics.v1', 'podhod.motion.v2', 'podhod.planSeen.v1', 'podhod.active.v1'];
const Keep = (() => {
  const failed = new Map(); /* ключ → 'off' | 'full': запись, которую браузер не принял */
  const listeners = new Set(), notes = new Map(), watchers = new Map();
  let lostInMemory = []; /* отложенное, которое не удалось записать в хранилище (оно полно): только до перезагрузки */
  const ls = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch (e) { return null; } };
  /* QuotaExceededError (Chrome, Safari), NS_ERROR_DOM_QUOTA_REACHED (Firefox), коды 22 и 1014 */
  const kindOf = e => e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014) ? 'full' : 'off';
  const emit = () => { for (const f of listeners) try { f(); } catch (e) {} };
  function state() {
    if (!ls()) return 'off';
    let s = 'ok'; for (const v of failed.values()) if (v === 'off' || s === 'ok') s = v;
    return s;
  }
  function get(k) {
    const st = ls(); if (!st) return null;
    try { return st.getItem(k); } catch (e) { return null; }
  }
  /* запись; при переполнении — служебные копии вон и ещё раз. Вернёт true, если браузер принял запись */
  function set(k, v) {
    const st = ls(), before = state();
    if (!st) { failed.set(k, 'off'); if (before !== 'off') emit(); return false; }
    try { st.setItem(k, v); }
    catch (e) {
      let kind = kindOf(e), ok = false;
      if (kind === 'full') { for (const c of KEEP_CACHES) if (c !== k) try { st.removeItem(c); } catch (er) {} try { st.setItem(k, v); ok = true; } catch (er) { kind = kindOf(er); } }
      if (!ok) { failed.set(k, kind); if (state() !== before) emit(); return false; }
    }
    if (failed.delete(k) && state() !== before) emit();
    return true;
  }
  function remove(k) { const st = ls(); if (st) try { st.removeItem(k); } catch (e) {} failed.delete(k); }
  /* отложенные испорченные значения: [{key, at, why, raw}] — самые свежие в конце */
  function broken() {
    let list = [];
    try { const v = JSON.parse(get(KEEP_BROKEN) || '[]'); if (Array.isArray(v)) list = v.filter(x => x && typeof x.key === 'string' && typeof x.raw === 'string'); } catch (e) {}
    return list.concat(lostInMemory);
  }
  function quarantine(key, raw, why) {
    if (typeof raw !== 'string' || !raw) return true;
    const list = broken().filter(x => !lostInMemory.includes(x));
    if (list.some(x => x.key === key && x.raw === raw)) return true;
    const item = {key, at:new Date().toISOString(), why:String(why || ''), raw};
    list.push(item);
    /* у каждого ключа — не больше KEEP_BROKEN_MAX последних */
    for (let n = list.filter(x => x.key === key).length; n > KEEP_BROKEN_MAX; n--) list.splice(list.findIndex(x => x.key === key), 1);
    const st = ls();
    try { if (!st) throw new Error('no storage'); st.setItem(KEEP_BROKEN, JSON.stringify(list)); return true; }
    catch (e) { lostInMemory.push(item); return false; }
  }
  function clearBroken() { remove(KEEP_BROKEN); lostInMemory = []; }
  /* сообщения о спасённых данных: id → {…}; рисует их 18a-data-keep.js */
  function note(id, data) { if (data) notes.set(id, data); else notes.delete(id); emit(); }
  /* объём данных приложения в хранилище, символы (браузеры дают около 5 млн символов на сайт) */
  function usage() {
    const st = ls(); let n = 0; if (!st || typeof st.length !== 'number') return 0;
    try { for (let i = 0; i < st.length; i++) { const k = st.key(i); if (k && k.startsWith('podhod.')) n += k.length + (st.getItem(k) || '').length; } } catch (e) {}
    return n;
  }
  /* другая вкладка изменила ключ: fn(новое значение) */
  function watch(key, fn) { if (!watchers.has(key)) watchers.set(key, new Set()); watchers.get(key).add(fn); }
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('storage', e => {
    if (!e || (e.storageArea && e.storageArea !== ls())) return;
    const keys = e.key == null ? [...watchers.keys()] : [e.key];
    for (const k of keys) for (const fn of watchers.get(k) || []) try { fn(e.key == null ? get(k) : e.newValue); } catch (er) {}
  });
  return {get, set, remove, state, broken, quarantine, clearBroken, note, notes:() => notes, usage, watch, on:f => listeners.add(f), kindOf};
})();

/* Обрезанный JSON: проход со стеком скобок; после каждого законченного элемента массива или поля объекта запоминается место
   обрезки (последние 64); с самого позднего — текст до этого места и закрывающие скобки. Вернёт {value, cut} (cut — текст
   читался не целиком) или null, если уцелевшего нет. */
function repairJson(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  try { return {value:JSON.parse(text), cut:false}; } catch (e) {}
  const st = [], cuts = [];
  let str = false, bs = false;
  const mark = at => { cuts.push([at, st.join('')]); if (cuts.length > 64) cuts.shift(); };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (str) { if (bs) bs = false; else if (c === '\\') bs = true; else if (c === '"') str = false; continue; }
    if (c === '"') str = true;
    else if (c === '{' || c === '[') st.push(c);
    else if (c === '}' || c === ']') { st.pop(); if (st.length) mark(i + 1); else { try { return {value:JSON.parse(text.slice(0, i + 1)), cut:true}; } catch (e) {} } }
    else if (c === ',' && st.length) mark(i);
  }
  for (let j = cuts.length - 1; j >= 0; j--) {
    const [at, open] = cuts[j], tail = [...open].reverse().map(b => b === '{' ? '}' : ']').join('');
    try { return {value:JSON.parse(text.slice(0, at) + tail), cut:true}; } catch (e) {}
  }
  return null;
}

/* ---------- безопасный запуск ----------
   BOOT.phase 'loading' — с начала app.js до конца 99-boot.js. Скрипт выполняется подряд, поэтому ошибка, пойманная в это время,
   — ошибка запуска самого приложения. Первая — отложить настройки и начатую тренировку и перезапуститься (sessionStorage
   помнит, что попытка была); вторая — экран спасения. */
const BOOT = {phase:'loading', failed:false};
function bootFailed(err) {
  if (BOOT.failed) return; BOOT.failed = true;
  const msg = String(err && (err.message || err) || '').slice(0, 300);
  let tried = true;
  try { tried = !!sessionStorage.getItem(KEEP_SAFE); } catch (e) {}
  if (!tried) {
    for (const k of ['podhod.settings.v1', 'podhod.workout.v3']) { const v = Keep.get(k); if (v != null && Keep.quarantine(k, v, 'boot: ' + msg)) Keep.remove(k); }
    try { sessionStorage.setItem(KEEP_SAFE, JSON.stringify({at:Date.now(), err:msg})); location.reload(); return; } catch (e) {}
  }
  const show = () => rescueScreen(msg);
  if (typeof document !== 'undefined' && document.body) show(); else if (typeof addEventListener === 'function') addEventListener('DOMContentLoaded', show);
}
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('error', e => { if (BOOT.phase === 'loading') bootFailed(e && (e.error || e.message)); });
/* все данные приложения одним файлом в формате резервной копии (её можно восстановить в журнале) и с исходными текстами */
function rescueObject() {
  const parse = k => { try { return JSON.parse(Keep.get(k) || 'null'); } catch (e) { const r = repairJson(Keep.get(k) || ''); return r ? r.value : null; } };
  const raw = {};
  for (const k of KEEP_DATA) { const v = Keep.get(k); if (v != null) raw[k] = v; }
  const s = parse('podhod.settings.v1'), heart = parse('podhod.heart.v1'), body = parse('podhod.body.v1');
  return {app:'podhod', v:2, rescue:true, exported:new Date().toISOString(), version:(typeof window !== 'undefined' && window.PODHOD_VERSION) || '',
    settings:s && typeof s === 'object' ? s : undefined, log:parse('podhod.log.v1') || undefined, body:body && Array.isArray(body.rows) ? body.rows : undefined,
    heart:heart && typeof heart === 'object' ? {days:heart.days} : undefined, raw, broken:Keep.broken()};
}
function rescueDownload(name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(rescueObject())], {type:'application/json'}));
  a.download = name || 'lazy-gym-rescue.json'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
/* экран спасения: без функций приложения (они могли не загрузиться) */
function rescueScreen(msg) {
  try {
    const box = document.createElement('section');
    box.className = 'rescue'; box.setAttribute('role', 'alert');
    box.innerHTML = `<h1>${'Приложение не открылось'}</h1>
      <p>${'Сохранённые данные на этом устройстве не стёрты. Сначала сохраните их в файл — потом откройте приложение без них и восстановите файл в разделе «Журнал» → «Восстановить из копии».'}</p>
      <p class="rescue-err"></p>
      <div class="rescue-b"><button type="button" class="btn" data-rescue="save">${'Сохранить все данные в файл'}</button>
      <button type="button" class="btn btn-2" data-rescue="clean">${'Открыть без сохранённых данных'}</button></div>`;
    box.querySelector('.rescue-err').textContent = msg ? 'Ошибка: ' + msg : '';
    box.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('[data-rescue]'); if (!b) return;
      if (b.dataset.rescue === 'save') { rescueDownload('lazy-gym-rescue-' + new Date().toISOString().slice(0, 10) + '.json'); return; }
      /* данные откладываются, а не стираются: файл «все данные» уже можно было сохранить, отложенное видно в журнале */
      for (const k of KEEP_DATA) { const v = Keep.get(k); if (v != null && Keep.quarantine(k, v, 'rescue')) Keep.remove(k); }
      try { sessionStorage.removeItem(KEEP_SAFE); } catch (er) {}
      location.reload();
    });
    document.body.prepend(box);
    const f = box.querySelector('button'); if (f) f.focus();
  } catch (e) {}
}
