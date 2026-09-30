import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { i18n } from '@/app/i18n'
import { applyTheme } from '@/lib/theme'
import { PublicPhonePreferences } from '.'

beforeEach(async () => {
  localStorage.clear()
  applyTheme('system')
  await i18n.changeLanguage('en')
})

test('phone language menu changes language through a keyboard-reachable icon', async () => {
  render(<PublicPhonePreferences />)
  const trigger = screen.getByRole('button', { name: 'Language: English' })
  expect(trigger.querySelector('svg')).toBeInTheDocument()
  fireEvent.keyDown(trigger, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('menuitemradio', { name: 'ES — Spanish' }))
  await waitFor(() => expect(i18n.language).toBe('es'))
  expect(screen.getByRole('button', { name: 'Idioma: Español' })).toBeInTheDocument()
})

test('phone theme menu keeps the active icon and applies the selected theme', async () => {
  render(<PublicPhonePreferences />)
  fireEvent.keyDown(screen.getByRole('button', { name: 'Theme: System' }), { key: 'Enter' })
  expect(await screen.findByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
    'aria-checked',
    'true',
  )
  fireEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(screen.getByRole('button', { name: 'Theme: Dark' })).toBeInTheDocument()
})
