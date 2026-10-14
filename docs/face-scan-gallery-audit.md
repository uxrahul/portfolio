# HEIR Face Scan Gallery source audit

Updated October 14, 2026. The revised private Word document at
`Gallery/Face scan/face-scan-gallery-document.docx` is authoritative.
The reference-free gallery is preserved in the approved Phase One publication.

## Content and images

The six chapters, 28 story headings/order/IDs, and 60 original HEIR screens are
preserved. The introduction and all explanations/captions match the revised Word
text exactly. Twelve explanations and the introduction changed. The two scan-length
captions now read “Sixty second scan” and “Thirty second scan” as in the document.
Authored HEIR alt descriptions and original PNG bytes remain unchanged.

Every external reference placement, caption, credit, asset entry, and reference
collection is removed from the gallery metadata. The 13 previously imported
external originals are removed from the repository working tree. No external
moodboard originals or optimized reference images are emitted by the fresh build.
The private archive and its reference images remain untouched outside the site.

## Rendering and validation

Each story uses the existing design rail across the available content width.
No reference frames, labels, placeholders, or replacement images render. Typography,
rail interactions, original-image viewer, themes, navigation, TOC, and motion remain
unchanged.

`validate-gallery-build.mjs` verifies 28 stories, six chapters, 60 captions/alts,
original-image integrity, design-only metadata, and reference-free build output
without private source dependencies. `validate-face-scan-gallery.mjs` additionally
compares complete wording/captions and all 60 visual placements with read-only
OOXML, checks every copied HEIR PNG against its source, and scans published assets
for external moodboard image hashes.

Verification passed: production build and gallery validators, Astro/content checks,
main HEIR and all five research fidelity checks, and whitespace checks. Desktop
and 393 × 852 phone emulation covered full-width rails, readable captions,
arrow/keyboard scrolling, original-image enlargement, Escape/focus return,
mobile drawer, and light/dark appearance. No page-level overflow was observed.
The unchanged rail/motion/style implementations are retained.

## Git history

The 13 removed external PNG files remain in commit
`903ea967cfaf32ff1b3f5b65314d04e42ad69e6e`, along with the previous identifying
metadata. Removing them from the current working tree does not remove that history.
No history rewrite or force-push has been performed. The approved publication removes those files from the deployed build, while
prior Git history remains unchanged.
