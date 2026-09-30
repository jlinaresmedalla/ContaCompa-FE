import { useState } from 'react'
import type { PurchaseDocSummary } from '../types/purchaseDocs'

/** The API paginates without a search parameter; search only the loaded page. */
export function useDocumentSearch(docs: PurchaseDocSummary[] | undefined) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLocaleLowerCase()
  const matches = query
    ? docs?.filter((doc) =>
        [doc.doc_number, doc.supplier?.legal_name, doc.supplier?.ruc].some((value) =>
          value?.toLocaleLowerCase().includes(query),
        ),
      )
    : docs
  return { search, setSearch, matches, hasSearch: Boolean(query) }
}
