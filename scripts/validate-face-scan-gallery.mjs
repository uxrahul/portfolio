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
assert.equal(gallery.schema_version, 1);
const assets = Object.entries(gallery.assets);
const stories = gallery.chapters.flatMap((chapter) => chapter.stories);
assert.equal(assets.length, 60);
assert.equal(gallery.chapters.length, 6);
assert.equal(stories.length, 28);
assert.equal(new Set(stories.map((story) => story.id)).size, 28);
assert.equal(new Set(gallery.chapters.map((chapter) => chapter.id)).size, 6);
const placements = stories.flatMap((story) => story.screens);
assert.equal(placements.length, 60);
const originalThumbnails = new Map();
const digest = (data) => createHash('sha256').update(data).digest('hex');
const thumbnail = (data) => sharp(data).flatten({ background: '#fff' }).resize(96, 192, { fit: 'fill' }).removeAlpha().raw().toBuffer();
for (const [id, asset] of assets) {
  assert.equal(asset.role, 'design');
  assert.ok(!('source_credit' in asset));
  assert.ok(asset.alt.trim(), `Missing authored alt: ${id}`);
  const path = resolve(source, asset.source_path);
  assert.ok(path.startsWith(source + '/') && path.endsWith('.png'));
  const bytes = await readFile(path);
  assert.equal(digest(await readFile(resolve(site, `src/assets/heir/face-scan/${id}.png`))), digest(bytes), `Copied original differs from source: ${id}`);
  assert.equal((await sharp(bytes).metadata()).format, 'png');
  originalThumbnails.set(id, await thumbnail(bytes));
}
for (const story of stories) {
  assert.ok(!('references' in story));
  assert.ok(story.title.trim() && story.explanation.trim() && story.screens.length);
  for (const placement of story.screens) {
    assert.equal(gallery.assets[placement.asset_id]?.role, 'design');
    assert.ok(placement.caption.trim());
  }
}
assert.deepEqual(new Set(placements.map((p) => p.asset_id)), new Set(assets.map(([id]) => id)));

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
// Page count is editorial metadata, not a content invariant.
const texts = word.rows.map((row) => row.text);
assert.ok(texts.includes(gallery.title) && texts.includes(gallery.intro));
const positions = stories.map((story) => texts.indexOf(story.title));
assert.ok(positions.every((position, index) => position >= 0 && (!index || position > positions[index - 1])), 'Word story sequence differs.');
let matched = 0;
for (const [index, story] of stories.entries()) {
  const block = word.rows.slice(positions[index], positions[index + 1] ?? word.rows.length);
  assert.ok(block.some((row) => row.text === story.explanation), `Word explanation differs: ${story.id}`);
  const media = block.flatMap((row) => row.images);
  const expected = story.screens;
  assert.equal(media.length, expected.length, `Word placement count differs: ${story.id}`);
  for (const [i, name] of media.entries()) {
    const pixels = await thumbnail(await readFile(word.media[name]));
    const scores = [...originalThumbnails].map(([id, original]) => ({ id, difference: original.reduce((sum, value, j) => sum + Math.abs(value - pixels[j]), 0) / original.length })).sort((a, b) => a.difference - b.difference);
    assert.equal(scores[0].id, expected[i].asset_id, `Word image mapping differs: ${story.id}, placement ${i + 1}`);
    assert.ok(scores[0].difference < 8 && scores[1].difference > scores[0].difference, `Ambiguous visual match: ${name}`);
    matched++;
  }
  const captions = expected.map((placement) => placement.caption).join('');
  assert.ok(block.some((row) => row.text === captions), `Word captions differ: ${story.id}`);
}
assert.equal(matched, 60);
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
const sourcePngs = (await filesIn(resolve(source, 'Gallery/Face scan'))).filter((file) => file.endsWith('.png'));
const designPaths = new Set(assets.map(([, asset]) => resolve(source, asset.source_path)));
assert.deepEqual(new Set(sourcePngs.filter((file) => !file.includes('/Moodboard/'))), designPaths, 'Original HEIR design inventory differs.');
const excludedDigests = new Set(await Promise.all(sourcePngs.filter((file) => file.includes('/Moodboard/')).map(async (file) => digest(await readFile(file)))));
for (const file of [...await filesIn(resolve(site, 'src/assets')), ...await filesIn(resolve(site, 'public')), ...await filesIn(resolve(site, 'dist'))]) {
  assert.ok(!excludedDigests.has(digest(await readFile(file))), `External moodboard original copied/published: ${relative(site, file)}`);
}
assert.ok(gallery.assets['onboarding-camera-access-5-png'].alt.includes('with OK and Don’t Allow'));
console.log('Validated revised Word wording/captions, 28 source-ordered stories, 60 visually matched original HEIR screens, and exclusion of every external moodboard image.');
