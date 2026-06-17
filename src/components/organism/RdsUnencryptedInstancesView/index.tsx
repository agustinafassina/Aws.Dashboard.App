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
import { useRdsUnencryptedInstances } from '@/hooks/useRdsUnencryptedInstances'
import type { RdsUnencryptedInstance } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<RdsUnencryptedInstance>[] = [
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
    key: 'storageType',
    label: 'Storage',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'allocatedStorageGiB',
    label: 'Size (GiB)',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value == null ? '—' : String(value)),
  },
  {
    key: 'kmsKeyId',
    label: 'KMS key',
    cellClassName: 'max-w-[12rem] truncate whitespace-nowrap font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface RdsUnencryptedInstancesViewProps {
  title: string
  description: string
}

export default function RdsUnencryptedInstancesView({
  title,
  description,
}: RdsUnencryptedInstancesViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useRdsUnencryptedInstances(region)

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
      filename: `rds-unencrypted-instances-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.unencryptedInstancesCount} of ${data.totalInstances} RDS instances are not encrypted.`,
        ],
      }),
      columns: [
        { header: 'Instance', value: (row) => row.dbInstanceIdentifier },
        {
          header: 'Engine',
          value: (row) => (row.engineVersion ? `${row.engine} ${row.engineVersion}` : row.engine),
        },
        { header: 'Status', value: (row) => row.status ?? '—' },
        { header: 'Storage', value: (row) => row.storageType ?? '—' },
        { header: 'Size (GiB)', value: (row) => (row.allocatedStorageGiB == null ? '—' : String(row.allocatedStorageGiB)) },
        { header: 'KMS key', value: (row) => row.kmsKeyId ?? '—' },
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
              label="Unencrypted instances"
              value={data.unencryptedInstancesCount}
              variant={data.unencryptedInstancesCount > 0 ? 'warning' : 'success'}
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
            emptyMessage="No unencrypted RDS instances found in this region."
            getRowKey={(row) => row.dbInstanceIdentifier}
          />
        </>
      )}
    </div>
  )
}
