import type { Metadata } from 'next'
import React from 'react'
import { SidebarProvider } from '@/context/SidebarContext'
import SideBar from '@/components/organism/Sidebar'
import { appConfig } from '@/config/app'
import { getDictionary } from '@/i18n/getDictionary'
import { getServerLocale } from '@/utils/locale'
import { homeLayoutStyles } from './styles'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const sections = getDictionary(locale).sections

  return {
    title: sections.dashboard,
    description: appConfig.description,
  }
}

const DirectoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className={homeLayoutStyles.wrapper}>
        <div className={homeLayoutStyles.row}>
          <SideBar />
          <main className={homeLayoutStyles.main}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DirectoryLayout
