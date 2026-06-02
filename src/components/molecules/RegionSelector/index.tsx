'use client'

import { AWS_REGIONS } from '@/utils/awsDefaults'
import { useAwsRegion } from '@/context/RegionContext'
import { useTranslation } from '@/i18n/useTranslation'

const selectClass =
  'h-9 min-w-[8.75rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 shadow-sm dark:border-gray_700 dark:bg-gray_850 dark:text-gray_100'

export default function RegionSelector() {
  const { region, setRegion, hydrated } = useAwsRegion()
  const { dictionary } = useTranslation()

  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-gray_600 sm:inline dark:text-gray_400">
        {dictionary.nav.regionLabel}
      </span>
      <select
        className={selectClass}
        value={region}
        disabled={!hydrated}
        onChange={(e) => setRegion(e.target.value)}
        aria-label={dictionary.nav.regionLabel}
      >
        {AWS_REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </label>
  )
}
