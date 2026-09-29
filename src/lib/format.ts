export function money(value: string | number | null | undefined, currency = 'PEN'): string {
  if (value === null || value === undefined || value === '') return '—'
  const symbol = currency === 'USD' ? 'US$' : 'S/'
  return `${symbol} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function usd(value: string | number, digits = 4): string {
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

export function number(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export function dateTime(value: string | null | undefined, locale?: string): string {
  return value ? new Date(value).toLocaleString(locale) : '—'
}

export function seconds(from: string, to: string | null): string {
  if (!to) return '—'
  return `${((new Date(to).getTime() - new Date(from).getTime()) / 1000).toFixed(1)} s`
}
