# Portfolio project handoff

## Homepage v2 — Five Stories, One Canvas (Passes 1–2)

The completed accordion is scoped to `experiment/homepage-animation-v2`.
Its production publication was authorized on October 21, 2026. Desktop Animated View
now mounts `HomepageAccordion.astro` and `homepage-accordion.ts` instead of the
old journey. The old journey, camera, deck and swarm source files remain available
for reuse; their cinematic controllers are not mounted by this homepage.

The five slots reuse the existing introduction, HEIR phone, theme-aware Lira
pendant/diffuser, three authored work cards and eleven-tool data source. There is
one copy of each story in the DOM. Standard/touch use the same authored content
and their existing controllers. Pass 2 now enables phone exploration, pendant illumination/replay and contextual
Tools in settled expanded panels, without changing the Pass 1 compositions.

One GSAP timeline owns selection, widths and preview recomposition. Native buttons
select panels; Arrow Left/Right and Home/End move selector focus. The 550ms
transition interrupts at its current values when a later selection arrives.
Inactive story content is inert; overflowing active regions become keyboard
scroll targets. The existing Menu tree and view switch are reused. Astro swaps,
media changes and Standard View release all owned styles, timelines and listeners.
No additional ScrollTrigger, pinning, wheel interception or scroll lock is added.
The shared `homepage:before-camera` coordination event releases Standard product
pins before accordion measurement; `data-journey-active` suspends the published
vertical product/Tools controllers while the accordion is active.

Desktop eligibility requires at least 1200px × 600px, a fine hover pointer and no
reduced-motion preference. The measured canvas also needs 600px for the open panel
and 104px per closed panel. Otherwise the existing readable fallback is retained.
The stage is viewport height minus 9rem, with 12px gutters. Preferred open widths
now come from panel metadata: About 42%, HEIR 58%, Lira 53%, How I Work 60%, Tools
38%, bounded by their reading minimum and four 104px neighbors. How I Work keeps
its original 60% geometry and unchanged internal styles/transforms. Short windows retain body-sized
type and internal panel scrolling. About now restores a full-bleed photographic cover
with its introduction integrated over a lower gradient; HEIR/Lira have larger products and compact heading-1
titles; Tools has a centered 360px grid. Consistent label container queries and
collapsed semantic surface tints apply only inside the active accordion; expanded
content panels use the neutral surface. Case-study copy and footer labels share
the same 24–40px start inset while preserving independent outer widths.
The About reading minimum is now 448px, and its actual panel targets 42% rather
than 48%; neighboring widths redistribute through the unchanged sizing owner.
Expanded footer labels follow their editorial column’s start edge, with the same
24px bottom inset. How I Work’s internal padding, cards and animation are unchanged.
Final Pass 1 refinement (October 21): Tools targets an actual 38% open width
with its existing 416px reading minimum and 16px/8px grid gaps.
The final Tools-only refinement caps the actual panel at 440px, aligning the
heading and footer with the unchanged centered 360px grid instead of leaving
large outer gutters on wide screens. Collapsed marks use grayscale; expanded
marks retain full color. Accordion labels/title/accessibility names read “Tools I use”;
Standard/touch keep their original title and accessible list name. Menu uses
the same aria-expanded-driven two-line morph as mobile. Every fresh activation
opens About synchronously; in-session resize and font updates preserve selection.
Initialization is idempotent for the mounted root, including Astro page-load events.
See `design-system.md` for composition rules.

### Initial rendering correction — October 22, 2026

The deferred accordion/GSAP module previously left the Standard shell visible
until it downloaded. The homepage-only head script now resolves the existing
desktop media query, hash and `history.state.portfolioJourneySkipped` before
the shell paints. A parser-time inline presentation draws About plus the four
collapsed previews immediately after the story markup. It shares measurement
and pose functions with GSAP rather than maintaining a second layout. It follows
font readiness while the bundle loads and preserves the shell flag through the
synchronous ownership handoff, avoiding a sidebar visibility transition.
The controller also initializes on `astro:after-swap`; its mounted-root guard,
existing view switching and cleanup remain intact. Standard, reduced-motion,
small-screen and no-JavaScript paths retain the authored fallback. No timeout,
loading screen, content hiding, entrance fade or design changes are introduced.

Browser verification withheld all module scripts until after first frames at
1366×768, 1280×640 and 1920×1080: About was expanded and the sidebar hidden
before the controller loaded, with zero recorded mode/sidebar flashes. The final
font-ready handoff measured less than 0.01px change in product/card/grid geometry.
Standard-history, 768×1024, 390×844 and stripped-script fallback checks retain
their expected layouts. Native hard refreshes in both modes, panel switching,
and HEIR/return Astro navigation pass. Check (78 files, no diagnostics), build
(10 routes/329 links/publication checks) and source fidelity pass.

Publication of this fix and the replacement `public/resume.pdf` was authorized
on October 22 from the same v2 branch and existing production workflow. The shared
Resume URL now includes a SHA-256 content version, so replacing the PDF invalidates
cached navigation requests while preserving native viewing in a new tab. The
built PDF is byte-identical to the supplied replacement; every navigation uses
`/portfolio/resume.pdf?v=96e39dbd51c5`. No design or deployment configuration changes
are part of this release; `main` and the previous experiment remain unchanged.

October 21 verification: at 1366×768 and 1920×1080 in both themes, Tools
opens at 470px and 669px (38% after gutters), with a centered three-column
360px grid. HEIR/Lira start edges match at the shared responsive padding
(34px/41px including border), with zero footer-label offset. Expanded surfaces
resolve to white / #222A2D. Exactly one panel stays selected without horizontal
overflow. Initial arrival, refresh, Standard → Animated and HEIR → home Astro
return open About; Menu open/Escape produce the expected ±45° / translated
line matrices. Check, build (10 routes/329 links), and source fidelity pass.

Composition refinement verification: preferred widths redistribute correctly at
2560×1440, 1920×1080, 1366×768, 1280×640 and 1200×800. Laptop/short panels retain
keyboard-accessible internal scrolling; 1199px and mobile retain vertical flow.
All five selections and rapid interruption retain one open panel with no horizontal
document overflow. Reviewed expanded About, HEIR, Lira, Tools and the unchanged
work cards; Lira's complete shadow/diffuser survives in both themes. Standard View
cleanup/return and Menu/theme switching pass. Only the accordion component,
controller, scoped CSS and these two layout documents changed in this refinement.

Browser review covered all five selections, interrupted switching, light/dark
Lira imagery, the eleven-logo grid, native keyboard selectors/view switching,
Menu/Escape and HEIR route/back navigation. A browser-rendered viewport matrix
covered 2560×1440, 1920×1080, 1366×768, 1280×640 and 1200×800; active panels
scroll internally as needed, with no horizontal document overflow. 1199×800,
1366×590, 768×1024 and 390×844 retain vertical flow. Disabling JavaScript and
reloading retains all five readable sections and native navigation. Reduced-motion
eligibility is enforced by the shared media query; no OS preference was changed.
Validation passes: `npm run check` (74 files, zero diagnostics), `npm run build`
(10 routes, 329 internal links plus gallery/publication checks) and
`npm run verify:source`. No dependencies installed, commits created or pushes made.

