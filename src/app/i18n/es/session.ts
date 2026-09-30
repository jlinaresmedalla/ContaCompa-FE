import type { Messages } from '../en'

export const ES_SESSION: Pick<Messages, 'session'> = {
  session: {
    title: 'Iniciar sesión',
    hint: 'Ingresa la clave de acceso de tu empresa para iniciar sesión.',
    apiKey: 'Clave de acceso',
    signIn: 'Iniciar sesión',
    checking: 'Verificando…',
    signOut: 'Cerrar sesión',
    timeLeft: 'Tiempo restante: {{time}}',
    expired: 'Tu clave de acceso venció.',
  },
}
