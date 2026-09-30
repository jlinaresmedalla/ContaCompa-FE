import { PAGE_SIZE } from './api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import { DOCUMENT_API, DOCUMENT_KEYS } from './api'
import { DocumentsPage } from './DocumentsPage'

const FILTERED_DOCUMENT_COUNT = 2

vi.mock('./components/ObservationReport', () => ({
  ObservationStats: () => null,
}))

beforeEach(() => {
  void i18n.changeLanguage('en')
})

test('uses next_offset and resets to the first page when filters change', async () => {
  const list = vi
    .spyOn(DOCUMENT_API, 'list')
    .mockImplementation((_filters, offset) =>
      Promise.resolve({ items: [], next_offset: offset === 0 ? PAGE_SIZE : null }),
    )
  vi.spyOn(DOCUMENT_API, 'report').mockResolvedValue({
    documents: 0,
    clean: 0,
    with_warnings: 0,
    by_code: [],
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  await waitFor(() =>
    expect(list).toHaveBeenCalledWith(
      { observations: 'all', code: null },
      0,
      expect.any(AbortSignal),
    ),
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
  await waitFor(() =>
    expect(list).toHaveBeenCalledWith(
      { observations: 'all', code: null },
      PAGE_SIZE,
      expect.any(AbortSignal),
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'With warnings' }))
  await waitFor(() =>
    expect(list).toHaveBeenCalledWith(
      { observations: 'warning', code: null },
      0,
      expect.any(AbortSignal),
    ),
  )
  expect(screen.getByText('Page 1')).toBeInTheDocument()
  list.mockRestore()
})

function renderPage(entry = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[entry]}>
        <DocumentsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return { client, ...view }
}

test('offers upload on Jobs when there are no purchase docs', async () => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({ items: [], next_offset: null })
  renderPage()
  expect(await screen.findByRole('link', { name: 'Upload files' })).toHaveAttribute(
    'href',
    '/extraction/jobs',
  )
  list.mockRestore()
})

test.each(['/?obs=warning', '/?code=amount_mismatch'])(
  'clears active filters from %s',
  async (entry) => {
    const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({ items: [], next_offset: null })
    renderPage(entry)
    fireEvent.click(await screen.findByRole('button', { name: 'Clear filters' }))
    await waitFor(() =>
      expect(list).toHaveBeenCalledWith(
        { observations: 'all', code: null },
        0,
        expect.any(AbortSignal),
      ),
    )
    expect(await screen.findByRole('link', { name: 'Upload files' })).toBeInTheDocument()
    list.mockRestore()
  },
)

test('keeps rows visible without skeletons during a background refetch', async () => {
  const data = {
    items: [
      {
        id: 'doc-1',
        supplier: null,
        doc_type: 'invoice' as const,
        doc_number: 'F001-123',
        issue_date: null,
        currency: 'PEN',
        total_amount: '118',
        prices_include_igv: true,
        taxable_amount: '100',
        igv_amount: '18',
        has_warnings: false,
        issues: [],
        lines: [],
      },
    ],
    next_offset: null,
  }
  let finish!: (value: typeof data) => void
  const list = vi
    .spyOn(DOCUMENT_API, 'list')
    .mockResolvedValueOnce(data)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
  const { client, container } = renderPage()
  expect(await screen.findByRole('link', { name: 'F001-123' })).toBeInTheDocument()
  let refresh!: Promise<void>
  act(() => {
    refresh = client.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() })
  })
  await waitFor(() => expect(list).toHaveBeenCalledTimes(FILTERED_DOCUMENT_COUNT))
  expect(client.isFetching()).toBe(1)
  expect(screen.getByRole('link', { name: 'F001-123' })).toBeInTheDocument()
  expect(container.querySelector('[data-slot="skeleton"]')).toBeNull()
  await act(async () => {
    finish(data)
    await refresh
  })
  list.mockRestore()
})

