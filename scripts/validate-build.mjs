import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, dirname } from 'node:path';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path)); else files.push(path);
  }
  return files;
}
const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const deploymentBase = config.match(/base:\s*['"]([^'"]+)['"]/)?.[1].replace(/\/$/, '') || '';
function outputPath(pathname) {
  assert.ok(!deploymentBase || pathname.startsWith(deploymentBase + '/'), `Unprefixed internal URL: ${pathname}`);
  return resolve(root, '.' + pathname.slice(deploymentBase.length));
}
const files = await walk(root);
const forbidden = /\.(csv|tsv|qmd|r|rdata|rds|rhistory|doc|docx|xls|xlsx|ipynb|parquet|feather|db|sqlite|sqlite3|py|tmp|temp|log)$/i;
for (const file of files) {
  assert.ok(!forbidden.test(file), `Private research format deployed: ${relative(root, file)}`);
  assert.ok(!file.includes('source-materials'), 'Source archive must not be deployed.');
}
const documents = new Map();
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate DOM IDs: ${relative(root, file)}`);
  documents.set(file, { html, ids: new Set(ids) });
}
let checked = 0;
for (const [file, { html }] of documents) {
  const pathname = '/' + relative(root, dirname(file)).replaceAll('\\', '/') + '/';
  const base = new URL(deploymentBase + pathname.replace('//', '/'), 'http://portfolio.local');
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    assert.ok(href && href !== '#', `Placeholder href in ${relative(root, file)}`);
    const url = new URL(href, base);
    if (url.origin !== base.origin) continue;
    const path = decodeURIComponent(url.pathname);
    let target = outputPath(path);
    if (path.endsWith('/')) target = resolve(target, 'index.html');
    else if (!path.split('/').at(-1).includes('.')) target = resolve(target, 'index.html');
    assert.ok(target.startsWith(root + '/'), 'Internal href escapes output root.');
    await access(target);
    if (url.hash) {
      assert.ok(documents.get(target)?.ids.has(decodeURIComponent(url.hash.slice(1))), `Missing fragment ${href} in ${relative(root, file)}`);
    }
    checked++;
  }
  for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)) {
    const src = new URL(match[1], base);
    if (src.origin === base.origin) await access(outputPath(decodeURIComponent(src.pathname)));
  }
  for (const match of html.matchAll(/\b(?:data-light-src|data-dark-src)="([^"]+)"/g)) await access(outputPath(match[1]));
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = new URL(candidate.trim().split(/\s+/)[0], base);
      if (url.origin === base.origin) await access(outputPath(url.pathname));
    }
  }

}
for (const file of files.filter((file) => file.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  const base = new URL(deploymentBase + '/' + relative(root, file), 'http://portfolio.local');
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    const url = new URL(match[1], base);
    if (url.origin === base.origin) await access(outputPath(decodeURIComponent(url.pathname)));
  }
}
const home = documents.get(resolve(root, 'index.html')).html;
const heir = documents.get(resolve(root, 'heir/index.html')).html;
assert.ok(home.includes('data-global-navigation') && heir.includes('data-global-navigation'));
assert.ok(!/<nav\b[^>]*\sdata-toc(?:\s|>)/.test(home), 'Homepage must omit its TOC.');
assert.ok(/<nav\b[^>]*\sdata-toc(?:\s|>)/.test(heir), 'HEIR must have its contextual TOC.');
assert.equal((heir.match(/<section\b[^>]*\sdata-case-section(?:\s|>)/g) || []).length, 6, 'HEIR must have five projects and its conclusion.');
for (const id of ['first-launch', 'haptic-roadmap', 'activity-guidance', 'design-system', 'health-scan', 'where-heir-stands-now']) {
  assert.ok(heir.includes(`href="#${id}"`), `Missing native TOC link to ${id}.`);
}
assert.equal((heir.match(/data-content-link=/g) || []).length, 13);
const figureLinks = [...heir.matchAll(/<a\b[^>]*>/g)]
  .map((match) => match[0]).filter((tag) => /\sdata-image-viewer(?:\s|>)/.test(tag))
  .map((tag) => tag.match(/\bhref="([^"]+)"/)[1]);
const representativeOriginals = [
  'product/hero-image.webp', 'product/before-after-ia.png',
  'research/card-sort-ambiguity.png', 'product/old-app-home.png', 'product/old-app-profile.png',
  'phase-one/reading-the-day-at-a-glance--home-overview.png',
  'phase-one/giving-customization-a-clear-home--settings-groups.png',
  'research/task-success.png', 'research/expectation-gap.png',
];
for (const [index, original] of representativeOriginals.entries()) {
  const selected = await readFile(new URL(`../src/assets/heir/${original}`, import.meta.url));
  const delivered = await readFile(outputPath(figureLinks[index]));
  const digest = (data) => createHash('sha256').update(data).digest('hex');
  assert.equal(digest(delivered), digest(selected), `Modal must deliver untouched original: ${original}`);
}
assert.ok(files.some((file) => file.endsWith('.webp')), 'Expected optimized WebP output.');
assert.equal(figureLinks.length, 28, 'The complete HEIR case study must contain all 28 source visuals.');
assert.equal((heir.match(/\sdata-carousel(?:\s|>)/g) || []).length, 0, 'Legacy carousels must be absent.');
assert.equal((heir.match(/class="design-rail figure-rail figure-rail-statistical"/g) || []).length, 4, 'Expected four complete-chart rails.');
assert.equal((heir.match(/class="design-rail figure-rail figure-rail-mobile-ui"/g) || []).length, 2, 'Expected haptics and Health Scan rails.');
console.log(`Validated ${documents.size} HTML pages, ${checked} internal links/fragments, six TOC headings, 28 figures, eight unified image rails, original-image integrity, and publication boundaries.`);
await import('./validate-gallery-build.mjs');

const comparison = heir.match(/<div[^>]*class="heir-app-comparison[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[0];
assert.ok(comparison, 'Missing old/redesigned app comparison.');
assert.equal((heir.match(/\sdata-design-rail(?:\s|>)/g) || []).length, 8, 'Expected six figure rails and two independent comparison rails.');
assert.ok(heir.indexOf('before-after-ia') < heir.indexOf('Make everyday device controls easy'), 'IA comparison must follow Context before Goal.');
assert.ok(heir.indexOf('I tested an interactive Figma prototype') < heir.indexOf('class="heir-app-comparison'));
assert.ok(heir.indexOf('class="heir-app-comparison') < heir.indexOf('Average task success increased'));
console.log('First-launch comparison: relocated IA original and two independent two-screen design rails verified.');

for (const route of ['heir/index.html', 'heir/gallery/phase-one/index.html', 'heir/gallery/face-scan/index.html']) {
  const html = documents.get(resolve(root, route)).html;
  const rails = (html.match(/\sdata-design-rail(?:\s|>)/g) || []).length;
  for (const control of ['data-rail-previous', 'data-rail-next', 'data-rail-progress']) {
    assert.equal((html.match(new RegExp(`\\s${control}(?:\\s|>)`, 'g')) || []).length, rails, `${route}: every rail must have shared arrows and progress.`);
  }
  assert.ok(!/data-figure-previous|data-figure-next|data-figure-position|data-carousel(?:\s|>)/.test(html), `${route}: legacy carousel presentation must be absent.`);
}
console.log('All 59 case-study/gallery rails use shared circular controls and progress indicators.');
