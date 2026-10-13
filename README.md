# Rahul Singh portfolio

Astro + native MDX collections + Tailwind v4 + a custom shared editorial layout.
Source Sans 3 and semantic light/dark tokens remain the foundation. Starlight is
removed. About and HEIR use the same shell; 404 uses it too.

The complete HEIR case study, including all five projects and the conclusion, is
source-verified. Its 24 visuals and 13 permanent content relationships are preserved.
Shared Embla carousels support statistical plots and mobile UI compositions.
Standalone research reports and product gallery pages remain outside this scope.

## Review locally

Open this folder in VS Code, then run:

```sh
npm ci
npm run dev
```

Use Node 24 LTS or a version supported by the pinned Astro release. Open the URL
printed by Astro, normally `http://localhost:4321/`. Visit `/heir/` and use the
TOC to review all five projects and “Where HEIR stands now.”

Review at desktop and mobile widths. Use Appearance for System/Light/Dark (inside
Menu on mobile). Test the hierarchy and TOC, click any evidence figure, switch
between Fit and 100%, then close or press Escape. Move between About and HEIR and
use browser back/forward to inspect canvas-only motion. Reduced motion follows
your system or browser emulation preference.

Four statistical plot pairs, three paired haptic compositions, and six Health Scan stages
use manual carousels. Test opposite-edge arrows, mouse dragging/touch swiping,
horizontal trackpad gestures, and Arrow Left/Right or Home/End while focused.
Each figure opens in the shared full-screen viewer; no autoplay is used.

The three milestone cards adapt to available width and stack on phones, without
horizontal scrolling. Transparent source evidence remains on a light image surface in both
themes, so original black chart labels remain readable.

Astro 7 starts background servers. Stop your dev server with:

```sh
npm run dev -- stop
```

For a production review, stop the dev server, then run:

```sh
npm run check
npm run build
npm run verify:source
npm run preview
```

Preview serves the current `dist/`; rebuild after changes. Stop it with
`npm run preview -- stop`. Run checks/builds sequentially with the dev server
stopped, because they share Vite's cache. Work remains local: no hosting or
production domain is configured. The GitHub repository versions the website;
it does not deploy it.

## Editing and boundaries

- `src/layouts/PortfolioLayout.astro`: shared shell and document layout.
- `src/pages/[...slug].astro`: content-driven routing and contextual headings.
- `src/content/docs/`: About and complete HEIR MDX. Explicit `tocSections` selects six major HEIR IDs.
- `src/styles/tokens.css`: canonical design values and semantic roles.
- `src/styles/global.css`: editorial layout, responsive states, and motion.
- `src/data/navigation.ts`: single approved global hierarchy.
- `src/components/`: recursive navigation, stable links, sections, figures, modal, gallery.
- `src/lib/`: shell interactions, navigation state, motion, carousel and modal lifecycle.
- `docs/heir-asset-audit.md`: all source visuals, matching decisions and ambiguities.
- `docs/verification.md`: browser and automated verification evidence.
- `AGENTS.md` and `docs/project-handoff.md`: scope and continuation instructions.

Preserve `../source-materials/` and `../heir-content-map.yml`. Raw research and Word
sources stay outside the deployable website. A standalone checkout builds without
that archive; `verify:source` deliberately requires it for source comparison.

`npm run sync:links` regenerates `src/generated/heir-links.json` from the root
registry and `src/data/publication.json`. All 13 permanent IDs remain intact.
Pending internal targets render text; only activate a destination after its actual
page/gallery and fragment exist. Do not infer routes from passage wording.
