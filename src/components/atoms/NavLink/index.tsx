'use client'

import clsx from 'clsx'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavLinkProps {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
}

export default function NavLink({ href, name, icon, badge }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href.split('?')[0]

  return (
    <Link
      href={href}
      className={clsx(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'text-sm font-medium transition-all duration-200',
        'hover:bg-green_50/60 dark:hover:bg-gray_800/60',
        'dark:text-gray_300',
        {
          'bg-green_100 dark:bg-gray_800 text-green_700 dark:text-green_300 shadow-sm': isActive,
          'text-gray_700 dark:text-gray_400': !isActive,
        },
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && (
        <span className={clsx('flex-shrink-0 transition-colors', {
          'text-green_600 dark:text-green_400': isActive,
          'text-gray_500 dark:text-gray-500': !isActive,
        })}>
          {icon}
        </span>
      )}
      <span className="flex-1">{name}</span>
      {badge !== undefined && (
        <span className={clsx(
          'flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold',
          {
            'bg-green_200 dark:bg-green-900/30 text-green_700 dark:text-green-300': isActive,
            'bg-gray_200 dark:bg-gray-700 text-gray_600 dark:text-gray-400': !isActive,
          }
        )}>
          {badge}
        </span>
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green_500 dark:bg-green-400 rounded-r-full" aria-hidden="true" />
      )}
    </Link>
  )
}