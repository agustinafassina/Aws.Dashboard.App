'use client'

import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({
  title,
  description,
  meta,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray_900 dark:text-gray_100">
            {title}
          </h1>
          {description ? (
            <div className="mt-1 text-sm text-gray_700 dark:text-gray_400">
              {description}
            </div>
          ) : null}
          {meta ? (
            <p className="mt-1 text-xs text-gray_700 dark:text-gray_500">{meta}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}
