'use strict';
/* Выпуск 4.108 «Журнал и веса» (qa/qa-plan-4.105.md): ложные советы и порча чисел. Каждая проверка — замечание тестера
   второго прогона (testers2: Руслан — пауэрлифтер, Mike — фунты, Артём — новичок) или прежнего (Дмитрий, Ольга).
   Модель приложения на языке сборки — tools/lang-model.js. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadApp} = require('./lang-model');
const day = n => { const x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - n); const p = v => String(v).padStart(2, '0'); return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`; };
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const item = (id, eq) => `({...previewItem('${id}'),eqIds:${JSON.stringify(eq)}})`;

/* ---------- 1. совет «возьмите разгрузку» — по плану того дня ---------- */
test('fatigue: sets are compared with the plan of that day (rp), not with today’s program; old entries without rp do not count', () => {
  const a = loadApp({lang:'ru'});
  /* Руслан 1: жим 8/5/3/1 и становая 5×2 по своему плану — сингл и двойки не «недобор» */
  const own = {bbbench:[1, 3, 5, 8].map(n => ({d:day(n), rp:'8/5/3/1', s:[[60, 8], [100, 5], [140, 3], [160, 1]]})),
    deadlift:[2, 6].map(n => ({d:day(n), rp:'2', s:[[230, 2], [230, 2], [230, 2]]}))};
  a.get(`Object.assign(S,{mode:'program',goal:'strength'});LOG.data=${JSON.stringify(own)}`);
  assert.equal(a.get('fatigueCheck([])'), null, 'singles by one’s own plan are not falling short');
  /* Mike 2: неделя силовой (3–5), потом цель «Бережно» (12–15) — старые подходы по 5 не «недобор» */
  const strength = {};
  for (const id of ['squat', 'bbrow', 'bbbench', 'deadlift']) strength[id] = [2, 4, 6, 8].map(n => ({d:day(n), rp:'3–5', s:[[100, 5], [100, 5], [100, 4]]}));
  a.get(`S.goal='gentle';LOG.data=${JSON.stringify(strength)}`);
  assert.equal(a.get('fatigueCheck([])'), null, 'a goal change does not turn old sets into falling short');
  /* настоящий недобор — совет есть */
  const short = {};
  for (const id of ['squat', 'bbrow', 'bbbench', 'deadlift']) short[id] = [2, 4].map(n => ({d:day(n), rp:'8–12', s:[[100, 8], [100, 6]]}));
  a.get(`LOG.data=${JSON.stringify(short)}`);
  assert.match(a.get('fatigueCheck([]).text'), /в 8 из 8 записей не дотянули/);
  /* записи прежних версий (без rp) не считаются: с чем их сравнивать, неизвестно */
  for (const id of Object.keys(short)) for (const s of short[id]) delete s.rp;
  a.get(`LOG.data=${JSON.stringify(short)}`);
  assert.equal(a.get('fatigueCheck([])'), null);
});
test('a logged set stores the plan reps (rp) and the unit (u) in the entry of the day; a backup keeps them, junk is dropped', () => {
  const a = loadApp({lang:'ru'});
  a.get(`LOG.data={};var it=${item('squat', ['bb', 'rack'])};it.rx={...it.rx,reps:'3–5',sets:5};var s=todaySession('squat',true);s.s[0]=[200,3];markSession(s,it,5,0)`);
  assert.deepEqual(a.json('[s.rp,s.u,s.target]'), ['3–5', 'kg', 5]);
  a.get(`S.units='lb';s.s[1]=[parseKg('445'),3];markSession(s,it,5,1)`);
  assert.equal(a.get('s.u'), 'mix', 'the second set in pounds — each weight’s unit is read from the number');
  /* копия: rp и u — только верные */
  const ok = a.json(`checkSession({d:'${day(2)}',rp:'8/5/3/1',u:'lb',s:[[60,8]]},EXI.bbbench,{strict:true})`);
  assert.equal(ok.rp, '8/5/3/1'); assert.equal(ok.u, 'lb');
  const bad = a.json(`checkSession({d:'${day(2)}',rp:'<b>',u:'stone',s:[[60,8]]},EXI.bbbench,{strict:true})`);
  assert(!('rp' in bad) && !('u' in bad), JSON.stringify(bad));
});

