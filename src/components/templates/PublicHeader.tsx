import { Code2, Globe, Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { Button } from '@/components/atoms'
import { Logo, PublicMainButton } from '@/components/molecules'
import { PreferenceSwitches } from '@/components/organisms'
import { lazyPage } from '@/lib/lazyPage'
import { usePhoneWidth } from '@/lib/use-phone-width'
import { useAppDestination } from './use-app-destination'

function PhonePreferencesFallback() {
  return (
    <div
      className="flex gap-1 md:hidden"
      aria-hidden="true"
      data-testid="phone-preferences-fallback"
    >
      {[Globe, Monitor].map((Icon, index) => (
        <span
          key={index}
          className="flex size-[3.25rem] items-center justify-center rounded-control border border-border bg-background text-muted-foreground"
        >
          <Icon className="size-4" />
        </span>
      ))}
    </div>
  )
}

const PHONE_PREFERENCES = lazyPage<object>(
  () =>
    import('@/components/organisms/PublicPhonePreferences').then((module) => ({
      default: module.PublicPhonePreferences,
    })),
  <PhonePreferencesFallback />,
)

export function PublicHeader({ signIn = false }: { signIn?: boolean }) {
  const { t } = useTranslation()
  const destination = useAppDestination()
  const phone = usePhoneWidth()
  return (
    <header className={signIn ? 'relative' : 'material sticky top-0 z-20 border-b border-border'}>
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-[1.125rem] md:min-h-[4.625rem] md:px-9">
        <div className="flex min-w-0 items-center gap-[1.125rem]">
          <Button asChild variant="ghost" className="px-0">
            <Link to={PATHS.home} aria-label={t('publicLayout.home')}>
              <Logo className="[&>svg]:size-7 [&>span]:text-lg" />
            </Link>
          </Button>
          {!signIn && (
            <p className="hidden text-sm text-muted-foreground xl:block">
              {t('publicLayout.pitch')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {!signIn && (
            <div className="hidden items-center gap-2.5 lg:flex">
              <Button asChild variant="outline">
                <a
                  href="https://github.com/jlinaresmedalla/ContaCompa-FE"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code2 className="size-4" aria-hidden="true" />
                  {t('publicLayout.viewCode')}
                </a>
              </Button>
              <PublicMainButton destination={destination} />
            </div>
          )}
          <div className="hidden items-center gap-2.5 md:flex">
            <PreferenceSwitches />
          </div>
          {phone && <PHONE_PREFERENCES />}
        </div>
      </div>
    </header>
  )
}
