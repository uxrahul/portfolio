import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pendantLightAt } from './lira-pendant';

gsap.registerPlugin(ScrollTrigger);
const touchQuery = '(max-width: 1199px), (hover: none), (pointer: coarse)';
const lifecycle = new AbortController();
let cleanup: (() => void) | undefined;
let bound = false;
type TouchMemory = { phoneStarted: boolean; phoneFraction: number; pendantStarted: boolean };

/** Entry starts a complete autoplay; no percentage of a tall device must fit. */
function observeOnce(target: HTMLElement, start: () => void) {
  if (!('IntersectionObserver' in window)) { start(); return () => {}; }
  const events = new AbortController();
  let observer: IntersectionObserver;
  const disconnect = () => { observer.disconnect(); events.abort(); };
  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      disconnect(); start();
    }, { threshold: 0, rootMargin: `0px 0px -${Math.round(innerHeight * .35)}px 0px` });
    observer.observe(target);
  };
  observe();
  window.addEventListener('resize', observe, { passive: true, signal: events.signal });
  return disconnect;
}

function initializeProducts() {
  cleanup?.(); cleanup = undefined;
  const root = document.querySelector<HTMLElement>('[data-home-journey]');
  if (!root) return;
  const touch = matchMedia(touchQuery);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const memory: TouchMemory = { phoneStarted: false, phoneFraction: 0, pendantStarted: false };
  let disposeMode: (() => void) | undefined;
  let mode = '';
  let disposed = false;
  const sync = () => {
    if (disposed) return;
    const next = root.hasAttribute('data-journey-active') ? 'cinematic'
      : touch.matches ? reduced.matches ? 'touch-static' : 'touch'
      : reduced.matches ? 'static' : 'standard';
    if (next === mode) return;
    disposeMode?.(); disposeMode = undefined;
    mode = next;
    root.dataset.productView = mode;
    if (mode === 'touch' || mode === 'touch-static') {
      const phone = createTouchPhone(root, memory, reduced.matches);
      const pendant = createTouchPendant(root, memory, reduced.matches);
      disposeMode = () => { phone(); pendant(); };
    } else if (mode === 'standard') disposeMode = createStandardProducts(root);
  };
  // Camera fit measurement is synchronous. Release Standard pin inline sizes
  // before its layout is evaluated, rather than waiting for MutationObserver.
  root.addEventListener('homepage:before-camera', () => {
    disposeMode?.(); disposeMode = undefined; mode = '';
  }, { signal: events.signal });
  touch.addEventListener('change', sync, { signal: events.signal });
  reduced.addEventListener('change', sync, { signal: events.signal });
  const camera = new MutationObserver(sync);
  camera.observe(root, { attributes: true, attributeFilter: ['data-journey-active'] });
  if (document.fonts.status === 'loading') document.fonts.ready.then(sync);
  else sync();
  cleanup = () => {
    disposed = true; events.abort(); camera.disconnect(); disposeMode?.();
    root.removeAttribute('data-product-view');
  };
}