/* ---------- 2. единица в записи и показ до настоящего шага ---------- */
test('pounds logged, kilograms shown: 225 lb is 102.5 kg (not 102.06), the advice and the warm-up use it; back in pounds — 225 again', () => {
  const a = loadApp({lang:'ru'});
  a.get(`S.units='lb';LOG.data={squat:[{d:'${day(3)}',u:'lb',target:3,s:[[parseKg('225'),5],[parseKg('225'),5],[parseKg('225'),5]]}]};S.units='kg'`);
  const sg = a.json(`(s=>({kg:s.kg,text:s.text}))(suggest(${item('squat', ['bb', 'rack'])}))`);
  assert.equal(sg.kg, 102.5); assert.match(sg.text, /102,5×5/); assert.doesNotMatch(sg.text, /102,06/);
  assert.match(a.get(`warmupHtml(${item('squat', ['bb', 'rack'])}, suggest(${item('squat', ['bb', 'rack'])}).kg)`), /Разминка к 102,5/);
  /* история: в килограммах — 102,5, и строкой — то, что вписали */
  const h = strip(a.get('histHtml(EXI.squat)'));
  assert.match(h, /102,5×5 · 102,5×5 · 102,5×5/); assert.match(h, /вписано в фунтах: 225×5 · 225×5 · 225×5/);
  a.get(`S.units='lb'`);
  assert.match(strip(a.get('histHtml(EXI.squat)')), /225×5 · 225×5/); assert.doesNotMatch(a.get('histHtml(EXI.squat)'), /вписано в/);
});
test('kilograms logged, pounds shown: 105 kg is 230 lb (not 231.5); a plan of 200 kg is 440 lb, the warm-up to it needs nothing missing', () => {
  const a = loadApp({lang:'ru'});
  a.get(`LOG.data={squat:[{d:'${day(3)}',u:'kg',target:3,s:[[105,5],[105,5],[105,5]]}]};S.units='lb'`);
  assert.match(a.get(`suggest(${item('squat', ['bb', 'rack'])}).text`), /230×5/);
  const it = `(()=>{const i=${item('squat', ['bb', 'rack'])};i.rx={...i.rx,kgPlan:[200],kgU:'kg'};return i;})()`;
  assert.deepEqual(a.json(`planKgsHere(${it}).map(fmtKg)`), ['440']);
  const w = a.get(`warmupHtml(${it}, suggest(${it}).kg)`);
  assert.match(w, /Разминка к 440/); assert.doesNotMatch(w, /не хватает/);
  /* вписанное в своём плане в фунтах — в фунтах тем же числом, в килограммах — шагом штанги */
  const lbPlan = `(()=>{const i=${item('squat', ['bb', 'rack'])};i.rx={...i.rx,kgPlan:[Math.round(135*LB_KG*1e3)/1e3],kgU:'lb'};return i;})()`;
  assert.deepEqual(a.json(`planKgsHere(${lbPlan}).map(fmtKg)`), ['135']);
  a.get(`S.units='kg'`);
  assert.deepEqual(a.json(`planKgsHere(${lbPlan}).map(fmtKg)`), ['60']);
});
test('entries of earlier versions (no u) read as kilograms; a pound entry of 4.99–4.107 is recognised by its number', () => {
  const a = loadApp({lang:'ru'});
  assert.equal(a.get('unitOfKg(100, undefined)'), 'kg');
  assert.equal(a.get(`unitOfKg(Math.round(parseKg('135')*1e5)/1e5, undefined)`), 'kg', 'in kilograms parseKg is kilograms');
  assert.equal(a.get(`unitOfKg(Math.round(135*LB_KG*1e5)/1e5, undefined)`), 'lb');
  /* ни один вес через 0,05 кг до 200 кг не похож на фунты */
  assert.equal(a.get(`Array.from({length:4000},(_, i)=>(i+1)*.05).filter(lbLike).length`), 0);
  /* вписанное в килограммах в записи прежней версии — без изменений */
  a.get(`LOG.data={bbbench:[{d:'${day(3)}',s:[[60,10],[60,10]]}]}`);
  assert.match(a.get(`suggest(${item('bbbench', ['bb', 'bench'])}).text`), /60×10, 60×10/);
});

