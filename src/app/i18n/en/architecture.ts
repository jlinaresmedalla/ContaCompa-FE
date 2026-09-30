export const EN_ARCHITECTURE = {
  flowsLabel: 'Architecture flows',
  textAlternative: 'Read the architecture as text',
  flows: {
    overview: {
      label: 'Overview',
      note: 'Explore every component and connection.',
      items: [
        'Render starts migrations, worker and API in one container.',
        'Neon hosts Postgres and a private bucket; Pages serves the dashboard.',
        'Entrypoints call application services; infrastructure holds database, storage and provider adapters.',
      ],
    },
    auth: {
      label: 'Sign-in and keys',
      note: 'The owner mints a 12-hour key; each request resolves the company from its hash.',
      items: [
        'POST /v1/api-keys with X-Admin-Key creates a 12-hour key.',
        'GET /v1/me validates the key; a 401 signs out.',
        'Only a SHA-256 hash is stored; keys never appear in logs.',
      ],
    },
    intake: {
      label: 'Upload path',
      note: 'The route inspects the file; intake stores it and commits the document and job together.',
      items: [
        'The API inspects the uploaded file before accepting it.',
        'The intake service stores the file in the private bucket.',
        'Document and job are committed in one database transaction.',
      ],
    },
    job: {
      label: 'Extraction job',
      note: 'The worker claims a job, AI extracts it and one transaction writes the result.',
      items: [
        'The worker claims a queued job and calls the extraction pipeline.',
        'The pipeline calls AI and records a LangSmith trace.',
        'Three provider outages pause claiming for 60 seconds, doubling up to 10 minutes; one trial job resumes it.',
      ],
    },
    core: {
      label: 'Pure core',
      note: 'Dependencies point inward: the domain imports nothing.',
      items: [
        'API, worker and CLI entrypoints call application services and pipeline.',
        'Domain owns schemas, rules and IGV checks without I/O.',
        'Database, storage and provider adapters live in infrastructure.',
      ],
    },
  },
  nodes: {
    owner: {
      label: 'Owner',
      role: 'Mints a 12-hour company key using the admin key in Swagger.',
    },
    dashboard: {
      label: 'React dashboard',
      role: 'Validates the company key and sends authenticated requests from Cloudflare Pages.',
    },
    api: {
      label: 'HTTP API',
      role: 'Guards requests with the company key and calls application services.',
    },
    worker: {
      label: 'Worker',
      role: 'Claims queued jobs and pauses during provider outages.',
    },
    services: {
      label: 'Services',
      role: 'Coordinates intake, persistence and extraction in application use cases.',
    },
    pipeline: {
      label: 'Pipeline',
      role: 'Calls AI for structured extraction and traces runs in LangSmith.',
    },
    domain: {
      label: 'Domain',
      role: 'Pure rules, schemas and IGV checks; no imports or I/O.',
    },
    postgres: {
      label: 'PostgreSQL',
      role: 'Stores companies, key hashes, documents and jobs in Neon.',
    },
    blob: {
      label: 'Object storage',
      role: 'Private Neon bucket accessed through the S3 API; files are served through the HTTP API.',
    },
    AI: {
      label: 'AI API',
      role: 'Extracts structured purchase document data.',
    },
    langsmith: {
      label: 'LangSmith',
      role: 'Records extraction traces for observability.',
    },
  },
  connections: {
    mint: 'Mint key · X-Admin-Key',
    http: 'HTTPS · X-API-Key',
    'api-uc': 'Use case',
    'worker-uc': 'Process job',
    sql: 'SQL · one transaction',
    files: 'Store / read',
    extract: 'Extract',
    rules: 'Checks',
    schema: 'Schema',
    llm: 'Structured output',
    'llm-trace': 'Trace run',
  },
  boundaries: [
    'Cloudflare Pages',
    'Render Free · Ohio · one container (deploy/start.sh)',
    'Neon Free · AWS US East 2',
  ],
}
