import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Run the pure visit state with deterministic viewport/time samples. No browser,
// network requests, analytics credentials or additional test dependency needed.
const source = readFileSync(new URL('../src/lib/heir-engagement.ts', import.meta.url), 'utf8');
const context = vm.createContext({ exports: {} });
vm.runInContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context);
const { HeirVisit, durationBucket, choosePrimary } = context.exports;
const sections = ['alpha', 'beta', 'future-section'].map((id, i) => ({ section_id: id, section_title: `Authored heading ${i}`, section_index: i + 1 }));
function visit() {
  const events = [];
  const state = new HeirVisit((name, data) => events.push({ name, data }));
  const sample = (now, section, extra = {}, until = now + 45_000) => state.update({ now, section, eligible: true, depth: 10, atEnd: false, method: 'scroll', ...extra }, until);
  return { state, events, sample, named: name => events.filter(e => e.name === name) };
}

{
  const v = visit();
  v.sample(0, sections[0]); v.sample(300, sections[1]); v.sample(600, sections[2]);
  assert.equal(v.named('heir_section_view').length, 0, 'Fast transient sections are not viewed');
  v.sample(1600, sections[2]);
  assert.equal(v.named('heir_section_view').length, 1);
  assert.equal(v.named('heir_section_view')[0].data.section_id, 'future-section');
  v.sample(2800, sections[0]); v.sample(3800, sections[0]); v.sample(5000, sections[2]);
  v.sample(6200, sections[2]); v.sample(7200, sections[0]);
  assert.equal(v.named('heir_section_view').length, 2, 'Returning to a seen section does not add a view');
  assert.equal(v.named('heir_section_engagement')[0].data.active_seconds, 2.2);
  assert.equal(v.named('heir_section_engagement')[0].data.duration_bucket, '2-9s');
}
{
  const v = visit(); v.state.tocUsed = true;
  v.sample(0, undefined, { eligible: false, depth: 10 });
  v.sample(200, undefined, { eligible: false, depth: 30, method: 'toc' });
  v.sample(400, undefined, { eligible: false, depth: 65, method: 'toc' });
  v.sample(600, sections[2], { depth: 100, atEnd: true, method: 'toc' });
  v.sample(1600, sections[2], { depth: 100, atEnd: true, method: 'toc' });
  assert.equal(v.named('heir_section_view').length, 1);
  assert.equal(v.named('heir_section_view')[0].data.entry_method, 'toc');
  assert.equal(v.named('heir_scroll_depth').length, 1, 'A deep jump never backfills milestones');
  assert.equal(v.named('heir_scroll_depth')[0].data.depth_percent, 100);
  const end = v.named('heir_article_end')[0].data;
  assert.equal(end.active_seconds, 1); assert.equal(end.sections_viewed, 1); assert.equal(end.toc_used, true);
  v.sample(3000, sections[0]); v.sample(5000, sections[2], { depth: 100, atEnd: true });
  v.sample(7000, sections[2], { depth: 100, atEnd: true });
  assert.equal(v.named('heir_article_end').length, 1);
}
{
  const v = visit(); v.sample(0, sections[0]); v.sample(1000, sections[0]);
  v.sample(3000, sections[0], { eligible: false });
  v.sample(63_000, sections[0], { eligible: false });
  v.sample(100_000, sections[0]); v.sample(101_000, sections[0]);
  v.sample(103_000, sections[0], { eligible: false });
  const segments = v.named('heir_section_engagement');
  assert.equal(segments.length, 2); assert.equal(segments[0].data.active_seconds, 3); assert.equal(segments[1].data.active_seconds, 3);
  assert.equal(v.named('heir_section_view').length, 1, 'Hidden/unfocused time cannot qualify new views');
}
{
  const v = visit(); v.sample(0, sections[0]); v.sample(1000, sections[0]);
  v.sample(60_000, sections[0], { eligible: false }, 45_000);
  assert.equal(v.named('heir_section_engagement')[0].data.active_seconds, 45, 'Idle cutoff caps accrual exactly');
  v.sample(120_000, sections[2], { depth: 100, atEnd: true, method: 'deep_link' });
  v.sample(121_000, sections[2], { depth: 100, atEnd: true, method: 'deep_link' });
  assert.equal(v.named('heir_article_end')[0].data.active_seconds, 46, 'Idle gap is excluded from time to end');
}
{
  const v = visit(); let now = 0;
  for (let i = 0; i < 8; i++) {
    v.sample(now, sections[0]); v.sample(now += 2500, sections[0]);
    v.sample(now += 100, sections[0], { eligible: false }); now += 500;
  }
  assert.equal(v.named('heir_section_engagement').length, 3, 'Segment reporting has a per-section visit cap');
  const fresh = visit(); fresh.sample(0, sections[0]); fresh.sample(1100, sections[0]);
  assert.equal(fresh.named('heir_section_view').length, 1, 'A fresh visit resets dedupe');
}
assert.equal(durationBucket(10_000), '10-29s'); assert.equal(durationBucket(30_000), '30-59s');
assert.equal(durationBucket(60_000), '60-119s'); assert.equal(durationBucket(120_000), '120s+');
{
  const v = visit(); let now = 0;
  for (const depth of [25, 50, 75, 100, 50, 100]) {
    v.sample(now, sections[0], { depth, atEnd: depth === 100 });
    v.sample(now += 1100, sections[0], { depth, atEnd: depth === 100 }); now += 100;
  }
  assert.deepEqual(v.named('heir_scroll_depth').map(event => event.data.depth_percent), [25, 50, 75, 100]);
  assert.equal(v.named('heir_article_end').length, 1, 'Reaching the end again cannot duplicate it');
}
const visible = [
  { section: sections[1], start: 0, end: 450, overlap: 300 },
  { section: sections[2], start: 450, end: 650, overlap: 200 },
];
assert.equal(choosePrimary(visible, undefined, 'future-section', true, 250).section_id, 'future-section', 'A short final section wins at article end');
assert.equal(choosePrimary(visible, 'future-section', 'future-section', false, 250).section_id, 'future-section', 'A visible TOC target wins over the generic reading line');

