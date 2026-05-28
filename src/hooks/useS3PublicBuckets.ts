'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchS3PublicBuckets } from '@/api/aws/s3'

export function useS3PublicBuckets(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['s3', 'public-buckets', region],
    queryFn: () => fetchS3PublicBuckets(region),
    enabled,
  })
}
