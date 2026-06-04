import type { Column } from '@/interfaces/common'
import type { InspectorFinding } from '@/interfaces/aws-api'
import { formatDate } from '@/utils/formatters'
import { severityRank } from '@/utils/ecrVulnerabilities'

export function severityBadge(severity: string) {
  const normalized = severity.toUpperCase()
  const styles: Record<string, string> = {
    CRITICAL:
      'bg-brand_900 text-brand_100 dark:bg-brand_800 dark:text-brand_100',
    HIGH:
      'bg-brand_700 text-brand_50 dark:bg-brand_700/50 dark:text-brand_100',
    MEDIUM:
      'bg-brand_400 text-white dark:bg-brand_500/45 dark:text-brand_50',
    LOW:
      'bg-brand_200 text-brand_800 dark:bg-brand_600/35 dark:text-brand_100',
    INFORMATIONAL:
      'bg-brand_100 text-brand_700 dark:bg-brand_900/50 dark:text-brand_200',
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
