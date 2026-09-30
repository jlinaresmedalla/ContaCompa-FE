import { http } from '@/lib/http'

import type {
  CorrectionPayload,
  ListFilters,
  ObservationReport,
  PurchaseDocDetail,
  PurchaseDocList,
} from './types'

export const PAGE_SIZE = 50

export const DOCUMENT_ENDPOINTS = {
  list: '/v1/purchase-docs',
  detail: (id: string) => `/v1/purchase-docs/${encodeURIComponent(id)}`,
  report: '/v1/reports/observations',
  file: (documentId: string) => `/v1/documents/${encodeURIComponent(documentId)}/file`,
  export: '/v1/exports/purchase-docs.xlsx',
}

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
  async report(signal?: AbortSignal): Promise<ObservationReport> {
    const { data } = await http.get<ObservationReport>(DOCUMENT_ENDPOINTS.report, { signal })
    return data
  },
  async getById(id: string, signal?: AbortSignal): Promise<PurchaseDocDetail> {
    const { data } = await http.get<PurchaseDocDetail>(DOCUMENT_ENDPOINTS.detail(id), { signal })
    return data
  },
  async correct(id: string, payload: CorrectionPayload): Promise<PurchaseDocDetail> {
    const { data } = await http.patch<PurchaseDocDetail>(DOCUMENT_ENDPOINTS.detail(id), payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await http.delete(DOCUMENT_ENDPOINTS.detail(id))
  },
  async file(documentId: string, signal?: AbortSignal): Promise<Blob> {
    const { data } = await http.get<Blob>(DOCUMENT_ENDPOINTS.file(documentId), {
      responseType: 'blob',
      signal,
    })
    return data
  },
  async exportXlsx(language: string): Promise<{ blob: Blob; count: number }> {
    const response = await http.get<Blob>(DOCUMENT_ENDPOINTS.export, {
      params: { lang: language === 'en' ? 'en' : 'es' },
      responseType: 'blob',
    })
    return { blob: response.data, count: Number(response.headers['x-purchase-doc-count'] ?? 0) }
  },
}
