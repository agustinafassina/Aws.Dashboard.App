import { sidebarConfig, type SidebarEntry } from '@/config/sidebar'
import type { SectionKey } from '@/i18n/types'

function collectLinkPaths(entries: SidebarEntry[]): Array<{
  sectionKey: SectionKey
  path: string
}> {
  const links: Array<{ sectionKey: SectionKey; path: string }> = []

  for (const entry of entries) {
    if (entry.kind === 'link' && !entry.disabled) {
      links.push({ sectionKey: entry.sectionKey, path: entry.path })
    }
  }

  return links
}

export function getCurrentSectionKey(pathname: string | null): SectionKey | null {
  if (!pathname) return null

  let bestMatch: { sectionKey: SectionKey; path: string } | null = null

  for (const items of Object.values(sidebarConfig)) {
    for (const item of collectLinkPaths(items)) {
      const isMatch =
        pathname === item.path || pathname.startsWith(`${item.path}/`)

      if (isMatch && (!bestMatch || item.path.length > bestMatch.path.length)) {
        bestMatch = item
      }
    }
  }

  return bestMatch?.sectionKey ?? null
}
