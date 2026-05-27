export const errorPageStyles = {
  page:
    'flex min-h-[calc(100vh-4.75rem)] items-center justify-center bg-brand_50 px-4 py-12 dark:bg-gray_800',
  card:
    'w-full max-w-md rounded-xl border border-gray_200 bg-white p-8 text-center shadow-sm dark:border-gray_700 dark:bg-gray_900',
  code: 'text-5xl font-bold text-brand_500 dark:text-brand_300',
  title: 'mt-4 text-xl font-semibold text-gray_900 dark:text-gray_100',
  description: 'mt-2 text-sm leading-relaxed text-gray_600 dark:text-gray_400',
  actions: 'mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center',
  primary:
    'inline-flex items-center justify-center rounded-lg bg-brand_500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand_600 dark:bg-brand_400 dark:text-gray_900 dark:hover:bg-brand_300',
  secondary:
    'inline-flex items-center justify-center rounded-lg border border-gray_200 px-4 py-2.5 text-sm font-medium text-gray_700 transition-colors hover:bg-gray_50 dark:border-gray_600 dark:text-gray_200 dark:hover:bg-gray_800',
} as const
