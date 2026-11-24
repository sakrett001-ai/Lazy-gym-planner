'use strict';
/* «Анатомия» вне разбора (этап 2): экран тренировки и карточки плана.
   1) правила без страницы (src/js/12-figure-pace.js): вид фигуры, ступени скорости, память неподвижных кадров;
   2) общий рендерер карточек (src/volume/main.mjs, GymVolume.cards) — на заглушке WebGL: один рендерер на все карточки,
      сцены по упражнению, кадр — в холст карточки, память матриц костей, потеря контекста;
   3) карточки плана (12-motion-player.js) с поддельным рендерером: анимируется одна, остальные — один неподвижный кадр,
      ступени скорости, откат на манекен, отпускание кадров ушедших далеко карточек. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), zlib = require('node:zlib');
const { JSDOM } = require('jsdom');
const { loadModel } = require('./biomechanics-audit');
const root = path.resolve(__dirname, '..');
const plain = v => JSON.parse(JSON.stringify(v));

/* ---------- 1. правила ---------- */
function rules() {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/js/12-figure-pace.js'), 'utf8'), ctx, { filename: '12-figure-pace.js' });
  return vm.runInContext('({ANATOMY_PACE,anatomyBudget,anatomyPace,figureViewFor,FIGURE_NOTES,stillsToFree,CARD_STILLS,cardCanvasSize})', ctx);
}
const R = rules();

test('figure view: the person\'s choice, unless there is no WebGL, data is loading or failed, or the device is too slow', () => {
  const v = (pref, o) => plain(R.figureViewFor(pref, o));
  assert.deepEqual(v('anatomy'), { view: 'anatomy', note: '', wait: false });
  assert.deepEqual(v('skeleton'), { view: 'skeleton', note: '', wait: false });
  assert.equal(v(undefined).view, 'anatomy', 'по умолчанию — «Анатомия»');
  assert.deepEqual(v('mannequin', { state: 'error', slow: true }), { view: 'mannequin', note: '', wait: false }, 'манекен по выбору — без подписей');
  assert.deepEqual(v('anatomy', { able: false }), { view: 'mannequin', note: '', wait: false }, 'без объёмной графики — как раньше');
  assert.deepEqual(v('anatomy', { state: 'loading' }), { view: 'mannequin', note: R.FIGURE_NOTES.loading, wait: true }, 'пока грузится — манекен с подписью');
  assert.deepEqual(v('anatomy', { state: 'error' }), { view: 'mannequin', note: R.FIGURE_NOTES.error, wait: false });
  assert.equal(v('anatomy', { slow: true }).note, 'Телефон не успевает — показан манекен');
  assert.equal(v('skeleton', { slow: true, coarse: false }).note, 'Компьютер не успевает — показан манекен');
  assert.equal(v('anatomy', { slow: true, state: 'error' }).note, R.FIGURE_NOTES.slowPhone, 'откат по скорости важнее ошибки загрузки');
});