/* ---------- 3. ввод в журнале плана — те же правила, переспрос ---------- */
test('one validation for the card table and the workout screen: −20, 0 on a barbell, 2.5 reps, letters', () => {
  const a = loadApp({lang:'ru'});
  const r = (kg, reps, id = 'squat') => a.json(`readSetInput(${JSON.stringify(kg)}, ${JSON.stringify(reps)}, EXI.${id})`);
  assert.deepEqual(r('-20', '3'), {bad:'kg', msg:'Вес не может быть меньше нуля.'});
  assert.deepEqual(r('−20', '3'), {bad:'kg', msg:'Вес не может быть меньше нуля.'});
  assert.deepEqual(r('0', '3'), {bad:'kg', msg:'Укажите фактический вес снаряда.'});
  assert.deepEqual(r('140', '2,5'), {bad:'reps', msg:'Укажите целое количество выполненных повторов.'});
  assert.deepEqual(r('абв', '3'), {bad:'kg', msg:'Введите вес числом, например 12,5.'});
  assert.deepEqual(r('142,5', '3'), {kg:142.5, reps:3});
  assert.deepEqual(r('', '8', 'pullup'), {kg:null, reps:8}, 'extra weight may be empty');
  assert.deepEqual(r('', '45,5', 'plank'), {kg:null, reps:45.5}, 'seconds may be fractional');
  /* таблица карточки: подсказка в поле — только если в ней число («—» у доп. веса — пусто) */
  assert.deepEqual(a.json(`(r=>r.bad?{bad:true,msg:r.msg}:r)(readFields({kgIn:{value:'',placeholder:'—'},rIn:{value:'',placeholder:'8'}},EXI.pullup))`), {kg:null, reps:8});
  assert.deepEqual(a.json(`(r=>r.bad?{bad:true,msg:r.msg}:r)(readFields({kgIn:{value:'',placeholder:'200'},rIn:{value:'',placeholder:'8–12'}},EXI.squat))`), {bad:true, msg:'Укажите целое количество выполненных повторов.'}, 'a range is not a number of reps');
});
test('ask before logging: 300 instead of 200 (last time 202.5), 1000 reps, 100 reps with a weight; ordinary steps pass', () => {
  const a = loadApp({lang:'ru'});
  a.get(`LOG.data={squat:[{d:'${day(3)}',s:[[202.5,3],[202.5,3]]}],dbcurl:[{d:'${day(3)}',s:[[16,10],[16,9]]}]}`);
  const k = (id, eq, kg) => a.json(`setDoubt(${item(id, eq)},[${kg}],[3],0)`);
  assert.match(k('squat', ['bb', 'rack'], 300).text, /намного больше, чем в прошлый раз \(202,5\s*кг\)\. Записать 300\s*кг\?/);
  assert.equal(k('squat', ['bb', 'rack'], 210), null, '+3.7 % is a step, not a typo');
  const reps = (id, eq, kg, n) => a.json(`setDoubt(${item(id, eq)},[${kg}],[${n}],0)`);
  assert.match(reps('dbcurl', ['db'], 16, 1000).text, /лучший подход — 10\)\. Записать 1000\s*повторов\?/);
  assert.equal(reps('dbcurl', ['db'], 16, 25), null, '25 after 10 — not three times');
  a.get('LOG.data={}');
  assert.match(reps('dbcurl', ['db'], 16, 100).text, /Для подхода с весом это необычно много повторов/);
  assert.equal(reps('dbcurl', ['db'], 16, 30), null);
  assert.equal(reps('pushup', [], 'null', 120), null, 'bodyweight — up to 150');
  assert.match(reps('pushup', [], 'null', 200).text, /необычно много повторов/);
  assert.equal(a.json(`setDoubt(${item('plank', [])},[null],[600],0)`), null, 'a 10-minute plank');
  assert.equal(a.json(`setDoubt(${item('treadmill', ['treadmill'])},[null],[3600],0)`), null, 'cardio is not asked');
});
test('the plan weight editor: a field per set with the numeric keyboard; 5000, −20, letters are refused with a message', () => {
  const a = loadApp({lang:'ru'});
  a.get(`(()=>{S.mode='custom';const c=customOf();c.items=[{id:'squat',sets:3,kg:[200]}];})()`);
  const it = `(()=>{const i=${item('squat', ['bb', 'rack'])};i.slot=0;i.rx={...i.rx,sets:3,kgPlan:[200],kgU:'kg'};return i;})()`;
  const html = a.get(`cpKgFieldsHtml(${it}, 'Вес, кг')`);
  assert.equal((html.match(/inputmode="decimal"/g) || []).length, 3, 'three sets — three fields');
  assert.match(html, /value="200"/); assert.match(html, /Пустое поле — тот же вес, что в подходе перед ним/);
  /* разбор полей: пустое — вес подхода выше, разные — пирамида; неверное — сообщение */
  const read = vals => a.json(`(()=>{const ins=${JSON.stringify(vals)}.map((v,k)=>({value:v,dataset:{k}}));document.querySelectorAll=()=>ins;plan={items:[${it}]};const r=cpKgRead(0);return r.bad?{msg:r.msg}:r;})()`);
  assert.deepEqual(read(['200', '', '']), {kg:[200]});
  assert.deepEqual(read(['60', '100', '140']), {kg:[60, 100, 140]});
  assert.deepEqual(read(['', '', '']), {clear:true});
  assert.deepEqual(read(['5000', '', '']), {msg:'Вес не принят: в плане — до 500 кг.'});
  assert.deepEqual(read(['-20', '', '']), {msg:'Вес не может быть меньше нуля.'});
  assert.deepEqual(read(['абв', '', '']), {msg:'Введите вес числом, например 62,5.'});
  assert.deepEqual(read(['0', '', '']), {msg:'Укажите вес больше нуля.'});
});

