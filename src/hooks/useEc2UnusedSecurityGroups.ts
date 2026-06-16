'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEc2UnusedSecurityGroups } from '@/api/aws/ec2'

export function useEc2UnusedSecurityGroups(region: string) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['ec2', 'unused-security-groups', region],
    queryFn: () => fetchEc2UnusedSecurityGroups(region),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
