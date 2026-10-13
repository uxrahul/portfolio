"""Compare the complete published HEIR narrative and all visuals with read-only OOXML."""
from pathlib import Path
from html.parser import HTMLParser
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import hashlib
import re

site = Path(__file__).resolve().parents[1]
source = site.parent / 'source-materials/Website portfolio/Heir case study/HEIR_case_study_structured_2.docx'
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
with ZipFile(source) as archive:
    body = list(ET.fromstring(archive.read('word/document.xml')).find('w:body', ns))
    relationships = {r.get('Id'): r.get('Target') for r in ET.fromstring(archive.read('word/_rels/document.xml.rels'))}
    originals = {name: archive.read(name) for name in archive.namelist() if name.startswith('word/media/')}

def text(node):
    return ''.join(t.text or '' for t in node.findall('.//w:t', ns))

def normal(value):
    return re.sub(r'\s+', ' ', value).strip()

class Published(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_article = False; self.tokens = []; self.strong = []; self.italic = []
        self.captures = []; self.figures = []; self.bullets = []; self.list_buffer = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article': self.in_article = True
        if not self.in_article: return
        if tag in ['strong', 'em']: self.captures.append([tag, []])
        if tag == 'a' and 'data-image-viewer' in attrs: self.figures.append(attrs)
        if tag == 'li': self.list_buffer = []
    def handle_endtag(self, tag):
        if self.captures and tag == self.captures[-1][0]:
            kind, values = self.captures.pop()
            (self.strong if kind == 'strong' else self.italic).append(normal(''.join(values)))
        if tag == 'li' and self.list_buffer is not None:
            self.bullets.append(normal(''.join(self.list_buffer))); self.list_buffer = None
        if tag == 'article': self.in_article = False
    def handle_data(self, data):
        if self.in_article:
            self.tokens.append(data)
            for _, buffer in self.captures: buffer.append(data)
            if self.list_buffer is not None: self.list_buffer.append(data)

published = Published(); published.feed((site / 'dist/heir/index.html').read_text())
actual = normal(''.join(published.tokens)); cursor = 0; source_bullets = []; image_order = []
for index, block in enumerate(body):
    paragraphs = block.findall('.//w:tc/w:p', ns) if block.tag.endswith('tbl') else [block]
    for paragraph in paragraphs:
        value = normal(text(paragraph))
        if value:
            found = actual.find(value, cursor)
            assert found >= cursor, f'Source block {index} missing, changed, or out of order: {value}'
            cursor = found + len(value)
        style = paragraph.find('w:pPr/w:pStyle', ns)
        style = style.get('{'+ns['w']+'}val') if style is not None else ''
        if style in ['ContributionPoint', 'OutcomePoint', 'ResearchFinding']: source_bullets.append(value)
        for run in paragraph.findall('.//w:r', ns):
            value = normal(text(run))
            if not value: continue
            run_style = run.find('w:rPr/w:rStyle', ns)
            run_style = run_style.get('{'+ns['w']+'}val') if run_style is not None else ''
            if run_style in ['Strong', 'ContributionFocus', 'OutcomeEvidence', 'ResearchEvidence']:
                assert any(value in emphasis for emphasis in published.strong), f'Missing bold emphasis: {value}'
            if run_style == 'StudyQualification':
                assert any(value in emphasis for emphasis in published.italic), f'Missing qualification emphasis: {value}'
    image_order.extend(relationships[image.get('{'+ns['r']+'}embed')] for image in block.findall('.//a:blip', ns))
assert normal(text(body[1])) in published.italic, 'Subtitle must preserve italic semantics.'
assert published.bullets == source_bullets, 'All source bullets must match in order, wording and count.'
assert len(published.figures) == len(image_order) == 24, 'All 24 Word visuals must be present exactly once.'
for i, (figure, media) in enumerate(zip(published.figures, image_order)):
    delivered = (site / 'dist' / figure['href'].lstrip('/')).read_bytes()
    # The approved introductory hero uses the visually matched standalone photograph.
    expected = (site / 'src/assets/heir/product/hero-image.webp').read_bytes() if i == 0 else originals['word/'+media]
    assert hashlib.sha256(delivered).digest() == hashlib.sha256(expected).digest(), f'Wrong visual/rendition/order at figure {i+1}: {media}'
# Ordinary image-paragraph captions and the two Word UI tables have distinct semantics.
captions = [text(body[i]) for i in [4,21,23,31,33,44,46,57,59,70,77,79,84,96,120]]
actual_captions = [f['data-caption'] for f in published.figures if ' — ' not in f['data-caption']]
assert actual_captions == captions, 'Figure captions must match the source in order.'
for i in [49,130]:
    for cell in body[i].findall('.//w:tc', ns):
        values = [normal(text(p)) for p in cell.findall('w:p', ns) if normal(text(p))]
        assert ' — '.join(values) in [f['data-caption'] for f in published.figures], 'Missing UI stage title or full description.'
print(f'Source fidelity passed: all narrative/table cells in sequence, {len(source_bullets)} exact bullets, bold/italic emphasis, 24 byte-verified visuals, every caption/UI description, and conclusion.')
