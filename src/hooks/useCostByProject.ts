'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchCostsByProject } from '@/api/aws/cost'

export function useCostByProject(startDate: string, endDate: string) {
  const enabled =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate <= endDate

  return useQuery({
    queryKey: ['costs', 'by-project', startDate, endDate],
    queryFn: () => fetchCostsByProject(startDate, endDate),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
