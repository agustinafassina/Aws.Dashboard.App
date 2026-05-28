import type { Column } from '@/interfaces/common'
import type { InspectorFinding } from '@/interfaces/aws-api'
import { formatDate } from '@/utils/formatters'
import { severityRank } from '@/utils/ecrVulnerabilities'

export function severityBadge(severity: string) {
  const normalized = severity.toUpperCase()
  const styles: Record<string, string> = {
    CRITICAL:
      'bg-red_50 text-red_900 dark:bg-red_50/20 dark:text-red_200',
    HIGH:
      'bg-orange_300/50 text-gray_900 dark:bg-orange_300/20 dark:text-orange',
    MEDIUM:
      'bg-orange_300/35 text-gray_900 dark:bg-orange_300/20 dark:text-orange',
    LOW:
      'bg-brand_100 text-brand_700 dark:bg-blue_200/30 dark:text-brand_300',
    INFORMATIONAL:
      'bg-gray_200 text-gray_800 dark:bg-gray_700 dark:text-gray_300',
  }
  const className =
    styles[normalized] ??
    'bg-gray_200 text-gray_800 dark:bg-gray_700 dark:text-gray_300'

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${className}`}
    >
      {severity}
    </span>
  )
}

export const inspectorFindingColumns: Column<InspectorFinding>[] = [
  {
    key: 'severity',
    label: 'Severity',
    cellClassName: 'whitespace-nowrap',
    render: (value) => severityBadge(String(value)),
  },
  {
    key: 'title',
    label: 'Title',
    cellClassName: 'max-w-[14rem] whitespace-normal text-xs leading-snug',
  },
  {
    key: 'status',
    label: 'Status',
    cellClassName: 'whitespace-nowrap',
  },
  {
    key: 'vulnerabilityId',
    label: 'CVE / ID',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
    render: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'lastObservedAt',
    label: 'Last observed',
    cellClassName: 'whitespace-nowrap text-xs',
    render: (value) => (value ? formatDate(String(value)) : '—'),
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
    render: (value) => (value ? String(value) : '—'),
  },
]

export function sortFindingsBySeverity(
  findings: InspectorFinding[],
): InspectorFinding[] {
  return [...findings].sort((a, b) => {
    const bySeverity = severityRank(a.severity) - severityRank(b.severity)
    if (bySeverity !== 0) return bySeverity
    return a.title.localeCompare(b.title)
  })
}
