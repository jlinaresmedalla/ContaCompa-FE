import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { PublicLayout } from '@/components/templates'
import { HomePage } from '@/features/home/HomePage'
import { http } from '@/lib/http'

import { i18n } from '@/app/i18n'
import { SESSION_API } from '@/features/session'
import { API_KEY_STORE } from '@/lib/apiKey'

import { ROUTES } from './routes'

const DESKTOP_WIDTH_PX = 1280

const KEY_LIFETIME_MS = 3_600_000

vi.mock('@/features/documents/DocumentsPage', () => ({
  DocumentsPage: () => <p>page:purchase-docs</p>,
}))
vi.mock('@/features/documents/DocumentDetailPage', () => ({
  DocumentDetailPage: () => <p>page:purchase-doc-detail</p>,
}))
vi.mock('@/features/jobs/JobsPage', () => ({ JobsPage: () => <p>page:jobs</p> }))
vi.mock('@/features/costs/CostsPage', () => ({ CostsPage: () => <p>page:costs</p> }))

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

let meSpy = vi.fn()

beforeEach(() => {
  vi.stubGlobal('innerWidth', DESKTOP_WIDTH_PX)
  void i18n.changeLanguage('en')
  // Private routes start with a stored key that /v1/me accepts.
  localStorage.clear()
  API_KEY_STORE.set('key')
  meSpy = vi.fn().mockResolvedValue({
    company: { ruc: '20543306771', legal_name: 'Acme SAC' },
    expires_at: new Date(Date.now() + KEY_LIFETIME_MS).toISOString(),
  })
  vi.spyOn(SESSION_API, 'me').mockImplementation(meSpy)
})

function renderAt(path: string) {
  const router = createMemoryRouter(ROUTES, { initialEntries: [path] })
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

test('sidebar lists Extraction and Monitor, not Assistant', async () => {
  renderAt('/extraction/purchase-docs')
  const nav = await screen.findByRole('navigation', { name: 'Modules' })
  expect(nav).toHaveTextContent('Extraction')
  expect(nav).toHaveTextContent('Monitor')
  expect(screen.queryByRole('link', { name: /assistant/i })).toBeNull()
  expect(screen.getByRole('link', { name: 'Purchase docs' })).toHaveAttribute('aria-current', 'page')
})

test.each([
  ['/extraction/purchase-docs', 'page:purchase-docs'],
  ['/extraction/purchase-docs/abc', 'page:purchase-doc-detail'],
  ['/extraction/jobs', 'page:jobs'],
  ['/monitor/costs', 'page:costs'],
])('%s renders its page under the module prefix', async (path, text) => {
  renderAt(path)
  expect(await screen.findByText(text)).toBeInTheDocument()
  expect(screen.queryByRole('navigation', { name: 'Module pages' })).toBeNull()
})

test('Extraction nests its pages without content tabs', async () => {
  renderAt('/extraction/jobs')
  const tabs = await screen.findByRole('navigation', { name: 'Modules' })
  expect(tabs).toHaveTextContent('Purchase docs')
  expect(tabs).toHaveTextContent('Jobs')
})

test('the purchase doc detail keeps the Purchase docs sidebar page current', async () => {
  renderAt('/extraction/purchase-docs/abc')
  expect(await screen.findByRole('link', { name: 'Purchase docs' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByRole('link', { name: 'Jobs' })).not.toHaveAttribute('aria-current')
})

test('Monitor has a single page, so no tabs, and its page link is current', async () => {
  renderAt('/monitor/costs')
  expect(await screen.findByRole('link', { name: 'Costs' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.queryByRole('navigation', { name: 'Module pages' })).toBeNull()
})

test.each(['/nowhere', '/documents', '/assistant', '/extraction', '/costs'])(
  '%s redirects to purchase docs',
  async (path) => {
    const router = renderAt(path)
    expect(await screen.findByText('page:purchase-docs')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/extraction/purchase-docs')
  },
)

test('a bare /monitor opens Costs', async () => {
  const router = renderAt('/monitor')
  await waitFor(() => expect(router.state.location.pathname).toBe('/monitor/costs'))
})

test('language, theme and sign-out appear only in the avatar menu', async () => {
  renderAt('/extraction/purchase-docs')
  const avatar = await screen.findByRole('button', { name: 'Company account' })
  expect(screen.queryByRole('button', { name: /^Language:/ })).toBeNull()
  expect(screen.queryByRole('button', { name: /^Theme:/ })).toBeNull()
  fireEvent.keyDown(avatar, { key: 'Enter' })
  expect(await screen.findByRole('button', { name: /^Language:/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^Theme:/ })).toBeInTheDocument()
  expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument()
})

test.each([null, 'key'])(
  '/ renders public Home with key %s without checking the API',
  async (key) => {
    if (key === null) API_KEY_STORE.clear()
    const router = renderAt('/')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Purchase documents, read for you.',
    )
    expect(router.state.location.pathname).toBe('/')
    expect(meSpy).not.toHaveBeenCalled()
  },
)

test.each(['/nowhere', '/documents', '/assistant', '/costs'])(
  'unknown path %s without a key redirects to Home',
  async (path) => {
    API_KEY_STORE.clear()
    const router = renderAt(path)
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Purchase documents, read for you.',
    )
    expect(router.state.location.pathname).toBe('/')
    expect(meSpy).not.toHaveBeenCalled()
  },
)

test('a private path without a key keeps its return path at sign-in', async () => {
  API_KEY_STORE.clear()
  const router = renderAt('/extraction/jobs?filter=queued')
  await screen.findByRole('button', { name: 'Sign in' })
  expect(router.state.location.pathname).toBe('/sign-in')
  expect(new URLSearchParams(router.state.location.search).get('next')).toBe(
    '/extraction/jobs?filter=queued',
  )
  expect(meSpy).not.toHaveBeenCalled()
})

test('/design is public without a stored key', async () => {
  API_KEY_STORE.clear()
  const router = renderAt('/design')
  expect(
    await screen.findByRole('heading', { name: 'Design system', level: 1 }),
  ).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/design')
  expect(meSpy).not.toHaveBeenCalled()
})

// Isolate Home navigation from the private guard: /v1/me still validates private pages.
test.each([null, 'stored-key'])(
  'the Go to app link navigates by storage with key %s without an HTTP request',
  async (key) => {
    if (key === null) API_KEY_STORE.clear()
    else API_KEY_STORE.set(key)
    const request = vi.spyOn(http, 'request')
    const get = vi.spyOn(http, 'get')
    const post = vi.spyOn(http, 'post')
    const router = createMemoryRouter([
      { element: <PublicLayout />, children: [{ path: '/', element: <HomePage /> }] },
      { path: '/sign-in', element: <p>destination:sign-in</p> },
      { path: '/extraction/purchase-docs', element: <p>destination:landing</p> },
    ])
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )
    const links = screen.getAllByRole('link', { name: 'Go to app →' })
    expect(links).toHaveLength(1)
    fireEvent.click(screen.getByRole('link', { name: 'Go to app →' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(key ? '/extraction/purchase-docs' : '/sign-in'),
    )
    await act(async () => {
      await router.navigate('/')
    })
    expect(screen.getByRole('link', { name: 'Go to app →' })).toHaveAttribute(
      'href',
      key ? '/extraction/purchase-docs' : '/sign-in',
    )
    expect(request).not.toHaveBeenCalled()
    expect(get).not.toHaveBeenCalled()
    expect(post).not.toHaveBeenCalled()
    expect(meSpy).not.toHaveBeenCalled()
  },
)
