import { useTranslation } from 'react-i18next'
import type { PurchaseDocDetail } from '../types'
import { linePriceColumns } from '../line-price-columns'
import { LineRow } from './LineRow'

const COLUMNS = [
  'detail.fields.quantity',
  'detail.fields.unit',
  'detail.fields.description',
] as const

export function LinesTable({ doc }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  return (
    <div className="min-w-0">
      {doc.lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('prices.noLines')}</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs">
              <tr className="h-table-header">
                {COLUMNS.map((key) => (
                  <th
                    key={key}
                    className={`px-3.5 py-2 whitespace-nowrap ${key === 'detail.fields.quantity' ? 'sticky left-0 z-10 border-r border-border bg-muted text-right' : key.startsWith('prices.') ? 'text-right' : 'text-left'}`}
                  >
                    {t(key)}
                  </th>
                ))}
                {linePriceColumns(doc.prices_include_igv).map(({ heading, includes }) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`px-3.5 py-2 text-right ${doc.prices_include_igv === includes ? 'font-semibold' : 'font-medium text-muted-foreground'}`}
                  >
                    {t(heading)}
                    {doc.prices_include_igv === includes ? ` (${t('prices.printed')})` : ''}
                  </th>
                ))}
                {doc.prices_include_igv === null ? (
                  <>
                    <th className="px-3.5 py-2">
                      {t('detail.fields.unit_price')} ({t('prices.printed')})
                    </th>
                    <th className="px-3.5 py-2">
                      {t('detail.fields.line_total')} ({t('prices.printed')})
                    </th>
                  </>
                ) : null}
                <th className="px-3.5 text-right">{t('documents.columns.actions')}</th>
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
      <p className="border-t border-border px-5.5 py-3.5 text-xs text-muted-foreground">
        {t('detail.derivedPrices')}
      </p>
    </div>
  )
}
