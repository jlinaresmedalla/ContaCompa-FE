import { useEffect, useState } from 'react'

const SESSION_REFRESH_MS = 60_000

export function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), SESSION_REFRESH_MS)
    return () => clearInterval(timer)
  }, [])
  return now
}
