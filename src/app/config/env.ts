function requiredUrl(name: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} is not set; add it to .env.local`)
  }
  try {
    return new URL(value).toString().replace(/\/$/, '')
  } catch {
    throw new Error(`${name} is not a valid URL: ${value}`)
  }
}

export const ENV = {
  apiUrl: requiredUrl('VITE_API_URL', import.meta.env.VITE_API_URL),
}
