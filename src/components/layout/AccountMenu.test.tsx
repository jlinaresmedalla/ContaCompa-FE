import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { AccountMenu } from './AccountMenu'

vi.mock('./use-account-menu', () => ({
  useAccountMenu: () => ({ company: 'Example', initials: 'EX', timeLeft: null, signOut: vi.fn() }),
}))

beforeEach(async () => {
  await i18n.changeLanguage('en')
  applyTheme('system')
})

async function openMenu() {
  fireEvent.keyDown(screen.getByRole('button', { name: /account|empresa/i }), { key: 'Enter' })
  const first = await screen.findByRole('menuitemradio', { name: /English|Inglés/ })
  await waitFor(() => expect(first).toHaveFocus())
  return first
}

async function arrowTo(from: HTMLElement, name: string) {
  fireEvent.keyDown(from, { key: 'ArrowDown' })
  const next = screen.getByRole('menuitemradio', { name })
  await waitFor(() => expect(next).toHaveFocus())
  return next
}

test('arrow keys reach language and theme radio items and Enter changes preferences', async () => {
  render(<AccountMenu collapsed={false} />)
  const english = await openMenu()
  expect(english).toHaveTextContent('EN')
  expect(english).toHaveAttribute('aria-checked', 'true')
  const spanish = await arrowTo(english, 'Spanish')
  expect(spanish).toHaveTextContent('ES')
  fireEvent.keyDown(spanish, { key: 'Enter' })
  await waitFor(() => expect(i18n.language).toBe('es'))
  expect(document.documentElement.lang).toBe('es')

  const first = await openMenu()
  const selected = await arrowTo(first, 'Español')
  expect(selected).toHaveAttribute('aria-checked', 'true')
  const light = await arrowTo(selected, 'Claro')
  const dark = await arrowTo(light, 'Oscuro')
  const system = await arrowTo(dark, 'Sistema')
  expect(system).toHaveAttribute('aria-checked', 'true')
  fireEvent.keyDown(system, { key: 'ArrowUp' })
  await waitFor(() => expect(dark).toHaveFocus())
  fireEvent.keyDown(dark, { key: 'Enter' })
  expect(document.documentElement.dataset.theme).toBe('dark')
  await openMenu()
  expect(screen.getByRole('menuitemradio', { name: 'Oscuro' })).toHaveAttribute(
    'aria-checked',
    'true',
  )
  expect(screen.getByRole('menuitem', { name: 'Cerrar sesión' })).toBeInTheDocument()
})
