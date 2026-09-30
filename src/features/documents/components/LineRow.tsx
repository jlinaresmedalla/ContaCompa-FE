import { Pencil, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { number } from '@/lib/format'
import { useLineCorrections } from '../use-line-corrections'
import type { ValidationKey } from '../schemas/correction'
import type { Line, PurchaseDocDetail } from '../types'

const PRICE_COLUMNS = [
  { field: 'unit_price', derived: 'unit_price_without_igv', includes: false },
  { field: 'unit_price', derived: 'unit_price_with_igv', includes: true },
  { field: 'line_total', derived: 'line_total_without_igv', includes: false },
  { field: 'line_total', derived: 'line_total_with_igv', includes: true },
] as const
const TEXT_FIELDS = ['quantity', 'unit', 'description'] as const
const CELL = 'px-2 py-2 text-right tabular-nums'

export function LineRow({ doc, line }: { doc: PurchaseDocDetail; line: Line }) {
  const { t } = useTranslation()
  const edit = useLineCorrections(doc, line)
  const label = t('detail.line', { n: line.line_number })
  const input = (field: (typeof TEXT_FIELDS)[number] | 'unit_price' | 'line_total') => (
    <div className="min-w-28">
      <Input
        aria-label={`${label} ${t(`detail.fields.${field}`)}`}
        aria-invalid={Boolean(edit.errors[field])}
        disabled={edit.pending}
        {...edit.register(field)}
      />
      {edit.errors[field] ? (
        <span role="alert" className="text-xs text-destructive">
          {t(edit.errors[field]?.message as ValidationKey)}
        </span>
      ) : null}
    </div>
  )
  return (
    <tr className="border-t border-border">
      <td className="sticky left-0 z-10 border-r border-border bg-card px-2 py-2">
        {line.line_number}
      </td>
      {TEXT_FIELDS.map((field) => (
        <td key={field} className="px-2 py-2">
          {edit.editing
            ? input(field)
            : field === 'quantity'
              ? number(line[field])
              : (line[field] ?? '—')}
        </td>
      ))}
      {PRICE_COLUMNS.map(({ field, derived, includes }) => {
        const printed = doc.prices_include_igv === includes
        return (
          <td
            key={derived}
            className={`${CELL} ${printed ? 'font-semibold' : 'text-muted-foreground'}`}
          >
            {edit.editing && printed
              ? input(field)
              : number(
                  printed ? line[field] : doc.prices_include_igv === null ? null : line[derived],
                )}
          </td>
        )
      })}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {edit.editing ? input('unit_price') : number(line.unit_price)}
        </td>
      ) : null}
      {doc.prices_include_igv === null ? (
        <td className={`${CELL} font-semibold`}>
          {edit.editing ? input('line_total') : number(line.line_total)}
        </td>
      ) : null}
      <td className="px-2 py-2">
        <div className="flex gap-1">
          {edit.editing ? (
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
              onClick={edit.start}
            />
          )}
        </div>
      </td>
    </tr>
  )
}
