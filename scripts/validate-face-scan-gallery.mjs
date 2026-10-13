// Read-only local source audit. Private documents are never needed by CI.
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import sharp from 'sharp';
import { tmpdir } from 'node:os';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(site, '../source-materials/Website portfolio/Heir case study');
const metadata = await readFile(resolve(site, 'src/data/heir-face-scan-gallery.yml'), 'utf8');
const gallery = YAML.parse(metadata);
const supplied = YAML.parse(await readFile(resolve(site, '../heir-face-scan-gallery.yml'), 'utf8'));
supplied.assets['onboarding-camera-access-5-png'].alt = supplied.assets['onboarding-camera-access-5-png'].alt.replace('with Allow and Don’t Allow', 'with OK and Don’t Allow');
assert.deepEqual(gallery, supplied, 'Only the approved camera-button alt correction may differ from supplied metadata.');
assert.equal(gallery.schema_version, 1);
const assets = Object.entries(gallery.assets);
const stories = gallery.chapters.flatMap((chapter) => chapter.stories);
assert.equal(assets.length, 80);
assert.equal(gallery.chapters.length, 6);
assert.equal(stories.length, 28);
assert.equal(new Set(stories.map((story) => story.id)).size, 28);
assert.equal(new Set(gallery.chapters.map((chapter) => chapter.id)).size, 6);
const placements = stories.flatMap((story) => [...story.references, ...story.screens]);
assert.equal(placements.length, 75);
const designs = assets.filter(([, asset]) => asset.role === 'design');
const unused = assets.filter(([, asset]) => !asset.included_in_document);
assert.equal(designs.length, 60);
assert.equal(unused.length, 7);
const originalThumbnails = new Map();
const unusedDigests = new Set();
const digest = (data) => createHash('sha256').update(data).digest('hex');
const thumbnail = (data) => sharp(data).flatten({ background: '#fff' }).resize(96, 192, { fit: 'fill' }).removeAlpha().raw().toBuffer();
for (const [id, asset] of assets) {
  assert.ok(['design', 'reference'].includes(asset.role), `Invalid role: ${id}`);
  assert.ok(asset.alt.trim(), `Missing authored alt: ${id}`);
  const path = resolve(source, asset.source_path);
  assert.ok(path.startsWith(source + '/'), `Source path escapes archive: ${id}`);
  assert.ok(path.endsWith('.png'), `Expected original PNG: ${id}`);
  const bytes = await readFile(path);
  if (asset.included_in_document) assert.equal(digest(await readFile(resolve(site, `src/assets/heir/face-scan/${id}.png`))), digest(bytes), `Copied original differs from source: ${id}`);
  assert.equal((await sharp(bytes).metadata()).format, 'png', `Wrong file format: ${id}`);
  originalThumbnails.set(id, await thumbnail(bytes));
  if (asset.role === 'reference') assert.ok(asset.source_credit?.trim(), `Missing credit: ${id}`);
  if (!asset.included_in_document) {
    assert.equal(asset.role, 'reference');
    assert.ok(!placements.some((placement) => placement.asset_id === id), `Unused reference placed: ${id}`);
    unusedDigests.add(digest(bytes));
  }
}
for (const story of stories) {
  assert.ok(story.title.trim() && story.explanation.trim());
  assert.ok(story.screens.length > 0, `Story needs HEIR designs: ${story.id}`);
  for (const [collection, role] of [[story.references, 'reference'], [story.screens, 'design']]) {
    for (const placement of collection) {
      const asset = gallery.assets[placement.asset_id];
      assert.ok(asset, `Unknown asset: ${placement.asset_id}`);
      assert.equal(asset.role, role, `Mixed visual treatment: ${story.id}`);
      assert.equal(asset.included_in_document, true);
      assert.ok(placement.caption.trim());
    }
  }
}
assert.deepEqual(new Set(stories.flatMap((story) => story.screens.map((placement) => placement.asset_id))), new Set(designs.map(([id]) => id)));
// Credits are centralized per asset, so reused references keep identical attribution.
for (const [id, asset] of assets) assert.equal(placements.some((p) => p.asset_id === id), asset.included_in_document);

