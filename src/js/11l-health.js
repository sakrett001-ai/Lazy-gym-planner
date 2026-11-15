/* ===================== ЗДОРОВЬЕ: КОРОТКИЙ ВОПРОС И ОГОВОРКИ =====================
   Решение владельца 15.11.2026 («Согласен»; замечания кардиолога, Михаил п. 3, 10): необязательный вопрос о здоровье
   в первом запуске — по образцу PAR-Q+ (Warburton D.E.R., Jamnik V.K., Bredin S.S.D., Gledhill N. on behalf of the PAR-Q+
   Collaboration; бланк «2024 PAR-Q+», версия 01-11-2024, проверено по тексту бланка). Семь общих вопросов PAR-Q+: 1) врач
   говорил о болезни сердца или повышенном давлении; 2) боль в груди в покое, в быту или при нагрузке; 3) потеря равновесия
   от головокружения или потеря сознания за последние 12 месяцев; 4) другая хроническая болезнь; 5) лекарства от хронической
   болезни; 6) проблема с костями, суставами, мышцами, связками или сухожилиями сейчас или за 12 месяцев, которую нагрузка
   может ухудшить; 7) врач говорил заниматься только под наблюдением. При беременности — посоветоваться с врачом.
   Здесь — шесть пунктов, о которых договорились с владельцем (давление и сердце, боль в груди, головокружения и обмороки,
   беременность, недавняя операция или травма, врач ограничил нагрузку), одним необязательным вопросом в последнем шаге
   первого запуска (лишнего шага нет) и в параметрах — для тех, кто уже пользуется приложением. При любом «да» — спокойное
   «сначала посоветуйтесь с врачом», цель «Бережно» и оговорки о дыхании и пульсе. Без диагнозов и запретов. Ответы — только
   в параметрах на устройстве (S.health); в аккаунт и копию параметров попадают так же, как отметки «Что беречь». */
const HEALTH = [
  {id:'heart', name:'Повышенное давление или болезни сердца'},
  {id:'chest', name:'Боль в груди при нагрузке или в покое'},
  {id:'dizzy', name:'Головокружения или обмороки за последний год'},
  {id:'pregnant', name:'Беременность'},
  {id:'surgery', name:'Недавняя операция или травма'},
  {id:'doctor', name:'Врач ограничил нагрузку'}
];
const HEALTH_BY = Object.fromEntries(HEALTH.map(h => [h.id, h]));
function ensureHealth(s) { s.health = Array.isArray(s.health) ? HEALTH.map(h => h.id).filter(id => s.health.includes(id)) : []; return s.health; }
ensureHealth(S);

/* ---------- оговорка о дыхании ----------
   У тяжёлой базы (schemeOf: heavy), там, где советуют задержку дыхания, у жимов над головой и у упражнений вниз головой —
   одна и та же строка (замечания кардиолога, Михаил п. 2, 7, 11):
   · натуживание с задержкой дыхания — часть очень высокого давления при тяжёлом подходе: жим ногами до отказа — в среднем
     320/250 мм рт. ст., у одного из пяти — выше 480/350 (MacDougall J.D., Tuxen D., Sale D.G., Moroz J.R., Sutton J.R.,
     J Appl Physiol 1985, 58(3):785–790, аннотация);
   · рекомендация Американской кардиологической ассоциации — выдыхать на усилии, вдыхать при расслаблении, не задерживать
     дыхание и не натуживаться (Williams M.A. et al., Circulation 2007, 116:572–584 — по пересказу Reuters Health в Rehab
     Management, 20.07.2007; текст заявления не открылся);
   · глаза: жим лёжа с задержкой дыхания поднимал давление в глазу у 90 % (в среднем на 4,3 мм рт. ст.), с обычным дыханием —
     у 62 % (на 2,2) — Vieira G.M. et al., Arch Ophthalmol 2006, 124:1251–1254 (по пресс-релизу журнала, EurekAlert);
     положение вниз головой — давление в глазу за минуту с 17 до 28–29 мм рт. ст. и у больных глаукомой, и у здоровых —
     Jasien J.V., Jonas J.B., de Moraes C.G., Ritch R., PLoS ONE 2015, 10(12):e0144505 (аннотация);
   · беременность: при головокружении от натуживания — не задерживать дыхание; если лёжа на спине нехорошо — сменить
     положение — 2019 Canadian Guideline for Physical Activity throughout Pregnancy (Mottola M.F. et al., J Obstet Gynaecol
     Can 2018, 40(11):1549–1559).
   Вниз головой — голова ниже и плеч, и таза больше чем на 5 см в каком-то положении повторения (по позе манекена):
   гиперэкстензия, упор углом и упор углом с ногами на скамье, жим на скамье с обратным наклоном, отжимания с ногами на скамье,
   скручивания на скамье с обратным наклоном. */
