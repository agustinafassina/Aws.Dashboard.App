import type { Locale } from '@/context/LanguageContext'
import type { GuideSectionId } from '@/config/siteGuide'

export type SectionKey = 'dashboard' | 'costs' | 'iam'

export type TranslationDictionary = {
  nav: {
    mainAriaLabel: string
    goToDashboard: string
  }
  sections: Record<SectionKey, string>
  homeContent: Record<SectionKey, string>
  dashboardCharts: {
    weeklyActivity: string
    usageTrend: string
  }
  sidebar: {
    ariaLabel: string
    menuTitle: string
    navAriaLabel: string
    expandMenu: string
    collapseMenu: string
    version: string
  }
  userMenu: {
    menuOf: string
    appearance: string
    themeAriaLabel: string
    themeActive: string
    themeLight: string
    themeDark: string
    language: string
    languageAriaLabel: string
    guide: string
    logout: string
  }
  language: {
    es: string
    en: string
  }
  guide: {
    metaTitle: string
    eyebrow: string
    title: string
    description: string
    backToDashboard: string
    tocLabel: string
    tocAriaLabel: string
    sections: Record<GuideSectionId, { title: string; content: string }>
  }
  errors: {
    notFound: {
      title: string
      description: string
      backHome: string
    }
    generic: {
      title: string
      description: string
      retry: string
      backHome: string
    }
  }
}

export type { Locale }
