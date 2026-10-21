import { gsap } from 'gsap';
import { createAccordionInteractions } from './homepage-accordion-interactions';

const desktopQuery = '(min-width: 1200px) and (min-height: 600px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
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
  const media = matchMedia(desktopQuery);
  const events = new AbortController();
  const originalStyles = new Map<HTMLElement, string | null>();
  const capture = (element: HTMLElement) => { if (!originalStyles.has(element)) originalStyles.set(element, element.getAttribute('style')); return element; };
  let timeline: gsap.core.Timeline | undefined;
  let interactions: ReturnType<typeof createAccordionInteractions> | undefined;
  let enabled = false, disposed = false, menuOpen = false;
  let standard = Boolean(location.hash || history.state?.portfolioJourneySkipped);
  let active = 0;
  let preferredWidths: number[] = [], availableWidth = 0, frame = 0;
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
    const expandedWidth = preferredWidths[active];
    const collapsedWidth = (availableWidth - expandedWidth) / 4;
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
    panels.forEach((panel, index) => {
      const selected = index === active;
      const contentWidth = preferredWidths[index];
      capture(panel);
      panel.toggleAttribute('data-active', selected);
      buttons[index].setAttribute('aria-expanded', String(selected));
      contents[index].inert = !selected;
      move(panel, { width: selected ? expandedWidth : collapsedWidth });
      const copies = [...panel.querySelectorAll<HTMLElement>('.homepage-hero-copy, .journey-project-copy, .journey-project > .homepage-label, .work-deck-cover, .homepage-stage-description, .homepage-tool-section > .homepage-label')];
      copies.forEach(capture);
      if (copies.length) move(copies, { autoAlpha: selected ? 1 : 0, y: selected ? 0 : 12, duration: selected ? .28 : .12 }, selected ? .18 : 0);
      const portrait = panel.querySelector<HTMLElement>('.homepage-portrait');
      if (portrait) {
        capture(portrait);
        // Fill the visible cover; its lower content continues on the same scrim.
        move(portrait, { width: selected ? contentWidth : collapsedWidth * 1.25,
          height: stage.clientHeight, x: 0, y: 0 });
      }
      const product = panel.querySelector<HTMLElement>('[data-phone-showcase], [data-lira-pendant]');
      if (product) {
        capture(product);
        const padding = parseFloat(getComputedStyle(panel.querySelector<HTMLElement>('.journey-project')!).paddingLeft);
        const previewScale = Math.min(1.8, stage.clientHeight * .76 / product.offsetHeight);
        move(product, { xPercent: -50, scale: selected ? 1 : previewScale,
          y: selected ? 0 : (stage.clientHeight - product.offsetHeight) / 2 - padding - 18 });
      }
      const cards = [...panel.querySelectorAll<HTMLElement>('.homepage-stage')];
      const list = panel.querySelector<HTMLElement>('.homepage-stages');
      if (list) cards.forEach((card, cardIndex) => {
        capture(card);
        move(card, { x: selected ? 0 : list.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2 + (cardIndex - 1) * 32,
          y: selected ? 0 : (stage.clientHeight - card.offsetHeight) / 2 - list.offsetTop + (cardIndex - 1) * 48,
          rotation: selected ? 0 : (cardIndex - 1) * 8, scale: 1 });
      });
      const tools = panel.querySelector<HTMLElement>('.homepage-tools');
      if (tools) {
        capture(tools);
        const inset = parseFloat(getComputedStyle(tools.parentElement!.parentElement!).paddingLeft);
        const gridWidth = Math.min(contentWidth - inset * 2, 360);
        const previewWidth = Math.min(gridWidth, 200);
        move(tools, { width: selected ? gridWidth : previewWidth,
          x: (contentWidth - inset * 2 - (selected ? gridWidth : previewWidth)) / 2,
          rotation: selected ? 0 : -10, scale: selected ? 1 : 1.15,
          y: selected ? 0 : stage.clientHeight * .18 - tools.offsetTop });
        const labels = [...tools.querySelectorAll<HTMLElement>('.homepage-tool-select > span:last-child')];
        labels.forEach(capture);
        move(labels, { autoAlpha: selected ? 1 : 0, duration: .2 }, selected ? .18 : 0);
      }
    });
    updateScrollAccess();
    root.dataset.accordionSelection = panels[active].dataset.accordionPanel;
    if (!animate) interactions!.settle();
  };
  const measure = () => {
    const rem = parseFloat(getComputedStyle(html).fontSize);
    const available = stage.clientWidth - parseFloat(getComputedStyle(stage).gap) * (panels.length - 1);
    // Keep both the open reading composition and all four labels usable.
    if (available < 37.5 * rem + 4 * 6.5 * rem) return false;
    availableWidth = available;
    preferredWidths = panels.map((panel) => {
      const width = Math.max(Number(panel.dataset.minWidthRem) * rem,
        Math.min(available * Number(panel.dataset.preferredWidth), available - 4 * 6.5 * rem,
          panel.dataset.maxWidthRem ? Number(panel.dataset.maxWidthRem) * rem : Infinity));
      capture(panel).style.setProperty('--accordion-expanded-width', `${width}px`);
      return width;
    });
    return true;
  };
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
  document.addEventListener('astro:page-load', initializeAccordion, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  // Initialize before the first paint when this module arrives before astro:page-load.
  if (document.readyState !== 'loading') initializeAccordion();
  else document.addEventListener('DOMContentLoaded', initializeAccordion, { once: true, signal: lifecycle.signal });
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
