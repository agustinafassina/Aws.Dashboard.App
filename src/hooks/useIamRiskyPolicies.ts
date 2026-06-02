'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamRiskyPolicies } from '@/api/aws/iam'

export function useIamRiskyPolicies() {
  return useQuery({
    queryKey: ['iam', 'risky-policies'],
    queryFn: fetchIamRiskyPolicies,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
