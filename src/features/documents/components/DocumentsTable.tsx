import type { ColumnDef } from '@tanstack/react-table'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { paths } from '@/app/router/paths'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { money } from '@/lib/format'

import { useDeleteDoc } from '../hooks'
import type { PurchaseDocSummary } from '../types'
import { IssueBadges } from './IssueBadges'
import { LinePrices } from './LinePrices'

function DeleteButton({ doc }: { doc: PurchaseDocSummary }) {
  const { t } = useTranslation()
  const remove = useDeleteDoc()
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-danger"
      disabled={remove.isPending}
      onClick={() => {
        if (window.confirm(t('documents.confirmDelete', { name: doc.doc_number ?? '?' })))
          remove.mutate(doc.id)
      }}
    >
      {t('common.delete')}
    </Button>
  )
}

function buildColumns(t: TFunction): ColumnDef<PurchaseDocSummary, unknown>[] {
  const amount = (value: string | null, currency: string | null) => (
    <span className="whitespace-nowrap tabular-nums">{money(value, currency ?? 'PEN')}</span>
  )
  return [
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={row.getToggleExpandedHandler()}
          aria-expanded={row.getIsExpanded()}
          aria-label={row.getIsExpanded() ? t('prices.collapse') : t('prices.expand')}
          title={row.getIsExpanded() ? t('prices.collapse') : t('prices.expand')}
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className={row.getIsExpanded() ? 'rotate-90 transition' : 'transition'}>▸</span>
        </button>
      ),
    },
    {
      header: t('documents.columns.number'),
      cell: ({ row }) => (
        <Link
          to={paths.purchaseDoc(row.original.id)}
          className="font-medium whitespace-nowrap text-primary hover:underline"
        >
          {row.original.doc_number ?? '?'}
        </Link>
      ),
    },
    {
      header: t('documents.columns.supplier'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.supplier?.legal_name ?? '—'}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.supplier?.ruc ?? t('documents.noRuc')}
          </div>
        </div>
      ),
    },
    {
      header: t('documents.columns.type'),
      cell: ({ row }) => t(`docType.${row.original.doc_type}`),
    },
    {
      header: t('documents.columns.date'),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.issue_date ?? '—'}</span>
      ),
    },
    {
      header: t('documents.columns.taxable'),
      cell: ({ row }) => amount(row.original.taxable_amount, row.original.currency),
    },
    {
      header: t('documents.columns.igv'),
      cell: ({ row }) => amount(row.original.igv_amount, row.original.currency),
    },
    {
      header: t('documents.columns.totalWithIgv'),
      cell: ({ row }) => (
        <span className="font-semibold">
          {amount(row.original.total_amount, row.original.currency)}
        </span>
      ),
    },
    {
      header: t('documents.columns.observations'),
      cell: ({ row }) => <IssueBadges issues={row.original.issues} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Link
            to={paths.purchaseDoc(row.original.id)}
            className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-muted"
          >
            {t('common.open')}
          </Link>
          <DeleteButton doc={row.original} />
        </div>
      ),
    },
  ]
}

export function DocumentsTable(props: {
  docs: PurchaseDocSummary[] | undefined
  isLoading: boolean
  error: string | null
}) {
  const { t } = useTranslation()
  const columns = useMemo(() => buildColumns(t), [t])
  return (
    <DataTable
      columns={columns}
      data={props.docs}
      isLoading={props.isLoading}
      error={props.error}
      empty={t('documents.empty')}
      getRowId={(row) => row.id}
      renderSubRow={(row) => <LinePrices doc={row.original} />}
    />
  )
}
