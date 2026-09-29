import { http } from '@/lib/http'

import type { CostReport } from './types'

export const costEndpoints = { report: '/v1/costs' }

export const costKeys = {
  all: ['costs'] as const,
  report: (days: number) => ['costs', 'report', days] as const,
}

export const costApi = {
  async report(days: number, signal?: AbortSignal): Promise<CostReport> {
    const { data } = await http.get<CostReport>(costEndpoints.report, { params: { days }, signal })
    return data
  },
}
