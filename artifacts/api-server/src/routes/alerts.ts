import { Router } from "express";
import { db } from "@workspace/db";
import { alertsTable } from "@workspace/db";
import { CreateAlertBody, ListAlertsQueryParams } from "@workspace/api-zod";
import { eq, desc, count, and, gte } from "drizzle-orm";
import { getOrCreateSettings } from "../lib/app-settings";
import { sendAlertSms } from "../lib/twilio-sms";
import { requireUser } from "../middleware/require-user";

const router = Router();
router.use(requireUser);

router.get("/alerts", async (req, res) => {
  try {
    const query = ListAlertsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const { page = 1, limit = 20, severity } = query.data;
    const offset = (page - 1) * limit;
    const userScope = eq(alertsTable.userId, req.userId!);
    const where = severity ? and(userScope, eq(alertsTable.severity, severity)) : userScope;

    const [alerts, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(alertsTable)
        .where(where)
        .orderBy(desc(alertsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(alertsTable).where(where),
    ]);

    res.json({
      alerts,
      total: Number(total),
      page,
      totalPages: Math.ceil(Number(total) / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/alerts", async (req, res) => {
  try {
    const body = CreateAlertBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body", details: body.error });
      return;
    }

    const { severity, message, personCount, cameraId, location, imageBase64 } = body.data;

    const [alert] = await db
      .insert(alertsTable)
      .values({
        userId: req.userId!,
        severity: severity ?? "low",
        message,
        personCount,
        cameraId,
        location,
        imageBase64,
        twilioSent: false,
      })
      .returning();

    const settings = await getOrCreateSettings(req.userId!);
    if (
      settings.twilioEnabled &&
      settings.twilioAccountSid &&
      settings.twilioAuthToken &&
      settings.twilioFromNumber &&
      settings.twilioToNumber
    ) {
      try {
        await sendAlertSms({
          accountSid: settings.twilioAccountSid,
          authToken: settings.twilioAuthToken,
          from: settings.twilioFromNumber,
          to: settings.twilioToNumber,
          message: `[Titan X] ${severity ?? "low"}: ${message} — persons: ${personCount}${location ? ` @ ${location}` : ""}`,
        });
        const [updated] = await db
          .update(alertsTable)
          .set({ twilioSent: true })
          .where(eq(alertsTable.id, alert.id))
          .returning();
        res.status(201).json(updated ?? alert);
        return;
      } catch (err) {
        req.log.error({ err }, "Twilio SMS failed");
      }
    }

    res.status(201).json(alert);
  } catch (err) {
    req.log.error({ err }, "Error creating alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/alerts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid alert ID" });
      return;
    }

    const [alert] = await db
      .select()
      .from(alertsTable)
      .where(and(eq(alertsTable.id, id), eq(alertsTable.userId, req.userId!)));

    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    res.json(alert);
  } catch (err) {
    req.log.error({ err }, "Error fetching alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
