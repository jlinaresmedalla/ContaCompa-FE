type MoneyValue = string | number | null | undefined

// Unit prices share precision; costs retain small extraction charges.
const UNIT_MIN_DIGITS = 2
const MONEY_DIGITS = { printedPrice: 4, derivedPrice: 4, total: 2, cost: 4 } as const
export type MoneyKind = keyof typeof MONEY_DIGITS

export function formatMoney(value: MoneyValue, kind: MoneyKind, currency = 'PEN'): string {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  const digits = MONEY_DIGITS[kind]
  const symbol = currency === 'PEN' ? 'S/' : currency === 'USD' ? 'US$' : currency
  return `${symbol}\u00a0${amount.toLocaleString('en-US', {
    minimumFractionDigits:
      kind === 'printedPrice' || kind === 'derivedPrice' ? UNIT_MIN_DIGITS : digits,
    maximumFractionDigits: digits,
  })}`
}

export const formatPrintedPrice = (value: MoneyValue, currency = 'PEN') =>
  formatMoney(value, 'printedPrice', currency)
export const formatDerivedPrice = (value: MoneyValue, currency = 'PEN') =>
  formatMoney(value, 'derivedPrice', currency)
export const formatTotal = (value: MoneyValue, currency = 'PEN') =>
  formatMoney(value, 'total', currency)
export const formatCost = (value: MoneyValue, currency = 'USD') =>
  formatMoney(value, 'cost', currency)
