import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { PurchaseDocDetail } from '../types'
import { toForm } from '../utils'

import { INVOICE_FIELDS } from '../invoice-fields'
import type { InvoiceEdit } from '../use-invoice-edit'
import { observationLabel } from '../observations'
import { InvoiceEditField } from './InvoiceEditField'

export function InvoiceCard({
  doc,
  previewVisible,
  edit,
}: {
  doc: PurchaseDocDetail
  previewVisible: boolean
  edit: InvoiceEdit
}) {
  const { t } = useTranslation()
  const values = edit.values ?? toForm(doc)
  return (
    <Card className={!edit.editing ? 'max-md:px-4.5 max-md:py-1' : undefined}>
      <dl
        className={cn(
          'grid grid-cols-1 gap-x-7 gap-y-4.5 md:grid-cols-2 [&>*]:min-w-0',
          !edit.editing && 'max-md:gap-y-0',
          edit.editing
            ? previewVisible
              ? 'lg:grid-cols-3'
              : 'lg:grid-cols-4'
            : 'md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]',
        )}
      >
        {INVOICE_FIELDS.map((name) => (
          <div
            key={name}
            className={cn(
              edit.editing && name === 'supplier_name' && 'md:col-span-2',
              !edit.editing &&
                'max-md:flex max-md:items-start max-md:justify-between max-md:gap-3.5 max-md:border-b max-md:border-border max-md:py-3 max-md:last:border-0',
            )}
          >
            {edit.editing ? (
              <InvoiceEditField name={name} edit={edit} />
            ) : (
              <>
                <dt className="text-xs text-muted-foreground max-md:shrink-0 max-md:max-w-[45%]">
                  {t(name === 'issue_date' ? 'detail.issueDate' : `detail.fields.${name}`)}
                </dt>
                <dd
                  className={cn(
                    'mt-1 flex items-center gap-1.5 text-sm font-medium break-words max-md:mt-0 max-md:min-h-0 max-md:min-w-0 max-md:justify-end max-md:text-right max-md:[overflow-wrap:anywhere]',
                    name === 'total_amount' && 'font-semibold tabular-nums',
                  )}
                >
                  {name === 'prices_include_igv' && doc.prices_include_igv !== null ? (
                    doc.prices_include_igv ? (
                      <Check aria-hidden="true" className="size-4 shrink-0 text-success" />
                    ) : (
                      <X aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    )
                  ) : null}
                  {name === 'doc_type'
                    ? t(`docType.${values[name]}`)
                    : name === 'prices_include_igv'
                      ? t(`detail.igv.${values[name]}`)
                      : values[name] || t('detail.missingValue')}
                </dd>
              </>
            )}
          </div>
        ))}
      </dl>
      <section
        aria-label={t('detail.observations')}
        className="mt-4 border-t border-border pt-3 text-sm"
      >
        {doc.issues.length ? (
          <ul className="space-y-2">
            {doc.issues.map((issue, index) => (
              <li key={index}>
                <span className="font-medium">{observationLabel(t, issue.code)}</span>
                {issue.line_number ? ` (${t('detail.line', { n: issue.line_number })})` : ''}:{' '}
                {issue.detail}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t('report.clean')}</p>
        )}
      </section>
    </Card>
  )
}
