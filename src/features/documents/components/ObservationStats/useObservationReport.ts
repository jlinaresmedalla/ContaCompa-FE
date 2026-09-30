import { useQuery } from '@tanstack/react-query'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../../api/purchaseDocsApi'

export function useObservationReport() {
  return useQuery({
    queryKey: DOCUMENT_KEYS.report(),
    queryFn: ({ signal }) => DOCUMENT_API.report(signal),
  })
}