test('pace ladder: 30 → 15 → 10 frames per second by the median frame time, then the mannequin', () => {
  const P = R.ANATOMY_PACE, p = R.anatomyPace();
  assert.deepEqual([p.step, p.fps, Math.round(p.frameMs)], [0, 30, 33]);
  assert.equal(R.anatomyBudget(30), 1000 / 30 * P.load);
  assert.equal(R.anatomyBudget(10), P.cap, 'не дольше «длинной задачи»'); assert.equal(R.anatomyBudget(30), 25, 'замер владельца: 20–23 мс — ещё 30 кадров');
  /* кадры одного времени — до первого решения ступени (или 60 кадров без решения) */
  const feed = ms => { for (let i = 0; i < 60; i++) { const r = p.sample(ms); if (r) return r; } return null; };
  assert.equal(feed(R.anatomyBudget(30) - .5), null, 'в бюджете — та же ступень');
  assert.equal(p.fps, 30);
  /* выбросы (пауза, сборка сцены) не считаются */
  for (let i = 0; i < 50; i++) assert.equal(p.sample(P.outlier + 1), null);
  assert.equal(p.fps, 30);
  /* медиана, а не среднее: два медленных кадра из двенадцати не меняют ступень */
  for (let i = 0; i < P.window; i++) p.sample(i < 2 ? 200 : 5);
  assert.equal(p.fps, 30);
  assert.equal(feed(R.anatomyBudget(30) + 1), 'down'); assert.equal(p.fps, 15);
  assert.equal(feed(R.anatomyBudget(15) - 1), null); assert.equal(p.fps, 15, '15 кадров держатся');
  assert.equal(feed(R.anatomyBudget(15) + 1), 'down'); assert.equal(p.fps, 10);
  /* на последней ступени холодные кадры (матрицы костей ещё не в памяти) манекен не решают */
  for (let i = 0; i < 60; i++) assert.equal(p.sample(R.anatomyBudget(10) * 2, 1, true), null);
  assert.equal(p.fallback, false);
  assert.equal(feed(R.anatomyBudget(10) + 1), 'fallback'); assert.equal(p.fallback, true);
  assert.equal(p.sample(1), null, 'после отката замеры не нужны');
  p.reset(); assert.deepEqual([p.step, p.fps, p.fallback], [0, 30, false], 'новое открытие — новая попытка');
  /* прогрев: первые кадры (сборка сцены, шейдеры) не считаются */
  let first = null; for (let i = 0; i < P.warmup + P.window - 1; i++) first = p.sample(100) || first;
  assert.equal(first, null); assert.equal(p.sample(100), 'down');
  /* две анимируемые карточки делят бюджет */
  const two = R.anatomyPace();
  for (let i = 0; i < P.warmup + P.window; i++) two.sample(R.anatomyBudget(30) * .75, 2);
  assert.equal(two.fps, 15);
});

test('a passing hitch does not keep the animation slow: two fast windows step back up; a new card is not measured at once', () => {
  const P = R.ANATOMY_PACE, p = R.anatomyPace(), run = (ms, n) => { const out = []; for (let i = 0; i < n; i++) { const r = p.sample(ms); if (r) out.push(r); } return out; };
  run(100, P.warmup + P.window); assert.equal(p.fps, 15);
  /* ниже 0,6 × бюджета 30 кадров (10 мс) — одно окно мало, два — ступень выше */
  assert.deepEqual(run(P.up * R.anatomyBudget(30) - 1, 1 + P.window), []);
  assert.deepEqual(run(P.up * R.anatomyBudget(30) - 1, P.window), ['up']); assert.equal(p.fps, 30);
  /* между бюджетом и порогом подъёма — ступень держится (нет качелей) */
  run(100, 1 + P.window); assert.equal(p.fps, 15);
  assert.deepEqual(run(R.anatomyBudget(30) * .9, 1 + 3 * P.window), []); assert.equal(p.fps, 15);
  /* settle: первые кадры новой карточки не считаются, ступень прежняя */
  p.settle(); assert.deepEqual(run(200, P.warmup), []); assert.equal(p.fps, 15);
  assert.equal(p.samples.length, 0);
});

test('still frames: cards beyond two screens let theirs go; above the limit — the longest unseen, never one near the screen', () => {
  const c = (id, o) => ({ id, has: true, near: false, far: true, seenAt: id, ...o });
  assert.deepEqual(plain(R.stillsToFree([c(0, { near: true }), c(1), c(2, { far: false }), c(3, { has: false, far: false })])), [2]);
  const many = Array.from({ length: 16 }, (_, i) => c(i, { near: i >= 12, seenAt: 100 - i }));
  const freed = plain(R.stillsToFree(many, 12)).sort((a, b) => a - b);
  assert.deepEqual(freed, [8, 9, 10, 11], 'четыре давно не виденных из дальних');
  assert(freed.every(id => !many[id].near));
  assert.deepEqual(plain(R.stillsToFree(Array.from({ length: 14 }, (_, i) => c(i, { near: true })), 12)), [], 'у экрана — не отпускаются');
  assert.equal(R.CARD_STILLS.limit * 261 * 261 * 4 < 4 << 20, true, 'не больше ≈4 МБ на телефоне');
});

