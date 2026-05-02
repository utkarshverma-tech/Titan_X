import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  twilioFromNumber: text("twilio_from_number"),
  twilioToNumber: text("twilio_to_number"),
  twilioEnabled: boolean("twilio_enabled").notNull().default(false),
  densityThreshold: integer("density_threshold").notNull().default(5),
  anomalySensitivity: integer("anomaly_sensitivity").notNull().default(80),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
