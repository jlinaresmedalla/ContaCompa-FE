import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { Button } from '.'

test('renders the compact action and runs it without submitting its form', () => {
  const onClick = vi.fn()
  const onSubmit = vi.fn()
  render(
    <form onSubmit={onSubmit}>
      <Button size="sm" onClick={onClick}>
        {i18n.t('common.delete')}
      </Button>
    </form>,
  )
  fireEvent.click(screen.getByRole('button', { name: i18n.t('common.delete') }))
  expect(onClick).toHaveBeenCalledOnce()
  expect(onSubmit).not.toHaveBeenCalled()
})

test('preserves a link through the button slot', () => {
  render(
    <Button asChild>
      <a href="/design">{i18n.t('common.delete')}</a>
    </Button>,
  )
  expect(screen.getByRole('link')).toHaveAttribute('href', '/design')
})
