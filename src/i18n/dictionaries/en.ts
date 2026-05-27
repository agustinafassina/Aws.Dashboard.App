import type { TranslationDictionary } from '@/i18n/types'

const en: TranslationDictionary = {
  nav: {
    mainAriaLabel: 'Main navigation',
    goToDashboard: 'Go to dashboard',
  },
  sections: {
    dashboard: 'Dashboard',
    costs: 'Costs',
    iam: 'Iam Users',
  },
  homeContent: {
    dashboard: 'Welcome to Dashboard',
    costs: 'Costs Overview',
    iam: 'Iam Users',
  },
  dashboardCharts: {
    weeklyActivity: 'Weekly activity',
    usageTrend: 'Usage trend',
  },
  sidebar: {
    ariaLabel: 'Navigation sidebar',
    menuTitle: 'Menu',
    navAriaLabel: 'Main navigation',
    expandMenu: 'Expand menu',
    collapseMenu: 'Collapse menu',
    version: 'Version',
  },
  userMenu: {
    menuOf: '{{name}} menu',
    appearance: 'Appearance',
    themeAriaLabel: 'Dashboard theme',
    themeActive: 'Active: {{theme}}',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    languageAriaLabel: 'Dashboard language',
    guide: 'Guide — About this site',
    logout: 'Log out',
  },
  language: {
    es: 'Español',
    en: 'English',
  },
  guide: {
    metaTitle: 'Guide — About this site',
    eyebrow: 'Guide',
    title: 'About this site',
    description:
      'Dashboard guide. Content is filled in per section as the site grows.',
    backToDashboard: '← Back to dashboard',
    tocLabel: 'Sections',
    tocAriaLabel: 'Guide table of contents',
    sections: {
      general: {
        title: 'General',
        content:
          'Welcome to the dashboard. Here you will find a general overview of the site, its purpose, and how to navigate the different areas.\n\n(To be completed.)',
      },
      dashboard: {
        title: 'Dashboard',
        content:
          'The Dashboard section shows the main summary and key indicators.\n\n(To be completed.)',
      },
      costs: {
        title: 'Costs',
        content:
          'In Costs you can view and analyze cost information.\n\n(To be completed.)',
      },
      iam: {
        title: 'IAM Users',
        content:
          'IAM Users centralizes identity user management and visibility.\n\n(To be completed.)',
      },
    },
  },
  errors: {
    notFound: {
      title: 'Page not found',
      description:
        'The route you are looking for does not exist or was moved. Go back to the dashboard to continue.',
      backHome: 'Go to dashboard',
    },
    generic: {
      title: 'Something went wrong',
      description:
        'An unexpected error occurred. You can try again or return home.',
      retry: 'Try again',
      backHome: 'Go to dashboard',
    },
  },
}

export default en