test('card canvas size: device pixels, but not more than ×2', () => {
  assert.deepEqual(plain(R.cardCanvasSize(130.5, 130.5, 3)), { width: 261, height: 261 });
  assert.deepEqual(plain(R.cardCanvasSize(198, 198, 1)), { width: 198, height: 198 });
  assert.deepEqual(plain(R.cardCanvasSize(100, 80, .5)), { width: 100, height: 80 });
  assert.equal(R.cardCanvasSize(0, 130, 2), null);
});

/* ---------- 2. общий рендерер карточек на заглушке WebGL ---------- */
const mainSrc = fs.readFileSync(path.join(root, 'src/volume/main.mjs'), 'utf8').replace(/^import[^\n]*\n/gm, '').replace('export function createVolumeFigure', 'function createVolumeFigure');
async function stageRuntime({ available = true } = {}) {
  const THREE = await import('three'), { createCatalogScene, world, CAMERA_SETTINGS } = await import('../src/volume/scene.mjs'), orbit = await import('../src/volume/orbit.mjs'), { attachOrbit } = await import('../src/volume/controls.mjs');
  const dom = new JSDOM('<body></body>'), w = dom.window, n = { constructors: 0, renders: 0, losses: 0, sizes: [] };
  if (available) w.WebGL2RenderingContext = function () {};
  w.HTMLCanvasElement.prototype.getContext = function () { return available ? {} : null; };
  class Renderer {
    constructor({ canvas }) { n.constructors++; this.domElement = canvas; this.lost = false; this.shadowMap = {}; n.last = this; }
    getContext() { return { isContextLost: () => this.lost }; }
    setPixelRatio() {} setSize(a, b) { n.sizes.push([a, b]); } render(scene, camera) { n.renders++; n.scene = scene; n.camera = camera; } dispose() {} forceContextLoss() { n.losses++; }
  }
  /* Skeleton — как в браузере, глобальный (кости — приложения, src/js/09bq-skeleton.js) */
  const env = { window: w, document: w.document, performance, THREE: { ...THREE, WebGLRenderer: Renderer }, createCatalogScene, world, CAMERA_SETTINGS, ...orbit, attachOrbit, GymPerf: null, get Skeleton() { return globalThis.Skeleton; } };
  vm.runInNewContext(mainSrc, env);
  const m = loadModel(), { catalogVolumeData, muscleColor, catalogAnimFor } = m.get('({catalogVolumeData,muscleColor,catalogAnimFor})');
  let datas = 0;
  const opts = (id, key = id) => ({ key, fit: 'body', color: muscleColor, data: (t, index, coarse, lean) => { datas++; return catalogVolumeData(m.EX.find(e => e.id === id).anim, t, index, undefined, coarse, lean); } });
  const target = (width = 261, height = 261) => { const calls = []; return { width, height, calls, getContext: () => ({ drawImage: (...a) => calls.push(a) }) }; };
  return { dom, w, n, env, stage: () => w.GymVolume.cards(), opts, target, datas: () => datas, m, catalogAnimFor };
}

test('one renderer for every card: scenes by exercise, at most three kept, each frame copied into the card canvas', async () => {
  const r = await stageRuntime();
  try {
    const stage = r.stage(), ids = ['latpull', 'legpress', 'squat', 'pushup', 'dbcurl', 'bbbench'];
    const figs = ids.map(id => stage.figure(r.opts(id)));
    for (const f of figs) { const t = r.target(); assert.equal(f.paint(t, .3, 0, 'above'), true); assert.equal(t.calls.length, 1); assert.deepEqual(t.calls[0].slice(1), [0, 0, 261, 261], 'кадр — во весь холст карточки'); }
    assert.equal(r.n.constructors, 1, 'один WebGL-контекст на шесть карточек');
    assert.equal(stage.stats().scenes, 3, 'сцен в запасе — не больше трёх');
    assert.equal(stage.stats().builds, 6);
    assert.deepEqual(r.n.sizes, [[261, 261]], 'размер рендерера меняется только с размером карточки');
    /* давняя сцена собирается заново, свежая — нет */
    figs[5].paint(r.target(), .4, 0, 'above'); assert.equal(stage.stats().builds, 6);
    figs[0].paint(r.target(), .4, 0, 'above'); assert.equal(stage.stats().builds, 7);
    /* ракурс карточки — камера сцены */
    figs[0].paint(r.target(), .4, 0, 'side'); assert.equal(Math.abs(r.n.camera.position.x) > 7 && Math.abs(r.n.camera.position.z) < .1, true, 'камера сбоку');
    assert.equal(figs[0].paint(r.target(0, 0), .4, 0), false, 'холст без размера не рисуется');
  } finally { r.stage().dispose(); r.dom.window.close(); }
});

