import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'

import { documentApi } from './api'
import { DocumentsPage } from './DocumentsPage'

vi.mock('./components/DocumentsTable', () => ({
  DocumentsTable: ({ docs }: { docs?: unknown[] }) => (
    <div data-testid="rows">{docs?.length ?? 0}</div>
  ),
}))
vi.mock('./components/ObservationReport', () => ({ ObservationReport: () => null }))

beforeEach(() => {
  void i18n.changeLanguage('en')
})

test('uses next_offset and resets to the first page when filters change', async () => {
  const list = vi
    .spyOn(documentApi, 'list')
    .mockImplementation((_filters, offset) =>
      Promise.resolve({ items: [], next_offset: offset === 0 ? 50 : null }),
    )
  vi.spyOn(documentApi, 'report').mockResolvedValue({
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
      50,
      expect.any(AbortSignal),
    ),
  )
  fireEvent.click(screen.getByRole('radio', { name: 'With warnings' }))
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
