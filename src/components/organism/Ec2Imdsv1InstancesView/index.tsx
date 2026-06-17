'use client'

import { useCallback, useMemo } from 'react'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import InstanceStateBadge from '@/components/atoms/InstanceStateBadge'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useAwsRegion } from '@/context/RegionContext'
import { useEc2Imdsv1Instances } from '@/hooks/useEc2Imdsv1Instances'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { Ec2Imdsv1Instance } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<Ec2Imdsv1Instance>[] = [
  {
    key: 'instanceId',
    label: 'Instance',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'name',
    label: 'Name',
    cellClassName: 'min-w-[16rem] max-w-[22rem] truncate whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'state',
    label: 'State',
    cellClassName: 'whitespace-nowrap',
    render: (value) => <InstanceStateBadge state={String(value ?? '')} />,
  },
  {
    key: 'instanceType',
    label: 'Type',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface Ec2Imdsv1InstancesViewProps {
  title: string
  description: string
}

export default function Ec2Imdsv1InstancesView({
  title,
  description,
}: Ec2Imdsv1InstancesViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useEc2Imdsv1Instances(region)

  const instances = useMemo(
    () => [...(data?.instances ?? [])].sort((a, b) => a.instanceId.localeCompare(b.instanceId)),
    [data?.instances],
  )

  const handleExportPdf = useCallback(() => {
    if (!data || instances.length === 0) return
    exportTableToPdf({
      filename: `ec2-imdsv1-instances-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.imdsv1InstancesCount} of ${data.totalInstances} instances allow IMDSv1.`,
        ],
      }),
      columns: [
        { header: 'Instance', value: (row) => row.instanceId },
        { header: 'Name', value: (row) => row.name ?? '—' },
        { header: 'State', value: (row) => row.state ?? '—' },
        { header: 'Type', value: (row) => row.instanceType ?? '—' },
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
              icon={<ServerIcon className="h-5 w-5" />}
            />
            <StatCard
              label="IMDSv1 enabled"
              value={data.imdsv1InstancesCount}
              variant={data.imdsv1InstancesCount > 0 ? 'warning' : 'success'}
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
            emptyMessage="No IMDSv1 instances found in this region."
            getRowKey={(row) => row.instanceId}
          />
        </>
      )}
    </div>
  )
}
