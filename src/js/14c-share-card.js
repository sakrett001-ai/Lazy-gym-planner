/* ===================== КАРТИНКА ИТОГА ТРЕНИРОВКИ =====================
   Решение владельца 15.11.2026 (решение 4 — «скромно»; Кира 3: «после тренировки нечем похвастаться»): на экране
   «Тренировка завершена» — одна кнопка. Она отдаёт картинку итога системному «Поделиться» (Web Share с файлом: телефоны
   на Android и iPhone), а где его нет (компьютер, встроенное окно без разрешения) — сохраняет картинку файлом. Новых экранов
   нет. На картинке — дата, название тренировки, упражнения с подходами и объёмом, итог: подходы, упражнения, объём (как
   на экране итога). Пульса и веса тела нет — человек этого не выбирал. Похвалы и даты следующей тренировки нет: решение 11
   владелец не утверждал. В списке — сделанные упражнения. Картинка рисуется сразу, когда показан итог: «Поделиться» потом вызывается в том же нажатии, без
   ожидания (Safari отпускает его только сразу после нажатия). Размер — 1080 × 1350 (4:5): целиком видна и в ленте,
   и в историях. Проверки — tools/ui-check.mjs. */
const CARD_W = 1080, CARD_H = 1350;
const CARD_MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const CARD_SITE = 'sakrett001-ai.github.io/Lazy-gym-planner';
let shareSum = null, shareBlob = null, shareMaking = null;
/* итог для картинки: {day, title, rows:[{name, n, ton, skip}], n, worked, total} — из workoutFinish (14-workout-mode.js) */
function shareSummarySet(sum) {
  shareSum = sum && sum.n > 0 ? sum : null; shareBlob = null; shareMaking = null;
  paintShareButton();
  if (shareSum) { const mine = shareSum; shareMaking = shareCardBlob(mine).then(b => { if (shareSum === mine) shareBlob = b; return b; }, () => null); }
}
function canShareFiles() {
  try { return typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && typeof File === 'function' && navigator.canShare({files:[new File([''], 'lazy-gym.png', {type:'image/png'})]}); }
  catch (e) { return false; }
}
function paintShareButton() {
  const b = $('#wv-share'), m = $('#wv-share-msg'); if (!b) return;
  b.hidden = !shareSum; b.textContent = canShareFiles() ? 'Поделиться итогом' : 'Сохранить картинку итога';
  if (m) m.textContent = '';
}
/* «18 ноября 2026»; в английской сборке — по языку браузера («November 18, 2026») */
function cardDate(k) {
  const [y, m, d] = k.split('-').map(Number);
  if (localeOf().dates === 'intl' && typeof Intl !== 'undefined') { try { return new Intl.DateTimeFormat(localeTag(), {day:'numeric', month:'long', year:'numeric'}).format(new Date(y, m - 1, d, 12)); } catch (e) {} }
  return `${d} ${CARD_MONTHS[m - 1]} ${y}`;
}
/* строка, обрезанная по ширине с многоточием */
function cardFit(g, text, w) {
  if (g.measureText(text).width <= w) return text;
  let s = text; while (s.length > 1 && g.measureText(s + '…').width > w) s = s.slice(0, -1);
  return s.trimEnd() + '…';
}
async function cardFonts() {
  if (typeof document === 'undefined' || !document.fonts || !document.fonts.load) return;
  const sample = 'Тренировка Lazy Gym 0123456789';
  try { await Promise.all(["400 60px 'Russo One'", "600 40px 'Golos Text'", "500 36px 'Golos Text'", "500 30px 'JetBrains Mono'"].map(f => document.fonts.load(f, sample))); } catch (e) {}
}
async function shareCardBlob(sum) {
  await cardFonts();
  const cv = document.createElement('canvas'); cv.width = CARD_W; cv.height = CARD_H;
  const g = cv.getContext('2d'); if (!g) return null;
  const C = {bg:'#ECEFF3', card:'#FFFFFF', ink:'#141A23', muted:'#5B6574', line:'#DCE1E8', hot:'#C92723', accent:'#2347C8', good:'#1B7749', soft:'#E2F4EA'};
  const DISP = "'Russo One', 'Arial Black', sans-serif", BODY = "'Golos Text', system-ui, sans-serif", MONO = "'JetBrains Mono', ui-monospace, monospace";
  const X = 72, W = CARD_W - 2 * X;
  g.fillStyle = C.bg; g.fillRect(0, 0, CARD_W, CARD_H);
  /* карточка */
  const round = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  g.fillStyle = C.card; round(40, 40, CARD_W - 80, CARD_H - 80, 36); g.fill();
  g.textBaseline = 'alphabetic';
  /* логотип: Lazy Gym Planner, «Gym» — красным, как в шапке приложения */
  g.font = `400 52px ${DISP}`; let x = X;
  for (const [t, c] of [['Lazy', C.ink], ['Gym', C.hot], ['Planner', C.ink]]) { g.fillStyle = c; g.fillText(t, x, 136); x += g.measureText(t).width + 2; }
  g.fillStyle = C.muted; g.font = `500 36px ${BODY}`; g.fillText(cardDate(sum.day), X, 214);
  g.fillStyle = C.ink; g.font = `400 64px ${DISP}`; g.fillText(cardFit(g, 'Тренировка завершена', W), X, 316);
  if (sum.title) { g.fillStyle = C.muted; g.font = `600 40px ${BODY}`; g.fillText(cardFit(g, sum.title, W), X, 378); }
  /* итог: подходы, упражнения, объём */
  const tiles = [[String(sum.n), plural(sum.n, 'подход', 'подхода', 'подходов')], [String(sum.worked), plural(sum.worked, 'упражнение', 'упражнения', 'упражнений')]];
  if (sum.total > 0) tiles.push([fmtTon(sum.total), `${'объём'}, ${wUnit()}`]);
  const tw = (W - 24 * (tiles.length - 1)) / tiles.length, ty = 430, th = 196;
  tiles.forEach(([v, l], i) => {
    const tx = X + i * (tw + 24);
    g.fillStyle = C.soft; round(tx, ty, tw, th, 24); g.fill();
    g.fillStyle = C.good; g.font = `400 ${v.length > 6 ? 64 : 84}px ${DISP}`; g.fillText(cardFit(g, v, tw - 48), tx + 24, ty + 112);
    g.fillStyle = C.ink; g.font = `500 32px ${BODY}`; g.fillText(cardFit(g, l, tw - 48), tx + 24, ty + 164);
  });
  /* упражнения — сделанные (на экране итога видны и пропущенные, на картинке — то, что сделано) */
  const rows = sum.rows.filter(r => r.n > 0), top = 702, rh = 72, fit = Math.floor((1210 - top) / rh), shown = rows.length > fit ? rows.slice(0, fit - 1) : rows;
  g.strokeStyle = C.line; g.lineWidth = 2;
  shown.forEach((r, i) => {
    const y = top + i * rh;
    g.beginPath(); g.moveTo(X, y - 46); g.lineTo(X + W, y - 46); g.stroke();
    const right = `${r.n} ${plural(r.n, 'подход', 'подхода', 'подходов')}${r.ton > 0 ? ` · ${fmtTon(r.ton)} ${wUnit()}` : ''}`;
    g.font = `500 32px ${BODY}`; const rw = g.measureText(right).width;
    g.fillStyle = C.muted; g.textAlign = 'right'; g.fillText(right, X + W, y); g.textAlign = 'left';
    g.font = `500 36px ${BODY}`; g.fillStyle = C.ink; g.fillText(cardFit(g, r.name, W - rw - 32), X, y);
  });
  if (shown.length < rows.length) { const y = top + shown.length * rh; g.fillStyle = C.muted; g.font = `500 34px ${BODY}`; g.fillText('и ещё {n}'.replace('{n}', rows.length - shown.length), X, y); }
  g.fillStyle = C.muted; g.font = `500 28px ${MONO}`; g.fillText(CARD_SITE, X, CARD_H - 92);
  return await new Promise(res => { try { cv.toBlob(b => res(b), 'image/png'); } catch (e) { res(null); } });
}
/* сохранить картинку файлом: ссылка с download (как журнал, 13-log.js: saveFile) */
function saveBlob(name, blob) {
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    return 'ok';
  } catch (e) { return 'fail'; }
}
async function shareCard() {
  const msg = $('#wv-share-msg'), sum = shareSum; if (!sum) return;
  const blob = shareBlob || await shareMaking;
  if (!blob) { if (msg) msg.textContent = 'Картинку нарисовать не получилось.'; return; }
  const name = `lazy-gym-${sum.day}.png`, file = typeof File === 'function' ? new File([blob], name, {type:'image/png'}) : null;
  if (file && canShareFiles()) {
    try { await navigator.share({files:[file], title:'Тренировка завершена'}); if (msg) msg.textContent = ''; return; }
    catch (e) { if (e && e.name === 'AbortError') return; /* отправить не дали (встроенное окно) — сохраняем */ }
  }
  const r = saveBlob(name, blob);
  if (msg) msg.textContent = r === 'ok' ? 'Картинка сохранена: {name}'.replace('{name}', name) : 'Сохранить картинку не получилось.';
}
document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('#wv-share'); if (t) shareCard(); });
