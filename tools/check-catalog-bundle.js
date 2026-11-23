const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const{JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const expectedVersion=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version;
const sw=fs.readFileSync(path.join(root,'dist/sw.js'),'utf8'),shellFor=require('node:vm').runInNewContext(sw+'\nshellFor;',{self:{registration:{scope:'https://test.invalid/'},addEventListener(){}}});
for(const lang of ['ru','en']){
 console.log(`Checking packaged ${lang}…`);
 /* оболочка одного языка: всё, что рисует страница, — в ней; файлов другого языка в ней нет */
 const cached=new Set(shellFor([lang]).map(p=>new URL(p,'https://test.invalid/').href));
 assert(![...cached].some(u=>lang==='ru'?u.includes('/en/'):/^https:\/\/test\.invalid\/(index\.html|app\.|pwa\.|manifest\.|$)/.test(u)),'Shell of '+lang+' carries the other language');
 const dir=path.join(root,'dist',lang==='ru'?'':'en'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.map(String).join(' ')));
 const dom=new JSDOM(html,{url:'https://sakrett001-ai.github.io/Lazy-gym-planner/atlas-preview/'+(lang==='en'?'en/':''),runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window,d=w.document;
 const base='https://test.invalid/'+(lang==='en'?'en/':'');
 for(const node of d.querySelectorAll('script[src],link[rel=stylesheet],link[rel=manifest],link[rel=icon],link[rel=apple-touch-icon]'))assert(cached.has(new URL(node.getAttribute('src')||node.getAttribute('href'),base).href),'Offline shell misses a rendered asset');
 /* иконки: адрес — по хэшу содержимого, а не по версии (иначе ≈0,3 МБ заново в каждом выпуске); те же адреса — в манифесте и в оболочке */
 const sha=f=>require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'dist',f))).digest('hex').slice(0,16);
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.webmanifest'),'utf8'));
 const icons=[...manifest.icons.map(i=>i.src),...[...d.querySelectorAll('link[rel=icon],link[rel=apple-touch-icon]')].map(n=>n.getAttribute('href'))];
 for(const src of icons){const u=new URL(src,base),file=u.pathname.split('/').pop();assert.equal(u.searchParams.get('v'),sha(file),'Icon addressed by its content: '+src);assert(cached.has(u.href),'Offline shell misses an icon: '+src);}
 w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 /* объёмная графика не задерживает первый экран: её подгружает встроенный загрузчик после load, из кеша оболочки */
 assert(!d.querySelector('script[src*="volume.js"]'),'3D engine must not block the first screen');
 const volumeSrc=[...d.querySelectorAll('script:not([src])')].map(s=>s.textContent).join('\n').match(/s\.src='([^']*volume\.js[^']*)'/)?.[1];
 assert(volumeSrc&&cached.has(new URL(volumeSrc,base).href),'3D engine loader points to a cached asset');
 w.eval(fs.readFileSync(path.join(dir,'app.js'),'utf8')+'\nwindow.qaCatalog={EX,openMotionItem,previewItem,closeMotion,motionPrefs,getMotion:()=>detailMotion,startWorkout,closeWorkout,getWorkout:()=>workout};');
 /* 171 упражнение: +3 дома с эспандером (заход 2), +5 дома с эспандером, +5 прицельных на приводящие и манжету, +7 с гирей (этап 1), +3 (этап 2), +1 (этап 3), +1 (турецкий подъём) */
 const q=w.qaCatalog;assert.equal(q.EX.length,171);assert.equal(d.querySelectorAll('#mv-exercise option').length,171);
 console.log('  Application booted');
 /* разбор открыт раньше, чем пришёл объём: плоская схема, затем объём в той же фазе */
 q.openMotionItem(q.previewItem('bbbench'));assert(!d.querySelector('#mv-stage .volume-figure')&&d.querySelector('#mv-stage svg path'),'flat figure before the 3D engine arrives');
 const early=d.getElementById('mv-progress');early.value='300';early.dispatchEvent(new w.Event('input'));const earlyClock=q.getMotion().clock;
 w.eval(fs.readFileSync(path.join(root,'dist/volume.js'),'utf8'));w.dispatchEvent(new w.Event('gym-volume'));
 assert(d.querySelector('#mv-stage .volume-figure svg path'),'3D engine replaces the flat figure');assert.equal(q.getMotion().clock,earlyClock);q.closeMotion();
 console.log('  3D engine arrived after the first screen');
 q.openMotionItem(q.previewItem('bbbench'));assert(d.querySelector('#mv-stage .volume-figure svg path'));/* 4.112: при первом открытии приложения ракурс по умолчанию — «Сбоку» (было «Сверху под углом»; решение владельца 15.11.2026) */assert.equal(d.querySelector('#mv-stage .volume-figure').dataset.camera,'side');
 const slider=d.getElementById('mv-progress');slider.value='470';slider.dispatchEvent(new w.Event('input'));const clock=q.getMotion().clock,pose=d.querySelector('#mv-stage .volume-figure').dataset.pose;
 d.querySelector('#mv-cameras [data-motion-camera=above]').click();assert.equal(q.getMotion().clock,clock);assert.equal(d.querySelector('#mv-stage .volume-figure').dataset.pose,pose);
 const dual=d.getElementById('mv-dual');dual.checked=true;dual.dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('#mv-projections .volume-figure').length,2);assert.equal(q.getMotion().clock,clock);
 console.log('  Main and second views rendered');
 const region=d.getElementById('mv-region'),before=d.querySelector('#mv-stage svg').outerHTML;region.value='pec_clavicular';region.dispatchEvent(new w.Event('change'));assert.equal(q.motionPrefs.regions.bbbench,'pec_clavicular');assert.notEqual(d.querySelector('#mv-stage svg').outerHTML,before);assert.equal(q.getMotion().clock,clock);
 const muscles=d.getElementById('mv-muscle-toggle');muscles.checked=false;muscles.dispatchEvent(new w.Event('change'));assert.equal(d.getElementById('mv-muscle-panel').hidden,true);muscles.checked=true;muscles.dispatchEvent(new w.Event('change'));
 dual.checked=false;dual.dispatchEvent(new w.Event('change'));
 const exercise=d.getElementById('mv-exercise');for(const id of ['kbswing','dbfly','dbrow','chestrowdb','cablelat']){exercise.value=id;exercise.dispatchEvent(new w.Event('change'));assert(d.querySelector('#mv-stage .volume-figure svg path'),id);assert.equal(d.querySelectorAll('#mv-cameras button').length,5);assert.equal(d.getElementById('mv-muscle-toggle').disabled,false);console.log('  Switched '+id);}
 q.closeMotion();q.startWorkout();assert.equal(d.getElementById('wv-cameras').hidden,false);assert.equal(d.querySelectorAll('#wv-cameras button').length,5);assert(d.querySelector('#wv-stage .volume-figure svg path'));q.closeWorkout();
 assert.deepEqual(errors,[]);dom.window.close();console.log(`Packaged ${lang}: atlas, actual SVG fallback, camera phase, two views, region highlight, toggles and workout verified.`);
}
for(const lang of ['ru','en']){
 const html=fs.readFileSync(path.join(root,`dist/lazy-gym-planner-offline-${lang}.html`),'utf8'),dom=new JSDOM(html,{url:'file:///lazy-gym-planner.html',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
 w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 assert.equal(d.querySelectorAll('script[src],link[rel=stylesheet]').length,0);
 w.eval([...d.querySelectorAll('script')].map(s=>s.textContent).join('\n')+'\nwindow.qaCatalog={EX,openMotionItem,previewItem,closeMotion};');
 assert.equal(w.PODHOD_VERSION,expectedVersion);w.qaCatalog.openMotionItem(w.qaCatalog.previewItem('bbbench'));assert(d.querySelector('#mv-stage svg path'));assert.equal(d.querySelectorAll('#mv-cameras button').length,5);w.qaCatalog.closeMotion();dom.window.close();console.log(`Standalone ${lang}: embedded renderer and atlas verified without network resources.`);
}
