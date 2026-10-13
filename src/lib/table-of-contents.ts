let cleanup: (() => void) | undefined;

function initializeTableOfContents() {
  cleanup?.();
  const nav = document.querySelector<HTMLElement>('[data-toc]');
  if (!nav) return;
  const entries = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')).flatMap((link) => {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    return heading ? [{ link, heading, row: link.closest('li')! }] : [];
  });
  if (!entries.length) return;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let frame = 0;
  function update() {
    frame = 0;
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const cursor = window.scrollY + offset;
    const starts = entries.map(({ heading }) => heading.getBoundingClientRect().top + window.scrollY);
    let active = 0;
    starts.forEach((start, index) => { if (cursor + 1 >= start) active = index; });
    const atEnd = window.scrollY + innerHeight >= document.documentElement.scrollHeight - 1;
    if (atEnd) active = entries.length - 1;
    entries.forEach(({ link }, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const last = entries.at(-1)!;
    const lastSection = last.heading.closest('section') || last.heading.parentElement!;
    // Final progress ends at the last reachable reading position, including short sections.
    const end = Math.min(lastSection.getBoundingClientRect().bottom + window.scrollY,
      Math.max(0, document.documentElement.scrollHeight - innerHeight) + offset);
    const limit = starts[active + 1] ?? Math.max(starts[active] + 1, end);
    const fraction = Math.max(0, Math.min(1, (cursor - starts[active]) / (limit - starts[active])));
    const track = nav!.getBoundingClientRect();
    const rowStart = entries[active].row.getBoundingClientRect().top - track.top;
    const rowEnd = entries[active + 1]?.row.getBoundingClientRect().top ?? track.bottom;
    const portion = rowEnd - track.top - rowStart;
    const progress = track.height ? (rowStart + portion * fraction) / track.height : 0;
    nav!.style.setProperty('--toc-progress', String(atEnd ? 1 : Math.max(0, Math.min(1, progress))));
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  document.addEventListener('scroll', schedule, { ...options, passive: true });
  window.addEventListener('resize', schedule, options);
  window.addEventListener('hashchange', schedule, options);
  window.addEventListener('pageshow', schedule, options);
  nav.addEventListener('click', schedule, options);
  const observer = new ResizeObserver(schedule);
  observer.observe(nav);
  const canvas = document.querySelector('#reading-canvas');
  if (canvas) observer.observe(canvas);
  document.fonts.ready.then(() => { if (!controller.signal.aborted) schedule(); });
  update();
  cleanup = () => { controller.abort(); observer.disconnect(); cancelAnimationFrame(frame); };
}

export function bindTableOfContents() {
  initializeTableOfContents();
  document.addEventListener('astro:page-load', initializeTableOfContents);
  document.addEventListener('astro:before-swap', () => cleanup?.());
}
