'use strict';
/* Простые слова вместо жаргона (замечания тестеров к 4.94.0: Ольга п. 7, Виктор п. 14, Alex п. 15–16).
   В тексте карточки, разбора и тренировки нет «1ПМ», «отказа», «БАЗОВОЕ / ИЗОЛИРУЮЩЕЕ», «ЭМГ», «изометрии», «запаса»
   канцелярским оборотом и темпа числами «2-0-1-0»; в английской версии — «1RM», «failure», «reps in reserve», «EMG»,
   «compound / isolation» и кальки из списка тестера. Числа те же: меняются только слова.
   Расшифровка для знающих обозначения — под планом (LEGEND: «Максимум на 1 повтор (1ПМ)…») и в подсказке у темпа.
   Видимый текст в браузере на телефоне — tools/ui-check.mjs (блок «простые слова»). Модель — tools/lang-model.js. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { loadApp } = require('./lang-model');

const JARGON = {
  ru: /1ПМ|отказ|базов|изолирующ|ЭМГ|региональн|изометри|в запасе|с запасом \d|выраженного жжения|двойной прогресс/i,
  en: /1RM|failure|\bcompound\b|\bisolation\b|\bEMG\b|regional emphasis|isometr|in reserve|reserve of|educational|double progression/i
};
/* темп числами — только в подсказке (title) и в поле «Темп» своего плана */
const TEMPO_CODE = /\b\d{1,2}-\d{1,2}-[\dX]{1,2}-\d{1,2}\b/;
/* видимый текст разметки: без тегов и атрибутов; имена для диктора — отдельно (aria-label без подсказки title) */
const textOf = html => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const labelsOf = html => [...html.matchAll(/aria-label="([^"]*)"/g)].map(m => m[1]).join(' · ');

function app(lang) {
  const a = loadApp({ lang });
  a.get(`S.places=PLACE_DEFAULTS.map(p=>({...p,equip:p.equip.slice()}));S.place='gym';S.adapt=null;ensurePlaces(S);LOG.data={};S.customs=[];S.custom=null;ensureCustoms(S);`);
  return a;
}
const PLACES = ['gym', 'home', 'homeband', 'street'];

