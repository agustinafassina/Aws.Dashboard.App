const ShieldIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M12 3 19 6v6c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V6l7-3z" />
  </svg>
)

export default ShieldIcon
