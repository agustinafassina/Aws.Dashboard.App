import type { ReactNode } from 'react'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { cn } from '@/styles/cn'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  variant?: 'default' | 'warning' | 'success'
  icon?: ReactNode
  className?: string
  equalHeight?: boolean
  isLoading?: boolean
  loadingLabel?: string
}

const variantClasses = {
  default:
    'bg-white dark:bg-gray_850 border-gray_200 dark:border-gray_750',
  warning:
    'bg-warning_50 border-warning_200 dark:bg-brand_500/10 dark:border-brand_400/30',
  success:
    'bg-success_50 dark:bg-success_100/10 border-success_500/25 dark:border-success_500/20',
}

export default function StatCard({
  label,
  value,
  hint,
  variant = 'default',
  icon,
  className,
  equalHeight = false,
  isLoading = false,
  loadingLabel,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 shadow-sm transition-colors',
        equalHeight && 'flex h-full min-h-[8.75rem] flex-col',
        variantClasses[variant],
        isLoading && 'opacity-90',
        className,
      )}
      aria-busy={isLoading}
    >
      {icon ? (
        <div
          className={cn(
            'absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg',
            variant === 'warning'
              ? 'bg-warning_100 text-warning_700 dark:bg-brand_500/20 dark:text-brand_300'
              : 'bg-brand_50 text-brand_500 dark:bg-gray_800 dark:text-brand_300',
          )}
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wide',
          variant === 'warning'
            ? 'text-warning_800 dark:text-gray_400'
            : 'text-gray_700 dark:text-gray_400',
          icon ? 'pr-12' : '',
        )}
      >
        {label}
      </p>
      {isLoading ? (
        <div
          className={cn(
            'mt-2 flex min-h-[2rem] items-center',
            equalHeight && 'flex-1',
          )}
        >
          <LoadingSpinner size="md" label={loadingLabel} />
        </div>
      ) : (
        <p
          className={cn(
            'mt-2 text-2xl font-bold',
            variant === 'warning'
              ? 'text-warning_900 dark:text-gray_100'
              : 'text-gray_900 dark:text-gray_100',
            equalHeight && 'line-clamp-2 leading-tight',
          )}
        >
          {value}
        </p>
      )}
      {equalHeight ? (
        <p className="mt-auto line-clamp-2 pt-1 text-xs text-gray_700 dark:text-gray_400">
          {hint ?? '\u00A0'}
        </p>
      ) : (
        hint && (
          <p className="mt-1 text-xs text-gray_700 dark:text-gray_400">{hint}</p>
        )
      )}
    </div>
  )
}
