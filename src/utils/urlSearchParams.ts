const API_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const SEVERITY_FILTER_VALUES = [
  '',
  'CRITICAL,HIGH',
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
] as const

export type SeverityFilterValue = (typeof SEVERITY_FILTER_VALUES)[number]

export function isValidApiDate(value: string | null | undefined): value is string {
  return Boolean(value && API_DATE_RE.test(value))
}

export function parseCostDateRangeFromSearch(
  from: string | null,
  to: string | null,
): { startDate: string; endDate: string } | null {
  if (!isValidApiDate(from) || !isValidApiDate(to)) return null
  if (from > to) return null
  return { startDate: from, endDate: to }
}

export function parseSeverityFilter(
  value: string | null | undefined,
): SeverityFilterValue {
  if (!value) return ''
  const upper = value.toUpperCase()
  return SEVERITY_FILTER_VALUES.includes(upper as SeverityFilterValue)
    ? (upper as SeverityFilterValue)
    : ''
}

export type HomeUrlParams = {
  region?: string
  from?: string
  to?: string
  severity?: string
}

export function buildHomeHref(path: string, params: HomeUrlParams): string {
  const search = new URLSearchParams()

  if (params.region) search.set('region', params.region)
  if (params.from) search.set('from', params.from)
  if (params.to) search.set('to', params.to)
  if (params.severity) search.set('severity', params.severity)

  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export function replaceSearchParams(
  pathname: string,
  current: URLSearchParams | null | undefined,
  updates: Record<string, string | null | undefined>,
): string {
  const base = current ?? new URLSearchParams()
  const next = new URLSearchParams(base.toString())

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  }

  const query = next.toString()
  return query ? `${pathname}?${query}` : pathname
}
