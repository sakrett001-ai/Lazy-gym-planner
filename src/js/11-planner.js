/* ===================== ПЛАНИРОВЩИК ===================== */
/* load — нагрузка в строке карточки (c — процент от максимума на 1 повтор у базовых с весом, который можно взвесить, —
   его дописывает pctText; i — начало строки у изолирующих); запас повторов к ней дописывает reserveOf (rir — запас по цели
   без цикла; null — без числа: «до последнего чистого повтора», «до сильного жжения в мышце»).
   about — пояснение цели простыми словами: под переключателем в параметрах и на шаге «Цель» первого запуска (11k-first-run.js).
   Схемы по типу упражнения (schemeOf): mod — многосуставные без тяжёлого максимума в «Силе» (в остальных целях — как
   многосуставные); ctrl — повторы для подвижности и стабилизации; ball — повторы махов гирей */
const GOALS = {
  strength:{name:'Сила', hint:'3–6 повт.', about:'Стать сильнее: тяжёлый вес, 3–6 повторов, долгий отдых.', reps:{c:'3–5', i:'6–8'}, sets:{c:5, i:3}, rest:{c:180, i:90}, tempo:'2-0-X-0',
    load:{c:'≈ 80–90%', i:'тяжело'}, rir:[1, 2], rep:3, time:'20–30 с', dist:'20 м',
    circ:{rounds:4, reps:'6–8', work:20, rest:30, roundRest:180}, ss:{rest:150},
    mod:{sets:3, reps:'6–8', rest:120}, ctrl:'5–8', ball:'6–8'},
  mass:{name:'Масса', hint:'6–12 повт.', about:'Нарастить мышцы: средний вес, 6–12 повторов.', reps:{c:'6–10', i:'10–12'}, sets:{c:4, i:3}, rest:{c:120, i:75}, tempo:'3-0-1-0',
    load:{c:'≈ 70–80%', i:''}, rir:[1, 2], rep:4, time:'30–45 с', dist:'30 м',
    circ:{rounds:3, reps:'10–12', work:30, rest:20, roundRest:120}, ss:{rest:90}, ctrl:'8–12', ball:'8–10'},
  cut:{name:'Рельеф', hint:'12–20 повт.', about:'Подтянуть тело и выносливость: лёгкий вес, 12–20 повторов, короткий отдых.', reps:{c:'12–15', i:'15–20'}, sets:{c:3, i:3}, rest:{c:60, i:40}, tempo:'2-0-1-0',
    load:{c:'≈ 55–65%', i:'до сильного жжения в мышце'}, rir:null, rep:3, time:'45–60 с', dist:'40 м',
    circ:{rounds:4, reps:'15–20', work:40, rest:15, roundRest:90}, ss:{rest:60}, ctrl:'10–15', ball:'10–15'},
  /* бережно: суставы болят или идёт восстановление (11g-gentle.js) — Garber et al., MSSE 2011, 43(7):1334–1359 */
  gentle:{name:'Бережно', hint:'12–15 повт.', about:'Если болят суставы, после травмы или долгого перерыва: лёгкий вес, медленно, без прыжков и рывков.', reps:{c:'12–15', i:'12–15'}, sets:{c:2, i:2}, rest:{c:90, i:60}, tempo:'3-0-2-0',
    load:{c:'≈ 40–60%', i:'лёгкий вес'}, rir:[3, 4], rep:5, time:'20–30 с', dist:'20 м',
    circ:{rounds:2, reps:'12–15', work:30, rest:30, roundRest:120}, ss:{rest:90}, ctrl:'8–12', ball:'8–10'}
};
/* Запас повторов (повторы в запасе) — один источник для строки нагрузки в карточке, подсказки первой записи в журнале,
   описания недели цикла и плашки «Бережно»: число нигде больше не пишется. Без цикла — по цели (GOALS.rir), новичку
   в силе и массе на повтор больше (2–3); в цикле — по неделе (WEEKS.rir), в «Бережно» не меньше 3, новичку +1.
   null — без числа: рельеф («до последнего чистого повтора») и разгрузка («не до предела»). */
function reserveOf(week, goal = S.goal, level = S.level) {
  if (week) {
    if (week.deload) return null;
    const n = (goal === 'gentle' ? Math.max(3, week.rir) : week.rir) + (level === 'beg' ? 1 : 0);
    return {lo:n, hi:n};
  }
  const r = GOALS[goal] && GOALS[goal].rir; if (!r) return null;
  const add = level === 'beg' && goal !== 'gentle' ? 1 : 0;
  return {lo:r[0] + add, hi:r[1] + add};
}
/* «1–2» или «3» */
const reserveNum = r => r.lo === r.hi ? String(r.lo) : `${r.lo}–${r.hi}`;
/* «1–2 повтора» */
const reserveReps = r => `${reserveNum(r)} ${plural(r.hi, 'повтор', 'повтора', 'повторов')}`;
/* Слова нагрузки — простые, без расшифровки внизу страницы (замечания тестеров к 4.94.0: «1ПМ», «почти до отказа»,
   «темп 2-0-1-0», «до выраженного жжения» новичку непонятны, «отказ» пугает). Числа те же, меняются только слова:
   · запас повторов — «силы ещё на 1–2 повтора» («оставляйте силы ещё на 1–2 повтора»);
   · «почти до отказа» — «до последнего чистого повтора», «без отказа» — «не до предела»;
   · процент от 1ПМ — «от максимума на 1 повтор» (1ПМ назван в расшифровке LEGEND под планом);
   · темп — tempoWords: «усилие 1 с, возврат 3 с», запись числами — в подсказке строки и в поле «Темп» своего плана.
   Фразы с {n} переводятся целиком (i18n/en.json): в английском число стоит в другом месте фразы. */
/* «силы ещё на 1–2 повтора» */
const reserveText = r => 'силы ещё на {n}'.replace('{n}', reserveReps(r));
/* «оставляйте силы ещё на 1–2 повтора» — строка нагрузки и описание пиковой недели */
const reserveDo = r => 'оставляйте силы ещё на {n}'.replace('{n}', reserveReps(r));
const NEAR_LIMIT = 'до последнего чистого повтора', NOT_LIMIT = 'не до предела';
/* «≈ 70–80% от максимума на 1 повтор» */
const pctText = p => '{p} от максимума на 1 повтор'.replace('{p}', p);
/* «3-0-1-0» (опускание – пауза – подъём – пауза, секунды; X — быстро) → «усилие 1 с, возврат 3 с». Усилие — подъём
   веса (или тяга, жим), возврат — опускание: так верно для любого упражнения, и для тяги сверху тоже. Паузы — если не 0 */
function tempoWords(code) {
  const p = String(code || '').toUpperCase().split('-');
  if (p.length !== 4) return String(code || '');
  const [ecc, low, con, high] = p, sec = (f, v) => f.replace('{t}', v), pause = v => v !== 'X' && +v > 0 ? sec('пауза {t} с', +v) : '';
  return [con === 'X' ? 'быстрое усилие' : sec('усилие {t} с', +con), pause(high), ecc === 'X' ? 'быстрый возврат' : sec('возврат {t} с', +ecc), pause(low)].filter(Boolean).join(', ');
}
const FORMATS = {classic:{name:'Классика', hint:'по подходам'}, superset:{name:'Суперсеты', hint:'пары без отдыха'}, circuit:{name:'Круговая', hint:'круги подряд'},
  static:{name:'Статодинамика', hint:'без расслабления'}};
/* ask и about — вопрос «Ваш опыт» первого запуска (11k-first-run.js): там уровень называется словами человека */
const LEVELS = {beg:{name:'Новичок', ask:'Новичок', about:'Только начинаю или после долгого перерыва'},
  mid:{name:'Уже тренируюсь', ask:'Уже тренируюсь', about:'Занимаюсь регулярно, знаю основные упражнения'},
  adv:{name:'Опытный', ask:'Опытный', about:'Тренируюсь больше года, уверенная техника'}};
const GROUP_W = {chest:1.3, back:1.5, shoulders:1, biceps:0.8, triceps:0.8, forearms:0.5, abs:0.8, glutes:1, quads:1.3, hams:1, calves:0.6, cardio:0.9};
const GROUP_ORDER = {quads:0, glutes:0, hams:1, back:2, chest:3, shoulders:4, triceps:5, biceps:5, forearms:6, calves:7, cardio:7.5, abs:8};
const REGION = {quads:'low', glutes:'low', hams:'low', calves:'low', chest:'push', shoulders:'push', triceps:'push', back:'pull', biceps:'pull', forearms:'pull', abs:'core', cardio:'cardio'};
const ANTAGONIST = {chest:'back', back:'chest', biceps:'triceps', triceps:'biceps', quads:'hams', hams:'quads', shoulders:'back', glutes:'abs', abs:'glutes'};
const PATTERN = {};
[['squat', 'squat goblet airsquat smithsquat legpress legpresshigh legpresslow'], ['hinge', 'deadlift rdl kbswing hyper goodmorning sllift nordic'],
 ['hpush', 'pushup bbbench dbbench dip diamond closegrip wallpush inclinepush kneepush widepush archer'], ['ipush', 'dbincline smithincline inclinebb'], ['dpush', 'declinebb declinepush'],
 ['fly', 'dbfly cablefly pecdeck'], ['pullover', 'pullover straightpull'], ['vpull', 'pullup chinup latpull latpullv latpulluh'], ['hrow', 'bbrow dbrow cablerow cablerowwide bandrow invrow towelrow tablerow'],
 ['vpush', 'dbpress ohp pikepush arnold declinepike'], ['raise', 'latraise bandlatraise cablelat'], ['rear', 'facepull bandfacepull reversefly ytw reversesnow superman'],
 ['curl', 'bbcurl dbcurl hammer cablecurl ropecurl bandcurl preacher inclinecurl concentration towelcurl'], ['ext', 'skull pushdown ropepushdown bandpushdown ohext benchdip kickback chairdip'],
 ['lunge', 'lunge bulgarian stepup revlunge sidelunge pistolbox'], ['bridge', 'hipthrust bridge glutekick glutebridge1'], ['flex', 'crunch cablecrunch lyinglegraise legraise declinecrunch captainraise hangknee bicycle'],
 ['hold', 'plank sideplank rollout hollow plankup deadbug birddog wallsit'], ['side', 'sidebend'], ['calf', 'calfraise lpcalf calf1'], ['grip', 'farmer hang wristcurl'],
 ['jump', 'jumpingjack jumpsquat'], ['burpee', 'burpee thruster'], ['climb', 'mountain'],
 /* тренажёры и кардио (04b) */
 ['squat', 'hacksquat'], ['hpush', 'chestpressm smithbench assistdip'], ['fly', 'cablelowfly'], ['hrow', 'leverrowm tbarrow chestrowdb'], ['vpull', 'assistpull'], ['vpush', 'shoulderpressm smithohp'],
 ['ext', 'cableohext'], ['side', 'cablewood'], ['hinge', 'pullthrough'], ['bridge', 'cablekickback'], ['abduct', 'abduction'], ['adduct', 'adduction cableadduct copenhagen copenhagenknee'], ['calf', 'seatedcalf standcalf'],
 ['run', 'treadmill stairs'], ['ride', 'bike elliptical'], ['row', 'rower'],
 /* прицельно на манжету: вращение плеча наружу */
 ['extrot', 'cableextrot bandextrot'],
 /* дома с эспандером: двойники тяги верхнего блока, сведения и отведения ног, мостика, жима лёжа и кроссовера */
 ['vpull', 'bandlatpull'], ['adduct', 'bandadduct'], ['abduct', 'bandabduct'], ['bridge', 'bandbridge'], ['hpush', 'bandfloorpress'], ['fly', 'bandfly'],
 /* гиря */
 ['hinge', 'kbdeadlift kbswing1 kbclean kbsnatch kbsllift'], ['side', 'kbwindmill kbtgu'], ['raise', 'kbhalo'], ['vpush', 'kbpress'], ['squat', 'kbfrontsquat'], ['hrow', 'kbrow'], ['hpush', 'kbfloorpress']].forEach(([p, ids]) => ids.split(' ').forEach(id => PATTERN[id] = p));
/* желательность упражнения при равных условиях: вспомогательные и упрощённые варианты ниже */
const EX_W = {wallpush:0.5, kneepush:0.7, inclinepush:0.8, towelcurl:0.6, towelrow:0.75, tablerow:0.8, chairdip:0.75, wallsit:0.7, superman:0.8, bicycle:0.9, deadbug:0.85, birddog:0.85, sidelunge:0.85, revlunge:0.9, calf1:0.9, sidebend:0.8, concentration:0.85, kickback:0.85, declinepush:0.9, goodmorning:0.8, jumpingjack:0.9, hangknee:0.95, shrug:0.55, hyper:0.75, frontraise:0.75, wristcurl:0.6, hang:0.65, farmer:0.8, lpcalf:0.9, pikepush:0.8, benchdip:0.85, bandlatraise:0.9,
  bridge:0.85, airsquat:0.8, lyinglegraise:0.9, sideplank:0.9, stepup:0.9, smithsquat:0.85, smithincline:0.9, diamond:0.85, bandcurl:0.9, bandpushdown:0.9, bandrow:0.95,
  /* прицельные на приводящие и манжету — вспомогательные: в обычный план попадают реже, с акцентом из атласа — в первую очередь */
  cableadduct:0.9, copenhagen:0.85, copenhagenknee:0.8, cableextrot:0.8, bandextrot:0.75,
  /* гиря: баллистика и односторонние варианты — после базовых движений со штангой и гантелями */
  kbdeadlift:0.9, kbswing1:0.85, kbclean:0.8, kbpress:0.9, kbfrontsquat:0.85, kbrow:0.9, kbfloorpress:0.8, kbsnatch:0.75, kbsllift:0.85, kbwindmill:0.7, kbhalo:0.6, kbtgu:0.6,
  /* дома с эспандером: тяга сверху — почти как тяга сверху на блоке, прицельные на бёдра — вспомогательные */
  bandlatpull:0.9, bandadduct:0.85, bandbridge:0.9, bandabduct:0.8, bandlegext:0.85, bandfloorpress:0.9, bandfly:0.9,
  /* сисси-присед: прицельно на разгибатели колена, без снаряда — вспомогательное */
  sissysquat:0.8};
const EXI = Object.fromEntries(EX.map(e => [e.id, e]));
const EQN = Object.fromEntries(EQUIP.map(e => [e.id, e.name]));
const GN = Object.fromEntries(GROUPS.map(g => [g.id, g.name]));

