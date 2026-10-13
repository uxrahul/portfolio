# Portfolio design system

A custom shared Astro shell presents the portfolio as an editorial publication.
Source Sans 3, the semantic color palette, the approved hierarchy, and native MDX
content remain the foundation. Starlight presentation and dependencies are removed.
The shared layout, navigation, figure presentation, and viewer are approved.
The complete HEIR case study now uses those conventions; visual review remains
separate from successful automated checks.

## Tokens and type

`src/styles/tokens.css` is canonical. Components use semantic roles; the Tailwind
v4 bridge in `global.css` maps the same values. No component hardcodes palette colors.

| Role | Light | Dark |
| --- | --- | --- |
| Background | #F8F7F4 | #191F21 |
| Surface | #FFFFFF | #222A2D |
| Text | #252B2D | #F1F0EB |
| Readable secondary | #596565 | #BBC5C4 |
| Accent | #315F64 | #9BD1D3 |

The original light muted primitive #7B8585 remains available; ordinary secondary
text uses #596565 for contrast. Normal, secondary, and accent text pass 4.5:1 on
intended background/surface/container roles in both themes.

Source Sans 3 normal and italic Latin variable fonts are locally hosted, with
font-display swap. Body scales from 17 to 18px, line height 1.7; desktop title is
40px, major headings up to 31px, supporting headings up to 24px. Semibold is 600.
The italic source subtitle uses a restrained lead scale and a 1.5 line height.
The reading canvas uses one responsive 43rem content measure. Headings, prose,
figures, and captions use the same horizontal measure. Captions are centered, preserve bold semantics, and use
secondary color and smaller type. Bullets and qualifications are never flattened.

## Shared layout

The desktop shell has a 14rem fixed left navigation and a 13rem reserved right TOC
column. The TOC uses the adjacent page gutter and the same fluid outer padding as
the shell, giving long titles room to wrap without crowding the viewport edge.
The reading region uses fluid padding and a bounded canvas. Only the central
reading canvas participates in horizontal movement. The homepage has no TOC
content and uses the same document shell and reading alignment.

At 900–1199px the TOC becomes a disclosure above the document; the left hierarchy
stays fixed. Below 900px a sticky header exposes Menu, and navigation is a drawer.
Closed mobile navigation is inert. Open navigation locks background scroll,
contains keyboard focus, makes the reading region inert, and closes with Escape
or navigation. The TOC is a separate disclosure. Milestone cards adapt to available
content width and stack on phones without horizontal scrolling. Product gallery
figures stack at every width to retain the content grid.

Unfinished entries are ordinary text. No pending badges or placeholder URLs.
Groups retain expansion state in session storage. Active page and active TOC
section use semantic accent styling. Supporting reports remain contextual.

### Navigation and TOC conventions

Navigation hierarchy uses `--navigation-indent`, compact row spacing, and weight/
type differences. Nested groups have no connector lines. The active page uses a
semibold label and a quiet tinted surface, without a dot. Chevron alignment
is shared at each nesting level. Desktop rows are 40px; mobile rows are at least
44px. The approved hierarchy remains in `src/data/navigation.ts`.

Native `details`/`summary` retain keyboard activation and a no-JavaScript fallback.
Enhanced groups animate only submenu height with the Web Animations API; chevrons
rotate with the same `--motion-duration-navigation` (260ms) and standard easing.
Rapid toggles reverse from the current height. Closing content becomes inert
immediately; its native closed state is applied after motion finishes. Focus
returns to the summary if it was inside closing content. Expansion state remains
in session storage. Reduced motion changes state immediately, without animation.

On mobile the drawer translates from the left, reverses on dismissal, and uses a
subtle fading scrim. Its visibility stays available through the closing motion.
The two-line Menu icon rotates into an X using the same duration/easing. The Menu
button supplies the close control and updates its accessible name/expanded state.
Escape, outside tapping, and navigation also dismiss. Background content and the
header identity become inert while open; scrolling locks and keyboard focus wraps
between Menu and the drawer controls. Resizing to desktop cleans up the open state.

