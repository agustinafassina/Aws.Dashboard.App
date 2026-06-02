import type { Locale } from '@/context/LanguageContext'
import type { GuideSectionId } from '@/config/siteGuide'

export type SectionKey = 'dashboard' | 'costs'

export type SidebarGroupLabelKey = 'iam' | 'vulnerabilities' | 'security'
export type SidebarChildLabelKey =
  | 'iamUsers'
  | 'iamAccessKeys'
  | 'dockerImages'
  | 'ec2Servers'
  | 'rdsOpenPorts'
  | 'ec2OpenPorts'
  | 's3PublicBuckets'

export type DashboardScanModuleKey =
  | 'costs'
  | 'iamUsers'
  | 'iamAccessKeys'
  | 'inspectorEcr'
  | 'inspectorEc2'
  | 'ec2Ports'
  | 'rdsPorts'
  | 's3'

export type TranslationDictionary = {
  nav: {
    mainAriaLabel: string
    goToDashboard: string
    regionLabel: string
  }
  filters: {
    severityLabel: string
    severityOptions: Record<
      'all' | 'CRITICAL,HIGH' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
      string
    >
  }
  sections: Record<SectionKey, string>
  homeContent: Record<SectionKey, string>
  pageHeader: {
    lastScan: string
  }
  dashboardSummary: {
    regionHint: string
    regionTagLabel: string
    costTagLabel: string
    refreshingData: string
    costRangeHint: string
    monthSpend: string
    topProject: string
    keysRotation: string
    criticalHighFindings: string
    findingsHint: string
    rdsPublicPorts: string
    ec2PublicPorts: string
    s3PublicBuckets: string
    instancesHint: string
    topProjectsChart: string
    lastScanTitle: string
    lastScanModule: string
    lastScanAt: string
    viewSection: string
    noScan: string
    noData: string
    noSpendInRange: string
    loadError: string
    loading: string
    modules: Record<DashboardScanModuleKey, string>
  }
  sidebar: {
    ariaLabel: string
    menuTitle: string
    navAriaLabel: string
    expandMenu: string
    collapseMenu: string
    version: string
    items: Record<SidebarGroupLabelKey | SidebarChildLabelKey, string>
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
  export: {
    downloadPdf: string
  }
  table: {
    searchPlaceholder: string
    searchAriaLabel: string
    noSearchResults: string
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
