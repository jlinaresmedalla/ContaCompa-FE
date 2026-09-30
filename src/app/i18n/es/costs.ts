import type { Messages } from '../en'

export const ES_COSTS: Pick<Messages, 'costs'> = {
  costs: {
    period: 'Período del reporte',
    lastDays: 'Últimos {{count}} días',
    intro:
      '<b>Facturado</b> es el costo real, que es cero con el plan gratuito de Gemini. <b>Precio de lista</b> es lo que cuestan los mismos tokens con un plan pagado. Usa ese monto para cotizar a un cliente.',
    today: 'Hoy · precio de lista',
    month: 'Este mes · precio de lista',
    total: 'Acumulado · precio de lista',
    perDoc: 'Por comprobante · precio de lista',
    per1000: '≈ {{value}} por cada 1,000 comprobantes',
    summary: '{{docs}} comprobantes · {{tokens}} tokens · facturado {{billed}}',
    perDay: 'Comprobantes por día',
    last30: 'Últimos 30 días',
    chartLabel: 'Comprobantes procesados por día',
    daySummary: '{{date}}: {{docs}} comprobantes · {{tokens}} tokens · precio de lista {{cost}}',
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
