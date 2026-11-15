const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {loadModel} = require('./biomechanics-audit');
const root = path.resolve(__dirname,'..');
function appModel() {
  const m = loadModel({fullApp:true});
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  return m.get('({S,LOG,AR,WEEKS,buildPlan,previewItem,suggest,backupObject,restoreBackup})');
}
test('both gravitron exercises become easier during a deload, including small counterweights', () => {
  const a = appModel(); Object.assign(a.S,{mode:'program',week:4});
  for (const id of ['assistpull','assistdip']) for (const weight of [1,5,40]) {
    a.LOG.data = {[id]:[{d:'2000-01-01',target:4,s:Array.from({length:4},()=>[weight,8])}]};
    const s = a.suggest({...a.previewItem(id),eqIds:['gravitron']});
    assert.equal(s.tone,'deload'); assert(s.kg > weight); assert(s.text.includes('противовес'));
  }
});
test('light mode increases assistance and reduces ordinary external weight', () => {
  const a = appModel(); Object.assign(a.S,{mode:'single',goal:'mass'}); a.AR.light=true;
  for (const [id,equip,easier] of [['assistpull','gravitron',1],['bbbench','bb',-1]]) {
    a.LOG.data={[id]:[{d:'2000-01-01',target:4,s:[[40,8],[40,8],[40,8],[40,8]]}]};
    const s=a.suggest({...a.previewItem(id),eqIds:[equip]});
    assert((s.kg-40)*easier > 0); assert.equal(s.tone,'deload');
  }
});
test('light circuits reduce rounds, sets and duration for every goal and level', () => {
  const a=appModel(); Object.assign(a.S,{mode:'single',format:'circuit'});
  for (const goal of ['strength','mass','cut']) for (const level of ['beg','mid','adv']) {
    Object.assign(a.S,{goal,level}); a.AR.light=false; const before=a.buildPlan();
    a.AR.light=true; const after=a.buildPlan();
    assert(after.blocks[0].rounds < before.blocks[0].rounds);
    assert(after.totalSets < before.totalSets); assert(after.minutes < before.minutes);
    assert(after.items.every(it=>it.rounds === after.blocks[0].rounds));
  }
});
test('single-workout light flag does not alter program circuit volume', () => {
  const a=appModel(); Object.assign(a.S,{mode:'program',format:'circuit'});
  a.AR.light=false; const normal=a.buildPlan({week:a.WEEKS[0]});
  a.AR.light=true; const light=a.buildPlan({week:a.WEEKS[0]});
  assert.equal(normal.totalSets,light.totalSets);
});
test('backup preserves an incomplete session target and its progression decision', () => {
  const a=appModel(); Object.assign(a.S,{mode:'single',format:'classic',goal:'mass',level:'mid'});
  /* вчерашняя запись: после долгого перерыва совет — сниженный вес (layoffInfo, 15-autoreg.js), а здесь проверяется копия */
  const y=new Date(Date.now()-864e5),yd=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`;
  a.LOG.data={bbbench:[{d:yd,wk:3,target:5,s:[[60,10],[60,10],[60,10],[60,10]]}]};
  const item={...a.previewItem('bbbench'),eqIds:['bb']}, before=a.suggest(item);
  const copy=JSON.parse(JSON.stringify(a.backupObject())); a.LOG.data={}; a.restoreBackup(copy);
  const after=a.suggest(item);
  assert.equal(a.LOG.data.bbbench[0].target,5); assert.equal(a.LOG.data.bbbench[0].wk,3);
  assert.equal(before.tone,'same'); assert.equal(after.tone,before.tone); assert.equal(after.kg,before.kg);
});
test('v1 backups remain compatible and invalid session targets are discarded', () => {
  const a=appModel();
  a.restoreBackup({v:1,log:{bbbench:[{d:'2000-01-01',s:[[60,8]]},{d:'2000-01-02',target:-4,s:[[60,9]]}]}});
  assert.equal(a.LOG.data.bbbench.length,2); assert(a.LOG.data.bbbench.every(s=>s.target === undefined));
});
test('service worker waits for explicit activation and preserves other application caches', async () => {
  const handlers={},deleted=[]; let skip=0,claimed=0,waiting;
  const scope='https://test.invalid/atlas-preview/',prefix='podhod@'+scope+':';
  const self={addEventListener:(n,f)=>handlers[n]=f,skipWaiting:()=>{skip++;},clients:{claim:()=>{claimed++;}},location:{origin:'https://test.invalid'},registration:{scope}};
  /* кеш: при установке иконки ищутся в кеше прежней версии (match), найденные кладутся в новый (put) — sw.js, fillShell */
  const caches={open:async()=>({addAll:async()=>{},match:async()=>undefined,put:async()=>{}}),keys:async()=>[prefix+'old',prefix+'__VERSION__','podhod@https://test.invalid/:4.1.8','podhod-old','other-project'],delete:async k=>{deleted.push(k);}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'src/sw.js'),'utf8'),{self,caches});
  handlers.install({waitUntil:p=>waiting=p}); await waiting; assert.equal(skip,0);
  handlers.message({data:'skipWaiting'}); assert.equal(skip,1);
  handlers.activate({waitUntil:p=>waiting=p}); await waiting;
  assert.deepEqual(deleted,[prefix+'old']); assert.equal(claimed,1);
});
async function pwaClient({controller=true,waiting=true}={}) {
  const events={},button={}; let bar=null,reloads=0,messages=0;
  const worker={state:'installed',postMessage:()=>{messages++;}};
  const serviceWorker={controller:controller?{state:'activated'}:null,
    addEventListener:(n,f)=>events[n]=f,register:async()=>({waiting:waiting?worker:null,addEventListener(){}})};
  const document={getElementById:()=>bar,createElement:()=>({querySelector:()=>button}),body:{appendChild:b=>{bar=b;}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'src/pwa.js'),'utf8'),
    {navigator:{serviceWorker},location:{protocol:'https:',reload:()=>{reloads++;}},document,setInterval:()=>0});
  await Promise.resolve();
  return {events,button,state:()=>({reloaded:reloads,messages,hasNotice:!!bar})};
}
test('an already waiting PWA update reloads only after its button is pressed', async () => {
  const c=await pwaClient(); assert.equal(c.state().reloaded,0); assert(c.state().hasNotice);
  c.button.onclick(); assert.equal(c.state().messages,1);
  c.events.controllerchange(); c.events.controllerchange(); assert.equal(c.state().reloaded,1);
});
test('activation by another tab preserves the current session until its own update click', async () => {
  const c=await pwaClient(); c.events.controllerchange();
  assert.equal(c.state().reloaded,0); c.button.onclick(); assert.equal(c.state().reloaded,1);
});
test('first PWA installation does not reload or show a false update notice', async () => {
  const c=await pwaClient({controller:false,waiting:false}); c.events.controllerchange();
  assert.equal(c.state().reloaded,0); assert.equal(c.state().hasNotice,false);
});
