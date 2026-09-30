import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { PATHS } from '@/app/router/paths'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Backdrop } from '@/components/ui/backdrop'
import { Card } from '@/components/ui/card'
import { ErrorNote, Field, Input } from '@/components/ui/input'

import { useSignIn } from './useSignIn'

export function SignInPage() {
  const { t } = useTranslation()
  const { value, setValue, submit, isPending, isError, errorMessage, canSubmit } = useSignIn()

  return (
    <main className="relative isolate flex min-h-screen min-w-0 items-center justify-center px-4 py-8">
      <Backdrop />
      <Card className="material min-w-0 w-full max-w-sm space-y-4">
        <Logo size="lg" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('session.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('publicLayout.keyHint')}</p>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <Field label={t('session.apiKey')}>
            <Input
              type="password"
              autoComplete="off"
              value={value}
              aria-invalid={isError}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
          {errorMessage ? <ErrorNote message={errorMessage} /> : null}
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isPending ? t('session.checking') : t('session.signIn')}
          </Button>
        </form>
        <Button asChild variant="ghost" className="max-w-full">
          <Link to={PATHS.home}>{t('publicLayout.backHome')}</Link>
        </Button>
      </Card>
    </main>
  )
}
