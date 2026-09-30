import { ChartNoAxesCombined } from 'lucide-react'
import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'

import { paths } from '@/app/router/paths'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
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
      <PageHeader title={t('nav.costs')} description={t('pageStates.costs')} />
      {report.error && !data ? (
        <ErrorNote message={toApiError(report.error).message} />
      ) : data?.total.docs === 0 ? (
        <Card>
          <EmptyState
            icon={ChartNoAxesCombined}
            title={t('pageStates.costsTitle')}
            description={t('pageStates.costsDescription')}
            action={
              <Button asChild>
                <Link to={paths.jobs}>{t('pageStates.upload')}</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <Trans
              i18nKey="costs.intro"
              components={{ b: <strong className="text-foreground" /> }}
            />
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 [&>div]:min-w-0">
            <Stat
              label={t('costs.today')}
              value={data ? usd(data.today.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.today) : null}
            />
            <Stat
              label={t('costs.month')}
              value={data ? usd(data.month.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.month) : null}
            />
            <Stat
              label={t('costs.total')}
              value={data ? usd(data.total.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.total) : null}
            />
            <Stat
              label={t('costs.perDoc')}
              value={data ? usd(data.total.list_usd_per_doc, 5) : <Skeleton className="h-8 w-24" />}
              sub={
                data
                  ? t('costs.per1000', {
                      value: usd(Number(data.total.list_usd_per_doc) * 1000, 2),
                    })
                  : null
              }
            />
          </div>
          <Card>
            <CardTitle hint={t('costs.last30')}>{t('costs.perDay')}</CardTitle>
            {data ? <DailyChart days={data.by_day} /> : <Skeleton className="h-48 w-full" />}
          </Card>
          <Card>
            <CardTitle>{t('costs.byModel')}</CardTitle>
            <div className="max-w-full min-w-0 overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
                <thead className="bg-muted text-left text-xs text-muted-foreground">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className={
                          column === 'model'
                            ? 'sticky left-0 z-10 border-r border-border bg-muted py-1 pr-2 font-semibold'
                            : 'py-1 text-right font-semibold'
                        }
                      >
                        {t(`costs.columns.${column}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {report.isLoading
                    ? Array.from({ length: 5 }, (_, i) => (
                        <tr key={i}>
                          {columns.map((column) => (
                            <td
                              key={column}
                              className={
                                column === 'model'
                                  ? 'sticky left-0 z-10 border-r border-border bg-card py-2'
                                  : 'py-2'
                              }
                            >
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : null}
                  {(data?.by_model ?? []).map((row) => (
                    <tr key={row.model} className="border-t border-border">
                      <td className="sticky left-0 z-10 border-r border-border bg-card py-1.5 pr-2">
                        {row.model}
                      </td>
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
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
