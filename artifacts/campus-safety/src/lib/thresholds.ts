/** Match server `effectiveAnomalyThreshold` in api-server `app-settings`. */
export function effectiveAnomalyThreshold(
  densityThreshold: number,
  anomalySensitivity: number,
): number {
  const t = Math.max(1, Math.min(20, densityThreshold));
  const s = Math.max(1, Math.min(100, anomalySensitivity));
  const delta = Math.round((s - 50) / 5);
  return Math.max(1, Math.min(30, t - delta));
}

/** Match server `anomalyPersonMinimum` — UI border / anomaly state. */
export function anomalyPersonMinimum(
  densityThreshold: number,
  anomalySensitivity: number,
): number {
  const adaptive = effectiveAnomalyThreshold(densityThreshold, anomalySensitivity);
  const t = Math.max(1, Math.min(20, densityThreshold));
  const absoluteMin = t <= 1 ? 1 : 2;
  return Math.max(adaptive, absoluteMin);
}
