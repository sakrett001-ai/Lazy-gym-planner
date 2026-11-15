'use strict';
/* Группа плана «Приводящие» (4.109, решение владельца 15.11.2026 по ревью 4.110; Alex 18, замечание анатома: приводящие —
   не квадрицепс). Было: MUSCLE_GROUP.adductors = 'quads' — выбрав «Квадрицепс», можно было получить сведение ног.
   Теперь: свой чип, свой счёт подходов, своя загрузка в журнале; сохранённые настройки, где выбран квадрицепс, получают
   и приводящие; файлы планов и резервные копии прежних версий читаются, имена по прежним ключам групп — те же. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadModel } = require('./biomechanics-audit');
const plain = x => JSON.parse(JSON.stringify(x));
const ADD = ['adduction', 'cableadduct', 'bandadduct', 'copenhagen', 'copenhagenknee'];
function app() {
  const m = loadModel({ fullApp: true });
  m.get('renderSetup=()=>{}; logRefresh=()=>{}; LOG.mode="local";');
  const a = m.get(`({S, EX, EXI, GROUPS, GN, GROUP_PRESETS, MUSCLE_GROUP, buildPlan, buildProgram, ensurePlaces, PLACE_DEFAULTS, ensureCustoms,
    ensureProtect, ensureDur, cleanSettings, groupsTitle, autoName, readPlanFile, addPlans, restoreSettingsPlan, muscleLoad, todayKey, LOG, warnHtml,
    groupShare})`);
  a.m = m;
  a.reset = (extra = {}) => {
    a.S.places = a.PLACE_DEFAULTS.map(p => ({ ...p, equip: p.equip.slice() })); a.S.places.push({ id: 'none', name: 'Пусто', equip: [] });
    a.S.place = extra.place || 'gym'; a.S.adapt = null; a.ensurePlaces(a.S);
    Object.assign(a.S, { mode: 'single', format: 'classic', goal: 'mass', level: 'mid', count: 6, groups: ['quads'], seed: 7, fav: [], customs: [], custom: null,
      gen: null, protect: [], days: 3, split: null, week: 1, day: 0, focus: null, logPick: null, dur: null }, extra);
    delete a.S.place_; a.ensureCustoms(a.S); a.ensureProtect(a.S); a.ensureDur(a.S);
    m.get('AR.light = false; swaps = S.swaps = {}; LOG.data = {};');
  };
  return a;
}
const a = app();

test('«Приводящие» — своя группа: чип после квадрицепса, упражнения на сведение — в ней, а не в квадрицепсе', () => {
  const ids = a.GROUPS.map(g => g.id);
  assert.equal(ids[ids.indexOf('quads') + 1], 'adductors', 'сразу после квадрицепса');
  assert.equal(a.GN.adductors, 'Приводящие');
  assert.equal(a.MUSCLE_GROUP.adductors, 'adductors');
  for (const id of ADD) assert.equal(a.EXI[id].g, 'adductors', id);
  /* все упражнения, где приводящие — первые основные, — в своей группе */
  for (const ex of a.EX) if (ex.pri[0] === 'adductors') assert.equal(ex.g, 'adductors', ex.id);
  /* приседания и выпады нагружают приводящие попутно: половина подхода (дробный счёт, как у других групп) */
  assert.equal(a.groupShare(a.EXI.squat).adductors, 0.5);
  assert.equal(a.groupShare(a.EXI.adduction).quads, undefined, 'сведение ног квадрицепсу подходов не даёт');
  for (const p of ['legs', 'full']) assert(a.GROUP_PRESETS.find(x => x.id === p).g.includes('adductors'), p + ': в заготовке есть приводящие');
  assert(!a.GROUP_PRESETS.find(x => x.id === 'upper').g.includes('adductors'));
  const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../i18n/en.json'), 'utf8'));
  assert.equal(en['Приводящие'], 'Adductors', 'английское название');
});

test('«Квадрицепс» без «Приводящих» — без сведения ног; «Приводящие» — упражнения на них', () => {
  for (const place of ['gym', 'home', 'homeband', 'street']) for (const level of ['beg', 'mid', 'adv']) for (const goal of ['mass', 'strength', 'cut', 'gentle'])
    for (const format of ['classic', 'superset', 'circuit', 'static']) for (const seed of [3, 7, 19]) for (const groups of [['quads'], ['quads', 'glutes', 'hams', 'calves']]) {
      a.reset({ place, level, goal, format, seed, groups: groups.slice() });
      const p = a.buildPlan(), tag = `${place} ${level} ${goal} ${format} ${seed} ${groups}`;
      if (!p.items) continue;
      assert(!p.items.some(it => ADD.includes(it.ex.id)), tag + ': ' + p.items.map(it => it.ex.id).join(' '));
    }
  a.reset({ groups: ['adductors'], count: 3 });
  const p = a.buildPlan();
  assert(p.items.length >= 2 && p.items.every(it => it.ex.g === 'adductors'), p.items.map(it => it.ex.id).join(' '));
  assert(p.gvol.adductors >= 4, 'счёт подходов группы: ' + p.gvol.adductors);
  /* «Ноги» в зале: приводящие считаются своей группой */
  a.reset({ groups: a.GROUP_PRESETS.find(x => x.id === 'legs').g.slice() });
  const legs = a.buildPlan();
  assert(legs.gvol.adductors > 0 && legs.gvol.quads > 0);
});

