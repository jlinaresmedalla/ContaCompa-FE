import { AxiosError, CanceledError, type InternalAxiosRequestConfig } from 'axios'
import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { API_KEY_STORE } from './api-key'
import { cancelCompanyRequests, http, setUnauthorizedHandler } from './http'

const FORBIDDEN_STATUS = 403
const UNAUTHORIZED_STATUS = 401

const DEFAULT_ADAPTER = http.defaults.adapter

beforeEach(() => localStorage.clear())

afterEach(() => {
  http.defaults.adapter = DEFAULT_ADAPTER
  setUnauthorizedHandler(() => {})
})

function answerWith(status: number) {
  http.defaults.adapter = (config: InternalAxiosRequestConfig) =>
    Promise.reject(
      new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, {
        status,
        statusText: '',
        headers: {},
        config,
        data: {},
      }),
    )
}

test('company switch aborts an outstanding HTTP request', async () => {
  let signal: AbortSignal | undefined
  const pending = http.get('/held', {
    adapter: (config) =>
      new Promise((_resolve, reject) => {
        signal = config.signal as AbortSignal
        signal.addEventListener('abort', () => reject(new CanceledError()))
      }),
  })
  await waitFor(() => expect(signal).toBeDefined())
  cancelCompanyRequests()
  await expect(pending).rejects.toBeInstanceOf(CanceledError)
})

test('a 401 on the stored key calls the unauthorized handler; a 403 does not', async () => {
  const handler = vi.fn()
  setUnauthorizedHandler(handler)
  API_KEY_STORE.set('stored')
  answerWith(FORBIDDEN_STATUS)
  await expect(http.get('/v1/x')).rejects.toBeInstanceOf(AxiosError)
  expect(handler).not.toHaveBeenCalled()
  answerWith(UNAUTHORIZED_STATUS)
  await expect(http.get('/v1/x')).rejects.toBeInstanceOf(AxiosError)
  expect(handler).toHaveBeenCalledOnce()
})

test('a 401 for a candidate key (sign-in) does not sign out', async () => {
  const handler = vi.fn()
  setUnauthorizedHandler(handler)
  answerWith(UNAUTHORIZED_STATUS)
  await expect(
    http.get('/v1/me', { headers: { 'X-API-Key': 'candidate' } }),
  ).rejects.toBeInstanceOf(AxiosError)
  expect(handler).not.toHaveBeenCalled()
})

test('a 401 for a request sent with a key other than the stored one does not sign out', async () => {
  const handler = vi.fn()
  setUnauthorizedHandler(handler)
  API_KEY_STORE.set('current')
  answerWith(UNAUTHORIZED_STATUS)
  await expect(http.get('/v1/x', { headers: { 'X-API-Key': 'older' } })).rejects.toBeInstanceOf(
    AxiosError,
  )
  expect(handler).not.toHaveBeenCalled()
})
