import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toApiError } from '@/lib/http'
import { notifyError, notifySuccess } from '@/lib/notify'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../api/purchaseDocsApi'

export function useExportXlsx() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (language: string) => DOCUMENT_API.exportXlsx(language),
    onSuccess: async ({ blob, count }) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'purchase-docs.xlsx'
      link.click()
      URL.revokeObjectURL(url)
      notifySuccess(t('notifications.exported', { count }))
      await queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
    },
    onError: (error) => notifyError(toApiError(error).message),
  })
}
