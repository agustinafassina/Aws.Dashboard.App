import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PdfReportMeta } from '@/utils/pdfReport'
import type { TranslationDictionary } from '@/i18n/types'
import {
  appendPdfReportHeader,
  appendPdfSectionTitle,
  PDF_MARGIN_X,
} from '@/utils/pdfLayout'
import type { DashboardReportSnapshot } from '@/utils/dashboardReport'

function safeFilenamePart(value: string): string {
  return value.replace(/[^\w.-]+/g, '_')
}

function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob(['\uFEFF', content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function csvRow(cells: string[]): string {
  return cells.map(escapeCsvCell).join(',')
}

export function buildDashboardReportBasename(
  region: string,
  generatedAt: Date = new Date(),
): string {
  const datePart = generatedAt.toISOString().slice(0, 10)
  return `aws-dashboard-report-${safeFilenamePart(region)}-${datePart}`
}

export function exportDashboardReportPdf(
  snapshot: DashboardReportSnapshot,
  report: PdfReportMeta,
  sectionLabels: TranslationDictionary['dashboardExport'],
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  let y = appendPdfReportHeader(doc, report)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text(sectionLabels.title, PDF_MARGIN_X, y)
  y += 9

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)
  doc.text(
    `${sectionLabels.costRangeLabel}: ${snapshot.costRangeLabel}`,
    PDF_MARGIN_X,
    y,
  )
  y += 8

  y = appendPdfSectionTitle(doc, y, sectionLabels.kpiSection)
  autoTable(doc, {
    startY: y,
    head: [[sectionLabels.columns.metric, sectionLabels.columns.value]],
    body: snapshot.kpis.map((row) => [row.metric, row.value]),
    margin: { left: PDF_MARGIN_X, right: PDF_MARGIN_X },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [63, 63, 70] },
  })

  if (snapshot.topProjects.length > 0) {
    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? y + 20
    y = appendPdfSectionTitle(doc, finalY + 10, sectionLabels.topProjectsSection)

    autoTable(doc, {
      startY: y,
      head: [[sectionLabels.columns.project, sectionLabels.columns.amount]],
      body: snapshot.topProjects.map((row) => [row.project, row.amount]),
      margin: { left: PDF_MARGIN_X, right: PDF_MARGIN_X },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [63, 63, 70] },
    })
  }

  const scansStartY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y + 20
  y = appendPdfSectionTitle(doc, scansStartY + 10, sectionLabels.scansSection)

  autoTable(doc, {
    startY: y,
    head: [[sectionLabels.columns.module, sectionLabels.columns.scannedAt]],
    body: snapshot.scans.map((row) => [row.module, row.scannedAt]),
    margin: { left: PDF_MARGIN_X, right: PDF_MARGIN_X },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [63, 63, 70] },
  })

  const basename = buildDashboardReportBasename(snapshot.region)
  doc.save(`${basename}.pdf`)
}

export function exportDashboardReportCsv(
  snapshot: DashboardReportSnapshot,
  sectionLabels: TranslationDictionary['dashboardExport'],
): void {
  const lines: string[] = [
    csvRow([sectionLabels.title]),
    csvRow([
      sectionLabels.columns.region,
      sectionLabels.columns.costRange,
    ]),
    csvRow([snapshot.region, snapshot.costRangeLabel]),
    '',
    csvRow([sectionLabels.kpiSection]),
    csvRow([sectionLabels.columns.metric, sectionLabels.columns.value]),
    ...snapshot.kpis.map((row) => csvRow([row.metric, row.value])),
  ]

  if (snapshot.topProjects.length > 0) {
    lines.push(
      '',
      csvRow([sectionLabels.topProjectsSection]),
      csvRow([sectionLabels.columns.project, sectionLabels.columns.amount]),
      ...snapshot.topProjects.map((row) =>
        csvRow([row.project, row.amount]),
      ),
    )
  }

  lines.push(
    '',
    csvRow([sectionLabels.scansSection]),
    csvRow([sectionLabels.columns.module, sectionLabels.columns.scannedAt]),
    ...snapshot.scans.map((row) => csvRow([row.module, row.scannedAt])),
  )

  const basename = buildDashboardReportBasename(snapshot.region)
  downloadTextFile(`${basename}.csv`, lines.join('\n'), 'text/csv;charset=utf-8')
}
