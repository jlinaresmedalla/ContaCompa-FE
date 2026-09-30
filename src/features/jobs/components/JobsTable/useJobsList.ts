import { useState } from 'react'

import type { JobRow, JobStatus } from '../../types/jobs'

export function useJobsList(jobs: JobRow[] | undefined) {
  const [status, setStatus] = useState<JobStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [issuesOnly, setIssuesOnly] = useState(false)
  const [oldestFirst, setOldestFirst] = useState(false)
  const query = search.trim().toLocaleLowerCase()
  const rows = (jobs ?? [])
    .filter(
      (job) =>
        (status === 'all' || job.status === status) &&
        (!issuesOnly || job.observations > 0 || Boolean(job.last_error)) &&
        `${job.filename} ${job.doc_number ?? ''}`.toLocaleLowerCase().includes(query),
    )
    .sort((left, right) => {
      const order = left.created_at.localeCompare(right.created_at)
      return oldestFirst ? order : -order
    })
  function clearFilters() {
    setStatus('all')
    setSearch('')
    setIssuesOnly(false)
  }
  return {
    rows,
    status,
    setStatus,
    search,
    setSearch,
    issuesOnly,
    setIssuesOnly,
    oldestFirst,
    setOldestFirst,
    clearFilters,
  }
}
