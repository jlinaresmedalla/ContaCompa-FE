import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'

export function FilePreviewSkeleton() {
  const { t } = useTranslation()
  return (
    <div role="status" aria-label={t('common.loading')}>
      <span className="sr-only">{t('common.loading')}</span>
      <Skeleton aria-hidden="true" className="h-96 w-full" />
    </div>
  )
}
