'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { getDictionary } from '@/i18n/getDictionary'
import { interpolate } from '@/i18n/translate'
import type { SectionKey } from '@/i18n/types'

export function useTranslation() {
  const { locale, setLocale } = useLanguage()
  const dictionary = useMemo(() => getDictionary(locale), [locale])

  return {
    locale,
    setLocale,
    dictionary,
    format: interpolate,
    sectionTitle: (key: SectionKey) => dictionary.sections[key],
  }
}
