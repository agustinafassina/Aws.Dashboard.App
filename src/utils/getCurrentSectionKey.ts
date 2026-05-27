import { sidebarConfig } from '@/config/sidebar'
import type { SectionKey } from '@/i18n/types'

export function getCurrentSectionKey(pathname: string | null): SectionKey | null {
  if (!pathname) return null

  let bestMatch: { sectionKey: SectionKey; path: string } | null = null

  for (const items of Object.values(sidebarConfig)) {
    for (const item of items) {
      const isMatch =
        pathname === item.path || pathname.startsWith(`${item.path}/`)

      if (isMatch && (!bestMatch || item.path.length > bestMatch.path.length)) {
        bestMatch = item
      }
    }
  }

  return bestMatch?.sectionKey ?? null
}
