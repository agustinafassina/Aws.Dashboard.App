import Button from '@/components/atoms/Button'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = ERROR_MESSAGE,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red_200/40 bg-red_50/20 dark:bg-red_50/5 p-8 text-center"
      role="alert"
    >
      <p className="text-sm text-red_900 dark:text-red_200">{message}</p>
      {onRetry && (
        <Button
          className="bg-brand_600 hover:bg-brand_700 text-white px-6 w-auto transition-colors"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  )
}
