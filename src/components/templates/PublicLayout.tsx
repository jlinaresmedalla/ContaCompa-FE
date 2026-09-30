import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'

import { PATHS } from '@/app/router/paths'

import { Button } from '@/components/atoms'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <PublicHeader />
      <main className="mx-auto w-full min-w-0 max-w-[160rem] flex-1 px-shell-fluid pb-9">
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[160rem] flex-wrap items-center justify-between gap-4 px-shell-fluid py-6">
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
