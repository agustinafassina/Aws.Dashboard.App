'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchRdsOpenPorts } from '@/api/aws/rds'

export function useRdsOpenPorts(region: string) {
  const enabled = Boolean(region)

  return useQuery({
    queryKey: ['rds', 'open-ports', region],
    queryFn: () => fetchRdsOpenPorts(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
