import type { Messages } from '../en'

export const ES_SESSION: Pick<Messages, 'session'> = {
  session: {
    title: 'Iniciar sesión',
    hint: 'Ingresa tu clave de acceso para abrir los comprobantes de tu empresa.',
    showKey: 'Mostrar clave',
    hideKey: 'Ocultar clave',
    storedHere: 'La clave se guarda solo en este navegador.',
    apiKey: 'Clave de acceso',
    signIn: 'Iniciar sesión',
    checking: 'Verificando…',
    signOut: 'Cerrar sesión',
    timeLeft: 'Tiempo restante: {{time}}',
    expired: 'Tu clave de acceso venció.',
  },
}
