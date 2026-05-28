interface ExposureBadgeProps {
  exposed: boolean
}

export default function ExposureBadge({ exposed }: ExposureBadgeProps) {
  if (exposed) {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red_50 text-red_900 dark:bg-red_900/30 dark:text-red_200"
        title="Open ports exposed to the internet"
        aria-label="Open ports exposed to the internet"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </span>
    )
  }

  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
      title="No public port exposure"
      aria-label="No public port exposure"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}

export function exposureLabel(exposed: boolean): string {
  return exposed ? 'Exposed' : 'Secure'
}
