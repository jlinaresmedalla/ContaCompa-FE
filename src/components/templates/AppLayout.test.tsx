import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import { AppLayout } from './AppLayout'

const DESKTOP_WIDTH_PX = 1280
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

beforeEach(() => {
  vi.stubGlobal('innerWidth', DESKTOP_WIDTH_PX)
  localStorage.clear()
  void i18n.changeLanguage('en')
})

function renderLayout() {
  const router = createMemoryRouter(
    [
      { path: '/sign-in', element: <p>page:sign-in</p> },
      {
        element: (
          <AppLayout
            account={{
              company: 'Acme SAC',
              initials: 'AS',
              timeLeft: 'Time left: 5 h',
              signOut: () => {},
            }}
          />
        ),
        children: [
          { path: '/extraction/purchase-docs', element: <p>page:docs</p> },
          { path: '/monitor/costs', element: <p>page:costs</p> },
        ],
      },
    ],
    { initialEntries: ['/extraction/purchase-docs'] },
  )
  render(<RouterProvider router={router} />)
  return { router }
}

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

const TABLET_WIDTH_PX = 768
const LAST_DRAWER_WIDTH_PX = 1023
const TABLET_DRAWER_WIDTHS = [TABLET_WIDTH_PX, LAST_DRAWER_WIDTH_PX]
test.each(TABLET_DRAWER_WIDTHS)('uses the drawer and branded top bar at %i px', (width) => {
  vi.stubGlobal('innerWidth', width)
  renderLayout()
  const trigger = screen.getByRole('button', { name: 'Open menu' })
  expect(trigger.closest('header')).toContainElement(screen.getByText('Contacompa'))
  expect(trigger.closest('header')).toContainElement(
    screen.getByRole('button', { name: 'Company account' }),
  )
  expect(screen.queryByRole('complementary')).toBeNull()
  fireEvent.click(trigger)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('uses the persistent desktop sidebar at the 1024 px boundary', () => {
  const DESKTOP_BOUNDARY_PX = 1024
  vi.stubGlobal('innerWidth', DESKTOP_BOUNDARY_PX)
  renderLayout()
  expect(screen.getByRole('complementary')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open menu' })).toBeNull()
})

const FORCED_RAIL_WIDTH_PX = 1100
function resize(width: number) {
  act(() => {
    vi.stubGlobal('innerWidth', width)
    window.dispatchEvent(new Event('resize'))
  })
}
test('forced rail preserves expanded preference and restores it at 1280 px', () => {
  localStorage.setItem('contacompa.sidebar.expanded', 'true')
  vi.stubGlobal('innerWidth', FORCED_RAIL_WIDTH_PX)
  renderLayout()
  expect(screen.getByRole('complementary')).toHaveAttribute('data-state', 'collapsed')
  expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeDisabled()
  expect(localStorage.getItem('contacompa.sidebar.expanded')).toBe('true')
  resize(DESKTOP_WIDTH_PX)
  expect(screen.getByRole('complementary')).toHaveAttribute('data-state', 'expanded')
})
test('collapsed preference survives forced rail and a drawer round trip', () => {
  renderLayout()
  fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
  resize(FORCED_RAIL_WIDTH_PX)
  resize(DESKTOP_WIDTH_PX)
  expect(screen.getByRole('complementary')).toHaveAttribute('data-state', 'collapsed')
  resize(LAST_DRAWER_WIDTH_PX)
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  resize(DESKTOP_WIDTH_PX)
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(screen.getByRole('complementary')).toHaveAttribute('data-state', 'collapsed')
  expect(localStorage.getItem('contacompa.sidebar.expanded')).toBe('false')
})

const PHONE_LOGO_WIDTH_PX = 375
const LOGO_WIDTHS_PX = [PHONE_LOGO_WIDTH_PX, FORCED_RAIL_WIDTH_PX, DESKTOP_WIDTH_PX]
test.each(LOGO_WIDTHS_PX)('private logo is static at %i px', (width) => {
  vi.stubGlobal('innerWidth', width)
  renderLayout()
  expect(screen.queryByRole('link', { name: 'Home' })).toBeNull()
  const shell =
    width === FORCED_RAIL_WIDTH_PX
      ? screen.getByRole('complementary')
      : screen.getByText('Contacompa').parentElement!
  const mark = shell.querySelector('svg')!
  expect(mark.closest('a, button, [role="link"], [role="button"], [tabindex]')).toBeNull()
  if (width !== FORCED_RAIL_WIDTH_PX) {
    expect(screen.getByText('Contacompa').closest('a, button, [tabindex]')).toBeNull()
  }
})
