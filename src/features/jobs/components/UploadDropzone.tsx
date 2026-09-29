import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'

import { useUploadFiles } from '../hooks'
import type { UploadItem } from '../types'

const ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
const tone: Record<UploadItem['state'], BadgeTone> = {
  uploading: 'neutral',
  queued: 'info',
  duplicate: 'warning',
  error: 'danger',
}

export function UploadDropzone() {
  const { t } = useTranslation()
  const { items, upload, isUploading } = useUploadFiles()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const send = (list: FileList | null) => {
    if (list && list.length > 0) void upload(Array.from(list))
  }

  return (
    <Card>
      <CardTitle hint={t('jobs.uploadHint')}>{t('jobs.upload')}</CardTitle>
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
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm',
          dragging ? 'border-primary bg-primary/10' : 'border-border',
        )}
      >
        <span className="text-muted-foreground">{t('jobs.drop')}</span>
        <Button disabled={isUploading} onClick={() => inputRef.current?.click()}>
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
              <Badge tone={tone[item.state]}>{t(`jobs.uploadState.${item.state}`)}</Badge>
              <span className="truncate">{item.name}</span>
              {item.message ? <span className="text-xs text-danger">{item.message}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  )
}
