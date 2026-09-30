import type { CorrectionForm } from './schemas/correction'

export const HEADER_SECTIONS = {
  supplier: ['supplier_ruc', 'supplier_name'],
  document: ['doc_type', 'doc_number', 'issue_date'],
  amounts: ['currency', 'total_amount', 'prices_include_igv'],
  buyer: ['buyer_ruc'],
} as const
export const HEADER_SECTION_NAMES = ['supplier', 'document', 'amounts', 'buyer'] as const
export const IGV_OPTIONS = ['true', 'false', 'unknown'] as const
export type HeaderSection = keyof typeof HEADER_SECTIONS
export type HeaderField = Exclude<keyof CorrectionForm, 'lines'>
