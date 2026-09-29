import type { CorrectionForm } from './schemas/correction'
import type { CorrectionPayload, PurchaseDocDetail } from './types'

const text = (value: string | null | undefined) => value ?? ''

/** Form values from the API model: every field as the string the user edits. */
export function toForm(doc: PurchaseDocDetail): CorrectionForm {
  return {
    doc_type: doc.doc_type,
    supplier_ruc: text(doc.supplier?.ruc),
    supplier_name: text(doc.supplier?.legal_name),
    doc_number: text(doc.doc_number),
    issue_date: text(doc.issue_date),
    currency: text(doc.currency),
    total_amount: text(doc.total_amount),
    prices_include_igv:
      doc.prices_include_igv === null ? 'unknown' : doc.prices_include_igv ? 'true' : 'false',
    buyer_ruc: text(doc.buyer_ruc),
    lines: doc.lines.map((line) => ({
      id: line.id,
      line_number: line.line_number,
      description: text(line.description),
      quantity: stripZeros(line.quantity),
      unit: line.unit,
      unit_price: stripZeros(line.unit_price),
      line_total: text(line.line_total),
    })),
  }
}

/** '30.000000' → '30' so an untouched value is not reported as a change. */
function stripZeros(value: string | null): string {
  if (value === null) return ''
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value
}

const HEADER_FIELDS = [
  'doc_type',
  'supplier_ruc',
  'supplier_name',
  'doc_number',
  'issue_date',
  'currency',
  'total_amount',
  'buyer_ruc',
] as const
const LINE_FIELDS = ['description', 'quantity', 'unit', 'unit_price', 'line_total'] as const

/** Only what the accountant changed; the API logs one correction per value. */
export function toPayload(before: CorrectionForm, after: CorrectionForm): CorrectionPayload {
  const fields: CorrectionPayload['fields'] = {}
  for (const name of HEADER_FIELDS) {
    if (after[name] !== before[name]) fields[name] = after[name] === '' ? null : after[name]
  }
  if (after.prices_include_igv !== before.prices_include_igv) {
    fields.prices_include_igv =
      after.prices_include_igv === 'unknown' ? null : after.prices_include_igv === 'true'
  }
  const lines: CorrectionPayload['lines'] = []
  after.lines.forEach((line, index) => {
    const old = before.lines[index]
    if (!old) return
    const changed: Record<string, string | null> = {}
    for (const name of LINE_FIELDS) {
      if (line[name] !== old[name]) changed[name] = line[name] === '' ? null : line[name]
    }
    if (Object.keys(changed).length > 0) lines.push({ id: line.id, ...changed })
  })
  return { fields, lines }
}
