interface PageHeaderProps {
  title: string
  description?: string
  scannedAt?: string
}

export default function PageHeader({
  title,
  description,
  scannedAt,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-gray_900 dark:text-gray_100">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-gray_700 dark:text-gray_400">
          {description}
        </p>
      )}
      {scannedAt && (
        <p className="mt-1 text-xs text-gray_600 dark:text-gray_500">
          Last scan: {scannedAt}
        </p>
      )}
    </header>
  )
}
