import { useTranslation } from 'react-i18next'
import { Card, Skeleton } from '@/components/atoms'
import { TableSectionLabel } from '@/components/molecules'
import { DataTable, PreferenceSwitches } from '@/components/organisms'
import { DeleteDocAction } from '@/features/documents/components/DeleteDocAction'
import { InvoiceCard } from '@/features/documents/components/InvoiceCard'
import type { PurchaseDocDetail } from '@/features/documents/types/purchaseDocs'
import { DesignSection } from './DesignSection'
import { useDesignEdit } from '../hooks/useDesignEdit'
import { useDesignSheet } from '../hooks/useDesignSheet'

const SAMPLE_DOC: PurchaseDocDetail = {
  id: 'design-only',
  supplier: { ruc: '20543306771', legal_name: 'Contacompa' },
  doc_type: 'invoice',
  doc_number: 'F001-0042',
  issue_date: '2026-09-30',
  currency: 'PEN',
  total_amount: '118.00',
  prices_include_igv: true,
  taxable_amount: '100.00',
  igv_amount: '18.00',
  buyer_ruc: null,
  has_warnings: false,
  issues: [],
  lines: [],
  corrections: [],
  documents: [],
  created_at: '2026-09-30T00:00:00Z',
  exported_at: null,
}
const WIDTHS = ['w-full', 'w-full max-w-xs'] as const

function ActionSample() {
  const { open, setOpen } = useDesignSheet()
  return (
    <DeleteDocAction
      open={open}
      onOpenChange={setOpen}
      confirm={() => setOpen(false)}
      name={SAMPLE_DOC.doc_number!}
      disabled={false}
    />
  )
}

export function ResponsivePatterns() {
  const { t } = useTranslation()
  const edit = useDesignEdit()
  const columns = [
    { accessorKey: 'number', header: t('documents.columns.number') },
    { accessorKey: 'total', header: t('documents.columns.total') },
  ]
  const rows = [{ number: SAMPLE_DOC.doc_number, total: 'PEN 118.00' }]
  return (
    <>
      <DesignSection name="MoreActions">
        <p className="mb-4 text-sm text-muted-foreground">{t('design.featurePatterns')}</p>
        {WIDTHS.map((width) => (
          <div key={width} className={`${width} mb-4 flex gap-3`}>
            <ActionSample />
            <DeleteDocAction
              open={false}
              onOpenChange={() => {}}
              confirm={() => {}}
              name={SAMPLE_DOC.doc_number!}
              disabled
            />
          </div>
        ))}
      </DesignSection>
      <DesignSection name="ModeMenus">
        {WIDTHS.map((width) => (
          <div key={width} className={`${width} mb-4`}>
            <PreferenceSwitches />
          </div>
        ))}
      </DesignSection>
      <DesignSection name="PreviewColumn" framed={false}>
        <p className="mb-4 text-sm text-muted-foreground">{t('design.previewSample')}</p>
        {WIDTHS.map((width) => (
          <div key={width} className={`${width} mb-6 min-w-0 space-y-4 @container`}>
            {([false, true] as const).map((shown) => (
              <div
                key={String(shown)}
                className={
                  shown ? 'grid gap-4 @[48rem]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''
                }
              >
                <div className="min-w-0 space-y-4">
                  <InvoiceCard
                    doc={{
                      ...SAMPLE_DOC,
                      issues: shown
                        ? [
                            {
                              code: 'amount_mismatch',
                              severity: 'warning',
                              detail: t('design.observationSample'),
                              field: null,
                              line_number: null,
                            },
                          ]
                        : [],
                    }}
                    previewVisible={shown}
                    edit={{ ...edit, editing: false, values: null }}
                  />
                  <section className="min-w-0 space-y-2">
                    <TableSectionLabel
                      label={t('detail.items')}
                      count={rows.length}
                      info={t('detail.derivedPrices')}
                    />
                    <DataTable columns={columns} data={rows} isLoading={false} empty={null} />
                  </section>
                </div>
                {shown ? (
                  <Card className="min-w-0 self-start @[48rem]:sticky @[48rem]:top-6">
                    <h4 className="mb-3 font-semibold">{t('detail.original')}</h4>
                    <Skeleton className="h-48 w-full" />
                    <p className="mt-3 text-sm text-muted-foreground">{t('design.loading')}</p>
                  </Card>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </DesignSection>
    </>
  )
}