`TableOfContents` is reusable for any ordered set of section IDs. One 1px neutral
track spans its items; the accent fill advances through each item's portion in
proportion to actual scroll distance between that section and the next. Completed
portions remain filled, upcoming portions stay neutral, and reverse scrolling
reverses progress. The final portion completes at the last reachable reading
position. The active title uses `aria-current="location"` with accent/medium weight.
Scroll updates run once per animation frame, without a time-based fill transition.
Resize, content/font layout changes, anchors, history, and Astro swaps recalculate
progress. Hidden compact disclosures retain native behavior; About omits the TOC.
Navigation and TOC snapshots remain stationary during horizontal page transitions.

## Theme and motion

One `portfolio-theme` preference owns System/Light/Dark. An early head script
prevents a theme flash; the shell applies the preference before Astro swaps,
updates the selector after navigation, and follows system changes in System mode.
Storage is optional. Screenshots/charts retain their actual colors. The semantic evidence-surface role
stays white in both themes so transparent source exports retain readable labels.

Astro ClientRouter uses native view transitions with a swap fallback. Only the
named reading canvas slides by 2rem for 300ms; history back reverses direction.
Stationary header, navigation, TOC, and root snapshots have no animations or
geometry morphing. Clipping is confined to the canvas transition group.

Major sections/figures enter from 1rem below over 400ms during normal scrolling.
No pre-JavaScript hiding, snapping, nested reading scroll containers, or focus
obstruction. Reduced motion disables transitions/entrances and smooth scrolling.

## Evidence and reusable components

- `PortfolioLayout`: shared title, shell, themes, navigation, TOC, and pagination.
- `NavigationItems`: recursive native disclosures with animated submenu height.
- `TableOfContents`: contextual links and section-aware continuous reading progress.
- `CaseSection`: stable ID, semantic section and a real MDX h2 injected by remark.
- `ContentLink`: permanent manifest ID, published anchor or plain pending text.
- `ResearchFigure`: full composition, responsive Astro WebP quality 95, caption,
  keyboard-accessible enlargement anchor and progressive fallback.
- `StatisticalPlot`: plot-specific presentation through `ResearchFigure`.
- `ProductFigure`: unframed screenshot/UI presentation through `ResearchFigure`.
- `FigureGroup`: typed ordered figures, stacked by default; optional manual carousel.
- `ImageViewer`: native modal dialog, full original asset, Fit/100% with scrolling,
  close/Escape, focus return, backdrop dismissal, and background scroll locking.
- `ProductGallery`: typed ordered figures, reusing the same modal.

### Figure conventions

`--content-width` owns the reading measure; `--reading-width` aliases it.
`--figure-gap`, `--figure-caption-gap`, `--figure-plot-padding`, border/radius,
control size/gap, and motion tokens centralize figure layout. Do not add per-image
widths or offset margins. The legacy `--canvas-width` remains solely for the
compact TOC disclosure; this refinement does not alter the navigation or TOC.

Statistical plots use a subtle outline and generous responsive padding on the
white evidence surface in both themes. Product compositions and photographs
have no decorative frame or padding. Captions sit outside the image treatment,
centered within the content grid, and retain source wording and emphasis. Do not repeat
titles embedded in a chart or redraw its contents. Images retain their native
aspect ratio. Astro generates responsive delivery sizes without upscaling beyond
the source width; full-resolution originals remain available in the viewer.

`FigureGroup` is the shared Embla 8.6 interaction system, with `id`, accessible
`label`, ordered `FigureItem` values, `presentation="stack" | "carousel"`, and
`variant="statistical" | "mobile-ui"`. `StatisticalCarousel` and
`MobileUICarousel` are the intended authoring wrappers. No React runtime or
carousel autoplay plugin is needed. The existing usability group keeps its ID,
plots, and captions. Four statistical groups cover usability, customer priorities,
haptic adoption/retention, and activity target outcomes. Haptics also uses three
intact paired-screen compositions; Health
Scan uses six individual screens, each with its source stage title and full description.

Both variants have Previous/Next controls on opposite edges, a polite live count,
mouse/touch dragging, and Arrow Left/Right plus Home/End while focused. They do
not autoplay, wrap, or loop. Boundary controls expose `aria-disabled` and remain
focusable so reaching an end does not discard focus. Inactive slides are inert
and hidden from assistive technology; selection transfers focus out of an inactive
slide when necessary. The region itself is keyboard-focusable. Height reserves
the tallest slide and caption, avoiding document jumps. Resize and Astro swaps
reinitialize/destroy the interaction cleanly.

