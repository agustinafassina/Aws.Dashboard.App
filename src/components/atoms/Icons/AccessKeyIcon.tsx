import { iconStyles } from './styles'

const AccessKeyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconStyles.sm}
    aria-hidden
  >
    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
    <path d="m9 11-6 6a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0l6-6" />
    <path d="M5 19 3 21" />
    <path d="M14 4l6 6" />
  </svg>
)

export default AccessKeyIcon
