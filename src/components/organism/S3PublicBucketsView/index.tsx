'use client'

import { useCallback, useMemo } from 'react'
import BucketIcon from '@/components/atoms/Icons/BucketIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useAwsRegion } from '@/context/RegionContext'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import type { Column } from '@/interfaces/common'
import type { S3PublicBucket } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

const columns: Column<S3PublicBucket>[] = [
  {
    key: 'name',
    label: 'Bucket',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'region',
    label: 'Region',
    cellClassName: 'whitespace-nowrap text-xs',
  },
  {
    key: 'publicAccessReasons',
    label: 'Public access reasons',
    cellClassName: 'min-w-[10rem] whitespace-normal text-xs leading-snug',
    render: (value) => {
      const reasons = (value as string[]) ?? []
      if (!reasons.length) return '—'
      return reasons.join('; ')
    },
  },
  {
    key: 'creationDate',
    label: 'Created',
    cellClassName: 'whitespace-nowrap text-xs',
    render: (value) => formatDate(String(value ?? '')),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface S3PublicBucketsViewProps {
  title: string
  description: string
}

export default function S3PublicBucketsView({
  title,
  description,
}: S3PublicBucketsViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()

  const { data, isLoading, isError, error, refetch } = useS3PublicBuckets(region)

  const sortedBuckets = useMemo(() => {
    const buckets = data?.publicBuckets ?? []
    return [...buckets].sort((a, b) => a.name.localeCompare(b.name))
  }, [data?.publicBuckets])

  const handleExportPdf = useCallback(() => {
    if (!data?.publicBuckets.length) return

    exportTableToPdf({
      filename: `s3-public-buckets-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.publicBucketsCount} of ${data.totalBucketsInRegion} S3 bucket(s) in this region allow public access.`,
        ],
      }),
      columns: [
        { header: 'Bucket', value: (row) => row.name },
        { header: 'Region', value: (row) => row.region },
        {
          header: 'Public access reasons',
          value: (row) => row.publicAccessReasons.join('; '),
        },
        {
          header: 'Created',
          value: (row) => formatDate(row.creationDate),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedBuckets,
    })
  }, [buildReport, data, sortedBuckets, title])

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
              label="Total buckets"
              value={data.totalBucketsInRegion}
              icon={<BucketIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Public buckets"
              value={data.publicBucketsCount}
              variant={data.publicBucketsCount > 0 ? 'warning' : 'success'}
              hint="Buckets with public policy, ACL, or Block Public Access gaps"
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Buckets"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedBuckets.length === 0}
            columns={columns}
            data={sortedBuckets}
            emptyMessage="No public S3 buckets found in this region."
            getRowKey={(row) => row.name}
          />
        </>
      )}
    </div>
  )
}
