/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  Alert,
  AlertFrequencyResponse,
  AlertListResponse,
  AnalyticsSummary,
  AuthCredentials,
  AuthResponse,
  CreateAlertBody,
  CrowdTrendResponse,
  DetectFrameBody,
  DetectionLog,
  DetectionResult,
  GetCrowdTrendParams,
  HealthStatus,
  ListAlertsParams,
  LogDetectionBody,
  Logout200,
  Settings,
  UpdateSettingsBody
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType , BodyType } from '../custom-fetch';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * @summary Health check
 */
export const getHealthCheckUrl = () => {




  return `/api/healthz`
}

export const healthCheck = async ( options?: RequestInit): Promise<HealthStatus> => {

  return customFetch<HealthStatus>(getHealthCheckUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getHealthCheckQueryKey = () => {
    return [
    `/api/healthz`
    ] as const;
    }


export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>
export type HealthCheckQueryError = ErrorType<unknown>


/**
 * @summary Health check
 */

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getHealthCheckQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Analyze a camera frame with the backend detector
 */
export const getAnalyzeFrameUrl = () => {




  return `/api/detect`
}

export const analyzeFrame = async (detectFrameBody: DetectFrameBody, options?: RequestInit): Promise<DetectionResult> => {

  return customFetch<DetectionResult>(getAnalyzeFrameUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      detectFrameBody,)
  }
);}




