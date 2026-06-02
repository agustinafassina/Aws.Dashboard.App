'use client'

import { useSeverityFilter } from '@/hooks/useSeverityFilter'
import { useTranslation } from '@/i18n/useTranslation'
import { SEVERITY_FILTER_VALUES } from '@/utils/urlSearchParams'

const selectClass =
  'h-8 min-w-[9.5rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_700 dark:bg-gray_850 dark:text-gray_100'

export default function SeverityFilterSelect() {
  const { severity, setSeverity } = useSeverityFilter()
  const { dictionary } = useTranslation()
  const labels = dictionary.filters.severityOptions

  return (
    <label className="flex items-center gap-1.5">
      <span className="text-xs text-gray_600 dark:text-gray_400">
        {dictionary.filters.severityLabel}
      </span>
      <select
        className={selectClass}
        value={severity}
        onChange={(e) =>
          setSeverity(
            e.target.value as (typeof SEVERITY_FILTER_VALUES)[number],
          )
        }
        aria-label={dictionary.filters.severityLabel}
      >
        {SEVERITY_FILTER_VALUES.map((value) => (
          <option key={value || 'all'} value={value}>
            {labels[value || 'all']}
          </option>
        ))}
      </select>
    </label>
  )
}
