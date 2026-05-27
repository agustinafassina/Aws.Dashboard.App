import { pageContentShellMinHeight } from '@/styles/pageShell'

export const homeSectionStyles = {
  shell: `${pageContentShellMinHeight} h-[calc(90vh-10rem)]`,
  grid: 'grid min-h-[12rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
} as const
