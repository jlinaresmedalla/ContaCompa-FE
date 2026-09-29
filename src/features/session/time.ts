/** Whole minutes left until `expiresAt`, never negative. */
export function minutesLeft(expiresAt: string, now: number): number {
  const minutes = Math.floor((new Date(expiresAt).getTime() - now) / 60_000)
  return Number.isNaN(minutes) ? 0 : Math.max(0, minutes)
}

/** "5 h 12 min", "12 min", "0 min". Display only; the API decides when a key expires. */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? `${hours} h ${minutes % 60} min` : `${minutes} min`
}
