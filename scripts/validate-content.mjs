import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';

const site = new URL('../', import.meta.url);
const expectedIds = [
  'heir-ia-study', 'heir-usability-validation', 'heir-customer-survey',
  'heir-gallery-phase-two-alerts', 'heir-feature-adoption', 'heir-activity-analysis',
  'heir-adaptive-target-logic', 'heir-movement-categories-logic',
  'heir-gallery-phase-two-data-viz', 'heir-sedentary-demo', 'heir-brand-companion',
  'heir-health-scan-detail', 'heir-gallery-face-scan',
];
const manifest = JSON.parse(await readFile(new URL('src/generated/heir-links.json', site), 'utf8'));
assert.deepEqual(Object.keys(manifest.links).sort(), expectedIds.sort(), 'Permanent IDs must be preserved.');
const registry = new URL('../heir-content-map.yml', site);
try {
  await access(registry);
  const source = await readFile(registry, 'utf8');
  assert.equal(manifest.registrySha256, createHash('sha256').update(source).digest('hex'), 'Run npm run sync:links after registry changes.');
  assert.deepEqual(parse(source).links.map((link) => link.id).sort(), expectedIds);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('Standalone checkout: validated committed public manifest without private workspace.');
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...await walk(path)); else files.push(path);
  }
  return files;
}
const content = await walk(new URL('src/content/docs/', site));
const usedIds = [];
for (const file of content) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/<ContentLink\s+id="([^"]+)"/g)) {
    assert.ok(manifest.links[match[1]], `Unknown reference: ${match[1]}`);
    usedIds.push(match[1]);
  }
  for (const match of source.matchAll(/<CaseSection\s+id="([^"]+)"\s+title="([^"]+)"/g)) {
    assert.ok(/^[a-z][a-z0-9-]*$/.test(match[1]), 'Heading IDs must be stable slugs.');
    assert.ok(!/^\d+[.\s]/.test(match[2]), 'Major TOC headings must be unnumbered.');
  }
}
assert.deepEqual(usedIds.sort(), expectedIds, 'Prototype must retain all 13 relationships once.');
for (const [id, link] of Object.entries(manifest.links)) {
  if (link.status === 'pending') assert.equal(link.href, null, `Pending link must have no href: ${id}`);
  else assert.ok(link.href && link.href !== '#', `Published link needs a destination: ${id}`);
}

const css = await readFile(new URL('src/styles/tokens.css', site), 'utf8');
const primitives = Object.fromEntries([...css.matchAll(/(--palette-[\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]]));
function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
for (const mode of ['light', 'dark']) {
  const prefix = `--palette-${mode}-`;
  const backgrounds = mode === 'light' ? ['background', 'surface', 'primary-container'] : ['charcoal', 'surface', 'primary-container'];
  for (const text of ['ink', 'secondary', 'teal']) {
    for (const background of backgrounds) {
      const ratio = contrast(primitives[prefix + text], primitives[prefix + background]);
      assert.ok(ratio >= 4.5, `${mode} ${text} on ${background} contrast ${ratio.toFixed(2)} is below 4.5.`);
    }
  }
  console.log(`${mode}: body, secondary, and accent text pass 4.5:1 on intended backgrounds.`);
}
console.log('Validated 13 permanent IDs, references, pending links, headings, and semantic text contrast.');
