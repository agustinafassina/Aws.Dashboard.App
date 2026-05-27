'use client'

import { useEffect } from 'react'
import ErrorPageView from '@/components/organism/ErrorPageView'
import { useTranslation } from '@/i18n/useTranslation'

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { dictionary } = useTranslation()
  const { generic } = dictionary.errors

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPageView
      title={generic.title}
      description={generic.description}
      code="!"
      primaryAction={{
        label: generic.retry,
        onClick: reset,
      }}
      secondaryAction={{
        label: generic.backHome,
        href: '/home/dashboard',
      }}
    />
  )
}
