/** Eleven bodies need only 55 pair checks; no general-purpose physics runtime. */
export const swarmMotion = {
  hoverScale: 1.25, gap: 12, halo: 24, wall: 12,
  spring: 0.003, attraction: 0.0007, cohesion: 0.86,
  damping: 0.84, drift: 18, iterations: 6,
};
export interface SwarmParticle {
  x: number; y: number; vx: number; vy: number; radius: number;
  baseRadius: number; scale: number; anchorX: number; anchorY: number;
  holdX: number; holdY: number; phase: number;
}
const anchors = [
  [.17, .21], [.39, .17], [.6, .23], [.83, .18],
  [.23, .52], [.5, .48], [.78, .5],
  [.16, .79], [.38, .84], [.62, .78], [.85, .82],
];
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
export function createSwarmParticles(width: number, height: number, diameters: number[]): SwarmParticle[] {
  return diameters.map((diameter, index) => {
    const [ax, ay] = anchors[index];
    return { x: ax * width, y: ay * height, anchorX: ax * width, anchorY: ay * height,
      holdX: ax * width, holdY: ay * height, baseRadius: diameter / 2, radius: diameter / 2,
      scale: 1, vx: 0, vy: 0, phase: index * 2.39996 };
  });
}
export function stepSwarm(nodes: SwarmParticle[], width: number, height: number, active: number | undefined, seconds: number, delta: number) {
  const dt = Math.min(2, Math.max(.25, delta * 60));
  const bound = (node: SwarmParticle) => {
    node.x = clamp(node.x, node.radius + swarmMotion.wall, width - node.radius - swarmMotion.wall);
    node.y = clamp(node.y, node.radius + swarmMotion.wall, height - node.radius - swarmMotion.wall);
  };
  // Weak pair springs draw the group together while home springs preserve its
  // reading order. Separation below keeps this attraction soft, never sticky.
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
    const first = nodes[a], second = nodes[b];
    const dx = second.x - first.x, dy = second.y - first.y;
    const distance = Math.hypot(dx, dy) || .001;
    const rest = Math.max(first.baseRadius + second.baseRadius + swarmMotion.gap,
      Math.hypot(second.anchorX - first.anchorX, second.anchorY - first.anchorY) * swarmMotion.cohesion);
    const pull = Math.max(0, distance - rest) * swarmMotion.attraction * dt;
    if (a !== active) { first.vx += dx / distance * pull; first.vy += dy / distance * pull; }
    if (b !== active) { second.vx -= dx / distance * pull; second.vy -= dy / distance * pull; }
  }
  nodes.forEach((node, index) => {
    const engaged = index === active;
    node.scale += ((engaged ? swarmMotion.hoverScale : 1) - node.scale) * (1 - Math.pow(.86, dt));
    node.radius = node.baseRadius * node.scale;
    if (engaged) { node.x = node.holdX; node.y = node.holdY; node.vx = node.vy = 0; }
    else {
      const dx = Math.sin(seconds * .65 + node.phase) * swarmMotion.drift + Math.sin(seconds * .33) * 7;
      const dy = Math.sin(seconds * .53 + node.phase) * swarmMotion.drift + Math.cos(seconds * .29) * 7;
      node.vx = (node.vx + (node.anchorX + dx - node.x) * swarmMotion.spring * dt) * Math.pow(swarmMotion.damping, dt);
      node.vy = (node.vy + (node.anchorY + dy - node.y) * swarmMotion.spring * dt) * Math.pow(swarmMotion.damping, dt);
      node.x += node.vx * dt; node.y += node.vy * dt;
    }
    bound(node);
  });
  // Soft positional relaxation lets neighbors yield without impulses or bounce.
  for (let pass = 0; pass < swarmMotion.iterations; pass++) {
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const first = nodes[a], second = nodes[b];
      const dx = second.x - first.x, dy = second.y - first.y;
      const distance = Math.hypot(dx, dy) || .001;
      // Clearance follows the visible scale, including the previously selected
      // body, so switching tools never snaps its neighbors back into place.
      const expansion = Math.max(first.scale - 1, second.scale - 1) / (swarmMotion.hoverScale - 1);
      const required = first.radius + second.radius + swarmMotion.gap + swarmMotion.halo * expansion;
      if (distance >= required) continue;
      const correction = (required - distance) * .65;
      const firstWeight = a === active ? 0 : b === active ? 1 : .5;
      const secondWeight = 1 - firstWeight;
      first.x -= dx / distance * correction * firstWeight;
      first.y -= dy / distance * correction * firstWeight;
      second.x += dx / distance * correction * secondWeight;
      second.y += dy / distance * correction * secondWeight;
    }
    nodes.forEach(bound);
  }
}
