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

test('неделя: в днях «Низ» и «Ноги» — одно упражнение на приводящие, с целью недели; потолок и отметки не ломаются', () => {
  /* решение владельца 18.11.2026 (вопрос 7 ревью 4.109) */
  const fits = a.m.get('fitsBody'), cap = a.m.get('sessionCap'), dayTargets = a.m.get('dayTargets'), volScale = a.m.get('volScale');
  for (const [days, split] of [[4, 'ul'], [5, 'ppl'], [3, 'ppl'], [5, 'ul']]) for (const level of ['beg', 'mid', 'adv']) for (const goal of ['mass', 'strength', 'gentle'])
    for (const protect of [[], ['knees'], ['lumbar'], ['knees', 'lumbar', 'hams']]) {
      a.reset({ mode: 'program', days, split, level, goal, protect: protect.slice() });
      const pr = a.buildProgram(), tag = `${days}×${split} ${level} ${goal} [${protect}]`;
      for (const d of pr.days) {
        const its = d.plan.items || [], own = its.filter(it => it.ex.g === 'adductors'), leg = ['lo', 'legs'].includes(d.tid);
        assert(own.length <= 1, `${tag} ${d.name}: ${own.map(it => it.ex.id)}`);
        if (!leg) assert.equal(own.length, 0, `${tag} ${d.name}: приводящие только в днях ног`);
        for (const it of its) assert(fits(it.ex), `${tag} ${d.name}: ${it.ex.id} не подходит отметкам`);
        /* потолок подходов за тренировку (первая неделя; дробный счёт, запас как у других групп — полтора подхода) */
        assert((d.plan.gvol.adductors || 0) <= cap() + 1.5, `${tag} ${d.name}: приводящим ${d.plan.gvol.adductors}`);
      }
      if (!protect.length) assert(pr.days.some(d => (d.plan.items || []).some(it => it.ex.g === 'adductors')), tag + ': в неделе есть упражнение на приводящие');
      assert(Math.round(pr.gvol.adductors * 2) / 2 <= volScale().hi + 1, `${tag}: за неделю ${pr.gvol.adductors}`);
    }
  /* «Всё тело» — без отдельного упражнения, попутно */
  a.reset({ mode: 'program', days: 3, split: 'full' });
  const full = a.buildProgram();
  assert(!full.days.some(d => (d.plan.items || []).some(it => ADD.includes(it.ex.id))) && full.gvol.adductors > 0);
  /* нечем нагрузить отдельно (дом без снаряжения) — не цель дня: на графике «попутно», а не вечное «мало» */
  a.reset({ mode: 'program', days: 4, split: 'ul' });
  assert(plain(dayTargets('lo')).includes('adductors'));
  a.reset({ mode: 'program', days: 4, split: 'ul', place: 'none' });
  assert(!plain(dayTargets('lo')).includes('adductors'));
  assert(!a.buildProgram().days.some(d => (d.plan.items || []).some(it => it.ex.g === 'adductors')));
});

test('«Бережно» без статодинамики: сохранённое так — «Классика», и об этом сказано один раз', () => {
  /* решение владельца 18.11.2026 (вопрос 3 ревью 4.109): долгое напряжение без расслабления поднимает давление */
  const c = raw => plain(a.cleanSettings(raw).s);
  let s = c({ goal: 'gentle', format: 'static' });
  assert.equal(s.format, 'classic'); assert.equal(s.fmtNote, true, 'настройки: формат заменён, пометка для сообщения');
  s = c({ goal: 'mass', format: 'static' }); assert.equal(s.format, 'static'); assert(!s.fmtNote, 'в других целях статодинамика остаётся');
  s = c({ goal: 'gentle', format: 'superset' }); assert.equal(s.format, 'superset'); assert(!s.fmtNote);
  s = c({ goal: 'mass', format: 'classic', gen: { goal: 'gentle', format: 'static', level: 'beg' } });
  assert.equal(s.gen.format, 'classic', 'параметры обычных планов, пока открыт свой'); assert.equal(s.fmtNote, true);
  /* резервная копия */
  assert.equal(plain(a.restoreSettingsPlan({ v: 2, settings: { goal: 'gentle', format: 'static' } })).s.format, 'classic');
  /* под планом — одна строка; первое же действие (regen) её снимает */
  a.reset({ goal: 'gentle', format: 'static' });
  assert.equal(a.m.get('gentleNoStatic()'), true);
  assert.equal(a.S.format, 'classic');
  assert.match(a.warnHtml(a.buildPlan()), /Формат заменён на «Классику»: в бережном режиме статодинамики больше нет/);
  a.m.get('renderPlan = () => {}; regen(); regen();');
  assert(!a.S.fmtNote); assert.doesNotMatch(a.warnHtml(a.buildPlan()), /Формат заменён/);
  /* свой план и план из файла: «Бережно» + статодинамика — при открытии «Классика», в плане тоже */
  a.reset();
  const read = a.readPlanFile(JSON.stringify({ format: 'lazy-gym-planner/plans', version: 1, plans: [{ name: 'Мягко', goal: 'gentle', format: 'static', level: 'beg', items: [{ id: 'legpress' }, { id: 'legcurl' }] }] }));
  const [pl] = a.addPlans(read.plans);
  a.m.get(`openCustom(${JSON.stringify(pl.id)})`);
  assert.deepEqual([a.S.goal, a.S.format, a.m.get('customOf().format')], ['gentle', 'classic', 'classic']);
  assert.equal(a.S.fmtNote, true);
  assert(!a.buildPlan().items.some(it => it.rx.static));
  /* выбор «Бережно» при статодинамике и английский текст */
  a.reset({ goal: 'mass', format: 'static' }); a.S.goal = 'gentle';
  assert.equal(a.m.get('gentleNoStatic()'), true); assert.equal(a.S.format, 'classic');
  const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../i18n/en.json'), 'utf8'));
  for (const k of ['GENTLE_NO_STATIC', 'GENTLE_STATIC_FIXED']) assert(en[a.m.get(k)], k + ': перевод есть');
});
