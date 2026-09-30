import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { AccountMenu } from '.'

const ACCOUNT = {
  company: 'Example SAC',
  initials: 'ES',
  timeLeft: 'Time left: 2 h',
  signOut: vi.fn(),
}
beforeEach(async () => {
  await i18n.changeLanguage('en')
  applyTheme('system')
  ACCOUNT.signOut.mockClear()
})
async function openAccount() {
  fireEvent.keyDown(screen.getByRole('button', { name: /account|empresa/i }), { key: 'Enter' })
  return screen.findByRole('button', { name: /Language:|Idioma:/ })
}
test('account icon menus change language and theme with keyboard radio choices', async () => {
  render(<AccountMenu collapsed {...ACCOUNT} />)
  const globe = await openAccount()
  expect(globe.textContent).toBe('')
  fireEvent.keyDown(globe, { key: 'Enter' })
  const english = await screen.findByRole('menuitemradio', { name: /English/ })
  expect(english).toHaveAttribute('aria-checked', 'true')
  fireEvent.keyDown(english, { key: 'ArrowDown' })
  const spanish = screen.getByRole('menuitemradio', { name: /Spanish/ })
  await waitFor(() => expect(spanish).toHaveFocus())
  fireEvent.keyDown(spanish, { key: 'Enter' })
  await waitFor(() => expect(i18n.language).toBe('es'))
  const theme = await screen.findByRole('button', { name: 'Tema: Sistema' })
  fireEvent.keyDown(theme, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Oscuro' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
})
test('full company name, key lifetime and sign-out remain available', async () => {
  render(<AccountMenu collapsed={false} {...ACCOUNT} />)
  expect(screen.getByRole('button', { name: 'Company account' })).toHaveAttribute(
    'title',
    ACCOUNT.company,
  )
  await openAccount()
  expect(screen.getByRole('menu')).toHaveTextContent(ACCOUNT.company)
  expect(screen.getByText(ACCOUNT.timeLeft)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))
  expect(ACCOUNT.signOut).toHaveBeenCalledTimes(1)
})
