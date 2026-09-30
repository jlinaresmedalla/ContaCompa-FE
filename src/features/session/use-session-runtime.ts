import { QueryClient, QueryClientContext } from '@tanstack/react-query'
import { useContext, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { setUnauthorizedHandler } from '@/lib/http'

import { handleUnauthorized } from './session'

const QUERY_CLIENT = new QueryClient()

export function useSessionRuntime() {
  const inheritedClient = useContext(QueryClientContext)
  const queryClient = inheritedClient ?? QUERY_CLIENT
  const location = useLocation()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    setUnauthorizedHandler(() => handleUnauthorized(queryClient, { state: { location }, navigate }))
    return () => setUnauthorizedHandler(() => {})
  }, [queryClient, location, navigate])
  return queryClient
}
