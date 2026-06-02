const MAX_SIDEBAR_BADGE = 99

export function formatSidebarBadge(count: number): string | number | undefined {
  if (!Number.isFinite(count) || count <= 0) return undefined
  if (count > MAX_SIDEBAR_BADGE) return `${MAX_SIDEBAR_BADGE}+`
  return count
}
