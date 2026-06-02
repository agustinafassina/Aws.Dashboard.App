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
import { CardSkeleton, BarChartSkeleton } from '@/components/atoms/Skeleton'
import StatCard from '@/components/molecules/StatCard'
import {
  DASHBOARD_SCAN_LINKS,
  DASHBOARD_SECTION_LINKS,
} from '@/config/dashboardLinks'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import type { DashboardScanModuleKey } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
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

function displayValue(
  loading: boolean,
  value: string | number,
  loadingLabel: string,
): string | number {
  if (loading) return loadingLabel
  return value
}

export default function DashboardSummary() {
  const { dictionary, format } = useTranslation()
  const d = dictionary.dashboardSummary
  const {
    region,
    costRange,
    costsQuery,
    iamQuery,
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
  } = useDashboardSummary()

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
      <p className={dashboardSummaryStyles.regionHint}>
        {format(d.regionHint, { region })}
        {' · '}
        {format(d.costRangeHint, {
          from: formatDate(costRange.startDate),
          to: formatDate(costRange.endDate),
        })}
      </p>

      <div className={dashboardSummaryStyles.kpiGrid}>
        <KpiLink href={DASHBOARD_SECTION_LINKS.costs}>
          <StatCard
            equalHeight
            label={d.monthSpend}
            value={displayValue(
              costsQuery.isLoading,
              monthSpendFormatted ?? d.noData,
              d.loading,
            )}
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

        <KpiLink href={DASHBOARD_SECTION_LINKS.costs}>
          <StatCard
            equalHeight
            label={d.topProject}
            value={displayValue(
              costsQuery.isLoading,
              topProject?.project ?? d.noData,
              d.loading,
            )}
            hint={
              costsQuery.isError
                ? d.loadError
                : topProjectHint
            }
            icon={<TopProjectIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={DASHBOARD_SECTION_LINKS.iam}>
          <StatCard
            equalHeight
            label={d.keysRotation}
            value={displayValue(
              iamQuery.isLoading,
              keysNeedingRotation,
              d.loading,
            )}
            variant={keysNeedingRotation > 0 ? 'warning' : 'default'}
            hint={iamQuery.isError ? d.loadError : undefined}
            icon={<AccessKeyIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={DASHBOARD_SECTION_LINKS.criticalFindings}>
          <StatCard
            equalHeight
            label={d.criticalHighFindings}
            value={displayValue(
              inspectorEcrQuery.isLoading || inspectorEc2Query.isLoading,
              criticalHighFindings,
              d.loading,
            )}
            variant={criticalHighFindings > 0 ? 'warning' : 'default'}
            hint={format(d.findingsHint, { region })}
            icon={<ShieldIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={DASHBOARD_SECTION_LINKS.rdsPublicPorts}>
          <StatCard
            equalHeight
            label={d.rdsPublicPorts}
            value={displayValue(
              rdsPortsQuery.isLoading,
              rdsPublicPorts,
              d.loading,
            )}
            variant={rdsPublicPorts > 0 ? 'warning' : 'default'}
            hint={format(d.instancesHint, { region })}
            icon={<DatabaseIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={DASHBOARD_SECTION_LINKS.ec2PublicPorts}>
          <StatCard
            equalHeight
            label={d.ec2PublicPorts}
            value={displayValue(
              ec2PortsQuery.isLoading,
              ec2PublicPorts,
              d.loading,
            )}
            variant={ec2PublicPorts > 0 ? 'warning' : 'default'}
            hint={format(d.instancesHint, { region })}
            icon={<ServerIcon className="h-5 w-5" />}
          />
        </KpiLink>

        <KpiLink href={DASHBOARD_SECTION_LINKS.s3PublicBuckets}>
          <StatCard
            equalHeight
            label={d.s3PublicBuckets}
            value={displayValue(
              s3Query.isLoading,
              s3PublicBuckets,
              d.loading,
            )}
            variant={s3PublicBuckets > 0 ? 'warning' : 'default'}
            hint={format(d.instancesHint, { region })}
            icon={<BucketIcon className="h-5 w-5" />}
          />
        </KpiLink>
      </div>

      {topProjectsChart.length > 0 && costCurrency && (
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
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {costsQuery.isLoading && topProjectsChart.length === 0 && (
        <BarChartSkeleton />
      )}

      <section className={dashboardSummaryStyles.scanSection}>
        <h3 className={dashboardSummaryStyles.scanTitle}>{d.lastScanTitle}</h3>
        <table className={dashboardSummaryStyles.scanTable}>
          <thead>
            <tr className={dashboardSummaryStyles.scanRow}>
              <th className={`${dashboardSummaryStyles.scanCellMuted} text-left font-semibold`}>
                {d.lastScanModule}
              </th>
              <th className={`${dashboardSummaryStyles.scanCellMuted} text-left font-semibold`}>
                {d.lastScanAt}
              </th>
              <th className={`${dashboardSummaryStyles.scanCellMuted} text-right font-semibold`}>
                {d.viewSection}
              </th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.key} className={dashboardSummaryStyles.scanRow}>
                <td className={dashboardSummaryStyles.scanCell}>
                  {moduleLabel(scan.key)}
                </td>
                <td className={dashboardSummaryStyles.scanCellMuted}>
                  {scan.isLoading
                    ? d.loading
                    : scan.isError
                      ? d.loadError
                      : scan.scannedAt
                        ? formatDateTime(scan.scannedAt)
                        : d.noScan}
                </td>
                <td className={`${dashboardSummaryStyles.scanCell} text-right`}>
                  <Link
                    href={DASHBOARD_SCAN_LINKS[scan.key]}
                    className={dashboardSummaryStyles.scanLink}
                  >
                    {d.viewSection}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
