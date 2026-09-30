import { useState } from 'react'
import type { InvoiceEdit } from '@/features/documents/hooks/useInvoiceEdit'
import type { HeaderField } from '@/features/documents/utils/invoiceFields'
import type { CorrectionForm } from '@/features/documents/schemas/correction'

const DEFAULT_VALUES: CorrectionForm = {
  doc_type: 'invoice',
  doc_number: 'F001-0042',
  issue_date: '2026-09-30',
  supplier_ruc: '20543306771',
  supplier_name: '',
  buyer_ruc: '',
  currency: 'PEN',
  total_amount: '118.00',
  prices_include_igv: 'true',
  lines: [],
}
const INITIAL_VALUES = { ...DEFAULT_VALUES, supplier_ruc: '123', supplier_name: 'Contacompa' }
const INITIAL_CHANGED: HeaderField[] = ['supplier_name', 'supplier_ruc']

// Local gallery state: exercising the real presentation never registers a blocker or calls the API.
export function useDesignEdit(): InvoiceEdit {
  const [values, setValues] = useState<CorrectionForm>(INITIAL_VALUES)
  const [changed, setChanged] = useState(INITIAL_CHANGED)
  const invalid = values.supplier_ruc !== '' && !/^\d{11}$/.test(values.supplier_ruc)
  const cancel = () => {
    setValues(DEFAULT_VALUES)
    setChanged([])
  }
  const change = (name: HeaderField, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    setChanged((current) => (current.includes(name) ? current : [...current, name]))
  }
  return {
    values,
    changed,
    errors: invalid ? { supplier_ruc: 'validation.ruc' } : {},
    errorCount: invalid ? 1 : 0,
    editing: true,
    pending: false,
    blocker: { state: 'unblocked', reset: undefined, proceed: undefined, location: undefined },
    edit: cancel,
    cancel,
    change,
    save: () => {
      if (!invalid) setChanged([])
      return Promise.resolve()
    },
    undo: (name) => {
      setValues((current) => ({ ...current, [name]: DEFAULT_VALUES[name] }))
      setChanged((current) => current.filter((field) => field !== name))
    },
  }
}
