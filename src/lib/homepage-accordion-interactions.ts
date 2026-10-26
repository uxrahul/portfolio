import { gsap } from 'gsap';
import { createPendantInteraction } from './lira-pendant';
import { initializeToolPopovers } from './homepage-responsive';
import { trackProductOnce, watchPhoneExploration } from './portfolio-analytics';

/** Selection owns interaction lifetime; GSAP's existing width timeline owns settling. */
export function createAccordionInteractions(root: HTMLElement) {
  let selection: string | undefined;
  let mounted = false;
  let dispose: (() => void) | undefined;
  const phoneMemory = { fraction: 0 };
  const release = () => { dispose?.(); dispose = undefined; mounted = false; };
  return {
    prepare(id: string) {
      if (id === selection) return;
      release(); selection = id;
    },
    settle() {
      if (mounted || !selection || !root.hasAttribute('data-accordion-active')) return;
      mounted = true;
      const panel = root.querySelector<HTMLElement>(`[data-accordion-panel="${selection}"]`)!;
      if (selection === 'heir') dispose = enablePhone(panel, phoneMemory);
      else if (selection === 'continuation') dispose = enablePendant(panel);
      else if (selection === 'select-tools') {
        const popover = panel.querySelector<HTMLElement>('#homepage-tool-popover')!;
        popover.tabIndex = 0;
        const closeTools = initializeToolPopovers(panel, { stickySelection: true });
        dispose = () => { closeTools(); popover.removeAttribute('tabindex'); };
      }
    },
    dispose() { release(); selection = undefined; },
  };
}

/** Native wheel/trackpad/keyboard scrolling, plus optional primary-pointer drag.
 * No wheel interception: scroll chains naturally at either screenshot boundary. */
function enablePhone(panel: HTMLElement, memory: { fraction: number }) {
  const aperture = panel.querySelector<HTMLElement>('[data-phone-window]')!;
  const screen = panel.querySelector<HTMLImageElement>('[data-phone-screen]')!;
  const events = new AbortController();
  const resetExploration = watchPhoneExploration(aperture, events.signal);
  const attributes = ['data-phone-native', 'tabindex', 'role', 'aria-label'] as const;
  const original = attributes.map((name) => aperture.getAttribute(name));
  const draggable = screen.getAttribute('draggable');
  const travel = () => Math.max(0, aperture.scrollHeight - aperture.clientHeight);
  const remember = () => { memory.fraction = travel() ? aperture.scrollTop / travel() : 0; };
  let drag: { id: number; y: number; top: number } | undefined;
  const stop = () => {
    const pointer = drag?.id;
    drag = undefined; aperture.removeAttribute('data-phone-dragging');
    if (pointer !== undefined && aperture.hasPointerCapture(pointer)) aperture.releasePointerCapture(pointer);
  };
  aperture.dataset.phoneNative = '';
  aperture.tabIndex = 0;
  aperture.setAttribute('role', 'region');
  aperture.setAttribute('aria-label', 'HEIR app preview. Scroll to explore the screen.');
  screen.draggable = false;
  const measure = () => { if (!drag) { resetExploration(); aperture.scrollTop = memory.fraction * travel(); } };
  measure();
  aperture.addEventListener('scroll', remember, { passive: true, signal: events.signal });
  aperture.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || event.pointerType === 'touch') return;
    event.preventDefault(); aperture.focus({ preventScroll: true });
    drag = { id: event.pointerId, y: event.clientY, top: aperture.scrollTop };
    aperture.setPointerCapture(event.pointerId); aperture.dataset.phoneDragging = '';
  }, { signal: events.signal });
  aperture.addEventListener('pointermove', (event) => {
    if (drag?.id !== event.pointerId) return;
    event.preventDefault(); aperture.scrollTop = drag.top - (event.clientY - drag.y);
  }, { signal: events.signal });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => aperture.addEventListener(name, stop, { signal: events.signal }));
  window.addEventListener('blur', stop, { signal: events.signal });
  const resize = new ResizeObserver(measure);
  resize.observe(aperture); resize.observe(screen);
  screen.addEventListener('load', measure, { signal: events.signal });
  return () => {
    remember(); stop(); events.abort(); resize.disconnect(); aperture.scrollTop = 0;
    attributes.forEach((name, index) => {
      if (original[index] === null) aperture.removeAttribute(name);
      else aperture.setAttribute(name, original[index]!);
    });
    if (draggable === null) screen.removeAttribute('draggable');
    else screen.setAttribute('draggable', draggable);
  };
}

function enablePendant(panel: HTMLElement) {
  const replay = panel.querySelector<HTMLButtonElement>('[data-lira-replay]')!;
  const light = createPendantInteraction(panel)!;
  const events = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clock = { progress: 0 };
  let tween: gsap.core.Tween | undefined;
  const play = () => {
    tween?.kill(); clock.progress = 0;
    if (reduced.matches) { light.render(1); replay.removeAttribute('aria-busy'); return; }
    light.render(0); replay.setAttribute('aria-busy', 'true');
    tween = gsap.to(clock, {
      progress: 1, duration: 1.6, ease: 'power1.inOut',
      onUpdate: () => light.render(clock.progress),
      onComplete: () => { tween = undefined; replay.removeAttribute('aria-busy'); },
    });
  };
  replay.hidden = false;
  replay.addEventListener('click', (event) => {
    play(); trackProductOnce(panel.querySelector<HTMLElement>('[data-lira-pendant]')!, 'lira', 'replay', event);
  }, { signal: events.signal });
  play();
  return () => {
    events.abort(); tween?.kill(); light.reset(); replay.hidden = true;
    replay.removeAttribute('aria-busy');
  };
}