### Pass 2 product interactions — October 21, 2026

`homepage-accordion-interactions.ts` owns one selected interaction. The existing
550ms accordion timeline prepares selection immediately (disposing the previous
interaction) and mounts the new interaction on completion. Synchronous resize
painting preserves a mounted selection. Mode disable, Astro swaps and hot cleanup
release the same owner. Width metadata, visual transforms, type and artwork remain
unchanged; no new dependency, pin, scroll lock or wheel interception is added.

- HEIR: the existing aperture becomes a labeled, focusable native scroll region.
  Wheel/trackpad, native keyboard scrolling and primary-pointer dragging explore
  the long source screenshot; the frame and rounded mask remain stationary.
  Pointer capture ends on release/cancel/collapse/window blur. A fractional manual
  position survives reopening/resizing; collapsed artwork resets to its preview.
  There is no autoplay, viewer or extra link.
- Lira: the existing `createPendantInteraction`/`pendantLightAt` curve drives its
  exact open channel and separate top indicator. Initial playback starts after
  expansion; 1.6s replay replaces the previous tween, starts unlit and holds full
  illumination. The existing transparent replay button is enabled only while
  expanded, with native keyboard activation and busy state. Diffuser, shadows,
  stronger dark-theme bloom and both byte-matched source WebP assets are unchanged.
- Tools I use: exports/reuses `initializeToolPopovers` with optional accordion-only
  sticky selection/focus behavior. All eleven descriptions/icons stay in their
  existing data/component. Native auto-popover escapes panel clipping, clamps
  to the visual viewport, tracks internal scrolling and supplies outside dismissal.
  Hover/focus previews, click pin/update, Escape and focus return retain the grid.
  Closing or collapsing aborts listeners/timers, resets relationships, hides details
  and disables inactive buttons. Default Standard/touch behavior is unchanged.

Browser matrix: 1366×768, 1280×640 and 1920×1080. All 33 tool selections expose
exactly one approved description with valid aria-describedby, inside viewport
bounds. Phone travel reaches both ends with no autoplay, stationary frame and
unchanged rounded mask. Pendant stays resting before settling, illuminates
progressively, replaces repeated replays and ends at ring/indicator=1. Rapid
selection interrupts leave no native/drag markers, popovers or active replay;
light styles clear and exactly one panel remains expanded. Native wheel, End
and pointer drag were additionally verified in the desktop browser.
Native keyboard testing also verified Tab between tool descriptions after a pinned
selection, Escape dismissal without reopening, and keyboard pendant replay.
Light/dark pendant treatments, Menu, Standard/Animated switching, and Astro
HEIR route/return navigation pass; returning opens About Me without stale details.
Physical trackpad hardware and Safari were not tested; trackpads use the same
unintercepted native scrolling path. Reduced-motion eligibility remains unchanged.

Check (75 files, zero errors/warnings/hints), build (10 routes/329 links and private
publication boundaries) and source-fidelity validation pass. Product components,
assets, tool copy, How I Work and the published deployment files are untouched.

## Current production publication — October 21, 2026

The user authorized committing and publishing the completed v2 accordion and its
product interactions from `experiment/homepage-animation-v2`, without merging
into `main`. The existing Pages workflow now triggers and builds only that exact
branch; Astro output, Node 24, Pages Actions, concurrency and the `/portfolio/`
base are unchanged. The `github-pages` environment's exact branch restriction
now selects only v2, preventing older workflows on other branches from deploying
over this version. Pages stays in GitHub Actions mode.

The first experiment remains at `cebbc2664e048296d46b3c6b9b0cb5982b935c32`;
`main` remains at `735b3938d8a0e0a573e9f5989f79a8ac0f43ea15`. The pending
initial-render flash fix is explicitly deferred; publication introduces no design
or animation changes. Verify the deployment run and live output before reporting
success. Earlier no-commit/no-push statements document prior refinement passes.
Publication checks pass: 75 Astro files with zero diagnostics, 10 routes and
329 internal links, private publication boundaries, HEIR source fidelity and all
five native research reports. Only completed website source, documentation and
the existing deployment workflow are included; private sources/build output stay
excluded.

## Previous publication configuration — October 19, 2026

The user authorized committing and publishing the completed experiment without
merging into `main`. `.github/workflows/deploy.yml` on
`experiment/homepage-scroll-animation` now deploys pushes to that branch; its
build job also guards manual dispatch against other refs. The existing Astro
build/upload and GitHub Pages deploy actions, concurrency group, Node 24 and
`/portfolio/` base are preserved. Pages remains in GitHub Actions mode.

The existing `github-pages` environment now permits only the exact branch
`experiment/homepage-scroll-animation` (branch rule, no wildcard). This also
prevents the unchanged workflow on `main` from publishing over the experiment;
main's historical push trigger may still run CI, but cannot pass the environment
restriction. `main` stays at `735b3938d8a0e0a573e9f5989f79a8ac0f43ea15`.
No branches are created, merged or deleted. Future animation variations should
start from a separate branch after this completed version is published.

Publication validation: 72 Astro files with zero diagnostics, 10 built routes,
329 links/fragments, gallery/original-asset/publication-boundary checks, HEIR
source fidelity and all five research reports pass. The five added image assets
are approved homepage artwork; source archives, datasets, local backups, caches,
credentials and build output are excluded. Deployment success must be confirmed
from the workflow run and the public site; configuration alone is not deployment.
Live URL: `https://uxrahul.github.io/portfolio/`.

Earlier “no commit/push” statements below describe the completed refinement
passes before this publication authorization.

## Current refinement — pinned Standard View and viewport-aware geometry

Latest Standard View layout refinement: `homepage-products.css` now caps both
compositions at the existing 31rem text measure + gap + product width and centers
them inside the full-width section. The viewport cap accounts for the pendant's
square-canvas overhang and 16px edge clearance. Removed the section overflow clip
that truncated the shadow. Both original images have transparent right edges;
the asset was not the cause. No image, component, animation/controller, type,
Animated View or mobile rule changed in this refinement.

Reviewed both projects at 1366 × 768 and 1920 × 1080, with Lira in light/dark.
Also checked 1200 × 800 and 2560 × 1440: matching composition widths are about
716px and 842px respectively, centered with no horizontal document overflow.
The complete source canvas fits; product aspect ratios and illumination remain
intact. Forward/reverse pin samples hold the expected section position.
`npm run check` (72 files, zero diagnostics), build (10 routes/329 links) and
`npm run verify:source` pass. This supersedes the earlier width measurements and
overflow-clipping decision in the historical validation below. No commit/push.

Standard View now pins each complete HEIR/Lira section at its measured centered
resting position, scrubs the product directly, then releases through native pin
spacing. Reverse scrolling re-pins/reverses. HEIR uses .8–1.25 viewport heights,
bounded by screenshot travel; Lira uses .85. There are no wheel handlers or scroll
locks. If actual section height exceeds `innerHeight - 96`, natural unpinned
scrubbing preserves readability. Resize/observed composition changes/image load
refresh measurements and rebuild pins only when the fit decision changes.

