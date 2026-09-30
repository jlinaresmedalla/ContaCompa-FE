import { http } from '@/lib/http'

import type { Me } from './types'

export const SESSION_ENDPOINTS = { me: '/v1/me' }

export const SESSION_KEYS = {
  me: ['session', 'me'] as const,
}

export const SESSION_API = {
  /** Checks the stored key, or `key` when given (sign-in validates before storing). */
  async me(key?: string, signal?: AbortSignal): Promise<Me> {
    const { data } = await http.get<Me>(SESSION_ENDPOINTS.me, {
      signal,
      headers: key ? { 'X-API-Key': key } : undefined,
    })
    return data
  },
}
