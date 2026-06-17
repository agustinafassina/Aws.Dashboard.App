import { maskAccessKeyId } from '@/api/aws/iam'
import type { Column } from '@/interfaces/common'
import type {
  IamAccessKey,
  IamAdminPrivilegeGrant,
  IamCrossAccountRole,
  IamInlinePolicy,
  IamOverprivilegedPolicy,
  IamRiskyPolicy,
  IamRootAccountStatusResponse,
  IamUserWithoutMfa,
} from '@/interfaces/aws-api'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { formatDate } from '@/utils/formatters'

export function getIamApiErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? ERROR_MESSAGE
  )
}

export const accessKeyColumns: Column<IamAccessKey>[] = [
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
    key: 'isNeverUsed',
    label: 'Usage',
    cellClassName: 'whitespace-nowrap',
    render: (value) =>
      value ? (
        <span
          title="Never used"
          className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-gray_100 px-2.5 py-0.5 text-xs font-semibold text-gray_800 dark:bg-gray_750 dark:text-gray_200"
        >
          Never used
        </span>
      ) : (
        <span className="text-xs text-gray_600 dark:text-gray_400">—</span>
      ),
  },
  {
    key: 'needsRotation',
    label: 'Rotation',
    width: '8.75rem',
    cellClassName: 'whitespace-nowrap',
    render: (value) =>
      value ? (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-red_50 px-2.5 py-0.5 text-xs font-semibold text-red_900 dark:text-red_200">
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

export const mfaUserColumns: Column<IamUserWithoutMfa>[] = [
  {
    key: 'userName',
    label: 'User',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'email',
    label: 'Email',
    cellClassName: 'min-w-[18rem] whitespace-nowrap font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'userCreated',
    label: 'Created',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export const riskyPolicyColumns: Column<IamRiskyPolicy>[] = [
  {
    key: 'policyName',
    label: 'Policy',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'riskReason',
    label: 'Risk',
    cellClassName:
      'whitespace-nowrap text-xs font-medium text-red_900 dark:text-red_200',
  },
  {
    key: 'policyArn',
    label: 'ARN',
    cellClassName:
      'min-w-[14rem] truncate whitespace-nowrap font-mono text-xs text-gray_600 dark:text-gray_400',
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export const overprivilegedPolicyColumns: Column<IamOverprivilegedPolicy>[] = [
  {
    key: 'policyName',
    label: 'Policy',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'privilegeLevel',
    label: 'Severity',
    cellClassName:
      'whitespace-nowrap text-xs font-medium text-red_900 dark:text-red_200',
  },
  {
    key: 'riskReason',
    label: 'Risk',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
  {
    key: 'riskyActions',
    label: 'Risky actions',
    cellClassName: 'min-w-[12rem] whitespace-normal font-mono text-xs leading-snug',
    render: (value) => {
      const actions = (value as string[]) ?? []
      return actions.length > 0 ? actions.join(', ') : '—'
    },
    tooltipValue: (_value, row) =>
      row.riskyActions.length > 0 ? row.riskyActions.join(', ') : undefined,
  },
  {
    key: 'policyArn',
    label: 'ARN',
    cellClassName:
      'min-w-[14rem] truncate whitespace-nowrap font-mono text-xs text-gray_600 dark:text-gray_400',
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export const adminPrivilegeGrantColumns: Column<IamAdminPrivilegeGrant>[] = [
  {
    key: 'principalType',
    label: 'Type',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'principalName',
    label: 'Principal',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'policyName',
    label: 'Policy',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap',
  },
  {
    key: 'attachmentType',
    label: 'Attachment',
    cellClassName: 'whitespace-nowrap text-xs',
  },
  {
    key: 'privilegeLevel',
    label: 'Privilege',
    cellClassName:
      'whitespace-nowrap text-xs font-medium text-red_900 dark:text-red_200',
  },
  {
    key: 'inheritedFromGroup',
    label: 'Inherited group',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export const crossAccountRoleColumns: Column<IamCrossAccountRole>[] = [
  {
    key: 'roleName',
    label: 'Role',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'allowsAnyPrincipal',
    label: 'Trust',
    cellClassName: 'whitespace-nowrap',
    render: (value) =>
      value ? (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-red_50 px-2.5 py-0.5 text-xs font-semibold text-red_900 dark:text-red_200">
          Any principal
        </span>
      ) : (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-warning_100 px-2.5 py-0.5 text-xs font-semibold text-warning_800 dark:bg-brand_500/20 dark:text-brand_200">
          External account
        </span>
      ),
  },
  {
    key: 'trustRiskReason',
    label: 'Risk',
    cellClassName:
      'min-w-[12rem] whitespace-normal text-xs font-medium text-red_900 dark:text-red_200',
  },
  {
    key: 'trustedPrincipals',
    label: 'Trusted principals',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
    render: (value) => {
      const principals = (value as string[]) ?? []
      return principals.length > 0 ? principals.join('; ') : '—'
    },
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export const inlinePolicyColumns: Column<IamInlinePolicy>[] = [
  {
    key: 'principalType',
    label: 'Type',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'principalName',
    label: 'Principal',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'policyName',
    label: 'Policy',
    cellClassName: 'max-w-[10rem] truncate whitespace-nowrap',
  },
  {
    key: 'hasWildcardAdminRisk',
    label: 'Risk',
    cellClassName: 'whitespace-nowrap',
    render: (value) =>
      value ? (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-red_50 px-2.5 py-0.5 text-xs font-semibold text-red_900 dark:text-red_200">
          Wildcard admin
        </span>
      ) : (
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-success_100 px-2.5 py-0.5 text-xs font-semibold text-success_700 dark:text-success_500">
          Reviewed
        </span>
      ),
  },
  {
    key: 'riskReason',
    label: 'Risk reason',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[14rem] whitespace-normal text-xs leading-snug',
  },
]

export function rootAccountRiskSummary(
  rootStatus: IamRootAccountStatusResponse | undefined,
): string {
  if (!rootStatus) return 'Root account status unavailable'
  if (rootStatus.isCompliant) return 'Root account follows baseline controls'
  return rootStatus.riskReasons.join('; ')
}
