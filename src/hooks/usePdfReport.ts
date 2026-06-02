'use client'

import { useCallback } from 'react'
import { useAwsRegion } from '@/context/RegionContext'
import { useTranslation } from '@/i18n/useTranslation'
import {
  buildPdfReportMeta,
  type PdfReportMeta,
  type PdfReportScope,
} from '@/utils/pdfReport'

export function usePdfReport() {
  const { dictionary } = useTranslation()
  const { region } = useAwsRegion()
  const labels = dictionary.pdfReport

  const buildReport = useCallback(
    (options: {
      region?: string | null
      scope?: PdfReportScope
      executiveSummary: string | string[]
      scannedAt?: string
    }): PdfReportMeta =>
      buildPdfReportMeta(labels, {
        ...options,
        defaultRegion: region,
      }),
    [labels, region],
  )

  return { buildReport, labels }
}
