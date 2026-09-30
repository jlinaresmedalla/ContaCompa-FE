import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { paths } from '@/app/router/paths'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { apiKeyStore } from '@/lib/api-key'
import { http } from '@/lib/http'

import { HomePage } from './HomePage'

beforeEach(() => {
  localStorage.clear()
  void i18n.changeLanguage('en')
})

afterEach(() => vi.restoreAllMocks())

function renderHome() {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={paths.home} element={<HomePage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

test.each([null, 'stored-key'])('Home uses only storage with key %s', async (key) => {
  if (key) apiKeyStore.set(key)
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
  const buttons = screen.getAllByRole('link', { name: key ? 'Open dashboard' : 'Sign in' })
  expect(buttons).toHaveLength(2)
  for (const button of buttons) {
    expect(button).toHaveAttribute('href', key ? paths.purchaseDocs : paths.signIn)
  }
  await act(async () => {})
  expect(request).not.toHaveBeenCalled()
  expect(xhr).not.toHaveBeenCalled()
  expect(fetch).not.toHaveBeenCalled()
})

test('both main buttons follow a key removed by another tab', () => {
  apiKeyStore.set('stored-key')
  renderHome()
  act(() => {
    apiKeyStore.clear()
    window.dispatchEvent(new StorageEvent('storage', { key: 'doc-extraction.api-key' }))
  })
  expect(screen.getAllByRole('link', { name: 'Sign in' })).toHaveLength(2)
  expect(screen.queryByRole('link', { name: 'Open dashboard' })).toBeNull()
})
