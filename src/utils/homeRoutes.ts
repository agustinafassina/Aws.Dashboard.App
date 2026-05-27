export type HomeViewKey =
  | 'dashboard'
  | 'costs'
  | 'iam'
  | 'vuln-docker'
  | 'vuln-ec2'

export function resolveHomeView(segments: string[]): HomeViewKey | null {
  if (segments.length === 0) return 'dashboard'

  const [first, second] = segments

  if (first === 'dashboard') return 'dashboard'
  if (first === 'costs') return 'costs'
  if (first === 'iam') return 'iam'
  if (first === 'vulnerabilities' && second === 'docker-image') return 'vuln-docker'
  if (first === 'vulnerabilities' && second === 'ec2-servers') return 'vuln-ec2'

  return null
}

export function isKnownHomePath(segments: string[]): boolean {
  return resolveHomeView(segments) !== null
}
