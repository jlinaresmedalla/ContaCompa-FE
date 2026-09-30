import { useState } from 'react'

export const STORAGE_KEYS = { previewVisible: 'contacompa.documents.preview-visible' } as const

function readPreviewVisible(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.previewVisible) === 'true'
  } catch {
    return false
  }
}

export function usePreviewToggle(phone = false) {
  const [storedVisible, setStoredVisible] = useState(readPreviewVisible)
  const [phoneVisible, setPhoneVisible] = useState(false)
  const previewVisible = phone ? phoneVisible : storedVisible
  const togglePreview = () => {
    const next = !previewVisible
    try {
      localStorage.setItem(STORAGE_KEYS.previewVisible, String(next))
    } catch {
      // Private mode: the preference lasts only until this page unmounts.
    }
    setStoredVisible(next)
    if (phone) setPhoneVisible(next)
  }
  return { previewVisible, togglePreview }
}
