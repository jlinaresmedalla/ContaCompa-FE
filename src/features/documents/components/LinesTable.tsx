import { Table } from '@/components/atoms'
import { useTranslation } from 'react-i18next'
import type { PurchaseDocDetail } from '../types'
import { linePriceColumns } from '../line-price-columns'
import { LineRow } from './LineRow'
import { LineColumnHeading } from './LineColumnHeading'

const COLUMNS = [
  { key: 'detail.fields.quantity', short: 'prices.short.quantity' },
  { key: 'detail.fields.unit', short: 'prices.short.unit' },
  { key: 'detail.fields.description', short: 'prices.short.description' },
] as const

export function LinesTable({ doc }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  return (
    <div className="min-w-0">
      {doc.lines.length === 0 ? (
        <p className="px-card pb-card text-sm text-muted-foreground">{t('prices.noLines')}</p>
      ) : (
        <>
          <Table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs">
              <tr className="h-table-header-compact">
                {COLUMNS.map(({ key, short }) => (
                  <th
                    key={key}
                    scope="col"
                    data-column={key === 'detail.fields.description' ? 'text' : undefined}
                    aria-label={t(key)}
                    className={`px-3 py-1.5 whitespace-normal ${key === 'detail.fields.quantity' ? 'sticky left-0 z-10 border-r border-border bg-muted text-right' : key.startsWith('prices.') ? 'text-right' : 'text-left'}`}
                  >
                    <LineColumnHeading label={t(short)} fullName={t(key)} />
                  </th>
                ))}
                {linePriceColumns(doc.prices_include_igv).map(({ heading, short, includes }) => (
                  <th
                    key={heading}
                    scope="col"
                    aria-label={`${t(heading)}${doc.prices_include_igv === includes ? ` (${t('prices.printed')})` : ''}`}
                    className={`px-3 py-1.5 text-right ${doc.prices_include_igv === includes ? 'font-semibold' : 'font-medium text-muted-foreground'}`}
                  >
                    <LineColumnHeading
                      label={t(short)}
                      fullName={`${t(heading)}${doc.prices_include_igv === includes ? ` (${t('prices.printed')})` : ''}`}
                    />
                  </th>
                ))}
                {doc.prices_include_igv === null ? (
                  <>
                    <th
                      className="text-right"
                      aria-label={`${t('detail.fields.unit_price')} (${t('prices.printed')})`}
                    >
                      <LineColumnHeading
                        label={t('detail.fields.unit_price')}
                        fullName={`${t('detail.fields.unit_price')} (${t('prices.printed')})`}
                      />
                    </th>
                    <th
                      className="text-right"
                      aria-label={`${t('detail.fields.line_total')} (${t('prices.printed')})`}
                    >
                      <LineColumnHeading
                        label={t('detail.fields.line_total')}
                        fullName={`${t('detail.fields.line_total')} (${t('prices.printed')})`}
                      />
                    </th>
                  </>
                ) : null}
                <th className="px-3 text-center">{t('documents.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((line) => (
                <LineRow key={line.id} doc={doc} line={line} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  )
}
