import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/molecules'
import { Badge, Button, Card, CardTitle } from '@/components/atoms'
import { toApiError } from '@/lib/http'

import { JobsTable } from './components/JobsTable'
import { PausedBanner } from './components/PausedBanner'
import { StatusCounts } from './components/StatusCounts'
import { UploadDropzone } from './components/UploadDropzone'
import { useJobsOverview } from './hooks'

export function JobsPage() {
  const { t } = useTranslation()
  const jobs = useJobsOverview()
  const uploadArea = useRef<HTMLDivElement>(null)
  const active = jobs.data ? jobs.data.counts.queued + jobs.data.counts.processing : 0
  const current = jobs.data?.jobs.find((job) => job.status === 'processing')
  const focusUpload = () => {
    const button = uploadArea.current?.querySelector('button')
    button?.scrollIntoView?.({ block: 'center' })
    button?.focus()
  }
  return (
    <div className="space-y-7 md:space-y-9">
      <PageHeader
        title={t('nav.jobs')}
        description={t('pageStates.jobs')}
        actions={
          <Button onClick={focusUpload}>
            <Upload aria-hidden="true" className="size-4.5" />
            {t('jobs.upload')}
          </Button>
        }
      />
      <PausedBanner provider={jobs.data?.provider} />
      <StatusCounts counts={jobs.data?.counts} isLoading={jobs.isLoading} />
      <div ref={uploadArea}>
        <UploadDropzone />
      </div>
      {current ? (
        <Card className="space-y-4.5 bg-foreground text-background" role="status">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 space-y-2.5">
              <Badge tone="info">{t('jobs.inProgress')}</Badge>
              <p className="truncate text-lg font-semibold">{current.filename}</p>
            </div>
            <Button variant="outline" asChild>
              <a href={`#job-${current.job_id}`}>{t('jobs.viewJob')}</a>
            </Button>
          </div>
          <p className="text-xs">
            {t('jobStatusHint.processing')} · {t('jobs.progressHint')}
          </p>
        </Card>
      ) : null}
      <section>
        <CardTitle hint={active > 0 ? t('jobs.refreshing', { count: active }) : t('jobs.idle')}>
          {t('jobs.latest')}
        </CardTitle>
        <JobsTable
          onUpload={focusUpload}
          jobs={jobs.data?.jobs}
          isLoading={jobs.isLoading}
          error={jobs.error ? toApiError(jobs.error).message : null}
        />
      </section>
    </div>
  )
}
