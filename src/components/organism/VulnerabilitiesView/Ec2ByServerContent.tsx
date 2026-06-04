'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import SeverityFilterSelect from '@/components/molecules/SeverityFilterSelect'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { ec2ServerDetailHref } from '@/config/vulnerabilityLinks'
import { useAwsRegion } from '@/context/RegionContext'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useSeverityFilter } from '@/hooks/useSeverityFilter'
import { useTranslation } from '@/i18n/useTranslation'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { exportTableToPdf } from '@/utils/exportPdf'
import {
  groupFindingsByInstance,
  type Ec2InstanceGroup,
} from '@/utils/ec2Vulnerabilities'
import {
  formatInspectorTotalDisplay,
  getInspectorLoadedCount,
} from '@/utils/inspectorDisplay'
import { severityBadge } from './inspectorUi'

const instanceColumns: Column<Ec2InstanceGroup>[] = [
  {
    key: 'instanceId',
    label: 'Instance',
    cellClassName: 'max-w-[14rem] truncate whitespace-nowrap font-mono text-xs',
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
  {
    key: 'instanceId',
    label: 'View',
    cellClassName: 'whitespace-nowrap text-right',
    headerClassName: 'text-right',
    render: (_value, row) => (
      <ViewInstanceLink instanceId={row.instanceId} />
    ),
  },
]

function ViewInstanceLink({ instanceId }: { instanceId: string }) {
  const { region } = useAwsRegion()
  const { severity } = useSeverityFilter()
  const href = ec2ServerDetailHref(instanceId, {
    region,
    ...(severity ? { severity } : {}),
  })

  return (
    <Link
      href={href}
      className="text-xs font-semibold text-brand_600 hover:text-brand_700 dark:text-brand_300 dark:hover:text-brand_200"
    >
      View
    </Link>
  )
}

interface Ec2ByServerContentProps {
  title: string
  description: string
}

export default function Ec2ByServerContent({
  title,
  description,
}: Ec2ByServerContentProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { apiSeverity } = useSeverityFilter()
  const { dictionary, format } = useTranslation()
  const ins = dictionary.inspector

  const { data, isLoading, isError, error, refetch } = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
    severity: apiSeverity,
  })

  const instanceGroups = useMemo(
    () => groupFindingsByInstance(data?.findings ?? []),
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

  const handleExportPdf = useCallback(() => {
    if (!instanceGroups.length) return

    exportTableToPdf({
      filename: `inspector-ec2-instances-${data?.region ?? region}`,
      title,
      subtitle: `Region: ${data?.region ?? region}`,
      report: buildReport({
        region: data?.region ?? region,
        scannedAt: data?.scannedAt,
        executiveSummary: [
          `${data ? formatInspectorTotalDisplay(data) : 0} finding(s) across ${instanceGroups.length} EC2 instance(s); ${highCriticalCount} Critical or High.`,
        ],
      }),
      columns: [
        { header: 'Instance', value: (row) => row.instanceId },
        { header: 'Findings', value: (row) => String(row.totalFindings) },
        { header: 'Critical', value: (row) => String(row.criticalCount) },
        { header: 'High', value: (row) => String(row.highCount) },
        { header: 'Worst severity', value: (row) => row.worstSeverity },
      ],
      rows: instanceGroups,
    })
  }, [buildReport, data, highCriticalCount, instanceGroups, region, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={title}
        description={description}
        meta={
          data?.hasMoreFindings
            ? format(ins.resultsCapped, {
                count: String(getInspectorLoadedCount(data)),
              })
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
              label="Instances"
              value={instanceGroups.length}
              icon={<ServerIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Critical + High"
              value={highCriticalCount}
              variant={highCriticalCount > 0 ? 'warning' : 'success'}
              hint="Findings with Critical or High severity"
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              label="Total findings"
              value={formatInspectorTotalDisplay(data)}
              hint={
                data.hasMoreFindings
                  ? format(ins.totalFindingsCappedHint, {
                      count: String(getInspectorLoadedCount(data)),
                    })
                  : ins.totalFindingsHint
              }
              icon={<ServerIcon className="h-5 w-5" />}
              iconTone={2}
            />
          </div>

          <TableSection
            title="Instances"
            onExportPdf={handleExportPdf}
            exportDisabled={instanceGroups.length === 0}
            columns={instanceColumns}
            data={instanceGroups}
            emptyMessage="No vulnerabilities found for EC2 instances in this region."
            getRowKey={(row) => row.instanceId}
          />
        </>
      )}
    </div>
  )
}
