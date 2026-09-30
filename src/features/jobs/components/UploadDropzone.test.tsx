import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { toast } from 'sonner'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { Toaster } from '@/components/organisms'

import { JOBS_API } from '../api'
import { UploadDropzone } from './UploadDropzone'

const UPLOAD_TOAST_TIMEOUT_MS = 6000
const INVALID_UPLOAD_STATUS = 422
const FAILED_UPLOAD_TIMEOUT_MS = 500

beforeEach(async () => {
  await i18n.changeLanguage('en')
  vi.useFakeTimers({ shouldAdvanceTime: true })
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  )
})

afterEach(() => {
  toast.dismiss()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function uploadFile() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <UploadDropzone />
      <Toaster />
    </QueryClientProvider>,
  )
  const file = new File(['purchase doc'], 'purchase.pdf', { type: 'application/pdf' })
  fireEvent.change(screen.getByLabelText('Choose files to upload'), { target: { files: [file] } })
  return file
}

test('a successful upload shows a polite success toast and keeps its item badge', async () => {
  const upload = vi.spyOn(JOBS_API, 'upload').mockResolvedValue({
    document_id: 'document-1',
    job_id: 'job-1',
    duplicate: false,
  })
  const file = uploadFile()
  expect(await screen.findByText('File uploaded: purchase.pdf')).toBeInTheDocument()
  expect(upload).toHaveBeenCalledWith(file)
  expect(screen.getByText('Queued')).toBeInTheDocument()
  expect(screen.getByLabelText(/Notifications/)).toHaveAttribute('aria-live', 'polite')
  expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull()
  await act(async () => {
    await vi.advanceTimersByTimeAsync(UPLOAD_TOAST_TIMEOUT_MS)
  })
  await waitFor(() => expect(screen.queryByText('File uploaded: purchase.pdf')).toBeNull())
})

test('a failed upload announces readable API text assertively and stays after six seconds', async () => {
  const config = { headers: new AxiosHeaders() }
  vi.spyOn(JOBS_API, 'upload').mockRejectedValue(
    new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, undefined, {
      status: INVALID_UPLOAD_STATUS,
      statusText: 'Unprocessable Entity',
      config,
      headers: {},
      data: { error: { message: 'This PDF could not be read.' } },
    }),
  )
  uploadFile()
  expect(await screen.findByRole('alert')).toHaveTextContent('This PDF could not be read.')
  await act(async () => {
    await vi.advanceTimersByTimeAsync(UPLOAD_TOAST_TIMEOUT_MS)
  })
  expect(screen.getByRole('alert')).toHaveTextContent('This PDF could not be read.')
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(FAILED_UPLOAD_TIMEOUT_MS)
  })
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
})
