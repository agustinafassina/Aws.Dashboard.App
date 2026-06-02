'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { REGION_STORAGE_KEY } from '@/constants/region'
import { DEFAULT_AWS_REGION } from '@/utils/awsDefaults'
import { parseAwsRegion } from '@/utils/parseAwsRegion'
import { replaceSearchParams } from '@/utils/urlSearchParams'

interface RegionContextValue {
  region: string
  setRegion: (region: string) => void
  hydrated: boolean
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const regionParam = searchParams?.get('region') ?? null
  const [region, setRegionState] = useState(DEFAULT_AWS_REGION)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (regionParam) {
      const parsed = parseAwsRegion(regionParam)
      setRegionState(parsed)
      try {
        localStorage.setItem(REGION_STORAGE_KEY, parsed)
      } catch {
        // ignore storage errors
      }
      setHydrated(true)
      return
    }

    try {
      const stored = localStorage.getItem(REGION_STORAGE_KEY)
      setRegionState(parseAwsRegion(stored))
    } catch {
      setRegionState(DEFAULT_AWS_REGION)
    }
    setHydrated(true)
  }, [regionParam])

  useEffect(() => {
    if (!hydrated || regionParam) return

    const href = replaceSearchParams(pathname, searchParams, { region })
    router.replace(href, { scroll: false })
  }, [hydrated, pathname, region, regionParam, router, searchParams])

  const setRegion = useCallback(
    (next: string) => {
      const parsed = parseAwsRegion(next)
      setRegionState(parsed)
      try {
        localStorage.setItem(REGION_STORAGE_KEY, parsed)
      } catch {
        // ignore storage errors
      }

      const href = replaceSearchParams(pathname, searchParams, {
        region: parsed,
      })
      router.replace(href, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return (
    <RegionContext.Provider
      value={{
        region: hydrated ? region : DEFAULT_AWS_REGION,
        setRegion,
        hydrated,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export function useAwsRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useAwsRegion must be used within RegionProvider')
  }
  return context
}