/* ---------- генератор как у тренера (отчёт тестеров 4.94.0: Марина п. 11–16, Дмитрий, Alex п. 25) ---------- */
/* Жимы и тяги — горизонтальные и вертикальные. В тренировке, где есть и спина, и грудь или плечи, подходов на тяги
   не меньше, чем на жимы (было: «4 жима, 16 подходов, против 2 тяг, 8», приложение само писало «жимов заметно больше»).
   Перекос в сторону жимов — одна из причин болей в плече у тех, кто тренируется с отягощениями: Kolber M.J. et al.,
   J Strength Cond Res 2010; 24(6):1696–1704; баланс мышц-антагонистов при выборе упражнений и чередование жимов
   и тяг — NSCA, Haff & Triplett, Essentials of Strength Training and Conditioning, 4-е изд., 2016, гл. 17. */
const PUSH_P = new Set(['hpush', 'ipush', 'dpush', 'vpush']), PULL_P = new Set(['hrow', 'vpull']);
const sideOf = ex => PUSH_P.has(PATTERN[ex.id]) ? 'push' : PULL_P.has(PATTERN[ex.id]) ? 'pull' : null;
/* Тяжёлая база с нагрузкой на позвоночник: присед со штангой, в Смите и в гакк-машине, становая и румынская тяги,
   наклоны со штангой, тяга штанги и Т-грифа в наклоне. В одной тренировке — не больше двух (новичку и в «Бережно» —
   одна), из них не больше одной тяги с пола или наклона (было: «присед, становая и тяга в наклоне по 5×3–5 в одной
   тренировке, ≈102 мин»). Основания: это «структурные» упражнения, они нагружают позвоночник и требуют свежих
   разгибателей спины (NSCA Essentials, 2016, гл. 17: структурные упражнения — первыми, на свежую голову); утомление
   разгибателей спины снижает их защитную роль (McGill S., Low Back Disorders, 3-е изд., Human Kinetics, 2016); в
   программах для новичков второе такое упражнение дня — одним-двумя подходами (Rippetoe M., Starting Strength, 3-е изд.,
   2011: присед 3×5 и становая 1×5). */
const HEAVY_SPINE = new Set(['squat', 'smithsquat', 'hacksquat', 'deadlift', 'rdl', 'goodmorning', 'bbrow', 'tbarrow']);
const spineCap = () => S.level === 'beg' || S.goal === 'gentle' ? 1 : 2;
/* можно ли взвесить снаряд: свободные веса, тренажёры, блок, машина Смита (а не лента, турник, скамья, гравитрон) */
const WEIGHABLE = new Set(['db', 'bb', 'kb', 'cable', 'smith']);
const weighId = id => id !== 'gravitron' && (WEIGHABLE.has(id) || (EQUIP.find(e => e.id === id) || {}).cat === 'mach');
/* Схема подходов по типу упражнения (было: гало с гирей и обратные отжимания 6×3–5 «≈80–90% от максимума», ролик для
   пресса 5×3–5 с быстрым усилием). Правило:
   · heavy — тяжёлая база: многосуставное, обеими руками или ногами, со штангой, гантелями, на тренажёре, блоке или в Смите
     (обязательный снаряд взвешивается, а не только «гантели по желанию»). Только у неё процент от максимума на 1 повтор,
     и только у неё в «Силе» 3–5 повторов: тяжёлый диапазон и процент — для основных (core) упражнений, вспомогательным —
     меньшая нагрузка (NSCA Essentials, 2016, гл. 17; ACSM, Ratamess et al., MSSE 2009; 41(3):687–708 — 1–6 повторов при
     80–100% от максимума для многосуставных);
   · mod — многосуставное без тяжёлого максимума: вес тела, лента, противовес, одна рука или нога, гиря одной рукой,
     и dose:'mod' в каталоге — гоблет (вес держат руки), становая с гирей, наклоны со штангой, жим Арнольда, протяжка на
     блоке. Без процента; в «Силе» — как вспомогательное: 3×6–8, отдых 2 мин (ACSM 2009: 1–2 мин между подходами
     вспомогательных упражнений), без быстрого усилия;
   · ballistic — махи, взятие и рывок гири (dose:'ballistic'): взрывно от бёдер, без процента, подход заканчивается, пока
     скорость не упала (ACSM 2009, тренировка мощности: лёгкая и средняя нагрузка, не до отказа; Tsatsouline P.,
     Kettlebell Simple & Sinister, 2-е изд., 2019 — махи по 10 повторов в подходе);
   · ctrl — подвижность и стабилизация (dose:'ctrl'): гало, турецкий подъём, мельница, ролик для пресса, «мёртвый жук»,
     «птица-собака», Y-T-W, лодочка, копенгагенская планка, вращение плеча. Медленно и под контролем, не до предела,
     без процента и без быстрого усилия: задача — удержать положение позвоночника и плеча, а не сдвинуть вес
     (McGill S., Strength Cond J 2010; 32(3):33–46). doseReps — свои повторы при любой цели: турецкий подъём — 1–3
     на сторону, каждый повтор ≈25 с (repSec; Tsatsouline 2019 — по одному, медленно), мельница — 3–5;
   · iso — прицельные (type 'i') — как раньше; упражнения на время и дистанцию — по времени и дистанции. */
function schemeOf(ex) {
  if (ex.kind) return ex.kind;
  if (ex.g === 'cardio') return 'cardio';
  if (ex.dose) return ex.dose;
  if (ex.type !== 'c') return 'iso';
  return !ex.uni && !ex.assist && ex.eq.some(g => g.every(weighId)) ? 'heavy' : 'mod';
}
/* Новичку в подборе — ступени, с которых начинают (PROG_BEG_HARD, 10-progressions.js). Где есть веса и тренажёры,
   многосуставные без веса (вес тела, лента) уступают им (было: «зал, средний уровень: гравитрон и отжимания 4×6–10 при
   полном зале»): отжимания, тяги собственного веса, упор углом, обратные отжимания, выпады без веса — если в этом месте
   есть то же движение с весом (PATTERN); противовес гравитрона — если есть тяга сверху или жим без него (новичку
   гравитрон уместен). Подтягивания и брусья — не облегчение, они остаются.
   Нагрузку легче дозировать весом, чем вариантом упражнения: ACSM 2009 (нагрузка подбирается под диапазон повторов). */
const BAR_STAPLE = new Set(['pullup', 'chinup', 'dip']);
/* жимы лёжа, на наклонной и с обратным наклоном — одно движение для выбора «с весом или без» */
const famOf = p => p === 'ipush' || p === 'dpush' ? 'hpush' : p;
/* Подъём гантелей перед собой — не в день жимов: передняя дельта и так много работает в жиме лёжа и над головой
   (Barnett C., Kippers V., Turner P., J Strength Cond Res 1995; 9(4):222–227); для плеч — махи в стороны (Марина п. 16) */
const FRONT_RAISE = new Set(['frontraise']);
/* Шкала «мало / в норме / много» подходов на группу за неделю — по уровню (один расчёт для недели в плане и журнала):
   · новичок и «Бережно»: 4–12 — ACSM, Garber et al., MSSE 2011; 43(7):1334–1359: каждая крупная группа 2–3 раза
     в неделю по 2–4 подхода (у новичков прирост даёт и один подход);
   · уже тренируюсь и опытный: 10–20 — Schoenfeld, Ogborn, Krieger, J Sports Sci 2017; 35(11):1073–1082: от 10 подходов
     в неделю прирост больше; Baz-Valle et al., J Hum Kinet 2022; 81:199–210: у тренированных 12–20, больше 20 —
     без дополнительного прироста.
   Программа на неделю сама попадает в эту шкалу (buildProgram): цель недели — 40% коридора от нижней границы
   (10–20 → 14, 4–12 → 7), выше «много» — штраф в подборе. */
function volScale(level = S.level, goal = S.goal) { return level === 'beg' || goal === 'gentle' ? {lo:4, hi:12} : {lo:10, hi:20}; }

function effEquip(list) { const E = new Set(list); for (const id of list) for (const x of EQUIP_IMPLIES[id] || []) E.add(x); return E; }
/* как назвать оборудование в карточке: если горизонтальная скамья «получена» из регулируемой — так и пишем */
function eqName(id) {
  if (S.equip.includes(id)) return EQN[id];
  for (const [src, list] of Object.entries(EQUIP_IMPLIES)) if (list.includes(id) && S.equip.includes(src)) return EQN[src];
  return EQN[id];
}
/* ---------- недельная программа ---------- */
const MODES = {single:{name:'Тренировку', hint:'на один день'}, program:{name:'Программу', hint:'на неделю'}, custom:{name:'Свой план', hint:'из избранного'}};
const DAY_T = {
  fa:{name:'Всё тело', g:['quads', 'chest', 'back', 'shoulders', 'biceps', 'abs']},
  fb:{name:'Всё тело', g:['hams', 'glutes', 'back', 'chest', 'triceps', 'abs']},
  fc:{name:'Всё тело', g:['quads', 'glutes', 'back', 'shoulders', 'chest', 'calves']},
  up:{name:'Верх', g:['chest', 'back', 'shoulders', 'biceps', 'triceps']},
  lo:{name:'Низ', g:['quads', 'hams', 'glutes', 'calves', 'abs']},
  push:{name:'Жим', g:['chest', 'shoulders', 'triceps']},
  pull:{name:'Тяга', g:['back', 'biceps', 'forearms']},
  legs:{name:'Ноги', g:['quads', 'hams', 'glutes', 'calves', 'abs']}
};
const SPLITS = {
  full:{name:'Всё тело', hint:'всё за раз', note:'Каждая тренировка нагружает всё тело, упражнения меняются от дня ко дню. Лучший вариант для новичков и при 2–3 тренировках.',
    days:{2:['fa', 'fb'], 3:['fa', 'fb', 'fc'], 4:['fa', 'fb', 'fc', 'fa']}},
  ul:{name:'Верх / низ', hint:'чередование', note:'Дни верха и низа чередуются, каждая мышца работает дважды в неделю.',
    days:{2:['up', 'lo'], 4:['up', 'lo', 'up', 'lo'], 5:['up', 'lo', 'up', 'lo', 'fa']}},
  ppl:{name:'Жим / тяга / ноги', hint:'три направления', note:'Толкающие мышцы, тянущие мышцы и ноги — в разные дни. При 5 тренировках добавляются дни верха и низа.',
    days:{3:['push', 'pull', 'legs'], 5:['push', 'pull', 'legs', 'up', 'lo']}}
};
const DEFAULT_SPLIT = {2:'full', 3:'full', 4:'ul', 5:'ppl'};
const SCHEDULE = {2:[0, 3], 3:[0, 2, 4], 4:[0, 1, 3, 4], 5:[0, 1, 2, 4, 5]};
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WD_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
/* мезоцикл: 4 недели с ростом нагрузки и разгрузкой; запас повторов в описании недели — тот же, что в строке нагрузки
   (reserveOf: цель и уровень открытого плана) */
const WEEKS = [
  {name:'Вход', rir:3, add:0, pct:{strength:'≈ 75–80%', mass:'≈ 65–70%', cut:'≈ 55–60%', gentle:'≈ 40–50%'},
    get note() { return `Подберите рабочие веса так, чтобы в каждом подходе оставались ${reserveText(reserveOf(this))}. Записывайте вес и повторы: от них строится прогресс следующих недель.`; }},
  {name:'Нагрузка', rir:2, add:1, pct:{strength:'≈ 80–85%', mass:'≈ 70–75%', cut:'≈ 60–65%', gentle:'≈ 45–55%'},
    /* двойная прогрессия — простыми словами: сначала повторы до верхней границы, потом вес */
    get note() { return `В упражнениях на несколько мышц добавляется подход. Сначала доводите повторы до верхней границы, потом прибавляйте вес; ${reserveDo(reserveOf(this))}.`; }},
  {name:'Пик', rir:1, add:1, pct:{strength:'≈ 85–90%', mass:'≈ 75–80%', cut:'≈ 65–70%', gentle:'≈ 50–60%'},
    get note() { return `Самая тяжёлая неделя цикла: ${reserveDo(reserveOf(this))}, техника без срывов. Если сон и самочувствие плохие, оставайтесь на нагрузке второй недели.`; }},
  {name:'Разгрузка', rir:4, deload:true, pct:{strength:'≈ 65–70%', mass:'≈ 55–60%', cut:'≈ 50–55%', gentle:'≈ 40%'},
    note:'Подходов примерно на 40% меньше, вес на 10–15% ниже. Это восстановление перед новым циклом, а не пропуск: мышцы растут, когда успевают восстановиться.'}
];

const DEFAULTS = {goal:'mass', format:'classic', level:'mid', count:6, groups:['chest', 'back', 'shoulders'], equip:EQUIP.map(e => e.id), seed:7,
  mode:'single', days:3, split:'full', week:1, day:0, view:'plan', atlasM:'chest', focus:null, fav:[], customs:[], custom:null, gen:null, author:'', fold:null, protect:[],
  cpLast:null /* свой план, куда последним добавляли из атласа или разбора (11d-custom.js) */,
  lr:{} /* «Л/П отдельно» по упражнениям: {exId:true} (13a-sets.js) */,
  units:null /* единицы веса: 'kg' | 'lb'; null — по языку и региону браузера (13-log.js: wu) */,
  dur:null /* время на тренировку: 'short' | 'mid' | 'long' (11j-duration.js); null — число упражнений из «Упражнений» (count) */};
const STORE = 'podhod.settings.v1';
/* Самый первый запуск: в этом браузере ещё нет ни настроек, ни журнала, ни начатой тренировки, ни отметки «план показан»
   (11f-fold.js). Тогда вместо параметров — короткий мастер из нескольких вопросов (11k-first-run.js). Проверяется до того,
   как приложение что-либо запишет; хранилище недоступно — мастера нет. Отметка «план показан» в первый запуск
   пишется, только когда мастер пройден или пропущен: закрытая на середине вкладка откроет мастер снова. */
const FIRST_RUN = (() => {
  try { return !['podhod.settings.v1', 'podhod.log.v1', 'podhod.workout.v3', 'podhod.planSeen.v1'].some(k => localStorage.getItem(k) != null); } catch (e) { return false; }
})();
function loadSettings() {
  try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.groups && s.equip) return Object.assign({}, DEFAULTS, s); } catch (e) {}
  return Object.assign({}, DEFAULTS);
}
function saveSettings() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }

const S = loadSettings();
/* замены и порядок упражнений (кнопки «Заменить» и ↑ ↓) хранятся с настройками: после перезапуска приложения
   план тот же; любая смена параметров собирает план заново и сбрасывает их (regen) */
