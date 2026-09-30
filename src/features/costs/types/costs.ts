export type CostLine = {
  docs: number
  input_tokens: number
  output_tokens: number
  billed_usd: string
  list_usd: string
  list_usd_per_doc: string
}

export type CostReport = {
  today: CostLine
  month: CostLine
  total: CostLine
  by_model: (CostLine & { model: string })[]
  by_day: (CostLine & { day: string })[]
}
