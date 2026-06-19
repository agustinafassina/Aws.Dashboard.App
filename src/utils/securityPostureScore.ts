import type { SecuritySummaryResponse } from '@/interfaces/aws-api'

export type SecurityGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low'

export interface SecurityPostureContributor {
  key: string
  severity: SecuritySeverity
  count: number
}

export interface SecurityPosture {
  score: number
  grade: SecurityGrade
  critical: number
  high: number
  medium: number
  low: number
  totalIssues: number
  topContributors: SecurityPostureContributor[]
}

interface CheckDefinition {
  key: string
  severity: SecuritySeverity
  count: (summary: SecuritySummaryResponse) => number
}

const CHECKS: CheckDefinition[] = [
  { key: 'rootAccountRisk', severity: 'critical', count: (s) => s.rootAccountRiskCount },
  { key: 'usersWithoutMfa', severity: 'critical', count: (s) => s.usersWithoutMfa },
  { key: 'riskyPolicies', severity: 'critical', count: (s) => s.riskyPolicies },
  { key: 'publicBuckets', severity: 'critical', count: (s) => s.publicBuckets },
  { key: 'ec2OpenPorts', severity: 'critical', count: (s) => s.instancesWithOpenPorts },
  { key: 'rdsOpenPorts', severity: 'critical', count: (s) => s.rdsInstancesWithOpenPorts },
  { key: 'inspectorFindings', severity: 'critical', count: (s) => s.activeInspectorFindings },
  { key: 'unencryptedBuckets', severity: 'high', count: (s) => s.unencryptedBuckets },
  { key: 'unencryptedRds', severity: 'high', count: (s) => s.unencryptedRdsInstances },
  { key: 'publicLambda', severity: 'high', count: (s) => s.publicLambdaFunctions },
  { key: 'ecrRisks', severity: 'high', count: (s) => s.ecrRepositoriesAtRisk },
  { key: 'adminGrants', severity: 'high', count: (s) => s.adminPrivilegeGrants },
  { key: 'riskyInlinePolicies', severity: 'high', count: (s) => s.riskyInlinePolicies },
  { key: 'expiredCertificates', severity: 'high', count: (s) => s.expiredCertificates },
  { key: 'imdsv1', severity: 'medium', count: (s) => s.imdsv1Instances },
  { key: 'publicLoadBalancers', severity: 'medium', count: (s) => s.publicLoadBalancers },
  { key: 'expiringCertificates', severity: 'medium', count: (s) => s.expiringCertificates },
  { key: 'crossAccountRoles', severity: 'medium', count: (s) => s.crossAccountRoles },
  { key: 'keysNeedingRotation', severity: 'medium', count: (s) => s.accessKeysNeedingRotation },
  { key: 'unusedSecurityGroups', severity: 'low', count: (s) => s.unusedSecurityGroups },
  { key: 'unattachedVolumes', severity: 'low', count: (s) => s.unattachedVolumes },
  { key: 'untaggedResources', severity: 'low', count: (s) => s.untaggedResources },
  { key: 'keysNeverUsed', severity: 'low', count: (s) => s.accessKeysNeverUsed },
]

const SEVERITY_PENALTY: Record<SecuritySeverity, number> = {
  critical: 10,
  high: 5,
  medium: 2,
  low: 0.5,
}

const SEVERITY_CAP: Record<SecuritySeverity, number> = {
  critical: 20,
  high: 12,
  medium: 6,
  low: 3,
}

function gradeFromScore(score: number): SecurityGrade {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export function computeSecurityPosture(
  summary: SecuritySummaryResponse | undefined,
): SecurityPosture | null {
  if (!summary) return null

  let penalty = 0
  let critical = 0
  let high = 0
  let medium = 0
  let low = 0
  const contributors: SecurityPostureContributor[] = []

  for (const check of CHECKS) {
    const count = Math.max(0, check.count(summary) ?? 0)
    if (count === 0) continue

    const cappedPenalty = Math.min(
      count * SEVERITY_PENALTY[check.severity],
      SEVERITY_CAP[check.severity],
    )
    penalty += cappedPenalty

    if (check.severity === 'critical') critical += count
    else if (check.severity === 'high') high += count
    else if (check.severity === 'medium') medium += count
    else low += count

    contributors.push({ key: check.key, severity: check.severity, count })
  }

  const severityRank: Record<SecuritySeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }
  contributors.sort((a, b) => {
    if (severityRank[a.severity] !== severityRank[b.severity]) {
      return severityRank[a.severity] - severityRank[b.severity]
    }
    return b.count - a.count
  })

  const score = Math.max(0, Math.min(100, Math.round(100 - penalty)))

  return {
    score,
    grade: gradeFromScore(score),
    critical,
    high,
    medium,
    low,
    totalIssues: critical + high + medium + low,
    topContributors: contributors.slice(0, 3),
  }
}
