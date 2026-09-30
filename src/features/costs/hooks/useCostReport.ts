import { useQuery } from '@tanstack/react-query'

import { COST_API, COST_KEYS } from '../api/costsApi'

const DEFAULT_REPORT_DAYS = 30

export function useCostReport(days = DEFAULT_REPORT_DAYS) {
  return useQuery({
    queryKey: COST_KEYS.report(days),
    queryFn: ({ signal }) => COST_API.report(days, signal),
  })
}
