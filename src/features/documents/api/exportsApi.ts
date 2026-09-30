import { http } from '@/lib/http'
import { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'

export const EXPORTS_API = {
  async exportXlsx(language: string): Promise<{ blob: Blob; count: number }> {
    const response = await http.get<Blob>(DOCUMENT_ENDPOINTS.export, {
      params: { lang: language === 'en' ? 'en' : 'es' },
      responseType: 'blob',
    })
    return { blob: response.data, count: Number(response.headers['x-purchase-doc-count'] ?? 0) }
  },
}
