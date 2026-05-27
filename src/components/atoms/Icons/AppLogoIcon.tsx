import React from 'react'
import { iconStyles } from './styles'

interface AppLogoIconProps {
  className?: string
}

const AppLogoIcon: React.FC<AppLogoIconProps> = ({ className = iconStyles.logo }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 18.5h9.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.2A4 4 0 0 0 6 18.5z" />
      <rect x="9.25" y="12.5" width="5.5" height="4.25" rx="0.75" />
      <path d="M10.5 12.5v-1.1a1.75 1.75 0 0 1 3.5 0V12.5" />
    </svg>
  )
}

export default AppLogoIcon
