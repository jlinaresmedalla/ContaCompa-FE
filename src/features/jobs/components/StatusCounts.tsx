import { useTranslation } from 'react-i18next'

import { Stat } from '@/components/ui/card'

import type { JobStatus } from '../types'

const STATUSES: JobStatus[] = ['queued', 'processing', 'done', 'failed', 'dead']

export function StatusCounts({ counts }: { counts: Record<JobStatus, number> | undefined }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {STATUSES.map((status) => (
        <Stat
          key={status}
          label={t(`jobStatus.${status}`)}
          value={counts?.[status] ?? '—'}
          sub={t(`jobStatusHint.${status}`)}
        />
      ))}
    </div>
  )
}
