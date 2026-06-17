export type HomeViewKey =
  | 'dashboard'
  | 'costs'
  | 'costs-analyze'
  | 'iam-users'
  | 'iam-access-keys'
  | 'vuln-docker'
  | 'vuln-ec2'
  | 'vuln-ec2-detail'
  | 'vuln-rds-ports'
  | 'vuln-ec2-ports'
  | 'vuln-s3-public-buckets'
  | 'security-s3-encryption-status'
  | 'security-lambda-public-functions'
  | 'security-acm-expiring-certificates'
  | 'security-elb-public-listeners'
  | 'security-ecr-repository-risks'
  | 'security-ec2-imdsv1-instances'
  | 'security-rds-unencrypted-instances'
  | 'security-rds-no-backups'
  | 'security-ec2-unused-security-groups'
  | 'security-ec2-unattached-volumes'
  | 'audits-untagged-resources'
  | 'audits-resources-by-project'

export function getEc2DetailInstanceId(segments: string[]): string | null {
  if (
    segments[0] === 'vulnerabilities' &&
    segments[1] === 'ec2-servers' &&
    segments[2] === 'detail' &&
    segments[3]
  ) {
    return decodeURIComponent(segments[3])
  }
  return null
}

export function resolveHomeView(segments: string[]): HomeViewKey | null {
  if (segments.length === 0) return 'dashboard'

  const [first, second] = segments

  if (getEc2DetailInstanceId(segments)) return 'vuln-ec2-detail'
  if (first === 'dashboard') return 'dashboard'
  if (first === 'costs' && second === 'analyze') return 'costs-analyze'
  if (first === 'costs') return 'costs'
  if (first === 'iam' && second === 'users') return 'iam-users'
  if (first === 'iam' && second === 'access-keys') return 'iam-access-keys'
  if (first === 'vulnerabilities' && second === 'docker-image') return 'vuln-docker'
  if (first === 'vulnerabilities' && second === 'ec2-servers') return 'vuln-ec2'
  if (first === 'security' && second === 'rds-open-ports') return 'vuln-rds-ports'
  if (first === 'security' && second === 'ec2-open-ports') return 'vuln-ec2-ports'
  if (first === 'security' && second === 's3-public-buckets')
    return 'vuln-s3-public-buckets'
  if (first === 'security' && second === 's3-encryption-status')
    return 'security-s3-encryption-status'
  if (first === 'security' && second === 'lambda-public-functions')
    return 'security-lambda-public-functions'
  if (first === 'security' && second === 'acm-expiring-certificates')
    return 'security-acm-expiring-certificates'
  if (first === 'security' && second === 'elb-public-listeners')
    return 'security-elb-public-listeners'
  if (first === 'security' && second === 'ecr-repository-risks')
    return 'security-ecr-repository-risks'
  if (first === 'security' && second === 'ec2-imdsv1-instances')
    return 'security-ec2-imdsv1-instances'
  if (first === 'security' && second === 'rds-unencrypted-instances')
    return 'security-rds-unencrypted-instances'
  if (first === 'security' && second === 'rds-no-backups')
    return 'security-rds-no-backups'
  if (first === 'security' && second === 'ec2-unused-security-groups')
    return 'security-ec2-unused-security-groups'
  if (first === 'security' && second === 'ec2-unattached-volumes')
    return 'security-ec2-unattached-volumes'
  if (first === 'audits' && second === 'untagged-resources')
    return 'audits-untagged-resources'
  if (first === 'audits' && second === 'resources-by-project')
    return 'audits-resources-by-project'

  return null
}

export function isKnownHomePath(segments: string[]): boolean {
  return resolveHomeView(segments) !== null
}
