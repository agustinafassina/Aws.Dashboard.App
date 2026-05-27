import { cn } from '@/styles/cn'
import { menuGridOptionClass, menuSectionLabel, skeletonPulse } from '@/styles/shared'

export const userMenuStyles = {
  root: 'relative',
  panel:
    'absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-72 overflow-hidden rounded-xl border border-gray_200 bg-white text-gray_900 shadow-lg dark:border-gray_700 dark:bg-gray_900 dark:text-gray_100',
  userHeader: 'border-b border-gray_200 px-4 py-3 dark:border-gray_700',
  userName: 'truncate text-sm font-semibold text-gray_900 dark:text-white',
  userJob: 'mt-0.5 truncate text-xs text-gray_600 dark:text-gray_400',
  userEmail: 'mt-1 truncate text-xs text-gray_500',
  section: 'px-3 py-3',
  themeGrid: 'grid grid-cols-2 gap-1.5',
  languageGrid: 'grid grid-cols-2 gap-1.5',
  themeHint: 'mt-2 px-1 text-[11px] text-gray_500',
  languageSection: 'border-t border-gray_200 px-3 py-3 dark:border-gray-700',
  actions: 'space-y-1 border-t border-gray_200 p-2 dark:border-gray_700',
  guideLink:
    'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray_700 transition-colors hover:bg-gray_100 dark:text-gray_200 dark:hover:bg-gray_800',
  guideIcon: 'flex h-[18px] w-[18px] shrink-0 [&_svg]:h-[18px] [&_svg]:w-[18px]',
  logoutButton:
    'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red_100 transition-colors hover:bg-red_50 dark:text-red-400 dark:hover:bg-red-950/30',
} as const

export function getAvatarButtonClass(isDark: boolean, open: boolean) {
  return cn(
    'flex items-center gap-2 rounded-full p-0.5 ring-2 ring-transparent transition-all focus:outline-none',
    isDark
      ? 'hover:ring-white/30 focus-visible:ring-white/50'
      : 'hover:ring-brand_200 focus-visible:ring-brand_400',
    open && (isDark ? 'ring-white/40' : 'ring-brand_400'),
  )
}

export function getAvatarImageClass(isDark: boolean) {
  return cn('rounded-full border-2', isDark ? 'border-white/30' : 'border-gray_300')
}

export function getAvatarInitialsClass(isDark: boolean) {
  return cn(
    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
    isDark ? 'bg-white/20 text-white' : 'bg-brand_100 text-brand_700',
  )
}

export function getThemeOptionClass(isActive: boolean) {
  return menuGridOptionClass(isActive, 'sm')
}

export function getLanguageOptionClass(isActive: boolean) {
  return menuGridOptionClass(isActive, 'md')
}

export function getThemeSkeletonClass() {
  return cn('h-[3.25rem]', skeletonPulse())
}

export function getLanguageSkeletonClass() {
  return cn('h-10', skeletonPulse())
}

export { menuSectionLabel }
