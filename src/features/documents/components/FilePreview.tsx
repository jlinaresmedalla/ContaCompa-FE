import { ErrorNote } from '@/components/ui/input'
import { toApiError } from '@/lib/http'

import { useFileUrl } from '../hooks'
import { FilePreviewSkeleton } from './FilePreviewSkeleton'

export function FilePreview({ documentId, filename }: { documentId: string; filename: string }) {
  const file = useFileUrl(documentId)
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
  return (
    <a href={file.url} target="_blank" rel="noreferrer" title={filename}>
      <img src={file.url} alt={filename} className="w-full rounded-lg border border-border" />
    </a>
  )
}
