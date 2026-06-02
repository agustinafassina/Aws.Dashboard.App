import type { jsPDF } from 'jspdf'
import type { PdfReportMeta } from '@/utils/pdfReport'

export const PDF_MARGIN_X = 14

export function getPdfContentWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth() - PDF_MARGIN_X * 2
}

export function appendPdfReportHeader(doc: jsPDF, report: PdfReportMeta): number {
  let y = 16
  const contentWidth = getPdfContentWidth(doc)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(63, 63, 70)
  doc.text(report.brandTitle, PDF_MARGIN_X, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)

  const metaLine = [
    `${report.generatedAtLabel}: ${report.generatedAt}`,
    report.region ? `${report.regionLabel}: ${report.region}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  doc.text(metaLine, PDF_MARGIN_X, y)
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  doc.text(report.executiveSummaryLabel, PDF_MARGIN_X, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(70, 70, 70)

  for (const paragraph of report.executiveSummary) {
    const lines = doc.splitTextToSize(paragraph, contentWidth)
    for (const line of lines) {
      doc.text(line, PDF_MARGIN_X, y)
      y += 4.2
    }
    y += 1.5
  }

  y += 1
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setDrawColor(210, 210, 210)
  doc.setLineWidth(0.3)
  doc.line(PDF_MARGIN_X, y, pageWidth - PDF_MARGIN_X, y)
  y += 8

  return y
}

export function appendPdfSectionTitle(doc: jsPDF, y: number, title: string): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text(title, PDF_MARGIN_X, y)
  return y + 6
}
