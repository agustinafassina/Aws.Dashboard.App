'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from '@/i18n/useTranslation'
import { getChartTheme } from './chartTheme'
import { usageTrendData, weeklyActivityData } from './mockData'
import { dashboardChartsStyles } from './styles'

function ChartTooltip({
  active,
  payload,
  label,
  theme,
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
  theme: ReturnType<typeof getChartTheme>
}) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
      style={{
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardCharts() {
  const { dictionary } = useTranslation()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const theme = getChartTheme(isDark)

  if (!mounted) {
    return (
      <div className={dashboardChartsStyles.grid}>
        <div
          className={dashboardChartsStyles.card}
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        />
        <div
          className={dashboardChartsStyles.card}
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        />
      </div>
    )
  }

  return (
    <div className={dashboardChartsStyles.grid}>
      <article
        className={dashboardChartsStyles.card}
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
      >
        <h3
          className={dashboardChartsStyles.cardTitle}
          style={{ color: theme.title }}
        >
          {dictionary.dashboardCharts.weeklyActivity}
        </h3>
        <div className={dashboardChartsStyles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivityData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: theme.label, fontSize: 12 }}
                axisLine={{ stroke: theme.grid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.label, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload?.map((item) => ({
                      value: item.value as number,
                      name: 'Value',
                      color: theme.primary,
                    }))}
                    label={label}
                    theme={theme}
                  />
                )}
              />
              <Bar dataKey="value" fill={theme.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article
        className={dashboardChartsStyles.card}
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
      >
        <h3
          className={dashboardChartsStyles.cardTitle}
          style={{ color: theme.title }}
        >
          {dictionary.dashboardCharts.usageTrend}
        </h3>
        <div className={dashboardChartsStyles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: theme.label, fontSize: 12 }}
                axisLine={{ stroke: theme.grid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.label, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload?.map((item) => ({
                      value: item.value as number,
                      name: item.name === 'sessions' ? 'Sessions' : String(item.name),
                      color: item.name === 'sessions' ? theme.primary : theme.secondary,
                    }))}
                    label={label}
                    theme={theme}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke={theme.primary}
                strokeWidth={2}
                fill="url(#sessionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  )
}
