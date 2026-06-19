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
import PolicyClockIcon from '@/components/atoms/Icons/PolicyClockIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import TopProjectIcon from '@/components/atoms/Icons/TopProjectIcon'
import SpendIcon from '@/components/atoms/Icons/SpendIcon'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { CardSkeleton, BarChartSkeleton } from '@/components/atoms/Skeleton'
import StatCard from '@/components/molecules/StatCard'
import { dashboardSectionHref, DASHBOARD_SECTION_LINKS } from '@/config/dashboardLinks'
import { useAwsRegion } from '@/context/RegionContext'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { useTranslation } from '@/i18n/useTranslation'
import { formatCurrency } from '@/utils/formatters'
import {
  getInspectorLoadedCount,
  isInspectorResultCapped,
} from '@/utils/inspectorDisplay'
import type {
  SecurityGrade,
  SecuritySeverity,
} from '@/utils/securityPostureScore'
import { dashboardSummaryStyles } from './styles'

const GRADE_STYLES: Record<
  SecurityGrade,
  { ring: string; score: string; badge: string }
> = {
  A: {
    ring: 'border-success_500',
    score: 'text-success_700 dark:text-success_500',
    badge: 'bg-success_100 text-success_700 dark:bg-success_500/20 dark:text-success_500',
  },
  B: {
    ring: 'border-success_500',
    score: 'text-success_700 dark:text-success_500',
    badge: 'bg-success_100 text-success_700 dark:bg-success_500/20 dark:text-success_500',
  },
  C: {
    ring: 'border-warning_700',
    score: 'text-warning_800 dark:text-warning_200',
    badge: 'bg-warning_100 text-warning_800 dark:bg-warning_700/30 dark:text-warning_200',
  },
  D: {
    ring: 'border-warning_700',
    score: 'text-warning_800 dark:text-warning_200',
    badge: 'bg-warning_100 text-warning_800 dark:bg-warning_700/30 dark:text-warning_200',
  },
  F: {
    ring: 'border-red_200',
    score: 'text-red_900 dark:text-red_200',
    badge: 'bg-red_50 text-red_900 dark:bg-red_300/40 dark:text-red_200',
  },
}

const SEVERITY_CHIP_STYLES: Record<SecuritySeverity, string> = {
  critical: 'bg-red_50 text-red_900 dark:bg-red_300/40 dark:text-red_200',
  high: 'bg-warning_100 text-warning_800 dark:bg-warning_700/30 dark:text-warning_200',
  medium: 'bg-warning_50 text-warning_700 dark:bg-warning_700/20 dark:text-warning_200',
  low: 'bg-gray_100 text-gray_700 dark:bg-gray_750 dark:text-gray_300',
}

