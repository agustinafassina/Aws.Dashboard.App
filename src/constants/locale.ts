import type { Locale } from '@/context/LanguageContext'

export const LOCALE_STORAGE_KEY = 'dashboard-locale'
export const LOCALE_COOKIE_KEY = 'dashboard-locale'
export const DEFAULT_LOCALE: Locale = 'es'

export function parseLocale(value: string | undefined | null): Locale {
  return value === 'en' ? 'en' : 'es'
}
