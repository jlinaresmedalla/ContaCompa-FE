const MONEY_DIGITS = 2
const USD_DIGITS = 4
const NUMBER_MAX_DIGITS = 6
const MS_PER_SECOND = 1000
export function money(value: string | number | null | undefined, currency = 'PEN'): string {
  if (value === null || value === undefined || value === '') return '—'
  const symbol = currency === 'USD' ? 'US$' : 'S/'
  return `${symbol} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: MONEY_DIGITS, maximumFractionDigits: MONEY_DIGITS })}`
}

export function usd(value: string | number, digits = USD_DIGITS): string {
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

export function number(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: NUMBER_MAX_DIGITS })
}

export function dateTime(value: string | null | undefined, locale?: string): string {
  return value ? new Date(value).toLocaleString(locale) : '—'
}

export function seconds(from: string, to: string | null): string {
  if (!to) return '—'
  return `${((new Date(to).getTime() - new Date(from).getTime()) / MS_PER_SECOND).toFixed(1)} s`
}
