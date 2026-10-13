# Portfolio project handoff

## Approved state and boundaries

About (`/`), the complete HEIR case study (`/heir/`), and a shared-layout 404 are
implemented. HEIR preserves its introduction, five projects, conclusion, 48
research bullets, 24 visuals, source emphasis, and captions. The approved
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
HEIR product galleries and Lira content. The supplied résumé PDF is available at
`/resume.pdf`; its editable source is not published. Seven internal content
destinations remain quiet text; the existing
sedentary demo is the one published external destination. Preserve all 13 IDs and
relationships in the sibling `heir-content-map.yml`; activate routes only when their
actual pages and fragments exist. Further content migration requires authorization.

## Architecture and main files

Pinned Astro 7.3.8, MDX 8.0.3, Tailwind 4.3.3, TypeScript, and Embla 8.6.0 generate
static pages. There is no Starlight or React runtime. Dependencies are all in use.

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

## Evidence, carousels, and milestones

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

## Verification and review

Run `npm run check`, `npm run build`, `npm run verify:source`, and
`npm run verify:research` sequentially.
The build checks pages/fragments, six TOC entries, six carousels, 24 image originals,
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

Repository visibility remains private. GitHub Pages must use GitHub Actions as
its source; private-repository Pages availability depends on the account plan.
Do not make the repository public without separate authorization.

Publication setup check: GitHub returned HTTP 422 when enabling Pages:
“Your current plan does not support GitHub Pages for this repository.”
Hosting remains disabled; repository visibility is unchanged. To finish, use an
eligible paid plan (or separately choose public visibility), then Settings → Pages
→ Source: GitHub Actions, and rerun Deploy to GitHub Pages. Browser checks passed
homepage → HEIR → information architecture → anchored first-launch return under
`/portfolio/`. Local check/build/source/research validation and private-file/credential
review passed before the publication commit.
