# HEIR Face Scan Gallery metadata audit

Reviewed October 13, 2026. The complete gallery is implemented and approved for publication.
The existing viewer is reused without changes.

## Sources and preservation

`src/data/heir-face-scan-gallery.yml` preserves the supplied
sibling `heir-face-scan-gallery.yml`, with the approved camera-button alt correction. IDs, chapter/story order, explanations,
captions, alt descriptions, role classifications, credits, and exclusion flags
are otherwise unchanged. `heir-content-map.yml` is a separate registry and remains untouched.
All source paths resolve relative to
`../source-materials/Website portfolio/Heir case study/`.

The Word source is `Gallery/Face scan/face-scan-gallery-document.docx`.
Its recorded page count is 28. Read-only OOXML inspection confirms the title,
introduction, all 28 story titles/explanations in order, and 75 image placements.
Its embedded JPEGs are reduced renditions; originals remain the supplied PNGs.
Each of the 75 placements was matched against all 80 PNGs using normalized RGB
thumbnails: the nearest match agrees with the supplied asset ID for every
placement, with mean per-channel differences below 4/255. All 80 originals were
also visually inspected against their authored descriptions. No substitutes used.
Near-identical starting/progress and failed/timeout states were distinguished by
their banner text; the failed/timeout Word renditions were enlarged for inspection.

## Inventory

| Chapter | Stories | HEIR screens | Reference placements |
| --- | ---: | ---: | ---: |
| Onboarding and permissions | 3 | 7 | 2 |
| Scan experience | 9 | 20 | 1 |
| Scan and scan history | 2 | 4 | 2 |
| Scan details | 7 | 15 | 7 |
| Scan routine | 5 | 10 | 2 |
| User profile | 2 | 4 | 1 |
| Total | 28 | 60 | 15 |

All 80 PNG entries exist: 60 designs and 20 references. All 60 design files in the
source folders appear exactly once. Thirteen distinct references supply 15
placements; `reference-frame-4-4-png` and `reference-frame-6-5-png` are reused.
Their captions and centralized source credits stay consistent across stories.
The seven unused references have `included_in_document: false` and no placements:

- `reference-frame-10-11-png`
- `reference-frame-2-2-png`
- `reference-frame-5-10-png`
- `reference-frame-9-8-png`
- `reference-image-14-png`
- `reference-image-17-png`
- `reference-image-18-png`

Only 73 used originals are copied into the repository and explicitly imported.
The audit compares every copied PNG byte-for-byte with its original and checks
unused-file hashes against `src/assets`, `public`, and `dist`. The metadata powers
the gallery at build time; private source paths/documents are not published.

## Approved corrections and provenance

1. In `choosing-a-check-in-routine`, YAML captions are **60-second scan** and
   **30-second scan**; the Word captions are **Sixty second scan** and
   **Thirty second scan**. The user approved retaining the numeric YAML wording.
   All other story caption sequences match Word exactly.
2. `onboarding-camera-access-5-png` alt says **Allow and Don’t Allow options**.
   The original permission dialog actually reads **OK** and **Don’t Allow**.
   The user approved replacing “Allow” with “OK” in this alt only.
   The integrated metadata now contains that correction; its action-oriented visible
   caption “Allow camera access” remains appropriate.
3. Five included references have descriptive credits rather than named apps:
   `reference-frame-1-1-png`, `reference-frame-3-3-png`,
   `reference-frame-4-4-png`, `reference-frame-6-5-png`, and
   `reference-frame-7-6-png`. Preserve these approved descriptions; confirm source
   names/URLs before replacing them with more specific attribution. No app names
   were inferred from appearance. Shen.ai, AVI, Bevel, and Oura credits are retained.
4. `source_zip: Gallery(1).zip` is retained as supplied provenance, but that archive
   was not located in this workspace. It is not needed to resolve any of the 80
   extracted PNGs or the Word document. Retained as an archival provenance label; no gallery assets depend on it.

## Implemented rendering contract

Each chapter has an ordered `stories` array. Each story retains title, explanation,
an independent `references` array (zero, one, or more), and `screens` (one or more).
Placements resolve `asset_id` through the shared asset map, with captions attached
to each occurrence and alt/role/source credit attached to the asset itself.

References must render as static frames outside the HEIR rail, with an explicit
Reference label, the asset's source credit, and the placement's individual caption.
Only `role: design` placements in `screens` belong in the responsive HEIR design
rail. Preserve source order, complete native aspect ratios, and per-image captions;
available width may expose multiple full/partial screens. Do not flatten both
collections into the existing single-image carousel model. Only explicit story
placements are imported; never glob the whole source asset map or publish
assets whose inclusion flag is false. The complete interface is approved, including its static reference frames and responsive design rails.

Run `node scripts/validate-face-scan-gallery.mjs` locally with the sibling sources
present. It validates the schema/counts, role separation, file formats/existence,
design coverage, Word text/order, every visual placement, caption differences,
centralized reference attribution, and unused-original publication exclusions.
This is a local source audit; it must not become a deployment prerequisite that
requires private source documents on GitHub.

Automated implementation validation passes: gallery source audit, Astro/content
checks, production build, and original HEIR/all five research fidelity checks.
Production has nine pages and 254 internal links/fragments. The build also verifies
all gallery story text, alt descriptions, captions, order, roles, credits, original
image bytes, and import exclusions without requiring private sources.
Desktop/tablet/phone, theme, rail, viewer, TOC, and contextual navigation review
are completed and recorded in the project handoff. The user approved the gallery
and authorized commit and push to `origin/main` on October 13, 2026.
