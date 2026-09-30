import { ES_ARCHITECTURE } from './architecture'
import type { Messages } from '../en'

export const ES_HOME: Pick<Messages, 'home'> = {
  home: {
    diagram: ES_ARCHITECTURE,
    headline: 'Tus comprobantes,',
    headlineAccent: 'leídos por ti.',
    intro:
      'Sube un PDF o una foto tomada con tu celular. Contacompa extrae cada ítem, señala lo que necesita revisión y entrega un archivo de Excel a tu contador.',
    seeArchitecture: 'Conoce cómo está construido',
    howItWorks: 'Cómo funciona',
    stepsTitle: 'Del papel a Excel en cuatro pasos.',
    steps: {
      upload: {
        title: 'Sube tus archivos',
        description: 'Sube PDFs o fotos desde tu celular, un archivo o una carpeta completa.',
      },
      extract: {
        title: 'Extrae los datos',
        description:
          'AI lee el proveedor, RUC, ítems e importes del comprobante y los organiza en un esquema definido.',
      },
      review: {
        title: 'Revisa las alertas',
        description:
          'Las validaciones señalan las diferencias. Solo abres los comprobantes que necesitan revisión.',
      },
      export: {
        title: 'Exporta a Excel',
        description: 'Con un clic, tu contador recibe un archivo de Excel.',
      },
    },
    overview: {
      interface: { title: 'Interfaz en React', description: 'Sube, revisa y exporta' },
      service: { title: 'Servicio FastAPI', description: 'API tipada, una transacción' },
      queue: { title: 'Cola en Postgres', description: 'Procesa sin bloquear la solicitud' },
      extraction: {
        title: 'Extracción con AI',
        description: 'Esquema definido y costos registrados',
      },
    },
    architecture: 'Tecnologías',
    architectureIntro:
      'Una interfaz en React, un servicio en FastAPI y una cola de procesamientos en Postgres.',
    architectureAlt:
      'Arquitectura de Contacompa: panel en React, servicio FastAPI, cola de procesamientos en Postgres y extracción con AI, alojados en Cloudflare Pages, Render y Neon.',
    stackLabel: 'Tecnologías utilizadas',
    stack: {
      fastapi: 'FastAPI',
      AI: 'AI',
      react: 'React',
      render: 'Render',
      neon: 'Neon',
      cloudflare: 'Cloudflare Pages',
      postgres: 'Cola de procesamientos en Postgres',
    },
  },
}
