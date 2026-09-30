import { FileText, Search, Download, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { PATHS } from '@/app/router/paths'
import { PageHeader, EmptyState, IconButton, FilterPills } from '@/components/molecules'

import { Badge, Button, Input } from '@/components/atoms'

import { toApiError } from '@/lib/http'

import { PAGE_SIZE } from './api/purchaseDocsApi'
import { DocumentsTable } from './components/DocumentsTable'
import { ObservationStats } from './components/ObservationStats'
import { OBSERVATION_FILTERS } from './hooks/useListFilters'
import { useDocumentSearch } from './hooks/useDocumentSearch'
import { useExportXlsx } from './hooks/useExportXlsx'
import { useListFilters } from './hooks/useListFilters'
import { usePurchaseDocs } from './hooks/usePurchaseDocs'
import { observationLabel } from './utils/observations'
import type { ObservationFilter } from './types/purchaseDocs'

export function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const [filters, setFilters, offset, setOffset] = useListFilters()
  const docs = usePurchaseDocs(filters, offset)
  const exportXlsx = useExportXlsx()
  const { search, setSearch, matches, hasSearch } = useDocumentSearch(docs.data?.items)
  return (
    <div className="min-w-0 space-y-6">
      <PageHeader title={t('nav.purchaseDocs')} description={t('pageStates.documents')} />
      <ObservationStats />
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="min-w-0 w-full xl:w-auto xl:flex-1">
          <FilterPills<ObservationFilter>
            label={t('documents.filterLabel')}
            value={filters.observations}
            options={OBSERVATION_FILTERS.map((value) => ({
              value,
              label: t(`documents.filters.${value}`),
            }))}
            onChange={(observations) => setFilters({ observations, code: null })}
          />
        </div>
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
        <div className="flex min-w-0 w-full items-center gap-2 xl:w-auto">
          <Input
            className="min-w-0 flex-1 xl:w-[22rem]"
            type="search"
            aria-label={t('documents.searchPage')}
            placeholder={t('documents.searchPage')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <IconButton
            className="h-control w-13 md:w-10.5"
            icon={Download}
            label={exportXlsx.isPending ? t('documents.exporting') : t('documents.export')}
            variant="outline"
            disabled={exportXlsx.isPending}
            onClick={() => exportXlsx.mutate(i18n.language)}
          />
        </div>
      </div>
      <DocumentsTable
        empty={
          filters.observations !== 'all' || filters.code || hasSearch ? (
            <EmptyState
              icon={Search}
              title={t('pageStates.filteredTitle')}
              description={t('pageStates.filteredDescription')}
              action={
                <IconButton
                  icon={X}
                  label={t('pageStates.clear')}
                  variant="outline"
                  onClick={() => {
                    setSearch('')
                    setFilters({ observations: 'all', code: null })
                  }}
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
        docs={matches}
        isLoading={docs.isLoading}
        error={docs.error ? toApiError(docs.error).message : null}
      />
      <div className="flex flex-wrap items-center justify-end gap-2 [&_button]:h-control [&_button]:w-13 md:[&_button]:w-10.5">
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
