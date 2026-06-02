import type { TranslationDictionary } from '@/i18n/types'

const es: TranslationDictionary = {
  nav: {
    mainAriaLabel: 'Navegación principal',
    goToDashboard: 'Ir al dashboard',
    regionLabel: 'Región',
  },
  filters: {
    severityLabel: 'Severidad',
    severityOptions: {
      all: 'Todas',
      'CRITICAL,HIGH': 'Crítica + Alta',
      CRITICAL: 'Crítica',
      HIGH: 'Alta',
      MEDIUM: 'Media',
      LOW: 'Baja',
    },
  },
  sections: {
    dashboard: 'Dashboard',
    costs: 'Costos',
  },
  homeContent: {
    dashboard: 'Bienvenido al Dashboard',
    costs: 'Resumen de costos',
  },
  pageHeader: {
    lastScan: 'Último escaneo',
  },
  dashboardSummary: {
    regionHint: 'Escaneos regionales en {{region}}',
    regionTagLabel: 'Escaneos regionales',
    costTagLabel: 'Costos',
    refreshingData: 'Actualizando datos de la región…',
    costRangeHint: 'Costos: {{from}} → {{to}}',
    monthSpend: 'Gasto del mes',
    topProject: 'Proyecto principal',
    keysRotation: 'Keys a rotar',
    criticalHighFindings: 'Findings críticos / altos',
    findingsHint: 'ECR + EC2 · {{region}}',
    rdsPublicPorts: 'RDS con exposición',
    ec2PublicPorts: 'EC2 con exposición',
    s3PublicBuckets: 'Buckets S3 públicos',
    instancesHint: 'Región {{region}}',
    topProjectsChart: 'Top proyectos (mes)',
    lastScanTitle: 'Último escaneo',
    lastScanModule: 'Módulo',
    lastScanAt: 'Escaneado',
    viewSection: 'Ver',
    noScan: '—',
    noData: '—',
    noSpendInRange: 'Sin gasto en el rango',
    loadError: 'Error al cargar',
    loading: '…',
    modules: {
      costs: 'Costos',
      iamUsers: 'IAM users (MFA)',
      iamAccessKeys: 'IAM access keys',
      inspectorEcr: 'Vulnerabilidades ECR',
      inspectorEc2: 'Vulnerabilidades EC2',
      ec2Ports: 'EC2 open ports',
      rdsPorts: 'RDS open ports',
      s3: 'S3 public buckets',
    },
  },
  sidebar: {
    ariaLabel: 'Menú lateral de navegación',
    menuTitle: 'Menú',
    navAriaLabel: 'Navegación principal',
    expandMenu: 'Expandir menú',
    collapseMenu: 'Colapsar menú',
    version: 'Versión',
    items: {
      iam: 'IAM',
      iamUsers: 'Users',
      iamAccessKeys: 'Access keys',
      vulnerabilities: 'Vulnerabilidades',
      security: 'Seguridad',
      dockerImages: 'Imágenes Docker',
      ec2Servers: 'Servidores EC2',
      rdsOpenPorts: 'RDS open ports',
      ec2OpenPorts: 'EC2 open ports',
      s3PublicBuckets: 'Buckets públicos S3',
    },
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
  export: {
    downloadPdf: 'Descargar PDF',
  },
  table: {
    searchPlaceholder: 'Buscar…',
    searchAriaLabel: 'Buscar en la tabla',
    noSearchResults: 'No hay resultados para tu búsqueda.',
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
