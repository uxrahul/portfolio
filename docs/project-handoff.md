# Portfolio project handoff

## Approved state and boundaries

About (`/`), the complete HEIR case study (`/heir/`), and a shared-layout 404 are
implemented. HEIR preserves its introduction, five projects, conclusion, 48
research bullets, 28 visuals, source emphasis, and captions. The approved
introduction uses the shortened italic subtitle, revised role above
the unchanged context paragraph, and eight labeled SVG tool icons inside one
metadata block with subtle top/bottom dividers. The three editorial milestone
cards remain approved.
Other typography, section/Goal treatments, motion, figures, and viewer
remain as implemented at the initial `ef62f53` baseline. Do not reintroduce the
subsequently rolled-back editorial hierarchy experiments.

All five linked Quarto reports are complete and approved native MDX pages: information architecture,
usability validation, customer survey, feature adoption, and activity analysis.
Pending work: the supporting Word documents,
Remaining HEIR product galleries and Lira content. The supplied résumé PDF is available at
`/resume.pdf`; its editable source is not published. Six internal content
destinations remain quiet text; the existing
sedentary demo is the one published external destination. Preserve all 13 IDs and
relationships in the sibling `heir-content-map.yml`; activate routes only when their
actual pages and fragments exist. Further content migration requires authorization.

## Architecture and main files

Pinned Astro 7.3.8, MDX 8.0.3, Tailwind 4.3.3, and TypeScript generate
static pages. There is no Starlight or React runtime. Native shared image rails
replace the Embla runtime; its dependency remains installed without unrelated cleanup.

- `PortfolioLayout.astro` owns the shared shell, theme, native Astro ClientRouter,
  pagination, and global image dialog. `[...slug].astro` renders MDX collections;
  `remark-case-sections.mjs` emits real h2 headings and stable section IDs.
- `tokens.css` owns typography, semantic light/dark colors, spacing, and motion.
  `global.css` supplies component/responsive styles. Source Sans 3 and the 43rem
  reading measure remain canonical; captions are centered.
- `navigation.ts` owns the single global hierarchy. `NavigationItems` uses native
  disclosures, session expansion state, and 260ms height/chevron motion. Below
  900px, the Menu drawer contains focus, makes background content inert, locks
  scrolling, and closes with Escape. Active labels use accent, weight, and tint;
  there is no active-state dot.
- `TableOfContents` and `table-of-contents.ts` track progress using actual section
  scroll ranges. HEIR exposes six major entries; About omits the TOC. The TOC is
  fixed on desktop and a disclosure below 1200px. Normal document scrolling,
  anchors, native history, and focus behavior are preserved.
- Only `reading-canvas` moves horizontally during 300ms page transitions; header,
  navigation, and TOC remain stationary. `section-motion.ts` supplies subtle 400ms
  vertical entrances for sections/figures/cards. Reduced motion and anchor targets
  skip motion as appropriate.

## Global navigation and personal branding

The navigation and branding refinement is approved for publication. Ganance
starts expanded, its Product Gallery starts collapsed, and Lira starts collapsed.
Lira remains expandable; unpublished leaves are non-focusable text with
`aria-disabled="true"`, using a readable mix of existing muted/on-surface-variant
tokens. Session choices persist, while active-page ancestors always reopen,
including Ganance on HEIR and its research routes. Existing active indicators,
260ms submenu motion, and mobile drawer behavior remain intact.

`PersonalLogo.astro` uses the supplied transparent black/white 48px PNGs from
`source-materials/Website portfolio/My logo/`, displayed at 24px beside the name
in both headers. No SVG was supplied. Only the needed assets were copied:
header images in `src/assets/branding/`, themed 32px favicons and 192px touch
icons in `public/branding/`, plus a legacy `/favicon.ico` containing the supplied
light-theme 16/32/48px images. The head PNG/touch icons follow Light/Dark/System
and Astro page swaps; the old placeholder SVG favicon is removed.

Resume uses a small decorative external-window icon and opens `/resume.pdf` in a
new tab with `noopener noreferrer`. The supplied one-page PDF was renamed from
`public/Rahul's resume.pdf` without changing its bytes; native browser viewing
and downloading are available. `src/data/resume.mjs` checks availability at build
time; without the PDF, Resume renders disabled text with the same icon.

