import { http } from '@/lib/http'
import { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'
import type { CorrectionPayload, PurchaseDocDetail } from '../types/purchaseDocs'

export const CORRECTIONS_API = {
  async correct(id: string, payload: CorrectionPayload): Promise<PurchaseDocDetail> {
    const { data } = await http.patch<PurchaseDocDetail>(DOCUMENT_ENDPOINTS.detail(id), payload)
    return data
  },
}