/* ---------- 4. Л/П: рекорд с весом ---------- */
test('the journal record of a weighted unilateral exercise (Bulgarian split squat with 16 kg dumbbells) shows the weight', () => {
  const a = loadApp({lang:'ru'});
  a.get(`LOG.data={bulgarian:[{d:'${day(3)}',eq:'db',s:[[16,8,null,{l:[16,8],r:[16,9]}],[16,8]]},{d:'${day(1)}',eq:'db',s:[[16,9],[16,9]]}]}`);
  const v = strip(a.get('journalVal(EXI.bulgarian, LOG.data.bulgarian)'));
  assert.match(v, /16 кг × 9/); assert.match(v, /\+1 повт\./); assert.doesNotMatch(v, /расч\. максимум/, 'no 1RM: body weight is not in it');
  assert.match(a.get('histMetric(EXI.bulgarian, LOG.data.bulgarian).name'), /Повторы с 16\s*кг/);
  /* без веса — как раньше, по повторам */
  assert.match(strip(a.get(`journalVal(EXI.bulgarian, [{d:'${day(2)}',s:[[null,10]]}])`)), /10 повт\./);
});

/* ---------- 5. расчётный максимум сингла ---------- */
test('estimated 1RM of a single is the weight itself (160 × 1 — 160, not 165.5); other reps — Epley as before', () => {
  const a = loadApp({lang:'ru'});
  assert.equal(a.get('e1rm(160, 1)'), 160);
  assert.equal(Math.round(a.get('e1rm(100, 5)') * 100) / 100, 116.67);
  a.get(`LOG.data={bbbench:[{d:'${day(1)}',s:[[60,8],[100,5],[140,3],[160,1]]}]}`);
  assert.match(strip(a.get('journalVal(EXI.bbbench, LOG.data.bbbench)')), /расч\. максимум 160 кг/);
});

