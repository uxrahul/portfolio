let cleanup: (() => void) | undefined;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function initializeHomepageMotion() {
  cleanup?.();
  const home = document.querySelector<HTMLElement>('[data-homepage]');
  if (!home) return;
  const controller = new AbortController();
  const animations = new Set<Animation>();
  home.addEventListener('focusin', (event) => {
    animations.forEach((animation) => {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      if (target instanceof Element && target.contains(event.target as Node)) animation.cancel();
    });
  }, { signal: controller.signal });
  const stages = [...home.querySelectorAll<HTMLElement>('[data-home-stage]')];
  let frame = 0;
  let observer: IntersectionObserver | undefined;
  const animate = (element: HTMLElement, delay: number) => {
    if (reducedMotion.matches || element.contains(document.activeElement) || location.hash) return;
    const styles = getComputedStyle(home);
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(var(--motion-distance-section))' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: parseFloat(styles.getPropertyValue('--motion-duration-section')) || 400,
      easing: styles.getPropertyValue('--motion-ease-enter').trim(), delay, fill: 'backwards' });
    animations.add(animation);
    animation.addEventListener('finish', () => animations.delete(animation), { once: true });
  };
  const updateStages = () => {
    frame = 0;
    const center = innerHeight * 0.52;
    let closest = -1;
    let distance = Infinity;
    stages.forEach((stage, index) => {
      const rect = stage.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const nextDistance = Math.abs(rect.top + rect.height / 2 - center);
      if (nextDistance < distance) { distance = nextDistance; closest = index; }
    });
    stages.forEach((stage, index) => {
      if (index === closest) stage.dataset.active = 'true';
      else stage.removeAttribute('data-active');
    });
  };
  if (!reducedMotion.matches) {
    home.querySelectorAll<HTMLElement>('[data-home-entrance]').forEach((element, index) => animate(element, index * 90));
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          animate(entry.target as HTMLElement, Math.min(index * 70, 210));
          observer?.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
      home.querySelectorAll('[data-home-reveal]').forEach((element) => observer!.observe(element));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateStages); };
    window.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
    window.addEventListener('resize', schedule, { passive: true, signal: controller.signal });
    updateStages();
  }
  cleanup = () => {
    controller.abort(); observer?.disconnect(); cancelAnimationFrame(frame);
    animations.forEach((animation) => animation.cancel());
    stages.forEach((stage) => stage.removeAttribute('data-active'));
  };
}

export function bindHomepageMotion() {
  initializeHomepageMotion();
  document.addEventListener('astro:page-load', initializeHomepageMotion);
  document.addEventListener('astro:before-swap', () => cleanup?.());
  reducedMotion.addEventListener('change', initializeHomepageMotion);
}
