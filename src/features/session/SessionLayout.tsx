import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router'

import { Toaster } from '@/components/ui/sonner'

import { useSessionRuntime } from './use-session-runtime'

export function SessionLayout() {
  const queryClient = useSessionRuntime()
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  )
}
