import { useState } from 'react'

export const STORAGE_KEYS = { previewVisible: 'contacompa.documents.preview-visible' } as const

function readPreviewVisible(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.previewVisible) === 'true'
  } catch {
    return false
  }
}

export function usePreviewToggle() {
  const [previewVisible, setPreviewVisible] = useState(readPreviewVisible)
  const togglePreview = () => {
    const next = !previewVisible
    try {
      localStorage.setItem(STORAGE_KEYS.previewVisible, String(next))
    } catch {
      // Private mode: the preference lasts only until this page unmounts.
    }
    setPreviewVisible(next)
  }
  return { previewVisible, togglePreview }
}
