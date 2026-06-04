import type { InspectorVulnerabilitiesResponse } from '@/interfaces/aws-api'

type InspectorCountSource = Pick<
  InspectorVulnerabilitiesResponse,
  'findings' | 'totalFindings' | 'hasMoreFindings'
>

export function getInspectorLoadedCount(data: InspectorCountSource): number {
  return data.findings.length
}

export function formatInspectorTotalDisplay(
  data: InspectorCountSource,
): string | number {
  const loaded = getInspectorLoadedCount(data)
  if (data.hasMoreFindings) return `${loaded}+`
  return loaded
}

export function isInspectorResultCapped(data: InspectorCountSource | undefined): boolean {
  return Boolean(data?.hasMoreFindings)
}
