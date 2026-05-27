interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  variant?: 'default' | 'warning' | 'success'
}

const variantClasses = {
  default:
    'bg-white dark:bg-gray_800 border-gray_200 dark:border-gray_700',
  warning:
    'bg-red_50/40 dark:bg-red_50/10 border-red_200/50 dark:border-red_200/30',
  success:
    'bg-success_50 dark:bg-success_100/10 border-success_500/25 dark:border-success_500/20',
}

export default function StatCard({
  label,
  value,
  hint,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-colors ${variantClasses[variant]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray_700 dark:text-gray_400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-gray_900 dark:text-gray_100">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-gray_700 dark:text-gray_400">{hint}</p>
      )}
    </div>
  )
}
