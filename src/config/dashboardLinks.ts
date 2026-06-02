import type { DashboardScanModuleKey } from '@/i18n/types'

export const DASHBOARD_SECTION_LINKS = {
  costs: '/home/costs',
  iamUsers: '/home/iam/users',
  iamAccessKeys: '/home/iam/access-keys',
  keysRotation: '/home/iam/access-keys',
  criticalFindings: '/home/vulnerabilities/ec2-servers',
  rdsPublicPorts: '/home/security/rds-open-ports',
  ec2PublicPorts: '/home/security/ec2-open-ports',
  s3PublicBuckets: '/home/security/s3-public-buckets',
} as const

export const DASHBOARD_SCAN_LINKS: Record<DashboardScanModuleKey, string> = {
  costs: '/home/costs',
  iamUsers: '/home/iam/users',
  iamAccessKeys: '/home/iam/access-keys',
  inspectorEcr: '/home/vulnerabilities/docker-image',
  inspectorEc2: '/home/vulnerabilities/ec2-servers',
  ec2Ports: '/home/security/ec2-open-ports',
  rdsPorts: '/home/security/rds-open-ports',
  s3: '/home/security/s3-public-buckets',
}
