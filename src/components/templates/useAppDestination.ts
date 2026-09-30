import { useSyncExternalStore } from 'react'

import { PATHS } from '@/app/router/paths'
import { API_KEY_STORE } from '@/lib/apiKey'

const subscribeToKey = (listener: () => void) => API_KEY_STORE.subscribe(listener)
const readKey = () => API_KEY_STORE.get()

export function useAppDestination() {
  const key = useSyncExternalStore(subscribeToKey, readKey)
  return key ? PATHS.purchaseDocs : PATHS.signIn
}
