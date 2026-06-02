'use client'

import SearchIcon from '@/components/atoms/Icons/Search'
import { useTranslation } from '@/i18n/useTranslation'

interface TableSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function TableSearchInput({
  value,
  onChange,
}: TableSearchInputProps) {
  const { dictionary } = useTranslation()

  return (
    <div className="relative w-full min-w-[10rem] max-w-[11rem] sm:max-w-xs">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray_500 dark:text-gray_400">
        <SearchIcon width={16} height={16} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={dictionary.table.searchPlaceholder}
        aria-label={dictionary.table.searchAriaLabel}
        className="h-8 w-full min-w-0 rounded-lg border border-gray_200 bg-white py-1 pl-9 pr-3 text-xs text-gray_900 placeholder:text-gray_500 dark:border-gray_700 dark:bg-gray_850 dark:text-gray_100 dark:placeholder:text-gray_500"
      />
    </div>
  )
}
