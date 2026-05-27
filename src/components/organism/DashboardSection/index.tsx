'use client'

import { useTranslation } from '@/i18n/useTranslation'
import DashboardCharts from '@/components/organism/DashboardCharts'
import { dashboardSectionStyles } from '@/components/organism/DashboardCharts/styles'

export default function DashboardSection() {
  const { dictionary } = useTranslation()

  return (
    <div className={dashboardSectionStyles.shell}>
      <h2 className={dashboardSectionStyles.welcome}>
        {dictionary.homeContent.dashboard}
      </h2>
      <DashboardCharts />
    </div>
  )
}
