export const PATHS = {
  home: '/',
  design: '/design',
  signIn: '/sign-in',
  extraction: '/extraction',
  purchaseDocs: '/extraction/purchase-docs',
  purchaseDoc: (id: string) => `/extraction/purchase-docs/${encodeURIComponent(id)}`,
  jobs: '/extraction/jobs',
  monitor: '/monitor',
  costs: '/monitor/costs',
  assistant: '/assistant',
} as const
