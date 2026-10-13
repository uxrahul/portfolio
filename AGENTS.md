# Portfolio repository conventions

Read `docs/project-handoff.md`, `docs/design-system.md`, and
`docs/heir-asset-audit.md` before changing this project.

## Current scope and approval

The user approved the shared Astro layout, navigation, figures, and viewer, then
authorized completion of the entire HEIR case study plus reusable statistical and
mobile UI carousels. All five projects and “Where HEIR stands now” are migrated;
the introductory milestone cards are approved. Preserve that current presentation.
Stop before migrating standalone reports or product gallery pages unless the user
explicitly authorizes them. Preserve the complete source narrative and visual order.

- Never create Git commits, stage, push, reset, or rewrite Git history without
  explicit authorization. GitHub `origin/main` is version control, not deployment.
- Never modify or delete `../source-materials/`.
- Preserve the private rollback backup in `.git/rollback-backups/`; never publish it.
- Preserve all 13 IDs and destination relationships in `../heir-content-map.yml`.
  Pending destinations render plain text, without dead links or status notices.
- Preserve source wording, figures/captions/order, tables, emphasis, qualifications,
  and bullets. Compare actual visual content before selecting source assets.
- Do not invent content, project results, destinations, or interface features.

## Architecture

Astro, MDX content collections, Tailwind v4, custom semantic CSS, and one shared
`PortfolioLayout.astro` render every route. `src/pages/[...slug].astro` renders
content; `/` is About and `/heir/` is HEIR. Starlight is removed.
Technologies may change when they improve visual quality and maintainability;
React is not required for current native interactions.

`src/styles/tokens.css` is the canonical source of design values. Keep Source Sans
3 for headings, reading, and navigation. Components consume semantic color roles.
`src/styles/global.css` supplies the shared shell, editorial rules, Tailwind bridge,
responsive states, and motion. Preserve light/dark/system preference behavior.
Milestone cards use existing semantic surfaces/spacing and an available-width grid;
their copy/emphasis/order must match the original source-table stages.

`src/data/navigation.ts` is the sole global hierarchy. Keep its groups collapsible,
its unavailable entries quiet non-link text, and supporting destinations contextual.
Keep the left navigation on all pages (accessible Menu on mobile). Content pages
have a right-side TOC; only the homepage omits it. Preserve stable section IDs,
previous/next links, native history, normal document scrolling, and keyboard access.

Animate only `reading-canvas` horizontally. Header/navigation/TOC use stationary
snapshots. Major sections and figures enter subtly from below. Respect reduced
motion and skip entrances for focused/anchor targets.

Images are imported from `src/assets/` and optimized inline by Astro. The modal
uses the untouched source, supports Fit/100%, native dialog focus containment,
Escape, focus return, and background scroll locking. Keep image colors original
in both themes. Avoid duplicate inline enlargement panels.

## Verification and local review

Run `npm run check`, `npm run build`, and `npm run verify:source` after substantive
changes. Source verification requires the sibling archive; ordinary builds do not.
Review desktop/mobile composition, navigation, TOC, theme persistence, image
loading/enlargement, focus, anchors, history, and reduced motion in a browser.
Build checks prohibit private research files in `dist/`.

Astro 7 uses background servers: use `npm run dev -- stop` and
`npm run preview -- stop` for owned servers. Do not run check/build concurrently
with a development server sharing Vite caches. No hosting is configured;
publishing a hosted site requires explicit authorization.
