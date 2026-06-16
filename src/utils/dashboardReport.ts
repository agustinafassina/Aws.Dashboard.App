import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
import type { DashboardScanModuleKey, TranslationDictionary } from '@/i18n/types'
import type { DashboardScanEntry } from '@/hooks/useDashboardSummary'

export interface DashboardKpiRow {
  metric: string
  value: string
}

export interface DashboardTopProjectRow {
  project: string
  amount: string
}

export interface DashboardScanRow {
  module: string
  scannedAt: string
}

export interface DashboardReportSnapshot {
  region: string
  costRangeLabel: string
  kpis: DashboardKpiRow[]
  topProjects: DashboardTopProjectRow[]
  scans: DashboardScanRow[]
}

export interface BuildDashboardReportInput {
  labels: TranslationDictionary['dashboardSummary']
  exportLabels: TranslationDictionary['dashboardExport']
  region: string
  costRange: { startDate: string; endDate: string }
  monthSpendFormatted: string | null
  topProjectName: string | null
  topProjectHint: string | undefined
  keysNeedingRotation: number
  criticalHighFindings: number
  rdsPublicPorts: number
  ec2PublicPorts: number
  s3PublicBuckets: number
  s3UnencryptedBuckets: number
  lambdaPublicFunctions: number
  acmExpiringCertificates: number
  ec2UnusedSecurityGroups: number
  ec2UnattachedVolumes: number
  topProjectsChart: { name: string; amount: number }[]
  costCurrency: string | undefined
  scans: DashboardScanEntry[]
  moduleLabel: (key: DashboardScanModuleKey) => string
}

export function buildDashboardReportSnapshot(
  input: BuildDashboardReportInput,
): DashboardReportSnapshot {
  const { labels: d, exportLabels: e } = input

  const topProjectValue =
    input.topProjectName && input.topProjectName !== d.noData
      ? input.topProjectHint
        ? `${input.topProjectName} (${input.topProjectHint})`
        : input.topProjectName
      : d.noData

  const kpis: DashboardKpiRow[] = [
    {
      metric: d.monthSpend,
      value: input.monthSpendFormatted ?? d.noData,
    },
    { metric: d.topProject, value: topProjectValue },
    {
      metric: d.keysRotation,
      value: String(input.keysNeedingRotation),
    },
    {
      metric: d.criticalHighFindings,
      value: String(input.criticalHighFindings),
    },
    {
      metric: d.rdsPublicPorts,
      value: String(input.rdsPublicPorts),
    },
    {
      metric: d.ec2PublicPorts,
      value: String(input.ec2PublicPorts),
    },
    {
      metric: d.s3PublicBuckets,
      value: String(input.s3PublicBuckets),
    },
    {
      metric: d.s3UnencryptedBuckets,
      value: String(input.s3UnencryptedBuckets),
    },
    {
      metric: d.lambdaPublicFunctions,
      value: String(input.lambdaPublicFunctions),
    },
    {
      metric: d.acmExpiringCertificates,
      value: String(input.acmExpiringCertificates),
    },
    {
      metric: d.ec2UnusedSecurityGroups,
      value: String(input.ec2UnusedSecurityGroups),
    },
    {
      metric: d.ec2UnattachedVolumes,
      value: String(input.ec2UnattachedVolumes),
    },
  ]

  const topProjects: DashboardTopProjectRow[] = input.topProjectsChart.map(
    (project) => ({
      project: project.name,
      amount: input.costCurrency
        ? formatCurrency(project.amount, input.costCurrency)
        : String(project.amount),
    }),
  )

  const scanRows: DashboardScanRow[] = input.scans.map((scan) => ({
    module: input.moduleLabel(scan.key),
    scannedAt: scan.isError
      ? d.loadError
      : scan.isLoading
        ? d.loading
        : scan.scannedAt
          ? formatDateTime(scan.scannedAt)
          : d.noScan,
  }))

  return {
    region: input.region,
    costRangeLabel: `${formatDate(input.costRange.startDate)} → ${formatDate(input.costRange.endDate)}`,
    kpis,
    topProjects,
    scans: scanRows,
  }
}

export function buildDashboardExecutiveSummary(
  snapshot: DashboardReportSnapshot,
  exportLabels: TranslationDictionary['dashboardExport'],
): string[] {
  const lines = [
    `${exportLabels.summaryRegional} ${snapshot.region}. ${exportLabels.summaryCosts} ${snapshot.costRangeLabel}.`,
  ]

  const highlights = snapshot.kpis
    .filter((kpi) => kpi.value !== '—' && kpi.value !== '…')
    .map((kpi) => `${kpi.metric}: ${kpi.value}`)

  if (highlights.length > 0) {
    lines.push(highlights.join(' · '))
  }

  return lines
}
