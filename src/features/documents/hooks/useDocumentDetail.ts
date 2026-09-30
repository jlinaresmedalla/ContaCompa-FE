import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { useDeleteDoc } from './useDeleteDoc'
import { usePurchaseDoc } from './usePurchaseDoc'

export function useDocumentDetail() {
  const { id = '' } = useParams()
  const doc = usePurchaseDoc(id)
  const remove = useDeleteDoc()
  const navigate = useNavigate()
  const [fileIndex, setFileIndex] = useState(0)
  const title = doc.data?.doc_number ?? '?'
  const file = doc.data?.documents[fileIndex] ?? doc.data?.documents[0]
  const [deleteOpen, setDeleteOpen] = useState(false)
  const confirmDelete = () => {
    if (!doc.data) return
    remove.mutate(doc.data.id, { onSuccess: () => void navigate(PATHS.purchaseDocs) })
  }
  return {
    doc,
    remove,
    fileIndex,
    setFileIndex,
    file,
    title,
    confirmDelete,
    deleteOpen,
    setDeleteOpen,
  }
}