function createTouchPhone(root: HTMLElement, memory: TouchMemory, reduced: boolean) {
  const phone = root.querySelector<HTMLElement>('[data-phone-showcase]')!;
  const device = phone.querySelector<HTMLElement>('[data-phone-device]')!;
  const aperture = phone.querySelector<HTMLElement>('[data-phone-window]')!;
  const screen = phone.querySelector<HTMLImageElement>('[data-phone-screen]')!;
  const events = new AbortController();
  let tween: gsap.core.Tween | undefined;
  let unobserve = () => {};
  const travel = () => Math.max(0, aperture.scrollHeight - aperture.clientHeight);
  let lastTravel = 0;
  const remember = () => { memory.phoneFraction = travel() ? aperture.scrollTop / travel() : 0; };
  const handoff = () => {
    memory.phoneStarted = true; phone.dataset.responsiveProduct = 'interactive';
    unobserve(); tween?.kill(); tween = undefined;
  };
  aperture.dataset.phoneNative = '';
  aperture.tabIndex = 0;
  aperture.setAttribute('role', 'region');
  aperture.setAttribute('aria-label', 'HEIR app preview. Scroll to explore the screen.');
  if (reduced) memory.phoneStarted = true;
  const measure = () => {
    const next = travel();
    if (next === lastTravel) return;
    // Rotation hands an in-flight autoplay to native scrolling at its current
    // fraction; a manual position survives the new screenshot dimensions.
    if (tween?.isActive()) handoff();
    lastTravel = next;
    aperture.scrollTop = memory.phoneFraction * next;
  };
  measure();
  phone.dataset.responsiveProduct = memory.phoneStarted ? 'interactive' : 'ready';
  if (!memory.phoneStarted) unobserve = observeOnce(device, () => {
    memory.phoneStarted = true; phone.dataset.responsiveProduct = 'running';
    tween = gsap.to(aperture, {
      scrollTop: travel(), duration: 1.8, ease: 'power2.inOut', onUpdate: remember,
      onComplete: () => { remember(); tween = undefined; phone.dataset.responsiveProduct = 'interactive'; },
    });
  });
  // Never preventDefault: the browser owns touch, momentum and boundary chaining.
  aperture.addEventListener('pointerdown', handoff, { passive: true, signal: events.signal });
  aperture.addEventListener('wheel', handoff, { passive: true, signal: events.signal });
  aperture.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) handoff();
  }, { signal: events.signal });
  aperture.addEventListener('scroll', remember, { passive: true, signal: events.signal });
  const resize = new ResizeObserver(measure);
  resize.observe(aperture); resize.observe(screen);
  screen.addEventListener('load', measure, { signal: events.signal });
  return () => {
    events.abort(); unobserve(); resize.disconnect(); tween?.kill();
    aperture.scrollTop = 0;
    ['data-phone-native', 'tabindex', 'role', 'aria-label'].forEach((attribute) => aperture.removeAttribute(attribute));
    phone.removeAttribute('data-responsive-product');
  };
}

