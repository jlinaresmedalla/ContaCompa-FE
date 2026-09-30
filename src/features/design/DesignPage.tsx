import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/molecules'
import { PageSkeleton } from '@/components/molecules/PageSkeleton'
import { lazyPage } from '@/lib/lazyPage'

const TokenSections = lazyPage<object>(
  () => import('./components/TokenSections').then((module) => ({ default: module.TokenSections })),
  <PageSkeleton />,
)
const AtomsSection = lazyPage<object>(
  () => import('./components/AtomsSection').then((module) => ({ default: module.AtomsSection })),
  <PageSkeleton />,
)
const MoleculesSection = lazyPage<object>(
  () =>
    import('./components/MoleculesSection').then((module) => ({
      default: module.MoleculesSection,
    })),
  <PageSkeleton />,
)
const OrganismsSection = lazyPage<object>(
  () =>
    import('./components/OrganismsSection').then((module) => ({
      default: module.OrganismsSection,
    })),
  <PageSkeleton />,
)
const TemplatesSection = lazyPage<object>(
  () =>
    import('./components/TemplatesSection').then((module) => ({
      default: module.TemplatesSection,
    })),
  <PageSkeleton />,
)
const LEVELS = [
  { name: 'atoms', Gallery: AtomsSection },
  { name: 'molecules', Gallery: MoleculesSection },
  { name: 'organisms', Gallery: OrganismsSection },
  { name: 'templates', Gallery: TemplatesSection },
] as const

export function DesignPage() {
  const { t } = useTranslation()
  return (
    <div className="min-w-0 space-y-12 py-10">
      <PageHeader title={t('design.title')} description={t('design.description')} />
      <TokenSections />
      {LEVELS.map(({ name, Gallery }) => (
        <section key={name} aria-labelledby={`design-${name}`} className="min-w-0 space-y-6">
          <h2 id={`design-${name}`} className="text-xl font-semibold">
            {t(`design.levels.${name}`)}
          </h2>
          <Gallery />
        </section>
      ))}
    </div>
  )
}
