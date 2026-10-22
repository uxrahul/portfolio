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

### Typography audit — October 19, 2026

Reviewed the animated and standard homepage, HEIR, all research styles, product
galleries, figure rails, navigation, TOC, viewer and shared interface components.
Consolidation preserves the existing computed values, wrapping and camera geometry.

| Finding | Decision |
| --- | --- |
| Font families and variants | Keep the two locally hosted Source Sans 3 variable files: normal and italic, each supporting 200–900. Authored case-study/research italics use the italic file. The code monospace fallback has a separate semantic purpose. No duplicate font loads or unused variants were found. |
| Repeated 1.5 leading | Name the existing value `--line-height-supporting` and reuse it in 17 declarations covering leads, short supporting copy, eyebrows, captions, TOC links, project status, timeline labels and card descriptions. This adds no new visual value. |
| Repeated 1.2 leading | Tool labels and selected-tool headings now consume the existing `--line-height-heading` token. |
| Duplicate homepage h3 size | Remove `.home-content h3`'s redundant size rule; `.editorial h3` already supplies the identical token. Scoped homepage/scene overrides remain intact. |
| Similar lead and h3 scales | Retain both. Lead uses a .45vw slope; h3 uses .5vw. Their 20–24px ranges overlap, but they serve prose and heading roles with different leading/weight. Merging would alter wrapping at intermediate widths. |
| Small labels | Retain 14px captions, 15px navigation/company labels, 13px homepage eyebrows, 12px metadata and scene-specific cover labels. Hierarchy and available space justify the differences. |
| Editorial and statistical type | Retain homepage title/statement scales, fitted deck titles, section ordinals, metric figures and tabular numerals. They serve distinct roles and participate in approved layout/animation measurements. |
| Other leading, weight and tracking | Retain reading 1.7, compact UI 1.45, descriptions 1.6 and tight editorial leading. Existing regular/medium/semibold and heading/label tracking tokens remain canonical; no new size, weight, tracking or font values are introduced. |

## Tablet and mobile homepage

### Desktop accordion experiment (v2, Passes 1–2)

`homepage-accordion.css` gates every new composition behind the controller-owned
`data-accordion-active` flag. The static document stays in published vertical flow.
Five rounded panels share 12px gutters, 24px radii and responsive 24–40px internal
padding. Shared panel metadata targets 42% About, 58% HEIR, 53% Lira, 60% How I
Work and 38% Tools of the canvas after gutters. Reading minimums are respectively
448, 512, 480, 600 and 416px; four closed panels retain at least 104px each.
Tools additionally caps its open panel at 440px to remove empty outer gutters
around its unchanged 360px grid. Its heading and footer share the grid start edge.
Selecting a story redistributes the remainder equally among its neighbors. Each
story retains its own expanded content measure during other selections, so copy
and the approved work cards do not reflow to another story’s width. The stage uses `100dvh - 9rem`; overflowing active content
scrolls internally instead of shrinking type. If these minimums cannot fit, or
motion/pointer conditions are unsuitable, the existing Standard/touch view remains.

About uses a full-bleed photographic cover in both states. Expanded width now
comes from the actual 42% panel preference, not an internal content cap. The image
fills the available panel width at 1× cover scale, without the old expanded 125%
overzoom. Its upper viewport-height photograph continues into a dark lower region
when readable copy requires internal scrolling. A lower gradient integrates the
unchanged introduction without covering the subject’s face; source aspect ratio
is preserved by object-fit rather than stretching. HEIR/Lira use 58% of stage
height after the footer for their upper product region and a lower editorial
measure (43rem max). Accordion case-study titles use the existing heading-1 token.
Lira’s full square canvas is 10% larger to balance the pendant body against the
phone, with its transparent shadow margin preserved. Collapsed product previews
target 76% of stage height, capped at 1.8× expanded scale. Collapsed HEIR retains its muted primary-container tint; collapsed Lira combines
the background and primary-container roles. All expanded content panels use the
neutral surface token; About retains its photographic cover.
The phone preserves its source aspect ratio; Lira retains the complete square
canvas, theme assets and diffuser. The three existing work cards fan in preview
and straighten into three columns. Tools recomposes the same eleven SVG/name
entries from a cropped mosaic into a centered three-column grid capped at 360px, with unchanged 16px row and 8px column gaps.
The accordion title and accessible labels read “Tools I use”; the eyebrow retains
uppercase styling. Only collapsed accordion tool marks use grayscale(1), including
selector hover/focus; expansion restores original SVG colors without altering assets.
Standard/touch titles and colors are restored when the enhancement is released.
Labels use the navigation token consistently: above 184px panel width they remain
horizontal; at narrower widths every label uses an authored two-line split with
the plus indicator centered above it. All labels share the same 24px bottom inset.
Expanded labels align with their editorial column: shared panel padding for both case studies, Work
and Tools. Case-study copy retains its 43rem ceiling but starts at the shared
24–40px inset instead of centering the ceiling within wider panels. The 35rem
About measure supplies an additional inset only when the panel is wider. This moves labels, not content.
The approved Work padding and cards remain unchanged. Existing title, heading,
body, metadata and spacing tokens supply hierarchy; there is no new type system.

