import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router'

import { Toaster } from '@/components/organisms'

import { useSessionRuntime } from './useSessionRuntime'

export function SessionLayout() {
  const queryClient = useSessionRuntime()
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  )
}