test.each(['all', 'warning', 'any', 'none', 'invalid'])(
  'validates the observation URL value %s',
  async (value) => {
    const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({ items: [], next_offset: null })
    renderPage(`/?obs=${value}`)
    await waitFor(() =>
      expect(list).toHaveBeenCalledWith(
        { observations: value === 'invalid' ? 'all' : value, code: null },
        0,
        expect.any(AbortSignal),
      ),
    )
    list.mockRestore()
  },
)

const PURCHASE_DOC = {
  id: 'doc-list',
  supplier: { legal_name: 'Proveedor Lima', ruc: '20100070970' },
  doc_type: 'invoice' as const,
  doc_number: 'F001-456',
  issue_date: '2026-09-30',
  currency: 'PEN',
  total_amount: '118',
  prices_include_igv: true,
  taxable_amount: '100',
  igv_amount: '18',
  has_warnings: false,
  issues: [],
  lines: [],
}

test('renders headed rows and follows pagination', async () => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockImplementation((_filters, offset) =>
    Promise.resolve({
      items: [{ ...PURCHASE_DOC, doc_number: offset === 0 ? 'F001-456' : 'F001-789' }],
      next_offset: offset === 0 ? PAGE_SIZE : null,
    }),
  )
  renderPage()
  expect(await screen.findByRole('link', { name: 'F001-456' })).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Lines' })).toBeNull()
  expect(screen.getByRole('button', { name: i18n.t('prices.expand') })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByRole('link', { name: 'F001-789' })).toBeInTheDocument()
  expect(screen.getByText('Page 2')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  list.mockRestore()
})

test('clears a search with no match and restores the loaded rows', async () => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({
    items: [PURCHASE_DOC],
    next_offset: null,
  })
  renderPage()
  expect(await screen.findByRole('link', { name: 'F001-456' })).toBeInTheDocument()
  const search = screen.getByRole('searchbox')
  fireEvent.change(search, { target: { value: 'missing supplier' } })
  expect(screen.queryByRole('link', { name: 'F001-456' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  expect(search).toHaveValue('')
  expect(await screen.findByRole('link', { name: 'F001-456' })).toBeInTheDocument()
  list.mockRestore()
})

test.each(['f001', 'proveedor', '20100070970'])('searches loaded records by %s', async (query) => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({
    items: [PURCHASE_DOC],
    next_offset: null,
  })
  renderPage()
  await screen.findByRole('link', { name: 'F001-456' })
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: ` ${query} ` } })
  expect(screen.getByRole('link', { name: 'F001-456' })).toBeInTheDocument()
  list.mockRestore()
})

test('keeps records with missing number and supplier when search is blank', async () => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockResolvedValue({
    items: [{ ...PURCHASE_DOC, doc_number: null, supplier: null }],
    next_offset: null,
  })
  renderPage()
  expect(await screen.findByRole('link', { name: '?' })).toBeInTheDocument()
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '   ' } })
  expect(screen.getByRole('link', { name: '?' })).toBeInTheDocument()
  list.mockRestore()
})

test('pills request filtered rows and the removed observation report stays absent', async () => {
  const list = vi.spyOn(DOCUMENT_API, 'list').mockImplementation((filters) =>
    Promise.resolve({
      items: filters.observations === 'warning' ? [] : [PURCHASE_DOC],
      next_offset: null,
    }),
  )
  renderPage()
  await screen.findByRole('link', { name: 'F001-456' })
  const pill = screen.getByRole('button', { name: 'With warnings' })
  fireEvent.click(pill)
  expect(pill).toHaveAttribute('aria-pressed', 'true')
  await screen.findByRole('button', { name: 'Clear filters' })
  expect(screen.queryByRole('link', { name: 'F001-456' })).toBeNull()
  expect(screen.queryByText(i18n.t('report.title'))).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  expect(await screen.findByRole('link', { name: 'F001-456' })).toBeInTheDocument()
  list.mockRestore()
})
