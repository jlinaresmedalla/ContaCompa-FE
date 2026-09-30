import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../../api/purchaseDocsApi'

/** An object URL for the original upload, revoked when the blob changes or on unmount. */
export function useFileUrl(documentId: string) {
  const query = useQuery({
    queryKey: DOCUMENT_KEYS.file(documentId),
    queryFn: ({ signal }) => DOCUMENT_API.file(documentId, signal),
  })
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!query.data) return
    const next = URL.createObjectURL(query.data)
    // Syncing with a browser resource (object URLs), not deriving state.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Object URLs need effect cleanup.
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [query.data])
  return { url, type: query.data?.type ?? null, isLoading: query.isLoading, error: query.error }
}
