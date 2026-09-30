import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import { i18n } from '@/app/i18n'
import type { PurchaseDocDetail } from './types'
import { STORAGE_KEYS } from './use-preview-toggle'
import { DocumentDetailPage } from './DocumentDetailPage'

const MOCKS = vi.hoisted(() => ({ preview: vi.fn() }))
const DOC: PurchaseDocDetail = {
  id: 'record-1',
  supplier: { ruc: '20600000005', legal_name: 'Supplier name' },
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
vi.mock('./hooks', () => ({ useCorrectDoc: () => ({ mutateAsync: vi.fn(), isPending: false }) }))
vi.mock('./use-document-detail', () => ({
  useDocumentDetail: () => ({
    doc: { data: DOC },
    remove: { isPending: false },
    fileIndex: 0,
    setFileIndex: vi.fn(),
    file: DOC.documents[0],
    title: DOC.doc_number,
    confirmDelete: vi.fn(),
  }),
}))
vi.mock('./components/FilePreview', () => ({
  FilePreview: () => {
    MOCKS.preview()
    return <div>Preview content</div>
  },
}))

function renderDetail() {
  return render(
    <RouterProvider
      router={createMemoryRouter([{ path: '*', element: <DocumentDetailPage /> }])}
    />,
  )
}
beforeEach(async () => {
  width()
  localStorage.clear()
  MOCKS.preview.mockClear()
  await i18n.changeLanguage('en')
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test('defaults to hidden without mounting the file preview and retains the card and tabs', () => {
  renderDetail()
  expect(screen.getByRole('button', { name: 'Show the file preview' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  expect(MOCKS.preview).not.toHaveBeenCalled()
  expect(screen.getByText('Supplier name')).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: 'Observations' })).toBeInTheDocument()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('the eye shows the lazy preview, preserves the choice on remount, and hides it again', async () => {
  const view = renderDetail()
  fireEvent.click(screen.getByRole('button', { name: 'Show the file preview' }))
  expect(await screen.findByText('Preview content')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Hide the file preview' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(localStorage.getItem(STORAGE_KEYS.previewVisible)).toBe('true')
  view.unmount()
  const remount = renderDetail()
  expect(await screen.findByText('Preview content')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Hide the file preview' }))
  expect(screen.queryByText('Preview content')).not.toBeInTheDocument()
  expect(localStorage.getItem(STORAGE_KEYS.previewVisible)).toBe('false')
  remount.unmount()
  renderDetail()
  expect(screen.getByRole('button', { name: 'Show the file preview' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

test('a storage read failure falls back to hidden', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Blocked')
  })
  renderDetail()
  expect(screen.getByRole('button', { name: 'Show the file preview' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  expect(MOCKS.preview).not.toHaveBeenCalled()
})

test('a storage write failure still allows toggling but a remount defaults to hidden', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Blocked')
  })
  const view = renderDetail()
  fireEvent.click(screen.getByRole('button', { name: 'Show the file preview' }))
  expect(await screen.findByText('Preview content')).toBeInTheDocument()
  view.unmount()
  renderDetail()
  expect(screen.getByRole('button', { name: 'Show the file preview' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

function width(phone = false) {
  vi.stubGlobal('innerWidth', phone ? TABLET_WIDTH_PX - 1 : TABLET_WIDTH_PX)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: phone, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

test('phone tabs use a select and editing shows a fixed bottom bar with counts and Save', async () => {
  width(true)
  renderDetail()
  expect(await screen.findByRole('combobox', { name: 'Detail view' })).toBeInTheDocument()
  expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Edit purchase doc' }))
  const bar = screen.getByRole('status', { name: i18n.t('detail.unsavedTitle') })
  expect(bar).toHaveClass('fixed', 'bottom-0')
  expect(within(bar).getByRole('button', { name: 'Save' })).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Supplier RUC'), { target: { value: '123' } })
  expect(within(bar).getByText('1 change')).toBeInTheDocument()
  expect(within(bar).getByText('1 error')).toBeInTheDocument()
  expect(within(bar).getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('the phone bar eye opens the file sheet, closing retains drafts, and Cancel restores values', async () => {
  width(true)
  renderDetail()
  fireEvent.click(screen.getByRole('button', { name: 'Edit purchase doc' }))
  fireEvent.change(screen.getByLabelText('Supplier'), { target: { value: 'Draft supplier' } })
  const bar = screen.getByRole('status', { name: i18n.t('detail.unsavedTitle') })
  fireEvent.click(within(bar).getByRole('button', { name: 'Show the file preview' }))
  const sheet = await screen.findByRole('dialog', { name: 'Original file' })
  expect(await within(sheet).findByText('Preview content')).toBeInTheDocument()
  expect(localStorage.getItem(STORAGE_KEYS.previewVisible)).toBe('true')
  fireEvent.click(within(sheet).getByRole('button', { name: 'Hide the file preview' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Supplier')).toHaveValue('Draft supplier')
  fireEvent.click(within(bar).getByRole('button', { name: 'Cancel' }))
  expect(
    screen.queryByRole('status', { name: i18n.t('detail.unsavedTitle') }),
  ).not.toBeInTheDocument()
  expect(screen.getByText('Supplier name')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Edit purchase doc' }))
  expect(screen.getByLabelText('Supplier')).toHaveValue('Supplier name')
})

test('Show original file opens a phone sheet and the stored choice survives a remount', async () => {
  width(true)
  const view = renderDetail()
  fireEvent.click(screen.getByRole('button', { name: 'Show original file' }))
  expect(await screen.findByRole('dialog', { name: 'Original file' })).toBeInTheDocument()
  view.unmount()
  renderDetail()
  expect(await screen.findByRole('dialog', { name: 'Original file' })).toBeInTheDocument()
})
