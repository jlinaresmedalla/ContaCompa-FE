import { z } from 'zod'

// Messages are i18n keys; the form translates them when it shows an error.
const optionalDecimal = z
  .string()
  .trim()
  .refine((value) => value === '' || /^-?\d+(\.\d+)?$/.test(value), 'validation.decimal')
const optionalRuc = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{11}$/.test(value), 'validation.ruc')

export const docTypes = ['invoice', 'sales_receipt', 'sales_note', 'credit_note', 'other'] as const

export const correctionSchema = z.object({
  doc_type: z.enum(docTypes),
  supplier_ruc: optionalRuc,
  supplier_name: z.string().trim(),
  doc_number: z.string().trim().max(40, 'validation.tooLong'),
  issue_date: z
    .string()
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'validation.date'),
  currency: z
    .string()
    .trim()
    .refine((value) => value === '' || /^[A-Za-z]{3}$/.test(value), 'validation.currency'),
  total_amount: optionalDecimal,
  prices_include_igv: z.enum(['true', 'false', 'unknown']),
  buyer_ruc: optionalRuc,
  lines: z.array(
    z.object({
      id: z.string(),
      line_number: z.number(),
      description: z.string(),
      quantity: optionalDecimal,
      unit: z.string().trim(),
      unit_price: optionalDecimal,
      line_total: optionalDecimal,
    }),
  ),
})

export type CorrectionForm = z.infer<typeof correctionSchema>
export type ValidationKey =
  | 'validation.decimal'
  | 'validation.ruc'
  | 'validation.date'
  | 'validation.currency'
  | 'validation.tooLong'
