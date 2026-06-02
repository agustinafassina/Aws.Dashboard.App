'use client'

import { useCallback, useMemo } from 'react'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import type { DashboardScanModuleKey } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'
import {
  buildDashboardExecutiveSummary,
  buildDashboardReportSnapshot,
} from '@/utils/dashboardReport'
import {
  exportDashboardReportCsv,
  exportDashboardReportPdf,
} from '@/utils/exportDashboardReport'
import { buildPdfReportMeta } from '@/utils/pdfReport'

export function useDashboardReportExport() {
  const { dictionary } = useTranslation()
  const summary = useDashboardSummary()

  const d = dictionary.dashboardSummary
  const exportLabels = dictionary.dashboardExport

  const moduleLabel = useCallback(
    (key: DashboardScanModuleKey) => d.modules[key],
    [d.modules],
  )

  const snapshot = useMemo(
    () =>
      buildDashboardReportSnapshot({
        labels: d,
        exportLabels,
        region: summary.region,
        costRange: summary.costRange,
        monthSpendFormatted: summary.monthSpendFormatted,
        topProjectName: summary.topProject?.project ?? d.noData,
        topProjectHint: summary.topProjectHint,
        keysNeedingRotation: summary.keysNeedingRotation,
        criticalHighFindings: summary.criticalHighFindings,
        rdsPublicPorts: summary.rdsPublicPorts,
        ec2PublicPorts: summary.ec2PublicPorts,
        s3PublicBuckets: summary.s3PublicBuckets,
        topProjectsChart: summary.topProjectsChart,
        costCurrency: summary.costCurrency,
        scans: summary.scans,
        moduleLabel,
      }),
    [
      d,
      exportLabels,
      moduleLabel,
      summary.costCurrency,
      summary.costRange,
      summary.criticalHighFindings,
      summary.ec2PublicPorts,
      summary.keysNeedingRotation,
      summary.monthSpendFormatted,
      summary.region,
      summary.rdsPublicPorts,
      summary.s3PublicBuckets,
      summary.scans,
      summary.topProject?.project,
      summary.topProjectHint,
      summary.topProjectsChart,
    ],
  )

  const pdfReport = useMemo(
    () =>
      buildPdfReportMeta(dictionary.pdfReport, {
        region: summary.region,
        executiveSummary: buildDashboardExecutiveSummary(
          snapshot,
          exportLabels,
        ),
      }),
    [dictionary.pdfReport, exportLabels, snapshot, summary.region],
  )

  const isExportDisabled =
    summary.isInitialLoading ||
    summary.isAnyFetching ||
    summary.costsQuery.isError

  const exportPdf = useCallback(() => {
    exportDashboardReportPdf(snapshot, pdfReport, exportLabels)
  }, [exportLabels, pdfReport, snapshot])

  const exportCsv = useCallback(() => {
    exportDashboardReportCsv(snapshot, exportLabels)
  }, [exportLabels, snapshot])

  return {
    exportPdf,
    exportCsv,
    isExportDisabled,
    exportLabels,
  }
}
