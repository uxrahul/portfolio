# Portfolio project handoff

## Approved state and boundaries

About (`/`), the complete HEIR case study (`/heir/`), and a shared-layout 404 are
implemented. HEIR preserves its introduction, five projects, conclusion, 48
research bullets, 24 visuals, source emphasis, and captions. The latest approved
change replaces only the introductory milestone table with three editorial cards.
Other typography, section/Goal treatments, navigation, motion, figures, and viewer
remain as implemented at the initial `ef62f53` baseline. Do not reintroduce the
subsequently rolled-back editorial hierarchy experiments.

Pending work: standalone research reports, HEIR product galleries, Lira content,
and resume. Twelve internal content destinations remain quiet text; the existing
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
are version control, not deployment. Commit/push/reset require explicit user
instructions. No hosting is configured. Preserve the local verified rollback
backup under `.git/rollback-backups/`; it is private and must not be cleaned or
published. Earlier private research notes survive in that backup/archive.

## Verification and review

Run `npm run check`, `npm run build`, then `npm run verify:source` sequentially.
The build checks pages/fragments, six TOC entries, six carousels, 24 image originals,
13 content relationships, and private-file exclusions. Source verification checks
complete milestone stages against Word table columns, all narrative/UI descriptions,
bullets, emphasis, captions, figure bytes/order, and conclusion.

Use `npm run dev` for editing or `npm run preview -- --host 127.0.0.1` after a build;
open the printed URL (ports may advance) and visit `/heir/`. Astro 7 starts background
servers: stop owned servers with `npm run dev -- stop` / `npm run preview -- stop`
before builds/checks, which share Vite caches. Review navigation/history, TOC,
themes, responsive cards, both carousel variants, viewer Fit/100%/Escape, and
reduced motion. `docs/verification.md` records evidence and limits;
`docs/design-system.md` owns detailed presentation conventions.
