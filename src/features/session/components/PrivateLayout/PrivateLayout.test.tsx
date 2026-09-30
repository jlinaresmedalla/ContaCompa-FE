import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { SESSION_KEYS } from '@/features/session/api/sessionApi'
import { API_KEY_STORE } from '@/lib/apiKey'

import { PrivateLayout } from './PrivateLayout'

const DESKTOP_WIDTH_PX = 1280
const EXPIRY_HOURS = 5
const MINUTES_PER_HOUR = 60
const EXPIRY_MINUTES = 12
const MS_PER_MINUTE = 60_000
const PARTIAL_MINUTE_MS = 30_000

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

beforeEach(() => {
  vi.stubGlobal('innerWidth', DESKTOP_WIDTH_PX)
  localStorage.clear()
  API_KEY_STORE.set('company-a')
  void i18n.changeLanguage('en')
})

function renderLayout() {
  const client = new QueryClient()
  // 5 h 12 min and a bit: whole minutes are shown, so a slow test run cannot flip the text.
  client.setQueryData(SESSION_KEYS.me, {
    company: { ruc: '20543306771', legal_name: 'Acme SAC' },
    expires_at: new Date(
      Date.now() +
        (EXPIRY_HOURS * MINUTES_PER_HOUR + EXPIRY_MINUTES) * MS_PER_MINUTE +
        PARTIAL_MINUTE_MS,
    ).toISOString(),
  })
  client.setQueryData(['purchase-docs', 'list'], { items: ['company-a'] })
  const router = createMemoryRouter(
    [
      { path: '/sign-in', element: <p>page:sign-in</p> },
      {
        element: <PrivateLayout />,
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

test('avatar menu shows company and time left; sign-out clears key and cache', async () => {
  const { client, router } = renderLayout()
  fireEvent.keyDown(screen.getByRole('button', { name: 'Company account' }), { key: 'Enter' })
  expect(await screen.findByText('Time left: 5 h 12 min')).toBeInTheDocument()
  expect(screen.getByRole('menu')).toHaveTextContent('Acme SAC')
  fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))
  await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  expect(API_KEY_STORE.get()).toBeNull()
  await waitFor(() => expect(client.getQueryData(['purchase-docs', 'list'])).toBeUndefined())
  expect(client.getQueryData(SESSION_KEYS.me)).toBeUndefined()
})
