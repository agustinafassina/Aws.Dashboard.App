/** Normalizes paths for sidebar active-state comparison. */
export function normalizeNavPath(path: string | null | undefined): string {
  if (!path) return ''

  const withoutQuery = path.split('?')[0].split('#')[0]

  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1)
  }

  return withoutQuery
}

export function isNavItemActive(
  pathname: string | null,
  href: string,
): boolean {
  const current = normalizeNavPath(pathname)
  const target = normalizeNavPath(href)

  if (!current || !target) return false

  return current === target
}

export function isNavGroupActive(
  pathname: string | null,
  childPaths: string[],
): boolean {
  return childPaths.some((path) => isNavItemActive(pathname, path))
}

export function findActiveSidebarGroupKey(
  pathname: string | null,
  groups: ReadonlyArray<{
    labelKey: string
    childPaths: string[]
  }>,
): string | null {
  if (!pathname) return null

  let best: { labelKey: string; pathLength: number } | null = null

  for (const group of groups) {
    for (const path of group.childPaths) {
      if (!isNavItemActive(pathname, path)) continue

      if (!best || path.length > best.pathLength) {
        best = { labelKey: group.labelKey, pathLength: path.length }
      }
    }
  }

  return best?.labelKey ?? null
}
