import { withoutBase } from './paths';
import { trackHeirObservation, trackPortfolioEvent } from './portfolio-analytics';
import { HeirVisit, IDLE_MS, choosePrimary, type EntryMethod, type SectionInfo } from './heir-engagement';

type Section = SectionInfo & { heading: HTMLElement };
const cleanText = (value: string) => value.replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[redacted]').trim().slice(0, 200);

export function discoverHeirSections(article: HTMLElement): Section[] {
  return [...article.querySelectorAll<HTMLElement>('h2[id]')].filter((heading) => {
    if (heading.closest('nav, aside, footer, figure, .figure-group')) return false;
    const section = heading.closest('section');
    return heading.parentElement === article || Boolean(section && section.querySelector('h2') === heading
      && (section.parentElement === article || section.getAttribute('aria-labelledby')?.split(/\s+/).includes(heading.id)));
  }).map((heading, index) => ({ heading, section_title: cleanText(heading.textContent ?? ''), section_id: heading.id, section_index: index + 1 }));
}

/** Only substantive, authored article links; never query/hash/credential data. */
export function researchResource(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href, location.href);
  if (!['http:', 'https:'].includes(url.protocol) || anchor.hasAttribute('data-image-viewer')
    || (url.origin === location.origin && url.pathname === location.pathname)) return;
  const path = withoutBase(url.pathname);
  const extension = url.pathname.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase();
  const category = path.startsWith('/heir/research/') ? 'research'
    : path.startsWith('/heir/gallery/') ? 'gallery'
    : extension && /^(pdf|docx?|xlsx?|pptx?|csv|txt|html?)$/.test(extension) ? extension
    : anchor.hasAttribute('data-content-link') ? 'analysis'
    : url.origin !== location.origin ? 'external_analysis' : undefined;
  if (!category) return;
  const pathname = url.pathname.split('/').map((part) => {
    try { return cleanText(decodeURIComponent(part)).includes('[redacted]') ? '[redacted]' : part; } catch { return part; }
  }).join('/');
  return { resource_label: cleanText(anchor.getAttribute('aria-label') || anchor.textContent || ''), resource_category: category,
    destination: cleanText(url.origin === location.origin ? pathname : url.origin + pathname) };
}

let cleanup: (() => void) | undefined;
let mounted: HTMLElement | undefined;
let bound = false;
const lifecycle = new AbortController();

