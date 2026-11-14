/* ===================== НАГРУЗКА НА СУСТАВЫ =====================
   Красная метка — момент пиковой нагрузки на сустав, связки или сухожилие в повторении. Это напоминание держать
   технику, а не «опасное упражнение». Условия проверяются по углам суставов манекена (Mannequin.jointAngles —
   тот же расчёт, что у валидатора) и по опорам упражнения (контакты спецификации), на 41 кадре повторения.
   Пороги и основания:
   колени      — сгибание ≥85° (на одной ноге ≥80°) под весом: Escamilla 2001, MSSE 33(1):127–141;
                 без отягощения на двух ногах — сгибание ≥85° и центр колена впереди носков (сисси-присед). Колени уходят
                 вперёд — у веса тела длиннее плечо относительно колена, момент на колене растёт: в приседе со штангой
                 без барьера у носков момент на колене 150,1 ± 50,8 Н·м против 117,3 ± 34,2 Н·м с барьером, не пускающим
                 колени за носки — Fry, Smith, Schilling 2003, JSCR 17(4):629–633; так же и в приседе без веса (нагрузка
                 0, ¼ и ½ веса тела): без ограничения пиковый момент на колене больше — Lorenzetti et al. 2012,
                 JSCR 26(10):2829–2836. Порог — линия носков, как барьер у Fry; передняя поверхность колена при этом уже
                 на полтолщины колена за носками. Присед без веса манекена держит колени за линией носков (центр колена
                 на 4 см позади), сисси-присед уводит их на 21 см вперёд: плечо веса тела от колена — 32 см против 20;
                 На гребном тренажёре колено нагружено только в толчке: ноги толкают из полного сжатия, пик силы — когда
                 колено проходит 90° (British Rowing Plus, 2024, «Applying biomechanics: an analysis of the rowing stroke»);
                 в возврате маховик идёт по инерции, сопротивления нет — метка горит в толчке и молчит в возврате;
   колено      — разгибание в открытой цепи ближе 30° к прямой ноге: Escamilla et al. 1998, MSSE 30(4):556–569;
   упор на колени — колено стоит на опоре и несёт вес тела: передняя поверхность колена смотрит в опору (вниз —
                 не дальше 53° от вертикали, косинус ≥ 0,6). Стоя на коленях при сгибе 90° на переднюю поверхность колена
                 приходится в среднем 97 % веса тела, давление — на надколенник и бугристость большеберцовой кости, после
                 эндопротеза давление в надколенниково-бедренном суставе растёт сильнее: Lee 2014, Clin Orthop Surg 6(2):117–126
                 (обзор, данные Hassaballa et al.). Стоять на коленях — то, что хуже всего восстанавливается после эндопротеза:
                 через 5 лет 67 % с большим трудом или не могут — Shah et al. 2023, Arthroplasty 5:32 (систематический обзор);
                 после пластики ПКС сухожилием надколенника сильные трудности — у 21,3 % через 2 года — Rahardja et al. 2023,
                 AJSM 51(13):3464–3472. Не упор: колено в валиках тренажёра сбоку (сведение, разведение), под валиком скамьи
                 для пресса (передняя поверхность смотрит вверх), боком на скамье в копенгагенской планке;
   поясница    — наклон корпуса ≥40° без опоры с весом: McGill 1997, J Biomech 30(5):465–475;
   поясница, длинный рычаг — упор руками далеко впереди при вытянутом теле (выкатывание ролика): плечо поднято ≥120°,
                 корпус почти горизонтален (наклон 50–110°), таз раскрыт (сгибание бедра ≤30°), туловище ничем не подпёрто.
                 В планке и отжиманиях плечо у 90° и меньше — кисти под плечами; в полном выкате 150–180° — руки на линии
                 корпуса. С 120° кисти уже впереди головы: вес тела висит между коленями и кистями, пресс держит поясницу
                 от прогиба. Выкатывание повышает сжатие позвоночника и может не подходить при нарушениях со стороны
                 позвоночника — Youdas et al. 2008, JSCR 22(6):1939–1946 (Ab-Slide); упражнения передней цепи с длинным
                 рычагом (выход из упора лёжа, «пила») — 2400–2700 Н сжатия L4/L5, выполнить их могли только тренированные —
                 McGill, Andersen, Cannon 2015, J Sports Sci 33(4):419–426;
   плечи       — плечо за линией корпуса ≥20° в жимах и брусьях, длинный рычаг в разведениях:
                 Fees et al. 1998, AJSM 26(5):732–742; брусья — McKenzie et al. 2022, IJERPH 19(21):14390;
   плечи вверх — жим над головой: плечо поднято на 90–120° под весом — подакромиальное пространство здесь самое узкое
                 (при работе мышц — уже всего около 90°): Graichen et al. 1999, AJR 172(4):1081–1086; жимы над головой —
                 среди упражнений, на которые чаще жалуются при боли в плече: Kolber et al. 2010, JSCR 24(6):1696–1704;
   локти       — сгибание ≥100° с весом над головой в изолирующих упражнениях на трицепс (практическое правило);
   запястья    — разгибание кисти ≥60° под весом тела. Все 24 бытовых действия у 40 человек укладываются в 60° разгибания
                 кисти, большинство — в 40°: Ryu et al. 1991, J Hand Surg Am 16(3):409–419; опора всем весом тела на кисть,
                 разогнутую дальше, — за пределами бытовой амплитуды. Боль у тех, кто опирается на разогнутую кисть
                 (отжимания, планка, йога) — Nance et al. 2017, J Wrist Surg 6(4):276–279 (МРТ; порога угла в работе нет);
   ахилл       — тыльное сгибание ≥5° (дальше нейтрали, 5° — допуск измерения стопы манекена) с весом в подъёмах на носки.
                 При вставочной тендинопатии ахилла эксцентрика «без нагрузки в тыльное сгибание» (на полу, не со ступеньки)
                 помогла 67 % больных, а с полной амплитудой тыльного сгибания — 32 %: Jonsson, Alfredson, Sunding,
                 Fahlström, Cook 2008, Br J Sports Med 42(9):746–749. Прежний порог 15° ссылался на Weinert-Aplin et al.
                 2015 (JSSM 14:459–465), но в той работе порога нет: она о том, как сгиб колена меняет опускание пятки;
   приземление — кадры после полётной фазы, пока таз опускается;
   бёдра сзади — колено ≤40° при сгибании бедра ≥70° с весом; скандинавские сгибания — наклон ≥40°:
                 Opar et al. 2012, Sports Med 42(3):209–226;
   вис, верх подтягивания, шея — по просьбе владельца: здесь чаще всего травмируют плечи и шейный отдел. */
