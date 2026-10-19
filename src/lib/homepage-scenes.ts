/** Homepage-only choreography. Distances are CSS scroll pixels, not timers.
 * Departure and the following approach share one continuous camera move. */
export interface SceneMetrics { height: number; width: number; phoneTravel: number; }
type Distance = (metrics: SceneMetrics) => number;
// x/y are viewport fractions; frame interpolates from the full view (0) to
// the measured content aperture (1). Scale is relative to the traveling shot.
export interface CameraPose { scale: number; x: number; y: number; frame: number; }
export interface JourneyScene {
  id: string;
  label: string;
  travel: CameraPose;
  focus: CameraPose;
  scroll: { approach: Distance; focus: Distance; interaction: Distance; pullback: Distance; departure: Distance; };
  interaction?: 'phone' | 'pendant' | 'work-deck';
}
const viewport = (fraction: number): Distance => ({ height }) => height * fraction;
const wide: CameraPose = { scale: 1, x: 0, y: 0, frame: 0 };
const scene = (id: string, label: string, exploration: Distance, scale = 1.04): JourneyScene => ({
  id, label, travel: { ...wide }, focus: { scale, x: 0, y: 0, frame: 1 },
  scroll: { approach: viewport(0.5), focus: viewport(0.12), interaction: exploration, pullback: viewport(0.12), departure: viewport(0.3) },
});
export const openingCamera = {
  targetViewportWidth: 0.7,
  openingScrollReduction: 0.45,
  // Prior 1.5/8.6 opening consumed about 1.2 viewport heights. Start 45% shorter.
  scroll: ({ height }: SceneMetrics): number => height * 1.2 * (1 - openingCamera.openingScrollReduction),
  establish: viewport(0.12),
};
export const journeyScenes: JourneyScene[] = [
  { ...scene('introduction', 'About Me', viewport(0.12), 1), focus: { ...wide },
    scroll: { approach: viewport(0), focus: viewport(0), interaction: openingCamera.establish, pullback: viewport(0), departure: viewport(0.3) } },
  { ...scene('heir', 'Work at Ganance', (m) => Math.max(m.height * 1.4, m.phoneTravel * 1.6), 1.05), interaction: 'phone' },
  { ...scene('continuation', 'Work at Lira', viewport(1.2), 1.04), interaction: 'pendant' },
  { ...scene('how-i-work', 'How I Work', viewport(1.1), 1.04), interaction: 'work-deck' },
  scene('select-tools', 'Select Tools', viewport(0.8), 1.04),
];
export type CameraPhaseName = 'opening' | 'approach' | 'focus' | 'interaction' | 'pullback' | 'departure' | 'finish';
export interface CameraPhase {
  name: CameraPhaseName; scene: number; start: number; end: number;
  from: CameraPose; to: CameraPose; fromX: number; toX: number;
  handoff?: { start: number; end: number; from: CameraPose; to: CameraPose; fromX: number; toX: number; };
}
export interface CameraPlan { phases: CameraPhase[]; total: number; labels: Record<string, number>; }
export function planJourney(metrics: SceneMetrics, offsets: number[]): CameraPlan {
  const phases: CameraPhase[] = [];
  const labels: Record<string, number> = {};
  let cursor = 0;
  const add = (name: CameraPhaseName, index: number, distance: number, from: CameraPose, to: CameraPose, fromX: number, toX = fromX) => {
    if (distance <= 0) return;
    labels[`${journeyScenes[index].id}:${name}`] = cursor;
    phases.push({ name, scene: index, start: cursor, end: cursor + distance, from, to, fromX, toX });
    cursor += distance;
  };
  add('opening', 0, openingCamera.scroll(metrics), wide, wide, 0);
  journeyScenes.forEach((destination, index) => {
    labels[destination.id] = cursor; // Station arrival, before its focus adjustment.
    add('focus', index, destination.scroll.focus(metrics), destination.travel, destination.focus, offsets[index]);
    add('interaction', index, destination.scroll.interaction(metrics), destination.focus, destination.focus, offsets[index]);
    add('pullback', index, destination.scroll.pullback(metrics), destination.focus, destination.travel, offsets[index]);
    if (index === 0) labels[destination.id] = cursor; // Established shot and visible thread.
    const next = journeyScenes[index + 1];
    if (next) {
      const distance = destination.scroll.departure(metrics) + next.scroll.approach(metrics);
      if (distance <= 0) return;
      // These are two legs of the same handoff, with matching velocity/easing.
      const departure = destination.scroll.departure(metrics);
      const middle = offsets[index] + (offsets[index + 1] - offsets[index]) * departure / distance;
      const firstPhase = phases.length;
      const handoff = { start: cursor, end: cursor + distance, from: destination.travel, to: next.travel, fromX: offsets[index], toX: offsets[index + 1] };
      add('departure', index, departure, destination.travel, destination.travel, offsets[index], middle);
      add('approach', index + 1, next.scroll.approach(metrics), destination.travel, next.travel, middle, offsets[index + 1]);
      phases.slice(firstPhase).forEach((phase) => { phase.handoff = handoff; });
    }
  });
  const last = journeyScenes.at(-1)!;
  add('finish', journeyScenes.length - 1, metrics.height * 0.15, last.travel, last.travel, offsets.at(-1)!);
  return { phases, total: cursor, labels };
}
