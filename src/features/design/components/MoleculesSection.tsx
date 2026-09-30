import { useTranslation } from 'react-i18next'
import { PageSkeleton } from '@/components/molecules/PageSkeleton'
import { DesignSection } from './DesignSection'
import { FileText, Plus } from 'lucide-react'
import { Button, Input } from '@/components/atoms'
import {
  Logo,
  IconButton,
  Stat,
  StatRow,
  FilterPills,
  EmptyState,
  Field,
  PageHeader,
  Segmented,
  AppSelect,
  PublicMainButton,
  ErrorNote,
} from '@/components/molecules'
import { useDesignSelect } from './use-design-select'
import { PATHS } from '@/app/router/paths'
import { notifySuccess } from '@/lib/notify'

export function MoleculesSection() {
  const { t } = useTranslation()
  const { selected, setSelected, multiple, setMultiple } = useDesignSelect()
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
      <DesignSection name="IconButton">
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
          <IconButton icon={Plus} size="row" label={t('design.icon')} />
        </div>
      </DesignSection>
      <DesignSection name="Input">
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
        </div>
      </DesignSection>
      <DesignSection name="Select">
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
        </div>
      </DesignSection>
      <DesignSection name="Stat">
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label={t('design.sample')} value="42" sub={t('design.normal')} />
          <Stat label={t('design.sample')} value="0" />
        </div>
      </DesignSection>
      <DesignSection name="StatRow">
        {(['w-full', 'max-w-sm'] as const).map((width) => (
          <div key={width} className={width}>
            <StatRow>
              {(['invoice', 'sales_receipt', 'credit_note'] as const).map((type) => (
                <Stat key={type} label={t(`docType.${type}`)} value="42" />
              ))}
            </StatRow>
          </div>
        ))}
      </DesignSection>
      <DesignSection name="FilterPills">
        {(['w-full', 'max-w-xs'] as const).map((width) => (
          <div key={width} className={width}>
            <FilterPills
              label={t('detail.fields.doc_type')}
              value={selected}
              onChange={setSelected}
              options={(['invoice', 'sales_receipt', 'credit_note'] as const).map((value) => ({
                value,
                label: t(`docType.${value}`),
              }))}
            />
          </div>
        ))}
      </DesignSection>
      <DesignSection name="Segmented">
        <Segmented
          label={t('detail.fields.doc_type')}
          value={selected}
          options={(['invoice', 'sales_receipt'] as const).map((value) => ({
            value,
            label: t(`docType.${value}`),
          }))}
          onChange={setSelected}
        />
      </DesignSection>
      <DesignSection name="EmptyState">
        {empty}
        <EmptyState
          icon={FileText}
          title={t('pageStates.filteredTitle')}
          description={t('design.emptyDescription')}
          action={action}
        />
      </DesignSection>
      <DesignSection name="PageHeader">
        <PageHeader
          title={t('design.sample')}
          description={t('pageStates.documents')}
          actions={action}
        />
      </DesignSection>
      <DesignSection name="PublicMainButton">
        <PublicMainButton destination={PATHS.signIn} />
      </DesignSection>
      <DesignSection name="PageSkeleton">
        <PageSkeleton />
      </DesignSection>
      <DesignSection name="ErrorNote">
        <ErrorNote message={t('design.error')} />
      </DesignSection>
      <DesignSection name="Brand">
        <div className="flex flex-wrap gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Logo key={size} size={size} />
          ))}
        </div>
      </DesignSection>
    </div>
  )
}
