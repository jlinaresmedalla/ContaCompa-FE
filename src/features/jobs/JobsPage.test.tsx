import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import { JOBS_API } from './api/jobsApi'
import { JobsPage } from './JobsPage'

beforeEach(async () => {
  await i18n.changeLanguage('en')
  vi.spyOn(JOBS_API, 'get').mockResolvedValue({
    counts: { queued: 0, processing: 0, done: 0, failed: 0, dead: 0 },
    jobs: [],
  })
})
afterEach(() => vi.restoreAllMocks())

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

test('keeps upload in the dropzone, with no header or empty-list upload button', async () => {
  const upload = vi
    .spyOn(JOBS_API, 'upload')
    .mockResolvedValue({ document_id: 'file', job_id: 'job', duplicate: false })
  const { container } = renderPage()
  await screen.findByText('No active jobs')
  expect(within(container.querySelector('header')!).queryByRole('button')).toBeNull()
  expect(screen.queryByRole('button', { name: 'Upload files' })).toBeNull()
  const choose = screen.getByRole('button', { name: 'Choose files' })
  const input = screen.getByLabelText('Choose files to upload')
  const click = vi.spyOn(input, 'click')
  fireEvent.click(choose)
  expect(click).toHaveBeenCalledOnce()
  const file = new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })
  fireEvent.change(input, { target: { files: [file] } })
  await waitFor(() => expect(upload).toHaveBeenCalledWith(file))
  expect(await screen.findByText('invoice.pdf')).toBeInTheDocument()
})

test('uploads a file dropped onto the dropzone', async () => {
  const upload = vi
    .spyOn(JOBS_API, 'upload')
    .mockResolvedValue({ document_id: 'file', job_id: 'job', duplicate: false })
  renderPage()
  const file = new File(['photo'], 'receipt.png', { type: 'image/png' })
  fireEvent.drop(screen.getByText('Drop files here or choose files'), {
    dataTransfer: { files: [file] },
  })
  await waitFor(() => expect(upload).toHaveBeenCalledWith(file))
})