let swaps = S.swaps && typeof S.swaps === 'object' && !Array.isArray(S.swaps) ? S.swaps : (S.swaps = {});
let eqOpen = false;
let placeDel = false;
let done = {};
let plan = null, prog = null;
/* последнее изменение плана, которое возвращается одним нажатием «Вернуть»: замена или «Убрать» в своём плане (12c-swap.js).
   Не сохраняется: держится до следующего изменения плана или перезагрузки */
let planUndo = null;

/* ---------- утилиты ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
const fmtRest = s => s >= 60 ? (s % 60 ? `${Math.floor(s / 60)} мин ${s % 60} с` : `${s / 60} мин`) : `${s} с`;
/* середина повторов: «8–12» → 10; по подходам «10/8/6/5» — среднее */
const midOf = r => { const s = String(r); if (s.includes('/')) { const l = s.split('/').map(Number).filter(v => v > 0); if (l.length) return l.reduce((a, b) => a + b, 0) / l.length; } const m = s.match(/(\d+)\D+(\d+)/); if (m) return (+m[1] + +m[2]) / 2; const n = parseFloat(r); return isNaN(n) ? 10 : n; };
/* Правила языка сборки (build.js → PODHOD_LOCALE в начале app.js): десятичный разделитель, множественное число, даты,
   единицы веса по умолчанию. Читаются при загрузке модулей, поэтому уже первая отрисовка — по правилам языка. Вне сборки
   (проверки, исходники) — русские правила */
function localeOf() { return (typeof window !== 'undefined' && window.PODHOD_LOCALE) || {}; }
/* язык для Intl: первый язык браузера с языком страницы (en-US, en-GB), иначе язык страницы */
function localeTag() {
  const lang = (typeof window !== 'undefined' && window.PODHOD_LANG) || 'ru', nav = typeof navigator === 'undefined' ? [] : navigator.languages && navigator.languages.length ? [...navigator.languages] : [navigator.language];
  return nav.find(t => typeof t === 'string' && t.toLowerCase().split(/[-_]/)[0] === lang) || lang;
}
/* множественное число: русское — три формы (1 подход, 2 подхода, 5 подходов); 'one' — форма a для 1, иначе c */
function plural(n, a, b, c) { if (localeOf().plural === 'one') return n === 1 ? a : c; const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return a; if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b; return c; }
/* поиск по названиям упражнений — 11i-search.js */
const fmtNum = v => Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', DEC); /* DEC — 13-log.js: в английской сборке точка */

/* можно ли взвесить отягощение: свободные веса, тренажёры, блок, машина Смита (а не лента, турник, скамья или вес тела;
   weighId — выше, у схем подходов) */
function weighable(ex, E) {
  /* необязательные гантели считаются, только если они есть в этом месте */
  return ex.eq.some(g => g.every(weighId)) || (ex.opt || []).some(id => weighId(id) && (!E || E.has(id)));
}
function available(ex, E) { return ex.eq.every(grp => grp.some(id => E.has(id))); }
function chosenEquip(ex, E) {
  const ch = [];
  for (const grp of ex.eq) { const f = grp.find(id => E.has(id)); if (f) ch.push(f); }
  return ch;
}
function exName(ex, E) {
  if (ex.nameV) for (const id of chosenEquip(ex, E)) if (ex.nameV[id]) return ex.nameV[id];
  return ex.name;
}
/* название вне плана — как на плитке атласа: с инвентарём этого места, а если здесь упражнения нет — с полным инвентарём
   («Румынская тяга со штангой» и в списке, и в переключателе разбора, и в подписях кнопок, и в файле плана) */
function exNameHere(ex) { const E = effEquip(S.equip); return exName(ex, available(ex, E) ? E : effEquip(EQUIP.map(e => e.id))); }
function propHas(ex, E) {
  const ch = new Set(chosenEquip(ex, E));
  return id => ch.has(id) || ((ex.opt || []).includes(id) && E.has(id));
}
function equipLine(ex, E) {
  const ch = [...new Set(chosenEquip(ex, E).map(eqName))];
  const opt = (ex.opt || []).filter(id => E.has(id)).map(id => eqName(id).toLowerCase() + ' по желанию');
  if (!ch.length) return ['Без снаряжения'].concat(opt).join(' · ');
  return ch.concat(opt).join(' · ');
}
function groupsOf(ex) { const s = new Set([ex.g]); for (const m of ex.pri) s.add(MUSCLE_GROUP[m]); return s; }
/* дробный учёт одного подхода: целевая группа упражнения — полный подход, остальные работающие (основные и вспомогательные
   мышцы других групп) — половина; кардио своей группе подходов не даёт. Pelland et al., Sports Med 2026; 56(2):481–505:
   косвенный подход как 0,5 лучше всего предсказывает прирост. Общее правило графика «Подходов на группу за неделю» и
   загрузки мышц по журналу (13d-muscle-load.js) */
function groupShare(ex) {
  const w = {};
  for (const m of ex.pri.concat(ex.sec)) { const g = MUSCLE_GROUP[m]; w[g] = Math.max(w[g] || 0, 0.5); }
  if (ex.g !== 'cardio') w[ex.g] = 1;
  else for (const m of ex.pri) w[MUSCLE_GROUP[m]] = Math.max(w[MUSCLE_GROUP[m]], 0.5);
  return w;
}
function splitFor(days) { return SPLITS[S.split] && SPLITS[S.split].days[days] ? S.split : DEFAULT_SPLIT[days]; }

/* ---------- подбор ---------- */
/* opt — только для подбора по журналу (13d-muscle-load.js): weights — доли групп вместо GROUP_W,
   rest — группы, которым нужен отдых (упражнения, где они основные, отодвигаются). Без opt подбор прежний. */
/* opt.vol — подбор дня недельной программы (buildProgram): have — подходы групп за прошлые дни, aim — сколько у группы
   должно быть после этого дня, hi — верх шкалы «много», sets(ex) — подходов упражнения в этот день. Упражнение тем
   желаннее, чем больше закрывает недобора до aim, и уступает, если вывело бы группу (и вспомогательной работой) выше
   «много». opt.pp — жимы и тяги прошлых дней: день тяги без груди и плеч добирает тяги за день жима. */
function pickExercises(E, rand, groups, count, avoid, opt) {
  const G = new Set(groups);
  const lvlMax = S.level === 'beg' ? 2 : 3;
  /* в круговой — без медленных навыков со своими повторами (турецкий подъём, мельница): в круге они превращаются в 15–20 повторов */
  const pool = EX.filter(ex => available(ex, E) && ex.lvl <= lvlMax && (ex.g !== 'cardio' || G.has('cardio')) && (S.format !== 'static' || staticOk(ex)) && (S.format !== 'circuit' || !ex.doseReps) && fitsBody(ex));
  const beg = S.level === 'beg', PB = typeof PROG_BEG_HARD !== 'undefined' ? PROG_BEG_HARD : null;
  /* движения, для которых здесь есть вариант с весом: облегчённые без веса им уступают */
  const loaded = new Set(pool.filter(ex => !ex.assist && weighable(ex, E) && PATTERN[ex.id]).map(ex => famOf(PATTERN[ex.id])));
  /* подтягивания и брусья — не облегчение, но новичку они тяжелы: при тяге сверху или жиме с весом уступают и они */
  const lightAlt = ex => ex.assist ? !beg && loaded.has(famOf(PATTERN[ex.id])) : (beg || !BAR_STAPLE.has(ex.id)) && ex.type === 'c' && !ex.kind && ex.g !== 'cardio' && !weighable(ex, E) && loaded.has(famOf(PATTERN[ex.id]));
  /* жимы и тяги: подходов на тяги не меньше, чем на жимы, — если в тренировке есть спина и грудь или плечи (или день тяги
     добирает за день жима); счёт — по подходам (opt.sets: подходы упражнения в этой тренировке; в «Силе» у тяжёлой
     базы их больше, чем у подтягиваний) */
  const setsOf = opt && opt.sets || (ex => prescribe(ex, null, E).sets), maxS = Math.max(...pool.filter(ex => sideOf(ex)).map(setsOf), 1);
  const pushDay = G.has('chest') || G.has('shoulders'), carry = opt && opt.pp && !pushDay ? Math.max(0, opt.pp.push - opt.pp.pull) : 0;
  const ppOn = G.has('back') && (pushDay || carry > 0), pressCap = pushDay && !G.has('back') ? 2 : 0;
  const cap = spineCap();
  /* объём недели: подходы групп с прошлых дней и подобранных сегодня (proj) */
  const vol = opt && opt.vol, shareOf = new Map();
  let pushN, pullN, pressN, spineN, hingeN, proj, quota, picked, usedPat;
  /* [закрытый недобор, выход за «много», перебор сверх цели дня больше чем на 2 подхода] в подходах: перебор в первые дни
     недели не оставляет места последним */
  const volGain = ex => {
    let sh = shareOf.get(ex); if (!sh) shareOf.set(ex, sh = groupShare(ex));
    const s = vol.sets(ex); let o = 0, f = 0, e = 0;
    for (const [g, x] of Object.entries(sh)) {
      const v = proj[g] || 0, add = x * s, aim = vol.aim[g];
      o += Math.max(0, v + add - vol.hi) - Math.max(0, v - vol.hi);
      if (aim !== undefined) { f += Math.min(add, Math.max(0, aim - v)); e += Math.max(0, v + add - aim - 2) - Math.max(0, v - aim - 2); }
    }
    return [f, o, e];
  };
  /* бережно: при прочих равных — упражнения без пиковой нагрузки на суставы */
  const strain = S.goal === 'gentle' ? new Map(pool.map(ex => [ex, stressIdsOf(ex).length])) : null;
  const GW = opt && opt.weights || GROUP_W, rest = opt && opt.rest && opt.rest.size ? opt.rest : null;
  const totalW = groups.reduce((a, g) => a + GW[g], 0) || 1;
  /* короткая тренировка (20–30 мин, 11j-duration.js) — базовым упражнениям чуть больше веса: в малое время они нагружают
     больше мышц (Iversen et al., Sports Med 2021; 51(10):2079–2095) */
  const compBonus = {strength:0.7, mass:0.35, cut:0.05, gentle:0.1}[S.goal] + (S.dur === 'short' && S.mode !== 'custom' ? 0.3 : 0);
  /* акцент из атласа: если группа мышцы есть в этой тренировке, треть упражнений нагружают её как основную
     (в недельной программе — одно на каждые 5 упражнений дня, объём набирается за неделю);
     сверх этого — небольшой плюс, а где мышца помогает — ещё меньший */
  const focus = S.focus && MUSCLE_NAMES[S.focus] ? S.focus : null;
  const focusNeed = focus && G.has(MUSCLE_GROUP[focus]) ? (S.mode === 'program' ? Math.max(1, Math.round(count / 5)) : Math.ceil(count / 3)) : 0;
  const jitter = pool.map(() => rand());
  /* strict — второй проход, если жимов вышло больше тяг (тяга так и не нашлась, например спина уже «много»): тогда жим —
     только после тяги */
  const run = strict => {
  pushN = carry; pullN = 0; pressN = 0; spineN = 0; hingeN = 0; proj = vol ? {...vol.have} : null; picked = []; usedPat = {}; quota = {};
  for (const g of groups) quota[g] = count * GW[g] / totalW;
  while (picked.length < count) {
    let best = null, bestScore = -1e9;
    const focusShort = !!focus && picked.filter(p => p.pri.includes(focus)).length < focusNeed;
    pool.forEach((ex, i) => {
      if (picked.includes(ex)) return;
      /* тяжёлая база с нагрузкой на позвоночник — не больше cap за тренировку, тяга с пола или наклон — одна */
      if (HEAVY_SPINE.has(ex.id) && (spineN >= cap || (PATTERN[ex.id] === 'hinge' && hingeN >= 1))) return;
      const gs = groupsOf(ex);
      let gain = 0;
      if (G.has(ex.g)) gain += Math.max(quota[ex.g], 0) * 1.6 + 0.4;
      for (const g of gs) if (g !== ex.g && G.has(g)) gain += Math.max(quota[g], 0) * 0.5;
      if (gain <= 0) return;
      /* новичку начальные ступени цепочек — без скидки желательности, ступени выше уступают (отжимания с колен — раньше,
         чем от пола и на брусьях) */
      const ew = beg && PB && PROG_BEG_START.has(ex.id) ? 1 : EX_W[ex.id] ?? 1;
      let sc = gain + (ex.type === 'c' ? compBonus : 0) + jitter[i] * 0.5 + (ew - 1) * 1.4;
      if (beg && PB && PB.has(ex.id)) sc -= 0.9;
      if (lightAlt(ex)) sc -= ex.assist ? 1.5 : 1.2;
      if (FRONT_RAISE.has(ex.id) && picked.some(p => sideOf(p) === 'push')) sc -= 1;
      const side = ppOn ? sideOf(ex) : null;
      /* жим — только если после него остаётся место, чтобы тяг стало не меньше; тяга, пока их меньше, — с большим плюсом;
         когда тяг уже больше, ещё одна — с минусом (поровну, а не вдвое) */
      if (side === 'push' && (strict ? pushN + setsOf(ex) > pullN : pushN + setsOf(ex) - pullN > (count - picked.length - 1) * maxS)) sc -= strict ? 50 : 3;
      if (side === 'pull') sc += pullN < pushN ? 1 + 0.5 * Math.min(3, (pushN - pullN) / maxS) : pullN > pushN && pushDay ? -0.8 : 0;
      /* в тренировке со спиной и грудью или плечами от 4 упражнений — хотя бы одна тяга и один жим (основа тренировки всего
         тела и верха: ноги, жим, тяга — NSCA Essentials, 2016, гл. 17), а не только прицельные на мелкие группы */
      if (pushDay && count >= 4 && side && !(side === 'pull' ? pullN : pushN) && (side === 'pull' || pullN)) sc += 2.5;
      /* день жима без спины (жим / тяга / ноги): не больше двух жимов, дальше — разводки, махи, трицепс; иначе день тяги
         не успевает их уравновесить */
      if (pressCap && sideOf(ex) === 'push' && pressN >= pressCap) sc -= 2.5;
      if (vol) { const [f, o, e] = volGain(ex); sc += 0.25 * f - 0.6 * o - 0.5 * e; }
      /* тяга в наклоне со штангой или Т-грифом — после приседа или становой лучше на блоке или тренажёре: место тяжёлой
         базы с нагрузкой на позвоночник — ногам */
      if (spineN && HEAVY_SPINE.has(ex.id) && PATTERN[ex.id] === 'hrow') sc -= 0.6;
      if (ex.eq.length) sc += 0.25;
      if (strain) sc -= 0.5 * strain.get(ex);
      if (S.goal === 'strength' && ex.eq.some(g => g.includes('bb'))) sc += 0.3;
      for (const m of ex.pri) if (!G.has(MUSCLE_GROUP[m])) sc -= 0.3;
      if (rest) for (const g of new Set(ex.pri.map(m => MUSCLE_GROUP[m]))) if (rest.has(g)) sc -= 0.8;
      const pat = PATTERN[ex.id] || 'solo:' + ex.id;
      if (usedPat[pat]) sc -= 0.7 * usedPat[pat] + (picked.some(p => PATTERN[p.id] === pat && p.g === ex.g) ? 0.4 : 0);
      if (!G.has(ex.g)) sc -= 0.6;
      if (avoid && avoid.has(ex.id)) sc -= 1.1;
      if (focus) sc += ex.pri.includes(focus) ? (focusShort ? 3 : 0.6) + (ex.pri[0] === focus ? 0.3 : 0) : ex.sec.includes(focus) ? 0.35 : 0;
      if (typeof PROG_CHAIN !== 'undefined' && PROG_CHAIN[ex.id] !== undefined && picked.some(p => PROG_CHAIN[p.id] === PROG_CHAIN[ex.id])) sc -= 1.5;
      if (sc > bestScore) { bestScore = sc; best = ex; }
    });
    if (!best) break;
    picked.push(best);
    const bs = sideOf(best); if (ppOn && bs === 'push') pushN += setsOf(best); else if (ppOn && bs === 'pull') pullN += setsOf(best);
    if (bs === 'push') pressN++;
    if (HEAVY_SPINE.has(best.id)) { spineN++; if (PATTERN[best.id] === 'hinge') hingeN++; }
    if (vol) { const s = vol.sets(best); for (const [g, x] of Object.entries(groupShare(best))) proj[g] = (proj[g] || 0) + x * s; }
    const bp = PATTERN[best.id] || 'solo:' + best.id; usedPat[bp] = (usedPat[bp] || 0) + 1;
    if (quota[best.g] !== undefined) quota[best.g] -= 1;
    for (const g of groupsOf(best)) if (g !== best.g && quota[g] !== undefined) quota[g] -= 0.45;
  }
  };
  run(false);
  if (ppOn && pushN > pullN) run(true);
  return {picked, pool};
}
/* Порядок: многосуставные раньше прицельных, пресс — в конце; ноги и тяга с пола — первыми; жимы и тяги верха
   чередуются, первым — более сложное из них (тяжёлая база, выше уровень), при равенстве — тяга; внутри группы мышц
   сложное — раньше. NSCA Essentials, 2016, гл. 17: сначала основные упражнения на крупные мышцы, затем
   вспомогательные; чередование жимов и тяг. Было: подтягивания обратным хватом (группа «бицепс») стояли после всех
   жимов (Марина п. 12). */
