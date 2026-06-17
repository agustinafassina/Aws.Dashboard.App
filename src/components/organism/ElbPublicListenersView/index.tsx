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
import { useElbPublicListeners } from '@/hooks/useElbPublicListeners'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { ElbPublicListener } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<ElbPublicListener>[] = [
  {
    key: 'loadBalancerName',
    label: 'Load balancer',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'loadBalancerType',
    label: 'Type',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'scheme',
    label: 'Scheme',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'listeners',
    label: 'Listeners',
    cellClassName: 'min-w-[10rem] whitespace-normal text-xs leading-snug',
    render: (value) =>
      ((value as { port: number; protocol: string }[]) ?? [])
        .map((listener) => `${listener.protocol}:${listener.port}`)
        .join(', ') || '—',
  },
  {
    key: 'riskReasons',
    label: 'Risk reasons',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
    render: (value) => ((value as string[]) ?? []).join('; ') || '—',
  },
]

interface ElbPublicListenersViewProps {
  title: string
  description: string
}

export default function ElbPublicListenersView({
  title,
  description,
}: ElbPublicListenersViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useElbPublicListeners(region)

  const balancers = useMemo(
    () =>
      [...(data?.loadBalancers ?? [])].sort((a, b) =>
        a.loadBalancerName.localeCompare(b.loadBalancerName),
      ),
    [data?.loadBalancers],
  )

  const handleExportPdf = useCallback(() => {
    if (!data || balancers.length === 0) return
    exportTableToPdf({
      filename: `elb-public-listeners-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.publicLoadBalancersCount} of ${data.totalLoadBalancersScanned} load balancers are internet-facing with public listeners.`,
        ],
      }),
      columns: [
        { header: 'Load balancer', value: (row) => row.loadBalancerName },
        { header: 'Type', value: (row) => row.loadBalancerType },
        { header: 'Scheme', value: (row) => row.scheme },
        {
          header: 'Listeners',
          value: (row) => row.listeners.map((x) => `${x.protocol}:${x.port}`).join(', '),
        },
        { header: 'Risk reasons', value: (row) => row.riskReasons.join('; ') },
      ],
      rows: balancers,
    })
  }, [balancers, buildReport, data, title])

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
              label="Load balancers scanned"
              value={data.totalLoadBalancersScanned}
              icon={<ServerIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Public listeners"
              value={data.publicLoadBalancersCount}
              variant={data.publicLoadBalancersCount > 0 ? 'warning' : 'success'}
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>
          <TableSection
            title="Load balancers"
            onExportPdf={handleExportPdf}
            exportDisabled={balancers.length === 0}
            columns={columns}
            data={balancers}
            emptyMessage="No public ELB listeners found in this region."
            getRowKey={(row) => row.loadBalancerArn}
          />
        </>
      )}
    </div>
  )
}
