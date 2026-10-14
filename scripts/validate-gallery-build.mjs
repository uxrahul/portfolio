// Public build fidelity check: no private archive or research sources required.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
const site = new URL('../', import.meta.url);
for (const {slug, stories: expectedStories, screens: expectedScreens} of [
  {slug: 'face-scan', stories: 28, screens: 60},
  {slug: 'phase-one', stories: 23, screens: 59},
]) {
const gallery = parse(await readFile(new URL(`src/data/heir-${slug}-gallery.yml`, site), 'utf8'));
const html = await readFile(new URL(`dist/heir/gallery/${slug}/index.html`, site), 'utf8');
const decode = (value) => value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10))).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (value) => decode(value.replace(/<[^>]*>/g, '')).trim();
const digest = (value) => createHash('sha256').update(value).digest('hex');
const stories = gallery.chapters.flatMap((chapter) => chapter.stories);
const blocks = [...html.matchAll(/<section class="gallery-story"[^>]*>([\s\S]*?)<\/section>/g)];
assert.equal(gallery.chapters.length, 6);
assert.equal(blocks.length, expectedStories);
assert.ok(text(html).includes(gallery.title));
assert.ok(text(html).includes(gallery.intro));
let lastChapter = -1;
for (const chapter of gallery.chapters) {
  const position = html.indexOf(`id="${chapter.id}"`);
  assert.ok(position > lastChapter);
  lastChapter = position;
}
let placements = 0;
for (const [index, story] of stories.entries()) {
  const block = blocks[index][0];
  assert.ok(block.includes(`id="${story.id}"`));
  assert.equal(text(block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)[1]), story.title);
  assert.equal(text(block.match(/<p[^>]*>([\s\S]*?)<\/p>/)[1]), story.explanation.replace(/\*/g, ''));
  const figures = [...block.matchAll(/<figure[^>]*data-gallery-asset="([^"]+)"[^>]*data-gallery-role="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)];
  const expected = story.screens;
  assert.equal(figures.length, expected.length);
  for (const [i, figure] of figures.entries()) {
    const id = expected[i].asset_id;
    const asset = gallery.assets[id];
    assert.equal(figure[1], id);
    assert.equal(figure[2], asset.role);
    const body = figure[3];
    assert.equal(text(body.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)[1]), expected[i].caption);
    assert.equal(decode(body.match(/<img[^>]*alt="([^"]*)"/)[1]), asset.alt);
    assert.equal(asset.role, 'design');
    assert.ok(!('source_credit' in asset));
    const href = body.match(/<a[^>]*href="([^"]+)"/)[1];
    assert.ok(href.startsWith('/portfolio/_astro/'));
    const original = await readFile(new URL(`src/assets/heir/${slug}/${id}.png`, site));
    const emitted = await readFile(new URL(`dist/${href.replace(/^\/portfolio\//, '')}`, site));
    assert.equal(digest(emitted), digest(original), `Viewer original changed: ${id}`);
    assert.ok(body.includes('.webp'), `Missing optimized delivery: ${id}`);
    placements++;
  }
}
assert.equal(placements, expectedScreens);
const copied = await readdir(new URL(`src/assets/heir/${slug}/`, site));
assert.deepEqual(new Set(copied), new Set(Object.entries(gallery.assets).filter(([, asset]) => asset.included_in_document).map(([id]) => `${id}.png`)));
assert.equal(copied.length, expectedScreens);
assert.equal((html.match(/\sdata-design-rail(?:\s|>)/g) || []).length, expectedStories);
assert.equal((html.match(/data-gallery-role="design"/g) || []).length, expectedScreens);
assert.equal((html.match(/data-gallery-role="reference"/g) || []).length, 0);
assert.ok(!/class="[^"\n]*(?:reference-credit|gallery-reference|has-references)|Shen\.ai|\bAVI\b|\bBevel\b|\bOura\b/i.test(html), 'Removed reference material remains in gallery HTML.');
for (const story of stories) assert.ok(!('references' in story));
for (const name of await readdir(new URL('dist/_astro/', site))) assert.ok(!/^reference-(frame|image)-/.test(name), `Removed reference asset emitted: ${name}`);
if (slug === 'phase-one') {
  assert.ok(html.includes('<em>Storytelling with Data</em>'));
  for (const href of ['/portfolio/heir/#first-launch', '/portfolio/heir/gallery/face-scan/']) assert.ok(html.includes(`href="${href}"`));
}
console.log(`${slug}: six chapters, ${expectedStories} exact stories, ${expectedScreens} ordered captions/alts/untouched originals, and no reference images or frames verified.`);
}
