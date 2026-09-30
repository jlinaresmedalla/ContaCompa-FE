import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import type { CorrectionPayload, PurchaseDocDetail } from '../types'
import { HeaderSections } from './HeaderSections'

const correct = vi.hoisted(() => vi.fn())
vi.mock('../hooks', () => ({
  useCorrectDoc: () => ({ mutateAsync: correct, isPending: false, error: null }),
}))

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
      unit_price_without_igv: null,
      unit_price_with_igv: null,
      line_total_without_igv: null,
      line_total_with_igv: null,
    },
  ],
}

beforeEach(() => {
  correct.mockReset()
  correct.mockImplementation((payload: CorrectionPayload) =>
    Promise.resolve({
      ...DOC,
      supplier: {
        ...DOC.supplier,
        legal_name:
          typeof payload.fields.supplier_name === 'string'
            ? payload.fields.supplier_name
            : DOC.supplier?.legal_name,
      },
    }),
  )
  void i18n.changeLanguage('en')
})

function openSupplier() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit Supplier' }))
}

function supplierGroup() {
  return within(screen.getByRole('region', { name: 'Supplier' }))
}

test('reads four groups first and sends only the edited supplier name', async () => {
  render(<HeaderSections doc={DOC} />)
  for (const name of ['Supplier', 'Document', 'Amounts', 'Buyer']) {
    expect(screen.getByRole('region', { name })).toBeInTheDocument()
  }
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  openSupplier()
  fireEvent.change(supplierGroup().getByLabelText('Supplier'), {
    target: { value: 'Corrected name' },
  })
  fireEvent.click(supplierGroup().getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({
      fields: { supplier_name: 'Corrected name' },
      lines: [],
    }),
  )
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Edit Supplier' })).toBeInTheDocument(),
  )
  expect(supplierGroup().getByText('Corrected name')).toBeInTheDocument()
})

test('Cancel restores the saved value when reopened', () => {
  render(<HeaderSections doc={DOC} />)
  openSupplier()
  fireEvent.change(supplierGroup().getByLabelText('Supplier'), {
    target: { value: 'Discard this' },
  })
  fireEvent.click(supplierGroup().getByRole('button', { name: 'Cancel' }))
  openSupplier()
  expect(supplierGroup().getByLabelText('Supplier')).toHaveValue('Original name')
  expect(correct).not.toHaveBeenCalled()
})

test('an empty save closes the group without a correction', () => {
  render(<HeaderSections doc={DOC} />)
  openSupplier()
  fireEvent.click(supplierGroup().getByRole('button', { name: 'Save' }))
  expect(correct).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Edit Supplier' })).toBeInTheDocument()
})

test('a failed save keeps the draft for another attempt', async () => {
  correct.mockRejectedValue(new Error('Unavailable'))
  render(<HeaderSections doc={DOC} />)
  openSupplier()
  fireEvent.change(supplierGroup().getByLabelText('Supplier'), { target: { value: 'Retry name' } })
  fireEvent.click(supplierGroup().getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(correct).toHaveBeenCalledOnce())
  expect(supplierGroup().getByLabelText('Supplier')).toHaveValue('Retry name')
})

test('another group keeps its draft through a save and refreshed document', async () => {
  const view = render(<HeaderSections doc={DOC} />)
  openSupplier()
  fireEvent.change(supplierGroup().getByLabelText('Supplier'), {
    target: { value: 'Corrected name' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Edit Document' }))
  const documentGroup = within(screen.getByRole('region', { name: 'Document' }))
  fireEvent.change(documentGroup.getByLabelText('Document number'), { target: { value: 'F001-2' } })
  fireEvent.click(supplierGroup().getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Edit Supplier' })).toBeInTheDocument(),
  )
  view.rerender(
    <HeaderSections
      doc={{ ...DOC, supplier: { ...DOC.supplier!, legal_name: 'Corrected name' } }}
    />,
  )
  expect(documentGroup.getByLabelText('Document number')).toHaveValue('F001-2')
  expect(correct).toHaveBeenCalledWith({ fields: { supplier_name: 'Corrected name' }, lines: [] })
})

async function pickSalesReceiptWithKeyboard() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit Document' }))
  const trigger = await screen.findByRole('combobox', { name: 'Type' })
  trigger.focus()
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  await screen.findByRole('option', { name: 'Invoice' })
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  fireEvent.keyDown(trigger, { key: 'Enter' })
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  return trigger
}

test('saves a document type picked with the keyboard through AppSelect', async () => {
  render(<HeaderSections doc={DOC} />)
  const trigger = await pickSalesReceiptWithKeyboard()
  expect(screen.getByText('Sales receipt')).toBeInTheDocument()
  await waitFor(() => expect(trigger).toHaveFocus())
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({ fields: { doc_type: 'sales_receipt' }, lines: [] }),
  )
})
