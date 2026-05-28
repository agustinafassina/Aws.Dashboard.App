'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import NavLink from '@/components/atoms/NavLink'
import {
  getIconClass,
  getNavLinkClass,
  navLinkStyles,
} from '@/components/atoms/NavLink/styles'
import { isNavGroupActive } from '@/utils/nav'
import type { ComponentType } from 'react'

export interface SidebarNavGroupChild {
  name: string
  path: string
  icon?: ComponentType<{ width?: number; height?: number; className?: string }>
}

interface SidebarNavGroupProps {
  name: string
  icon: React.ReactNode
  items: SidebarNavGroupChild[]
}

export default function SidebarNavGroup({
  name,
  icon,
  items,
}: SidebarNavGroupProps) {
  const pathname = usePathname()
  const childPaths = items.map((c) => c.path)
  const hasActiveChild = isNavGroupActive(pathname, childPaths)
  const [expanded, setExpanded] = useState(hasActiveChild)

  useEffect(() => {
    if (hasActiveChild) setExpanded(true)
  }, [hasActiveChild])

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className={clsx(
          getNavLinkClass(false, hasActiveChild, false),
          'w-full font-medium',
        )}
        aria-expanded={expanded}
      >
        <span className={getIconClass(hasActiveChild)}>{icon}</span>
        <span className={clsx(navLinkStyles.label, 'text-left')}>{name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={clsx(
            'h-4 w-4 flex-shrink-0 transition-transform duration-200',
            expanded && 'rotate-180',
            hasActiveChild ? 'text-brand_500 dark:text-brand_300' : 'text-gray_500',
          )}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={clsx(
          'flex w-full min-w-0 flex-col gap-0.5 overflow-hidden transition-all duration-200',
          expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {items.map((child) => {
          const ChildIcon = child.icon
          return (
            <NavLink
              key={child.path}
              name={child.name}
              href={child.path}
              icon={
                ChildIcon ? (
                  <ChildIcon className="h-4 w-4" />
                ) : undefined
              }
              nested
            />
          )
        })}
      </div>
    </div>
  )
}
