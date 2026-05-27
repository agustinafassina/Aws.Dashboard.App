'use client'

import { useCallback, useMemo, useState } from 'react'
import Button from '@/components/atoms/Button'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import type { Column } from '@/interfaces/common'
import type {
  InspectorFinding,
  InspectorResourceType,
} from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { AWS_REGIONS, DEFAULT_AWS_REGION } from '@/utils/awsDefaults'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

function severityBadge(severity: string) {
  const normalized = severity.toUpperCase()
  const styles: Record<string, string> = {
    CRITICAL:
      'bg-red_50 text-red_900 dark:bg-red_50/20 dark:text-red_200',
    HIGH:
      'bg-orange_300/50 text-gray_900 dark:bg-orange_300/20 dark:text-orange',
    MEDIUM:
      'bg-orange_300/35 text-gray_900 dark:bg-orange_300/20 dark:text-orange',
    LOW:
      'bg-brand_100 text-brand_700 dark:bg-blue_200/30 dark:text-brand_300',
    INFORMATIONAL:
      'bg-gray_200 text-gray_800 dark:bg-gray_700 dark:text-gray_300',
  }
  const className =
    styles[normalized] ??
    'bg-gray_200 text-gray_800 dark:bg-gray_700 dark:text-gray_300'

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${className}`}
    >
      {severity}
    </span>
  )
}

function formatResourceLabel(
  finding: InspectorFinding,
  resourceType: InspectorResourceType,
): string {
  const resource = finding.resource
  if (resourceType === 'ecr') {
    const repo = resource?.repositoryName ?? finding.resourceId ?? '—'
    const tag = resource?.imageTags?.[0]
    return tag ? `${repo}:${tag}` : repo
  }
  return (
    resource?.instanceId ?? finding.resourceId ?? finding.resourceType ?? '—'
  )
}

const findingColumns = (
  resourceType: InspectorResourceType,
): Column<InspectorFinding>[] => [
  {
    key: 'severity',
    label: 'Severity',
    render: (value) => severityBadge(String(value)),
  },
  { key: 'title', label: 'Title', className: 'max-w-xs' },
  { key: 'status', label: 'Status' },
  {
    key: 'resourceId',
    label: resourceType === 'ecr' ? 'Image' : 'Instance',
    render: (_, row) => formatResourceLabel(row, resourceType),
  },
  {
    key: 'vulnerabilityId',
    label: 'CVE / ID',
    className: 'font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'lastObservedAt',
    label: 'Last observed',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    className: 'max-w-sm text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
]

interface VulnerabilitiesViewProps {
  title: string
  description: string
  resourceType: InspectorResourceType
}

export default function VulnerabilitiesView({
  title,
  description,
  resourceType,
}: VulnerabilitiesViewProps) {
  const [region, setRegion] = useState(DEFAULT_AWS_REGION)
  const [appliedRegion, setAppliedRegion] = useState(DEFAULT_AWS_REGION)

  const { data, isLoading, isFetching, isError, error, refetch } =
    useInspectorVulnerabilities({
      region: appliedRegion,
      resourceType,
    })

  const severityCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const finding of data?.findings ?? []) {
      const key = finding.severity.toUpperCase()
      counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
  }, [data?.findings])

  const highCriticalCount =
    (severityCounts.CRITICAL ?? 0) + (severityCounts.HIGH ?? 0)

  const columns = findingColumns(resourceType)

  const handleExportPdf = useCallback(() => {
    if (!data?.findings.length) return

    const resourceLabel = resourceType === 'ecr' ? 'Image' : 'Instance'

    exportTableToPdf({
      filename: `inspector-${resourceType}-${data.region}`,
      title,
      subtitle: `Region: ${data.region} · Resource type: ${resourceType}`,
      columns: [
        { header: 'Severity', value: (row) => row.severity },
        { header: 'Title', value: (row) => row.title },
        { header: 'Status', value: (row) => row.status },
        {
          header: resourceLabel,
          value: (row) => formatResourceLabel(row, resourceType),
        },
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
      rows: data.findings,
    })
  }, [data, resourceType, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={title}
        description={description}
        scannedAt={data ? formatDateTime(data.scannedAt) : undefined}
      />

      <section className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-gray_200 dark:border-gray_700 bg-white dark:bg-gray_800 p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-label text-sm">AWS region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input-field min-w-[10rem]"
          >
            {AWS_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <Button
          className="bg-brand_600 hover:bg-brand_700 text-white px-6 w-auto min-w-[8rem] disabled:opacity-50 transition-colors"
          disabled={!region || isFetching}
          onClick={() => setAppliedRegion(region)}
        >
          {isFetching ? 'Loading…' : 'Scan'}
        </Button>
        {data && (
          <p className="text-xs text-gray_700 dark:text-gray_500 w-full">
            Region: {data.region}
            {data.hasMoreFindings &&
              ' · Results capped; increase Inspector limits in API config.'}
          </p>
        )}
      </section>

      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 rounded-xl bg-gray_200 dark:bg-gray_700 animate-pulse" />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string; error?: string } } })
              ?.response?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total findings" value={data.totalFindings} />
            <StatCard
              label="Critical + High"
              value={highCriticalCount}
              variant={highCriticalCount > 0 ? 'warning' : 'success'}
            />
            <StatCard
              label="Resource type"
              value={data.resourceTypeFilter ?? resourceType}
              hint="Amazon Inspector filter"
            />
          </div>

          <TableSection
            title="Findings"
            onExportPdf={handleExportPdf}
            exportDisabled={data.findings.length === 0}
            columns={columns}
            data={data.findings}
            emptyMessage="No vulnerabilities found for this region and resource type."
            getRowKey={(row) => row.findingArn}
          />
        </>
      )}
    </div>
  )
}
