'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  parseSeverityFilter,
  replaceSearchParams,
  type SeverityFilterValue,
} from '@/utils/urlSearchParams'

export function useSeverityFilter() {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()

  const severity = useMemo(
    () => parseSeverityFilter(searchParams?.get('severity')),
    [searchParams],
  )

  const setSeverity = useCallback(
    (value: SeverityFilterValue) => {
      const href = replaceSearchParams(pathname, searchParams, {
        severity: value || null,
      })
      router.replace(href, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const apiSeverity = severity || undefined

  return { severity, setSeverity, apiSeverity }
}
