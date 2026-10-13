# Portfolio verification

Verified October 12, 2026. This records implementation checks; final visual
approval belongs to the user. The latest scope is the complete HEIR case study
and shared statistical/mobile UI carousel system. Earlier-round results below
record checks performed before this completion.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run check` | Pass; 22 files, zero errors/warnings/hints |
| Semantic text contrast | Body, secondary, and accent pass 4.5:1 on intended light/dark backgrounds |
| 13-ID registry integrity | All IDs retained, fingerprint matches original registry, references occur once, pending links have no href |
| `npm run build` | Pass; About, HEIR and shared-layout 404 |
| Export validation | 31 actual internal links/fragments, unique DOM IDs, five major TOC links, images exist |
| Modal source integrity | All five representative modal originals match selected source bytes by SHA-256 |
| Publication boundary | No CSV/QMD/R/Word/Python research files or source archive in dist |
| `npm run verify:source` | All introduction/first-launch blocks/table cells in order; ten bullets, bold/italic semantics, five figures/captions |

## Browser inspection and interactions

Brave's actual browser and DevTools responsive view were used, at native desktop,
1440 × 900/844, and 390 × 844. The integrated browser was unavailable. No browser
or extension was installed. The test temporarily paused when the active window
left the authorized portfolio; the user restored that tab before testing resumed.

- Desktop title measures 40px. Source Sans 3 loaded. Main text/evidence alignment,
  hero, milestone table, Context/Goal/bullets, four figures and captions inspected.
- At 1440px, navigation and TOC computed as fixed; exactly five TOC links.
  Milestone table has four rows and three columns. No horizontal page overflow.
- Mobile light/dark reading composition and drawer inspected. At 390px, no page
  overflow; the milestone region scrolls locally. TOC starts closed and collapses
  at compact breakpoints. Hidden navigation is inert.
- Mobile opening focuses About, makes the reading region inert and locks body
  scroll. End-to-start Tab wrapping and Escape cleanup were exercised through
  the real handlers; modal Escape was also exercised with native keyboard input.
- Modal opened a 6400px composition, moved page focus to Close, and locked the
  background. 100% reported natural/display width 6400px with local overflow.
  Closing removed the modal image src, restored scrolling and returned focus to
  the triggering image link. All seven retained inline HEIR images loaded.
- About omits the TOC. HEIR retains native anchor/history behavior. Dark preference
  persisted across About/HEIR and history back.
- Runtime page-animation capture found only `canvas-in` and `canvas-out` on the
  reading-canvas view-transition pseudo-elements, each 300ms. Back captured
  `canvas-back-in` / `canvas-back-out`. No navigation/TOC transform animations.
- Actual animation-start events confirmed vertical `section-enter` on case sections
  and figures during scrolling. Reduced-motion emulation returned an empty
  animation list after navigation. Emulation was disabled after testing.
- Transparent charts initially lost contrast on dark surfaces. After repair,
  final mobile dark-mode review confirmed a white evidence surface with intact
  original chart colors, annotations and captions.

## Limits and remaining work

### Round 2 navigation and TOC — 2026-10-12

Astro check reports zero errors/warnings/hints; build and source-fidelity checks
pass. Checksums confirm unchanged MDX, assets, hierarchy, links, figure/gallery/
carousel/viewer files. The reading-canvas, editorial, figure, modal, pagination,
and page-transition CSS rules match the pre-refinement version.

Brave review covered the native 1710px desktop viewport, 1032px tablet emulation,
and 393px phone emulation. Desktop TOC content keeps a 40px outer gutter with
graceful title wrapping. No page overflow was observed. Light and dark navigation,
active states, scrim, and compact TOC were inspected.

Runtime sampling confirmed section-length-aware progress: first-section start
0, halfway through its scroll range 0.1, second-section start 0.2, middle of the
third range 0.5, and page bottom 1. Scrolling backward restores earlier progress.
Native TOC selection updates the hash/active section. Settled About → history Back
restored 4698.5px, the haptic section, and 0.2 progress exactly. About omits the TOC;
group expansion survives page swaps. Navigation/TOC stationary transition rules
are unchanged.

Submenu keyframes animate height from 0 to 240px over 260ms, with no opacity effect.
Native Space activation on a focused summary toggles its submenu. Mobile drawer
opening focuses About, locks scrolling, makes reading content inert, and rotates
both icon strokes to ±45°. Every visible mobile navigation row is at least 44px.
The real keyboard handlers were exercised for forward/backward focus wrapping
and Escape; outside and toggle-button dismissal restore access, scrolling, and
Menu focus. Closing drawer motion reports 260ms. Resizing an open drawer to tablet
cleans up inert/scroll state. Reduced-motion emulation reports zero submenu
animations and zero drawer/chevron transition duration, with correct open state.
Theme and motion emulation were restored after testing.

These checks used browser viewport emulation and application-handler diagnostics
alongside native input; no physical-device or full screen-reader audit was performed.

### Reading canvas and figure refinement — 2026-10-12

`npm run check`, `npm run build`, and `npm run verify:source` pass after the
figure refinement (zero Astro diagnostics). Original asset integrity, all 13
content-link IDs/destinations, and complete first-launch source fidelity pass.
Navigation, TOC shell, viewer, and link manifest files retain their prior hashes.

Brave review at 1440px desktop, 768px tablet, and 390px mobile confirms aligned
content edges and no horizontal page overflow. The desktop measure is 688px;
mobile is 346px with 22px gutters. Both usability slides load, retain source
captions, and switch without changing group height. Plots have a padded white
frame; product compositions retain their aspect ratio without decorative framing.

Previous/Next, native Arrow Left, Home/End, live slide count, inactive-slide inert
state, and focus transfer were exercised. Both charts open in the existing modal;
mobile Fit/100% and Escape were exercised, with focus returning to the selected
chart. The 240ms restrained transition and reduced-motion CSS are preserved.
The static HTML includes both figures in order with controls hidden until
enhancement; no autoplay is present. No new library or unused asset was added.

This review used viewport emulation; it is not a physical-device or screen-reader
audit.

This is a single-browser review with mobile viewport emulation, not a physical
phone test or a full assistive-technology audit. Native semantics, keyboard/focus,
contrast, reduced motion, and reading overflow were checked. Firefox/Safari and
screen-reader testing remain useful before production publication.

Existing browser extensions emitted unrelated errors from chrome-extension
background/service-worker scripts during review. Those are not portfolio source
errors and were not changed. No remote prototype availability or private analysis
reproducibility claim is made.

### Complete HEIR and reusable carousels — 2026-10-12

`npm run check` passes with 32 files and zero errors, warnings, or hints. Production
build validation passes for three pages, 49 internal links/fragments, six TOC
headings, 24 figures, and three carousels. All 13 content-link IDs and destination
relationships remain intact. Private research files are excluded from the build.

Full-document source verification checks every narrative paragraph and table cell
in order, all 48 bullets, source emphasis and qualifications, every caption and
stage description, and all 24 visuals in document order. Selected originals are
verified by SHA-256; 23 match Word embedded bytes, while the previously approved
hero uses its corresponding standalone original. Contact sheets and enlarged
comparisons were used to match the embedded visuals with the source folders.
Adaptive Target and Pace use the exact Word PNG exports. Health Scan uses the
3967 × 8178 embedded originals, which exceed the standalone WebP resolution.
The health-priorities chart has no corresponding standalone original; its intact
2048 × 1229 Word image is retained. See `heir-asset-audit.md`.

Brave review covered the native 1710px desktop viewport, 1032px tablet viewport,
and 393 × 852 phone emulation. The approved 688px desktop reading measure remains
aligned across headings, text, figures, and captions; mobile uses approximately
349px with 22px gutters. Newly migrated haptics, movement, brand, Health Scan, and
conclusion sections were inspected. All 24 inline images loaded, retained their
source aspect ratios, and produced no horizontal page overflow. Mobile UI slides
preserve transparency, complete stage descriptions, and a consistent 32rem maximum
image height. Light and dark statistical evidence surfaces remain readable.

Both carousel variants were exercised with Previous/Next, Arrow Left/Right,
Home/End, boundary states, live counts, inactive-slide inert state, and focus
transfer. Desktop native mouse dragging advances a slide without opening the
viewer; a subsequent click opens it normally. Horizontal wheel navigation advances
one slide while vertical scrolling remains native. All three carousels reinitialize
after About → history Back with one active slide each; one key advances one slide.
Reduced-motion emulation produces an immediate settled slide. Theme preference
and motion emulation were restored after review.

The browser Touch/TouchEvent pipeline, including intermediate move events, advances
statistical, paired-screen, and single-screen carousels without opening the modal.
The native automation tool's emulated gesture delivered touch start/end without
intermediate moves, so it could not establish a native touch swipe test. This is
viewport/emulated-event verification, not a physical-phone or screen-reader audit.

Paired haptic compositions and Health Scan screens open in the existing viewer.
Escape returns focus to the selected figure. Health Scan enlargement loads the
3967 × 8178 source and displays its native 3967px width in 100% mode with local
scrolling. Static HTML retains all figures in order, with carousel controls hidden
until enhancement. No autoplay is used.

Checksums confirm that the approved navigation components, layout, navigation and
TOC controllers, hierarchy, and 13-link manifest are unchanged. Shared navigation,
reading-canvas, viewer, and page-transition CSS remains unchanged. Reusable figure
and carousel conventions are recorded in `design-system.md`.

The complete HEIR case study is migrated. Standalone reports, product gallery
pages, and resume remain outside the authorized scope. No commits were created.
