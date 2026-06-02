import type { Locale } from '@/context/LanguageContext'
import type { GuideSectionId } from '@/config/siteGuide'

export type SectionKey = 'dashboard' | 'costs'

export type SidebarGroupLabelKey = 'iam' | 'vulnerabilities' | 'security' | 'audits'
export type SidebarChildLabelKey =
  | 'iamUsers'
  | 'iamAccessKeys'
  | 'dockerImages'
  | 'ec2Servers'
  | 'rdsOpenPorts'
  | 'ec2OpenPorts'
  | 's3PublicBuckets'
  | 'untaggedResources'
  | 'resourcesByProject'

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
  dashboardExport: {
    title: string
    groupAriaLabel: string
    downloadPdf: string
    downloadCsv: string
    disabledWhileLoading: string
    kpiSection: string
    topProjectsSection: string
    scansSection: string
    costRangeLabel: string
    summaryRegional: string
    summaryCosts: string
    columns: {
      metric: string
      value: string
      project: string
      amount: string
      module: string
      scannedAt: string
      region: string
      costRange: string
    }
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
  pdfReport: {
    brandTitle: string
    generatedAt: string
    region: string
    executiveSummary: string
    scopeAccount: string
    scopeCosts: string
  }
  table: {
    searchPlaceholder: string
    searchAriaLabel: string
    noSearchResults: string
  }
  audits: {
    untaggedResources: {
      title: string
      description: string
      requiredTagLabel: string
      regionLabel: string
      tableTitle: string
      emptyMessage: string
      stats: {
        scanned: string
        untagged: string
        untaggedHint: string
        region: string
      }
      columns: {
        type: string
        id: string
        name: string
        state: string
        recommendation: string
      }
    }
    resourcesByProject: {
      title: string
      description: string
      tagKeyLabel: string
      regionLabel: string
      projectInputLabel: string
      projectInputPlaceholder: string
      scanButton: string
      tableTitle: string
      emptyMessage: string
      stats: {
        scanned: string
        matching: string
        matchingHint: string
        region: string
      }
      columns: {
        type: string
        id: string
        name: string
        projectTag: string
        state: string
      }
    }
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
