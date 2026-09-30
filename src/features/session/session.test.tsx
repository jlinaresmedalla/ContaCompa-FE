import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { ROUTES } from '@/app/router/routes'
import { API_KEY_STORE } from '@/lib/api-key'
import { http, setUnauthorizedHandler, toApiError } from '@/lib/http'

import { SESSION_KEYS } from './api'
import { handleUnauthorized } from './session'

const OK_STATUS = 200
const ERROR_STATUS_START = 400
const FORBIDDEN_STATUS = 403
const KEY_LIFETIME_MS = 3_600_000
const UNAUTHORIZED_STATUS = 401

vi.mock('@/features/documents', () => ({
  DocumentsPage: () => <p>page:purchase-docs</p>,
  DocumentDetailPage: () => <p>page:purchase-doc-detail</p>,
}))
vi.mock('@/features/jobs', () => ({ JobsPage: () => <p>page:jobs</p> }))
// The Costs page stands in for any page that reads company data.
vi.mock('@/features/costs', () => ({
  CostsPage: function CostsProbe() {
    const probe = useQuery({
      queryKey: ['probe'],
      queryFn: ({ signal }) => http.get('/v1/probe', { signal }),
    })
    return probe.error ? <p role="alert">{toApiError(probe.error).message}</p> : <p>page:costs</p>
  },
}))

const DEFAULT_ADAPTER = http.defaults.adapter
let probeStatus = OK_STATUS

/** A fake API: only the key "good" is accepted by /v1/me; /v1/probe answers `probeStatus`. */
function fakeApi(config: InternalAxiosRequestConfig) {
  const reply = (status: number, data: unknown) => {
    const response = { status, statusText: '', headers: {}, config, data }
    return status < ERROR_STATUS_START
      ? Promise.resolve(response)
      : Promise.reject(new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, response))
  }
  if (config.url === '/v1/me') {
    if (config.headers.get('X-API-Key') === 'forbidden') {
      return reply(FORBIDDEN_STATUS, { error: { code: 'denied', message: 'Forbidden me' } })
    }
    return config.headers.get('X-API-Key') === 'good'
      ? reply(OK_STATUS, {
          company: { ruc: '20543306771', legal_name: 'Acme SAC' },
          expires_at: new Date(Date.now() + KEY_LIFETIME_MS).toISOString(),
        })
      : reply(UNAUTHORIZED_STATUS, { error: { code: 'unauthorized', message: 'no' } })
  }
  return probeStatus === OK_STATUS
    ? reply(OK_STATUS, {})
    : reply(probeStatus, { error: { code: 'denied', message: 'Forbidden here' } })
}

beforeEach(() => {
  localStorage.clear()
  probeStatus = OK_STATUS
  http.defaults.adapter = fakeApi
  void i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
  http.defaults.adapter = DEFAULT_ADAPTER
  setUnauthorizedHandler(() => {})
})

function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(ROUTES, { initialEntries: [path] })
  setUnauthorizedHandler(() => handleUnauthorized(client, router))
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { client, router }
}

function signIn(key: string) {
  fireEvent.change(screen.getByLabelText('API key'), { target: { value: key } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
}

test('a valid key lands on purchase docs and shows the company', async () => {
  const { router } = renderAt('/sign-in')
  signIn('good')
  expect(await screen.findByText('page:purchase-docs')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/extraction/purchase-docs')
  expect(screen.getByText('Acme SAC')).toBeInTheDocument()
  expect(API_KEY_STORE.get()).toBe('good')
})

test('an invalid key shows the error and stores nothing', async () => {
  const { router } = renderAt('/sign-in')
  signIn('bad')
  expect(await screen.findByRole('alert')).toHaveTextContent('missing, invalid or expired')
  expect(API_KEY_STORE.get()).toBeNull()
  expect(router.state.location.pathname).toBe('/sign-in')
})

test('the guard sends a signed-out visitor to sign-in with the return path, then back', async () => {
  const { router } = renderAt('/monitor/costs?days=7')
  await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  expect(new URLSearchParams(router.state.location.search).get('next')).toBe(
    '/monitor/costs?days=7',
  )
  signIn('good')
  expect(await screen.findByText('page:costs')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/monitor/costs')
})

test.each([
  '//evil.example',
  '/\\evil.example',
  'https://evil.example',
  '/\t/evil.example',
  '/.//evil.example',
  '/a/..//evil.example',
  '/sign-in/',
  '/SIGN-IN',
])('an external return path (%s) falls back to purchase docs', async (next) => {
  const { router } = renderAt(`/sign-in?next=${encodeURIComponent(next)}`)
  signIn('good')
  expect(await screen.findByText('page:purchase-docs')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/extraction/purchase-docs')
})

test('a stored key shows a loading state on reload, then the requested page', async () => {
  API_KEY_STORE.set('good')
  const { router } = renderAt('/monitor/costs')
  expect(screen.getByRole('status')).toHaveTextContent('Loading')
  expect(await screen.findByText('page:costs')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/monitor/costs')
})

test('a 401 clears the key and the cache and returns to sign-in with the current path', async () => {
  API_KEY_STORE.set('good')
  const { client, router } = renderAt('/monitor/costs')
  await screen.findByText('page:costs')
  probeStatus = UNAUTHORIZED_STATUS
  await client.invalidateQueries({ queryKey: ['probe'] })
  await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  expect(new URLSearchParams(router.state.location.search).get('next')).toBe('/monitor/costs')
  expect(API_KEY_STORE.get()).toBeNull()
  await waitFor(() => expect(client.getQueryCache().getAll()).toHaveLength(0))
})

test('a 403 shows the error and keeps the session', async () => {
  probeStatus = FORBIDDEN_STATUS
  API_KEY_STORE.set('good')
  const { router } = renderAt('/monitor/costs')
  expect(await screen.findByRole('alert')).toHaveTextContent('Forbidden here')
  expect(router.state.location.pathname).toBe('/monitor/costs')
  expect(API_KEY_STORE.get()).toBe('good')
})

test('the guard shows the error card and keeps the key when /v1/me answers 403', async () => {
  API_KEY_STORE.set('forbidden')
  const { router } = renderAt('/monitor/costs')
  expect(await screen.findByRole('alert')).toHaveTextContent('Forbidden me')
  expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  expect(API_KEY_STORE.get()).toBe('forbidden')
  expect(router.state.location.pathname).toBe('/monitor/costs')
})

test('the previous company is gone before the next sign-in', async () => {
  const { client } = renderAt('/sign-in')
  client.setQueryData(SESSION_KEYS.me, {
    company: { ruc: '10000000001', legal_name: 'Old Company SA' },
    expires_at: new Date(Date.now() + KEY_LIFETIME_MS).toISOString(),
  })
  signIn('good')
  expect(await screen.findByText('Acme SAC')).toBeInTheDocument()
  expect(screen.queryByText('Old Company SA')).toBeNull()
})

test('a key removed in another tab sends this tab to sign-in', async () => {
  API_KEY_STORE.set('good')
  const { router } = renderAt('/monitor/costs')
  await screen.findByText('page:costs')
  localStorage.removeItem('doc-extraction.api-key')
  window.dispatchEvent(new StorageEvent('storage', { key: 'doc-extraction.api-key' }))
  await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  expect(new URLSearchParams(router.state.location.search).get('next')).toBe('/monitor/costs')
})
