import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { PATHS } from '@/app/router/paths'
import { PublicLayout } from '@/components/templates'
import { http } from '@/lib/http'

import { DesignPage } from './DesignPage'
import { TokenSections } from './components/TokenSections'

const COMPONENT_HEADING_LEVEL = 3
const LEVEL_HEADING_LEVEL = 2
const RESPONSIVE_SAMPLE_COUNT = 2

beforeEach(() => {
  localStorage.clear()
  void i18n.changeLanguage('en')
})

afterEach(() => vi.restoreAllMocks())

test('Design renders every level and its shared component states without HTTP requests', async () => {
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
  const levels = {
    Atoms: [
      'Brand backdrop',
      'Company avatar',
      'Button',
      'Input',
      'Badge',
      'Card',
      'Skeleton',
      'Toggle',
      'Toggle group',
      'Tooltip',
      'Table',
    ],
    Molecules: [
      'Icon button with tooltip',
      'Input',
      'Select',
      'Stat',
      'Stat row',
      'Filter pills',
      'Segmented',
      'EmptyState',
      'PageHeader',
      'Page skeleton',
      'Error note',
      'Public main action',
    ],
    Organisms: [
      'Sidebar and company avatar',
      'DataTable',
      'Toast',
      'Account menu',
      'Preferences',
      'Invoice field states',
      'Yes / No icons',
      'Action bar',
      'Bottom sheet',
      'List row',
      'Status chip',
      'More actions and confirmation',
      'Language and theme menus',
      'Observations and preview column',
    ],
    Templates: ['Public header', 'Public layout', 'App layout'],
  }
  for (const [level, components] of Object.entries(levels)) {
    const section = screen.getByRole('region', { name: level })
    expect(
      within(section).getByRole('heading', { name: level, level: LEVEL_HEADING_LEVEL }),
    ).toBeInTheDocument()
    for (const name of components) {
      expect(
        await within(section).findByRole('heading', { name, level: COMPONENT_HEADING_LEVEL }),
      ).toBeInTheDocument()
    }
  }
  for (const token of [
    '--control-height',
    '--control-touch-height',
    '--stat-card-height',
    '--list-row-height',
    '--table-row-compact-height',
    '--card-radius',
    '--focus-width',
  ]) {
    expect(screen.getByText(token)).toBeInTheDocument()
  }
  const invoice = screen.getByRole('heading', { name: 'Invoice field states' }).parentElement!
  for (const state of ['Default', 'Changed', 'Invalid', 'Valid']) {
    expect(within(invoice).getByText(state)).toBeInTheDocument()
  }
  expect(within(invoice).getByLabelText('Supplier RUC')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByText('--backdrop-primary')).toBeInTheDocument()
  expect(screen.getByText('--backdrop-amber')).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Primary · Icon button' }).length).toBeGreaterThan(0)
  expect(screen.getAllByText('CC').length).toBeGreaterThan(0)
  expect((await screen.findAllByRole('combobox')).length).toBeGreaterThan(0)
  expect(screen.getAllByRole('button', { name: /^Theme:/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'More actions' }).length).toBeGreaterThan(1)
  expect(screen.getAllByText(/The printed total differs from the item totals\./)).toHaveLength(
    RESPONSIVE_SAMPLE_COUNT,
  )
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
