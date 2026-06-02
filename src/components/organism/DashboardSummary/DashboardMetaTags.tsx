'use client'

import MetaTag from '@/components/atoms/MetaTag'
import { useAwsRegion } from '@/context/RegionContext'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { useTranslation } from '@/i18n/useTranslation'
import { formatDate } from '@/utils/formatters'
import { dashboardSummaryStyles } from './styles'

export default function DashboardMetaTags() {
  const { dictionary } = useTranslation()
  const d = dictionary.dashboardSummary
  const { region } = useAwsRegion()
  const { appliedRange } = useCostDateRange()

  const costRangeValue = `${formatDate(appliedRange.startDate)} → ${formatDate(appliedRange.endDate)}`

  return (
    <div className={dashboardSummaryStyles.metaTags}>
      <MetaTag
        label={d.regionTagLabel}
        value={region}
        valueClassName="font-mono"
      />
      <MetaTag label={d.costTagLabel} value={costRangeValue} />
    </div>
  )
}
