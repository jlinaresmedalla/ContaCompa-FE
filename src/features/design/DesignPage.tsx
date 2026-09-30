import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/ui/page-header'

import { ComponentSections } from './components/ComponentSections'
import { TokenSections } from './components/TokenSections'

export function DesignPage() {
  const { t } = useTranslation()
  return (
    <div className="min-w-0 space-y-12 py-10">
      <PageHeader title={t('design.title')} description={t('design.description')} />
      <TokenSections />
      <ComponentSections />
    </div>
  )
}
