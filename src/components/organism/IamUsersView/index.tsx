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
  inlinePolicyColumns,
  mfaUserColumns,
  overprivilegedPolicyColumns,
  rootAccountRiskSummary,
  riskyPolicyColumns,
} from '@/components/organism/Iam/iamShared'
import { useIamAdminPrivilegeGrants } from '@/hooks/useIamAdminPrivilegeGrants'
import { useIamCrossAccountRoles } from '@/hooks/useIamCrossAccountRoles'
import { useIamInlinePolicies } from '@/hooks/useIamInlinePolicies'
import { useIamOverprivilegedCustomPolicies } from '@/hooks/useIamOverprivilegedCustomPolicies'
import { useIamRiskyPolicies } from '@/hooks/useIamRiskyPolicies'
import { useIamRootAccountStatus } from '@/hooks/useIamRootAccountStatus'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useTranslation } from '@/i18n/useTranslation'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { formatDate } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function IamUsersView() {
  const { dictionary } = useTranslation()
  const legends = dictionary.iamUsers.legends
  const { buildReport } = usePdfReport()
  const mfaQuery = useIamUsersWithoutMfa()
  const policiesQuery = useIamRiskyPolicies()
  const overprivilegedQuery = useIamOverprivilegedCustomPolicies()
  const adminGrantsQuery = useIamAdminPrivilegeGrants()
  const crossAccountRolesQuery = useIamCrossAccountRoles()
  const rootAccountQuery = useIamRootAccountStatus()
  const inlinePoliciesQuery = useIamInlinePolicies()

  const isInitialLoading =
    mfaQuery.isLoading &&
    policiesQuery.isLoading &&
    overprivilegedQuery.isLoading &&
    adminGrantsQuery.isLoading &&
    crossAccountRolesQuery.isLoading &&
    rootAccountQuery.isLoading &&
    inlinePoliciesQuery.isLoading

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

  const handleExportOverprivilegedPdf = useCallback(() => {
    const policies = overprivilegedQuery.data?.policies ?? []
    if (!policies.length) return

    exportTableToPdf({
      filename: 'iam-overprivileged-custom-policies',
      title: 'IAM overprivileged custom policies',
      subtitle: `${overprivilegedQuery.data?.overprivilegedPolicyCount ?? 0} policy(ies) with service-wide wildcards`,
      report: buildReport({
        scope: 'account',
        scannedAt: overprivilegedQuery.data?.scannedAt,
        executiveSummary: [
          `${overprivilegedQuery.data?.overprivilegedPolicyCount ?? 0} of ${overprivilegedQuery.data?.totalCustomerPoliciesScanned ?? 0} customer-managed policies grant service-wide wildcard actions.`,
          `${overprivilegedQuery.data?.criticalPolicyCount ?? 0} critical · ${overprivilegedQuery.data?.highPolicyCount ?? 0} high · ${overprivilegedQuery.data?.mediumPolicyCount ?? 0} medium.`,
        ],
      }),
      columns: [
        { header: 'Policy', value: (row) => row.policyName },
        { header: 'Severity', value: (row) => row.privilegeLevel },
        { header: 'Risk', value: (row) => row.riskReason },
        {
          header: 'Risky actions',
          value: (row) => row.riskyActions.join(', '),
        },
        { header: 'ARN', value: (row) => row.policyArn },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: policies,
    })
  }, [buildReport, overprivilegedQuery.data])

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

  const handleExportInlinePoliciesPdf = useCallback(() => {
    const policies = inlinePoliciesQuery.data?.policies ?? []
    if (!policies.length) return

    exportTableToPdf({
      filename: 'iam-inline-policies',
      title: 'IAM inline policies',
      subtitle: `${inlinePoliciesQuery.data?.riskyInlinePolicyCount ?? 0} risky inline policy(ies)`,
      report: buildReport({
        scope: 'account',
        scannedAt: inlinePoliciesQuery.data?.scannedAt,
        executiveSummary: [
          `${inlinePoliciesQuery.data?.riskyInlinePolicyCount ?? 0} risky inline policy(ies) out of ${inlinePoliciesQuery.data?.inlinePolicyCount ?? 0} detected.`,
        ],
      }),
      columns: [
        { header: 'Type', value: (row) => row.principalType },
        { header: 'Principal', value: (row) => row.principalName },
        { header: 'Policy', value: (row) => row.policyName },
        {
          header: 'Wildcard admin risk',
          value: (row) => (row.hasWildcardAdminRisk ? 'Yes' : 'No'),
        },
        { header: 'Risk reason', value: (row) => row.riskReason ?? '—' },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: policies,
    })
  }, [buildReport, inlinePoliciesQuery.data])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="IAM users"
        description="Console users without MFA, risky policies, root account controls, admin grants, and cross-account trust risks."
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
            {overprivilegedQuery.data && (
              <StatCard
                compact
                label="Overprivileged policies"
                value={overprivilegedQuery.data.overprivilegedPolicyCount}
                variant={
                  overprivilegedQuery.data.overprivilegedPolicyCount > 0
                    ? 'warning'
                    : 'success'
                }
                hint={`${overprivilegedQuery.data.criticalPolicyCount} critical · ${overprivilegedQuery.data.highPolicyCount} high`}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={4}
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
                iconTone={5}
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
                iconTone={6}
              />
            )}
            {rootAccountQuery.data && (
              <StatCard
                compact
                label="Root account"
                value={rootAccountQuery.data.isCompliant ? 'Compliant' : 'At risk'}
                variant={rootAccountQuery.data.isCompliant ? 'success' : 'warning'}
                hint={rootAccountRiskSummary(rootAccountQuery.data)}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={0}
              />
            )}
            {inlinePoliciesQuery.data && (
              <StatCard
                compact
                label="Risky inline policies"
                value={inlinePoliciesQuery.data.riskyInlinePolicyCount}
                variant={
                  inlinePoliciesQuery.data.riskyInlinePolicyCount > 0
                    ? 'warning'
                    : 'success'
                }
                hint={`${inlinePoliciesQuery.data.inlinePolicyCount} inline policies`}
                icon={<SecurityIcon className="h-4 w-4" />}
                iconTone={1}
              />
            )}
          </div>

          {rootAccountQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(rootAccountQuery.error)}
              onRetry={() => rootAccountQuery.refetch()}
            />
          ) : (
            rootAccountQuery.data &&
            !rootAccountQuery.data.isCompliant && (
              <div className="mb-6 rounded-xl border border-warning_200 bg-warning_50 p-4 dark:border-brand_400/30 dark:bg-brand_500/10">
                <h3 className="mb-1 text-sm font-semibold text-warning_900 dark:text-brand_100">
                  Root account risk detected
                </h3>
                <p className="text-xs text-warning_800 dark:text-brand_200">
                  {rootAccountRiskSummary(rootAccountQuery.data)}
                </p>
                <p className="mt-1 text-xs text-gray_700 dark:text-gray_300">
                  {rootAccountQuery.data.recommendation}
                </p>
              </div>
            )
          )}

          {mfaQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(mfaQuery.error)}
              onRetry={() => mfaQuery.refetch()}
            />
          ) : (
            mfaQuery.data && (
              <TableSection
                title="Console users without MFA"
                description={legends.mfa}
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
                description={legends.riskyPolicies}
                onExportPdf={handleExportPoliciesPdf}
                exportDisabled={policiesQuery.data.policies.length === 0}
                columns={riskyPolicyColumns}
                data={policiesQuery.data.policies}
                emptyMessage="No customer managed policies with Action * and Resource * were found."
                getRowKey={(row) => row.policyArn}
              />
            )
          )}

          {overprivilegedQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(overprivilegedQuery.error)}
              onRetry={() => overprivilegedQuery.refetch()}
            />
          ) : (
            overprivilegedQuery.data && (
              <TableSection
                title="Overprivileged custom policies"
                description={legends.overprivilegedPolicies}
                onExportPdf={handleExportOverprivilegedPdf}
                exportDisabled={overprivilegedQuery.data.policies.length === 0}
                columns={overprivilegedPolicyColumns}
                data={overprivilegedQuery.data.policies}
                emptyMessage="No customer managed policies with service-wide wildcard actions were found."
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
                description={legends.adminGrants}
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
                description={legends.crossAccountRoles}
                onExportPdf={handleExportCrossAccountRolesPdf}
                exportDisabled={crossAccountRolesQuery.data.roles.length === 0}
                columns={crossAccountRoleColumns}
                data={crossAccountRolesQuery.data.roles}
                emptyMessage="No cross-account role trust relationships were detected."
                getRowKey={(row) => row.roleArn}
              />
            )
          )}

          {inlinePoliciesQuery.isError ? (
            <ErrorState
              message={getIamApiErrorMessage(inlinePoliciesQuery.error)}
              onRetry={() => inlinePoliciesQuery.refetch()}
            />
          ) : (
            inlinePoliciesQuery.data && (
              <TableSection
                title="Inline policies"
                description={legends.inlinePolicies}
                onExportPdf={handleExportInlinePoliciesPdf}
                exportDisabled={inlinePoliciesQuery.data.policies.length === 0}
                columns={inlinePolicyColumns}
                data={inlinePoliciesQuery.data.policies}
                emptyMessage="No inline policies were found."
                getRowKey={(row) => `${row.principalType}:${row.principalName}:${row.policyName}`}
              />
            )
          )}
        </>
      )}
    </div>
  )
}
