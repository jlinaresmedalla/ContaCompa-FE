import { ChartNoAxesCombined, Upload } from 'lucide-react'
import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'

import { PATHS } from '@/app/router/paths'
import { AppSelect, EmptyState, PageHeader, Stat, ErrorNote } from '@/components/molecules'
import { useCostPeriod } from './use-cost-period'
import { Button, Skeleton, Card, CardTitle, TableRow } from '@/components/atoms'

import { number, usd } from '@/lib/format'
import { toApiError } from '@/lib/http'

import { DailyChart } from './components/DailyChart'
import { useCostReport } from './hooks'
import type { CostLine } from './types'

const BILLED_USD_DIGITS = 2
const PER_DOCUMENT_USD_DIGITS = 5
const QUOTE_DOCUMENT_COUNT = 1000
const MODEL_SKELETON_COUNT = 5
const MODEL_COLUMNS = ['model', 'docs', 'input', 'output', 'billed', 'list', 'perDoc'] as const

export function CostsPage() {
  const { t } = useTranslation()
  const { period, setPeriod, days, options } = useCostPeriod()
  const report = useCostReport(days)
  const data = report.data
  const summary = (line: CostLine) =>
    t('costs.summary', {
      docs: line.docs,
      tokens: number(line.input_tokens + line.output_tokens),
      billed: usd(line.billed_usd, BILLED_USD_DIGITS),
    })
  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title={t('nav.costs')}
        description={t('pageStates.costs')}
        actions={
          <div className="w-44">
            <AppSelect
              label={t('costs.period')}
              value={period}
              onChange={setPeriod}
              options={options}
            />
          </div>
        }
      />
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
                <Link to={PATHS.jobs}>
                  <Upload aria-hidden="true" className="size-4" />
                  {t('pageStates.upload')}
                </Link>
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
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 [&>div]:min-w-0 [&>div]:min-h-[6.875rem]">
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
              value={
                data ? (
                  usd(data.total.list_usd_per_doc, PER_DOCUMENT_USD_DIGITS)
                ) : (
                  <Skeleton className="h-8 w-24" />
                )
              }
              sub={
                data
                  ? t('costs.per1000', {
                      value: usd(
                        Number(data.total.list_usd_per_doc) * QUOTE_DOCUMENT_COUNT,
                        BILLED_USD_DIGITS,
                      ),
                    })
                  : null
              }
            />
          </div>
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-2">
            <Card className="min-w-0">
              <CardTitle
                className="flex-col items-start lg:flex-row [&_h2]:text-lg"
                hint={t('costs.lastDays', { count: days })}
              >
                {t('costs.perDay')}
              </CardTitle>
              {data ? <DailyChart days={data.by_day} /> : <Skeleton className="h-48 w-full" />}
            </Card>
            <Card className="min-w-0 overflow-hidden p-0">
              <CardTitle className="mb-0 h-16 items-center border-b border-border px-card [&_h2]:text-lg">
                {t('costs.byModel')}
              </CardTitle>
              <div className="max-w-full min-w-0 overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap [&_th:nth-child(3)]:hidden [&_th:nth-child(4)]:hidden [&_td:nth-child(3)]:hidden [&_td:nth-child(4)]:hidden lg:[&_th:nth-child(3)]:table-cell lg:[&_th:nth-child(4)]:table-cell lg:[&_td:nth-child(3)]:table-cell lg:[&_td:nth-child(4)]:table-cell">
                  <thead className="bg-muted text-left text-xs text-muted-foreground">
                    <TableRow className="h-table-header">
                      {MODEL_COLUMNS.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className={
                            column === 'model'
                              ? 'sticky left-0 z-10 border-r border-border bg-muted px-3 font-medium'
                              : 'px-3 text-right font-medium'
                          }
                        >
                          {t(`costs.columns.${column}`)}
                        </th>
                      ))}
                    </TableRow>
                  </thead>
                  <tbody className="tabular-nums">
                    {report.isLoading
                      ? Array.from({ length: MODEL_SKELETON_COUNT }, (_, i) => (
                          <TableRow key={i} className="h-table-row">
                            {MODEL_COLUMNS.map((column) => (
                              <td
                                key={column}
                                className={
                                  column === 'model'
                                    ? 'sticky left-0 z-10 border-r border-border bg-card px-3'
                                    : 'px-3'
                                }
                              >
                                <Skeleton className="h-4 w-full" />
                              </td>
                            ))}
                          </TableRow>
                        ))
                      : null}
                    {(data?.by_model ?? []).map((row) => (
                      <TableRow key={row.model} className="h-table-row border-t border-border">
                        <td className="sticky left-0 z-10 border-r border-border bg-card px-3">
                          <span className="block max-w-48 truncate" title={row.model}>
                            {row.model}
                          </span>
                        </td>
                        <td className="px-3 text-right">{row.docs}</td>
                        <td className="px-3 text-right">{number(row.input_tokens)}</td>
                        <td className="px-3 text-right">{number(row.output_tokens)}</td>
                        <td className="px-3 text-right">{usd(row.billed_usd)}</td>
                        <td className="px-3 text-right">{usd(row.list_usd)}</td>
                        <td className="px-3 text-right">
                          {usd(row.list_usd_per_doc, PER_DOCUMENT_USD_DIGITS)}
                        </td>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
