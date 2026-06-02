import type { InspectorFinding } from '@/interfaces/aws-api'

export function countHighCriticalFindings(
  findings: InspectorFinding[] | undefined,
): number {
  return (findings ?? []).filter((finding) => {
    const severity = finding.severity.toUpperCase()
    return severity === 'CRITICAL' || severity === 'HIGH'
  }).length
}
