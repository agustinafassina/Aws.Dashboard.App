'use client'

import { useMemo } from 'react'
import { useCostByProject } from '@/hooks/useCostByProject'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import { useS3EncryptionStatus } from '@/hooks/useS3EncryptionStatus'
import { useLambdaPublicFunctions } from '@/hooks/useLambdaPublicFunctions'
import { useAcmExpiringCertificates } from '@/hooks/useAcmExpiringCertificates'
import { useEc2UnusedSecurityGroups } from '@/hooks/useEc2UnusedSecurityGroups'
import { useEc2UnattachedVolumes } from '@/hooks/useEc2UnattachedVolumes'
import { useSecuritySummary } from '@/hooks/useSecuritySummary'
import { useAwsRegion } from '@/context/RegionContext'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { formatCurrency } from '@/utils/formatters'
import { countHighCriticalFindings } from '@/utils/inspectorMetrics'
import { computeSecurityPosture } from '@/utils/securityPostureScore'

import type { DashboardScanModuleKey } from '@/i18n/types'

export type { DashboardScanModuleKey }

export interface DashboardScanEntry {
  key: DashboardScanModuleKey
  scannedAt: string | null
  isLoading: boolean
  isError: boolean
}

export function useDashboardSummary() {
  const { region } = useAwsRegion()
  const { appliedRange: costRange } = useCostDateRange()

  const costsQuery = useCostByProject(
    costRange.startDate,
    costRange.endDate,
  )
  const iamKeysQuery = useIamAccessKeys()
  const iamUsersQuery = useIamUsersWithoutMfa()
  const inspectorEcrQuery = useInspectorVulnerabilities({
    region,
    resourceType: 'ecr',
  })
  const inspectorEc2Query = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
  })
  const ec2PortsQuery = useEc2OpenPorts(region)
  const rdsPortsQuery = useRdsOpenPorts(region)
  const s3Query = useS3PublicBuckets(region)
  const s3EncryptionQuery = useS3EncryptionStatus(region)
  const lambdaQuery = useLambdaPublicFunctions(region)
  const acmQuery = useAcmExpiringCertificates(region)
  const ec2UnusedSecurityGroupsQuery = useEc2UnusedSecurityGroups(region)
  const ec2UnattachedVolumesQuery = useEc2UnattachedVolumes(region)
  const securitySummaryQuery = useSecuritySummary(region)

  const topProject = useMemo(() => {
    const projects = costsQuery.data?.projects ?? []
    if (projects.length === 0) return null
    return projects.reduce((max, project) =>
      project.amount > max.amount ? project : max,
    )
  }, [costsQuery.data?.projects])

  const topProjectsChart = useMemo(
    () =>
      [...(costsQuery.data?.projects ?? [])]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map((project) => ({
          name: project.project,
          amount: project.amount,
        })),
    [costsQuery.data?.projects],
  )

  const criticalHighFindings =
    countHighCriticalFindings(inspectorEcrQuery.data?.findings) +
    countHighCriticalFindings(inspectorEc2Query.data?.findings)

  const securityPosture = useMemo(
    () => computeSecurityPosture(securitySummaryQuery.data),
    [securitySummaryQuery.data],
  )

  const scans: DashboardScanEntry[] = useMemo(
    () => [
      {
        key: 'costs',
        scannedAt: costsQuery.data?.scannedAt ?? null,
        isLoading: costsQuery.isLoading || costsQuery.isFetching,
        isError: costsQuery.isError,
      },
      {
        key: 'iamUsers',
        scannedAt: iamUsersQuery.data?.scannedAt ?? null,
        isLoading: iamUsersQuery.isLoading || iamUsersQuery.isFetching,
        isError: iamUsersQuery.isError,
      },
      {
        key: 'iamAccessKeys',
        scannedAt: iamKeysQuery.data?.scannedAt ?? null,
        isLoading: iamKeysQuery.isLoading || iamKeysQuery.isFetching,
        isError: iamKeysQuery.isError,
      },
      {
        key: 'inspectorEcr',
        scannedAt: inspectorEcrQuery.data?.scannedAt ?? null,
        isLoading: inspectorEcrQuery.isLoading || inspectorEcrQuery.isFetching,
        isError: inspectorEcrQuery.isError,
      },
      {
        key: 'inspectorEc2',
        scannedAt: inspectorEc2Query.data?.scannedAt ?? null,
        isLoading: inspectorEc2Query.isLoading || inspectorEc2Query.isFetching,
        isError: inspectorEc2Query.isError,
      },
      {
        key: 'ec2Ports',
        scannedAt: ec2PortsQuery.data?.scannedAt ?? null,
        isLoading: ec2PortsQuery.isLoading || ec2PortsQuery.isFetching,
        isError: ec2PortsQuery.isError,
      },
      {
        key: 'rdsPorts',
        scannedAt: rdsPortsQuery.data?.scannedAt ?? null,
        isLoading: rdsPortsQuery.isLoading || rdsPortsQuery.isFetching,
        isError: rdsPortsQuery.isError,
      },
      {
        key: 's3',
        scannedAt: s3Query.data?.scannedAt ?? null,
        isLoading: s3Query.isLoading || s3Query.isFetching,
        isError: s3Query.isError,
      },
      {
        key: 's3Encryption',
        scannedAt: s3EncryptionQuery.data?.scannedAt ?? null,
        isLoading: s3EncryptionQuery.isLoading || s3EncryptionQuery.isFetching,
        isError: s3EncryptionQuery.isError,
      },
      {
        key: 'lambdaPublicFunctions',
        scannedAt: lambdaQuery.data?.scannedAt ?? null,
        isLoading: lambdaQuery.isLoading || lambdaQuery.isFetching,
        isError: lambdaQuery.isError,
      },
      {
        key: 'acmCertificates',
        scannedAt: acmQuery.data?.scannedAt ?? null,
        isLoading: acmQuery.isLoading || acmQuery.isFetching,
        isError: acmQuery.isError,
      },
      {
        key: 'ec2UnusedSecurityGroups',
        scannedAt: ec2UnusedSecurityGroupsQuery.data?.scannedAt ?? null,
        isLoading:
          ec2UnusedSecurityGroupsQuery.isLoading ||
          ec2UnusedSecurityGroupsQuery.isFetching,
        isError: ec2UnusedSecurityGroupsQuery.isError,
      },
      {
        key: 'ec2UnattachedVolumes',
        scannedAt: ec2UnattachedVolumesQuery.data?.scannedAt ?? null,
        isLoading:
          ec2UnattachedVolumesQuery.isLoading ||
          ec2UnattachedVolumesQuery.isFetching,
        isError: ec2UnattachedVolumesQuery.isError,
      },
    ],
    [
      costsQuery.data?.scannedAt,
      costsQuery.isLoading,
      costsQuery.isError,
      iamUsersQuery.data?.scannedAt,
      iamUsersQuery.isLoading,
      iamUsersQuery.isError,
      iamKeysQuery.data?.scannedAt,
      iamKeysQuery.isLoading,
      iamKeysQuery.isError,
      inspectorEcrQuery.data?.scannedAt,
      inspectorEcrQuery.isLoading,
      inspectorEcrQuery.isError,
      inspectorEc2Query.data?.scannedAt,
      inspectorEc2Query.isLoading,
      inspectorEc2Query.isError,
      ec2PortsQuery.data?.scannedAt,
      ec2PortsQuery.isLoading,
      ec2PortsQuery.isError,
      rdsPortsQuery.data?.scannedAt,
      rdsPortsQuery.isLoading,
      rdsPortsQuery.isError,
      s3Query.data?.scannedAt,
      s3Query.isLoading,
      s3Query.isError,
      s3EncryptionQuery.data?.scannedAt,
      s3EncryptionQuery.isLoading,
      s3EncryptionQuery.isError,
      lambdaQuery.data?.scannedAt,
      lambdaQuery.isLoading,
      lambdaQuery.isError,
      acmQuery.data?.scannedAt,
      acmQuery.isLoading,
      acmQuery.isError,
      ec2UnusedSecurityGroupsQuery.data?.scannedAt,
      ec2UnusedSecurityGroupsQuery.isLoading,
      ec2UnusedSecurityGroupsQuery.isError,
      ec2UnattachedVolumesQuery.data?.scannedAt,
      ec2UnattachedVolumesQuery.isLoading,
      ec2UnattachedVolumesQuery.isError,
    ],
  )

  const monthSpendFormatted = costsQuery.data
    ? formatCurrency(costsQuery.data.totalAmount, costsQuery.data.currency)
    : null

  const topProjectHint = topProject
    ? formatCurrency(topProject.amount, topProject.currency)
    : undefined

  const isInitialLoading =
    costsQuery.isLoading &&
    !costsQuery.data &&
    iamKeysQuery.isLoading &&
    !iamKeysQuery.data &&
    iamUsersQuery.isLoading &&
    !iamUsersQuery.data &&
    inspectorEcrQuery.isLoading &&
    !inspectorEcrQuery.data &&
    inspectorEc2Query.isLoading &&
    !inspectorEc2Query.data &&
    ec2PortsQuery.isLoading &&
    !ec2PortsQuery.data &&
    rdsPortsQuery.isLoading &&
    !rdsPortsQuery.data &&
    s3Query.isLoading &&
    !s3Query.data &&
    s3EncryptionQuery.isLoading &&
    !s3EncryptionQuery.data &&
    lambdaQuery.isLoading &&
    !lambdaQuery.data &&
    acmQuery.isLoading &&
    !acmQuery.data &&
    ec2UnusedSecurityGroupsQuery.isLoading &&
    !ec2UnusedSecurityGroupsQuery.data &&
    ec2UnattachedVolumesQuery.isLoading &&
    !ec2UnattachedVolumesQuery.data &&
    securitySummaryQuery.isLoading &&
    !securitySummaryQuery.data

  const isRegionalFetching =
    inspectorEcrQuery.isFetching ||
    inspectorEc2Query.isFetching ||
    ec2PortsQuery.isFetching ||
    rdsPortsQuery.isFetching ||
    s3Query.isFetching ||
    s3EncryptionQuery.isFetching ||
    lambdaQuery.isFetching ||
    acmQuery.isFetching ||
    ec2UnusedSecurityGroupsQuery.isFetching ||
    ec2UnattachedVolumesQuery.isFetching ||
    securitySummaryQuery.isFetching

  const isAnyFetching =
    isRegionalFetching ||
    costsQuery.isFetching ||
    iamKeysQuery.isFetching ||
    iamUsersQuery.isFetching

  return {
    region,
    costRange,
    costsQuery,
    iamKeysQuery,
    iamUsersQuery,
    inspectorEcrQuery,
    inspectorEc2Query,
    ec2PortsQuery,
    rdsPortsQuery,
    s3Query,
    s3EncryptionQuery,
    lambdaQuery,
    acmQuery,
    ec2UnusedSecurityGroupsQuery,
    ec2UnattachedVolumesQuery,
    securitySummaryQuery,
    securityPosture,
    monthSpendFormatted,
    topProject,
    topProjectHint,
    topProjectsChart,
    costCurrency: costsQuery.data?.currency,
    keysNeedingRotation: iamKeysQuery.data?.accessKeysNeedingRotation ?? 0,
    criticalHighFindings,
    rdsPublicPorts:
      securitySummaryQuery.data?.rdsInstancesWithOpenPorts ??
      rdsPortsQuery.data?.instancesWithPublicPorts ??
      0,
    ec2PublicPorts:
      securitySummaryQuery.data?.instancesWithOpenPorts ??
      ec2PortsQuery.data?.instancesWithPublicPorts ??
      0,
    s3PublicBuckets:
      securitySummaryQuery.data?.publicBuckets ?? s3Query.data?.publicBucketsCount ?? 0,
    s3UnencryptedBuckets:
      securitySummaryQuery.data?.unencryptedBuckets ??
      s3EncryptionQuery.data?.unencryptedBucketsCount ??
      0,
    lambdaPublicFunctions:
      securitySummaryQuery.data?.publicLambdaFunctions ??
      lambdaQuery.data?.publicFunctionsCount ??
      0,
    acmExpiringCertificates:
      securitySummaryQuery.data?.expiringCertificates ??
      acmQuery.data?.expiringCertificatesCount ??
      0,
    ec2UnusedSecurityGroups:
      securitySummaryQuery.data?.unusedSecurityGroups ??
      ec2UnusedSecurityGroupsQuery.data?.unusedSecurityGroupsCount ??
      0,
    ec2UnattachedVolumes:
      securitySummaryQuery.data?.unattachedVolumes ??
      ec2UnattachedVolumesQuery.data?.unattachedVolumesCount ??
      0,
    publicLoadBalancers: securitySummaryQuery.data?.publicLoadBalancers ?? 0,
    ecrRepositoryRisks: securitySummaryQuery.data?.ecrRepositoriesAtRisk ?? 0,
    ec2Imdsv1Instances: securitySummaryQuery.data?.imdsv1Instances ?? 0,
    rdsUnencryptedInstances: securitySummaryQuery.data?.unencryptedRdsInstances ?? 0,
    scans,
    isInitialLoading,
    isRegionalFetching,
    isAnyFetching,
  }
}
