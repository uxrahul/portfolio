import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let preference = 'auto';
function applyTheme(root = document.documentElement) {
  try { preference = localStorage.getItem('portfolio-theme') || 'auto'; } catch { /* Optional storage. */ }
  root.dataset.theme = preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference;
}
let cleanup: (() => void) | undefined;
function initializeShell() {
  cleanup?.();
  applyTheme();
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const select = document.querySelector<HTMLSelectElement>('#theme-preference');
  if (select) {
    select.value = preference;
    select.addEventListener('change', () => {
      preference = select.value;
      try { localStorage.setItem('portfolio-theme', preference); } catch { /* Optional storage. */ }
      document.documentElement.dataset.theme = preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference;
    }, options);
  }
  const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const navigation = document.querySelector<HTMLElement>('#global-navigation');
  const backdrop = document.querySelector<HTMLButtonElement>('.menu-backdrop');
  const narrow = matchMedia('(max-width: 899px)');
  const main = document.querySelector<HTMLElement>('.reading-region');
  const headerIdentity = document.querySelector<HTMLElement>('.mobile-header .identity');
  let previousOverflow = '';
  function closeMenu(returnFocus = true) {
    if (menu?.getAttribute('aria-expanded') !== 'true') return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = previousOverflow;
    if (backdrop) backdrop.inert = true;
    if (headerIdentity) headerIdentity.inert = false;
    if (main) main.inert = false;
    if (navigation) navigation.inert = narrow.matches;
    if (returnFocus) menu.focus();
  }
  function setNavigationAccess() {
    if (!narrow.matches) closeMenu(false);
    if (navigation) navigation.inert = narrow.matches && menu?.getAttribute('aria-expanded') !== 'true';
    if (backdrop) backdrop.inert = menu?.getAttribute('aria-expanded') !== 'true';
  }
  setNavigationAccess();
  narrow.addEventListener('change', setNavigationAccess, options);
  menu?.addEventListener('click', () => {
    if (menu.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
    previousOverflow = document.body.style.overflow;
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    if (navigation) navigation.inert = false;
    if (main) main.inert = true;
    if (backdrop) backdrop.inert = false;
    if (headerIdentity) headerIdentity.inert = true;
    navigation?.querySelector<HTMLElement>('nav a, nav summary')?.focus();
  }, options);
  backdrop?.addEventListener('click', () => closeMenu(), options);
  navigation?.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) closeMenu(false);
  }, options);
  document.addEventListener('keydown', (event) => {
    if (menu?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { closeMenu(); return; }
    if (event.key !== 'Tab' || !navigation) return;
    const focusable = [menu, ...Array.from(navigation.querySelectorAll<HTMLElement>('a, summary, select')).filter((item) => item.getClientRects().length > 0 && !item.closest('[inert]'))];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }, options);
  const disclosure = document.querySelector<HTMLDetailsElement>('.toc-disclosure');
  const compactToc = matchMedia('(max-width: 1199px)');
  const updateToc = () => { if (disclosure) disclosure.open = !compactToc.matches; };
  updateToc();
  compactToc.addEventListener('change', updateToc, options);
  document.querySelector('[data-toc]')?.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link) return;
    if (narrow.matches && disclosure) disclosure.open = false;
  }, options);
  cleanup = () => { closeMenu(false); controller.abort(); };
}
export function bindShell() {
  initializeShell();
  document.addEventListener('astro:page-load', initializeShell);
  document.addEventListener('astro:before-swap', (event) => {
    cleanup?.();
    applyTheme((event as TransitionBeforeSwapEvent).newDocument.documentElement);
  });
  systemTheme.addEventListener('change', () => { if (preference === 'auto') applyTheme(); });
}
