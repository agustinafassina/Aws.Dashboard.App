import { AWS_REGIONS, DEFAULT_AWS_REGION } from '@/utils/awsDefaults'

export function parseAwsRegion(value: string | null | undefined): string {
  if (!value) return DEFAULT_AWS_REGION
  const normalized = value.trim().toLowerCase()
  const match = AWS_REGIONS.find((r) => r === normalized)
  return match ?? DEFAULT_AWS_REGION
}