Both projects share copy-left/product-right geometry, typography, full-width
separators, section labels and status treatment. `--standard-visual-height` adapts
to viewport height with a 32rem ceiling; the .55-width product envelope preserves
phone aspect and the pendant's real body bounds rather than its transparent
canvas. The source assets, diffuser, layered glow, exact copy and destinations
are untouched. Scene overflow is visible; the centered composition reserves the
full pendant canvas within the viewport, including its soft shadow.

Standard View Tools now uses the same eleven-source native popover as touch.
Hover previews, click selects/toggles, keyboard focus/activation, outside/Escape
dismissal and edge-aware placement share one controller. A 180ms hover bridge
permits entering the panel without flicker. The approved wrapped list stays intact;
only the cinematic view has the existing magnetic swarm.

Animated View visually hides the document scrollbar under its existing active
HTML flag. Scroll mechanics remain native. A measured gutter prevents a classic
scrollbar from changing the underlying body width. Cleanup removes the flag and
gutter; Standard View, touch and other routes restore ordinary scrollbar behavior.
Camera phases, timings, scene registry, deck and swarm are unchanged.

The responsive audit retains readable type and natural long-form flow. Desktop
portrait, UI-figure/gallery visual ceilings now account for dynamic viewport
height. The existing viewer can wrap its toolbar and scroll long captions within
25dvh; Fit/100% remains intact. Navigation/TOCs already have bounded overflow.
Cinematic minimum height, content-fit fallback and refresh behavior are retained.
Short touch/landscape layouts never mount desktop pins/camera or inherit desktop
visual ceilings. Touch product autoplay/native scrolling/replay is unchanged.
See `design-system.md` for reusable geometry and fallback constraints.

This section supersedes the former unpinned Standard behavior below.

Mode coordination now dispatches `homepage:before-camera` before synchronous
camera fit measurement, releasing Standard pins and their inline dimensions
first. The existing active-flag observer then mounts the correct product mode.
A resize rechecks the cinematic content-fit guard even when its media query stays
matched, allowing oversized-content fallback and recovery without a reload.

Verification (Brave/Chromium local production build):

- Standard composition at 1329 × 868: both sections 999 × 589px, identical
  663.94/281.59px columns, 53.16px gaps and 39.87px headings. Lira's divider spans
  the same section width. At 1200 × 800 both sections are 880 × 589px, with the
  same 48px gap. Pendant transparency no longer creates horizontal overflow.
- Pin samples at 0/.25/.5/1 and reverse hold section top near 140px at 868px
  viewport height. The phone reaches its measured endpoint; Lira's ring/indicator
  reach 1, reverse through .676/0 at halfway, and return to 0. Arrival/departure
  advance normally outside the range; pin rounding stays below one pixel.
- Native wheel forward/reverse at 1280 × 600 holds the section at about 57px
  top/542px bottom while phone progress changes. Rapid input completes HEIR and
  enters Lira normally. A 400ms stop leaves light values unchanged. Both scenes
  are 485px high there, with 480px/510px interaction ranges.
- Reviewed 1440 × 1000, 1366 × 768, 1200 × 800 and 1280 × 600. At 1280 × 400 both
  sections stay in natural unpinned flow (333px section height, 18px body text).
  Growing the viewport restores pins. No document horizontal overflow remains.
- Six consecutive mode toggles alternate exactly two Standard pins/normal
  scrollbar with one camera pin/hidden scrollbar. All five cinematic scene IDs
  match their requested stations with one master trigger. Native vertical wheel
  input continues advancing camera progress. At 1200 × 800 the camera remains
  available. An oversized-heading fit test falls back to Standard and recovers
  to the camera after removing the temporary style, without a reload.
- All eleven Tools hover events expose exactly one description within 16px
  viewport clearance. Native click selects, keyboard Tab/Enter opens/selects,
  Escape dismisses, and the pointer-to-panel dismissal bridge stays open.
  The shared data and wrapped list are unchanged; listeners remain single.
- Navigation from pinned Standard View to HEIR leaves zero triggers/spacers and
  normal scrollbars; return restores the correct viewport-dependent products.
  Light/dark assets, .22/.42 glow strengths and existing copy remain intact.
- Coarse-pointer 844 × 390 landscape has zero triggers/pins, a naturally tall
  627px phone, native screen scrolling and pendant replay. Autoplay reaches the
  611px native boundary with an identity screenshot transform. Reduced-motion
  touch retains manual scrolling and lit material; reduced desktop has zero
  pins while contextual Tools stays enabled. Touch animation functions unchanged.
- Script-blocked served HTML retains both visible products, Lira eyebrow/status,
  matching desktop columns, hidden replay and no horizontal overflow.
- At 1280 × 400 the shared Fit viewer keeps a 211px image viewport and visible
  controls inside its 24–376px dialog bounds. 100% retains native overflow;
  native Escape closes and returns focus to the original figure. Gallery phone
  visuals adapt to 155 × 320px while the page remains naturally scrollable.
- `npm run check`: 72 files, zero errors/warnings/hints. Build: 10 routes/329
  links, asset/gallery integrity and publication boundaries pass. Source fidelity
  and all five research reports pass. No copy, component markup, source assets,
  scene timing/registry, deck or swarm changes; no new dependencies.

Physical trackpad/touch momentum, Safari and classic OS scrollbars were not
hardware-tested. Local preview: `http://127.0.0.1:4333/portfolio/`.
No staging, commit or push; HEAD/main remain `735b393`.


## Previous refinement — interactive touch previews and unpinned Standard scrubbing

`homepage-products.ts` now owns product mode selection and teardown. The existing
responsive controller retains only Tools/popovers; that interaction function and
its styles are unchanged. The desktop camera, scene registry, view toggle, About
layout, deck, swarm, navigation, typography tokens, copy and assets are unchanged.
`pendantLightAt()` extracts the existing three-value light curve for reuse;
1,201 samples match the previous camera math exactly.

| Mode | HEIR | Lira |
| --- | --- | --- |
| Desktop Animated | Existing master-camera scroll scrub, unchanged | Existing reversible camera illumination, unchanged |
| Desktop Standard | Independent unpinned vertical ScrollTrigger | Independent unpinned vertical ScrollTrigger using the same light curve |
| Tablet/mobile | One-time 1.8s native scrollTop autoplay, then manual screen exploration | One-time 1.4s illumination, then pendant tap/Enter/Space replay |

Touch products retain the existing observer activation point (product top enters
the top 65% of the viewport, threshold 0). HEIR is a native clipped scroll region
with a named keyboard focus target. Autoplay animates its actual scroll offset;
pointer-down, wheel or scrolling keys cancel the remaining tween. No default
input is prevented, and scroll chaining remains enabled at both boundaries.
Autoplay never restarts on page re-entry. The current manual fraction survives
orientation and mode changes; rotation during autoplay hands control to the user.

