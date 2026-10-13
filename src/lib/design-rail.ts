let dispose: (() => void) | undefined;
function initializeDesignRails() {
  dispose?.();
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observers: ResizeObserver[] = [];
  document.querySelectorAll<HTMLElement>('[data-design-rail]').forEach((rail) => {
    const viewport = rail.querySelector<HTMLElement>('.design-rail-viewport')!;
    const controls = rail.querySelector<HTMLElement>('.design-rail-controls')!;
    const previous = rail.querySelector<HTMLButtonElement>('[data-rail-previous]')!;
    const next = rail.querySelector<HTMLButtonElement>('[data-rail-next]')!;
    const progress = rail.querySelector<HTMLElement>('[data-rail-progress]')!;
    const maximum = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const update = () => {
      const max = maximum();
      // Keep controls available if focused while a resize removes overflow.
      controls.hidden = max <= 1 && !controls.contains(document.activeElement);
      previous.setAttribute('aria-disabled', String(viewport.scrollLeft <= 1));
      next.setAttribute('aria-disabled', String(viewport.scrollLeft >= max - 1));
      progress.style.transform = `scaleX(${max ? Math.min(1, Math.max(0, viewport.scrollLeft / max)) : 1})`;
    };
    const move = (left: number) => viewport.scrollTo({ left: Math.max(0, Math.min(maximum(), left)), behavior: reduced.matches ? 'instant' : 'smooth' });
    const advance = (direction: number) => move(viewport.scrollLeft + direction * viewport.clientWidth * .75);
    previous.addEventListener('click', () => advance(-1), options);
    next.addEventListener('click', () => advance(1), options);
    viewport.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'Home') move(0);
        else if (event.key === 'End') move(maximum());
        else advance(['ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 1);
      }
    }, options);
    viewport.addEventListener('scroll', update, { ...options, passive: true });
    controls.addEventListener('focusout', update, options);
    reduced.addEventListener('change', () => { if (reduced.matches) viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'instant' }); }, options);
    // Native touch/trackpad scrolling is retained. Mouse dragging adds no snap.
    let pointer: { id: number; x: number; y: number; left: number; mouse: boolean; dragged: boolean } | undefined;
    viewport.addEventListener('pointerdown', (event) => {
      rail.removeAttribute('data-carousel-click-blocked');
      if (event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, mouse: event.pointerType === 'mouse', dragged: false };
    }, options);
    viewport.addEventListener('pointermove', (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      if (Math.hypot(dx, event.clientY - pointer.y) > 8) {
        rail.setAttribute('data-carousel-click-blocked', '');
        pointer.dragged = true;
      }
      if (pointer.mouse && pointer.dragged && maximum() > 1) {
        event.preventDefault();
        viewport.setPointerCapture(event.pointerId);
        rail.classList.add('is-dragging');
        viewport.scrollLeft = pointer.left - dx;
      }
    }, options);
    const release = (event: PointerEvent) => {
      if (pointer && (event.type === 'pointercancel' || Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 8)) {
        rail.setAttribute('data-carousel-click-blocked', '');
      }
      pointer = undefined;
      rail.classList.remove('is-dragging');
    };
    viewport.addEventListener('pointerup', release, options);
    viewport.addEventListener('pointercancel', release, options);
    // Use the existing viewer's click guard without changing its behavior.
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(viewport.firstElementChild!);
    observers.push(observer);
    update();
  });
  dispose = () => { controller.abort(); observers.forEach((observer) => observer.disconnect()); };
}
export function bindDesignRails() {
  initializeDesignRails();
  document.addEventListener('astro:page-load', initializeDesignRails);
  document.addEventListener('astro:before-swap', () => dispose?.());
}
