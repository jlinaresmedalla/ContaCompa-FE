import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test } from 'vitest'

import { i18n } from '@/app/i18n'
import { sessionKeys } from '@/features/session/api'
import { apiKeyStore } from '@/lib/api-key'

import { AppLayout } from './AppLayout'

afterEach(cleanup)

beforeEach(() => {
  localStorage.clear()
  apiKeyStore.set('company-a')
  void i18n.changeLanguage('en')
})

function renderLayout() {
  const client = new QueryClient()
  // 5 h 12 min and a bit: whole minutes are shown, so a slow test run cannot flip the text.
  client.setQueryData(sessionKeys.me, {
    company: { ruc: '20543306771', legal_name: 'Acme SAC' },
    expires_at: new Date(Date.now() + (5 * 60 + 12) * 60_000 + 30_000).toISOString(),
  })
  client.setQueryData(['purchase-docs', 'list'], { items: ['company-a'] })
  const router = createMemoryRouter(
    [
      { path: '/sign-in', element: <p>page:sign-in</p> },
      {
        element: <AppLayout />,
        children: [
          { path: '/extraction/purchase-docs', element: <p>page:docs</p> },
          { path: '/monitor/costs', element: <p>page:costs</p> },
        ],
      },
    ],
    { initialEntries: ['/extraction/purchase-docs'] },
  )
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { client, router }
}

test('sidebar bottom shows company and time left; sign-out clears key and cache', async () => {
  const { client, router } = renderLayout()
  expect(screen.getByText('Acme SAC')).toBeInTheDocument()
  expect(screen.getByText('Time left: 5 h 12 min')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
  await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  expect(router.state.location.search).toBe('')
  expect(apiKeyStore.get()).toBeNull()
  await waitFor(() => expect(client.getQueryData(['purchase-docs', 'list'])).toBeUndefined())
  expect(client.getQueryData(sessionKeys.me)).toBeUndefined()
})

test('the mobile menu closes on Escape, backdrop click and navigation', () => {
  renderLayout()
  const toggle = () => screen.getByRole('button', { name: /menu/i })
  expect(toggle()).toHaveAttribute('aria-controls', 'sidebar')
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle())
  expect(toggle()).toHaveAttribute('aria-expanded', 'true')
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle())
  fireEvent.click(screen.getByTestId('sidebar-backdrop'))
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle())
  fireEvent.click(screen.getByRole('link', { name: 'Monitor' }))
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByTestId('sidebar-backdrop')).toBeNull()
})

test('Browser Back does not reopen the mobile menu', async () => {
  const { router } = renderLayout()
  const toggle = () => screen.getByRole('button', { name: /menu/i })
  fireEvent.click(toggle())
  fireEvent.click(screen.getByRole('link', { name: 'Monitor' }))
  expect(router.state.location.pathname).toBe('/monitor/costs')
  await act(() => router.navigate(-1))
  expect(router.state.location.pathname).toBe('/extraction/purchase-docs')
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')
})
