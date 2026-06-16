'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamCrossAccountRoles } from '@/api/aws/iam'

export function useIamCrossAccountRoles() {
  return useQuery({
    queryKey: ['iam', 'cross-account-roles'],
    queryFn: fetchIamCrossAccountRoles,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
