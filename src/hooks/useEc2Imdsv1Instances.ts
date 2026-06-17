'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEc2Imdsv1Instances } from '@/api/aws/ec2'

export function useEc2Imdsv1Instances(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['ec2', 'imdsv1-instances', region],
    queryFn: () => fetchEc2Imdsv1Instances(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
