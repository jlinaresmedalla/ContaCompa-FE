import type { Messages } from '../en'

export const ES_JOBS: Pick<Messages, 'jobs' | 'jobStatus' | 'jobStatusHint'> = {
  jobs: {
    paused:
      'Extracción en pausa: el proveedor del modelo no está disponible.{{next}} La espera no consume intentos de procesamiento.',
    pausedNext: ' Próximo intento: {{time}} (hora local).',
    upload: 'Subir archivos',
    uploadHint: 'PDF, JPG o PNG · el servidor define el tamaño máximo',
    drop: 'Arrastra los archivos aquí o',
    choose: 'Elegir archivos',
    uploading: 'Subiendo…',
    chooseLabel: 'Elegir archivos para subir',
    latest: 'Procesamientos recientes',
    refreshing: 'Se actualiza cada 2 segundos · {{count}} en curso',
    idle: 'Sin procesamientos en curso',
    empty: 'Aún no hay archivos subidos.',
    uploadState: {
      uploading: 'Subiendo',
      queued: 'En cola',
      duplicate: 'Duplicado',
      error: 'Error',
    },
    columns: {
      file: 'Archivo',
      kind: 'Tipo de archivo',
      status: 'Estado',
      attempts: 'Intentos',
      uploaded: 'Subido',
      took: 'Duración',
      document: 'Comprobante',
    },
    observations_one: '{{count}} observación',
    observations_other: '{{count}} observaciones',
  },
  jobStatus: {
    queued: 'En cola',
    processing: 'Procesando',
    done: 'Listo',
    failed: 'Reintentando',
    dead: 'Fallido',
  },
  jobStatusHint: {
    queued: 'Esperando para iniciar',
    processing: 'Gemini está leyendo el archivo',
    done: 'Comprobante creado',
    failed: 'Se reintentará automáticamente',
    dead: 'Se agotaron los reintentos',
  },
}
