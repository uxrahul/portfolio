import { gsap } from 'gsap';

/** Threshold is a fraction of the existing interaction window; times are seconds. */
export const workDeckMotion = {
  revealThreshold: 0.08, duration: 0.72, edge: 12,
  rotations: [-3, 2.5, -1.5], surfaceDuration: 0.14,
  headingDuration: 0.58, textStart: 0.24, textDuration: 0.22,
};

/** One time-based content transition, triggered by the master camera's clock.
 * The semantic heading and card content each exist once, including in fallback. */
export function createWorkDeckInteraction(root: HTMLElement) {
  const deck = root.querySelector<HTMLElement>('[data-work-deck]');
  if (!deck) return;
  const cover = deck.querySelector<HTMLElement>('.work-deck-cover')!;
  const surface = deck.querySelector<HTMLElement>('.work-cover-surface')!;
  const label = deck.querySelector<HTMLElement>('.work-cover-label')!;
  const identifier = deck.querySelector<HTMLElement>('.work-deck-identifier')!;
  const heading = deck.querySelector<HTMLElement>('#how-i-work')!;
  const list = deck.querySelector<HTMLElement>('.homepage-stages')!;
  const cards = [...list.querySelectorAll<HTMLElement>('.homepage-stage')];
  const contents = cards.map((card) => card.querySelector<HTMLElement>('.work-card-content')!);
  const elements = [surface, label, identifier, heading, ...cards, ...contents];
  const originalStyles = elements.map((element) => element.getAttribute('style'));
  let timeline: gsap.core.Timeline | undefined;
  let expanded = false;
  return {
    measure() {
      const progress = timeline?.progress() ?? 0;
      timeline?.kill();
      // Use layout dimensions: camera transforms must never affect card geometry.
      const width = deck.clientWidth, cardWidth = cards[0].offsetWidth, cardHeight = cards[0].offsetHeight;
      const padding = parseFloat(getComputedStyle(cards[0]).paddingLeft);
      const left = (width - cardWidth) / 2;
      const top = (deck.clientHeight - cardHeight - workDeckMotion.edge * cards.length) / 2;
      gsap.set(surface, { x: left, y: top - cover.offsetTop, width: cardWidth, height: cardHeight, opacity: 1 });
      gsap.set(label, { x: left + padding, y: top + cardHeight * .27 - cover.offsetTop, opacity: 1 });
      gsap.set(identifier, { opacity: 0 });
      gsap.set(heading, { x: left + padding, y: top + cardHeight * .4 - cover.offsetTop - heading.offsetTop, scale: (cardWidth - padding * 2) / heading.offsetWidth });
      gsap.set(contents, { opacity: 0 });
      cards.forEach((card, index) => gsap.set(card, {
        x: left - card.offsetLeft, y: top - list.offsetTop + workDeckMotion.edge * (index + 1),
        rotation: workDeckMotion.rotations[index], zIndex: cards.length - index,
      }));
      timeline = gsap.timeline({ paused: true });
      timeline.to(cards, { x: 0, y: 0, rotation: 0, duration: workDeckMotion.duration, ease: 'power3.inOut' }, 0)
        // Remove the surface promptly in place; never stretch a translucent
        // rectangle across the revealed content. The same live heading lifts out.
        .to(surface, { y: top - cover.offsetTop - 12, opacity: 0, duration: workDeckMotion.surfaceDuration, ease: 'power1.out' }, 0)
        .to(heading, { x: 0, y: 0, scale: 1, duration: workDeckMotion.headingDuration, ease: 'power3.out' }, 0)
        .to(label, { opacity: 0, duration: .1, ease: 'power1.out' }, 0)
        .to(identifier, { opacity: 1, duration: .18, ease: 'power1.inOut' }, .24)
        .to(contents, { opacity: 1, duration: workDeckMotion.textDuration, ease: 'power1.inOut' }, workDeckMotion.textStart);
      timeline.progress(progress, true);
      // Refresh preserves the playhead and direction, including mid-transition.
      if (expanded && progress < 1) timeline.play();
      else if (!expanded && progress > 0) timeline.reverse();
    },
    render(interactionProgress: number) {
      const next = interactionProgress >= workDeckMotion.revealThreshold;
      if (next === expanded) return;
      expanded = next;
      // Only threshold crossings change direction. Stopping the wheel cannot
      // pause this transition; rapid recrossings reverse from the current frame.
      if (expanded) timeline?.play();
      else timeline?.reverse();
    },
    reset() {
      timeline?.kill(); timeline = undefined; expanded = false;
      elements.forEach((element, index) => {
        const original = originalStyles[index];
        if (original === null) element.removeAttribute('style');
        else element.setAttribute('style', original);
      });
    },
  };
}
