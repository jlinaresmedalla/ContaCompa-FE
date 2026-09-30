import type { EN_ARCHITECTURE } from '../en/architecture'

export const ES_ARCHITECTURE: typeof EN_ARCHITECTURE = {
  flowsLabel: 'Flujos de la arquitectura',
  textAlternative: 'Leer la arquitectura en texto',
  flows: {
    overview: {
      label: 'Vista general',
      note: 'Explora todos los componentes y sus conexiones.',
      items: [
        'Render ejecuta las migraciones, el procesador y la API en un contenedor.',
        'Neon aloja Postgres y un bucket privado; Pages sirve el panel.',
        'Los puntos de entrada llaman a los servicios; infraestructura reúne los adaptadores de base de datos, archivos y proveedores.',
      ],
    },
    auth: {
      label: 'Acceso y claves',
      note: 'El propietario emite una clave de 12 horas; cada solicitud identifica a la empresa mediante su hash.',
      items: [
        'POST /v1/api-keys con X-Admin-Key crea una clave de 12 horas.',
        'GET /v1/me valida la clave; un 401 cierra la sesión.',
        'Solo se guarda un hash SHA-256; las claves nunca aparecen en los registros.',
      ],
    },
    intake: {
      label: 'Carga de archivos',
      note: 'La ruta inspecciona el archivo; el servicio lo guarda y registra el comprobante y su procesamiento juntos.',
      items: [
        'La API inspecciona el archivo antes de aceptarlo.',
        'El servicio de recepción guarda el archivo en el bucket privado.',
        'El comprobante y su procesamiento se registran en una sola transacción.',
      ],
    },
    job: {
      label: 'Procesamiento de extracción',
      note: 'El procesador toma un trabajo, Gemini extrae los datos y una transacción guarda el resultado.',
      items: [
        'El procesador toma un trabajo de la cola y llama al flujo de extracción.',
        'El flujo llama a Gemini y registra una traza en LangSmith.',
        'Tres fallas del proveedor pausan la cola por 60 segundos, duplicándose hasta 10 minutos; un trabajo de prueba permite reanudarla.',
      ],
    },
    core: {
      label: 'Núcleo puro',
      note: 'Las dependencias apuntan hacia dentro: el dominio no importa nada.',
      items: [
        'Los puntos de entrada de API, procesador y CLI llaman a los servicios y al flujo de extracción.',
        'El dominio contiene esquemas, reglas y validaciones de IGV sin entrada ni salida.',
        'Los adaptadores de base de datos, archivos y proveedores viven en infraestructura.',
      ],
    },
  },
  nodes: {
    owner: {
      label: 'Propietario',
      role: 'Emite una clave de empresa de 12 horas con la clave de administración desde Swagger.',
    },
    dashboard: {
      label: 'Panel React',
      role: 'Valida la clave de la empresa y envía solicitudes autenticadas desde Cloudflare Pages.',
    },
    api: {
      label: 'API HTTP',
      role: 'Protege las solicitudes con la clave de empresa y llama a los servicios de aplicación.',
    },
    worker: {
      label: 'Procesador',
      role: 'Toma procesamientos de la cola y se pausa cuando falla el proveedor.',
    },
    services: {
      label: 'Servicios',
      role: 'Coordina la recepción, el guardado y la extracción en los casos de uso.',
    },
    pipeline: {
      label: 'Flujo de extracción',
      role: 'Llama a Gemini para extraer datos estructurados y registra las ejecuciones en LangSmith.',
    },
    domain: {
      label: 'Dominio',
      role: 'Reglas, esquemas y validaciones de IGV puros, sin dependencias ni entrada o salida.',
    },
    postgres: {
      label: 'PostgreSQL',
      role: 'Guarda empresas, hashes de claves, comprobantes y procesamientos en Neon.',
    },
    blob: {
      label: 'Almacenamiento de archivos',
      role: 'Bucket privado de Neon, accesible por la API S3; los archivos se entregan mediante la API HTTP.',
    },
    gemini: {
      label: 'API de Gemini',
      role: 'Extrae los datos estructurados de los comprobantes de compra.',
    },
    langsmith: {
      label: 'LangSmith',
      role: 'Registra trazas de extracción para observar las ejecuciones.',
    },
  },
  connections: {
    mint: 'Emitir clave · X-Admin-Key',
    http: 'HTTPS · X-API-Key',
    'api-uc': 'Caso de uso',
    'worker-uc': 'Procesar',
    sql: 'SQL · una transacción',
    files: 'Guardar / leer',
    extract: 'Extraer',
    rules: 'Validaciones',
    schema: 'Esquema',
    llm: 'Datos estructurados',
    'llm-trace': 'Registrar traza',
  },
  boundaries: [
    'Cloudflare Pages',
    'Render gratuito · Ohio · un contenedor (deploy/start.sh)',
    'Neon gratuito · AWS US East 2',
  ],
}
