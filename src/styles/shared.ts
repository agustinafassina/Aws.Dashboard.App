import { cn } from '@/styles/cn'

/** Etiquetas de sección en menús (apariencia, idioma, etc.) */
export const menuSectionLabel =
  'mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray_500 dark:text-gray_400'

export function menuGridOptionClass(isActive: boolean, size: 'sm' | 'md' = 'sm') {
  return cn(
    'font-medium transition-colors',
    size === 'sm'
      ? 'flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-xs'
      : 'rounded-lg px-3 py-2.5 text-sm',
    isActive
      ? 'bg-brand_100 text-brand_700 dark:bg-brand_900/40 dark:text-brand_300'
      : 'text-gray_600 hover:bg-gray_100 dark:text-gray-400 dark:hover:bg-gray-800',
  )
}

export function skeletonPulse(isDark?: boolean, shape = 'rounded') {
  if (isDark === undefined) {
    return cn('animate-pulse bg-gray_200 dark:bg-gray_700', shape)
  }
  return cn('animate-pulse', shape, isDark ? 'bg-white/20' : 'bg-gray_200')
}
