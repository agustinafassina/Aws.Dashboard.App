import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface PdfExportColumn<T> {
  header: string
  value: (row: T) => string
}

export interface ExportTableToPdfOptions<T> {
  filename: string
  title: string
  subtitle?: string
  columns: PdfExportColumn<T>[]
  rows: T[]
}

export function exportTableToPdf<T>({
  filename,
  title,
  subtitle,
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

  doc.setFontSize(14)
  doc.text(title, 14, 16)

  let tableStartY = 22
  if (subtitle) {
    doc.setFontSize(9)
    doc.setTextColor(80)
    doc.text(subtitle, 14, 22)
    doc.setTextColor(0)
    tableStartY = 28
  }

  autoTable(doc, {
    startY: tableStartY,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => col.value(row))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [63, 63, 70] },
  })

  const safeName = filename.replace(/[^\w.-]+/g, '_')
  doc.save(safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`)
}