Desktop and 393px mobile navigation, submenu opening/closing, active-page reveal,
drawer Escape/focus return, black/white header logos and browser favicons, and
the résumé's separate-tab PDF viewer were checked locally. Production build,
type/link/token checks, and original HEIR/research fidelity checks pass. No source
materials were modified or imported wholesale.

## Homepage editorial redesign — approved

The homepage now follows the updated read-only
`source-materials/Website portfolio/Homepage/homepage.docx`: headline/supporting
copy, Selected Impact, Expertise / How I Work, Select Tools, and A Little About Me.
All project wording, statistics, three capability descriptions, and personal copy
remain exact. The source-document footer is an editorial annotation, not site copy.
The refreshed 768 × 915 Chicago portrait is copied unchanged into
`src/assets/homepage/about-me.webp`; Astro supplies optimized responsive delivery.

`Homepage.astro` owns the five-section composition, with one dominant h1,
vertically centered desktop portrait and centered phone placement, an image-led Ganance feature using the existing
HEIR photograph, quieter informational Lira copy, numbered capability stages,
and a personal typographic closing. The MDX route delegates to that component;
its former duplicate name h1 and Next pagination are replaced by the editorial
hero and project links. `/heir/` links retain native Astro transitions.
`homepage.css` scopes a wider 76rem maximum canvas and fluid title/spacing values
to the homepage. The global navigation, 43rem case-study/research canvas, TOC,
figures, carousel system, and shared page transitions retain their presentation.

`homepage-motion.ts` uses native Web Animations, IntersectionObserver, and one
requestAnimationFrame update per scroll frame. Hero content enters progressively;
other elements reveal once as they enter view. The capability nearest the reading
area gains quiet accent/typographic emphasis without pinning or scroll snapping.
Reduced motion cancels entrances and scroll emphasis; content is visible without
JavaScript, focused elements cancel their entrance, and Astro swaps clean up
observers, listeners, and active animations. No new dependency or hydration is added.

`HomepageTools.astro` preserves Figma, R, SQL, Mixpanel, Datadog, Firebase,
BigQuery, React, Qualtrics, ChatGPT, Claude, in that order. Existing matching SVGs
are reused; R/Mixpanel/Datadog are copied from the supplied logo set.
The subsequently supplied Claude flower/BigQuery shield SVGs describe themselves
as vector recreations and do not match the verified product marks. They remain
unchanged in source materials. The homepage instead uses the Claude symbol path
from `https://claude.com/` and Google's official BigQuery SVG from the core product
archive linked at `https://cloud.google.com/icons`, with styling normalized for
inline SVG delivery. Only the two needed icons are imported. SQL correctly
uses the generic SQL asset, not a MySQL substitution. Mixpanel/ChatGPT inherit
theme text color, as does Claude; the other source marks retain their original colors.

The focused refinement separates section eyebrows (13px tracked muted semibold),
company labels (15px untracked semibold ink), and discipline metadata (12px,
11px on phones). Lira is a narrow, 42rem maximum text-only feature, with its label
above its title and description. Desktop/tablet portrait offsets are removed;
the hero grid centers the photo vertically, and phone margins center its existing
80% width. Approved wording, image bytes, route links, and motion remain unchanged.
The refinement was reviewed on desktop and a 393 × 852 phone preview, including
portrait framing, Selected Impact/Lira hierarchy, SVG wrapping, and dark-theme
legibility. A clean private preview avoided the regular browser's extension/zoom
artifacts. Both added marks render correctly. Production build, Astro/content
checks, HEIR and all five research fidelity checks pass.

Desktop, tablet, and phone layouts, light/dark themes, natural capability
progression, reduced motion, and internal navigation were reviewed in the local
production preview. An OOXML-to-built-HTML check confirms every substantive
source paragraph/heading, the tool order, and portrait bytes. Standard production,
type/link/token, HEIR fidelity, and all five research fidelity checks pass.
The resumed final review also covered 320 × 721 and 393 × 852 phone viewports,
including the full tool list and closing copy, mobile drawer, and light/dark
themes. The earlier apparent mobile clipping was not reproduced; no overflow
fix or further design change was needed. Final `check`, `build`, `verify:source`,
`verify:research`, and `git diff --check` passed. The production preview is left
at the desktop homepage in light mode for review.
The homepage redesign and focused refinements are approved for publication;
source materials remain unchanged.

## HEIR introduction

