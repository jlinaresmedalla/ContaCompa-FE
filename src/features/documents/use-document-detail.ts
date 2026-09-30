import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { useDeleteDoc, usePurchaseDoc } from './hooks'

export function useDocumentDetail() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const doc = usePurchaseDoc(id)
  const remove = useDeleteDoc()
  const navigate = useNavigate()
  const [fileIndex, setFileIndex] = useState(0)
  const title = doc.data?.doc_number ?? '?'
  const file = doc.data?.documents[fileIndex] ?? doc.data?.documents[0]
  const confirmDelete = () => {
    if (!doc.data || !window.confirm(t('documents.confirmDelete', { name: title }))) return
    remove.mutate(doc.data.id, { onSuccess: () => void navigate(PATHS.purchaseDocs) })
  }
  return { doc, remove, fileIndex, setFileIndex, file, title, confirmDelete }
}
