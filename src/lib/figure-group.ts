import EmblaCarousel from 'embla-carousel';
let dispose: (() => void) | undefined;

function initializeFigureGroups() {
  dispose?.();
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const destroy: (() => void)[] = [];
  const token = getComputedStyle(document.documentElement).getPropertyValue('--figure-motion-duration').trim();
  const milliseconds = parseFloat(token) * (token.endsWith('ms') ? 1 : 1000);
  // Embla uses a physics duration rather than milliseconds; calibrate to the shared token.
  const duration = Math.max(20, Math.min(60, milliseconds / 10));
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((group) => {
    const viewport = group.querySelector<HTMLElement>('.figure-group-viewport');
    const slides = Array.from(group.querySelectorAll<HTMLElement>('[data-figure-slide]'));
    const previous = group.querySelector<HTMLButtonElement>('[data-figure-previous]');
    const next = group.querySelector<HTMLButtonElement>('[data-figure-next]');
    const position = group.querySelector<HTMLElement>('[data-figure-position]');
    const controls = group.querySelector<HTMLElement>('.figure-group-controls');
    if (!viewport || !previous || !next || !position || !controls || slides.length < 2) return;
    group.dataset.enhanced = 'true';
    group.tabIndex = 0;
    group.setAttribute('aria-roledescription', 'carousel');
    group.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End');
    slides.forEach((slide) => {
      slide.setAttribute('aria-roledescription', 'slide');
      slide.querySelector('img')?.setAttribute('draggable', 'false');
    });
    const api = EmblaCarousel(viewport, { loop: false, align: 'start', containScroll: 'trimSnaps', duration, watchFocus: false });
    function measureImage() {
      const trigger = slides[api.selectedScrollSnap()].querySelector<HTMLElement>('.image-trigger');
      if (trigger) group.style.setProperty('--carousel-image-height', `${trigger.getBoundingClientRect().height}px`);
    }
    function update() {
      const active = api.selectedScrollSnap();
      const focusWasInHiddenSlide = slides.some((slide, index) => index !== active && slide.contains(document.activeElement));
      slides.forEach((slide, index) => {
        slide.inert = index !== active;
        slide.setAttribute('aria-hidden', String(index !== active));
      });
      position!.textContent = String(active + 1);
      previous!.setAttribute('aria-disabled', String(!api.canScrollPrev()));
      next!.setAttribute('aria-disabled', String(!api.canScrollNext()));
      if (focusWasInHiddenSlide) slides[active].querySelector<HTMLAnchorElement>('[data-image-viewer]')?.focus({ preventScroll: true });
      measureImage();
    }
    update();
    controls.hidden = false;
    api.on('select', update).on('reInit', update).on('settle', measureImage);
    const observer = new ResizeObserver(measureImage);
    observer.observe(viewport);
    slides.forEach((slide) => {
      const image = slide.querySelector('img');
      if (image) observer.observe(image);
    });
    const navigate = (index: number) => {
      delete group.dataset.carouselClickBlocked;
      api.scrollTo(Math.max(0, Math.min(slides.length - 1, index)), reduced.matches);
    };
    previous.addEventListener('click', () => { if (api.canScrollPrev()) navigate(api.selectedScrollSnap() - 1); }, options);
    next.addEventListener('click', () => { if (api.canScrollNext()) navigate(api.selectedScrollSnap() + 1); }, options);
    group.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const directions: Record<string, number> = { ArrowLeft: api.selectedScrollSnap() - 1, ArrowRight: api.selectedScrollSnap() + 1, Home: 0, End: slides.length - 1 };
      if (!(event.key in directions)) return;
      event.preventDefault();
      navigate(directions[event.key]);
    }, options);
    // Guard the viewer's document-capture listener from mouse drag release clicks.
    let pointer: { id: number; x: number; y: number } | undefined;
    let touch: { x: number; y: number } | undefined;
    const markMovement = (start: { x: number; y: number }, x: number, y: number) => {
      if (Math.abs(x - start.x) > 8 && Math.abs(x - start.x) > Math.abs(y - start.y)) group.dataset.carouselClickBlocked = 'true';
    };
    viewport.addEventListener('pointerdown', (event) => {
      delete group.dataset.carouselClickBlocked;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, options);
    document.addEventListener('pointermove', (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      markMovement(pointer, event.clientX, event.clientY);
    }, { ...options, passive: true });
    document.addEventListener('pointerup', (event) => {
      if (pointer?.id === event.pointerId) markMovement(pointer, event.clientX, event.clientY);
      pointer = undefined;
    }, options);
    document.addEventListener('pointercancel', () => { pointer = undefined; }, options);
    viewport.addEventListener('touchstart', (event) => {
      delete group.dataset.carouselClickBlocked;
      touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined;
    }, { ...options, passive: true });
    viewport.addEventListener('touchmove', (event) => {
      if (touch && event.touches.length === 1) markMovement(touch, event.touches[0].clientX, event.touches[0].clientY);
    }, { ...options, passive: true });
    document.addEventListener('touchend', (event) => {
      if (touch && event.changedTouches.length) markMovement(touch, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      touch = undefined;
    }, options);
    api.on('pointerDown', () => group.classList.add('is-dragging'));
    api.on('pointerUp', () => {
      group.classList.remove('is-dragging');
      if (reduced.matches) queueMicrotask(() => { if (!controller.signal.aborted) api.scrollTo(api.selectedScrollSnap(), true); });
    });
    // Handle deliberate horizontal wheel gestures only. Vertical scrolling and
    // pinch zoom remain native; at boundaries horizontal events are released too.
    let wheelDelta = 0, wheelLast = 0, wheelNavigation = 0;
    viewport.addEventListener('wheel', (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const forward = event.deltaX > 0;
      if (forward ? !api.canScrollNext() : !api.canScrollPrev()) return;
      const now = performance.now();
      if (now - wheelLast > 160 || Math.sign(wheelDelta) !== Math.sign(event.deltaX)) wheelDelta = 0;
      wheelLast = now;
      wheelDelta += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1);
      event.preventDefault();
      if (Math.abs(wheelDelta) >= 40 && now - wheelNavigation > 450) {
        navigate(api.selectedScrollSnap() + (forward ? 1 : -1));
        wheelNavigation = now; wheelDelta = 0;
      }
    }, { ...options, passive: false });
    reduced.addEventListener('change', () => { if (reduced.matches) api.scrollTo(api.selectedScrollSnap(), true); }, options);
    destroy.push(() => {
      observer.disconnect(); api.destroy();
      delete group.dataset.enhanced;
      slides.forEach((slide) => { slide.inert = false; slide.removeAttribute('aria-hidden'); });
    });
  });
  dispose = () => { controller.abort(); destroy.forEach((cleanup) => cleanup()); };
}
export function bindFigureGroups() {
  initializeFigureGroups();
  document.addEventListener('astro:page-load', initializeFigureGroups);
  document.addEventListener('astro:before-swap', () => dispose?.());
}
