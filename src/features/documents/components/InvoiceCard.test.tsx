import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { createMemoryRouter, RouterProvider, Link } from 'react-router'
import { i18n } from '@/app/i18n'
import { API_KEY_STORE } from '@/lib/api-key'
import type { CorrectionPayload, PurchaseDocDetail } from '../types'
import { useInvoiceEdit } from '../use-invoice-edit'
import { InvoiceCard } from './InvoiceCard'
import { InvoiceEditActions } from './InvoiceEditActions'

const MOCKS = vi.hoisted(() => ({ correct: vi.fn() }))
vi.mock('../hooks', () => ({
  useCorrectDoc: () => ({ mutateAsync: MOCKS.correct, isPending: false }),
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
  lines: [],
  corrections: [],
  created_at: '2026-09-01T00:00:00Z',
  exported_at: null,
  documents: [{ id: 'file-1', filename: 'original.pdf', source_kind: 'pdf_text' }],
}

function Harness() {
  const edit = useInvoiceEdit(DOC)
  return (
    <>
      <button onClick={edit.edit}>Edit</button>
      {edit.editing ? <InvoiceEditActions edit={edit} /> : null}
      <InvoiceCard doc={DOC} previewVisible={false} edit={edit} />
      <Link to="/elsewhere">Leave</Link>
      <button
        onClick={() => {
          API_KEY_STORE.clear()
          void router.navigate('/elsewhere')
        }}
      >
        Sign out
      </button>
      {edit.blocker.state === 'blocked' ? (
        <div role="dialog">
          <button onClick={() => edit.blocker.reset?.()}>Stay</button>
          <button onClick={() => edit.blocker.proceed?.()}>Discard</button>
        </div>
      ) : null}
    </>
  )
}
let router: ReturnType<typeof createMemoryRouter>
function setup(forward = false) {
  router = createMemoryRouter(
    [
      { path: '/detail', element: <Harness /> },
      { path: '/elsewhere', element: <p>Elsewhere</p> },
    ],
    {
      initialEntries: forward ? ['/detail', '/elsewhere'] : ['/elsewhere', '/detail'],
      initialIndex: forward ? 0 : 1,
    },
  )
  render(<RouterProvider router={router} />)
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
}
function changeSupplier(value = 'Corrected name') {
  fireEvent.change(screen.getByLabelText('Supplier'), { target: { value } })
}
beforeEach(async () => {
  localStorage.clear()
  API_KEY_STORE.set('test-key')
  MOCKS.correct.mockReset()
  MOCKS.correct.mockImplementation((payload: CorrectionPayload) =>
    Promise.resolve({
      ...DOC,
      supplier: { ...DOC.supplier, legal_name: payload.fields.supplier_name },
    }),
  )
  await i18n.changeLanguage('en')
})

test('all fields edit together, first field receives focus, only supplier name is sent', async () => {
  setup()
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Type' })).toHaveFocus())
  expect(screen.getByLabelText('Buyer RUC')).toHaveValue(DOC.buyer_ruc)
  expect(screen.getByRole('group', { name: 'Do unit prices include IGV?' })).toBeInTheDocument()
  changeSupplier()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(MOCKS.correct).toHaveBeenCalledWith({
      fields: { supplier_name: 'Corrected name' },
      lines: [],
    }),
  )
  await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument())
  expect(screen.getByText('Corrected name')).toBeInTheDocument()
})

test('undo restores only its field and Cancel restores every value', () => {
  setup()
  changeSupplier()
  fireEvent.change(screen.getByLabelText('Document number'), { target: { value: 'F002-2' } })
  fireEvent.click(screen.getByRole('button', { name: 'Undo change to Supplier' }))
  expect(screen.getByLabelText('Supplier')).toHaveValue('Original name')
  expect(screen.getByLabelText('Document number')).toHaveValue('F002-2')
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
  expect(screen.getByLabelText('Document number')).toHaveValue('F001-1')
})

test('invalid RUC shows its schema message and disables Save', () => {
  setup()
  fireEvent.change(screen.getByLabelText('Supplier RUC'), { target: { value: '123' } })
  expect(screen.getByRole('alert')).toHaveTextContent(i18n.t('validation.ruc'))
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  expect(MOCKS.correct).not.toHaveBeenCalled()
})

test('empty save sends nothing', () => {
  setup()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(MOCKS.correct).not.toHaveBeenCalled()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('failed save keeps every draft', async () => {
  MOCKS.correct.mockRejectedValue(new Error('Unavailable'))
  setup()
  changeSupplier()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(MOCKS.correct).toHaveBeenCalledOnce())
  expect(screen.getByLabelText('Supplier')).toHaveValue('Corrected name')
})

test('leaving with drafts prompts, Cancel stays, confirmation leaves', async () => {
  setup()
  changeSupplier()
  fireEvent.click(screen.getByRole('link', { name: 'Leave' }))
  expect(await screen.findByRole('dialog')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Stay' }))
  expect(screen.getByLabelText('Supplier')).toHaveValue('Corrected name')
  fireEvent.click(screen.getByRole('link', { name: 'Leave' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Discard' }))
  expect(await screen.findByText('Elsewhere')).toBeInTheDocument()
})

test('no prompt without changes', async () => {
  setup()
  fireEvent.click(screen.getByRole('link', { name: 'Leave' }))
  expect(await screen.findByText('Elsewhere')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('history back is blocked and tab close is prevented only while dirty', async () => {
  setup()
  const clean = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(clean)
  expect(clean.defaultPrevented).toBe(false)
  changeSupplier()
  const dirty = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(dirty)
  expect(dirty.defaultPrevented).toBe(true)
  await act(async () => {
    await router.navigate(-1)
  })
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Discard' }))
  expect(await screen.findByText('Elsewhere')).toBeInTheDocument()
})

test('sign-out clears the key and leaves immediately with drafts', async () => {
  setup()
  changeSupplier()
  fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
  expect(await screen.findByText('Elsewhere')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('history forward with drafts prompts and cancellation preserves the draft', async () => {
  setup(true)
  changeSupplier()
  await act(async () => {
    await router.navigate(1)
  })
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Stay' }))
  expect(router.state.location.pathname).toBe('/detail')
  expect(screen.getByLabelText('Supplier')).toHaveValue('Corrected name')
})
