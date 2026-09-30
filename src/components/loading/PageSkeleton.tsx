import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  const { t } = useTranslation()
  return (
    <div role="status" aria-label={t('common.loading')} className="min-w-0 space-y-6">
      <span className="sr-only">{t('common.loading')}</span>
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-10 w-full max-w-64" />
        <Skeleton className="h-4 w-full max-w-48" />
      </div>
      <Skeleton aria-hidden="true" className="h-96 w-full" />
    </div>
  )
}
