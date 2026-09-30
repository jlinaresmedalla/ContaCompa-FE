import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'
import { DOCUMENT_API } from '../api/purchaseDocsApi'
import type { CorrectionPayload } from '../types/purchaseDocs'
import { useInvalidateDoc } from './useInvalidateDoc'

export function useCorrectDoc(id: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDoc()
  return useMutation({
    mutationFn: (payload: CorrectionPayload) => DOCUMENT_API.correct(id, payload),
    onSuccess: () => {
      notifySuccess(t('notifications.corrected'))
      return invalidate(id)
    },
    onError: (error) => notifyError(toApiError(error).message),
  })
}
