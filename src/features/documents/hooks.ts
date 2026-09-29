import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { documentApi, documentKeys } from './api'
import type { CorrectionPayload, ListFilters, ObservationFilter } from './types'

const FILTERS: ObservationFilter[] = ['all', 'warning', 'any', 'none']

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
    observations: FILTERS.find((candidate) => candidate === raw) ?? 'all',
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
    queryKey: documentKeys.list(filters, offset),
    queryFn: ({ signal }) => documentApi.list(filters, offset, signal),
  })
}

export function useObservationReport() {
  return useQuery({
    queryKey: documentKeys.report(),
    queryFn: ({ signal }) => documentApi.report(signal),
  })
}

export function usePurchaseDoc(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: ({ signal }) => documentApi.getById(id, signal),
  })
}

/** An object URL for the original upload, revoked when the blob changes or on unmount. */
export function useFileUrl(documentId: string) {
  const query = useQuery({
    queryKey: documentKeys.file(documentId),
    queryFn: ({ signal }) => documentApi.file(documentId, signal),
  })
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!query.data) return
    const next = URL.createObjectURL(query.data)
    // Syncing with a browser resource (object URLs), not deriving state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [query.data])
  return { url, type: query.data?.type ?? null, isLoading: query.isLoading, error: query.error }
}

function useInvalidateDoc() {
  const queryClient = useQueryClient()
  return (id: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) }),
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: documentKeys.report() }),
    ])
}

export function useCorrectDoc(id: string) {
  const invalidate = useInvalidateDoc()
  return useMutation({
    mutationFn: (payload: CorrectionPayload) => documentApi.correct(id, payload),
    onSuccess: () => invalidate(id),
  })
}

export function useDeleteDoc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => documentApi.remove(id),
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: documentKeys.detail(id) })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: documentKeys.report() }),
        queryClient.invalidateQueries({ queryKey: ['monitor'] }),
      ])
    },
  })
}

export function useExportXlsx() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (language: string) => documentApi.exportXlsx(language),
    onSuccess: async ({ blob }) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'purchase-docs.xlsx'
      link.click()
      URL.revokeObjectURL(url)
      await queryClient.invalidateQueries({ queryKey: documentKeys.all })
    },
  })
}