Selection is click/keyboard driven, with subtle border/label hover feedback only.
One interruptible 550ms GSAP transition coordinates widths, visual transforms and
short copy fades. There is no cinematic timeline or scroll-driven camera in v2.
Pass 2 interactions mount only after the current panel settles. HEIR uses the
existing rounded display opening as a native scroll region with no autoplay,
keyboard access, optional pointer drag and natural wheel boundary chaining. Lira
reuses the source-coordinate light layers/curve for a 1.6s automatic illumination
and keyboard/click replay; replay replaces the current tween and holds the final
light. Tools reuses the approved contextual popover in the browser top layer,
with hover/focus previews and click-pinned selection. Its optional accordion mode
preserves pinned details until selection/dismissal and prevents Escape focus-return
from reopening a description. Grid geometry, icon sizes and copy do not change.
The dedicated accordion interaction owner disposes dragging/capture, observers,
listeners, popovers and light playback on selection change or mode/Astro cleanup.
Same-selection resizing does not restart the pendant. Reduced-motion visitors
retain the existing static/Standard fallback and approved contextual descriptions.
Every fresh desktop Animated View activation starts with About selected, synchronously
without an entrance tween; resize/font updates preserve the active selection.
Astro lifecycle initialization is idempotent per mounted root. The bottom Menu
reuses the mobile two-line hamburger/X morph, driven by its actual aria-expanded state.
The homepage resolves the existing media/history/hash mode in the head, then
draws the initial About-first pose synchronously after the markup while the
module bundle loads. `homepage-accordion-presentation.ts` supplies identical
geometry to this inline startup and GSAP; ownership transfers without resetting
the shell flag. No hiding guard, timer or loading transition is used. Ineligible
screens and no-JavaScript visits retain the unenhanced document.

`homepage-responsive.css` shares case-study typography and contextual Tools across
all naturally scrolling homepage modes, excluding an active desktop camera. Its
stacked product layout applies below 1200px or on no-hover/coarse-pointer devices. The existing tablet profile grid is unchanged. Below 600px the existing
portrait occupies the first grid row, followed by name, designation, disciplines,
description and education. No profile copy, assets or typography values change.

HEIR and Lira share the same section rule, eyebrow, company label, statement-scale
title, description measure and text-to-product spacing in normal vertical flow.
Lira's SELECTED IMPACT identifier and work-in-progress message are visible; its
existing square source canvas, theme images, diffuser and layered light are reused.
How I Work retains its static numbered rows and separators.

`homepage-products.ts` owns the three product interaction modes separately from
the unchanged cinematic camera. Touch/smaller-screen products use the same
one-time IntersectionObserver helper: threshold 0,
with the root's bottom inset by 35% of the current viewport **height in pixels**.
Thus the product's top entering approximately 65% of the viewport starts a complete
GSAP animation without requiring a percentage of a tall phone to fit on screen.
Pending observers update their activation region on resize and disconnect on entry.
HEIR animates the screen opening's actual native `scrollTop` over 1.8s with
power2.inOut easing; it never translates the screenshot in touch mode. The clipped
screen is a named, keyboard-focusable scroll region from initialization. After
autoplay, visitors can explore it repeatedly with native scrolling. Pointer-down,
wheel or scrolling keys cancel any remaining autoplay immediately, without
preventing default input. Native boundary chaining remains enabled; the page is
never scroll-locked. A per-page fraction preserves manual position across size
and mode changes. Rotation during autoplay hands control to native scrolling at
the current fraction; autoplay does not restart on re-entry.

Lira's ring progresses for 1.1s, then its upper indicator completes over .3s (1.4s
total), retaining approved colors and theme-specific glow strengths. After initial
autoplay it stays lit. A native button over the pendant body, labeled “Replay Lira
pendant illumination,” resets the light to its diffuser and replays the sequence.
There is no visible Replay control. Enter/Space and the existing focus tokens
support keyboard use. Additional activations during a running sequence are
ignored, preventing overlapping timelines and repeated resets. The button has
busy state during playback, is hidden outside touch mode, and is not inside a link.

Desktop Standard View uses matching copy-left/product-right compositions for HEIR
and Lira, with the same SELECTED IMPACT label, statement heading, description and
status treatment. Both separators span the complete reading canvas; the old
copy-only Lira rule is suppressed. A shared visual envelope in
`homepage-products.css` uses `--standard-visual-height` (32rem maximum, adapting to
`100dvh - 12rem`, with a 16rem floor), a .55-width product region and the existing
2–4rem gap. The phone keeps its 1322/2726 aspect ratio. The pendant's 1254-square
canvas is positioned by its actual body inset (285/1254), so transparent margins
do not change column spacing or hardware scale. Standard compositions are centered
and capped at the sum of the existing 31rem text measure, shared gap and product
region (about 52.6rem at full size). A viewport cap reserves the pendant canvas's
right overhang, derived from its body inset, plus existing 16px edge clearance.
Scene overflow stays visible so the original soft shadow is complete; no image
crop, replacement, masking, glow adjustment or animation change is involved.
These constraints remain inside the desktop-only, inactive-camera media scope.

Two independent ScrollTriggers (`standard-heir`, `standard-lira`) pin the whole
section only after its copy, eyebrow and product are comfortably visible. The
resting position centers the actual section with at least 48px top clearance.
Further scroll directly scrubs the measured phone travel or shared
`pendantLightAt()` curve; stopping holds state, and reversing re-pins and reverses.
The HEIR range is .8–1.25 viewport heights (based on actual screenshot travel);
Lira uses .85. Native pin spacing releases into ordinary flow at completion.
No wheel handler or scroll lock is involved. If the rendered section is taller
than the viewport minus 96px, it stays unpinned and scrubs through natural flow.
This preserves readable type in very short windows or with enlarged text.
Resize, composition/image size changes and image loads remeasure/refresh; a fit
change rebuilds the owned triggers. Neither preview exposes touch replay/native
scrolling in this mode. Reduced motion uses static products without pins.

