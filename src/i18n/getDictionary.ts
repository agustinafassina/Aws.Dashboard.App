import type { Locale } from '@/context/LanguageContext'
import type { TranslationDictionary } from '@/i18n/types'
import en from '@/i18n/dictionaries/en'
import es from '@/i18n/dictionaries/es'

const dictionaries: Record<Locale, TranslationDictionary> = { es, en }

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale]
}
