'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getActiveIndicatorClass,
  getBadgeClass,
  getCollapsedBadgeClass,
  getIconClass,
  getNavLinkClass,
  navLinkStyles,
} from './styles'

interface NavLinkProps {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  collapsed?: boolean
}

export default function NavLink({
  href,
  name,
  icon,
  badge,
  collapsed = false,
}: NavLinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const normalizedHref = href.split('?')[0]
  const isActive =
    pathname === normalizedHref || pendingHref === normalizedHref
  const isNavigating = pendingHref === normalizedHref && isPending

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  return (
    <Link
      href={href}
      prefetch={true}
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return
        }

        event.preventDefault()
        setPendingHref(normalizedHref)
        startTransition(() => {
          router.push(href)
        })
      }}
      title={collapsed ? name : undefined}
      className={getNavLinkClass(collapsed, isActive, isNavigating)}
      aria-current={pathname === normalizedHref ? 'page' : undefined}
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
      {isActive && (
        <span className={getActiveIndicatorClass(collapsed)} aria-hidden="true" />
      )}
    </Link>
  )
}
