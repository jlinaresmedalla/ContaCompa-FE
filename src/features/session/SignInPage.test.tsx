import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { AxiosError } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { PATHS } from '@/app/router/paths'
import { API_KEY_STORE } from '@/lib/apiKey'
import { SESSION_API } from './api/sessionApi'
import { SignInPage } from './SignInPage'
import type { Me } from './types/session'

const COMPANY: Me = {
  company: { ruc: '20543306771', legal_name: 'Acme SAC' },
  expires_at: '2030-01-01T00:00:00Z',
}
const UNAUTHORIZED_STATUS = 401

beforeEach(async () => {
  localStorage.clear()
  await i18n.changeLanguage('en')
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderSignIn() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const router = createMemoryRouter(
    [
      { path: PATHS.signIn, element: <SignInPage /> },
      { path: PATHS.purchaseDocs, element: <p>Purchase docs landing</p> },
    ],
    { initialEntries: [PATHS.signIn] },
  )
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}
function enterKey(key: string) {
  fireEvent.change(screen.getByLabelText('API key'), { target: { value: key } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
}

test('a valid key reaches the landing page after showing field-local loading', async () => {
  let accept!: (me: Me) => void
  vi.spyOn(SESSION_API, 'me').mockImplementation(
    () =>
      new Promise((resolve) => {
        accept = resolve
      }),
  )
  const router = renderSignIn()
  enterKey('good')
  const status = await screen.findByRole('status')
  expect(status.parentElement).toContainElement(screen.getByLabelText('API key'))
  expect(screen.getByLabelText('API key')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Checking key…' })).toBeDisabled()
  accept(COMPANY)
  expect(await screen.findByText('Purchase docs landing')).toBeInTheDocument()
  expect(router.state.location.pathname).toBe(PATHS.purchaseDocs)
  expect(API_KEY_STORE.get()).toBe('good')
})

test('an invalid key describes the field with a nearby error and stores nothing', async () => {
  vi.spyOn(SESSION_API, 'me').mockRejectedValue(
    new AxiosError('invalid', undefined, undefined, undefined, {
      status: UNAUTHORIZED_STATUS,
      data: {},
      statusText: '',
      headers: {},
      config: {} as never,
    }),
  )
  const router = renderSignIn()
  enterKey('bad')
  const error = await screen.findByRole('alert')
  const input = screen.getByLabelText('API key')
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(error.id))
  expect(error.parentElement).toContainElement(input)
  expect(API_KEY_STORE.get()).toBeNull()
  expect(router.state.location.pathname).toBe(PATHS.signIn)
})

test('empty keys cannot submit and visibility toggles preserve the entered key', () => {
  const me = vi.spyOn(SESSION_API, 'me')
  renderSignIn()
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  const input = screen.getByLabelText('API key')
  fireEvent.change(input, { target: { value: 'secret' } })
  fireEvent.click(screen.getByRole('button', { name: 'Show key' }))
  expect(input).toHaveAttribute('type', 'text')
  expect(input).toHaveValue('secret')
  fireEvent.click(screen.getByRole('button', { name: 'Hide key' }))
  expect(input).toHaveAttribute('type', 'password')
  expect(me).not.toHaveBeenCalled()
})
