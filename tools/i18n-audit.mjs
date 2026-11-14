/* Проверка английской сборки: проходит по экранам приложения и ищет кириллицу в тексте и подписях.
   node tools/i18n-audit.mjs [--full] [--json out.json]   — нужен собранный dist/ (npm run build).
   По умолчанию рисунки движений заменены заглушками (текст от них не зависит) — проверка идёт около минуты;
   --full рисует настоящие фигуры и 3D (около 20 минут).
   Экраны: мастер первого запуска и время тренировки, план (форматы × цели × уровни, разовая и недельная, места и замены), атлас мышц (все мышцы × места),
   журнал с записями, разбор каждого упражнения в четырёх положениях, режим тренировки, тексты копирования; планы и места,
   созданные в русской версии (имена по умолчанию). */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fileArg = process.argv.indexOf('--file'), file = fileArg > 0 ? path.resolve(process.argv[fileArg + 1]) : path.join(root, 'dist/lazy-gym-planner-offline-en.html');
if (!fs.existsSync(file)) { console.error('Нет dist/lazy-gym-planner-offline-en.html — сначала npm run build'); process.exit(2); }

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
/* свой контекст: в шаге 9 в нём открываются ещё страницы (русский и английский офлайн-файлы делят localStorage) */
const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file://' + file);
await page.waitForTimeout(600);
const FULL = process.argv.includes('--full');
if (!FULL) await page.evaluate(() => {
  const fake = (anim, opts = {}) => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'fig'); return { svg, camera: opts.camera || 'side', at() {}, setTrace() {}, setVectors() {}, setJoints() {}, setStress() {}, setMuscles() {}, setRegion() {}, dispose() {} }; };
  window.buildFigure = fake; window.createMotionFigure = fake;
});

const found = new Map();
/* inputs — проверять и значения текстовых полей (имена по умолчанию в полях «Name»); в остальных шагах там имена и запросы
   поиска, вписанные проверкой, — их не проверяем */
async function scan(state, extra = '', pg = page, inputs = false) {
  const hits = await pg.evaluate(({ extra, inputs }) => {
    const CYR = /[А-Яа-яЁё]/, out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || ['SCRIPT', 'STYLE'].includes(p.tagName)) continue;
      if (CYR.test(n.nodeValue)) out.push({ text: n.nodeValue.trim().slice(0, 160), where: p.tagName.toLowerCase() + (p.id ? '#' + p.id : '') + (p.className && typeof p.className === 'string' ? '.' + p.className.split(' ')[0] : '') });
    }
    for (const el of document.querySelectorAll('*')) for (const a of ['aria-label', 'title', 'placeholder', 'alt', 'aria-valuetext', 'aria-description', 'label', 'value'])
      if (el.hasAttribute(a) && CYR.test(el.getAttribute(a)) && !(a === 'value' && el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search') && !inputs)) out.push({ text: `[${a}] ` + el.getAttribute(a).slice(0, 160), where: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') });
    if (inputs) for (const el of document.querySelectorAll('input, textarea, option')) if (CYR.test(el.value || '')) out.push({ text: '[value] ' + el.value.slice(0, 160), where: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') });
    if (extra) for (const line of extra.split('\n')) if (CYR.test(line)) out.push({ text: line.slice(0, 160), where: 'text-export' });
    return out;
  }, { extra, inputs });
  for (const h of hits) { if (/^\[title\] Русская версия$/.test(h.text)) continue; /* название языка на нём самом */ const k = h.text; if (!found.has(k)) found.set(k, { ...h, state }); }
}
const run = js => page.evaluate(js);
const t0 = Date.now(), step = name => { if (process.env.I18N_AUDIT_VERBOSE) console.error(`${((Date.now() - t0) / 1000).toFixed(1)} с · ${name}`); };

/* 0. мастер первого запуска (11k-first-run.js): все шаги и подписи; после «Показать план» — время тренировки в параметрах
   и предупреждения, когда время не уложилось; дальше — как раньше, без времени (число упражнений из «Exercises») */
step('0. первый запуск');
await scan('first run: where');
await page.click('[data-fr-place="home"]'); await scan('first run: equipment');
await page.click('[data-fr-eq="db"]'); await page.click('[data-fr-eq="band"]'); await page.click('[data-fr-eq="abwheel"]'); await scan('first run: nothing checked');
await page.click('#fr-next'); await scan('first run: goal');
await page.click('[data-fr-goal="gentle"]'); await page.click('[data-fr-dur="short"]'); await page.click('[data-fr-level="beg"]'); await page.click('[data-fr-protect="knees"]');
await scan('first run: time and experience');
await page.click('#fr-next'); await page.waitForTimeout(200);
await run(`(()=>{setSetupFold(false);})()`); await scan('first run: plan after');
for (const dur of ['short', 'mid', 'long']) for (const mode of ['single', 'program']) {
  await run(`(()=>{S.dur='${dur}';S.mode='${mode}';regen();})()`); await scan(`time ${dur} ${mode}`, await run('planText()'));
}
await run(`(()=>{setSetupFold(true);S.mode='single';regen();})()`); await scan('time: folded settings');
/* время не уложилось: не хватило упражнений, новичку больше не прибавляем, короче не получается */
await run(`(()=>{S.place='street';ensurePlaces(S);Object.assign(S,{groups:['quads','glutes','hams','calves'],protect:['knees','lumbar'],goal:'cut',level:'mid',dur:'long'});regen();})()`); await scan('time: not enough exercises');
await run(`(()=>{S.place='gym';ensurePlaces(S);Object.assign(S,{groups:['chest','back','shoulders','quads','hams','glutes','abs'],protect:[],goal:'cut',level:'beg',format:'superset',dur:'long'});regen();})()`); await scan('time: beginner cap');
await scan('time: too long', await run(`durationWarn({minutes:34,fit:{ok:false,dur:'short',why:'long'}})`));
await run(`(()=>{Object.assign(S,{dur:null,protect:[],format:'classic',groups:['chest','back','shoulders'],count:6});setSetupFold(false);regen();})()`);

