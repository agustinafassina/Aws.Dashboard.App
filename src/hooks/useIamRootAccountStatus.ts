'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamRootAccountStatus } from '@/api/aws/iam'

export function useIamRootAccountStatus() {
  return useQuery({
    queryKey: ['iam', 'root-account-status'],
    queryFn: fetchIamRootAccountStatus,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
