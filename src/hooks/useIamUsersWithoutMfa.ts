'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamUsersWithoutMfa } from '@/api/aws/iam'

export function useIamUsersWithoutMfa() {
  return useQuery({
    queryKey: ['iam', 'users-without-mfa'],
    queryFn: fetchIamUsersWithoutMfa,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
