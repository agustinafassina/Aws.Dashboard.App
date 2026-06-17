'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchRdsUnencryptedInstances } from '@/api/aws/rds'

export function useRdsUnencryptedInstances(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['rds', 'unencrypted-instances', region],
    queryFn: () => fetchRdsUnencryptedInstances(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
