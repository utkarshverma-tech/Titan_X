/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { AnalyticsSummaryAlertsBySeverity } from './analyticsSummaryAlertsBySeverity';

export interface AnalyticsSummary {
  totalAlerts: number;
  alertsToday: number;
  currentPersonCount: number;
  peakPersonCount: number;
  averageCrowdDensity: string;
  anomaliesDetected: number;
  systemUptime: string;
  alertsBySeverity: AnalyticsSummaryAlertsBySeverity;
}
