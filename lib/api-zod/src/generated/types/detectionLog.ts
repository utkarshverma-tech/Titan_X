/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */

export interface DetectionLog {
  id: number;
  personCount: number;
  cameraId?: string;
  fps?: number;
  performanceMode?: string;
  loggedAt: Date;
}