/* ---------- 6. гантели и гири, которые есть в месте ---------- */
test('available dumbbells: «add weight» only up to what the place has, then reps; 52.5 without a list goes to 55, not 54.5', () => {
  const a = loadApp({lang:'ru'});
  a.get(`Object.assign(S,{mode:'single',goal:'mass'});LOG.data={dbrow:[{d:'${day(3)}',target:3,s:[[52.5,12],[52.5,12],[52.5,12]]}]}`);
  const sg = () => a.json(`(s=>({kg:s.kg,text:s.text,reps:s.reps}))(suggest(${item('dbrow', ['db', 'bench'])}))`);
  assert.equal(sg().kg, 55, 'a 2.5-step rack: 52.5 → 55');
  /* Ольга 1: дома только гантели 5 кг */
  a.get(`(()=>{const p=placeOf();p.equip=[...new Set(p.equip.concat('db'))];p.dw={db:{u:'kg',v:[5]}};LOG.data={dbrow:[{d:'${day(3)}',target:3,s:[[5,12],[5,12],[5,12]]}]};})()`);
  const s5 = sg();
  assert.equal(s5.kg, 5); assert.match(s5.text, /^В месте «.+» нет гантелей тяжелее 5\s*кг — прибавляйте повторы/); assert.deepEqual(s5.reps, [13, 13, 13]);
  assert.equal(a.get(`warmupHtml(${item('dbrow', ['db', 'bench'])}, 5)`), '', 'no warm-up to 7 kg that is not there');
  /* набор зала: 52,5 → 55 → 57,5 */
  a.get(`(()=>{placeOf().dw={db:{u:'kg',v:[50,52.5,55,57.5]}};LOG.data={dbrow:[{d:'${day(3)}',target:3,s:[[52.5,12],[52.5,12],[52.5,12]]}]};})()`);
  assert.equal(sg().kg, 55);
  /* разбор набора */
  assert.deepEqual(a.json(`parseAvail('2–10 через 2','db','kg').list`), [2, 4, 6, 8, 10]);
  assert.deepEqual(a.json(`parseAvail('10, 12,5, 15','db','kg').list`), [10, 12.5, 15]);
  assert.deepEqual(a.json(`parseAvail('4 6 8','kb','kg').list`), [4, 6, 8]);
  assert.equal(a.json(`parseAvail('абв','db','kg').bad`), true);
  assert.equal(a.json(`parseAvail('','db','kg').list`), null);
  assert.equal(a.get(`availText({u:'kg',v:[2,4,6,8,10]})`), '2–10 через 2');
  /* место без гантелей — полей нет */
  assert.equal(a.get(`placeWeightsHtml({equip:['band'],dw:null})`), '');
  assert.match(a.get(`placeWeightsHtml({equip:['db','kb']})`), /Гантели в этом месте, кг[\s\S]*Гири в этом месте, кг/);
});

/* ---------- 7. экран тренировки ---------- */
test('workout screen: reps come from the task, the hint under the weight says where the weight comes from', () => {
  const a = loadApp({lang:'ru'});
  const it = (reps, extra = '') => `(()=>{const i=${item('squat', ['bb', 'rack'])};i.rx={...i.rx,reps:'${reps}'};${extra}return i;})()`;
  a.get(`LOG.data={}`);
  assert.equal(a.get(`workoutRepsAim(${it('3')}, suggest(${it('3')}), 0)`), '3', '5×3 — 3 in the field');
  assert.equal(a.get(`workoutRepsAim(${it('8/5/3/1')}, suggest(${it('8/5/3/1')}), 3)`), '1', 'a pyramid — the number of the set');
  assert.equal(a.get(`workoutRepsAim(${it('8–12')}, suggest(${it('8–12')}), 0)`), '', 'a range without history — empty');
  a.get(`LOG.data={squat:[{d:'${day(3)}',target:2,s:[[100,9],[100,8]]}]}`);
  assert.equal(a.get(`workoutRepsAim(${it('8–12')}, suggest(${it('8–12')}), 0)`), '10', 'a range with history — the advice target');
  const hint = (from, sgx = '{}') => a.get(`workoutKgHint('${from}', ${it('8–12')}, ${sgx}, null)`);
  assert.equal(hint('plan'), 'Вес — по плану. Уточните его и введите результат.');
  assert.equal(hint('up'), 'Вес прибавлен: в прошлый раз все подходы были на верхней границе. Уточните его и введите результат.');
  assert.equal(hint('carried'), 'Вес — как в прошлом подходе. Уточните его и введите результат.');
  assert.equal(hint('deload'), 'Вес снижен по подсказке выше. Уточните его и введите результат.', 'the 4.107 text stays');
  assert.equal(hint('same', '{prev:{conv:true}}'), 'Вес — как в прошлый раз. Прошлая запись — в фунтах: вес пересчитан в килограммы до шага снаряда. Уточните его и введите результат.');
});
test('the advice weight is the weight in the field: «add to 12 kg» and 12 in the field (Дмитрий 11, Ольга 1)', () => {
  const a = loadApp({lang:'ru'});
  a.get(`Object.assign(S,{mode:'single',goal:'mass'});LOG.data={latraise:[{d:'${day(3)}',target:3,s:[[10,15],[10,15],[10,15]]}]}`);
  const sg = a.json(`(s=>({tone:s.tone,kg:s.kg}))(suggest(${item('latraise', ['db'])}))`);
  assert.equal(sg.tone, 'up'); assert.equal(sg.kg, 12);
  /* поле на экране тренировки берёт sg.kg (workoutFill): та же функция подписи говорит «прибавлен» */
  assert.match(a.get(`workoutKgHint('up', ${item('latraise', ['db'])}, suggest(${item('latraise', ['db'])}), null)`), /^Вес прибавлен/);
});

