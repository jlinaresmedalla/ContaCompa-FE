import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import type { PurchaseDocDetail } from '../types'
import { LinesTable } from './LinesTable'
import { DetailTabs } from './DetailTabs'

const correct = vi.hoisted(() => vi.fn())
vi.mock('../hooks', () => ({
  useCorrectDoc: () => ({ mutateAsync: correct, isPending: false, error: null }),
}))

const OTHER_LINE_NUMBER = 2

const DOC: PurchaseDocDetail = {
  id: 'record-1',
  supplier: { ruc: '20600000005', legal_name: 'Original name' },
  doc_type: 'invoice',
  doc_number: 'F001-1',
  issue_date: '2026-09-01',
  currency: 'PEN',
  total_amount: '100.00',
  prices_include_igv: true,
  taxable_amount: '84.75',
  igv_amount: '15.25',
  buyer_ruc: '20500000008',
  has_warnings: false,
  issues: [],
  created_at: '2026-09-01T00:00:00Z',
  exported_at: null,
  documents: [],
  corrections: [],
  lines: [
    {
      id: 'line-1',
      line_number: 1,
      description: 'Paper',
      quantity: '2',
      unit: 'unit',
      unit_price: '50.00',
      line_total: '100.00',
      unit_price_without_igv: '42.3729',
      unit_price_with_igv: null,
      line_total_without_igv: null,
      line_total_with_igv: null,
    },
  ],
}

afterEach(() => vi.unstubAllGlobals())

beforeEach(() => {
  correct.mockReset()
  correct.mockResolvedValue(DOC)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  void i18n.changeLanguage('en')
})

test('submits only edited line values in the existing PATCH shape', async () => {
  render(
    <LinesTable
      doc={{
        ...DOC,
        lines: [
          DOC.lines[0]!,
          { ...DOC.lines[0]!, id: 'line-other', line_number: OTHER_LINE_NUMBER },
        ],
      }}
    />,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
  expect(screen.queryByLabelText('Line 2 Quantity')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({ fields: {}, lines: [{ id: 'line-1', quantity: '3' }] }),
  )
})

test('shows both prices and marks the printed column', () => {
  render(<DetailTabs doc={DOC} />)
  fireEvent.click(screen.getByRole('tab', { name: 'Lines' }))
  expect(screen.getByText('42.3729')).toBeInTheDocument()
  expect(screen.getByText('50')).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Unit price with IGV (Printed)' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Unit price without IGV' })).toBeInTheDocument()
})

test('does not show derived prices without the IGV flag', () => {
  render(
    <LinesTable
      doc={{
        ...DOC,
        prices_include_igv: null,
        lines: [{ ...DOC.lines[0]!, unit_price_without_igv: '42.3729' }],
      }}
    />,
  )
  expect(screen.queryByText('42.3729')).not.toBeInTheDocument()
  expect(screen.getByText('Unit price (Printed)')).toBeInTheDocument()
})

test('detail choices use a select below tablet width', async () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  render(<DetailTabs doc={DOC} />)
  expect(await screen.findByRole('combobox', { name: 'Detail view' })).toBeInTheDocument()
  expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  vi.unstubAllGlobals()
})

test('cancel discards edits and an unchanged save sends nothing', async () => {
  render(<LinesTable doc={DOC} />)
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
  expect(screen.getByLabelText('Line 1 Quantity')).toHaveValue('2')
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() => expect(screen.queryByLabelText('Line 1 Quantity')).not.toBeInTheDocument())
  expect(correct).not.toHaveBeenCalled()
})

test('a failed save retains the edited row', async () => {
  correct.mockRejectedValue(new Error('Failed'))
  render(<LinesTable doc={DOC} />)
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() => expect(correct).toHaveBeenCalled())
  expect(screen.getByLabelText('Line 1 Quantity')).toHaveValue('3')
})
