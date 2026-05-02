/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { AlertFrequencyResponseBySeverity } from './alertFrequencyResponseBySeverity';
import type { HourlyAlertCount } from './hourlyAlertCount';

export interface AlertFrequencyResponse {
  hourly: HourlyAlertCount[];
  bySeverity: AlertFrequencyResponseBySeverity;
}
