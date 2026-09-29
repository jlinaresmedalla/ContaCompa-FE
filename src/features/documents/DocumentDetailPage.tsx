import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'

import { paths } from '@/app/router/paths'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { ErrorNote } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { dateTime } from '@/lib/format'
import { toApiError } from '@/lib/http'

import { CorrectionForm } from './components/CorrectionForm'
import { FilePreview } from './components/FilePreview'
import { IssueBadges } from './components/IssueBadges'
import { LinePrices } from './components/LinePrices'
import { useDeleteDoc, usePurchaseDoc } from './hooks'
import { observationLabel } from './observations'

export function DocumentDetailPage() {
  const { t, i18n } = useTranslation()
  const { id = '' } = useParams()
  const doc = usePurchaseDoc(id)
  const remove = useDeleteDoc()
  const navigate = useNavigate()
  const [fileIndex, setFileIndex] = useState(0)

  if (doc.error) return <ErrorNote message={toApiError(doc.error).message} />
  if (!doc.data) return <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
  const data = doc.data
  const file = data.documents[fileIndex] ?? data.documents[0]
  const title = data.doc_number ?? '?'
  const locale = i18n.language

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link to={paths.purchaseDocs} className="text-sm text-primary hover:underline">
          {t('detail.back')}
        </Link>
        <h1 className="text-lg font-semibold">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {t(`docType.${data.doc_type}`)} · {data.supplier?.legal_name}
        </span>
        <Button
          className="ml-auto"
          variant="danger"
          disabled={remove.isPending}
          onClick={() => {
            if (!window.confirm(t('documents.confirmDelete', { name: title }))) return
            remove.mutate(data.id, { onSuccess: () => void navigate(paths.purchaseDocs) })
          }}
        >
          {t('common.delete')}
        </Button>
      </div>
      {remove.error ? <ErrorNote message={toApiError(remove.error).message} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <CardTitle hint={file ? t(`sourceKind.${file.source_kind}`) : undefined}>
            {t('detail.original')}
          </CardTitle>
          {data.documents.length > 1 ? (
            <div className="mb-2 flex flex-wrap gap-1">
              {data.documents.map((document, index) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => setFileIndex(index)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs',
                    index === fileIndex ? 'bg-muted font-medium' : 'text-muted-foreground',
                  )}
                >
                  {document.filename}
                </button>
              ))}
            </div>
          ) : null}
          {file ? <FilePreview documentId={file.id} filename={file.filename} /> : null}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardTitle hint={t('detail.observationsHint')}>{t('detail.observations')}</CardTitle>
            <IssueBadges issues={data.issues} />
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {data.issues.map((issue, index) => (
                <li key={index}>
                  <span className="font-semibold text-foreground">
                    {observationLabel(t, issue.code)}
                  </span>
                  {issue.line_number ? ` (${t('detail.line', { n: issue.line_number })})` : ''}:{' '}
                  {issue.detail}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle hint={t('prices.legend')}>{t('detail.pricesTitle')}</CardTitle>
            <LinePrices doc={data} />
          </Card>

          <CorrectionForm key={`${data.id}-${data.corrections.length}`} doc={data} />

          <Card>
            <CardTitle hint={t('detail.historyCount', { count: data.corrections.length })}>
              {t('detail.history')}
            </CardTitle>
            {data.corrections.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('detail.noCorrections')}</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {data.corrections.map((correction, index) => (
                  <li key={index} className="flex flex-wrap gap-2">
                    <span className="text-muted-foreground">
                      {dateTime(correction.corrected_at, locale)}
                    </span>
                    <span className="font-medium">{correction.field}</span>
                    <span className="text-muted-foreground line-through">
                      {correction.old_value ?? '∅'}
                    </span>
                    <span>→ {correction.new_value ?? '∅'}</span>
                    <span className="text-muted-foreground">· {correction.corrected_by}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <p className="text-xs text-muted-foreground">
            {t('detail.processed', { date: dateTime(data.created_at, locale) })} ·{' '}
            {t('detail.exported', { date: dateTime(data.exported_at, locale) })}
          </p>
        </div>
      </div>
    </div>
  )
}
