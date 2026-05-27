import { format, parseISO } from 'date-fns'

export const DISPLAY_DATE_FORMAT = 'MM-dd-yyyy'
export const DISPLAY_DATETIME_FORMAT = `${DISPLAY_DATE_FORMAT}, HH:mm`
export const API_DATE_FORMAT = 'yyyy-MM-dd'

function parseDisplayDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return parseISO(value)
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), DISPLAY_DATETIME_FORMAT)
  } catch {
    return iso
  }
}

export function formatDate(iso: string): string {
  try {
    return format(parseDisplayDate(iso), DISPLAY_DATE_FORMAT)
  } catch {
    return iso
  }
}

export function toApiDate(date: Date): string {
  return format(date, API_DATE_FORMAT)
}

export function defaultCostDateRange(): { startDate: string; endDate: string } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return { startDate: toApiDate(start), endDate: toApiDate(now) }
}
