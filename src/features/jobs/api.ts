import { http } from '@/lib/http'

import type { JobsOverview, Submitted } from './types'

export const jobsEndpoints = {
  overview: '/v1/monitor',
  upload: '/v1/documents',
  retry: (jobId: string) => `/v1/jobs/${encodeURIComponent(jobId)}/retry`,
}

export const jobsKeys = {
  all: ['jobs'] as const,
}

export const jobsApi = {
  async get(signal?: AbortSignal): Promise<JobsOverview> {
    const { data } = await http.get<JobsOverview>(jobsEndpoints.overview, { signal })
    return data
  },
  async upload(file: File): Promise<Submitted> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await http.post<Submitted>(jobsEndpoints.upload, form)
    return data
  },
  async retry(jobId: string): Promise<void> {
    await http.post(jobsEndpoints.retry(jobId))
  },
}