function initializeHeirAnalytics() {
  const article = withoutBase(location.pathname).replace(/\/$/, '') === '/heir'
    ? document.querySelector<HTMLElement>('#reading-canvas > article.editorial') : null;
  if (article && article === mounted) return;
  cleanup?.(); cleanup = undefined;
  if (!article) return;
  const sections = discoverHeirSections(article);
  if (!sections.length) return;
  mounted = article;
  const events = new AbortController();
  const visit = new HeirVisit(trackHeirObservation);
  let disposed = false, frame = 0, lastSample = 0;
  let trailing: ReturnType<typeof setTimeout> | undefined;
  let ticker: ReturnType<typeof setInterval> | undefined;
  let lastActivity = performance.now();
  let jump: { id: string; method: EntryMethod; started: number } | undefined;
  let landing: { id: string; method: EntryMethod } | undefined;
  const metadata = (section: Section): SectionInfo => ({ section_title: section.section_title, section_id: section.section_id, section_index: section.section_index });
  const sourceSection = (target: Element) => sections.find((section) => section.heading === target)
    ?? sections.filter((section) => Boolean(section.heading.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)).at(-1);
  const hashTarget = (hash: string) => {
    try {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      return target && article.contains(target) ? sourceSection(target) : undefined;
    } catch { return; }
  };
  const initialTarget = hashTarget(location.hash);
  if (initialTarget) jump = { id: initialTarget.section_id, method: 'deep_link', started: lastActivity };

  const stopTicker = () => { clearInterval(ticker); ticker = undefined; };
  const measure = (now = performance.now(), pause = false) => {
    if (disposed) return;
    cancelAnimationFrame(frame); frame = 0; clearTimeout(trailing); trailing = undefined;
    lastSample = now;
    const box = article.getBoundingClientRect();
    const top = innerHeight * .15, bottom = innerHeight * .85, line = innerHeight * .35;
    const starts = sections.map(({ heading }) => heading.getBoundingClientRect().top);
    const visible = sections.map((section, index) => {
      const start = starts[index], end = starts[index + 1] ?? box.bottom;
      const overlap = Math.max(0, Math.min(end, bottom) - Math.max(start, top));
      return { section, start, end, overlap, qualifies: overlap >= Math.min(120, (bottom - top) * .3, (end - start) * .5) };
    }).filter((item) => item.qualifies);
    if (jump && now - jump.started > 4000 && !visible.some(({ section }) => section.section_id === jump!.id)) jump = undefined;
    const atEnd = box.bottom <= innerHeight - 16 && box.bottom >= top + 20;
    const preferred = jump?.id ?? landing?.id;
    const primary = choosePrimary(visible, preferred, sections.at(-1)!.section_id, atEnd, line);
    if (landing && primary?.section_id !== landing.id) landing = undefined;
    const active = !pause && document.visibilityState === 'visible' && document.hasFocus() && now < lastActivity + IDLE_MS;
    const articleVisible = Math.min(box.bottom, bottom) - Math.max(box.top, top) >= Math.min(120, box.height / 2);
    const unobscured = !article.closest('[inert]') && !document.querySelector('dialog[open]');
    const eligible = active && articleVisible && unobscured && (!jump || primary?.section_id === jump.id);
    const depth = atEnd ? 100 : Math.max(0, Math.min(99, Math.floor((bottom - box.top) / Math.max(1, box.height) * 100)));
    const method = jump?.method ?? landing?.method ?? 'scroll';
    visit.update({ now, eligible, section: primary && metadata(primary), depth, atEnd, method }, lastActivity + IDLE_MS);
    if (jump && primary && eligible && visit.settled(primary.section_id)) { landing = jump; jump = undefined; }
    if (active && articleVisible) { if (!ticker) ticker = setInterval(() => measure(), 1000); }
    else stopTicker();
  };
  const schedule = () => {
    if (disposed || frame || trailing) return;
    const wait = Math.max(0, 150 - (performance.now() - lastSample));
    const queue = () => { trailing = undefined; frame = requestAnimationFrame(() => measure()); };
    if (wait) trailing = setTimeout(queue, wait); else queue();
  };
  const activity = (event: Event) => {
    if (!event.isTrusted) return;
    const now = performance.now();
    if (now >= lastActivity + IDLE_MS) measure(now); // Close the idle segment before renewing activity.
    if (now - lastActivity >= 1000 || !ticker) { lastActivity = now; schedule(); }
    const scrolling = event.type === 'wheel' || event.type === 'touchmove'
      || (event instanceof KeyboardEvent && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key));
    if (scrolling) { jump = undefined; landing = undefined; }
  };
  const beginJump = (section: Section, method: EntryMethod) => {
    measure(performance.now(), true);
    jump = { id: section.section_id, method, started: performance.now() };
    landing = undefined; lastActivity = performance.now(); schedule();
  };
  const onLink = (event: MouseEvent) => {
    if (!event.isTrusted || (event.type === 'click' ? event.button !== 0 : event.button !== 1)) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (anchor.closest('[data-toc]') && url.origin === location.origin && url.pathname === location.pathname) {
      const target = hashTarget(url.hash);
      if (!target) return;
      visit.tocUsed = true;
      trackPortfolioEvent('heir_toc_click', metadata(target), event);
      if (event.type === 'click' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) beginJump(target, 'toc');
    } else if (article.contains(anchor)) {
      const section = sourceSection(anchor), resource = researchResource(anchor);
      if (section && resource) trackPortfolioEvent('heir_resource_click', { ...metadata(section), ...resource }, event);
    }
  };
  const resume = () => { lastActivity = performance.now(); measure(); };
  const options = { passive: true, signal: events.signal };
  document.addEventListener('scroll', schedule, options);
  for (const name of ['wheel', 'touchmove', 'pointermove', 'pointerdown', 'keydown']) document.addEventListener(name, activity, options);
  document.addEventListener('click', onLink, { capture: true, signal: events.signal });
  document.addEventListener('auxclick', onLink, { capture: true, signal: events.signal });
  window.addEventListener('resize', schedule, options);
  window.addEventListener('blur', () => measure(performance.now(), true), options);
  window.addEventListener('focus', resume, options);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') measure(performance.now(), true); else resume();
  }, options);
  window.addEventListener('pagehide', () => measure(performance.now(), true), options);
  window.addEventListener('pageshow', resume, options);
  window.addEventListener('hashchange', () => {
    const target = hashTarget(location.hash);
    if (target && jump?.id !== target.section_id) beginJump(target, 'deep_link');
  }, options);
  const intersection = new IntersectionObserver(schedule);
  intersection.observe(article); sections.forEach(({ heading }) => intersection.observe(heading));
  const resize = new ResizeObserver(schedule); resize.observe(article);
  document.fonts.ready.then(schedule);
  measure();
  cleanup = () => {
    if (disposed) return;
    measure(performance.now(), true); disposed = true;
    events.abort(); intersection.disconnect(); resize.disconnect(); stopTicker();
    cancelAnimationFrame(frame); clearTimeout(trailing); mounted = undefined;
  };
}

export function bindHeirAnalytics() {
  if (bound) return;
  bound = true;
  document.addEventListener('astro:page-load', initializeHeirAnalytics, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  if (document.readyState === 'complete') initializeHeirAnalytics();
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