const BREATH_MED = 'При повышенном давлении, болезнях сердца, глаукоме и при беременности не задерживайте дыхание: выдыхайте на усилии.';
const HEAD_DOWN_MED = 'Голова ниже сердца поднимает давление в голове и глазах: при глаукоме, повышенном давлении и болезнях сердца выберите упражнение без положения вниз головой.';
const HEAD_DOWN = new Map();
function headDown(ex) {
  if (HEAD_DOWN.has(ex.id)) return HEAD_DOWN.get(ex.id);
  let low = -Infinity;
  const rig = ex.anim && ex.anim.catalogRig;
  if (rig && typeof CATALOG_POSES !== 'undefined' && CATALOG_POSES[ex.id]) for (let i = 0; i <= 20; i++) {
    const R = rig(i / 20); if (!R.frames || !R.head) break;
    low = Math.max(low, Math.min(R.head[1] - (R.shL[1] + R.shR[1]) / 2, R.head[1] - R.hip[1]));
  }
  const v = low > 5; HEAD_DOWN.set(ex.id, v); return v;
}
function breathCaveat(ex) {
  const hold = /вдох[^.]*задержк/i.test(ex.breath || ''), heavy = typeof schemeOf === 'function' && schemeOf(ex) === 'heavy';
  const over = typeof PATTERN !== 'undefined' && PATTERN[ex.id] === 'vpush', down = headDown(ex);
  if (!hold && !heavy && !over && !down) return '';
  return down ? BREATH_MED + ' ' + HEAD_DOWN_MED : BREATH_MED;
}

/* При отмеченных давлении или сердце, боли в груди, головокружениях и беременности упражнения вниз головой не подбираются
   (давление в глазу в положении вниз головой — с 17 до 28–29 мм рт. ст., Jasien et al. 2015; при головокружении — риск
   упасть, вставая): в подборе, в заменах и в своём плане — как с отметками «Что беречь?» */
const HEALTH_NO_HEAD_DOWN = ['heart', 'chest', 'dizzy', 'pregnant'];
function healthOk(ex) { return !(ensureHealth(S).some(id => HEALTH_NO_HEAD_DOWN.includes(id)) && headDown(ex)); }

/* ---------- плашка в плане при отмеченном здоровье ---------- */
const HEALTH_TIPS = {
  pregnant:'Если лёжа на спине становится нехорошо, выполняйте упражнение сидя или на боку.',
  surgery:'После операции или травмы нагрузку и сроки согласуйте с врачом или реабилитологом; в «Что беречь?» отметьте, что восстанавливается.'
};
function healthHtml() {
  const list = ensureHealth(S);
  if (!list.length) return '';
  const tips = [BREATH_MED, 'Если вы принимаете лекарства, которые снижают пульс (например, бета-блокаторы), пульс с часов не показывает нагрузку — ориентируйтесь на дыхание и самочувствие.']
    .concat(list.filter(id => HEALTH_TIPS[id]).map(id => HEALTH_TIPS[id]), HEART_STOP);
  return `<details class="health-box"${ensureFold(S).health ? '' : ' open'}><summary>Здоровье: сначала посоветуйтесь с врачом</summary>
    <p><b>Вы отметили:</b> ${esc(list.map(id => HEALTH_BY[id].name.toLowerCase()).join('; '))}. Спросите врача, какая нагрузка вам подходит.${S.goal === 'gentle' ? ' Пока выбрана цель «Бережно» — лёгкий вес, медленно.' : ''}</p>
    <ul>${tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <p class="gentle-warn">Ответы хранятся только на этом устройстве. Изменить их можно в параметрах, в разделе «Здоровье».</p></details>`;
}

/* ---------- параметры: «Здоровье» для тех, кто уже пользуется приложением ---------- */
function renderHealth() {
  const box = $('#h-chips'); if (!box) return;
  const on = new Set(ensureHealth(S));
  box.innerHTML = HEALTH.map(h => `<button type="button" class="chip${on.has(h.id) ? ' on' : ''}" data-health="${h.id}" aria-pressed="${on.has(h.id)}">${ICON.check}<span>${esc(h.name)}</span></button>`).join('');
  $('#h-note').textContent = on.size ? 'Сначала посоветуйтесь с врачом. Над планом — что важно при отмеченном. Ответы хранятся только на этом устройстве.'
    : 'Необязательно. Если что-то из этого про вас — отметьте: план подскажет, что важно, и предложит бережный режим. Ответы хранятся только на этом устройстве.';
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t || !t.dataset.health || !HEALTH_BY[t.dataset.health]) return;
  const id = t.dataset.health, was = ensureHealth(S).length;
  S.health = S.health.includes(id) ? S.health.filter(x => x !== id) : S.health.concat(id);
  ensureHealth(S);
  /* первое «да» — бережная цель (её можно сменить); снятые отметки цель не трогают */
  if (!was && S.health.length && S.mode !== 'custom') S.goal = 'gentle';
  regen();
});
document.addEventListener('toggle', e => {
  if (!e.target.classList || !e.target.classList.contains('health-box')) return;
  ensureFold(S).health = !e.target.open; saveSettings();
}, true);
