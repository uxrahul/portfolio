import type { measureAccordion, accordionPoses } from './homepage-accordion-presentation';

/** Inlined after the story markup: draw the shared initial pose without waiting
 * for GSAP's deferred module. No hiding, loading screen or animation is needed. */
export function primeAccordion(query: string, measure: typeof measureAccordion, poses: typeof accordionPoses) {
  const root = document.querySelector<HTMLElement>('[data-home-journey][data-home-accordion]');
  if (!root || root.hasAttribute('data-accordion-selection')) return;
  const html = document.documentElement;
  if (!matchMedia(query).matches || location.hash || history.state?.portfolioJourneySkipped) {
    html.removeAttribute('data-home-accordion');
    return;
  }
  const originals = new Map<HTMLElement, [string, string][]>();
  let pending = true;
  const capture = (element: HTMLElement) => {
    if (!originals.has(element)) originals.set(element, [...element.attributes].map(({ name, value }) => [name, value]));
    return element;
  };
  const restore = (releaseMode = true) => {
    pending = false;
    originals.forEach((attributes, element) => {
      [...element.attributes].forEach(({ name }) => element.removeAttribute(name));
      attributes.forEach(([name, value]) => element.setAttribute(name, value));
    });
    if (releaseMode) html.removeAttribute('data-home-accordion');
  };
  try {
    capture(root);
    root.dataset.journeyActive = ''; root.dataset.accordionActive = '';
    html.dataset.homeAccordion = '';
    root.querySelectorAll<HTMLElement>('[data-accordion-panel], [data-accordion-content], [data-accordion-select]').forEach(capture);
    const draw = () => {
      const geometry = measure(root, capture);
      if (!geometry) { restore(); return; }
      poses(root, 0, geometry, capture).forEach(({ targets, vars }) => {
        (Array.isArray(targets) ? targets : [targets]).forEach((element) => {
          capture(element);
          // Match CSSPlugin's default autoRound for pixel dimensions.
          if (vars.width !== undefined) element.style.width = `${Math.round(vars.width)}px`;
          if (vars.height !== undefined) element.style.height = `${Math.round(vars.height)}px`;
          if (vars.autoAlpha !== undefined) {
            element.style.opacity = String(vars.autoAlpha);
            element.style.visibility = vars.autoAlpha ? 'inherit' : 'hidden';
          }
          if (['x', 'y', 'xPercent', 'rotation', 'scale'].some((key) => key in vars)) {
            element.style.transform = `translate(${vars.xPercent ?? 0}%, 0%) translate(${vars.x ?? 0}px, ${vars.y ?? 0}px) rotate(${vars.rotation ?? 0}deg) scale(${vars.scale ?? 1})`;
          }
        });
      });
    };
    draw();
    if (!pending) return;
    root.querySelectorAll<HTMLButtonElement>('[data-accordion-select]').forEach((button) => { button.hidden = false; });
    const toggle = capture(root.querySelector<HTMLButtonElement>('[data-journey-view-toggle]')!) as HTMLButtonElement;
    toggle.hidden = false;
    const navigation = document.querySelector<HTMLElement>('[data-global-navigation]')!;
    capture(navigation).inert = true;
    // Match the controller's existing font-ready measurement during bundle load.
    document.fonts.ready.then(() => { if (pending) draw(); }).catch(() => restore());
    // The controller releases the temporary snapshot and takes ownership in the
    // same task, so switching to Standard restores the original authored styles.
    root.addEventListener('homepage:initialize-accordion', () => restore(false), { once: true });
  } catch {
    restore(); // Keep the readable Standard fallback if enhancement is unavailable.
  }
}
