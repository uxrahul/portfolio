# Portfolio project handoff

Updated October 12, 2026 (America/Chicago).

## Current state and approval boundary

The shared Astro reading layout, global navigation, scroll-aware TOC, typography,
figure presentation, themes, motion, and full-screen viewer are approved. The
entire HEIR case study is now migrated from `HEIR_case_study_structured_2.docx`:
the introduction, all five projects, and “Where HEIR stands now.” This work stops
for review. Do not migrate standalone research reports, product gallery pages,
or resume content without subsequent authorization.

No Git commits, staging, pushes, or deployment occurred. Source materials and the
13-ID authoritative registry remain unchanged. Twelve internal destinations are
pending and render as plain text; the existing external sedentary demo retains
its original URL and relationship.

## Architecture

Astro 7.3.8, MDX 8.0.3, Tailwind 4.3.3, TypeScript, and semantic CSS render static
pages. Embla 8.6.0 supplies the shared carousel interaction without React. About,
HEIR, and 404 share `PortfolioLayout.astro`. The reading measure is 43rem; Source
Sans 3 and semantic light/dark tokens remain canonical. Navigation and TOC stay
stationary while only the reading canvas participates in horizontal page motion.

- `src/content/docs/heir/index.mdx` contains the full approved Word narrative.
- `src/data/navigation.ts` remains the sole global hierarchy; native groups retain
  session state, 260ms expansion, and mobile drawer/focus/scroll behavior.
- `TableOfContents` uses actual section ranges for continuous progress. HEIR
  selects the five project IDs plus `where-heir-stands-now`; About omits the TOC.
- `ResearchFigure`, `StatisticalPlot`, and `ProductFigure` retain Astro quality-95
  WebP delivery and original aspect ratios. Original files remain untouched for
  Fit/100% modal inspection, Escape, background scroll lock, and focus return.
- `FigureGroup` supplies one Embla engine to `StatisticalCarousel` and
  `MobileUICarousel`: opposite-edge controls, counts, drag/swipe, keyboard,
  horizontal wheel handling, boundary states, and reduced-motion behavior.
- Haptics has three paired-screen slides. Health Scan has six individual-stage
  slides with full source titles/descriptions immediately below their imagery.
  `src/data/heir-ui.ts` owns these typed items. The usability carousel retains its
  original ID, images, and captions with the shared navigation conventions.
- The viewer ignores displaced drag-release clicks, while ordinary clicks and
  keyboard activation retain enlargement. No autoplay or decorative UI framing.

## Source fidelity and asset decisions

Every narrative block/table cell, all 48 bullets, bold evidence, italic
qualifications, 24 visuals, and captions are preserved in order. The milestone
remains a semantic table. Word's two screen-composition tables become source-
ordered UI carousels; the haptics table's overall caption is also preserved.

See `heir-asset-audit.md` for the complete visual inventory. All standalone files
were compared by content against embedded visuals. Byte-identical standalone
charts/pairs are used. Embedded Word PNGs preserve the Adaptive Target and Pace
renditions, the higher-resolution six Health Scan screens, and the unmatched
health-priorities chart. That chart still lacks a corresponding standalone export.
The approved hero keeps its original standalone photograph. No source archive
file was changed, no brand-workshop visuals absent from the narrative were added,
and no research was recalculated or rewritten. Superseded site-only Adaptive
Target/Pace WebP copies were removed after confirming they had no remaining imports.

Private CSVs, QMD/Quarto reports, Word companions, and raw research remain outside
the deployed site. Existing provenance gaps remain in `research-dependencies.md`.

## Verification and local review

Run `npm run check`, `npm run build`, and `npm run verify:source`. The source
validator now reads the entire OOXML narrative and verifies all 24 modal image
bytes/order, complete captions/UI descriptions, bullet wording/order, emphasis,
and conclusion. Ordinary builds do not require the archive; source verification
does. Build validation checks six major TOC entries, 24 figures, three carousels,
13 link relationships, internal fragments, and private-file publication boundaries.

See `verification.md` for desktop/mobile interaction review and limitations.
`design-system.md` records shared navigation, figure, carousel, and motion conventions.

From this folder, run `npm run dev` and open its printed URL, normally
`http://localhost:4321/heir/`. Review haptics and Health Scan via the TOC; drag or
swipe, use arrows and keyboard, enlarge a screen, try 100%/Fit and Escape, compare
themes, and read the conclusion. The production preview uses
`http://127.0.0.1:4321/heir/` when started with the explicit IPv4 host.

Astro 7 starts background servers. Stop owned servers with `npm run dev -- stop`
and `npm run preview -- stop` before builds/checks to avoid shared-cache conflicts;
restart previews after a rebuild. No hosting is configured.