/* 1. план: форматы, цели, уровни; разовая тренировка и неделя */
step('1. план');
for (const mode of ['single', 'program']) for (const format of ['classic', 'superset', 'circuit', 'static']) for (const goal of ['strength', 'mass', 'cut', 'gentle']) for (const level of ['beg', 'adv']) {
  await run(`(()=>{Object.assign(S,{view:'plan',mode:'${mode}',format:'${format}',goal:'${goal}',level:'${level}',week:1,day:0});regen();})()`);
  await scan(`plan ${mode}/${format}/${goal}/${level}`, await run('planText()'));
  if (mode === 'program') for (const week of [2, 3, 4]) for (const day of [0, 1, 2]) {
    await run(`(()=>{S.week=${week};S.day=${day};done={};renderPlan();})()`);
    await scan(`program week ${week} day ${day}`, await run('planText()'));
  }
}
/* свёрнутые параметры, нагрузка и карточки: строки-сводки во всех режимах */
step('свёрнутые блоки');
for (const mode of ['single', 'program', 'custom']) {
  await run(`(()=>{Object.assign(S,{view:'plan',mode:'${mode}',format:'classic',goal:'mass',level:'mid',week:1,day:0});S.fold={setup:true,load:true,cards:'compact'};regen();})()`);
  await scan('folded ' + mode);
}
await run(`(()=>{S.fold={setup:false,load:false,cards:'compact'};S.mode='single';regen();})()`);
/* хваты: переключатель в карточке и записи другим хватом в истории */
step('хваты');
await run(`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};LOG.data.pullup=[{d:d(4),s:[[null,8],[null,7]]}];
  Object.assign(S,{view:'plan',mode:'custom',goal:'mass',format:'classic'});S.customs=[{id:'v1',name:'Grips',items:[{id:'chinup'},{id:'pushup'},{id:'dbcurl'},{id:'bbbench'}]}];S.custom='v1';ensureCustoms(S);openCustom('v1');regen();
  document.querySelectorAll('[data-hist]').forEach(b=>b.click());})()`);
await scan('grip switches and other-grip history');
await run(`(()=>{delete LOG.data.pullup;S.customs=[];S.custom=null;ensureCustoms(S);S.mode='single';regen();})()`);
/* бережный режим: все суставы, замены в своём плане, то, что нечем заменить, пометки в атласе */
step('бережный режим');
await run(`(()=>{Object.assign(S,{view:'plan',mode:'single',format:'classic',goal:'gentle',level:'mid',groups:['quads','glutes','hams','calves'],protect:PROTECT.map(p=>p.id)});S.fold.gentle=false;regen();})()`);
await scan('gentle, every joint protected', await run('planText()'));
await run(`(()=>{S.protect=['knees'];S.mode='program';regen();})()`);
await scan('gentle program');
await run(`(()=>{S.mode='custom';S.goal='mass';S.customs=[{id:'g1',name:'Legs',items:[{id:'squat'},{id:'legext'},{id:'jumpsquat'},{id:'dbbench'}]}];S.custom='g1';ensureCustoms(S);openCustom('g1');S.protect=PROTECT.map(p=>p.id);regen();cpTab='groups';renderPlan();})()`);
await scan('custom plan with joint swaps and losses', await run('planText()'));
await run(`(()=>{S.view='atlas';S.atlasM='quads';renderSetup();renderPlan();})()`);
await scan('atlas with protected joints');
await run(`(()=>{S.view='plan';S.mode='single';S.goal='mass';S.protect=[];S.customs=[];S.custom=null;ensureCustoms(S);cpTab=null;regen();})()`);
/* группы мышц и количество упражнений */
step('группы мышц');
for (const groups of [['quads', 'glutes', 'hams', 'calves'], ['biceps', 'triceps', 'forearms'], ['abs', 'cardio'], []]) {
  await run(`(()=>{Object.assign(S,{mode:'single',format:'classic',goal:'mass',level:'mid',groups:${JSON.stringify(groups)}});regen();})()`);
  await scan('groups ' + groups.join(','));
}
/* 2. места, замены, удаление, оборудование */
step('2. места');
await run(`(()=>{Object.assign(S,{groups:['chest','back','shoulders','biceps'],place:'home',adapt:'gym'});ensurePlaces(S);regen();})()`);
await scan('home adapted from gym', await run('planText()'));
await run(`(()=>{Object.assign(S,{place:'street',adapt:'gym'});ensurePlaces(S);regen();})()`);
await scan('street adapted from gym');
await run(`(()=>{placeDel=true;eqOpen=true;renderSetup();})()`);
await scan('place delete armed, equipment open');
await run(`(()=>{placeDel=false;S.place='gym';S.adapt=null;ensurePlaces(S);setFocus('biceps');regen();})()`);
await scan('focus chip');
await run(`(()=>{setFocus(null);regen();})()`);
/* «Заменить»: список замен (с меткой пиковой нагрузки), «Близких замен нет», строка «Заменено … Вернуть» */
step('2a. замены');
await run(`(()=>{Object.assign(S,{groups:['chest','back','shoulders']});regen();document.querySelector('.card [data-swap]').click();})()`);
await scan('swap list');
await run(`(()=>{document.querySelector('.sw-pick [data-swap-to]').click();})()`);
await scan('swapped, undo line');
await run(`(()=>{S.place='street';ensurePlaces(S);regen();const it=plan.items.find(x=>x.ex.id==='pullup')||plan.items[0];document.querySelector('.card[data-slot="'+it.slot+'"] [data-swap]').click();})()`);
await scan('swap list without close swaps');
await run(`(()=>{Object.assign(S,{place:'home',goal:'gentle',protect:['knees'],groups:['quads','glutes','hams']});ensurePlaces(S);regen();const box=document.getElementById('sw-pick-0');box.innerHTML=swapPickHtml({ex:EXI.goblet,slot:0,name:''});box.hidden=false;})()`);
await scan('swap list: nothing in gentle mode');
await run(`(()=>{Object.assign(S,{place:'gym',goal:'mass',protect:[]});ensurePlaces(S);regen();})()`);
/* свой план: пустой, с правкой подходов, список «по мышцам» целиком, все форматы, место без инвентаря */
step('2b. свой план');
await run(`(()=>{Object.assign(S,{view:'plan',mode:'custom',format:'classic',goal:'mass',level:'mid',groups:['chest','back','shoulders']});S.fav=['bbbench','latpull','squat'];S.customs=[];S.custom=null;ensureCustoms(S);cpTab=null;regen();})()`);
await scan('custom empty');
await run(`(()=>{S.customs[0].items=[{id:'bbbench',sets:5,reps:'5',rest:180},{id:'dbfly'},{id:'ohp'},{id:'latpull'}];cpOpen=new Set([0,1]);regen();})()`);
await scan('custom plan', await run('planText()'));
await run(`(()=>{document.querySelector('.card[data-slot="1"] [data-cp-rm]').click();})()`);
await scan('custom plan: removed, undo line');
await run(`(()=>{document.querySelector('[data-rm-undo]').click();})()`);
await run(`(()=>{cpTab='groups';renderPlan();document.querySelectorAll('[data-cp-more]').forEach(b=>b.click());})()`);
await scan('custom add by muscles');
/* поиск в «Добавить упражнение»: найденное, другая раскладка, опечатка, пусто с похожими */
for (const q of ['bench', 'ыйгфе', 'squot', 'pressss', 'zzzz']) { await run(`(()=>{cpQ=${JSON.stringify(q)};renderPlan();document.querySelectorAll('[data-cp-more]').forEach(b=>b.click());})()`); await scan('custom add, search ' + q); }
await run(`(()=>{cpQ='';renderPlan();})()`);
for (const format of ['superset', 'circuit', 'static']) { await run(`(()=>{S.format='${format}';cpOpen=new Set([0]);regen();})()`); await scan('custom ' + format, await run('planText()')); }
/* вес по подходам, темп, заметки, «о плане»; подсказка «вес по плану» в журнале карточки */
await run(`(()=>{S.format='classic';const c=S.customs[0];Object.assign(c,{group:'Block A',for:'Sam',note:'No failure'});
  c.items[0]={id:'bbbench',sets:4,kg:[60,62.5,65],tempo:'4-1-1-0',note:'Pause'};c.items[1]={id:'dbfly',kg:[14]};
  S.customs.push({id:'c3',name:'Lower',group:'Block A',items:[{id:'squat'}]});cpOpen=new Set([0,1]);regen();
  document.querySelectorAll('.cp-about').forEach(d=>d.open=true);document.querySelectorAll('[data-hist]').forEach(b=>b.click());})()`);
