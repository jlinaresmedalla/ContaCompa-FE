import { useRef, useState } from 'react'
import { useUploadFiles } from './hooks'

export function useUploadDropzone() {
  const { items, upload, isUploading } = useUploadFiles()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const send = (files: FileList | null) => {
    if (files?.length && !isUploading) void upload(Array.from(files))
  }
  return { items, isUploading, dragging, setDragging, inputRef, send }
}
