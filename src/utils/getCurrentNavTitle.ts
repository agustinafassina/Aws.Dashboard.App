import { sidebarConfig, type SidebarEntry } from '@/config/sidebar'
import type { SectionKey, SidebarChildLabelKey } from '@/i18n/types'

export type NavTitleSource =
  | { type: 'section'; key: SectionKey }
  | { type: 'sidebarChild'; key: SidebarChildLabelKey }

interface NavPathMatch {
  path: string
  title: NavTitleSource
}

function collectNavPaths(entries: SidebarEntry[]): NavPathMatch[] {
  const paths: NavPathMatch[] = []

  for (const entry of entries) {
    if (entry.kind === 'link' && !entry.disabled) {
      paths.push({
        path: entry.path,
        title: { type: 'section', key: entry.sectionKey },
      })
    }
    if (entry.kind === 'group') {
      for (const child of entry.children) {
        paths.push({
          path: child.path,
          title: { type: 'sidebarChild', key: child.labelKey },
        })
      }
    }
  }

  return paths
}

function findBestNavMatch(pathname: string): NavPathMatch | null {
  let bestMatch: NavPathMatch | null = null

  for (const items of Object.values(sidebarConfig)) {
    for (const item of collectNavPaths(items)) {
      const isMatch =
        pathname === item.path || pathname.startsWith(`${item.path}/`)

      if (isMatch && (!bestMatch || item.path.length > bestMatch.path.length)) {
        bestMatch = item
      }
    }
  }

  return bestMatch
}

export function getCurrentNavTitle(pathname: string | null): NavTitleSource | null {
  if (!pathname) return null
  return findBestNavMatch(pathname)?.title ?? null
}
