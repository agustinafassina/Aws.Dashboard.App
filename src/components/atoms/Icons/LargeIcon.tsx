import React from 'react'

const LargeIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className="w-5 h-5"
    >
      <rect x="2" y="2" width="8" height="10" rx="1" />{' '}
      <rect x="14" y="2" width="8" height="6" rx="1" />{' '}
      <rect x="2" y="16" width="8" height="6" rx="1" />{' '}
      <rect x="14" y="12" width="8" height="10" rx="1" />{' '}
    </svg>
  )
}

export default LargeIcon
