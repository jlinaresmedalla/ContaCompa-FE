import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Controller, useForm } from 'react-hook-form'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { AppSelect } from './app-select'
import { Segmented } from './segmented'
import { SEGMENTED_SELECT_WIDTH_PX } from './use-segmented-width'

const OPTIONS = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'receipt', label: 'Receipt' },
]
const submit = vi.fn()
const PHONE_WIDTH_PX = 375

function TestForm() {
  const { control, handleSubmit } = useForm({ defaultValues: { type: 'invoice' } })
  return (
    <form onSubmit={(event) => void handleSubmit(submit)(event)}>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <AppSelect label="Type" {...field} inputRef={field.ref} options={OPTIONS} />
        )}
      />
      <button type="submit">Save</button>
    </form>
  )
}

beforeEach(() => {
  submit.mockClear()
  void i18n.changeLanguage('en')
})

test('keyboard selection reaches a React Hook Form submit', async () => {
  render(<TestForm />)
  const input = await screen.findByRole('combobox', { name: 'Type' })
  input.focus()
  fireEvent.keyDown(input, { key: 'ArrowDown' })
  await screen.findByRole('option', { name: 'Invoice' })
  fireEvent.keyDown(input, { key: 'ArrowDown' })
  fireEvent.keyDown(input, { key: 'Enter' })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(submit.mock.calls[0]?.[0]).toEqual({ type: 'receipt' }))
})

test('Segmented becomes a select at phone container width and preserves its choice', async () => {
  const measure = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ width: PHONE_WIDTH_PX } as DOMRect)
  const onChange = vi.fn()
  try {
    render(<Segmented label="Type" value="receipt" options={OPTIONS} onChange={onChange} />)
    await screen.findByRole('combobox', { name: 'Type' })
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.getByText('Receipt')).toBeInTheDocument()
  } finally {
    measure.mockRestore()
  }
})

test('Segmented keeps the row at the named width boundary', () => {
  const measure = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ width: SEGMENTED_SELECT_WIDTH_PX } as DOMRect)
  try {
    render(<Segmented label="Type" value="invoice" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('radiogroup', { name: 'Type' })).toBeInTheDocument()
  } finally {
    measure.mockRestore()
  }
})

test('associates validation with the control', async () => {
  render(
    <AppSelect
      label="Type"
      value="invoice"
      options={OPTIONS}
      onChange={() => {}}
      error="Choose a valid type"
    />,
  )
  const input = await screen.findByRole('combobox', { name: 'Type' })
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription('Choose a valid type')
})

test('multi selection reports all selected values and searches options', async () => {
  const onChange = vi.fn()
  render(
    <AppSelect
      multiple
      searchable
      label="Types"
      value={['invoice']}
      options={OPTIONS}
      onChange={onChange}
    />,
  )
  const input = await screen.findByRole('combobox', { name: 'Types' })
  fireEvent.change(input, { target: { value: 'Rece' } })
  fireEvent.click(await screen.findByRole('option', { name: 'Receipt' }))
  expect(onChange).toHaveBeenCalledWith(['invoice', 'receipt'])
})

test('disables the select', async () => {
  render(<AppSelect disabled label="Type" value="invoice" options={OPTIONS} onChange={() => {}} />)
  expect(await screen.findByRole('combobox', { name: 'Type', hidden: true })).toBeDisabled()
})
