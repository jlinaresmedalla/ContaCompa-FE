import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { PATHS } from '@/app/router/paths'
import { PublicLayout } from '@/components/templates'
import { API_KEY_STORE } from '@/lib/apiKey'
import { http } from '@/lib/http'
import { applyTheme } from '@/lib/theme'

import { HomePage } from './HomePage'

const APP_LINK_COUNT = 1

beforeEach(() => {
  localStorage.clear()
  applyTheme('system')
  void i18n.changeLanguage('en')
})

afterEach(() => vi.restoreAllMocks())

function renderHome() {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.signIn} element={<p>Sign-in destination</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

test.each([null, 'stored-key'])('Home uses only storage with key %s', async (key) => {
  if (key) API_KEY_STORE.set(key)
  const request = vi.fn().mockRejectedValue(new Error('Home must not make requests'))
  vi.spyOn(http, 'request').mockImplementation(request)
  vi.spyOn(http, 'get').mockImplementation(request)
  vi.spyOn(http, 'post').mockImplementation(request)
  const xhr = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {})
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(request)
  renderHome()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Purchase documents, read for you.',
  )
  const buttons = screen.getAllByRole('link', { name: 'Go to app →' })
  expect(buttons).toHaveLength(APP_LINK_COUNT)
  expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Go to app →' })).toBe(
    buttons[0],
  )
  for (const button of buttons) {
    expect(button).toHaveAttribute('href', key ? PATHS.purchaseDocs : PATHS.signIn)
  }
  await act(async () => {})
  expect(request).not.toHaveBeenCalled()
  expect(xhr).not.toHaveBeenCalled()
  expect(fetch).not.toHaveBeenCalled()
})

test('the top-bar button follows a key removed by another tab', () => {
  API_KEY_STORE.set('stored-key')
  renderHome()
  act(() => {
    API_KEY_STORE.clear()
    window.dispatchEvent(new StorageEvent('storage', { key: 'doc-extraction.api-key' }))
  })
  expect(screen.getAllByRole('link', { name: 'Go to app →' })).toHaveLength(APP_LINK_COUNT)
  for (const link of screen.getAllByRole('link', { name: 'Go to app →' })) {
    expect(link).toHaveAttribute('href', PATHS.signIn)
  }
})

test('the top-bar button uses native Spanish copy', async () => {
  await i18n.changeLanguage('es')
  renderHome()
  expect(screen.getAllByRole('link', { name: 'Ir a la app →' })).toHaveLength(APP_LINK_COUNT)
})

test('the public bar changes theme and language with icon controls', async () => {
  renderHome()
  fireEvent.keyDown(await screen.findByRole('button', { name: 'Theme: System' }), { key: 'Enter' })
  const dark = await screen.findByRole('menuitemradio', { name: 'Dark' })
  expect(dark.querySelector('svg')).toBeInTheDocument()
  fireEvent.click(dark)
  expect(document.documentElement.dataset.theme).toBe('dark')
  fireEvent.keyDown(screen.getByRole('button', { name: 'Language: English' }), { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: /Spanish/ }))
  await waitFor(() => expect(i18n.language).toBe('es'))
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tus comprobantes,')
})

test('Go to app navigates to sign-in without a stored key', async () => {
  renderHome()
  fireEvent.click(screen.getAllByRole('link', { name: 'Go to app →' })[0]!)
  expect(await screen.findByText('Sign-in destination')).toBeInTheDocument()
})
