export const guidePageStyles = {
  page: 'min-h-[calc(100vh-4.75rem)] bg-brand_50 transition-colors dark:bg-gray_800',
  article:
    'mx-auto w-full min-w-0 max-w-3xl px-4 py-8 sm:px-6 sm:py-10 text-gray_900 dark:text-gray_100',
  header: 'mb-10 border-b border-gray_200 pb-8 dark:border-gray_700',
  eyebrow:
    'mb-2 text-sm font-medium uppercase tracking-wide text-brand_500 dark:text-brand_300',
  title: 'text-3xl font-bold tracking-tight',
  description: 'mt-3 text-base leading-relaxed text-gray_600 dark:text-gray_400',
  backLink:
    'mt-4 inline-block text-sm font-medium text-brand_500 hover:underline dark:text-brand_300',
  toc:
    'mb-10 rounded-xl border border-gray_200 bg-white p-4 dark:border-gray_700 dark:bg-gray_900',
  tocLabel:
    'mb-3 text-xs font-semibold uppercase tracking-wide text-gray_500 dark:text-gray_400',
  tocList: 'flex flex-col gap-2',
  tocLink:
    'text-sm font-medium text-brand_500 hover:underline dark:text-brand_300',
  sections: 'flex flex-col gap-10',
  section:
    'scroll-mt-24 rounded-xl border border-gray_200 bg-white p-6 dark:border-gray_700 dark:bg-gray_900',
  sectionTitle: 'mb-4 text-xl font-semibold',
  sectionBody: 'space-y-3 text-sm leading-relaxed text-gray_700 dark:text-gray_300',
} as const
