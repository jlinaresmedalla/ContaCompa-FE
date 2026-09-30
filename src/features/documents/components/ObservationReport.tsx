import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/atoms'
import { Stat, StatRow, ErrorNote } from '@/components/molecules'
import { toApiError } from '@/lib/http'
import { useObservationReport } from '../hooks'

/** Global counts stay independent of list filters and pagination. */
export function ObservationStats() {
  const { t } = useTranslation()
  const report = useObservationReport()
  const data = report.data
  if (report.error && !data) return <ErrorNote message={toApiError(report.error).message} />
  return (
    <StatRow>
      <Stat
        label={t('report.documents')}
        value={report.isLoading ? <Skeleton className="h-8 w-16" /> : (data?.documents ?? '—')}
      />
      <Stat
        label={t('report.clean')}
        value={report.isLoading ? <Skeleton className="h-8 w-16" /> : (data?.clean ?? '—')}
      />
      <Stat
        label={t('report.withWarnings')}
        value={report.isLoading ? <Skeleton className="h-8 w-16" /> : (data?.with_warnings ?? '—')}
      />
    </StatRow>
  )
}
