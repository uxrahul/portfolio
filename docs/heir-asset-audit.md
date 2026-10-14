# HEIR source and visual audit

Initial inventory audited October 12, 2026. First-launch revision verified October 14, 2026. Source of record:
`../source-materials/Website portfolio/Heir case study/HEIR_case_study_structured_2.docx`.
The archive was read only. Its complete body, run/paragraph styles, relationship
map, 24 embedded images, three tables, and captions were inspected. Embedded
visuals were compared with contact sheets of all 43 standalone images in the
HEIR folder. Matches below are based on visual content; 13 are also byte-identical.
No research was rerun and no charts were redrawn.

## First-launch revision — October 14, 2026

The authoritative revision has 28 embedded images and four tables. The earlier
inventory below records the original 24-image document: in the revised Word,
IA is image2, ambiguity is image3, the four new UI screens are image4–image7,
and former image4–image24 become image8–image28. Existing published image files
and captions remain unchanged. IA now follows Context directly; its Settings
explanation remains the caption. The new screens follow the first Outcome bullet
as two independent responsive rails, with the user-supplied captions and alt text.

All four originals are 1322 × 2726, visually matched and byte-identical to the
revised Word images. Paths below are relative to the first-launch `Visuals/` folder:

| Word media | Approved caption | Original PNG / delivery |
| --- | --- | --- |
| image4.png | Old app — Home dashboard | `Old app/Dashboard - Mockup 1.png`; imported as `product/old-app-home.png`. |
| image5.png | Old app — Profile and Settings access | `Old app/Profile - Mockup.png`; imported as `product/old-app-profile.png`. |
| image6.png | Redesigned app — Home and activity overview | `Redesigned app/Home - Connected - Hero1 - Mockup 1.png`; reuses the identical Phase One `reading-the-day-at-a-glance--home-overview.png`. |
| image7.png | Redesigned app — Consolidated Settings | `Redesigned app/Settings - Mockup 1.png`; reuses the identical Phase One `giving-customization-a-clear-home--settings-groups.png`. |

## Original representative implementation

The introduction and first-launch section include every source block in order.
The approved introduction has the shortened italic subtitle, revised role and
eight-tool list in a unified metadata block, context, hero/caption, corporate-athlete
and calm-technology paragraph, and three milestone cards preserving every
column of the original 4-row × 3-column table. The selected SVG tool assets are
documented in `project-handoff.md`; the generic SQL symbol for MySQL was explicitly
approved by the user. The first-launch section has Context, Goal, five contribution bullets,
two figures, Outcome, five outcome bullets, and two further figures. Bold decision
phrases and statistical evidence and the italic independent-sample qualification
are preserved. Word's blue goal treatment becomes quiet rules and typography;
caption paragraphs styled as Word headings become semantic figure captions.

| Embedded media | Caption | Matching asset and delivery decision |
| --- | --- | --- |
| image1.png, 1672 × 941 | HEIR mounted beneath a traditional watch, shown beside the standalone device. | Same photograph/composition as `hero-image.webp`, 1600 × 900. Use the standalone photographic source; preserve its original file for enlargement. Word's rendition has slightly different raster dimensions. |
| image2.png, 2000 × 1060 | Card sort placement of four ambiguous controls | Exact standalone match: `01 A clearer app for the first launch/IA/IA redesign/Quarto analysis/ia_research_pngs/02_card_sort_ambiguity.png`. |
| image3.png, 6400 × 5359 | The first-launch redesign grouped device controls in Settings and gave Settings a dedicated place in the main navigation. | Visually matches `01 A clearer app for the first launch/Visuals/before-after-ia.webp`, 2400 × 2010. Use the larger embedded PNG, retaining the complete annotations and composition. |
| image4.png, 2000 × 1160 | Task success in the old and redesigned app studies | Exact standalone match: `01 A clearer app for the first launch/IA/Usability tests/Quarto analysis/usability_pngs/01_task_success.png`. |
| image5.png, 2000 × 1160 | Shortfall between expected and experienced task ease | Exact standalone match: `01 A clearer app for the first launch/IA/Usability tests/Quarto analysis/usability_pngs/03_expectation_gap.png`. |

Inline figures use responsive Astro WebP output at quality 95 without upscaling.
The modal uses the fingerprinted, untouched source file, avoiding a second
compression/quantization step. Large original images load when opened, with Fit
and 100% viewing. The first-launch PNGs are not substituted with redesigned plots.

## Complete remaining document inventory — migrated

Paths are relative to the HEIR source folder. Exact means byte-identical to Word
media. All 19 later-section visuals are now migrated in source order. No standalone
brand-workshop visuals were added: the main Word narrative contains none in that section.

