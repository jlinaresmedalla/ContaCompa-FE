import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'

import { paths } from '@/app/router/paths'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
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

  if (doc.error && !doc.data)
    return (
      <div className="space-y-4">
        <PageHeader title={t('nav.purchaseDocs')} description={t('pageStates.documents')} />
        <ErrorNote message={toApiError(doc.error).message} />
      </div>
    )
  if (!doc.data)
    return (
      <div className="space-y-4">
        <PageHeader
          title={<Skeleton className="h-10 w-64" />}
          description={<Skeleton className="h-4 w-48" />}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="order-2 min-w-0 lg:order-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-96 w-full" />
          </Card>
          <Card className="order-1 min-w-0 lg:order-2">
            <Skeleton className="h-6 w-48" />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 12 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  const data = doc.data
  const file = data.documents[fileIndex] ?? data.documents[0]
  const title = data.doc_number ?? '?'
  const locale = i18n.language

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        description={
          <>
            {t(`docType.${data.doc_type}`)} · {data.supplier?.legal_name}
          </>
        }
        back={
          <Link
            to={paths.purchaseDocs}
            className="text-sm text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            {t('detail.back')}
          </Link>
        }
        actions={
          <Button
            variant="danger"
            disabled={remove.isPending}
            onClick={() => {
              if (!window.confirm(t('documents.confirmDelete', { name: title }))) return
              remove.mutate(data.id, { onSuccess: () => void navigate(paths.purchaseDocs) })
            }}
          >
            {t('common.delete')}
          </Button>
        }
      />
      {remove.error ? <ErrorNote message={toApiError(remove.error).message} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-6 lg:self-start">
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
                    'max-w-full rounded-md px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
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

        <div className="order-1 min-w-0 space-y-4 lg:order-2">
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
