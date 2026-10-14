# HEIR Phase One Gallery metadata audit

Reviewed and approved October 14, 2026. Commit and push to `origin/main` are
authorized. Prior Face Scan privacy changes are preserved.

## Sources and schema

The supplied sibling `heir-phase-one-gallery.yml` and read-only
`source-materials/Website portfolio/Heir case study/Gallery/Phase one/heir-phase-one-product-gallery.docx`
are the source of record. Integrated metadata is `src/data/heir-phase-one-gallery.yml`.
It uses the existing Face Scan structure: top-level title/intro, ordered chapters,
story explanation/screens, and an explicit design-only asset map. Supplied IDs,
order values, source-page metadata, captions, alt text, and description wording
are preserved. Authored Markdown emphasis is retained, including the italic book
title; the gallery renders that emphasis through build-time Markdown.

`source_path` and `source_document` resolve relative to the HEIR case-study archive,
as in Face Scan. The shared renderer reuses existing gallery components without
changing their interaction behavior. Only the 59 selected originals are imported.

## Verified inventory

| Chapter | Stories | Selected screens |
| --- | ---: | ---: |
| Onboarding | 2 | 6 |
| Pairing and connection | 4 | 11 |
| Home and insights | 3 | 7 |
| Settings and controls | 5 | 12 |
| Device management | 5 | 13 |
| Account and profile | 4 | 10 |
| Total | 23 | 59 |

Read-only OOXML comparison confirms title, introduction, chapter/story sequence,
all 23 descriptions, and every caption. All 59 Word placements visually match
selected original PNGs. Nearest normalized RGB thumbnail matching against all 87
source PNGs identifies the selected file for every placement (maximum average
per-channel difference 2.66/255). Contact sheets of every selected screen were
also inspected against captions and alt descriptions. No content or image-mapping
mismatch was found.

The source contains 87 PNGs: 59 selected HEIR designs, 16 unselected HEIR designs,
and 12 moodboard/reference images. Only the 59 selected assets have metadata
entries. The 59 selected PNGs are copied unchanged into `src/assets/heir/phase-one/` and
explicitly imported. None of the 28 excluded PNG hashes appears in site assets,
`public`, or build output.

## Path and provenance differences

- The supplied onboarding path contains the encoding artifact
  `LetΓÇÖs Make It Yours - Mockup 8.png`. Integrated `source_path` resolves to the
  existing `Let’s Make It Yours - Mockup 8.png`. Both correspond to the same
  verified Word screen. No original file is renamed or edited.
- The supplied archive label is `Phase one(1).zip`; the available archive is
  `Gallery/Phase one.zip`, containing 87 PNG entries. Integrated `source_archive`
  records the available filename. Extracted original PNGs are the image sources.
- The existing source directory spelling `Accout and profile` is retained exactly
  in paths; the authored chapter label remains `Account and profile`.

Metadata parsing, count/uniqueness/order checks, complete source wording/caption
checks, source-file existence, visual matching, authored-field preservation,
publication exclusions, and `git diff --check` passed. Production checks verify
all 59 captions/alts/original viewer bytes, 23 complete stories, six chapters,
and the italic educational reference. Desktop/tablet/phone, light/dark themes,
rail/viewer interactions, reduced motion, and contextual/global navigation were
reviewed. See the project handoff for implementation and validation details.