Lira uses the existing diffuser and theme images. Its invisible native button
over the pendant body supplies a replay label, visible keyboard focus and busy
state without adding visible copy. Replay resets to unlit material and runs the
same ring-then-indicator sequence. Activations while running are ignored; there
is never a queue or overlapping light timeline. Neither product visual is nested
inside a navigation link. Existing HEIR title navigation and Lira's current
informational copy/destination status remain unchanged.

Standard View keeps its existing text layout; the previously hidden pendant is
exposed underneath Lira's existing copy. Each product scrubs between `top 80%`
and `top 15%` without pinning, added section height or horizontal camera movement.
Both effects pause and reverse with vertical scrolling. Figure-owned
`--preview-*` properties isolate these effects from the cinematic image transform
and SVG variables. Mode cleanup removes both Standard triggers, kills touch
tweens/observers, clears preview properties, hides replay and resets native screen
offset/attributes. The camera controller itself is not modified.

Reduced motion has no automatic or scrubbed motion. Manual native phone scrolling
remains available on touch layouts, and pendant replay gives immediate lit state.
Script-free HTML retains readable static products. No dependencies added.

This section supersedes the earlier automatic-only product behavior below.

Validation for this refinement:

- Touch-layout HEIR autoplay reaches the native scroll boundary, with an identity
  screenshot transform. Native wheel scrolling explores both directions; Home and
  End work in the named region. The document stays still during internal movement,
  then scrolls normally when continuing past the bottom boundary. No navigation.
- A pointer-down interruption at 350ms holds the current offset (13.5px in the
  check) after the original autoplay would have finished and after page re-entry.
  Landscape 844 × 390 supports a phone taller than the viewport and reaches its
  611px scroll boundary. A manual .37 position survives rotation to 768 × 1024.
- Lira initial autoplay, native touch activation, Enter replay and both
  themes pass. Thirty extra activations during replay leave the in-flight light
  value unchanged; the sequence completes with ring/indicator at 1 and busy state
  cleared. Native replay produces no route change. Tools popovers still open and
  retain one listener after mode/preference changes.
- Standard View samples 0 → .25 → .5 → .9 → 1 → .5 → 0 follow and reverse scroll
  progress; the phone frame's document position stays constant. The light follows
  the same curve in each direction and remains unchanged during a 400ms stop.
  There are exactly two unpinned triggers and zero pin spacers. Resize from
  1329 × 868 to 1200 × 800 refreshes the progress range from 564px to 520px.
- Eight consecutive mode switches alternate exactly one `homepage-camera` pin
  with two unpinned Standard triggers. No native/replay controls remain on desktop;
  the toggle keeps one listener. HEIR navigation removes all triggers; Back
  restores exactly the two Standard triggers.
- Animated View traverses all five existing scenes with one camera trigger. Its
  phone and light reverse correctly; the magnetic swarm remains active at Tools.
  Camera/controller, scene geometry, card deck, swarm and cinematic styles match
  their pre-pass source hashes. Only the pure pendant-curve helper is shared.
- Reduced-motion touch keeps manual native phone scrolling, gives immediate lit
  pendant feedback and has no running light tween/ScrollTriggers. Reduced-motion
  desktop has zero triggers/pins and no native/replay attributes. A served-HTML
  frame with all scripts blocked retains the clipped initial phone, lit pendant,
  hidden replay control and no horizontal document overflow.
- `npm run check`: 72 files, zero errors/warnings/hints. Production build: 10
  routes/329 links, gallery/asset integrity and publication checks pass. HEIR
  source fidelity passes. No new dependencies, copy, assets or typography tokens.

Review used Brave/Chromium emulation plus native wheel and keyboard input. Physical
touch swipes/momentum on iOS/Android hardware and Safari remain unverified.
Local production preview: `http://127.0.0.1:4333/portfolio/`. No commit or push;
Main and HEAD remain `735b393`.

## Current refinement — tablet and mobile homepage

Only `Homepage.astro`, `HomepageTools.astro`, the new `homepage-responsive.css` /
`homepage-responsive.ts` and these documentation sections change in this pass.
All desktop camera/choreography, deck, swarm, pendant controllers and styles,
shared navigation, type tokens, authored content and assets remain unchanged.

- Tablet keeps the approved side-by-side profile. Below 600px the existing
  photograph appears above the copy; education stays in the same text column.
- Responsive HEIR and Lira share presentation rules and title emphasis. Lira's
  eyebrow, work-in-progress line and approved theme-specific pendant are now
  present in vertical flow, with the same diffuser and premium layered light.
- One reusable viewport trigger observes intersection at threshold 0 in the top
  65% of the viewport (35%-of-height bottom inset, expressed in pixels). HEIR's
  screenshot auto-plays for 1.8s inside the stationary clipped frame. Lira's ring
  and indicator complete in 1.4s. They do not scrub, reverse or replay on re-entry.
  A per-page WeakSet retains started state across media changes; resize maintains
  the completed screenshot alignment. No pins, touch handlers or scroll locks.
- A separate responsive controller owns only figure-level `--responsive-*`
  properties. It cleans up observers/tweens/listeners on media changes and Astro
  swaps. The desktop retains its exact existing GSAP/ScrollTrigger controller.
- Tools reuse the eleven descriptions from `homepageTools` in one anchored
  native auto-popover. Existing wrapped logos/labels remain in place, with native
  keyboard-accessible buttons and 44px touch targets. Only one panel opens;
  outside tapping and Escape dismiss, selection updates ARIA state, and viewport
  placement clamps the panel with 16px edge clearance. No dependencies added.
- Reduced motion and no-JavaScript HTML retain meaningful static products: initial
  phone dashboard and fully illuminated pendant. Tools degrade to the readable
  logo/label list if scripting or native Popover API support is unavailable.

Validation for this pass:

- Reviewed 390 × 844 portrait, 844 × 390 landscape, 768 × 1024 tablet and
  1024 × 768 tablet layouts; also tested the 320 × 568 narrow phone. No horizontal
  document overflow. Tablet retains two profile columns; phone puts the portrait
  first. Both case-study headings compute to the same statement scale.
- HEIR is ready before the threshold, running just afterward, and complete with
  scrolling stopped after 1.8s. The frame stays stationary; the final screenshot
  bottom matches the aperture exactly. A phone taller than the 390px landscape
  viewport activates successfully, and document scrolling continues during play.
- Lira's ring progresses before the upper indicator, completes and holds. Light
  mode uses the standard image/.22 bloom; dark mode uses the dark image/.42 bloom.
  Reverse scrolling preserves both completed products. A responsive → desktop →
  responsive round trip restores completed products and exact phone alignment.
- All eleven exact tool descriptions fit viewport bounds without panel clipping
  at 390px portrait, 844px landscape, 1024px tablet and 320px phone widths. Native
  touch selection changes Figma → R; keyboard Tab, Enter, Space and Escape work.
  Outside tapping clears expanded state and body overflow remains unlocked.
- Reduced-motion emulation removes product tweens/inline states while keeping the
  initial phone dashboard, fully lit pendant and selectable tools. A separate
  served-HTML frame with script execution blocked confirms those static products,
  readable content and no horizontal overflow without controller initialization.
- Tablet Menu → HEIR → Back leaves no popover on HEIR and restores eleven enabled
  tool buttons, one click listener and closed navigation on the homepage.
