import { useQuery } from '@tanstack/react-query'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../api/purchaseDocsApi'
import type { ListFilters } from '../types/purchaseDocs'

export function usePurchaseDocs(filters: ListFilters, offset: number) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.list(filters, offset),
    queryFn: ({ signal }) => DOCUMENT_API.list(filters, offset, signal),
  })
}
