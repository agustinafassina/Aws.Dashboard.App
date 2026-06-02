import React from 'react'
import { iconStyles } from './styles'

const AuditIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? iconStyles.md}
    >
      <path d="M9 3.75H7.5A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9A2.25 2.25 0 0 0 18.75 18V6A2.25 2.25 0 0 0 16.5 3.75H15m-6 0V3a1.5 1.5 0 0 1 3 0v.75m-3 0h6m-6 0h6m-1.5 6.75h3m-3 3h3M9 9.75h6M9 12.75h4.5" />
    </svg>
  )
}

export default AuditIcon
