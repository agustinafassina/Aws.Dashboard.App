'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import NavLink from '@/components/atoms/NavLink'
import packageInfo from '../../../../package.json'
import { sidebarConfig } from '@/config/sidebar'

const SideBar: React.FC = () => {
  const pathname = usePathname()

  if (!pathname) return null

  const getSidebarOptions = () => {
    // Find the configuration that matches the current route
    for (const [routePrefix, items] of Object.entries(sidebarConfig)) {
      if (pathname.startsWith(routePrefix)) {
        return items.filter(item => !item.disabled) // Filter disabled items
      }
    }
    return null
  }

  const options = getSidebarOptions()
  if (!options) return null

  return (
    <aside 
      className="flex flex-col w-[15%] flex-shrink-0 justify-between bg-white dark:bg-gray_900 border-r-[0.06rem] border-r-black/10 dark:border-r-gray_700 min-w-[15.625rem] transition-colors shadow-sm"
      role="complementary"
      aria-label="Navigation sidebar"
    >
      <div className="flex flex-col pt-6 px-4">
        <div className="mb-6 px-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray_600 dark:text-gray_400 mb-4">
            Menu
          </h2>
        </div>
        <nav className="flex flex-col gap-1.5" role="navigation" aria-label="Main navigation">
          {options.map((option) => {
            const IconComponent = option.icon
            return (
              <NavLink
                key={option.path}
                name={option.name}
                href={option.path}
                icon={<IconComponent />}
                badge={option.badge}
              />
            )
          })}
        </nav>
      </div>
      
      <footer className="flex flex-col items-center justify-center py-4 border-t border-gray_200 dark:border-gray_700 px-4">
        <p className="text-center text-xs text-gray_500 dark:text-gray_400 font-medium">
          Version {packageInfo.version}
        </p>
      </footer>
    </aside>
  )
}

export default SideBar