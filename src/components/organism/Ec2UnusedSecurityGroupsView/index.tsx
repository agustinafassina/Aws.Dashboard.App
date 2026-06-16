'use client'

import { useCallback, useMemo } from 'react'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useAwsRegion } from '@/context/RegionContext'
import { useEc2UnusedSecurityGroups } from '@/hooks/useEc2UnusedSecurityGroups'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { Ec2UnusedSecurityGroup } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<Ec2UnusedSecurityGroup>[] = [
  {
    key: 'groupId',
    label: 'Security group',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'groupName',
    label: 'Name',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap',
  },
  {
    key: 'vpcId',
    label: 'VPC',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'isDefaultSecurityGroup',
    label: 'Default',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'inboundRuleCount',
    label: 'Inbound rules',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'outboundRuleCount',
    label: 'Outbound rules',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface Ec2UnusedSecurityGroupsViewProps {
  title: string
  description: string
}

export default function Ec2UnusedSecurityGroupsView({
  title,
  description,
}: Ec2UnusedSecurityGroupsViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useEc2UnusedSecurityGroups(region)

  const sortedGroups = useMemo(() => {
    const groups = data?.securityGroups ?? []
    return [...groups].sort((a, b) => a.groupId.localeCompare(b.groupId))
  }, [data?.securityGroups])

  const handleExportPdf = useCallback(() => {
    if (!data?.securityGroups.length) return

    exportTableToPdf({
      filename: `ec2-unused-security-groups-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.unusedSecurityGroupsCount} of ${data.totalSecurityGroups} security group(s) are currently unused.`,
        ],
      }),
      columns: [
        { header: 'Security group', value: (row) => row.groupId },
        { header: 'Name', value: (row) => row.groupName },
        { header: 'VPC', value: (row) => row.vpcId ?? '—' },
        { header: 'Default', value: (row) => (row.isDefaultSecurityGroup ? 'Yes' : 'No') },
        { header: 'Inbound rules', value: (row) => String(row.inboundRuleCount) },
        { header: 'Outbound rules', value: (row) => String(row.outboundRuleCount) },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedGroups,
    })
  }, [buildReport, data, sortedGroups, title])

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
              label="Total security groups"
              value={data.totalSecurityGroups}
              icon={<ServerIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Unused groups"
              value={data.unusedSecurityGroupsCount}
              variant={data.unusedSecurityGroupsCount > 0 ? 'warning' : 'success'}
              hint="Security groups not attached to any active ENI"
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Security groups"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedGroups.length === 0}
            columns={columns}
            data={sortedGroups}
            emptyMessage="No unused security groups found in this region."
            getRowKey={(row) => row.groupId}
          />
        </>
      )}
    </div>
  )
}
