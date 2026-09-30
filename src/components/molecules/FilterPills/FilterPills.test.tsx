import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { FilterPills } from '.'

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'clean', label: 'Clean' },
  { value: 'disabled', label: 'Unavailable', disabled: true },
]

test('selects a filter and reflects the controlled selection', () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <FilterPills label="Filters" options={OPTIONS} value="all" onChange={onChange} />,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Clean' }))
  expect(onChange).toHaveBeenCalledWith('clean')
  rerender(<FilterPills label="Filters" options={OPTIONS} value="clean" onChange={onChange} />)
  expect(screen.getByRole('button', { name: 'Clean' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('group')).toHaveClass('flex-nowrap', 'overflow-x-auto')
})

test('does not select a disabled filter', () => {
  const onChange = vi.fn()
  render(<FilterPills label="Filters" options={OPTIONS} value="all" onChange={onChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Unavailable' }))
  expect(onChange).not.toHaveBeenCalled()
})