test('cards of one exercise share a scene: a phase is computed once, not per card', async () => {
  const r = await stageRuntime();
  try {
    const a = r.stage().figure(r.opts('squat')), b = r.stage().figure(r.opts('squat'));
    a.paint(r.target(), .5, 0); const after = r.datas();
    b.paint(r.target(), .5, 0); assert.equal(r.datas(), after, 'та же фаза второй карточки — без расчёта позы');
    b.paint(r.target(), .6, 0); assert.equal(r.datas(), after + 1);
    b.setLook({ stress: false }); b.paint(r.target(), .6, 0); assert.equal(r.datas(), after + 2, 'другой вид кадра — расчёт заново');
    assert.equal(r.stage().stats().scenes, 1);
  } finally { r.stage().dispose(); r.dom.window.close(); }
});

test('anatomy cards remember bone matrices of a phase: the second repetition does not lay the skeleton out again', async () => {
  const r = await stageRuntime(), Skeleton = require('../src/js/09bq-skeleton.js'), Muscles = require('../src/js/09br-muscles.js');
  globalThis.Skeleton = Skeleton; globalThis.Muscles = Muscles;
  const read = f => zlib.gunzipSync(fs.readFileSync(path.join(root, 'src/data/' + f)));
  const bones = Skeleton.decode(read('skeleton.bin')), muscles = Muscles.decode(read('muscles.bin'));
  const frames = Skeleton.frames;let calls = 0;
  Skeleton.frames = (...a) => { calls++; return frames(...a); };
  try {
    const f = r.stage().figure(r.opts('dbcurl'));
    f.setLayers(bones, { skeleton: bones, muscles, level: { biceps: 1 } });
    for (const t of [.1, .2, .3]) f.paint(r.target(), t, 0);
    assert.equal(calls, 3);
    const s = r.n.scene;
    for (const t of [.1, .2, .3]) f.paint(r.target(), t, 0);
    assert.equal(calls, 3, 'второй круг — матрицы из памяти');
    /* кадр из памяти тот же, что посчитанный заново */
    const kept = Array.from(s.getObjectByName('skeleton').userData.layer.matrixOf('humerusL').elements);
    Skeleton.frames = frames; const fresh = r.stage().figure(r.opts('dbcurl', 'dbcurl-fresh'));
    fresh.setLayers(bones, { skeleton: bones, muscles, level: { biceps: 1 } }); fresh.paint(r.target(), .3, 0);
    const again = r.n.scene.getObjectByName('skeleton').userData.layer.matrixOf('humerusL');
    assert.deepEqual(Array.from(again.elements).map(v => +v.toFixed(6)), kept.map(v => +v.toFixed(6)));
    assert.equal(r.n.scene.getObjectByName('muscles').visible, true, 'мышцы на месте');
    /* силуэт кожи — один проход на обе стороны (иначе three.js на каждой сетке дважды за кадр ищет программу шейдера) */
    const mats = new Set(); r.n.scene.traverse(o => { if (o.material && /^ghost-/.test(o.material.name)) mats.add(o.material); });
    assert.equal(mats.size, 2); for (const mt of mats) assert.equal(mt.forceSinglePass, true, mt.name);
    /* экран тренировки: фигура с memoBones тоже берёт матрицы фазы из памяти */
    let wcalls = 0; Skeleton.frames = (...a) => { wcalls++; return frames(...a); };
    const wf = r.w.GymVolume.create({ ...r.opts('dbcurl'), label: 'dbcurl', camera: 'angle', trace: [], vectors: [], memoBones: true });
    wf.setLayers(bones, { skeleton: bones, muscles, level: { biceps: 1 } }); const w0 = wcalls;
    for (const t of [.2, .4, .2, .4]) wf.at(t, { index: 0 });
    assert.equal(wcalls - w0, 2, 'две фазы — два расчёта скелета на четыре кадра'); wf.dispose();
  } finally { Skeleton.frames = frames; r.stage().dispose(); r.dom.window.close(); delete globalThis.Skeleton; delete globalThis.Muscles; }
});