const controller = readFileSync(new URL('../src/lib/heir-analytics.ts', import.meta.url), 'utf8').replace(/^import .*;$/gm, '').replaceAll('import.meta.hot', 'false');
const domContext = vm.createContext({ exports: {}, URL, AbortController,
  withoutBase: path => path.replace(/^\/portfolio(?=\/|$)/, ''),
  location: { origin: 'https://uxrahul.github.io', pathname: '/portfolio/heir/', href: 'https://uxrahul.github.io/portfolio/heir/' } });
vm.runInContext(ts.transpileModule(controller, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, domContext);
const { researchResource, discoverHeirSections } = domContext.exports;
const anchor = (href, extra = {}) => ({ href, textContent: extra.text || 'Public analysis', getAttribute: name => extra[name] || null, hasAttribute: name => Boolean(extra[name]) });
const resource = researchResource(anchor('https://user:secret@example.org/reader%40example.org/report.pdf?token=private#secret', { text: 'Research by reader@example.org' }));
assert.equal(resource.destination, 'https://example.org/[redacted]/report.pdf');
assert.equal(resource.resource_category, 'pdf'); assert.ok(!JSON.stringify(resource).includes('secret'));
assert.ok(!JSON.stringify(resource).includes('reader@'));
assert.equal(researchResource(anchor('https://uxrahul.github.io/portfolio/heir/research/new-report/?private=yes')).resource_category, 'research');
assert.equal(researchResource(anchor('https://uxrahul.github.io/sedentary-algorithm-demo/', { 'data-content-link': 'authored-analysis' })).resource_category, 'analysis');
assert.equal(researchResource(anchor('mailto:reader@example.org')), undefined);
assert.equal(researchResource(anchor('https://uxrahul.github.io/portfolio/heir/#section')), undefined);
assert.equal(researchResource(anchor('https://uxrahul.github.io/portfolio/_astro/image.png', { 'data-image-viewer': true })), undefined);
const article = {};
const heading = (id, options = {}) => ({ id, textContent: `Visible ${id}`, parentElement: article,
  closest: selector => selector === 'section' ? null : options.excluded ? {} : null });
let headings = [heading('first'), heading('gallery', { excluded: true }), heading('future')];
article.querySelectorAll = () => headings;
assert.equal(discoverHeirSections(article).length, 2);
headings.push(heading('later-added'));
const discovered = discoverHeirSections(article);
assert.equal(discovered.length, 3); assert.equal(discovered[2].section_id, 'later-added'); assert.equal(discovered[2].section_index, 3);
console.log('HEIR analytics: dynamic discovery, resource sanitization, short-section landing, dwell, fast skipping, revisits, TOC depth/end attribution, focus/visibility pauses, idle cutoff, buckets and volume limits passed.');
