'use client'

import { useTranslation } from '@/i18n/useTranslation'
import DashboardSummary from '@/components/organism/DashboardSummary'
import { dashboardSectionStyles } from '@/components/organism/DashboardSummary/styles'

export default function DashboardSection() {
  const { dictionary } = useTranslation()

  return (
    <div className={dashboardSectionStyles.shell}>
      <h2 className={dashboardSectionStyles.welcome}>
        {dictionary.homeContent.dashboard}
      </h2>
      <DashboardSummary />
    </div>
  )
}
