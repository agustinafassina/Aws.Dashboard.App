'use client'

import { useCallback } from 'react'
import AccessKeyIcon from '@/components/atoms/Icons/AccessKeyIcon'
import PolicyClockIcon from '@/components/atoms/Icons/PolicyClockIcon'
import RotationAlertIcon from '@/components/atoms/Icons/RotationAlertIcon'
import UsersIcon from '@/components/atoms/Icons/UsersIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { maskAccessKeyId } from '@/api/aws/iam'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import type { Column } from '@/interfaces/common'
import type { IamAccessKey } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

const accessKeyColumns: Column<IamAccessKey>[] = [
  {
    key: 'userName',
    label: 'User',
    cellClassName: 'max-w-[9rem] truncate whitespace-nowrap',
  },
  {
    key: 'accessKeyId',
    label: 'Access key',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => maskAccessKeyId(String(value ?? '')),
  },
  {
    key: 'status',
    label: 'Status',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'ageInDays',
    label: 'Age (days)',
    cellClassName: 'whitespace-nowrap',
    render: (value) => String(value),
  },
  {
    key: 'lastUsedDate',
    label: 'Last used',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? formatDate(String(value)) : 'Never'),
  },
  {
    key: 'needsRotation',
    label: 'Rotation',
    width: '8.75rem',
    cellClassName: 'whitespace-nowrap',
    render: (value) =>
      value ? (
        <span
          title="Needs rotation"
          className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-red_50 px-2.5 py-0.5 text-xs font-semibold text-red_900 dark:text-red_200"
        >
          Needs rotation
        </span>
      ) : (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-success_100 px-2.5 py-0.5 text-xs font-semibold text-success_700 dark:text-success_500">
          OK
        </span>
      ),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
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
        { header: 'Access key', value: (row) => maskAccessKeyId(row.accessKeyId) },
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
            <StatCard
              label="IAM users"
              value={data.totalUsers}
              icon={<UsersIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Access keys"
              value={data.totalAccessKeys}
              icon={<AccessKeyIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Need rotation"
              value={data.accessKeysNeedingRotation}
              variant={
                data.accessKeysNeedingRotation > 0 ? 'warning' : 'success'
              }
              hint={`Max age: ${data.accessKeyRotationMaxAgeDays} days`}
              icon={<RotationAlertIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Rotation policy"
              value={`${data.accessKeyRotationMaxAgeDays} days`}
              hint="Configured on the API"
              icon={<PolicyClockIcon className="h-5 w-5" />}
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
