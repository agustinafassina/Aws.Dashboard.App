import { cn } from '@/styles/cn'

export function getNavLinkClass(
  collapsed: boolean,
  isActive: boolean,
  isNavigating: boolean,
) {
  return cn(
    'relative flex items-center rounded-lg text-sm font-medium transition-all duration-150',
    'hover:bg-brand_50/60 dark:hover:bg-gray_800/60 dark:text-gray_300',
    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
    isActive &&
      'bg-brand_100 text-brand_700 shadow-sm dark:bg-gray_800 dark:text-brand_300',
    !isActive && 'text-gray_700 dark:text-gray_400',
    isNavigating && 'opacity-75',
  )
}

export const nestedNavGroupStyles = {
  childrenWrap:
    'mt-0.5 flex w-full min-w-0 flex-col gap-0.5 rounded-lg bg-brand_50/70 py-1 dark:bg-gray_850/90',
} as const

export function getSubNavLinkClass(isActive: boolean, isNavigating: boolean) {
  return cn(
    'relative flex w-full min-w-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-150',
    isActive
      ? [
          'bg-brand_100/80 font-semibold text-brand_800',
          'dark:border-l-2 dark:border-brand_400 dark:bg-brand_500/15 dark:text-brand_100',
        ]
      : [
          'font-medium text-brand_700/85',
          'hover:bg-brand_100/45 hover:text-brand_800',
          'dark:border-l-2 dark:border-transparent',
          'dark:text-gray_400 dark:hover:bg-gray_800/50 dark:hover:text-gray-200',
        ],
    isNavigating && 'opacity-75',
  )
}

export function getIconClass(isActive: boolean) {
  return cn('flex-shrink-0 transition-colors', {
    'text-brand_400 dark:text-brand_300': isActive,
    'text-gray_500': !isActive,
  })
}

export function getSubIconClass(isActive: boolean) {
  return cn('flex-shrink-0 transition-colors', {
    'text-brand_600 dark:text-brand_300': isActive,
    'text-brand_500/70 dark:text-gray_500': !isActive,
  })
}

export const navLinkStyles = {
  label: 'flex-1 truncate',
} as const

export function getBadgeClass(isActive: boolean) {
  return cn(
    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
    isActive
      ? 'bg-brand_200 text-brand_800 dark:bg-brand_700/50 dark:text-brand_100'
      : 'bg-brand_100 text-brand_700 dark:bg-brand_900/60 dark:text-brand_200',
  )
}

export function getCollapsedBadgeClass() {
  return 'absolute right-1 top-1 h-2 w-2 rounded-full bg-brand_500 dark:bg-brand_400'
}

export function getActiveIndicatorClass(collapsed: boolean) {
  return cn(
    'absolute top-1/2 -translate-y-1/2 bg-brand_500 dark:bg-brand_400',
    collapsed ? 'left-0 h-8 w-1 rounded-r-full' : 'left-0 h-6 w-1 rounded-r-full',
  )
}
