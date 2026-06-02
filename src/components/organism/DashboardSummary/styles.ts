import { pageContentShellMinHeight } from '@/styles/pageShell'

export const dashboardSectionStyles = {
  shell: pageContentShellMinHeight,
  welcome: 'mb-6 text-lg font-semibold text-gray_900 dark:text-gray_100',
} as const

export const dashboardSummaryStyles = {
  regionHint: 'mb-4 text-xs text-gray_600 dark:text-gray_400',
  kpiGrid:
    'mb-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  kpiLink:
    'block h-[8.75rem] rounded-xl transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand_500',
  kpiSkeleton: 'h-[8.75rem]',
  chartSection:
    'mb-6 rounded-xl border border-gray_200 bg-white p-4 shadow-sm dark:border-gray_700 dark:bg-gray_800',
  chartTitle:
    'mb-4 text-sm font-semibold uppercase tracking-wide text-gray_800 dark:text-gray_400',
  chartWrap: 'h-64 w-full',
  scanSection:
    'rounded-xl border border-gray_200 bg-white shadow-sm dark:border-gray_700 dark:bg-gray_800',
  scanTitle:
    'border-b border-gray_200 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray_800 dark:border-gray_700 dark:text-gray_400',
  scanTable: 'w-full text-sm',
  scanRow:
    'border-b border-gray_100 last:border-0 dark:border-gray_750',
  scanCell:
    'px-4 py-3 text-gray_800 dark:text-gray_200',
  scanCellMuted: 'px-4 py-3 text-gray_600 dark:text-gray_400',
  scanLink:
    'text-xs font-medium text-brand_600 hover:text-brand_700 dark:text-brand_300 dark:hover:text-brand_200',
} as const
