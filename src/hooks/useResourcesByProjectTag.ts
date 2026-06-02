'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchResourcesByProjectTag } from '@/api/aws/audits'

export function useResourcesByProjectTag(region: string, projectTagValue: string) {
  const enabled = Boolean(region?.trim() && projectTagValue?.trim())

  return useQuery({
    queryKey: ['audits', 'resources-by-project', region, projectTagValue],
    queryFn: () => fetchResourcesByProjectTag(region, projectTagValue.trim()),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
