export const statCardIconToneClasses = [
  'bg-gray_75 text-brand_700 dark:bg-brand_900/55 dark:text-brand_200',
  'bg-gray_100 text-brand_700 dark:bg-brand_800/55 dark:text-brand_100',
  'bg-gray_150 text-brand_800 dark:bg-brand_700/40 dark:text-brand_50',
  'bg-gray_160 text-brand_900 dark:bg-brand_600/35 dark:text-brand_50',
  'bg-gray_100 text-brand_600 dark:bg-brand_800/50 dark:text-brand_200',
  'bg-gray_75 text-brand_700 dark:bg-brand_950/70 dark:text-brand_300',
  'bg-gray_150 text-brand_700 dark:bg-brand_700/30 dark:text-brand_100',
] as const

export function getStatCardIconToneClass(tone: number): string {
  return statCardIconToneClasses[tone % statCardIconToneClasses.length]
}
