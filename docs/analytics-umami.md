# Umami Analytics — Implementation & Maintenance

**Project:** Rahul Singh's UX portfolio · **Repository:** `uxrahul/portfolio`\
**Live site:** [uxrahul.github.io/portfolio/](https://uxrahul.github.io/portfolio/)\
**Branch:** `feature/umami-analytics` · **Documented:** October 26, 2026

The implementation is the technical source of truth. Dashboard observations below
come from the user-supplied analytics handoff; account settings and screenshots
were not independently re-inspected during this documentation pass.

## 1. Purpose

Provide free-tier, lightweight, privacy-conscious tracking of website traffic and
meaningful portfolio engagement. Use aggregate behavior to improve the portfolio,
not to identify visitors or treat a click as proof of professional interest.

## 2. Architecture

| Element | Current implementation |
| --- | --- |
| Framework and hosting | Astro static build on GitHub Pages |
| Analytics | Umami Cloud; account website name reported as “Rahul's portfolio website” |
| Production hostname | `uxrahul.github.io` |
| Site base path | `/portfolio/` |
| Tracker | `https://cloud.umami.is/script.js` |
| Website ID | `c3a77bc9-8173-47ac-9b11-9aab74c75c88` — public client identifier, not a credential |
| Loading | Shared HTML head; `import.meta.env.PROD`, `defer`, `data-domains="uxrahul.github.io"` |
| Page views | `data-auto-track="false"`; one unnamed `window.umami.track()` call per `astro:page-load` |
| Custom events | `window.umami.track(eventName, properties)` through the guarded helper |

Astro deduplicates the shared scripts across client navigation; no
`data-astro-rerun` is used for analytics. The page-view bridge handles initial,
forward and back navigation, retaining a pending page view if the tracker is still
loading. Development omits the tracker; production previews on localhost contain
it but the hostname restriction suppresses tracking.

| Source | Responsibility |
| --- | --- |
| [PortfolioLayout.astro](../src/layouts/PortfolioLayout.astro) | Tracker, page-view bridge and custom-link binding |
| [portfolio-analytics.ts](../src/lib/portfolio-analytics.ts) | Typed event API, failure isolation, link delegation and product deduplication |
| [heir-analytics.ts](../src/lib/heir-analytics.ts) | HEIR-only semantic discovery, viewport/activity sampling, TOC/resource delegation and lifecycle cleanup |
| [heir-engagement.ts](../src/lib/heir-engagement.ts) | Pure visit state, dwell qualification, duration segments and depth/end deduplication |
| [homepage-accordion.ts](../src/lib/homepage-accordion.ts) | Accepted panel opens and view switches |
| [homepage-accordion-interactions.ts](../src/lib/homepage-accordion-interactions.ts) | Interactive accordion phone scrolling and pendant replay |
| [homepage-responsive.ts](../src/lib/homepage-responsive.ts) | Clicked tool descriptions in all supported homepage modes |
| [homepage-products.ts](../src/lib/homepage-products.ts) | Interactive phone/replay actions in the touch presentation |
| [deploy.yml](../.github/workflows/deploy.yml) | Production build and GitHub Pages publication |

## 3. Standard metrics

