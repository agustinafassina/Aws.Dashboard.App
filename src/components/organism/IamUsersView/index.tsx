'use client'

import { useCallback } from 'react'
import SecurityIcon from '@/components/atoms/Icons/SecurityIcon'
import UserIcon from '@/components/atoms/Icons/UserIcon'
import UsersIcon from '@/components/atoms/Icons/UsersIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import {
  getIamApiErrorMessage,
  mfaUserColumns,
  riskyPolicyColumns,
} from '@/components/organism/Iam/iamShared'
import { useIamRiskyPolicies } from '@/hooks/useIamRiskyPolicies'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { usePdfReport } from '@/hooks/usePdfReport'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function IamUsersView() {
  const { buildReport } = usePdfReport()
  const mfaQuery = useIamUsersWithoutMfa()
  const policiesQuery = useIamRiskyPolicies()

  const isInitialLoading = mfaQuery.isLoading && policiesQuery.isLoading

  const handleExportMfaPdf = useCallback(() => {
    const users = mfaQuery.data?.users ?? []
    if (!users.length) return

    exportTableToPdf({
      filename: 'iam-users-without-mfa',
      title: 'IAM users without MFA',
      subtitle: `${mfaQuery.data?.usersWithoutMfa ?? 0} console users without MFA`,
      report: buildReport({
        scope: 'account',
        scannedAt: mfaQuery.data?.scannedAt,
        executiveSummary: [
          `${mfaQuery.data?.usersWithoutMfa ?? 0} of ${mfaQuery.data?.usersWithConsoleAccess ?? 0} console users lack MFA.`,
          `Total IAM users scanned: ${mfaQuery.data?.totalUsers ?? 0}.`,
        ],
      }),
      columns: [
        { header: 'User', value: (row) => row.userName },
        { header: 'Email', value: (row) => row.email ?? '—' },
        {
          header: 'Created',
          value: (row) =>
            row.userCreated ? formatDate(row.userCreated) : '—',
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: users,
    })
  }, [buildReport, mfaQuery.data])

  const handleExportPoliciesPdf = useCallback(() => {
    const policies = policiesQuery.data?.policies ?? []
    if (!policies.length) return

    exportTableToPdf({
      filename: 'iam-risky-policies',
      title: 'IAM risky policies (*:*)',
      subtitle: `${policiesQuery.data?.riskyPolicyCount ?? 0} customer managed policies`,
      report: buildReport({
        scope: 'account',
        scannedAt: policiesQuery.data?.scannedAt,
        executiveSummary: [
          `${policiesQuery.data?.riskyPolicyCount ?? 0} customer-managed polic${(policiesQuery.data?.riskyPolicyCount ?? 0) === 1 ? 'y' : 'ies'} grant broad (*:*) permissions.`,
          `Review and restrict permissions to least privilege.`,
        ],
      }),
      columns: [
        { header: 'Policy', value: (row) => row.policyName },
        { header: 'Risk', value: (row) => row.riskReason },
        { header: 'ARN', value: (row) => row.policyArn },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: policies,
    })
  }, [buildReport, policiesQuery.data])

  const scannedAt = mfaQuery.data?.scannedAt
    ? formatDateTime(mfaQuery.data.scannedAt)
    : policiesQuery.data?.scannedAt
      ? formatDateTime(policiesQuery.data.scannedAt)
      : undefined

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="IAM users"
        description="Console users without MFA and customer managed policies with wildcard (*:*) permissions."
        scannedAt={scannedAt}
      />

      {isInitialLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mfaQuery.data && (
              <>
                <StatCard
                  label="IAM users"
                  value={mfaQuery.data.totalUsers}
                  icon={<UsersIcon className="h-5 w-5" />}
                />
                <StatCard
                  label="Console users"
                  value={mfaQuery.data.usersWithConsoleAccess}
                  icon={<UserIcon />}
                />
                <StatCard
                  label="Without MFA"
                  value={mfaQuery.data.usersWithoutMfa}
                  variant={
                    mfaQuery.data.usersWithoutMfa > 0 ? 'warning' : 'success'
                  }
                  hint="Password sign-in enabled, no MFA device"
                  icon={<UserIcon />}
                />
              </>
            )}
            {policiesQuery.data && (
              <StatCard
                label="Risky policies (*:*)"
                value={policiesQuery.data.riskyPolicyCount}
                variant={
                  policiesQuery.data.riskyPolicyCount > 0 ? 'warning' : 'success'
                }
                hint={`${policiesQuery.data.totalCustomerPoliciesScanned} customer policies scanned`}
                icon={<SecurityIcon className="h-5 w-5" />}
              />
            )}
          </div>

          {mfaQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(mfaQuery.error)}
              onRetry={() => mfaQuery.refetch()}
            />
          ) : (
            mfaQuery.data && (
              <TableSection
                title="Console users without MFA"
                onExportPdf={handleExportMfaPdf}
                exportDisabled={mfaQuery.data.users.length === 0}
                columns={mfaUserColumns}
                data={mfaQuery.data.users}
                emptyMessage="All console-enabled users have at least one MFA device."
                getRowKey={(row) => row.userName}
              />
            )
          )}

          {policiesQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(policiesQuery.error)}
              onRetry={() => policiesQuery.refetch()}
            />
          ) : (
            policiesQuery.data && (
              <TableSection
                title="Customer policies with *:* allow"
                onExportPdf={handleExportPoliciesPdf}
                exportDisabled={policiesQuery.data.policies.length === 0}
                columns={riskyPolicyColumns}
                data={policiesQuery.data.policies}
                emptyMessage="No customer managed policies with Action * and Resource * were found."
                getRowKey={(row) => row.policyArn}
              />
            )
          )}
        </>
      )}
    </div>
  )
}
