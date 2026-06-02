'use client'

import { useTranslation } from '@/i18n/useTranslation'
import DashboardSummary from '@/components/organism/DashboardSummary'
import DashboardExportActions from '@/components/molecules/DashboardExportActions'
import DashboardMetaTags from '@/components/organism/DashboardSummary/DashboardMetaTags'
import { dashboardSectionStyles } from '@/components/organism/DashboardSummary/styles'

export default function DashboardSection() {
  const { dictionary } = useTranslation()

  return (
    <div className={dashboardSectionStyles.shell}>
      <div className={dashboardSectionStyles.header}>
        <h2 className={dashboardSectionStyles.welcome}>
          {dictionary.homeContent.dashboard}
        </h2>
        <div className={dashboardSectionStyles.headerRight}>
          <DashboardExportActions />
          <DashboardMetaTags />
        </div>
      </div>
      <DashboardSummary />
    </div>
  )
}