| Media | Source caption or table role | Visual match / finding |
| --- | --- | --- |
| image6 | Requested improvements among 100 existing customers | Exact: `02 Research changed what we prioritized/Existing user research/Quarto analysis/heir_survey_pngs/04_improvement_priorities.png` |
| image7 | Primary sources of value among 100 existing customers | Exact: same folder, `02_primary_value.png` |
| image8 | Notifications — Choose which alerts arrive | Exact: `02 Research changed what we prioritized/Existing user research/App screens/notifications.png` |
| image9 | Silent Alarm — Set a recurring alarm | Exact: same folder, `silent-alarm.png` |
| image10 | Reminders — Define a reminder window | Exact: same folder, `reminders.png` |
| image11 | Activation and current configuration of haptic features | Exact: `02 Research changed what we prioritized/Post analytics/Quarto analysis/heir_feature_pngs/01_feature_adoption.png` |
| image12 | Continued configuration among mature adopters | Exact: same folder, `04_configuration_retention.png` |
| image13 | Personal target shown alongside the primary goal | Related: `03 Turning movement into useful guidance/App screens/adaptive-target.webp`, both 1608 × 1240. **Resolved delivery:** use the embedded Word PNG. Direct enlarged comparison shows a target arc gap in both renditions, with different edge/export treatments; the earlier continuous-arc characterization was inaccurate. The embedded source preserves the approved document exactly. |
| image14 | Distribution of users’ target-attainment rates | Exact: `03 Turning movement into useful guidance/Activity analytics/Quarto book/PNG/03_adaptive_target_attainment_distribution.png` |
| image15 | Average daily steps across four observed weeks | Exact: same folder, `06_weekly_step_change.png` |
| image16 | Pace card showing the composition of a tracked day | Related: `03 Turning movement into useful guidance/App screens/pace-card.webp`, both 1608 × 992. Same labels, values, and arrangement; background/border rendition differs. **Resolved delivery:** use the embedded Word PNG to preserve its background/border rendition exactly. |
| image17 | Composition of reliably classified movement time | Exact: activity PNG folder, `08_movement_composition.png` |
| image18 | Health information priorities in the market survey | **Unmatched standalone asset.** Word contains a 2048 × 1229 raster chart with gray bars. No corresponding high-resolution chart export exists in the supplied folders. The embedded original is now used unchanged; the missing standalone/high-resolution export remains reported. No different survey chart was substituted. |
| image19 | Consent — Make on-device processing and consent clear before the user continues. | Visually matches `05 Bringing health to a device without health sensors/App screens/Data-Privacy.png`. Word 3967 × 8178; standalone 1206 × 2487. **Delivery:** all six screens use their 3967 × 8178 embedded originals, visually matched to the corresponding standalone exports. Originals remain unchanged in the modal; Astro optimizes inline delivery. |
| image20 | Preparation — Turn rest, lighting, framing and stillness into concrete instructions. | Visually matches same folder, `Prepare-Scan.png`; same resolution distinction. |
| image21 | Finalization — Distinguish completed capture from results that are still processing. | Visually matches same folder, `Scan-Complete.png`; same resolution distinction. |
| image22 | Results — Bring scan quality, a brief summary and individual readings together. | Visually matches same folder, `Scan-Date.png`; same resolution distinction. |
| image23 | Explain — Explain what the estimate represents, how it is derived and its limits. | Visually matches same folder, `BP-Outlook-Sheet.png`; same resolution distinction. |
| image24 | Repeat — Make a consistent check-in actionable through timing and reminder choices. | Visually matches same folder, `Once-Daily-Routine.png`; same resolution distinction. |

The notification/silent-alarm/reminder screens form a three-row, one-column Word
table, followed by the caption “Customer priorities translated into notification
selection, recurring silent alarms, and reminders with configurable schedules.”
They are a three-slide UI carousel; each paired composition remains intact with its stage title/description below it, followed by the complete shared source caption. The six Health Scan
screens form a two-row, three-column composition in the order recorded above;
They are a six-slide UI carousel with the full labels/descriptions and source order retained.

Other standalone chart exports and brand-workshop carousel images are not embedded
in the main narrative. Their presence is not permission to add extra figures.

## Verification

`python3 scripts/validate-heir-source.py` compares the entire built article with
read-only OOXML: every narrative/UI table cell in order (the four new screen labels use the explicit user-approved captions), all three complete milestone
stages from source-table columns, all 48 exact bullets,
source emphasis/qualifications, all captions and nine UI descriptions, and the
conclusion. It verifies all 28 modal images in order against source bytes (the
previously approved hero uses its visually matched standalone photograph; the
other 27 match the embedded Word originals). Run after `npm run build`. Original
source materials are never modified or published as research documents.
