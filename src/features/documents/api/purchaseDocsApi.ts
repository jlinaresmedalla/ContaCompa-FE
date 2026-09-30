import { EXPORTS_API } from './exportsApi'
import { FILES_API } from './filesApi'
import { CORRECTIONS_API } from './correctionsApi'
import { OBSERVATIONS_API } from './observationsApi'
import { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'
import { http } from '@/lib/http'

import type { ListFilters, PurchaseDocDetail, PurchaseDocList } from '../types/purchaseDocs'

export { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'

export const PAGE_SIZE = 50

const ROOT = ['purchase-docs'] as const
export const DOCUMENT_KEYS = {
  all: ROOT,
  lists: () => [...ROOT, 'list'] as const,
  list: (filters: ListFilters, offset: number) => [...ROOT, 'list', filters, offset] as const,
  report: () => [...ROOT, 'report'] as const,
  details: () => [...ROOT, 'detail'] as const,
  detail: (id: string) => [...ROOT, 'detail', id] as const,
  file: (documentId: string) => ['document-file', documentId] as const,
}

export const DOCUMENT_API = {
  async list(filters: ListFilters, offset: number, signal?: AbortSignal): Promise<PurchaseDocList> {
    const { data } = await http.get<PurchaseDocList>(DOCUMENT_ENDPOINTS.list, {
      params: {
        observations: filters.observations,
        code: filters.code ?? undefined,
        limit: PAGE_SIZE,
        offset,
      },
      signal,
    })
    return data
  },
  async getById(id: string, signal?: AbortSignal): Promise<PurchaseDocDetail> {
    const { data } = await http.get<PurchaseDocDetail>(DOCUMENT_ENDPOINTS.detail(id), { signal })
    return data
  },
  async remove(id: string): Promise<void> {
    await http.delete(DOCUMENT_ENDPOINTS.detail(id))
  },
  ...OBSERVATIONS_API,
  ...CORRECTIONS_API,
  ...FILES_API,
  ...EXPORTS_API,
}
