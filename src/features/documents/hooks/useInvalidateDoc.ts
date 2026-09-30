import { useQueryClient } from '@tanstack/react-query'
import { DOCUMENT_KEYS } from '../api/purchaseDocsApi'

export function useInvalidateDoc() {
  const queryClient = useQueryClient()
  return (id: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) }),
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() }),
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.report() }),
    ])
}