const demandOf = ex => (schemeOf(ex) === 'heavy' ? 2 : 0) + ex.lvl;
function orderClassic(list) {
  const rank = ex => ex.type === 'c' && sideOf(ex) ? 2.5 : GROUP_ORDER[ex.g];
  const out = list.slice().sort((a, b) => {
    const ca = a.g === 'abs' ? 1 : 0, cb = b.g === 'abs' ? 1 : 0;
    if (ca !== cb) return ca - cb;
    const ta = a.type === 'c' ? 0 : 1, tb = b.type === 'c' ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return rank(a) - rank(b) || (ta ? 0 : demandOf(b) - demandOf(a));
  });
  /* жимы и тяги верха — на своих местах в списке, но по очереди */
  const at = out.map((ex, i) => ex.type === 'c' && ex.g !== 'abs' && sideOf(ex) ? i : -1).filter(i => i >= 0);
  const push = at.map(i => out[i]).filter(ex => sideOf(ex) === 'push'), pull = at.map(i => out[i]).filter(ex => sideOf(ex) === 'pull');
  let turn = push.length && (!pull.length || demandOf(push[0]) > demandOf(pull[0])) ? 'push' : 'pull';
  for (const i of at) {
    const q = turn === 'push' ? (push.length ? push : pull) : (pull.length ? pull : push);
    out[i] = q.shift(); turn = turn === 'push' ? 'pull' : 'push';
  }
  return out;
}
function pairSupersets(list) {
  const rest = orderClassic(list);
  const pairs = [];
  while (rest.length) {
    const a = rest.shift();
    if (!rest.length) { pairs.push([a]); break; }
    let bi = 0, bs = -1e9;
    rest.forEach((b, i) => {
      let s = 0;
      if (ANTAGONIST[a.g] === b.g) s += 3;
      if (b.g !== a.g) s += 1;
      /* жим — в пару с тягой: в паре подходов поровну (по большему), так баланс жимов и тяг не сбивается */
      const sa = sideOf(a), sb = sideOf(b);
      if (sa && sb && sa !== sb) s += 2; else if (sa !== sb && (sa || sb)) s -= 4;
      const ga = groupsOf(a); for (const g of groupsOf(b)) if (ga.has(g)) s -= 1.2;
      s -= i * 0.15;
      if (s > bs) { bs = s; bi = i; }
    });
    pairs.push([a, rest.splice(bi, 1)[0]]);
  }
  return pairs;
}
function orderCircuit(list) {
  const by = {low:[], push:[], pull:[], core:[], cardio:[]};
  for (const ex of orderClassic(list)) by[REGION[ex.g]].push(ex);
  const keys = ['low', 'push', 'pull', 'cardio', 'core'].sort((a, b) => by[b].length - by[a].length);
  const out = [];
  while (out.length < list.length) {
    for (const k of keys) if (by[k].length) { if (out.length && REGION[out[out.length - 1].g] === k && keys.some(o => o !== k && by[o].length)) continue; out.push(by[k].shift()); }
    if (keys.every(k => !by[k].length)) break;
  }
  return out;
}

/* ---------- дозировка ---------- */
/* новичку удержания (планка, стульчик у стены) — 20–30 с при любой цели (было: планка 45–60 с, Марина п. 16): форма
   держится до конца, время растёт постепенно; короткие удержания с повторами — McGill S., Strength Cond J 2010;
   32(3):33–46 */
const BEG_HOLD = '20–30 с';
const CTRL_LOAD = 'медленно и под контролем, без рывков, не до предела', BALL_LOAD = 'взрывно, от бёдер, спина ровная; подход заканчивайте, пока мах не замедлился';
/* extra — подходов сверх обычного или меньше (доводка объёма недели, volTopUp): до недели цикла, не меньше 2 и не больше 6 */
function prescribe(ex, week, E, extra = 0) {
  const G = GOALS[S.goal];
  /* схема по типу упражнения (schemeOf): тяжёлая база, махи и многосуставные вне «Силы» дозируются как многосуставные,
     подвижность и стабилизация, прицельные и многосуставные без тяжёлого максимума в «Силе» — как вспомогательные */
  const sch = schemeOf(ex), strongMod = sch === 'mod' && !!G.mod;
  const t = ex.kind || ex.g === 'cardio' ? ex.type : sch === 'heavy' || sch === 'ballistic' || (sch === 'mod' && !strongMod) ? 'c' : 'i';
  let sets = strongMod ? G.mod.sets : G.sets[t];
  if (S.level === 'beg') sets = Math.max(2, sets - 1);
  if (S.level === 'adv' && t === 'c') sets = Math.min(6, sets + 1);
  if (extra) sets = Math.max(2, Math.min(6, sets + extra));
  let reps = sch === 'ctrl' ? ex.doseReps || G.ctrl : sch === 'ballistic' ? G.ball : strongMod ? G.mod.reps : G.reps[t], unit = 'повт.';
  if (ex.kind === 'time') { reps = S.level === 'beg' && ex.g !== 'cardio' ? BEG_HOLD : G.time; unit = ''; }
  if (ex.kind === 'dist') { reps = G.dist; unit = ''; }
  const bodyweight = !ex.eq.length && !(ex.opt || []).length;
  /* процент от 1ПМ — только у тяжёлой базы (schemeOf: heavy): штанга, гантели, тренажёр, блок обеими руками или ногами.
     Для резины, противовеса, собственного веса, гири одной рукой и подвижности — запас повторов без процента:
     подбирается натяжение ленты, противовес, вариант упражнения или вес, с которым держится техника. */
  const pct = sch === 'heavy';
  const band = ex.eq.length && ex.eq.every(g => g.every(id => id === 'band')), assisted = ex.eq.some(g => g.includes('gravitron'));
  const how = band ? 'натяжение ленты: ' : assisted ? 'противовес: ' : weighable(ex, E) ? '' : 'вариант полегче или посложнее: ';
  const easy = band ? 'натяжение ленты: слабее обычного, не до предела' : assisted ? 'противовес: больше обычного, не до предела' : weighable(ex, E) ? 'лёгкий вес, не до предела' : 'вариант полегче, не до предела';
  /* запас повторов — из reserveOf (он же в подсказке первой записи и в описании недели); rir — в дозировку.
     Простое правило — первым, процент от максимума на 1 повтор — в скобках, для тех, кто его знает */
  const rir = reserveOf(week);
  const tail = rir ? reserveDo(rir) + (S.goal === 'gentle' ? ', без боли' : '') : NEAR_LIMIT;
  const withPct = (s, p) => `${s} (${pctText(p)})`;
  const fixed = sch === 'ctrl' ? CTRL_LOAD + (S.goal === 'gentle' ? ', без боли' : '') : sch === 'ballistic' ? BALL_LOAD : '';
  let load = fixed || (pct ? withPct(tail, G.load.c) : sch === 'mod' ? how + tail : !G.rir ? G.load.i : G.load.i ? `${G.load.i}, ${tail}` : tail);
  if (week) {
    const reserve = rir ? reserveDo(rir) : '';
    if (week.deload) { sets = Math.max(2, Math.round(sets * 0.6)); if (!fixed) load = pct ? withPct('лёгкий вес, не до предела', week.pct[S.goal]) : sch === 'mod' ? easy : 'лёгкий вес, не до предела'; }
    else {
      if (week.add && t === 'c') sets = Math.min(6, sets + week.add);
      if (!fixed) load = pct ? withPct(reserve, week.pct[S.goal]) : sch === 'mod' ? how + reserve : reserve;
    }
  }
  if (ex.kind === 'time') load = ex.g === 'cardio' ? (S.goal === 'gentle' ? 'умеренный темп: можно говорить, не задыхаясь' : 'высокий темп без потери техники') : S.goal === 'strength' ? 'с отягощением или в усложнённом варианте' : 'ровно, без потери формы';
  else if (ex.g === 'cardio') load = S.goal === 'gentle' ? 'плавно, в ровном темпе' : 'взрывно и в ровном темпе';
  if (ex.kind === 'dist') load = S.goal === 'strength' ? 'максимально тяжёлые снаряды' : S.goal === 'gentle' ? 'умеренный вес, ровным шагом' : 'тяжёлые снаряды, без остановок';
  const notes = [];
  if (bodyweight && sch === 'mod' && S.goal === 'strength') notes.push('Если диапазон даётся легко, добавьте отягощение или замедлите опускание до 4 с.');
  /* махи гирей — отдых не дольше 2 мин: вес средний, подход короткий */
  const rest = strongMod ? G.mod.rest : sch === 'ballistic' ? Math.min(120, G.rest[t]) : G.rest[t];
  /* время подхода: повтор махов ≈2 с, турецкого подъёма ≈25 с (repSec в каталоге), остальное — по цели */
  const work = ex.kind === 'time' ? midOf(reps) : ex.kind === 'dist' ? 30 : midOf(reps) * (ex.repSec || (sch === 'ballistic' ? 2 : G.rep)) * (ex.uni ? 2 : 1);
  /* темп: у подвижности, махов и кардио его нет (медленно и под контролем; мах и прыжок — одним движением), у многосуставных
     без тяжёлого максимума в «Силе» — без быстрого усилия */
  const tempo = ex.kind || sch === 'ctrl' || sch === 'ballistic' || sch === 'cardio' ? null : strongMod ? '2-0-1-0' : G.tempo;
  const rx = {sets, reps, unit, rest, load, rir, tempo, notes, work, uni:!!ex.uni, scheme:sch};
  return S.format === 'static' && staticOk(ex) ? staticRx(rx, ex, week, E) : rx;
}

/* Порядок, заданный человеком кнопками ↑ ↓ (swaps.__order): список номеров упражнений (slot). Кого в списке нет
   (новое после замены или подбора), остаются на своих местах по правилам после упорядоченных. */