await scan('custom with weights, tempo and notes', await run('planText()'));
/* окно выгрузки: все варианты, копирование */
await page.click('#plan-export'); await page.waitForTimeout(120);
await scan('export dialog');
await run(`document.querySelector('#po-copy').click()`); await page.waitForTimeout(200);
await scan('export copied');
await run(`(()=>{document.querySelector('#po-for').value='';document.querySelector('#plan-out').close();})()`);
await run(`(()=>{const c=S.customs.find(p=>p.id==='c3');c.items=[];S.custom='c3';regen();openPlanOut();document.querySelector('#po-save').click();})()`); await page.waitForTimeout(120);
await scan('export of an empty plan');
await run(`(()=>{document.querySelector('#plan-out').close();S.custom=S.customs[0].id;regen();})()`);
/* окно загрузки: пустое, просмотр файла с предупреждениями, ошибки, добавление */
await run(`document.querySelector('[data-cp-import]').click()`); await page.waitForTimeout(100);
await scan('import dialog');
const readPasted = text => page.evaluate(t => { document.querySelector('#pi-text').value = t; document.querySelector('#pi-read').click(); }, text);
await readPasted(JSON.stringify({ format: 'lazy-gym-planner/plans', version: 9, from: 'Coach', note: 'Week 1', plans: [
  { name: 'Upper', group: 'Block B', for: 'Sam', goal: 'strength', format: 'superset', level: 'adv', items: [{ id: 'bbbench', sets: 4, reps: '5', kg: 80 }, { id: 'teleport', name: 'Teleport' }] },
  ...Array.from({ length: 51 }, (_, i) => ({ name: 'P' + i, items: [{ id: 'squat' }] }))] }));
await scan('import preview with warnings');
await run(`(()=>{document.querySelectorAll('[data-pi]').forEach(x=>x.checked=false);document.querySelector('#pi-add').click();})()`);
await scan('import nothing picked');
for (const bad of ['', '{"plans":[', JSON.stringify(await run('backupObject()')), '{"format":"other","plans":[]}', '{"plans":[]}', ' '.repeat(300 * 1024)]) { await readPasted(bad); await scan('import error'); }
await readPasted(JSON.stringify({ format: 'lazy-gym-planner/plans', version: 1, plans: [{ name: 'Upper', items: [{ id: 'bbbench' }] }] }));
await run(`document.querySelector('#pi-add').click()`); await page.waitForTimeout(100);
await scan('imported plan opened');
await run(`(()=>{S.format='classic';S.place='street';ensurePlaces(S);regen();})()`);
await scan('custom on the street');
await run(`(()=>{S.customs.push({id:'c2',name:'Legs',items:[]});S.custom='c2';cpDel=true;renderSetup();})()`);
await scan('custom second plan, delete armed');
await run(`(()=>{cpDel=false;S.customs=S.customs.slice(0,1);S.custom=S.customs[0].id;S.place='gym';ensurePlaces(S);S.mode='single';cpTab=null;regen();})()`);
/* замены в карточке до исчерпания */
for (let i = 0; i < 6; i++) { const b = await page.$('[data-swap]'); if (!b) break; await b.click(); await page.waitForTimeout(80); }
await scan('swaps');
/* сохранение собранной тренировки и недели в свои планы */
await run(`(()=>{regen();document.querySelector('#save-plan').click();})()`);
await scan('saved a workout as a plan');
await run(`(()=>{Object.assign(S,{mode:'program',days:3,week:2,day:0});regen();document.querySelector('#save-plan').click();})()`);
await scan('saved a week as plans');
await run(`(()=>{S.customs=S.customs.slice(0,1);S.custom=S.customs[0].id;S.mode='single';regen();})()`);
/* 3. атлас мышц */
step('3. атлас');
await run(`(()=>{S.view='atlas';renderSetup();renderPlan();})()`);
for (const place of ['gym', 'home', 'street']) for (const m of await run('ATLAS_ORDER')) {
  await run(`(()=>{S.place='${place}';ensurePlaces(S);S.atlasM='${m}';atlasEx=null;renderAtlas();document.querySelectorAll('.at-more').forEach(n=>n.hidden=false);document.querySelectorAll('.at-other').forEach(d=>d.open=true);const a=document.querySelector('#at-keep [data-cp-add]');if(a)a.click();})()`);
  await scan(`atlas ${place}/${m}`);
}
await run(`(()=>{S.place='gym';ensurePlaces(S);})()`);
/* «+ В свой план» с выбором плана: список, «добавлено», «уже в плане», новый план, полный план — в атласе и в разборе */
const pick = (box, id) => run(`(()=>{const b=document.querySelector('${box}').parentElement.querySelector('[data-cp-add]');if(b.getAttribute('aria-expanded')!=='true')b.click();document.querySelector('${box} [data-cp-to="${id}"]').click();})()`);
await run(`(()=>{S.customs.push({id:'pk2',name:'Lower',group:'Block A',items:[]});S.atlasM='chest';atlasEx=null;renderAtlas();document.querySelector('#at-keep [data-cp-add]').click();})()`);
await scan('atlas plan picker');
await pick('#cp-pick-at', 'pk2'); await scan('atlas picker: added');
await pick('#cp-pick-at', 'pk2'); await scan('atlas picker: already in plan');
await pick('#cp-pick-at', ''); await scan('atlas picker: new plan');
await run(`(()=>{S.customs.find(p=>p.id==='pk2').items=EX.slice(0,CUSTOM_MAX).map(e=>({id:e.id}));openMotionItem(previewItem(EX.at(-1).id));document.querySelector('#mv-tools [data-cp-add]').click();})()`);
await scan('motion plan picker, full plan');
await pick('#cp-pick-mv', 'pk2'); await scan('motion picker: plan is full');
await run(`(()=>{closeMotion();S.customs=S.customs.slice(0,1);S.custom=S.customs[0].id;S.cpLast=null;})()`);
/* 4. журнал с записями: вес, вес тела, время, статодинамика, замеры */
step('4. журнал');
await run(`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};
  LOG.data.bbbench=[{d:d(14),s:[[60,8],[60,8]],target:2},{d:d(7),s:[[62.5,8],[62.5,7]],target:2,wk:2},{d:d(3),s:[[35,7],[35,7],[35,6]],target:3,fmt:'static'}];
  LOG.data.pushup=[{d:d(10),s:[[null,15],[null,12]]},{d:d(4),s:[[null,18],[null,14]]}];
  LOG.data.plank=[{d:d(6),s:[[null,45],[null,40]]}];
  S.view='journal';renderSetup();renderPlan();})()`);
