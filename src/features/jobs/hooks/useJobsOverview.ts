import { useQuery } from '@tanstack/react-query'

import { JOBS_API, JOBS_KEYS } from '../api/jobsApi'

const POLL_MS = 2_000

/** Polls while anything is queued or processing, then stops. */
export function useJobsOverview() {
  return useQuery({
    queryKey: JOBS_KEYS.all,
    queryFn: ({ signal }) => JOBS_API.get(signal),
    refetchInterval: (query) => {
      const counts = query.state.data?.counts
      return counts && counts.queued + counts.processing > 0 ? POLL_MS : false
    },
  })
}
