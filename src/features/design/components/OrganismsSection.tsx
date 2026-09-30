import { useTranslation } from 'react-i18next'
import { DesignSection } from './DesignSection'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { Button } from '@/components/atoms'
import { EmptyState } from '@/components/molecules'
import { DataTable, Toaster } from '@/components/organisms'
import { SidebarSection } from './SidebarSection'
import { OrganismExtras } from './OrganismExtras'
import { notifySuccess, notifyError } from '@/lib/notify'

export function OrganismsSection() {
  const { t } = useTranslation()
  const columns: ColumnDef<{ number: string; type: string; total: string }>[] = [
    { accessorKey: 'number', header: t('documents.columns.number') },
    { accessorKey: 'type', header: t('documents.columns.type') },
    { accessorKey: 'total', header: t('documents.columns.total') },
  ]
  const rows = [
    { number: 'F001-0042', type: t('docType.invoice'), total: 'PEN 118.00' },
    { number: 'B001-0017', type: t('docType.sales_receipt'), total: 'PEN 59.00' },
  ]
  const action = (
    <Button onClick={() => notifySuccess(t('design.successMessage'))}>{t('design.action')}</Button>
  )
  const empty = (
    <EmptyState
      icon={FileText}
      title={t('design.empty')}
      description={t('design.emptyDescription')}
      action={action}
    />
  )
  return (
    <div className="space-y-10">
      <DesignSection name="DataTable">
        <div className="min-w-0 space-y-6">
          <DataTable columns={columns} data={rows} isLoading={false} empty={empty} />
          <h3 className="text-sm font-medium">{t('design.loading')}</h3>
          <DataTable columns={columns} data={undefined} isLoading empty={empty} />
          <h3 className="text-sm font-medium">{t('design.emptyState')}</h3>
          <DataTable columns={columns} data={[]} isLoading={false} empty={empty} />
        </div>
      </DesignSection>
      <DesignSection name="Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="success" onClick={() => notifySuccess(t('design.successMessage'))}>
            {t('design.successToast')}
          </Button>
          <Button variant="danger" onClick={() => notifyError(t('design.errorMessage'))}>
            {t('design.errorToast')}
          </Button>
        </div>
      </DesignSection>
      <SidebarSection />
      <OrganismExtras />
      <Toaster />
    </div>
  )
}
