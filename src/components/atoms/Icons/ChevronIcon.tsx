import { IIcons } from '@/interfaces/common'

interface ChevronIconProps extends IIcons {
  direction?: 'left' | 'right'
}

export default function ChevronIcon({
  width = 20,
  height = 20,
  direction = 'left',
}: ChevronIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={direction === 'right' ? 'rotate-180' : undefined}
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
