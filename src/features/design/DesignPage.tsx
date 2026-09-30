import { useTranslation } from 'react-i18next'

import { Toaster } from '@/components/ui/sonner'
import { PageHeader } from '@/components/ui/page-header'

import { PageSkeleton } from '@/components/loading/PageSkeleton'
import { lazyPage } from '@/lib/lazyPage'

const TokenSections = lazyPage<object>(
  () => import('./components/TokenSections').then((module) => ({ default: module.TokenSections })),
  <PageSkeleton />,
)
const ComponentSections = lazyPage<object>(
  () =>
    import('./components/ComponentSections').then((module) => ({
      default: module.ComponentSections,
    })),
  <PageSkeleton />,
)

export function DesignPage() {
  const { t } = useTranslation()
  return (
    <div className="min-w-0 space-y-12 py-10">
      <PageHeader title={t('design.title')} description={t('design.description')} />
      <TokenSections />
      <ComponentSections />
      <Toaster />
    </div>
  )
}