function byOrder(units, order, slotOf) {
  if (!Array.isArray(order) || !order.length) return units;
  const pos = new Map(order.map((s, i) => [s, i])), rank = u => { const r = slotOf(u).map(s => pos.get(s)).filter(v => v !== undefined); return r.length ? Math.min(...r) : Infinity; };
  return units.map((u, i) => [u, rank(u), i]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(x => x[0]);
}

/* круговая без штанги: тот же инвентарь места без неё */
function noBarbell(E) { const o = new Set(E); o.delete('bb'); return o; }
/* снаряды, к которым в круге нужно перейти: скамьи, турник и стойки, тренажёры (EQUIP.cat); свободные веса — под рукой */
const FIXED_EQ = new Set(EQUIP.filter(e => e.cat !== 'free').map(e => e.id)), CIRC_MOVE = 30;
/* подходов упражнения для счёта недели — обычная неделя (без нагрузки, пика и разгрузки), с уступкой по времени; в круговой —
   круги (как в gvol) */
function volSets(ex, E, dose, extra = 0) {
  if (S.format === 'circuit') { const c = GOALS[S.goal].circ; let r = c.rounds + (S.level === 'beg' ? -1 : S.level === 'adv' ? 1 : 0); if (dose && dose.s) r = Math.max(Math.min(2, r), Math.min(DOSE_MAX_ROUNDS, r + dose.s)); return Math.max(2, r); }
  return applyDose(prescribe(ex, null, E, extra), dose).sets;
}
/* Доводка объёма дня недельной программы подходами: прицельным упражнениям и упражнениям на ноги групп, которым до цели
   дня (aim) не хватает подхода, — +1 подход, если ни одна их группа не выйдет выше «много»; упражнениям групп, которые уже
   выше «много», — −1 (не меньше двух). Жимы и тяги верха не трогаются: их баланс подобран по подходам. В классике
   и суперсетах; в круговой одно число кругов на все станции, в статодинамике серии заданы методом. Счёт — по подбору
   до замен, обычной недели: в неделях цикла доводка та же. */
function volTopUp(list, vol, E, dose) {
  const add = list.map(() => 0);
  if (!vol || S.format === 'circuit' || S.format === 'static') return add;
  const sets = (ex, k) => volSets(ex, E, dose, add[k]), share = list.map(groupShare), proj = {...vol.have};
  list.forEach((ex, k) => { for (const [g, x] of Object.entries(share[k])) proj[g] = (proj[g] || 0) + x * sets(ex, k); });
  const free = ex => !sideOf(ex) && !ex.kind && ex.g !== 'cardio';
  list.forEach((ex, k) => {
    if (!free(ex)) return;
    const g = ex.g, s0 = sets(ex, k);
    if ((proj[g] || 0) > vol.hi && s0 > 2) add[k] = -1;
    else if (vol.aim[g] !== undefined && (proj[g] || 0) <= vol.aim[g] - 1 && s0 < 6 && Object.entries(share[k]).every(([h, x]) => (proj[h] || 0) + x <= vol.hi)) add[k] = 1;
    else return;
    const s1 = sets(ex, k);
    for (const [h, x] of Object.entries(share[k])) proj[h] += x * (s1 - s0);
  });
  /* группа всё ещё выше «много» (спину и плечи нагружают и жимы, и тяги) — подход меньше у упражнения, которое нагружает её
     больше всех (не меньше двух подходов, не больше двух снятых); если так тяг стало меньше жимов — подход меньше и у жима */
  const step = (k, d) => { const s0 = sets(list[k], k); add[k] += d; const s1 = sets(list[k], k); for (const [h, x] of Object.entries(share[k])) proj[h] = (proj[h] || 0) + x * (s1 - s0); return s1 !== s0; };
  const sideSets = sd => list.reduce((a, ex, k) => a + (sideOf(ex) === sd ? sets(ex, k) : 0), 0);
  for (let n = 0; n < 8; n++) {
    const g = Object.keys(proj).filter(h => proj[h] > vol.hi).sort((a, b) => proj[b] - proj[a])[0]; if (!g) break;
    const pushes = sideSets('push');
    const k = list.map((ex, i) => i).filter(i => share[i][g] && !list[i].kind && list[i].g !== 'cardio' && add[i] > -2 && sets(list[i], i) > 2 && (pushes || sideOf(list[i]) !== 'pull'))
      .sort((a, b) => share[b][g] - share[a][g] || sets(list[b], b) - sets(list[a], a))[0];
    if (k === undefined || !step(k, -1)) break;
    if (sideOf(list[k]) === 'pull' && sideSets('pull') < sideSets('push')) {
      const p = list.map((ex, i) => i).filter(i => sideOf(list[i]) === 'push' && add[i] > -2 && sets(list[i], i) > 2).sort((a, b) => sets(list[b], b) - sets(list[a], a))[0];
      if (p === undefined) { step(k, 1); break; }
      step(p, -1);
    }
  }
  return add;
}
/* ---------- сборка одной тренировки ----------
   buildPlan (11j-duration.js) — с учётом времени на тренировку: подбирает число упражнений и дозировку и собирает план
   здесь. ctx.dose — уступка по времени: s — подходов (кругов, серий) больше или меньше, r — доля отдыха;
   ctx.fitBase — оценка для подбора по времени: без облегчений (разгрузочная неделя, «облегчить тренировку», мышцы
   восстанавливаются) — они уменьшают уже подобранную тренировку, а не добавляют в неё упражнения */
function buildPlanAt(ctx = {}) {
  /* свой план: упражнения и порядок задал человек; мышцы — только подсказка для подбора */
  const custom = S.mode === 'custom' && !ctx.groups ? customOf() : null;
  /* тренировка на сегодня по журналу: группы уже в S.groups, отсюда — доли групп, отдых и облегчение (13d-muscle-load.js) */
  const lp = !custom && !ctx.groups && S.mode === 'single' ? logPickCtx() : null;
  const base = !!ctx.fitBase, dose = ctx.dose || null;
  const groups = ctx.groups || S.groups, count = custom ? custom.items.length : ctx.count || (lp ? lp.count : S.count), week = base ? null : ctx.week || null;
  const sw = custom ? {} : ctx.swaps || {};
  /* круговая (кроме своего плана) — без штанги: становая, присед и жим штанги «до последнего чистого повтора» с 15 с на
     переход — техника разваливается от усталости, а страховать некому (Марина п. 15). В круг — тренажёры, гантели, гиря,
     лента, вес тела: ACSM, Ratamess et al., MSSE 2009; 41(3):687–708 — круговая для выносливости мышц с лёгкой и средней
     нагрузкой; NSCA Essentials, 2016, гл. 17 — в круговой станции с коротким отдыхом, тяжёлые основные упражнения —
     отдельно и со свежими силами. Румынская тяга в круге — с гантелями */
  const noBar = S.format === 'circuit' && !custom, E = noBar ? noBarbell(effEquip(S.equip)) : effEquip(S.equip);
  const rand = rng((ctx.seed ?? S.seed) * 9973 + count * 31 + groups.length * 7);
  if (custom && !custom.items.length) return {empty:'custom', groups};
  if (!groups.length && !custom) return {empty:'groups'};
  /* программа другого места: подбор под его инвентарь, затем недоступное здесь заменяется аналогами;
     в своём плане так же заменяется то, чего нет в этом месте */
  const ref = custom ? null : programEquip(), PE = ref ? (noBar ? noBarbell(effEquip(ref)) : effEquip(ref)) : E;
  /* подбор дня недельной программы: объём недели и жимы/тяги прошлых дней (buildProgram) */
  const vsets = new Map(), vs = ex => { let n = vsets.get(ex); if (n === undefined) vsets.set(ex, n = volSets(ex, PE, dose)); return n; };
  const wk = ctx.vol ? {weights:ctx.vol.weights, vol:{have:ctx.vol.have, aim:ctx.vol.aim, hi:ctx.vol.hi, sets:vs}, pp:ctx.pp} : ctx.pp ? {pp:ctx.pp} : null;
  let picked = custom ? custom.items.map(it => EXI[it.id]) : pickExercises(PE, rand, groups, count, ctx.avoid, {...(lp || wk || {}), sets:vs}).picked;
  /* «можно здесь»: есть инвентарь, и упражнение не нагружает суставы, которые бережём (11g-gentle.js) */
  const usable = ex => available(ex, E) && fitsBody(ex);
  const pool = EX.filter(usable);
  const subs = new Map(), lost = [];
  let slots = picked.map((_, i) => i);
  if (ref || custom) {
    const lvlMax = custom ? 3 : S.level === 'beg' ? 2 : 3, used = new Set(picked.filter(usable).map(ex => ex.id));
    const keep = [], ok = S.format === 'static' ? b => staticOk(b) && swapFits(b) : swapFits;
    picked = picked.map((ex, i) => {
      if (usable(ex)) { keep.push(i); return ex; }
      const alt = analogsFor(ex, E, {exclude:used, lvlMax, limit:1, ok})[0];
      if (!alt) { lost.push(ex); return null; }
      const why = available(ex, E) ? unfitWhy(ex) : '';
      used.add(alt.ex.id); subs.set(alt.ex, {from:ex, note:[why, alt.note].filter(Boolean).join(' · ')}); keep.push(i); return alt.ex;
    }).filter(Boolean);
    slots = keep;
  }
  /* подбор до замен: по нему неделя обходит повторы (buildProgram), и замена в одном дне не меняет другие дни */
  const picks = picked.map(ex => ex.id);
  /* доводка объёма недели подходами — по номеру упражнения (после замены та же) */
  const extra = !custom && ctx.vol ? volTopUp(picked, ctx.vol, PE, dose) : picked.map(() => 0);
  /* замены записаны по номеру упражнения (slot): в программе другого места часть упражнений может не войти в план */
  for (const [i, id] of Object.entries(sw)) {
    const ex = EXI[id], k = slots.indexOf(+i);
    if (k >= 0 && picked[k] && ex && usable(ex) && !picked.includes(ex)) picked[k] = ex;
  }
  if (!picked.length) return {empty:'none', pool, groups, lost};
  const G = GOALS[S.goal];
  const items = picked.map((ex, k) => {
    const slot = slots[k], dosed = applyDose(prescribe(ex, week, E, extra[k]), dose), rx = base ? dosed : applyLight(dosed, ex);
    if (lp && lp.light.has(ex.g) && !base) easeRx(rx);
    return {ex, slot, rx:custom ? customRx(rx, custom.items[slot], ex) : rx, name:exName(ex, E), eqLine:equipLine(ex, E), eqIds:chosenEquip(ex, E), has:propHas(ex, E), sub:subs.get(ex) || null};
  });
  const bySlot = new Map(items.map(it => [it.ex, it]));
  let blocks = [], minutes = 0, totalSets = 0;
  if (S.format === 'classic' || S.format === 'static') {
    const ord = byOrder((custom ? picked : orderClassic(picked)).map(ex => bySlot.get(ex)), custom ? null : ctx.order, it => [it.slot]);
    ord.forEach((it, i) => { it.label = String(i + 1); });
    blocks = [{kind:'list', items:ord}];
    for (const it of ord) { minutes += it.rx.static ? staticSeconds(it.rx) : it.rx.sets * (it.rx.work + it.rx.rest) + 60; totalSets += it.rx.sets; }
  } else if (S.format === 'superset') {
    /* в своём плане пары — соседние упражнения по порядку человека */
    const pairs = custom ? picked.reduce((a, ex, i) => (i % 2 ? a[a.length - 1].push(ex) : a.push([ex]), a), []) : byOrder(pairSupersets(picked), ctx.order, pr => pr.map(ex => bySlot.get(ex).slot));
    pairs.forEach((pr, pi) => {
      const L = String.fromCharCode(65 + pi);
      const its = pr.map((ex, j) => { const it = bySlot.get(ex); it.label = pr.length > 1 ? L + (j + 1) : L; return it; });
      const sets = Math.max(...its.map(it => it.rx.sets));
      const rest = pr.length > 1 ? doseRest(G.ss.rest, dose) : its[0].rx.rest;
      its.forEach(it => { it.rx.sets = sets; it.rx.restShown = pr.length > 1 ? (it === its[its.length - 1] ? rest : 0) : rest; });
      blocks.push({kind:'pair', letter:L, items:its, sets, rest});
      minutes += sets * (its.reduce((a, it) => a + it.rx.work, 0) + 15 + rest) + 60;
      totalSets += sets * its.length;
    });
  } else {
    const ord = byOrder((custom ? picked : orderCircuit(picked)).map(ex => bySlot.get(ex)), custom ? null : ctx.order, it => [it.slot]);
    const c = dose ? {...G.circ, rest:doseRest(G.circ.rest, dose), roundRest:doseRest(G.circ.roundRest, dose)} : {...G.circ};
    /* переход между станциями — реалистичный: если в круге есть тренажёр, блок, скамья или турник, до них нужно дойти
       и выставить вес — не меньше 30 с (Alcaraz P.E. et al., J Strength Cond Res 2011; 25(9):2519–2527: круговая на
       тренажёрах и свободных весах — 35 с между станциями); гантели, гиря, лента, вес тела — под рукой, по цели */
    if (ord.some(it => it.eqIds.some(id => FIXED_EQ.has(id)))) c.rest = Math.max(c.rest, CIRC_MOVE);
    let rounds = c.rounds + (S.level === 'beg' ? -1 : S.level === 'adv' ? 1 : 0);
    /* время на тренировку: кругов больше или меньше (не меньше двух и не больше шести) */
    if (dose && dose.s) rounds = Math.max(Math.min(2, rounds), Math.min(DOSE_MAX_ROUNDS, rounds + dose.s));
    if (week && week.deload) rounds -= 1;
    else if (week && week.add) rounds += 0;
    rounds = Math.max(2, rounds);
    if (AR.light && S.mode !== 'program' && !base) rounds = Math.max(1, Math.round(rounds * .6));
    ord.forEach((it, i) => {
      it.label = String(i + 1);
      it.rounds = rounds;
      /* подвижность и стабилизация в круге — со своими повторами (ролик для пресса — не 15–20) */
      if (!it.ex.kind && it.rx.scheme !== 'ctrl' && !(custom && custom.items[it.slot]?.reps)) it.rx.reps = c.reps;
      it.rx.circ = true;
      it.rx.work = it.ex.kind === 'time' ? c.work : it.ex.kind === 'dist' ? 30 : midOf(it.rx.reps) * (it.ex.repSec || G.rep) * (it.ex.uni ? 2 : 1);
    });
    blocks = [{kind:'circuit', items:ord, rounds, rest:c.rest, roundRest:c.roundRest}];
    minutes = rounds * (ord.reduce((a, it) => a + it.rx.work, 0) + c.rest * (ord.length - 1)) + (rounds - 1) * c.roundRest;
    totalSets = rounds * ord.length;
  }
  const missing = groups.filter(g => !pool.some(ex => groupsOf(ex).has(g)));
  const load = {}, gvol = {}, gvolBase = {};
  for (const it of items) {
    const k = S.format === 'circuit' ? blocks[0].rounds : it.rx.sets;
    for (const m of it.ex.pri) load[m] = (load[m] || 0) + k;
    for (const m of it.ex.sec) load[m] = (load[m] || 0) + k * 0.5;
    /* дробный учёт: целевая группа — полный подход, остальные работающие — половина */
    for (const [g, x] of Object.entries(groupShare(it.ex))) gvol[g] = (gvol[g] || 0) + k * x;
  }
  /* объём подбора до замен, обычной недели (без нагрузки, пика и разгрузки): по нему следующие дни программы добирают
     объём — упражнения не меняются ни от недели к неделе, ни от замены в другом дне */
  const ppBase = {push:0, pull:0};
  for (const [k, id] of picks.entries()) {
    const ex = EXI[id], kb = volSets(ex, E, dose, extra[k]), sd = sideOf(ex);
    for (const [g, x] of Object.entries(groupShare(ex))) gvolBase[g] = (gvolBase[g] || 0) + kb * x;
    if (sd) ppBase[sd] += kb;
  }
  return {blocks, items, minutes:Math.round(minutes / 60), totalSets, missing:custom ? [] : missing, load, gvol, gvolBase, ppBase, pool, E, groups, count, lost, custom:!!custom, byLog:!!lp, picks};
}

/* ---------- сборка недели ---------- */
function buildProgram() {
  const days = S.days, split = splitFor(days);
  const tmpl = SPLITS[split].days[days];
  const week = WEEKS[S.week - 1];
  const avoid = new Set();
  const seen = {};
  /* день «всё тело» включает мышцу акцента, даже если по шаблону её группы в этот день нет */
  const fg = S.focus && MUSCLE_GROUP[S.focus];
  const dayGroups = tid => DAY_T[tid].name === 'Всё тело' && fg && !DAY_T[tid].g.includes(fg) ? DAY_T[tid].g.concat(fg) : DAY_T[tid].g;
  /* Объём недели попадает в шкалу «мало / в норме / много» по уровню (volScale; Alex п. 25: в своей же программе «Спина 28
     и Плечи 25,5 — много, Икры 1,5 — мало»). Цель группы на неделю — 40% коридора от нижней границы; каждый день
     добирает свою долю того, что осталось до цели, поровну на оставшиеся дни с этой группой; доли групп дня — корень из веса
     группы (GROUP_W: крупные мышцы получают и вспомогательную работу) × недобор к средней доле. Выше «много» — штраф в подборе (в том числе за вспомогательную работу: жимы
     нагружают плечи и трицепс, тяги — плечи и бицепс). Счёт — по обычной неделе с уступкой по времени (gvolBase):
     в неделях нагрузки и пика упражнения те же. */
  const sc = volScale(), aim = sc.lo + (sc.hi - sc.lo) * 0.4, have = {}, pp = {push:0, pull:0};
  /* в днях «всё тело» подбор идёт по всем группам этих дней, а группы шаблона дня — с упором: иначе икры (только в дне В)
     или бицепс (только в дне А) набирали бы недельный объём за одну тренировку */
  const fullT = t => DAY_T[t].name === 'Всё тело', fullAll = [...new Set(tmpl.filter(fullT).flatMap(dayGroups))];
  const pickGroups = t => fullT(t) ? dayGroups(t).concat(fullAll.filter(x => !dayGroups(t).includes(x))) : dayGroups(t);
  const out = tmpl.map((tid, i) => {
    seen[tid] = (seen[tid] || 0) + 1;
    const own = dayGroups(tid), g = pickGroups(tid);
    const share = {};
    for (const x of g) { const left = tmpl.slice(i).filter(t => pickGroups(t).includes(x)).length || 1; share[x] = Math.max(0, aim - (have[x] || 0)) / left; }
    const avg = g.reduce((a, x) => a + share[x], 0) / (g.length || 1) || 1;
    const weights = Object.fromEntries(g.map(x => [x, Math.sqrt(GROUP_W[x] || 1) * (own.includes(x) ? 1 : 0.8) * Math.min(2.5, Math.max(0.15, share[x] / avg))]));
    /* время на тренировку задано — число упражнений каждого дня подбирается под него (11j-duration.js) */
    const aimDay = Object.fromEntries(g.map(x => [x, (have[x] || 0) + share[x]]));
    const p = buildPlan({groups:g, count:durationOf() ? undefined : S.count, seed:S.seed * 131 + i * 977 + 13, avoid:new Set(avoid), week, swaps:swaps['d' + i] || {}, order:swaps.__order?.['d' + i],
      vol:{have:{...have}, aim:aimDay, hi:sc.hi, weights}, pp:{...pp}});
    /* следующие дни обходят и подобранное, и поставленное заменой: замена в одном дне не меняет остальные */
    if (p.items) {
      p.items.forEach(it => avoid.add(it.ex.id)); p.picks.forEach(id => avoid.add(id));
      for (const [x, v] of Object.entries(p.gvolBase)) have[x] = (have[x] || 0) + v;
      pp.push += p.ppBase.push; pp.pull += p.ppBase.pull;
    }
    return {tid, i, wd:SCHEDULE[days][i], plan:p};
  });
  for (const d of out) {
    const same = tmpl.filter(t => t === d.tid).length;
    const k = tmpl.slice(0, d.i + 1).filter(t => t === d.tid).length;
    const letters = DAY_T[d.tid].name === 'Всё тело' ? 'АБВГ' : 'АБ';
    const isFull = DAY_T[d.tid].name === 'Всё тело';
    const fullIdx = isFull ? tmpl.slice(0, d.i + 1).filter(t => DAY_T[t].name === 'Всё тело').length : 0;
    const fullTotal = tmpl.filter(t => DAY_T[t].name === 'Всё тело').length;
    d.li = isFull ? (fullTotal > 1 ? fullIdx : 0) : (same > 1 ? k : 0); /* номер буквы дня — для ключа имени сохранённого плана (11a-names.js) */
    d.name = DAY_T[d.tid].name + (d.li ? ' ' + letters[d.li - 1] : '');
  }
  const gvol = {}, load = {};
  let minutes = 0, sets = 0;
  for (const d of out) {
    if (!d.plan.items) continue;
    minutes += d.plan.minutes; sets += d.plan.totalSets;
    for (const [g, v] of Object.entries(d.plan.gvol)) gvol[g] = (gvol[g] || 0) + v;
    for (const [m, v] of Object.entries(d.plan.load)) load[m] = (load[m] || 0) + v;
  }
  return {days:out, split, week, gvol, load, minutes, sets};
}

/* ---------- отрисовка ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const ICON = {
  swap:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7h10l-3-3M16 13H6l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dice:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="7.2" cy="7.2" r="1.3" fill="currentColor"/><circle cx="12.8" cy="12.8" r="1.3" fill="currentColor"/><circle cx="10" cy="10" r="1.3" fill="currentColor"/></svg>',
  copy:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  loop:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 8.5A6 6 0 1 0 15 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 3.5v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chart:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 16h14M5 13l3.5-4 3 2.5L16 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cal:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 8h14M7 2.5v3M13 2.5v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  save:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h8l3 3v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 3v4h6V3M7 17v-5h6v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  share:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13V3M6.5 6.5 10 3l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v6h10v-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  load:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10M6.5 9.5 10 13l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v4h10v-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function renderSetup() {
  const seg = (name, dict, cur) => Object.entries(dict).map(([k, v]) =>
    `<button type="button" class="seg-b${k === cur ? ' on' : ''}" data-set="${name}" data-v="${k}" aria-pressed="${k === cur}"><b>${v.name}</b>${v.hint ? `<small>${v.hint}</small>` : ''}</button>`).join('');
  const prog = S.mode === 'program', custom = S.mode === 'custom';
  $('#views').innerHTML = viewTabs();
  const jv = S.view === 'journal' || S.view === 'atlas';
  $('.setup').hidden = jv; $('.layout').classList.toggle('solo', jv);
  renderSetupFold();
  $('#f-mode').innerHTML = seg('mode', MODES, S.mode);
  $('#f-prog').hidden = !prog;
  $('#f-custom').hidden = !custom;
  if (custom) $('#f-custom-body').innerHTML = customSetupHtml();
  $('#f-muscles').hidden = prog;
  $('#g-note').hidden = !custom;
  $('#count-l').closest('.field').hidden = custom;
  $('#count-l').textContent = prog ? 'Упражнений в тренировке' : 'Упражнений';
  if (prog) {
    $('#f-days').innerHTML = [2, 3, 4, 5].map(d => `<button type="button" class="seg-b${d === S.days ? ' on' : ''}" data-days="${d}" aria-pressed="${d === S.days}"><b>${d}</b><small>${SCHEDULE[d].map(i => WD[i]).join(' ')}</small></button>`).join('');
    const sp = splitFor(S.days);
    const opts = Object.entries(SPLITS).filter(([, v]) => v.days[S.days]);
    $('#f-split').style.setProperty('--seg-n', opts.length); /* столбцов — по числу сплитов; при крупном тексте меньше (39-big-text.css) */
    $('#f-split').innerHTML = opts.map(([k, v]) => `<button type="button" class="seg-b${k === sp ? ' on' : ''}" data-split="${k}" aria-pressed="${k === sp}"><b>${v.name}</b><small>${v.hint}</small></button>`).join('');
    $('#split-note').textContent = SPLITS[sp].note;
  }
  $('#f-goal').innerHTML = seg('goal', GOALS, S.goal);
  $('#goal-note').textContent = GOALS[S.goal].about;
  $('#f-format').innerHTML = seg('format', FORMATS, S.format);
  $('#f-level').innerHTML = seg('level', LEVELS, S.level);
  renderProtect();
  /* время на тренировку (11j-duration.js): в своём плане упражнения и подходы задал человек — поля нет */
  $('#f-dur').hidden = custom;
  const dur = S.dur || '';
  $('#f-dur-seg').innerHTML = Object.entries(DURATIONS).concat([['', {name:'Не задано'}]]).map(([k, v]) =>
    `<button type="button" class="seg-b${k === dur ? ' on' : ''}" data-dur="${k}" aria-pressed="${k === dur}"><b>${v.name}</b>${v.hint ? `<small>${v.hint}</small>` : ''}</button>`).join('');
  renderCount();
  const gs = new Set(S.groups);
  $('#g-presets').innerHTML = GROUP_PRESETS.map(p => {
    const on = p.g.length === gs.size && p.g.every(g => gs.has(g));
    return `<button type="button" class="pre${on ? ' on' : ''}" data-gp="${p.id}">${p.name}</button>`;
  }).join('') + logPresetHtml();
  const lpMsg = $('#lp-msg'); if (lpMsg) lpMsg.hidden = true;
  $('#g-chips').innerHTML = GROUPS.map(g => `<button type="button" class="chip${gs.has(g.id) ? ' on' : ''}" data-g="${g.id}" aria-pressed="${gs.has(g.id)}">${ICON.check}<span>${g.name}</span></button>`).join('');
  const cur = placeOf();
  $('#e-places').innerHTML = S.places.map(p => `<button type="button" class="place${p.id === S.place ? ' on' : ''}" data-place="${p.id}" aria-pressed="${p.id === S.place}"><b>${esc(p.name)}</b><small>${p.equip.length ? p.equip.length + ' ' + plural(p.equip.length, 'снаряд', 'снаряда', 'снарядов') : 'без снаряжения'}</small></button>`).join('')
    + `<button type="button" class="place place-add" data-place-add="1">+ Место</button>`;
  const others = S.places.filter(p => p.id !== S.place);
  $('#e-place-tools').innerHTML = `<label class="place-name">Название<input id="place-name" type="text" maxlength="24" value="${esc(cur.name)}" autocomplete="off"></label>`
    + (S.places.length > 1 ? `<button type="button" class="place-del${placeDel ? ' armed' : ''}" data-place-del="1">${placeDel ? 'Точно удалить?' : 'Удалить место'}</button>` : '')
    + (others.length ? `<label class="place-adapt">Программа<select id="place-adapt"><option value="">Своя для этого места</option>${others.map(p => `<option value="${p.id}"${S.adapt === p.id ? ' selected' : ''}>Как в «${esc(p.name)}», с заменами</option>`).join('')}</select></label>
      <p class="f-note">${S.adapt ? `Упражнения подобраны под «${esc(placeOf(S, S.adapt).name)}»; то, чего здесь нет, заменено ближайшим аналогом — по тому же движению и тем же мышцам.` : 'Программа собирается из того, что есть в этом месте.'}</p>` : '');
  const es = new Set(S.equip);
  $('#e-presets').innerHTML = '<span class="pres-l">Заполнить:</span>' + EQUIP_PRESETS.map(p => {
    const on = p.eq.length === es.size && p.eq.every(e => es.has(e));
    return `<button type="button" class="pre${on ? ' on' : ''}" data-ep="${p.id}">${p.name}</button>`;
  }).join('');
  $('#e-chips').innerHTML = EQUIP_CATS.map(c => `<div class="e-cat"><h3>${c.name}</h3><div class="chips">${EQUIP.filter(e => e.cat === c.id).map(e =>
    `<button type="button" class="chip${es.has(e.id) ? ' on' : ''}" data-e="${e.id}" aria-pressed="${es.has(e.id)}"${e.hint ? ` title="${esc(e.hint)}"` : ''}>${ICON.check}<span>${e.name}</span></button>`).join('')}</div></div>`).join('');
  $('#e-count').textContent = es.size ? `${es.size} из ${EQUIP.length}` : 'только вес тела';
  /* список оборудования сворачивается всегда — и для своего набора, не совпадающего с заготовкой;
     кнопка вверху видна без прокрутки, внизу раскрытого списка — ещё одна «Свернуть» */
  const open = eqOpen, names = EQUIP.filter(e => es.has(e.id)).map(e => e.name);
  $('#e-chips').hidden = !open;
  $('#e-sum').hidden = open;
  $('#e-sum').textContent = es.size === EQUIP.length ? 'Всё оборудование зала.' : !names.length ? 'Только вес тела.'
    : names.length > 10 ? names.slice(0, 10).join(', ') + ` и ещё ${names.length - 10}.` : names.join(', ') + '.';
  $('#e-toggle').hidden = !open;
  $('#e-toggle-top').textContent = open ? 'Свернуть' : 'Изменить список';
  for (const b of [$('#e-toggle'), $('#e-toggle-top')]) b.setAttribute('aria-expanded', String(open));
}

