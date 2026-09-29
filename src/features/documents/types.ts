export type DocType = 'invoice' | 'sales_receipt' | 'sales_note' | 'credit_note' | 'other'
export type ObservationFilter = 'all' | 'warning' | 'any' | 'none'
export type Severity = 'info' | 'warning'

export type Issue = {
  code: string
  severity: Severity
  detail: string
  field: string | null
  line_number: number | null
}

export type Line = {
  id: string
  line_number: number
  description: string | null
  quantity: string | null
  unit: string
  unit_price: string | null
  line_total: string | null
  unit_price_without_igv: string | null
  unit_price_with_igv: string | null
  line_total_without_igv: string | null
  line_total_with_igv: string | null
}

export type PurchaseDocSummary = {
  id: string
  supplier: { ruc: string | null; legal_name: string | null } | null
  doc_type: DocType
  doc_number: string | null
  issue_date: string | null
  currency: string | null
  total_amount: string | null
  prices_include_igv: boolean | null
  taxable_amount: string | null
  igv_amount: string | null
  has_warnings: boolean
  issues: Issue[]
  lines: Line[]
}

export type Correction = {
  field: string
  line_id: string | null
  old_value: string | null
  new_value: string | null
  corrected_by: string
  corrected_at: string
}

export type PurchaseDocDetail = PurchaseDocSummary & {
  buyer_ruc: string | null
  created_at: string
  exported_at: string | null
  documents: { id: string; filename: string; source_kind: 'pdf_text' | 'pdf_scanned' | 'photo' }[]
  corrections: Correction[]
}

export type PurchaseDocList = { items: PurchaseDocSummary[]; next_offset: number | null }

export type ListFilters = { observations: ObservationFilter; code: string | null }

export type ObservationReport = {
  documents: number
  clean: number
  with_warnings: number
  by_code: { code: string; severity: Severity; occurrences: number; documents: number }[]
}

export type CorrectionPayload = {
  fields: Record<string, string | boolean | null>
  lines: Array<Record<string, string | null> & { id: string }>
}
