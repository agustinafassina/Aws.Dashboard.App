import { cn } from '@/styles/cn'

export function getExportPdfButtonClass(disabled?: boolean) {
  return cn(
    'inline-flex h-8 min-w-[10.75rem] flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 text-xs font-medium transition-colors',
    'border-gray_200 bg-white text-gray_700',
    'hover:border-brand_300 hover:bg-brand_50/80 hover:text-brand_700',
    'dark:border-gray_700 dark:bg-gray_850 dark:text-gray_300',
    'dark:hover:border-brand_400 dark:hover:bg-gray_800 dark:hover:text-brand_300',
    disabled && 'pointer-events-none opacity-50',
  )
}
