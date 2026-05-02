/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { CreateAlertBodySeverity } from './createAlertBodySeverity';

export interface CreateAlertBody {
  severity: CreateAlertBodySeverity;
  message: string;
  personCount: number;
  cameraId?: string;
  location?: string;
  imageBase64?: string;
}
