import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'
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
      className="min-w-0 scroll-mt-40"
    >
      <h2 id="architecture-title" className="text-4xl font-semibold tracking-tight">
        {t('home.architecture')}
      </h2>
      <p className="mt-3 text-muted-foreground">{t('home.architectureIntro')}</p>
      <Card className="mt-6 min-w-0 overflow-hidden">
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
