'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchUntaggedResources } from '@/api/aws/audits'

export function useUntaggedResources(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['audits', 'untagged-resources', region],
    queryFn: () => fetchUntaggedResources(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
