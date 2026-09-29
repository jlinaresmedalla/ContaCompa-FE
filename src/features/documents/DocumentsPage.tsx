import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorNote } from '@/components/ui/input'
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
      <h1 className="text-lg font-semibold">{t('nav.purchaseDocs')}</h1>
      <ObservationReport onPickCode={(code) => setFilters({ observations: 'all', code })} />
      <div className="flex flex-wrap items-center gap-2">
        <Segmented<ObservationFilter>
          label={t('documents.filterLabel')}
          value={filters.observations}
          options={FILTERS.map((value) => ({ value, label: t(`documents.filters.${value}`) }))}
          onChange={(observations) => setFilters({ observations, code: null })}
        />
        {filters.code ? (
          <span className="flex items-center gap-2">
            <Badge tone="info">
              {t('documents.codeFilter', { code: observationLabel(t, filters.code) })}
            </Badge>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => setFilters({ ...filters, code: null })}
            >
              {t('documents.clearCode')}
            </button>
          </span>
        ) : null}
        <Button
          className="ml-auto"
          variant="outline"
          disabled={exportXlsx.isPending}
          onClick={() => exportXlsx.mutate(i18n.language)}
        >
          {exportXlsx.isPending ? t('documents.exporting') : t('documents.export')}
        </Button>
      </div>
      {exportXlsx.data ? (
        <p className="text-xs text-muted-foreground">
          {t('documents.exported', { count: exportXlsx.data.count })}
        </p>
      ) : null}
      {exportXlsx.error ? <ErrorNote message={toApiError(exportXlsx.error).message} /> : null}
      <DocumentsTable
        docs={docs.data?.items}
        isLoading={docs.isLoading}
        error={docs.error ? toApiError(docs.error).message : null}
      />
      <div className="flex items-center justify-end gap-2">
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
