export type HomeViewKey =
  | 'dashboard'
  | 'costs'
  | 'iam-users'
  | 'iam-access-keys'
  | 'vuln-docker'
  | 'vuln-ec2'
  | 'vuln-rds-ports'
  | 'vuln-ec2-ports'
  | 'vuln-s3-public-buckets'

export function resolveHomeView(segments: string[]): HomeViewKey | null {
  if (segments.length === 0) return 'dashboard'

  const [first, second] = segments

  if (first === 'dashboard') return 'dashboard'
  if (first === 'costs') return 'costs'
  if (first === 'iam' && second === 'users') return 'iam-users'
  if (first === 'iam' && second === 'access-keys') return 'iam-access-keys'
  if (first === 'vulnerabilities' && second === 'docker-image') return 'vuln-docker'
  if (first === 'vulnerabilities' && second === 'ec2-servers') return 'vuln-ec2'
  if (first === 'security' && second === 'rds-open-ports') return 'vuln-rds-ports'
  if (first === 'security' && second === 'ec2-open-ports') return 'vuln-ec2-ports'
  if (first === 'security' && second === 's3-public-buckets')
    return 'vuln-s3-public-buckets'

  return null
}

export function isKnownHomePath(segments: string[]): boolean {
  return resolveHomeView(segments) !== null
}
