'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchInspectorVulnerabilities,
  type InspectorVulnerabilitiesParams,
} from '@/api/aws/inspector'

export function useInspectorVulnerabilities(params: InspectorVulnerabilitiesParams) {
  const enabled = Boolean(params.region && params.resourceType)

  return useQuery({
    queryKey: [
      'inspector',
      'vulnerabilities',
      params.region,
      params.resourceType,
      params.severity ?? '',
      params.status ?? '',
    ],
    queryFn: () => fetchInspectorVulnerabilities(params),
    enabled,
    placeholderData: (prev) => prev,
  })
}
