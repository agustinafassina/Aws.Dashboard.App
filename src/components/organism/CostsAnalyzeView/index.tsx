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
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useCostByProject } from '@/hooks/useCostByProject'
import { useCostDateRange } from '@/hooks/useCostDateRange'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { Column } from '@/interfaces/common'
import { useTranslation } from '@/i18n/useTranslation'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

interface AnalyzeRow {
  project: string
  amount: number
  currency: string
  sharePct: number
  cumulativePct: number
}

interface MoverRow {
  project: string
  currentAmount: number
  previousAmount: number
  deltaAmount: number
  deltaPct: number | null
  isNew: boolean
}

const TOP_N_OPTIONS = [5, 10, 15]

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function parseYmdUtc(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1))
}

function toYmdUtc(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function getPreviousRange(startDate: string, endDate: string) {
  const start = parseYmdUtc(startDate)
  const end = parseYmdUtc(endDate)
  const dayMs = 24 * 60 * 60 * 1000
  const rangeMs = Math.max(dayMs, end.getTime() - start.getTime() + dayMs)
  const previousEnd = new Date(start.getTime() - dayMs)
  const previousStart = new Date(previousEnd.getTime() - rangeMs + dayMs)
  return {
    startDate: toYmdUtc(previousStart),
    endDate: toYmdUtc(previousEnd),
  }
}

export default function CostsAnalyzeView() {
  const { dictionary } = useTranslation()
  const { buildReport } = usePdfReport()
  const { appliedRange, setAppliedRange } = useCostDateRange()
  const t = dictionary.costsAnalyze
  const [startDate, setStartDate] = useState(appliedRange.startDate)
  const [endDate, setEndDate] = useState(appliedRange.endDate)
  const [topN, setTopN] = useState(10)
  const [minSpendInput, setMinSpendInput] = useState('0')

  const { data, isLoading, isFetching, isError, error, refetch } = useCostByProject(
    appliedRange.startDate,
    appliedRange.endDate,
  )
  const previousRange = useMemo(
    () => getPreviousRange(appliedRange.startDate, appliedRange.endDate),
    [appliedRange.endDate, appliedRange.startDate],
  )
  const previousQuery = useCostByProject(previousRange.startDate, previousRange.endDate)
  const previousData = previousQuery.data

  useEffect(() => {
    setStartDate(appliedRange.startDate)
    setEndDate(appliedRange.endDate)
  }, [appliedRange.endDate, appliedRange.startDate])

  const dateRangeInvalid = Boolean(startDate && endDate && startDate > endDate)
  const minSpend = Math.max(0, Number(minSpendInput) || 0)

  const sortedProjects = useMemo(
    () => [...(data?.projects ?? [])].sort((a, b) => b.amount - a.amount),
    [data?.projects],
  )

  const filteredProjects = useMemo(
    () => sortedProjects.filter((p) => p.amount >= minSpend),
    [minSpend, sortedProjects],
  )

  const totalAmount = data?.totalAmount ?? 0
  const previousTotalAmount = previousData?.totalAmount ?? 0
  const spendDelta = totalAmount - previousTotalAmount
  const spendDeltaPct =
    previousTotalAmount > 0 ? (spendDelta / previousTotalAmount) * 100 : null
  const topProjects = filteredProjects.slice(0, topN)
  const othersAmount = filteredProjects
    .slice(topN)
    .reduce((sum, project) => sum + project.amount, 0)

  const chartData = useMemo(() => {
    const base = topProjects.map((project) => ({
      name: project.project,
      amount: project.amount,
    }))
    if (othersAmount > 0) {
      base.push({ name: 'Others', amount: othersAmount })
    }
    return base
  }, [othersAmount, topProjects])

  const top1Share = useMemo(() => {
    if (totalAmount <= 0 || sortedProjects.length === 0) return 0
    return (sortedProjects[0].amount / totalAmount) * 100
  }, [sortedProjects, totalAmount])

  const top3Share = useMemo(() => {
    if (totalAmount <= 0 || sortedProjects.length === 0) return 0
    const top3Amount = sortedProjects
      .slice(0, 3)
      .reduce((sum, project) => sum + project.amount, 0)
    return (top3Amount / totalAmount) * 100
  }, [sortedProjects, totalAmount])

  const projectsFor80Pct = useMemo(() => {
    if (totalAmount <= 0) return 0
    let running = 0
    for (let i = 0; i < sortedProjects.length; i += 1) {
      running += sortedProjects[i].amount
      if (running / totalAmount >= 0.8) {
        return i + 1
      }
    }
    return sortedProjects.length
  }, [sortedProjects, totalAmount])

  const previousProjectAmountByName = useMemo(
    () =>
      new Map(
        (previousData?.projects ?? []).map((project) => [project.project, project.amount]),
      ),
    [previousData?.projects],
  )

  const currentProjectAmountByName = useMemo(
    () =>
      new Map((data?.projects ?? []).map((project) => [project.project, project.amount])),
    [data?.projects],
  )

  const newProjects = useMemo(
    () =>
      [...(data?.projects ?? [])]
        .filter((project) => !previousProjectAmountByName.has(project.project))
        .sort((a, b) => b.amount - a.amount),
    [data?.projects, previousProjectAmountByName],
  )
  const newProjectsCount = newProjects.length
  const newProjectsPreview = useMemo(() => {
    if (newProjects.length === 0) return 'No new projects vs previous period'
    const names = newProjects.slice(0, 3).map((project) => project.project)
    const base = names.join(', ')
    const extraCount = newProjects.length - names.length
    return extraCount > 0 ? `${base} +${extraCount} more` : base
  }, [newProjects])

  const analysisRows = useMemo<AnalyzeRow[]>(() => {
    if (totalAmount <= 0) {
      return filteredProjects.map((project) => ({
        project: project.project,
        amount: project.amount,
        currency: project.currency,
        sharePct: 0,
        cumulativePct: 0,
      }))
    }

    let running = 0
    return filteredProjects.map((project) => {
      const sharePct = (project.amount / totalAmount) * 100
      running += sharePct
      return {
        project: project.project,
        amount: project.amount,
        currency: project.currency,
        sharePct,
        cumulativePct: running,
      }
    })
  }, [filteredProjects, totalAmount])

  const moversRows = useMemo<MoverRow[]>(() => {
    const names = new Set<string>([
      ...currentProjectAmountByName.keys(),
      ...previousProjectAmountByName.keys(),
    ])

    const rows: MoverRow[] = []
    for (const name of names) {
      const currentAmount = currentProjectAmountByName.get(name) ?? 0
      const previousAmount = previousProjectAmountByName.get(name) ?? 0
      if (currentAmount < minSpend && previousAmount < minSpend) continue

      const deltaAmount = currentAmount - previousAmount
      const deltaPct =
        previousAmount > 0 ? (deltaAmount / previousAmount) * 100 : null
      rows.push({
        project: name,
        currentAmount,
        previousAmount,
        deltaAmount,
        deltaPct,
        isNew: previousAmount === 0 && currentAmount > 0,
      })
    }

    return rows
      .sort((a, b) => Math.abs(b.deltaAmount) - Math.abs(a.deltaAmount))
      .slice(0, topN)
  }, [
    currentProjectAmountByName,
    minSpend,
    previousProjectAmountByName,
    topN,
  ])

  const rowCurrency = data?.currency ?? 'USD'
  const analyzeColumns: Column<AnalyzeRow>[] = [
    { key: 'project', label: 'Project' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(Number(value), rowCurrency),
    },
    {
      key: 'sharePct',
      label: 'Share',
      render: (value) => formatPercent(Number(value)),
    },
    {
      key: 'cumulativePct',
      label: 'Cumulative',
      render: (value) => formatPercent(Number(value)),
    },
  ]
  const moversColumns: Column<MoverRow>[] = [
    { key: 'project', label: 'Project' },
    {
      key: 'currentAmount',
      label: 'Current',
      render: (value) => formatCurrency(Number(value), rowCurrency),
    },
    {
      key: 'previousAmount',
      label: 'Previous',
      render: (value) => formatCurrency(Number(value), rowCurrency),
    },
    {
      key: 'deltaAmount',
      label: 'Delta',
      render: (value) => {
        const amount = Number(value)
        const prefix = amount > 0 ? '+' : ''
        return `${prefix}${formatCurrency(amount, rowCurrency)}`
      },
    },
    {
      key: 'deltaPct',
      label: 'Delta %',
      render: (value) =>
        value === null ? '—' : `${Number(value) > 0 ? '+' : ''}${formatPercent(Number(value))}`,
    },
    {
      key: 'isNew',
      label: 'Status',
      render: (value) =>
        value ? (
          <span className="inline-flex rounded-full bg-brand_100 px-2 py-0.5 text-xs font-semibold text-brand_800 dark:bg-brand_600/30 dark:text-brand_100">
            New
          </span>
        ) : (
          '—'
        ),
    },
  ]

  const handleApply = () => {
    if (!dateRangeInvalid && startDate && endDate) {
      setAppliedRange({ startDate, endDate })
    }
  }

  const handleExportPdf = useCallback(() => {
    if (!data || analysisRows.length === 0) return

    exportTableToPdf({
      filename: `costs-analysis-${data.startDate}-${data.endDate}`,
      title: 'Analyze costs',
      subtitle: `Range: ${formatDate(data.startDate)} → ${formatDate(data.endDate)} · Min spend: ${formatCurrency(minSpend, data.currency)} · Top N: ${topN}`,
      report: buildReport({
        scope: 'costs',
        scannedAt: data.scannedAt,
        executiveSummary: [
          `Total spend: ${formatCurrency(data.totalAmount, data.currency)} across ${data.projects.length} project(s).`,
          `Top project share: ${formatPercent(top1Share)} · Top 3 share: ${formatPercent(top3Share)} · ${projectsFor80Pct} project(s) explain 80% of spend.`,
          `Previous range (${formatDate(previousRange.startDate)} → ${formatDate(previousRange.endDate)}): ${formatCurrency(previousTotalAmount, data.currency)} · Delta: ${spendDelta >= 0 ? '+' : ''}${formatCurrency(spendDelta, data.currency)}${spendDeltaPct !== null ? ` (${spendDeltaPct >= 0 ? '+' : ''}${formatPercent(spendDeltaPct)})` : ''}.`,
        ],
      }),
      columns: [
        { header: 'Project', value: (row) => row.project },
        { header: 'Amount', value: (row) => formatCurrency(row.amount, row.currency) },
        { header: 'Share', value: (row) => formatPercent(row.sharePct) },
        { header: 'Cumulative', value: (row) => formatPercent(row.cumulativePct) },
      ],
      rows: analysisRows,
    })
  }, [
    analysisRows,
    buildReport,
    data,
    minSpend,
    previousRange.endDate,
    previousRange.startDate,
    previousTotalAmount,
    projectsFor80Pct,
    spendDelta,
    spendDeltaPct,
    top1Share,
    top3Share,
    topN,
  ])

  const handleExportMoversPdf = useCallback(() => {
    if (!data || moversRows.length === 0) return

    exportTableToPdf({
      filename: `costs-movers-${data.startDate}-${data.endDate}`,
      title: `Biggest movers (Top ${topN})`,
      subtitle: `Range: ${formatDate(data.startDate)} → ${formatDate(data.endDate)} · Previous: ${formatDate(previousRange.startDate)} → ${formatDate(previousRange.endDate)}`,
      report: buildReport({
        scope: 'costs',
        scannedAt: data.scannedAt,
        executiveSummary: [
          `Top ${topN} project movers by absolute spend delta against previous period.`,
        ],
      }),
      columns: [
        { header: 'Project', value: (row) => row.project },
        {
          header: 'Current',
          value: (row) => formatCurrency(row.currentAmount, data.currency),
        },
        {
          header: 'Previous',
          value: (row) => formatCurrency(row.previousAmount, data.currency),
        },
        {
          header: 'Delta',
          value: (row) =>
            `${row.deltaAmount > 0 ? '+' : ''}${formatCurrency(row.deltaAmount, data.currency)}`,
        },
        {
          header: 'Delta %',
          value: (row) =>
            row.deltaPct === null
              ? '—'
              : `${row.deltaPct > 0 ? '+' : ''}${formatPercent(row.deltaPct)}`,
        },
      ],
      rows: moversRows,
    })
  }, [buildReport, data, moversRows, previousRange.endDate, previousRange.startDate, topN])

  const dateInputClass =
    'h-8 w-[8.75rem] rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_600 dark:bg-gray_800 dark:text-gray_100'
  const compactInputClass =
    'h-8 rounded-md border border-gray_200 bg-white px-2 text-xs text-gray_900 dark:border-gray_600 dark:bg-gray_800 dark:text-gray_100'

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader
        title={t.title}
        description={t.description}
        meta={
          data
            ? `Tag key: ${data.projectTagKey} · Range: ${formatDate(data.startDate)} → ${formatDate(data.endDate)} · Previous: ${formatDate(previousRange.startDate)} → ${formatDate(previousRange.endDate)}`
            : undefined
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
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-gray_600 dark:text-gray_400">Top N</span>
                <select
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  className={`${compactInputClass} w-[4.5rem]`}
                >
                  {TOP_N_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-gray_600 dark:text-gray_400">Min spend</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={minSpendInput}
                  onChange={(e) => setMinSpendInput(e.target.value)}
                  className={`${compactInputClass} w-[6.5rem]`}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <BarChartSkeleton />
        </div>
      )}

      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string; error?: string } } })
              ?.response?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response?.data
              ?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <StatCard
              label="Total spend"
              value={formatCurrency(data.totalAmount, data.currency)}
              icon={<SpendIcon className="h-5 w-5" />}
              iconTone={0}
            />
            <StatCard
              label="Vs previous period"
              value={`${spendDelta >= 0 ? '+' : ''}${formatCurrency(spendDelta, data.currency)}`}
              hint={
                previousQuery.isError
                  ? 'Could not compare with previous period'
                  : spendDeltaPct === null
                    ? 'No previous spend baseline'
                    : `${spendDeltaPct >= 0 ? '+' : ''}${formatPercent(spendDeltaPct)} vs previous`
              }
              isLoading={previousQuery.isLoading || previousQuery.isFetching}
              loadingLabel="…"
              variant={spendDelta > 0 ? 'warning' : spendDelta < 0 ? 'success' : 'default'}
              icon={<SpendIcon className="h-5 w-5" />}
              iconTone={4}
            />
            <StatCard
              label="Projects above threshold"
              value={filteredProjects.length}
              hint={`Min spend ${formatCurrency(minSpend, data.currency)}`}
              icon={<ProjectsIcon className="h-5 w-5" />}
              iconTone={1}
            />
            <StatCard
              label="New projects"
              value={newProjectsCount}
              hint={newProjectsPreview}
              variant={newProjectsCount > 0 ? 'warning' : 'default'}
              icon={<ProjectsIcon className="h-5 w-5" />}
              iconTone={5}
            />
            <StatCard
              label="Top project share"
              value={formatPercent(top1Share)}
              hint={sortedProjects[0]?.project ?? '—'}
              variant={top1Share >= 50 ? 'warning' : 'default'}
              icon={<TopProjectIcon className="h-5 w-5" />}
              iconTone={2}
            />
            <StatCard
              label="Top 3 concentration"
              value={formatPercent(top3Share)}
              hint={`${projectsFor80Pct} project(s) explain 80%`}
              variant={top3Share >= 75 ? 'warning' : 'default'}
              icon={<TopProjectIcon className="h-5 w-5" />}
              iconTone={3}
            />
          </div>

          {chartData.length > 0 && (
            <section className="mb-6 rounded-xl border border-gray_200 bg-white p-4 shadow-sm dark:border-gray_750 dark:bg-gray_850">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray_800 dark:text-gray_400">
                Spend concentration (Top {topN})
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
                      formatter={(value: number) => formatCurrency(value, data.currency)}
                    />
                    <Bar dataKey="amount" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <TableSection
            title="Project contribution"
            onExportPdf={handleExportPdf}
            exportDisabled={analysisRows.length === 0}
            columns={analyzeColumns}
            data={analysisRows}
            emptyMessage="No projects match the current analysis filters."
            getRowKey={(row) => row.project}
          />

          <TableSection
            title={`Biggest movers (vs previous, Top ${topN})`}
            onExportPdf={handleExportMoversPdf}
            exportDisabled={moversRows.length === 0}
            columns={moversColumns}
            data={moversRows}
            emptyMessage="No relevant movers for the selected filters."
            getRowKey={(row) => row.project}
          />
        </>
      )}
    </div>
  )
}
