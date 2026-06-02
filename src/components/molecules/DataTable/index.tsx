'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { Column } from '@/interfaces/common'

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  getRowKey: (row: T, index: number) => string
  searchQuery?: string
}

function getRowSearchText<T extends object>(row: T, columns: Column<T>[]): string {
  return columns
    .map((col) => {
      const value = row[col.key]
      if (value == null) return ''
      return String(value)
    })
    .join(' ')
    .toLowerCase()
}

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = 'No data available.',
  getRowKey,
  searchQuery = '',
}: DataTableProps<T>) {
  const { dictionary } = useTranslation()

  const filteredData = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase()
    if (!trimmed) return data

    return data.filter((row) => getRowSearchText(row, columns).includes(trimmed))
  }, [columns, data, searchQuery])

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray_700 dark:text-gray_400">
        {emptyMessage}
      </p>
    )
  }

  if (filteredData.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray_700 dark:text-gray_400">
        {dictionary.table.noSearchResults}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray_200 dark:border-gray_750 bg-white dark:bg-gray_850 shadow-sm">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-gray_200 dark:border-gray_750 bg-gray_100 dark:bg-gray_800/35">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`whitespace-nowrap px-4 py-3 font-semibold text-gray_900 dark:text-gray_200 ${col.headerClassName ?? col.className ?? ''}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="border-b border-gray_100 dark:border-gray_800 last:border-0 transition-colors hover:bg-brand_50/70 dark:hover:bg-gray_800/30"
            >
              {columns.map((col) => {
                const value = row[col.key]
                return (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-gray_900 dark:text-gray_200 ${col.cellClassName ?? col.className ?? ''}`}
                  >
                    {col.render
                      ? col.render(value, row)
                      : value != null
                        ? String(value)
                        : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
