import type { TranslationDictionary } from '@/i18n/types'

const es: TranslationDictionary = {
  nav: {
    mainAriaLabel: 'Navegación principal',
    goToDashboard: 'Ir al dashboard',
  },
  sections: {
    dashboard: 'Dashboard',
    costs: 'Costos',
    iam: 'Usuarios Iam',
  },
  homeContent: {
    dashboard: 'Bienvenido al Dashboard',
    costs: 'Resumen de costos',
    iam: 'Usuarios Iam',
  },
  dashboardCharts: {
    weeklyActivity: 'Actividad semanal',
    usageTrend: 'Tendencia de uso',
  },
  sidebar: {
    ariaLabel: 'Menú lateral de navegación',
    menuTitle: 'Menú',
    navAriaLabel: 'Navegación principal',
    expandMenu: 'Expandir menú',
    collapseMenu: 'Colapsar menú',
    version: 'Versión',
  },
  userMenu: {
    menuOf: 'Menú de {{name}}',
    appearance: 'Apariencia',
    themeAriaLabel: 'Tema del dashboard',
    themeActive: 'Activo: {{theme}}',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    language: 'Idioma',
    languageAriaLabel: 'Idioma del dashboard',
    guide: 'Guía — About this site',
    logout: 'Cerrar sesión',
  },
  language: {
    es: 'Español',
    en: 'English',
  },
  guide: {
    metaTitle: 'Guía — Acerca del sitio',
    eyebrow: 'Guía',
    title: 'Acerca del sitio',
    description:
      'Guía del dashboard. El contenido se completa por sección a medida que el sitio crece.',
    backToDashboard: '← Volver al dashboard',
    tocLabel: 'Secciones',
    tocAriaLabel: 'Índice de la guía',
    sections: {
      general: {
        title: 'General',
        content:
          'Bienvenido al dashboard. Aquí encontrarás una descripción general del sitio, su propósito y cómo navegar por las distintas áreas.\n\n(Pendiente de completar.)',
      },
      dashboard: {
        title: 'Dashboard',
        content:
          'La sección Dashboard muestra el resumen principal y los indicadores clave.\n\n(Pendiente de completar.)',
      },
      costs: {
        title: 'Costos',
        content:
          'En Costos podrás consultar y analizar la información de costos.\n\n(Pendiente de completar.)',
      },
      iam: {
        title: 'Usuarios Iam',
        content:
          'Usuarios Iam centraliza la gestión y visualización de usuarios de identidad.\n\n(Pendiente de completar.)',
      },
    },
  },
  errors: {
    notFound: {
      title: 'Página no encontrada',
      description:
        'La ruta que buscás no existe o fue movida. Volvé al dashboard para continuar.',
      backHome: 'Ir al dashboard',
    },
    generic: {
      title: 'Algo salió mal',
      description:
        'Ocurrió un error inesperado. Podés reintentar o volver al inicio.',
      retry: 'Reintentar',
      backHome: 'Ir al dashboard',
    },
  },
}

export default es
