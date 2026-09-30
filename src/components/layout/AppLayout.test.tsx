import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { SESSION_KEYS } from '@/features/session/api'
import { API_KEY_STORE } from '@/lib/api-key'

import { AppLayout } from './AppLayout'

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

test('collapsing hides labels, preserves the choice on remount and opens module pages', async () => {
  renderLayout()
  fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
  expect(screen.queryByText('Extraction')).toBeNull()
  expect(screen.queryByRole('link', { name: 'Jobs' })).toBeNull()
  cleanup()
  renderLayout()
  expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
  fireEvent.keyDown(screen.getByRole('button', { name: 'Extraction' }), { key: 'Enter' })
  expect(await screen.findByRole('menuitem', { name: 'Jobs' })).toBeInTheDocument()
  expect(screen.getByRole('menuitem', { name: 'Purchase docs' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('phone drawer closes on navigation, Escape and outside tap and restores focus', async () => {
  const PHONE_WIDTH_PX = 375
  vi.stubGlobal('innerWidth', PHONE_WIDTH_PX)
  renderLayout()
  const trigger = screen.getByRole('button', { name: 'Open menu' })
  fireEvent.click(trigger)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() => expect(trigger).toHaveFocus())
  fireEvent.click(trigger)
  fireEvent.pointerDown(screen.getByTestId('sidebar-backdrop'), { button: 0 })
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() => expect(trigger).toHaveFocus())
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('link', { name: 'Costs' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() => expect(trigger).toHaveFocus())
})

test('Browser Back does not reopen the drawer', async () => {
  const PHONE_WIDTH_PX = 375
  vi.stubGlobal('innerWidth', PHONE_WIDTH_PX)
  const { router } = renderLayout()
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  fireEvent.click(screen.getByRole('link', { name: 'Costs' }))
  await act(() => router.navigate(-1))
  expect(router.state.location.pathname).toBe('/extraction/purchase-docs')
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('module pages are nested in the sidebar, with no content tabs or exposed preferences', () => {
  renderLayout()
  expect(screen.getByRole('complementary')).toContainElement(
    screen.getByRole('link', { name: 'Jobs' }),
  )
  expect(screen.queryByRole('navigation', { name: 'Module pages' })).toBeNull()
  expect(screen.queryByRole('group', { name: 'Language' })).toBeNull()
  expect(screen.queryByRole('radiogroup', { name: 'Theme' })).toBeNull()
})
