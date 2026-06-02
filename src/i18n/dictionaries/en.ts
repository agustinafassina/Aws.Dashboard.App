import type { TranslationDictionary } from '@/i18n/types'

const en: TranslationDictionary = {
  nav: {
    mainAriaLabel: 'Main navigation',
    goToDashboard: 'Go to dashboard',
    regionLabel: 'Region',
  },
  filters: {
    severityLabel: 'Severity',
    severityOptions: {
      all: 'All',
      'CRITICAL,HIGH': 'Critical + High',
      CRITICAL: 'Critical',
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
    },
  },
  sections: {
    dashboard: 'Dashboard',
    costs: 'Costs',
  },
  homeContent: {
    dashboard: 'Welcome to Dashboard',
    costs: 'Costs Overview',
  },
  pageHeader: {
    lastScan: 'Last scan',
  },
  dashboardSummary: {
    regionHint: 'Regional scans use {{region}}',
    regionTagLabel: 'Regional scans',
    costTagLabel: 'Costs',
    refreshingData: 'Refreshing data for this region…',
    costRangeHint: 'Costs: {{from}} → {{to}}',
    monthSpend: 'Month spend',
    topProject: 'Top project',
    keysRotation: 'Keys need rotation',
    criticalHighFindings: 'Critical / high findings',
    findingsHint: 'ECR + EC2 · {{region}}',
    rdsPublicPorts: 'RDS public exposure',
    ec2PublicPorts: 'EC2 public exposure',
    s3PublicBuckets: 'Public S3 buckets',
    instancesHint: 'Region {{region}}',
    topProjectsChart: 'Top projects (month)',
    lastScanTitle: 'Last scan',
    lastScanModule: 'Module',
    lastScanAt: 'Scanned at',
    viewSection: 'View',
    noScan: '—',
    noData: '—',
    noSpendInRange: 'No spend in range',
    loadError: 'Failed to load',
    loading: '…',
    modules: {
      costs: 'Costs',
      iamUsers: 'IAM users (MFA)',
      iamAccessKeys: 'IAM access keys',
      inspectorEcr: 'ECR vulnerabilities',
      inspectorEc2: 'EC2 vulnerabilities',
      ec2Ports: 'EC2 open ports',
      rdsPorts: 'RDS open ports',
      s3: 'S3 public buckets',
    },
  },
  dashboardExport: {
    title: 'Executive report — Dashboard',
    groupAriaLabel: 'Export dashboard report',
    downloadPdf: 'PDF report',
    downloadCsv: 'CSV report',
    disabledWhileLoading: 'Wait until loading finishes',
    kpiSection: 'Key indicators',
    topProjectsSection: 'Top projects (costs)',
    scansSection: 'Last scan by module',
    costRangeLabel: 'Cost range',
    summaryRegional: 'Regional posture summary for',
    summaryCosts: 'Cost period:',
    columns: {
      metric: 'Metric',
      value: 'Value',
      project: 'Project',
      amount: 'Amount',
      module: 'Module',
      scannedAt: 'Scanned at',
      region: 'Region',
      costRange: 'Cost range',
    },
  },
  sidebar: {
    ariaLabel: 'Navigation sidebar',
    menuTitle: 'Menu',
    navAriaLabel: 'Main navigation',
    expandMenu: 'Expand menu',
    collapseMenu: 'Collapse menu',
    version: 'Version',
    items: {
      iam: 'IAM',
      iamUsers: 'Users',
      iamAccessKeys: 'Access keys',
      vulnerabilities: 'Vulnerabilities',
      security: 'Security',
      dockerImages: 'Docker images',
      ec2Servers: 'EC2 servers',
      rdsOpenPorts: 'RDS open ports',
      ec2OpenPorts: 'EC2 open ports',
      s3PublicBuckets: 'S3 public buckets',
      audits: 'Audits',
      untaggedResources: 'Missing Project tag',
      resourcesByProject: 'Resources by project',
    },
  },
  audits: {
    untaggedResources: {
      title: 'Untagged resources',
      description:
        'EC2, RDS, and S3 in the selected region missing the project tag used for cost allocation.',
      requiredTagLabel: 'Required tag',
      regionLabel: 'Region',
      tableTitle: 'Untagged resources',
      emptyMessage: 'All scanned resources have the required tag.',
      stats: {
        scanned: 'Resources scanned',
        untagged: 'Untagged',
        untaggedHint: 'Missing project tag',
        region: 'Region',
      },
      columns: {
        type: 'Type',
        id: 'ID',
        name: 'Name',
        state: 'State',
        recommendation: 'Recommendation',
      },
    },
    resourcesByProject: {
      title: 'Resources by project tag',
      description:
        'EC2, RDS, and S3 in the selected region that match the given project tag value.',
      tagKeyLabel: 'Tag key',
      regionLabel: 'Region',
      projectInputLabel: 'Project',
      projectInputPlaceholder: 'e.g. my-app',
      scanButton: 'Search',
      tableTitle: 'Matching resources',
      emptyMessage: 'No resources found with this project tag in the region.',
      stats: {
        scanned: 'Resources scanned',
        matching: 'Matching',
        matchingHint: 'Resources with this project tag',
        region: 'Region',
      },
      columns: {
        type: 'Type',
        id: 'ID',
        name: 'Name',
        projectTag: 'Project tag',
        state: 'State',
      },
    },
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
  export: {
    downloadPdf: 'Download PDF',
  },
  pdfReport: {
    brandTitle: 'AWS Dashboard',
    generatedAt: 'Generated',
    region: 'Region',
    executiveSummary: 'Executive summary',
    scopeAccount: 'AWS account (all regions)',
    scopeCosts: 'Costs (multi-region)',
  },
  table: {
    searchPlaceholder: 'Search…',
    searchAriaLabel: 'Search table',
    noSearchResults: 'No results match your search.',
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
