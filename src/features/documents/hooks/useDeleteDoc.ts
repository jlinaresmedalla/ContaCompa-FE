import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DOCUMENT_API, DOCUMENT_KEYS } from '../api/purchaseDocsApi'

export function useDeleteDoc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => DOCUMENT_API.remove(id),
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: DOCUMENT_KEYS.detail(id) })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() }),
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.report() }),
        queryClient.invalidateQueries({ queryKey: ['monitor'] }),
      ])
    },
  })
}
