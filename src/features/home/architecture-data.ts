export interface ArchitectureData {
  schema_version: number
  diagram_type: string
  meta: {
    title: string
    locale: string
    quality_profile: string
    views: readonly { id: string; label: string; focus: readonly string[]; note: string }[]
  }
  components: readonly {
    id: string
    type: string
    label: string
    sublabel: string
    pos: readonly [number, number]
    size: readonly [number, number]
    tag?: string
  }[]
  boundaries: readonly { kind: string; label: string; wraps: readonly string[] }[]
  connections: readonly {
    id: string
    from: string
    to: string
    label: string
    variant?: string
    labelAt?: readonly [number, number]
    fromSide?: string
    toSide?: string
  }[]
  cards: readonly { dot: string; title: string; items: readonly string[] }[]
}

// Copy of backend docs/architecture/architecture.archify.json; update together.
export const ARCHITECTURE = {
  schema_version: 1,
  diagram_type: 'architecture',
  meta: {
    title: 'Contacompa backend',
    locale: 'en',
    quality_profile: 'showcase',
    views: [
      {
        id: 'auth',
        label: 'Sign-in and keys',
        focus: ['owner', 'dashboard', 'api', 'services', 'postgres'],
        note: 'The owner mints a 12-hour key with the admin key; the dashboard signs in with it and each request resolves the company from its hash.',
      },
      {
        id: 'intake',
        label: 'Upload path (API)',
        focus: ['dashboard', 'api', 'services', 'postgres', 'blob'],
        note: 'The route sniffs the file; the intake service stores the blob and commits document plus job in one transaction.',
      },
      {
        id: 'job',
        label: 'Extraction job (worker)',
        focus: ['worker', 'services', 'pipeline', 'domain', 'AI', 'postgres'],
        note: 'Worker claims a job, pipeline calls AI, one transaction writes the result. A breaker pauses claiming during AI outages (ADR 0021).',
      },
      {
        id: 'core',
        label: 'Pure core',
        focus: ['services', 'pipeline', 'domain'],
        note: 'Dependencies point inward: domain imports nothing; adapters are called from services and pipeline.',
      },
    ],
  },
  components: [
    {
      id: 'owner',
      type: 'external',
      label: 'Owner',
      sublabel: 'Swagger · admin key',
      pos: [310, 30],
      size: [160, 64],
    },
    {
      id: 'dashboard',
      type: 'frontend',
      label: 'React dashboard',
      sublabel: 'Pages · API-key sign-in',
      pos: [40, 170],
      size: [160, 64],
    },
    {
      id: 'api',
      type: 'backend',
      label: 'HTTP API',
      sublabel: 'entrypoints/api/ · key guard',
      pos: [310, 170],
      size: [160, 64],
    },
    {
      id: 'worker',
      type: 'backend',
      label: 'Worker',
      sublabel: 'worker.py · provider breaker',
      pos: [310, 320],
      size: [160, 64],
    },
    {
      id: 'services',
      type: 'backend',
      label: 'Services',
      sublabel: 'application/services/',
      pos: [540, 170],
      size: [170, 64],
    },
    {
      id: 'pipeline',
      type: 'backend',
      label: 'Pipeline',
      sublabel: 'application/pipeline/',
      pos: [540, 410],
      size: [170, 64],
    },
    {
      id: 'domain',
      type: 'backend',
      label: 'Domain',
      sublabel: 'domain/ · rules, checks, IGV',
      pos: [770, 290],
      size: [170, 64],
      tag: 'no I/O',
    },
    {
      id: 'postgres',
      type: 'database',
      label: 'PostgreSQL',
      sublabel: 'Neon Free · infrastructure/db/',
      pos: [1000, 90],
      size: [170, 64],
    },
    {
      id: 'blob',
      type: 'database',
      label: 'Object Storage',
      sublabel: 'Neon bucket · S3 API',
      pos: [1000, 200],
      size: [170, 64],
      tag: 'private',
    },
    {
      id: 'AI',
      type: 'cloud',
      label: 'AI API',
      sublabel: 'infrastructure/providers/',
      pos: [1000, 410],
      size: [170, 64],
    },
    {
      id: 'langsmith',
      type: 'cloud',
      label: 'LangSmith',
      sublabel: 'infrastructure/observability/',
      pos: [1000, 520],
      size: [170, 64],
    },
  ],
  boundaries: [
    { kind: 'region', label: 'Cloudflare Pages', wraps: ['dashboard'] },
    {
      kind: 'region',
      label: 'Render Free · Ohio · one container (deploy/start.sh)',
      wraps: ['api', 'worker', 'services', 'pipeline', 'domain'],
    },
    { kind: 'region', label: 'Neon Free · AWS US East 2', wraps: ['postgres', 'blob'] },
  ],
  connections: [
    {
      id: 'mint',
      from: 'owner',
      to: 'api',
      label: 'mint key · X-Admin-Key',
      variant: 'security',
      labelAt: [390, 112],
    },
    { id: 'http', from: 'dashboard', to: 'api', label: 'HTTPS · X-API-Key', variant: 'emphasis' },
    { id: 'api-uc', from: 'api', to: 'services', label: 'use case', variant: 'emphasis' },
    { id: 'worker-uc', from: 'worker', to: 'services', label: 'process job' },
    { id: 'sql', from: 'services', to: 'postgres', label: 'SQL · one tx', variant: 'emphasis' },
    { id: 'files', from: 'services', to: 'blob', label: 'put / get' },
    { id: 'extract', from: 'services', to: 'pipeline', label: 'extract', labelAt: [625, 330] },
    { id: 'rules', from: 'services', to: 'domain', label: 'checks' },
    { id: 'schema', from: 'pipeline', to: 'domain', label: 'schema' },
    { id: 'llm', from: 'pipeline', to: 'AI', label: 'structured output' },
    {
      id: 'llm-trace',
      from: 'pipeline',
      to: 'langsmith',
      label: 'trace run',
      variant: 'dashed',
      fromSide: 'bottom',
      toSide: 'left',
    },
  ],
  cards: [
    {
      dot: 'cyan',
      title: 'Sign-in and keys',
      items: [
        'Owner mints a 12 h key: POST /v1/api-keys with X-Admin-Key',
        'Dashboard validates the key with GET /v1/me; a 401 signs out',
        'Only a sha256 hash is stored; keys never appear in logs',
      ],
    },
    {
      dot: 'emerald',
      title: 'Hosted topology (free, no card)',
      items: [
        'Render container: start.sh runs migrations, worker and API',
        'Neon: Postgres and a private bucket, files served only via the API',
        'Pages serves the dashboard; CORS_ORIGINS allows its origin',
      ],
    },
    {
      dot: 'violet',
      title: 'Layers (ADR 0013)',
      items: [
        'entrypoints/ (api, worker, cli) call application/ services and pipeline',
        'domain/ imports nothing; infrastructure/ holds db, blob, providers',
        'Worker breaker: 3 provider outages pause claiming (60 s, doubling to 10 min), one trial job resumes it; GET /v1/monitor shows the state',
      ],
    },
  ],
} as const satisfies ArchitectureData
