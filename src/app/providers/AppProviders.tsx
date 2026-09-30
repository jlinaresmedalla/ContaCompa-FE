import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'

import { Toaster } from '@/components/ui/sonner'
import { router } from '@/app/router/router'
import { handleUnauthorized } from '@/features/session'
import { setUnauthorizedHandler } from '@/lib/http'

const queryClient = new QueryClient()
setUnauthorizedHandler(() => handleUnauthorized(queryClient, router))

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