export const getAnalyzeFrameMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeFrame>>, TError,{data: BodyType<DetectFrameBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof analyzeFrame>>, TError,{data: BodyType<DetectFrameBody>}, TContext> => {

const mutationKey = ['analyzeFrame'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof analyzeFrame>>, {data: BodyType<DetectFrameBody>}> = (props) => {
          const {data} = props ?? {};

          return  analyzeFrame(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AnalyzeFrameMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeFrame>>>
    export type AnalyzeFrameMutationBody = BodyType<DetectFrameBody>
    export type AnalyzeFrameMutationError = ErrorType<unknown>

    /**
 * @summary Analyze a camera frame with the backend detector
 */
export const useAnalyzeFrame = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeFrame>>, TError,{data: BodyType<DetectFrameBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof analyzeFrame>>,
        TError,
        {data: BodyType<DetectFrameBody>},
        TContext
      > => {
      return useMutation(getAnalyzeFrameMutationOptions(options));
    }

/**
 * @summary List alert history with optional pagination
 */
export const getListAlertsUrl = (params?: ListAlertsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/alerts?${stringifiedParams}` : `/api/alerts`
}

export const listAlerts = async (params?: ListAlertsParams, options?: RequestInit): Promise<AlertListResponse> => {

  return customFetch<AlertListResponse>(getListAlertsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListAlertsQueryKey = (params?: ListAlertsParams,) => {
    return [
    `/api/alerts`, ...(params ? [params] : [])
    ] as const;
    }


export const getListAlertsQueryOptions = <TData = Awaited<ReturnType<typeof listAlerts>>, TError = ErrorType<unknown>>(params?: ListAlertsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListAlertsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listAlerts>>> = ({ signal }) => listAlerts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData> & { queryKey: QueryKey }
}

export type ListAlertsQueryResult = NonNullable<Awaited<ReturnType<typeof listAlerts>>>
export type ListAlertsQueryError = ErrorType<unknown>


/**
 * @summary List alert history with optional pagination
 */

export function useListAlerts<TData = Awaited<ReturnType<typeof listAlerts>>, TError = ErrorType<unknown>>(
 params?: ListAlertsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListAlertsQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Create a new alert (triggers Twilio if configured)
 */
export const getCreateAlertUrl = () => {




  return `/api/alerts`
}

export const createAlert = async (createAlertBody: CreateAlertBody, options?: RequestInit): Promise<Alert> => {

  return customFetch<Alert>(getCreateAlertUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      createAlertBody,)
  }
);}




export const getCreateAlertMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createAlert>>, TError,{data: BodyType<CreateAlertBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createAlert>>, TError,{data: BodyType<CreateAlertBody>}, TContext> => {

const mutationKey = ['createAlert'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createAlert>>, {data: BodyType<CreateAlertBody>}> = (props) => {
          const {data} = props ?? {};

          return  createAlert(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateAlertMutationResult = NonNullable<Awaited<ReturnType<typeof createAlert>>>
    export type CreateAlertMutationBody = BodyType<CreateAlertBody>
    export type CreateAlertMutationError = ErrorType<unknown>

    /**
 * @summary Create a new alert (triggers Twilio if configured)
 */
export const useCreateAlert = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createAlert>>, TError,{data: BodyType<CreateAlertBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createAlert>>,
        TError,
        {data: BodyType<CreateAlertBody>},
        TContext
      > => {
      return useMutation(getCreateAlertMutationOptions(options));
    }

/**
 * @summary Get a single alert by ID
 */
export const getGetAlertUrl = (id: number,) => {




  return `/api/alerts/${id}`
}

export const getAlert = async (id: number, options?: RequestInit): Promise<Alert> => {

  return customFetch<Alert>(getGetAlertUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetAlertQueryKey = (id: number,) => {
    return [
    `/api/alerts/${id}`
    ] as const;
    }


export const getGetAlertQueryOptions = <TData = Awaited<ReturnType<typeof getAlert>>, TError = ErrorType<unknown>>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAlert>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAlertQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAlert>>> = ({ signal }) => getAlert(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAlert>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAlertQueryResult = NonNullable<Awaited<ReturnType<typeof getAlert>>>
export type GetAlertQueryError = ErrorType<unknown>


/**
 * @summary Get a single alert by ID
 */

export function useGetAlert<TData = Awaited<ReturnType<typeof getAlert>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAlert>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetAlertQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Dashboard summary (totals, averages, current status)
 */
export const getGetAnalyticsSummaryUrl = () => {




  return `/api/analytics/summary`
}

export const getAnalyticsSummary = async ( options?: RequestInit): Promise<AnalyticsSummary> => {

  return customFetch<AnalyticsSummary>(getGetAnalyticsSummaryUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetAnalyticsSummaryQueryKey = () => {
    return [
    `/api/analytics/summary`
    ] as const;
    }


export const getGetAnalyticsSummaryQueryOptions = <TData = Awaited<ReturnType<typeof getAnalyticsSummary>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAnalyticsSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAnalyticsSummaryQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAnalyticsSummary>>> = ({ signal }) => getAnalyticsSummary({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAnalyticsSummary>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAnalyticsSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getAnalyticsSummary>>>
export type GetAnalyticsSummaryQueryError = ErrorType<unknown>


/**
 * @summary Dashboard summary (totals, averages, current status)
 */

export function useGetAnalyticsSummary<TData = Awaited<ReturnType<typeof getAnalyticsSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAnalyticsSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetAnalyticsSummaryQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Crowd density trend data for charts (last N data points)
 */
export const getGetCrowdTrendUrl = (params?: GetCrowdTrendParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/analytics/crowd-trend?${stringifiedParams}` : `/api/analytics/crowd-trend`
}

export const getCrowdTrend = async (params?: GetCrowdTrendParams, options?: RequestInit): Promise<CrowdTrendResponse> => {

  return customFetch<CrowdTrendResponse>(getGetCrowdTrendUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCrowdTrendQueryKey = (params?: GetCrowdTrendParams,) => {
    return [
    `/api/analytics/crowd-trend`, ...(params ? [params] : [])
    ] as const;
    }


export const getGetCrowdTrendQueryOptions = <TData = Awaited<ReturnType<typeof getCrowdTrend>>, TError = ErrorType<unknown>>(params?: GetCrowdTrendParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getCrowdTrend>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCrowdTrendQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCrowdTrend>>> = ({ signal }) => getCrowdTrend(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCrowdTrend>>, TError, TData> & { queryKey: QueryKey }
}

export type GetCrowdTrendQueryResult = NonNullable<Awaited<ReturnType<typeof getCrowdTrend>>>
export type GetCrowdTrendQueryError = ErrorType<unknown>


/**
 * @summary Crowd density trend data for charts (last N data points)
 */

export function useGetCrowdTrend<TData = Awaited<ReturnType<typeof getCrowdTrend>>, TError = ErrorType<unknown>>(
 params?: GetCrowdTrendParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getCrowdTrend>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetCrowdTrendQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Alert frequency grouped by severity and hour
 */
export const getGetAlertFrequencyUrl = () => {




  return `/api/analytics/alert-frequency`
}

export const getAlertFrequency = async ( options?: RequestInit): Promise<AlertFrequencyResponse> => {

  return customFetch<AlertFrequencyResponse>(getGetAlertFrequencyUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetAlertFrequencyQueryKey = () => {
    return [
    `/api/analytics/alert-frequency`
    ] as const;
    }


export const getGetAlertFrequencyQueryOptions = <TData = Awaited<ReturnType<typeof getAlertFrequency>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAlertFrequency>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAlertFrequencyQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAlertFrequency>>> = ({ signal }) => getAlertFrequency({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAlertFrequency>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAlertFrequencyQueryResult = NonNullable<Awaited<ReturnType<typeof getAlertFrequency>>>
export type GetAlertFrequencyQueryError = ErrorType<unknown>


/**
 * @summary Alert frequency grouped by severity and hour
 */

export function useGetAlertFrequency<TData = Awaited<ReturnType<typeof getAlertFrequency>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAlertFrequency>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetAlertFrequencyQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Log a client-side detection event (person count, timestamp)
 */
export const getLogDetectionUrl = () => {




  return `/api/detections/log`
}

export const logDetection = async (logDetectionBody: LogDetectionBody, options?: RequestInit): Promise<DetectionLog> => {

  return customFetch<DetectionLog>(getLogDetectionUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      logDetectionBody,)
  }
);}




export const getLogDetectionMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logDetection>>, TError,{data: BodyType<LogDetectionBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof logDetection>>, TError,{data: BodyType<LogDetectionBody>}, TContext> => {

const mutationKey = ['logDetection'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof logDetection>>, {data: BodyType<LogDetectionBody>}> = (props) => {
          const {data} = props ?? {};

          return  logDetection(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LogDetectionMutationResult = NonNullable<Awaited<ReturnType<typeof logDetection>>>
    export type LogDetectionMutationBody = BodyType<LogDetectionBody>
    export type LogDetectionMutationError = ErrorType<unknown>

    /**
 * @summary Log a client-side detection event (person count, timestamp)
 */
export const useLogDetection = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logDetection>>, TError,{data: BodyType<LogDetectionBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof logDetection>>,
        TError,
        {data: BodyType<LogDetectionBody>},
        TContext
      > => {
      return useMutation(getLogDetectionMutationOptions(options));
    }

/**
 * @summary Register a new user
 */
export const getRegisterUrl = () => {




  return `/api/auth/register`
}

export const register = async (authCredentials: AuthCredentials, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getRegisterUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      authCredentials,)
  }
);}




export const getRegisterMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext> => {

const mutationKey = ['register'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof register>>, {data: BodyType<AuthCredentials>}> = (props) => {
          const {data} = props ?? {};

          return  register(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>
    export type RegisterMutationBody = BodyType<AuthCredentials>
    export type RegisterMutationError = ErrorType<unknown>

    /**
 * @summary Register a new user
 */
export const useRegister = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof register>>,
        TError,
        {data: BodyType<AuthCredentials>},
        TContext
      > => {
      return useMutation(getRegisterMutationOptions(options));
    }

/**
 * @summary Login
 */
export const getLoginUrl = () => {




  return `/api/auth/login`
}

export const login = async (authCredentials: AuthCredentials, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      authCredentials,)
  }
);}




export const getLoginMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext> => {

const mutationKey = ['login'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, {data: BodyType<AuthCredentials>}> = (props) => {
          const {data} = props ?? {};

          return  login(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>
    export type LoginMutationBody = BodyType<AuthCredentials>
    export type LoginMutationError = ErrorType<unknown>

    /**
 * @summary Login
 */
export const useLogin = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof login>>,
        TError,
        {data: BodyType<AuthCredentials>},
        TContext
      > => {
      return useMutation(getLoginMutationOptions(options));
    }

/**
 * @summary Logout
 */
export const getLogoutUrl = () => {




  return `/api/auth/logout`
}

export const logout = async ( options?: RequestInit): Promise<Logout200> => {

  return customFetch<Logout200>(getLogoutUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getLogoutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext> => {

const mutationKey = ['logout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof logout>>, void> = () => {


          return  logout(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>

    export type LogoutMutationError = ErrorType<unknown>

    /**
 * @summary Logout
 */
export const useLogout = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof logout>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getLogoutMutationOptions(options));
    }

/**
 * @summary Get current session user
 */
export const getAuthMeUrl = () => {




  return `/api/auth/me`
}

export const authMe = async ( options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getAuthMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getAuthMeQueryOptions = <TData = Awaited<ReturnType<typeof authMe>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof authMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authMe>>> = ({ signal }) => authMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authMe>>, TError, TData> & { queryKey: QueryKey }
}

export type AuthMeQueryResult = NonNullable<Awaited<ReturnType<typeof authMe>>>
export type AuthMeQueryError = ErrorType<unknown>


/**
 * @summary Get current session user
 */

export function useAuthMe<TData = Awaited<ReturnType<typeof authMe>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof authMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getAuthMeQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Get user settings
 */
export const getGetSettingsUrl = () => {




  return `/api/settings`
}

export const getSettings = async ( options?: RequestInit): Promise<Settings> => {

  return customFetch<Settings>(getGetSettingsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetSettingsQueryKey = () => {
    return [
    `/api/settings`
    ] as const;
    }


export const getGetSettingsQueryOptions = <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSettingsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSettings>>> = ({ signal }) => getSettings({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & { queryKey: QueryKey }
}

export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>
export type GetSettingsQueryError = ErrorType<unknown>


/**
 * @summary Get user settings
 */

export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetSettingsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







/**
 * @summary Update user settings
 */
export const getUpdateSettingsUrl = () => {




  return `/api/settings`
}

export const updateSettings = async (updateSettingsBody: UpdateSettingsBody, options?: RequestInit): Promise<Settings> => {

  return customFetch<Settings>(getUpdateSettingsUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      updateSettingsBody,)
  }
);}




export const getUpdateSettingsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<UpdateSettingsBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<UpdateSettingsBody>}, TContext> => {

const mutationKey = ['updateSettings'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateSettings>>, {data: BodyType<UpdateSettingsBody>}> = (props) => {
          const {data} = props ?? {};

          return  updateSettings(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>
    export type UpdateSettingsMutationBody = BodyType<UpdateSettingsBody>
    export type UpdateSettingsMutationError = ErrorType<unknown>

    /**
 * @summary Update user settings
 */
export const useUpdateSettings = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<UpdateSettingsBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof updateSettings>>,
        TError,
        {data: BodyType<UpdateSettingsBody>},
        TContext
      > => {
      return useMutation(getUpdateSettingsMutationOptions(options));
    }