test('a lost WebGL context keeps every card picture; disposal frees the context and a later frame takes a new one', async () => {
  const r = await stageRuntime();
  try {
    const stage = r.stage(), f = stage.figure(r.opts('pushup')), t = r.target();
    f.paint(t, .2, 0); assert.equal(t.calls.length, 1); assert.equal(stage.stats().context, true);
    /* контекст потерян: кадр не рисуется, холст карточки (её картинка) не трогается */
    r.n.last.lost = true;
    assert.equal(f.paint(t, .3, 0), false); assert.equal(t.calls.length, 1);
    /* вернулся: сцены собираются заново, картинки — снова */
    r.n.last.lost = false; r.n.last.domElement.dispatchEvent(new r.w.Event('webglcontextrestored'));
    assert.equal(stage.stats().scenes, 0);
    assert.equal(f.paint(t, .3, 0), true); assert.equal(t.calls.length, 2); assert.equal(stage.stats().builds, 2);
    stage.dispose(); assert.equal(r.n.losses, 1, 'контекст отдан');
    assert.equal(stage.stats().context, false); assert.equal(stage.stats().scenes, 0);
    assert.equal(f.paint(t, .3, 0), true); assert.equal(r.n.constructors, 2, 'новый контекст — по требованию');
    f.release(); assert.equal(f.paint(t, .4, 0), false, 'отпущенная фигура не рисует');
  } finally { r.stage()?.dispose(); r.dom.window.close(); }
});

test('speed panel (?perf): a card scene gets the 3D wrappers once, each card frame is reported; off — one flag check', async () => {
  const r = await stageRuntime();
  try {
    const calls = { volume: [], card: [] };
    r.env.GymPerf = { volume: o => calls.volume.push(o), card: (total, copy) => calls.card.push([total, copy]) };
    const f = r.stage().figure(r.opts('squat'));
    f.paint(r.target(), .2, 0); f.paint(r.target(), .3, 0);
    assert.equal(calls.volume.length, 1, 'wrappers — once per scene build');
    const v = calls.volume[0];
    assert.equal(v.card, true); assert.equal(typeof v.scene.apply, 'function'); assert.equal(typeof v.renderer.render, 'function'); assert.equal(typeof v.options.data, 'function');
    assert.equal(calls.card.length, 2, 'every painted card frame');
    for (const [total, copy] of calls.card) assert(total >= copy && copy >= 0);
    r.env.GymPerf = null; f.paint(r.target(), .4, 0);
    assert.equal(calls.card.length, 2, 'off — nothing reported');
  } finally { r.stage().dispose(); r.dom.window.close(); }
});

test('without WebGL2 cards have no stage: they stay SVG', async () => {
  const r = await stageRuntime({ available: false });
  try { assert.equal(r.stage(), null, 'общего рендерера нет'); assert.equal(r.n.constructors, 0); }
  finally { r.dom.window.close(); }
});

