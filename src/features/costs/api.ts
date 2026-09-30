import { http } from '@/lib/http'

import type { CostReport } from './types'

export const COST_ENDPOINTS = { report: '/v1/costs' }

export const COST_KEYS = {
  all: ['costs'] as const,
  report: (days: number) => ['costs', 'report', days] as const,
}

export const COST_API = {
  async report(days: number, signal?: AbortSignal): Promise<CostReport> {
    const { data } = await http.get<CostReport>(COST_ENDPOINTS.report, { params: { days }, signal })
    return data
  },
}
