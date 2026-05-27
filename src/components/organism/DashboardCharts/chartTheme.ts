export type ChartTheme = {
  cardBg: string
  cardBorder: string
  title: string
  label: string
  grid: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
  primary: string
  primaryFill: string
  secondary: string
  secondaryFill: string
}

const lightChartTheme: ChartTheme = {
  cardBg: '#FFFFFF',
  cardBorder: '#EAEAEA',
  title: '#3f3f46',
  label: '#878787',
  grid: '#ECEDE6',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#EAEAEA',
  tooltipText: '#3f3f46',
  primary: '#3f3f46',
  primaryFill: '#e4e4e7',
  secondary: '#71717a',
  secondaryFill: 'rgba(113, 113, 122, 0.15)',
}

const darkChartTheme: ChartTheme = {
  cardBg: '#322F35',
  cardBorder: '#757575',
  title: '#f4f4f5',
  label: '#C9C9C9',
  grid: '#5A5A5A',
  tooltipBg: '#27272a',
  tooltipBorder: '#757575',
  tooltipText: '#f4f4f5',
  primary: '#d4d4d8',
  primaryFill: 'rgba(212, 212, 216, 0.2)',
  secondary: '#a1a1aa',
  secondaryFill: 'rgba(161, 161, 170, 0.12)',
}

export function getChartTheme(isDark: boolean): ChartTheme {
  return isDark ? darkChartTheme : lightChartTheme
}
