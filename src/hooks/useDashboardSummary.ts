'use client'

import { useMemo } from 'react'
import { useCostByProject } from '@/hooks/useCostByProject'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import { DEFAULT_AWS_REGION } from '@/utils/awsDefaults'
import { defaultCostDateRange, formatCurrency } from '@/utils/formatters'
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
  const region = DEFAULT_AWS_REGION
  const costRange = useMemo(() => defaultCostDateRange(), [])

  const costsQuery = useCostByProject(costRange.startDate, costRange.endDate)
  const iamQuery = useIamAccessKeys()
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

  const scans: DashboardScanEntry[] = useMemo(
    () => [
      {
        key: 'costs',
        scannedAt: costsQuery.data?.scannedAt ?? null,
        isLoading: costsQuery.isLoading,
        isError: costsQuery.isError,
      },
      {
        key: 'iam',
        scannedAt: iamQuery.data?.scannedAt ?? null,
        isLoading: iamQuery.isLoading,
        isError: iamQuery.isError,
      },
      {
        key: 'inspectorEcr',
        scannedAt: inspectorEcrQuery.data?.scannedAt ?? null,
        isLoading: inspectorEcrQuery.isLoading,
        isError: inspectorEcrQuery.isError,
      },
      {
        key: 'inspectorEc2',
        scannedAt: inspectorEc2Query.data?.scannedAt ?? null,
        isLoading: inspectorEc2Query.isLoading,
        isError: inspectorEc2Query.isError,
      },
      {
        key: 'ec2Ports',
        scannedAt: ec2PortsQuery.data?.scannedAt ?? null,
        isLoading: ec2PortsQuery.isLoading,
        isError: ec2PortsQuery.isError,
      },
      {
        key: 'rdsPorts',
        scannedAt: rdsPortsQuery.data?.scannedAt ?? null,
        isLoading: rdsPortsQuery.isLoading,
        isError: rdsPortsQuery.isError,
      },
      {
        key: 's3',
        scannedAt: s3Query.data?.scannedAt ?? null,
        isLoading: s3Query.isLoading,
        isError: s3Query.isError,
      },
    ],
    [
      costsQuery.data?.scannedAt,
      costsQuery.isLoading,
      costsQuery.isError,
      iamQuery.data?.scannedAt,
      iamQuery.isLoading,
      iamQuery.isError,
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
    iamQuery.isLoading &&
    inspectorEcrQuery.isLoading &&
    inspectorEc2Query.isLoading &&
    ec2PortsQuery.isLoading &&
    rdsPortsQuery.isLoading &&
    s3Query.isLoading

  return {
    region,
    costRange,
    costsQuery,
    iamQuery,
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
    keysNeedingRotation: iamQuery.data?.accessKeysNeedingRotation ?? 0,
    criticalHighFindings,
    rdsPublicPorts: rdsPortsQuery.data?.instancesWithPublicPorts ?? 0,
    ec2PublicPorts: ec2PortsQuery.data?.instancesWithPublicPorts ?? 0,
    s3PublicBuckets: s3Query.data?.publicBucketsCount ?? 0,
    scans,
    isInitialLoading,
  }
}
