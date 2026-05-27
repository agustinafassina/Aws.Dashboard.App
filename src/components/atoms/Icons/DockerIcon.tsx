const DockerIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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
    <path d="M4 10h1v4H4zM7 10h1v4H7zM10 10h1v4h-1zM13 10h1v4h-1zM7 7h1v1H7zM10 7h1v1h-1zM13 7h1v1h-1z" />
    <path d="M2 14h15a3 3 0 0 0 3-2.8V10H2v4z" />
    <path d="M18 8h2v2h-2z" />
  </svg>
)

export default DockerIcon
