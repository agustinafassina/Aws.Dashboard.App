'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchRdsNoBackups } from '@/api/aws/rds'

export function useRdsNoBackups(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['rds', 'no-backups', region],
    queryFn: () => fetchRdsNoBackups(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
