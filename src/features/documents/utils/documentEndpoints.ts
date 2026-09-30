export const DOCUMENT_ENDPOINTS = {
  list: '/v1/purchase-docs',
  detail: (id: string) => `/v1/purchase-docs/${encodeURIComponent(id)}`,
  report: '/v1/reports/observations',
  file: (documentId: string) => `/v1/documents/${encodeURIComponent(documentId)}/file`,
  export: '/v1/exports/purchase-docs.xlsx',
}
