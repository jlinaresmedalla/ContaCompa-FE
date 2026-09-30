import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { clearSession, signInUrl } from '../utils/session'

export function useSignOut(): () => void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return () => {
    void clearSession(queryClient)
    void navigate(signInUrl(), { replace: true })
  }
}
