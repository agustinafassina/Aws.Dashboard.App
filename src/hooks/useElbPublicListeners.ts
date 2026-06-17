'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchElbPublicListeners } from '@/api/aws/elb'

export function useElbPublicListeners(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['elb', 'public-listeners', region],
    queryFn: () => fetchElbPublicListeners(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
