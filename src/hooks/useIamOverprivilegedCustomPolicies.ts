'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamOverprivilegedCustomPolicies } from '@/api/aws/iam'

export function useIamOverprivilegedCustomPolicies() {
  return useQuery({
    queryKey: ['iam', 'overprivileged-custom-policies'],
    queryFn: fetchIamOverprivilegedCustomPolicies,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