These are Umami report metrics, not additional custom properties or individually
verified dashboard widgets. See [Umami metric definitions](https://docs.umami.is/docs/metric-definitions).

| Category | Metrics and use |
| --- | --- |
| Traffic | Visitors, visits, page views and popular pages |
| Engagement | Visit duration and bounce rate; interpret alongside interaction events |
| Acquisition | Referrers and traffic sources |
| Location | Approximate country, region and city; not precise visitor location |
| Technology | Devices, browsers and operating systems |
| Patterns | Traffic trends by date/time and recurring activity peaks |

## 4. Custom event taxonomy

| Event | Actual properties and values | Trigger and purpose |
| --- | --- | --- |
| `panel_open` | `panel`: `about`, `heir`, `lira`, `how_i_work`, `tools` | Accepted user activation of a different Animated View panel. Measures intentional exploration; default About expansion and clicking the already-active panel are excluded. |
| `view_switch` | `view`: `animated` or `standard` | A user activates the view toggle and the mode actually changes. Records the destination mode, not automatic responsive changes. |
| `case_study_open` | `case_study`: `heir` | A primary/keyboard or middle-click activates a same-origin HEIR case-study link, without a fragment. Measures link interest, not successful reading; galleries, research routes and the unpublished Lira case study are excluded. |
| `resume_click` | `action`: `open` or `download` | Activation of a same-origin `/portfolio/resume.pdf` link, including its version query. `download` requires a link with the `download` attribute; current navigation opens the PDF in a new tab and records `open`. |
| `tool_select` | `tool`: approved tool label | A user clicks to select a description. Hover/focus previews, closing, and repeating an already-chosen open selection are excluded. |
| `product_interaction` | `product: heir, action: scroll` or `product: lira, action: replay` | First meaningful HEIR internal scroll or accepted manual Lira replay per product per homepage visit. Distinguishes active exploration from autoplay, illumination on expansion and ordinary page scrolling. |

Tool values are `Figma`, `R`, `SQL`, `Mixpanel`, `Datadog`, `Firebase`, `BigQuery`,
`React`, `Qualtrics`, `ChatGPT` and `Claude`, from the existing
[tool data](../src/data/homepage-tools.ts). They are labels, not user-entered text.

HEIR requires trusted wheel, scroll-key or drag input followed by at least 8px of
internal movement. Product deduplication uses a `WeakSet` of DOM nodes: panel
reopening and view switching retain the limit; an Astro return with fresh homepage
nodes starts a new visit for this purpose, independent of Umami's session definition.

## 5. Tracking rules

- For the six action events above, record trusted, accepted user actions only; never initialization, restoration,
  default expansion, automatic motion, hover previews or synthetic clicks.
- Keep one script/page-view owner and one delegated link binding. Product scrolling
  is not a continuous event stream; native popover light-dismiss must not duplicate
  a tool selection.
- Send only authored identifiers and action names. Do not add personal information,
  form values, visitor IDs or `umami.identify()` calls.
- Custom tracking is fire-and-forget. Missing, throwing or rejecting Umami calls
  must not change navigation, focus, scrolling or animation behavior.

The tracker also sends its normal page URL, referrer and device metadata; keep
personal data out of URLs. Use the existing helper and
[Umami tracker API](https://docs.umami.is/docs/tracker-functions), not a second tracker.
The HEIR observations in section 11 use foreground viewport/dwell qualification;
they do not change the trusted-input rules for action events.

## 6. Integration history

| Release | Implementation and deployment evidence |
| --- | --- |
| [7d2dce3](https://github.com/uxrahul/portfolio/commit/7d2dce362722616fb431df2b8c6c426e4a4a81b4) | Added the production-restricted shared-head tracker and Astro page-view bridge; [Pages run succeeded](https://github.com/uxrahul/portfolio/actions/runs/40364247147). |
| [9af4ba1](https://github.com/uxrahul/portfolio/commit/9af4ba1dda93cbf2cae1016b90aa361bc7fe21f7) | Added six custom event types without changing the tracker/page-view bridge; [Pages run succeeded](https://github.com/uxrahul/portfolio/actions/runs/40369141008). |

The existing workflow publishes pushes to `feature/umami-analytics`; its build job
also restricts manual dispatch to that branch. It uses Node 24, the Astro build/upload
action and Pages deployment, with `github-pages` concurrency/environment and the
existing `/portfolio/` base. The environment's exact branch restriction was verified
during publication; `main` and the previous v2 branch were not merged or modified.

## 7. Verification

| Evidence | What was verified |
| --- | --- |
| Repository/build and local tests | 79 Astro files with zero diagnostics; 10 built pages/329 internal links; HEIR source fidelity. Recorded native browser actions, default/hover/synthetic exclusions, product deduplication, view switching and Astro route return; tested blocked/failed tracking and localhost exclusion. |
| Published artifacts | One tracker per live content page, nine accessible content routes, 28 homepage assets, unchanged résumé bytes and all six event names in the deployed JS bundles. This verifies installation, not dashboard receipt by itself. |
| Live Umami observations, user-reported | Realtime received a visitor/page views; all six event types appeared after live testing. The supplied handoff reports `panel=heir`, `view=standard`, `case_study=heir`, `action=open`, tools `Figma`/`React`/`Claude`, and `product=heir, action=scroll`. |
| Remaining live evidence gap | `product=lira, action=replay` is implemented and locally tested, but its individual live sample was not separately confirmed in the supplied screenshot-review record. |

No screenshots or dashboard export establish those account observations in this
repository. Test traffic is not representative visitor behavior; verify new live
samples in Realtime and Events/Properties after future releases.

## 8. Dashboard

**Confirmed in the supplied handoff:** a traffic metrics bar (visitors, visits,
views, bounce rate and visit duration) and a visitors/page-views chart. Their
current saved configuration was not independently checked in this pass.

**Recommended, not confirmed configured:** popular pages/case studies, referrers,
approximate locations, device/browser/OS breakdown, peak activity, event trends,
and realtime activity. Review event properties alongside totals.

| Proposed goal | Event/filter | Interpretation |
| --- | --- | --- |
| Case Study Engagement | `case_study_open`; optionally `case_study=heir` | Case-study link activation, not reading completion |
| Résumé Engagement | `resume_click`; optionally split `action=open`/`download` | Résumé link activation, not a completed download or hiring intent |

Goal setup was discussed in the supplied handoff; saved status and dashboard
placement remain unverified. Check the actual saved goals, date range, filters
and conversion denominator before reporting a conversion rate.

## 9. Limitations

- Privacy tools, browser protections and network failures can block collection.
- Custom events have no offline queue or retry. Actions before Umami is ready can
  be dropped; product engagement is marked on the first action even if delivery
  fails, so it is not retried later in that homepage visit.
- The PDF viewer's own download toolbar is outside the portfolio DOM. The event
  measures the portfolio link activation, not PDF viewing or download completion.
- Umami's visit duration is provider-derived and distinct from the local HEIR
  active-time estimate in section 11. Neither measures comprehension or attention;
  there are no recurring heartbeat network events or timers for homepage panels.
- Standard provider metadata is distinct from the project's PII-free custom
  properties; approximate location and visitor counts do not identify a person.

## 10. Maintenance

1. Inspect the source owners above before editing. Reuse `trackPortfolioEvent`,
   extend its typed taxonomy deliberately and update this document; never send
   free text or personal identifiers.
2. Instrument accepted user-action handlers. Preserve trusted-input checks,
   product/selection deduplication, abort cleanup and Astro singleton binding;
   do not add automatic callbacks or another page-view owner.
3. Test locally with an in-memory `window.umami.track` recorder. Cover all six
   actions, keyboard/middle-click, initial/hover/restored states, repeated actions,
   view/route changes and missing/throwing/rejecting tracking. Do not weaken the
   production hostname filter or send synthetic tests to live analytics.
4. Run `npm run check`, `npm run build`, `npm run verify:source`, and
   `git diff --check`. Source verification needs the sibling source archive.
   Inspect built HTML for one tracker and preserved domain restriction.
5. Commit/push/deploy only with authorization. Use the existing production workflow;
   confirm the exact branch/commit and successful Pages run before claiming success.
   Do not merge into `main`; review repository environment restrictions if the
   approved production branch ever changes.
6. Make a real live visit and exercise the intended actions. Check page views and
   named events/properties in Umami; separately confirm Lira replay and any new
   download links. Verify no default/hover/repeated-event inflation, and record
   evidence and any dashboard/goal changes here.

The website ID is safe to publish. Keep account passwords, private API tokens,
share credentials and test recordings containing private information out of Git.

## 11. HEIR case-study engagement

**Implementation:** completed and tested locally; publication uses the existing
`feature/umami-analytics` Pages workflow. Local verification below establishes
payload generation; receipt of the new events in Umami Cloud remains unverified.
The shared layout binds one controller on `/portfolio/heir/` only. Research and
gallery pages retain ordinary page views without HEIR reading observations.
The original tracker, page-view bridge and six action-event definitions are unchanged.

### Discovery and event taxonomy

Sections come from existing article `h2[id]` elements: direct article headings or
the leading heading of a semantic section associated with that heading. Navigation,
aside, footer and figure/gallery-group headings are excluded. Titles use visible
text, existing IDs remain unchanged, and `section_index` is one-based document order.
Future semantic sections are discovered on the next page initialization without
maintaining a section-name list; live DOM insertion after initialization is not observed.

The current article yields seven sections, including “Product milestones during
this work” before the six TOC sections. Its introductory h1 has no anchor ID, so no
artificial introduction section is created. In the table, **section properties**
means `section_title`, `section_id`, and `section_index`.

| Event | Properties | Trigger and deduplication |
| --- | --- | --- |
| `heir_section_view` | Section properties; `entry_method`: `scroll`, `toc`, `deep_link` | The primary visible section stays eligible for at least one second. At most once per section per article visit; transient sections during fast scrolling/jumps are excluded. |
| `heir_section_engagement` | Section properties; `active_seconds`; `duration_bucket`: `2-9s`, `10-29s`, `30-59s`, `60-119s`, `120s+` | A viewed section's active segment ends on section change, pause or lifecycle cleanup. Segments must last at least two seconds; at most three reported segments per section per visit. |
| `heir_toc_click` | Section properties of the resolved target | Trusted primary/keyboard or middle-click on an existing TOC link. Repeated intentional activations count; synthetic clicks and initialization/hash changes alone do not. |
| `heir_scroll_depth` | `depth_percent`: `25`, `50`, `75`, `100`; `entry_method`; `sections_viewed` | Current article-depth band settles for one second, at most once per milestone per visit. Only that destination band counts; skipped bands are never backfilled. |
| `heir_article_end` | `active_seconds`; `toc_used`; `sections_viewed`; `depth_percent: 100`; `entry_method` | Final article region remains visible and eligible for one second, once per visit. This records reaching the end, not reading completion. |
| `heir_resource_click` | Source section properties; `resource_label`; `resource_category`; `destination` | Trusted primary/keyboard or middle-click on substantive article evidence links. Repeated intentional activations count; global navigation, TOC, image-viewer links and same-page anchors are excluded. |

### Timing, viewport and navigation methodology

The reading band spans 15–85% of viewport height. A section needs meaningful
overlap (up to 120px, reduced proportionally for short sections/viewports); selection
normally favors the section crossing the 35% reading line, then greatest overlap.
A visible TOC/deep-link landing takes priority, as does the visible final section
at the article end. Only one primary section accumulates time at once.

Timing uses monotonic elapsed time, with seconds rounded to one decimal. The
document must be visible, focused, recently active and the article unobscured by
an inert menu or open dialog. After 45 seconds without trusted pointer, keyboard,
wheel or touch activity, accrual stops at that cutoff; hidden/blurred gaps do not
count. Focus/visibility return starts a fresh active interval. Article introduction
time contributes to total active time, but has no section-duration event.

Scroll sampling is throttled to 150ms; intersection/resize observers and one local
one-second ticker support dwell and idle qualification while the article is active.
These samples are not analytics calls. Meaningful segments flush on section changes,
blur, hidden state, pagehide and Astro cleanup; there is no unload-only dependency.

Native TOC behavior is preserved. An accepted same-tab TOC activation marks `toc`,
suppresses intermediate sections during smooth scrolling and prefers its visible
target; subsequent genuine scrolling restores `scroll`. Initial hashes and other
identifiable hash navigation use `deep_link`; middle/modifier activation does not
move the current article's landing. Browser restoration without a hash cannot be
distinguished reliably from ordinary `scroll`.

Depth uses the article bounds and lower reading-band edge, excluding navigation,
pagination and footer; 100% requires the article bottom to be visibly reached.
A jump to the end can legitimately emit only 100% with `entry_method: toc` and one
viewed section. Depth describes reached position, not the fraction actually read.
Deduplication is per mounted article visit, independent of Umami sessions: fresh
Astro entry/refresh resets it; BFCache restoration retains the existing visit state.

### Resource classification and privacy

Classification uses actual authored links: HEIR research routes (`research`),
gallery routes (`gallery`), document extensions (`pdf`, `doc`, `docx`, `xls`, `xlsx`,
`ppt`, `pptx`, `csv`, `txt`, `htm`, `html`), other published `data-content-link`
destinations (`analysis`), then external HTTP(S) evidence (`external_analysis`).
Pending content rendered as plain text has no click event. Source section comes
from heading order, not a separate mapping.

Destinations contain only a same-origin pathname or external origin plus pathname;
query strings, fragments and URL credentials are removed. Labels/titles collapse
whitespace, redact email addresses and are capped at 200 characters; email-containing
path segments are also redacted, including percent-encoded emails. Track only public
authored evidence URLs: this is not a general-purpose sanitizer for arbitrary PII
in future pathnames or link text. No visitor identity, form values or personal data
are collected by these custom properties.

### Verification and maintenance

Use an in-memory `window.umami.track` recorder on the local production preview;
do not remove the hostname restriction or send synthetic tests to production.
The checks below concern local payload generation, not receipt in Umami Cloud.

| Check | Result / procedure |
| --- | --- |
| Deterministic regression suite | `node scripts/validate-heir-analytics.mjs`: dynamic future headings, exclusions, fast skips, revisit deduplication, TOC/deep-link attribution, depth/end limits, pauses, exact idle cutoff, duration buckets, segment cap and resource sanitization. |
| Native desktop reading and inactive tab | Ordinary wheel scrolling produced milestone-section index 1 with `entry_method: scroll`; an inactive-tab interval produced no additional events. |
| Native TOC and end | Jumping directly to “Where HEIR stands now” produced index 7 with `entry_method: toc`, 100% only, and `heir_article_end` with `toc_used: true`, `sections_viewed: 1`. Returning to first launch produced index 2 with `entry_method: toc`. |
| Native research navigation | “card sort followed by a first-choice tree test” emitted `resource_category: research`, source `first-launch`/index 2, destination `/portfolio/heir/research/information-architecture/`; normal Astro navigation succeeded. |
| Direct entry and Astro return | Refreshing `#first-launch` emitted `entry_method: deep_link`. Research-to-article navigation preserved page views and `case_study_open`; the fresh visit added one section view, while two intentional TOC activations emitted two clicks without another section view. |
| Controlled responsive browser matrix | Actual HEIR pages in 1366×768, 768×1024 and 390×844 iframes, with focus eligibility overridden for the test. Fast skips were excluded, earlier-section revisits stayed deduplicated, synthetic TOC clicks were ignored, and hash entry emitted `deep_link` with one end event per visit; this was viewport testing, not physical-device testing. |
| Release verification | Run `npm run check`, `npm run build`, `npm run verify:source`, the regression script and `git diff --check`; retain existing portfolio-event/page-view regression coverage. After an authorized deployment, check real page views and all six new event/property samples in Umami Realtime/Events. |

For future browser checks, cover desktop/tablet/mobile viewport sizes, rapid skips,
earlier-section revisits, repeated TOC use, direct hash entry, hidden/blurred/idle
intervals, bottom reach, research navigation, Astro return and blocked tracking.
Confirm no events accumulate on research pages and no duplicate listeners survive
route changes. Compare section IDs/properties with actual headings before interpreting reports.

### Interpretation and delivery limitations

Foreground visibility and recent input estimate opportunity to engage; they cannot
prove reading, attention or understanding. Large uninterrupted reading periods may
be undercounted after the idle cutoff. Sub-two-second segments and segments beyond
the reporting cap are intentionally omitted; total active time to the end still
accrues independently, so summing section events is not equivalent to that total.

Events use the existing safe sender: missing, blocked, throwing or rejecting Umami
never interrupts the article. There is no event queue/retry; qualifying views/depth/end
are marked even if delivery fails. Final duration delivery is best effort and can
be lost on browser termination or network failure. No dashboard reports or goals
for the new HEIR events have been configured or verified in this pass.
