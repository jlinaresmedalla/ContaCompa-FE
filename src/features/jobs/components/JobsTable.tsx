import type { ColumnDef } from '@tanstack/react-table'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { paths } from '@/app/router/paths'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { dateTime, seconds } from '@/lib/format'

import { useRetryJob } from '../hooks'
import type { JobRow, JobStatus } from '../types'

const statusTone: Record<JobStatus, BadgeTone> = {
  queued: 'neutral',
  processing: 'info',
  done: 'success',
  failed: 'warning',
  dead: 'danger',
}

function RetryButton({ jobId }: { jobId: string }) {
  const { t } = useTranslation()
  const retry = useRetryJob()
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={retry.isPending}
      onClick={() => retry.mutate(jobId)}
    >
      {t('common.retry')}
    </Button>
  )
}

function buildColumns(t: TFunction, locale: string): ColumnDef<JobRow, unknown>[] {
  return [
    {
      header: t('jobs.columns.file'),
      cell: ({ row }) => <span className="font-medium">{row.original.filename}</span>,
    },
    {
      header: t('jobs.columns.kind'),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{t(`sourceKind.${row.original.source_kind}`)}</span>
      ),
    },
    {
      header: t('jobs.columns.status'),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Badge tone={statusTone[row.original.status]}>
            {t(`jobStatus.${row.original.status}`)}
          </Badge>
          {row.original.last_error ? (
            <span className="max-w-64 text-xs text-danger">{row.original.last_error}</span>
          ) : null}
        </div>
      ),
    },
    { header: t('jobs.columns.attempts'), cell: ({ row }) => row.original.attempts },
    {
      header: t('jobs.columns.uploaded'),
      cell: ({ row }) => dateTime(row.original.created_at, locale),
    },
    {
      header: t('jobs.columns.took'),
      cell: ({ row }) => seconds(row.original.created_at, row.original.finished_at),
    },
    {
      header: t('jobs.columns.document'),
      cell: ({ row }) => {
        const { purchase_doc_id: id, doc_number, observations, warnings } = row.original
        if (!id) return <span className="text-muted-foreground">—</span>
        return (
          <Link to={paths.purchaseDoc(id)} className="flex items-center gap-2 hover:underline">
            <span className="font-medium text-primary">{doc_number ?? t('common.open')}</span>
            <Badge tone={observations === 0 ? 'success' : warnings ? 'warning' : 'info'}>
              {observations === 0
                ? t('common.clean')
                : t('jobs.observations', { count: observations })}
            </Badge>
          </Link>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        row.original.status === 'dead' ? <RetryButton jobId={row.original.job_id} /> : null,
    },
  ]
}

export function JobsTable({
  jobs,
  isLoading,
  error,
}: {
  jobs: JobRow[] | undefined
  isLoading: boolean
  error: string | null
}) {
  const { t, i18n } = useTranslation()
  const columns = useMemo(() => buildColumns(t, i18n.language), [t, i18n.language])
  return (
    <DataTable
      columns={columns}
      data={jobs}
      isLoading={isLoading}
      error={error}
      empty={t('jobs.empty')}
      getRowId={(row) => row.job_id}
    />
  )
}
