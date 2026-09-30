import { http } from '@/lib/http'
import { DOCUMENT_ENDPOINTS } from '../utils/documentEndpoints'

export const FILES_API = {
  async file(documentId: string, signal?: AbortSignal): Promise<Blob> {
    const { data } = await http.get<Blob>(DOCUMENT_ENDPOINTS.file(documentId), {
      responseType: 'blob',
      signal,
    })
    return data
  },
}
