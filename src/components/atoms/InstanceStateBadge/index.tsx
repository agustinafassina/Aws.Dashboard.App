interface InstanceStateBadgeProps {
  state: string
}

export default function InstanceStateBadge({ state }: InstanceStateBadgeProps) {
  const normalized = state.trim().toLowerCase()

  if (normalized === 'running') {
    return (
      <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-green-800 dark:bg-green-950/60 dark:text-green-300">
        {state}
      </span>
    )
  }

  if (normalized === 'stopped') {
    return (
      <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-red_50 px-2.5 py-0.5 text-xs font-semibold uppercase text-red_900 dark:bg-red_900/30 dark:text-red_200">
        {state}
      </span>
    )
  }

  return (
    <span className="inline-flex shrink-0 whitespace-nowrap text-xs font-medium uppercase text-gray_700 dark:text-gray_300">
      {state}
    </span>
  )
}