The opening order is title, shortened italic subtitle, unified role/tools metadata,
context paragraph, hero/caption, audience paragraph, and milestone cards.
`HeirTools.astro` preserves the approved list and spelling: Figma, Qualtrics,
RStudio, MySQL, Firebase, React, Github, ChatGPT. Eight selected SVGs live in
`src/assets/heir/tools/`; no unused logo set or source manifest is imported.
The supplied generic `sql.svg` is used for MySQL at the user's explicit request;
it is not an official MySQL mark. Github/ChatGPT paths inherit text color for both
themes; other marks preserve source colors. Icons are decorative to assistive
technology, with visible labels, 24px boxes, and responsive flex wrapping.
`.heir-metadata` uses `--divider` above/below, `--space-6` vertical padding and
bottom margin, and no card background. Typography and all later content remain
unchanged. Desktop and 393px mobile layouts were visually reviewed; light/dark
introductory styling was verified before approval.

## First-launch research pages

`/heir/research/information-architecture/` and
`/heir/research/usability-validation/` preserve the complete substantive QMD
structure and precomputed Quarto output: three/two charts/tables in IA and
four/one in usability. Numbered research questions become native h2 headings;
the Method note remains h3 and appears indented in each contextual TOC.
`ResearchContext` adds a compact breadcrumb above the title and an arrow return
link to `/heir/#first-launch`. `ResearchTable` preserves captions and cell values
in semantic, keyboard-focusable horizontal scroll regions. `StatisticalPlot`
and the existing viewer deliver all seven charts; three existing assets are
reused and four selected high-resolution PNG exports are added.

The permanent `heir-ia-study` and `heir-usability-validation` IDs are activated in
`src/data/publication.json` and the synchronized public manifest. The private
registry stays unchanged; all other pending destinations remain quiet text.
R, QMD, Quarto HTML, and CSV files stay outside the site. Neither build nor page
load executes R. `npm run verify:research` compares full text/emphasis, hierarchy,
table cells/captions, chart order/original bytes, and contextual links against the
read-only source pairs. Desktop/393px mobile, themes, all seven viewer images,
Fit/100%/Escape, breadcrumbs, anchored return, history, and table scrolling were
reviewed in a browser. These two pages were approved and pushed in `1aaad4e`.

## Remaining Quarto research pages

The three additional reports use the same MDX architecture and existing
`ResearchContext`, `ResearchTable`, `StatisticalPlot`, shell, TOC, transitions,
and image viewer. No global navigation entries or new presentation styles are
added; the main HEIR MDX remains unchanged.

- `/heir/research/customer-survey/`: complete survey narrative, six charts and
  one table; `heir-customer-survey` returns to `/heir/#haptic-roadmap`.
- `/heir/research/feature-adoption/`: complete feature narrative, four charts and
  one table, including the day-45 qualification and Method note;
  `heir-feature-adoption` returns to `/heir/#haptic-roadmap`.
- `/heir/research/activity-analysis/`: complete activity narrative, eight charts
  and one table; `heir-activity-analysis` returns to `/heir/#activity-guidance`.

Survey and feature charts use untouched 3000px-wide PNG images extracted from
the rendered reports, which are higher resolution than their 2000px standalone
exports and preserve the original output's proportions. Activity uses the eight
3000px standalone exports, reusing three existing assets and adding five.
Embedded chart titles, subtitles, legends, notes, and captions remain intact.
Inline R expressions are replaced only with the original rendered values; R is
never executed. Source QMD/HTML documents and datasets remain outside the site.

`verify:research` now compares all five reports against their read-only source
pairs, including full text/emphasis, hierarchy, exact tables, chart sequence,
original image bytes, breadcrumbs, and permanent IDs with correct return sections.
Production build/check/source verification passed: eight HTML pages and 147
internal links/fragments. All five case-study research links, breadcrumbs, anchored
returns, and browser back/forward were tested in the production preview. The three
new pages were visually reviewed on desktop and 393 × 852 mobile in light/dark
themes; all 18 new chart links opened in the existing viewer and closed with Escape.
Mobile TOC anchors, the navigation drawer, and keyboard access to the feature
table's final columns were checked. No missing charts or content-fidelity issues
were found.
The three additional migrations are approved for commit and push to `origin/main`.
All five permanent research hyperlinks are active through the publication manifest;
their contextual breadcrumbs, TOCs, and section return links use the approved
navigation and page-transition system.

## Phase One Product Gallery — approved

