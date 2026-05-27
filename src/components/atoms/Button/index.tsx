'use client'

import React, { FC, ReactNode } from 'react'
import { getButtonClass } from './styles'

interface ButtonProps {
  children: ReactNode
  disabled?: boolean
  width?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  className?: string
}

const Button: FC<ButtonProps> = ({
  children,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <button
      className={getButtonClass(disabled, className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
