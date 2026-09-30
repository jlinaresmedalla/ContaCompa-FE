import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { DataTable } from '.'

const COLUMNS = [
  { accessorKey: 'name', header: 'Supplier name' },
  { accessorKey: 'total', header: 'Printed total' },
]
const DATA = [{ name: 'Long supplier name', total: '12.50' }]

test('keeps every column with minimum widths and pins the first header and cell', () => {
  render(<DataTable columns={COLUMNS} data={DATA} isLoading={false} empty="Empty" />)
  const headers = screen.getAllByRole('columnheader')
  const cells = screen.getAllByRole('cell')
  expect(headers).toHaveLength(COLUMNS.length)
  expect(cells).toHaveLength(COLUMNS.length)
  expect(headers[0]).toHaveClass('sticky', 'left-0', 'bg-muted', 'border-r')
  expect(cells[0]).toHaveClass('sticky', 'left-0', 'bg-card', 'border-r')
  expect(cells[1]).not.toHaveClass('sticky')
  for (const header of headers) expect(header).toHaveClass('min-w-[4rem]', 'break-normal')
  for (const cell of cells)
    expect(cell).toHaveClass('min-w-[4rem]', 'break-normal', '[overflow-wrap:normal]')
})

test('pins the first column while loading too', () => {
  render(<DataTable columns={COLUMNS} data={undefined} isLoading empty="Empty" />)
  expect(screen.getAllByRole('cell')[0]).toHaveClass('sticky', 'left-0', 'min-w-[4rem]')
})
