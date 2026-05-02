/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { AlertSeverity } from './alertSeverity';

export interface Alert {
  id: number;
  severity: AlertSeverity;
  message: string;
  personCount: number;
  cameraId?: string;
  location?: string;
  twilioSent: boolean;
  createdAt: Date;
}
