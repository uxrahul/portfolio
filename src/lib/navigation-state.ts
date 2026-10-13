const storageKey = 'portfolio-navigation-groups';
let cleanup: (() => void) | undefined;
export function initializeNavigation() {
  cleanup?.();
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map<HTMLDetailsElement, Animation>();
  const finishers = new Map<HTMLDetailsElement, () => void>();
  let saved: Record<string, boolean> = {};
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch { /* Storage is optional. */ }
  document.querySelectorAll<HTMLDetailsElement>('details[data-nav-group]').forEach((group) => {
    const id = group.dataset.navGroup!;
    const summary = group.querySelector<HTMLElement>(':scope > summary');
    const content = group.querySelector<HTMLElement>(':scope > .nav-submenu');
    if (!summary || !content) return;
    if (typeof saved[id] === 'boolean') group.open = saved[id];
    let expanded = group.open;
    group.dataset.expanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    content.inert = !expanded;
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const from = group.open ? content.getBoundingClientRect().height : 0;
      animations.get(group)?.cancel();
      expanded = !expanded;
      group.dataset.expanded = String(expanded);
      summary.setAttribute('aria-expanded', String(expanded));
      if (!expanded && content.contains(document.activeElement)) summary.focus();
      content.inert = !expanded;
      group.open = true; // Keep native details visible until closing motion finishes.
      saved[id] = expanded;
      try { sessionStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* Optional storage. */ }
      const finish = () => {
        group.open = expanded;
        animations.get(group)?.cancel();
        animations.delete(group);
        finishers.delete(group);
        content.style.removeProperty('overflow');
      };
      if (reduced.matches) { finish(); return; }
      const tokens = getComputedStyle(document.documentElement);
      const durationToken = tokens.getPropertyValue('--motion-duration-navigation').trim();
      const duration = parseFloat(durationToken) * (durationToken.endsWith('ms') ? 1 : 1000);
      content.style.overflow = 'clip';
      const animation = content.animate(
        { height: [`${from}px`, `${expanded ? content.scrollHeight : 0}px`] },
        { duration, easing: tokens.getPropertyValue('--motion-ease-standard').trim(), fill: 'both' },
      );
      animations.set(group, animation);
      finishers.set(group, finish);
      animation.onfinish = finish;
    }, { signal: controller.signal });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) [...finishers.values()].forEach((finish) => finish());
  }, { signal: controller.signal });
  cleanup = () => {
    [...finishers.values()].forEach((finish) => finish());
    controller.abort();
  };
}
document.addEventListener('astro:before-swap', () => cleanup?.());
