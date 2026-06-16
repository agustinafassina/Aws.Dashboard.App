import type { ReactNode } from 'react'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { cn } from '@/styles/cn'
import { getStatCardIconToneClass } from '@/styles/statCardTones'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  variant?: 'default' | 'warning' | 'success'
  icon?: ReactNode
  iconTone?: number
  className?: string
  equalHeight?: boolean
  compact?: boolean
  isLoading?: boolean
  loadingLabel?: string
}

const variantClasses = {
  default:
    'bg-white dark:bg-gray_850 border-gray_200 dark:border-gray_750',
  warning:
    'bg-white border-warning_200 dark:bg-brand_500/10 dark:border-brand_400/30',
  success:
    'bg-success_50 dark:bg-success_100/10 border-success_500/25 dark:border-success_500/20',
}

export default function StatCard({
  label,
  value,
  hint,
  variant = 'default',
  icon,
  iconTone = 0,
  className,
  equalHeight = false,
  compact = false,
  isLoading = false,
  loadingLabel,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border shadow-sm transition-colors',
        compact ? 'p-3' : 'p-4',
        equalHeight && 'flex h-full min-h-[8.75rem] flex-col',
        compact && equalHeight && 'min-h-[6.5rem]',
        variantClasses[variant],
        isLoading && 'opacity-90',
        className,
      )}
      aria-busy={isLoading}
    >
      {icon ? (
        <div
          className={cn(
            'absolute flex items-center justify-center rounded-lg',
            compact ? 'right-2.5 top-2.5 h-7 w-7' : 'right-4 top-4 h-9 w-9',
            variant === 'warning'
              ? 'bg-gray_100 text-brand_700 dark:bg-brand_600/30 dark:text-brand_100'
              : variant === 'success'
                ? 'bg-success_50 text-success_700 dark:bg-success_100/15 dark:text-success_500'
                : getStatCardIconToneClass(iconTone),
          )}
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <p
        className={cn(
          'font-semibold uppercase tracking-wide',
          compact ? 'text-[10px] leading-tight' : 'text-xs',
          variant === 'warning'
            ? 'text-warning_800 dark:text-gray_400'
            : 'text-gray_700 dark:text-gray_400',
          icon ? (compact ? 'pr-9' : 'pr-12') : '',
        )}
      >
        {label}
      </p>
      {isLoading ? (
        <div
          className={cn(
            'mt-2 flex items-center',
            compact ? 'min-h-[1.5rem]' : 'min-h-[2rem]',
            equalHeight && 'flex-1',
          )}
        >
          <LoadingSpinner size={compact ? 'sm' : 'md'} label={loadingLabel} />
        </div>
      ) : (
        <p
          className={cn(
            'mt-1.5 font-bold',
            compact ? 'text-xl' : 'mt-2 text-2xl',
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
        <p
          className={cn(
            'mt-auto line-clamp-2 pt-1 text-gray_700 dark:text-gray_400',
            compact ? 'text-[10px]' : 'text-xs',
          )}
        >
          {hint ?? '\u00A0'}
        </p>
      ) : (
        hint && (
          <p
            className={cn(
              'mt-0.5 line-clamp-2 text-gray_700 dark:text-gray_400',
              compact ? 'text-[10px] leading-snug' : 'mt-1 text-xs',
            )}
          >
            {hint}
          </p>
        )
      )}
    </div>
  )
}