- Desktop 1329 × 868 traverses all five existing scenes with exactly one pin,
  no responsive product states, and the magnetic swarm running at Select Tools.
  Media cleanup closes open popovers and removes responsive custom properties.
- `npm run check` passes for 71 files with zero errors/warnings/hints. Production
  build passes for 10 routes/329 internal links, gallery/asset integrity and
  publication boundaries. HEIR source fidelity passes. Desktop source/controller,
  scene geometry, tokens, assets and content hashes match the pre-pass baseline.

Browser verification uses Brave/Chromium emulation. Physical iOS/Android hardware
and Safari have not been tested. Local preview: `http://127.0.0.1:4333/portfolio/`.
No commit or push; Main and HEAD remain `735b393`.

## Current refinement — view switching, Tools alignment and typography

The experiment remains uncommitted on `experiment/homepage-scroll-animation`.
This section supersedes older references to the one-way Skip control below.

- The same upper-right native button now offers **Standard View** in the camera
  experience and **Animated View** in standard flow. Both directions reuse
  `initializeJourney()` and its full teardown: abort instance listeners, revert
  the GSAP context/pin, reset scene controllers, dispose the Tools loop and close
  navigation. Explicit return clears saved progress/static anchors and starts at
  the opening with scroll zero. Focus remains on the toggle. History retains the
  standard choice for navigation away/back. Existing desktop media and fit guards,
  reduced motion and no-JavaScript fallback remain in force.
- Tools information uses `align-self: start`; its invitation's former 40px top
  margin is removed. The divider, gutter, fixed panel height and transition stay
  unchanged. No changes to tool data, bubble physics or dimensions.
- The site-wide typography audit is recorded in `design-system.md`. Seventeen
  existing 1.5 line-height declarations share `--line-height-supporting`; two 1.2
  declarations reuse `--line-height-heading`. One duplicate homepage h3 size rule
  is removed. All existing font sizes, weights, tracking, font files and distinct
  semantic scales remain unchanged. No content or asset changes.

Validation for this refinement:

- Eight complete switch pairs (16 changes) leave zero pins/transforms in standard
  flow, and exactly one pin at scroll zero/opening on return. One click listener
  remains on the toggle. Native mouse, Enter and Space activation retain focus.
- Tools field, panel and invitation tops match within 0.01px at 1329 × 868.
  All eleven tool selections preserve the panel rectangle and fit its height.
- Reduced-motion emulation yields standard content, zero pins and a hidden
  control. Desktop boundaries 1200 × 799 and 1199 × 800 do the same; 1200 × 800
  restores one camera pin when animation is the chosen mode.
- Shared Menu → HEIR → browser Back restores animated mode with one pin, closed
  menu and one toggle listener. Standard → HEIR → Back retains standard mode.
- Browser review includes homepage modes, HEIR, customer-survey research and
  Health Scan gallery typography; reading/gallery routes have no camera pins or
  horizontal document overflow. The existing italic subtitle and gallery leading
  render correctly.
- `npm run check` passes for 70 files (zero errors/warnings/hints); production
  build passes for 10 routes and 329 links/fragments, including asset/gallery and
  publication checks. HEIR source fidelity and all five research verifications
  pass. Safari and physical trackpad hardware were not tested in this pass.

Local production preview: `http://127.0.0.1:4333/portfolio/`. No commit or push;
Main and HEAD remain `735b393`.

## Current opening — single text and portrait row

`HomepageIntroduction.astro` renders one semantic profile in the existing
Introduction slot. The name, Chicago designation, full disciplines, personal
description and education retain the approved homepage wording. The professional
experience heading/list and all four roles, connector, nodes and associated CSS
are removed at the user's request. The horizontal divider and separate background
grid are also removed.

The left column contains Rahul Singh (sole h1) → Chicago-based Sr. Product Designer
→ Product Research · Product Design · Product Analytics → personal description
→ Education. Education is exactly M.S. Human–Computer Interaction · DePaul
University, using the existing label/body styles directly beneath the description.
There is no education card or second education column. The right column contains
only the approved portrait, enlarged and vertically centered in a 1.5:1 grid with
the existing 4rem gutter. The portrait file, 4:5 crop and object position are
unchanged. No new typography tokens, fonts, colors, assets or dependencies.

All content belongs to the same grid row; nothing extends as a separate section
below the photograph. Existing tablet/phone stacking and static/reduced-motion
fallback remain in place. No camera math, timeline, navigation, lifecycle or
other scene files are changed in this refinement. The live DOM still transforms
uniformly into the existing MacBook screen at the approved endpoint.

Validation for this layout refinement:

- Desktop opening reviewed at 1700 × 868, 1329 × 868 and 1200 × 800. Copy and
  education stay inside the portrait's vertical region; no live-plane overflow.
- Six forward/reverse opening stops at 1329 × 868 keep both columns inside the
  laptop opening, with center mismatch at most 0.04px. The established resting
  MacBook shot at 1200 × 800 is also contained (center mismatch below 0.1px).
- Skip restores normal flow, zero pins and scroll zero, focuses the unchanged
  `homepage-headline`, and preserves education immediately below the description.
  The built HTML retains all five approved source paragraphs and contains no
  professional-experience markup. Its obsolete CSS selectors are removed.
- Check passes for 70 files with zero errors/warnings/hints. Production build
  passes with 10 routes and 329 internal links/fragments, gallery/image integrity
  and publication boundaries. HEIR source fidelity passes.
- Only the introductory component/styles and these two documentation sections
  change this pass. All other scene components, assets, controllers, navigation,
  camera configuration and typography tokens remain byte-unchanged. No commit
  or push; Main and HEAD remain `735b393`.

Local preview: `http://127.0.0.1:4333/portfolio/`. Review uses Brave/Chromium;
Safari and physical trackpad review remain unverified.

## Homepage scroll experiment — reusable camera choreography

All experiment work remains uncommitted on `experiment/homepage-scroll-animation`,
based on approved `main` commit `735b393`. The read-only master reference remains
`portfolio-animation-handoff/references/artboards/Desktop Scroll Experience Storyboard.png`
in the sibling source archive. It supersedes the original greeting intro and
separate vertical project pins; those are not layered below this implementation.

`HomepageJourney.astro`, `homepage-journey.ts`, and `homepage-journey.css` own the
homepage-only, single pinned GSAP/ScrollTrigger camera. The new
`src/lib/homepage-scenes.ts` registry supplies scene order, native timeline nodes,
travel/focus poses, phase scroll budgets, and optional content interactions.
The actual authored slots are Introduction → HEIR → Lira → How I Work. Expertise
appears once in the fourth scene as three readable columns; Tools and About stay
in native vertical flow after the final camera pullback/hold. There is no card
stack/fan/tarot interaction or invented Lira asset, destination, or copy.

Each scene supports approach, focus, interaction, pullback, and departure.
Departure plus the next approach share one eased movement, without a velocity
break at their semantic boundary. A single normalized GSAP clock evaluates the
measured plan. Refresh recomputes CSS positions, phone travel, phase distances,
and station labels; every lens, aperture, track, progress, and screenshot state
is a function of that clock and reverses with upward scrolling. No second pin or
independently advancing interaction timeline exists. Native station buttons target
the traveling arrival, before focus; Introduction targets its established laptop
shot with the thread already visible.

