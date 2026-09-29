import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { toApiError } from '@/lib/http'

import { jobsApi, jobsKeys } from './api'
import type { UploadItem } from './types'

const POLL_MS = 2_000

/** Polls while anything is queued or processing, then stops. */
export function useJobsOverview() {
  return useQuery({
    queryKey: jobsKeys.all,
    queryFn: ({ signal }) => jobsApi.get(signal),
    refetchInterval: (query) => {
      const counts = query.state.data?.counts
      return counts && counts.queued + counts.processing > 0 ? POLL_MS : false
    },
  })
}

export function useUploadFiles() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState<UploadItem[]>([])
  const mutation = useMutation({ mutationFn: (file: File) => jobsApi.upload(file) })

  async function upload(files: File[]) {
    setItems(files.map((file) => ({ name: file.name, state: 'uploading' })))
    for (const [index, file] of files.entries()) {
      const update = (item: UploadItem) =>
        setItems((current) => current.map((old, i) => (i === index ? item : old)))
      try {
        const result = await mutation.mutateAsync(file)
        update({ name: file.name, state: result.duplicate ? 'duplicate' : 'queued' })
      } catch (error) {
        update({ name: file.name, state: 'error', message: toApiError(error).message })
      }
      await queryClient.invalidateQueries({ queryKey: jobsKeys.all })
    }
  }

  return { items, upload, isUploading: mutation.isPending }
}

export function useRetryJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.retry(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKeys.all }),
  })
}