for (const lang of ['ru', 'en']) {
  test(`${lang}: cards of every goal, level, format, place and cycle week say it in plain words`, () => {
    const a = app(lang), bad = [];
    for (const place of PLACES) for (const goal of ['strength', 'mass', 'cut', 'gentle']) for (const level of ['beg', 'mid', 'adv']) for (const format of ['classic', 'static'])
      for (const week of [0, 1, 2, 3, 4]) {
        if (week && (level === 'mid' || format === 'static')) continue;
        const html = a.get(`(()=>{S.place='${place}';S.adapt=null;ensurePlaces(S);Object.assign(S,{mode:'${week ? 'program' : 'single'}',week:${week || 1},day:0,format:'${format}',goal:'${goal}',level:'${level}',groups:['chest','back','quads','biceps','abs'],count:7,seed:5});
          const p=buildPlan(${week ? '{week:WEEKS[' + (week - 1) + ']}' : ''});if(!p.items)return '';return p.items.map((it,i)=>cardHtml(it,i)).join('')+gentleHtml()+(${week}?WEEKS[${week - 1}].note:'');})()`);
        const t = textOf(html), l = labelsOf(html), where = `${place}/${goal}/${level}/${format}/week ${week}`;
        const j = t.match(JARGON[lang]) || l.match(JARGON[lang]), c = t.match(TEMPO_CODE);
        if (j) bad.push(`${where}: «${j[0]}» — …${t.slice(Math.max(0, j.index - 60), j.index + 60)}…`);
        if (c) bad.push(`${where}: темп числами «${c[0]}» в тексте карточки`);
      }
    assert.deepEqual(bad.slice(0, 8), []);
  });

  test(`${lang}: the first-entry hint, light days and deloads say it in plain words`, () => {
    const a = app(lang), bad = [];
    for (const goal of ['strength', 'mass', 'cut', 'gentle']) for (const level of ['beg', 'mid']) for (const week of [0, 1, 2, 3, 4]) {
      const texts = a.json(`(()=>{Object.assign(S,{goal:'${goal}',level:'${level}',mode:'${week ? 'program' : 'single'}',week:${week || 1},format:'classic'});LOG.data={};const out=[];
        for(const [id,eq] of [['squat',['bb','rack']],['dbcurl',['db']],['assistpull',['gravitron']],['pushup',[]],['bandrow',['band']]])out.push(suggest({...previewItem(id),eqIds:eq}).text);
        const y=dayKey(new Date(Date.now()-864e5));LOG.data={squat:[{d:y,s:[[100,8],[100,8]]}]};AR.light=true;out.push(suggest({...previewItem('squat'),eqIds:['bb','rack']}).text);AR.light=false;
        S.format='static';LOG.data={};out.push(suggest({...previewItem('squat'),eqIds:['bb','rack']}).text);S.format='classic';
        return out;})()`);
      for (const t of texts) { const j = t.match(JARGON[lang]); if (j) bad.push(`${goal}/${level}/week ${week}: ${t}`); }
    }
    assert.deepEqual(bad.slice(0, 8), []);
  });

  test(`${lang}: the exercise breakdown — tempo, muscle notes and sources — says it in plain words`, () => {
    const a = app(lang);
    /* темп словами: усилие и возврат, паузы — если есть, X — быстро */
    const tw = a.json(`['3-0-1-0','4-1-1-0','2-0-X-0','3-0-3-1'].map(tempoWords)`);
    assert.deepEqual(tw, lang === 'ru'
      ? ['усилие 1 с, возврат 3 с', 'усилие 1 с, возврат 4 с, пауза 1 с', 'быстрое усилие, возврат 2 с', 'усилие 3 с, пауза 1 с, возврат 3 с']
      : ['effort 1 s, return 3 s', 'effort 1 s, return 4 s, pause 1 s', 'fast effort, return 2 s', 'effort 3 s, pause 1 s, return 3 s']);
    /* источники («Подробнее о технике») и пояснения к мышцам по фазам у всех упражнений */
    const bad = a.json(`(()=>{const out=[];for(const ex of EX){const pr=motionProfile(ex.anim);
      const txt=[...(SOURCES_BY_EX[ex.id]||[]).map(s=>s[0]),...(pr?.sources||[]).map(s=>s[0]),...Object.values(pr?.notes||{})];
      for(const t of txt)out.push([ex.id,t]);}return out;})()`).filter(([, t]) => JARGON[lang].test(t) || (lang === 'ru' ? /уступающ|Учебный/.test(t) : /eccentric|Illustrative/.test(t)));
    assert.deepEqual(bad.slice(0, 8), []);
    /* подписи областей мышцы — простыми словами */
    const player = fs.readFileSync(path.join(__dirname, '../src/js/12-motion-player.js'), 'utf8');
    assert.match(player, /'Как вся мышца':'Своя доля работы, примерно'/);
    assert.doesNotMatch(player, /Учебный региональный акцент|Общий профиль группы|Темп задания/);
  });

  test(`${lang}: the legend under the plan names 1RM only after saying it in plain words`, () => {
    const a = app(lang), legend = textOf(a.get('LEGEND'));
    if (lang === 'ru') assert.match(legend, /^ ?Максимум на 1 повтор \(1ПМ\) — вес, который вы можете поднять только один раз\. Темп: усилие — подъём веса, возврат — опускание/);
    else assert.match(legend, /^ ?One-rep max \(1RM\) is the weight you can lift only once\. Tempo: effort is lifting the weight, return is lowering it/);
  });
}

test('ru: card badges, thumbnail caption and the muscle panel', () => {
  const a = app('ru');
  a.get(`Object.assign(S,{mode:'single',format:'classic',goal:'mass',level:'mid',groups:['chest','biceps'],count:6,seed:3});plan=buildPlan();`);
  const html = a.get(`plan.items.map((it,i)=>cardHtml(it,i)).join('')`);
  assert.match(html, /<span class="c-type">много мышц<\/span>/);
  assert.match(html, /<span class="c-type">прицельное<\/span>/);
  assert.match(html, /<span class="illus-v">3D-вид · 5 ракурсов<\/span>/);
  const body = fs.readFileSync(path.join(__dirname, '../src/body.html'), 'utf8');
  assert.doesNotMatch(body, JARGON.ru, 'body.html: подписи разбора и тренировки');
});

test('en: no calques from the tester’s list anywhere in the English dictionary', () => {
  const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../i18n/en.json'), 'utf8'));
  const CALQUES = ['Another option', 'Fill in:', 'LOAD BY MUSCLE', 'Assisting work', 'educational illustration', 'Load cue', 'Signal at the end of rest', 'Go to set',
    'total weight of the set', 'Sets in 7 days', 'no main work', 'More: ', 'Show all: ', 'a messenger', 'can’t keep up', 'In 1 h', 'twin of', 'To target',
    'Illustrative regional', 'Educational diagram', 'Shared group profile', 'Prescribed tempo', 'close to failure', 'reps in reserve', 'of 1RM', 'not to failure'];
  const bad = [];
  for (const [k, v] of Object.entries(d)) for (const c of CALQUES) if (v.includes(c)) bad.push(`«${c}»: ${v.slice(0, 100)}`);
  assert.deepEqual(bad, []);
});
