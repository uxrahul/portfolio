// Public build fidelity check: no private archive or research sources required.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
const site = new URL('../', import.meta.url);
const gallery = parse(await readFile(new URL('src/data/heir-face-scan-gallery.yml', site), 'utf8'));
const html = await readFile(new URL('dist/heir/gallery/face-scan/index.html', site), 'utf8');
const decode = (value) => value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10))).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (value) => decode(value.replace(/<[^>]*>/g, '')).trim();
const digest = (value) => createHash('sha256').update(value).digest('hex');
const stories = gallery.chapters.flatMap((chapter) => chapter.stories);
const blocks = [...html.matchAll(/<section class="gallery-story"[^>]*>([\s\S]*?)<\/section>/g)];
assert.equal(blocks.length, 28);
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
  assert.equal(text(block.match(/<p[^>]*>([\s\S]*?)<\/p>/)[1]), story.explanation);
  const figures = [...block.matchAll(/<figure[^>]*data-gallery-asset="([^"]+)"[^>]*data-gallery-role="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)];
  const expected = [...story.references, ...story.screens];
  assert.equal(figures.length, expected.length);
  for (const [i, figure] of figures.entries()) {
    const id = expected[i].asset_id;
    const asset = gallery.assets[id];
    assert.equal(figure[1], id);
    assert.equal(figure[2], asset.role);
    const body = figure[3];
    assert.equal(text(body.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)[1]), expected[i].caption);
    assert.equal(decode(body.match(/<img[^>]*alt="([^"]*)"/)[1]), asset.alt);
    if (asset.role === 'reference') {
      assert.ok(text(body).includes('Reference'));
      assert.ok(text(body).includes(asset.source_credit));
      assert.ok(block.indexOf(`data-gallery-asset="${id}"`) < block.indexOf('data-design-rail'));
    }
    const href = body.match(/<a[^>]*href="([^"]+)"/)[1];
    assert.ok(href.startsWith('/portfolio/_astro/'));
    const original = await readFile(new URL(`src/assets/heir/face-scan/${id}.png`, site));
    const emitted = await readFile(new URL(`dist/${href.replace(/^\/portfolio\//, '')}`, site));
    assert.equal(digest(emitted), digest(original), `Viewer original changed: ${id}`);
    assert.ok(body.includes('.webp'), `Missing optimized delivery: ${id}`);
    placements++;
  }
}
assert.equal(placements, 75);
const copied = await readdir(new URL('src/assets/heir/face-scan/', site));
assert.deepEqual(new Set(copied), new Set(Object.entries(gallery.assets).filter(([, asset]) => asset.included_in_document).map(([id]) => `${id}.png`)));
assert.equal(copied.length, 73);
assert.equal((html.match(/\sdata-design-rail(?:\s|>)/g) || []).length, 28);
assert.equal((html.match(/data-gallery-role="design"/g) || []).length, 60);
assert.equal((html.match(/data-gallery-role="reference"/g) || []).length, 15);
console.log('Gallery: six chapters, 28 exact stories, 75 ordered captions/alts/untouched viewer originals, 60 designs, 15 separately credited references, and only 73 selected assets verified.');