// Read-only OOXML extraction: original Word thumbnails are JPEGs, not PNG exports.
const temporaryMedia = await mkdtemp(resolve(tmpdir(), 'heir-face-scan-audit-'));
const word = JSON.parse(execFileSync('python3', ['-c', String.raw`
import sys, zipfile, json, xml.etree.ElementTree as E
from pathlib import Path
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
with zipfile.ZipFile(sys.argv[1]) as z:
    rels={x.get('Id'):x.get('Target') for x in E.fromstring(z.read('word/_rels/document.xml.rels'))}
    body=E.fromstring(z.read('word/document.xml')).find('w:body',ns)
    rows=[]
    for p in body.findall('.//w:p',ns):
        text=''.join(x.text or '' for x in p.findall('.//w:t',ns)).strip()
        images=[rels[x.get('{'+ns['r']+'}embed')] for x in p.findall('.//a:blip',ns)]
        if text or images: rows.append({'text':text,'images':images})
    media={name:str(Path(sys.argv[2])/Path(name).name) for row in rows for name in row['images']}
    for name, path in media.items(): Path(path).write_bytes(z.read('word/'+name))
    app=E.fromstring(z.read('docProps/app.xml'))
    pages=app.find('{http://schemas.openxmlformats.org/officeDocument/2006/extended-properties}Pages').text
    print(json.dumps({'rows':rows,'media':media,'recordedPages':int(pages)}))
`, resolve(source, gallery.source_document), temporaryMedia], { encoding: 'utf8' }));
assert.equal(word.recordedPages, 28, 'Word recorded page count differs.');
const texts = word.rows.map((row) => row.text);
assert.ok(texts.includes(gallery.title) && texts.includes(gallery.intro));
const positions = stories.map((story) => texts.indexOf(story.title));
assert.ok(positions.every((position, index) => position >= 0 && (!index || position > positions[index - 1])), 'Word story sequence differs.');
const warnings = [];
let matched = 0;
for (const [index, story] of stories.entries()) {
  const block = word.rows.slice(positions[index], positions[index + 1] ?? word.rows.length);
  assert.ok(block.some((row) => row.text === story.explanation), `Word explanation differs: ${story.id}`);
  const media = block.flatMap((row) => row.images);
  const expected = [...story.references, ...story.screens];
  assert.equal(media.length, expected.length, `Word placement count differs: ${story.id}`);
  for (const [i, name] of media.entries()) {
    const pixels = await thumbnail(await readFile(word.media[name]));
    const scores = [...originalThumbnails].map(([id, original]) => ({ id, difference: original.reduce((sum, value, j) => sum + Math.abs(value - pixels[j]), 0) / original.length })).sort((a, b) => a.difference - b.difference);
    assert.equal(scores[0].id, expected[i].asset_id, `Word image mapping differs: ${story.id}, placement ${i + 1}`);
    assert.ok(scores[0].difference < 8 && scores[1].difference > scores[0].difference, `Ambiguous visual match: ${name}`);
    matched++;
  }
  const captions = expected.map((placement) => placement.caption).join('');
  if (!block.some((row) => row.text === captions)) {
    assert.equal(story.id, 'choosing-a-check-in-routine', `Unapproved caption difference: ${story.id}`);
    assert.ok(block.some((row) => row.text === 'Task schedulingSixty second scanThirty second scan'));
    assert.equal(captions, 'Task scheduling60-second scan30-second scan');
  }
}
assert.equal(matched, 75);
await rm(temporaryMedia, { recursive: true });
async function filesIn(path) {
  try {
    const files = [];
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = resolve(path, entry.name);
      files.push(...(entry.isDirectory() ? await filesIn(file) : [file]));
    }
    return files;
  } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
assert.deepEqual(new Set((await filesIn(resolve(source, 'Gallery/Face scan'))).filter((file) => file.endsWith('.png'))), new Set(assets.map(([, asset]) => resolve(source, asset.source_path))), 'Source PNG inventory and asset map differ.');
for (const file of [...await filesIn(resolve(site, 'src/assets')), ...await filesIn(resolve(site, 'public')), ...await filesIn(resolve(site, 'dist'))]) {
  assert.ok(!unusedDigests.has(digest(await readFile(file))), `Unused moodboard original copied/published: ${relative(site, file)}`);
}
console.log('Validated 80 originals, 60 HEIR designs, 28 source-ordered stories/explanations, 75 visually matched Word placements, separate reference/design collections, and seven excluded moodboard assets.');
for (const warning of warnings) console.warn(`REVIEW: ${warning}`);
assert.ok(gallery.assets['onboarding-camera-access-5-png'].alt.includes('with OK and Don’t Allow'));
console.log('Approved numeric scan-duration captions and factual OK-button alt correction are preserved.');
