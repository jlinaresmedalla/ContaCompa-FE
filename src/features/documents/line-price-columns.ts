const PRICE_PAIRS = {
  with: [
    {
      field: 'unit_price',
      derived: 'unit_price_with_igv',
      includes: true,
      heading: 'prices.unitWith',
      short: 'prices.short.unitWith',
    },
    {
      field: 'line_total',
      derived: 'line_total_with_igv',
      includes: true,
      heading: 'prices.totalWith',
      short: 'prices.short.totalWith',
    },
  ],
  without: [
    {
      field: 'unit_price',
      derived: 'unit_price_without_igv',
      includes: false,
      heading: 'prices.unitWithout',
      short: 'prices.short.unitWithout',
    },
    {
      field: 'line_total',
      derived: 'line_total_without_igv',
      includes: false,
      heading: 'prices.totalWithout',
      short: 'prices.short.totalWithout',
    },
  ],
} as const

export function linePriceColumns(includesIgv: boolean | null) {
  return includesIgv === true
    ? [...PRICE_PAIRS.with, ...PRICE_PAIRS.without]
    : [...PRICE_PAIRS.without, ...PRICE_PAIRS.with]
}
