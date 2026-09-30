import { act, fireEvent, render, screen } from '@testing-library/react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoryRouter, Link } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { IconButton } from '.'

function TranslatedAction() {
  const { t } = useTranslation()
  return <IconButton icon={Trash2} label={t('common.delete')} />
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

test.each(['en', 'es'] as const)(
  'uses the translated name and focus tooltip in %s',
  async (language) => {
    await i18n.changeLanguage(language)
    render(<TranslatedAction />)
    const label = i18n.t('common.delete')
    const button = screen.getByRole('button', { name: label })
    expect(button).not.toHaveTextContent(label)
    act(() => button.focus())
    expect(await screen.findByRole('tooltip')).toHaveTextContent(label)
  },
)

test('shows its label on hover and runs its action', async () => {
  const onClick = vi.fn()
  render(<IconButton icon={Trash2} label={i18n.t('common.delete')} onClick={onClick} />)
  const button = screen.getByRole('button', { name: i18n.t('common.delete') })
  fireEvent.pointerMove(button, { pointerType: 'mouse' })
  expect(await screen.findByRole('tooltip')).toHaveTextContent(i18n.t('common.delete'))
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledOnce()
})

test('passes the accessible name and icon to a link', () => {
  render(
    <MemoryRouter>
      <IconButton asChild icon={Trash2} label={i18n.t('common.open')}>
        <Link to="/extraction/purchase-docs" />
      </IconButton>
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: i18n.t('common.open') })).toHaveAttribute(
    'href',
    '/extraction/purchase-docs',
  )
})

test('disabled actions cannot run', () => {
  const onClick = vi.fn()
  render(<IconButton icon={Trash2} label={i18n.t('common.delete')} disabled onClick={onClick} />)
  const button = screen.getByRole('button', { name: i18n.t('common.delete') })
  expect(button).toBeDisabled()
  fireEvent.click(button)
  expect(onClick).not.toHaveBeenCalled()
})

test('runs a row action with the same accessible name', () => {
  const onClick = vi.fn()
  render(<IconButton size="row" icon={Trash2} label={i18n.t('common.delete')} onClick={onClick} />)
  fireEvent.click(screen.getByRole('button', { name: i18n.t('common.delete') }))
  expect(onClick).toHaveBeenCalledOnce()
})
