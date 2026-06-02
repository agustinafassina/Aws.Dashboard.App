import { cn } from '@/styles/cn'

interface LastScanTagProps {
  label: string
  value: string
  className?: string
}

export default function LastScanTag({ label, value, className }: LastScanTagProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border border-gray_200 bg-gray_50 px-3 py-1.5 text-xs font-medium text-gray_800 shadow-sm',
        'dark:border-gray_600 dark:bg-gray_800 dark:text-gray_200',
        className,
      )}
      title={`${label}: ${value}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray_500 dark:text-gray_400">
        {label}
      </span>
      <time className="whitespace-nowrap font-mono text-[11px]">{value}</time>
    </span>
  )
}
