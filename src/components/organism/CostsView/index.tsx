'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Button from '@/components/atoms/Button'
import ProjectsIcon from '@/components/atoms/Icons/ProjectsIcon'
import SpendIcon from '@/components/atoms/Icons/SpendIcon'
import TopProjectIcon from '@/components/atoms/Icons/TopProjectIcon'
import { BarChartSkeleton, CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import TableSection from '@/components/molecules/TableSection'
import StatCard from '@/components/molecules/StatCard'
import { useCostByProject } from '@/hooks/useCostByProject'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { Column } from '@/interfaces/common'
import type { ProjectCost } from '@/interfaces/aws-api'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { exportTableToPdf } from '@/utils/exportPdf'

const projectColumns: Column<ProjectCost>[] = [
  { key: 'project', label: 'Project' },
  {
    key: 'amount',
    label: 'Amount',
    render: (value, row) => formatCurrency(Number(value), row.currency),
  },
  { key: 'currency', label: 'Currency' },
]

export default function CostsView() {
  const { buildReport } = usePdfReport()
  const { appliedRange, setAppliedRange } = useCostDateRange()
  const [startDate, setStartDate] = useState(appliedRange.startDate)
  const [endDate, setEndDate] = useState(appliedRange.endDate)

  const { data, isLoading, isFetching, error, refetch, isError } =
    useCostByProject(appliedRange.startDate, appliedRange.endDate)

  const chartData = useMemo(
    () =>
      (data?.projects ?? []).map((p) => ({
        name: p.project,
        amount: p.amount,
      })),
    [data?.projects],
  )

  const topProjectStat = useMemo(() => {
    const projects = data?.projects ?? []
    if (projects.length === 0) {
      return { label: 'Top project', value: '—', hint: 'No spend in the selected range' }
    }

    const top = projects.reduce((max, p) => (p.amount > max.amount ? p : max), projects[0])
    const total = data?.totalAmount ?? 0
    const sharePct =
      total > 0 ? ((top.amount / total) * 100).toFixed(1) : '0.0'

    return {
      label: 'Top project',
      value: top.project,
      hint: `${formatCurrency(top.amount, top.currency)} · ${sharePct}% of total`,
    }
  }, [data?.projects, data?.totalAmount])

  const handleApply = () => {
    if (startDate && endDate && startDate <= endDate) {
      setAppliedRange({ startDate, endDate })
    }
  }

  useEffect(() => {
    setStartDate(appliedRange.startDate)
    setEndDate(appliedRange.endDate)
  }, [appliedRange.startDate, appliedRange.endDate])

  const dateRangeInvalid = Boolean(startDate && endDate && startDate > endDate)

  const handleExportPdf = useCallback(() => {
    if (!data?.projects.length) return

    exportTableToPdf({
      filename: `costs-by-project-${data.startDate}-${data.endDate}`,
      title: 'Costs by project',
      subtitle: `Tag key: ${data.projectTagKey} · Range: ${formatDate(data.startDate)} → ${formatDate(data.endDate)}`,
      report: buildReport({
        scope: 'costs',
        scannedAt: data.scannedAt,
        executiveSummary: [
          `Total spend in range: ${formatCurrency(data.totalAmount, data.currency)} across ${data.projects.length} project(s).`,
          `Tag key used for grouping: ${data.projectTagKey}.`,
        ],
      }),
      columns: [
        { header: 'Project', value: (row) => row.project },
        {
          header: 'Amount',
          value: (row) => formatCurrency(row.amount, row.currency),
        },
        { header: 'Currency', value: (row) => row.currency },
      ],
      rows: data.projects,
    })
  }, [buildReport, data])

  const dateInputClass =
    'h-8 w-[8.75rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_600 dark:bg-gray_800 dark:text-gray_100'

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title="Costs"
        description="AWS spend grouped by project tag for the selected date range."
        meta={
          data && !dateRangeInvalid ? (
            <>
              Tag key: <span className="font-mono">{data.projectTagKey}</span>
              {' · '}
              Range: {formatDate(data.startDate)} → {formatDate(data.endDate)}
            </>
          ) : undefined
        }
        actions={
          <>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-gray_600 dark:text-gray_400">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={dateInputClass}
                />
              </label>
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-gray_600 dark:text-gray_400">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={dateInputClass}
                />
              </label>
              <Button
                className="h-8 min-w-0 bg-brand_600 px-3 text-xs text-white transition-colors hover:bg-brand_700 disabled:opacity-50"
                disabled={dateRangeInvalid || isFetching}
                onClick={handleApply}
              >
                {isFetching ? '…' : 'Apply'}
              </Button>
            </div>
            {dateRangeInvalid && (
              <p className="text-right text-xs text-red_900 dark:text-red_200">
                Start date must be on or before end date.
              </p>
            )}
          </>
        }
      />

      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <BarChartSkeleton />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total spend"
              value={formatCurrency(data.totalAmount, data.currency)}
              icon={<SpendIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Projects"
              value={data.projects.length}
              hint="With cost in the selected range"
              icon={<ProjectsIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              label={topProjectStat.label}
              value={topProjectStat.value}
              hint={topProjectStat.hint}
              icon={<TopProjectIcon className="h-5 w-5" />}
              iconTone={2}
            />
          </div>

          {chartData.length > 0 && (
            <section className="mb-6 rounded-xl border border-gray_200 dark:border-gray_700 bg-white dark:bg-gray_800 p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray_800 dark:text-gray_400">
                Spend by project
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray_300 dark:stroke-gray_700" />
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
                        formatCurrency(value, data.currency)
                      }
                    />
                    <Bar dataKey="amount" fill="#5F346F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <TableSection
            title="Breakdown"
            onExportPdf={handleExportPdf}
            exportDisabled={data.projects.length === 0}
            columns={projectColumns}
            data={data.projects}
            emptyMessage="No project costs found for this range."
            getRowKey={(row) => row.project}
          />
        </>
      )}
    </div>
  )
}
