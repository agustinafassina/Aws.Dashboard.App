import { cn } from '@/styles/cn'
import { skeletonPulse } from '@/styles/shared'

export const navBarStyles = {
  leftCluster: 'flex items-center gap-3 min-w-0',
  loadingLeft: 'flex items-center gap-3',
  logoLink: 'flex shrink-0 items-center hover:opacity-90 transition-opacity',
  logoImage: 'object-contain',
} as const

export function getNavBarClass(isDark: boolean) {
  return cn(
    'flex h-[4.75rem] w-full sticky top-0 z-50 items-center justify-between border-b p-3 transition-colors',
    isDark
      ? 'border-gray_700 bg-gray_900 text-white'
      : 'border-gray_200 bg-white text-gray_900',
  )
}

export function getLogoSkeletonClass(isDark: boolean) {
  return cn('h-12 w-12 shrink-0', skeletonPulse(isDark))
}

export function getTitleSkeletonClass(isDark: boolean) {
  return cn('h-6 w-32', skeletonPulse(isDark))
}

export function getSectionTitleClass(isDark: boolean) {
  return cn(
    'truncate text-lg font-semibold tracking-tight',
    isDark ? 'text-white' : 'text-gray_900',
  )
}
