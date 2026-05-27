import Link from 'next/link'
import { errorPageStyles } from './styles'

interface ErrorPageViewProps {
  title: string
  description: string
  code?: string
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href: string
  }
}

export default function ErrorPageView({
  title,
  description,
  code = '404',
  primaryAction,
  secondaryAction,
}: ErrorPageViewProps) {
  return (
    <div className={errorPageStyles.page} role="alert">
      <div className={errorPageStyles.card}>
        <p className={errorPageStyles.code} aria-hidden>
          {code}
        </p>
        <h1 className={errorPageStyles.title}>{title}</h1>
        <p className={errorPageStyles.description}>{description}</p>
        <div className={errorPageStyles.actions}>
          {primaryAction &&
            (primaryAction.href ? (
              <Link href={primaryAction.href} className={errorPageStyles.primary}>
                {primaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={errorPageStyles.primary}
              >
                {primaryAction.label}
              </button>
            ))}
          {secondaryAction && (
            <Link href={secondaryAction.href} className={errorPageStyles.secondary}>
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