/* «Упражнений»: при заданном времени — сколько подобрано (после сборки плана число уточняется), «−» и «+» задают своё
   число вместо времени */
function renderCount() {
  const n = shownCount(), D = durationOf();
  $('#count-v').textContent = n;
  $('#count-minus').disabled = n <= 3; $('#count-plus').disabled = n >= 10;
  $('#count-hint').textContent = D ? `подобрано под ${D.say}; «−» и «+» — своё число` : 'от 3 до 10 в одной тренировке';
}

function titleFor() {
  if (S.mode === 'custom') return customOf().name;
  return groupsTitle(S.groups);
}
/* название тренировки по группам мышц: заготовка («Верх тела») или список («Грудь, спина и плечи»); оно же — имя плана,
   сохранённого из тренировки (ключ groups:…, 11a-names.js) */
const GROUPS_AND = ' и ';
function groupsTitle(groups) {
  const gs = new Set(groups);
  const p = GROUP_PRESETS.find(p => p.g.length === gs.size && p.g.every(g => gs.has(g)));
  if (p) return p.id === 'full' ? 'Всё тело' : p.id === 'legs' ? 'Ноги и ягодицы' : p.id === 'push' ? 'Грудь, плечи, трицепс' : p.id === 'pull' ? 'Спина, бицепс, хват' : 'Верх тела';
  const names = groups.map(g => GN[g].toLowerCase());
  const s = names.length > 1 ? names.slice(0, -1).join(', ') + GROUPS_AND + names[names.length - 1] : names[0] || '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function loadBars(load) {
  const rows = Object.entries(load).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = rows.length ? rows[0][1] : 1;
  return rows.map(([m, v]) => `<li><span class="lb-n">${MUSCLE_NAMES[m]}</span><span class="lb-t"><i style="width:${Math.max(6, v / max * 100).toFixed(0)}%"></i></span><span class="lb-v">${fmtNum(v)}</span></li>`).join('');
}
/* недельный объём по группам с ориентиром 10–20 подходов */
/* Группы, которых нет ни в одном дне программы (предплечья во «Всё тело»), работают попутно: у них нет оценки «мало» —
   программа их и не нагружает, а «много» показывается и им */
