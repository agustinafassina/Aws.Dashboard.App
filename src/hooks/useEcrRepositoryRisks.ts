'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEcrRepositoryRisks } from '@/api/aws/ecr'

export function useEcrRepositoryRisks(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['ecr', 'repository-risks', region],
    queryFn: () => fetchEcrRepositoryRisks(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
