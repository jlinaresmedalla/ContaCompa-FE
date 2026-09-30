import { Pencil, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/molecules'
import { useRef } from 'react'
import { usePhoneWidth } from '../use-detail-tabs'
import { LineEditInput } from './LineEditInput'
import { LineItemSheet } from './LineItemSheet'
import { linePriceColumns } from '../line-price-columns'
import { number } from '@/lib/format'
import { useLineCorrections } from '../use-line-corrections'
import type { Line, PurchaseDocDetail } from '../types'

const TEXT_FIELDS = ['quantity', 'unit', 'description'] as const
const CELL = 'px-3.5 py-2 text-right tabular-nums'

export function LineRow({ doc, line }: { doc: PurchaseDocDetail; line: Line }) {
  const { t } = useTranslation()
  const edit = useLineCorrections(doc, line)
  const label = t('detail.line', { n: line.line_number })
  const phone = usePhoneWidth()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inline = edit.editing && !phone
  const input = (field: (typeof TEXT_FIELDS)[number] | 'unit_price' | 'line_total') => (
    <LineEditInput edit={edit} field={field} label={`${label} ${t(`detail.fields.${field}`)}`} />
  )
  return (
    <tr className={`h-table-row border-t border-border ${inline ? 'bg-primary/5' : ''}`}>
      {TEXT_FIELDS.map((field) => (
        <td
          key={field}
          className={`px-3.5 py-2 ${field === 'quantity' ? 'sticky left-0 z-10 border-r border-border bg-card text-right tabular-nums' : ''}`}
        >
          {inline
            ? input(field)
            : field === 'quantity'
              ? number(line[field])
              : (line[field] ?? '—')}
        </td>
      ))}
      {linePriceColumns(doc.prices_include_igv).map(({ field, derived, includes }) => {
        const printed = doc.prices_include_igv === includes
        return (
          <td
            key={derived}
            className={`${CELL} ${printed ? 'font-semibold' : 'text-muted-foreground'}`}
          >
            {inline && printed
              ? input(field)
              : number(
                  printed ? line[field] : doc.prices_include_igv === null ? null : line[derived],
                )}
          </td>
        )
      })}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {inline ? input('unit_price') : number(line.unit_price)}
        </td>
      ) : null}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {inline ? input('line_total') : number(line.line_total)}
        </td>
      ) : null}
      <td className="px-3.5 py-2">
        <div className="flex justify-end gap-2.5">
          {inline ? (
            <>
              <IconButton
                icon={Save}
                label={t('detail.saveLine', { n: line.line_number })}
                disabled={edit.pending}
                onClick={() => void edit.save()}
              />
              <IconButton
                icon={X}
                label={t('detail.cancel')}
                variant="ghost"
                disabled={edit.pending}
                onClick={edit.cancel}
              />
            </>
          ) : (
            <IconButton
              icon={Pencil}
              label={t('detail.editLine', { n: line.line_number })}
              variant="ghost"
              ref={triggerRef}
              onClick={edit.start}
            />
          )}
        </div>
        <LineItemSheet
          edit={edit}
          lineNumber={line.line_number}
          open={edit.editing && phone}
          returnFocusRef={triggerRef}
        />
      </td>
    </tr>
  )
}