/* ---------- 8. вес плана по журналу ---------- */
test('the plan weight is offered to be updated from the log: squat plan 200, last time 215 — «Записать в план 215 кг»', () => {
  const a = loadApp({lang:'ru'});
  a.get(`(()=>{S.mode='custom';const c=customOf();c.items=[{id:'squat',sets:5,reps:'3',kg:[200],ku:'kg'}];LOG.data={squat:[{d:'${day(2)}',target:5,s:[[215,3],[215,3],[215,3],[215,3],[215,3]]}]};})()`);
  const it = `(()=>{const i=${item('squat', ['bb', 'rack'])};i.slot=0;i.rx={...i.rx,sets:5,reps:'3',kgPlan:[200],kgU:'kg'};return i;})()`;
  assert.deepEqual(a.json(`planUpOf(${it}, suggest(${it}))`), [215]);
  assert.match(strip(a.get(`planUpHtml(${it}, suggest(${it}))`)), /В прошлый раз — тяжелее, чем в плане: 215 кг вместо 200\. Записать в план 215 кг/);
  /* легче плана (разгрузка, после перерыва) — не предлагаем */
  a.get(`LOG.data={squat:[{d:'${day(2)}',target:5,s:[[180,3],[180,3]]}]}`);
  assert.equal(a.json(`planUpOf(${it}, suggest(${it}))`), null);
  /* пирамида: где тяжелее — вес прошлого раза */
  a.get(`(()=>{customOf().items=[{id:'bbbench',sets:4,reps:'8/5/3/1',kg:[60,100,140,160],ku:'kg'}];LOG.data={bbbench:[{d:'${day(2)}',target:4,s:[[60,8],[100,5],[142.5,3],[162.5,1]]}]};})()`);
  const pb = `(()=>{const i=${item('bbbench', ['bb', 'bench'])};i.slot=0;i.rx={...i.rx,sets:4,reps:'8/5/3/1',kgPlan:[60,100,140,160],kgU:'kg'};return i;})()`;
  assert.deepEqual(a.json(`planUpOf(${pb}, suggest(${pb}))`), [60, 100, 142.5, 162.5]);
  /* не свой план — не предлагаем */
  a.get(`S.mode='single'`);
  assert.equal(a.json(`planUpOf(${pb}, suggest(${pb}))`), null);
});

