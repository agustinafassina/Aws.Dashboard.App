'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchS3EncryptionStatus } from '@/api/aws/s3'

export function useS3EncryptionStatus(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['s3', 'encryption-status', region],
    queryFn: () => fetchS3EncryptionStatus(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
