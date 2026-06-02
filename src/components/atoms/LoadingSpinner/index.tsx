import { cn } from '@/styles/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
} as const

export default function LoadingSpinner({
  size = 'md',
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span
        className={cn(
          'animate-spin rounded-full border-brand_500 border-t-transparent',
          sizeClasses[size],
        )}
      />
    </span>
  )
}
