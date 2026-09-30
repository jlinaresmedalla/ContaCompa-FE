import { ArrowLeft, Trash2, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { PATHS } from '@/app/router/paths'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { IconButton } from '@/components/ui/icon-button'
import { Card, CardTitle } from '@/components/ui/card'
import { ErrorNote } from '@/components/ui/input'
import { dateTime } from '@/lib/format'
import { toApiError } from '@/lib/http'

import { DetailTabs } from './components/DetailTabs'
import { HeaderSections } from './components/HeaderSections'
import { FilePreviewSkeleton } from './components/FilePreviewSkeleton'
import { lazyPage } from '@/lib/lazyPage'
import { useDocumentDetail } from './use-document-detail'

const FilePreview = lazyPage(
  async () => {
    const module = await import('./components/FilePreview')
    return { default: module.FilePreview }
  },
  <FilePreviewSkeleton />,
)

const HEADER_SKELETON_COUNT = 12

export function DocumentDetailPage() {
  const { t, i18n } = useTranslation()
  const { doc, remove, fileIndex, setFileIndex, file, title, confirmDelete } = useDocumentDetail()

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
              {Array.from({ length: HEADER_SKELETON_COUNT }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  const data = doc.data
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
          <IconButton asChild icon={ArrowLeft} label={t('detail.back')} variant="ghost">
            <Link to={PATHS.purchaseDocs} />
          </IconButton>
        }
        actions={
          <IconButton
            icon={Trash2}
            label={t('common.delete')}
            variant="danger"
            disabled={remove.isPending}
            onClick={confirmDelete}
          />
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
                <IconButton
                  key={document.id}
                  icon={FileText}
                  label={document.filename}
                  variant="ghost"
                  aria-pressed={index === fileIndex}
                  onClick={() => setFileIndex(index)}
                  className="aria-pressed:bg-muted"
                />
              ))}
            </div>
          ) : null}
          {file ? <FilePreview documentId={file.id} filename={file.filename} /> : null}
        </Card>

        <div className="order-1 min-w-0 space-y-4 lg:order-2">
          <HeaderSections key={data.id} doc={data} />
          <DetailTabs doc={data} />
          <p className="text-xs text-muted-foreground">
            {t('detail.processed', { date: dateTime(data.created_at, locale) })} ·{' '}
            {t('detail.exported', { date: dateTime(data.exported_at, locale) })}
          </p>
        </div>
      </div>
    </div>
  )
}