await scan('journal');
await run(`(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);})()`);
await scan('journal expanded');
/* 4б. загрузка мышц по журналу: «сегодня / вчера / позавчера», тренировка на сегодня с объяснением, всё нагружено, пустая неделя */
step('4б. загрузка мышц');
await run(`(()=>{const d=n=>{const x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()-n);return dayKey(x);};window.__log=JSON.parse(JSON.stringify(LOG.data));
  LOG.data.latpull=[{d:d(1),s:[[50,10],[50,10],[50,10]]}];LOG.data.squat=[{d:d(2),s:[[80,8],[80,8],[80,8]]}];LOG.data.bbcurl=[{d:d(0),s:[[20,10],[20,10]]}];
  S.view='journal';renderSetup();renderPlan();document.querySelectorAll('#ml details').forEach(x=>x.open=true);})()`);
await scan('journal muscle load');
await run(`document.querySelector('[data-logpick="journal"]').click()`);
await scan('plan from log', await run('planText()'));
await run(`(()=>{LOG.data={};for(const id of ['bbbench','latpull','ohp','bbcurl','pushdown','wristcurl','crunch','hipthrust','legext','legcurl','calfraise'])LOG.data[id]=[{d:todayKey(),s:[[20,10],[20,10]]}];
  S.view='journal';renderSetup();renderPlan();document.querySelector('[data-logpick="journal"]').click();})()`);
await scan('journal, every group fatigued');
await run(`(()=>{S.view='plan';S.mode='single';renderSetup();renderPlan();document.querySelector('.pre-log').click();})()`);
await scan('plan setup, every group fatigued');
await run(`(()=>{LOG.data={bbbench:[{d:'2020-01-06',s:[[50,8],[50,8]]}]};S.view='journal';renderSetup();renderPlan();})()`);
await scan('journal, nothing in 7 days');
await run(`(()=>{LOG.data=window.__log;})()`);
/* 5. план с историей: карточки, история, разминка, подсказки */
step('5. план с историей');
await run(`(()=>{Object.assign(S,{view:'plan',mode:'single',format:'classic',groups:['chest','triceps'],count:6});regen();document.querySelectorAll('[data-hist]').forEach(b=>b.click());document.querySelectorAll('details').forEach(d=>d.open=true);})()`);
await scan('plan with history');
await run(`(()=>{S.format='static';regen();document.querySelectorAll('[data-hist]').forEach(b=>b.click());})()`);
await scan('static plan with history');
/* 6. разбор каждого упражнения в четырёх положениях */
step('6. разбор');
const ids = await run('EX.map(e=>e.id)');
for (const id of ids) {
  await run(`openMotionItem(previewItem('${id}'))`);
  for (const pose of ['start', 'middle', 'end', 'return']) { await run(`document.querySelector('[data-mv-pose="${pose}"]').click()`); await scan(`motion ${id} ${pose}`); }
  await run('closeMotion()');
}
/* 6б. витрина атласа: все фильтры «Чем работать», недоступные упражнения в другом месте, поиск (пусто, раскладка, опечатки,
   фильтр), «+» на плитке с выбором плана и сообщением */
step('6б. витрина');
await run('openGallery()');
for (const k of ['all', 'free', 'mach', 'band', 'body']) { await run(`document.querySelector('[data-gallery-kind="${k}"]').click()`); await scan(`gallery ${k}`); }
await run(`(()=>{S.place='home';ensurePlaces(S);gallery.kind='all';renderGallery();})()`);
await scan('gallery home, unavailable tiles');
await run(`(()=>{gallery.here=true;renderGallery();})()`);
await scan('gallery home, only available');
await run(`(()=>{gallery.here=false;gallery.q='zzz';renderGallery();})()`);
await scan('gallery empty search');
/* поиск: другая раскладка, опечатка, пусто с похожими, пусто из-за фильтра; «+» на плитке — выбор плана и сообщение */
for (const q of ['ыйгфе', 'squot', 'pressss']) { await run(`(()=>{gallery.q=${JSON.stringify(q)};renderGallery();})()`); await scan('gallery search ' + q); }
await run(`(()=>{S.place='gym';ensurePlaces(S);gallery.kind='band';gallery.q='bench press';renderGallery();})()`);
await scan('gallery search, nothing with the filter');
await run(`(()=>{gallery.kind='all';gallery.q='squat';renderGallery();document.querySelector('[data-gadd="squat"]').click();})()`);
await scan('gallery: + on a tile, choose a plan');
await run(`(()=>{document.querySelector('#mv-gpick [data-cp-to=""]').click();})()`);
await scan('gallery: added to a new plan');
await run(`(()=>{document.querySelector('[data-gadd="squat"]').click();document.querySelector('#mv-gpick [data-cp-to]').click();})()`);
await scan('gallery: added / already in plan');
await run(`(()=>{gallery.q='';S.place='gym';ensurePlaces(S);renderGallery();document.querySelector('[data-gallery-open]').click();})()`);
await scan('gallery → detail');
await run('closeMotion()');
/* 7. режим тренировки и отдых */
step('7. режим');
await run(`(()=>{S.format='classic';regen();})()`);
await page.click('#start-workout'); await page.waitForTimeout(300);
await scan('workout');
await run(`(()=>{startRest(90);})()`);
await scan('rest timer');
await run(`(()=>{closeWorkout&&closeWorkout();stopRest();})()`);
/* таймер удержания (планка, боковая планка), отдых после нуля, таймер в плане сверх отдыха — часы подделаны */
await run(`(()=>{const base=Date.now();window.__dt=0;Date.now=()=>base+window.__dt;
  S.customs=[{id:'i18n-hold',name:'Hold',items:[{id:'plank',sets:1},{id:'sideplank',sets:1},{id:'pushup',sets:1}]}];S.custom='i18n-hold';S.mode='custom';ensureCustoms(S);openCustom('i18n-hold');LOG.data={};regen();
  document.querySelector('#start-workout').click();})()`);
