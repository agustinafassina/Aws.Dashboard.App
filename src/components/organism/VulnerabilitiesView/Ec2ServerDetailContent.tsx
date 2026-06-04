'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import ChevronIcon from '@/components/atoms/Icons/ChevronIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import SeverityFilterSelect from '@/components/molecules/SeverityFilterSelect'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { ec2ServersListHref } from '@/config/vulnerabilityLinks'
import { useAwsRegion } from '@/context/RegionContext'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useSeverityFilter } from '@/hooks/useSeverityFilter'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'
import { groupFindingsByInstance } from '@/utils/ec2Vulnerabilities'
import { inspectorFindingColumns } from './inspectorUi'

const filterControlClass =
  'inline-flex h-8 items-center gap-1 rounded-md border border-gray_200 bg-white px-2.5 text-xs font-medium text-gray_900 transition-colors hover:bg-brand_50 dark:border-gray-700 dark:bg-gray_850 dark:text-gray_100 dark:hover:bg-gray_800'

interface Ec2ServerDetailContentProps {
  instanceId: string
}

export default function Ec2ServerDetailContent({
  instanceId,
}: Ec2ServerDetailContentProps) {
  const { region } = useAwsRegion()
  const { apiSeverity, severity } = useSeverityFilter()
  const { buildReport } = usePdfReport()

  const listHref = ec2ServersListHref({
    region,
    ...(severity ? { severity } : {}),
  })

  const { data, isLoading, isError, error, refetch } = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
    severity: apiSeverity,
  })

  const group = useMemo(() => {
    const groups = groupFindingsByInstance(data?.findings ?? [])
    return groups.find((g) => g.instanceId === instanceId) ?? null
  }, [data?.findings, instanceId])

  const handleExportPdf = useCallback(() => {
    if (!group?.findings.length) return

    exportTableToPdf({
      filename: `inspector-ec2-${group.instanceId}-${data?.region ?? region}`,
      title: `EC2 vulnerabilities — ${group.instanceId}`,
      subtitle: `Region: ${data?.region ?? region}`,
      report: buildReport({
        region: data?.region ?? region,
        scannedAt: data?.scannedAt,
        executiveSummary: [
          `Instance ${group.instanceId}: ${group.totalFindings} finding(s) (${group.criticalCount} Critical, ${group.highCount} High).`,
        ],
      }),
      columns: [
        { header: 'Severity', value: (row) => row.severity },
        { header: 'Title', value: (row) => row.title },
        { header: 'Status', value: (row) => row.status },
        { header: 'CVE / ID', value: (row) => row.vulnerabilityId ?? '—' },
        {
          header: 'Last observed',
          value: (row) =>
            row.lastObservedAt ? formatDate(row.lastObservedAt) : '—',
        },
        { header: 'Recommendation', value: (row) => row.recommendation ?? '—' },
      ],
      rows: group.findings,
    })
  }, [buildReport, data, group, region])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={instanceId}
        description="Amazon Inspector findings for this EC2 instance."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link href={listHref} className={filterControlClass}>
              <ChevronIcon width={14} height={14} direction="left" />
              Back
            </Link>
            <SeverityFilterSelect />
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

      {data && !isLoading && !group && (
        <p className="text-sm text-gray_700 dark:text-gray_400">
          No findings for this instance in the current filter.{' '}
          <Link href={listHref} className="text-brand_600 dark:text-brand_300">
            Return to the instance list
          </Link>
          .
        </p>
      )}

      {group && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total findings"
              value={group.totalFindings}
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Critical"
              value={group.criticalCount}
              variant={group.criticalCount > 0 ? 'warning' : 'default'}
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              label="High"
              value={group.highCount}
              variant={group.highCount > 0 ? 'warning' : 'default'}
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={2}
            />
          </div>

          <TableSection
            title="Findings"
            onExportPdf={handleExportPdf}
            exportDisabled={group.findings.length === 0}
            columns={inspectorFindingColumns}
            data={group.findings}
            emptyMessage="No findings for this instance."
            getRowKey={(row) => row.findingArn}
          />
        </>
      )}
    </div>
  )
}
