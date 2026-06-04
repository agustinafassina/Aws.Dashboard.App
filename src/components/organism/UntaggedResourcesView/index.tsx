'use client'

import { useCallback, useMemo } from 'react'
import ProjectsIcon from '@/components/atoms/Icons/ProjectsIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useAwsRegion } from '@/context/RegionContext'
import { useUntaggedResources } from '@/hooks/useUntaggedResources'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useTranslation } from '@/i18n/useTranslation'
import type { Column } from '@/interfaces/common'
import type { UntaggedResource } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function UntaggedResourcesView() {
  const { dictionary } = useTranslation()
  const t = dictionary.audits.untaggedResources
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isFetching, isError, error, refetch } =
    useUntaggedResources(region)
  const isBusy = isLoading || isFetching

  const sortedResources = useMemo(
    () =>
      [...(data?.resources ?? [])].sort((a, b) => {
        const byType = a.resourceType.localeCompare(b.resourceType)
        if (byType !== 0) return byType
        return a.resourceId.localeCompare(b.resourceId)
      }),
    [data?.resources],
  )

  const columns: Column<UntaggedResource>[] = useMemo(
    () => [
      {
        key: 'resourceType',
        label: t.columns.type,
        cellClassName: 'whitespace-nowrap text-xs font-medium',
      },
      {
        key: 'resourceId',
        label: t.columns.id,
        cellClassName: 'whitespace-nowrap font-mono text-xs',
      },
      {
        key: 'name',
        label: t.columns.name,
        cellClassName: 'max-w-[12rem] truncate whitespace-nowrap text-xs',
        render: (value) => (value ? String(value) : '—'),
      },
      {
        key: 'state',
        label: t.columns.state,
        cellClassName: 'whitespace-nowrap text-xs',
        render: (value) => (value ? String(value) : '—'),
      },
      {
        key: 'recommendation',
        label: t.columns.recommendation,
        cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
      },
    ],
    [t.columns],
  )

  const handleExportPdf = useCallback(() => {
    if (!data?.resources.length) return

    exportTableToPdf({
      filename: `untagged-resources-${data.region}`,
      title: t.title,
      subtitle: `${t.requiredTagLabel}: ${data.requiredTagKey} · ${t.regionLabel}: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.untaggedResourcesCount} of ${data.totalResourcesScanned} resource(s) in this region are missing the required tag "${data.requiredTagKey}".`,
        ],
      }),
      columns: [
        { header: t.columns.type, value: (row) => row.resourceType },
        { header: t.columns.id, value: (row) => row.resourceId },
        { header: t.columns.name, value: (row) => row.name ?? '—' },
        { header: t.columns.state, value: (row) => row.state ?? '—' },
        { header: t.columns.recommendation, value: (row) => row.recommendation },
      ],
      rows: sortedResources,
    })
  }, [buildReport, data, sortedResources, t])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={t.title}
        description={
          <>
            <p>{t.description}</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {t.services.map((service) => (
                <li key={service.name} className="flex gap-1.5 text-xs">
                  <span className="font-semibold text-brand_700 dark:text-brand_300">
                    {service.name}
                  </span>
                  <span className="text-gray_600 dark:text-gray_500">
                    {service.detail}
                  </span>
                </li>
              ))}
            </ul>
          </>
        }
        meta={
          data ? (
            <>
              {t.requiredTagLabel}:{' '}
              <span className="font-mono">{data.requiredTagKey}</span>
            </>
          ) : undefined
        }
      />

      {isBusy && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { detail?: string; message?: string; error?: string } } })
              ?.response?.data?.detail ??
            (error as { response?: { data?: { message?: string; error?: string } } })
              ?.response?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response?.data
              ?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              isLoading={isBusy}
              loadingLabel={dictionary.dashboardSummary.loading}
              label={t.stats.scanned}
              value={data.totalResourcesScanned}
              icon={<ServerIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              isLoading={isBusy}
              loadingLabel={dictionary.dashboardSummary.loading}
              label={t.stats.untagged}
              value={data.untaggedResourcesCount}
              variant={
                !isBusy && data.untaggedResourcesCount > 0 ? 'warning' : 'default'
              }
              hint={t.stats.untaggedHint}
              icon={<ProjectsIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              isLoading={isBusy}
              loadingLabel={dictionary.dashboardSummary.loading}
              label={t.stats.region}
              value={data.region}
            />
          </div>

          <TableSection
            title={t.tableTitle}
            onExportPdf={handleExportPdf}
            exportDisabled={sortedResources.length === 0}
            columns={columns}
            data={sortedResources}
            emptyMessage={t.emptyMessage}
            getRowKey={(row) => `${row.resourceType}-${row.resourceId}`}
          />
        </>
      )}
    </div>
  )
}
