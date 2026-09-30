import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { API_KEY_STORE } from '@/lib/api-key'
import { toApiError } from '@/lib/http'

import { SESSION_API, SESSION_KEYS } from './api'
import { forgetCompanyData, safeNext } from './session'

/** Checks a candidate key before storing it and replacing the previous company's cache. */
export function useSignIn() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState('')
  const signIn = useMutation({
    // The key is stored only after the service accepts it.
    mutationFn: async (key: string) => {
      const me = await SESSION_API.me(key)
      // Nothing of a previous company may survive. The mutation cache stays: it holds this call.
      await forgetCompanyData(queryClient)
      API_KEY_STORE.set(key)
      queryClient.setQueryData(SESSION_KEYS.me, me)
    },
    onSuccess: () => void navigate(safeNext(params.get('next')), { replace: true }),
  })
  const key = value.trim()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (key && !signIn.isPending) signIn.mutate(key)
  }

  return {
    value,
    setValue,
    submit,
    isPending: signIn.isPending,
    isError: signIn.isError,
    errorMessage: signIn.error ? toApiError(signIn.error).message : null,
    canSubmit: Boolean(key) && !signIn.isPending,
  }
}
