import { getCookie, setCookie } from 'cookies-next'
import { AUTH_COOKIE_OPTIONS, AUTH_TOKEN_COOKIE } from '@/constants/auth'

export function normalizeBearerToken(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed.slice(7).trim()
  }
  return trimmed
}

export function getAuthToken(): string | undefined {
  const value = getCookie(AUTH_TOKEN_COOKIE, AUTH_COOKIE_OPTIONS)
  if (typeof value !== 'string' || !value.trim()) return undefined
  return normalizeBearerToken(value)
}

export function setAuthToken(token: string): void {
  setCookie(AUTH_TOKEN_COOKIE, normalizeBearerToken(token), {
    ...AUTH_COOKIE_OPTIONS,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function resolveAuthToken(): Promise<string | undefined> {
  const fromCookie = getAuthToken()
  if (fromCookie) return fromCookie

  if (typeof window === 'undefined') return undefined

  try {
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) return undefined

    const payload = (await response.json()) as { accessToken?: string }
    if (!payload.accessToken?.trim()) return undefined

    const token = normalizeBearerToken(payload.accessToken)
    setAuthToken(token)
    return token
  } catch {
    return undefined
  }
}
