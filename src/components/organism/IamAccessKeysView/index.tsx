'use client'

import { useCallback, useMemo } from 'react'
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
import {
  accessKeyColumns,
  getIamApiErrorMessage,
} from '@/components/organism/Iam/iamShared'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { usePdfReport } from '@/hooks/usePdfReport'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function IamAccessKeysView() {
  const { buildReport } = usePdfReport()
  const keysQuery = useIamAccessKeys()

  const sortedKeys = useMemo(
    () =>
      [...(keysQuery.data?.accessKeys ?? [])].sort((a, b) => {
        if (a.needsRotation !== b.needsRotation) return a.needsRotation ? -1 : 1
        if (a.isNeverUsed !== b.isNeverUsed) return a.isNeverUsed ? -1 : 1
        return b.ageInDays - a.ageInDays
      }),
    [keysQuery.data?.accessKeys],
  )

  const neverUsedKeys = useMemo(
    () => sortedKeys.filter((key) => key.isNeverUsed),
    [sortedKeys],
  )

  const handleExportKeysPdf = useCallback(() => {
    if (!keysQuery.data?.accessKeys.length) return

    exportTableToPdf({
      filename: 'iam-access-keys',
      title: 'IAM access keys',
      subtitle: `Users: ${keysQuery.data.totalUsers} · Keys: ${keysQuery.data.totalAccessKeys}`,
      report: buildReport({
        scope: 'account',
        scannedAt: keysQuery.data.scannedAt,
        executiveSummary: [
          `${keysQuery.data.totalAccessKeys} access key(s) across ${keysQuery.data.totalUsers} user(s).`,
          `${keysQuery.data.accessKeysNeedingRotation} key(s) need rotation; ${keysQuery.data.accessKeysNeverUsed} never used.`,
        ],
      }),
      columns: [
        { header: 'User', value: (row) => row.userName },
        { header: 'Access key', value: (row) => maskAccessKeyId(row.accessKeyId) },
        { header: 'Status', value: (row) => row.status },
        { header: 'Never used', value: (row) => (row.isNeverUsed ? 'Yes' : 'No') },
        {
          header: 'Rotation',
          value: (row) => (row.needsRotation ? 'Needs rotation' : 'OK'),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: sortedKeys,
    })
  }, [buildReport, keysQuery.data, sortedKeys])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="IAM access keys"
        description="Access keys across IAM users, including age, last usage, and rotation recommendations."
      />

      {keysQuery.isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}

      {keysQuery.isError && (
        <ErrorState
          message={getIamApiErrorMessage(keysQuery.error)}
          onRetry={() => keysQuery.refetch()}
        />
      )}

      {keysQuery.data && !keysQuery.isLoading && !keysQuery.isError && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="IAM users"
              value={keysQuery.data.totalUsers}
              icon={<UsersIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Access keys"
              value={keysQuery.data.totalAccessKeys}
              icon={<AccessKeyIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              label="Need rotation"
              value={keysQuery.data.accessKeysNeedingRotation}
              variant={
                keysQuery.data.accessKeysNeedingRotation > 0 ? 'warning' : 'success'
              }
              hint={`Max age: ${keysQuery.data.accessKeyRotationMaxAgeDays} days`}
              icon={<RotationAlertIcon className="h-5 w-5" />}
              iconTone={2}
            />
            <StatCard
              label="Never used"
              value={keysQuery.data.accessKeysNeverUsed}
              variant={
                keysQuery.data.accessKeysNeverUsed > 0 ? 'warning' : 'success'
              }
              hint="Active keys with no recorded usage"
              icon={<AccessKeyIcon className="h-5 w-5" />}
              iconTone={3}
            />
            <StatCard
              label="Rotation policy"
              value={`${keysQuery.data.accessKeyRotationMaxAgeDays} days`}
              hint="Configured on the API"
              icon={<PolicyClockIcon className="h-5 w-5" />}
              iconTone={4}
            />
          </div>

          <TableSection
            title="Never used access keys"
            onExportPdf={handleExportKeysPdf}
            exportDisabled={neverUsedKeys.length === 0}
            columns={accessKeyColumns}
            data={neverUsedKeys}
            emptyMessage="No active access keys without recorded usage."
            getRowKey={(row) => row.accessKeyId}
          />

          <TableSection
            title="All access keys"
            onExportPdf={handleExportKeysPdf}
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