/* ---------- 9. разминка ---------- */
test('warm-up: the deadlift starts from the floor with standard plates (60 kg / 135 lb), no 1.25 kg plates in warm-up sets', () => {
  const a = loadApp({lang:'ru'});
  const dl = a.json(`warmupPlan(230, 'bb', '2', ${item('deadlift', ['bb'])}).map(s=>s.kg)`);
  assert.equal(dl[0], 60, 'not the empty bar from the floor');
  assert(dl.every(v => v % 5 === 0), 'steps of 5 kg: ' + dl);
  assert.match(a.get(`warmupHtml(${item('deadlift', ['bb'])}, 230)`), /Становая — с пола/);
  const bench = a.json(`warmupPlan(140, 'bb', '3', ${item('bbbench', ['bb', 'bench'])}).map(s=>s.kg)`);
  assert.equal(bench[0], 20, 'the bench press still starts with the empty bar');
  assert(bench.every(v => v % 5 === 0), 'no 1.25 plates: ' + bench);
  assert.deepEqual(a.json(`warmupPlan(60, 'bb', '5', ${item('deadlift', ['bb'])})`), [], 'working weight of 60 — nothing lighter from the floor');
  /* свои блины без 2,5 — шаг по ним */
  a.get('gearU().plates=[20,10,5]');
  assert(a.json(`warmupPlan(140, 'bb', '3', ${item('bbbench', ['bb', 'bench'])}).map(s=>s.kg)`).every(v => v % 10 === 0));
  const en = loadApp({lang:'en', nav:['en-US']});
  const lb = en.json(`warmupPlan(parseKg('315'), 'bb', '5', ${item('deadlift', ['bb'])}).map(s=>fmtKg(s.kg))`);
  assert.equal(lb[0], '135'); assert(lb.every(v => Number(v) % 10 === 5), 'bar 45 + pairs of plates of 5 lb and more: ' + lb);
});

/* ---------- 10. один счёт подходов ---------- */
test('one set count: the plan bars, the journal 7 days and «today, N sets» agree for a whole workout', () => {
  const a = loadApp({lang:'ru'});
  a.get(`Object.assign(S,{mode:'single',goal:'mass',level:'mid',count:5,groups:['quads','hams','glutes'],format:'classic',seed:3,protect:[]})`);
  const r = a.json(`(()=>{const p=buildPlan();const t=todayKey();LOG.data={};for(const it of p.items)LOG.data[it.ex.id]=[{d:t,s:Array.from({length:it.rx.sets},()=>[50,10])}];const L=muscleLoad(LOG.data,t);
    const bars=groupBars(p.gvol);return {gvol:p.gvol.glutes,journal:L.glutes.v,status:loadStatusHtml(L.glutes),bars};})()`);
  assert.equal(r.journal, r.gvol);
  assert.match(strip(r.status), new RegExp(`сегодня, ${String(r.gvol).replace('.', ',')} подход`));
  assert.match(strip(r.bars), new RegExp(`Ягодицы ${String(r.gvol).replace('.', ',')}`));
  /* ниже ориентира в журнале — «ещё N» (до нижней границы), а не «мало» */
  const row = a.get(`volRow('chest', 4, 22, '', 'st-ready', true, true)`);
  assert.match(row, /ещё 6/); assert.doesNotMatch(row, /мало/);
  assert.match(a.get(`volRow('chest', 4, 22)`), /мало/, 'the plan keeps «мало»');
});

/* ---------- 11, 12. слова ---------- */
test('«0 %» → «без изменений»; «общий вес» → «объём» in the journal, history and CSV', () => {
  const a = loadApp({lang:'ru'});
  a.get(`LOG.data={rollout:[{d:'${day(3)}',s:[[null,8],[null,8]]},{d:'${day(1)}',s:[[null,8],[null,8]]}]}`);
  const v = strip(a.get('journalVal(EXI.rollout, LOG.data.rollout)'));
  assert.match(v, /8 повт\. без изменений/); assert.doesNotMatch(v, /0%/);
  a.get(`LOG.data={bbbench:[{d:'${day(1)}',s:[[100,5],[100,5]]}]}`);
  assert.match(strip(a.get('histHtml(EXI.bbbench)')), /объём 1\s000 кг/);
  assert.match(a.get('csvText()'), /Объём за подход, кг/);
  assert.doesNotMatch(a.get('daysHtml()'), /общий вес/);
  const en = loadApp({lang:'en', nav:['en-US']});
  en.get(`LOG.data={bbbench:[{d:'${day(1)}',s:[[parseKg('225'),5]]}]}`);
  assert.match(strip(en.get('histHtml(EXI.bbbench)')), /volume 1,125 lb/);
  assert.match(en.get('csvText()'), /"Volume per set, lb"/);
});