const STRESS_RULES = [
  {id:'knee', parts:['колени'], zone:'Колени', what:'Глубокий сгиб под весом — пик нагрузки на надколенник и связки колена.', tip:'Колени по линии стоп, не проваливайтесь и не расслабляйтесь внизу.'},
  {id:'kneeOpen', parts:['колени'], zone:'Колени', what:'Последние 30° до прямой ноги — сильнее всего натянута передняя крестообразная связка.', tip:'Разгибайте без рывка и удара в конце.'},
  {id:'kneel', parts:['колени'], zone:'Колени', what:'Упор на колени: вес тела давит на надколенник и бугристость большеберцовой кости.', tip:'Подложите мягкий коврик; если стоять на коленях больно, выберите вариант стоя или сидя.'},
  {id:'lumbar', parts:['поясница'], zone:'Поясница', what:'Наклон корпуса с весом без опоры — пик нагрузки на поясницу.', tip:'Спина нейтральная, движение от таза, вес ближе к ногам.'},
  {id:'lumbarLever', parts:['поясница'], zone:'Поясница', what:'Длинный рычаг: руки далеко впереди, тело вытянуто — пресс держит поясницу от прогиба, нагрузка на поясничный отдел самая большая.', tip:'Уходите вперёд, только пока поясница не прогибается; при боли в спине — короче амплитуда или планка.'},
  {id:'shPress', parts:['плечи'], zone:'Плечи', what:'Плечо ушло за линию корпуса под весом — нагрузка на переднюю часть сустава.', tip:'Опускайтесь до комфортной глубины, лопатки сведены и прижаты.'},
  {id:'shLever', parts:['плечи'], zone:'Плечи', what:'Длинный рычаг: вес далеко от плеча.', tip:'Локти слегка согнуты, без провала в нижней точке.'},
  {id:'shOverhead', parts:['плечи'], zone:'Плечи', what:'Рука проходит дугу 90–120° под весом — пространство под акромионом самое узкое, сухожилия плеча сдавлены сильнее всего.', tip:'Жмите перед головой, не из-за головы, локти чуть впереди корпуса; при боли — остановитесь ниже или замените упражнение.'},
  {id:'hang', parts:['плечи'], zone:'Плечи', what:'Вис: плечевой сустав растянут весом тела.', tip:'Активный вис: плечи от ушей, без падения в нижнюю точку.'},
  {id:'pullTop', parts:['плечи'], zone:'Плечи', what:'Верх подтягивания: плечи уходят вперёд и к ушам.', tip:'Грудь к перекладине, лопатки вниз и назад, без рывка.'},
  {id:'neck', parts:['шея'], zone:'Шея', what:'Когда не хватает сил, к перекладине тянутся шеей — это перегружает шейный отдел.', tip:'Подбородок нейтрально, взгляд вперёд: лучше недотянуть, чем дотягиваться шеей.'},
  {id:'elbow', parts:['локти'], zone:'Локти', what:'Глубокий сгиб локтя с весом над головой — нагрузка на локтевой отросток и сухожилие трицепса.', tip:'Опускайте медленно, локти не разводите.'},
  {id:'wrist', parts:['запястья'], zone:'Запястья', what:'Кисть разогнута под весом тела.', tip:'Опора на всю ладонь; при боли — упоры для отжиманий.'},
  {id:'achilles', parts:['ахилловы сухожилия'], zone:'Ахилловы сухожилия', what:'Пятка ниже опоры с весом — пик натяжения сухожилия.', tip:'Опускайтесь плавно, без пружинящих рывков.'},
  {id:'landing', parts:['колени', 'ахилловы сухожилия'], zone:'Колени и ахилловы сухожилия', what:'Приземление — ударная нагрузка в несколько раз больше веса тела.', tip:'Мягко на передний отдел стопы, колени по линии стоп.'},
  {id:'hams', parts:['задняя поверхность бедра'], zone:'Задняя поверхность бедра', what:'Мышцы задней поверхности бедра растянуты под весом.', tip:'Опускайтесь до ощутимого натяжения, без рывка из нижней точки.'}
];
const STRESS_RULE = Object.fromEntries(STRESS_RULES.map(r => [r.id, r]));
/* свои тексты, где общие не подходят: в турецком подъёме плечо и кисть нагружает опорная рука, а не жим или отжимание */
const STRESS_TEXT = {
  kbtgu:{
    shPress:{what:'Плечо уходит за линию корпуса, когда на руку переносится вес тела или гири, — нагрузка на переднюю часть сустава.', tip:'Опорная ладонь под плечом, плечи опущены от ушей, рука с гирей вертикально над плечом; переходите из положения в положение без рывка.'},
    wrist:{what:'Опорная кисть разогнута под весом тела, пока вы сидите на ладони.', tip:'Ладонь плоско, пальцы врозь, вес на основание ладони; при боли в запястье переходите с локтя на ладонь плавно и не задерживайтесь на ней.'}
  }
};
/* части тела, которые опираются туловищем или бёдрами: тогда тело не висит между кистями и коленями (стопами) */
const STRESS_TRUNK_REST = /^(back|chest|belly|buttocks|upperBack|front|headBack|th[LR]?|thighsBack)>(?!bar$)/;
const stressIn = (c, t) => !c.when || t == null || (t >= c.when[0] - 1e-6 && t <= c.when[1] + 1e-6);
const STRESS_FRAMES = 40;
const STRESS_CACHE = new Map();
/* глубокий сгиб колена под весом — порог правила «колени» (Escamilla 2001); на одной ноге — раньше */
const STRESS_KNEE_DEEP = 85, STRESS_KNEE_DEEP_UNI = 80;
/* тыльное сгибание под весом в подъёмах на носки — порог правила «ахилл» (Jonsson et al. 2008): дальше нейтрали, 5° — допуск */
const STRESS_DORSI = 5;
/* наклоны от таза, если таблица движений планировщика ещё не загружена (проверка рисунков без приложения) */
const STRESS_HINGE = new Set(['deadlift', 'rdl', 'sllift', 'goodmorning', 'kbswing', 'hyper', 'pullthrough', 'kbdeadlift', 'kbswing1', 'kbclean', 'kbsnatch', 'kbsllift']);
/* жимы вверх — так же, на случай проверки без таблицы движений */
const STRESS_VPUSH = new Set(['dbpress', 'ohp', 'pikepush', 'arnold', 'declinepike', 'shoulderpressm', 'smithohp', 'kbpress']);