Travel starts at scale 1.00; HEIR focuses at 1.05 and Lira / How I Work at 1.04.
Offsets start at x=0, y=0 (viewport fractions). Focus/pullback each use 0.12 viewport
heights; each horizontal handoff uses 0.30H departure + 0.50H incoming approach.
HEIR exploration uses max(1.40H, measured screenshot travel × 1.60), Lira lighting
uses 1.20H, and How I Work uses 1.10H. The final traveling hold uses 0.15H. Pose
changes/handoffs use power2.inOut without overshoot; screenshot exploration is
linear. The master retains 0.45-second scrub smoothing. Detailed configuration
rules and the parameter table live in `docs/design-system.md`.

The opening starts with the same single live homepage filling the viewport.
Its DOM plane and supplied MacBook frame retain their measured common screen
center and uniform scale. The laptop now stops at min(70vw, shared content-stage
height × 3880/2400). It can use the full stage because it has no external heading
or caption; the phone retains its existing heading/caption allowances and size.
The initial pullback budget is 0.66H, 45% shorter than the former approximate
1.20H budget, followed by 0.12H to establish the shot and reveal the timeline.
There is no further shrinking while the thread reveals or the camera departs.
The requested 70% width takes priority as the concrete visual target, subject to
stage height. Physical pullback reduction varies by viewport and is not a fixed
45%; the 45% configuration value explicitly controls opening scroll distance.

Focus transforms the complete text/device scene around the shared content-stage
center. An animated aperture follows the scaled/translated stage bounds with
half the shared stage gap around them, keeping headings/captions safe at taller
desktop heights. The spatial timeline passes outside that camera frame rather
than fading independently; its opacity stays 1 throughout project exploration.
Pullback reverses this framing and restores the thread before horizontal travel.
Menu and Skip stay stationary outside the aperture. Keyboard focus on a clipped
station reveals its traveling shot without destroying the pin. Phone travel is
measured from untransformed layout heights, so lens scale does not change the
screenshot endpoint. Native homepage entrances/emphasis exclude camera scenes.
Cold initialization waits for locally hosted fonts before testing scene fit.

The existing geometry still reserves a shared content stage, five-rem timeline
band below it, and six-rem navigation layer. One indexed CSS pitch derives from
viewport width and the wider exhibit envelope. The same rule governs all adjacent
scenes; both exhibits can be partially visible during a handoff. One continuous
thread fills according to actual horizontal displacement. Future nodes are hollow,
reached nodes filled, current station accented; reverse movement reverses state.
There is no second progress bar or dock destination list.

The compact glass-style Menu toggles the existing real navigation in its rounded
left drawer. Theme selection, expandable groups, Tab containment, Escape/focus
return, explicit dismissal, and actual navigation remain intact. Background clicks
do not close it or exit the camera. The earlier click-to-exit root cause remains
fixed: blank pointer clicks can focus `main#reading-canvas[tabindex=-1]`; that focus
must never call `media.revert()` or set the skip flag. Only explicit Skip controls
or deliberate hash navigation restore static mode. Ordinary clicks preserve scroll,
camera transform, the single pin, and history state.

Skip reverts the context, clears camera/framing transforms and attributes, restores
normal navigation and content, focuses the hero headline, and returns to scroll
zero. The choice persists for that history entry. Astro page-load/before-swap/HMR
cleanup and normalized history restoration remain in place. Font/image completion
refreshes the same pin. All original devices/screens and the portrait remain
unchanged; the real HEIR case-study link and reading-page image viewers are preserved.
The homepage-only full-screen screenshot link/caption has been removed.
`PhoneShowcase.astro` retains its clipped rounded screen under the untouched frame
and Dynamic Island. No case-study, research, or gallery page was edited.

Enhancement still requires width ≥1200px, height ≥800px, fine pointer/hover, no
reduced-motion preference, and content that fits. Static, reduced-motion, skipped,
hash, and no-JavaScript visits retain the conventional vertical document with one
copy of Expertise and the original static rows. No tablet/mobile animation variant
was modified or tested in this desktop-only pass.

Prior camera-system verification in Brave (before the Lira completion pass):

- At 1329 × 868 the traveling laptop is 930.30 × 575.44px (70% viewport width),
  inside the 607.91px content stage. The phone retains its approved size. At the
  full 1700px desktop width the stage-height cap takes priority. The line remains
  beneath the device composition, and opening/node reversal does not shrink the
  laptop farther. Introduction navigation keeps the thread visible.
- HEIR focus is exactly 1.05. The combined text/phone composition stays balanced,
  the thread clips outside the camera while its opacity remains 1, and the Menu /
  Skip controls remain visible. Screenshot completion has less than 0.001px bottom
  error and zero phone movement during exploration. Reverse scrolling restores the
  same intermediate screenshot transform; pullback returns scale 1 and the thread.
- Lira and How I Work are horizontal destinations with synchronized 67% and 100%
  progress (HEIR is 33%). How I Work contains all three original descriptions once,
  in readable columns. Native scrolling continues to Tools/About only after this
  final exploration and pullback. Keyboard Tab/Shift-Tab navigates scenes in both
  directions and brings off-camera nodes into view. A taller 1476 × 964 desktop
  also retains one pin, correct 1.05 focus, a fully visible caption inside the
  measured aperture, and zero document overflow. Browser zoom was restored to 100%.
- Blank clicks retain one pin and do not set the skip flag. Menu background clicks
  leave the drawer open, Escape returns focus, and light/dark themes work. Visiting
  the real case-study route leaves zero pins/camera attributes; Back restores the
  focused HEIR scene at the matching normalized progress. Reduced motion clears
  the pin, lens, and aperture, and restores the original expertise rows. Keyboard
  Skip returns focus to the headline at scroll zero with no leftover pin/framing.
- Check/build and source/research fidelity validation pass. The build verifies all
  10 routes, 330 links/fragments, galleries, image integrity, and publication
  boundaries. A direct phase-plan check verifies contiguous finite intervals,
  ordered station labels, final destination, and content-dependent phone budgets.
  Homepage wording differs from the pre-pass copy only by moving the same expertise
  section into its new slot. `main`/HEAD remain at `735b393`.

Local production preview: `http://127.0.0.1:4332/portfolio/`.
The browser is left on a fresh unskipped homepage with its original System theme
preference restored. Safari and physical trackpad review remain unverified. The
How I Work card interaction is deliberately deferred. No commits or pushes made.

### Lira completion — product and lighting

