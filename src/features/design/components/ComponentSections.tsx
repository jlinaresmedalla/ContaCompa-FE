import { SidebarSection } from './SidebarSection'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useDesignSelect } from './use-design-select'
import { useTranslation } from 'react-i18next'

import type { Messages } from '@/app/i18n/en'
import { Logo, LogoMark } from '@/components/brand'
import { Backdrop } from '@/components/ui/backdrop'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Card, Stat } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Field, Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { Segmented } from '@/components/ui/segmented'
import { AppSelect } from '@/components/ui/app-select'
import { Skeleton } from '@/components/ui/skeleton'
import { notifyError, notifySuccess } from '@/lib/notify'

const SHORT_SKELETON_WIDTH = 16
const MEDIUM_SKELETON_WIDTH = 32
const LONG_SKELETON_WIDTH = 48

export function ComponentSections() {
  const { t } = useTranslation()
  const { selected, setSelected, multiple, setMultiple } = useDesignSelect()
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
  function section(name: keyof Messages['design']['sections'], children: ReactNode) {
    return (
      <section className="min-w-0 space-y-4">
        <h2 className="text-xl font-semibold">{t(`design.sections.${name}`)}</h2>
        <div className="min-w-0 rounded-2xl border border-border bg-card p-4">{children}</div>
      </section>
    )
  }
  return (
    <div className="space-y-10">
      <SidebarSection />
      {section(
        'Backdrop',
        <div className="relative isolate rounded-2xl p-8">
          <Backdrop />
          <Card className="material mx-auto max-w-sm">
            <p className="font-semibold">{t('design.sample')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('design.description')}</p>
          </Card>
        </div>,
      )}
      {section(
        'Button',
        <div className="space-y-4">
          {(['primary', 'outline', 'ghost', 'danger', 'success'] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              {(['sm', 'md', 'icon'] as const).map((size) => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  aria-label={
                    size === 'icon' ? `${t(`design.${variant}`)} · ${t('design.icon')}` : undefined
                  }
                >
                  {size === 'icon' ? (
                    <Plus aria-hidden="true" className="size-4" />
                  ) : (
                    `${t(`design.${variant}`)} · ${t(`design.${size}`)}`
                  )}
                </Button>
              ))}
              <Button variant={variant} disabled>
                {t('design.disabled')}
              </Button>
            </div>
          ))}
        </div>,
      )}
      {section(
        'IconButton',
        <div className="flex flex-wrap gap-3">
          {(['primary', 'outline', 'ghost', 'danger', 'success'] as const).map((variant) => (
            <IconButton
              key={variant}
              icon={Plus}
              variant={variant}
              label={`${t(`design.${variant}`)} · ${t('design.icon')}`}
            />
          ))}
          <IconButton icon={Plus} label={t('design.disabled')} disabled />
        </div>,
      )}
      {section(
        'Input',
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('design.normal')}>
            <Input placeholder={t('detail.fields.supplier_ruc')} />
          </Field>
          <Field label={t('detail.fields.supplier_ruc')} error={t('design.error')}>
            <Input aria-invalid="true" aria-describedby="design-ruc-error" defaultValue="123" />
            <span id="design-ruc-error" className="sr-only">
              {t('design.error')}
            </span>
          </Field>
          <Field label={t('design.disabled')}>
            <Input disabled />
          </Field>
        </div>,
      )}
      {section(
        'Select',
        <div className="max-w-sm space-y-3">
          <AppSelect
            label={t('detail.fields.doc_type')}
            value={selected}
            onChange={setSelected}
            options={(['invoice', 'sales_receipt', 'credit_note'] as const).map((value) => ({
              value,
              label: t(`docType.${value}`),
            }))}
          />
          <AppSelect
            label={t('design.disabled')}
            value={null}
            onChange={setSelected}
            options={[]}
            disabled
          />
          <AppSelect
            label={t('design.error')}
            value={selected}
            onChange={setSelected}
            options={[{ value: 'invoice', label: t('docType.invoice') }]}
            error={t('design.error')}
          />
          <AppSelect
            multiple
            searchable
            label={t('design.normal')}
            value={multiple}
            onChange={setMultiple}
            options={(['invoice', 'sales_receipt', 'credit_note'] as const).map((value) => ({
              value,
              label: t(`docType.${value}`),
            }))}
          />
        </div>,
      )}
      {section(
        'Badge',
        <div className="flex flex-wrap gap-3">
          {(['neutral', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
            <Badge key={tone} tone={tone}>
              {t(`design.${tone}`)}
            </Badge>
          ))}
        </div>,
      )}
      {section(
        'Card',
        <Card>
          <p className="font-semibold">{t('design.sample')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('design.description')}</p>
        </Card>,
      )}
      {section('Stat', <Stat label={t('design.sample')} value="42" sub={t('design.normal')} />)}
      {section(
        'Segmented',
        <Segmented
          label={t('detail.fields.doc_type')}
          value={selected}
          options={(['invoice', 'sales_receipt'] as const).map((value) => ({
            value,
            label: t(`docType.${value}`),
          }))}
          onChange={setSelected}
        />,
      )}
      {section(
        'DataTable',
        <div className="min-w-0 space-y-6">
          <DataTable columns={columns} data={rows} isLoading={false} empty={empty} />
          <h3 className="text-sm font-medium">{t('design.loading')}</h3>
          <DataTable columns={columns} data={undefined} isLoading empty={empty} />
          <h3 className="text-sm font-medium">{t('design.emptyState')}</h3>
          <DataTable columns={columns} data={[]} isLoading={false} empty={empty} />
        </div>,
      )}
      {section(
        'Skeleton',
        <div className="space-y-3" role="status" aria-label={t('design.loading')}>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>,
      )}
      {section('EmptyState', empty)}
      {section(
        'Toast',
        <div className="flex flex-wrap gap-3">
          <Button variant="success" onClick={() => notifySuccess(t('design.successMessage'))}>
            {t('design.successToast')}
          </Button>
          <Button variant="danger" onClick={() => notifyError(t('design.errorMessage'))}>
            {t('design.errorToast')}
          </Button>
        </div>,
      )}
      {section(
        'PageHeader',
        <PageHeader
          title={t('design.sample')}
          description={t('pageStates.documents')}
          actions={action}
        />,
      )}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('design.brand')}</h2>
        {(['sm', 'md', 'lg'] as const).map((size, index) => (
          <div
            key={size}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <Logo size={size} />
            <LogoMark
              className={
                ['size-4 text-primary', 'size-8 text-primary', 'size-12 text-primary'][index]
              }
            />
            <span className="text-xs text-muted-foreground">
              {[SHORT_SKELETON_WIDTH, MEDIUM_SKELETON_WIDTH, LONG_SKELETON_WIDTH][index]} px
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
