import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { PATHS } from '@/app/router/paths'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { http } from '@/lib/http'

import { DesignPage } from './DesignPage'
import { TokenSections } from './components/TokenSections'

const TOKEN_LAYER_COUNT = 2

beforeEach(() => {
  localStorage.clear()
  void i18n.changeLanguage('en')
})

afterEach(() => vi.restoreAllMocks())

test('Design renders every shared component section without HTTP requests', async () => {
  const request = vi.fn().mockRejectedValue(new Error('Design must not make requests'))
  vi.spyOn(http, 'request').mockImplementation(request)
  vi.spyOn(http, 'get').mockImplementation(request)
  vi.spyOn(http, 'post').mockImplementation(request)
  const xhr = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {})
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(request)
  render(
    <MemoryRouter initialEntries={[PATHS.design]}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={PATHS.design} element={<DesignPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { name: 'Design system', level: 1 })).toBeInTheDocument()
  for (const name of [
    'Brand backdrop',
    'Sidebar and company avatar',
    'Company avatar',
    'Button',
    'Icon button with tooltip',
    'Input',
    'Select',
    'Badge',
    'Card',
    'Stat',
    'Segmented',
    'DataTable',
    'Skeleton',
    'EmptyState',
    'Toast',
    'PageHeader',
  ]) {
    expect(
      await screen.findByRole('heading', { name, level: TOKEN_LAYER_COUNT }),
    ).toBeInTheDocument()
  }
  expect(screen.getByText('--backdrop-primary')).toBeInTheDocument()
  expect(screen.getByText('--backdrop-amber')).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Primary · Icon button' }).length).toBeGreaterThan(0)
  expect(screen.getAllByText('CC').length).toBeGreaterThan(0)
  expect((await screen.findAllByRole('combobox')).length).toBeGreaterThan(0)
  expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()
  await act(async () => {})
  expect(request).not.toHaveBeenCalled()
  expect(xhr).not.toHaveBeenCalled()
  expect(fetch).not.toHaveBeenCalled()
})

test('semantic references follow the live stylesheet when the theme changes', async () => {
  const root = document.documentElement
  const previous = root.getAttribute('data-theme')
  const style = document.createElement('style')
  style.textContent = `
    :root { --primary: var(--terracotta-600); }
    :root[data-theme='dark'] { --primary: var(--terracotta-400); }
  `
  root.dataset.theme = 'light'
  document.head.append(style)
  try {
    const view = render(<TokenSections />)
    const sample = screen.getByText('--primary').parentElement!
    expect(within(sample).getByText('--terracotta-600')).toBeInTheDocument()
    await act(async () => {
      root.dataset.theme = 'dark'
      await Promise.resolve()
    })
    expect(within(sample).getByText('--terracotta-400')).toBeInTheDocument()
    expect(within(sample).queryByText('--terracotta-600')).toBeNull()
    view.unmount()
  } finally {
    style.remove()
    if (previous === null) root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', previous)
  }
})
