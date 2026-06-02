'use client'

import { useTranslation } from '@/i18n/useTranslation'
import DashboardSummary from '@/components/organism/DashboardSummary'
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
        <DashboardMetaTags />
      </div>
      <DashboardSummary />
    </div>
  )
}
