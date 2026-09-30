const MS_PER_MINUTE = 60_000
const MINUTES_PER_HOUR = 60
/** Whole minutes left until `expiresAt`, never negative. */
export function minutesLeft(expiresAt: string, now: number): number {
  const minutes = Math.floor((new Date(expiresAt).getTime() - now) / MS_PER_MINUTE)
  return Number.isNaN(minutes) ? 0 : Math.max(0, minutes)
}

/** "5 h 12 min", "12 min", "0 min". Display only; the API decides when a key expires. */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  return hours > 0 ? `${hours} h ${minutes % MINUTES_PER_HOUR} min` : `${minutes} min`
}
