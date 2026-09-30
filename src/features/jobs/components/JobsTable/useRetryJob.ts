import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'

import { JOBS_API, JOBS_KEYS } from '../../api/jobsApi'

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
