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
import { useLambdaPublicFunctions } from '@/hooks/useLambdaPublicFunctions'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { LambdaPublicFunction } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<LambdaPublicFunction>[] = [
  {
    key: 'functionName',
    label: 'Function',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'runtime',
    label: 'Runtime',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'state',
    label: 'State',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'publicAccessReasons',
    label: 'Public access reasons',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
    render: (value) => {
      const reasons = (value as string[]) ?? []
      return reasons.length ? reasons.join('; ') : '—'
    },
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface LambdaPublicFunctionsViewProps {
  title: string
  description: string
}

export default function LambdaPublicFunctionsView({
  title,
  description,
}: LambdaPublicFunctionsViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useLambdaPublicFunctions(region)

  const sortedFunctions = useMemo(() => {
    const functions = data?.functions ?? []
    return [...functions].sort((a, b) => a.functionName.localeCompare(b.functionName))
  }, [data?.functions])

  const handleExportPdf = useCallback(() => {
    if (!data?.functions.length) return

    exportTableToPdf({
      filename: `lambda-public-functions-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.publicFunctionsCount} of ${data.totalFunctions} Lambda function(s) in this region are publicly reachable.`,
        ],
      }),
      columns: [
        { header: 'Function', value: (row) => row.functionName },
        { header: 'Runtime', value: (row) => row.runtime ?? '—' },
        { header: 'State', value: (row) => row.state ?? '—' },
        {
          header: 'Public access reasons',
          value: (row) => row.publicAccessReasons.join('; '),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedFunctions,
    })
  }, [buildReport, data, sortedFunctions, title])

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
              label="Total functions"
              value={data.totalFunctions}
              icon={<ServerIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Public functions"
              value={data.publicFunctionsCount}
              variant={data.publicFunctionsCount > 0 ? 'warning' : 'success'}
              hint="Functions exposed through Function URL or permissive policies"
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Functions"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedFunctions.length === 0}
            columns={columns}
            data={sortedFunctions}
            emptyMessage="No public Lambda functions found in this region."
            getRowKey={(row) => row.functionArn}
          />
        </>
      )}
    </div>
  )
}
