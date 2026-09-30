import { Pencil, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/molecules'
import { useRef } from 'react'
import { usePhoneWidth } from '@/lib/use-phone-width'
import { LineEditInput } from './LineEditInput'
import { LineItemSheet } from './LineItemSheet'
import { linePriceColumns } from '../line-price-columns'
import { formatPrintedPrice, formatDerivedPrice, formatTotal } from '@/lib/money-format'
import { number } from '@/lib/format'
import { useLineCorrections } from '../use-line-corrections'
import type { Line, PurchaseDocDetail } from '../types'

const TEXT_FIELDS = ['quantity', 'unit', 'description'] as const
const CELL = 'px-3 py-1.5 text-right whitespace-nowrap tabular-nums'

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
    <tr
      className={`h-table-row-compact border-t border-border [&_td]:align-middle ${inline ? 'bg-primary/5' : ''}`}
    >
      {TEXT_FIELDS.map((field) => (
        <td
          key={field}
          data-column={field === 'description' ? 'text' : undefined}
          className={`px-3 py-1.5 ${field === 'quantity' ? 'sticky left-0 z-10 border-r border-border bg-card text-right whitespace-nowrap tabular-nums' : field === 'unit' ? 'min-w-[4rem]' : 'min-w-48'}`}
        >
          {inline
            ? input(field)
            : field === 'quantity'
              ? number(line[field])
              : field === 'unit'
                ? t(`detail.units.${line.unit}`, { defaultValue: line.unit ?? '—' })
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
              : (field === 'line_total'
                  ? formatTotal
                  : printed
                    ? formatPrintedPrice
                    : formatDerivedPrice)(
                  printed ? line[field] : doc.prices_include_igv === null ? null : line[derived],
                  doc.currency ?? undefined,
                )}
          </td>
        )
      })}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {inline
            ? input('unit_price')
            : formatPrintedPrice(line.unit_price, doc.currency ?? undefined)}
        </td>
      ) : null}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {inline ? input('line_total') : formatTotal(line.line_total, doc.currency ?? undefined)}
        </td>
      ) : null}
      <td className="px-3 py-1.5">
        <div className="flex justify-center gap-2.5">
          {inline ? (
            <>
              <IconButton
                size="row"
                icon={Save}
                label={t('detail.saveLine', { n: line.line_number })}
                disabled={edit.pending}
                onClick={() => void edit.save()}
              />
              <IconButton
                size="row"
                icon={X}
                label={t('detail.cancel')}
                variant="ghost"
                disabled={edit.pending}
                onClick={edit.cancel}
              />
            </>
          ) : (
            <IconButton
              size="row"
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