await scan('hold timer idle');
const tickBy = ms => run(`(()=>{window.__dt+=${ms};workoutTick();})()`);
await page.click('#wv-hold-go'); await scan('hold 3-2-1');
await tickBy(3000 + 10000); await scan('hold to target');
await tickBy(30000); await scan('hold over target');
await page.click('#wv-hold-go'); await scan('rest after hold');
await tickBy(200000); await scan('rest overtime');
await page.click('#wv-continue');
await page.click('#wv-hold-go'); await tickBy(3000 + 35000); await page.click('#wv-hold-go'); await scan('side plank switch');
await tickBy(10000 + 33000); await scan('side plank right');
await page.click('#wv-hold-go'); await scan('side plank recorded');
await run(`(()=>{closeWorkout();S.mode='single';regen();startRest(30);window.__dt+=45000;tick();})()`);
await scan('plan rest timer overtime');
await run(`(()=>{stopRest();})()`);
/* 7а. тренировка без потерь (14a-workout-flow.js): «Продолжить тренировку →» и сколько сделано, время в тренировке, пауза
   отдыха, спокойный конец отдыха, «Пропустить» и «Заменить» в тренировке, итоги с пропущенным и заменённым, вопрос о
   тренировке прошлого дня и её «Закончить» */
step('7а. продолжение, пропуск, замена');
await run(`(()=>{localStorage.removeItem('podhod.workout.v3');S.customs=[{id:'i18n-wf',name:'Flow',items:[{id:'declinepike',sets:2},{id:'dbbench',sets:2},{id:'dbrow',sets:1}]}];S.custom='i18n-wf';S.mode='custom';ensureCustoms(S);openCustom('i18n-wf');LOG.data={};regen();
  document.querySelector('#start-workout').click();})()`);
await page.fill('#wv-reps', '8'); await page.click('#wv-done'); await tickBy(10000);
await page.click('#wv-rest-pause'); await scan('workout flow: rest paused');
await page.click('#wv-rest-pause'); await tickBy(600000); await scan('workout flow: rest over, calm');
await page.click('#wv-close'); await scan('plan: continue workout');
await page.click('#start-workout'); await page.click('#wv-continue');
await page.click('#wv-skip'); await scan('workout flow: skipped');
await page.click('#wv-unskip'); await page.click('#wv-swap'); await scan('workout flow: swap list');
await run(`(()=>{document.querySelector('#wv-swap-pick [data-wv-swap]').click();})()`); await scan('workout flow: swapped');
await run(`(()=>{const id=workout.queue.at(-1).it.ex.id;workout.skipped.push(id);workoutOptions();workoutFinish();})()`); await scan('workout flow: summary with skipped and swapped');
await run(`(()=>{closeWorkout();const d=new Date();d.setDate(d.getDate()-1);const y=dayKey(d),q=workoutQueue(plan);LOG.data={[q[0].it.ex.id]:[{d:y,s:[[null,8]]}]};
  localStorage.setItem('podhod.workout.v3',JSON.stringify({stamp:workoutStamp(q),day:y,days:[y],done:1,total:q.length}));regen();})()`);
await scan('plan: yesterday not finished');
await run(`(()=>{const d=new Date();d.setDate(d.getDate()-3);const y=dayKey(d);const o=JSON.parse(localStorage.getItem('podhod.workout.v3'));o.day=y;o.days=[y];LOG.data={};localStorage.setItem('podhod.workout.v3',JSON.stringify(o));
  S.customs.find(c=>c.id==='i18n-wf').items=[{id:'squat'}];regen();})()`);
await scan('plan: older workout, plan changed');
await page.click('[data-wip="end"]'); await scan('plan: workout finished from the question');
await run(`(()=>{localStorage.removeItem('podhod.workout.v3');LOG.data={};S.customs=S.customs.filter(c=>c.id!=='i18n-wf');ensureCustoms(S);S.mode='single';regen();})()`);
/* 7б. вес гантелей и стороны: «вес одной гантели», «×2», «Л/П отдельно» в карточке и в тренировке, общий вес после
   подхода и в итогах, слабая сторона, журнал с последними тренировками и «Л … · П …», таблица для Excel */
step('7б. гантели и Л/П');
await run(`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()-n);return dayKey(x);};
  S.customs=[{id:'i18n-db',name:'DB',items:[{id:'dbbench',sets:1},{id:'dbrow',sets:2},{id:'sideplank',sets:1},{id:'lunge',sets:1}]}];S.custom='i18n-db';S.mode='custom';S.lr={dbrow:true,sideplank:true};ensureCustoms(S);openCustom('i18n-db');
  LOG.data={dbbench:[{d:d(3),eq:'db',s:[[20,10],[20,8]]}],dbrow:[{d:d(3),eq:'db',s:[[30,8,null,{l:[30,10],r:[30,8]}],[30,8,90,{l:[30,9],r:[30,8]}]]}],sideplank:[{d:d(3),s:[[null,35,null,{l:[null,42],r:[null,35]}]]}]};
  regen();document.querySelectorAll('[data-cfold="log"]').forEach(b=>{if(b.getAttribute('aria-expanded')!=='true')b.click();});document.querySelectorAll('[data-hist]').forEach(b=>b.click());})()`);
