'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { isNavItemActive } from '@/utils/nav'
import {
  getActiveIndicatorClass,
  getBadgeClass,
  getCollapsedBadgeClass,
  getIconClass,
  getNavLinkClass,
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
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null)

  const isActive =
    isNavItemActive(pathname, normalizedHref) ||
    optimisticHref === normalizedHref

  useEffect(() => {
    if (isNavItemActive(pathname, normalizedHref)) {
      setOptimisticHref(null)
    }
  }, [pathname, normalizedHref])

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
      onPointerDown={() => {
        if (!isNavItemActive(pathname, normalizedHref)) {
          setOptimisticHref(normalizedHref)
        }
      }}
      title={collapsed ? name : undefined}
      className={
        nested
          ? getSubNavLinkClass(isActive, false)
          : getNavLinkClass(collapsed, isActive, false)
      }
      aria-current={isNavItemActive(pathname, normalizedHref) ? 'page' : undefined}
      aria-label={collapsed ? name : undefined}
    >
      {icon && <span className={getIconClass(isActive)}>{icon}</span>}
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
