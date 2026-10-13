let dispose: (() => void) | undefined;
function initializeImageViewer() {
  dispose?.();
  const dialog = document.querySelector<HTMLDialogElement>('.image-viewer');
  const image = dialog?.querySelector<HTMLImageElement>('[data-viewer-image]');
  const caption = dialog?.querySelector<HTMLElement>('.viewer-caption');
  const zoom = dialog?.querySelector<HTMLButtonElement>('[data-viewer-zoom]');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-viewer-close]');
  if (!dialog || !image || !caption || !zoom || !close) return;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let opener: HTMLAnchorElement | null = null;
  let previousOverflow = '';
  const viewport = dialog.querySelector<HTMLElement>('.viewer-viewport')!;
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-image-viewer]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    // A drag release is not an enlargement click. The next pointer press clears the guard.
    if (event.detail !== 0 && link.closest('[data-carousel-click-blocked]')) { event.preventDefault(); return; }
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || '';
    image.style.setProperty('--original-image-width', `${link.dataset.width}px`);
    caption.textContent = link.dataset.caption || image.alt;
    dialog.classList.remove('is-zoomed');
    zoom.textContent = 'View at 100%'; zoom.setAttribute('aria-pressed', 'false');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    viewport.scrollTo(0, 0);
    close.focus();
  }, { ...options, capture: true });
  close.addEventListener('click', () => dialog.close(), options);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }, options);
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  }, options);
  zoom.addEventListener('click', () => {
    const enlarged = dialog.classList.toggle('is-zoomed');
    zoom.textContent = enlarged ? 'Fit image' : 'View at 100%';
    zoom.setAttribute('aria-pressed', String(enlarged));
    viewport.scrollTo(0, 0);
  }, options);
  dispose = () => { if (dialog.open) dialog.close(); controller.abort(); };
}
export function bindImageViewer() {
  initializeImageViewer();
  document.addEventListener('astro:page-load', initializeImageViewer);
  document.addEventListener('astro:before-swap', () => dispose?.());
}
