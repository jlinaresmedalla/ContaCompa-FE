import { Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'

import { PATHS } from '@/app/router/paths'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { useAppDestination } from './use-app-destination'

import { PreferenceSwitches } from './PreferenceSwitches'

export function PublicMainButton() {
  const { t } = useTranslation()
  const destination = useAppDestination()
  return (
    <Button asChild>
      <Link to={destination}>{t('publicLayout.goToApp')}</Link>
    </Button>
  )
}

export function PublicLayout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <header className="material sticky top-0 z-20 border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Button asChild variant="ghost" className="px-0">
            <Link to={PATHS.home} aria-label={t('publicLayout.home')}>
              <Logo />
            </Link>
          </Button>
          <p className="hidden text-sm text-muted-foreground xl:block">{t('publicLayout.pitch')}</p>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <a
                href="https://github.com/jlinaresmedalla/ContaCompa-FE"
                target="_blank"
                rel="noreferrer"
                aria-label={t('publicLayout.viewCode')}
              >
                <Code2 className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('publicLayout.viewCode')}</span>
              </a>
            </Button>
            <PublicMainButton />
          </div>
          <div className="flex min-w-0 basis-full flex-wrap justify-end gap-2 lg:basis-auto">
            <PreferenceSwitches />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-12 sm:py-20">
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6">
          <p className="text-sm text-muted-foreground">{t('publicLayout.credit')}</p>
          <nav aria-label={t('publicLayout.footer')} className="flex flex-wrap gap-1">
            <Button asChild variant="ghost">
              <a href="https://github.com/jlinaresmedalla/ContaCompa">
                {t('publicLayout.apiRepo')}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="https://github.com/jlinaresmedalla/ContaCompa-FE">
                {t('publicLayout.dashboardRepo')}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="https://www.linkedin.com/in/alvarolinaresmedalla">
                {t('publicLayout.linkedin')}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link to={PATHS.design}>{t('publicLayout.design')}</Link>
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  )
}
