import type { Messages } from '../en'

export const ES_COMMON: Pick<
  Messages,
  'common' | 'errors' | 'notifications' | 'pageStates' | 'validation'
> = {
  common: {
    selectGuidance:
      'Usa las flechas arriba y abajo para moverte, Intro para seleccionar, Escape para cerrar e izquierda o Retroceso para quitar valores seleccionados.',
    selectSelected: 'Seleccionado: {{label}}.',
    selectRemoved: 'Eliminado: {{label}}.',
    selectFocused: 'En foco: {{label}}.',
    selectResults: '{{results}} Búsqueda: {{term}}.',
    selectCount: '{{count}} opciones coincidentes.',

    selectPlaceholder: 'Selecciona…',
    noOptions: 'No hay opciones coincidentes',
    loading: 'Cargando…',
    none: 'Ninguna',
    open: 'Abrir',
    delete: 'Eliminar',
    retry: 'Reintentar',
    clean: 'Sin observaciones',
  },
  errors: {
    apiKey: 'Falta la clave de acceso, es incorrecta o ya venció.',
    unreachable: 'No se pudo conectar con el servicio.',
    requestFailed: 'No se pudo completar la solicitud ({{status}}).',
    unexpected: 'Ocurrió un error inesperado.',
  },
  notifications: {
    region: 'Notificaciones',
    close: 'Cerrar notificación',
    uploaded: 'Archivo subido: {{name}}',
    duplicate: 'Este archivo ya se había subido: {{name}}',
    corrected: 'Corrección guardada',
    retried: 'Procesamiento puesto en cola nuevamente',
    exported_one: 'Exportación lista: {{count}} comprobante',
    exported_other: 'Exportación lista: {{count}} comprobantes',
  },
  pageStates: {
    home: 'Contacompa – Inicio',
    documents: 'Revisa los comprobantes extraídos y expórtalos a Excel.',
    jobs: 'Sube archivos y consulta el avance de su procesamiento.',
    costs: 'Consulta el uso del modelo y los costos de extracción.',
    docsTitle: 'Aún no hay comprobantes',
    docsDescription:
      'Los comprobantes aparecerán aquí cuando termine el procesamiento de tus archivos.',
    upload: 'Subir archivos',
    filteredTitle: 'No hay comprobantes que coincidan',
    filteredDescription: 'Prueba otros filtros o quítalos para ver todos los comprobantes.',
    clear: 'Quitar filtros',
    jobsTitle: 'Aún no hay procesamientos',
    jobsDescription:
      'Elige archivos en el área de carga de arriba para empezar a extraer comprobantes.',
    costsTitle: 'Aún no hay costos de extracción',
    costsDescription: 'Los costos aparecerán después de la primera extracción.',
  },
  validation: {
    decimal: 'Usa un punto decimal, por ejemplo 12.50',
    ruc: 'Ingresa los 11 dígitos del RUC',
    date: 'Ingresa la fecha en formato año-mes-día',
    currency: 'Ingresa el código de moneda de tres letras, por ejemplo PEN',
    tooLong: 'El valor es demasiado largo',
  },
}
