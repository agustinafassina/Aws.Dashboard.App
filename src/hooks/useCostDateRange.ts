'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { defaultCostDateRange } from '@/utils/formatters'
import {
  parseCostDateRangeFromSearch,
  replaceSearchParams,
} from '@/utils/urlSearchParams'

export function useCostDateRange() {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const defaults = useMemo(() => defaultCostDateRange(), [])

  const appliedRange = useMemo(() => {
    const fromUrl = parseCostDateRangeFromSearch(
      searchParams?.get('from') ?? null,
      searchParams?.get('to') ?? null,
    )
    return fromUrl ?? defaults
  }, [defaults, searchParams])

  const setAppliedRange = useCallback(
    (range: { startDate: string; endDate: string }) => {
      const href = replaceSearchParams(pathname, searchParams, {
        from: range.startDate,
        to: range.endDate,
      })
      router.replace(href, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return { appliedRange, setAppliedRange, defaults }
}
