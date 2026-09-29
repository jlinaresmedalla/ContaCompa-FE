import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AppSelect } from '@/components/ui/app-select'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { ErrorNote, Field, Input } from '@/components/ui/input'
import { toApiError } from '@/lib/http'

import { useCorrectDoc } from '../hooks'
import {
  correctionSchema,
  docTypes,
  type CorrectionForm as FormValues,
  type ValidationKey,
} from '../schemas/correction'
import type { PurchaseDocDetail } from '../types'
import { toForm, toPayload } from '../utils'

type TextField = Exclude<keyof FormValues, 'lines' | 'doc_type' | 'prices_include_igv'>
const LINE_INPUTS = ['quantity', 'unit', 'unit_price', 'line_total'] as const
const IGV = ['true', 'false', 'unknown'] as const

export function CorrectionForm({ doc }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  const defaults = toForm(doc)
  const correct = useCorrectDoc(doc.id)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(correctionSchema), defaultValues: defaults })
  const { fields: lines } = useFieldArray({ control, name: 'lines', keyName: 'key' })
  const message = (key: string | undefined) => (key ? t(key as ValidationKey) : undefined)

  const onSubmit = handleSubmit(async (values) => {
    const payload = toPayload(defaults, values)
    if (Object.keys(payload.fields).length === 0 && payload.lines.length === 0) return
    const updated = await correct.mutateAsync(payload)
    reset(toForm(updated))
  })

  const text = (name: TextField) => (
    <Field label={t(`detail.fields.${name}`)} error={message(errors[name]?.message)}>
      <Input {...register(name)} aria-invalid={Boolean(errors[name])} />
    </Field>
  )

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
      <Card>
        <CardTitle hint={t('detail.headerHint')}>{t('detail.header')}</CardTitle>
        <div className="grid grid-cols-2 gap-3">
          {text('supplier_ruc')}
          {text('supplier_name')}
          <Field label={t('detail.fields.doc_type')}>
            <Controller
              control={control}
              name="doc_type"
              render={({ field }) => (
                <AppSelect
                  inputId="doc_type"
                  options={docTypes.map((value) => ({ value, label: t(`docType.${value}`) }))}
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? 'other')}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Field>
          {text('doc_number')}
          {text('issue_date')}
          <div className="grid grid-cols-2 gap-3">
            {text('currency')}
            {text('total_amount')}
          </div>
          <Field label={t('detail.fields.prices_include_igv')}>
            <Controller
              control={control}
              name="prices_include_igv"
              render={({ field }) => (
                <AppSelect
                  inputId="prices_include_igv"
                  options={IGV.map((value) => ({ value, label: t(`detail.igv.${value}`) }))}
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? 'unknown')}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Field>
          {text('buyer_ruc')}
        </div>
      </Card>

      <Card>
        <CardTitle hint={t('detail.linesHint')}>{t('detail.lines')}</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="py-1 pr-2 font-semibold">#</th>
                <th className="py-1 pr-2 font-semibold">{t('detail.fields.description')}</th>
                {LINE_INPUTS.map((name) => (
                  <th key={name} className="py-1 pr-2 font-semibold">
                    {t(`detail.fields.${name}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const lineErrors = errors.lines?.[index]
                const lineLabel = t('detail.line', { n: line.line_number })
                return (
                  <tr key={line.key} className="align-top">
                    <td className="py-1 pr-2 text-muted-foreground">{line.line_number}</td>
                    <td className="py-1 pr-2">
                      <Input
                        aria-label={`${lineLabel} ${t('detail.fields.description')}`}
                        {...register(`lines.${index}.description`)}
                      />
                    </td>
                    {LINE_INPUTS.map((name) => (
                      <td key={name} className="w-28 py-1 pr-2">
                        <Input
                          aria-label={`${lineLabel} ${t(`detail.fields.${name}`)}`}
                          aria-invalid={Boolean(lineErrors?.[name])}
                          className="text-right tabular-nums"
                          {...register(`lines.${index}.${name}`)}
                        />
                        {lineErrors?.[name] ? (
                          <span className="text-xs text-danger">
                            {message(lineErrors[name]?.message)}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {correct.error ? <ErrorNote message={toApiError(correct.error).message} /> : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={!isDirty || correct.isPending}>
          {correct.isPending ? t('detail.saving') : t('detail.save')}
        </Button>
        <Button variant="ghost" disabled={!isDirty} onClick={() => reset(defaults)}>
          {t('detail.undo')}
        </Button>
        <span className="text-xs text-muted-foreground">{t('detail.logged')}</span>
      </div>
    </form>
  )
}
