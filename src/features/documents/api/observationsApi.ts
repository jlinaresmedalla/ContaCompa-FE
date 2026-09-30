import { http } from '@/lib/http'
import { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'
import type { ObservationReport } from '../types/purchaseDocs'

export const OBSERVATIONS_API = {
  async report(signal?: AbortSignal): Promise<ObservationReport> {
    const { data } = await http.get<ObservationReport>(DOCUMENT_ENDPOINTS.report, { signal })
    return data
  },
}
