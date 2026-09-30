import { ArrowLeft, FileText, Eye, EyeOff, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Dialog } from 'radix-ui'
import { BottomSheet } from '@/components/organisms'
import { usePhoneWidth } from '@/lib/usePhoneWidth'
import { Button } from '@/components/atoms'

import { PATHS } from '@/app/router/paths'
import { PageHeader, IconButton, ErrorNote } from '@/components/molecules'
import { Skeleton, Card, CardTitle } from '@/components/atoms'

import { dateTime } from '@/lib/format'
import { toApiError } from '@/lib/http'

import { DetailSections } from './components/DetailSections'
import { DeleteDocAction } from './components/DeleteDocAction'
import { PhoneDetailHeader } from './components/PhoneDetailHeader'
import { InvoiceCard } from './components/InvoiceCard'
import { useInvoiceEdit } from './hooks/useInvoiceEdit'
import { InvoiceEditActions } from './components/InvoiceEditActions'
import { usePreviewToggle } from './hooks/usePreviewToggle'
import { cn } from '@/lib/cn'
import { FilePreviewSkeleton } from './components/FilePreviewSkeleton'
import { lazyPage } from '@/lib/lazyPage'
import { useDocumentDetail } from './hooks/useDocumentDetail'

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
  const {
    doc,
    remove,
    fileIndex,
    setFileIndex,
    file,
    title,
    confirmDelete,
    deleteOpen,
    setDeleteOpen,
  } = useDocumentDetail()

  const phone = usePhoneWidth()
  const edit = useInvoiceEdit(doc.data)
  const { previewVisible, togglePreview } = usePreviewToggle(phone)

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
        <Card>
          <div
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2',
              previewVisible ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
            )}
          >
            {Array.from({ length: HEADER_SKELETON_COUNT }, (_, i) => (
              <Skeleton key={i} className="h-control w-full" />
            ))}
          </div>
        </Card>
      </div>
    )
  const data = doc.data
  const locale = i18n.language
  const Header = PhoneDetailHeader

  return (
    <div className={cn('min-w-0 space-y-4', phone && edit.editing && 'pb-[10rem]')}>
      <Header
        title={title}
        description={
          edit.editing ? (
            t('detail.editingRecord')
          ) : (
            <>
              {t('detail.processed', { date: dateTime(data.created_at, locale) })} ·{' '}
              {t('detail.exported', { date: dateTime(data.exported_at, locale) })}
            </>
          )
        }
        back={
          <IconButton
            asChild
            icon={ArrowLeft}
            label={t('detail.back')}
            variant="ghost"
            className="max-md:size-[var(--control-touch-height)]"
          >
            <Link to={PATHS.purchaseDocs} />
          </IconButton>
        }
        actions={
          <>
            {!(phone && edit.editing) ? (
              <IconButton
                icon={previewVisible ? Eye : EyeOff}
                label={t(previewVisible ? 'detail.hidePreview' : 'detail.showPreview')}
                aria-pressed={previewVisible}
                onClick={togglePreview}
                className="aria-pressed:bg-muted max-md:size-[var(--control-touch-height)]"
              />
            ) : null}
            {edit.editing ? (
              phone ? null : (
                <InvoiceEditActions edit={edit} />
              )
            ) : (
              <IconButton
                icon={Pencil}
                label={t('detail.editRecord')}
                onClick={edit.edit}
                className="max-md:size-[var(--control-touch-height)]"
              />
            )}
            <DeleteDocAction
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              confirm={confirmDelete}
              name={title}
              disabled={remove.isPending || edit.editing}
            />
          </>
        }
      />
      <Dialog.Root
        open={edit.blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open) edit.blocker.reset?.()
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card border border-border bg-card p-card shadow-md">
            <Dialog.Title className="text-lg font-semibold">
              {t('detail.unsavedTitle')}
            </Dialog.Title>
            <Dialog.Description className="my-4 text-sm text-muted-foreground">
              {t('detail.unsavedMessage')}
            </Dialog.Description>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => edit.blocker.reset?.()}>
                {t('detail.cancel')}
              </Button>
              <Button variant="danger" onClick={() => edit.blocker.proceed?.()}>
                {t('detail.discardAndLeave')}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {remove.error ? <ErrorNote message={toApiError(remove.error).message} /> : null}

      <div
        className={cn(
          'grid gap-5.5',
          previewVisible && !phone && 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
        )}
      >
        <div className="min-w-0 space-y-5.5">
          <InvoiceCard doc={data} previewVisible={previewVisible} edit={edit} />
          <DetailSections doc={data} />
        </div>
        {previewVisible && !phone ? (
          <Card className="min-w-0 max-h-[calc(100dvh-3rem)] overflow-auto md:sticky md:top-6 md:self-start">
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
                    className="aria-pressed:bg-muted max-md:size-[var(--control-touch-height)]"
                  />
                ))}
              </div>
            ) : null}
            {file ? <FilePreview documentId={file.id} filename={file.filename} /> : null}
          </Card>
        ) : null}
      </div>
      {phone && edit.editing ? (
        <InvoiceEditActions
          edit={edit}
          phone
          previewVisible={previewVisible}
          togglePreview={togglePreview}
        />
      ) : null}
      {phone && previewVisible ? (
        <BottomSheet
          open
          onOpenChange={(open) => {
            if (!open) togglePreview()
          }}
          title={t('detail.original')}
          description={t('detail.pinchZoom')}
          closeLabel={t('detail.hidePreview')}
        >
          <p className="mb-3 text-sm text-muted-foreground">{t('detail.pinchZoom')}</p>
          {data.documents.length > 1 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {data.documents.map((document, index) => (
                <Button
                  key={document.id}
                  variant="outline"
                  aria-pressed={index === fileIndex}
                  onClick={() => setFileIndex(index)}
                >
                  {document.filename}
                </Button>
              ))}
            </div>
          ) : null}
          {file ? <FilePreview documentId={file.id} filename={file.filename} /> : null}
        </BottomSheet>
      ) : null}
    </div>
  )
}
