/** The service API key lives in this browser's localStorage (local operator tool; see README). */
const STORAGE_KEY = 'doc-extraction.api-key'

export const apiKeyStore = {
  get(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  },
  set(value: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* private mode: the key lasts until reload */
    }
  },
  /** Calls `listener` when another tab changes or removes the key. Returns the unsubscribe. */
  subscribe(listener: () => void): () => void {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing stored */
    }
  },
}
