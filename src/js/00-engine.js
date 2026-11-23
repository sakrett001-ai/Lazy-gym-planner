/* ===================== SVG-ФИГУРА: общие помощники ===================== */
const D2R = Math.PI / 180;
const SVGNS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const f1 = x => Math.round(x * 10) / 10;

function closedSpline(P) {
  const n = P.length; let d = `M${f1(P[0][0])},${f1(P[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d + 'Z';
}

/* градиенты цветов атлета: у каждой фигуры свои id */
let athleteSerial=0;
function athletePalette(svg) {
  const prefix='athlete-'+(++athleteSerial),defs=el('defs',{},svg),fills={};
  /* цвета берутся из токенов темы (--ath-*), поэтому фигура перекрашивается вместе со страницей */
  for(const name of ['skin','far','kit','shorts','shoe']){
    const id=prefix+'-'+name,g=el('linearGradient',{id,x1:'0%',y1:'0%',x2:'100%',y2:'30%'},defs);
    [0,.42,1].forEach((off,i)=>{const st=el('stop',{offset:off},g);st.style.stopColor=`var(--ath-${name}-${i})`;});fills[name]='url(#'+id+')';
  }
  return fills;
}
let vecSerial = 0;

/* рамка кадра SVG-фигуры без самой фигуры, по частям: job.step(n) считает n положений из 41 и возвращает true в конце.
   null — у фигуры нет общей памяти рамок (не манекен каталога). */
function figureFrameJob(anim, opts = {}) {
  return anim.catalogRig ? buildSpatialFigure(catalogFigureAnim(catalogAnimFor(anim, opts.has)), {...opts, frameOnly:true}) : null;
}
/* SVG-фигура упражнения (карточки плана, витрина, разбор без объёмной графики) — манекен каталога, 07-rigs-core.js */
function buildFigure(anim, opts = {}) {
  return buildSpatialFigure(catalogFigureAnim(catalogAnimFor(anim, opts.has)), opts);
}

/* ===================== КАРТА МЫШЦ ===================== */
const MAP_FRONT = [
  ['head', 'e', [50, 15, 9, 11]],
  ['neck', 'p', [[46, 25], [54, 25], [55, 33], [45, 33]]],
  ['traps', 'p', [[54, 29], [63, 36], [55, 38]]],
  ['delt_f', 'p', [[64, 36], [73, 36], [80, 42], [82, 53], [78, 61], [73, 54], [69, 45], [64, 40]]],
  ['chest', 'p', [[51, 40], [64, 41], [70, 47], [72, 56], [66, 64], [57, 66], [51, 65]]],
  ['biceps', 'p', [[74, 59], [79, 61], [83, 69], [83, 81], [80, 87], [76, 83], [73, 71]]],
  ['forearms', 'p', [[76, 90], [82, 89], [87, 99], [89, 115], [88, 123], [84, 123], [80, 109], [76, 98]]],
  ['hand', 'p', [[84, 125], [89, 125], [91, 133], [88, 139], [84, 136]]],
  ['abs', 'r', [51, 68, 7, 8]], ['abs', 'r', [51, 78, 7, 8]], ['abs', 'r', [51, 88, 7, 8]], ['abs', 'r', [51, 98, 6.5, 13]],
  ['obliques', 'p', [[59, 68], [66, 66], [69, 80], [68, 96], [63, 106], [59, 103]]],
  ['pelvis', 'p', [[50, 113], [58, 113], [64, 108], [69, 104], [70, 112], [62, 116], [52, 121], [50, 122]]],
  ['quads', 'p', [[54, 120], [63, 116], [70, 115], [72, 128], [70, 146], [66, 157], [59, 157], [55, 146], [53, 132]]],
  ['adductors', 'p', [[51, 124], [53, 122], [54, 140], [56, 150], [52, 146]]],
  ['hipflex', 'p', [[57, 114], [63, 110], [66, 114], [60, 120], [56, 119]]],
  ['serratus', 'p', [[70, 57], [73, 60], [73, 67], [70, 72], [67, 67]]],
  ['knee', 'e', [62, 161, 4.5, 4]],
  ['calves', 'p', [[57, 166], [65, 165], [67, 176], [64, 194], [59, 194], [57, 180]]],
  ['foot', 'p', [[58, 196], [64, 196], [68, 203], [57, 203]]]
];
const MAP_BACK = [
  ['head', 'e', [50, 15, 9, 11]],
  ['neck', 'p', [[46, 25], [54, 25], [55, 31], [45, 31]]],
  ['traps', 'p', [[50, 27], [55, 30], [66, 36], [60, 41], [54, 54], [50, 60]]],
  ['delt_r', 'p', [[67, 36], [75, 37], [81, 43], [82, 53], [78, 58], [72, 48]]],
  ['midback', 'p', [[51, 61], [55, 55], [61, 42], [69, 44], [71, 52], [63, 59], [53, 66]]],
  ['cuff', 'p', [[62, 45], [68, 45.5], [70.5, 51], [66, 55], [61.5, 50]]],
  ['lats', 'p', [[53, 68], [64, 61], [72, 54], [74, 62], [71, 77], [63, 90], [55, 94]]],
  ['lowback', 'p', [[51, 70], [52, 70], [56, 93], [57, 107], [51, 110]]],
  ['triceps', 'p', [[74, 58], [80, 60], [84, 68], [84, 81], [80, 87], [76, 80], [73, 68]]],
  ['forearms', 'p', [[76, 90], [82, 89], [87, 99], [89, 115], [88, 123], [84, 123], [80, 109], [76, 98]]],
  ['hand', 'p', [[84, 125], [89, 125], [91, 133], [88, 139], [84, 136]]],
  ['flank', 'p', [[57, 96], [64, 91], [68, 98], [68, 106], [58, 108]]],
  ['glutes', 'p', [[51, 111], [59, 109], [68, 110], [71, 121], [68, 131], [59, 133], [51, 130]]],
  ['hams', 'p', [[53, 136], [61, 135], [70, 134], [71, 147], [67, 158], [58, 158], [54, 148]]],
  ['knee', 'e', [62, 162, 4.5, 3.5]],
  ['calves', 'p', [[57, 166], [65, 165], [68, 177], [65, 189], [60, 191], [56, 180]]],
  ['foot', 'p', [[58, 194], [64, 194], [65, 203], [57, 203]]]
];
const MUSCLE_NAMES = {chest:'Грудные', delt_f:'Передняя дельта', delt_s:'Средняя дельта', delt_r:'Задняя дельта', biceps:'Бицепс', triceps:'Трицепс',
  forearms:'Предплечья', abs:'Прямая мышца живота', obliques:'Косые мышцы живота', traps:'Трапеции', midback:'Ромбовидные и середина спины',
  lats:'Широчайшие', lowback:'Разгибатели спины', glutes:'Ягодичные', quads:'Квадрицепс', hams:'Задняя поверхность бедра', calves:'Икры',
  /* с 4.33.0 (аудит анатомии): мышцы, без которых состав упражнений был неверен или неполон — приводящие (сведение ног,
     приседания, выпады), сгибатели бедра (подъёмы ног), передняя зубчатая (отжимания, жимы над головой), вращательная
     манжета (разведения назад, «Y-T-W», тяги сверху); «Икры» — икроножная и камбаловидная вместе */
  adductors:'Приводящие бедра', hipflex:'Сгибатели бедра', serratus:'Передняя зубчатая', cuff:'Вращательная манжета'};
/* 4.110 (замечание анатома 8): «Бицепс бедра» — лишь одна из трёх мышц задней группы бедра (двуглавая, полусухожильная,
   полуперепончатая), группа называется «Задняя поверхность бедра», как в разделе суставов; английское — Hamstrings.
   Названия во множественном числе — для согласования глагола («Квадрицепс участвует», «Грудные участвуют») */
const MUSCLE_PLURAL = new Set(['chest', 'forearms', 'obliques', 'traps', 'midback', 'lats', 'lowback', 'glutes', 'calves', 'adductors', 'hipflex']);

function mirrorShape(kind, d) {
  if (kind === 'p') return d.map(([x, y]) => [100 - x, y]);
  if (kind === 'r') return [100 - d[0] - d[2], d[1], d[2], d[3]];
  if (kind === 'e') return [100 - d[0], d[1], d[2], d[3]];
}
function shapeSvg(kind, d, attrs) {
  const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
  if (kind === 'p') return `<polygon points="${d.map(p => p.join(',')).join(' ')}" ${a}/>`;
  if (kind === 'r') return `<rect x="${d[0]}" y="${d[1]}" width="${d[2]}" height="${d[3]}" rx="1.6" ${a}/>`;
  if (kind === 'e') return `<ellipse cx="${d[0]}" cy="${d[1]}" rx="${d[2]}" ry="${d[3]}" ${a}/>`;
}
/* level: {muscle: 0..1}. delt_s подсвечивает переднюю и заднюю дельту частично */
/* Подписи внутри рисунков SVG (карта мышц, график активности, динамика) заданы в единицах рисунка и сами со шрифтом не растут
   (Галина 13). fontK — во сколько раз шрифт страницы крупнее обычного (1–2; настройка шрифта браузера или телефона);
   рисунок оставляет подписям столько же раз больше места. svgFs — размер подписи, если шрифт крупнее обычного. */
function fontK() { try { const v = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16; return v > 1.05 ? Math.min(2, Math.round(v * 20) / 20) : 1; } catch (e) { return 1; } }
const svgFs = (px, k) => k > 1 ? ` style="font-size:${+(px * k).toFixed(1)}px"` : '';

function muscleMapSvg(level, opts = {}) {
  const K = fontK(); /* подписи «спереди / сзади» растут вместе со шрифтом (Галина 13) */
  const lv = m => {
    if (m === 'delt_f') return Math.max(level.delt_f || 0, (level.delt_s || 0) * 0.8);
    if (m === 'delt_r') return Math.max(level.delt_r || 0, (level.delt_s || 0) * 0.8);
    return level[m] || 0;
  };
  const neutral = new Set(['head', 'neck', 'hand', 'pelvis', 'knee', 'foot', 'flank']);
  const view = (shapes, dx, label) => {
    let s = `<g transform="translate(${dx},0)">`;
    for (const [m, kind, d] of shapes) {
      for (const dd of (d === undefined ? [] : [d, mirrorShape(kind, d)])) {
        const v = neutral.has(m) ? 0 : lv(m);
        s += shapeSvg(kind, dd, {class: neutral.has(m) ? 'mm-n' : 'mm-b'});
        if (v > 0) s += shapeSvg(kind, dd, {class:'mm-h', 'fill-opacity':(0.18 + 0.82 * v).toFixed(2)});
      }
    }
    if (opts.labels) s += `<text x="50" y="${207 + 9 * K}" class="mm-l"${svgFs(10, K)}>${label}</text>`;
    return s + '</g>';
  };
  const H = opts.labels ? 207 + 15 * K : 207;
  return `<svg viewBox="0 0 206 ${H}" class="mmap" role="img" aria-label="${opts.aria || 'Карта мышц'}">${view(MAP_FRONT, 0, 'спереди')}${view(MAP_BACK, 106, 'сзади')}</svg>`;
}
