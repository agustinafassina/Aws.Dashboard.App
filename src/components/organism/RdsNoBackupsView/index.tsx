'use client'

import { useCallback, useMemo } from 'react'
import DatabaseIcon from '@/components/atoms/Icons/DatabaseIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useAwsRegion } from '@/context/RegionContext'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useRdsNoBackups } from '@/hooks/useRdsNoBackups'
import type { RdsNoBackupInstance } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { formatDate } from '@/utils/formatters'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<RdsNoBackupInstance>[] = [
  {
    key: 'dbInstanceIdentifier',
    label: 'Instance',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'engine',
    label: 'Engine',
    cellClassName: 'whitespace-nowrap',
    render: (value, row) => (row.engineVersion ? `${value} ${row.engineVersion}` : String(value)),
  },
  {
    key: 'status',
    label: 'Status',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'backupRetentionPeriodDays',
    label: 'Retention (days)',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'latestRestorableTime',
    label: 'Latest restorable',
    cellClassName: 'whitespace-nowrap text-xs',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'riskReason',
    label: 'Risk',
    cellClassName: 'min-w-[10rem] whitespace-normal text-xs font-medium text-red_900 dark:text-red_200',
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface RdsNoBackupsViewProps {
  title: string
  description: string
}

export default function RdsNoBackupsView({
  title,
  description,
}: RdsNoBackupsViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useRdsNoBackups(region)

  const instances = useMemo(
    () =>
      [...(data?.instances ?? [])].sort((a, b) =>
        a.dbInstanceIdentifier.localeCompare(b.dbInstanceIdentifier),
      ),
    [data?.instances],
  )

  const handleExportPdf = useCallback(() => {
    if (!data || instances.length === 0) return
    exportTableToPdf({
      filename: `rds-no-backups-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.instancesWithoutAdequateBackupsCount} of ${data.totalInstances} RDS instances have retention below ${data.minBackupRetentionDays} day(s).`,
        ],
      }),
      columns: [
        { header: 'Instance', value: (row) => row.dbInstanceIdentifier },
        {
          header: 'Engine',
          value: (row) => (row.engineVersion ? `${row.engine} ${row.engineVersion}` : row.engine),
        },
        { header: 'Status', value: (row) => row.status ?? '—' },
        { header: 'Retention (days)', value: (row) => String(row.backupRetentionPeriodDays) },
        {
          header: 'Latest restorable',
          value: (row) => (row.latestRestorableTime ? formatDate(row.latestRestorableTime) : '—'),
        },
        { header: 'Risk', value: (row) => row.riskReason },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: instances,
    })
  }, [buildReport, data, instances, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader title={title} description={description} />
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
            (error as { response?: { data?: { message?: string; error?: string } } })?.response
              ?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}
      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Instances scanned"
              value={data.totalInstances}
              icon={<DatabaseIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Insufficient backups"
              value={data.instancesWithoutAdequateBackupsCount}
              variant={data.instancesWithoutAdequateBackupsCount > 0 ? 'warning' : 'success'}
              hint={`Minimum retention target: ${data.minBackupRetentionDays} day(s)`}
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>
          <TableSection
            title="Instances"
            onExportPdf={handleExportPdf}
            exportDisabled={instances.length === 0}
            columns={columns}
            data={instances}
            emptyMessage="No RDS backup retention gaps found in this region."
            getRowKey={(row) => row.dbInstanceIdentifier}
          />
        </>
      )}
    </div>
  )
}
