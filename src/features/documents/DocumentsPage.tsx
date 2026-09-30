import { FileText, Search } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { paths } from '@/app/router/paths'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import { toApiError } from '@/lib/http'

import { PAGE_SIZE } from './api'
import { DocumentsTable } from './components/DocumentsTable'
import { ObservationReport } from './components/ObservationReport'
import { useExportXlsx, useListFilters, usePurchaseDocs } from './hooks'
import { observationLabel } from './observations'
import type { ObservationFilter } from './types'

const FILTERS: ObservationFilter[] = ['all', 'warning', 'any', 'none']

export function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const [filters, setFilters, offset, setOffset] = useListFilters()
  const docs = usePurchaseDocs(filters, offset)
  const exportXlsx = useExportXlsx()
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.purchaseDocs')}
        description={t('pageStates.documents')}
        actions={
          <Button
            variant="outline"
            disabled={exportXlsx.isPending}
            onClick={() => exportXlsx.mutate(i18n.language)}
          >
            {exportXlsx.isPending ? t('documents.exporting') : t('documents.export')}
          </Button>
        }
      />
      <ObservationReport onPickCode={(code) => setFilters({ observations: 'all', code })} />
      <div className="flex flex-wrap items-center gap-2 [&>[role=radiogroup]]:max-w-full [&>[role=radiogroup]]:flex-wrap">
        <Segmented<ObservationFilter>
          label={t('documents.filterLabel')}
          value={filters.observations}
          options={FILTERS.map((value) => ({ value, label: t(`documents.filters.${value}`) }))}
          onChange={(observations) => setFilters({ observations, code: null })}
        />
        {filters.code ? (
          <span className="flex min-w-0 max-w-full flex-wrap items-center gap-2 [&>[data-slot=badge]]:whitespace-normal">
            <Badge tone="info">
              {t('documents.codeFilter', { code: observationLabel(t, filters.code) })}
            </Badge>
            <button
              type="button"
              className="text-xs text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              onClick={() => setFilters({ ...filters, code: null })}
            >
              {t('documents.clearCode')}
            </button>
          </span>
        ) : null}
      </div>
      <DocumentsTable
        empty={
          filters.observations !== 'all' || filters.code ? (
            <EmptyState
              icon={Search}
              title={t('pageStates.filteredTitle')}
              description={t('pageStates.filteredDescription')}
              action={
                <Button
                  variant="outline"
                  onClick={() => setFilters({ observations: 'all', code: null })}
                >
                  {t('pageStates.clear')}
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={FileText}
              title={t('pageStates.docsTitle')}
              description={t('pageStates.docsDescription')}
              action={
                <Button asChild>
                  <Link to={paths.jobs}>{t('pageStates.upload')}</Link>
                </Button>
              }
            />
          )
        }
        docs={docs.data?.items}
        isLoading={docs.isLoading}
        error={docs.error ? toApiError(docs.error).message : null}
      />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          disabled={offset === 0 || docs.isLoading}
          onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
        >
          {t('documents.previous')}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t('documents.page', { n: Math.floor(offset / PAGE_SIZE) + 1 })}
        </span>
        <Button
          variant="outline"
          disabled={docs.data?.next_offset == null || docs.isLoading}
          onClick={() => setOffset(docs.data!.next_offset!)}
        >
          {t('documents.next')}
        </Button>
      </div>
    </div>
  )
}
