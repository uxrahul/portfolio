# Portfolio verification

This records checks for the current approved implementation: the complete HEIR
case study, six shared carousels, and introductory milestone cards. Browser review
uses Brave and viewport emulation; it is not a physical-device or screen-reader
audit. Earlier table/hierarchy experiments were rolled back and are not current.

## Automated coverage

- `npm run check`: 32 Astro files, no errors/warnings/hints; 13 permanent link IDs,
  pending destinations, heading IDs, and semantic text contrast validated.
- `npm run build`: three pages (About, HEIR, 404), 49 internal links/fragments,
  six major TOC entries, six carousels, 24 figures, original-image integrity, and
  private-file publication exclusions validated.
- `npm run verify:source`: every narrative/UI table cell, 48 exact research bullets,
  source emphasis/qualifications, captions/stage descriptions, and conclusion.
  Each milestone card matches its complete source-table column in chronological
  order. All 24 modal originals are byte-verified: 23 match Word embeds; the
  approved hero matches its standalone original.

## Browser evidence

Review across the implementation covered desktop widths around 1440–1710px,
tablet widths, and 390–393px phone emulation in light/dark themes.
The cleanup review rechecked all six carousel boundaries/keyboard handlers,
About/HEIR history and reinitialization, the 404 response, native viewer Escape/
focus return, canvas-only page motion, vertical entrances, and mobile drawer
inert/scroll/focus cleanup. At 393px, cards use one 349px column without overflow.

- Reading/figure alignment remains 688px on wide desktops, approximately 349px
  with 22px gutters on a 393px phone. All 24 inline images load, keep their aspect
  ratios, and retain source text. Charts keep readable white evidence surfaces;
  product images preserve transparency and complete captions.
- Milestone cards have 24px padding, subtle theme surfaces, 4px radii, no borders
  or shadows, aligned desktop rows, and complete source copy. Available widths
  of 688/560/400/320px produce three/two/one/one columns without overflow; phone
  review confirms the single-column layout and fully readable contributions.
- Global navigation, TOC anchors/progress, About/HEIR page swaps, native history,
  theme persistence, and mobile drawer focus/inert/scroll cleanup were exercised.
  Only the reading canvas has horizontal page motion; section entrances remain
  vertical. Reduced motion suppresses page/section/navigation animation.
- Statistical and UI carousels support arrows, Arrow Left/Right, Home/End, counts,
  disabled boundaries, inactive-slide inert state, mouse dragging, and deliberate
  horizontal wheel gestures while preserving vertical scrolling. Page swaps
  reinitialize them without duplicate handlers. No autoplay is present.
- Figure clicks open the original image. Fit/100%, local scrolling, Escape,
  scroll unlocking, and focus return were exercised. Large examples include the
  6400px IA composition and 3967 × 8178 Health Scan screens.

## Limits and asset issue

Touch event sequences with intermediate moves were tested. The native automation
emulated gesture omitted move events, so it did not establish a physical/native
phone swipe test. Full screen-reader and Firefox/Safari reviews remain unperformed.
Browser extensions emitted unrelated errors; they were not portfolio source errors.

The health-priorities chart lacks a standalone export; its original embedded Word
image is retained unchanged. See `heir-asset-audit.md`. No external prototype
availability or private research reproducibility claim is made.
