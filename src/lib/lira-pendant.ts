/** Shared light curve; the desktop camera retains the same exact values. */
export function pendantLightAt(progress: number) {
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  return {
    ring: clamp(progress / 0.74),
    strength: clamp(progress / 0.035),
    indicator: clamp((progress - 0.78) / 0.1),
  };
}

/** A content interaction evaluated by the master camera clock, never a timer. */
export function createPendantInteraction(root: HTMLElement) {
  const light = root.querySelector<SVGElement>('.lira-pendant-light');
  if (!light) return;
  return {
    render(progress: number) {
      const state = pendantLightAt(progress);
      light.style.setProperty('--lira-ring-progress', String(state.ring));
      light.style.setProperty('--lira-ring-strength', String(state.strength));
      // Complete the physical channel first, then the separate upper indicator.
      // The last 12% is a completed-light hold before the camera pulls back.
      light.style.setProperty('--lira-indicator', String(state.indicator));
    },
    reset() {
      ['--lira-ring-progress', '--lira-ring-strength', '--lira-indicator'].forEach((property) => light.style.removeProperty(property));
    },
  };
}
