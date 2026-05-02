/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import type { Alert } from './alert';

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
  page: number;
  totalPages: number;
}