await scan('dumbbell cards with L/R', await run(`[weightLabel({...previewItem('farmer'),eqIds:['kb']}).full,weightLabel({...previewItem('goblet'),eqIds:['kb']}).full,weightLabel({...previewItem('goblet'),eqIds:['kb']}).short,weightLabel({...previewItem('dbrow'),eqIds:['db','bench']}).full].join('\\n')`));
await page.click('#start-workout'); await page.waitForTimeout(200);
await page.fill('#wv-kg', '20'); await page.fill('#wv-reps', '10'); await scan('workout: one dumbbell of two');
await page.click('#wv-done'); await scan('rest note with total weight');
await page.click('#wv-continue'); await scan('workout: L/R fields');
await page.fill('#wv-reps-l', '10'); await page.fill('#wv-reps-r', '8'); await page.click('#wv-done'); await scan('rest note with the weaker side');
await run(`(()=>{workoutFinish();})()`); await scan('finish with total weight');
await run(`(()=>{closeWorkout();S.view='journal';renderSetup();renderPlan();document.querySelectorAll('details').forEach(x=>x.open=true);})()`);
await scan('journal with L/R and total weight', await run('csvText()'));
await run(`(()=>{S.lr={};S.view='plan';S.mode='single';regen();})()`);
/* 7в. вес под вопросом, пирамида, «сегодня»: вопрос «Записать / Исправить» в карточке и в тренировке, пирамида повторов
   своего плана, совет по верхнему подходу (все ветки — текстами), «Сегодня: 1 из 3», первая запись с запасом из строки
   нагрузки (все цели), журнал «вес × повторы» и график повторов при одном весе */
step('7в. вес, пирамида, сегодня');
await run(`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()-n);return dayKey(x);};
  S.customs=[{id:'i18n-pyr',name:'Pyr',items:[{id:'bbbench',sets:4,reps:'10/8/6/5'},{id:'squat',sets:4},{id:'dbbench',sets:3},{id:'latpull',sets:3,reps:'12/10/8',kg:[40,45,50]}]}];S.custom='i18n-pyr';S.mode='custom';ensureCustoms(S);openCustom('i18n-pyr');
  LOG.data={squat:[{d:d(9),s:[[60,10],[80,8],[90,6],[100,5]]},{d:d(2),s:[[60,10],[80,8],[90,6],[100,5]]}],bbbench:[{d:d(2),s:[[60,10],[60,8],[60,5],[60,5]]}],dbcurl:[{d:d(9),s:[[5,12],[5,12]]},{d:d(2),s:[[5,15],[5,14]]}]};
  todaySession('dbbench',true).s=[[20,10]];cpOpen=new Set([0]);
  regen();document.querySelectorAll('[data-cfold="log"]').forEach(b=>{if(b.getAttribute('aria-expanded')!=='true')b.click();});})()`);
const sugTexts = () => run(`(()=>{const it=plan.items.find(x=>x.ex.id==='squat'),y=dayKey(new Date(Date.now()-864e5)),out=[],keep=JSON.parse(JSON.stringify(LOG.data));
  const at=(s,extra)=>{LOG.data={squat:[{d:'2020-01-01',s:[[60,8],[80,8],[100,4],[100,4]]},{d:y,s}]};Object.assign(it.rx,extra||{});out.push(suggest(it).text);};
  at([[60,10],[80,8],[90,6],[100,10]]);at([[60,10],[80,8],[100,10],[100,10]]);at([[60,10],[80,8],[100,7],[100,8]]);at([[60,10],[80,8],[100,4],[100,4]]);at([[60,10],[80,8],[100,4]]);
  AR.light=true;at([[60,10],[80,8],[90,6],[100,5]]);AR.light=false;
  const S0={...S};Object.assign(S,{mode:'program',week:4});at([[60,10],[80,8],[90,6],[100,5]]);Object.assign(S,{mode:S0.mode,week:S0.week});
  const rx=it.rx.reps;it.rx.reps='10/8/6/5';at([[60,10],[60,8],[60,6],[60,5]]);at([[60,8],[60,8],[60,6],[60,5]]);LOG.data={squat:[{d:'2020-01-01',s:[[60,8],[60,8],[60,6],[60,4]]},{d:y,s:[[60,8],[60,8],[60,6],[60,4]]}]};out.push(suggest(it).text);it.rx.reps=rx;
  for(const [id,eq] of [['dbbench',['db','bench']],['kbswing',['kb']],['bbbench',['bb','bench']],['legpress',['legpress']],['latpull',['cable']],['pullup',['bar']],['assistpull',['gravitron']]]){LOG.data={};out.push(kgDoubt({...previewItem(id),eqIds:eq},[5000],0)?.text||'');}
  LOG.data={squat:[{d:y,s:[[50,10]]}]};out.push(kgDoubt(it,[5000],0).text);LOG.data={squat:[{d:todayKey(),s:[[50,10]]}]};out.push(kgDoubt(it,[5000],1).text);
  for(const goal of ['strength','mass','cut','gentle'])for(const level of ['beg','mid'])for(const mode of ['custom','program'])for(const week of [1,2,3,4]){Object.assign(S,{goal,level,mode,week});LOG.data={};
    for(const id of ['squat','dbcurl','assistpull'])out.push(suggest({...previewItem(id),eqIds:id==='assistpull'?['gravitron']:id==='dbcurl'?['db']:['bb','rack']}).text);out.push(WEEKS[week-1].note);}
  Object.assign(S,S0);LOG.data=keep;return out.join('\\n');})()`);
await scan('pyramid, today, plan reps', await sugTexts());
await run(`(()=>{const i=document.querySelector('.card[data-ex="dbbench"] .lt-r[data-k="1"] [data-f="kg"]');i.value='5000';logKgInput(i);document.querySelector('.card[data-ex="dbbench"] [data-tick][data-k="1"]').click();})()`);
await scan('card: weight question');
await run(`(()=>{document.querySelector('.card[data-ex="dbbench"] [data-kgfix]').click();})()`);
await page.click('#start-workout'); await page.waitForTimeout(200);
await run(`(()=>{const i=workout.queue.findIndex(s=>s.it.ex.id==='bbbench');workoutShow(i);})()`);
await scan('workout: pyramid target');
await page.fill('#wv-kg', '5000'); await page.fill('#wv-reps', '10'); await page.click('#wv-done'); await scan('workout: weight question');
await page.click('#wv-kg-fix');
await run(`(()=>{const i=workout.queue.findIndex(s=>s.it.ex.id==='dbbench'&&s.k===1);workoutShow(i);})()`); await scan('workout: today, no last time');
await run(`(()=>{closeWorkout();S.view='journal';renderSetup();renderPlan();document.querySelectorAll('details').forEach(x=>x.open=true);})()`);
await scan('journal: weight × reps, reps chart');
await run(`(()=>{LOG.data={};S.customs=S.customs.filter(c=>c.id!=='i18n-pyr');ensureCustoms(S);S.view='plan';S.mode='single';regen();})()`);

