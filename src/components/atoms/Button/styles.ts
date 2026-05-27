import { cn } from '@/styles/cn'

export const buttonStyles = {
  base: 'flex h-8 items-center justify-center rounded-lg p-2 text-base font-bold uppercase',
  enabled: 'cursor-pointer',
  disabled: 'cursor-default opacity-50',
} as const

export function getButtonClass(disabled: boolean, className?: string) {
  return cn(
    buttonStyles.base,
    disabled ? buttonStyles.disabled : buttonStyles.enabled,
    className,
  )
}
