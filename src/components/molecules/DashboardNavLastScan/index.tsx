'use client'

import LastScanTag from '@/components/atoms/LastScanTag'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useTranslation } from '@/i18n/useTranslation'
import { formatDateTime } from '@/utils/formatters'

export default function DashboardNavLastScan() {
  const { dictionary } = useTranslation()
  const { latestScannedAt, isAnyFetching } = useDashboardSummary()

  if (isAnyFetching && !latestScannedAt) {
    return (
      <div className="flex items-center">
        <LoadingSpinner size="sm" label={dictionary.dashboardSummary.loading} />
      </div>
    )
  }

  if (!latestScannedAt) return null

  return (
    <LastScanTag
      label={dictionary.pageHeader.lastScan}
      value={formatDateTime(latestScannedAt)}
    />
  )
}
