'use client'

import React, { FC, ReactNode } from 'react'
import clsx from 'clsx'

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
  width = 'w-full',
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const baseClasses =
    'flex items-center justify-center font-bold rounded-lg h-8 text-base uppercase p-2'

  const buttonClasses = clsx(
    baseClasses,
    disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
    className,
  )

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
