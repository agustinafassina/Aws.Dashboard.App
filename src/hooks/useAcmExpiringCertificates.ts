'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAcmExpiringCertificates } from '@/api/aws/acm'

export function useAcmExpiringCertificates(region: string, days = 30) {
  const enabled = Boolean(region?.trim())

  return useQuery({
    queryKey: ['acm', 'expiring-certificates', region, days],
    queryFn: () => fetchAcmExpiringCertificates(region, days),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
