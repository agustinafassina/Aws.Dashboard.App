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
import { useS3EncryptionStatus } from '@/hooks/useS3EncryptionStatus'
import type { S3BucketEncryption } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { formatDate } from '@/utils/formatters'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<S3BucketEncryption>[] = [
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

interface S3EncryptionStatusViewProps {
  title: string
  description: string
}

export default function S3EncryptionStatusView({
  title,
  description,
}: S3EncryptionStatusViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useS3EncryptionStatus(region)

  const sortedBuckets = useMemo(() => {
    const buckets = data?.unencryptedBuckets ?? []
    return [...buckets].sort((a, b) => a.name.localeCompare(b.name))
  }, [data?.unencryptedBuckets])

  const handleExportPdf = useCallback(() => {
    if (!data?.unencryptedBuckets.length) return

    exportTableToPdf({
      filename: `s3-unencrypted-buckets-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.unencryptedBucketsCount} of ${data.totalBucketsInRegion} S3 bucket(s) in this region do not have encryption configured.`,
        ],
      }),
      columns: [
        { header: 'Bucket', value: (row) => row.name },
        { header: 'Region', value: (row) => row.region },
        { header: 'Created', value: (row) => formatDate(row.creationDate) },
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
              iconTone={0}
            />
            <StatCard
              label="Unencrypted buckets"
              value={data.unencryptedBucketsCount}
              variant={data.unencryptedBucketsCount > 0 ? 'warning' : 'success'}
              hint="Buckets without server-side encryption configured"
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Buckets"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedBuckets.length === 0}
            columns={columns}
            data={sortedBuckets}
            emptyMessage="No unencrypted S3 buckets found in this region."
            getRowKey={(row) => row.name}
          />
        </>
      )}
    </div>
  )
}
