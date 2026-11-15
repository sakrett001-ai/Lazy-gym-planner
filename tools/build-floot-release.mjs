import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const sourceCommit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8'}).trim();
if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Некорректный идентификатор исходного коммита');
const documents = {};
/* предел размера документа на стороне Floot (helpers/plannerRelease.tsx, maxBytes): больше — Floot отвечает 503 */
const FLOOT_MAX_BYTES = 4_500_000;
for (const lang of ['ru', 'en']) {
  const html = await fs.readFile(path.join(dist, `lazy-gym-planner-offline-${lang}.html`));
  if (!html.toString().includes(`window.PODHOD_VERSION='${pkg.version}'`)) throw new Error('Версия HTML не совпадает с package.json');
  if (/serviceWorker\s*\.\s*register/.test(html.toString())) throw new Error('Сборка Floot не должна регистрировать сервис-воркер');
  /* выбор языка при заходе (src/lang.js) — только на страницах PWA: в окне Floot документ не уходит на другой адрес */
  if (html.toString().includes('PODHOD_LANGS')) throw new Error('Сборка Floot не должна переадресовывать на другой язык');
  if (html.byteLength > FLOOT_MAX_BYTES) throw new Error(`Документ Floot (${lang}) — ${html.byteLength} байт, больше предела ${FLOOT_MAX_BYTES}: Floot его не примет`);
  const relativePath = `floot/releases/${sourceCommit}/planner-${lang}.html`;
  await fs.mkdir(path.dirname(path.join(dist, relativePath)), {recursive:true});
  await fs.writeFile(path.join(dist, relativePath), html);
  documents[lang] = {path:relativePath, sha256:createHash('sha256').update(html).digest('hex'), bytes:html.byteLength};
}
const manifest = {schemaVersion:1, repository:'sakrett001-ai/Lazy-gym-planner', sourceBranch:'main', sourceCommit,
  version:pkg.version, checks:'passed', builtAt:new Date().toISOString(), documents};
await fs.writeFile(path.join(dist, 'floot-release.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Релиз для Floot: ${pkg.version}, исходники ${sourceCommit}`);
