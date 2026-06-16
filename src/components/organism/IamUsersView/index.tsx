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
  adminPrivilegeGrantColumns,
  crossAccountRoleColumns,
  getIamApiErrorMessage,
  mfaUserColumns,
  riskyPolicyColumns,
} from '@/components/organism/Iam/iamShared'
import { useIamAdminPrivilegeGrants } from '@/hooks/useIamAdminPrivilegeGrants'
import { useIamCrossAccountRoles } from '@/hooks/useIamCrossAccountRoles'
import { useIamRiskyPolicies } from '@/hooks/useIamRiskyPolicies'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { usePdfReport } from '@/hooks/usePdfReport'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { formatDate } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function IamUsersView() {
  const { buildReport } = usePdfReport()
  const mfaQuery = useIamUsersWithoutMfa()
  const policiesQuery = useIamRiskyPolicies()
  const adminGrantsQuery = useIamAdminPrivilegeGrants()
  const crossAccountRolesQuery = useIamCrossAccountRoles()

  const isInitialLoading =
    mfaQuery.isLoading &&
    policiesQuery.isLoading &&
    adminGrantsQuery.isLoading &&
    crossAccountRolesQuery.isLoading

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

  const handleExportAdminGrantsPdf = useCallback(() => {
    const grants = adminGrantsQuery.data?.grants ?? []
    if (!grants.length) return

    exportTableToPdf({
      filename: 'iam-admin-privilege-grants',
      title: 'IAM admin privilege grants',
      subtitle: `${adminGrantsQuery.data?.adminPrivilegeGrantCount ?? 0} grant(s) with admin-level access`,
      report: buildReport({
        scope: 'account',
        scannedAt: adminGrantsQuery.data?.scannedAt,
        executiveSummary: [
          `${adminGrantsQuery.data?.usersWithAdminAccess ?? 0} user(s), ${adminGrantsQuery.data?.groupsWithAdminAccess ?? 0} group(s), and ${adminGrantsQuery.data?.rolesWithAdminAccess ?? 0} role(s) have admin-level grants.`,
        ],
      }),
      columns: [
        { header: 'Type', value: (row) => row.principalType },
        { header: 'Principal', value: (row) => row.principalName },
        { header: 'Policy', value: (row) => row.policyName },
        { header: 'Privilege', value: (row) => row.privilegeLevel },
        { header: 'Attachment', value: (row) => row.attachmentType },
        { header: 'Inherited group', value: (row) => row.inheritedFromGroup ?? '—' },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: grants,
    })
  }, [adminGrantsQuery.data, buildReport])

  const handleExportCrossAccountRolesPdf = useCallback(() => {
    const roles = crossAccountRolesQuery.data?.roles ?? []
    if (!roles.length) return

    exportTableToPdf({
      filename: 'iam-cross-account-roles',
      title: 'IAM cross-account roles',
      subtitle: `${crossAccountRolesQuery.data?.crossAccountRolesCount ?? 0} role(s) with cross-account trust`,
      report: buildReport({
        scope: 'account',
        scannedAt: crossAccountRolesQuery.data?.scannedAt,
        executiveSummary: [
          `${crossAccountRolesQuery.data?.crossAccountRolesCount ?? 0} of ${crossAccountRolesQuery.data?.totalRolesScanned ?? 0} role(s) allow trust from external account principals.`,
        ],
      }),
      columns: [
        { header: 'Role', value: (row) => row.roleName },
        { header: 'Risk', value: (row) => row.trustRiskReason },
        {
          header: 'Trusted principals',
          value: (row) => row.trustedPrincipals.join('; '),
        },
        {
          header: 'Allows any principal',
          value: (row) => (row.allowsAnyPrincipal ? 'Yes' : 'No'),
        },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: roles,
    })
  }, [buildReport, crossAccountRolesQuery.data])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="IAM users"
        description="Console users without MFA, risky wildcard policies, admin privilege grants, and cross-account trust roles."
      />

      {isInitialLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
            {mfaQuery.data && (
              <>
                <StatCard
                  compact
                  label="IAM users"
                  value={mfaQuery.data.totalUsers}
                  icon={<UsersIcon className="h-4 w-4" />}
                  iconTone={0}
                />
                <StatCard
                  compact
                  label="Console users"
                  value={mfaQuery.data.usersWithConsoleAccess}
                  icon={<UserIcon />}
                  iconTone={1}
                />
                <StatCard
                  compact
                  label="Without MFA"
                  value={mfaQuery.data.usersWithoutMfa}
                  variant={
                    mfaQuery.data.usersWithoutMfa > 0 ? 'warning' : 'success'
                  }
                  hint="Password sign-in enabled, no MFA device"
                  icon={<UserIcon />}
                  iconTone={2}
                />
              </>
            )}
            {policiesQuery.data && (
              <StatCard
                compact
                label="Risky policies (*:*)"
                value={policiesQuery.data.riskyPolicyCount}
                variant={
                  policiesQuery.data.riskyPolicyCount > 0 ? 'warning' : 'success'
                }
                hint={`${policiesQuery.data.totalCustomerPoliciesScanned} customer policies scanned`}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={3}
              />
            )}
            {adminGrantsQuery.data && (
              <StatCard
                compact
                label="Admin grants"
                value={adminGrantsQuery.data.adminPrivilegeGrantCount}
                variant={
                  adminGrantsQuery.data.adminPrivilegeGrantCount > 0
                    ? 'warning'
                    : 'success'
                }
                hint={`${adminGrantsQuery.data.usersWithAdminAccess} users · ${adminGrantsQuery.data.rolesWithAdminAccess} roles`}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={4}
              />
            )}
            {crossAccountRolesQuery.data && (
              <StatCard
                compact
                label="Cross-account roles"
                value={crossAccountRolesQuery.data.crossAccountRolesCount}
                variant={
                  crossAccountRolesQuery.data.crossAccountRolesCount > 0
                    ? 'warning'
                    : 'success'
                }
                hint={`${crossAccountRolesQuery.data.totalRolesScanned} roles scanned`}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={5}
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

          {adminGrantsQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(adminGrantsQuery.error)}
              onRetry={() => adminGrantsQuery.refetch()}
            />
          ) : (
            adminGrantsQuery.data && (
              <TableSection
                title="Admin privilege grants"
                onExportPdf={handleExportAdminGrantsPdf}
                exportDisabled={adminGrantsQuery.data.grants.length === 0}
                columns={adminPrivilegeGrantColumns}
                data={adminGrantsQuery.data.grants}
                emptyMessage="No admin-level privilege grants were detected."
                getRowKey={(row) =>
                  `${row.principalType}:${row.principalName}:${row.policyArn}:${row.attachmentType}`
                }
              />
            )
          )}

          {crossAccountRolesQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(crossAccountRolesQuery.error)}
              onRetry={() => crossAccountRolesQuery.refetch()}
            />
          ) : (
            crossAccountRolesQuery.data && (
              <TableSection
                title="Cross-account trust roles"
                onExportPdf={handleExportCrossAccountRolesPdf}
                exportDisabled={crossAccountRolesQuery.data.roles.length === 0}
                columns={crossAccountRoleColumns}
                data={crossAccountRolesQuery.data.roles}
                emptyMessage="No cross-account role trust relationships were detected."
                getRowKey={(row) => row.roleArn}
              />
            )
          )}
        </>
      )}
    </div>
  )
}
