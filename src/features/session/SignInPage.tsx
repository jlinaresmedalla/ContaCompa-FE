import { ArrowRight, ChevronLeft, Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { IconButton } from '@/components/molecules'
import { Button, Backdrop, Card, Input } from '@/components/atoms'
import { PublicHeader } from '@/components/templates'
import { useSignIn } from './hooks/useSignIn'

export function SignInPage() {
  const { t } = useTranslation()
  const {
    value,
    setValue,
    submit,
    isPending,
    isError,
    errorMessage,
    canSubmit,
    showKey,
    toggleKey,
  } = useSignIn()
  return (
    <div className="relative isolate flex min-h-screen min-w-0 flex-col">
      <Backdrop />
      <PublicHeader signIn />
      <main className="mx-auto flex w-full max-w-[160rem] flex-1 items-center justify-center px-shell-fluid py-7 md:pb-[4.625rem]">
        <Card className="material w-full min-w-0 max-w-[30rem] space-y-7 p-7 md:p-9">
          <div className="space-y-[1.125rem]">
            <span className="flex size-[2.875rem] items-center justify-center rounded-control border border-primary/20 bg-primary/10 text-primary">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-[1.75rem] leading-9 font-semibold tracking-tight">
                {t('session.title')}
              </h1>
              <p className="mt-1 text-muted-foreground">{t('session.hint')}</p>
            </div>
          </div>
          <form className="space-y-7" onSubmit={submit} aria-busy={isPending}>
            <div className="space-y-1.5">
              <label htmlFor="sign-in-key" className="text-sm font-medium">
                {t('session.apiKey')}
              </label>
              <div className="relative flex items-center">
                <KeyRound
                  className="pointer-events-none absolute left-3.5 size-[1.125rem] text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="sign-in-key"
                  type={showKey ? 'text' : 'password'}
                  autoComplete="off"
                  value={value}
                  disabled={isPending}
                  aria-invalid={isError}
                  aria-describedby={
                    errorMessage ? 'sign-in-key-hint sign-in-key-error' : 'sign-in-key-hint'
                  }
                  className="pr-14 pl-12 text-base"
                  onChange={(event) => setValue(event.target.value)}
                />
                <IconButton
                  icon={showKey ? EyeOff : Eye}
                  label={t(showKey ? 'session.hideKey' : 'session.showKey')}
                  aria-pressed={showKey}
                  onClick={toggleKey}
                  className="absolute right-1 size-11 rounded-icon-tile md:size-8"
                />
              </div>
              <p id="sign-in-key-hint" className="text-sm text-muted-foreground">
                {t('session.storedHere')}
              </p>
              {errorMessage && (
                <p id="sign-in-key-error" role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
              {isPending && (
                <p role="status" className="text-sm text-muted-foreground">
                  {t('session.checking')}
                </p>
              )}
            </div>
            <div className="space-y-3.5">
              <Button type="submit" className="w-full text-base" disabled={!canSubmit}>
                {isPending ? t('session.checking') : t('session.signIn')}
                <ArrowRight className="size-[1.125rem]" aria-hidden="true" />
              </Button>
              <Button asChild variant="ghost" className="w-full text-base text-muted-foreground">
                <Link to={PATHS.home}>
                  <ChevronLeft className="size-[1.125rem]" aria-hidden="true" />
                  {t('publicLayout.backHome')}
                </Link>
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
