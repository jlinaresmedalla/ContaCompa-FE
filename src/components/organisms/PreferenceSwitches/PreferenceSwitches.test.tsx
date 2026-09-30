import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { PreferenceSwitches } from '.'

beforeEach(async () => {
  await i18n.changeLanguage('en')
  applyTheme('system')
})
test('gallery uses the shared icon menus without visible mode labels or a select', async () => {
  render(<PreferenceSwitches />)
  const globe = screen.getByRole('button', { name: 'Language: English' })
  expect(globe.textContent).toBe('')
  expect(screen.queryByRole('combobox')).toBeNull()
  fireEvent.keyDown(globe, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: /Spanish/ }))
  await waitFor(() => expect(i18n.language).toBe('es'))
  fireEvent.keyDown(screen.getByRole('button', { name: 'Tema: Sistema' }), { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Oscuro' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
})
