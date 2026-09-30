import { Filter } from 'lucide-react'
import { IconButton, Stat, ErrorNote } from '@/components/molecules'
import { useTranslation } from 'react-i18next'

import { Skeleton, Badge, Card, CardTitle } from '@/components/atoms'

import { toApiError } from '@/lib/http'

import { useObservationReport } from '../hooks'
import { observationLabel } from '../observations'

const REPORT_SKELETON_COUNT = 5

/** What the checks found across all purchase docs; a row click filters the list by that code. */
export function ObservationReport({ onPickCode }: { onPickCode: (code: string) => void }) {
  const { t } = useTranslation()
  const report = useObservationReport()
  if (report.error && !report.data) return <ErrorNote message={toApiError(report.error).message} />
  const data = report.data
  return (
    <div className="space-y-4">
      <Card className="min-w-0">
        <CardTitle hint={t('report.hint')}>{t('report.title')}</CardTitle>
        {report.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: REPORT_SKELETON_COUNT }, (_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : data && data.by_code.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('report.empty')}</p>
        ) : (
          <div className="max-w-full min-w-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs text-muted-foreground">
                <tr>
                  <th className="sticky left-0 z-10 border-r border-border bg-muted py-1 pr-2 font-semibold">
                    {t('report.code')}
                  </th>
                  <th className="py-1 font-semibold">{t('report.severity')}</th>
                  <th className="py-1 text-right font-semibold">{t('report.occurrences')}</th>
                  <th className="py-1 text-right font-semibold">{t('report.affected')}</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {(data?.by_code ?? []).map((row) => (
                  <tr key={row.code} className="border-t border-border">
                    <td className="sticky left-0 z-10 border-r border-border bg-card py-1.5 pr-2">
                      <span className="flex items-center gap-2">
                        <span>{observationLabel(t, row.code)}</span>
                        <IconButton
                          icon={Filter}
                          variant="ghost"
                          label={t('documents.codeFilter', { code: observationLabel(t, row.code) })}
                          onClick={() => onPickCode(row.code)}
                        />
                      </span>
                    </td>
                    <td className="py-1.5">
                      <Badge tone={row.severity === 'warning' ? 'warning' : 'info'}>
                        {t(`severity.${row.severity}`)}
                      </Badge>
                    </td>
                    <td className="py-1.5 text-right">{row.occurrences}</td>
                    <td className="py-1.5 text-right">{row.documents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

/** Global counts stay independent of list filters and pagination. */
export function ObservationStats() {
  const { t } = useTranslation()
  const report = useObservationReport()
  const data = report.data
  if (report.error && !data) return <ErrorNote message={toApiError(report.error).message} />
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 [&>div]:min-w-0 [&>div:last-child]:col-span-2 lg:[&>div:last-child]:col-span-1">
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
    </div>
  )
}
