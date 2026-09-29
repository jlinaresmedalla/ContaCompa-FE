import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { Fragment, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorNote } from '@/components/ui/input'
import { cn } from '@/lib/cn'

type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[]
  data: T[] | undefined
  isLoading: boolean
  error?: string | null
  empty: string
  getRowId?: (row: T) => string
  /** When set, rows can expand to show this under them (master-detail). */
  renderSubRow?: (row: Row<T>) => ReactNode
}

/** Project table: TanStack Table for column logic, plain semantic markup for rendering. */
export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  empty,
  getRowId,
  renderSubRow,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table v8 returns a stable instance
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => Boolean(renderSubRow),
    getRowId,
  })
  if (error) return <ErrorNote message={error} />
  const rows = table.getRowModel().rows
  const width = table.getVisibleLeafColumns().length
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="px-3 py-2 font-semibold whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading || rows.length === 0 ? (
            <tr>
              <td colSpan={width} className="px-3 py-6 text-center text-muted-foreground">
                {isLoading ? t('common.loading') : empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <Fragment key={row.id}>
                <tr
                  className={cn(
                    'border-b border-border hover:bg-muted/60',
                    row.getIsExpanded() && 'bg-muted/60',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderSubRow ? (
                  <tr className="border-b border-border bg-background">
                    <td colSpan={width} className="px-3 py-3">
                      {renderSubRow(row)}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