/* ---------- 3. карточки плана с поддельным рендерером ---------- */
function planModel() {
  const m = loadModel({ fullApp: true });
  m.get(`innerWidth=390;innerHeight=800;devicePixelRatio=3;performance={now:()=>Date.now()};matchMedia=q=>({matches:/coarse/.test(q)});
    window.__paints=[];window.__idle=[];requestIdleCallback=cb=>{window.__idle.push(cb);return 1;};
    document.createElement=()=>({style:{},setAttribute(){},width:0,height:0});
    const fakeStage={figure(o){const h={key:o.key,layers:null,look:null,setLayers(b,a){h.layers=[!!b,!!a];},setLook(l){h.look=l;},release(){h.gone=true;},
      paint(c,t,i,cam){if(h.gone)return false;window.__paints.push({key:h.key,t,cam,w:c.width});return true;}};return h;},dispose(){window.__disposed=(window.__disposed||0)+1;}};
    window.GymVolume={cards:()=>fakeStage};Skeleton.data={bones:[]};Muscles.data={muscles:[]};motionPrefs.view='anatomy';
    /* 4.112: у новых установок ракурс по умолчанию — «Сбоку» (motionPrefs.side); этот тест — о тех, у кого «Анатомия» сверху под углом, как было */
    motionPrefs.side=false;
    const note=()=>({textContent:'',hidden:true});
    figs=['squat','pushup','dbcurl'].map((id,i)=>{const n=note(),cls=new Set();return{card:true,it:previewItem(id),vis:true,far:true,seen:i===0?1:0,active:false,paused:false,clock:0,durations:motionDurations(previewItem(id)),
      f:{at(){},svg:{getBoundingClientRect:()=>({width:130,height:130})}},note:n,
      btn:{getBoundingClientRect:()=>({top:i*700,height:300}),prepend(){},classList:{add:c=>cls.add(c),remove:c=>cls.delete(c),contains:c=>cls.has(c)},
        closest:()=>({querySelector:s=>s==='.figure-tile-note'?n:s==='.motion-caption'?{textContent:''}:null})}};});
    pickActiveCards();applyCardsView();`);
  const idle = () => m.get('{const q=window.__idle.splice(0);for(const cb of q)cb({timeRemaining:()=>10,didTimeout:false});q.length}');
  const paints = () => plain(m.get('window.__paints.splice(0)'));
  return { m, idle, paints };
}

test('plan cards in «Anatomy»: the watched card moves, the others get one still frame each, painted when idle', () => {
  const { m, idle, paints } = planModel();
  assert.equal(m.get('cardAnatomy.view'), 'anatomy');
  assert.deepEqual(plain(m.get('figs.map(F=>F.active)')), [true, false, false]);
  for (let k = 0; k < 5; k++) idle();
  const still = paints();
  assert.deepEqual(still.map(p => p.key.split('|')[0]).sort(), ['dbcurl', 'pushup'], 'по одному неподвижному кадру у неподвижных карточек');
  assert(still.every(p => p.w === 260 && p.cam === 'above'), 'холст ×2, ракурс карточки — «Сверху под углом»');
  assert.deepEqual(plain(m.get('figs.map(F=>F.btn.classList.contains("anatomy-on"))')), [false, true, true]);
  for (let k = 0; k < 3; k++) idle();
  assert.deepEqual(paints(), [], 'кадр не перерисовывается без причины');
  /* смена цвета мышц — неподвижные кадры заново, по одному */
  m.get('motionPrefs.muscles=false;refreshCardAnatomy()');for (let k = 0; k < 5; k++) idle();
  assert.equal(paints().length, 2);
  /* цикл: анимируемая карточка — 30 кадров в секунду, часы — каждый кадр экрана */
  m.get(`requestAnimationFrame=cb=>{window.__raf=cb;return 1;};scheduleMotionLoop();for(let k=0;k<=60;k++)window.__raf(k*1000/60);`);
  const loop = paints();
  assert(loop.length >= 29 && loop.length <= 31, 'около 30 кадров анатомии в секунду: ' + loop.length);
  assert(loop.every(p => p.key.startsWith('squat|')), 'двигается только та карточка, на которую смотрят');
  assert.equal(Math.round(m.get('figs[0].clock')), 1000);
});

