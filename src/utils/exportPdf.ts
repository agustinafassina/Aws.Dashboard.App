import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PdfReportMeta } from '@/utils/pdfReport'
import {
  appendPdfReportHeader,
  appendPdfSectionTitle,
  getPdfContentWidth,
  PDF_MARGIN_X,
} from '@/utils/pdfLayout'

export interface PdfExportColumn<T> {
  header: string
  value: (row: T) => string
}

export interface ExportTableToPdfOptions<T> {
  filename: string
  title: string
  subtitle?: string
  report: PdfReportMeta
  columns: PdfExportColumn<T>[]
  rows: T[]
}

export function exportTableToPdf<T>({
  filename,
  title,
  subtitle,
  report,
  columns,
  rows,
}: ExportTableToPdfOptions<T>): void {
  if (rows.length === 0) return

  const useLandscape = columns.length > 5
  const doc = new jsPDF({
    orientation: useLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  let y = appendPdfReportHeader(doc, report)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text(title, PDF_MARGIN_X, y)
  y += 7

  if (subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(90, 90, 90)
    const subtitleLines = doc.splitTextToSize(subtitle, getPdfContentWidth(doc))
    for (const line of subtitleLines) {
      doc.text(line, PDF_MARGIN_X, y)
      y += 4.2
    }
    y += 3
  }

  autoTable(doc, {
    startY: y,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => col.value(row))),
    margin: { left: PDF_MARGIN_X, right: PDF_MARGIN_X },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [63, 63, 70] },
  })

  const safeName = filename.replace(/[^\w.-]+/g, '_')
  doc.save(safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`)
}
