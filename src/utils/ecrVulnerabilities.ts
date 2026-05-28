import type { InspectorFinding } from '@/interfaces/aws-api'

export interface EcrRepositoryGroup {
  repositoryName: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  imageCount: number
  worstSeverity: string
  findings: InspectorFinding[]
}

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFORMATIONAL: 4,
  UNTRIAGED: 5,
}

export function severityRank(severity: string): number {
  return SEVERITY_ORDER[severity.toUpperCase()] ?? 99
}

export function getRepositoryName(finding: InspectorFinding): string {
  return (
    finding.resource?.repositoryName ??
    finding.resourceId ??
    'Unknown repository'
  )
}

function getImageKey(finding: InspectorFinding): string {
  const resource = finding.resource
  return (
    resource?.imageHash ??
    resource?.imageTags?.[0] ??
    finding.resourceId ??
    finding.findingArn
  )
}

function bumpSeverityCount(
  counts: Pick<
    EcrRepositoryGroup,
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

export function groupFindingsByRepository(
  findings: InspectorFinding[],
): EcrRepositoryGroup[] {
  const map = new Map<
    string,
    EcrRepositoryGroup & { imageKeys: Set<string> }
  >()

  for (const finding of findings) {
    const repositoryName = getRepositoryName(finding)
    let group = map.get(repositoryName)

    if (!group) {
      group = {
        repositoryName,
        totalFindings: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        imageCount: 0,
        worstSeverity: finding.severity,
        findings: [],
        imageKeys: new Set(),
      }
      map.set(repositoryName, group)
    }

    group.findings.push(finding)
    group.imageKeys.add(getImageKey(finding))
    group.totalFindings += 1
    bumpSeverityCount(group, finding.severity)
    group.worstSeverity = worseSeverity(group.worstSeverity, finding.severity)
  }

  return [...map.values()]
    .map(({ imageKeys, ...group }) => ({
      ...group,
      imageCount: imageKeys.size,
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
      return a.repositoryName.localeCompare(b.repositoryName)
    })
}