Statistical carousels retain the approved plot frame, responsive padding, white
evidence surface, and centered caption alignment. Their control row sits beneath
captions, with arrows at its left/right edges. Mobile UI carousels have a transparent
image area, no added frame/card/background, and centered native-ratio imagery
bounded by `--figure-ui-height` (32rem). Precomposed pairs remain one image. Each
caption stays directly beneath its composition, aligned with the reading grid;
`captionTitle` supplies the stage title and `caption` its complete description.
Descriptions wrap fully, without clipping or truncation. At wider widths arrows
sit outside the imagery in `--figure-ui-gutter`; below 540px they move below the
caption to preserve the image's usable width. No image is stretched or cropped.

Embla supplies the horizontal motion; its physics duration is calibrated from
`--figure-motion-duration` (240ms), rather than treating its API value as milliseconds.
Reduced motion makes arrow/keyboard/wheel navigation immediate and snaps drag
release without added travel. Horizontal wheel input steps through slides with a
restrained threshold; vertical scrolling, pinch zoom, and boundary gestures remain
native. The track uses `touch-action: pan-y pinch-zoom`. Pointer/touch displacement
suppresses release clicks before the viewer's capture handler; an ordinary next
press or keyboard activation still opens the untouched original in the same modal.
Without JavaScript, figures remain a complete source-ordered stack with controls
hidden. These wrappers can be reused by later Ganance/Lira galleries without
publishing those destinations now.

The image trigger opts out of Astro routing; its capture listener opens the dialog
before the page router handles the click. Modified clicks retain native behavior.
Original files are delivered unchanged in the modal. Do not pass PNG originals
through a quality encoder: even a PNG quality setting can quantize colors.

### HEIR introductory metadata

The shortened source subtitle keeps `.page-deck` typography and italic semantics.
Role and Tools form a single `.heir-metadata` block before the context paragraph
and hero. Top/bottom borders use `--divider`; vertical padding and bottom margin
use `--space-6`. The final paragraph has no bottom margin, keeping padding even.
There is no background, card frame, corner treatment, or added decoration.

`HeirTools.astro` renders the exact approved tool order and labels. Its inline SVG
boxes use `--space-6` (24px), with `--space-2` icon/label gaps. The row wraps at
available width with `--space-3` row gaps and `--space-5` column gaps; each label
stays with its icon. Labels retain body typography. SVGs are hidden from assistive
technology to avoid duplicating visible labels. Github and ChatGPT path fills
inherit text color; other source colors remain intact. MySQL uses the supplied
generic SQL symbol by explicit user approval. Only the eight used SVGs are copied
into the site. Metadata borders follow semantic light/dark theme roles.

### Milestone cards

The labeled `product-milestones` section contains an ordered list of three cards.
Each preserves the complete source-table stage: title, business metric/qualifier,
date/status, and product contribution, with exact wording and bold emphasis.
The reading measure and Source Sans 3 remain unchanged.

`.milestone-cards` uses an auto-fit grid with a scoped 13.5rem minimum card width,
bounded by available width. It fits three columns at 688px and two at 560px; below
540px it explicitly stacks. Cards use `--color-surface`, `--space-6` padding,
`--space-4` gaps, and `--radius-subtle`, without borders, dividers, shadows, gradients,
or icons. CSS subgrid aligns stage/metric/date/contribution rows on wider layouts.
Metrics use `--type-heading-1`; qualifiers/contributions use `--type-navigation`,
and dates use `--type-small`. The original section entrance remains intact.

Source goal shading is translated into restrained spacing, typography, accent, and rules.
Word tables that compose screens become ordered mobile UI carousel slides, with
their stage labels, descriptions, and any shared caption preserved.
Outside approved milestones, do not introduce cards, ornamental shadows/gradients,
or added research summaries.

## Publication and checks

Only About and HEIR are content routes; 404 uses the same layout. HEIR contains
the entire source narrative, five projects, and “Where HEIR stands now.” The TOC
selects those six major sections. Standalone reports, gallery destinations, and
resume content remain outside the current migration scope.

The original archive and raw research stay outside the site. Only selected image
copies enter `src/assets/`. All 13 IDs and original destination relationships are
retained. Pending internal targets remain unpublished; the external demo URL is
unchanged. See `heir-asset-audit.md` for original-asset decisions and ambiguities.

Run `npm run check`, `npm run build`, and `npm run verify:source`. Then inspect
actual desktop/mobile pages and test interactions; a successful build does not
constitute visual approval.
