import { gsap } from 'gsap';
import { createAccordionInteractions } from './homepage-accordion-interactions';

import { accordionDesktopQuery, measureAccordion, accordionPoses } from './homepage-accordion-presentation';
const lifecycle = new AbortController();
let bound = false;
let cleanup: (() => void) | undefined;
let mountedRoot: HTMLElement | undefined;

/** One state/geometry owner; product lifetimes follow selection and settling. */
function initializeAccordion() {
  const root = document.querySelector<HTMLElement>('[data-home-journey][data-home-accordion]');
  if (root && root === mountedRoot) return;
  cleanup?.(); cleanup = undefined;
  if (!root) return;
  // Parser-time styles are temporary; release them before capturing owned styles.
  root.dispatchEvent(new Event('homepage:initialize-accordion'));
  mountedRoot = root;
  const html = document.documentElement;
  const stage = root.querySelector<HTMLElement>('[data-accordion-stage]')!;
  const panels = [...root.querySelectorAll<HTMLElement>('[data-accordion-panel]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-accordion-select]')];
  const contents = [...root.querySelectorAll<HTMLElement>('[data-accordion-content]')];
  const toggle = root.querySelector<HTMLButtonElement>('[data-journey-view-toggle]')!;
  const menu = root.querySelector<HTMLButtonElement>('[data-journey-menu]')!;
  const navigation = document.querySelector<HTMLElement>('[data-global-navigation]')!;
  const toolsHeading = root.querySelector<HTMLElement>('.homepage-tool-section > .homepage-label')!;
  const toolsList = root.querySelector<HTMLElement>('.homepage-tools')!;
  const originalToolsHeading = toolsHeading.textContent;
  const originalToolsLabel = toolsList.getAttribute('aria-label')!;
  const media = matchMedia(accordionDesktopQuery);
  const events = new AbortController();
  const originalStyles = new Map<HTMLElement, string | null>();
  const capture = (element: HTMLElement) => { if (!originalStyles.has(element)) originalStyles.set(element, element.getAttribute('style')); return element; };
  let timeline: gsap.core.Timeline | undefined;
  let interactions: ReturnType<typeof createAccordionInteractions> | undefined;
  let enabled = false, disposed = false, menuOpen = false;
  let standard = Boolean(location.hash || history.state?.portfolioJourneySkipped);
  let active = 0;
  let geometry: ReturnType<typeof measureAccordion>;
  let frame = 0;
  let navigationWasInert = navigation.inert;

  const closeMenu = (restoreFocus = false) => {
    menuOpen = false; html.removeAttribute('data-journey-menu-open');
    menu.setAttribute('aria-expanded', 'false'); stage.inert = false;
    navigation.inert = enabled ? true : navigationWasInert;
    if (restoreFocus) menu.focus({ preventScroll: true });
  };
  const paint = (animate: boolean) => {
    timeline?.kill();
    interactions!.prepare(panels[active].dataset.accordionPanel!);
    const updateScrollAccess = () => contents.forEach((content, index) => {
      content.tabIndex = index === active && content.scrollHeight > content.clientHeight + 1 ? 0 : -1;
    });
    timeline = gsap.timeline({ defaults: { duration: .55, ease: 'power3.inOut', overwrite: 'auto' }, onComplete: () => {
      updateScrollAccess(); interactions?.settle();
    } });
    const move = (targets: gsap.TweenTarget, vars: gsap.TweenVars, at = 0) => {
      if (animate) timeline!.to(targets, vars, at);
      else gsap.set(targets, vars);
    };
    accordionPoses(root, active, geometry!, capture).forEach(({ targets, vars, at }) => move(targets, vars, at));
    updateScrollAccess();
    root.dataset.accordionSelection = panels[active].dataset.accordionPanel;
    if (!animate) interactions!.settle();
  };
  const measure = () => Boolean(geometry = measureAccordion(root, capture));
  const disable = () => {
    if (!enabled) return;
    timeline?.kill(); timeline = undefined;
    interactions?.dispose(); interactions = undefined;
    enabled = false; closeMenu();
    toolsHeading.textContent = originalToolsHeading;
    toolsList.setAttribute('aria-label', originalToolsLabel);
    root.removeAttribute('data-accordion-active'); root.removeAttribute('data-journey-active');
    root.removeAttribute('data-accordion-selection'); html.removeAttribute('data-home-accordion');
    originalStyles.forEach((style, element) => { if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style); });
    originalStyles.clear();
    panels.forEach((panel, index) => {
      panel.removeAttribute('data-active'); buttons[index].hidden = true;
      buttons[index].setAttribute('aria-expanded', 'false');
      contents[index].inert = false;
      ['role', 'aria-labelledby', 'tabindex'].forEach((attribute) => contents[index].removeAttribute(attribute));
    });
  };
  const sync = () => {
    frame = 0;
    if (disposed) return;
    let fits = true;
    if (media.matches && !standard) {
      if (!enabled) {
        toolsHeading.textContent = 'Tools I use';
        toolsList.setAttribute('aria-label', 'Tools I use');
        active = 0; // Every entry into Animated View opens About; resize preserves selection.
        // Synchronously release Standard pin inline dimensions before measuring.
        root.dispatchEvent(new Event('homepage:before-camera'));
        navigationWasInert = navigation.inert;
        navigation.inert = true;
        root.dataset.journeyActive = ''; root.dataset.accordionActive = '';
        html.dataset.homeAccordion = ''; enabled = true;
        interactions = createAccordionInteractions(root);
        buttons.forEach((button, index) => {
          button.hidden = false;
          contents[index].setAttribute('role', 'region');
          contents[index].setAttribute('aria-labelledby', button.id);
        });
      }
      fits = measure();
      if (fits) paint(false);
      else disable();
    } else disable();
    toggle.hidden = !media.matches || !fits;
    toggle.textContent = enabled ? 'Standard View' : 'Animated View';
    html.toggleAttribute('data-home-accordion', enabled);
  };
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(sync); };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (!enabled || index === active) return;
      active = index;
      paint(true);
    }, { signal: events.signal });
    button.addEventListener('keydown', (event) => {
      let next: number;
      if (event.key === 'ArrowRight') next = (index + 1) % panels.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + panels.length) % panels.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = panels.length - 1;
      else return;
      event.preventDefault(); buttons[next].focus({ preventScroll: true });
    }, { signal: events.signal });
  });
  toggle.addEventListener('click', () => {
    standard = enabled;
    const state = { ...history.state };
    delete state.portfolioJourneyProgress;
    if (standard) state.portfolioJourneySkipped = true;
    else delete state.portfolioJourneySkipped;
    history.replaceState(state, '', standard ? location.href : location.pathname + location.search);
    scrollTo({ top: 0, behavior: 'instant' }); sync(); toggle.focus({ preventScroll: true });
  }, { signal: events.signal });
  menu.addEventListener('click', () => {
    if (menuOpen) { closeMenu(true); return; }
    menuOpen = true; html.dataset.journeyMenuOpen = '';
    menu.setAttribute('aria-expanded', 'true'); navigation.inert = false; stage.inert = true;
    navigation.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }, { signal: events.signal });
  navigation.addEventListener('click', (event) => {
    if (menuOpen && (event.target as Element).closest('a[href]') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) closeMenu();
  }, { signal: events.signal });
  document.addEventListener('pointerdown', (event) => {
    if (menuOpen && !navigation.contains(event.target as Node) && !menu.contains(event.target as Node)) closeMenu(true);
  }, { signal: events.signal });
  document.addEventListener('keydown', (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...navigation.querySelectorAll<HTMLElement>('a[href], summary, select, button')].filter((element) => element.getClientRects().length && !element.closest('[inert]'));
      focusable.push(menu);
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      event.preventDefault(); focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus({ preventScroll: true });
    }
  }, { signal: events.signal });
  window.addEventListener('hashchange', () => {
    if (location.hash) { standard = true; sync(); document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); }
  }, { signal: events.signal });
  media.addEventListener('change', sync, { signal: events.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: events.signal });
  let lastSize = '';
  const resize = new ResizeObserver(() => {
    const size = `${stage.clientWidth}:${stage.clientHeight}`;
    if (size !== lastSize) { lastSize = size; schedule(); }
  });
  resize.observe(stage);
  document.fonts.ready.then(() => { if (!disposed) schedule(); });
  sync();
  cleanup = () => {
    mountedRoot = undefined;
    disposed = true; events.abort(); resize.disconnect(); cancelAnimationFrame(frame);
    disable(); toggle.hidden = true;
  };
}

export function bindHomepageAccordion() {
  if (bound) return;
  bound = true;
  document.addEventListener('astro:after-swap', initializeAccordion, { signal: lifecycle.signal });
  document.addEventListener('astro:page-load', initializeAccordion, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  // The inline presentation handles the first paint while this module loads.
  if (document.readyState !== 'loading') initializeAccordion();
  else document.addEventListener('DOMContentLoaded', initializeAccordion, { once: true, signal: lifecycle.signal });
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
