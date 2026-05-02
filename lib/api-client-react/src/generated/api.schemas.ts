/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
export interface HealthStatus {
  status: string;
}

export interface DetectFrameBody {
  /** Base64-encoded JPEG frame */
  imageBase64: string;
  cameraId?: string;
  /** Person count from client-side TensorFlow.js */
  clientPersonCount?: number;
}

export type DetectionResultCrowdDensity = typeof DetectionResultCrowdDensity[keyof typeof DetectionResultCrowdDensity];


export const DetectionResultCrowdDensity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const;

export interface DetectedObject {
  label: string;
  confidence: number;
  bbox: number[];
}

export interface DetectionResult {
  personCount: number;
  objects?: DetectedObject[];
  crowdDensity: DetectionResultCrowdDensity;
  anomalyDetected: boolean;
  confidence: number;
  processedAt: string;
}

export type AlertSeverity = typeof AlertSeverity[keyof typeof AlertSeverity];


export const AlertSeverity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export interface Alert {
  id: number;
  severity: AlertSeverity;
  message: string;
  personCount: number;
  cameraId?: string;
  location?: string;
  twilioSent: boolean;
  createdAt: string;
}

export type CreateAlertBodySeverity = typeof CreateAlertBodySeverity[keyof typeof CreateAlertBodySeverity];


export const CreateAlertBodySeverity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export interface CreateAlertBody {
  severity: CreateAlertBodySeverity;
  message: string;
  personCount: number;
  cameraId?: string;
  location?: string;
  imageBase64?: string;
}

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
  page: number;
  totalPages: number;
}

export type AnalyticsSummaryAlertsBySeverity = {
  low: number;
  medium: number;
  high: number;
};

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

export type CrowdDataPointDensity = typeof CrowdDataPointDensity[keyof typeof CrowdDataPointDensity];


export const CrowdDataPointDensity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const;

export interface CrowdDataPoint {
  timestamp: string;
  personCount: number;
  density: CrowdDataPointDensity;
}

export interface CrowdTrendResponse {
  dataPoints: CrowdDataPoint[];
}

export type AlertFrequencyResponseBySeverity = {
  low: number;
  medium: number;
  high: number;
};

export interface HourlyAlertCount {
  hour: string;
  count: number;
}

export interface AlertFrequencyResponse {
  hourly: HourlyAlertCount[];
  bySeverity: AlertFrequencyResponseBySeverity;
}

export type LogDetectionBodyPerformanceMode = typeof LogDetectionBodyPerformanceMode[keyof typeof LogDetectionBodyPerformanceMode];


export const LogDetectionBodyPerformanceMode = {
  eco: 'eco',
  balanced: 'balanced',
  turbo: 'turbo',
} as const;

export interface LogDetectionBody {
  personCount: number;
  cameraId?: string;
  fps?: number;
  performanceMode?: LogDetectionBodyPerformanceMode;
}

export interface DetectionLog {
  id: number;
  personCount: number;
  cameraId?: string;
  fps?: number;
  performanceMode?: string;
  loggedAt: string;
}

export interface AuthCredentials {
  email: string;
  /** @minLength 8 */
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsBody {
  twilioAccountSid?: string | null;
  twilioAuthToken?: string | null;
  twilioFromNumber?: string | null;
  twilioToNumber?: string | null;
  twilioEnabled?: boolean;
  densityThreshold?: number;
  anomalySensitivity?: number;
}

export type ListAlertsParams = {
page?: number;
limit?: number;
severity?: ListAlertsSeverity;
};

export type ListAlertsSeverity = typeof ListAlertsSeverity[keyof typeof ListAlertsSeverity];


export const ListAlertsSeverity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type GetCrowdTrendParams = {
minutes?: number;
};

export type Logout200 = {
  ok?: boolean;
};

