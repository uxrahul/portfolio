/** Shared by the parser-time presentation and GSAP; keep one source of geometry. */
export const accordionDesktopQuery = '(min-width: 1200px) and (min-height: 600px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function measureAccordion(root: HTMLElement, capture = (element: HTMLElement) => element) {
  const html = document.documentElement;
  const stage = root.querySelector<HTMLElement>('[data-accordion-stage]')!;
  const panels = [...root.querySelectorAll<HTMLElement>('[data-accordion-panel]')];
  const rem = parseFloat(getComputedStyle(html).fontSize);
  const available = stage.clientWidth - parseFloat(getComputedStyle(stage).gap) * (panels.length - 1);
  // Keep both the open reading composition and all four labels usable.
  if (!Number.isFinite(available) || available < 37.5 * rem + 4 * 6.5 * rem) return undefined;
  const preferredWidths = panels.map((panel) => {
    const width = Math.max(Number(panel.dataset.minWidthRem) * rem,
      Math.min(available * Number(panel.dataset.preferredWidth), available - 4 * 6.5 * rem,
        panel.dataset.maxWidthRem ? Number(panel.dataset.maxWidthRem) * rem : Infinity));
    capture(panel).style.setProperty('--accordion-expanded-width', `${width}px`);
    return width;
  });
  return { availableWidth: available, preferredWidths };
}

export function accordionPoses(root: HTMLElement, active: number,
  geometry: { availableWidth: number; preferredWidths: number[] },
  capture = (element: HTMLElement) => element) {
  const stage = root.querySelector<HTMLElement>('[data-accordion-stage]')!;
  const panels = [...root.querySelectorAll<HTMLElement>('[data-accordion-panel]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-accordion-select]')];
  const contents = [...root.querySelectorAll<HTMLElement>('[data-accordion-content]')];
  const { availableWidth, preferredWidths } = geometry;
  const expandedWidth = preferredWidths[active];
  const collapsedWidth = (availableWidth - expandedWidth) / 4;
  const poses: { targets: HTMLElement | HTMLElement[]; vars: Record<string, number>; at: number }[] = [];
  const move = (targets: HTMLElement | HTMLElement[], vars: Record<string, number>, at = 0) => { poses.push({ targets, vars, at }); };
  panels.forEach((panel, index) => {
    const selected = index === active;
    const contentWidth = preferredWidths[index];
    capture(panel);
    panel.toggleAttribute('data-active', selected);
    buttons[index].setAttribute('aria-expanded', String(selected));
    contents[index].inert = !selected;
    move(panel, { width: selected ? expandedWidth : collapsedWidth });
    const copies = [...panel.querySelectorAll<HTMLElement>('.homepage-hero-copy, .journey-project-copy, .journey-project > .homepage-label, .work-deck-cover, .homepage-stage-description, .homepage-tool-section > .homepage-label')];
    copies.forEach(capture);
    if (copies.length) move(copies, { autoAlpha: selected ? 1 : 0, y: selected ? 0 : 12, duration: selected ? .28 : .12 }, selected ? .18 : 0);
    const portrait = panel.querySelector<HTMLElement>('.homepage-portrait');
    if (portrait) {
      capture(portrait);
      // Fill the visible cover; its lower content continues on the same scrim.
      move(portrait, { width: selected ? contentWidth : collapsedWidth * 1.25,
        height: stage.clientHeight, x: 0, y: 0 });
    }
    const product = panel.querySelector<HTMLElement>('[data-phone-showcase], [data-lira-pendant]');
    if (product) {
      capture(product);
      const padding = parseFloat(getComputedStyle(panel.querySelector<HTMLElement>('.journey-project')!).paddingLeft);
      const previewScale = Math.min(1.8, stage.clientHeight * .76 / product.offsetHeight);
      move(product, { xPercent: -50, scale: selected ? 1 : previewScale,
        y: selected ? 0 : (stage.clientHeight - product.offsetHeight) / 2 - padding - 18 });
    }
    const cards = [...panel.querySelectorAll<HTMLElement>('.homepage-stage')];
    const list = panel.querySelector<HTMLElement>('.homepage-stages');
    if (list) cards.forEach((card, cardIndex) => {
      capture(card);
      move(card, { x: selected ? 0 : list.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2 + (cardIndex - 1) * 32,
        y: selected ? 0 : (stage.clientHeight - card.offsetHeight) / 2 - list.offsetTop + (cardIndex - 1) * 48,
        rotation: selected ? 0 : (cardIndex - 1) * 8, scale: 1 });
    });
    const tools = panel.querySelector<HTMLElement>('.homepage-tools');
    if (tools) {
      capture(tools);
      const inset = parseFloat(getComputedStyle(tools.parentElement!.parentElement!).paddingLeft);
      const gridWidth = Math.min(contentWidth - inset * 2, 360);
      const previewWidth = Math.min(gridWidth, 200);
      move(tools, { width: selected ? gridWidth : previewWidth,
        x: (contentWidth - inset * 2 - (selected ? gridWidth : previewWidth)) / 2,
        rotation: selected ? 0 : -10, scale: selected ? 1 : 1.15,
        y: selected ? 0 : stage.clientHeight * .18 - tools.offsetTop });
      const labels = [...tools.querySelectorAll<HTMLElement>('.homepage-tool-select > span:last-child')];
      labels.forEach(capture);
      move(labels, { autoAlpha: selected ? 1 : 0, duration: .2 }, selected ? .18 : 0);
    }
  });
  return poses;
}
