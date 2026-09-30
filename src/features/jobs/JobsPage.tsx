import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/ui/page-header'
import { CardTitle } from '@/components/ui/card'
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
  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.jobs')} description={t('pageStates.jobs')} />
      <PausedBanner provider={jobs.data?.provider} />
      <StatusCounts counts={jobs.data?.counts} isLoading={jobs.isLoading} />
      <div ref={uploadArea}>
        <UploadDropzone />
      </div>
      <section>
        <CardTitle hint={active > 0 ? t('jobs.refreshing', { count: active }) : t('jobs.idle')}>
          {t('jobs.latest')}
        </CardTitle>
        <JobsTable
          onUpload={() => {
            const button = uploadArea.current?.querySelector('button')
            button?.scrollIntoView?.({ block: 'center' })
            button?.focus()
          }}
          jobs={jobs.data?.jobs}
          isLoading={jobs.isLoading}
          error={jobs.error ? toApiError(jobs.error).message : null}
        />
      </section>
    </div>
  )
}
