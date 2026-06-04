'use client'

import { useCallback, useMemo, useState } from 'react'
import Button from '@/components/atoms/Button'
import ProjectsIcon from '@/components/atoms/Icons/ProjectsIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useAwsRegion } from '@/context/RegionContext'
import { useResourcesByProjectTag } from '@/hooks/useResourcesByProjectTag'
import { usePdfReport } from '@/hooks/usePdfReport'
import { useTranslation } from '@/i18n/useTranslation'
import type { Column } from '@/interfaces/common'
import type { TaggedResource } from '@/interfaces/aws-api'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { exportTableToPdf } from '@/utils/exportPdf'

export default function ResourcesByProjectTagView() {
  const { dictionary } = useTranslation()
  const t = dictionary.audits.resourcesByProject
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const [projectTagValue, setProjectTagValue] = useState('')
  const [appliedProjectTagValue, setAppliedProjectTagValue] = useState('')

  const { data, isLoading, isFetching, isError, error, refetch } =
    useResourcesByProjectTag(region, appliedProjectTagValue)
  const isBusy = (isLoading || isFetching) && Boolean(appliedProjectTagValue)

  const sortedResources = useMemo(
    () =>
      [...(data?.resources ?? [])].sort((a, b) => {
        const byType = a.resourceType.localeCompare(b.resourceType)
        if (byType !== 0) return byType
        return a.resourceId.localeCompare(b.resourceId)
      }),
    [data?.resources],
  )

  const columns: Column<TaggedResource>[] = useMemo(
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
        key: 'projectTagValue',
        label: t.columns.projectTag,
        cellClassName: 'whitespace-nowrap text-xs font-medium',
      },
      {
        key: 'state',
        label: t.columns.state,
        cellClassName: 'whitespace-nowrap text-xs',
        render: (value) => (value ? String(value) : '—'),
      },
    ],
    [t.columns],
  )

  const inputClass =
    'h-8 min-w-[8.75rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_600 dark:bg-gray_800 dark:text-gray_100'

  const handleScan = () => {
    if (!projectTagValue.trim()) return
    setAppliedProjectTagValue(projectTagValue.trim())
  }

  const handleExportPdf = useCallback(() => {
    if (!data?.resources.length) return

    exportTableToPdf({
      filename: `resources-by-project-${data.projectTagValue}-${data.region}`,
      title: t.title,
      subtitle: `${data.projectTagKey}: ${data.projectTagValue} · ${t.regionLabel}: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.matchingResourcesCount} of ${data.totalResourcesScanned} resource(s) in this region match ${data.projectTagKey}="${data.projectTagValue}".`,
        ],
      }),
      columns: [
        { header: t.columns.type, value: (row) => row.resourceType },
        { header: t.columns.id, value: (row) => row.resourceId },
        { header: t.columns.name, value: (row) => row.name ?? '—' },
        { header: t.columns.projectTag, value: (row) => row.projectTagValue },
        { header: t.columns.state, value: (row) => row.state ?? '—' },
      ],
      rows: sortedResources,
    })
  }, [buildReport, data, sortedResources, t])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={t.title}
        description={t.description}
        meta={
          data ? (
            <>
              {t.tagKeyLabel}:{' '}
              <span className="font-mono">{data.projectTagKey}</span>
            </>
          ) : undefined
        }
        actions={
          <div className="inline-flex flex-nowrap items-center gap-2">
            <label className="flex items-center gap-1.5">
              <span className="text-xs text-gray_600 dark:text-gray_400">
                {t.projectInputLabel}
              </span>
              <input
                type="text"
                value={projectTagValue}
                onChange={(e) => setProjectTagValue(e.target.value)}
                placeholder={t.projectInputPlaceholder}
                className={inputClass}
              />
            </label>
            <Button
              className="h-8 min-w-0 bg-brand_600 px-3 text-xs text-white transition-colors hover:bg-brand_700 disabled:opacity-50"
              disabled={!projectTagValue.trim() || isFetching}
              onClick={handleScan}
            >
              {isFetching ? '…' : t.scanButton}
            </Button>
          </div>
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
              label={t.stats.matching}
              value={data.matchingResourcesCount}
              variant={!isBusy && data.matchingResourcesCount > 0 ? 'success' : 'default'}
              hint={t.stats.matchingHint}
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
