import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorNote, Field, Input } from '@/components/ui/input'
import { apiKeyStore } from '@/lib/api-key'
import { toApiError } from '@/lib/http'

import { sessionApi, sessionKeys } from './api'
import { forgetCompanyData, safeNext } from './session'

export function SignInPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState('')
  const signIn = useMutation({
    // The key is stored only after the service accepts it.
    mutationFn: async (key: string) => {
      const me = await sessionApi.me(key)
      // Nothing of a previous company may survive. The mutation cache stays: it holds this call.
      await forgetCompanyData(queryClient)
      apiKeyStore.set(key)
      queryClient.setQueryData(sessionKeys.me, me)
    },
    onSuccess: () => void navigate(safeNext(params.get('next')), { replace: true }),
  })
  const key = value.trim()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (key && !signIn.isPending) signIn.mutate(key)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm items-center px-4">
      <Card className="w-full space-y-4">
        <div>
          <h1 className="text-lg font-semibold">{t('session.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('session.hint')}</p>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <Field label={t('session.apiKey')}>
            <Input
              type="password"
              autoComplete="off"
              value={value}
              aria-invalid={signIn.isError}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
          {signIn.error ? <ErrorNote message={toApiError(signIn.error).message} /> : null}
          <Button type="submit" className="w-full" disabled={!key || signIn.isPending}>
            {signIn.isPending ? t('session.checking') : t('session.signIn')}
          </Button>
        </form>
      </Card>
    </main>
  )
}
