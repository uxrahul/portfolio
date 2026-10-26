import { withBase } from './paths';

type PortfolioEvents = {
  panel_open: { panel: string };
  view_switch: { view: 'animated' | 'standard' };
  case_study_open: { case_study: 'heir' };
  resume_click: { action: 'open' | 'download' };
  tool_select: { tool: string };
  product_interaction: { product: 'heir' | 'lira'; action: 'scroll' | 'replay' };
};
type AnalyticsWindow = Window & { umami?: { track: (name: string, properties: object) => unknown } };

/** Optional, fire-and-forget analytics must never affect the original action.
 * Callers pass only authored identifiers, never URLs, form values or user data. */
export function trackPortfolioEvent<K extends keyof PortfolioEvents>(name: K, properties: PortfolioEvents[K], source: Event) {
  if (!source.isTrusted) return;
  try {
    const tracker = (window as AnalyticsWindow).umami;
    if (typeof tracker?.track === 'function') {
      void Promise.resolve(tracker.track(name, properties)).catch(() => {});
    }
  } catch { /* Blocked/unavailable analytics must not interrupt the website. */ }
}

// DOM lifetime gives one engagement per product per homepage visit, including
// panel reopenings and view switches; Astro returns create fresh product nodes.
const engagedProducts = new WeakSet<HTMLElement>();
export function trackProductOnce(element: HTMLElement, product: 'heir' | 'lira', action: 'scroll' | 'replay', source: Event) {
  if (!source.isTrusted || engagedProducts.has(element)) return;
  engagedProducts.add(element);
  trackPortfolioEvent('product_interaction', { product, action }, source);
}

/** A scroll event alone is insufficient: autoplay/restoration can emit it too.
 * Require trusted input followed by at least eight pixels of actual exploration. */
export function watchPhoneExploration(aperture: HTMLElement, signal: AbortSignal) {
  let intent: { source: Event; top: number } | undefined;
  let pointer: { id: number; y: number; top: number } | undefined;
  let frame = 0;
  const reset = () => { intent = undefined; pointer = undefined; };
  if (engagedProducts.has(aperture)) return reset;
  const check = () => {
    frame = 0;
    if (intent && Math.abs(aperture.scrollTop - intent.top) >= 8) {
      trackProductOnce(aperture, 'heir', 'scroll', intent.source); reset();
    }
  };
  const arm = (source: Event, top = aperture.scrollTop) => {
    if (!source.isTrusted || engagedProducts.has(aperture)) return;
    intent ??= { source, top };
    if (!frame) frame = requestAnimationFrame(check);
  };
  const options = { passive: true, signal };
  aperture.addEventListener('wheel', (event) => { if (event.deltaY) arm(event); }, options);
  aperture.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) arm(event);
  }, { signal });
  aperture.addEventListener('pointerdown', (event) => {
    if (event.isTrusted && event.isPrimary && event.button === 0) pointer = { id: event.pointerId, y: event.clientY, top: aperture.scrollTop };
  }, options);
  aperture.addEventListener('pointermove', (event) => {
    if (pointer?.id === event.pointerId && Math.abs(event.clientY - pointer.y) >= 4) arm(event, pointer.top);
  }, options);
  aperture.addEventListener('scroll', check, options);
  aperture.addEventListener('scrollend', reset, options);
  aperture.addEventListener('pointercancel', reset, options);
  aperture.addEventListener('pointerup', () => { pointer = undefined; }, options);
  window.addEventListener('resize', reset, options);
  window.addEventListener('blur', reset, options);
  signal.addEventListener('abort', () => { cancelAnimationFrame(frame); reset(); }, { once: true });
  return reset;
}

let bound = false;
const lifecycle = new AbortController();
export function bindPortfolioAnalytics() {
  if (bound) return;
  bound = true;
  // Delegation survives Astro swaps; capture observes the original link before
  // menus close, without preventing navigation or introducing per-page listeners.
  const onLink = (event: MouseEvent) => {
    if (!event.isTrusted || (event.type === 'click' ? event.button !== 0 : event.button !== 1)) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === withBase('/resume.pdf')) {
      trackPortfolioEvent('resume_click', { action: anchor.hasAttribute('download') ? 'download' : 'open' }, event);
    } else if (url.pathname.replace(/\/$/, '') === withBase('/heir/').replace(/\/$/, '') && !url.hash) {
      trackPortfolioEvent('case_study_open', { case_study: 'heir' }, event);
    }
  };
  document.addEventListener('click', onLink, { capture: true, signal: lifecycle.signal });
  document.addEventListener('auxclick', onLink, { capture: true, signal: lifecycle.signal });
  if (import.meta.hot) import.meta.hot.dispose(() => { lifecycle.abort(); bound = false; });
}
