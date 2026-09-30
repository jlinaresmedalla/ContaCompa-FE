import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { AccountMenu } from './AccountMenu'

const ACCOUNT = {
  company: 'Example SAC',
  initials: 'ES',
  timeLeft: 'Time left: 2 h',
  signOut: vi.fn(),
}

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
  render(<AccountMenu collapsed={false} {...ACCOUNT} />)
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

test('renders supplied company, initials and time left and calls supplied sign-out', async () => {
  render(<AccountMenu collapsed={false} {...ACCOUNT} />)
  expect(screen.getByText('ES')).toBeInTheDocument()
  await openMenu()
  expect(screen.getByRole('menu')).toHaveTextContent(ACCOUNT.company)
  expect(screen.getByText(ACCOUNT.timeLeft)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))
  expect(ACCOUNT.signOut).toHaveBeenCalledTimes(1)
})

test('theme choices show only named icons in one group and retain their tooltips', async () => {
  render(<AccountMenu collapsed {...ACCOUNT} />)
  await openMenu()
  for (const name of ['Light', 'Dark', 'System']) {
    const choice = screen.getByRole('menuitemradio', { name })
    expect(choice).toHaveAttribute('title', name)
    expect(choice.textContent).toBe('')
    expect(choice.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(choice.parentElement).toHaveAttribute('aria-label', 'Theme')
  }
  fireEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
})
