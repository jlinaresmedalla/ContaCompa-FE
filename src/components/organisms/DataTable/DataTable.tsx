import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { Fragment, type ReactNode } from 'react'
import { ErrorNote } from '@/components/molecules'
import {
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/atoms'

import { cn } from '@/lib/cn'

function columnLayout(meta: unknown) {
  return (meta as { layout?: 'text' | 'numeric' | 'actions' } | undefined)?.layout
}

const SKELETON_ROW_COUNT = 5

type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[]
  data: T[] | undefined
  isLoading: boolean
  error?: string | null
  empty: ReactNode
  getRowId?: (row: T) => string
  /** When set, rows can expand to show this under them (master-detail). */
  renderSubRow?: (row: Row<T>) => ReactNode
}

/** Project table: TanStack Table for column logic, shadcn Table for rendering. */
export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  empty,
  getRowId,
  renderSubRow,
}: DataTableProps<T>) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table v8 returns a stable instance
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => Boolean(renderSubRow),
    getRowId,
  })
  if (error && data === undefined) return <ErrorNote message={error} />
  const rows = table.getRowModel().rows
  const width = table.getVisibleLeafColumns().length
  return (
    <>
      <Table className="w-full text-sm">
        <TableHeader className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  data-column={columnLayout(header.column.columnDef.meta)}
                  style={{
                    textAlign:
                      columnLayout(header.column.columnDef.meta) === 'numeric'
                        ? 'right'
                        : columnLayout(header.column.columnDef.meta) === 'actions'
                          ? 'center'
                          : 'left',
                  }}
                  className={cn(
                    'min-w-[4rem] px-3 py-1.5 font-semibold whitespace-normal break-normal text-muted-foreground',
                    index === 0 && 'sticky left-0 z-10 border-r border-border bg-muted',
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading && data === undefined ? (
            Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
              <TableRow key={index} className="group hover:bg-muted">
                {table.getVisibleLeafColumns().map((column, index) => (
                  <TableCell
                    key={column.id}
                    data-column={columnLayout(column.columnDef.meta)}
                    className={cn(
                      'min-w-[4rem] px-3 py-1.5',
                      index === 0 &&
                        'sticky left-0 z-10 border-r border-border bg-card group-hover:bg-muted',
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={width} className="px-3 py-6 text-center text-muted-foreground">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  className={cn(
                    'group border-b border-border hover:bg-muted has-aria-expanded:bg-card has-aria-expanded:hover:bg-muted',
                    row.getIsExpanded() && 'bg-muted has-aria-expanded:bg-muted',
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      data-column={columnLayout(cell.column.columnDef.meta)}
                      style={{
                        textAlign:
                          columnLayout(cell.column.columnDef.meta) === 'numeric'
                            ? 'right'
                            : columnLayout(cell.column.columnDef.meta) === 'actions'
                              ? 'center'
                              : 'left',
                      }}
                      className={cn(
                        'min-w-[4rem] px-3 py-1.5 align-middle whitespace-normal break-normal [overflow-wrap:normal]',
                        index === 0 &&
                          'sticky left-0 z-10 border-r border-border bg-card group-hover:bg-muted',
                        index === 0 && row.getIsExpanded() && 'bg-muted',
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && renderSubRow ? (
                  <TableRow className="border-b border-border bg-background">
                    <TableCell colSpan={width} className="px-3 py-1.5 whitespace-normal">
                      {renderSubRow(row)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
