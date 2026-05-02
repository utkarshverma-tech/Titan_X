import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const severityEnum = pgEnum("severity", ["low", "medium", "high"]);
export const densityEnum = pgEnum("density", ["low", "medium", "high", "critical"]);
export const performanceModeEnum = pgEnum("performance_mode", ["eco", "balanced", "turbo"]);

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  severity: severityEnum("severity").notNull().default("low"),
  message: text("message").notNull(),
  personCount: integer("person_count").notNull().default(0),
  cameraId: text("camera_id"),
  location: text("location"),
  imageBase64: text("image_base64"),
  twilioSent: boolean("twilio_sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const detectionLogsTable = pgTable("detection_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  personCount: integer("person_count").notNull().default(0),
  cameraId: text("camera_id"),
  fps: text("fps"),
  performanceMode: performanceModeEnum("performance_mode"),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });
export const insertDetectionLogSchema = createInsertSchema(detectionLogsTable).omit({ id: true, loggedAt: true });

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
export type InsertDetectionLog = z.infer<typeof insertDetectionLogSchema>;
export type DetectionLog = typeof detectionLogsTable.$inferSelect;
