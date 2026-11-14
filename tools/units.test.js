'use strict';
/* Фунты (замечание 5 тестера): всё хранится в килограммах, показывается и вводится в выбранных единицах. Без выбора —
   по языку сборки: английская — фунты для регионов US, LR, MM в navigator.language, иначе килограммы; русская — килограммы.
   Шаги прибавки, гантели, стек, гриф и блины в фунтах — свои (45-фунтовый гриф, блины 45/35/25/10/5/2,5), а не пересчёт.
   Модель приложения на языке сборки — tools/lang-model.js. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadApp} = require('./lang-model');
const day = n => { const x = new Date(); x.setDate(x.getDate() - n); return x.toISOString().slice(0, 10); };

test('the default unit follows the region of navigator.language in English and stays kilograms in Russian; a choice wins', () => {
  const unit = (lang, nav) => loadApp({lang, nav}).get('wu()');
  assert.equal(unit('en', ['en-US', 'en']), 'lb');
  assert.equal(unit('en', ['en-LR']), 'lb');
  assert.equal(unit('en', ['my-MM']), 'lb');
  assert.equal(unit('en', ['en-GB', 'en']), 'kg');
  assert.equal(unit('en', ['en']), 'kg', 'no region — kilograms');
  assert.equal(unit('en', ['de-DE', 'en-US']), 'kg', 'by navigator.language, the first one');
  assert.equal(unit('ru', ['en-US']), 'kg', 'the Russian version defaults to kilograms');
  const ru = loadApp({lang:'ru'}); ru.get(`S.units='lb'`);
  assert.deepEqual(ru.json('[wu(), wUnit(), lUnit(), fmtW(fromU(135))]'), ['lb', 'фнт', 'дюйм', '135 фнт'], 'the choice is available in Russian too');
  const us = loadApp({lang:'en', nav:['en-US']}); us.get(`S.units='kg'`);
  assert.equal(us.get('fmtW(62.5)'), '62.5 kg');
});
test('pounds round-trip: what was typed is shown back, stored in kilograms', () => {
  const en = loadApp({lang:'en', nav:['en-US']});
  for (const lb of [135, 137.5, 45, 2.5, 1.25, 315, 52.5]) assert.equal(en.get(`fmtKg(parseKg('${lb}'))`), String(lb), lb + ' lb');
  assert(Math.abs(en.get(`parseKg('135')`) - 61.235) < 1e-3);
  /* вписанное в килограммах (кратно 50 г) — в фунтах с одной цифрой после точки, целые — без точки (4.101.0: «132.28 lb») */
  assert.equal(en.get('fmtKg(60)'), '132.3', 'a kilogram entry is shown in pounds, one decimal');
  assert.deepEqual(en.json('[62.5, 20, 100, 13.75, 0, 45.35].map(fmtKg)'), ['137.8', '44.1', '220.5', '30.3', '0', '100']);
  assert.equal(en.get('fmtW(60)'), '132.3 lb');
  /* вписанное в фунтах — тем же числом, и в журнале, и в своём плане (там хранится до граммов) */
  for (const lb of ['1.25', '137.5', '52.25', '2.5']) assert.equal(en.get(`fmtKg(parseKg('${lb}'))`), lb, lb + ' lb in the log');
  for (const lb of ['1.25', '137.5', '135', '45']) assert.equal(en.get(`planKgText(parseKgInput('${lb}'))`), lb, lb + ' lb in a plan');
  /* в килограммах — как раньше, до сотых */
  assert.deepEqual(loadApp({lang:'ru'}).json('[60, 62.5, 61.235].map(fmtKg)'), ['60', '62,5', '61,24']);
  assert.equal(en.get(`fmtTon(3 * 10 * parseKg('135'))`), '4,050');
  /* вес в своём плане: «135 / 140 / 145» */
  assert.equal(en.get(`planKgText(parseKgInput('135 / 140 / 145'))`), '135 / 140 / 145');
  assert.equal(en.get(`planKgText(parseKgInput('135'))`), '135');
});
test('progression in pounds: +5 lb on the upper body, +10 on legs, dumbbells by 5 lb, kilogram history snaps to the pound grid', () => {
  const en = loadApp({lang:'en', nav:['en-US']});
  const sug = (id, eq, sets, extra = '') => en.json(`(()=>{Object.assign(S,{mode:'single',goal:'mass'});${extra}LOG.data={${id}:[{d:'${day(3)}',target:${sets.length},s:${JSON.stringify(sets)}.map(([w,r])=>[w==null?null:parseKg(String(w)),r])}]};const s=suggest({...previewItem('${id}'),eqIds:${JSON.stringify(eq)}});return {kg:s.kg==null?null:fmtKg(s.kg),text:s.text,tone:s.tone};})()`);
  const bench = sug('bbbench', ['bb', 'bench'], [[135, 12], [135, 12], [135, 12], [135, 12]]);
  assert.equal(bench.tone, 'up'); assert.equal(bench.kg, '140'); assert.match(bench.text, /^Increase to 140 lb \(\+5\)/);
  const squat = sug('squat', ['bb', 'rack'], [[185, 12], [185, 12], [185, 12], [185, 12]]);
  assert.equal(squat.kg, '195', 'legs +10 lb');
  const db = sug('dbcurl', ['db'], [[25, 15], [25, 15], [25, 15]]);
  assert.equal(db.kg, '30', 'dumbbells by 5 lb');
  const press = sug('legpress', ['legpress'], [[270, 15], [270, 15], [270, 15]]);
  assert.equal(press.kg, '290', 'leg press +20 lb');
  /* история в килограммах: 60 кг = 132,28 фнт → 137,5 (сетка штанги — 2,5 фнт), прибавка — сколько на самом деле */
  const kgHist = en.json(`(()=>{Object.assign(S,{mode:'single',goal:'mass'});LOG.data={bbbench:[{d:'${day(3)}',target:4,s:[[60,12],[60,12],[60,12],[60,12]]}]};const s=suggest({...previewItem('bbbench'),eqIds:['bb','bench']});return [fmtKg(s.kg),s.text];})()`);
  assert.equal(kgHist[0], '137.5'); assert.match(kgHist[1], /\(\+5\.22\)/);
  const deload = sug('bbbench', ['bb', 'bench'], [[135, 10], [135, 10], [135, 10], [135, 10]], `S.mode='program';S.week=4;`);
  assert.equal(deload.tone, 'deload'); assert.equal(Number(deload.kg) % 5, 0, 'a deload weight is on the 5 lb grid: ' + deload.kg);
  /* в килограммах — как раньше */
  const ru = loadApp({lang:'ru'});
  assert.equal(ru.get(`(()=>{LOG.data={bbbench:[{d:'${day(3)}',target:4,s:[[61,12],[61,12],[61,12],[61,12]]}]};return fmtKg(suggest({...previewItem('bbbench'),eqIds:['bb','bench']}).kg);})()`), '63,5', 'kilograms: +2.5 from what was logged');
});
test('warm-up and plates in pounds: 45 lb bar, 45/35/25/10/5/2.5 lb plates, percentages of the rounded weight', () => {
  const en = loadApp({lang:'en', nav:['en-US']});
  const split = lb => en.json(`(()=>{const s=plateSplit(parseKg('${lb}'));return [s.side, fmtKg(s.total), fmtKg(s.diff)];})()`);
  assert.deepEqual(split(135), [[45], '135', '0']);
  assert.deepEqual(split(185), [[45, 25], '185', '0']);
  assert.deepEqual(split(225), [[45, 45], '225', '0']);
  assert.deepEqual(split(140), [[45, 2.5], '140', '0']);
  assert.deepEqual(split(141), [[45, 2.5], '140', '1'], 'what is missing — in pounds');
  const plan = en.json(`warmupPlan(parseKg('225'), 'bb', '8–12').map(s=>[fmtKg(s.kg), s.note])`);
  assert.equal(plan[0][0], '45'); assert.equal(plan[0][1], 'empty bar');
  for (const [w, note] of plan.slice(1)) assert.equal(note, Math.round(Number(w) / 225 * 100) + '%', `${w} lb is ${note} of 225 lb`);
  const html = en.get(`warmupHtml({...previewItem('bbbench'),eqIds:['bb','bench']}, parseKg('225'))`);
  assert.match(html, /Warm-up for 225 lb/); assert.match(html, /Bar 45 lb, plates: 45 · 35 · 25 · 10 · 5 · 2\.5/);
  assert.match(html, /class="pl pl-lb45"/); assert.doesNotMatch(html, /[\d ]kg\b|>kg</, 'no kilograms in the text');
  const dbw = en.json(`warmupPlan(parseKg('60'), 'db', '8–12').map(s=>fmtKg(s.kg))`);
  assert(dbw.every(v => Number(v) % 5 === 0), 'dumbbells by 5 lb: ' + dbw);
  assert.match(en.get(`warmupHtml({...previewItem('legext'),eqIds:['legext']}, parseKg('150'))`), /Weight stack increment assumed to be 10 lb\./);
  /* в килограммах — прежний инвентарь, процент тоже от того, что получилось (замечание 10: 30 из 50 — 60%) */
  const ru = loadApp({lang:'ru'});
  assert.deepEqual(ru.json(`warmupPlan(50, 'machine', '8–12').map(s=>[s.kg, s.note])`), [[30, '60%'], [40, '80%']], 'stack by 5 kg: 55% of 50 is 27.5 → 30, that is 60%');
  assert.deepEqual(ru.json(`warmupPlan(50, 'bb', '8–12').map(s=>[s.kg, s.note])`), [[20, 'пустой гриф'], [27.5, '55%'], [40, '80%']]);
  /* инвентарь каждых единиц хранится отдельно; килограммовый — на прежних местах (прежние версии читают его как раньше) */
  en.get(`(()=>{gearU('lb').bar=35;gearSave();})()`);
  const g = JSON.parse(en.storage.get('podhod.gear.v1'));
  assert.equal(g.bar, 20); assert.deepEqual(g.plates, [25, 20, 15, 10, 5, 2.5, 1.25]); assert.equal(g.lb.bar, 35);
});
test('weight question, journal, CSV and body measurements in pounds and inches', () => {
  const en = loadApp({lang:'en', nav:['en-US']});
  en.get(`LOG.data={bbbench:[{d:'${day(3)}',target:2,s:[[parseKg('135'),10],[parseKg('135'),10]]}]}`);
  const q = en.get(`kgDoubt({...previewItem('bbbench'),eqIds:['bb','bench']},[parseKg('1350')],0).text`);
  assert.match(q, /\(135\slb\)\. Log 1350\slb\?$/);
  assert.equal(en.get(`kgDoubt({...previewItem('bbbench'),eqIds:['bb','bench']},[parseKg('185')],0)`), null);
  const csv = en.get('csvText()');
  /* американский Excel делит столбцы запятой (Mike 3): заголовки с запятой — в кавычках */
  assert.match(csv, /"Weight, lb"/); assert.match(csv, /"Total weight per set, lb"/); assert.match(csv, /,135,10,/);
  assert.match(en.get(`journalVal(EXI.bbbench, LOG.data.bbbench)`), /135<small>lb<\/small> × 10/);
  assert.match(en.get('histHtml(EXI.bbbench)'), /total weight 2,700 lb/);
  assert.match(en.get('unitsHtml()'), /data-units="lb" aria-pressed="true">lb</);
  /* вес тела 180 фнт и талия 34 дюйма: хранятся в кг и см, показываются теми же числами */
  en.get(`(()=>{BODY.rows=mergeBodyRows([], [cleanBodyRow({d:'${day(1)}', kg:bodyFromU(BODY_FIELDS[0], 180), waist:bodyFromU(BODY_FIELDS[1], 34)})]);})()`);
  const row = en.json('BODY.rows[0]');
  assert(Math.abs(row.kg - 81.65) < .01 && Math.abs(row.waist - 86.36) < .01, JSON.stringify(row));
  const body = en.get('bodyHtml()');
  assert.match(body, /<b>180<small>lb<\/small><\/b>/); assert.match(body, /Waist<\/span><b>34<small>in<\/small>/); assert.match(body, /Weight, lb<input/); assert.match(body, /Waist, in<input/);
  assert.match(en.get('bodyCsv()'), /"Weight, lb","Waist, in"/);
  /* русская версия по умолчанию — килограммы и сантиметры, как раньше */
  const ru = loadApp({lang:'ru'});
  ru.get(`(()=>{BODY.rows=[cleanBodyRow({d:'${day(1)}', kg:82.4, waist:88})];})()`);
  assert.match(ru.get('bodyHtml()'), /<b>82,4<small>кг<\/small><\/b>/);
  assert.match(ru.get('bodyHtml()'), /Талия, см<input/);
});
