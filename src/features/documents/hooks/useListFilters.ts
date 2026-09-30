import { useSearchParams } from 'react-router'
import type { ListFilters, ObservationFilter } from '../types/purchaseDocs'

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
