import { useTranslation } from 'react-i18next'

import { PublicMainButton } from '@/components/layout/PublicLayout'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-4xl text-center">
      <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">
        {t('home.headline')} <span className="text-primary">{t('home.headlineAccent')}</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">{t('home.intro')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <PublicMainButton />
        <Button asChild variant="ghost">
          <a href="#architecture">{t('home.seeArchitecture')}</a>
        </Button>
      </div>
    </section>
  )
}