function SeverityChip({
  label,
  count,
  severity,
}: {
  label: string
  count: number
  severity: SecuritySeverity
}) {
  return (
    <span
      className={`${dashboardSummaryStyles.postureChip} ${
        count > 0
          ? SEVERITY_CHIP_STYLES[severity]
          : 'bg-gray_75 text-gray_500 dark:bg-gray_800 dark:text-gray_500'
      }`}
    >
      <span className="font-semibold">{count}</span>
      {label}
    </span>
  )
}

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
    s3EncryptionQuery,
    lambdaQuery,
    acmQuery,
    ec2UnusedSecurityGroupsQuery,
    ec2UnattachedVolumesQuery,
    securityPosture,
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
    s3UnencryptedBuckets,
    lambdaPublicFunctions,
    acmExpiringCertificates,
    ec2UnusedSecurityGroups,
    ec2UnattachedVolumes,
    isInitialLoading,
    isRegionalFetching,
    isAnyFetching,
  } = useDashboardSummary()

  const costsBusy = isQueryBusy(costsQuery)
  const findingsBusy =
    isQueryBusy(inspectorEcrQuery) || isQueryBusy(inspectorEc2Query)
  const s3EncryptionBusy = isQueryBusy(s3EncryptionQuery)
  const lambdaBusy = isQueryBusy(lambdaQuery)
  const acmBusy = isQueryBusy(acmQuery)
  const ec2UnusedSecurityGroupsBusy = isQueryBusy(ec2UnusedSecurityGroupsQuery)
  const ec2UnattachedVolumesBusy = isQueryBusy(ec2UnattachedVolumesQuery)
  const inspectorCapped =
    isInspectorResultCapped(inspectorEcrQuery.data) ||
    isInspectorResultCapped(inspectorEc2Query.data)
  const inspectorCappedCount = Math.max(
    inspectorEcrQuery.data?.hasMoreFindings
      ? getInspectorLoadedCount(inspectorEcrQuery.data)
      : 0,
    inspectorEc2Query.data?.hasMoreFindings
      ? getInspectorLoadedCount(inspectorEc2Query.data)
      : 0,
  )

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

      {securityPosture && (
        <section
          className={dashboardSummaryStyles.postureCard}
          aria-busy={isAnyFetching}
        >
          <div className="flex items-center gap-4">
            <div
              className={`${dashboardSummaryStyles.postureRing} ${GRADE_STYLES[securityPosture.grade].ring}`}
            >
              <span
                className={`text-xl font-bold leading-none ${GRADE_STYLES[securityPosture.grade].score}`}
              >
                {securityPosture.score}
              </span>
              <span className="text-[0.625rem] font-medium text-gray_500 dark:text-gray_400">
                {d.posture.scoreLabel}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={dashboardSummaryStyles.postureTitle}>
                  {d.posture.title}
                </h3>
                <span
                  className={`${dashboardSummaryStyles.postureGradeBadge} ${GRADE_STYLES[securityPosture.grade].badge}`}
                >
                  {format(d.posture.gradeLabel, {
                    grade: securityPosture.grade,
                  })}
                </span>
              </div>
              <p className={dashboardSummaryStyles.postureSummary}>
                {securityPosture.totalIssues === 0
                  ? format(d.posture.allClear, { region })
                  : format(d.posture.issuesSummary, {
                      total: String(securityPosture.totalIssues),
                      region,
                    })}
              </p>
            </div>
          </div>
          <div className={dashboardSummaryStyles.postureSeverityRow}>
            <SeverityChip
              label={d.posture.critical}
              count={securityPosture.critical}
              severity="critical"
            />
            <SeverityChip
              label={d.posture.high}
              count={securityPosture.high}
              severity="high"
            />
            <SeverityChip
              label={d.posture.medium}
              count={securityPosture.medium}
              severity="medium"
            />
            <SeverityChip
              label={d.posture.low}
              count={securityPosture.low}
              severity="low"
            />
          </div>
        </section>
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
            iconTone={0}
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
            iconTone={1}
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
            iconTone={2}
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
            hint={
              inspectorCapped
                ? format(d.findingsCappedHint, {
                    count: String(inspectorCappedCount),
                  })
                : format(d.findingsHint, { region })
            }
            icon={<ShieldIcon className="h-5 w-5" />}
            iconTone={3}
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
            iconTone={4}
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
            iconTone={5}
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
            iconTone={6}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.s3EncryptionStatus,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={s3EncryptionBusy}
            loadingLabel={d.loading}
            label={d.s3UnencryptedBuckets}
            value={s3UnencryptedBuckets}
            variant={
              !s3EncryptionBusy && s3UnencryptedBuckets > 0 ? 'warning' : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<BucketIcon className="h-5 w-5" />}
            iconTone={0}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.lambdaPublicFunctions,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={lambdaBusy}
            loadingLabel={d.loading}
            label={d.lambdaPublicFunctions}
            value={lambdaPublicFunctions}
            variant={
              !lambdaBusy && lambdaPublicFunctions > 0 ? 'warning' : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<ServerIcon className="h-5 w-5" />}
            iconTone={1}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.acmExpiringCertificates,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={acmBusy}
            loadingLabel={d.loading}
            label={d.acmExpiringCertificates}
            value={acmExpiringCertificates}
            variant={
              !acmBusy && acmExpiringCertificates > 0 ? 'warning' : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<PolicyClockIcon className="h-5 w-5" />}
            iconTone={2}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.ec2UnusedSecurityGroups,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={ec2UnusedSecurityGroupsBusy}
            loadingLabel={d.loading}
            label={d.ec2UnusedSecurityGroups}
            value={ec2UnusedSecurityGroups}
            variant={
              !ec2UnusedSecurityGroupsBusy && ec2UnusedSecurityGroups > 0
                ? 'warning'
                : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<ShieldIcon className="h-5 w-5" />}
            iconTone={3}
          />
        </KpiLink>

        <KpiLink
          href={dashboardSectionHref(
            DASHBOARD_SECTION_LINKS.ec2UnattachedVolumes,
            { region: urlRegion },
          )}
        >
          <StatCard
            equalHeight
            isLoading={ec2UnattachedVolumesBusy}
            loadingLabel={d.loading}
            label={d.ec2UnattachedVolumes}
            value={ec2UnattachedVolumes}
            variant={
              !ec2UnattachedVolumesBusy && ec2UnattachedVolumes > 0
                ? 'warning'
                : 'default'
            }
            hint={format(d.instancesHint, { region })}
            icon={<DatabaseIcon className="h-5 w-5" />}
            iconTone={4}
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
                  fill="#1D4ED8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {(costsBusy || (isRegionalFetching && topProjectsChart.length === 0)) &&
        topProjectsChart.length === 0 && <BarChartSkeleton />}
    </>
  )
}
