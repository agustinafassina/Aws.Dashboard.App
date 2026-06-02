import { maskAccessKeyId } from '@/api/aws/iam'
import type { Column } from '@/interfaces/common'
import type {
  IamAccessKey,
  IamRiskyPolicy,
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
