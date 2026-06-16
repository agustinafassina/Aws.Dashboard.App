'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEc2UnattachedVolumes } from '@/api/aws/ec2'

export function useEc2UnattachedVolumes(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['ec2', 'unattached-volumes', region],
    queryFn: () => fetchEc2UnattachedVolumes(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
