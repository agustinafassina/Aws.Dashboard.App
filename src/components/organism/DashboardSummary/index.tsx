'use client'

import Link from 'next/link'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AccessKeyIcon from '@/components/atoms/Icons/AccessKeyIcon'
import BucketIcon from '@/components/atoms/Icons/BucketIcon'
import DatabaseIcon from '@/components/atoms/Icons/DatabaseIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import TopProjectIcon from '@/components/atoms/Icons/TopProjectIcon'
import SpendIcon from '@/components/atoms/Icons/SpendIcon'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { CardSkeleton, BarChartSkeleton } from '@/components/atoms/Skeleton'
import StatCard from '@/components/molecules/StatCard'
import {
  dashboardScanHref,
  dashboardSectionHref,
  DASHBOARD_SECTION_LINKS,
} from '@/config/dashboardLinks'
import { useAwsRegion } from '@/context/RegionContext'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import type { DashboardScanModuleKey } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { dashboardSummaryStyles } from './styles'

function KpiLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={dashboardSummaryStyles.kpiLink}>
      <span className="block h-full">{children}</span>
    </Link>
  )
}

function isQueryBusy(query: { isLoading: boolean; isFetching: boolean }) {
  return query.isLoading || query.isFetching
}

export default function DashboardSummary() {
  const { dictionary, format } = useTranslation()
  const d = dictionary.dashboardSummary
  const { region: urlRegion } = useAwsRegion()
  const { appliedRange } = useCostDateRange()
  const urlParams = {
    region: urlRegion,
    from: appliedRange.startDate,
    to: appliedRange.endDate,
  }
  const {
    region,
    costsQuery,
    iamKeysQuery,
    inspectorEcrQuery,
    inspectorEc2Query,
    ec2PortsQuery,
    rdsPortsQuery,
    s3Query,
    monthSpendFormatted,
    topProject,
    topProjectHint,
    topProjectsChart,
    costCurrency,
    keysNeedingRotation,
    criticalHighFindings,
    rdsPublicPorts,
    ec2PublicPorts,
    s3PublicBuckets,
    scans,
    isInitialLoading,
    isRegionalFetching,
    isAnyFetching,
  } = useDashboardSummary()

  const costsBusy = isQueryBusy(costsQuery)
  const findingsBusy =
    isQueryBusy(inspectorEcrQuery) || isQueryBusy(inspectorEc2Query)

  const moduleLabel = (key: DashboardScanModuleKey) => d.modules[key]

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className={dashboardSummaryStyles.kpiGrid}>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className={dashboardSummaryStyles.kpiSkeleton}>
              <CardSkeleton />
            </div>
          ))}
        </div>
        <BarChartSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <>
      {isRegionalFetching && (
        <div
          className={dashboardSummaryStyles.refreshingBanner}
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner size="sm" label={d.refreshingData} />
          <span>{d.refreshingData}</span>
        </div>
      )}

      <div
        className={dashboardSummaryStyles.kpiGrid}
        aria-busy={isAnyFetching}
      >
        <KpiLink href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.costs, urlParams)}>
          <StatCard
            equalHeight
            isLoading={costsBusy}
            loadingLabel={d.loading}
            label={d.monthSpend}
            value={monthSpendFormatted ?? d.noData}
            hint={
              costsQuery.isError
                ? d.loadError
                : topProject
                  ? undefined
                  : d.noSpendInRange
            }
            icon={<SpendIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.costs, urlParams)}>
          <StatCard
            equalHeight
            isLoading={costsBusy}
            loadingLabel={d.loading}
            label={d.topProject}
            value={topProject?.project ?? d.noData}
            hint={
              costsQuery.isError
                ? d.loadError
                : topProjectHint
            }
            icon={<TopProjectIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.keysRotation, {
            region: urlRegion,
          })}
        >
          <StatCard
            equalHeight
            isLoading={isQueryBusy(iamKeysQuery)}
            loadingLabel={d.loading}
            label={d.keysRotation}
            value={keysNeedingRotation}
            variant={
              !isQueryBusy(iamKeysQuery) && keysNeedingRotation > 0
                ? 'warning'
                : 'default'
            }
            hint={iamKeysQuery.isError ? d.loadError : undefined}
            icon={<AccessKeyIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.criticalFindings, {
            region: urlRegion,
            severity: 'CRITICAL,HIGH',
          })}
        >
          <StatCard
            equalHeight
            isLoading={findingsBusy}
            loadingLabel={d.loading}
            label={d.criticalHighFindings}
            value={criticalHighFindings}
            variant={
              !findingsBusy && criticalHighFindings > 0 ? 'warning' : 'default'
            }
            hint={format(d.findingsHint, { region })}
            icon={<ShieldIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.rdsPublicPorts, {
            region: urlRegion,
          })}
        >
          <StatCard
            equalHeight
            isLoading={isQueryBusy(rdsPortsQuery)}
            loadingLabel={d.loading}
            label={d.rdsPublicPorts}
            value={rdsPublicPorts}
            variant={
              !isQueryBusy(rdsPortsQuery) && rdsPublicPorts > 0
                ? 'warning'
                : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<DatabaseIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(DASHBOARD_SECTION_LINKS.ec2PublicPorts, {
            region: urlRegion,
          })}
        >
          <StatCard
            equalHeight
            isLoading={isQueryBusy(ec2PortsQuery)}
            loadingLabel={d.loading}
            label={d.ec2PublicPorts}
            value={ec2PublicPorts}
            variant={
              !isQueryBusy(ec2PortsQuery) && ec2PublicPorts > 0
                ? 'warning'
                : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<ServerIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.s3PublicBuckets,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={isQueryBusy(s3Query)}
            loadingLabel={d.loading}
            label={d.s3PublicBuckets}
            value={s3PublicBuckets}
            variant={
              !isQueryBusy(s3Query) && s3PublicBuckets > 0 ? 'warning' : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<BucketIcon className="h-5 w-5" />}
          />
        </KpiLink>
      </div>

      {topProjectsChart.length > 0 && costCurrency && !costsBusy && (
        <section className={dashboardSummaryStyles.chartSection}>
          <h3 className={dashboardSummaryStyles.chartTitle}>
            {d.topProjectsChart}
          </h3>
          <div className={dashboardSummaryStyles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProjectsChart}
                margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray_300 dark:stroke-gray_700"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-gray_600 dark:text-gray_400"
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-gray_600 dark:text-gray_400"
                />
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value, costCurrency)
                  }
                />
                <Bar
                  dataKey="amount"
                  fill="#5F346F"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {(costsBusy || (isRegionalFetching && topProjectsChart.length === 0)) &&
        topProjectsChart.length === 0 && <BarChartSkeleton />}

      <section className={dashboardSummaryStyles.scanSection}>
        <h3 className={dashboardSummaryStyles.scanTitle}>{d.lastScanTitle}</h3>
        <table className={dashboardSummaryStyles.scanTable}>
          <thead>
            <tr className={dashboardSummaryStyles.scanRow}>
              <th
                className={`${dashboardSummaryStyles.scanCellMuted} text-left font-semibold`}
              >
                {d.lastScanModule}
              </th>
              <th
                className={`${dashboardSummaryStyles.scanCellMuted} text-right font-semibold`}
              >
                {d.lastScanAt}
              </th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.key} className={dashboardSummaryStyles.scanRow}>
                <td className={dashboardSummaryStyles.scanCell}>
                  {moduleLabel(scan.key)}
                </td>
                <td className={`${dashboardSummaryStyles.scanCell} text-right`}>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {scan.isLoading ? (
                      <LoadingSpinner size="sm" label={d.loading} />
                    ) : scan.isError ? (
                      <span className="text-xs text-red_900 dark:text-red_200">
                        {d.loadError}
                      </span>
                    ) : scan.scannedAt ? (
                      <span className="text-xs font-mono text-gray_800 dark:text-gray_200">
                        {formatDateTime(scan.scannedAt)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray_600 dark:text-gray_400">
                        {d.noScan}
                      </span>
                    )}
                    <Link
                      href={dashboardScanHref(scan.key, {
                        region: urlRegion,
                        ...(scan.key === 'costs'
                          ? {
                              from: appliedRange.startDate,
                              to: appliedRange.endDate,
                            }
                          : scan.key === 'inspectorEcr' ||
                              scan.key === 'inspectorEc2'
                            ? { severity: 'CRITICAL,HIGH' }
                            : {}),
                      })}
                      className={dashboardSummaryStyles.scanLink}
                    >
                      {d.viewSection}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
