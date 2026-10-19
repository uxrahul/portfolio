import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journeyScenes, planJourney, type CameraPlan } from './homepage-scenes';
import { createPendantInteraction } from './lira-pendant';
import { createWorkDeckInteraction } from './work-deck';
import { createToolSwarm } from './tool-swarm';

gsap.registerPlugin(ScrollTrigger);
const desktop = '(min-width: 1200px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const lifecycle = new AbortController();
let cleanup: (() => void) | undefined;
let bound = false;

function initializeJourney() {
  cleanup?.();
  cleanup = undefined;
  const root = document.querySelector<HTMLElement>('[data-home-journey]');
  if (!root) return;
  // A cold font load can temporarily make the expertise scene too tall. Keep
  // readable static HTML until typography is ready, then evaluate the real fit.
  if (document.fonts.status === 'loading') {
    document.fonts.ready.then(() => { if (root.isConnected) initializeJourney(); });
    return;
  }
  const html = document.documentElement;
  const home = root.closest<HTMLElement>('[data-homepage]')!;
  const stage = root.querySelector<HTMLElement>('[data-journey-stage]')!;
  const track = root.querySelector<HTMLElement>('[data-journey-track]')!;
  const cameraFrame = root.querySelector<HTMLElement>('[data-journey-aperture]')!;
  const cameraRig = root.querySelector<HTMLElement>('[data-journey-camera]')!;
  const liveHome = root.querySelector<HTMLElement>('[data-journey-live-home]')!;
  const laptop = root.querySelector<HTMLElement>('[data-journey-laptop]')!;
  const heir = root.querySelector<HTMLElement>('[data-journey-heir]')!;
  const screenshot = heir.querySelector<HTMLImageElement>('[data-phone-screen]')!;
  const aperture = heir.querySelector<HTMLElement>('[data-phone-window]')!;
  const cue = root.querySelector<HTMLElement>('.journey-scroll-cue')!;
  const connection = root.querySelector<HTMLElement>('.journey-connection')!;
  const progress = root.querySelector<HTMLElement>('[data-journey-progress]')!;
  const menu = root.querySelector<HTMLButtonElement>('[data-journey-menu]')!;
  const viewToggle = root.querySelector<HTMLButtonElement>('[data-journey-view-toggle]')!;
  const navigation = document.querySelector<HTMLElement>('[data-global-navigation]')!;
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-journey-scene]')];
  const destinations = [...root.querySelectorAll<HTMLButtonElement>('[data-journey-destination]')];
  const pendant = createPendantInteraction(root);
  const workDeck = createWorkDeckInteraction(root);
  const toolsSwarm = createToolSwarm(root);
  const events = new AbortController();
  const media = gsap.matchMedia();
  const supportedDesktop = matchMedia(desktop);
  let contentFits = true;
  let disposed = false;
  let bypassed = Boolean(location.hash || history.state?.portfolioJourneySkipped);
  let sequence: gsap.core.Timeline | undefined;
  let frame = 0;
  let fitFrame = 0;
  let menuOpen = false;
  let restoreProgress: number | undefined = typeof history.state?.portfolioJourneyProgress === 'number'
    ? history.state.portfolioJourneyProgress : undefined;
  if (restoreProgress !== undefined) {
    const state = { ...history.state };
    delete state.portfolioJourneyProgress;
    history.replaceState(state, '');
  }
  let navigationWasInert = navigation.inert;
  const syncViewToggle = () => {
    viewToggle.hidden = !supportedDesktop.matches || !contentFits;
    viewToggle.textContent = root.hasAttribute('data-journey-active') ? 'Standard View' : 'Animated View';
  };

  const closeMenu = (restoreFocus = false) => {
    menuOpen = false;
    html.removeAttribute('data-journey-menu-open');
    menu.setAttribute('aria-expanded', 'false');
    stage.inert = false;
    if (root.hasAttribute('data-journey-active')) navigation.inert = true;
    if (restoreFocus) menu.focus({ preventScroll: true });
  };
  const compositionFits = () => liveHome.scrollHeight <= innerHeight + 2
    && scenes.slice(1).every((scene) => scene.scrollHeight <= scene.clientHeight + 2);
  // The media query need not change when a short/large-type layout starts fitting
  // again. Re-evaluate that guard on resize without retuning the camera sequence.
  window.addEventListener('resize', () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(() => {
      if (disposed || bypassed || !supportedDesktop.matches) return;
      if (!contentFits || (root.hasAttribute('data-journey-active') && !compositionFits())) initializeJourney();
    });
  }, { passive: true, signal: events.signal });
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (disposed) return;
      ScrollTrigger.refresh();
      const trigger = sequence?.scrollTrigger;
      if (restoreProgress !== undefined && trigger) {
        scrollTo({ top: trigger.start + (trigger.end - trigger.start) * restoreProgress, behavior: 'instant' });
        restoreProgress = undefined;
        ScrollTrigger.update();
      }
    });
  };

  media.add(desktop, () => {
    if (bypassed || disposed) { syncViewToggle(); return; }
    contentFits = true;
    root.dispatchEvent(new Event('homepage:before-camera'));
    html.style.setProperty('--home-scrollbar-gutter', `${Math.max(0, innerWidth - html.clientWidth)}px`);
    root.dataset.journeyActive = '';
    html.dataset.homeCamera = '';
    navigationWasInert = navigation.inert;
    navigation.inert = true;
    const clock = { position: 0 };
    const ease = gsap.parseEase('power2.inOut');
    const mix = gsap.utils.interpolate;
    let width = 0, height = 0, laptopWidth = 0, laptopHeight = 0;
    let left = 0, top = 0, fit = 1, centerX = 0, centerY = 0;
    let phoneTravel = 0, contentTop = 0, contentHeight = 0, frameGutter = 0;
    let plan: CameraPlan;
    let offsets: number[] = [];
    const measure = () => {
      // refreshInit runs before ScrollTrigger removes its old inline pin size.
      // Measure the fluid document, not that stale pinned rectangle.
      width = home.clientWidth;
      height = innerHeight;
      laptopWidth = parseFloat(getComputedStyle(laptop).width);
      laptopHeight = laptopWidth * 2400 / 3880;
      left = (width - laptopWidth) / 2;
      const content = getComputedStyle(heir);
      contentTop = parseFloat(content.top);
      contentHeight = parseFloat(content.height);
      top = contentTop + (contentHeight - laptopHeight) / 2;
      offsets = scenes.map((scene) => parseFloat(getComputedStyle(scene).left));
      fit = Math.min(laptopWidth * 0.743 / width, laptopHeight * 0.746 / height);
      centerX = left + laptopWidth * 0.5;
      centerY = top + laptopHeight * 0.497;
      root.style.setProperty('--journey-laptop-left', `${left}px`);
      root.style.setProperty('--journey-laptop-top', `${top}px`);
      root.style.setProperty('--journey-camera-origin', `${width / 2}px ${contentTop + contentHeight / 2}px`);
      // Layout dimensions stay invariant while the shared camera lens scales.
      // Transformed bounding rectangles would overestimate the phone travel.
      phoneTravel = Math.max(0, parseFloat(getComputedStyle(screenshot).height) - parseFloat(getComputedStyle(aperture).height));
      frameGutter = (parseFloat(getComputedStyle(connection).top) - contentTop - contentHeight) / 2;
      plan = planJourney({ width, height, phoneTravel }, offsets);
      workDeck?.measure();
      toolsSwarm?.measure();
      if (sequence) {
        Object.keys(sequence.labels).forEach((label) => sequence!.removeLabel(label));
        Object.entries(plan.labels).forEach(([label, position]) => sequence!.addLabel(label, position / plan.total));
      }
    };
    const renderPullback = (p: number) => {
      const scale = 1 + (fit - 1) * p;
      const x = width / 2 + (centerX - width / 2) * p;
      const y = height / 2 + (centerY - height / 2) * p;
      // One live DOM plane throughout. Frame and content share the same physical
      // screen center and scale, including every intermediate and reverse frame.
      gsap.set(liveHome, { scale, x: x - width * scale / 2, y: y - height * scale / 2 });
      gsap.set(laptop, { scale: scale / fit, x: x - centerX, y: y - centerY });
    };
    measure();
    // Browser zoom / large type must not create an inaccessible full-height pin.
    if (!compositionFits()) {
      root.removeAttribute('data-journey-active');
      html.removeAttribute('data-home-camera');
      html.style.removeProperty('--home-scrollbar-gutter');
      navigation.inert = navigationWasInert;
      workDeck?.reset();
      toolsSwarm?.reset();
      contentFits = false;
      syncViewToggle();
      return;
    }
    const updateTimeline = () => {
      const distance = -Number(gsap.getProperty(track, 'x'));
      const horizontal = Math.min(1, Math.max(0, distance / offsets.at(-1)!));
      progress.style.transform = `scaleX(${horizontal})`;
      progress.parentElement!.setAttribute('aria-valuenow', String(Math.round(horizontal * 100)));
      // A node fills on arrival, not at the midpoint of the journey to it.
      const reached = offsets.map((offset) => distance >= offset - 0.5);
      const active = reached.lastIndexOf(true);
      destinations.forEach((button, index) => {
        button.toggleAttribute('data-reached', reached[index]);
        if (index === active) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    };
    const render = () => {
      if (!plan) return;
      const position = clock.position * plan.total;
      const index = Math.max(0, plan.phases.findIndex((phase) => position < phase.end));
      const phase = position >= plan.total ? plan.phases.at(-1)! : plan.phases[index];
      let amount = gsap.utils.clamp(0, 1, (position - phase.start) / (phase.end - phase.start));
      let fromX = phase.fromX, toX = phase.toX;
      let from = phase.from, to = phase.to;
      if (phase.handoff) {
        // Departure and approach are one eased move, without a velocity break
        // at the semantic phase boundary or a second pinned timeline.
        const handoff = phase.handoff;
        amount = (position - handoff.start) / (handoff.end - handoff.start);
        fromX = handoff.fromX;
        toX = handoff.toX;
        from = handoff.from;
        to = handoff.to;
      }
      const eased = ease(amount);
      const lens = mix(from.scale, to.scale, eased);
      const framing = mix(from.frame, to.frame, eased);
      gsap.set(track, { x: -mix(fromX, toX, eased) });
      const cameraY = height * mix(from.y, to.y, eased);
      gsap.set(cameraRig, { scale: lens, x: width * mix(from.x, to.x, eased), y: cameraY });
      // Frame the scaled content budget, including captions, at any desktop
      // height. Half the shared stage gap remains around its enlarged bounds.
      const originY = contentTop + contentHeight / 2;
      const frameTop = Math.max(0, originY - (contentHeight / 2 + frameGutter) * lens + cameraY);
      const frameBottom = Math.max(0, height - (originY + (contentHeight / 2 + frameGutter) * lens + cameraY));
      cameraFrame.style.clipPath = `inset(${frameTop * framing}px 0 ${frameBottom * framing}px 0)`;
      const opening = plan.phases[0];
      const reveal = gsap.utils.clamp(0, 1, position / opening.end);
      renderPullback(ease(reveal));
      gsap.set(laptop, { opacity: gsap.utils.clamp(0, 1, reveal / 0.1) });
      gsap.set(cue, { autoAlpha: 1 - gsap.utils.clamp(0, 1, reveal / 0.25) });
      // Only the initial reveal fades the thread. Focus removes it by framing
      // the complete world, and pullback restores that same spatial thread.
      gsap.set(connection, { autoAlpha: gsap.utils.clamp(0, 1, (position - opening.end) / (height * 0.06)) });
      const phonePhase = plan.phases.find((candidate) => candidate.name === 'interaction' && journeyScenes[candidate.scene].interaction === 'phone');
      if (phonePhase) gsap.set(screenshot, { y: -phoneTravel * gsap.utils.clamp(0, 1, (position - phonePhase.start) / (phonePhase.end - phonePhase.start)) });
      const pendantPhase = plan.phases.find((candidate) => candidate.name === 'interaction' && journeyScenes[candidate.scene].interaction === 'pendant');
      if (pendantPhase) pendant?.render(gsap.utils.clamp(0, 1, (position - pendantPhase.start) / (pendantPhase.end - pendantPhase.start)));
      const workPhase = plan.phases.find((candidate) => candidate.name === 'interaction' && journeyScenes[candidate.scene].interaction === 'work-deck');
      if (workPhase) workDeck?.render(gsap.utils.clamp(0, 1, (position - workPhase.start) / (workPhase.end - workPhase.start)));
      // With the redundant closing About section removed, Tools is also the
      // visible end of the page. Keep its existing interaction available there.
      toolsSwarm?.setActive(journeyScenes[phase.scene].id === 'select-tools');
      root.dataset.cameraPhase = phase.name;
      root.dataset.cameraScene = journeyScenes[phase.scene].id;
      root.toggleAttribute('data-camera-focused', framing > 0.001);
      updateTimeline();
    };
    sequence = gsap.timeline({
      scrollTrigger: {
        id: 'homepage-camera', trigger: stage, start: 'top top',
        end: () => `+=${plan.total}`,
        pin: true, pinSpacing: true, scrub: 0.45, anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: render,
      },
      onUpdate: render,
    });
    sequence.to(clock, { position: 1, duration: 1, ease: 'none' });
    measure();
    render();
    refresh();
    syncViewToggle();
    return () => {
      closeMenu();
      sequence = undefined;
      root.removeAttribute('data-journey-active');
      ['data-camera-phase', 'data-camera-scene', 'data-camera-focused'].forEach((attribute) => root.removeAttribute(attribute));
      html.removeAttribute('data-home-camera');
      html.style.removeProperty('--home-scrollbar-gutter');
      navigation.inert = navigationWasInert;
      [liveHome, laptop, track, cameraRig, cue, connection, screenshot].forEach((element) => {
        ['transform', 'transform-origin', 'opacity', 'visibility'].forEach((property) => element.style.removeProperty(property));
      });
      cameraFrame.style.removeProperty('clip-path');
      pendant?.reset();
      workDeck?.reset();
      toolsSwarm?.reset();
      ['--journey-laptop-left', '--journey-laptop-top', '--journey-camera-origin'].forEach((property) => root.style.removeProperty(property));
      syncViewToggle();
    };
  }, root);

  const bypass = (target?: HTMLElement) => {
    if (!root.hasAttribute('data-journey-active')) return;
    bypassed = true;
    history.replaceState({ ...history.state, portfolioJourneySkipped: true }, '');
    media.revert();
    syncViewToggle();
    if (target) {
      if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  };
  viewToggle.addEventListener('click', () => {
    if (!supportedDesktop.matches) return;
    const animated = !root.hasAttribute('data-journey-active');
    const state = { ...history.state };
    delete state.portfolioJourneyProgress;
    if (animated) delete state.portfolioJourneySkipped;
    else state.portfolioJourneySkipped = true;
    // Explicitly returning to animation also leaves any static anchor target.
    history.replaceState(state, '', animated ? location.pathname + location.search : location.href);
    // Reuse the complete Astro initializer/teardown in both directions. Each
    // mode owns one context and one listener set, with a fresh opening clock.
    scrollTo({ top: 0, behavior: 'instant' });
    initializeJourney();
    viewToggle.focus({ preventScroll: true });
  }, { signal: events.signal });
  supportedDesktop.addEventListener('change', syncViewToggle, { signal: events.signal });
  syncViewToggle();
  const navigateTo = (destination: string, immediate = false) => {
    const trigger = sequence?.scrollTrigger;
    const label = sequence?.labels[destination];
    if (!trigger || label === undefined || !sequence) return;
    const position = trigger.start + (trigger.end - trigger.start) * label / sequence.duration();
    scrollTo({ top: position, behavior: 'instant' });
    if (immediate) {
      ScrollTrigger.update();
      trigger.getTween()?.progress(1);
    }
  };
  destinations.forEach((button) => button.addEventListener('click', () => {
    navigateTo(button.dataset.journeyDestination!);
  }, { signal: events.signal }));
  menu.addEventListener('click', () => {
    if (menuOpen) { closeMenu(true); return; }
    menuOpen = true;
    html.dataset.journeyMenuOpen = '';
    menu.setAttribute('aria-expanded', 'true');
    navigation.inert = false;
    stage.inert = true;
    navigation.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }, { signal: events.signal });
  navigation.addEventListener('click', (event) => {
    if (menuOpen && (event.target as Element).closest('a[href]') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) closeMenu();
  }, { signal: events.signal });
  document.addEventListener('keydown', (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...navigation.querySelectorAll<HTMLElement>('a[href], summary, select, button')].filter((element) => element.getClientRects().length && !element.closest('[inert]'));
      focusable.push(menu);
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus({ preventScroll: true });
    }
  }, { signal: events.signal });
  document.addEventListener('focusin', (event) => {
    if (!sequence || menuOpen) return;
    const target = event.target as HTMLElement;
    // A pointer click on blank content focuses the ancestor main[tabindex=-1].
    // Focus is not consent to skip. Only explicit Skip controls / hash navigation
    // may bypass; keyboard focus reveals its scene without destroying the pin.
    if (!target.matches('a[href], button') || !target.matches(':focus-visible')) return;
    const station = target.closest<HTMLElement>('[data-journey-destination]')?.dataset.journeyDestination;
    if (station && root.hasAttribute('data-camera-focused')) { navigateTo(station, true); return; }
    const rect = target.getBoundingClientRect();
    if (rect.width > 0 && rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight) return;
    const scene = target.closest<HTMLElement>('[data-journey-scene]')?.dataset.journeyScene;
    if (station || scene) navigateTo((station || scene)!, true);
  }, { signal: events.signal });
  // Astro restores scroll before this pin exists. Save the normalized camera
  // position on this history entry before a route click, then restore after pin
  // measurement on Back (also robust when desktop dimensions have changed).
  const rememberCamera = () => {
    if (sequence?.scrollTrigger) history.replaceState({ ...history.state, portfolioJourneyProgress: sequence.scrollTrigger.progress }, '');
  };
  document.addEventListener('click', (event) => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
    const url = new URL(anchor.href, location.href);
    if (url.origin === location.origin && url.pathname !== location.pathname) rememberCamera();
  }, { capture: true, signal: events.signal });
  window.addEventListener('beforeunload', rememberCamera, { signal: events.signal });
  window.addEventListener('hashchange', () => { if (location.hash) bypass(); }, { signal: events.signal });
  document.fonts.ready.then(() => { if (!disposed) refresh(); });
  root.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', refresh, { once: true, signal: events.signal });
  });
  cleanup = () => {
    disposed = true;
    events.abort();
    cancelAnimationFrame(frame); cancelAnimationFrame(fitFrame);
    media.revert();
    toolsSwarm?.dispose();
    closeMenu();
    viewToggle.hidden = true;
  };
}

export function bindHomepageJourney() {
  if (bound) return;
  bound = true;
  document.addEventListener('astro:page-load', initializeJourney, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  if (document.readyState === 'complete') initializeJourney();
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