The supplied `Lira pendant/lira-pendant-studio.webp` and dark-optimized
`lira-pendant-studio-dark.webp` are copied unchanged to
`src/assets/homepage/lira/`; source PNGs/WebPs/archive remain untouched. CSS
selects the standard or dark variant from the resolved site theme, including
System preference. The standard WebP SHA-256 is
`f4757618edb5e6e44eed12b36ac53f43d56cc86a4265e8f13f1af459f3267c9c`.
`LiraPendant.astro` renders it with its natural square aspect ratio, transparent
background, materials, and original shadow. No upward entrance is implemented.
A shared project presentation now gives HEIR and Lira identical eyebrow,
identifier, heading, description, spacing, and vertical-stage rules. Per-asset
right-column widths preserve the existing exhibit envelope and station pitch;
Lira keeps its prior artwork-size constraint (exhibit minus 25rem and the shared
gap), capped at the existing device-height limit. Its visual grid track now
measures the physical body at source x285–969 of 1254; the full square artwork
offsets its transparent inset, without cropping or changing its scale/shadow.
This restores the common 31rem copy measure and optical gap to the visible device.
Both projects retain their exact headings/descriptions. Lira gets one
SELECTED IMPACT label and the requested noninteractive coming-soon status.
The old smaller Lira heading override is superseded by the common project style.

The SVG overlay follows the actual open C-shaped channel, not a full circle. In
the 1254px source canvas it runs from (459,638) around the lower arc of radius
216px to (794,638). The separate upper indicator matches the capsule near
(626.5,524.5); it is not an invented top dot. A source-alpha check confirms all
363 sampled points across the emitter's central 24px lie inside the actual
channel. The SVG and image share identical bounds, so camera scale and desktop
resize preserve registration. Normalized stroke dashes reveal soft emission,
a narrow bright core, and restrained bloom; the upper capsule has matching fill.
Existing semantic colors adapt this lighting to light/dark themes. A permanent
shaded frosted SVG diffuser now sits beneath the original image, filling the
ring channel and upper indicator even when illumination is zero. Animated graded
emission, narrow highlights, and close/ambient bloom sit above the image, with
subtler bloom in light mode and stronger bloom in dark mode. The original product
images are never filtered, recolored, or redrawn.

`homepage-scenes.ts` now assigns Lira the `pendant` interaction for 1.20 viewport
heights. Its existing focus scale 1.04 and brief 0.12H focus/pullback stay intact.
The master GSAP clock calls the small `lira-pendant.ts` controller: the ring
finishes at 74% of interaction progress, the upper indicator illuminates during
78–88%, and the final 12% holds the completed light before pullback. Lighting
stays on while departing; upward scrolling reverses every state. No new pins,
independent timers, dependencies, or camera architecture changes were added.
Teardown clears the lighting variables. The new Lira presentation is scoped to
the existing desktop enhancement; text-only static/reduced-motion fallbacks stay
intact. The removed HEIR viewer link is homepage-only, with its unused caption
styles removed; no shared image-viewer handler was changed.

Timeline buttons now read About Me, Work at Ganance, Work at Lira, How I Work.
Their underlying scene IDs, positions, label destinations, progress, and keyboard
handlers are unchanged. MacBook/hero, Menu/drawer, How I Work, and all case-study,
research, and gallery files remain unchanged by this pass.

Lira-pass validation:

- Production check/build pass with zero Astro diagnostics; build validates 10
  routes, 329 links/fragments (one homepage viewer link removed), all galleries,
  original-image integrity, and publication boundaries. Source/research checks
  pass; `main`/HEAD remain `735b393`. All work remains uncommitted.
- Brave desktop review at 1329 × 868 and full 1700px width confirms the transparent
  pendant/shadow, restrained 1.04 focus, correctly traced partial/completed light,
  and readable light/dark emission. Image/overlay rectangle error is 0px at the
  measured focused composition. The pendant stays stationary across lighting
  progress. Ring completion precedes the upper indicator; reverse scrolling
  restores the identical partial ring value and turns the indicator off.
- Both headings compute to 39.87px / weight 600 / line-height 44.6544px at the
  measured 1329px viewport. There are exactly two project eyebrows, one per scene,
  no HEIR homepage viewer anchor, and all four updated native timeline names.
  The HEIR screenshot bottom gap remains below 0.001px with one master pin.
- The restored Lira timeline button accepts pointer navigation. Tab moves onward
  to How I Work; Shift-Tab returns through Work at Lira, Work at Ganance, About Me,
  revealing each destination without bypassing the camera. Native wheel scrolling
  was exercised from HEIR into Lira. Menu theme selection and Escape/focus return
  continue working. The original System theme preference was restored.
- Switching to reduced motion from illuminated Lira leaves zero pins and no inline
  light variables, with the pendant/status hidden in the original static fallback.
  Keyboard Skip from illuminated Lira clears lighting and pin state, focuses the
  unchanged hero headline, and returns to scroll zero. The test skip flag was
  cleared for the final preview, which was reloaded with motion emulation off.

The C-shaped completion is deliberate hardware fidelity, not a missing segment.
The subsequent diffuser/theme/spacing refinement passes check/build and desktop
review in light and dark themes. At 1329 × 868, both copy columns measure 496px;
the optical gaps are 66.45px for both projects (within 0.01px). Artwork size is
unchanged at 463.84px. Both theme images and the light overlay have identical
bounds (0px error); reverse scrolling restores ring/indicator to zero while the
diffuser remains visible. One master pin and zero horizontal overflow remain.
No camera controller, scene timing, homepage copy, or unrelated section changed
during this refinement.
Safari and physical trackpad review remain unverified. No tablet/mobile visual
testing, card animation, unrelated polishing, commits, or pushes were performed.
Local production preview remains `http://127.0.0.1:4332/portfolio/`.

### How I Work — scroll-driven editorial deck

This completes the card interaction deferred in the earlier camera/Lira passes.

The existing How I Work destination now renders `WorkDeck.astro`, preserving all
three approved categories, headings, descriptions, numbering, and the main
statement exactly. The statement is one semantic h2; the cover uses that same
live heading throughout its transformation. Only its visual HOW I WORK label
and surface are decorative/aria-hidden. Content remains available once to screen
readers. Static, reduced-motion, no-JavaScript, and smaller-screen layouts retain
the earlier readable expertise rows; no tablet/mobile animation was added.

On arrival, the approved four-card stack is unchanged, as are the final three
editorial cards, semantic heading, typography, surfaces, themes, and fallback.
The existing 1.04 camera focus, 1.10H interaction, pullback/finish, and all scroll
distances remain intact. The original scrubbed fan/cover morph is superseded by
a threshold-triggered transition: crossing .08 of the interaction window plays
one .72-second GSAP animation; crossing back reverses it automatically. The
master camera still owns the only ScrollTrigger/pin. There is no scroll locking,
additional listener, timer, or independent pinned section.

`workDeckMotion` in `work-deck.ts` now exposes the threshold and second-based
durations. Cards separate directly to their final positions with `power3.inOut`,
removing the intermediate fan. The cover keeps its original rectangle dimensions
and clears in .14 seconds with a small lift, eliminating the prolonged translucent
surface. Its single live h2 moves/scales into the approved heading over .58 seconds
with `power3.out`; card text appears during .24–.46 seconds once it clears. No
headings are swapped or duplicated. The expanded state persists through forward
pullback and departure/conclusion.

Only threshold crossings call play/reverse; stopping the wheel cannot pause the
transition. Rapid recrossings reverse from the current frame without restarting
or queueing animations. Refresh preserves the playhead and target direction when
rebuilding measured geometry. Skip, reduced motion, and Astro cleanup kill the
transition and restore static inline styles.

