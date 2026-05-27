import { cn } from '@/styles/cn'

export const skeletonStyles = {
  card: 'animate-pulse rounded-lg bg-white p-4 shadow-sm',
  cardLineLg: 'mb-4 h-4 w-3/4 rounded bg-gray_400',
  cardLine: 'h-3 rounded bg-gray_400',
  cardLines: 'space-y-2',
  navBarUser: 'h-10 w-10 animate-pulse rounded-full bg-gray_300 dark:bg-gray_600',
  radialWrap: 'relative flex h-[6rem] w-[6rem] items-center justify-center',
  radialRing:
    'absolute h-full w-full animate-pulse rounded-full border-8 border-gray_400',
  barChartWrap: 'mx-auto flex h-[60%] w-[90%] flex-col gap-4',
  barChartInner: 'h-[6.25rem] w-full',
  barChartRow: 'flex h-full items-end justify-between px-4',
  barColumn: 'w-[0.9375rem] animate-pulse rounded-t bg-gray_400',
  clientName: 'mb-4 h-4 w-3/4 animate-pulse rounded bg-gray_400',
} as const

export function getRadialPositionClass(position: string) {
  return cn('absolute', position)
}
