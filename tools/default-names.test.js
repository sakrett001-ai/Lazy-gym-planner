'use strict';
/* Имена по умолчанию (src/js/11a-names.js): планы, программы и места, названные приложением, пишутся на языке страницы —
   созданные в русской версии не остаются русскими в английской и наоборот; имя, данное человеком, не трогается. Данные
   прежних версий (только имя) узнаются по русскому или английскому имени по умолчанию. Файл плана несёт ключ имени. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadApp} = require('./lang-model');
const CYR = /[А-Яа-яЁё]/;
const names = a => JSON.parse(a.get('JSON.stringify({plans:S.customs.map(c=>[c.name,c.group||""]),places:S.places.map(p=>p.name),adapt:S.places.map(p=>p.name)})'));

test('defaults made in the Russian version read in English, and back again', () => {
  const ru = loadApp({lang:'ru'});
  /* в «Моём плане» — упражнение: пустая заготовка уходит, когда приходят сохранённые планы (4.111, dropEmptyMy), а здесь
     проверяется имя по умолчанию */
  ru.get(`(()=>{customOf().items.push({id:'squat'});S.customs.push(newCustomPlan());S.customs.push(newCustomPlan());S.places.push({id:'p5',name:'Место '+(S.places.length+1),auto:'place:'+(S.places.length+1),equip:[]});
    Object.assign(S,{mode:'program',days:3,split:'full',week:2});prog=buildProgram();savePlansFrom();
    Object.assign(S,{mode:'single',groups:['chest','back','biceps']});prog=null;plan=buildPlan({});savePlansFrom();
    S.custom=S.customs[0].id;S.mode='custom';document.dispatchEvent;saveSettings();})()`);
  const r = names(ru);
  assert.deepEqual(r.plans.slice(0, 3).map(p => p[0]), ['Мой план', 'План 2', 'План 3']);
  assert.deepEqual(r.places, ['Зал', 'Дом', 'Улица', 'Дома с эспандером', 'Место 5']);
  assert.deepEqual(r.plans[3], ['Пн · Всё тело А', 'Всё тело · неделя 2']);
  assert.equal(r.plans.at(-1)[0], 'Грудь, спина и бицепс');
  const en = loadApp({lang:'en', storage:ru.storage}), e = names(en);
  assert.deepEqual(e.plans.slice(0, 3).map(p => p[0]), ['My plan', 'Plan 2', 'Plan 3']);
  assert.deepEqual(e.places, ['Gym', 'Home', 'Outdoors', 'Home with bands', 'Place 5']);
  assert.deepEqual(e.plans.slice(3, 6), [['Mon · Full body A', 'Full body · week 2'], ['Wed · Full body B', 'Full body · week 2'], ['Fri · Full body C', 'Full body · week 2']]);
  assert.equal(e.plans.at(-1)[0], 'Chest, back and biceps');
  assert(!CYR.test(JSON.stringify(e)), 'no Cyrillic in English: ' + JSON.stringify(e));
  /* «As in “Gym”, with substitutes» — место в подписи берётся тем же именем */
  assert.equal(en.get(`(()=>{S.place='home';ensurePlaces(S);return placeOf(S,'gym').name})()`), 'Gym');
  en.get('saveSettings()');
  const back = names(loadApp({lang:'ru', storage:en.storage}));
  assert.deepEqual(back, r, 'and Russian again after English');
});
test('names typed by a person stay as typed in both languages; renaming drops the default key', () => {
  const ru = loadApp({lang:'ru'});
  ru.get(`(()=>{S.customs[0].name='Ноги';delete S.customs[0].auto;S.customs.push({id:'c2',name:'План 2',auto:'plan:2',items:[]});S.places[0].name='Мой зал';delete S.places[0].auto;saveSettings();})()`);
  const en = loadApp({lang:'en', storage:ru.storage}), e = names(en);
  assert.equal(e.plans[0][0], 'Ноги', 'a name typed in Russian stays Russian — it is the person’s');
  assert.equal(e.plans[1][0], 'Plan 2');
  assert.equal(e.places[0], 'Мой зал');
  /* переименование в поле «Name» (обработчик change в 11d-custom.js): тем же именем — ключ остаётся, другим — снимается */
  const rename = v => { en.get(`S.custom='c2';S.mode='custom'`); en.fire('change', {id:'cp-name', value:v, dataset:{}}); return en.json('[customOf().name, customOf().auto||null]'); };
  assert.deepEqual(rename('Plan 2'), ['Plan 2', 'plan:2']);
  assert.deepEqual(rename('Push day'), ['Push day', null]);
  en.fire('change', {id:'place-name', value:'Outdoors', dataset:{}});
  en.get(`S.place='street'`); en.fire('change', {id:'place-name', value:'Park', dataset:{}});
  assert.deepEqual(en.json(`S.places.map(p=>[p.name,p.auto||null])`).slice(1, 3), [['Home', 'home'], ['Park', null]]);
});
test('data from earlier versions: a Russian or English default name becomes a default; other names stay', () => {
  const legacy = {groups:['chest'], equip:['db'], places:[{id:'gym', name:'Зал', equip:['db']}, {id:'home', name:'Home', equip:['db']}, {id:'street', name:'Двор', equip:[]}, {id:'p1', name:'Место 5', equip:[]}, {id:'p2', name:'Зал', equip:[]}], placesV:1,
    customs:[{id:'c1', name:'Мой план', items:[]}, {id:'c2', name:'План 7', items:[]}, {id:'c3', name:'Мой план — копия (2)', items:[]}, {id:'c4', name:'Ср · Верх Б', group:'Верх / низ · неделя 3', items:[]},
      {id:'c5', name:'Грудь, плечи, трицепс', items:[]}, {id:'c6', name:'Спина и бицепс', items:[]}, {id:'c7', name:'Тяжёлый день', group:'Блок А', items:[]}, {id:'c8', name:'Plan 4', items:[]}]};
  const en = loadApp({lang:'en', storage:new Map([['podhod.settings.v1', JSON.stringify(legacy)]])}), e = names(en);
  assert.deepEqual(e.plans, [['My plan', ''], ['Plan 7', ''], ['My plan — copy (2)', ''], ['Wed · Upper B', 'Upper / lower · week 3'], ['Chest, shoulders, triceps', ''], ['Back and biceps', ''], ['Тяжёлый день', 'Блок А'], ['Plan 4', '']]);
  assert.deepEqual(e.places, ['Gym', 'Home', 'Двор', 'Place 5', 'Зал'], 'a default name on another place’s id is the person’s name');
  const ru = names(loadApp({lang:'ru', storage:new Map([['podhod.settings.v1', JSON.stringify(legacy)]])}));
  assert.deepEqual(ru.plans.map(p => p[0]), ['Мой план', 'План 7', 'Мой план — копия (2)', 'Ср · Верх Б', 'Грудь, плечи, трицепс', 'Спина и бицепс', 'Тяжёлый день', 'План 4']);
  assert.equal(ru.places[1], 'Дом', 'an English default from an earlier English session reads in Russian');
});
test('a copy and a taken name keep the key: «My plan — copy», «Plan 2 (2)»', () => {
  const ru = loadApp({lang:'ru'});
  ru.get(`(()=>{const c=customOf();S.customs.push({id:'c9',...namedPlan(c.name+' — копия',c.auto+'+copy'),items:[]});S.customs.push({id:'c8',...namedPlan('Мой план','my'),items:[]});saveSettings();})()`);
  assert.deepEqual(names(ru).plans.map(p => p[0]), ['Мой план', 'Мой план — копия', 'Мой план (2)']);
  assert.deepEqual(names(loadApp({lang:'en', storage:ru.storage})).plans.map(p => p[0]), ['My plan', 'My plan — copy', 'My plan (2)']);
});
test('plan file: the key travels next to the name both ways; earlier versions read the name, files without the key are guessed', () => {
  const ru = loadApp({lang:'ru'});
  /* «Мой план» с упражнением — не пустая заготовка (её убирает сохранение, 4.111) */
  ru.get(`(()=>{customOf().items.push({id:'squat'});Object.assign(S,{mode:'program',days:2,split:'ul',week:1});prog=buildProgram();savePlansFrom();saveSettings();})()`);
  const file = JSON.parse(ru.get('JSON.stringify(planFileObject(S.customs))'));
  assert.deepEqual(file.plans.map(p => [p.name, p.auto, p.group, p.gauto]), [['Мой план', 'my', undefined, undefined], ['Пн · Верх', 'day:0:up', 'Верх / низ · неделя 1', 'split:ul:1'], ['Чт · Низ', 'day:3:lo', 'Верх / низ · неделя 1', 'split:ul:1']]);
  /* загрузка в английской версии с одним «My plan» */
  const read = text => JSON.parse(loadApp({lang:'en'}).get(`(()=>{const r=readPlanFile(${JSON.stringify(text)});return JSON.stringify(r.error||addPlans(r.plans).map(c=>[c.name,c.group||'']));})()`));
  assert.deepEqual(read(JSON.stringify(file)), [['My plan (2)', ''], ['Mon · Upper', 'Upper / lower · week 1'], ['Thu · Lower', 'Upper / lower · week 1']], 'the taken name gets a number');
  /* файл прежней версии — только имена */
  const old = {format:'lazy-gym-planner/plans', version:1, plans:[{name:'План 3', items:[{id:'squat'}]}, {name:'Пн · Верх', group:'Жим / тяга / ноги · неделя 2', items:[]}, {name:'Leg day', items:[]}]};
  assert.deepEqual(read(JSON.stringify(old)), [['Plan 3', ''], ['Mon · Upper', 'Push / pull / legs · week 2'], ['Leg day', '']]);
  /* прежняя версия читает только известные поля: ключ ей не мешает, имя — как у отправителя */
  const bad = {format:'lazy-gym-planner/plans', version:1, plans:[{name:'Coach plan', auto:'no-such-key', gauto:'split:nope:1', group:'Block', items:[]}]};
  assert.deepEqual(read(JSON.stringify(bad)), [['Coach plan', 'Block']], 'an unknown key is ignored');
});
