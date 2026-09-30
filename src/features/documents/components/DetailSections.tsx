import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TableSectionLabel } from '@/components/molecules'
import type { PurchaseDocDetail } from '../types/purchaseDocs'
import { LinesTable } from './LinesTable'
import { CorrectionHistory } from './CorrectionHistory'

export function DetailSections({ doc }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  return (
    <>
      <section className="min-w-0 space-y-2" aria-label={t('detail.items')}>
        <TableSectionLabel
          label={t('detail.items')}
          count={doc.lines.length}
          info={t('detail.derivedPrices')}
        />
        <LinesTable doc={doc} />
      </section>
      <div className="min-w-0">
        <details className="group">
          <summary className="flex list-none items-center gap-2 [&::-webkit-details-marker]:hidden cursor-pointer rounded-control text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronRight aria-hidden="true" className="size-4 group-open:rotate-90" />
            {t('detail.history')}
          </summary>
          <CorrectionHistory doc={doc} />
        </details>
      </div>
    </>
  )
}
