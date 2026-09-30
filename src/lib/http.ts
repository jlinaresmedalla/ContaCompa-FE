import axios, { isAxiosError, isCancel } from 'axios'

import { ENV } from '@/app/config/env'
import { i18n } from '@/app/i18n'
import { API_KEY_STORE } from '@/lib/apiKey'

const REQUEST_TIMEOUT_MS = 180_000
const UNAUTHORIZED_STATUS = 401

export const http = axios.create({ baseURL: ENV.apiUrl, timeout: REQUEST_TIMEOUT_MS })
let companyRequests = new AbortController()

function anySignal(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([a, b])
  // Older browsers: forward whichever aborts first.
  const merged = new AbortController()
  for (const signal of [a, b]) {
    if (signal.aborted) merged.abort(signal.reason)
    else signal.addEventListener('abort', () => merged.abort(signal.reason), { once: true })
  }
  return merged.signal
}

export function cancelCompanyRequests(): void {
  companyRequests.abort()
  companyRequests = new AbortController()
}

http.interceptors.request.use((config) => {
  config.signal = config.signal
    ? anySignal(config.signal as AbortSignal, companyRequests.signal)
    : companyRequests.signal
  const key = API_KEY_STORE.get()
  // A request may carry its own key (sign-in checks a candidate before storing it).
  if (key && !config.headers.has('X-API-Key')) config.headers.set('X-API-Key', key)
  return config
})

let onUnauthorized: () => void = () => {}

/** Registers what a 401 does (the app signs out); http.ts knows nothing about the router. */
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

// A 401 on the stored key ends the session. A candidate key being checked at sign-in, or a
// request that was sent with an older key, is not the session's key and does not.
http.interceptors.response.use(undefined, (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === UNAUTHORIZED_STATUS) {
    const sent = error.config?.headers.get('X-API-Key')
    if (sent && sent === API_KEY_STORE.get()) onUnauthorized()
  }
  throw error
})

export type ApiError = {
  status?: number
  code?: string
  message: string
  traceId?: string
  cause?: unknown
}

type ErrorEnvelope = { error?: { code?: string; message?: string; request_id?: string } }

/** The API answers errors as { error: { code, message, request_id } }. */
export function toApiError(error: unknown): ApiError {
  if (isAxiosError<ErrorEnvelope>(error)) {
    const body = error.response?.data?.error
    const status = error.response?.status
    return {
      status,
      code: body?.code,
      message:
        status === UNAUTHORIZED_STATUS
          ? i18n.t('errors.apiKey')
          : (body?.message ??
            (status ? i18n.t('errors.requestFailed', { status }) : i18n.t('errors.unreachable'))),
      traceId: body?.request_id,
      cause: error,
    }
  }
  return { message: i18n.t('errors.unexpected'), cause: error }
}

export function isCancellation(error: unknown): boolean {
  return isCancel(error)
}
