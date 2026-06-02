'use client'

import { useCallback, useMemo } from 'react'
import DatabaseIcon from '@/components/atoms/Icons/DatabaseIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useAwsRegion } from '@/context/RegionContext'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import type { Column } from '@/interfaces/common'
import type {
  Ec2InstancePorts,
  InboundRule,
  OpenPortsResourceType,
  RdsInstancePorts,
} from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'
import ExposureBadge, { exposureLabel } from '@/components/atoms/ExposureBadge'
import InstanceStateBadge from '@/components/atoms/InstanceStateBadge'

function formatExposedPorts(rules: InboundRule[]): string {
  if (!rules.length) return '—'
  return rules.map((rule) => rule.portRange).join(', ')
}

const ec2Columns: Column<Ec2InstancePorts>[] = [
  {
    key: 'instanceId',
    label: 'Instance',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'name',
    label: 'Name',
    cellClassName: 'max-w-[9rem] truncate whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'state',
    label: 'State',
    cellClassName: 'whitespace-nowrap',
    render: (value) => <InstanceStateBadge state={String(value ?? '')} />,
  },
  {
    key: 'publicIpAddress',
    label: 'Public IP',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'hasPubliclyExposedPorts',
    label: 'Exposure',
    headerClassName: 'text-center',
    cellClassName: 'whitespace-nowrap text-center',
    render: (value) => (
      <div className="flex justify-center">
        <ExposureBadge exposed={Boolean(value)} />
      </div>
    ),
  },
  {
    key: 'publiclyExposedInboundRules',
    label: 'Open ports',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => formatExposedPorts((value as InboundRule[]) ?? []),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

const rdsColumns: Column<RdsInstancePorts>[] = [
  {
    key: 'dbInstanceIdentifier',
    label: 'Instance',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'engine',
    label: 'Engine',
    cellClassName: 'whitespace-nowrap',
    render: (value, row) =>
      row.engineVersion ? `${value} ${row.engineVersion}` : String(value),
  },
  {
    key: 'status',
    label: 'Status',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'publiclyAccessible',
    label: 'Public access',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'hasPubliclyExposedPorts',
    label: 'Exposure',
    headerClassName: 'text-center',
    cellClassName: 'whitespace-nowrap text-center',
    render: (value) => (
      <div className="flex justify-center">
        <ExposureBadge exposed={Boolean(value)} />
      </div>
    ),
  },
  {
    key: 'publiclyExposedInboundRules',
    label: 'Open ports',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => formatExposedPorts((value as InboundRule[]) ?? []),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface OpenPortsViewProps {
  resourceType: OpenPortsResourceType
  title: string
  description: string
}

export default function OpenPortsView({
  resourceType,
  title,
  description,
}: OpenPortsViewProps) {
  const { region } = useAwsRegion()

  const ec2Query = useEc2OpenPorts(region)
  const rdsQuery = useRdsOpenPorts(region)
  const query = resourceType === 'ec2' ? ec2Query : rdsQuery
  const { data, isLoading, isError, error, refetch } = query

  const sortedInstances = useMemo(() => {
    const instances = data?.instances ?? []
    return [...instances].sort((a, b) => {
      if (a.hasPubliclyExposedPorts !== b.hasPubliclyExposedPorts) {
        return a.hasPubliclyExposedPorts ? -1 : 1
      }
      return 0
    })
  }, [data?.instances])

  const handleExportPdf = useCallback(() => {
    if (!data?.instances.length) return

    if (resourceType === 'ec2') {
      exportTableToPdf({
        filename: `ec2-open-ports-${data.region}`,
        title,
        subtitle: `Region: ${data.region}`,
        columns: [
          { header: 'Instance', value: (row) => row.instanceId },
          { header: 'Name', value: (row) => row.name ?? '—' },
          { header: 'State', value: (row) => row.state },
          { header: 'Public IP', value: (row) => row.publicIpAddress ?? '—' },
          {
            header: 'Exposure',
            value: (row) => exposureLabel(row.hasPubliclyExposedPorts),
          },
          {
            header: 'Open ports',
            value: (row) => formatExposedPorts(row.publiclyExposedInboundRules),
          },
          { header: 'Recommendation', value: (row) => row.recommendation },
        ],
        rows: sortedInstances as Ec2InstancePorts[],
      })
      return
    }

    exportTableToPdf({
      filename: `rds-open-ports-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      columns: [
        { header: 'Instance', value: (row) => row.dbInstanceIdentifier },
        {
          header: 'Engine',
          value: (row) =>
            row.engineVersion ? `${row.engine} ${row.engineVersion}` : row.engine,
        },
        { header: 'Status', value: (row) => row.status },
        {
          header: 'Public access',
          value: (row) => (row.publiclyAccessible ? 'Yes' : 'No'),
        },
        {
          header: 'Exposure',
          value: (row) => exposureLabel(row.hasPubliclyExposedPorts),
        },
        {
          header: 'Open ports',
          value: (row) => formatExposedPorts(row.publiclyExposedInboundRules),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedInstances as RdsInstancePorts[],
    })
  }, [data, resourceType, sortedInstances, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={title}
        description={description}
        scannedAt={data ? formatDateTime(data.scannedAt) : undefined}
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
              label="Total instances"
              value={data.totalInstances}
              icon={
                resourceType === 'ec2' ? (
                  <ServerIcon className="h-5 w-5" />
                ) : (
                  <DatabaseIcon className="h-5 w-5" />
                )
              }
            />
            <StatCard
              label="Public exposure"
              value={data.instancesWithPublicPorts}
              variant={data.instancesWithPublicPorts > 0 ? 'warning' : 'success'}
              hint="Instances with ports open to the internet"
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          {resourceType === 'ec2' ? (
            <TableSection
              title="Instances"
              onExportPdf={handleExportPdf}
              exportDisabled={sortedInstances.length === 0}
              columns={ec2Columns}
              data={sortedInstances as Ec2InstancePorts[]}
              emptyMessage="No EC2 instances found in this region."
              getRowKey={(row) => row.instanceId}
            />
          ) : (
            <TableSection
              title="Instances"
              onExportPdf={handleExportPdf}
              exportDisabled={sortedInstances.length === 0}
              columns={rdsColumns}
              data={sortedInstances as RdsInstancePorts[]}
              emptyMessage="No RDS instances found in this region."
              getRowKey={(row) => row.dbInstanceIdentifier}
            />
          )}
        </>
      )}
    </div>
  )
}
