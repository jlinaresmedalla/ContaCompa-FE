import { useTranslation } from 'react-i18next'

import { Badge, Table } from '@/components/atoms'
import { number } from '@/lib/format'
import { formatPrintedPrice, formatDerivedPrice, formatTotal } from '@/lib/money-format'

import type { PurchaseDocSummary } from '../types'

const CELL = 'px-2 py-1.5 text-right tabular-nums whitespace-nowrap'

/** A purchase doc's lines with both prices. The printed column is marked; the other is
 * derived (÷ or × 1.18). Without an IGV flag nothing can be derived. */
export function LinePrices({ doc }: { doc: PurchaseDocSummary }) {
  const { t } = useTranslation()
  const printedWith = doc.prices_include_igv === true
  const printedWithout = doc.prices_include_igv === false
  const mark = (printed: boolean) =>
    printed ? 'font-semibold text-foreground' : 'text-muted-foreground'
  if (doc.lines.length === 0)
    return <p className="text-sm text-muted-foreground">{t('prices.noLines')}</p>
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge tone={doc.prices_include_igv === null ? 'warning' : 'info'}>
          {doc.prices_include_igv === null
            ? t('prices.printedUnknown')
            : doc.prices_include_igv
              ? t('prices.printedWith')
              : t('prices.printedWithout')}
        </Badge>
        <span>{t('prices.legend')}</span>
      </div>
      <Table className="w-full text-sm">
        <thead className="bg-muted text-xs text-muted-foreground">
          <tr>
            <th className="sticky left-0 z-10 border-r border-border bg-muted px-2 py-1.5 text-left font-semibold">
              #
            </th>
            <th data-column="text" className="px-2 py-1.5 text-left font-semibold">
              {t('detail.fields.description')}
            </th>
            <th className={`${CELL} font-semibold`}>{t('detail.fields.quantity')}</th>
            <th className="px-2 py-1.5 text-left font-semibold">{t('detail.fields.unit')}</th>
            <th className={`${CELL} font-semibold`}>{t('prices.unitWithout')}</th>
            <th className={`${CELL} font-semibold`}>{t('prices.unitWith')}</th>
            <th className={`${CELL} font-semibold`}>{t('prices.totalWithout')}</th>
            <th className={`${CELL} font-semibold`}>{t('prices.totalWith')}</th>
          </tr>
        </thead>
        <tbody>
          {doc.lines.map((line) => (
            <tr key={line.id} className="border-t border-border">
              <td className="sticky left-0 z-10 border-r border-border bg-card px-2 py-1.5 text-muted-foreground">
                {line.line_number}
              </td>
              <td data-column="text" className="px-2 py-1.5">
                {line.description ?? '—'}
              </td>
              <td className={CELL}>{number(line.quantity)}</td>
              <td className="px-2 py-1.5">{line.unit}</td>
              <td className={`${CELL} ${mark(printedWithout)}`}>
                {(printedWithout || doc.prices_include_igv === null
                  ? formatPrintedPrice
                  : formatDerivedPrice)(
                  line.unit_price_without_igv ?? (printedWith ? null : line.unit_price),
                  doc.currency ?? 'PEN',
                )}
              </td>
              <td className={`${CELL} ${mark(printedWith)}`}>
                {(printedWith ? formatPrintedPrice : formatDerivedPrice)(
                  line.unit_price_with_igv ?? (printedWith ? line.unit_price : null),
                  doc.currency ?? 'PEN',
                )}
              </td>
              <td className={`${CELL} ${mark(printedWithout)}`}>
                {formatTotal(
                  line.line_total_without_igv ?? (printedWith ? null : line.line_total),
                  doc.currency ?? 'PEN',
                )}
              </td>
              <td className={`${CELL} ${mark(printedWith)}`}>
                {formatTotal(
                  line.line_total_with_igv ?? (printedWith ? line.line_total : null),
                  doc.currency ?? 'PEN',
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-border text-sm font-semibold">
          <tr>
            <td colSpan={6} className="px-2 py-1.5 text-right text-muted-foreground">
              {t('prices.docTotals')}
            </td>
            <td className={CELL}>{formatTotal(doc.taxable_amount, doc.currency ?? 'PEN')}</td>
            <td className={CELL}>{formatTotal(doc.total_amount, doc.currency ?? 'PEN')}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
