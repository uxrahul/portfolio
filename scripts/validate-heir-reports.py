"""Check native research pages against precomputed Quarto output; never execute R."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import re

SITE = Path(__file__).resolve().parents[1]
SOURCES = SITE.parent / 'source-materials/Website portfolio/Heir case study/01 A clearer app for the first launch/IA'
REPORTS = [
    ('information-architecture', 'IA redesign/Quarto analysis', 'heir_information_architecture_research_report', 3, 2),
    ('usability-validation', 'Usability tests/Quarto analysis', 'heir_redesign_usability_report', 4, 1),
]

class Node:
    def __init__(self, tag, attrs=()):
        self.tag = tag; self.attrs = dict(attrs); self.children = []
    def all(self, tag=None):
        for child in self.children:
            if isinstance(child, Node):
                if tag is None or child.tag == tag: yield child
                yield from child.all(tag)
    def text(self):
        return ''.join(child.text() if isinstance(child, Node) else child for child in self.children)

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node('root'); self.stack = [self.root]; self.feed(html)
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs); self.stack[-1].children.append(node)
        if tag not in ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']:
            self.stack.append(node)
    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]; break
    def handle_data(self, text): self.stack[-1].children.append(text)

def normal(text):
    # QMD's straight quotes become smart quotes in Quarto's rendered typography.
    text = text.translate(str.maketrans({'“': '"', '”': '"', '‘': "'", '’': "'"}))
    return re.sub(r'\s+', ' ', text).strip()

def blocks(node):
    result = []
    for child in node.children:
        if not isinstance(child, Node): continue
        if child.tag == 'nav': continue
        if child.tag == 'table':
            cells = [normal(x.text()) for x in child.all() if x.tag in ['caption', 'th', 'td']]
            result.append(('table', cells))
        elif child.tag in ['h1', 'h2', 'h3', 'p', 'li'] and normal(child.text()):
            result.append(('text', normal(child.text())))
        elif child.tag == 'img': result.append(('chart', ''))
        else: result.extend(blocks(child))
    return result

for slug, folder, stem, chart_count, table_count in REPORTS:
    source_path = SOURCES / folder / (stem + '.html')
    original = next(Document(source_path.read_text()).root.all('main'))
    path = SITE / 'dist/heir/research' / slug / 'index.html'
    html = path.read_text(); native_doc = Document(html).root
    native = next(native_doc.all('article'))
    assert blocks(original) == blocks(native), f'{slug}: text, table cells, chart positions, or ordering differ.'
    for tag in ['strong', 'em']:
        native_emphasis = [normal(x.text()) for x in native.all(tag)]
        if tag == 'em': native_emphasis = native_emphasis[1:]  # Shared italic page-deck convention.
        assert [normal(x.text()) for x in original.all(tag)] == native_emphasis, f'{slug}: lost {tag} semantics.'
    old_headings = [x for x in original.all() if x.tag in ['h1', 'h2']]
    new_headings = [x for x in native.all() if x.tag in ['h1', 'h2', 'h3']]
    expected_depths = ['h1'] + ['h2' if x.tag == 'h1' else 'h3' for x in old_headings[1:]]
    assert [x.tag for x in new_headings] == expected_depths, f'{slug}: hierarchy differs.'
    assert len(list(native.all('img'))) == chart_count
    assert len(list(native.all('table'))) == table_count
    assert not list(native.all('pre')) and not list(native.all('code')), 'R code must stay private.'
    source_qmd = source_path.with_suffix('.qmd').read_text()
    source_qmd = re.sub(r'```\{r[^\n]*\}\n[\s\S]*?```', '', source_qmd)
    qmd_headings = re.findall(r'^#{1,2} (.+)$', source_qmd, re.M)
    assert qmd_headings == [x.text() for x in old_headings[1:]], 'QMD and rendered analysis structure must agree.'
    exports = sorted((source_path.parent / ('ia_research_pngs' if slug == 'information-architecture' else 'usability_pngs')).glob('*.png'))
    viewers = [x for x in native.all('a') if 'data-image-viewer' in x.attrs]
    assert len(viewers) == len(exports) == chart_count
    for viewer, export in zip(viewers, exports):
        delivered = SITE / 'dist' / viewer.attrs['href'].lstrip('/')
        assert hashlib.sha256(delivered.read_bytes()).digest() == hashlib.sha256(export.read_bytes()).digest(), 'Viewer must deliver untouched source chart.'
    assert 'data-global-navigation' in html and 'data-toc' in html
    assert any(x.attrs.get('href') == '/heir/#first-launch' for x in native.all('a'))
    assert any(x.attrs.get('aria-label') == 'Breadcrumb' for x in native.all('nav'))
    assert any(x.attrs.get('href') == '/heir/' for x in native.all('a'))
    print(f'{slug}: all source text/emphasis, QMD section hierarchy, {chart_count} original charts, {table_count} exact tables/captions, and contextual links passed.')

case = Document((SITE / 'dist/heir/index.html').read_text()).root
for link_id, slug in [('heir-ia-study', 'information-architecture'), ('heir-usability-validation', 'usability-validation')]:
    link = next(x for x in case.all('a') if x.attrs.get('data-content-link') == link_id)
    assert link.attrs['href'] == f'/heir/research/{slug}/'
print('Both permanent case-study links resolve to their native research pages.')
