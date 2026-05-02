/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { CrowdDataPointDensity } from './crowdDataPointDensity';

export interface CrowdDataPoint {
  timestamp: Date;
  personCount: number;
  density: CrowdDataPointDensity;
}
