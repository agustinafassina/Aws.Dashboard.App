'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { getCookie, setCookie } from 'cookies-next'
import { appConfig } from '@/config/app'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  parseLocale,
} from '@/constants/locale'

export type Locale = 'es' | 'en'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const fromStorage = localStorage.getItem(LOCALE_STORAGE_KEY)
      const cookieValue = getCookie(LOCALE_COOKIE_KEY)
      const fromCookie =
        typeof cookieValue === 'string' ? cookieValue : undefined
      const stored = fromStorage ?? fromCookie
      setLocaleState(parseLocale(stored))
    } catch {
      // ignore storage errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.lang = locale
  }, [locale, hydrated])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
      setCookie(LOCALE_COOKIE_KEY, next, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * appConfig.localeCookieMaxAgeDays,
      })
    } catch {
      // ignore storage errors
    }
  }, [])

  return (
    <LanguageContext.Provider
      value={{ locale: hydrated ? locale : DEFAULT_LOCALE, setLocale }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
