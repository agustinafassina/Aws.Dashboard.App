'use client'

import { useMemo, useState } from 'react'
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
import { BarChartSkeleton, CardSkeleton } from '@/components/atoms/Skeleton'
import DataTable from '@/components/molecules/DataTable'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import { useCostByProject } from '@/hooks/useCostByProject'
import type { Column } from '@/interfaces/common'
import type { ProjectCost } from '@/interfaces/aws-api'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'
import {
  defaultCostDateRange,
  formatCurrency,
  formatDateTime,
} from '@/utils/formatters'

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
  const defaults = defaultCostDateRange()
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [appliedRange, setAppliedRange] = useState(defaults)

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

  const handleApply = () => {
    if (startDate && endDate && startDate <= endDate) {
      setAppliedRange({ startDate, endDate })
    }
  }

  const dateRangeInvalid = Boolean(startDate && endDate && startDate > endDate)

  return (
    <div className="h-[calc(90vh-10rem)] p-4 min-w-[70rem] max-w-[90rem] mx-auto text-gray_900 dark:text-gray_200">
      <PageHeader
        title="Costs"
        description="AWS spend grouped by project tag for the selected date range."
        scannedAt={data ? formatDateTime(data.scannedAt) : undefined}
      />

      <section className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-gray_200 dark:border-gray_700 bg-white dark:bg-gray_800 p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-label">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-label">End date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
          />
        </label>
        <Button
          className="bg-primary_600 hover:bg-primary_700 text-white px-6 w-auto min-w-[8rem] disabled:opacity-50 transition-colors"
          disabled={dateRangeInvalid || isFetching}
          onClick={handleApply}
        >
          {isFetching ? 'Loading…' : 'Apply'}
        </Button>
        {dateRangeInvalid && (
          <p className="text-xs text-red_900 dark:text-red_200 w-full">
            Start date must be on or before end date.
          </p>
        )}
        {data && (
          <p className="text-xs text-gray_700 dark:text-gray_500 w-full">
            Tag key: <span className="font-mono">{data.projectTagKey}</span>
            {' · '}
            Range: {data.startDate} → {data.endDate}
          </p>
        )}
      </section>

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
            />
            <StatCard
              label="Projects"
              value={data.projects.length}
              hint="With cost in the selected range"
            />
            <StatCard
              label="Currency"
              value={data.currency}
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
                    <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray_800 dark:text-gray_400">
              Breakdown
            </h2>
            <DataTable
              columns={projectColumns}
              data={data.projects}
              emptyMessage="No project costs found for this range."
              getRowKey={(row) => row.project}
            />
          </section>
        </>
      )}
    </div>
  )
}
