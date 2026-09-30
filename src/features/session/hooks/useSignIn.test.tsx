import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import type { FormEvent, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { API_KEY_STORE } from '@/lib/apiKey'

import { SESSION_API, SESSION_KEYS } from '../api/sessionApi'
import type { Me } from '../types/session'
import { useSignIn } from './useSignIn'

const ACCEPTED_COMPANY: Me = {
  company: { ruc: '20543306771', legal_name: 'Acme SAC' },
  expires_at: '2030-01-01T00:00:00Z',
}

function renderSignIn() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/sign-in']}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
  return { ...renderHook(useSignIn, { wrapper: Wrapper }), client }
}

function submit(result: { current: ReturnType<typeof useSignIn> }, key: string) {
  act(() => result.current.setValue(key))
  act(() => result.current.submit({ preventDefault: vi.fn() } as unknown as FormEvent))
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

test('stores the trimmed key and replaces company data only after /v1/me accepts it', async () => {
  let accept!: (me: Me) => void
  const me = vi.spyOn(SESSION_API, 'me').mockImplementation(
    () =>
      new Promise<Me>((resolve) => {
        accept = resolve
      }),
  )
  const { result, client } = renderSignIn()
  client.setQueryData(['previous-company'], { name: 'Previous company' })
  submit(result, ' good ')
  await waitFor(() => expect(me).toHaveBeenCalledWith('good'))
  expect(API_KEY_STORE.get()).toBeNull()
  expect(client.getQueryData(['previous-company'])).toBeDefined()
  act(() => accept(ACCEPTED_COMPANY))
  await waitFor(() => expect(API_KEY_STORE.get()).toBe('good'))
  expect(client.getQueryData(SESSION_KEYS.me)).toEqual(ACCEPTED_COMPANY)
  expect(client.getQueryData(['previous-company'])).toBeUndefined()
})

test('a rejected key stays unstored and exposes the failure', async () => {
  vi.spyOn(SESSION_API, 'me').mockRejectedValue(new Error('rejected'))
  const { result } = renderSignIn()
  submit(result, 'bad')
  await waitFor(() => expect(result.current.isError).toBe(true))
  expect(API_KEY_STORE.get()).toBeNull()
  expect(result.current.errorMessage).toBeTruthy()
})

test('an empty trimmed key sends no request', () => {
  const me = vi.spyOn(SESSION_API, 'me')
  const { result } = renderSignIn()
  submit(result, '   ')
  expect(result.current.canSubmit).toBe(false)
  expect(me).not.toHaveBeenCalled()
})
