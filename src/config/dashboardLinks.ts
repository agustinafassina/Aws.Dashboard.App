import { buildHomeHref, type HomeUrlParams } from '@/utils/urlSearchParams'

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

export function dashboardSectionHref(
  path: string,
  params: HomeUrlParams,
): string {
  return buildHomeHref(path, params)
}
