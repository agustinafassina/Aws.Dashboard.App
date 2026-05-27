import { format, parseISO } from 'date-fns'

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
    return format(parseISO(iso), 'dd MMM yyyy, HH:mm')
  } catch {
    return iso
  }
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM yyyy')
  } catch {
    return iso
  }
}

export function toApiDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function defaultCostDateRange(): { startDate: string; endDate: string } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return { startDate: toApiDate(start), endDate: toApiDate(now) }
}
