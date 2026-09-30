import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, type BadgeTone, Button, Card } from '@/components/atoms'

import { cn } from '@/lib/cn'

import { useUploadDropzone } from './useUploadDropzone'
import type { UploadItem } from '../../types/jobs'

const ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
const TONE: Record<UploadItem['state'], BadgeTone> = {
  uploading: 'neutral',
  queued: 'info',
  duplicate: 'warning',
  error: 'danger',
}

export function UploadDropzone() {
  const { t } = useTranslation()
  const { items, isUploading, dragging, setDragging, inputRef, send } = useUploadDropzone()

  return (
    <Card className="border-dashed p-4.5 md:px-5.5">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          send(event.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col gap-3.5 rounded-control text-sm md:flex-row md:items-center md:gap-4.5',
          dragging ? 'bg-primary/10' : '',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span className="flex size-icon-tile shrink-0 items-center justify-center rounded-icon-tile border border-primary/20 bg-primary/10 text-primary">
            <Upload aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">{t('jobs.drop')}</h2>
            <p className="text-xs text-muted-foreground">{t('jobs.uploadHint')}</p>
          </div>
        </div>
        <Button variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()}>
          <Upload aria-hidden="true" className="size-4" />
          {isUploading ? t('jobs.uploading') : t('jobs.choose')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          aria-label={t('jobs.chooseLabel')}
          onChange={(event) => {
            send(event.target.files)
            event.target.value = ''
          }}
        />
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm">
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              <Badge tone={TONE[item.state]}>{t(`jobs.uploadState.${item.state}`)}</Badge>
              <span className="truncate">{item.name}</span>
              {item.message ? (
                <span className="text-xs text-destructive">{item.message}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  )
}
