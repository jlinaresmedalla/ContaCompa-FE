import { useTranslation } from 'react-i18next'

import { CardTitle } from '@/components/ui/card'
import { toApiError } from '@/lib/http'

import { JobsTable } from './components/JobsTable'
import { StatusCounts } from './components/StatusCounts'
import { UploadDropzone } from './components/UploadDropzone'
import { useJobsOverview } from './hooks'

export function JobsPage() {
  const { t } = useTranslation()
  const jobs = useJobsOverview()
  const active = jobs.data ? jobs.data.counts.queued + jobs.data.counts.processing : 0
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">{t('nav.jobs')}</h1>
      <StatusCounts counts={jobs.data?.counts} />
      <UploadDropzone />
      <section>
        <CardTitle hint={active > 0 ? t('jobs.refreshing', { count: active }) : t('jobs.idle')}>
          {t('jobs.latest')}
        </CardTitle>
        <JobsTable
          jobs={jobs.data?.jobs}
          isLoading={jobs.isLoading}
          error={jobs.error ? toApiError(jobs.error).message : null}
        />
      </section>
    </div>
  )
}
