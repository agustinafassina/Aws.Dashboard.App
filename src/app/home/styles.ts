export const homeLayoutStyles = {
  wrapper: 'flex h-[calc(100vh-4.75rem)] flex-col',
  row: 'flex min-w-0 w-full flex-grow',
  main: 'min-w-0 flex-1 overflow-x-auto bg-brand_50 transition-colors dark:bg-gray_800',
} as const

import { pageContentShellMinHeight } from '@/styles/pageShell'

export const homeLoadingStyles = {
  root: `${pageContentShellMinHeight} h-[calc(90vh-10rem)] animate-pulse`,
  title: 'mb-4 h-7 w-40 rounded bg-gray_200 dark:bg-gray_700',
  body: 'h-[30rem] rounded-lg bg-gray_200/80 dark:bg-gray_700/80',
} as const