Vertical light/image effects own `--preview-*` figure properties, scoped outside
`data-journey-active`; the camera keeps its existing image transform and SVG light
properties. Mode changes and Astro swaps kill owned tweens/triggers, disconnect
observers, remove native scrolling attributes, reset internal scroll offset and
hide replay. Resize/image loading refresh Standard View measurements. No product
listeners or Standard View triggers remain active during the cinematic mode.
Tools/popovers retain their separate lifecycle and are enabled in Standard View too.

Reduced motion disables all automatic/scrubbed product motion. Touch visitors
retain manual phone exploration and immediate, fully lit pendant feedback without
replay animation. Script-free HTML shows the initial phone dashboard and lit
pendant, without hidden/partly initialized products or an inactive replay button.

Tools keep the existing wrapped 24px-logo/15px-label list, enhanced with native
buttons (44px touch targets). One native `popover="auto"` region shows a selected
article from the existing `homepageTools` data; all eleven descriptions remain
authored only in that shared module. The panel uses existing type/color/spacing,
a quiet border/shadow, a 22rem maximum width and 16px viewport clearance. It chooses
above/below placement, clamps at viewport edges and follows viewport/scroll changes.
Fine-pointer hover previews descriptions; a 180ms dismissal bridge permits moving
from the tool into its panel without flicker. Click selects/toggles, keyboard
focus previews and Enter/Space selects, and outside click/Escape dismisses. Touch
keeps its existing click/focus behavior. No swarm is mounted in Standard View.
Touch/click, keyboard focus, Enter/Space, outside tapping and Escape are supported;
ARIA expanded/described-by state tracks selection. It has no modal backdrop,
focus trap, scroll lock or floating bubble physics. Without Popover API support
or JavaScript, the original readable tool list remains available.

## Cinematic view control and Tools alignment

The homepage's existing upper-right control now reads **Standard View** while
cinematic and **Animated View** while standard. It is available only at the
existing supported desktop media query (at least 1200 × 800, fine pointer and
hover, no reduced motion), subject to the existing content-fit guard. It remains
hidden without JavaScript. It reuses the complete journey initializer and teardown
in both directions rather than creating a second camera or navigation system.
Returning explicitly starts at scroll zero/opening and clears any static anchor
and saved camera progress. Focus stays on the same native button. The selected
standard mode remains in the current history entry for route/back navigation.

The Tools information panel aligns to the bubble field's top; the invitation has
no extra top margin. The existing fixed 22rem panel, divider, 32px text gutter and
information transition remain intact. Selection changes content inside that
stable region. Bubble dimensions, positions, physics and descriptions are unchanged.

## Shared layout

The desktop shell has a 14rem fixed left navigation and a 13rem reserved right TOC
column. The TOC uses the adjacent page gutter and the same fluid outer padding as
the shell, giving long titles room to wrap without crowding the viewport edge.
The reading region uses fluid padding and a bounded canvas. Only the central
reading canvas participates in horizontal movement. The homepage has no TOC
content and uses the same document shell; its editorial canvas is wider as described
below. Case-study/research reading alignment remains unchanged.

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
Ganance defaults to expanded; its Product Gallery and Lira default to collapsed.
Active-page ancestors reopen even when a prior session choice collapsed them.
Unpublished leaves use `aria-disabled="true"` and a mix of 25% `--color-muted`
with `--color-on-surface-variant`, retaining readable contrast without badges.

### Navigation and TOC conventions

Navigation hierarchy uses `--navigation-indent`, compact row spacing, and weight/
type differences. Nested groups have no connector lines. The active page uses a
semibold label and a quiet tinted surface, without a dot. Chevron alignment
is shared at each nesting level. Desktop rows are 40px; mobile rows are at least
44px. The approved hierarchy remains in `src/data/navigation.ts`.

The identity pairs the existing name typography with a decorative 24px personal
mark and `--space-2` gap, without increasing header height. Supplied transparent
48px PNGs render black on light and white on dark; no SVG variant was available.
Theme-aware 32px PNG favicons and 192px touch icons follow the same preference,
including System changes and Astro swaps. `/favicon.ico` is a legacy fallback.
Resume carries a 16px external-window icon and opens `/resume.pdf` in a new tab
when the PDF exists at build time; otherwise it remains disabled text. Its PDF
uses normal browser viewing/downloading, and editable résumé sources stay private.

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

## Homepage editorial composition

The homepage uses a scoped maximum 76rem canvas without reserving the empty TOC
column. `homepage.css` owns its fluid 44–80px headline, 32–56px statements, and
80–144px section rhythm, while consuming the established Source Sans 3, semantic
colors, border roles, and spacing/motion tokens. These values do not change reading
pages. The name is the sole h1; designation, full professional disciplines,
and the approved personal description follow it. No duplicate title or
document-style Next footer is shown.

The approved ivy-wall portrait remains vertically centered beside the hero copy
on desktop/tablet, then follows the copy at 80% width with equal side margins on
phones. Its 4:5 object-fit crop and 50% / 40% position remain unchanged. Ganance
has the primary image/text composition and internal project links; Lira remains
an informational text-only feature with a 42rem maximum measure: company label,
title, then description, without an empty thumbnail column. Section eyebrows use
13px semibold tracked muted text; company labels use 15px semibold untracked ink;
discipline metadata uses 12px tracked muted text (11px on phones). Existing title,
statement, body, and supporting-copy scales remain intact.
Numbered capabilities form ordered rows with semantic
rules rather than cards. On smaller screens descriptions move below their stage
heading, preserving source order. Tools use 24px decorative SVG boxes, readable
15px labels, and responsive wrapping. BigQuery uses Google's official product SVG;
Claude uses the symbol path from its official website, inheriting theme ink.
The former standalone closing About section is removed; experience and education
now live in the opening profile.

