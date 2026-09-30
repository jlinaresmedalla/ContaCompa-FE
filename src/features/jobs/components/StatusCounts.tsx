import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { Stat } from '@/components/ui/card'

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 [&>div]:min-w-0">
      {STATUSES.map((status) => (
        <Stat
          key={status}
          label={t(`jobStatus.${status}`)}
          value={
            isLoading && !counts ? <Skeleton className="h-8 w-16" /> : (counts?.[status] ?? '—')
          }
          sub={t(`jobStatusHint.${status}`)}
        />
      ))}
    </div>
  )
}
