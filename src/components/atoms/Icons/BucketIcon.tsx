import { iconStyles } from './styles'

const BucketIcon = ({ className }: { className?: string }) => (
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
    <path d="M4 7h16" />
    <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
)

export default BucketIcon
