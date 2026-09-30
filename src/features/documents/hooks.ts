import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'

import { DOCUMENT_API, DOCUMENT_KEYS } from './api'
import type { CorrectionPayload, ListFilters, ObservationFilter, PurchaseDocSummary } from './types'

export const OBSERVATION_FILTERS: readonly ObservationFilter[] = ['all', 'warning', 'any', 'none']

/** List filters live in the URL (?obs=warning&code=amount_mismatch): shareable and reload-safe. */
export function useListFilters(): [
  ListFilters,
  (next: ListFilters) => void,
  number,
  (next: number) => void,
] {
  const [params, setParams] = useSearchParams()
  const raw = params.get('obs')
  const filters: ListFilters = {
    observations: OBSERVATION_FILTERS.find((candidate) => candidate === raw) ?? 'all',
    code: params.get('code'),
  }
  const setFilters = (next: ListFilters) => {
    const search: Record<string, string> = {}
    if (next.observations !== 'all') search.obs = next.observations
    if (next.code) search.code = next.code
    setParams(search)
  }
  const offset = Math.max(0, Number(params.get('offset') ?? 0) || 0)
  const setOffset = (next: number) => {
    const search = new URLSearchParams(params)
    if (next > 0) search.set('offset', String(next))
    else search.delete('offset')
    setParams(search)
  }
  return [filters, setFilters, offset, setOffset]
}

export function usePurchaseDocs(filters: ListFilters, offset: number) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.list(filters, offset),
    queryFn: ({ signal }) => DOCUMENT_API.list(filters, offset, signal),
  })
}

export function useObservationReport() {
  return useQuery({
    queryKey: DOCUMENT_KEYS.report(),
    queryFn: ({ signal }) => DOCUMENT_API.report(signal),
  })
}

export function usePurchaseDoc(id: string) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.detail(id),
    queryFn: ({ signal }) => DOCUMENT_API.getById(id, signal),
  })
}

/** An object URL for the original upload, revoked when the blob changes or on unmount. */
export function useFileUrl(documentId: string) {
  const query = useQuery({
    queryKey: DOCUMENT_KEYS.file(documentId),
    queryFn: ({ signal }) => DOCUMENT_API.file(documentId, signal),
  })
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!query.data) return
    const next = URL.createObjectURL(query.data)
    // Syncing with a browser resource (object URLs), not deriving state.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Object URLs need effect cleanup.
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [query.data])
  return { url, type: query.data?.type ?? null, isLoading: query.isLoading, error: query.error }
}

function useInvalidateDoc() {
  const queryClient = useQueryClient()
  return (id: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) }),
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() }),
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.report() }),
    ])
}

export function useCorrectDoc(id: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDoc()
  return useMutation({
    mutationFn: (payload: CorrectionPayload) => DOCUMENT_API.correct(id, payload),
    onSuccess: () => {
      notifySuccess(t('notifications.corrected'))
      return invalidate(id)
    },
    onError: (error) => notifyError(toApiError(error).message),
  })
}

export function useDeleteDoc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => DOCUMENT_API.remove(id),
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: DOCUMENT_KEYS.detail(id) })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() }),
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.report() }),
        queryClient.invalidateQueries({ queryKey: ['monitor'] }),
      ])
    },
  })
}

export function useExportXlsx() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (language: string) => DOCUMENT_API.exportXlsx(language),
    onSuccess: async ({ blob, count }) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'purchase-docs.xlsx'
      link.click()
      URL.revokeObjectURL(url)
      notifySuccess(t('notifications.exported', { count }))
      await queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
    },
    onError: (error) => notifyError(toApiError(error).message),
  })
}

/** The API paginates without a search parameter; search only the loaded page. */
export function useDocumentSearch(docs: PurchaseDocSummary[] | undefined) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLocaleLowerCase()
  const matches = query
    ? docs?.filter((doc) =>
        [doc.doc_number, doc.supplier?.legal_name, doc.supplier?.ruc].some((value) =>
          value?.toLocaleLowerCase().includes(query),
        ),
      )
    : docs
  return { search, setSearch, matches, hasSearch: Boolean(query) }
}
