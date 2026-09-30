import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/atoms'
import { Stat } from '@/components/molecules'

import type { JobStatus } from '../types'

const STATUSES: JobStatus[] = ['queued', 'processing', 'done', 'failed', 'dead']

export function StatusCounts({
  counts,
  isLoading,
}: {
  counts: Record<JobStatus, number> | undefined
  isLoading: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-3.5 md:grid-cols-5 md:gap-5.5 [&>div]:min-w-0 [&>div:last-child]:col-span-2 md:[&>div:last-child]:col-span-1">
      {STATUSES.map((status) => (
        <Stat
          key={status}
          label={t(`jobStatus.${status}`)}
          value={
            isLoading && !counts ? <Skeleton className="h-8 w-16" /> : (counts?.[status] ?? '—')
          }
        />
      ))}
    </div>
  )
}