Native Web Animations use the existing 400ms entrance duration/easing with modest
70–90ms staggering. IntersectionObserver reveals elements once on entry; the stage
nearest 52% of viewport height receives subtle emphasis via an animation-frame
scroll update. All copy remains readable before JavaScript, no reading scroll is
pinned/snapped, and the header/navigation remain stationary. Reduced motion removes
entrances, stage tracking, hover movement, and transitions. Focus and Astro swaps
cancel running entrances; listeners/observers are disposed between pages.

### Consolidated opening profile

`HomepageIntroduction.astro` owns the one live introductory section used by both
static HTML and the existing MacBook plane. Its content follows the updated
read-only `Website portfolio/Homepage/homepage.docx` verbatim: Rahul Singh,
Chicago-based Sr. Product Designer, the full Product Research · Product Design ·
Product Analytics line, the source description, and the single M.S. qualification.
No M.S. suffix is attached to the name. The optional university logo is omitted;
education remains a quiet text treatment.

The opening is one horizontal visual region: a left text column and the approved
portrait on the right. Name, designation, full disciplines, personal description,
and education appear in that order inside `homepage-hero-copy`. The former
professional experience list, all connector/node styles, separate background
columns, and horizontal divider are removed. Education uses the existing label
and body styles with 32px of space after the description and an 8px label gap;
there is no card or separate education column.

The desktop grid uses a 1.5:1 split with the existing 4rem gutter. A larger portrait
balances the complete left column, centered vertically. The image asset, 4:5 crop
and 50% / 40% position are unchanged. The existing tablet/phone grid breakpoints
still supply normal-flow fallback and the approved portrait follows the text on
phones. No new responsive animation is introduced.

No new typography tokens are introduced. The existing homepage title scale
anchors the name; `type-heading-2` supports designation, `type-body` the disciplines
and education, `type-lead` the description, and the existing label style the
education heading. Existing weights, semantic colors,
tracking, line heights, and spacing tokens supply the hierarchy.

Within the desktop live plane the complete profile centers in its existing
height budget. Camera math, uniform scaling, common screen center, resting laptop
size, and travel/scroll distances are unchanged. `homepage-headline` remains the
Skip focus target. The later `a-little-about-me` section had no incoming source
anchors and is removed; the introductory About Me station and global About route
remain. The obsolete 8rem trailing padding is removed. Since Select Tools now
ends the page, its existing loop stays available in the visible final scene at
the master endpoint; its controller, physics, panel and selection are unchanged.
Static and reduced-motion layouts render the same profile content in normal flow;
education stays within the left text column rather than a separate background grid.

## Experimental desktop homepage scene system

On `experiment/homepage-scroll-animation`, `HomepageJourney` preserves the live
hero-to-MacBook pullback and one reversible master ScrollTrigger. This desktop
experiment overrides only the ordinary homepage motion described above. Static,
reduced-motion, and ordinary reading-page layouts retain their existing rules.

Every scene uses three separate vertical regions: content stage, timeline band,
and navigation layer. The homepage-scoped `--journey-*` variables in
`homepage-journey.css` define their geometry:

- `stage-top`, `content-height`, and `stage-gap` define one content region and the
  whitespace below it. Both project and introduction use these same boundaries.
- `device-max-height` uses that content budget minus heading/caption allowances,
  bounded by the scene width at the MacBook's aspect ratio. The phone keeps this
  allowance. The larger laptop targets 70vw, capped by the full content-stage
  height (it has no external heading/caption). Both retain original aspect ratios;
  neither can invade the timeline band.
- `composition-width`, `text-measure`, and `composition-gap` center the combined
  HEIR copy and phone. The phone has no independent viewport-centering rule.
- `timeline-top` begins below the content region and stage gap; `timeline-band`
  reserves room for the single connecting thread, nodes, and labels. The line
  never runs through a device, caption, heading, or project description.
- `navigation-band` reserves the stationary compact Menu control. Skip Animation
  is a separate quiet control at the upper right, outside the dock.

The common scene pitch is `(viewport width + exhibit width) / 2 + station gap`.
The exhibit envelope is the wider of the proportional laptop and the combined
project composition. Every scene's indexed position uses the same pitch, and the
controller measures those CSS positions for camera destinations. This lets the
next exhibit enter shortly after the current one starts departing, with visible
content from both during transitions and no full-viewport empty gap. Use this
same layout rule for future scenes rather than adding per-project translations.

One continuous spatial thread starts at the first scene center and ends at the
last; nodes align exactly with their scene centers. Its accent fill uses actual
master-timeline camera displacement. Upcoming nodes remain hollow until arrival;
reached nodes fill, completed nodes remain filled, and the current station has an
accent label. Reverse scrolling reverses these states. This is the sole progress
indicator: no progress strip or destination list appears in the Menu dock.
Native buttons navigate to implemented timeline labels and support keyboard use.
The Introduction node targets the established MacBook shot; scrolling further
upward restores the full live hero.

