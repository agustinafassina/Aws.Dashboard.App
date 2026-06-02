'use client'

import { useCallback, useMemo } from 'react'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import SeverityFilterSelect from '@/components/molecules/SeverityFilterSelect'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useAwsRegion } from '@/context/RegionContext'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useSeverityFilter } from '@/hooks/useSeverityFilter'
import type { Column } from '@/interfaces/common'
import type {
  InspectorFinding,
  InspectorResourceType,
} from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'
import EcrByRepositoryContent from './EcrByRepositoryContent'
import { inspectorFindingColumns, sortFindingsBySeverity } from './inspectorUi'

function formatInstanceLabel(finding: InspectorFinding): string {
  return (
    finding.resource?.instanceId ??
    finding.resourceId ??
    finding.resourceType ??
    '—'
  )
}

const ec2FindingColumns: Column<InspectorFinding>[] = [
  ...inspectorFindingColumns.slice(0, 3),
  {
    key: 'resourceId',
    label: 'Instance',
    cellClassName: 'max-w-[12rem] truncate whitespace-nowrap font-mono text-xs',
    render: (_, row) => formatInstanceLabel(row),
  },
  ...inspectorFindingColumns.slice(3),
]

interface VulnerabilitiesViewProps {
  title: string
  description: string
  resourceType: InspectorResourceType
}

function Ec2VulnerabilitiesContent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { apiSeverity } = useSeverityFilter()

  const { data, isLoading, isError, error, refetch } = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
    severity: apiSeverity,
  })

  const highCriticalCount = useMemo(() => {
    let count = 0
    for (const finding of data?.findings ?? []) {
      const severity = finding.severity.toUpperCase()
      if (severity === 'CRITICAL' || severity === 'HIGH') count += 1
    }
    return count
  }, [data?.findings])

  const sortedFindings = useMemo(
    () => sortFindingsBySeverity(data?.findings ?? []),
    [data?.findings],
  )

  const handleExportPdf = useCallback(() => {
    if (!sortedFindings.length) return

    exportTableToPdf({
      filename: `inspector-ec2-${data?.region ?? region}`,
      title,
      subtitle: `Region: ${data?.region ?? region}`,
      report: buildReport({
        region: data?.region ?? region,
        scannedAt: data?.scannedAt,
        executiveSummary: [
          `${data?.totalFindings ?? 0} Inspector finding(s); ${highCriticalCount} Critical or High severity.`,
        ],
      }),
      columns: [
        { header: 'Severity', value: (row) => row.severity },
        { header: 'Title', value: (row) => row.title },
        { header: 'Status', value: (row) => row.status },
        {
          header: 'Instance',
          value: (row) => formatInstanceLabel(row),
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
      rows: sortedFindings,
    })
  }, [buildReport, data, highCriticalCount, region, sortedFindings, title])

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
        actions={<SeverityFilterSelect />}
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
              label="Total findings"
              value={data.totalFindings}
              icon={<ServerIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Critical + High"
              value={highCriticalCount}
              variant={highCriticalCount > 0 ? 'warning' : 'success'}
              hint="Findings with Critical or High severity"
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Findings"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedFindings.length === 0}
            columns={ec2FindingColumns}
            data={sortedFindings}
            emptyMessage="No vulnerabilities found for this region and resource type."
            getRowKey={(row) => row.findingArn}
          />
        </>
      )}
    </div>
  )
}

export default function VulnerabilitiesView({
  title,
  description,
  resourceType,
}: VulnerabilitiesViewProps) {
  if (resourceType === 'ecr') {
    return <EcrByRepositoryContent title={title} description={description} />
  }

  return <Ec2VulnerabilitiesContent title={title} description={description} />
}
