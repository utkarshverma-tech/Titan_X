import { Router } from "express";
import { db } from "@workspace/db";
import { detectionLogsTable } from "@workspace/db";
import { AnalyzeFrameBody, LogDetectionBody } from "@workspace/api-zod";
import { getOrCreateSettings, anomalyPersonMinimum } from "../lib/app-settings";
import { requireUser } from "../middleware/require-user";

const router = Router();
router.use(requireUser);

router.post("/detect", async (req, res) => {
  try {
    const body = AnalyzeFrameBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { clientPersonCount = 0 } = body.data;

    const settings = await getOrCreateSettings(req.userId!);
    const base = Math.max(1, Math.min(20, settings.densityThreshold));
    const criticalAt = Math.round(base * 3);
    const highAt = Math.round(base * 2);
    const mediumAt = Math.round(base * 1.2);

    const personCount = clientPersonCount;
    let crowdDensity: "low" | "medium" | "high" | "critical" = "low";
    if (personCount >= criticalAt) crowdDensity = "critical";
    else if (personCount >= highAt) crowdDensity = "high";
    else if (personCount >= mediumAt) crowdDensity = "medium";

    const anomalyAt = anomalyPersonMinimum(
      settings.densityThreshold,
      settings.anomalySensitivity,
    );
    const anomalyDetected = personCount >= anomalyAt;

    res.json({
      personCount,
      objects: Array.from({ length: personCount }, (_, i) => ({
        label: "person",
        confidence: 0.85 + Math.random() * 0.14,
        bbox: [Math.random() * 400, Math.random() * 300, 80 + Math.random() * 60, 120 + Math.random() * 80],
      })),
      crowdDensity,
      anomalyDetected,
      confidence: 0.87 + Math.random() * 0.12,
      processedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error analyzing frame");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/detections/log", async (req, res) => {
  try {
    const body = LogDetectionBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { personCount, cameraId, fps, performanceMode } = body.data;

    const [log] = await db
      .insert(detectionLogsTable)
      .values({
        userId: req.userId!,
        personCount,
        cameraId,
        fps: fps != null ? String(fps) : null,
        performanceMode: performanceMode ?? null,
      })
      .returning();

    res.status(201).json(log);
  } catch (err) {
    req.log.error({ err }, "Error logging detection");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
