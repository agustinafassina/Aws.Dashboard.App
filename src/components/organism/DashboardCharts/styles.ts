import { pageContentShellMinHeight } from '@/styles/pageShell'

export const dashboardChartsStyles = {
  grid: 'grid grid-cols-1 gap-4 md:grid-cols-2',
  card: 'rounded-xl border p-4 shadow-sm',
  cardTitle: 'mb-4 text-sm font-semibold',
  chartWrap: 'h-[220px] w-full',
} as const

export const dashboardSectionStyles = {
  shell: pageContentShellMinHeight,
  welcome: 'mb-6 text-lg font-semibold text-gray_900 dark:text-gray_100',
} as const
