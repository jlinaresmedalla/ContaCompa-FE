import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'

import { JOBS_API, JOBS_KEYS } from '../../api/jobsApi'
import type { UploadItem } from '../../types/jobs'

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
