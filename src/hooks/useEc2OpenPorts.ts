'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEc2OpenPorts } from '@/api/aws/ec2'

export function useEc2OpenPorts(region: string) {
  const enabled = Boolean(region)

  return useQuery({
    queryKey: ['ec2', 'open-ports', region],
    queryFn: () => fetchEc2OpenPorts(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
