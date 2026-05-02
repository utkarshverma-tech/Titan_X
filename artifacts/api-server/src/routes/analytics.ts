import { Router } from "express";
import { db, alertsTable, detectionLogsTable, type DetectionLog } from "@workspace/db";
import { count, max, sql, desc, gte, eq, and } from "drizzle-orm";
import { requireUser } from "../middleware/require-user";

const router = Router();
router.use(requireUser);

router.get("/analytics/summary", async (req, res) => {
  try {
    const uid = req.userId!;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const userAlerts = eq(alertsTable.userId, uid);
    const userLogs = eq(detectionLogsTable.userId, uid);

    const [
      totalRes,
      todayRes,
      peakRes,
      currentRes,
      severityCounts,
    ] = await Promise.all([
      db.select({ total: count() }).from(alertsTable).where(userAlerts),
      db
        .select({ today: count() })
        .from(alertsTable)
        .where(and(userAlerts, gte(alertsTable.createdAt, todayStart))),
      db
        .select({ peak: max(detectionLogsTable.personCount) })
        .from(detectionLogsTable)
        .where(userLogs),
      db
        .select({ current: detectionLogsTable.personCount })
        .from(detectionLogsTable)
        .where(userLogs)
        .orderBy(desc(detectionLogsTable.loggedAt))
        .limit(1),
      db
        .select({ severity: alertsTable.severity, cnt: count() })
        .from(alertsTable)
        .where(userAlerts)
        .groupBy(alertsTable.severity),
    ]);

    const total = totalRes[0]?.total ?? 0;
    const today = todayRes[0]?.today ?? 0;
    const peak = peakRes[0]?.peak ?? 0;
    const current = currentRes[0]?.current ?? 0;

    const bySeverity = { low: 0, medium: 0, high: 0 };
    for (const row of severityCounts) {
      const k = row.severity;
      if (k === "low" || k === "medium" || k === "high") bySeverity[k] = Number(row.cnt);
    }

    const totalAlerts = Number(total);
    const alertsToday = Number(today);
    const peakPersonCount = Number(peak ?? 0);
    const currentPersonCount = Number(current ?? 0);
    const anomaliesDetected = bySeverity.high + bySeverity.medium;

    res.json({
      totalAlerts,
      alertsToday,
      currentPersonCount,
      peakPersonCount,
      averageCrowdDensity: currentPersonCount >= 10 ? "high" : currentPersonCount >= 5 ? "medium" : "low",
      anomaliesDetected,
      systemUptime: formatUptime(process.uptime()),
      alertsBySeverity: bySeverity,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching analytics summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/crowd-trend", async (req, res) => {
  try {
    const uid = req.userId!;
    const minutes = parseInt(req.query.minutes as string) || 60;
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const logs = await db
      .select()
      .from(detectionLogsTable)
      .where(and(eq(detectionLogsTable.userId, uid), gte(detectionLogsTable.loggedAt, since)))
      .orderBy(desc(detectionLogsTable.loggedAt))
      .limit(100);

    const dataPoints = logs.map((log: DetectionLog) => {
      const countVal = log.personCount;
      let density: "low" | "medium" | "high" | "critical" = "low";
      if (countVal >= 20) density = "critical";
      else if (countVal >= 10) density = "high";
      else if (countVal >= 5) density = "medium";

      return {
        timestamp: log.loggedAt.toISOString(),
        personCount: countVal,
        density,
      };
    });

    res.json({ dataPoints });
  } catch (err) {
    req.log.error({ err }, "Error fetching crowd trend");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/alert-frequency", async (req, res) => {
  try {
    const uid = req.userId!;
    const userAlerts = eq(alertsTable.userId, uid);

    const rows = await db
      .select({
        hour: sql<string>`to_char(created_at, 'HH24:00')`,
        cnt: count(),
      })
      .from(alertsTable)
      .where(userAlerts)
      .groupBy(sql`to_char(created_at, 'HH24:00')`)
      .orderBy(sql`to_char(created_at, 'HH24:00')`);

    const severityRows = await db
      .select({ severity: alertsTable.severity, cnt: count() })
      .from(alertsTable)
      .where(userAlerts)
      .groupBy(alertsTable.severity);

    const bySeverity = { low: 0, medium: 0, high: 0 };
    for (const row of severityRows) {
      const k = row.severity;
      if (k === "low" || k === "medium" || k === "high") bySeverity[k] = Number(row.cnt);
    }

    res.json({
      hourly: rows.map((r: { hour: string; cnt: bigint | number }) => ({
        hour: r.hour,
        count: Number(r.cnt),
      })),
      bySeverity,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching alert frequency");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export default router;