function volBars(gvol, groups) {
  const ids = GROUPS.map(g => g.id).filter(g => g !== 'cardio' && (groups.has(g) || (gvol[g] || 0) >= 1));
  const max = Math.max(volScale().hi + 2, ...ids.map(g => gvol[g] || 0));
  return ids.map(g => volRow(g, gvol[g] || 0, max, '', '', groups.has(g))).join('');
}
/* строка полосы «подходов на группу»: коридор по уровню (volScale), «мало / в норме / много», не цель программы —
   «попутно»; extra — добавка под полосой (статус восстановления в журнале, 13d-muscle-load.js) */
function volRow(g, val, max, extra = '', cls = '', target = true) {
  const pct = v => (v / max * 100).toFixed(1), sc = volScale();
  const v = Math.round(val * 2) / 2;
  const st = v > sc.hi ? 'hi' : !target ? 'side' : v < sc.lo ? 'lo' : 'ok';
  const lab = st === 'lo' ? 'мало' : st === 'hi' ? 'много' : st === 'side' ? 'попутно' : 'в норме';
  return `<li class="${st}${cls ? ' ' + cls : ''}"${cls ? ` data-lg="${g}"` : ''}><span class="vb-n">${GN[g]}</span><span class="vb-v">${fmtNum(v)}<em>${lab}</em></span><span class="vb-t"><b style="left:${pct(sc.lo)}%;width:${pct(sc.hi - sc.lo)}%"></b><i style="width:${Math.max(1.5, +pct(v))}%"></i></span>${extra}</li>`;
}
/* «Полоса — ориентир …: 10–20 подходов в неделю» — по уровню; новичку и в «Бережно» — с пояснением */
function volScaleText() {
  const sc = volScale(), low = sc.lo < 10;
  return 'Полоса — ориентир для роста мышц: {lo}–{hi} подходов в неделю.'.replace('{lo}', sc.lo).replace('{hi}', sc.hi)
    + (!low ? '' : S.goal === 'gentle' ? ' В бережном режиме ориентир ниже, чем для тех, кто уже тренируется: 2–4 подхода на группу 2–3 раза в неделю.'
      : ' Новичку ориентир ниже, чем тем, кто уже тренируется: 2–4 подхода на группу 2–3 раза в неделю.');
}

/* вес по плану (свой план или план тренера) — рядом с подходами */
function rxKgHtml(it) {
  const r = it.rx; if (!r.kgPlan || typeof loadType !== 'function') return '';
  const lt = loadType(it.ex); if (lt === 'none') return '';
  return `<span class="rx-kg">${lt === 'assist' ? 'противовес ' : lt === 'extra' ? '+' : ''}${planKgText(r.kgPlan)} ${wUnit()}</span>`;
}
function rxHtml(it) {
  const r = it.rx;
  const unit = r.unit ? ` <small>${r.unit}</small>` : '';
  const side = r.uni ? '<small> на сторону</small>' : '';
  if (r.static) return `<div class="rx"><span class="rx-big">${r.series} × 3 × ${r.reps}${unit}${side}</span><span class="rx-rest">${r.series} ${plural(r.series, 'серия', 'серии', 'серий')} по 3 подхода · отдых ${fmtRest(r.rest)}${r.series > 1 ? `, между сериями ${fmtRest(r.seriesRest)}` : ''}</span>${rxKgHtml(it)}${r.light ? '<span class="rx-light">облегчено</span>' : ''}${easedTag(r)}</div>`;
  if (r.circ) return `<div class="rx"><span class="rx-big">${r.reps}${unit}${side}</span>${rxKgHtml(it)}</div>`;
  const rest = r.restShown !== undefined ? (r.restShown ? `отдых ${fmtRest(r.restShown)}` : 'сразу к следующему') : `отдых ${fmtRest(r.rest)}`;
  return `<div class="rx"><span class="rx-big">${r.sets} × ${r.reps}${unit}${side}</span><span class="rx-rest">${rest}</span>${rxKgHtml(it)}${r.light ? '<span class="rx-light">облегчено</span>' : ''}${easedTag(r)}</div>`;
}

/* суставы под пиковой нагрузкой — короткая строка в карточке. Пояснение раскрывается нажатием на строку (касанием и
   с клавиатуры, а не только в подсказке мыши): тот же текст, что в панели «Нагрузка на суставы» внизу разбора движения */
