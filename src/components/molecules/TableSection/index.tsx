'use client'

import { useState } from 'react'
import DataTable from '@/components/molecules/DataTable'
import SectionTableHeader from '@/components/molecules/SectionTableHeader'
import type { Column } from '@/interfaces/common'

interface TableSectionProps<T extends object> {
  title: string
  description?: string
  onExportPdf: () => void
  exportDisabled?: boolean
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  getRowKey: (row: T, index: number) => string
}

export default function TableSection<T extends object>({
  title,
  description,
  onExportPdf,
  exportDisabled,
  columns,
  data,
  emptyMessage,
  getRowKey,
}: TableSectionProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="mb-8 min-w-0 last:mb-0">
      <SectionTableHeader
        title={title}
        description={description}
        onExportPdf={onExportPdf}
        exportDisabled={exportDisabled}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      <DataTable
        columns={columns}
        data={data}
        emptyMessage={emptyMessage}
        getRowKey={getRowKey}
        searchQuery={searchQuery}
      />
    </section>
  )
}
