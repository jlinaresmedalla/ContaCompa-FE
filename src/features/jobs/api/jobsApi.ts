import { http } from '@/lib/http'

import type { JobsOverview, Submitted } from '../types/jobs'

export const JOBS_ENDPOINTS = {
  overview: '/v1/monitor',
  upload: '/v1/documents',
  retry: (jobId: string) => `/v1/jobs/${encodeURIComponent(jobId)}/retry`,
}

export const JOBS_KEYS = {
  all: ['jobs'] as const,
}

export const JOBS_API = {
  async get(signal?: AbortSignal): Promise<JobsOverview> {
    const { data } = await http.get<JobsOverview>(JOBS_ENDPOINTS.overview, { signal })
    return data
  },
  async upload(file: File): Promise<Submitted> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await http.post<Submitted>(JOBS_ENDPOINTS.upload, form)
    return data
  },
  async retry(jobId: string): Promise<void> {
    await http.post(JOBS_ENDPOINTS.retry(jobId))
  },
}
