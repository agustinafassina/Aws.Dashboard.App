'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { isNavItemActive } from '@/utils/nav'
import {
  getActiveIndicatorClass,
  getBadgeClass,
  getCollapsedBadgeClass,
  getIconClass,
  getNavLinkClass,
  getSubIconClass,
  getSubNavLinkClass,
  navLinkStyles,
} from './styles'

interface NavLinkProps {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  collapsed?: boolean
  nested?: boolean
}

export default function NavLink({
  href,
  name,
  icon,
  badge,
  collapsed = false,
  nested = false,
}: NavLinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  const normalizedHref = href.split('?')[0]
  const isActive = isNavItemActive(pathname, normalizedHref)

  const prefetchRoute = () => {
    router.prefetch(href)
  }

  return (
    <Link
      href={href}
      prefetch
      scroll={false}
      onPointerEnter={prefetchRoute}
      onFocus={prefetchRoute}
      title={collapsed ? name : undefined}
      className={
        nested
          ? getSubNavLinkClass(isActive, false)
          : getNavLinkClass(collapsed, isActive, false)
      }
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? name : undefined}
    >
      {icon && (
        <span className={nested ? getSubIconClass(isActive) : getIconClass(isActive)}>
          {icon}
        </span>
      )}
      {!collapsed && <span className={navLinkStyles.label}>{name}</span>}
      {!collapsed && badge !== undefined && (
        <span className={getBadgeClass(isActive)}>{badge}</span>
      )}
      {collapsed && badge !== undefined && (
        <span className={getCollapsedBadgeClass()} aria-hidden="true" />
      )}
      {isActive && !nested && (
        <span className={getActiveIndicatorClass(collapsed)} aria-hidden="true" />
      )}
    </Link>
  )
}
