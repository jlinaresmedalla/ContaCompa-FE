import { Code2, Globe, Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { Button } from '@/components/atoms'
import { Logo, PublicMainButton, IconButton } from '@/components/molecules'
import { usePhoneWidth } from '@/lib/usePhoneWidth'
import { lazyPage } from '@/lib/lazyPage'
import { useAppDestination } from '../useAppDestination'

function PhonePreferencesFallback() {
  return (
    <div className="flex gap-1" aria-hidden="true" data-testid="phone-preferences-fallback">
      {[Globe, Monitor].map((Icon, index) => (
        <span
          key={index}
          className="flex size-icon-button max-md:size-[3.25rem] items-center justify-center rounded-control border border-border bg-background text-muted-foreground"
        >
          <Icon className="size-4" />
        </span>
      ))}
    </div>
  )
}

const PHONE_PREFERENCES = lazyPage<object>(
  () =>
    import('@/components/organisms/PublicPhonePreferences/PublicPhonePreferences').then((module) => ({
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
      <div className="mx-auto flex w-full max-w-[160rem] flex-wrap items-center justify-between gap-2 px-shell-fluid py-2 md:min-h-[4.625rem]">
        <div className="flex min-w-0 items-center gap-[1.125rem]">
          <Button asChild variant="ghost" className="px-0">
            <Link to={PATHS.home} aria-label={t('publicLayout.home')}>
              <Logo className="[&>svg]:size-7 [&>span]:text-lg max-md:[&>span]:hidden" />
            </Link>
          </Button>
          {!signIn && (
            <p className="hidden text-sm text-muted-foreground xl:block">
              {t('publicLayout.pitch')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!signIn && (
            <div className="flex items-center gap-1">
              {phone ? (
                <IconButton
                  asChild
                  icon={Code2}
                  label={t('publicLayout.viewCode')}
                  className="size-[3.25rem]"
                >
                  <a
                    href="https://github.com/jlinaresmedalla/ContaCompa-FE"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t('publicLayout.viewCode')}
                  />
                </IconButton>
              ) : (
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
              )}
              <PublicMainButton destination={destination} />
            </div>
          )}
          <PHONE_PREFERENCES />
        </div>
      </div>
    </header>
  )
}