/* 7в. пульсометр (14b-heart.js): navigator.bluetooth подменён на странице — плашка до подключения, ожидание, живой пульс,
   нет контакта, обрыв, «Отключить?», отключён; отдых с пульсом во всех режимах конца отдыха; итоги, журнал; без Web Bluetooth —
   строка вместо кнопки */
step('7в. пульсометр');
await run(`(()=>{
  const ev=o=>{const l={};o.addEventListener=(t,f)=>{(l[t]=l[t]||[]).includes(f)||l[t].push(f);};o.removeEventListener=(t,f)=>{l[t]=(l[t]||[]).filter(x=>x!==f);};o.fire=(t,e)=>(l[t]||[]).slice().forEach(f=>f(e));return o;};
  const st={connected:false},chr=ev({value:null,async startNotifications(){},async stopNotifications(){}});
  const server={async getPrimaryService(n){if(n==='heart_rate')return{async getCharacteristic(){return chr;}};return{async getCharacteristic(){return{async readValue(){return new DataView(Uint8Array.of(70).buffer);}};}};}};
  const dev=ev({name:'Polar H10',gatt:{get connected(){return st.connected;},async connect(){st.connected=true;return server;},disconnect(){st.connected=false;}}});
  Object.defineProperty(navigator,'bluetooth',{configurable:true,value:{async requestDevice(){return dev;}}});
  window.__hr={push(b,c=true){chr.value=new DataView(Uint8Array.of(c?0x16:0x14,c?b:0,0,3).buffer);chr.fire('characteristicvaluechanged',{target:chr});},drop(){st.connected=false;dev.fire('gattserverdisconnected',{target:dev});}};
  Heart.setPrefs({rest:'time',thr:null});
  S.customs=[{id:'i18n-hr',name:'HR',items:[{id:'squat',sets:3,kg:[60]}]}];S.custom='i18n-hr';S.mode='custom';ensureCustoms(S);openCustom('i18n-hr');LOG.data={};regen();
  document.querySelector('#start-workout').click();})()`);
await scan('heart rate: before connecting');
const hrPush = b => run(`(()=>{window.__dt+=1000;window.__hr.push(${b});workoutTick();Heart.paint();})()`);
await page.click('#wv-hr-btn'); await page.waitForTimeout(50); await scan('heart rate: waiting');
await hrPush(131); await hrPush(150); await scan('heart rate: live, set max');
await run(`(()=>{window.__dt+=1000;window.__hr.push(0,false);Heart.paint();})()`); await scan('heart rate: no skin contact');
await hrPush(148);
await page.fill('#wv-reps', '8'); await page.click('#wv-done'); await scan('heart rate: rest');
for (const mode of ['first', 'hr']) { await page.click(`[data-hr-rest="${mode}"]`); await scan('heart rate: rest mode ' + mode + ', no threshold'); }
await page.fill('#wv-hr-thr', '110'); await hrPush(125); await scan('heart rate: rest until heart rate');
await run(`(()=>{window.__dt+=workout.restUntil-Date.now()-600;window.__hr.push(124);workoutTick();})()`); await scan('heart rate: rest extended');
await hrPush(108); await hrPush(104); await run(`(()=>{window.__dt+=300;workoutTick();})()`); await scan('heart rate: below threshold');
await run(`(()=>{window.__hr.drop();Heart.paint();})()`); await scan('heart rate: reconnecting');
await page.waitForFunction(() => Heart.state().client.state === 'waiting', null, { timeout: 5000, polling: 50 }).catch(() => {});
await hrPush(112); await page.click('#wv-hr-btn'); await scan('heart rate: disconnect?');
await page.click('#wv-hr-btn'); await scan('heart rate: disconnected');
await run(`(()=>{workoutFinish();})()`); await scan('heart rate: workout summary');
await run(`(()=>{closeWorkout();S.view='journal';renderSetup();renderPlan();})()`); await scan('heart rate: journal');
await run(`(()=>{Object.defineProperty(navigator,'bluetooth',{configurable:true,value:undefined});Heart.setPrefs({rest:'time',thr:null});S.view='plan';S.mode='single';regen();document.querySelector('#start-workout').click();})()`);
await scan('heart rate: no Web Bluetooth');
for (const [name, message] of [['NotFoundError', 'User cancelled the requestDevice() chooser.'], ['SecurityError', 'Access to the feature "bluetooth" is disallowed by permissions policy.'], ['NetworkError', 'Connection attempt failed.']]) {
  await run(`(()=>{Object.defineProperty(navigator,'bluetooth',{configurable:true,value:{async requestDevice(){throw Object.assign(new Error(${JSON.stringify(message)}),{name:'${name}'});}}});Heart.paint();})()`);
  await page.click('#wv-hr-btn'); await page.waitForTimeout(50); await scan('heart rate: ' + name);
}
await run(`(()=>{closeWorkout();})()`);

/* 8. скрытая панель замера скорости (?perf): живые цифры, устройство, идёт замер, итог, текст результата, все подписи */
step('8. замер скорости');
/* Без --full фигуры — заглушки, но карточки плана и витрина в замере рисовали бы настоящие кадры общим рендерером: одиннадцать
   шагов пересоздают контекст WebGL и сцены, и безголовый Chromium с программной графикой после замера 60–90 с не выдаёт кадров
   (очередь видеопроцесса) — ожидания Playwright по кадрам (waitForFunction, «элемент неподвижен» перед нажатием) не укладывались
   в свои тайм-ауты даже на свободной машине. Тексты панели от отрисовки не зависят: общий рендерер на время замера выключен;
   сам замер с настоящей графикой проверяет tools/ui-check.mjs, а здесь — с --full. */
if (!FULL) await run(`(()=>{if(window.GymVolume){window.__cards=GymVolume.cards;GymVolume.cards=()=>null;}})()`);
/* Панель «Устройство» спрашивает модель видеокарты (perfGpu: новый контекст WebGL и синхронный вопрос видеопроцессу). После шагов
   с настоящими миниатюрами витрины видеопроцесс безголового Chromium с программной графикой ещё занят: на свободной машине ответ
   приходит через ≈23 с, под нагрузкой дольше, а у нажатия Playwright предел 30 с. Сведения об устройстве запрашиваются заранее
   (они запоминаются, нажатие потом мгновенно) — явно и со своим пределом */
{ const t0 = Date.now(), ok = await Promise.race([run(`(()=>{perfDevice();return true;})()`), new Promise(r => setTimeout(() => r(false), 240000))]);
  if (!ok) throw new Error('Видеопроцесс не ответил за 240 с (сведения об устройстве для панели замера)'); step(`сведения об устройстве через ${((Date.now() - t0) / 1000).toFixed(1)} с`); }
