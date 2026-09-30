import { useTranslation } from 'react-i18next'

import { Badge, Card } from '@/components/atoms'

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
        {/* <ArchitectureView /> */}
        <ul
          aria-label={t('home.stackLabel')}
          className="flex flex-wrap"
        >
          {(
            ['fastapi', 'postgres', 'AI', 'react', 'render', 'neon', 'cloudflare'] as const
          ).map((name) => (
            <li key={name}>
              <Badge className="border border-border bg-card">{t(`home.stack.${name}`)}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
