import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { PublicHeader } from '.'

const PHONE_WIDTH_PX = 375
const TABLET_WIDTH_PX = 768
const FORCED_RAIL_WIDTH_PX = 1100
const DESKTOP_WIDTH_PX = 1280
const WIDTHS = [PHONE_WIDTH_PX, TABLET_WIDTH_PX, FORCED_RAIL_WIDTH_PX, DESKTOP_WIDTH_PX]
beforeEach(async () => {
  await i18n.changeLanguage('en')
  applyTheme('system')
})
afterEach(() => vi.unstubAllGlobals())
test.each(WIDTHS)('lazy public icon menus change preferences at %i px', async (width) => {
  vi.stubGlobal('innerWidth', width)
  render(
    <MemoryRouter>
      <PublicHeader />
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: 'View code' })).toBeVisible()
  expect(screen.getByRole('link', { name: 'Go to app →' })).toBeVisible()
  const globe = await screen.findByRole('button', { name: 'Language: English' })
  expect(globe.textContent).toBe('')
  fireEvent.keyDown(globe, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: /Spanish/ }))
  await waitFor(() => expect(i18n.language).toBe('es'))
  fireEvent.keyDown(screen.getByRole('button', { name: 'Tema: Sistema' }), { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Oscuro' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(screen.getByRole('button', { name: 'Tema: Oscuro' })).toBeInTheDocument()
})

test('phone View code link has an icon and an accessible name', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  render(
    <MemoryRouter>
      <PublicHeader />
    </MemoryRouter>,
  )
  const link = screen.getByRole('link', { name: 'View code' })
  expect(link.textContent).toBe('')
  expect(link.querySelector('svg')).toBeInTheDocument()
})
