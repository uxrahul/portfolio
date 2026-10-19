import { createSwarmParticles, stepSwarm, type SwarmParticle } from './tool-swarm-physics';

/** Pointer/keyboard interaction only. Scroll controls scene visibility, not bodies. */
export function createToolSwarm(root: HTMLElement) {
  const swarm = root.querySelector<HTMLElement>('[data-tool-swarm]');
  if (!swarm) return;
  const field = swarm.querySelector<HTMLElement>('[data-tool-field]')!;
  const stage = root.querySelector<HTMLElement>('[data-journey-stage]')!;
  const buttons = [...field.querySelectorAll<HTMLButtonElement>('[data-tool-bubble]')];
  const invitation = swarm.querySelector<HTMLElement>('[data-tool-invitation]')!;
  const details = [...swarm.querySelectorAll<HTMLElement>('.tool-swarm-detail')];
  const events = new AbortController();
  let nodes: SwarmParticle[] = [], width = 0, height = 0, frame = 0, lastTime = 0;
  let requested = false, visible = false, disposed = false;
  let active: number | undefined, selected: number | undefined;
  let panelAnimation: Animation | undefined;
  const paint = () => nodes.forEach((node, index) => {
    buttons[index].style.transform = `translate3d(${node.x - node.baseRadius}px, ${node.y - node.baseRadius}px, 0) scale(${node.scale})`;
  });
  const canRun = () => requested && visible && !stage.inert && !document.hidden && !disposed && root.hasAttribute('data-journey-active');
  const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; swarm.removeAttribute('data-swarm-running'); };
  const tick = (time: number) => {
    frame = 0;
    if (!canRun()) { stop(); return; }
    stepSwarm(nodes, width, height, active, time / 1000, lastTime ? (time - lastTime) / 1000 : 1 / 60);
    lastTime = time; paint();
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!frame && nodes.length && canRun()) { swarm.dataset.swarmRunning = ''; frame = requestAnimationFrame(tick); }
  };
  const engage = (index: number | undefined) => {
    if (index === active) return;
    active = index;
    if (index !== undefined && nodes[index]) { nodes[index].holdX = nodes[index].x; nodes[index].holdY = nodes[index].y; }
  };
  const select = (index: number) => {
    if (!root.hasAttribute('data-journey-active')) return;
    // Hover, native focus and click select the full physical body. Keep it
    // expanded alongside its persistent description until another tool is chosen.
    engage(index);
    if (index === selected) return;
    selected = index;
    invitation.hidden = true;
    details.forEach((detail, i) => { detail.hidden = i !== index; });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      if (i === index) button.setAttribute('aria-describedby', `tool-description-${index}`);
      else button.removeAttribute('aria-describedby');
    });
    panelAnimation?.cancel();
    panelAnimation = details[index].animate([{ opacity: .35, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 140, easing: 'ease-out' });
  };
  const clearSelection = () => {
    panelAnimation?.cancel(); panelAnimation = undefined;
    active = selected = undefined;
    invitation.hidden = false;
    details.forEach((detail) => { detail.hidden = true; });
    buttons.forEach((button) => { button.setAttribute('aria-pressed', 'false'); button.removeAttribute('aria-describedby'); });
  };
  buttons.forEach((button, index) => {
    button.addEventListener('pointerenter', () => select(index), { signal: events.signal });
    button.addEventListener('focus', () => select(index), { signal: events.signal });
    button.addEventListener('click', () => select(index), { signal: events.signal });
  });
  const observer = new IntersectionObserver((entries) => {
    // A refresh can queue both exit and re-entry; the latest record wins.
    visible = entries.at(-1)!.isIntersecting;
    if (visible) start();
    else { stop(); clearSelection(); }
  });
  observer.observe(field);
  const drawerObserver = new MutationObserver(() => { if (stage.inert) stop(); else start(); });
  drawerObserver.observe(stage, { attributes: true, attributeFilter: ['inert'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); }, { signal: events.signal });
  const reset = () => {
    requested = false; stop(); clearSelection(); nodes = []; width = height = 0;
    buttons.forEach((button) => button.style.removeProperty('transform'));
  };
  return {
    measure() {
      const previous = nodes;
      const oldWidth = width, oldHeight = height;
      width = field.clientWidth; height = field.clientHeight;
      if (!width || !height) return;
      nodes = createSwarmParticles(width, height, buttons.map((button) => button.offsetWidth));
      nodes.forEach((node, index) => {
        const old = previous[index];
        if (!old || !oldWidth || !oldHeight) return;
        node.x = old.x / oldWidth * width; node.y = old.y / oldHeight * height;
        node.scale = old.scale; node.radius = node.baseRadius * node.scale;
        node.holdX = node.x; node.holdY = node.y;
      });
      stepSwarm(nodes, width, height, active, performance.now() / 1000, 1 / 60); paint();
      observer.unobserve(field); observer.observe(field); start();
    },
    setActive(value: boolean) {
      if (value) { requested = true; start(); }
      else if (requested) { requested = false; stop(); clearSelection(); }
    },
    reset,
    dispose() { disposed = true; reset(); events.abort(); observer.disconnect(); drawerObserver.disconnect(); },
  };
}
