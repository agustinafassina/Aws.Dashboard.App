'use client'

import { useCallback, useMemo, useState } from 'react'
import Button from '@/components/atoms/Button'
import DockerIcon from '@/components/atoms/Icons/DockerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import type { Column } from '@/interfaces/common'
import type { InspectorFinding } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { AWS_REGIONS, DEFAULT_AWS_REGION } from '@/utils/awsDefaults'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'
import {
  groupFindingsByRepository,
  type EcrRepositoryGroup,
} from '@/utils/ecrVulnerabilities'
import { inspectorFindingColumns, severityBadge } from './inspectorUi'

const repositoryColumns: Column<EcrRepositoryGroup>[] = [
  {
    key: 'repositoryName',
    label: 'Repository',
    cellClassName: 'max-w-[14rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'imageCount',
    label: 'Image count',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'totalFindings',
    label: 'Findings',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'criticalCount',
    label: 'Critical',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'highCount',
    label: 'High',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'worstSeverity',
    label: 'Worst severity',
    cellClassName: 'whitespace-nowrap',
    render: (value) => severityBadge(String(value)),
  },
]

interface EcrByRepositoryContentProps {
  title: string
  description: string
}

export default function EcrByRepositoryContent({
  title,
  description,
}: EcrByRepositoryContentProps) {
  const [region, setRegion] = useState(DEFAULT_AWS_REGION)
  const [appliedRegion, setAppliedRegion] = useState(DEFAULT_AWS_REGION)

  const { data, isLoading, isFetching, isError, error, refetch } =
    useInspectorVulnerabilities({
      region: appliedRegion,
      resourceType: 'ecr',
    })

  const repositoryGroups = useMemo(
    () => groupFindingsByRepository(data?.findings ?? []),
    [data?.findings],
  )

  const highCriticalCount = useMemo(() => {
    let count = 0
    for (const finding of data?.findings ?? []) {
      const severity = finding.severity.toUpperCase()
      if (severity === 'CRITICAL' || severity === 'HIGH') count += 1
    }
    return count
  }, [data?.findings])

  const regionInputClass =
    'h-8 w-[8.75rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_600 dark:bg-gray_800 dark:text-gray_100'

  const handleExportPdf = useCallback(() => {
    if (!repositoryGroups.length) return

    exportTableToPdf({
      filename: `inspector-ecr-repos-${data?.region ?? appliedRegion}`,
      title,
      subtitle: `Region: ${data?.region ?? appliedRegion}`,
      columns: [
        { header: 'Repository', value: (row) => row.repositoryName },
        { header: 'Image count', value: (row) => String(row.imageCount) },
        { header: 'Findings', value: (row) => String(row.totalFindings) },
        { header: 'Critical', value: (row) => String(row.criticalCount) },
        { header: 'High', value: (row) => String(row.highCount) },
        { header: 'Worst severity', value: (row) => row.worstSeverity },
      ],
      rows: repositoryGroups,
    })
  }, [appliedRegion, data?.region, repositoryGroups, title])

  const handleExportRepositoryFindingsPdf = useCallback(
    (group: EcrRepositoryGroup) => {
      if (!group.findings.length) return

      exportTableToPdf({
        filename: `inspector-ecr-${group.repositoryName}-${data?.region ?? appliedRegion}`,
        title: `${title} — ${group.repositoryName}`,
        subtitle: `Region: ${data?.region ?? appliedRegion}`,
        columns: [
          { header: 'Severity', value: (row) => row.severity },
          { header: 'Title', value: (row) => row.title },
          { header: 'Status', value: (row) => row.status },
          {
            header: 'CVE / ID',
            value: (row) => row.vulnerabilityId ?? '—',
          },
          {
            header: 'Last observed',
            value: (row) =>
              row.lastObservedAt ? formatDate(row.lastObservedAt) : '—',
          },
          {
            header: 'Recommendation',
            value: (row) => row.recommendation ?? '—',
          },
        ],
        rows: group.findings,
      })
    },
    [appliedRegion, data?.region, title],
  )

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={title}
        description={description}
        scannedAt={data ? formatDateTime(data.scannedAt) : undefined}
        meta={
          data?.hasMoreFindings
            ? 'Results capped; increase Inspector limits in API config.'
            : undefined
        }
        actions={
          <div className="inline-flex flex-nowrap items-center gap-2">
            <label className="flex items-center gap-1.5">
              <span className="text-xs text-gray_600 dark:text-gray_400">Region</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={regionInputClass}
              >
                {AWS_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <Button
              className="h-8 min-w-0 bg-brand_600 px-3 text-xs text-white transition-colors hover:bg-brand_700 disabled:opacity-50"
              disabled={!region || isFetching}
              onClick={() => setAppliedRegion(region)}
            >
              {isFetching ? '…' : 'Scan'}
            </Button>
          </div>
        }
      />

      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string; error?: string } } })
              ?.response?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response?.data
              ?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Repositories"
              value={repositoryGroups.length}
              icon={<DockerIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Critical + High"
              value={highCriticalCount}
              variant={highCriticalCount > 0 ? 'warning' : 'success'}
              hint="Findings with Critical or High severity"
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Total findings"
              value={data.totalFindings}
              hint="Across all repositories in the region"
            />
          </div>

          <TableSection
            title="Repositories"
            onExportPdf={handleExportPdf}
            exportDisabled={repositoryGroups.length === 0}
            columns={repositoryColumns}
            data={repositoryGroups}
            emptyMessage="No vulnerabilities found for ECR repositories in this region."
            getRowKey={(row) => row.repositoryName}
          />

          {repositoryGroups.map((group) => (
            <div key={group.repositoryName}>
              <TableSection
                title={`${group.repositoryName} (${group.totalFindings})`}
                onExportPdf={() => handleExportRepositoryFindingsPdf(group)}
                exportDisabled={group.findings.length === 0}
                columns={inspectorFindingColumns}
                data={group.findings}
                emptyMessage="No findings for this repository."
                getRowKey={(row: InspectorFinding) => row.findingArn}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
