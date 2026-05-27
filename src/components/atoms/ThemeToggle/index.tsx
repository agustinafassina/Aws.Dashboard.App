'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Button from '@/components/atoms/Button'
import SunIcon from '@/components/atoms/Icons/SunIcon'
import MoonIcon from '@/components/atoms/Icons/MoonIcon'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button className="hover:opacity-80 w-10 h-10 p-0">
        <SunIcon width={20} height={20} />
      </Button>
    )
  }

  return (
    <Button
      className="hover:opacity-80 w-10 h-10 p-0"
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