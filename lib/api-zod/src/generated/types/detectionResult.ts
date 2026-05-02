/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { DetectedObject } from './detectedObject';
import type { DetectionResultCrowdDensity } from './detectionResultCrowdDensity';

export interface DetectionResult {
  personCount: number;
  objects?: DetectedObject[];
  crowdDensity: DetectionResultCrowdDensity;
  anomalyDetected: boolean;
  confidence: number;
  processedAt: Date;
}
