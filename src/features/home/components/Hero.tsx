import { useTranslation } from 'react-i18next'

import { PublicMainButton } from '@/components/molecules'
import { Backdrop, Button } from '@/components/atoms'

import { useAppDestination } from '@/components/templates'

export function Hero() {
  const destination = useAppDestination()
  const { t } = useTranslation()
  return (
    <section className="relative isolate flex flex-col items-start gap-[1.125rem] pt-[2.875rem] md:min-h-[24.25rem] md:items-center md:justify-center md:gap-[1.375rem] md:py-9 md:text-center">
      <Backdrop />
      <h1 className="max-w-[54.25rem] text-[2.25rem] leading-[2.875rem] font-semibold tracking-tight md:text-[3.375rem] md:leading-[4rem]">
        {t('home.headline')} <span className="text-primary">{t('home.headlineAccent')}</span>
      </h1>
      <p className="max-w-[48.625rem] text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
        {t('home.intro')}
      </p>
      <div className="flex w-full flex-col gap-3.5 md:w-auto md:flex-row">
        <PublicMainButton destination={destination} />
        <Button asChild variant="outline">
          <a href="#architecture">{t('home.seeArchitecture')}</a>
        </Button>
      </div>
    </section>
  )
}
