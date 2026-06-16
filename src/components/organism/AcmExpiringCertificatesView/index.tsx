'use client'

import { useCallback, useMemo } from 'react'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import SecurityIcon from '@/components/atoms/Icons/SecurityIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useAwsRegion } from '@/context/RegionContext'
import { useAcmExpiringCertificates } from '@/hooks/useAcmExpiringCertificates'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { AcmExpiringCertificate } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { formatDate } from '@/utils/formatters'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<AcmExpiringCertificate>[] = [
  {
    key: 'domainName',
    label: 'Domain',
    cellClassName: 'max-w-[16rem] truncate whitespace-nowrap',
  },
  {
    key: 'status',
    label: 'Status',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'inUse',
    label: 'In use',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'daysUntilExpiry',
    label: 'Days left',
    cellClassName: 'whitespace-nowrap',
    render: (value, row) => (row.isExpired ? 'Expired' : String(value)),
  },
  {
    key: 'notAfter',
    label: 'Expires at',
    cellClassName: 'whitespace-nowrap text-xs',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface AcmExpiringCertificatesViewProps {
  title: string
  description: string
}

export default function AcmExpiringCertificatesView({
  title,
  description,
}: AcmExpiringCertificatesViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useAcmExpiringCertificates(region)

  const sortedCertificates = useMemo(() => {
    const certificates = data?.certificates ?? []
    return [...certificates].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }, [data?.certificates])

  const handleExportPdf = useCallback(() => {
    if (!data?.certificates.length) return

    exportTableToPdf({
      filename: `acm-expiring-certificates-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.expiringCertificatesCount} certificate(s) are expiring in ${data.expirationWindowDays} days, including ${data.expiredCertificatesCount} already expired.`,
        ],
      }),
      columns: [
        { header: 'Domain', value: (row) => row.domainName },
        { header: 'Status', value: (row) => row.status ?? '—' },
        { header: 'In use', value: (row) => (row.inUse ? 'Yes' : 'No') },
        {
          header: 'Days left',
          value: (row) => (row.isExpired ? 'Expired' : String(row.daysUntilExpiry)),
        },
        {
          header: 'Expires at',
          value: (row) => (row.notAfter ? formatDate(row.notAfter) : '—'),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedCertificates,
    })
  }, [buildReport, data, sortedCertificates, title])

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
              label="Certificates scanned"
              value={data.totalCertificatesScanned}
              icon={<SecurityIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label={`Expiring (${data.expirationWindowDays}d)`}
              value={data.expiringCertificatesCount}
              variant={data.expiringCertificatesCount > 0 ? 'warning' : 'success'}
              hint={`${data.expiredCertificatesCount} already expired`}
              icon={<ShieldIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard label="Region" value={data.region} />
          </div>

          <TableSection
            title="Certificates"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedCertificates.length === 0}
            columns={columns}
            data={sortedCertificates}
            emptyMessage="No expiring ACM certificates found in this region."
            getRowKey={(row) => row.certificateArn}
          />
        </>
      )}
    </div>
  )
}
