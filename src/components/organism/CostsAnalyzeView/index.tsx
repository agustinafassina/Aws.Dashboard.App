'use client'

import PageHeader from '@/components/molecules/PageHeader'
import { useTranslation } from '@/i18n/useTranslation'
import { pageContentShellMinHeight } from '@/styles/pageShell'

export default function CostsAnalyzeView() {
  const { dictionary } = useTranslation()
  const t = dictionary.costsAnalyze

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader title={t.title} description={t.description} />
      <p className="rounded-xl border border-dashed border-gray_200 bg-gray_50 px-4 py-8 text-center text-sm text-gray_700 dark:border-gray_750 dark:bg-gray_850 dark:text-gray_400">
        {t.comingSoon}
      </p>
    </div>
  )
}
