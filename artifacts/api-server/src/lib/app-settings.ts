import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function getOrCreateSettings(userId: number) {
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.userId, userId)).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({ userId }).returning();
  return created;
}

export function effectiveAnomalyThreshold(
  densityThreshold: number,
  anomalySensitivity: number,
): number {
  const t = Math.max(1, Math.min(20, densityThreshold));
  const s = Math.max(1, Math.min(100, anomalySensitivity));
  // Higher sensitivity => lower people count needed to flag anomaly
  const delta = Math.round((s - 50) / 5);
  return Math.max(1, Math.min(30, t - delta));
}

/**
 * People count needed to flag anomaly (server + UI). Caps how low sensitivity can pull
 * the bar so a single person is not "crowd exceeded" unless density slider is 1.
 */
export function anomalyPersonMinimum(
  densityThreshold: number,
  anomalySensitivity: number,
): number {
  const adaptive = effectiveAnomalyThreshold(densityThreshold, anomalySensitivity);
  const t = Math.max(1, Math.min(20, densityThreshold));
  const absoluteMin = t <= 1 ? 1 : 2;
  return Math.max(adaptive, absoluteMin);
}
