/* ===================== ЭКСПОРТ В КАЛЕНДАРЬ ===================== */
const ICS_KEY = 'podhod.ics.v1';
const ICS = {time:'19:00', weeks:4, alarm:60};
/* из хранилища и копии — только верные поля (строка вместо времени роняла бы окно календаря) */
function icsClean(o) {
  const x = {}; if (!o || typeof o !== 'object') return x;
  if (typeof o.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(o.time)) x.time = o.time;
  if (Number.isInteger(o.weeks) && o.weeks >= 1 && o.weeks <= 52) x.weeks = o.weeks;
  if (Number.isInteger(o.alarm) && o.alarm >= 0 && o.alarm <= 1440) x.alarm = o.alarm;
  return x;
}
try { Object.assign(ICS, icsClean(JSON.parse(localStorage.getItem(ICS_KEY) || '{}'))); } catch (e) {}
/* напоминание: «Тренировка через 1 час: Всё тело А» (порядок слов — из перевода целой строки с {t} и {name}) */
function icsAlarmText(min, name) {
  const h = min / 60, t = min >= 60 && Number.isInteger(h) ? `${h} ${plural(h, 'час', 'часа', 'часов')}` : `${min} мин`;
  return 'Тренировка через {t}: {name}'.replace('{t}', t).replace('{name}', name);
}
function nextMonday() { const d = new Date(); d.setHours(12, 0, 0, 0); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() + (dow === 0 ? 0 : 7 - dow)); return d; }
const pad2 = n => String(n).padStart(2, '0');
const icsDate = d => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
const icsEsc = s => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
function icsFold(line) { const out = []; let b = ''; for (const ch of line) { const t = new TextEncoder().encode(b + ch).length; if (t > 72) { out.push(b); b = ' ' + ch; } else b += ch; } out.push(b); return out.join('\r\n'); }
function icsText(start, time, weeksN) {
  const [hh, mm] = time.split(':').map(Number);
  const saved = {week:S.week, day:S.day};
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LazyGymPlanner//Workout planner//RU', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Lazy Gym Planner — тренировки'];
  const stamp = icsDate(new Date()).replace(/T.*/, 'T000000Z');
  for (let w = 0; w < weeksN; w++) {
    S.week = (w % 4) + 1;
    const pr = buildProgram();
    for (const d of pr.days) {
      if (!d.plan.items) continue;
      const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d.wd); dt.setHours(hh, mm, 0, 0);
      const end = new Date(dt.getTime() + Math.max(30, d.plan.minutes + 15) * 60000);
      const title = `Тренировка: ${d.name} · неделя ${S.week} (${pr.week.name.toLowerCase()})`;
      const body = [`${GOALS[S.goal].name}, ${FORMATS[S.format].name.toLowerCase()}, ≈${d.plan.minutes} мин`, pr.week.note, ''].concat(blocksText(d.plan)).join('\n');
      lines.push('BEGIN:VEVENT', `UID:podhod-${icsDate(dt)}-${d.tid}@podhod`, `DTSTAMP:${stamp}`, `DTSTART:${icsDate(dt)}`, `DTEND:${icsDate(end)}`,
        icsFold(`SUMMARY:${icsEsc(title)}`), icsFold(`DESCRIPTION:${icsEsc(body)}`), 'CATEGORIES:Тренировка');
      if (ICS.alarm > 0) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', icsFold(`DESCRIPTION:${icsEsc(icsAlarmText(ICS.alarm, d.name))}`), `TRIGGER:-PT${ICS.alarm}M`, 'END:VALARM');
      lines.push('END:VEVENT');
    }
  }
  lines.push('END:VCALENDAR');
  S.week = saved.week; S.day = saved.day;
  return lines.join('\r\n') + '\r\n';
}
function icsDialogHtml() {
  const mon = nextMonday();
  const sched = SCHEDULE[S.days].map(i => WD[i]).join(', ');
  return `<form method="dialog" class="gear ics">
    <h2>В календарь</h2>
    <p class="gear-hint">Файл .ics с тренировками по дням сплита (${sched}) на ${ICS.weeks} ${plural(ICS.weeks, 'неделю', 'недели', 'недель')} цикла. Откройте его в календаре телефона или компьютера — события добавятся с напоминанием и текстом тренировки.</p>
    <div class="ics-grid">
      <label>Первый понедельник<input id="ics-start" type="date" value="${dayKey(mon)}"></label>
      <label>Время начала<input id="ics-time" type="time" value="${ICS.time}"></label>
      <label>Недель<select id="ics-weeks">${[4, 8, 12].map(n => `<option value="${n}"${n === ICS.weeks ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label>Напоминание<select id="ics-alarm">${[[0, 'без'], [30, 'за 30 мин'], [60, 'за час'], [120, 'за 2 часа'], [720, 'за 12 часов']].map(([v, n]) => `<option value="${v}"${v === ICS.alarm ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
    </div>
    <p class="gear-hint">Тренировки ставятся на дни недели из сплита. После 4-й недели цикл повторяется с первой.</p>
    <p class="p-hint" id="ics-msg" role="status"></p>
    <div class="gear-btns"><button type="button" class="btn btn-2" id="ics-cancel">Закрыть</button><button type="button" class="btn" id="ics-save">Сохранить файл</button></div>
  </form>`;
}
function openIcs() {
  let d = $('#ics-view');
  if (!d) { d = document.createElement('dialog'); d.id = 'ics-view'; d.className = 'gear-view'; document.body.appendChild(d); }
  d.innerHTML = icsDialogHtml(); d.showModal();
}
async function saveIcs() {
  const start = new Date($('#ics-start').value + 'T12:00:00');
  if (isNaN(start)) { $('#ics-msg').textContent = 'Укажите дату начала.'; return; }
  ICS.time = $('#ics-time').value || '19:00'; ICS.weeks = +$('#ics-weeks').value || 4; ICS.alarm = +$('#ics-alarm').value || 0;
  try { localStorage.setItem(ICS_KEY, JSON.stringify(ICS)); } catch (e) {}
  const txt = icsText(start, ICS.time, ICS.weeks);
  const r = await saveFile(`lazy-gym-workouts-${dayKey(start)}.ics`, txt, 'text/calendar');
  $('#ics-msg').textContent = r === 'ok' ? 'Файл сохранён. Откройте его — календарь предложит добавить события.' : r === 'declined' ? 'Сохранение отменено.' : 'Сохранить файл не удалось.';
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.id === 'ics-open') { openIcs(); return; }
  if (t.id === 'ics-cancel') { $('#ics-view').close(); return; }
  if (t.id === 'ics-save') { saveIcs(); return; }
});
