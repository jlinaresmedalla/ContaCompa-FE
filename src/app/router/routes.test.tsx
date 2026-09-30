import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { sessionApi } from '@/features/session'
import { apiKeyStore } from '@/lib/api-key'

import { routes } from './routes'

vi.mock('@/features/documents', () => ({
  DocumentsPage: () => <p>page:purchase-docs</p>,
  DocumentDetailPage: () => <p>page:purchase-doc-detail</p>,
}))
vi.mock('@/features/jobs', () => ({ JobsPage: () => <p>page:jobs</p> }))
vi.mock('@/features/costs', () => ({ CostsPage: () => <p>page:costs</p> }))

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

let meSpy = vi.fn()

beforeEach(() => {
  void i18n.changeLanguage('en')
  // Private routes start with a stored key that /v1/me accepts.
  localStorage.clear()
  apiKeyStore.set('key')
  meSpy = vi.fn().mockResolvedValue({
    company: { ruc: '20543306771', legal_name: 'Acme SAC' },
    expires_at: new Date(Date.now() + 3_600_000).toISOString(),
  })
  vi.spyOn(sessionApi, 'me').mockImplementation(meSpy)
})

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
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
  expect(screen.getByRole('link', { name: 'Extraction' })).toHaveAttribute('aria-current', 'page')
})

test.each([
  ['/extraction/purchase-docs', 'page:purchase-docs'],
  ['/extraction/purchase-docs/abc', 'page:purchase-doc-detail'],
  ['/extraction/jobs', 'page:jobs'],
  ['/monitor/costs', 'page:costs'],
])('%s renders its page under the module prefix', async (path, text) => {
  renderAt(path)
  expect(await screen.findByText(text)).toBeInTheDocument()
})

test('Extraction shows Purchase docs and Jobs tabs; Monitor shows none', async () => {
  renderAt('/extraction/jobs')
  const tabs = await screen.findByRole('navigation', { name: 'Module pages' })
  expect(tabs).toHaveTextContent('Purchase docs')
  expect(tabs).toHaveTextContent('Jobs')
})

test('the purchase doc detail keeps the Purchase docs tab current', async () => {
  renderAt('/extraction/purchase-docs/abc')
  expect(await screen.findByRole('link', { name: 'Purchase docs' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByRole('link', { name: 'Jobs' })).not.toHaveAttribute('aria-current')
})

test('Monitor has a single page, so no tabs, and its module link is current', async () => {
  renderAt('/monitor/costs')
  expect(await screen.findByRole('link', { name: 'Monitor' })).toHaveAttribute(
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

test('language, theme and sign-out live in the sidebar', async () => {
  renderAt('/extraction/purchase-docs')
  const sidebar = await screen.findByRole('complementary')
  expect(sidebar).toContainElement(screen.getByRole('radiogroup', { name: 'Language' }))
  expect(sidebar).toContainElement(screen.getByRole('radiogroup', { name: 'Theme' }))
  expect(sidebar).toContainElement(screen.getByRole('button', { name: 'Sign out' }))
})

test.each([null, 'key'])(
  '/ renders public Home with key %s without checking the API',
  async (key) => {
    if (key === null) apiKeyStore.clear()
    const router = renderAt('/')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Purchase documents, read for you.',
    )
    expect(router.state.location.pathname).toBe('/')
    expect(meSpy).not.toHaveBeenCalled()
  },
)

test('an unknown path without a key redirects to Home', async () => {
  apiKeyStore.clear()
  const router = renderAt('/nowhere')
  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
    'Purchase documents, read for you.',
  )
  expect(router.state.location.pathname).toBe('/')
  expect(meSpy).not.toHaveBeenCalled()
})

test('a private path without a key keeps its return path at sign-in', async () => {
  apiKeyStore.clear()
  const router = renderAt('/extraction/jobs?filter=queued')
  await screen.findByRole('button', { name: 'Sign in' })
  expect(router.state.location.pathname).toBe('/sign-in')
  expect(new URLSearchParams(router.state.location.search).get('next')).toBe(
    '/extraction/jobs?filter=queued',
  )
  expect(meSpy).not.toHaveBeenCalled()
})

test('/design is public without a stored key', async () => {
  apiKeyStore.clear()
  const router = renderAt('/design')
  expect(
    await screen.findByRole('heading', { name: 'Design system', level: 1 }),
  ).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/design')
  expect(meSpy).not.toHaveBeenCalled()
})
