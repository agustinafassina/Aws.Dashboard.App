'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import NavLink from '@/components/atoms/NavLink'
import ChevronIcon from '@/components/atoms/Icons/ChevronIcon'
import packageInfo from '../../../../package.json'
import { sidebarConfig } from '@/config/sidebar'
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

const getSidebarOptions = (pathname: string) => {
  for (const [routePrefix, items] of Object.entries(sidebarConfig)) {
    if (pathname.startsWith(routePrefix)) {
      return items.filter((item) => !item.disabled)
    }
  }
  return null
}

const SideBar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { collapsed, toggle } = useSidebar()
  const { dictionary, sectionTitle } = useTranslation()
  const options = pathname ? getSidebarOptions(pathname) : null

  useEffect(() => {
    options?.forEach((item) => router.prefetch(item.path))
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
          {options.map((option) => {
            const IconComponent = option.icon
            return (
              <NavLink
                key={option.path}
                name={sectionTitle(option.sectionKey)}
                href={option.path}
                icon={<IconComponent />}
                badge={option.badge}
                collapsed={collapsed}
              />
            )
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
