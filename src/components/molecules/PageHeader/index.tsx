import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  scannedAt?: string
  meta?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({
  title,
  description,
  scannedAt,
  meta,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h1 className="text-2xl font-bold text-gray_900 dark:text-gray_100">
          {title}
        </h1>
        {actions ? (
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            {actions}
          </div>
        ) : null}
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray_700 dark:text-gray_400">
          {description}
        </p>
      )}
      {meta ? (
        <p className="mt-1 text-xs text-gray_700 dark:text-gray_500">{meta}</p>
      ) : null}
      {scannedAt && (
        <p className="mt-1 text-xs text-gray_600 dark:text-gray_500">
          Last scan: {scannedAt}
        </p>
      )}
    </header>
  )
}
