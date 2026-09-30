import { usePinchZoom } from './usePinchZoom'
import { usePhoneWidth } from '@/lib/usePhoneWidth'
import { ErrorNote } from '@/components/molecules'
import { toApiError } from '@/lib/http'

import { useFileUrl } from './useFileUrl'
import { FilePreviewSkeleton } from '../FilePreviewSkeleton'

const PERCENT_SCALE = 100

export function FilePreview({ documentId, filename }: { documentId: string; filename: string }) {
  const file = useFileUrl(documentId)
  const phone = usePhoneWidth()
  const { scale, viewportRef, ...touchHandlers } = usePinchZoom()
  if (file.error) return <ErrorNote message={toApiError(file.error).message} />
  if (file.isLoading || !file.url) return <FilePreviewSkeleton />
  if (file.type === 'application/pdf')
    return (
      <iframe
        title={filename}
        src={file.url}
        className="h-[75vh] w-full rounded-lg border border-border"
      />
    )
  if (phone)
    return (
      <div
        className="max-h-[65dvh] overflow-auto rounded-control border border-border bg-muted"
        ref={viewportRef}
        {...touchHandlers}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <img
          src={file.url}
          alt={filename}
          draggable={false}
          className="max-w-none"
          style={{ width: `${scale * PERCENT_SCALE}%` }}
        />
      </div>
    )
  return (
    <a href={file.url} target="_blank" rel="noreferrer" title={filename}>
      <img src={file.url} alt={filename} className="w-full rounded-lg border border-border" />
    </a>
  )
}
