import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCorrectDoc } from './hooks'
import { CORRECTION_SCHEMA } from './schemas/correction'
import type { Line, PurchaseDocDetail } from './types'
import { toForm, toPayload } from './utils'

const LINE_SCHEMA = CORRECTION_SCHEMA.shape.lines.element

export function useLineCorrections(doc: PurchaseDocDetail, line: Line) {
  const [editing, setEditing] = useState(false)
  const [baseline, setBaseline] = useState(() => toForm({ ...doc, lines: [line] }))
  const correct = useCorrectDoc(doc.id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LINE_SCHEMA),
    defaultValues: baseline.lines[0],
  })
  const start = () => {
    const next = toForm({ ...doc, lines: [line] })
    setBaseline(next)
    reset(next.lines[0])
    setEditing(true)
  }
  const cancel = () => {
    reset(baseline.lines[0])
    setEditing(false)
  }
  const save = handleSubmit(async (values) => {
    const payload = toPayload(baseline, { ...baseline, lines: [values] })
    if (payload.lines.length === 0) {
      setEditing(false)
      return
    }
    try {
      await correct.mutateAsync(payload)
      setEditing(false)
    } catch {
      // The mutation reports errors and the row retains its draft.
    }
  })
  return { editing, start, cancel, save, register, errors, pending: correct.isPending }
}
