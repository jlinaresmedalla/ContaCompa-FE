import { useTranslation } from 'react-i18next'

import { Badge, Card, Skeleton } from '@/components/atoms'

import { lazyPage } from '@/lib/lazyPage'

const ArchitectureView = lazyPage<object>(
  () => import('./ArchitectureView').then((module) => ({ default: module.ArchitectureView })),
  <Skeleton className="h-96 w-full" />,
)

export function Architecture() {
  const { t } = useTranslation()
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="min-w-0 scroll-mt-20 md:mt-[3.375rem]"
    >
      <h2
        id="architecture-title"
        className="text-2xl leading-8 md:text-[1.75rem] md:leading-9 font-semibold tracking-tight"
      >
        {t('home.architecture')}
      </h2>
      <p className="mt-1 text-muted-foreground">{t('home.architectureIntro')}</p>
      <Card className="mt-[1.125rem] md:mt-[1.375rem] min-w-0 overflow-hidden">
        <ArchitectureView />
      </Card>
      <ul aria-label={t('home.stackLabel')} className="mt-4 flex flex-wrap gap-2">
        {(['fastapi', 'postgres', 'gemini', 'react', 'render', 'neon', 'cloudflare'] as const).map(
          (name) => (
            <li key={name}>
              <Badge>{t(`home.stack.${name}`)}</Badge>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}
