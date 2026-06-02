import { format } from 'date-fns'
import { DISPLAY_DATETIME_FORMAT, formatDateTime } from '@/utils/formatters'
import type { TranslationDictionary } from '@/i18n/types'

export interface PdfReportMeta {
  brandTitle: string
  generatedAtLabel: string
  generatedAt: string
  regionLabel: string
  region?: string
  executiveSummaryLabel: string
  executiveSummary: string[]
}

export type PdfReportScope = 'regional' | 'account' | 'costs'

export function buildPdfReportMeta(
  labels: TranslationDictionary['pdfReport'],
  options: {
    region?: string | null
    defaultRegion?: string
    scope?: PdfReportScope
    executiveSummary: string | string[]
    scannedAt?: string
    generatedAt?: Date
  },
): PdfReportMeta {
  let regionValue: string | undefined

  if (options.scope === 'account') {
    regionValue = labels.scopeAccount
  } else if (options.scope === 'costs') {
    regionValue = labels.scopeCosts
  } else {
    const resolved = options.region ?? options.defaultRegion
    regionValue = resolved?.trim() || undefined
  }

  const generatedAt = options.scannedAt
    ? formatDateTime(options.scannedAt)
    : format(options.generatedAt ?? new Date(), DISPLAY_DATETIME_FORMAT)

  const summary = options.executiveSummary
  const executiveSummary = Array.isArray(summary) ? summary : [summary]

  return {
    brandTitle: labels.brandTitle,
    generatedAtLabel: labels.generatedAt,
    generatedAt,
    regionLabel: labels.region,
    region: regionValue,
    executiveSummaryLabel: labels.executiveSummary,
    executiveSummary,
  }
}