/* что держит и на что опирается тело — по контактам спецификации */
function stressContacts(ex) {
  const P = typeof CATALOG_POSES !== 'undefined' && CATALOG_POSES[ex.id] || {}, K = P.contacts || [];
  const C = K.map(c => c.body + '>' + c.prop);
  const has = re => C.some(c => re.test(c));
  /* ролик для пресса: хват за его ось — упор руками, как ладонями в пол */
  const wheels = new Set((P.equipment || []).filter(e => e.type === 'abWheel').map(e => e.id));
  const leverHand = c => (/^(palm|fa)[LR]?$/.test(c.body) && !/:(panel|top)$/.test(c.prop)) || (/^grip[LR]?$/.test(c.body) && wheels.has(c.prop.split(':')[0]));
  const knees = K.filter(c => /^knee[LR]?$/.test(c.body));
  const legs = ['quads', 'glutes', 'hams', 'calves', 'cardio'].includes(ex.g);
  /* свободный вес: гриф, гантель, гиря; ладони на диске гантели (пуловер, разгибание из-за головы) */
  const free = has(/^grip[LR]?>(bar|db[LR]?|kb[LR]?|tbar|\w+:horn[LR])$/) || has(/^(hand|palm[LR]?)>\w+:top$/);
  const machine = !legs && has(/^grip[LR]?>(cab[LR]?|pec[LR]|\w+:(handle[LR]?|grab[LR]|pull[LR]|pec[LR]))$/);
  return {
    loaded: free || machine,
    backBar: has(/^back>bar$/),
    sole: s => has(new RegExp(s ? '^sole(' + s + ')?>' : '^sole[LR]?>')),
    /* стопа стоит на опоре: подошвой или передним отделом (на носках) */
    feet: s => has(new RegExp('^(sole|foot)(' + s + ')?>')),
    /* стоит на полу или коврике и ничем больше не опирается — только у таких упражнений бывает приземление */
    floorOnly: C.some(c => /^sole[LR]?>(floor|mat)$/.test(c)) && !C.some(c => /^sole[LR]?>(?!(floor|mat)$)|^(buttocks|back|upperBack|chest|knee[LR]?|th[LR]?)>|^grip[LR]?>\w+:(pullBar|pull[LR]|bar[LR]|dip[LR]|rail[LR])$/.test(c)),
    seated: has(/^(back|chest|belly|buttocks|upperBack|front|headBack|th[LR]?|thighsBack|knee[LR]?|fa[LR]?|palm[LR]?)>(?!bar$)/),
    upright: !has(/^(buttocks|back|chest|th[LR]?|upperBack|knee[LR]?)>(?!bar$)(?!\w+:sh[LR]$)/),
    /* на одной ноге: касание ящика ягодицами в нижней точке пистолета не делает упражнение сидячим */
    uprightUni: !has(/^(back|chest|th[LR]?|upperBack|knee[LR]?)>(?!bar$)/),
    legPress: has(/^sole[LR]?>\w+:plate/) || has(/^upperBack>\w+:sh[LR]$/),
    shin: has(/^shin[LR]?>\w+:roller/),
    palmBear: s => has(new RegExp('^palm(' + s + ')?>(?!\\w+:(panel|top)$)')),
    palmTop: has(/^palm[LR]?>\w+:top$/),
    handsBear: has(/^(palm[LR]?|fa[LR]?)>|^grip[LR]?>\w+:(bar[LR]|dip[LR]|seat|pad|top)$/),
    bar: has(/^grip[LR]?>\w+:(pullBar|pull[LR])$/),
    kneelAnchored: has(/^knee[LR]?>pad$/) && has(/^foot[LR]?>\w+:base$/),
    /* колено касается опоры в этом кадре (контакты с окном времени — только в своей фазе) */
    kneeOn: (s, t) => knees.some(c => (c.body === 'knee' || c.body === 'knee' + s) && stressIn(c, t)),
    /* упор руками (ладони, предплечья, ось ролика) в этом кадре; туловище и бёдра ничем не подпёрты */
    leverHands: t => K.some(c => leverHand(c) && stressIn(c, t)),
    /* сидит, лежит или стоит на коленях в этом кадре — вес не на стопах; спиной к стене (стульчик) — стоя */
    restOn: (t, trunk) => K.some(c => stressIn(c, t) && (/^(buttocks|th[LR]?|thighsBack|knee[LR]?)$/.test(c.body) || (/^(back|upperBack|headBack|chest|belly)$/.test(c.body) && c.prop !== 'bar' && trunk > 20))),
    trunkFree: !has(STRESS_TRUNK_REST),
    /* гребной тренажёр: сопротивление маховика только в толчке */
    flywheel: (P.equipment || []).some(e => e.type === 'rowerErg')
  };
}
/* углы и вспомогательные величины кадра */
function stressFrame(R, t = null) {
  const A = Mannequin.jointAngles(R), V = Mannequin.V;
  const up = V.unit(V.sub(R.sh, R.hip)), trunk = Math.acos(Math.max(-1, Math.min(1, -up[1]))) * 180 / Math.PI;
  const side = s => { const a = A[s], h = R['grip' + s] && R['sh' + s] ? Math.hypot(R['grip' + s][0] - R['sh' + s][0], R['grip' + s][2] - R['sh' + s][2]) : 0;
    /* центр колена впереди носка (см) — по горизонтали вдоль стопы от пятки к носку */
    const toe = R['toe' + s], heel = R['heel' + s], fw = toe && heel ? V.unit([toe[0] - heel[0], 0, toe[2] - heel[2]]) : null;
    const kneeAhead = fw ? V.dot(V.sub(R['kn' + s], toe), fw) : -Infinity;
    /* куда смотрит передняя поверхность согнутого колена: биссектриса угла между бедром и голенью, наружу от сгиба;
       kneeDown — её доля вниз (ось y каталога направлена вниз): 1 — прямо в пол, −1 — вверх. При почти прямом колене
       (сгиб меньше 20°) направление не определено — 0 */
    const hip = R['hip' + s], kn = R['kn' + s], an = R['an' + s];
    let kneeDown = 0;
    if (hip && kn && an) { const d = V.sub(V.unit(V.sub(kn, hip)), V.unit(V.sub(an, kn))), n = Math.hypot(...d); if (n > .35) kneeDown = d[1] / n; }
    return {...a, behind:a.posterior > 0 ? Math.asin(Math.min(1, a.posterior)) * 180 / Math.PI : 0, beta:Math.abs(Math.atan2(a.lat, -a.up) * 180 / Math.PI), reach:h, kneeAhead, kneeDown}; };
  return {A, t, trunk, L:side('L'), R:side('R')};
}
/* правила кадра: возвращают ключи меток (суставы со стороной или центральные точки) */
function stressRulesAt(ex, k, f) {
  const out = {}, add = (id, keys) => { if (keys.length) out[id] = keys; }, both = (fn, key) => ['L', 'R'].filter(fn).map(s => key + s);
  /* в наклоне от таза (становая, румынская) колени согнуты, но пик нагрузки — на поясницу и заднюю поверхность бедра */
  const hinge = typeof PATTERN !== 'undefined' ? PATTERN[ex.id] === 'hinge' : STRESS_HINGE.has(ex.id), legsG = ['quads', 'glutes', 'hams'].includes(ex.g);
  if (!ex.pri.includes('calves') && !hinge) {
    const loaded = k.legPress || (k.upright && (k.loaded || k.backBar)) || (legsG && ex.uni && k.uprightUni);
    if (loaded) add('knee', both(s => k.sole(s) && f[s].knee >= (ex.uni ? STRESS_KNEE_DEEP_UNI : STRESS_KNEE_DEEP), 'kn'));
    /* без отягощения на двух ногах, руки не держат вес: глубокий сгиб с коленями за носками (сисси-присед) */
    else if (legsG && !ex.uni && k.upright && !k.handsBear) add('knee', both(s => k.feet(s) && f[s].knee >= STRESS_KNEE_DEEP && f[s].kneeAhead > 0, 'kn'));
  }
  if (k.shin) add('kneeOpen', both(s => f[s].knee <= 30, 'kn'));
  /* упор на колени: колено на опоре передней поверхностью */
  add('kneel', both(s => k.kneeOn(s, f.t) && f[s].kneeDown >= .6, 'kn'));
  if (k.sole('') && !k.seated && (k.loaded || k.backBar) && f.trunk >= 40) add('lumbar', ['lumbar']);
  /* длинный рычаг: тело вытянуто между упором рук далеко впереди и коленями или стопами */
  if (k.trunkFree && k.leverHands(f.t) && f.trunk >= 50 && f.trunk <= 110 && Math.max(f.L.hipFlex, f.R.hipFlex) <= 30 && Math.max(f.L.elevation, f.R.elevation) >= 120) add('lumbarLever', ['lumbar']);
  const push = ['chest', 'triceps', 'shoulders'].includes(ex.g);
  if (push && (k.loaded || k.handsBear)) add('shPress', both(s => f[s].behind >= 20, 'sh'));
  /* жим вверх: плечо в дуге 90–120° — только в жимах, а не в тяге к лицу или махах (там другая задача и малый вес) */
  const vpush = typeof PATTERN !== 'undefined' ? PATTERN[ex.id] === 'vpush' : STRESS_VPUSH.has(ex.id);
  if (vpush && (k.loaded || k.handsBear)) add('shOverhead', both(s => f[s].elevation >= 90 && f[s].elevation <= 120, 'sh'));
  if (ex.g === 'chest' && k.loaded) add('shLever', both(s => (f[s].elbow <= 35 && f[s].reach >= 45 && f[s].beta >= 60 && f[s].beta <= 120 && f.trunk > 60) || (f[s].elevation >= 130 && f[s].reach >= 35), 'sh'));
  if (k.bar) {
    add('hang', both(s => f[s].elevation >= 140, 'sh'));
    const top = both(s => f[s].elbow >= 100, 'sh');
    add('pullTop', top);
    if (top.length) add('neck', ['neck']);
  }
  if (ex.pri[0] === 'triceps' && ex.type !== 'c' && k.loaded) add('elbow', both(s => f[s].elbow >= 100 && f[s].elevation >= 80, 'el'));
  if (!k.kneelAnchored) add('wrist', both(s => ((k.palmBear(s) && f.trunk >= 45) || k.palmTop) && f[s].wristFlex <= -60, 'wr'));
  if (ex.pri[0] === 'calves' && ex.type !== 'c' && ex.g !== 'cardio') add('achilles', both(s => f[s].dorsi >= STRESS_DORSI, 'an'));
  if (k.sole('') && !k.seated && (k.loaded || k.backBar)) add('hams', both(s => f[s].knee <= 40 && f[s].hipFlex >= 70, 'th'));
  if (k.kneelAnchored && f.trunk >= 40) add('hams', ['thL', 'thR']);
  return out;
}
/* метки по кадрам: f — повторение вперёд (t 0→1), b — возврат (t 1→0); различаются только приземлением */
function jointStress(ex) {
  if (STRESS_CACHE.has(ex.id)) return STRESS_CACHE.get(ex.id);
  let result = {rules:[]};
  const rig = ex.anim.catalogRig;
  if (rig && typeof CATALOG_POSES !== 'undefined' && CATALOG_POSES[ex.id]) {
    const k = stressContacts(ex), frames = [], clear = [], hip = [], legsG = ['quads', 'glutes', 'hams'].includes(ex.g);
    let kneeDepth = 0;
    for (let i = 0; i <= STRESS_FRAMES; i++) {
      const t = i / STRESS_FRAMES, R = rig(t);
      if (!R.frames) { frames.length = 0; break; }
      const f = stressFrame(R, t);
      frames.push(stressRulesAt(ex, k, f));
      clear.push(Math.max(R.heelL[1], R.toeL[1], R.heelR[1], R.toeR[1])); hip.push(R.hip[1]);
      if (legsG && !k.restOn(t, f.trunk) && f.trunk <= 60) for (const s of ['L', 'R']) if (k.feet(s)) kneeDepth = Math.max(kneeDepth, f[s].knee);
    }
    result.kneeDepth = frames.length ? kneeDepth : 0;
    if (frames.length) {
      const ground = Math.max(...clear), gap = clear.map(y => ground - y);
      const landing = order => { const hit = new Array(frames.length).fill(false); let since = Infinity;
        for (let n = 1; n < order.length; n++) { const i = order[n], prev = order[n - 1];
          since = gap[prev] >= 5 ? 0 : since + 1;
          if (gap[i] < 3 && since < 5 && hip[i] > hip[prev]) hit[i] = true; }
        return hit; };
      const idx = frames.map((_, i) => i), none = idx.map(() => false);
      const fw = k.floorOnly ? landing(idx) : none, bw = !k.floorOnly ? none : ex.anim.loop ? fw : landing(idx.slice().reverse());
      const ids = new Set(frames.flatMap(f => Object.keys(f)));
      if (fw.some(Boolean) || bw.some(Boolean)) ids.add('landing');
      /* гребной тренажёр: вперёд — толчок (захват → финиш), назад — возврат без сопротивления */
      const keysOf = (id, i, dir) => id === 'landing' ? ((dir === 'b' ? bw : fw)[i] ? ['knL', 'knR', 'anL', 'anR'] : [])
        : id === 'knee' && k.flywheel && dir === 'b' && !ex.anim.loop ? [] : frames[i][id] || [];
      const text = STRESS_TEXT[ex.id] || {};
      result = {kneeDepth:result.kneeDepth, rules:STRESS_RULES.filter(r => ids.has(r.id)).map(r => ({...r, ...text[r.id], f:frames.map((_, i) => keysOf(r.id, i, 'f')), b:frames.map((_, i) => keysOf(r.id, i, 'b'))}))};
    }
  }
  STRESS_CACHE.set(ex.id, result);
  return result;
}
/* самый глубокий сгиб колена стоя на стопе в упражнениях на ноги (без опоры тазом, бёдрами, коленом или спиной на скамье;
   спина у стены — тоже стоя), в градусах.
   Для замен при «Беречь колени» (11g-gentle.js): присед или выпад с весом тела до того же сгиба нагружает колено
   почти как с гантелью. Момент на колене задаёт прежде всего вес тела над коленом и плечо до него: гантель в 10–16 кг —
   это 13–20 % веса тела; в приседе с ¼ и ½ веса тела момент на колене при сгибе 60° больше, чем без веса, лишь на 10
   и 14 % (Lorenzetti et al., ISB 2009, предварительные данные одного испытуемого; полная работа — JSCR 2012,
   26(10):2829–2836: в нижней точке колено 86° с барьером у носков и 106° без него). А снижают момент меньшее сгибание
   и колени за линией носков (Fry 2003). Поэтому замена при «Беречь колени» не уходит стоя глубже порога правила. */