function createTouchPendant(root: HTMLElement, memory: TouchMemory, reduced: boolean) {
  const pendant = root.querySelector<HTMLElement>('[data-lira-pendant]')!;
  const replay = pendant.querySelector<HTMLButtonElement>('[data-lira-replay]')!;
  const events = new AbortController();
  let timeline: gsap.core.Timeline | undefined;
  let running = false;
  let unobserve = () => {};
  const setLight = (lit: number) => gsap.set(pendant, {
    '--preview-ring-progress': lit, '--preview-ring-strength': lit, '--preview-indicator': lit,
  });
  const play = () => {
    // A running sequence owns the light. Repeated taps cannot reset/flicker it.
    if (running) return;
    memory.pendantStarted = true; unobserve();
    if (reduced) { setLight(1); return; }
    timeline?.kill(); setLight(0);
    running = true;
    pendant.dataset.responsiveProduct = 'running'; replay.setAttribute('aria-busy', 'true');
    timeline = gsap.timeline({ onComplete: () => {
      running = false;
      pendant.dataset.responsiveProduct = 'complete'; replay.removeAttribute('aria-busy');
    } })
      .to(pendant, { '--preview-ring-strength': 1, duration: .12, ease: 'power1.out' }, 0)
      .to(pendant, { '--preview-ring-progress': 1, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to(pendant, { '--preview-indicator': 1, duration: .3, ease: 'power2.out' }, 1.1);
  };
  if (reduced) memory.pendantStarted = true;
  setLight(memory.pendantStarted ? 1 : 0);
  pendant.dataset.responsiveProduct = memory.pendantStarted ? 'complete' : 'ready';
  replay.hidden = false;
  replay.addEventListener('click', play, { signal: events.signal });
  if (!memory.pendantStarted) unobserve = observeOnce(pendant, play);
  return () => {
    events.abort(); unobserve(); timeline?.kill(); replay.hidden = true; replay.removeAttribute('aria-busy');
    ['--preview-ring-progress', '--preview-ring-strength', '--preview-indicator'].forEach((property) => pendant.style.removeProperty(property));
    pendant.removeAttribute('data-responsive-product');
  };
}

function createStandardProducts(root: HTMLElement) {
  const phone = root.querySelector<HTMLElement>('[data-phone-showcase]')!;
  const aperture = phone.querySelector<HTMLElement>('[data-phone-window]')!;
  const screen = phone.querySelector<HTMLElement>('[data-phone-screen]')!;
  const pendant = root.querySelector<HTMLElement>('[data-lira-pendant]')!;
  const events = new AbortController();
  const phoneClock = { progress: 0 }, lightClock = { progress: 0 };
  let phoneTravel = 0, frame = 0;
  const measure = () => { phoneTravel = Math.max(0, screen.getBoundingClientRect().height - aperture.getBoundingClientRect().height); };
  const paintPhone = () => phone.style.setProperty('--preview-phone-y', `${-phoneTravel * phoneClock.progress}px`);
  const paintLight = () => {
    const light = pendantLightAt(lightClock.progress);
    pendant.style.setProperty('--preview-ring-progress', String(light.ring));
    pendant.style.setProperty('--preview-ring-strength', String(light.strength));
    pendant.style.setProperty('--preview-indicator', String(light.indicator));
  };
  const sections = [phone.closest<HTMLElement>('.journey-project')!, pendant.closest<HTMLElement>('.journey-project')!];
  // Read actual typography/layout, rather than assuming a viewport-height scene
  // always fits. Short windows and enlarged text keep ordinary vertical flow.
  const fits = () => sections.map((section) => section.offsetHeight <= innerHeight - 96);
  let pinned: boolean[] = [];
  let context: gsap.Context | undefined;
  const mount = () => {
    context?.revert();
    pinned = fits();
    phoneClock.progress = lightClock.progress = 0;
    measure(); paintPhone(); paintLight();
    context = gsap.context(() => {
      for (const [index, id, clock, paint] of [
        [0, 'heir', phoneClock, paintPhone], [1, 'lira', lightClock, paintLight],
      ] as const) {
        const section = sections[index];
        gsap.to(clock, {
          progress: 1, ease: 'none', onUpdate: paint,
          scrollTrigger: {
            id: `standard-${id}`, trigger: section,
            start: pinned[index] ? () => `top ${Math.max(48, (innerHeight - section.offsetHeight) / 2)}px` : 'top 70%',
            end: pinned[index] ? () => `+=${id === 'heir'
              ? Math.max(innerHeight * .8, Math.min(innerHeight * 1.25, phoneTravel * 1.1))
              : innerHeight * .85}` : 'bottom 30%',
            pin: pinned[index] ? section : false,
            scrub: true, invalidateOnRefresh: true,
            onRefreshInit: measure, onRefresh: () => { measure(); paint(); },
          },
        });
      }
    }, root);
  };
  mount();
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (root.hasAttribute('data-journey-active')) return;
      if (fits().some((fit, index) => fit !== pinned[index])) mount();
      ScrollTrigger.refresh(); measure(); paintPhone(); paintLight();
    });
  };
  const resize = new ResizeObserver(refresh);
  sections.forEach((section) => resize.observe(section.querySelector('.journey-project-composition')!));
  resize.observe(screen);
  window.addEventListener('resize', refresh, { passive: true, signal: events.signal });
  root.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', refresh, { once: true, signal: events.signal });
  });
  refresh();
  return () => {
    events.abort(); resize.disconnect(); cancelAnimationFrame(frame); context?.revert();
    phone.style.removeProperty('--preview-phone-y');
    ['--preview-ring-progress', '--preview-ring-strength', '--preview-indicator'].forEach((property) => pendant.style.removeProperty(property));
  };
}

export function bindHomepageProducts() {
  if (bound) return;
  bound = true;
  document.addEventListener('astro:page-load', initializeProducts, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  if (document.readyState === 'complete') initializeProducts();
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
