import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'

import { JOBS_API, JOBS_KEYS } from './api'
import type { JobRow, JobStatus, UploadItem } from './types'

const POLL_MS = 2_000

/** Polls while anything is queued or processing, then stops. */
export function useJobsOverview() {
  return useQuery({
    queryKey: JOBS_KEYS.all,
    queryFn: ({ signal }) => JOBS_API.get(signal),
    refetchInterval: (query) => {
      const counts = query.state.data?.counts
      return counts && counts.queued + counts.processing > 0 ? POLL_MS : false
    },
  })
}

export function useUploadFiles() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [items, setItems] = useState<UploadItem[]>([])
  const mutation = useMutation({
    mutationFn: (file: File) => JOBS_API.upload(file),
    onSuccess: (result, file) =>
      notifySuccess(
        t(result.duplicate ? 'notifications.duplicate' : 'notifications.uploaded', {
          name: file.name,
        }),
      ),
    onError: (error) => notifyError(toApiError(error).message),
  })

  async function upload(files: File[]) {
    setItems(files.map((file) => ({ name: file.name, state: 'uploading' })))
    for (const [index, file] of files.entries()) {
      const update = (item: UploadItem) =>
        setItems((current) => current.map((old, i) => (i === index ? item : old)))
      try {
        const result = await mutation.mutateAsync(file)
        update({ name: file.name, state: result.duplicate ? 'duplicate' : 'queued' })
      } catch {
        update({ name: file.name, state: 'error' })
      }
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.all })
    }
  }

  return { items, upload, isUploading: mutation.isPending }
}

export function useRetryJob() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => JOBS_API.retry(jobId),
    onSuccess: () => {
      notifySuccess(t('notifications.retried'))
      return queryClient.invalidateQueries({ queryKey: JOBS_KEYS.all })
    },
    onError: (error) => notifyError(toApiError(error).message),
  })
}

export function useJobsList(jobs: JobRow[] | undefined) {
  const [status, setStatus] = useState<JobStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [issuesOnly, setIssuesOnly] = useState(false)
  const [oldestFirst, setOldestFirst] = useState(false)
  const query = search.trim().toLocaleLowerCase()
  const rows = (jobs ?? [])
    .filter(
      (job) =>
        (status === 'all' || job.status === status) &&
        (!issuesOnly || job.observations > 0 || Boolean(job.last_error)) &&
        `${job.filename} ${job.doc_number ?? ''}`.toLocaleLowerCase().includes(query),
    )
    .sort((left, right) => {
      const order = left.created_at.localeCompare(right.created_at)
      return oldestFirst ? order : -order
    })
  function clearFilters() {
    setStatus('all')
    setSearch('')
    setIssuesOnly(false)
  }
  return {
    rows,
    status,
    setStatus,
    search,
    setSearch,
    issuesOnly,
    setIssuesOnly,
    oldestFirst,
    setOldestFirst,
    clearFilters,
  }
}