test('slow frames step the card down to 15 and 10 frames per second, then to the mannequin with a note', () => {
  const { m, idle, paints } = planModel();
  for (let k = 0; k < 5; k++) idle(); paints();
  const second = () => { m.get(`requestAnimationFrame=cb=>{window.__raf=cb;return 1;};scheduleMotionLoop();for(let k=0;k<=60;k++)window.__raf(k*1000/60);`); return paints().length; };
  const slow = ms => m.get(`for(let i=0;i<ANATOMY_PACE.warmup+ANATOMY_PACE.window;i++)cardPaceSample(${ms})`);
  slow(30); assert.equal(m.get('cardAnatomy.pace.fps'), 15);
  const n15 = second(); assert(n15 >= 14 && n15 <= 16, '15 кадров: ' + n15);
  slow(55); assert.equal(m.get('cardAnatomy.pace.fps'), 10);
  const n10 = second(); assert(n10 >= 9 && n10 <= 11, '10 кадров: ' + n10);
  slow(60);
  assert.equal(m.get('cardAnatomy.view'), 'mannequin');
  assert.deepEqual(plain(m.get('figs.map(F=>[F.btn.classList.contains("anatomy-on"),F.note.textContent,F.note.hidden])')),
    Array(3).fill([false, 'Телефон не успевает — показан манекен', false]), 'SVG-манекен и честная подпись в каждой карточке');
  assert.equal(m.get('motionPrefs.view'), 'anatomy', 'выбор человека не сбрасывается');
  assert.equal(m.get('window.__disposed') >= 1, true, 'общий рендерер освобождён');
  /* новый выбор вида — новая попытка */
  m.get('retryAnatomyPace();applyCardsView()');
  assert.deepEqual([m.get('cardAnatomy.view'), m.get('cardAnatomy.pace.fps')], ['anatomy', 30]);
});

test('a card two screens away lets its still frame go and gets it back when it returns', () => {
  const { m, idle, paints } = planModel();
  for (let k = 0; k < 5; k++) idle(); paints();
  m.get('figs[2].far=false;figs[2].vis=false;freeFarStills()');
  assert.deepEqual(plain(m.get('[figs[2].btn.classList.contains("anatomy-on"),figs[2].av.canvas.width,figs[1].av.on]')), [false, 0, true]);
  m.get('figs[2].far=true;figs[2].vis=true;queueCardStills()'); idle();
  assert.deepEqual(paints().map(p => p.key.split('|')[0]), ['dbcurl']);
  assert.equal(m.get('figs[2].btn.classList.contains("anatomy-on")'), true);
});

test('«Mannequin»: cards paint the Anny skin (no bones, no muscles) once its data is in; without it — SVG; no WebGL — SVG as before', () => {
  const { m, idle, paints } = planModel();
  for (let k = 0; k < 5; k++) idle(); paints();
  /* данных кожи нет: пока грузятся и после ошибки — SVG-манекен без подписи */
  m.get('AnnySkin.data=null;AnnySkin.load=()=>Promise.reject(Error("нет"));motionPrefs.view="mannequin";applyCardsView()');
  assert.equal(m.get('cardAnatomy.view'), 'mannequin');
  assert.deepEqual(plain(m.get('figs.map(F=>F.btn.classList.contains("anatomy-on"))')), [false, false, false]);
  assert.deepEqual(plain(m.get('figs.map(F=>F.note.hidden)')), [true, true, true], 'манекен по выбору — без подписи');
  /* данные пришли: кожа Anny кадрами общего рендерера, кости и мышцы выключены */
  m.get('AnnySkin.data={frames:[]};cardAnatomy.annyFailed=false;applyCardsView()');
  assert.equal(m.get('cardAnatomy.view'), 'skin');
  for (let k = 0; k < 5; k++) idle();
  assert.deepEqual(paints().map(p => p.key.split('|')[0]).sort(), ['dbcurl', 'pushup'], 'неподвижные кадры кожи у неподвижных карточек');
  assert.deepEqual(plain(m.get('figs.filter(F=>F.av?.on).map(F=>F.av.handle.layers)')), [[false, false], [false, false]], 'без костей и мышц');
  assert.deepEqual(plain(m.get('figs.map(F=>F.note.hidden)')), [true, true, true]);
  m.get('AnnySkin.data=null;cardAnatomy.annyFailed=true;applyCardsView()');
  assert.equal(m.get('cardAnatomy.view'), 'mannequin');
  assert.deepEqual(plain(m.get('figs.map(F=>F.btn.classList.contains("anatomy-on"))')), [false, false, false], 'данных кожи нет — снова SVG');
  m.get('motionPrefs.view="anatomy";window.GymVolume={cards:()=>null};applyCardsView()');
  for (let k = 0; k < 3; k++) idle();
  assert.equal(m.get('cardAnatomy.view'), 'mannequin'); assert.deepEqual(paints(), []);
});
