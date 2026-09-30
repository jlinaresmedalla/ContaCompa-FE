import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { PreferenceSwitches } from './PreferenceSwitches'

vi.mock('@/components/molecules', () => ({
  AppSelect: () => <select aria-label="Unexpected public select" />,
}))

beforeEach(async () => {
  localStorage.clear()
  await i18n.changeLanguage('en')
})

test('shows short codes with full names, focus help and changes both languages', async () => {
  render(<PreferenceSwitches />)
  const english = screen.getByRole('button', { name: 'English' })
  const spanish = screen.getByRole('button', { name: 'Spanish' })
  expect(english).toHaveTextContent('EN')
  expect(spanish).toHaveTextContent('ES')
  expect(english).toHaveAttribute('aria-pressed', 'true')
  act(() => spanish.focus())
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Spanish')
  fireEvent.click(spanish)
  await waitFor(() => expect(i18n.language).toBe('es'))
  expect(document.documentElement.lang).toBe('es')
  expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Inglés' }))
  await waitFor(() => expect(i18n.language).toBe('en'))
  expect(document.documentElement.lang).toBe('en')
})

test('keeps public theme choices visible in a phone-sized container', () => {
  const PHONE_WIDTH_PX = 375
  const widthSpy = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 0, PHONE_WIDTH_PX, 1))
  const container = document.createElement('div')
  container.style.width = `${PHONE_WIDTH_PX}px`
  document.body.append(container)
  const view = render(<PreferenceSwitches />, { container })
  expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'Light' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'System' })).toBeInTheDocument()
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('radio', { name: 'Dark' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  view.unmount()
  container.remove()
  widthSpy.mockRestore()
})
