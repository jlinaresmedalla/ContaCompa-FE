import { z } from 'zod'

const DOCUMENT_NUMBER_MAX_LENGTH = 40

// Messages are i18n keys; the form translates them when it shows an error.
const OPTIONAL_DECIMAL = z
  .string()
  .trim()
  .refine((value) => value === '' || /^-?\d+(\.\d+)?$/.test(value), 'validation.decimal')
const OPTIONAL_RUC = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{11}$/.test(value), 'validation.ruc')

export const DOC_TYPES = ['invoice', 'sales_receipt', 'sales_note', 'credit_note', 'other'] as const

export const CORRECTION_SCHEMA = z.object({
  doc_type: z.enum(DOC_TYPES),
  supplier_ruc: OPTIONAL_RUC,
  supplier_name: z.string().trim(),
  doc_number: z.string().trim().max(DOCUMENT_NUMBER_MAX_LENGTH, 'validation.tooLong'),
  issue_date: z
    .string()
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'validation.date'),
  currency: z
    .string()
    .trim()
    .refine((value) => value === '' || /^[A-Za-z]{3}$/.test(value), 'validation.currency'),
  total_amount: OPTIONAL_DECIMAL,
  prices_include_igv: z.enum(['true', 'false', 'unknown']),
  buyer_ruc: OPTIONAL_RUC,
  lines: z.array(
    z.object({
      id: z.string(),
      line_number: z.number(),
      description: z.string(),
      quantity: OPTIONAL_DECIMAL,
      unit: z.string().trim(),
      unit_price: OPTIONAL_DECIMAL,
      line_total: OPTIONAL_DECIMAL,
    }),
  ),
})

export type CorrectionForm = z.infer<typeof CORRECTION_SCHEMA>
export type ValidationKey =
  | 'validation.decimal'
  | 'validation.ruc'
  | 'validation.date'
  | 'validation.currency'
  | 'validation.tooLong'
