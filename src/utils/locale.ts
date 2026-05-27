import { cookies } from 'next/headers'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  parseLocale,
} from '@/constants/locale'
import type { Locale } from '@/context/LanguageContext'

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies()
    return parseLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value)
  } catch {
    return DEFAULT_LOCALE
  }
}
