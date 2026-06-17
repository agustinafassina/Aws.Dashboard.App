'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamInlinePolicies } from '@/api/aws/iam'

export function useIamInlinePolicies() {
  return useQuery({
    queryKey: ['iam', 'inline-policies'],
    queryFn: fetchIamInlinePolicies,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
