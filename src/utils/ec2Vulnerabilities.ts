import type { InspectorFinding } from '@/interfaces/aws-api'
import { severityRank } from '@/utils/ecrVulnerabilities'

export interface Ec2InstanceGroup {
  instanceId: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  worstSeverity: string
  findings: InspectorFinding[]
}

function bumpSeverityCount(
  counts: Pick<
    Ec2InstanceGroup,
    'criticalCount' | 'highCount' | 'mediumCount' | 'lowCount'
  >,
  severity: string,
) {
  const key = severity.toUpperCase()
  if (key === 'CRITICAL') counts.criticalCount += 1
  else if (key === 'HIGH') counts.highCount += 1
  else if (key === 'MEDIUM') counts.mediumCount += 1
  else if (key === 'LOW') counts.lowCount += 1
}

function worseSeverity(current: string, next: string): string {
  return severityRank(next) < severityRank(current) ? next : current
}

export function getInstanceId(finding: InspectorFinding): string {
  return (
    finding.resource?.instanceId ??
    finding.resourceId ??
    'Unknown instance'
  )
}

export function groupFindingsByInstance(
  findings: InspectorFinding[],
): Ec2InstanceGroup[] {
  const map = new Map<string, Ec2InstanceGroup>()

  for (const finding of findings) {
    const instanceId = getInstanceId(finding)
    let group = map.get(instanceId)

    if (!group) {
      group = {
        instanceId,
        totalFindings: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        worstSeverity: finding.severity,
        findings: [],
      }
      map.set(instanceId, group)
    }

    group.findings.push(finding)
    group.totalFindings += 1
    bumpSeverityCount(group, finding.severity)
    group.worstSeverity = worseSeverity(group.worstSeverity, finding.severity)
  }

  return [...map.values()]
    .map((group) => ({
      ...group,
      findings: [...group.findings].sort((a, b) => {
        const bySeverity = severityRank(a.severity) - severityRank(b.severity)
        if (bySeverity !== 0) return bySeverity
        return a.title.localeCompare(b.title)
      }),
    }))
    .sort((a, b) => {
      const aRisk = a.criticalCount + a.highCount
      const bRisk = b.criticalCount + b.highCount
      if (aRisk !== bRisk) return bRisk - aRisk
      if (a.totalFindings !== b.totalFindings) return b.totalFindings - a.totalFindings
      return a.instanceId.localeCompare(b.instanceId)
    })
}
