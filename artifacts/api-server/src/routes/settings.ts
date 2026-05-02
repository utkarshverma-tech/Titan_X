import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getOrCreateSettings } from "../lib/app-settings";
import { requireUser } from "../middleware/require-user";

const router = Router();
router.use(requireUser);

router.get("/settings", async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.userId!);
    const safe = { ...settings, twilioAuthToken: settings.twilioAuthToken ? "••••••••" : null };
    res.json(safe);
  } catch (err) {
    req.log.error({ err }, "Error fetching settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const {
      twilioAccountSid, twilioAuthToken, twilioFromNumber, twilioToNumber,
      twilioEnabled, densityThreshold, anomalySensitivity,
    } = req.body;

    const existing = await getOrCreateSettings(req.userId!);

    const [updated] = await db
      .update(settingsTable)
      .set({
        twilioAccountSid:   twilioAccountSid   ?? existing.twilioAccountSid,
        twilioAuthToken:    twilioAuthToken && twilioAuthToken !== "••••••••"
                              ? twilioAuthToken
                              : existing.twilioAuthToken,
        twilioFromNumber:   twilioFromNumber   ?? existing.twilioFromNumber,
        twilioToNumber:     twilioToNumber     ?? existing.twilioToNumber,
        twilioEnabled:      twilioEnabled      ?? existing.twilioEnabled,
        densityThreshold:   densityThreshold   ?? existing.densityThreshold,
        anomalySensitivity: anomalySensitivity ?? existing.anomalySensitivity,
        updatedAt: new Date(),
      })
      .where(eq(settingsTable.id, existing.id))
      .returning();

    const safe = { ...updated, twilioAuthToken: updated.twilioAuthToken ? "••••••••" : null };
    res.json(safe);
  } catch (err) {
    req.log.error({ err }, "Error updating settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
