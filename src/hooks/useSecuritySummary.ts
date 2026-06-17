'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchSecuritySummary } from '@/api/aws/security'

export function useSecuritySummary(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['security', 'summary', region],
    queryFn: () => fetchSecuritySummary(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
