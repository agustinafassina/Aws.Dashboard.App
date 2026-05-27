import type { Column } from '@/interfaces/common'

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  getRowKey: (row: T, index: number) => string
}

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = 'No data available.',
  getRowKey,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray_700 dark:text-gray_400">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray_200 dark:border-gray_700 bg-white dark:bg-gray_800 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray_200 dark:border-gray_700 bg-gray_100 dark:bg-gray_800/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 font-semibold text-gray_900 dark:text-gray_200 ${col.className ?? ''}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="border-b border-gray_100 dark:border-gray_800 last:border-0 hover:bg-primary_50/70 dark:hover:bg-gray_800/40 transition-colors"
            >
              {columns.map((col) => {
                const value = row[col.key]
                return (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-gray_900 dark:text-gray_200 ${col.className ?? ''}`}
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
