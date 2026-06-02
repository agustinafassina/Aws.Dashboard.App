'use client'

import { useMemo } from 'react'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import { DEFAULT_AWS_REGION } from '@/utils/awsDefaults'
import { formatSidebarBadge } from '@/utils/formatSidebarBadge'
import type {
  SectionKey,
  SidebarChildLabelKey,
  SidebarGroupLabelKey,
} from '@/i18n/types'

export type SidebarCountableKey = SidebarChildLabelKey | SidebarGroupLabelKey

export function useSidebarBadges() {
  const region = DEFAULT_AWS_REGION

  const iamKeysQuery = useIamAccessKeys()
  const iamUsersQuery = useIamUsersWithoutMfa()
  const inspectorEcrQuery = useInspectorVulnerabilities({
    region,
    resourceType: 'ecr',
  })
  const inspectorEc2Query = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
  })
  const ec2PortsQuery = useEc2OpenPorts(region)
  const rdsPortsQuery = useRdsOpenPorts(region)
  const s3Query = useS3PublicBuckets(region)

  const counts = useMemo<Record<SidebarCountableKey, number>>(
    () => ({
      iam:
        (iamUsersQuery.data?.usersWithoutMfa ?? 0) +
        (iamKeysQuery.data?.accessKeysNeedingRotation ?? 0) +
        (iamKeysQuery.data?.accessKeysNeverUsed ?? 0),
      iamUsers: iamUsersQuery.data?.usersWithoutMfa ?? 0,
      iamAccessKeys:
        (iamKeysQuery.data?.accessKeysNeedingRotation ?? 0) +
        (iamKeysQuery.data?.accessKeysNeverUsed ?? 0),
      dockerImages: inspectorEcrQuery.data?.totalFindings ?? 0,
      ec2Servers: inspectorEc2Query.data?.totalFindings ?? 0,
      rdsOpenPorts: rdsPortsQuery.data?.instancesWithPublicPorts ?? 0,
      ec2OpenPorts: ec2PortsQuery.data?.instancesWithPublicPorts ?? 0,
      s3PublicBuckets: s3Query.data?.publicBucketsCount ?? 0,
      vulnerabilities:
        (inspectorEcrQuery.data?.totalFindings ?? 0) +
        (inspectorEc2Query.data?.totalFindings ?? 0),
      security:
        (rdsPortsQuery.data?.instancesWithPublicPorts ?? 0) +
        (ec2PortsQuery.data?.instancesWithPublicPorts ?? 0) +
        (s3Query.data?.publicBucketsCount ?? 0),
    }),
    [
      iamKeysQuery.data,
      iamUsersQuery.data,
      inspectorEcrQuery.data,
      inspectorEc2Query.data,
      ec2PortsQuery.data,
      rdsPortsQuery.data,
      s3Query.data,
    ],
  )

  const getBadge = (key: SidebarCountableKey): string | number | undefined =>
    formatSidebarBadge(counts[key])

  const getSectionBadge = (_sectionKey: SectionKey) => undefined

  const isLoading =
    iamKeysQuery.isLoading ||
    iamUsersQuery.isLoading ||
    inspectorEcrQuery.isLoading ||
    inspectorEc2Query.isLoading ||
    ec2PortsQuery.isLoading ||
    rdsPortsQuery.isLoading ||
    s3Query.isLoading

  return { getBadge, getSectionBadge, counts, isLoading, region }
}
