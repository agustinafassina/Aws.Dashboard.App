export function getHomePathSegments(pathname: string | null | undefined): string[] {
  if (!pathname?.startsWith('/home')) return []

  const rest = pathname.slice('/home'.length).replace(/^\//, '')
  return rest ? rest.split('/').filter(Boolean) : []
}
