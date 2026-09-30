import { fireEvent, render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { JOBS_API } from '../../api/jobsApi'
import type { JobRow } from '../../types/jobs'
import { JobsTable } from './JobsTable'

const EXPECTED_ROWS = 2
const EXPECTED_SKELETON_ROWS = 3

const READY: JobRow = {
  job_id: 'ready',
  document_id: 'file-ready',
  filename: 'ready.pdf',
  source_kind: 'pdf_text',
  status: 'done',
  attempts: 1,
  last_error: null,
  created_at: '2026-09-30T12:00:00Z',
  finished_at: '2026-09-30T12:00:10Z',
  purchase_doc_id: 'purchase-ready',
  observations: 0,
  warnings: false,
  doc_number: 'F001-1',
}
const FAILED: JobRow = {
  ...READY,
  job_id: 'failed',
  filename: 'failed.pdf',
  status: 'dead',
  purchase_doc_id: null,
  last_error: 'Could not read the total',
  doc_number: null,
}

function renderList(jobs: JobRow[] | undefined, isLoading = false) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <JobsTable jobs={jobs} isLoading={isLoading} error={null} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(async () => {
  vi.restoreAllMocks()
  await i18n.changeLanguage('en')
})

test('ready and failed files have status, document link and working retry', async () => {
  const retry = vi.spyOn(JOBS_API, 'retry').mockResolvedValue(undefined)
  renderList([READY, FAILED])
  const rows = within(screen.getByRole('list', { name: 'Recent files' })).getAllByRole('listitem')
  expect(rows).toHaveLength(EXPECTED_ROWS)
  expect(
    within(screen.getByText('ready.pdf').closest('li') as HTMLElement).getAllByText('Ready').length,
  ).toBeGreaterThan(0)
  expect(
    within(screen.getByText('failed.pdf').closest('li') as HTMLElement).getAllByText('Failed')
      .length,
  ).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: 'Purchase doc' })).toHaveAttribute(
    'href',
    '/extraction/purchase-docs/purchase-ready',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  await vi.waitFor(() => expect(retry).toHaveBeenCalledWith('failed'))
})

test('empty list describes uploading without a duplicate upload control', () => {
  renderList([])
  expect(screen.getByText(i18n.t('pageStates.jobsTitle'))).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Upload|Choose files/ })).toBeNull()
  expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
})

test('search with no matches offers clear filters and restores files', () => {
  renderList([READY])
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing' } })
  expect(screen.getByText('No matching files')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  expect(screen.getByText('ready.pdf')).toBeInTheDocument()
})

test('status and issue filters narrow the list and sort changes order', () => {
  renderList([READY, { ...FAILED, created_at: '2026-09-29T12:00:00Z' }])
  fireEvent.click(screen.getByRole('button', { name: 'Oldest first' }))
  expect(within(screen.getByRole('list')).getAllByRole('listitem')[0]).toHaveTextContent(
    'failed.pdf',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Files with observations or errors' }))
  expect(screen.queryByText('ready.pdf')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Ready' }))
  expect(screen.getByText('No matching files')).toBeInTheDocument()
})

test('background refresh retains the populated rows', () => {
  renderList([READY], true)
  expect(screen.getByText('ready.pdf')).toBeInTheDocument()
})

test('initial loading shows row skeletons instead of the empty state', () => {
  renderList(undefined, true)
  expect(
    within(screen.getByRole('list', { name: 'Recent files' })).getAllByRole('listitem'),
  ).toHaveLength(EXPECTED_SKELETON_ROWS)
  expect(screen.queryByRole('button', { name: /Upload/ })).not.toBeInTheDocument()
})
