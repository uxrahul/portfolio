let observer: IntersectionObserver | undefined;
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initializeSectionMotion() {
  observer?.disconnect();
  document.querySelectorAll<HTMLElement>('[data-case-section], [data-section-reveal]').forEach((section) => {
    section.removeAttribute('data-entering');
    section.removeAttribute('data-entered');
  });
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target as HTMLElement;
      section.dataset.entered = 'true';
      // Anchor targets should be immediately usable and should not move under focus.
      if (location.hash !== `#${section.dataset.headingId}`) {
        section.dataset.entering = 'true';
        section.addEventListener('animationend', () => section.removeAttribute('data-entering'), { once: true });
      }
      observer?.unobserve(section);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-case-section], [data-section-reveal]').forEach((section) => observer!.observe(section));
}

export function bindSectionMotion() {
  initializeSectionMotion();
  document.addEventListener('astro:page-load', initializeSectionMotion);
  document.addEventListener('astro:before-swap', () => observer?.disconnect());
  preference.addEventListener('change', initializeSectionMotion);
}
