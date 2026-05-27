'use client'

import { useCallback } from 'react'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import type { Column } from '@/interfaces/common'
import type { IamAccessKey } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

const accessKeyColumns: Column<IamAccessKey>[] = [
  { key: 'userName', label: 'User' },
  {
    key: 'accessKeyId',
    label: 'Access key',
    className: 'font-mono text-xs',
  },
  { key: 'status', label: 'Status' },
  {
    key: 'ageInDays',
    label: 'Age (days)',
    render: (value) => String(value),
  },
  {
    key: 'lastUsedDate',
    label: 'Last used',
    render: (value) => (value ? formatDate(String(value)) : 'Never'),
  },
  {
    key: 'needsRotation',
    label: 'Rotation',
    render: (value) =>
      value ? (
        <span className="inline-flex rounded-full bg-red_50 px-2 py-0.5 text-xs font-semibold text-red_900 dark:text-red_200">
          Needs rotation
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-success_100 px-2 py-0.5 text-xs font-semibold text-success_700 dark:text-success_500">
          OK
        </span>
      ),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    className: 'max-w-xs text-xs',
  },
]

export default function IamAccessKeysView() {
  const { data, isLoading, isError, error, refetch } = useIamAccessKeys()

  const sortedKeys = [...(data?.accessKeys ?? [])].sort((a, b) => {
    if (a.needsRotation !== b.needsRotation) return a.needsRotation ? -1 : 1
    return b.ageInDays - a.ageInDays
  })

  const handleExportPdf = useCallback(() => {
    if (!data?.accessKeys.length) return

    exportTableToPdf({
      filename: 'iam-access-keys',
      title: 'IAM access keys',
      subtitle: `Users: ${data.totalUsers} · Keys: ${data.totalAccessKeys}`,
      columns: [
        { header: 'User', value: (row) => row.userName },
        { header: 'Access key', value: (row) => row.accessKeyId },
        { header: 'Status', value: (row) => row.status },
        { header: 'Age (days)', value: (row) => String(row.ageInDays) },
        {
          header: 'Last used',
          value: (row) =>
            row.lastUsedDate ? formatDate(row.lastUsedDate) : 'Never',
        },
        {
          header: 'Rotation',
          value: (row) => (row.needsRotation ? 'Needs rotation' : 'OK'),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedKeys,
    })
  }, [data, sortedKeys])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="IAM access keys"
        description="Access keys across IAM users, including age, last usage, and rotation recommendations."
        scannedAt={data ? formatDateTime(data.scannedAt) : undefined}
      />

      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 rounded-xl bg-gray_200 dark:bg-gray_700 animate-pulse" />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="IAM users" value={data.totalUsers} />
            <StatCard label="Access keys" value={data.totalAccessKeys} />
            <StatCard
              label="Need rotation"
              value={data.accessKeysNeedingRotation}
              variant={
                data.accessKeysNeedingRotation > 0 ? 'warning' : 'success'
              }
              hint={`Max age: ${data.accessKeyRotationMaxAgeDays} days`}
            />
            <StatCard
              label="Rotation policy"
              value={`${data.accessKeyRotationMaxAgeDays} days`}
              hint="Configured on the API"
            />
          </div>

          <TableSection
            title="All access keys"
            onExportPdf={handleExportPdf}
            exportDisabled={sortedKeys.length === 0}
            columns={accessKeyColumns}
            data={sortedKeys}
            emptyMessage="No IAM access keys found."
            getRowKey={(row) => row.accessKeyId}
          />
        </>
      )}
    </div>
  )
}
