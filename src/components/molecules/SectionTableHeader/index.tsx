import ExportPdfButton from '@/components/molecules/ExportPdfButton'
import TableSearchInput from '@/components/molecules/TableSearchInput'

interface SectionTableHeaderProps {
  title: string
  onExportPdf: () => void
  exportDisabled?: boolean
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}

export default function SectionTableHeader({
  title,
  onExportPdf,
  exportDisabled = false,
  searchQuery,
  onSearchQueryChange,
}: SectionTableHeaderProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray_800 dark:text-gray_400">
        {title}
      </h2>
      <div className="inline-flex flex-nowrap items-center gap-2">
        <TableSearchInput value={searchQuery} onChange={onSearchQueryChange} />
        <ExportPdfButton onClick={onExportPdf} disabled={exportDisabled} />
      </div>
    </div>
  )
}