test('нет своего упражнения, но работают попутно — не «без упражнений»; совсем нечем — сказано', () => {
  /* улица: нет ни эспандера, ни блока, ни скамьи для сведения — в «Всём теле» приводящие работают в выпадах и приседаниях */
  a.reset({ place: 'none', groups: a.GROUP_PRESETS.find(x => x.id === 'full').g.slice() });
  const p = a.buildPlan();
  assert(p.missing.includes('adductors') && p.gvol.adductors >= 1, 'работают попутно: ' + p.gvol.adductors);
  assert.doesNotMatch(a.warnHtml(p), /Без упражнений осталось/);
  a.reset({ place: 'none', groups: ['chest', 'adductors'] });
  const q = a.buildPlan();
  assert.match(a.warnHtml(q), /Без упражнений осталось: приводящие\. Для них нужно другое оборудование\./);
});

test('сохранённые настройки прежних версий: выбран квадрицепс — выбраны и приводящие; без квадрицепса и в новых — как есть', () => {
  const c = raw => plain(a.cleanSettings(raw));
  let r = c({ groups: ['chest', 'quads', 'hams'] });
  assert.deepEqual(r.s.groups, ['chest', 'quads', 'adductors', 'hams']); assert.equal(r.s.groupsV, 1); assert.deepEqual(r.bad, [], 'перенос — не порча');
  /* заготовки прежних версий — те же заготовки и теперь */
  for (const id of ['legs', 'full']) {
    const now = a.GROUP_PRESETS.find(x => x.id === id).g, old = now.filter(g => g !== 'adductors');
    assert.deepEqual(new Set(c({ groups: old }).s.groups), new Set(now), id);
  }
  assert.deepEqual(c({ groups: ['chest', 'back'] }).s.groups, ['chest', 'back'], 'без квадрицепса — без приводящих');
  assert.deepEqual(c({ groups: ['quads'], groupsV: 1 }).s.groups, ['quads'], 'в настройках 4.109 человек снял приводящие — так и остаётся');
  assert.deepEqual(c({ goal: 'mass' }).s.groups, ['chest', 'back', 'shoulders'], 'без списка мышц — обычные');
  assert.equal(c(null).s.groupsV, 1, 'новые настройки — сразу новой версии');
  /* резервная копия прежней версии */
  const rs = plain(a.restoreSettingsPlan({ v: 2, settings: { groups: ['quads', 'glutes'], goal: 'strength' } }));
  assert.deepEqual(rs.s.groups, ['glutes', 'quads', 'adductors'].sort((x, y) => a.GROUPS.findIndex(g => g.id === x) - a.GROUPS.findIndex(g => g.id === y)));
  assert.deepEqual(rs.bad, []);
});

test('те же тренировки: у перенесённых настроек тот же вариант подбора', () => {
  /* приводящие в зерно подбора не входят — к настройкам прибавилась группа, а остальные упражнения не перемешались */
  a.reset({ groups: ['chest', 'back', 'quads', 'adductors'], count: 5 });
  const withAdd = a.buildPlan().items.map(it => it.ex.id);
  a.reset({ groups: ['chest', 'back', 'quads'], count: 5 });
  const without = a.buildPlan().items.map(it => it.ex.id);
  const same = without.filter(id => withAdd.includes(id)).length;
  assert(same >= without.length - 1, `${without.join(' ')} → ${withAdd.join(' ')}`);
});

test('файлы планов и имена прежних версий: читаются, имена по ключам групп — прежние', () => {
  assert.equal(a.autoName('groups:quads,hams,glutes,calves'), 'Ноги и ягодицы', 'ключ «Ног» до 4.109');
  assert.equal(a.autoName('groups:chest,back,shoulders,quads,hams,glutes,abs'), 'Всё тело', 'ключ «Всего тела» до 4.109');
  assert.equal(a.autoName('groups:' + a.GROUP_PRESETS.find(x => x.id === 'legs').g.join(',')), 'Ноги и ягодицы');
  assert.equal(a.autoName('groups:quads,adductors'), 'Квадрицепс и приводящие');
  a.reset();
  const file = { format: 'lazy-gym-planner/plans', version: 1, plans: [{ name: 'Ноги и ягодицы', auto: 'groups:quads,hams,glutes,calves', goal: 'mass', format: 'classic', level: 'mid',
    items: [{ id: 'squat', sets: 4 }, { id: 'adduction', sets: 3 }, { id: 'legcurl' }] }] };
  const read = a.readPlanFile(JSON.stringify(file));
  assert(!read.error, read.error);
  assert.deepEqual(plain(read.unknown), []);
  const [c] = a.addPlans(read.plans);
  assert.equal(c.name, 'Ноги и ягодицы');
  Object.assign(a.S, { mode: 'custom', custom: c.id }); a.ensureCustoms(a.S);
  const p = a.buildPlan();
  assert.deepEqual(plain(p.items.map(it => it.ex.id)), ['squat', 'adduction', 'legcurl']);
  assert(p.gvol.adductors >= 3, 'сведение ног — подходы приводящих: ' + p.gvol.adductors);
});

test('журнал: сведение ног нагружает приводящие, а не квадрицепс', () => {
  a.reset();
  const t = a.todayKey();
  a.LOG.data = { adduction: [{ d: t, s: [[40, 12], [40, 12], [40, 12]] }] };
  const L = a.muscleLoad();
  assert.equal(L.adductors.st, 'loaded');
  assert.notEqual(L.quads.st, 'loaded', 'квадрицепс после сведения ног — не «нагружен»');
  a.LOG.data = {};
});

test('неделя: приводящие отдельно не нагружаются, работают попутно', () => {
  for (const [days, split] of [[3, 'full'], [4, 'ul'], [5, 'ppl']]) {
    a.reset({ mode: 'program', days, split });
    const pr = a.buildProgram();
    assert(!pr.days.some(d => (d.plan.items || []).some(it => ADD.includes(it.ex.id))), `${days}×${split}`);
    assert(pr.gvol.adductors > 0, `${days}×${split}: попутно ${pr.gvol.adductors}`);
  }
});
