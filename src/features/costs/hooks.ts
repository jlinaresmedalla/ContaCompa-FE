import { useQuery } from '@tanstack/react-query'

import { costApi, costKeys } from './api'

export function useCostReport(days = 30) {
  return useQuery({
    queryKey: costKeys.report(days),
    queryFn: ({ signal }) => costApi.report(days, signal),
  })
}
