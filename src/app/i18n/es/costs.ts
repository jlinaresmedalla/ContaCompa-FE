import type { Messages } from '../en'

export const ES_COSTS: Pick<Messages, 'costs'> = {
  costs: {
    period: 'Período del reporte',
    lastDays: 'Últimos {{count}} días',
    explanation:
      'Facturado es el costo real, que es cero con el plan gratuito de AI. Precio de lista es lo que cuestan los mismos tokens con un plan pagado. Usa ese monto para cotizar a un cliente.',
    today: 'Hoy · precio de lista',
    month: 'Este mes · precio de lista',
    total: 'Acumulado · precio de lista',
    perDoc: 'Por comprobante · precio de lista',
    per1000: '≈ {{value}} por cada 1,000 comprobantes',
    summary_one: '{{count}} comp. · {{tokens}} tokens',
    summary_other: '{{count}} comp. · {{tokens}} tokens',
    billedSummary: 'Facturado {{billed}}',
    quoteAmount: '≈ {{value}}',
    quoteDocs: 'por cada 1,000 comprobantes',
    perDay: 'Comprobantes por día',
    last30: 'Últimos 30 días',
    chartLabel: 'Comprobantes procesados por día',
    daySummary: '{{date}}: {{docs}} · {{tokens}} tokens · precio de lista {{cost}}',
    byModel: 'Por modelo',
    columns: {
      model: 'Modelo',
      docs: 'Comprobantes',
      input: 'Tokens de entrada',
      output: 'Tokens de salida',
      billed: 'Facturado',
      list: 'Precio de lista',
      perDoc: 'Por comprobante',
    },
  },
}
