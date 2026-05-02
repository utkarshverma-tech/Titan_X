/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import * as zod from 'zod';


/**
 * @summary Health check
 */
export const HealthCheckResponse = zod.object({
  "status": zod.string()
})


/**
 * @summary Analyze a camera frame with the backend detector
 */
export const AnalyzeFrameBody = zod.object({
  "imageBase64": zod.string().describe('Base64-encoded JPEG frame'),
  "cameraId": zod.string().optional(),
  "clientPersonCount": zod.number().optional().describe('Person count from client-side TensorFlow.js')
})

export const AnalyzeFrameResponse = zod.object({
  "personCount": zod.number(),
  "objects": zod.array(zod.object({
  "label": zod.string(),
  "confidence": zod.number(),
  "bbox": zod.array(zod.number())
})).optional(),
  "crowdDensity": zod.enum(['low', 'medium', 'high', 'critical']),
  "anomalyDetected": zod.boolean(),
  "confidence": zod.number(),
  "processedAt": zod.coerce.date()
})


/**
 * @summary List alert history with optional pagination
 */
export const listAlertsQueryPageDefault = 1;
export const listAlertsQueryLimitDefault = 20;

export const ListAlertsQueryParams = zod.object({
  "page": zod.coerce.number().default(listAlertsQueryPageDefault),
  "limit": zod.coerce.number().default(listAlertsQueryLimitDefault),
  "severity": zod.enum(['low', 'medium', 'high']).optional()
})

export const ListAlertsResponse = zod.object({
  "alerts": zod.array(zod.object({
  "id": zod.number(),
  "severity": zod.enum(['low', 'medium', 'high']),
  "message": zod.string(),
  "personCount": zod.number(),
  "cameraId": zod.string().optional(),
  "location": zod.string().optional(),
  "twilioSent": zod.boolean(),
  "createdAt": zod.coerce.date()
})),
  "total": zod.number(),
  "page": zod.number(),
  "totalPages": zod.number()
})


/**
 * @summary Create a new alert (triggers Twilio if configured)
 */
export const CreateAlertBody = zod.object({
  "severity": zod.enum(['low', 'medium', 'high']),
  "message": zod.string(),
  "personCount": zod.number(),
  "cameraId": zod.string().optional(),
  "location": zod.string().optional(),
  "imageBase64": zod.string().optional()
})


/**
 * @summary Get a single alert by ID
 */
export const GetAlertParams = zod.object({
  "id": zod.coerce.number()
})

export const GetAlertResponse = zod.object({
  "id": zod.number(),
  "severity": zod.enum(['low', 'medium', 'high']),
  "message": zod.string(),
  "personCount": zod.number(),
  "cameraId": zod.string().optional(),
  "location": zod.string().optional(),
  "twilioSent": zod.boolean(),
  "createdAt": zod.coerce.date()
})


/**
 * @summary Dashboard summary (totals, averages, current status)
 */
export const GetAnalyticsSummaryResponse = zod.object({
  "totalAlerts": zod.number(),
  "alertsToday": zod.number(),
  "currentPersonCount": zod.number(),
  "peakPersonCount": zod.number(),
  "averageCrowdDensity": zod.string(),
  "anomaliesDetected": zod.number(),
  "systemUptime": zod.string(),
  "alertsBySeverity": zod.object({
  "low": zod.number(),
  "medium": zod.number(),
  "high": zod.number()
})
})


/**
 * @summary Crowd density trend data for charts (last N data points)
 */
export const getCrowdTrendQueryMinutesDefault = 60;

export const GetCrowdTrendQueryParams = zod.object({
  "minutes": zod.coerce.number().default(getCrowdTrendQueryMinutesDefault)
})

export const GetCrowdTrendResponse = zod.object({
  "dataPoints": zod.array(zod.object({
  "timestamp": zod.coerce.date(),
  "personCount": zod.number(),
  "density": zod.enum(['low', 'medium', 'high', 'critical'])
}))
})


/**
 * @summary Alert frequency grouped by severity and hour
 */
export const GetAlertFrequencyResponse = zod.object({
  "hourly": zod.array(zod.object({
  "hour": zod.string(),
  "count": zod.number()
})),
  "bySeverity": zod.object({
  "low": zod.number(),
  "medium": zod.number(),
  "high": zod.number()
})
})


/**
 * @summary Log a client-side detection event (person count, timestamp)
 */
export const LogDetectionBody = zod.object({
  "personCount": zod.number(),
  "cameraId": zod.string().optional(),
  "fps": zod.number().optional(),
  "performanceMode": zod.enum(['eco', 'balanced', 'turbo']).optional()
})


/**
 * @summary Register a new user
 */
export const registerBodyPasswordMin = 8;



export const RegisterBody = zod.object({
  "email": zod.string().email(),
  "password": zod.string().min(registerBodyPasswordMin)
})


/**
 * @summary Login
 */
export const loginBodyPasswordMin = 8;



export const LoginBody = zod.object({
  "email": zod.string().email(),
  "password": zod.string().min(loginBodyPasswordMin)
})

export const LoginResponse = zod.object({
  "user": zod.object({
  "id": zod.number(),
  "email": zod.string()
})
})


/**
 * @summary Logout
 */
export const LogoutResponse = zod.object({
  "ok": zod.boolean().optional()
})


/**
 * @summary Get current session user
 */
export const AuthMeResponse = zod.object({
  "user": zod.object({
  "id": zod.number(),
  "email": zod.string()
})
})


/**
 * @summary Get user settings
 */
export const GetSettingsResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "twilioAccountSid": zod.string().nullish(),
  "twilioAuthToken": zod.string().nullish(),
  "twilioFromNumber": zod.string().nullish(),
  "twilioToNumber": zod.string().nullish(),
  "twilioEnabled": zod.boolean(),
  "densityThreshold": zod.number(),
  "anomalySensitivity": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})


/**
 * @summary Update user settings
 */
export const UpdateSettingsBody = zod.object({
  "twilioAccountSid": zod.string().nullish(),
  "twilioAuthToken": zod.string().nullish(),
  "twilioFromNumber": zod.string().nullish(),
  "twilioToNumber": zod.string().nullish(),
  "twilioEnabled": zod.boolean().optional(),
  "densityThreshold": zod.number().optional(),
  "anomalySensitivity": zod.number().optional()
})

export const UpdateSettingsResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "twilioAccountSid": zod.string().nullish(),
  "twilioAuthToken": zod.string().nullish(),
  "twilioFromNumber": zod.string().nullish(),
  "twilioToNumber": zod.string().nullish(),
  "twilioEnabled": zod.boolean(),
  "densityThreshold": zod.number(),
  "anomalySensitivity": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})


