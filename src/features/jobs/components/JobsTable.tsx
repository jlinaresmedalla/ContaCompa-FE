import {
  ChevronRight,
  FileText,
  Image,
  ListFilter,
  RotateCcw,
  ArrowDownWideNarrow,
  Upload,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { PATHS } from '@/app/router/paths'
import { Badge, Button, Card, Input, Skeleton, type BadgeTone } from '@/components/atoms'
import { AppSelect, EmptyState, IconButton } from '@/components/molecules'
import { dateTime, seconds } from '@/lib/format'
import { useJobsList, useRetryJob } from '../hooks'
import type { JobRow, JobStatus } from '../types'

const STATUS_TONE: Record<JobStatus, BadgeTone> = {
  queued: 'warning',
  processing: 'info',
  done: 'success',
  failed: 'warning',
  dead: 'danger',
}
const FILTER_STATUSES = ['all', 'done', 'processing', 'dead', 'queued', 'failed'] as const
const SKELETON_ROWS = 3
const ROW_CLASS =
  'flex min-h-list-row items-center gap-3.5 border-b border-border px-4.5 py-3 last:border-b-0 md:h-list-row md:gap-4.5 md:px-5.5'

function RetryButton({ jobId }: { jobId: string }) {
  const { t } = useTranslation()
  const retry = useRetryJob()
  return (
    <Button
      variant="outline"
      className="px-3 md:size-icon-button-row md:p-0"
      aria-label={t('common.retry')}
      disabled={retry.isPending}
      onClick={() => retry.mutate(jobId)}
    >
      <RotateCcw aria-hidden="true" className="hidden size-4 md:block" />
      <span className="md:hidden">{t('common.retry')}</span>
    </Button>
  )
}

function JobListRow({ job }: { job: JobRow }) {
  const { t, i18n } = useTranslation()
  const Icon = job.source_kind === 'photo' ? Image : FileText
  return (
    <li id={`job-${job.job_id}`} className={ROW_CLASS}>
      <span className="flex size-icon-tile shrink-0 items-center justify-center rounded-icon-tile border border-primary/20 bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold" title={job.filename}>
          {job.filename}
        </div>
        <div className="truncate text-xs text-muted-foreground" title={job.last_error ?? undefined}>
          {job.last_error ??
            `${t(`sourceKind.${job.source_kind}`)} · ${job.doc_number ?? t(`jobStatusHint.${job.status}`)}`}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2.5 md:hidden">
          <Badge tone={STATUS_TONE[job.status]}>{t(`jobStatus.${job.status}`)}</Badge>
          <span className="text-xs tabular-nums text-muted-foreground">
            {job.status === 'dead'
              ? t('jobs.attempts', { count: job.attempts })
              : seconds(job.created_at, job.finished_at)}
          </span>
        </div>
      </div>
      <div className="hidden w-27.5 shrink-0 md:block">
        <Badge tone={STATUS_TONE[job.status]}>{t(`jobStatus.${job.status}`)}</Badge>
      </div>
      <div
        className="hidden w-20.5 shrink-0 text-right text-xs tabular-nums text-muted-foreground md:block"
        aria-label={t('jobs.columns.took')}
      >
        {seconds(job.created_at, job.finished_at)}
      </div>
      <div
        className="hidden w-32 shrink-0 text-right text-xs tabular-nums text-muted-foreground md:block"
        aria-label={t('jobs.columns.attempts')}
      >
        {t('jobs.attempts', { count: job.attempts })}
      </div>
      <div className="flex shrink-0 justify-end md:w-20.5">
        {job.status === 'dead' ? (
          <RetryButton jobId={job.job_id} />
        ) : job.purchase_doc_id ? (
          <IconButton size="row" icon={ChevronRight} label={t('jobs.columns.document')} asChild>
            <Link to={PATHS.purchaseDoc(job.purchase_doc_id)} />
          </IconButton>
        ) : null}
        {!job.purchase_doc_id && job.status !== 'dead' ? (
          <span className="text-muted-foreground">—</span>
        ) : null}
      </div>
      <span className="sr-only">
        {dateTime(job.created_at, i18n.language)}
        {job.observations > 0 ? ` · ${t('jobs.observations', { count: job.observations })}` : ''}
      </span>
    </li>
  )
}

export function JobsTable({
  jobs,
  onUpload,
  isLoading,
  error,
}: {
  onUpload: () => void
  jobs: JobRow[] | undefined
  isLoading: boolean
  error: string | null
}) {
  const { t } = useTranslation()
  const list = useJobsList(jobs)
  const options = FILTER_STATUSES.map((value) => ({
    value,
    label: value === 'all' ? t('jobs.all') : t(`jobStatus.${value}`),
  }))
  return (
    <div className="space-y-4.5">
      <div className="flex flex-col gap-3.5">
        <div className="md:hidden">
          <AppSelect
            label={t('jobs.columns.status')}
            value={list.status}
            options={options}
            onChange={list.setStatus}
          />
        </div>
        <div
          className="hidden flex-wrap gap-2.5 md:flex"
          role="group"
          aria-label={t('jobs.columns.status')}
        >
          {options.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              aria-pressed={list.status === option.value}
              className={list.status === option.value ? 'border-primary text-primary' : ''}
              onClick={() => list.setStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Input
            type="search"
            className="min-w-0 flex-1 rounded-full"
            aria-label={t('jobs.search')}
            placeholder={t('jobs.search')}
            value={list.search}
            onChange={(event) => list.setSearch(event.target.value)}
          />
          <Button
            variant="outline"
            aria-label={t('jobs.filter')}
            aria-pressed={list.issuesOnly}
            onClick={() => list.setIssuesOnly(!list.issuesOnly)}
          >
            <ListFilter aria-hidden="true" className="size-4" />
          </Button>
          <Button
            variant="outline"
            aria-label={t('jobs.sort')}
            aria-pressed={list.oldestFirst}
            onClick={() => list.setOldestFirst(!list.oldestFirst)}
          >
            <ArrowDownWideNarrow aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Card className="overflow-hidden p-0" aria-busy={isLoading && !jobs}>
        {isLoading && !jobs ? (
          <ul aria-label={t('jobs.latest')}>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <li key={index} className={ROW_CLASS}>
                <Skeleton className="size-icon-tile shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-chip w-20" />
              </li>
            ))}
          </ul>
        ) : list.rows.length > 0 ? (
          <ul aria-label={t('jobs.latest')}>
            {list.rows.map((job) => (
              <JobListRow key={job.job_id} job={job} />
            ))}
          </ul>
        ) : error && !jobs ? null : (
          <EmptyState
            icon={Upload}
            title={t(jobs?.length ? 'jobs.filteredTitle' : 'pageStates.jobsTitle')}
            description={t(
              jobs?.length ? 'jobs.filteredDescription' : 'pageStates.jobsDescription',
            )}
            action={
              jobs?.length ? (
                <Button variant="outline" onClick={list.clearFilters}>
                  {t('jobs.clear')}
                </Button>
              ) : (
                <Button onClick={onUpload}>{t('pageStates.upload')}</Button>
              )
            }
          />
        )}
      </Card>
    </div>
  )
}
