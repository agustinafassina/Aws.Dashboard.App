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
import { useEc2UnattachedVolumes } from '@/hooks/useEc2UnattachedVolumes'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { Ec2UnattachedVolume } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { formatDate } from '@/utils/formatters'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<Ec2UnattachedVolume>[] = [
  {
    key: 'volumeId',
    label: 'Volume',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'name',
    label: 'Name',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'sizeGiB',
    label: 'Size (GiB)',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'volumeType',
    label: 'Type',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'availabilityZone',
    label: 'AZ',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'encrypted',
    label: 'Encrypted',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'createdAt',
    label: 'Created',
    cellClassName: 'whitespace-nowrap text-xs',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface Ec2UnattachedVolumesViewProps {
  title: string
  description: string
}

export default function Ec2UnattachedVolumesView({
  title,
  description,
}: Ec2UnattachedVolumesViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useEc2UnattachedVolumes(region)

  const sortedVolumes = useMemo(() => {
    const volumes = data?.volumes ?? []
    return [...volumes].sort((a, b) => b.sizeGiB - a.sizeGiB)
  }, [data?.volumes])

  const handleExportPdf = useCallback(() => {
    if (!data?.volumes.length) return

    exportTableToPdf({
      filename: `ec2-unattached-volumes-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.unattachedVolumesCount} of ${data.totalVolumes} EBS volume(s) are unattached (${data.totalUnattachedSizeGiB} GiB total).`,
        ],
      }),
      columns: [
        { header: 'Volume', value: (row) => row.volumeId },
        { header: 'Name', value: (row) => row.name ?? '—' },
        { header: 'Size (GiB)', value: (row) => String(row.sizeGiB) },
        { header: 'Type', value: (row) => row.volumeType ?? '—' },
        { header: 'AZ', value: (row) => row.availabilityZone ?? '—' },
        { header: 'Encrypted', value: (row) => (row.encrypted ? 'Yes' : 'No') },
        {
          header: 'Created',
          value: (row) => (row.createdAt ? formatDate(row.createdAt) : '—'),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedVolumes,
    })
  }, [buildReport, data, sortedVolumes, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={title}
        description={description}
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
              label="Total volumes"
              value={data.totalVolumes}
              icon={<DatabaseIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Unattached volumes"
              value={data.unattachedVolumesCount}
              variant={data.unattachedVolumesCount > 0 ? 'warning' : 'success'}
              hint={`${data.totalUnattachedSizeGiB} GiB currently unattached`}
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Volumes"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedVolumes.length === 0}
            columns={columns}
            data={sortedVolumes}
            emptyMessage="No unattached EBS volumes found in this region."
            getRowKey={(row) => row.volumeId}
          />
        </>
      )}
    </div>
  )
}