await run(`(()=>{perfStart();document.querySelector('.card')?.scrollIntoView({block:'center'});})()`); await page.waitForTimeout(700);
await scan('perf panel live');
await page.click('#perf-panel [data-perf="dev"]'); await scan('perf panel device');
await run(`(()=>{perfRun({plan:300,step:250,warm:100});})()`); await page.waitForTimeout(150); await scan('perf panel running');
/* опрос по таймеру, а не по кадрам экрана (у waitForFunction по умолчанию — requestAnimationFrame): замер идёт ≈8 с, а кадры
   под нагрузкой могут задерживаться */
await page.waitForFunction(() => !GymPerf.run, null, { timeout: 60000, polling: 100 });
await scan('perf panel result', await run(`[perfReportText(GymPerf.result), Object.values(PERF_T).join('\\n'), perfUa('Mozilla/5.0 (Linux; Android 12; M2101K6G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 YaBrowser/24.1.2.86.00 Mobile Safari/537.36').browser, [1, 2, 5].map(n => perfDeviceLines({...perfDevice(), cores: n})[0] + '\\n' + perfStepLine({label: 'x', sum: perfSummary(Array.from({length: n}, (_, i) => ({t: i, cost: 1, b: {svgHit: 1, nHit: 1, svgMiss: 1, nMiss: 1, svgDom: 1}})), 1000)}, 0)).join('\\n')].join('\\n')`));
await run(`(()=>{navigator.clipboard&&(navigator.clipboard.writeText=()=>Promise.reject(new Error('no')));})()`);
await page.click('#perf-panel [data-perf="copy"]'); await page.waitForTimeout(100); await scan('perf copy fallback');
await page.click('#start-workout'); await page.waitForTimeout(150);
await run(`(()=>{perfRun();})()`); await page.waitForTimeout(100); await scan('perf: close the workout first');
await run(`(()=>{closeWorkout();perfStop();})()`);

/* 9. данные, созданные в русской версии (офлайн-файлы делят localStorage): «Мой план», «План 2», «Зал», «Место 5», неделя
   в свои планы («Пн · Всё тело А», программа «Всё тело · неделя 2»), копия плана, тренировка по мышцам — в английской
   версии имена по умолчанию пишутся по-английски (11a-names.js); проверяются и значения полей «Name» */
step('9. данные из русской версии');
{
  const ru = await page.context().newPage(); ru.on('pageerror', e => errors.push(String(e)));
  await ru.goto('file://' + file.replace(/-en\.html$/, '-ru.html')); await ru.waitForTimeout(600);
  await ru.evaluate(() => {
    const fake = () => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); return { svg, camera: 'side', at() {}, setTrace() {}, setVectors() {}, setJoints() {}, setStress() {}, setMuscles() {}, setRegion() {}, dispose() {} }; };
    window.buildFigure = fake; window.createMotionFigure = fake;
    localStorage.removeItem('podhod.settings.v1'); S.customs = []; S.places = []; ensurePlaces(S); ensureCustoms(S);
    Object.assign(S, { view: 'plan', mode: 'program', days: 3, split: 'full', week: 2 }); regen(); document.querySelector('#save-plan').click();
    Object.assign(S, { mode: 'single', groups: ['chest', 'back', 'biceps'] }); regen(); document.querySelector('#save-plan').click();
    document.querySelector('[data-place-add]').click();
    openCustom(S.customs[0].id); regen(); document.querySelector('[data-cp-new]').click(); document.querySelector('[data-cp-copy]').click();
    S.place = 'home'; S.adapt = 'gym'; ensurePlaces(S); saveSettings();
  });
  const made = await ru.evaluate(() => S.customs.map(c => c.name).concat(S.places.map(p => p.name)).join(', '));
  if (!/Мой план/.test(made) || !/Место \d/.test(made)) errors.push('русская версия не создала имена по умолчанию: ' + made);
  await ru.close();
  const en = await page.context().newPage(); en.on('pageerror', e => errors.push(String(e)));
  await en.goto('file://' + file); await en.waitForTimeout(600);
  await en.evaluate(() => { const fake = () => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); return { svg, camera: 'side', at() {}, setTrace() {}, setVectors() {}, setJoints() {}, setStress() {}, setMuscles() {}, setRegion() {}, dispose() {} }; }; window.buildFigure = fake; window.createMotionFigure = fake; });
  for (const c of await en.evaluate(() => S.customs.map(c => c.id))) {
    await en.evaluate(id => { openCustom(id); regen(); document.querySelectorAll('.cp-about').forEach(d => d.open = true); }, c);
    await scan('plans made in Russian: ' + c, await en.evaluate(() => plan && plan.items && plan.items.length ? planText() : ''), en, true);
  }
  await en.evaluate(() => { document.querySelector('#plan-export')?.click(); }); await en.waitForTimeout(100);
  await scan('plans made in Russian: export dialog', '', en, true);
  await en.evaluate(() => { document.querySelector('#plan-out')?.close(); S.mode = 'single'; S.view = 'atlas'; renderSetup(); renderPlan(); document.querySelector('#at-keep [data-cp-add]')?.click(); });
  await scan('plans made in Russian: atlas and plan picker', '', en, true);
  await en.evaluate(() => { S.view = 'plan'; regen(); openGallery(); });
  await scan('places made in Russian: gallery', '', en, true);
  await en.close();
}

await browser.close();
const list = [...found.values()];
const outIdx = process.argv.indexOf('--json');
if (outIdx > 0) fs.writeFileSync(process.argv[outIdx + 1], JSON.stringify(list, null, 1));
if (errors.length) console.error('Ошибки страницы:\n' + [...new Set(errors)].slice(0, 10).join('\n'));
if (list.length) {
  console.error(`Английская версия: найдено ${list.length} строк с кириллицей`);
  for (const h of list.slice(0, 80)) console.error(`  ${h.state} · ${h.where}: ${h.text}`);
  process.exit(1);
}
console.log('Английская версия: кириллицы нет на ' + ids.length + ' упражнениях и всех экранах.' + (errors.length ? ' Есть ошибки страницы.' : ''));
process.exit(errors.length ? 1 : 0);
