import { useTranslation } from 'react-i18next'
import type { PurchaseDocDetail } from '../types'
import { LineRow } from './LineRow'

const COLUMNS = [
  'detail.fields.quantity',
  'detail.fields.unit',
  'detail.fields.description',
  'prices.unitWithout',
  'prices.unitWith',
  'prices.totalWithout',
  'prices.totalWith',
] as const

export function LinesTable({ doc }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {t(
          doc.prices_include_igv === null
            ? 'prices.printedUnknown'
            : doc.prices_include_igv
              ? 'prices.printedWith'
              : 'prices.printedWithout',
        )}
        {doc.prices_include_igv === null ? null : ` · ${t('prices.legend')}`}
      </p>
      {doc.lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('prices.noLines')}</p>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs">
              <tr>
                <th className="sticky left-0 z-10 border-r border-border bg-muted px-2 py-2">#</th>
                {COLUMNS.map((key) => (
                  <th key={key} className="px-2 py-2 whitespace-nowrap">
                    {t(key)}
                    {(doc.prices_include_igv === true &&
                      (key === 'prices.unitWith' || key === 'prices.totalWith')) ||
                    (doc.prices_include_igv === false &&
                      (key === 'prices.unitWithout' || key === 'prices.totalWithout'))
                      ? ` (${t('prices.printed')})`
                      : ''}
                  </th>
                ))}
                {doc.prices_include_igv === null ? (
                  <>
                    <th className="px-2 py-2">
                      {t('detail.fields.unit_price')} ({t('prices.printed')})
                    </th>
                    <th className="px-2 py-2">
                      {t('detail.fields.line_total')} ({t('prices.printed')})
                    </th>
                  </>
                ) : null}
                <th>
                  <span className="sr-only">{t('detail.editLine', { n: '' })}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((line) => (
                <LineRow key={line.id} doc={doc} line={line} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
