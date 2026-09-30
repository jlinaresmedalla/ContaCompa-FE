import { act, renderHook } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { PATHS } from '@/app/router/paths'
import { useDocumentDetail } from './use-document-detail'

const MOCKS = vi.hoisted(() => ({
  navigate: vi.fn(),
  mutate: vi.fn<(id: string, options: { onSuccess: () => void }) => void>(),
  data: {
    id: 'doc-1',
    doc_number: 'F001-123',
    documents: [{ id: 'file-1' }, { id: 'file-2' }],
  },
}))

vi.mock('react-router', () => ({
  useParams: () => ({ id: MOCKS.data.id }),
  useNavigate: () => MOCKS.navigate,
}))
vi.mock('./hooks', () => ({
  usePurchaseDoc: () => ({ data: MOCKS.data }),
  useDeleteDoc: () => ({ mutate: MOCKS.mutate }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('selects a file and falls back to the first file for an unavailable selection', () => {
  const { result } = renderHook(useDocumentDetail)
  expect(result.current.file?.id).toBe('file-1')
  act(() => result.current.setFileIndex(1))
  expect(result.current.file?.id).toBe('file-2')
  const UNAVAILABLE_FILE_INDEX = 9
  act(() => result.current.setFileIndex(UNAVAILABLE_FILE_INDEX))
  expect(result.current.file?.id).toBe('file-1')
})

test('deletes the confirmed document and navigates only after success', () => {
  const { result } = renderHook(useDocumentDetail)
  act(() => result.current.confirmDelete())
  expect(MOCKS.mutate).toHaveBeenCalledOnce()
  expect(MOCKS.mutate.mock.calls[0]?.[0]).toBe('doc-1')
  expect(MOCKS.navigate).not.toHaveBeenCalled()
  act(() => MOCKS.mutate.mock.calls[0]![1].onSuccess())
  expect(MOCKS.navigate).toHaveBeenCalledWith(PATHS.purchaseDocs)
})

test('does not delete or navigate when confirmation is cancelled', () => {
  const { result } = renderHook(useDocumentDetail)
  act(() => result.current.setDeleteOpen(true))
  expect(result.current.deleteOpen).toBe(true)
  act(() => result.current.setDeleteOpen(false))
  expect(result.current.deleteOpen).toBe(false)
  expect(MOCKS.mutate).not.toHaveBeenCalled()
  expect(MOCKS.navigate).not.toHaveBeenCalled()
})
