'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import NavLink from '@/components/atoms/NavLink'
import ChevronIcon from '@/components/atoms/Icons/ChevronIcon'
import SidebarNavGroup from '@/components/molecules/SidebarNavGroup'
import packageInfo from '../../../../package.json'
import { sidebarConfig, type SidebarEntry } from '@/config/sidebar'
import { useSidebar } from '@/context/SidebarContext'
import { useTranslation } from '@/i18n/useTranslation'
import {
  getAsideClass,
  getFooterClass,
  getHeaderRowClass,
  getInnerClass,
  getToggleButtonClass,
  sidebarStyles,
} from './styles'

function getSidebarOptions(pathname: string): SidebarEntry[] | null {
  for (const [routePrefix, items] of Object.entries(sidebarConfig)) {
    if (pathname.startsWith(routePrefix)) {
      return items.filter((item) => item.kind !== 'link' || !item.disabled)
    }
  }
  return null
}

function collectPrefetchPaths(entries: SidebarEntry[]): string[] {
  return entries.flatMap((entry) => {
    if (entry.kind === 'link') return [entry.path]
    return entry.children.map((child) => child.path)
  })
}

const SideBar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { collapsed, toggle } = useSidebar()
  const { dictionary, sectionTitle, sidebarItemLabel } = useTranslation()
  const options = pathname ? getSidebarOptions(pathname) : null

  useEffect(() => {
    if (!options) return
    collectPrefetchPaths(options).forEach((path) => router.prefetch(path))
  }, [options, router])

  if (!pathname || !options) return null

  return (
    <aside
      className={getAsideClass(collapsed)}
      role="complementary"
      aria-label={dictionary.sidebar.ariaLabel}
    >
      <div className={getInnerClass(collapsed)}>
        <div className={getHeaderRowClass(collapsed)}>
          {!collapsed && (
            <h2 className={sidebarStyles.menuTitle}>{dictionary.sidebar.menuTitle}</h2>
          )}
          <button
            type="button"
            onClick={toggle}
            className={getToggleButtonClass()}
            aria-label={
              collapsed
                ? dictionary.sidebar.expandMenu
                : dictionary.sidebar.collapseMenu
            }
          >
            <ChevronIcon direction={collapsed ? 'right' : 'left'} />
          </button>
        </div>

        <nav
          className={sidebarStyles.nav}
          role="navigation"
          aria-label={dictionary.sidebar.navAriaLabel}
        >
          {options.flatMap((option) => {
            if (option.kind === 'link') {
              const IconComponent = option.icon
              return [
                <NavLink
                  key={option.path}
                  name={sectionTitle(option.sectionKey)}
                  href={option.path}
                  icon={<IconComponent />}
                  badge={option.badge}
                  collapsed={collapsed}
                />,
              ]
            }

            if (collapsed) {
              return option.children.map((child) => {
                const ChildIcon = child.icon
                return (
                  <NavLink
                    key={child.path}
                    name={sidebarItemLabel(child.labelKey)}
                    href={child.path}
                    icon={<ChildIcon className="h-4 w-4" />}
                    collapsed
                  />
                )
              })
            }

            return [
              <SidebarNavGroup
                key={option.labelKey}
                name={sidebarItemLabel(option.labelKey)}
                icon={<option.icon className="h-5 w-5" />}
                items={option.children.map((child) => ({
                  name: sidebarItemLabel(child.labelKey),
                  path: child.path,
                  icon: child.icon,
                }))}
              />,
            ]
          })}
        </nav>
      </div>

      <footer className={getFooterClass(collapsed)}>
        {!collapsed && (
          <p className={sidebarStyles.version}>
            {dictionary.sidebar.version} {packageInfo.version}
          </p>
        )}
      </footer>
    </aside>
  )
}

export default SideBar
