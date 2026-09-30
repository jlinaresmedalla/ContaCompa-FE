import { Table } from '@/components/atoms'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { dateTime } from '@/lib/format'
import type { PurchaseDocDetail } from '../types/purchaseDocs'

const COLUMNS = ['field', 'before', 'after', 'changed'] as const
const CELL = 'px-3.5 py-2'
export function CorrectionHistory({ doc }: { doc: PurchaseDocDetail }) {
  const { t, i18n } = useTranslation()
  if (!doc.corrections.length)
    return <p className="p-card text-sm text-muted-foreground">{t('detail.noCorrections')}</p>
  return (
    <>
      <Table className="w-full text-sm">
        <thead>
          <tr className="h-table-header-compact border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-5.5">
              <span className="sr-only">{t('detail.changed')}</span>
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className={`${CELL} ${column === 'changed' ? 'text-right' : ''}`}
              >
                {t(`detail.historyColumns.${column}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doc.corrections.map((correction, index) => {
            const line = doc.lines.find((item) => item.id === correction.line_id)
            return (
              <tr key={index} className="h-table-row-compact border-b border-border last:border-0">
                <td className="px-5.5">
                  <span className="flex size-icon-button items-center justify-center rounded-control border border-primary/20 bg-primary/5 text-primary">
                    <Pencil aria-hidden="true" className="size-4" />
                  </span>
                </td>
                <th
                  scope="row"
                  className={`sticky left-0 border-r border-border bg-card ${CELL} text-left font-medium whitespace-nowrap`}
                >
                  {t(`detail.fields.${correction.field}`, { defaultValue: correction.field })}
                  {line ? (
                    <span className="block text-xs text-muted-foreground">
                      {t('detail.line', { n: line.line_number })}
                    </span>
                  ) : null}
                </th>
                <td data-column="text" className={`${CELL} text-muted-foreground`}>
                  {correction.old_value ?? t('detail.missingValue')}
                </td>
                <td data-column="text" className={CELL}>
                  {correction.new_value ?? t('detail.missingValue')}
                </td>
                <td
                  className={`${CELL} text-right text-muted-foreground whitespace-nowrap`}
                  title={correction.corrected_by}
                >
                  {dateTime(correction.corrected_at, i18n.language)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
