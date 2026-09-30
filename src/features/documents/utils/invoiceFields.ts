import type { CorrectionForm } from '../schemas/correction'

export const INVOICE_FIELDS = [
  'doc_type',
  'doc_number',
  'issue_date',
  'supplier_ruc',
  'supplier_name',
  'currency',
  'total_amount',
  'prices_include_igv',
  'buyer_ruc',
] as const
export const IGV_OPTIONS = ['true', 'false', 'unknown'] as const
export type HeaderField = Exclude<keyof CorrectionForm, 'lines'>
