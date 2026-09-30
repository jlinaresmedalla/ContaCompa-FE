import { Pencil, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AppSelect } from '@/components/ui/app-select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import { Field, Input } from '@/components/ui/input'

import {
  HEADER_SECTIONS,
  HEADER_SECTION_NAMES,
  IGV_OPTIONS,
  type HeaderSection,
} from '../header-sections'
import { DOC_TYPES } from '../schemas/correction'
import type { PurchaseDocDetail } from '../types'
import { useHeaderSection } from '../use-header-section'

function HeaderSectionCard({ doc, section }: { doc: PurchaseDocDetail; section: HeaderSection }) {
  const { t } = useTranslation()
  const { values, errors, editing, pending, edit, change, cancel, save } = useHeaderSection(
    doc,
    section,
  )
  return (
    <Card>
      <section aria-label={t(`detail.sections.${section}`)}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">{t(`detail.sections.${section}`)}</h2>
          {!editing ? (
            <IconButton
              icon={Pencil}
              label={t('detail.editSection', { section: t(`detail.sections.${section}`) })}
              variant="ghost"
              onClick={edit}
            />
          ) : null}
        </div>
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void save()
            }}
            className="space-y-3"
          >
            <fieldset
              disabled={pending}
              className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0"
            >
              {HEADER_SECTIONS[section].map((name) => (
                <Field
                  key={name}
                  label={t(`detail.fields.${name}`)}
                  error={errors[name] ? t(errors[name]) : undefined}
                >
                  {name === 'doc_type' ? (
                    <AppSelect
                      id={name}
                      label={t(`detail.fields.${name}`)}
                      value={values[name]}
                      onChange={(value) => change(name, value)}
                      disabled={pending}
                      error={errors[name] ? t(errors[name]) : undefined}
                      options={DOC_TYPES.map((value) => ({ value, label: t(`docType.${value}`) }))}
                    />
                  ) : name === 'prices_include_igv' ? (
                    <AppSelect
                      id={name}
                      label={t(`detail.fields.${name}`)}
                      value={values[name]}
                      onChange={(value) => change(name, value)}
                      disabled={pending}
                      error={errors[name] ? t(errors[name]) : undefined}
                      options={IGV_OPTIONS.map((value) => ({
                        value,
                        label: t(`detail.igv.${value}`),
                      }))}
                    />
                  ) : (
                    <Input
                      value={values[name]}
                      onChange={(event) => change(name, event.target.value)}
                      aria-invalid={Boolean(errors[name])}
                    />
                  )}
                </Field>
              ))}
            </fieldset>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={pending}>
                <Save aria-hidden="true" className="size-4" />
                {pending ? t('detail.saving') : t('detail.sectionSave')}
              </Button>
              <IconButton
                icon={X}
                label={t('detail.cancel')}
                variant="ghost"
                onClick={cancel}
                disabled={pending}
              />
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
            {HEADER_SECTIONS[section].map((name) => (
              <div key={name}>
                <dt className="text-xs font-medium text-muted-foreground">
                  {t(`detail.fields.${name}`)}
                </dt>
                <dd className="mt-1 text-sm break-words">
                  {name === 'doc_type'
                    ? t(`docType.${values[name]}`)
                    : name === 'prices_include_igv'
                      ? t(`detail.igv.${values[name]}`)
                      : values[name] || t('detail.missingValue')}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </Card>
  )
}

export function HeaderSections({ doc }: { doc: PurchaseDocDetail }) {
  return (
    <div className="space-y-4">
      {HEADER_SECTION_NAMES.map((section) => (
        <HeaderSectionCard key={section} doc={doc} section={section} />
      ))}
    </div>
  )
}
