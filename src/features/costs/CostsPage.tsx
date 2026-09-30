import { ChartNoAxesCombined, Upload, Info } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { PATHS } from '@/app/router/paths'
import {
  AppSelect,
  EmptyState,
  PageHeader,
  Stat,
  StatRow,
  ErrorNote,
  IconButton,
  TableSectionLabel,
} from '@/components/molecules'
import { useCostPeriod } from './hooks/useCostPeriod'
import { Button, Skeleton, Card, CardTitle, TableRow, Table } from '@/components/atoms'

import { number } from '@/lib/format'
import { formatCost } from '@/lib/moneyFormat'
import { toApiError } from '@/lib/http'

import { DailyChart } from './components/DailyChart'
import { useCostReport } from './hooks/useCostReport'
import type { CostLine } from './types/costs'

const QUOTE_DOCUMENT_COUNT = 1000
const MODEL_SKELETON_COUNT = 5
const MODEL_COLUMNS = ['model', 'docs', 'input', 'output', 'billed', 'list', 'perDoc'] as const

export function CostsPage() {
  const { t } = useTranslation()
  const { period, setPeriod, days, options } = useCostPeriod()
  const report = useCostReport(days)
  const data = report.data
  const summary = (line: CostLine) => (
    <>
      <span className="block whitespace-nowrap">
        {t('costs.summary', {
          count: line.docs,
          tokens: number(line.input_tokens + line.output_tokens),
        })}
      </span>
      <span className="block whitespace-nowrap">
        {t('costs.billedSummary', { billed: formatCost(line.billed_usd) })}
      </span>
    </>
  )
  return (
    <div className="@container/costs min-w-0 space-y-6">
      <div className="[&_header>div]:flex-nowrap [&_header>div>div:first-child]:basis-0 [&_header>div>div:last-child]:basis-auto [&_header>div>div:last-child]:shrink-0">
        <PageHeader
          title={t('nav.costs')}
          description={t('pageStates.costs')}
          actions={
            <div className="w-48">
              <AppSelect
                label={t('costs.period')}
                value={period}
                onChange={setPeriod}
                options={options}
              />
            </div>
          }
        />
      </div>
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
          <StatRow className="max-md:[&_[data-slot=card]]:min-w-max">
            <Stat
              label={t('costs.today')}
              value={data ? formatCost(data.today.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.today) : null}
            />
            <Stat
              label={t('costs.month')}
              value={data ? formatCost(data.month.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.month) : null}
            />
            <Stat
              label={t('costs.total')}
              value={data ? formatCost(data.total.list_usd) : <Skeleton className="h-8 w-24" />}
              sub={data ? summary(data.total) : null}
            />
            <Stat
              label={t('costs.perDoc')}
              value={
                data ? formatCost(data.total.list_usd_per_doc) : <Skeleton className="h-8 w-24" />
              }
              sub={
                data ? (
                  <>
                    <span className="block whitespace-nowrap">
                      {t('costs.quoteAmount', {
                        value: formatCost(
                          Number(data.total.list_usd_per_doc) * QUOTE_DOCUMENT_COUNT,
                        ),
                      })}
                    </span>
                    <span className="block whitespace-nowrap">{t('costs.quoteDocs')}</span>
                  </>
                ) : null
              }
            />
          </StatRow>
          <div className="grid min-w-0 items-stretch gap-4 @min-[100rem]/costs:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <Card className="min-w-0">
              <CardTitle className="min-h-control [&_h2]:text-lg">{t('costs.perDay')}</CardTitle>
              {data ? <DailyChart days={data.by_day} /> : <Skeleton className="h-48 w-full" />}
            </Card>
            <section className="min-w-0 space-y-2" aria-label={t('costs.byModel')}>
              <TableSectionLabel label={t('costs.byModel')} count={data?.by_model.length} />
              <>
                <Table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs text-muted-foreground">
                    <TableRow className="h-table-header-compact">
                      {MODEL_COLUMNS.map((column) => (
                        <th
                          key={column}
                          data-column={column === 'model' ? 'text' : undefined}
                          scope="col"
                          className={
                            column === 'model'
                              ? 'sticky left-0 z-10 border-r border-border bg-muted px-1.5 font-medium'
                              : 'px-1.5 text-right font-medium'
                          }
                        >
                          <span className="inline-flex max-w-full items-center justify-end gap-1">
                            {t(`costs.columns.${column}`)}
                            {column === 'list' ? (
                              <IconButton
                                size="row"
                                variant="ghost"
                                icon={Info}
                                label={t('costs.explanation')}
                              />
                            ) : null}
                          </span>
                        </th>
                      ))}
                    </TableRow>
                  </thead>
                  <tbody className="tabular-nums">
                    {report.isLoading
                      ? Array.from({ length: MODEL_SKELETON_COUNT }, (_, i) => (
                          <TableRow key={i} className="h-table-row-compact">
                            {MODEL_COLUMNS.map((column) => (
                              <td
                                key={column}
                                data-column={column === 'model' ? 'text' : undefined}
                                className={
                                  column === 'model'
                                    ? 'sticky left-0 z-10 border-r border-border bg-card px-1.5'
                                    : 'px-1.5'
                                }
                              >
                                <Skeleton className="h-4 w-full" />
                              </td>
                            ))}
                          </TableRow>
                        ))
                      : null}
                    {(data?.by_model ?? []).map((row) => (
                      <TableRow
                        key={row.model}
                        className="h-table-row-compact border-t border-border"
                      >
                        <td
                          data-column="text"
                          className="sticky left-0 z-10 border-r border-border bg-card px-1.5"
                        >
                          <span
                            className="block min-w-32 whitespace-normal break-normal"
                            title={row.model}
                          >
                            {row.model}
                          </span>
                        </td>
                        <td className="px-1.5 text-right">{row.docs}</td>
                        <td className="px-1.5 text-right">{number(row.input_tokens)}</td>
                        <td className="px-1.5 text-right">{number(row.output_tokens)}</td>
                        <td className="px-1.5 text-right">{formatCost(row.billed_usd)}</td>
                        <td className="px-1.5 text-right">{formatCost(row.list_usd)}</td>
                        <td className="px-1.5 text-right">{formatCost(row.list_usd_per_doc)}</td>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