function stressKneeDepth(ex) { return ['quads', 'glutes', 'hams'].includes(ex.g) ? jointStress(ex).kneeDepth || 0 : 0; }
function stressKneeDeep(ex) { return stressKneeDepth(ex) >= (ex.uni ? STRESS_KNEE_DEEP_UNI : STRESS_KNEE_DEEP); }
function stressExercise(anim) { return anim.catalogId ? (typeof EXI !== 'undefined' ? EXI[anim.catalogId] : EX.find(e => e.id === anim.catalogId)) : null; }
/* активные правила в положении t; index 2 и 3 — обратный ход (кроме замкнутых циклов) */
function jointStressAt(ex, t, index = 0) {
  const S = jointStress(ex), i = Math.max(0, Math.min(STRESS_FRAMES, Math.round(t * STRESS_FRAMES))), dir = index >= 2 && !ex.anim.loop ? 'b' : 'f';
  return S.rules.map(r => ({rule:r, keys:r[dir][i]})).filter(x => x.keys.length);
}
/* точка метки на манекене */
function stressPoint(R, key) {
  const V = Mannequin.V, s = key.slice(-1);
  if (key === 'lumbar') return R.waist || V.mix(R.hip, R.sh, .3);
  if (key === 'neck') return V.mix(R.neckBase || R.sh, R.head, .35);
  if (key.startsWith('th')) return V.mix(R['hip' + s], R['kn' + s], .45);
  if (key.startsWith('an')) return V.mix(R['an' + s], R['heel' + s], .5);
  return R[key];
}
function jointStressPoints(anim, R, t, index) {
  const ex = stressExercise(anim);
  if (!ex || !R.frames) return [];
  const out = [];
  for (const {rule, keys} of jointStressAt(ex, t, index)) for (const key of keys) if (!out.some(m => m.key === key)) out.push({key, rule:rule.id, p:stressPoint(R, key)});
  return out;
}
/* коротко для карточки: какие суставы под пиковой нагрузкой */
function stressZones(ex) {
  const zones = [];
  for (const r of jointStress(ex).rules) for (const name of r.parts) if (!zones.includes(name)) zones.push(name);
  return zones;
}
