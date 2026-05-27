'use client'

import DownloadIcon from '@/components/atoms/Icons/DownloadIcon'
import { useTranslation } from '@/i18n/useTranslation'
import { getExportPdfButtonClass } from './styles'

interface ExportPdfButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function ExportPdfButton({
  onClick,
  disabled = false,
}: ExportPdfButtonProps) {
  const { dictionary } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={getExportPdfButtonClass(disabled)}
      aria-label={dictionary.export.downloadPdf}
    >
      <DownloadIcon className="h-4 w-4" />
      <span className="whitespace-nowrap">{dictionary.export.downloadPdf}</span>
    </button>
  )
}
