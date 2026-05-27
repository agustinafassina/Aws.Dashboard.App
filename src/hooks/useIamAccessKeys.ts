'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamAccessKeys } from '@/api/aws/iam'

export function useIamAccessKeys() {
  return useQuery({
    queryKey: ['iam', 'access-keys'],
    queryFn: fetchIamAccessKeys,
    placeholderData: (prev) => prev,
  })
}
