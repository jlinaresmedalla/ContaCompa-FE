import { FileText, Search, Download, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { PATHS } from '@/app/router/paths'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Segmented } from '@/components/ui/segmented'
import { toApiError } from '@/lib/http'

import { PAGE_SIZE } from './api'
import { DocumentsTable } from './components/DocumentsTable'
import { ObservationReport } from './components/ObservationReport'
import { OBSERVATION_FILTERS, useExportXlsx, useListFilters, usePurchaseDocs } from './hooks'
import { observationLabel } from './observations'
import type { ObservationFilter } from './types'

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
          <IconButton
            icon={Download}
            label={exportXlsx.isPending ? t('documents.exporting') : t('documents.export')}
            variant="outline"
            disabled={exportXlsx.isPending}
            onClick={() => exportXlsx.mutate(i18n.language)}
          />
        }
      />
      <ObservationReport onPickCode={(code) => setFilters({ observations: 'all', code })} />
      <div className="flex flex-wrap items-center gap-2 [&>[role=radiogroup]]:max-w-full [&>[role=radiogroup]]:flex-wrap">
        <Segmented<ObservationFilter>
          label={t('documents.filterLabel')}
          value={filters.observations}
          options={OBSERVATION_FILTERS.map((value) => ({
            value,
            label: t(`documents.filters.${value}`),
          }))}
          onChange={(observations) => setFilters({ observations, code: null })}
        />
        {filters.code ? (
          <span className="flex min-w-0 max-w-full flex-wrap items-center gap-2 [&>[data-slot=badge]]:whitespace-normal">
            <Badge tone="info">
              {t('documents.codeFilter', { code: observationLabel(t, filters.code) })}
            </Badge>
            <IconButton
              icon={X}
              label={t('documents.clearCode')}
              variant="ghost"
              onClick={() => setFilters({ ...filters, code: null })}
            />
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
                <IconButton
                  icon={X}
                  label={t('pageStates.clear')}
                  variant="outline"
                  onClick={() => setFilters({ observations: 'all', code: null })}
                />
              }
            />
          ) : (
            <EmptyState
              icon={FileText}
              title={t('pageStates.docsTitle')}
              description={t('pageStates.docsDescription')}
              action={
                <Button asChild>
                  <Link to={PATHS.jobs}>
                    <Upload aria-hidden="true" className="size-4" />
                    {t('pageStates.upload')}
                  </Link>
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
        <IconButton
          icon={ChevronLeft}
          label={t('documents.previous')}
          variant="outline"
          disabled={offset === 0 || docs.isLoading}
          onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
        />
        <span className="text-sm text-muted-foreground">
          {t('documents.page', { n: Math.floor(offset / PAGE_SIZE) + 1 })}
        </span>
        <IconButton
          icon={ChevronRight}
          label={t('documents.next')}
          variant="outline"
          disabled={docs.data?.next_offset == null || docs.isLoading}
          onClick={() => setOffset(docs.data!.next_offset!)}
        />
      </div>
    </div>
  )
}
