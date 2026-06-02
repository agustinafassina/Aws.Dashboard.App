'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { isNavItemActive } from '@/utils/nav'

interface SidebarNavItemProps {
  name: string
  href: string
  icon?: ReactNode
  badge?: string | number
  variant?: 'primary' | 'sub'
}

export default function SidebarNavItem({
  name,
  href,
  icon,
  badge,
  variant = 'primary',
}: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = isNavItemActive(pathname, href)

  if (variant === 'sub') {
    return (
      <Link
        href={href}
        prefetch
        className={clsx(
          'group ml-8 flex items-center gap-2.5 rounded-lg border-l-2 py-2.5 pl-3 pr-3 text-sm transition-all duration-200',
          isActive
            ? [
                'border-brand_500 bg-brand_50 font-semibold text-brand_900',
                'dark:border-brand_400 dark:bg-gray_800 dark:text-gray_100',
              ]
            : [
                'border-gray_200 text-gray_600 hover:border-brand_300 hover:bg-gray_50 hover:text-gray_900',
                'dark:border-gray_700 dark:text-gray_400 dark:hover:border-gray_600 dark:hover:bg-gray_800/80 dark:hover:text-gray_200',
              ],
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon && (
          <span
            className={clsx('flex-shrink-0 transition-colors', {
              'text-brand_600 dark:text-brand_400': isActive,
              'text-gray_400 group-hover:text-brand_500 dark:group-hover:text-gray_300':
                !isActive,
            })}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{name}</span>
        {isActive && (
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand_500 dark:bg-brand_400"
            aria-hidden
          />
        )}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      prefetch
      className={clsx(
        'group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-all duration-200',
        isActive
          ? [
              'bg-gradient-to-r from-brand_600 to-brand_500 font-semibold text-white shadow-md shadow-brand_600/20',
              'dark:bg-gray_800 dark:from-gray_800 dark:to-gray_800 dark:text-gray_100 dark:shadow-none dark:ring-1 dark:ring-brand_500/40',
            ]
          : [
              'text-gray_700 hover:bg-gray_100',
              'dark:text-gray_300 dark:hover:bg-gray_800/90',
            ],
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && (
        <span
          className={clsx(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
            isActive
              ? [
                  'bg-white/20 text-white',
                  'dark:bg-brand_600/25 dark:text-brand_300',
                ]
              : [
                  'bg-gray_100 text-gray_600 group-hover:bg-brand_50 group-hover:text-brand_600',
                  'dark:bg-gray_800 dark:text-gray_400 dark:group-hover:bg-gray_750 dark:group-hover:text-gray_200',
                ],
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{name}</span>
      {badge !== undefined && (
        <span
          className={clsx(
            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
            isActive
              ? 'bg-white/25 text-white dark:bg-brand_600/30 dark:text-brand_200'
              : 'bg-gray_200 text-gray_700 dark:bg-gray_750 dark:text-gray_300',
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