`/heir/gallery/phase-one/` presents the six original chapters, 23 complete stories,
and 59 selected HEIR screens from `src/data/heir-phase-one-gallery.yml`. Title,
introduction, explanation wording, captions, alt descriptions, IDs, and order are
preserved. Cole Nussbaumer Knaflic's *Storytelling with Data* remains an approved
educational reference, with its book title rendered in italics. No external product
references, frames, moodboards, or attribution panels are introduced.

`DesignGallery.astro` extracts the existing Face Scan story/chapter renderer for
both galleries. It reuses the unchanged `DesignRail`, `GalleryImage`, gallery CSS,
`gallery-motion.ts`, and original full-screen viewer. Phase One alone enables
build-time Markdown prose rendering through the existing markdown dependency;
Face Scan retains its prior plain-text paragraph rendering. All 28 Face Scan story
blocks were compared with the pre-extraction build and remain byte-identical.
No typography, spacing, rail physics, theme, motion, or image-viewer styles changed.

`phase-one-images.ts` explicitly imports only the 59 copied PNG originals under
`src/assets/heir/phase-one/`; `phase-one-gallery.ts` resolves metadata at build time.
Astro provides responsive quality-95 WebP inline images while enlargement uses the
untouched originals. The 12 moodboard images, 16 unselected product images, Word
document, and source ZIP remain outside the website. The Unicode onboarding
filename resolution and existing source-directory typo are documented in
`phase-one-gallery-audit.md`; original source files remain untouched.

The existing global Phase one leaf is now active and reveals its ancestors.
Its six-chapter TOC uses the unchanged scroll-progress behavior. Breadcrumb Case
study returns to `/heir/`; the arrow return and Previous link target
`/heir/#first-launch`. Next opens Face Scan, whose Previous link now returns to
Phase One using the existing pagination treatment. Phase two stays disabled.
All paths use the `/portfolio/` helper and native Astro transitions/history.
The 13 permanent registry IDs and existing case-study narrative are unchanged;
Phase One has no preexisting permanent registry entry to activate.

Production build validation now checks both galleries from public inputs: exact
story sequence/text, all captions/alts, design roles, original image bytes,
optimized delivery, explicit asset boundaries, and educational emphasis.
`node scripts/validate-phase-one-gallery.mjs` is a local read-only Word/PNG audit
covering 59 visual matches and all 28 image exclusions; CI needs no private sources.
Check/build, HEIR fidelity, all five research fidelity checks, both gallery source
audits, and whitespace checks pass. The build has ten pages and 326 internal
links/fragments. Desktop, 768 × 1024 tablet, and 393 × 852 phone emulation were
reviewed for screen proportions, complete/partial screens, caption/prose wrapping,
light/dark themes, touch swipe/release protection, arrows/keyboard, original viewer
Fit/100%/Escape/focus return, reduced motion, TOC, drawer, breadcrumbs, anchored
return, pagination, and browser Back. No page-level overflow or missing assets
were observed. Physical-device and physical-trackpad testing were not performed;
native horizontal scrolling handlers are unchanged.

Local review: `http://127.0.0.1:4331/portfolio/heir/gallery/phase-one/`.
The complete implementation was reviewed and approved on October 14, 2026.
Commit and push to `origin/main` are authorized; the existing Pages workflow
deploys the approved gallery at
`https://uxrahul.github.io/portfolio/heir/gallery/phase-one/`.

## Evidence, carousels, and milestones

The complete Face Scan Gallery is implemented at `/heir/gallery/face-scan/`.
The October 14 privacy revision uses the revised private Word document as the
source of record. `src/data/heir-face-scan-gallery.yml` preserves six chapters,
28 story headings/order/IDs, and all 60 original HEIR designs, with exact revised
introduction, explanations, and captions. External reference collections,
identifying credits, and all external image assets are removed. Only the 60 HEIR
PNG originals are imported; their bytes and authored alt descriptions are unchanged.

Each story uses the existing responsive `DesignRail` across the available canvas,
without frames or placeholders. The 70rem gallery canvas, 43rem prose measure,
17rem/82% screen sizing, keyboard/arrows/touch/drag interaction, Astro WebP delivery,
original-image viewer, motion, themes, TOC, breadcrumbs, and navigation remain
unchanged. The permanent `heir-gallery-face-scan` link and anchored return to
`/heir/#health-scan` remain active.

