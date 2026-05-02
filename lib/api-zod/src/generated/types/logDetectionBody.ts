/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { LogDetectionBodyPerformanceMode } from './logDetectionBodyPerformanceMode';

export interface LogDetectionBody {
  personCount: number;
  cameraId?: string;
  fps?: number;
  performanceMode?: LogDetectionBodyPerformanceMode;
}
