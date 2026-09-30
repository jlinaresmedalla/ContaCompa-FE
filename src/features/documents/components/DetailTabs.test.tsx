import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import type { PurchaseDocDetail } from '../types'
import { DetailTabs } from './DetailTabs'
import { LinesTable } from './LinesTable'

const MOCKS = vi.hoisted(() => ({ correct: vi.fn() }))
vi.mock('../hooks', () => ({
  useCorrectDoc: () => ({ mutateAsync: MOCKS.correct, isPending: false }),
}))
const SECOND_LINE_NUMBER = 2
const DOC: PurchaseDocDetail = {
  id: 'doc',
  supplier: null,
  doc_type: 'invoice',
  doc_number: 'F001-1',
  issue_date: null,
  currency: 'PEN',
  total_amount: '118',
  taxable_amount: '100',
  igv_amount: '18',
  prices_include_igv: true,
  buyer_ruc: null,
  has_warnings: false,
  issues: [],
  documents: [],
  exported_at: null,
  created_at: '2026-09-30T00:00:00Z',
  corrections: [
    {
      field: 'quantity',
      line_id: 'first',
      old_value: '1',
      new_value: '2',
      corrected_at: '2026-09-30T00:00:00Z',
      corrected_by: 'accountant',
    },
  ],
  lines: [
    {
      id: 'first',
      line_number: 1,
      description: 'First item',
      quantity: '2',
      unit: 'NIU',
      unit_price: '59',
      line_total: '118',
      unit_price_without_igv: '50',
      unit_price_with_igv: '59',
      line_total_without_igv: '100',
      line_total_with_igv: '118',
    },
    {
      id: 'second',
      line_number: SECOND_LINE_NUMBER,
      description: 'Second item',
      quantity: '1',
      unit: 'NIU',
      unit_price: '118',
      line_total: '118',
      unit_price_without_igv: '100',
      unit_price_with_igv: '118',
      line_total_without_igv: '100',
      line_total_with_igv: '118',
    },
  ],
}
function width(phone = false) {
  vi.stubGlobal('innerWidth', phone ? TABLET_WIDTH_PX - 1 : TABLET_WIDTH_PX)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: phone, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}
beforeEach(async () => {
  MOCKS.correct.mockReset().mockResolvedValue(DOC)
  width()
  await i18n.changeLanguage('en')
})
afterEach(() => vi.unstubAllGlobals())

function editFirst() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
}

test('both prices appear and the printed prices are marked; only the changed line is sent', async () => {
  render(<LinesTable doc={DOC} />)
  expect(
    screen.getByRole('columnheader', { name: 'Unit price with IGV (Printed)' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Unit price without IGV' })).toBeInTheDocument()
  editFirst()
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  expect(screen.queryByLabelText('Line 1 Unit price without IGV')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() =>
    expect(MOCKS.correct).toHaveBeenCalledWith({
      fields: {},
      lines: [{ id: 'first', quantity: '3' }],
    }),
  )
})

test('an empty save sends nothing', async () => {
  render(<LinesTable doc={DOC} />)
  editFirst()
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() => expect(screen.queryByLabelText('Line 1 Quantity')).not.toBeInTheDocument())
  expect(MOCKS.correct).not.toHaveBeenCalled()
})

test('failed saves retain the draft and invalid values block a request', async () => {
  MOCKS.correct.mockRejectedValue(new Error('Unavailable'))
  render(<LinesTable doc={DOC} />)
  editFirst()
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: 'invalid' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(MOCKS.correct).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Line 1 Quantity'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save line 1' }))
  await waitFor(() => expect(MOCKS.correct).toHaveBeenCalledOnce())
  expect(screen.getByLabelText('Line 1 Quantity')).toHaveValue('3')
})

test('open drafts survive switching to history and back', () => {
  render(<DetailTabs doc={DOC} />)
  fireEvent.mouseDown(screen.getByRole('tab', { name: 'Lines' }), { button: 0, ctrlKey: false })
  editFirst()
  fireEvent.change(screen.getByLabelText('Line 1 Description'), { target: { value: 'Draft' } })
  fireEvent.mouseDown(screen.getByRole('tab', { name: 'Correction history' }), {
    button: 0,
    ctrlKey: false,
  })
  expect(screen.getByRole('columnheader', { name: 'Before' })).toBeInTheDocument()
  fireEvent.mouseDown(screen.getByRole('tab', { name: 'Lines' }), { button: 0, ctrlKey: false })
  expect(screen.getByLabelText('Line 1 Description')).toHaveValue('Draft')
})

test('phone editing uses a sheet, keeps table cells read-only and restores focus on Escape', async () => {
  width(true)
  render(<LinesTable doc={DOC} />)
  const trigger = screen.getByRole('button', { name: 'Edit line 1' })
  trigger.focus()
  editFirst()
  const sheet = await screen.findByRole('dialog', { name: 'Edit line 1' })
  expect(within(sheet).getByLabelText('Quantity')).toHaveValue('2')
  expect(within(sheet).getByRole('button', { name: 'Save' })).toBeInTheDocument()
  expect(document.querySelector('table input')).toBeNull()
  await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true))
  fireEvent.change(within(sheet).getByLabelText('Quantity'), { target: { value: '3' } })
  fireEvent.click(within(sheet).getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(MOCKS.correct).toHaveBeenCalledWith({
      fields: {},
      lines: [{ id: 'first', quantity: '3' }],
    }),
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  editFirst()
  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await waitFor(() => expect(trigger).toHaveFocus())
})

test('unknown IGV keeps separate printed columns and derives no values', () => {
  render(<LinesTable doc={{ ...DOC, prices_include_igv: null }} />)
  expect(screen.getByRole('columnheader', { name: 'Unit price (Printed)' })).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Line total (Printed)' })).toBeInTheDocument()
})
