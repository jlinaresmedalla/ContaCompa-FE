import { http } from '@/lib/http'

import type { Me } from './types'

export const sessionEndpoints = { me: '/v1/me' }

export const sessionKeys = {
  me: ['session', 'me'] as const,
}

export const sessionApi = {
  /** Checks the stored key, or `key` when given (sign-in validates before storing). */
  async me(key?: string, signal?: AbortSignal): Promise<Me> {
    const { data } = await http.get<Me>(sessionEndpoints.me, {
      signal,
      headers: key ? { 'X-API-Key': key } : undefined,
    })
    return data
  },
}
