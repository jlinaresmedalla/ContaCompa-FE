import { useQuery } from '@tanstack/react-query'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../api/purchaseDocsApi'

export function usePurchaseDoc(id: string) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.detail(id),
    queryFn: ({ signal }) => DOCUMENT_API.getById(id, signal),
  })
}