const PEAK_OPEN = new Set();
function jointsLine(ex, idx) {
  const zones = typeof stressZones === 'function' ? stressZones(ex) : [];
  if (!zones.length) return '';
  const on = typeof motionPrefs === 'undefined' || motionPrefs.stress !== false, open = PEAK_OPEN.has(ex.id);
  const rules = typeof jointStress === 'function' ? jointStress(ex).rules : [];
  const lead = document.querySelector('#mv-stress-panel .stress-explanation')?.textContent || 'Красная метка на манекене — момент пиковой нагрузки на сустав, связки или сухожилие. Это напоминание держать технику, а не запрет.';
  return `<div class="c-joints"${on ? '' : ' hidden'}><button type="button" class="c-joints-b" data-peak="${ex.id}" aria-expanded="${open}" aria-controls="peak-${idx}"><span class="stress-dot" aria-hidden="true"></span><span>Пиковая нагрузка: ${esc(zones.join(', '))}</span><i class="cg-chev" aria-hidden="true"></i></button>`
    + `<div class="c-joints-x" id="peak-${idx}"${open ? '' : ' hidden'}><p class="stress-explanation">${esc(lead)}</p><ul class="stress-list">${rules.map(r => `<li><span class="stress-dot" aria-hidden="true"></span><span><b>${esc(r.zone)}.</b> ${esc(r.what)} <em>${esc(r.tip)}</em></span></li>`).join('')}</ul></div></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-peak]'); if (!b) return;
  const open = b.getAttribute('aria-expanded') !== 'true', box = document.getElementById(b.getAttribute('aria-controls'));
  b.setAttribute('aria-expanded', String(open)); if (box) box.hidden = !open;
  if (open) PEAK_OPEN.add(b.dataset.peak); else PEAK_OPEN.delete(b.dataset.peak);
});
function cardHtml(it, idx) {
  const ex = it.ex, r = it.rx;
  const lvl = {};
  for (const m of ex.pri) lvl[m] = 1;
  for (const m of ex.sec) if (!lvl[m]) lvl[m] = 0.38;
  const mus = ex.pri.map(m => `<li class="p">${MUSCLE_NAMES[m]}</li>`).join('') + ex.sec.map(m => `<li class="s">${MUSCLE_NAMES[m]}</li>`).join('');
  /* темп — словами (запись числами — в подсказке, опытным), за ним нагрузка — как и раньше, в одной строке */
  const meta = [];
  if (r.tempo) meta.push(`<span title="${esc(r.tempo)}: опускание – пауза – подъём – пауза, секунды; X — быстро">темп: ${tempoWords(r.tempo)}</span>`);
  if (r.load) meta.push(`<span>${r.load}</span>`);
  /* «изометрия» в фитнесе — статика (замечание тестера): подпись — объёмный вид */
  const view = '3D-вид · 5 ракурсов';
  return `<li class="card${cardFoldClass(ex.id)}" data-ex="${ex.id}" data-slot="${it.slot}">
  <div class="c-top">
    <div class="motion-tile"><button type="button" class="illus" data-fig="${idx}" aria-haspopup="dialog" aria-controls="motion-view" aria-label="Увеличить: ${esc(it.name)}, разбор движения — ${view}"><span class="illus-v">${view}</span><span class="illus-zoom" aria-hidden="true">Увеличить ↗</span></button><div class="motion-bar"><span class="motion-caption">Исходное положение</span><button type="button" data-motion-pause="${idx}" aria-label="Пауза: ${esc(it.name)}">Пауза</button></div></div>
    <div class="c-info">
      <div class="c-head"><span class="c-idx">${it.label}</span><span class="c-type">${ex.type === 'c' ? 'много мышц' : 'прицельное'}</span>${favButton(ex.id)}</div>
      <h3 class="c-name">${esc(it.name)}</h3>
      <p class="c-eq">${esc(it.eqLine)}</p>
      ${it.sub ? `<p class="c-sub"><b>Вместо: ${esc(exName(it.sub.from, effEquip(programEquip() || S.equip)))}</b>${it.sub.note ? ` · ${esc(it.sub.note)}` : ''}</p>` : ''}
      ${rxHtml(it)}
      ${meta.length ? `<p class="c-meta">${meta.join('<i>·</i>')}</p>` : ''}
      ${r.coachNote ? `<p class="c-note"><b>Заметка:</b> ${esc(r.coachNote)}</p>` : ''}
    </div>
  </div>
  ${variantRowHtml(it)}
  <div class="c-mus">
    ${musFoldHead(ex)}
    <div class="c-map">${muscleMapSvg(lvl, {aria:'Работающие мышцы: ' + ex.pri.map(m => MUSCLE_NAMES[m]).join(', ')})}</div>
    <ul class="mus">${mus}</ul>
  </div>
  ${jointsLine(ex, idx)}
  ${logBlock(it)}
  <div class="c-hist" hidden></div>
  <div class="c-warm">${warmupHtml(it, workWeightOf(it, null))}</div>
  <div class="c-prog">${progressionHint(it)}</div>
  <div class="c-act">
    <button type="button" class="btn-ghost" data-workout="${ex.id}" aria-haspopup="dialog" aria-controls="workout-view">Начать тренировку<span class="vh">: ${esc(it.name)}</span> <span aria-hidden="true">→</span></button>
    <span class="c-act-r">${S.mode === 'custom' ? '' : moveButtons(it)}<button type="button" class="btn-ghost" data-swap="${it.slot}" aria-expanded="false" aria-controls="sw-pick-${it.slot}">${ICON.swap}<span>Заменить</span><span class="vh">: ${esc(it.name)}</span></button></span>
    <div class="cp-pick sw-pick" id="sw-pick-${it.slot}" role="group" aria-labelledby="sw-pick-${it.slot}-h" hidden></div>
    ${swapDoneHtml(it)}
  </div>
  ${S.mode === 'custom' ? customToolsHtml(it) : ''}
  <details class="tech">
    <summary>Техника выполнения</summary>
    <ol class="t-steps">${ex.tech.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <div class="t-cols">
      <div><h4>Частые ошибки</h4><ul class="t-err">${ex.err.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
      <div><h4>Дыхание</h4><p>${esc(ex.breath)}</p>${ex.note ? `<h4>Важно</h4><p>${esc(ex.note)}</p>` : ''}${r.notes.map(n => `<p class="t-tip">${esc(n)}</p>`).join('')}</div>
    </div>
  </details>
</li>`;
}

/* единицы порядка плана: упражнение (классика, круг) или пара суперсета — их и двигают кнопки ↑ ↓ */
function planUnits(p) { return p.blocks.flatMap(b => b.kind === 'pair' ? [b.items.map(it => it.slot)] : b.items.map(it => [it.slot])); }
let MOVE_UNITS = [];
function moveButtons(it) {
  const n = MOVE_UNITS.length, i = MOVE_UNITS.findIndex(u => u.includes(it.slot));
  if (n < 2 || i < 0) return '';
  const pair = MOVE_UNITS[i].length > 1, up = pair ? 'Пару выше' : 'Упражнение выше', down = pair ? 'Пару ниже' : 'Упражнение ниже';
  return `<span class="c-move" role="group" aria-label="Порядок в тренировке"><button type="button" class="btn-ghost" data-move="${it.slot}" data-d="-1" aria-label="${up}" title="${up}"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" class="btn-ghost" data-move="${it.slot}" data-d="1" aria-label="${down}" title="${down}"${i === n - 1 ? ' disabled' : ''}>↓</button></span>`;
}
/* сдвиг упражнения (или пары) на одно место: новый порядок — в swaps.__order того же ключа, что и замены */
function movePlanItem(slot, d) {
  const units = planUnits(plan), i = units.findIndex(u => u.includes(slot)), j = i + d;
  if (i < 0 || j < 0 || j >= units.length) return false;
  [units[i], units[j]] = [units[j], units[i]];
  swaps.__order = swaps.__order || {}; swaps.__order[swapKey()] = units.flat();
  return true;
}
function blocksHtml(p) {
  MOVE_UNITS = S.mode === 'custom' ? [] : planUnits(p);
  let html = `<p class="phase"><b>Разминка, 8–10 мин.</b> Лёгкое кардио до тёплого пота, суставная гимнастика, затем 1–2 разминочных подхода с лёгким весом в первом упражнении.</p>`;
  html += cardsViewHtml();
  if (S.format === 'static') html += `<p class="phase phase-static"><b>Статодинамика.</b> Вес — около половины от максимума на 1 повтор. Медленно: 3 с вниз и 3 с вверх, без пауз; не выпрямляйтесь до конца и не расслабляйтесь внизу — мышца всё время напряжена. К концу подхода (30–40 с) мышца сильно горит, но повторы ещё получаются. Три подхода с отдыхом 30 с — одна серия.</p>`;
  let idx = 0;
  /* «Убрано: … Вернуть» — на месте убранной карточки своего плана (12c-swap.js) */
  let gone = rmGoneHtml();
  const card = it => { let pre = ''; if (gone && it.slot >= planUndo.slot) { pre = gone; gone = ''; } return pre + cardHtml(it, idx++); };
  for (const b of p.blocks) {
    if (b.kind === 'list') {
      html += `<ol class="cards">${b.items.map(card).join('')}</ol>`;
    } else if (b.kind === 'pair') {
      const many = b.items.length > 1;
      html += `<section class="block">
        <header class="b-head"><h2><span class="b-letter">${b.letter}</span>${many ? 'Суперсет' : 'Отдельное упражнение'}</h2>
        <p>${many ? `${b.sets} ${plural(b.sets, 'круг', 'круга', 'кругов')}: ${b.items.map(it => it.label).join(' → ')} без паузы, затем отдых ${fmtRest(b.rest)}` : `${b.sets} ${plural(b.sets, 'подход', 'подхода', 'подходов')}, отдых ${fmtRest(b.rest)}`}</p></header>
        <ol class="cards">${b.items.map(card).join('')}</ol></section>`;
    } else {
      const rd = done.__rounds || 0;
      html += `<section class="block block-c">
        <header class="b-head"><h2><span class="b-letter">${ICON.loop}</span>Круг × ${b.rounds}</h2>
        <p>Выполняйте станции подряд: ${fmtRest(b.rest)} на переход между упражнениями, ${fmtRest(b.roundRest)} отдыха после круга.</p>
        ${S.mode !== 'custom' && effEquip(S.equip).has('bb') ? '<p class="b-note">Штанга в круговую не входит: становая, присед и жим штанги — в обычных подходах, на свежие силы.</p>' : ''}
        <div class="sets rounds" role="group" aria-label="Отметить пройденные круги">${Array.from({length:b.rounds}, (_, k) => `<button type="button" class="set${rd > k ? ' done' : ''}" data-round="${k}" aria-label="Круг ${k + 1}">${k + 1}</button>`).join('')}<span class="rounds-l">круги</span></div></header>
        <ol class="cards">${b.items.map(card).join('')}</ol></section>`;
    }
  }
  /* убрано последнее упражнение — строка после последней карточки */
  if (gone) { const k = html.lastIndexOf('</ol>'); html = html.slice(0, k) + gone + html.slice(k); }
  html += `<p class="phase"><b>Заминка, 5 мин.</b> Спокойная ходьба и растяжка мышц, которые работали: по 20–30 секунд на каждую.</p>`;
  return html;
}
/* расшифровка для тех, кто знает обозначения: на карточках они уже сказаны словами */
const LEGEND = `<p class="legend">Максимум на 1 повтор (1ПМ) — вес, который вы можете поднять только один раз. Темп: усилие — подъём веса, возврат — опускание, в секундах. В поле «Темп» своего плана — четыре числа: опускание, пауза внизу, подъём, пауза вверху; X — быстрый подъём.</p>`;
function warnHtml(p) {
  const warn = [];
  const gentle = S.goal === 'gentle' || S.protect.length > 0;
  if (p.items.length < p.count) warn.push(`Подобрано ${p.items.length} ${plural(p.items.length, 'упражнение', 'упражнения', 'упражнений')} из ${p.count}: ${gentle ? 'других вариантов для этих мышц и оборудования в бережном режиме нет.' : 'других вариантов для этих мышц и оборудования нет.'}`);
  if (p.lost && p.lost.length) warn.push(`Здесь нечем заменить: ${p.lost.map(ex => ex.name).join(', ')}. ${p.lost.length > 1 ? 'Их' : 'Его'} можно сделать здесь: ${placeOf(S, S.adapt).name}.`);
  /* мышца без упражнений: не хватает инвентаря — или всё, что есть, нагружает суставы, которые бережём */
  const byBody = p.missing.filter(g => EX.some(ex => available(ex, p.E) && groupsOf(ex).has(g))), byEq = p.missing.filter(g => !byBody.includes(g));
  if (byEq.length) warn.push(`Без упражнений осталось: ${byEq.map(g => GN[g].toLowerCase()).join(', ')}. Для них нужно другое оборудование.`);
  if (byBody.length) warn.push(`Без упражнений в бережном режиме осталось: ${byBody.map(g => GN[g].toLowerCase()).join(', ')}. Всё, что для этого есть, даёт нагрузку, которую вы бережёте.`);
  const dw = durationWarn(p); if (dw) warn.push(dw);
  return warn.length ? `<div class="warn">${warn.map(w => `<p>${esc(w)}</p>`).join('')}</div>` : '';
}
function headButtons(copyLabel) {
  /* начатая и не законченная тренировка: «Продолжить тренировку →»; прошлого дня — вопрос над кнопками (14-workout-mode.js) */
  const w = workoutPlanState();
  return `${workoutAskHtml(w)}<div class="p-btns">
        <button type="button" class="btn" id="start-workout" aria-haspopup="dialog" aria-controls="workout-view">${workoutStartHtml(w)}</button>
        ${S.mode === 'custom' ? '' : `<button type="button" class="btn btn-2" id="reroll">${ICON.dice}<span>Другой вариант</span></button>`}
        <button type="button" class="btn btn-2" id="copy">${ICON.copy}<span>${copyLabel}</span></button>
        ${S.mode === 'program' ? `<button type="button" class="btn btn-2" id="ics-open">${ICON.cal}<span>В календарь</span></button>` : ''}
        ${S.mode === 'custom' ? `<button type="button" class="btn btn-2" id="plan-export">${ICON.share}<span>Выгрузить</span></button>`
          : `<button type="button" class="btn btn-2" id="save-plan">${ICON.save}<span>${S.mode === 'program' ? 'Сохранить неделю' : 'Сохранить как свой план'}</span></button>`}
      </div>
      <p class="p-hint" id="copy-msg" role="status"></p>
      <p class="p-hint" id="save-msg" role="status"></p>`;
}
/* акцент, выбранный в атласе мышц */
function focusHtml() {
  if (!S.focus || !MUSCLE_NAMES[S.focus]) return '';
  return `<p class="focus-chip"><span>Акцент: <b>${esc(MUSCLE_NAMES[S.focus])}</b></span><button type="button" data-focus-clear="1">Убрать акцент</button></p>`;
}
function norm(load) { const mx = Math.max(1, ...Object.values(load)); const o = {}; for (const [m, v] of Object.entries(load)) o[m] = v / mx; return o; }

/* диктор: #plan не живая область (весь план зачитывался при каждом нажатии, отчёт тестера п. 10) — после пересборки
   коротко: «План обновлён: 6 упражнений, ≈33 мин» (#plan-status, role="status"); при первом показе — молча */
let planSaid = null;
function announcePlan() {
  const box = $('#plan-status'); if (!box || S.view !== 'plan') return;
  const n = plan && plan.items ? plan.items.length : 0, empty = $('#plan .empty h2');
  const text = n ? `План обновлён: ${n} ${plural(n, 'упражнение', 'упражнения', 'упражнений')}, ≈${plan.minutes} мин` : empty ? empty.textContent : '';
  if (planSaid === null) { planSaid = text; return; }
  planSaid = text; box.textContent = ''; /* то же сообщение подряд тоже объявляется: сначала очистить, затем вписать */
  clearTimeout(announcePlan.t); announcePlan.t = setTimeout(() => { box.textContent = text; }, 80);
}
function renderPlan() { renderPlanView(); if ($('#count-v')) renderCount(); announcePlan(); }
function renderPlanView() {
  stopFigures();
  if (S.view === 'journal') { prog = null; plan = null; return renderJournal(); }
  if (S.view === 'atlas') { prog = null; plan = null; return renderAtlas(); }
  if (S.mode === 'program') return renderProgram();
  prog = null;
  plan = buildPlan({swaps:swaps.s || {}, order:swaps.__order?.s});
  const root = $('#plan');
  if (plan.empty === 'groups') {
    root.innerHTML = `<div class="empty"><h2>Выберите мышцы</h2><p>Отметьте хотя бы одну группу мышц в параметрах — план соберётся сразу.</p></div>`;
    return;
  }
  if (plan.empty === 'custom') {
    root.innerHTML = `<header class="p-head p-head-c"><div class="p-sum"><p class="eyebrow">Свой план · ${GOALS[S.goal].name} · ${FORMATS[S.format].name}</p><h1 class="p-title">${esc(titleFor())}</h1>${customHeadHtml()}</div></header>` + rmGoneHtml('div') + customEmptyHtml() + customAddHtml();
    return;
  }
  if (plan.empty === 'none') {
    root.innerHTML = S.mode === 'custom'
      ? rmGoneHtml('div') + `<div class="empty"><h2>Здесь нечем выполнить этот план</h2>${lostMessages(plan.lost, effEquip(S.equip)).map(m => `<p>${esc(m)}</p>`).join('')}<p>Выберите другое место или добавьте упражнения.</p></div>` + customAddHtml()
      : `<div class="empty"><h2>Не из чего собрать тренировку</h2><p>Для выбранных мышц нет упражнений с этим оборудованием и уровнем. Добавьте оборудование или выберите другие группы мышц.</p></div>`;
    return;
  }
  const G = GOALS[S.goal];
  const setsWord = S.format === 'circuit' ? plural(plan.totalSets, 'подход', 'подхода', 'подходов') + ' за круги' : plural(plan.totalSets, 'подход', 'подхода', 'подходов');
  const lf = ensureFold(S).load, loadRows = Object.entries(plan.load).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([m, v]) => [MUSCLE_NAMES[m], v]);
  let html = `<header class="p-head${lf ? ' load-folded' : ''}">
    <div class="p-sum">
      <p class="eyebrow">${plan.custom ? 'Свой план · ' : plan.byLog ? 'По журналу · ' : ''}${G.name} · ${FORMATS[S.format].name} · ${LEVELS[S.level].name.toLowerCase()}</p>
      <h1 class="p-title">${esc(titleFor())}</h1>
      ${plan.custom ? customHeadHtml() : focusHtml()}
      <dl class="stats">
        <div><dt>время</dt><dd>≈${plan.minutes}<small>мин</small></dd></div>
        <div><dt>${setsWord}</dt><dd>${plan.totalSets}</dd></div>
        <div><dt>${plural(plan.items.length, 'упражнение', 'упражнения', 'упражнений')}</dt><dd>${plan.items.length}</dd></div>
      </dl>
      ${headButtons('Скопировать план')}
    </div>
    <figure class="p-load${lf ? ' folded' : ''}">
      <div class="p-map">${muscleMapSvg(norm(plan.load), {labels:true, aria:'Карта нагрузки тренировки'})}</div>
      <figcaption>
        ${loadFoldHead('Нагрузка по мышцам, подходов', loadTop(loadRows))}
        <ul class="lbars">${loadBars(plan.load)}</ul>
        <p class="lb-note">Вспомогательная работа считается за половину подхода.</p>
      </figcaption>
    </figure>
  </header>`;
  if (plan.custom) {
    const hints = customHints(plan), lost = lostMessages(plan.lost, plan.E);
    html += autoregHtml() + gentleHtml() + (lost.length ? `<div class="warn">${lost.map(w => `<p>${esc(w)}</p>`).join('')}</div>` : '')
      + (hints.length ? `<div class="cp-hints">${hints.map(w => `<p>${esc(w)}</p>`).join('')}</div>` : '') + blocksHtml(plan) + customAddHtml() + LEGEND;
  } else html += logPickHtml(plan) + autoregHtml() + gentleHtml() + warnHtml(plan) + blocksHtml(plan) + LEGEND;
  root.innerHTML = html;
  mountFigures();
}

function renderProgram() {
  prog = buildProgram();
  if (S.day >= prog.days.length) S.day = 0;
  const day = prog.days[S.day];
  plan = day.plan;
  const G = GOALS[S.goal], wk = prog.week;
  const allGroups = new Set(prog.days.flatMap(d => DAY_T[d.tid].g));
  const sp = SPLITS[prog.split];
  const lf = ensureFold(S).load, volRows = Object.entries(prog.gvol).filter(([g, v]) => g !== 'cardio' && v >= 1).sort((a, b) => b[1] - a[1]).map(([g, v]) => [GN[g], Math.round(v * 2) / 2]);
  let html = `<header class="p-head${lf ? ' load-folded' : ''}">
    <div class="p-sum">
      <p class="eyebrow">${G.name} · ${FORMATS[S.format].name} · ${LEVELS[S.level].name.toLowerCase()}</p>
      <h1 class="p-title">${esc(sp.name)}, ${S.days} ${plural(S.days, 'тренировка', 'тренировки', 'тренировок')} в неделю</h1>
      ${focusHtml()}
      <dl class="stats">
        <div><dt>в неделю</dt><dd>≈${prog.minutes}<small>мин</small></dd></div>
        <div><dt>${plural(prog.sets, 'подход', 'подхода', 'подходов')} в неделю</dt><dd>${prog.sets}</dd></div>
        <div><dt>неделя цикла</dt><dd>${S.week}<small>из 4</small></dd></div>
      </dl>
      ${headButtons('Скопировать неделю')}
    </div>
    <figure class="p-load${lf ? ' folded' : ''}">
      <div class="p-map">${muscleMapSvg(norm(prog.load), {labels:true, aria:'Карта недельной нагрузки'})}</div>
      <figcaption>
        ${loadFoldHead('Подходов на группу за неделю', loadTop(volRows))}
        <ul class="vbars">${volBars(prog.gvol, allGroups)}</ul>
        <p class="lb-note">${volScaleText()} Подход засчитывается целиком целевой группе и наполовину остальным работающим. ${S.goal === 'strength' ? 'В силовом цикле объём ниже — это нормально.' : S.goal === 'gentle' ? 'Сначала суставы и техника.' : ''}</p>
      </figcaption>
    </figure>
  </header>
  <section class="weeks" aria-label="Неделя цикла">
    <h2>Цикл из 4 недель</h2>
    <div class="wk" role="group" aria-label="Неделя цикла">${WEEKS.map((w, i) => `<button type="button" class="${i + 1 === S.week ? 'on' : ''}" data-week="${i + 1}" aria-pressed="${i + 1 === S.week}"><b>${i + 1}</b><small>${w.name}</small></button>`).join('')}</div>
    <p class="wk-note"><b>${wk.name}.</b> ${esc(wk.note)}</p>
    <details class="rule"><summary>Как добавлять вес</summary><p>Работайте в диапазоне повторов из карточки. Когда во всех подходах сделали верхнюю границу, в следующий раз добавьте вес — ${unitRange([1, 2.5], [2.5, 5])} для верха тела, ${unitRange([2.5, 5], [5, 10])} для ног — и начните с нижней границы. Если записывать подходы в карточках, планировщик сам подскажет, когда прибавлять. После разгрузки повторите цикл с новыми весами.</p></details>
  </section>
  <nav class="days" role="tablist" aria-label="Дни недели">${prog.days.map((d, i) => `<button type="button" role="tab" class="${i === S.day ? 'on' : ''}" data-day="${i}" aria-selected="${i === S.day}"><b>${WD[d.wd]}</b><span>${esc(d.name)}</span><small>${d.plan.items ? `≈${d.plan.minutes} мин` : 'нет упражнений'}</small></button>`).join('')}</nav>
  <div class="day-head"><h2>${WD_FULL[day.wd]} — ${esc(day.name)}</h2>
    <p>${(plan.groups || DAY_T[day.tid].g).map(g => GN[g].toLowerCase()).join(', ')}${plan.items ? ` · ≈${plan.minutes} мин · ${plan.totalSets} ${plural(plan.totalSets, 'подход', 'подхода', 'подходов')}` : ''}</p></div>`;
  if (!plan.items) html += `<div class="empty"><h2>Для этого дня нет упражнений</h2><p>С выбранным оборудованием нечем нагрузить эти мышцы. Добавьте оборудование или выберите другой сплит.</p></div>`;
  else html += autoregHtml() + gentleHtml() + warnHtml(plan) + blocksHtml(plan);
  html += LEGEND;
  $('#plan').innerHTML = html;
  if (plan.items) mountFigures();
}
