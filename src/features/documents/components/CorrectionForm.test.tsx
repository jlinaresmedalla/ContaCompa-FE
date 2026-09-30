import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import type { PurchaseDocDetail } from '../types'
import { CorrectionForm } from './CorrectionForm'

const correct = vi.hoisted(() => vi.fn())
vi.mock('../hooks', () => ({
  useCorrectDoc: () => ({ mutateAsync: correct, isPending: false, error: null }),
}))

const doc: PurchaseDocDetail = {
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
      unit_price_without_igv: null,
      unit_price_with_igv: null,
      line_total_without_igv: null,
      line_total_with_igv: null,
    },
  ],
}

beforeEach(() => {
  correct.mockReset()
  correct.mockResolvedValue(doc)
  void i18n.changeLanguage('en')
})

test('submits only edited header and line values in the existing PATCH shape', async () => {
  render(<CorrectionForm doc={doc} />)
  fireEvent.change(screen.getByLabelText('Supplier'), { target: { value: 'Corrected name' } })
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save corrections' }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({
      fields: { supplier_name: 'Corrected name' },
      lines: [{ id: 'line-1', quantity: '3' }],
    }),
  )
})

async function pickSalesReceiptWithKeyboard() {
  const trigger = screen.getByRole('combobox', { name: 'Type' })
  trigger.focus()
  fireEvent.keyDown(trigger, { key: 'Enter' })
  const invoice = await screen.findByRole('option', { name: 'Invoice' })
  await waitFor(() => expect(invoice).toHaveFocus())
  fireEvent.keyDown(invoice, { key: 'ArrowDown' })
  const receipt = screen.getByRole('option', { name: 'Sales receipt' })
  await waitFor(() => expect(receipt).toHaveFocus())
  fireEvent.keyDown(receipt, { key: 'Enter' })
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  return trigger
}

test('saves a document type picked through the keyboard Select in the correction payload', async () => {
  render(<CorrectionForm doc={doc} />)
  await pickSalesReceiptWithKeyboard()
  fireEvent.click(screen.getByRole('button', { name: 'Save corrections' }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({
      fields: { doc_type: 'sales_receipt' },
      lines: [],
    }),
  )
})

test('opens, moves and picks the Select using only the keyboard and shows the picked label', async () => {
  render(<CorrectionForm doc={doc} />)
  const trigger = await pickSalesReceiptWithKeyboard()
  expect(trigger).toHaveTextContent('Sales receipt')
  await waitFor(() => expect(trigger).toHaveFocus())
  expect(correct).not.toHaveBeenCalled()
})
