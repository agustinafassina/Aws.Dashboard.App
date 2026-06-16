'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchLambdaPublicFunctions } from '@/api/aws/lambda'

export function useLambdaPublicFunctions(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['lambda', 'public-functions', region],
    queryFn: () => fetchLambdaPublicFunctions(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
