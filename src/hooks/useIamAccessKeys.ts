'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamAccessKeys } from '@/api/aws/iam'

export function useIamAccessKeys() {
  return useQuery({
    queryKey: ['iam', 'access-keys'],
    queryFn: fetchIamAccessKeys,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
