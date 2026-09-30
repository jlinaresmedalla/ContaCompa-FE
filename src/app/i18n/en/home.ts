import { EN_ARCHITECTURE } from './architecture'
export const EN_HOME = {
  home: {
    diagram: EN_ARCHITECTURE,
    headline: 'Purchase documents,',
    headlineAccent: 'read for you.',
    intro:
      'Upload a PDF or a phone photo. Contacompa extracts every line, flags what looks wrong, and hands your accountant an Excel file.',
    seeArchitecture: 'See how it’s built',
    howItWorks: 'How it works',
    stepsTitle: 'From paper to Excel in four steps.',
    steps: {
      upload: {
        title: 'Upload',
        description: 'Drop PDFs or phone photos, one file or a whole folder.',
      },
      extract: {
        title: 'Extract',
        description: 'AI reads supplier, RUC, lines and totals into a strict schema.',
      },
      review: {
        title: 'Review',
        description: 'Checks flag mismatches. You only open what’s flagged.',
      },
      export: { title: 'Export', description: 'One click gives your accountant an Excel file.' },
    },
    overview: {
      interface: { title: 'React interface', description: 'Upload, review, export' },
      service: { title: 'FastAPI service', description: 'Typed API, one transaction' },
      queue: { title: 'Postgres job queue', description: 'Long work runs off the request' },
      extraction: { title: 'AI extraction', description: 'Strict schema, measured cost' },
    },
    architecture: 'Architecture and stack',
    architectureIntro:
      'A React interface, a FastAPI service and a Postgres job queue connect uploads to AI extraction.',
    architectureAlt:
      'Contacompa architecture: React dashboard, FastAPI service, Postgres job queue and AI extraction, hosted on Cloudflare Pages, Render and Neon.',
    stackLabel: 'Technology stack',
    stack: {
      fastapi: 'FastAPI',
      AI: 'AI',
      react: 'React',
      render: 'Render',
      neon: 'Neon',
      cloudflare: 'Cloudflare Pages',
      postgres: 'Postgres job queue',
    },
  },
}
