import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, Stat } from '@/components/ui/card'
import { ErrorNote } from '@/components/ui/input'
import { toApiError } from '@/lib/http'

import { useObservationReport } from '../hooks'
import { observationLabel } from '../observations'

/** What the checks found across all purchase docs; a row click filters the list by that code. */
export function ObservationReport({ onPickCode }: { onPickCode: (code: string) => void }) {
  const { t } = useTranslation()
  const report = useObservationReport()
  if (report.error) return <ErrorNote message={toApiError(report.error).message} />
  const data = report.data
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_2fr]">
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
        <Stat label={t('report.documents')} value={data?.documents ?? '—'} />
        <Stat label={t('report.clean')} value={data?.clean ?? '—'} />
        <Stat label={t('report.withWarnings')} value={data?.with_warnings ?? '—'} />
      </div>
      <Card>
        <CardTitle hint={t('report.hint')}>{t('report.title')}</CardTitle>
        {data && data.by_code.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('report.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="py-1 font-semibold">{t('report.code')}</th>
                <th className="py-1 font-semibold">{t('report.severity')}</th>
                <th className="py-1 text-right font-semibold">{t('report.occurrences')}</th>
                <th className="py-1 text-right font-semibold">{t('report.affected')}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {(data?.by_code ?? []).map((row) => (
                <tr key={row.code} className="border-t border-border">
                  <td className="py-1.5">
                    <button
                      type="button"
                      onClick={() => onPickCode(row.code)}
                      className="text-left font-medium text-primary hover:underline"
                    >
                      {observationLabel(t, row.code)}
                    </button>
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
        )}
      </Card>
    </div>
  )
}
