'use client'

import { useMemo } from 'react'
import { useCostByProject } from '@/hooks/useCostByProject'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import { useAwsRegion } from '@/context/RegionContext'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { formatCurrency } from '@/utils/formatters'
import { countHighCriticalFindings } from '@/utils/inspectorMetrics'

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

  const latestScannedAt = useMemo(() => {
    let latest: Date | null = null
    const candidates = [
      costsQuery.data?.scannedAt,
      iamUsersQuery.data?.scannedAt,
      iamKeysQuery.data?.scannedAt,
      inspectorEcrQuery.data?.scannedAt,
      inspectorEc2Query.data?.scannedAt,
      ec2PortsQuery.data?.scannedAt,
      rdsPortsQuery.data?.scannedAt,
      s3Query.data?.scannedAt,
    ]
    for (const scannedAt of candidates) {
      if (!scannedAt) continue
      const parsed = new Date(scannedAt)
      if (Number.isNaN(parsed.getTime())) continue
      if (!latest || parsed > latest) latest = parsed
    }
    return latest?.toISOString() ?? null
  }, [
    costsQuery.data?.scannedAt,
    iamUsersQuery.data?.scannedAt,
    iamKeysQuery.data?.scannedAt,
    inspectorEcrQuery.data?.scannedAt,
    inspectorEc2Query.data?.scannedAt,
    ec2PortsQuery.data?.scannedAt,
    rdsPortsQuery.data?.scannedAt,
    s3Query.data?.scannedAt,
  ])

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
    !s3Query.data

  const isRegionalFetching =
    inspectorEcrQuery.isFetching ||
    inspectorEc2Query.isFetching ||
    ec2PortsQuery.isFetching ||
    rdsPortsQuery.isFetching ||
    s3Query.isFetching

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
    monthSpendFormatted,
    topProject,
    topProjectHint,
    topProjectsChart,
    costCurrency: costsQuery.data?.currency,
    keysNeedingRotation: iamKeysQuery.data?.accessKeysNeedingRotation ?? 0,
    criticalHighFindings,
    rdsPublicPorts: rdsPortsQuery.data?.instancesWithPublicPorts ?? 0,
    ec2PublicPorts: ec2PortsQuery.data?.instancesWithPublicPorts ?? 0,
    s3PublicBuckets: s3Query.data?.publicBucketsCount ?? 0,
    scans,
    latestScannedAt,
    isInitialLoading,
    isRegionalFetching,
    isAnyFetching,
  }
}
