'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Button from '@/components/atoms/Button'
import SunIcon from '@/components/atoms/Icons/SunIcon'
import MoonIcon from '@/components/atoms/Icons/MoonIcon'
import { themeToggleStyles } from './styles'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button className={themeToggleStyles.button}>
        <SunIcon width={20} height={20} />
      </Button>
    )
  }

  return (
    <Button
      className={themeToggleStyles.button}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon width={20} height={20} />
      ) : (
        <MoonIcon width={20} height={20} />
      )}
    </Button>
  )
}
