import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/atoms'
import { Stat, StatRow } from '@/components/molecules'

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
    <StatRow>
      {STATUSES.map((status) => (
        <Stat
          key={status}
          label={t(`jobStatus.${status}`)}
          value={
            isLoading && !counts ? <Skeleton className="h-8 w-16" /> : (counts?.[status] ?? '—')
          }
        />
      ))}
    </StatRow>
  )
}
