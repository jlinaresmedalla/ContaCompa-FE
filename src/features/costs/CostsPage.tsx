import { Trans, useTranslation } from 'react-i18next'

import { Card, CardTitle, Stat } from '@/components/ui/card'
import { ErrorNote } from '@/components/ui/input'
import { number, usd } from '@/lib/format'
import { toApiError } from '@/lib/http'

import { DailyChart } from './components/DailyChart'
import { useCostReport } from './hooks'
import type { CostLine } from './types'

export function CostsPage() {
  const { t } = useTranslation()
  const report = useCostReport(30)
  if (report.error) return <ErrorNote message={toApiError(report.error).message} />
  const data = report.data
  const summary = (line: CostLine) =>
    t('costs.summary', {
      docs: line.docs,
      tokens: number(line.input_tokens + line.output_tokens),
      billed: usd(line.billed_usd, 2),
    })
  const columns = ['model', 'docs', 'input', 'output', 'billed', 'list', 'perDoc'] as const
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">{t('nav.costs')}</h1>
      <p className="text-sm text-muted-foreground">
        <Trans i18nKey="costs.intro" components={{ b: <strong className="text-foreground" /> }} />
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label={t('costs.today')}
          value={data ? usd(data.today.list_usd) : '—'}
          sub={data ? summary(data.today) : null}
        />
        <Stat
          label={t('costs.month')}
          value={data ? usd(data.month.list_usd) : '—'}
          sub={data ? summary(data.month) : null}
        />
        <Stat
          label={t('costs.total')}
          value={data ? usd(data.total.list_usd) : '—'}
          sub={data ? summary(data.total) : null}
        />
        <Stat
          label={t('costs.perDoc')}
          value={data ? usd(data.total.list_usd_per_doc, 5) : '—'}
          sub={
            data
              ? t('costs.per1000', { value: usd(Number(data.total.list_usd_per_doc) * 1000, 2) })
              : null
          }
        />
      </div>
      <Card>
        <CardTitle hint={t('costs.last30')}>{t('costs.perDay')}</CardTitle>
        {data ? (
          <DailyChart days={data.by_day} />
        ) : (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        )}
      </Card>
      <Card>
        <CardTitle>{t('costs.byModel')}</CardTitle>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={
                    column === 'model' ? 'py-1 font-semibold' : 'py-1 text-right font-semibold'
                  }
                >
                  {t(`costs.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {(data?.by_model ?? []).map((row) => (
              <tr key={row.model} className="border-t border-border">
                <td className="py-1.5">{row.model}</td>
                <td className="py-1.5 text-right">{row.docs}</td>
                <td className="py-1.5 text-right">{number(row.input_tokens)}</td>
                <td className="py-1.5 text-right">{number(row.output_tokens)}</td>
                <td className="py-1.5 text-right">{usd(row.billed_usd)}</td>
                <td className="py-1.5 text-right">{usd(row.list_usd)}</td>
                <td className="py-1.5 text-right">{usd(row.list_usd_per_doc, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