Build validation checks exact story text/order, 60 captions/alts/original viewer
bytes, and reference-free metadata/output without private source dependencies.
The local source audit verifies all revised Word wording and 60 visual placements,
original PNG hashes, and exclusion of all external moodboard originals.
See `docs/face-scan-gallery-audit.md` for provenance and Git-history limitations.
The reference-free Face Scan implementation is preserved in this approved
publication, including the earlier privacy removals. Its 28 story blocks remain
unchanged by the Phase One renderer extraction.

`ResearchFigure`, `StatisticalPlot`, and `ProductFigure` share responsive Astro
quality-95 WebP delivery and keyboard-accessible enlargement. Charts retain a
padded white evidence surface in both themes; product imagery remains unframed.
The native `ImageViewer` opens untouched originals, with Fit/100%, local scrolling,
Escape, focus return, and background scroll locking. Drag releases do not open it.

`FigureGroup` is the shared Embla engine for `StatisticalCarousel` and
`MobileUICarousel`. Six groups are implemented: usability, customer priorities,
haptic adoption/retention, activity target outcomes, three paired haptic screens,
and six individual Health Scan stages. Both variants use opposite-edge arrows,
live counts, boundary states, mouse/touch dragging, horizontal wheel gestures,
Arrow Left/Right and Home/End, and reduced-motion support. No autoplay or looping.
Inactive slides are inert; without JavaScript, all figures remain an ordered stack.
`heir-ui.ts` owns UI stage titles/descriptions. Keep `ProductGallery` and the gallery
types/data for future pages; their absence from current routes is not obsolescence.

The milestone cards remain in the HEIR MDX as an ordered list inside the labeled
`product-milestones` section. Stage, number/qualifier, date, and contribution retain
exact source wording and bold emphasis. Semantic surfaces, 24px padding, 4px radii,
and existing type tokens define the cards. The grid responds to available width
with three/two/one columns and forces one column below 540px; no table borders,
shadows, decorative icons, or horizontal scrolling. CSS subgrid aligns desktop
rows. The section keeps its existing entrance animation.

## Source and publication decisions

See `heir-asset-audit.md` for the visual inventory. Adaptive Target/Pace use exact
Word PNG renditions; Health Scan uses the larger 3967 × 8178 embedded originals.
The health-priorities chart has no standalone match, so its intact 2048 × 1229
embedded image is retained. The approved hero uses its matched standalone photo.
No research is recalculated, source wording rewritten, or absent brand visuals added.

The sibling source archive and registry are never edited or copied into the site.
Only approved image copies enter `src/assets/`; datasets, source documents,
credentials, dependencies, caches, and build outputs are ignored. The public link
manifest is intentionally committed so standalone checkouts build without the
private workspace. `sync:links` and `verify:source` need the sibling inputs.

GitHub origin is `https://github.com/uxrahul/portfolio.git`, branch `main`; pushes
are version control and trigger the GitHub Pages workflow. Commit/push/reset require
explicit user instructions. Preserve the local verified rollback
backup under `.git/rollback-backups/`; it is private and must not be cleaned or
published. Earlier private research notes survive in that backup/archive.

## First-launch comparison update — October 14, 2026

The revised main Word document places the existing information-architecture figure
immediately after Context. Its unchanged Settings explanation stays in the
figcaption, without adding a TOC entry. After the first Outcome bullet,
`AppComparison` renders independent Old app and Redesigned app `DesignRail`s:
two screens each, adjacent at 700px and above, stacked below. The existing 43rem
case-study canvas is unchanged. Captions and alt descriptions use the exact user
wording in `src/data/heir-ui.ts`; arrows, touch scrolling, partial previews,
gallery entrance motion, and the shared original-image viewer are reused.

All four 1322 × 2726 PNGs were visually matched and byte-verified against the new
Word table. Only the two old-app PNGs were imported; the redesigned Home and
Settings reuse byte-identical Phase One originals. Existing research pages,
product galleries, six statistical/UI carousels, 48 bullets, and 13 link IDs remain
unchanged. Desktop and 393 × 852 phone emulation were reviewed in light/dark
with independent arrows, swiping, all four enlarged originals, Fit/100%, and
focus return. Production, source-fidelity, research, and gallery checks pass.
This first-launch update is approved for publication together with the unified
carousel implementation described below.

## Unified carousel standard — October 14, 2026