The MacBook, HEIR, Lira, timeline geometry/labels, Menu/drawer, hero copy, case
studies, galleries, research sources, and mobile/tablet fallback are unchanged.
This refinement changes only `work-deck.ts` and these two documentation sections.
Main/HEAD remain `735b393`; no staging, commits, or pushes.

Desktop verification of the trigger refinement:

- Check passes with 65 files and zero errors/warnings/hints; production build
  validates 10 routes, 329 links/fragments, galleries, originals, and boundaries.
- A 17px native scroll across the threshold completes the reveal after scrolling
  stops. Frame sampling measures approximately 718ms for the cards and 134ms for
  the cover to clear. Reversing across it restores identical initial transforms,
  surface opacity one, and hidden capability text.
- Continuous scroll bursts emulate trackpad-style input, including rapid changes
  of direction and a resize refresh during the transition. One master pin remains;
  cards settle at zero transforms with text opacity one. Physical trackpad and
  Safari review remain unverified.
- Small native forward/reverse wheel crossings both complete after input stops.
  Skip during the active transition cancels it, leaves zero pins/animated styles,
  returns to scroll zero, and focuses the hero headline. Light/dark final layouts
  remain unchanged; forward travel retains expanded cards. The System theme
  preference is restored for the review preview.

The previous desktop layout/accessibility review covered 1329 × 868,
1700 × 868, and 1700 × 800. The approved shorter-stage fit remains untouched
(544px stage with 341px cards at 1700 × 800, no text overflow). No tablet/mobile
animation work or testing was performed. Local production preview:
`http://127.0.0.1:4333/portfolio/`.

### Select Tools — interactive bubble swarm

Select Tools now follows How I Work as the fifth destination on the same master
camera timeline. It uses the existing scene factory (1.04 focus, .12H focus and
pullback, .80H exploration, normal approach/departure), with no second pin, scroll
lock, or forced completion of a tool interaction. How I Work now has its existing
departure leg into the new scene; its approved card controller is untouched.
The previous tools section moves into this slot, including its original static
list. It is not duplicated after the journey. All prior labels and choreography
parameters remain unchanged.

`src/data/homepage-tools.ts` shares the eleven original SVG imports plus the
approved descriptions verbatim. `ToolSwarm.astro`/`tool-swarm.css` provide eleven
named circular buttons and a fixed editorial panel, approximately 63% field / 37%
panel after the gutter. Logos retain their authored colors and geometry; small
light evidence-surface backings keep marks readable in both themes. Slight diameter
variation is ornamental and does not represent skill. Static/no-JavaScript,
smaller-screen, reduced-motion, and Skip presentations keep the original list.

Physics is a small dependency-free 2D spring/collision solver rather than D3:
eleven bodies require only 55 pair checks per pass. `swarmMotion` exposes 25%
enlargement, 12px gaps/walls, 24px scale-following clearance, .003 home spring,
.0007 pair attraction toward .86 of anchor separation, .84 damping, 18px individual
and 7px shared drift, and six soft collision passes. Weak attraction produces a
cohesive floating cluster; the selected body holds its center while neighbors
yield. Hover, focus and click directly select the body without depending on
hover state. Enlargement persists with the description until another selection
or scene exit; the previous body and its clearance ease back together. Bubble
icon backings increase from 40px to 46px; panel marks remain unchanged. The
information panel does not move. Pointer entry, click, and keyboard focus show
the exact corresponding description, retained across empty space. A 140ms panel
transition avoids dimensional changes; hidden articles are excluded from the
accessibility tree, with controls/describedby/pressed and a polite live region.

`tool-swarm.ts` runs one requestAnimationFrame loop only when its scene is active,
visible, inside the pinned journey, in a visible document, and outside the inert
navigation-drawer state. Refresh renews the visibility subscription and consumes
the latest intersection record so viewport changes cannot leave it paused.
It measures only on master refresh and preserves normalized positions on resize.
Reset stops physics, cancels panel animation, and clears selection/transforms;
Astro disposal aborts listeners and disconnects observers. Scroll does not control
individual bubbles and remains available throughout exploration.

The MacBook, HEIR, Lira, How I Work controller/styles/copy, navigation/drawer,
homepage hero/about, case studies, galleries, research, and source materials are
preserved. No dependencies were added. No tablet/mobile animation work or visual
testing is included, and nothing is staged, committed, or pushed.

Select Tools validation:

- Check passes: 69 files, zero errors/warnings/hints, semantic contrast and
  content validation. Production build passes with 10 routes, 329 links/fragments,
  galleries, original-image integrity, and publication boundaries. HEIR source
  and all five research fidelity checks pass. All eleven descriptions match the
  attached request verbatim; the SVG asset files are unchanged.
- Refinement solver checks cover three desktop fields and all eleven active
  bodies, idle, and release. All bodies remain bounded with no physical overlaps;
  minimum measured gap is 11.30px during soft relaxation. Compared with matching
  idle trajectories, strongest neighbor displacement after one second ranges
  from 14.3–41.1px across the eleven selections. Scale reaches 1.25 and returns
  to 1 after release. Browser idle samples show 12–21px travel, visibly floating
  while remaining easy to target.
- Brave desktop review at 1329 × 868 and 1700 × 800 verifies all eleven logos,
  labels, pointer enlargement, neighbor response, stationary panel, persistence
  through empty space, and readable light/dark treatments. Selecting every tool
  preserves identical panel bounds and fits every description without overflow.
  At 1700 × 800, the 544px stage contains a 501px field with zero stage/document
  overflow. No mobile/tablet emulation is used.
- Native Tab and Enter select the correct tool, expose its description, retain
  visible focus, and enlarge it to 1.25 even with the pointer over a different
  bubble. Menu open pauses the loop; close resumes it. Desktop viewport changes
  renew visibility observation and the active field restarts correctly.
- Normal scrolling reaches the vertical About conclusion; at master finish the
  loop stops and the panel clears. There is exactly one SELECT TOOLS section.
  Native Menu navigation to HEIR and browser Back restore one field, eleven
  buttons, one pin, and a running scene without duplicate listeners/content.
- Reduced motion leaves zero pins/physics transforms, hides the swarm, and shows
  the original eleven-item list. Keyboard Skip likewise stops the loop, clears
  all bubble transforms, focuses the unchanged hero headline, and returns to
  scroll zero. Test Skip state is cleared; motion emulation is off and the
  original Light theme preference is retained for the preview.

Safari and physical trackpad review remain unverified. The local production
preview is `http://127.0.0.1:4333/portfolio/`. Main/HEAD remain `735b393`.

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

Tools-only final verification: 1366×768 and 1920×1080 in light/dark show
grayscale(1) while collapsed (including selector focus) and no filter expanded.
All eleven tools retain the 360px three-column grid and 16px/8px gaps. Heading
and grid edges match; the bottom label differs by only its 1px panel border.
Actual Tools width is 440px at those viewports; Standard title and colors restore
on release. Check, production build and source verification passed.
