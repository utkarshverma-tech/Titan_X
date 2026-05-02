/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */

export interface Settings {
  id: number;
  userId: number;
  twilioAccountSid?: string | null;
  twilioAuthToken?: string | null;
  twilioFromNumber?: string | null;
  twilioToNumber?: string | null;
  twilioEnabled: boolean;
  densityThreshold: number;
  anomalySensitivity: number;
  createdAt: Date;
  updatedAt: Date;
}
