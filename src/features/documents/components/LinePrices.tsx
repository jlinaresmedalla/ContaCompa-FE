import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { number } from '@/lib/format'

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
      <div className="max-w-full min-w-0 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs text-muted-foreground">
            <tr>
              <th className="sticky left-0 z-10 border-r border-border bg-muted px-2 py-1.5 text-left font-semibold">
                #
              </th>
              <th className="px-2 py-1.5 text-left font-semibold">
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
                <td className="px-2 py-1.5">{line.description ?? '—'}</td>
                <td className={CELL}>{number(line.quantity)}</td>
                <td className="px-2 py-1.5">{line.unit}</td>
                <td className={`${CELL} ${mark(printedWithout)}`}>
                  {number(line.unit_price_without_igv ?? (printedWith ? null : line.unit_price))}
                </td>
                <td className={`${CELL} ${mark(printedWith)}`}>
                  {number(line.unit_price_with_igv)}
                </td>
                <td className={`${CELL} ${mark(printedWithout)}`}>
                  {number(line.line_total_without_igv ?? (printedWith ? null : line.line_total))}
                </td>
                <td className={`${CELL} ${mark(printedWith)}`}>
                  {number(line.line_total_with_igv)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-border text-sm font-semibold">
            <tr>
              <td colSpan={6} className="px-2 py-1.5 text-right text-muted-foreground">
                {t('prices.docTotals')}
              </td>
              <td className={CELL}>{number(doc.taxable_amount)}</td>
              <td className={CELL}>{number(doc.total_amount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
