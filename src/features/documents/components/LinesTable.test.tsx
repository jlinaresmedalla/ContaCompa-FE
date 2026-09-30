import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import type { PurchaseDocDetail } from '../types'
import { LinesTable } from './LinesTable'
import { DetailSections } from './DetailSections'

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
  render(<DetailSections doc={DOC} />)
  expect(screen.getByText('S/ 42.3729')).toBeInTheDocument()
  expect(screen.getByText('S/ 50.00')).toBeInTheDocument()
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
  expect(screen.queryByText('S/ 42.3729')).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Unit price (Printed)' })).toBeInTheDocument()
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

test.each([
  ['en', 'Unit'],
  ['es', 'Unidad'],
])('translates known units in %s', async (language, label) => {
  await i18n.changeLanguage(language)
  render(<LinesTable doc={DOC} />)
  expect(screen.getByText(label, { selector: 'td' })).toBeInTheDocument()
})

test('preserves unknown unit codes', () => {
  render(<LinesTable doc={{ ...DOC, lines: [{ ...DOC.lines[0]!, unit: 'custom-code' }] }} />)
  expect(screen.getByText('custom-code')).toBeInTheDocument()
})

test.each(['en', 'es'])(
  'renders the Items count and explanation tooltip in %s',
  async (language) => {
    await i18n.changeLanguage(language)
    render(<DetailSections doc={DOC} />)
    const section = screen.getByRole('region', { name: i18n.t('detail.items') })
    expect(
      within(section).getByRole('heading', {
        name: i18n.t('common.tableSectionCount', {
          label: i18n.t('detail.items'),
          count: DOC.lines.length,
        }),
      }),
    ).toBeInTheDocument()
    expect(section.querySelector('[data-slot="card"]')).toBeNull()
    expect(within(section).queryByText(i18n.t('detail.derivedPrices'))).not.toBeInTheDocument()
    fireEvent.focus(within(section).getByRole('button', { name: i18n.t('detail.derivedPrices') }))
    expect(await screen.findByRole('tooltip')).toHaveTextContent(i18n.t('detail.derivedPrices'))
  },
)

test('edits an Item in the phone sheet and sends only the changed field', async () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  render(<DetailSections doc={DOC} />)
  fireEvent.click(screen.getByRole('button', { name: 'Edit line 1' }))
  const sheet = await screen.findByRole('dialog', { name: 'Edit line 1' })
  expect(within(screen.getByRole('table', { hidden: true })).queryByRole('textbox')).toBeNull()
  fireEvent.change(within(sheet).getByLabelText('Quantity'), { target: { value: '3' } })
  fireEvent.click(within(sheet).getByRole('button', { name: i18n.t('detail.sectionSave') }))
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith({ fields: {}, lines: [{ id: 'line-1', quantity: '3' }] }),
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})

test.each(['en', 'es'])('short Items headers expose their full names in %s', async (language) => {
  await i18n.changeLanguage(language)
  render(<LinesTable doc={DOC} />)
  const fullName = `${i18n.t('prices.unitWith')} (${i18n.t('prices.printed')})`
  const header = screen.getByRole('columnheader', { name: fullName })
  expect(header).toHaveTextContent(i18n.t('prices.short.unitWith'))
  expect(header).not.toHaveTextContent(i18n.t('prices.printed'))
  fireEvent.focus(within(header).getByLabelText(fullName))
  expect(await screen.findByRole('tooltip')).toHaveTextContent(fullName)
})
