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
  primary: '#5F346F',
  primaryFill: 'rgba(95, 52, 111, 0.2)',
  secondary: '#A871BC',
  secondaryFill: 'rgba(168, 113, 188, 0.18)',
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
  primary: '#A871BC',
  primaryFill: 'rgba(168, 113, 188, 0.22)',
  secondary: '#C498D8',
  secondaryFill: 'rgba(196, 152, 216, 0.16)',
}

export function getChartTheme(isDark: boolean): ChartTheme {
  return isDark ? darkChartTheme : lightChartTheme
}
