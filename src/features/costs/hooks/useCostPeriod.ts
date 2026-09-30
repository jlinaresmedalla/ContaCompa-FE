import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const REPORT_PERIODS = ['7', '30', '90'] as const
const DEFAULT_REPORT_PERIOD = '30'

export function useCostPeriod() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<string>(DEFAULT_REPORT_PERIOD)
  return {
    period,
    setPeriod,
    days: Number(period),
    options: REPORT_PERIODS.map((value) => ({
      value,
      label: t('costs.lastDays', { count: Number(value) }),
    })),
  }
}