The desktop homepage Menu toggles the original real navigation as a rounded left
drawer with a restrained horizontal slide. A mostly opaque semantic surface tint,
backdrop blur, soft outline, highlight, and gentle shadow approximate Apple's
regular glass principles for navigation, prioritizing legibility. No glass is
applied to project content or stacked inside the drawer. Light/dark themes retain
their semantic colors; increased contrast/reduced transparency uses a solid surface.
See [Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
and [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/).

Only Menu, Escape, actual navigation, or lifecycle teardown closes the drawer;
background clicks do not dismiss it or exit the experience. Keyboard focus stays
within the open drawer and Menu, then returns to Menu on dismissal. Ordinary
focus/clicks never bypass cinematic mode. Keyboard focus on a scene link/node
outside the camera reveals that scene in place. Only the explicit Skip controls
or deliberate hash navigation restore static mode. The shared case-study,
research, and gallery navigation is unchanged.

### Reusable camera choreography

`src/lib/homepage-scenes.ts` is the scene registry and scroll-budget model. Its
ordered entries generate the slots/stations and the master camera plan:
Introduction → HEIR → Lira → How I Work. The authored expertise section appears
once, in the fourth slot; three readable columns preserve its existing wording.
Tools and About remain ordinary vertical content after the master pin releases.
No card stack or tarot/fan interaction is implemented. Lira uses the supplied
pendant and the scroll-driven lighting interaction described below.

Each entry defines travel/focus poses (`scale`, `x`, `y`, `frame`), distances for
approach/focus/interaction/pullback/departure, and an optional interaction key.
Distances are functions of viewport dimensions and measured content travel, in
CSS scroll pixels. `x/y` are viewport fractions; `frame` blends from the full
viewport to a measured content aperture. One GSAP clock drives this plan through
the existing master ScrollTrigger, with 0.45-second scrub smoothing. Refresh
recomputes distances, positions, and normalized station labels in place. No scene
owns another pin, timer, or independently advancing animation.

Departure plus the next approach share one power2.inOut horizontal move and one
continuous pose interpolation. Their timing boundary cannot introduce a stop or
velocity jump. Focus and pullback use the same restrained easing without bounce
or overshoot. Interaction progress is linear and remains completely reversible.
The camera rig transforms the combined scene; the phone is never centered alone.

Starting parameters (`H` = viewport height):

| Parameter | Initial value |
| --- | --- |
| Travel scale / offset | 1.00 / x=0, y=0 |
| HEIR focus scale | 1.05 |
| Lira / How I Work focus scale | 1.04 |
| Each focus / pullback | 0.12H / 0.12H |
| Outgoing departure + incoming approach | 0.30H + 0.50H |
| HEIR exploration | max(1.40H, screenshot travel × 1.60) |
| Lira lighting / How I Work reading | 1.20H / 1.10H |
| Opening pullback scroll | 0.66H (45% shorter than the prior approximate 1.20H budget) |
| Established opening / final hold | 0.12H / 0.15H |

The MacBook's physical endpoint is `min(70vw, content-height × 3880/2400)`.
The shared content-stage height takes priority over the requested 70% width.
This is an earlier, larger stopping point, not a 45% reduction of asset size.
The 45% parameter controls the opening scroll budget; physical pullback reduction
varies with viewport constraints and is not guaranteed to be 45%. The live hero
and frame still share the exact screen-center mapping. The timeline reveals only
after this endpoint; no additional laptop shrinking occurs during its reveal or
horizontal departure. Introduction navigation targets the established visible-thread
shot, rather than the start of the thread reveal.

Focus re-frames the complete world with an animated aperture around the scaled
content-stage bounds, leaving half the shared stage gap above and below. These
bounds follow the lens scale and vertical offset so tall displays cannot crop
headings or captions. The lens origin is the shared content-stage center. The spatial thread moves beyond this
visible frame, while its opacity remains 1; pullback reverses both lens and
aperture to reveal it again. Menu and Skip remain outside the camera/aperture.
Keyboard focus on a clipped station restores that station's traveling shot.
Screenshot travel uses untransformed layout dimensions, preserving exact bottom
alignment at every lens scale. Native homepage entrances/stage emphasis skip all
camera-owned scenes. Cold initialization waits for local fonts before its fit
check; static content remains readable while they load. Context teardown clears
all new transforms/framing attributes before Astro swaps or explicit Skip.

### Project presentation and Lira illumination

HEIR and Lira share `.journey-project`, `.journey-project-composition`, and
`.journey-project-copy`. Both use the existing SELECTED IMPACT eyebrow,
`homepage-project-label` identifier, `--homepage-statement` heading scale,
Source Sans 3 semibold, 1.12 heading line height, and common description/spacing
rules. This supersedes Lira's smaller legacy static heading only in cinematic
mode. Each scene has one eyebrow; timeline names are About Me, Work at Ganance,
Work at Lira, and How I Work, with the original internal scene IDs unchanged.
The Lira status is plain secondary text: “Case study coming soon · Work in
progress”; its heading stays unlinked. The HEIR homepage viewer link/caption is
removed; the phone screenshot, frame, scrolling, and all reading-page viewers are
unchanged. Keep the existing device-height budget, including its reserved space,
rather than enlarging the phone to consume the removed caption allowance.

The shared composition centers the whole copy/device pair. The phone keeps its
existing width. Lira's square artwork retains its existing size, capped by
`device-max-height` and the exhibit envelope minus 25rem and the shared gap.
Its grid track measures the visible body (source x285–969 of 1254), rather than
the transparent square. The inner artwork offsets that transparent inset without
cropping the canvas or shadow. Both projects therefore use the same 31rem copy
measure and optical copy-to-device gap, despite their different source padding.
Neither the station pitch nor the timeline geometry changes. The project grid's
minimum height keeps the eyebrows and device regions aligned despite the two
source aspect ratios. Static/no-JavaScript/reduced-motion presentations retain
the earlier text-only Lira block; the new pendant, eyebrow, status, and cinematic
styles activate only with the existing desktop enhancement. No smaller-screen
animation variants are introduced.

`LiraPendant.astro` imports the supplied standard and dark-optimized 1254 × 1254
transparent WebPs, copied byte-for-byte to `src/assets/homepage/lira/`. CSS selects
the variant using the resolved site theme, including System preference. Astro supplies responsive WebP
renditions; no crop, recoloring, shadow replacement, or filter is applied to the
artwork. An inert, aria-hidden SVG occupies the exact same square canvas. Its
source-coordinate path follows the actual open C-shaped light channel rather
than inventing a closed circle across solid hardware. The upper light matches
the visible vertical capsule. Preserve both these shapes if the asset is replaced;
retrace geometry against that asset rather than guessing a circle.

A permanent SVG diffuser sits behind the original image: a shaded frosted
channel and upper capsule remain visible through the transparent apertures at
zero interaction progress. The animated light stays above the image. Its C path
uses normalized stroke dashes, graded emission, close bloom, wider ambient
diffusion, and a narrow bright core. The upper capsule uses matching diffusion.
Colors derive from existing semantic accent/evidence-surface roles without
altering the prepared artwork or shadow. Light mode uses restrained bloom
(.22 ring, .07 ambient, .35 indicator); dark mode increases it to .42/.16/.62.
The diffuser is permanent material, independent of animation progress or cleanup.

The scene registry assigns Lira the optional `pendant` interaction over 1.20H;
its existing 1.04 focus and 0.12H focus/pullback remain unchanged. The master
GSAP camera clock passes normalized interaction progress to `lira-pendant.ts`:
ring completion at 74%, upper indicator from 78–88%, completed hold over the
final 12%. The pendant has no independent entrance, translation, pin, or timer.
Completed lighting persists through pullback/departure; reverse scrolling
unwinds the indicator and ring in the opposite order. Context teardown removes
all lighting variables for Skip, reduced motion, and Astro navigation.

### How I Work — deck to editorial layout

`WorkDeck.astro` owns the existing expertise content, once: the main statement is
now the semantic h2, with the unchanged EXPERTISE / HOW I WORK identifier above
it and the three original capabilities in an ordered list. Its visual HOW I WORK
cover label and empty card surface are aria-hidden. No temporary duplicate
heading or duplicate capability content is introduced. Assistive technology can
read the authored content throughout; visual concealment is not a reading gate.
Outside the desktop camera enhancement, `display: contents` preserves the earlier
static row structure, spacing, and readable text. No smaller-screen animation is
added; Skip, no JavaScript, reduced motion, and the existing fit guard use that
static presentation.

`work-deck.css` scopes the enhanced appearance to `[data-journey-active]`:
three equal editorial cards, 1.5rem padding/gap, .875rem corners, semantic surface
and outline roles, muted primary numbers, and soft 7% ink depth. The existing
shared stage and 64rem content width remain authoritative. Cards cap at 24rem
height and can shrink to 20rem to accommodate the heading in shorter desktop
windows. The single live h2 retains its final line wrapping while scaling and
moving out of the cover, so its text never swaps or reflows mid-animation.

`createWorkDeckInteraction` in `work-deck.ts` measures untransformed layout boxes
on master refresh and builds one GSAP content transition. It adds no pin,
ScrollTrigger, scroll lock, or event listeners. The scene registry marks
How I Work as `work-deck`, preserving its existing 1.04 focus, .12H focus/pullback,
and 1.10H interaction. `workDeckMotion` exposes these reusable reveal parameters:

- Reveal threshold .08 of the existing interaction window, after the unchanged
  camera focus. Crossing forward plays the entire .72-second transition;
  crossing backward reverses it. Scroll position never sets its playhead.
- Initial 12px layer steps and rotations −3°, +2.5°, −1.5° conceal the card text.
- Cards move directly to zero translation/rotation together with `power3.inOut`;
  there is no intermediate fan or exaggerated rotation.
- The cover surface clears in .14 seconds with a short 12px lift, retaining its
  original dimensions rather than stretching a translucent rectangle across
  the content. Its same live h2 lifts/scales into position over .58 seconds with
  `power3.out`. The visual cover label clears in .10 seconds; the identifier
  appears during .24–.42 seconds, without duplicate accessible text.
- Capability text appears during .24–.46 seconds, after the fast heading lift.

The master clock only detects threshold crossings; GSAP then completes the
transition even when scrolling stops. A target-state guard prevents repeated
renders from restarting it. Rapid recrossings change direction from the current
frame. Cards remain expanded through pullback, finish, and the existing vertical
conclusion. Refresh preserves the current playhead and direction against newly
measured layout dimensions. Teardown kills the transition and restores original
inline styles before fallback or Astro swaps. The stack, final layout, typography,
themes, fallback, and shared camera choreography are unchanged by this refinement.

### Select Tools — bounded bubble field

Select Tools is the fifth scene, immediately after How I Work. The existing
scene factory supplies its .50H approach, 1.04 focus, .12H focus/pullback, and .30H
departure convention; its short .80H exploration window does not gate pointer
interaction or lock scrolling. The existing finish leads into the vertical
conclusion. The earlier node labels, station spacing formula, camera poses, and
content interactions are unchanged. The static tools section moves into the new
slot, so it appears once in fallback and is not repeated after the journey.

`homepage-tools.ts` shares the existing raw SVG imports and all eleven exact
authored descriptions. `HomepageTools` retains the original static logo/label
list. `ToolSwarm.astro` is hidden outside the existing desktop enhancement; within
it, the static list is hidden and the field/panel becomes the sole presentation.
Bubble marks are 46px (panel marks remain 48px). Original SVG fills and geometry
are preserved; a small evidence-surface backing
keeps dark marks readable in dark mode. No assets are downloaded or rewritten.

The stage uses its existing height/64rem width budget. A 1.7:1 grid splits the
available width approximately 63:37 after the 2rem gutter. Circles vary only
slightly (.94–1.04 times the responsive 5.5–6.5rem base size), without denoting
skill or importance. Semantic surfaces, borders, soft 6% ink shadows, teal
selection/focus outlines, and Source Sans 3 preserve the editorial system.
The information panel is fixed at 22rem height, has a restrained left divider,
and uses positioned content to avoid shifts between description lengths.

For eleven bodies, a small equivalent 2D force solver avoids adding D3's general
simulation/dependency lifecycle. `tool-swarm-physics.ts` owns deterministic,
irregular anchors and reusable `swarmMotion` parameters: 1.25 active scale, 12px
physical gap and wall inset, 24px expansion clearance, .003 home spring, .0007
pair attraction toward .86 of anchor separation, .84 velocity damping, 18px
individual drift plus 7px shared drift, and six soft collision passes. The weak
pair attraction keeps the cluster cohesive without fixing bodies to a grid. The
selected body holds its current center while neighbors yield; clearance follows
the visible scale during both expansion and return. Selecting another body
restores the previous body through the same damped simulation. Pairwise work is
bounded to 55 pairs per pass. No 3D system or additional runtime dependency is introduced.

`tool-swarm.ts` measures layout boxes only on master refresh, preserves normalized
positions on desktop resize, and paints transforms from one requestAnimationFrame
loop. Scroll selects the scene, never the bubble positions. The loop stops when
the scene is inactive, the pinned journey has completed, it is outside the viewport, the document is hidden, or the native
drawer makes the stage inert. Intersection/visibility and inert-attribute observers
restart it only when appropriate. Refresh renews visibility observation and uses
the latest queued intersection record, avoiding stale exit states after resizing.
Reset cancels frames/panel animations and clears
selection/transforms; disposal also aborts listeners and disconnects observers for
Astro navigation. Reduced motion and Skip retain the existing static fallback.

Each bubble is a native named button, supporting pointer entry, click, Tab focus,
Enter, and Space. All three selection paths directly engage the physical body;
click does not depend on pointer bookkeeping. The chosen bubble stays enlarged
with its description until another selection or scene exit. Selection uses aria-pressed, controls/describedby relationships,
and a polite atomic information region; only the chosen article is exposed.
The panel starts with “Explore the tools behind my work.” and keeps the last
selection through empty space until another selection or scene exit. Its quick
140ms content change never alters the panel bounds.

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

`ImageRail` is the single approved carousel standard. `DesignRail` supplies the
existing gallery screens; `FigureGroup`, `StatisticalCarousel`, and
`MobileUICarousel` retain their authoring APIs and supply ordered `ResearchFigure`s
to the same rail. All use `image-rail.css` and `design-rail.ts`; the legacy Embla
presentation and runtime are removed. Galleries retain their approved dimensions,
labels, captions, entrance motion, and interactions.

Circular 44px previous/next controls flank a thin continuous position indicator.
Arrows advance 75% of the viewport with native smooth scrolling; touch, trackpad,
and mouse dragging remain fluid without forced snap points. Arrow Left/Right,
Page Up/Down, and Home/End work in the focusable region. There is no autoplay,
loop, or inactive-slide hiding. Boundary controls remain focusable with
`aria-disabled`; controls hide when no overflow exists unless they contain focus.
Reduced motion makes programmatic scrolling immediate and removes control motion.
Resize observation updates boundaries and progress; Astro swaps dispose listeners.
Drag releases use the unchanged viewer click guard. Native scrolling works without
JavaScript; controls remain hidden until enhanced.

Statistical rails allocate the complete available reading width to each chart,
including its existing evidence surface, padding, labels, legends, and caption.
They preserve native proportions without cropping or applying the narrower
product-screen sizing. Partial chart visibility occurs during fluid scrolling; at the
start/end the complete figure fits. Mobile UI compositions preserve their source
aspect ratios and use `--figure-ui-height` and available-width sizing, exposing
neighboring screens where appropriate. Precomposed pairs remain one image.
Captions retain their existing typography, stage titles, and full descriptions.
No changes to page widths, global padding, source assets, or the viewer are needed.

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

### Supporting research pages

Research pages use the same shell and reading measure. Optional `researchContext`
frontmatter adds `ResearchContext` above h1: a wrapping breadcrumb in small,
secondary text, followed by an inline arrow return link. Work at Ganance is plain
text; Case study links to `/heir/`; the return targets the originating section:
`/heir/#first-launch`, `/heir/#haptic-roadmap`, or `/heir/#activity-guidance`.
Native Astro routing and normal browser history apply to these links.

Source research questions retain their numbering and wording as h2 headings;
Method note remains h3. Research TOCs include h3 entries with the existing
navigation-indent token. Other page TOC selection stays unchanged.
`ResearchTable` uses body-family/navigation-size text, semibold column headers,
semantic row dividers, tabular/right-aligned numeric cells, and native captions.
Its 36rem minimum table width preserves columns; overflow is confined to a
labeled, keyboard-focusable region on narrow screens. Charts use the existing
StatisticalPlot frame and full-resolution viewer. No Quarto theme, runtime,
embedded report document, or R code is published.

### Continuous design galleries

`DesignGallery.astro` supplies the same chapter/story/rail composition for Phase
One (six chapters, 23 stories, 59 screens) and Face Scan. Phase One uses build-time
Markdown solely to preserve authored prose emphasis; Face Scan keeps plain text.
Both reuse the same existing styles, rails, motion, and original-image viewer.
Gallery pagination uses the existing Previous/Next treatment: Phase One returns
to the first-launch case-study section and continues to Face Scan; Face Scan
links back to Phase One.

The approved Face Scan Gallery contains six chapters and 28 stories, preserving
60 HEIR screens. The revised gallery excludes external reference images and metadata.

The Face Scan Gallery shares the stationary shell, theme, contextual TOC, and
reading-canvas transitions. Its optional `gallery` layout flag permits a scoped
70rem maximum exhibition canvas; prose keeps the 43rem reading measure. Chapter
numbers, semantic top rules, and generous story spacing organize the six chapters.
Story titles use the existing h3 scale, with exact explanatory copy beneath.

`GalleryImage` preserves native image proportions and individual centered captions.
Each story allocates the full available width to its design rail without reference
frames, attribution labels, or placeholder space. Explicit image ratios reserve
lazy-loading space. The existing visual tokens and screen presentation remain unchanged.

`DesignRail` uses native horizontal overflow, never forced snap points. Screen
width is capped at 17rem and constrained to 82% of available rail width, exposing
adjacent partial screens on phones without shrinking them into unreadable columns.
The visible count follows available width. Captions travel with their screen.
Opposite-end 44px arrows scroll 75% of the viewport; a quiet rule indicates
position. Controls only appear when overflow exists and remain focusable with
aria-disabled boundary states. Native trackpad/touch scrolling, mouse dragging,
Arrow Left/Right, Page Up/Down, and Home/End are supported. All images remain
accessible; scrolling does not make neighboring screens inert. No autoplay or loop.

Gallery images reuse the existing full-screen viewer with untouched PNG originals;
Astro supplies responsive quality-95 WebP inline delivery. Drag/swipe releases
use the existing click guard, while normal clicks and keyboard activation enlarge.
`gallery-motion.ts` uses the 400ms section tokens for vertical entrances. Content is visible without JavaScript. Focus, anchor navigation, reduced
motion, and Astro swaps cancel motion; page scrolling remains native. All case-study carousels use the same rail controls and scrolling runtime.

## Publication and checks

About, HEIR, all five linked Quarto research reports, and both HEIR galleries are content routes;
404 uses the same layout. HEIR contains
the entire source narrative, five projects, and “Where HEIR stands now.” The TOC
selects those six major sections. Other supporting Word documents and gallery destinations
remain outside the current migration scope. Resume is a separate-tab static PDF,
not a content route.

The original archive and raw research stay outside the site. Only selected image
copies enter `src/assets/`. All 13 IDs and original destination relationships are
retained. Pending internal targets remain unpublished; the external demo URL is
unchanged. See `heir-asset-audit.md` for original-asset decisions and ambiguities.

Run `npm run check`, `npm run build`, `npm run verify:source`, and
`npm run verify:research`. Then inspect
actual desktop/mobile pages and test interactions; a successful build does not
constitute visual approval.

### Case-study app comparison

`AppComparison` reuses two independent `DesignRail`s within the unchanged reading
canvas. Old app is left and Redesigned app right from 700px; below that they stack
in the same order. Separation uses `--space-8`. Each screen retains the gallery
caption, optimized image, original-image viewer, scroll controls, and motion.
`DesignRail` accepts an optional display `heading`, defaulting to the existing
“HEIR designs”; comparison labels are paragraphs, not TOC headings.
The reusable `.image-rail-composition` uses equal-height CSS Grid columns above 700px
with flex-column rails and bottom-anchored controls. Content determines their height, so full
captions wrap naturally and both bottom controls align without caption heights
or filler. Below 700px each stacked rail resumes its natural height.

## Width-and-height-aware refinement — October 19, 2026

Adapt visual ceilings before typography. Standard desktop product geometry and
the non-cinematic portrait use available dynamic viewport height while preserving
native aspect ratios. Body type and long-form reading widths remain unchanged.
The existing cinematic eligibility (1200px width, 800px height, fine pointer,
no reduced motion), actual-content fit guard, height budgets and refresh lifecycle
remain authoritative; no camera phases, timings or timeline geometry change.
`html[data-home-camera]` visually hides the document scrollbar using
`scrollbar-width` and the WebKit scrollbar pseudo-element. The normal scrollbar
gutter is measured before activation and reserved on the body; full-bleed camera
geometry continues using the existing viewport dimensions. Removing the flag
restores normal scrollbars. No document overflow lock is added.

The shared desktop UI-figure ceiling is now `min(32rem, max(20rem, 75dvh))`.
Gallery phone widths derive from this height and the existing phone aspect ratio;
reference ceilings retain their existing 24/20rem limits and also respect 75dvh.
Rails, captions and reading pages still have natural height and native scrolling.
The existing dynamic-height image viewer retains Fit/100%; its toolbar can wrap,
and a long caption can scroll within 25dvh rather than consuming the image region.
Fixed navigation and TOCs already provide viewport-bounded native overflow; their
structure, spacing and controls are retained.

These visual height ceilings apply only to fine-pointer desktop layouts. Short
mobile landscape and coarse-pointer screens keep natural stacked, potentially
multi-viewport content, readable body type and existing touch targets. They never
receive desktop product pins or the cinematic camera. HEIR's one-time autoplay
and native internal scroll, Lira's one-time light/replay and static deck remain
unchanged. Do not force reading pages or touch scenes into a single viewport.
