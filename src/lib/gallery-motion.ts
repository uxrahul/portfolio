let dispose: (() => void) | undefined;
function initializeGalleryMotion() {
  dispose?.();
  const controller = new AbortController();
  const animations = new Map<HTMLElement, Animation>();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tokens = getComputedStyle(document.documentElement);
  const durationValue = tokens.getPropertyValue('--motion-duration-section').trim();
  const duration = parseFloat(durationValue) * (durationValue.endsWith('ms') ? 1 : 1000);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const element = entry.target as HTMLElement;
      const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (reduced.matches || element.contains(document.activeElement) || (target && (element.contains(target) || element.closest('.gallery-chapter')?.contains(target)))) continue;
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${tokens.getPropertyValue('--motion-distance-section').trim()})` },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration, delay: element.matches('.has-references .design-rail') ? 90 : 0, easing: tokens.getPropertyValue('--motion-ease-enter').trim(), fill: 'backwards' });
      animations.set(element, animation);
      animation.onfinish = () => { animation.cancel(); animations.delete(element); };
    }
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll<HTMLElement>('[data-gallery-reveal]').forEach((element) => observer.observe(element));
  const cancel = () => { animations.forEach((animation) => animation.cancel()); animations.clear(); };
  document.addEventListener('focusin', cancel, { signal: controller.signal });
  window.addEventListener('hashchange', cancel, { signal: controller.signal });
  reduced.addEventListener('change', cancel, { signal: controller.signal });
  dispose = () => { observer.disconnect(); controller.abort(); cancel(); };
}
export function bindGalleryMotion() {
  initializeGalleryMotion();
  document.addEventListener('astro:page-load', initializeGalleryMotion);
  document.addEventListener('astro:before-swap', () => dispose?.());
}
