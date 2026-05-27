export function getJwtExpirationMs(token: string): number | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null

    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    const payload = JSON.parse(json) as { exp?: number }

    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function shouldRefreshToken(
  token: string | undefined,
  bufferMs = 5 * 60 * 1000,
): boolean {
  if (!token) return true

  const expMs = getJwtExpirationMs(token)
  if (!expMs) return true

  return Date.now() >= expMs - bufferMs
}