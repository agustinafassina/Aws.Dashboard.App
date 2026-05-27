import { cn } from '@/styles/cn'

export const sidebarStyles = {
  nav: 'flex flex-col gap-1.5',
  menuTitle:
    'text-xs font-semibold uppercase tracking-wider text-gray_600 dark:text-gray_400',
  version:
    'text-center text-xs font-medium text-gray_500 dark:text-gray-400',
} as const

export function getAsideClass(collapsed: boolean) {
  return cn(
    'flex flex-shrink-0 flex-col justify-between border-r border-r-black/10 bg-white shadow-sm transition-[width] duration-300 ease-in-out dark:border-r-gray_700 dark:bg-gray_900',
    collapsed ? 'w-[4.5rem] min-w-[4.5rem]' : 'w-[15.625rem] min-w-[15.625rem]',
  )
}

export function getInnerClass(collapsed: boolean) {
  return cn('flex flex-col pt-4', collapsed ? 'px-2' : 'px-4')
}

export function getHeaderRowClass(collapsed: boolean) {
  return cn(
    'mb-4 flex items-center',
    collapsed ? 'justify-center' : 'justify-between px-2',
  )
}

export function getToggleButtonClass() {
  return cn(
    'flex h-9 w-9 items-center justify-center rounded-lg text-gray_600 transition-colors hover:bg-brand_50 dark:text-gray_400 dark:hover:bg-gray_800',
  )
}

export function getFooterClass(collapsed: boolean) {
  return cn(
    'border-t border-gray_200 py-4 dark:border-gray_700',
    collapsed ? 'px-2' : 'px-4',
  )
}