The six legacy case-study carousels now use the gallery's approved native image
rail through shared `ImageRail`, `image-rail.css`, and `design-rail.ts`. Existing
`StatisticalCarousel`/`MobileUICarousel` authoring and source order are preserved;
four chart groups use complete reading-width figures and two UI groups retain
native-ratio compositions and captions. Circular arrows, continuous progress,
fluid scrolling, keyboard, mouse/touch/trackpad, reduced motion, and the unchanged
viewer now share one implementation. The existing galleries keep their visual
presentation and metadata. `.image-rail-composition` aligns paired rails through
equal-height grid columns and flex rows on desktop and natural-height stacks on mobile.
No page width, navigation, prose, original asset, or section/route motion changed.
Desktop/393px mobile emulation, light/dark, caption alignment, arrows/progress,
keyboard, dragging/swiping, viewer, and reduced-motion checks are recorded in
`docs/verification.md`. All check/build/source/research and gallery validation pass.
The user approved publication of the current implementation, including carousel
standardization. The commit titled `Update HEIR case study with before-and-after
app comparisons` is the rollback baseline before any subsequent carousel or
website-width design changes. This baseline includes the relocated IA figure,
four approved comparison screens, shared circular controls/progress, and aligned
comparison navigation. It does not include website-width changes. Preserve this
approved state before starting the next design pass. Find its hash with
`git log --format='%H %s' --grep='Update HEIR case study with before-and-after app comparisons'`.
Private archives, Word documents, datasets, credentials, and temporary files are
excluded; only the two needed old-app PNG originals were added. The redesigned
screens reuse already-published Phase One originals.

## Verification and review

Run `npm run check`, `npm run build`, `npm run verify:source`, and
`npm run verify:research` sequentially.
The build checks pages/fragments, six TOC entries, eight shared image rails, 28 image originals,
13 content relationships, and private-file exclusions. Source verification checks
complete milestone stages against Word table columns, all narrative/UI descriptions,
bullets, emphasis, captions, figure bytes/order, and conclusion.

Use `npm run dev` for editing or `npm run preview -- --host 127.0.0.1` after a build;
open the printed URL (ports may advance) at `/portfolio/`; HEIR is `/portfolio/heir/`. Astro 7 starts background
servers: stop owned servers with `npm run dev -- stop` / `npm run preview -- stop`
before builds/checks, which share Vite caches. Review navigation/history, TOC,
themes, responsive cards, both carousel variants, viewer Fit/100%/Escape, and
reduced motion. `docs/verification.md` records evidence and limits;
`docs/design-system.md` owns detailed presentation conventions.

## GitHub Pages publication

The approved homepage, navigation/branding, and résumé are included in the
publication commit. Astro uses `site: https://uxrahul.github.io` and
`base: /portfolio`, producing `https://uxrahul.github.io/portfolio/`.
`.github/workflows/deploy.yml` follows Astro's official deployment workflow with
`actions/checkout@v7`, `withastro/action@v6` (Node 24, npm lockfile), and
`actions/deploy-pages@v5`. Pushes to main and manual dispatch validate, rebuild,
upload only dist, and deploy through the github-pages environment. Private source
fidelity checks are run locally; CI never requires private archives or datasets.

`src/lib/paths.ts` prefixes internal links from Astro's BASE_URL and removes it
only when matching active navigation/home routes. Permanent registry IDs and
logical destinations remain unchanged. Header links, homepage links, research
breadcrumbs/anchored returns, pagination, résumé, 404 return, themed favicon and
touch-icon paths are prefixed. Astro prefixes imported images, scripts, styles,
and fonts. Local dev/preview use the same `/portfolio/` path.

The build validator checks every internal link/fragment, emitted image/srcset,
script/stylesheet, favicon/theme asset, original viewer image, and private-file
publication boundary under the base path. Source/research validators account for
the prefix without changing their content/byte-fidelity assertions.

Repository visibility is now public and GitHub reports Pages enabled. The existing
GitHub Actions workflow deploys future pushes to `main`; no visibility or hosting
configuration changes are part of this gallery publication.

Publication setup check: GitHub returned HTTP 422 when enabling Pages:
“Your current plan does not support GitHub Pages for this repository.”
That initial private-repository limitation is historical: the repository is now
public with Pages enabled. Browser checks passed
homepage → HEIR → information architecture → anchored first-launch return under
`/portfolio/`. Local check/build/source/research validation and private-file/credential
review passed before the publication commit.
