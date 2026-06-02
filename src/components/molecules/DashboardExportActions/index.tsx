'use client'

import DownloadIcon from '@/components/atoms/Icons/DownloadIcon'
import { useDashboardReportExport } from '@/hooks/useDashboardReportExport'
import { getExportPdfButtonClass } from '@/components/molecules/ExportPdfButton/styles'
import { dashboardSectionStyles } from '@/components/organism/DashboardSummary/styles'

export default function DashboardExportActions() {
  const { exportPdf, exportCsv, isExportDisabled, exportLabels } =
    useDashboardReportExport()

  const buttonClass = getExportPdfButtonClass(isExportDisabled)

  return (
    <div
      className={dashboardSectionStyles.exportActions}
      role="group"
      aria-label={exportLabels.groupAriaLabel}
    >
      <button
        type="button"
        onClick={exportPdf}
        disabled={isExportDisabled}
        className={buttonClass}
        aria-label={exportLabels.downloadPdf}
        title={
          isExportDisabled ? exportLabels.disabledWhileLoading : undefined
        }
      >
        <DownloadIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">{exportLabels.downloadPdf}</span>
      </button>
      <button
        type="button"
        onClick={exportCsv}
        disabled={isExportDisabled}
        className={buttonClass}
        aria-label={exportLabels.downloadCsv}
        title={
          isExportDisabled ? exportLabels.disabledWhileLoading : undefined
        }
      >
        <DownloadIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">{exportLabels.downloadCsv}</span>
      </button>
    </div>
  )
}
