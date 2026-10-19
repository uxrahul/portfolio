// Shared contextual descriptions for all naturally scrolling homepage modes.
let cleanup: (() => void) | undefined;
let bound = false;
const lifecycle = new AbortController();

function initializeResponsiveHomepage() {
  cleanup?.();
  cleanup = undefined;
  const root = document.querySelector<HTMLElement>('[data-home-journey]');
  if (!root) return;
  const events = new AbortController();
  let disposeMode: (() => void) | undefined;
  let mode = '';
  const sync = () => {
    const next = root.hasAttribute('data-journey-active') ? 'off' : 'contextual';
    if (next === mode) return;
    disposeMode?.();
    disposeMode = undefined;
    mode = next;
    if (mode === 'off') return;
    const disposeTools = initializeToolPopovers(root);
    disposeMode = disposeTools;
  };
  const camera = new MutationObserver(sync);
  camera.observe(root, { attributes: true, attributeFilter: ['data-journey-active'] });
  sync();
  cleanup = () => { events.abort(); camera.disconnect(); disposeMode?.(); };
}

function initializeToolPopovers(root: HTMLElement) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-tool-select]')];
  const panel = root.querySelector<HTMLElement>('#homepage-tool-popover')!;
  if (typeof panel.showPopover !== 'function') return () => {};
  const details = [...panel.querySelectorAll<HTMLElement>('[data-tool-context]')];
  const events = new AbortController();
  let selected: number | undefined;
  let focusPreview = false;
  let frame = 0;
  let dismissTimer: ReturnType<typeof setTimeout> | undefined;
  const cancelDismiss = () => { clearTimeout(dismissTimer); };
  const open = () => panel.matches(':popover-open');
  const clear = () => {
    buttons.forEach((button) => { button.setAttribute('aria-expanded', 'false'); button.removeAttribute('aria-describedby'); });
    selected = undefined; focusPreview = false;
  };
  const close = (restoreFocus = false) => {
    cancelDismiss();
    const button = selected === undefined ? undefined : buttons[selected];
    if (open()) panel.hidePopover();
    clear();
    if (restoreFocus) button?.focus({ preventScroll: true });
  };
  const position = () => {
    frame = 0;
    if (selected === undefined || !open()) return;
    const anchor = buttons[selected].getBoundingClientRect();
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft ?? 0, top = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? innerWidth, height = viewport?.height ?? innerHeight;
    const edge = 16, gap = 8;
    if (anchor.bottom < top || anchor.top > top + height) { close(); return; }
    panel.style.width = `${Math.min(352, width - edge * 2)}px`;
    panel.style.maxHeight = `${Math.max(1, height - edge * 2)}px`;
    const box = panel.getBoundingClientRect();
    const above = anchor.top - top - gap - edge;
    const below = top + height - anchor.bottom - gap - edge;
    const y = below >= box.height || below >= above ? anchor.bottom + gap : anchor.top - gap - box.height;
    panel.style.left = `${Math.max(left + edge, Math.min(anchor.left, left + width - box.width - edge))}px`;
    panel.style.top = `${Math.max(top + edge, Math.min(y, top + height - box.height - edge))}px`;
  };
  const schedule = () => { if (!frame && open()) frame = requestAnimationFrame(position); };
  const select = (index: number, preview = false) => {
    cancelDismiss();
    selected = index; focusPreview = preview;
    details.forEach((detail, i) => { detail.hidden = i !== index; });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-expanded', String(i === index));
      if (i === index) button.setAttribute('aria-describedby', `tool-context-description-${index}`);
      else button.removeAttribute('aria-describedby');
    });
    panel.setAttribute('aria-labelledby', `tool-context-name-${index}`);
    if (!open()) panel.showPopover();
    position();
  };
  const leave = () => {
    cancelDismiss();
    // Bridge the eight-pixel anchor gap. A clicked selection stays until dismissed.
    if (focusPreview) dismissTimer = setTimeout(() => {
      if (!panel.matches(':hover') && !buttons.some((button) => button.matches(':hover, :focus-visible'))) close();
    }, 180);
  };
  panel.addEventListener('pointerenter', cancelDismiss, { signal: events.signal });
  panel.addEventListener('pointerleave', leave, { signal: events.signal });
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) select(index, true);
    }, { signal: events.signal });
    button.addEventListener('pointerleave', leave, { signal: events.signal });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) select(index, true);
    }, { signal: events.signal });
    button.addEventListener('click', () => {
      if (selected === index && open() && !focusPreview) close();
      else select(index);
    }, { signal: events.signal });
  });
  // Native auto-popover supplies outside-tap and Escape light dismissal, without
  // a backdrop, focus trap, scroll lock or modal semantics.
  panel.addEventListener('toggle', () => { if (!open()) clear(); }, { signal: events.signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open()) { event.preventDefault(); close(true); }
  }, { signal: events.signal });
  document.addEventListener('scroll', schedule, { passive: true, capture: true, signal: events.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: events.signal });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true, signal: events.signal });
  window.visualViewport?.addEventListener('scroll', schedule, { passive: true, signal: events.signal });
  return () => {
    events.abort(); cancelDismiss(); cancelAnimationFrame(frame); close();
    buttons.forEach((button) => { button.disabled = true; });
    details.forEach((detail) => { detail.hidden = true; });
    panel.removeAttribute('style'); panel.removeAttribute('aria-labelledby');
  };
}

export function bindResponsiveHomepage() {
  if (bound) return;
  bound = true;
  document.addEventListener('astro:page-load', initializeResponsiveHomepage, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', () => cleanup?.(), { signal: lifecycle.signal });
  if (document.readyState === 'complete') initializeResponsiveHomepage();
  if (import.meta.hot) import.meta.hot.dispose(() => { cleanup?.(); lifecycle.abort(); bound = false; });
}
